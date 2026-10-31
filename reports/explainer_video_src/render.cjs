const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const root = __dirname;
const args = process.argv.slice(2);
const mode = args[0] || 'stills';
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(f); res.writeHead(200, { 'Content-Type': ext === '.js' ? 'text/javascript' : ext === '.html' ? 'text/html' : 'application/octet-stream' }); res.end(d); });
});
server.listen(0, async () => {
  const port = server.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const dpr = parseFloat(process.env.DPR || '1.5');
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: dpr });
  page.on('console', m => console.log('PAGE', m.type(), m.text()));
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.goto(`http://localhost:${port}/index.html`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
  const total = await page.evaluate(() => window.TOTAL);
  console.log('TOTAL', total);
  if (mode === 'stills') {
    const times = (args[1] || '2').split(',').map(Number);
    fs.mkdirSync(path.join(root, 'stills'), { recursive: true });
    for (const t of times) {
      const t0 = Date.now();
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(root, 'stills', `t${String(t).replace('.', '_')}.png`) });
      console.log('still', t, Date.now() - t0, 'ms');
    }
  } else {
    const fps = 30; const start = parseFloat(args[1] || '0'); const end = Math.min(parseFloat(args[2] || String(total)), total);
    const out = args[3] || 'out.mp4';
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n0 = Math.round(start * fps), n1 = Math.round(end * fps);
    const T = Date.now();
    for (let i = n0; i < n1; i++) {
      await page.evaluate(t => window.renderAt(t), i / fps);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((i - n0) % 60 === 0) console.log(`frame ${i}/${n1} ${((Date.now() - T) / (i - n0 + 1)).toFixed(0)} ms/frame`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('done', out, ((Date.now() - T) / 1000).toFixed(1), 's');
  }
  await browser.close(); server.close();
});
