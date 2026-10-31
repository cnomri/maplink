import * as THREE from 'three';

// =====================================================================
//  Previs-first AI video — explainer, rendered deterministically.
//  window.renderAt(t) draws the frame at time t (seconds).
// =====================================================================
const W = 1280, H = 720, DPR = window.devicePixelRatio || 1;
const PI = Math.PI;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const backOut = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const BGCSS = '#0b0d10';

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(DPR);
renderer.setSize(W, H, false);
renderer.autoClear = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const ov = document.getElementById('ov');
ov.width = W * DPR; ov.height = H * DPR;
const ctx = ov.getContext('2d');

// ---------------------------------------------------------------- textures
function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function woodTex(seed, base, planks) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d'); const r = rng(seed);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  const rows = planks ? 8 : 1;
  for (let i = 0; i < rows; i++) {
    const y0 = i * 512 / rows;
    let x = -r() * 200;
    while (x < 512) {
      const len = 160 + r() * 220; const l = 0.82 + r() * 0.3;
      g.fillStyle = `rgba(${l > 1 ? 255 : 0},${l > 1 ? 230 : 0},${l > 1 ? 200 : 0},${Math.abs(l - 1) * 0.35})`;
      g.fillRect(x, y0, len, 512 / rows);
      for (let k = 0; k < 9; k++) {
        g.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.08})`; g.lineWidth = 1 + r() * 1.5;
        const yy = y0 + r() * 512 / rows; g.beginPath(); g.moveTo(x, yy);
        g.bezierCurveTo(x + len * .3, yy + (r() - .5) * 8, x + len * .7, yy + (r() - .5) * 8, x + len, yy + (r() - .5) * 4); g.stroke();
      }
      if (planks) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x + len - 2, y0, 2, 512 / rows); }
      x += len;
    }
    if (planks) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, y0, 512, 2); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
}
const floorTex = woodTex(7, '#5a4030', true); floorTex.repeat.set(3, 3.5);
const tableTex = woodTex(11, '#6b4428', false); tableTex.repeat.set(1, 1);

// ---------------------------------------------------------------- materials
const M = {};
const lam = c => new THREE.MeshLambertMaterial({ color: c });
const bas = c => new THREE.MeshBasicMaterial({ color: c });
const std = (c, r = .7, m = 0, ex = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...ex });
function defKind(kind, proxy, editor, seg, styled) { M[kind] = { proxy: lam(proxy), editor: lam(editor), seg: bas(seg), styled }; }

defKind('floor', 0x5d6169, 0x252a33, 0x26286a, std(0xffffff, .78, 0, { map: floorTex }));
defKind('wall', 0x50545c, 0x2c323d, 0x1d5640, std(0x2c3a37, .95));
defKind('window', 0x6a6e76, 0x39404d, 0x1d5640, std(0x000000, 1, 0, { emissive: 0x9cc0ff, emissiveIntensity: .9 }));
defKind('blinds', 0x45494f, 0x2a303a, 0x1d5640, std(0x101215, .8));
defKind('board', 0x666a72, 0x384050, 0x5e548e, std(0x7a5634, .95));
defKind('paper', 0x878b92, 0x4a5262, 0x5e548e, std(0xd8d0bc, .9));
defKind('photo', 0x74787f, 0x4a5262, 0x5e548e, std(0x8b95a3, .5));
defKind('string', 0x8a8e95, 0x4a5262, 0x5e548e, std(0xb3261e, .6));
defKind('table', 0x979ba3, 0x535b69, 0xf4a261, std(0xffffff, .5, 0, { map: tableTex }));
defKind('chair', 0x777b83, 0x464d5a, 0x8d99ae, std(0x1c1e22, .55, .35));
defKind('folder', 0xa6aab1, 0x6a7384, 0xc77dff, std(0xc4a061, .85));
defKind('cup', 0xb0b4bb, 0x6a7384, 0xc77dff, std(0xe9e6df, .35));
defKind('lamp', 0x898d94, 0x7b8392, 0xffd166, std(0x1f4a33, .35, .55, { side: THREE.DoubleSide }));
defKind('bulb', 0xe6e6e6, 0xd6d6d6, 0xffd166, std(0x000000, 1, 0, { emissive: 0xffe2a8, emissiveIntensity: 8 }));
defKind('cord', 0x55595f, 0x55595f, 0xffd166, std(0x111111, .6));
for (const [id, seg, edSkin, edCloth, edPants, skin, cloth, pants] of [
  ['A', 0xe63946, 0xf6b37a, 0xe08a45, 0xa8622c, 0xc99474, 0xa8845b, 0x3a3631],
  ['B', 0x48cae4, 0x8cc2f4, 0x4a8fd8, 0x2f629e, 0x9a6650, 0x3a5580, 0x2a3242]]) {
  defKind('skin' + id, 0xd3d6db, edSkin, seg, std(skin, .62));
  defKind('cloth' + id, 0xc2c5cb, edCloth, seg, std(cloth, .82));
  defKind('pants' + id, 0xa9acb3, edPants, seg, std(pants, .85));
  defKind('shoe' + id, 0x8c9097, 0x3a3f48, seg, std(0x121212, .4, .1));
  defKind('hat' + id, 0xb4b7bd, edPants, seg, std(0x2a2521, .8));
}
defKind('gizmo', 0xffffff, 0xf2f4f7, 0xffffff, std(0xffffff));
defKind('lens', 0x333333, 0xff5a5f, 0xffffff, std(0x333333));

const depthMat = new THREE.ShaderMaterial({
  uniforms: { near: { value: 1.2 }, far: { value: 6.0 } },
  vertexShader: `varying float vz; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vz = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `uniform float near; uniform float far; varying float vz;
    void main(){ float d = clamp((vz-near)/(far-near),0.0,1.0); float v = pow(1.0-d,1.35); gl_FragColor = vec4(vec3(v),1.0); }`
});
const normalMat = new THREE.MeshNormalMaterial();

// ---------------------------------------------------------------- scene
const scene = new THREE.Scene();
function mk(geo, kind, cast = true, recv = true) {
  const m = new THREE.Mesh(geo, M[kind].proxy); m.userData.kind = kind; m.castShadow = cast; m.receiveShadow = recv; return m;
}

// room
const room = new THREE.Group(); scene.add(room);
{
  const floor = mk(new THREE.PlaneGeometry(5.2, 6.4), 'floor', false, true); floor.rotation.x = -PI / 2; floor.position.set(0, 0, 1.0); room.add(floor);
  const back = mk(new THREE.PlaneGeometry(5.2, 3.2), 'wall', false, true); back.position.set(0, 1.6, -2.2); room.add(back);
  const left = mk(new THREE.PlaneGeometry(6.4, 3.2), 'wall', false, true); left.rotation.y = PI / 2; left.position.set(-2.6, 1.6, 1.0); room.add(left);
  const right = mk(new THREE.PlaneGeometry(6.4, 3.2), 'wall', false, true); right.rotation.y = -PI / 2; right.position.set(2.6, 1.6, 1.0); room.add(right);
  const win = mk(new THREE.PlaneGeometry(1.3, 1.0), 'window', false, false); win.position.set(-1.05, 1.7, -2.195); room.add(win);
  for (let i = 0; i < 9; i++) { const b = mk(new THREE.BoxGeometry(1.34, .045, .02), 'blinds', false, false); b.position.set(-1.05, 1.24 + i * .115, -2.18); room.add(b); }
  const board = mk(new THREE.PlaneGeometry(1.3, .85), 'board', false, true); board.rotation.y = -PI / 2; board.position.set(2.595, 1.55, -.35); room.add(board);
  const r = rng(3);
  for (let i = 0; i < 7; i++) {
    const k = i % 3 === 0 ? 'photo' : 'paper';
    const p = mk(new THREE.PlaneGeometry(.16 + r() * .08, .2 + r() * .06), k, false, true);
    p.rotation.y = -PI / 2; p.rotation.x = (r() - .5) * .25; p.position.set(2.588, 1.3 + r() * .5, -.85 + i * .16); room.add(p);
  }
}

// table + props
const tableG = new THREE.Group(); scene.add(tableG);
{
  const top = mk(new THREE.BoxGeometry(1.6, .05, .9), 'table'); top.position.y = .725; tableG.add(top);
  for (const [x, z] of [[-.72, -.38], [.72, -.38], [-.72, .38], [.72, .38]]) { const l = mk(new THREE.BoxGeometry(.06, .7, .06), 'table'); l.position.set(x, .35, z); tableG.add(l); }
  const folder = mk(new THREE.BoxGeometry(.32, .015, .24), 'folder'); folder.position.set(-.12, .758, .14); folder.rotation.y = .22; tableG.add(folder);
  const photo = mk(new THREE.BoxGeometry(.13, .004, .17), 'paper'); photo.position.set(.16, .753, .02); photo.rotation.y = -.35; tableG.add(photo);
  const cup = mk(new THREE.CylinderGeometry(.04, .034, .095, 18), 'cup'); cup.position.set(.38, .797, -.2); tableG.add(cup);
}

// lamp
const lampG = new THREE.Group(); scene.add(lampG);
{
  const cord = mk(new THREE.CylinderGeometry(.008, .008, .8, 6), 'cord', false, false); cord.position.y = 2.55; lampG.add(cord);
  const shade = mk(new THREE.ConeGeometry(.24, .2, 28, 1, true), 'lamp', true, false); shade.position.y = 2.06; lampG.add(shade);
  const bulb = mk(new THREE.SphereGeometry(.05, 16, 12), 'bulb', false, false); bulb.position.y = 1.99; lampG.add(bulb);
}

// people
function makePerson(id) {
  const P = { id, sh: {}, el: {}, hip: {}, knee: {}, hand: {}, foot: {} };
  const root = new THREE.Group(); P.root = root; scene.add(root);
  const skin = 'skin' + id, cloth = 'cloth' + id, pants = 'pants' + id;
  const chair = new THREE.Group(); root.add(chair);
  const seat = mk(new THREE.BoxGeometry(.46, .05, .46), 'chair'); seat.position.set(0, .43, .02); chair.add(seat);
  const back = mk(new THREE.BoxGeometry(.46, .42, .04), 'chair'); back.position.set(0, .73, -.23); chair.add(back);
  for (const [x, z] of [[-.2, -.2], [.2, -.2], [-.2, .23], [.2, .23]]) { const l = mk(new THREE.CylinderGeometry(.018, .018, .43, 8), 'chair'); l.position.set(x, .215, z); chair.add(l); }
  const pelvis = mk(new THREE.BoxGeometry(.34, .14, .26), pants); pelvis.position.set(0, .52, 0); root.add(pelvis);
  P.pelv = new THREE.Object3D(); P.pelv.position.set(0, .52, 0); root.add(P.pelv);
  const spine = new THREE.Group(); spine.position.set(0, .56, 0); root.add(spine); P.spine = spine;
  const torso = mk(new THREE.CapsuleGeometry(.16, .26, 6, 16), cloth); torso.position.y = .24; torso.scale.set(1.15, 1, .78); spine.add(torso);
  const neck = mk(new THREE.CylinderGeometry(.045, .05, .1, 12), skin); neck.position.y = .52; spine.add(neck);
  P.neck = new THREE.Object3D(); P.neck.position.set(0, .47, 0); spine.add(P.neck);
  const headG = new THREE.Group(); headG.position.y = .63; spine.add(headG); P.head = headG;
  const head = mk(new THREE.SphereGeometry(.105, 24, 18), skin); head.scale.set(.92, 1.08, 1); headG.add(head);
  const nose = mk(new THREE.ConeGeometry(.022, .06, 10), skin); nose.rotation.x = PI / 2; nose.position.set(0, -.01, .105); headG.add(nose);
  if (id === 'A') {
    const brim = mk(new THREE.CylinderGeometry(.175, .175, .014, 28), 'hatA'); brim.position.y = .075; headG.add(brim);
    const crown = mk(new THREE.CylinderGeometry(.095, .11, .12, 24), 'hatA'); crown.position.y = .14; headG.add(crown);
  }
  for (const side of ['L', 'R']) {
    const sx = side === 'L' ? 1 : -1;
    const sh = new THREE.Group(); sh.position.set(sx * .21, .43, 0); spine.add(sh); P.sh[side] = sh;
    const ua = mk(new THREE.CapsuleGeometry(.05, .2, 4, 12), cloth); ua.position.y = -.15; sh.add(ua);
    const el = new THREE.Group(); el.position.y = -.3; sh.add(el); P.el[side] = el;
    const fa = mk(new THREE.CapsuleGeometry(.045, .19, 4, 12), cloth); fa.position.y = -.14; el.add(fa);
    const hand = mk(new THREE.SphereGeometry(.05, 14, 10), skin); hand.position.y = -.3; el.add(hand); P.hand[side] = hand;
    const hip = new THREE.Group(); hip.position.set(sx * .1, .5, .02); root.add(hip); P.hip[side] = hip;
    const th = mk(new THREE.CapsuleGeometry(.07, .29, 4, 12), pants); th.position.y = -.21; hip.add(th);
    const kn = new THREE.Group(); kn.position.y = -.43; hip.add(kn); P.knee[side] = kn;
    const sn = mk(new THREE.CapsuleGeometry(.058, .3, 4, 12), pants); sn.position.y = -.2; kn.add(sn);
    const ft = mk(new THREE.BoxGeometry(.1, .07, .24), 'shoe' + id); ft.position.set(0, -.45, .06); kn.add(ft); P.foot[side] = ft;
    hip.rotation.x = -PI / 2; kn.rotation.x = PI / 2;
  }
  return P;
}
const PEOPLE = { A: makePerson('A'), B: makePerson('B') };

function poseP(P, s) {
  P.spine.rotation.x = s.lean;
  P.head.rotation.x = -s.lean * .7 + (s.nod || 0);
  for (const side of ['L', 'R']) {
    const sx = side === 'L' ? 1 : -1;
    const k = side === 'L' ? (s.raise || 0) : 0;
    P.sh[side].rotation.set(lerp(-.98, -2.55, k), 0, lerp(-sx * .12, -sx * .04, k));
    P.el[side].rotation.set(lerp(-.62, -.45, k), 0, 0);
  }
}

// camera gizmo (editor only)
const camGizmo = new THREE.Group(); scene.add(camGizmo);
{
  const body = mk(new THREE.BoxGeometry(.2, .14, .26), 'gizmo', false, false); camGizmo.add(body);
  const lens = mk(new THREE.CylinderGeometry(.055, .065, .1, 18), 'lens', false, false); lens.rotation.x = PI / 2; lens.position.z = .18; camGizmo.add(lens);
  const reel = mk(new THREE.CylinderGeometry(.06, .06, .03, 18), 'gizmo', false, false); reel.rotation.z = PI / 2; reel.position.set(0, .13, -.04); camGizmo.add(reel);
}
const grid = new THREE.GridHelper(8, 32, 0x3a4352, 0x262c36); grid.position.y = .003; scene.add(grid);

// lights
const lightsProxy = new THREE.Group(); scene.add(lightsProxy);
{
  lightsProxy.add(new THREE.HemisphereLight(0xffffff, 0x4a4e56, 1.5));
  const d = new THREE.DirectionalLight(0xffffff, 1.7); d.position.set(2.2, 5, 3.2); d.castShadow = true;
  d.shadow.mapSize.set(1024, 1024); Object.assign(d.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: .5, far: 12 });
  d.shadow.bias = -.0008; lightsProxy.add(d); lightsProxy.add(d.target);
}
const lightsStyled = new THREE.Group(); scene.add(lightsStyled);
{
  const spot = new THREE.SpotLight(0xffc98a, 34, 0, 1.08, .55, 2); spot.position.set(0, 1.96, 0); spot.target.position.set(0, 0, 0);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.camera.near = .3; spot.shadow.camera.far = 5; spot.shadow.bias = -.0006;
  lightsStyled.add(spot); lightsStyled.add(spot.target);
  lightsStyled.add(new THREE.HemisphereLight(0x6a7fa0, 0x2a1d14, .9));
  const rim = new THREE.DirectionalLight(0x86a8ff, 1.6); rim.position.set(-1.2, 2.2, -3.5); lightsStyled.add(rim); lightsStyled.add(rim.target);
  const fill = new THREE.PointLight(0xffa868, 7, 0, 2); fill.position.set(.6, 1.5, 2.6); lightsStyled.add(fill);
}
const fogStyled = new THREE.FogExp2(0x0a0c10, .05);
const BG = { proxy: new THREE.Color(0x2e3239), editor: new THREE.Color(0x14171d), styled: new THREE.Color(0x07080a), depth: new THREE.Color(0x000000), normal: new THREE.Color(0x0b0b16), seg: new THREE.Color(0x000000) };

function setMode(mode) {
  const m = (mode === 'depth' || mode === 'normal') ? 'proxy' : mode;
  scene.traverse(o => { if (o.isMesh && o.userData.kind) o.material = M[o.userData.kind][m]; });
  scene.overrideMaterial = mode === 'depth' ? depthMat : mode === 'normal' ? normalMat : null;
  grid.visible = mode === 'editor';
  camGizmo.visible = mode === 'editor' && camGizmo.userData.on;
  lightsProxy.visible = mode === 'proxy' || mode === 'editor';
  lightsStyled.visible = mode === 'styled';
  scene.fog = mode === 'styled' ? fogStyled : null;
  scene.background = BG[mode];
}

// ---------------------------------------------------------------- post / composite
const postScene = new THREE.Scene(); const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: {
    tA: { value: null }, tB: { value: null }, useA: { value: 0 }, mixB: { value: 1 }, noiseAmt: { value: 0 }, blur: { value: 0 },
    seed: { value: 0 }, vign: { value: .7 }, grain: { value: .035 }, exposure: { value: 1.0 }, dim: { value: 1 }, res: { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tA; uniform sampler2D tB;
    uniform float useA, mixB, noiseAmt, blur, seed, vign, grain, exposure, dim;
    uniform vec2 res;
    varying vec2 vUv;
    float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031 + seed * .1373); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    vec3 aces(vec3 v){
      v *= exposure / 0.6;
      const mat3 I = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
      const mat3 O = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
      v = I * v; vec3 a = v * (v + 0.0245786) - 0.000090537; vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return clamp(O * (a / b), 0.0, 1.0);
    }
    vec3 samp(sampler2D t, vec2 uv){
      if (blur < 0.0004) return texture2D(t, uv).rgb;
      vec3 c = vec3(0.0); float ws = 0.0;
      for (int i = -2; i <= 2; i++) { for (int j = -2; j <= 2; j++) {
        float w = exp(-float(i*i + j*j) / 3.0);
        c += texture2D(t, uv + vec2(float(i), float(j)) * blur * vec2(res.y / res.x, 1.0)).rgb * w; ws += w; } }
      return c / ws;
    }
    void main(){
      vec3 c = aces(samp(tB, vUv));
      if (useA > 0.5) { vec3 a = samp(tA, vUv); c = mix(a, c, mixB); }
      c = clamp(c, 0.0, 1.0);
      c = mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
      vec2 px = floor(vUv * res);
      vec3 n = vec3(hash(px), hash(px + 19.19), hash(px + 47.3));
      c = mix(c, n, noiseAmt);
      vec2 d = vUv - 0.5; c *= 1.0 - vign * dot(d, d) * 1.6;
      c += (hash(px * 1.7 + 3.0) - 0.5) * grain;
      c *= dim;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`,
  depthTest: false, depthWrite: false, toneMapped: false
});
{ const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat); q.frustumCulled = false; postScene.add(q); }
const rtCache = {};
function getRT(key, w, h) {
  const k = key + w + 'x' + h;
  if (!rtCache[k]) rtCache[k] = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 });
  return rtCache[k];
}
function glRect(rect) {
  const y = H - rect.y - rect.h;
  renderer.setRenderTarget(null);
  renderer.setViewport(rect.x, y, rect.w, rect.h); renderer.setScissor(rect.x, y, rect.w, rect.h); renderer.setScissorTest(true);
}
function view(rect, cam, mode) { setMode(mode); glRect(rect); renderer.render(scene, cam); }
function viewStyled(rect, cam, o = {}) {
  const w = Math.round(rect.w * DPR), h = Math.round(rect.h * DPR);
  const rB = getRT('B', w, h);
  setMode('styled'); renderer.setRenderTarget(rB); renderer.render(scene, cam);
  let rA = null;
  if (o.proxyMix !== undefined) { rA = getRT('A', w, h); setMode('proxy'); renderer.setRenderTarget(rA); renderer.render(scene, cam); }
  const u = postMat.uniforms;
  u.tB.value = rB.texture; u.tA.value = rA ? rA.texture : rB.texture; u.useA.value = rA ? 1 : 0;
  u.mixB.value = o.proxyMix !== undefined ? o.proxyMix : 1;
  u.noiseAmt.value = o.noise || 0; u.blur.value = o.blur || 0; u.seed.value = o.seed || 0;
  u.vign.value = o.vign !== undefined ? o.vign : .7; u.grain.value = o.grain !== undefined ? o.grain : .03;
  u.dim.value = o.dim !== undefined ? o.dim : 1; u.exposure.value = o.exposure || 1.25;
  u.res.value.set(w, h);
  glRect(rect); renderer.render(postScene, postCam);
}

// ---------------------------------------------------------------- cameras & blocking
const edCam = new THREE.PerspectiveCamera(40, 1, .05, 60);
const shotCam = new THREE.PerspectiveCamera(38, 16 / 9, .05, 60);
const PATHS = {
  side: { p0: V(-.25, 1.4, 3.55), p1: V(.12, 1.26, 2.35), t0: V(0, .95, 0), t1: V(.04, .98, 0), fov: 38 },
  sideEdit: { p0: V(-.4, 1.06, 3.65), p1: V(.1, 1.1, 2.1), t0: V(0, 1.0, 0), t1: V(.04, 1.03, 0), fov: 38 },
  ots: { p0: V(-1.98, 1.42, .66), p1: V(-1.74, 1.38, .52), t0: V(1.0, 1.02, 0), t1: V(1.0, 1.05, 0), fov: 36 },
  bad: { p0: V(.35, 3.3, 1.3), p1: V(.3, 3.15, 1.15), t0: V(0, .7, 0), t1: V(0, .7, 0), fov: 44 },
};
function camPose(path, u) { const e = easeInOut(u); return { pos: path.p0.clone().lerp(path.p1, e), tgt: path.t0.clone().lerp(path.t1, e), fov: path.fov }; }
function mixPose(a, b, k) { return { pos: a.pos.clone().lerp(b.pos, k), tgt: a.tgt.clone().lerp(b.tgt, k), fov: lerp(a.fov, b.fov, k) }; }
function setShot(cam, rect, pose) { cam.fov = pose.fov; cam.aspect = rect.w / rect.h; cam.updateProjectionMatrix(); cam.position.copy(pose.pos); cam.lookAt(pose.tgt); cam.updateMatrixWorld(); }
function orbit(cam, rect, R, h, th, tgt = V(0, .55, 0), fov = 40) { cam.fov = fov; cam.aspect = rect.w / rect.h; cam.updateProjectionMatrix(); cam.position.set(R * Math.cos(th), h, R * Math.sin(th)); cam.lookAt(tgt); cam.updateMatrixWorld(); }

// shot blocking as a function of shot time u. k1 = B moved, k2 = raise enabled
function shotState(u, k1 = 1, k2 = 1) {
  const raise = k2 * sstep(.32, .58, u);
  return {
    A: { x: -1.05, z: 0, ry: PI / 2, lean: .16 - .12 * k2 * sstep(.5, .78, u), nod: 0 },
    B: { x: lerp(1.05, .93, k1), z: 0, ry: -PI / 2, lean: .1 + .07 * raise, raise }
  };
}
function setBlocking(st) {
  for (const id of ['A', 'B']) { const P = PEOPLE[id], s = st[id]; P.root.position.set(s.x, 0, s.z); P.root.rotation.y = s.ry; poseP(P, s); }
  scene.updateMatrixWorld(true);
}
function setScales(map) {
  const objs = { room, table: tableG, lamp: lampG, A: PEOPLE.A.root, B: PEOPLE.B.root };
  for (const k in objs) { const s = map[k] === undefined ? 1 : map[k]; objs[k].visible = s > .001; objs[k].scale.setScalar(Math.max(s, .001)); }
  scene.updateMatrixWorld(true);
}
function placeGizmo(pose, on = true) { camGizmo.userData.on = on; camGizmo.position.copy(pose.pos); camGizmo.lookAt(pose.tgt); camGizmo.updateMatrixWorld(true); }

// ---------------------------------------------------------------- 2D overlay helpers
const wp = o => o.getWorldPosition(new THREE.Vector3());
function proj(v, cam, rect) { const p = v.clone().project(cam); return { x: rect.x + (p.x + 1) / 2 * rect.w, y: rect.y + (1 - p.y) / 2 * rect.h, z: p.z }; }
function polyline(pts, { color = '#fff', w = 2, dash = null, alpha = 1 } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
}
function arrowHead(p, from, color, size = 10, alpha = 1) {
  const a = Math.atan2(p.y - from.y, p.x - from.x); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x - size * Math.cos(a - .45), p.y - size * Math.sin(a - .45)); ctx.lineTo(p.x - size * Math.cos(a + .45), p.y - size * Math.sin(a + .45)); ctx.closePath(); ctx.fill(); ctx.restore();
}
function tag(x, y, text, { fg = '#fff', bg = 'rgba(14,16,21,.9)', border = 'rgba(255,255,255,.16)', size = 12, weight = 600, dot = null, alpha = 1, anchor = 'center', font = 'Inter' } = {}) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `${weight} ${size}px ${font}`;
  const tw = ctx.measureText(text).width, pad = 9, h = size + 11, dw = dot ? 13 : 0, w = tw + pad * 2 + dw;
  const x0 = anchor === 'center' ? x - w / 2 : anchor === 'left' ? x : x - w, y0 = y - h / 2;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x0, y0, w, h, h / 2); ctx.fill();
  if (border) { ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.stroke(); }
  if (dot) { ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(x0 + pad + 4, y, 4, 0, 7); ctx.fill(); }
  ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(text, x0 + pad + dw, y + .5); ctx.restore();
}
function text(x, y, s, { size = 14, weight = 500, color = '#e8ebf0', align = 'left', alpha = 1, font = 'Inter' } = {}) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); ctx.restore();
}
function frame(rect, label, { color = 'rgba(255,255,255,.14)', dot = null, r = 10, alpha = 1, mask = BGCSS } = {}) {
  ctx.save();
  ctx.fillStyle = mask; ctx.beginPath(); ctx.rect(rect.x - 1, rect.y - 1, rect.w + 2, rect.h + 2); ctx.roundRect(rect.x, rect.y, rect.w, rect.h, r); ctx.fill('evenodd');
  ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(rect.x + .5, rect.y + .5, rect.w - 1, rect.h - 1, r); ctx.stroke();
  ctx.restore();
  if (label) tag(rect.x + 12, rect.y + 19, label, { anchor: 'left', dot, alpha, size: 12 });
}
function clipTo(rect) { ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip(); }

function drawPath(path, cam, rect, { color = '#ffffff', alpha = 1, u = null, dash = [6, 6] } = {}) {
  const pts = []; for (let i = 0; i <= 30; i++) pts.push(proj(camPose(path, i / 30).pos, cam, rect));
  polyline(pts, { color, w: 2, dash, alpha }); arrowHead(pts[30], pts[27], color, 11, alpha);
  if (u !== null) { const p = proj(camPose(path, u).pos, cam, rect); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); ctx.restore(); }
}
function drawFrustum(pose, cam, rect, { color = 'rgba(255,90,95,.9)', d = .75, alpha = 1 } = {}) {
  const f = pose.tgt.clone().sub(pose.pos).normalize(); const r = new THREE.Vector3().crossVectors(f, V(0, 1, 0)).normalize(); const up = new THREE.Vector3().crossVectors(r, f);
  const ty = Math.tan(pose.fov * PI / 360), tx = ty * 16 / 9;
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => proj(pose.pos.clone().add(f.clone().add(r.clone().multiplyScalar(sx * tx)).add(up.clone().multiplyScalar(sy * ty)).multiplyScalar(d)), cam, rect));
  const o = proj(pose.pos, cam, rect);
  for (const p of c) polyline([o, p], { color, w: 1.5, alpha });
  polyline([...c, c[0]], { color, w: 1.5, alpha });
}
function drawFootprint(P, cam, rect, color, alpha = 1, w = 2) {
  const c = P.root.position; const pts = [];
  for (let i = 0; i <= 40; i++) { const a = i / 40 * PI * 2; pts.push(proj(V(c.x + Math.cos(a) * .42, .01, c.z + Math.sin(a) * .42), cam, rect)); }
  polyline(pts, { color, w, alpha });
}
function drawEyeline(cam, rect, alpha = 1) {
  const a = proj(wp(PEOPLE.A.head), cam, rect), b = proj(wp(PEOPLE.B.head), cam, rect);
  polyline([a, b], { color: '#ffd166', w: 2, dash: [5, 5], alpha }); arrowHead(b, a, '#ffd166', 9, alpha); arrowHead(a, b, '#ffd166', 9, alpha);
  tag((a.x + b.x) / 2, (a.y + b.y) / 2 - 16, 'eyeline ✓', { fg: '#ffd166', size: 11, alpha });
}
const BONES = [['head', 'neck'], ['neck', 'shL'], ['neck', 'shR'], ['shL', 'elL'], ['elL', 'hL'], ['shR', 'elR'], ['elR', 'hR'], ['neck', 'pelv'], ['pelv', 'hipL'], ['pelv', 'hipR'], ['hipL', 'knL'], ['knL', 'ftL'], ['hipR', 'knR'], ['knR', 'ftR']];
function drawSkeleton(P, cam, rect, color) {
  const J = { head: P.head, neck: P.neck, shL: P.sh.L, shR: P.sh.R, elL: P.el.L, elR: P.el.R, hL: P.hand.L, hR: P.hand.R, pelv: P.pelv, hipL: P.hip.L, hipR: P.hip.R, knL: P.knee.L, knR: P.knee.R, ftL: P.foot.L, ftR: P.foot.R };
  const p = {}; for (const k in J) p[k] = proj(wp(J[k]), cam, rect);
  for (const [a, b] of BONES) polyline([p[a], p[b]], { color, w: 3 });
  ctx.save(); for (const k in p) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[k].x, p[k].y, 3.2, 0, 7); ctx.fill(); } ctx.restore();
}

// ---------------------------------------------------------------- DOM helpers
const $ = id => document.getElementById(id);
const hcache = {};
const DOMIDS = ['step', 'head', 'cap', 'term', 'chat', 'prompt', 'title', 'model', 'promptCard', 'iterChat', 'checks', 'summary'];
function show(id, on, opacity = 1) { const e = $(id); const v = on ? 'block' : 'none'; if (e.style.display !== v) e.style.display = v; e.style.opacity = opacity; }
function html(id, s) { if (hcache[id] !== s) { (id === 'cap' ? $(id).firstElementChild : $(id)).innerHTML = s; hcache[id] = s; } }
function place(id, r) { Object.assign($(id).style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' }); }
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const C = (s, c) => `<span style="color:${c}">${s}</span>`;
function hl(s) {
  return esc(s).replace(/(&quot;|"[^"]*")|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]+(?=\())|(\b[a-zA-Z_]+(?=:))|(\btrue\b|\bfalse\b)/g,
    (m, str, num, fn, key, bool) => str ? C(m, '#c3e88d') : num ? C(m, '#f78c6c') : fn ? C(m, '#82aaff') : key ? C(m, '#c792ea') : C(m, '#ff9cac'));
}
function header(step, head, lt, alpha = 1) {
  const a = sstep(.1, .6, lt) * alpha;
  show('step', true, a); show('head', true, a); html('step', step); html('head', head);
}
function caption(s, lt, t0 = .8, t1 = 99) {
  const a = sstep(t0, t0 + .4, lt) * (1 - sstep(t1, t1 + .3, lt));
  show('cap', a > 0, a); html('cap', s);
}

// ---------------------------------------------------------------- segments
const R = (x, y, w, h) => ({ x, y, w, h });
const FULL = R(0, 0, W, H);

const SEG = {};

// 0 · Title -------------------------------------------------------------
SEG.title = (lt, dur) => {
  setBlocking(shotState(.75)); setScales({});
  const th = 1.02 + lt * .025;
  setShot(shotCam, FULL, { pos: V(1.95 * Math.cos(th - 1) + .1, 1.55 - lt * .02, 2.65 + Math.sin(th - 1) * .4), tgt: V(-.1, .95, 0), fov: 40 });
  viewStyled(FULL, shotCam, { dim: .62, vign: 1.1 });
  const g = ctx.createLinearGradient(0, 0, 900, 0); g.addColorStop(0, 'rgba(8,10,13,.92)'); g.addColorStop(1, 'rgba(8,10,13,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  show('title', true, sstep(.3, 1.1, lt));
  html('title', `<div style="font-size:14px;letter-spacing:.18em;color:#ffb057;font-weight:700;margin-bottom:16px">EXPLAINER</div>
    <h1>Previs-first<br>AI video</h1>
    <p>How an AI agent builds a 3D scene you can edit —<br>and how that scene steers a video model.</p>
    <div class="small">Everything you see was rendered from code (Three.js), the same way a gray-box proxy is made.</div>`);
};

// 1 · Problem -----------------------------------------------------------
const PANELS = [R(20, 268, 400, 225), R(440, 268, 400, 225), R(860, 268, 400, 225)];
const WRONG = [
  { st: { A: { x: -.36, z: -.78, ry: 0, lean: .12 }, B: { x: .36, z: -.78, ry: 0, lean: .12 } }, path: 'side', why: 'Both face the camera' },
  { st: { A: { x: -1.05, z: 0, ry: PI / 2, lean: .16 }, B: { x: .22, z: .05, ry: -PI / 2, lean: .1 } }, path: 'side', why: 'B is inside the table' },
  { st: { A: { x: -1.05, z: 0, ry: PI / 2, lean: .16 }, B: { x: 1.05, z: 0, ry: PI / 2, lean: .1 } }, path: 'bad', why: 'B faces away · wrong angle' },
];
SEG.problem = (lt, dur) => {
  header('Why previs?', 'The problem with prompt-only video', lt);
  show('prompt', true, sstep(.2, .6, lt));
  const ptxt = 'Two detectives face each other across a table. Slow push-in from the side.';
  const typed = ptxt.slice(0, Math.floor(clamp((lt - .5) / 1.7) * ptxt.length));
  const btn = lt > 2.2 && lt < 2.5 ? 'background:#fff' : '';
  html('prompt', `<div class="lbl">PROMPT</div>${esc(typed)}<span style="opacity:${typed.length < ptxt.length ? 1 : 0}">▍</span><div class="btn" style="${btn}">Generate ×3</div>`);
  setScales({});
  PANELS.forEach((rect, i) => {
    const t0 = 2.6 + i * 1.4; const k = (lt - t0) / 1.1;
    if (k < 0) { frame(rect, null, { color: 'rgba(255,255,255,.08)' }); text(rect.x + rect.w / 2, rect.y + rect.h / 2, 'waiting…', { align: 'center', color: '#5d6675', size: 14 }); return; }
    const w = WRONG[i]; setBlocking(w.st);
    const u = clamp((lt - t0) / 5);
    setShot(shotCam, rect, camPose(PATHS[w.path], u));
    viewStyled(rect, shotCam, { noise: 1 - easeOut(k), blur: .012 * Math.pow(1 - clamp(k), 2), seed: Math.floor(lt * 12), vign: .8 });
    frame(rect, `Reroll #${i + 1}`);
    const xa = sstep(t0 + 1.2, t0 + 1.5, lt);
    if (xa > 0) {
      ctx.save(); ctx.globalAlpha = xa; ctx.strokeStyle = '#ff4d5e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2, 10); ctx.stroke(); ctx.restore();
      tag(rect.x + rect.w / 2, rect.y + rect.h + 24, `✗  ${w.why}`, { fg: '#ff8a95', bg: 'rgba(60,14,20,.9)', border: 'rgba(255,77,94,.5)', size: 14, alpha: xa });
    }
  });
  caption('Text alone doesn’t pin down <b>where</b> things are. Every reroll is a new gamble — and burns credits.', lt, 7.3);
};

// 2 · Build -------------------------------------------------------------
const TERM = R(40, 112, 500, 500), BVIEW = R(560, 112, 680, 500);
const BUILD_LINES = [
  { t: 3.9, code: 'room({ w: 5.2, d: 4.8 })', obj: 'room' },
  { t: 4.9, code: 'table({ at: [0, 0], size: [1.6, 0.9] })', obj: 'table' },
  { t: 5.9, code: 'person("A", { at: [-1.05, 0], faces: "B" })', obj: 'A' },
  { t: 6.9, code: 'person("B", { at: [1.05, 0], faces: "A" })', obj: 'B' },
  { t: 7.9, code: 'lamp({ at: [0, 2.1, 0], warm: true })', obj: 'lamp' },
  { t: 8.9, code: 'shot("01", { lens: 35, move: "push_in", secs: 5 })', obj: 'cam' },
];
function termHTML(lt, lines, promptText) {
  const typed = promptText.slice(0, Math.floor(clamp((lt - .3) / 2.4) * promptText.length));
  let s = `${C('you ›', '#ffb057')} ${esc(typed)}${typed.length < promptText.length ? '▍' : ''}\n\n`;
  if (lt > 3.2) s += `${C('agent ›', '#7ee0a8')} ${C('writing scene.js', '#9aa3b2')}\n`;
  for (const L of lines) if (lt > L.t) s += '  ' + hl(L.code) + '\n';
  if (lt > 9.8) s += `\n${C('✓', '#7ee0a8')} ${C('6 objects · 1 camera · preview ready', '#c9d1dc')}\n`;
  return s;
}
SEG.build = (lt, dur) => {
  header('Step 1 — Describe', 'Your agent writes the scene as code', lt);
  show('term', true, sstep(.1, .5, lt)); place('term', TERM);
  html('term', termHTML(lt, BUILD_LINES, 'Two detectives face each other across a table in a dim interrogation room. Slow push-in from the side.'));
  const sc = {}; for (const L of BUILD_LINES) sc[L.obj] = backOut((lt - L.t) / .55);
  setScales(sc);
  setBlocking(shotState(0, 0, 0));
  const pose0 = camPose(PATHS.side, 0);
  placeGizmo(pose0, sc.cam > .01);
  camGizmo.scale.setScalar(Math.max(sc.cam, .001)); camGizmo.updateMatrixWorld(true);
  orbit(edCam, BVIEW, 4.9, 3.3, .7 + lt * .018, V(0, .55, .55), 42);
  view(BVIEW, edCam, 'editor');
  frame(BVIEW, '3D editor · live preview', { dot: '#7ee0a8' });
  clipTo(BVIEW);
  const A = sstep(.3, .7, (lt - 6.4));
  const lab = (obj, v, s, t0, opt = {}) => { const a = sstep(t0 + .3, t0 + .7, lt); if (a > 0) { const p = proj(v, edCam, BVIEW); tag(p.x, p.y, s, { alpha: a, ...opt }); } };
  lab('room', V(-1.9, 3.0, -2.2), 'room · 5.2 × 4.8 m', 3.9);
  lab('table', V(0, .78, .5), 'table', 4.9);
  lab('A', wp(PEOPLE.A.head).add(V(0, .38, 0)), 'Detective A', 5.9, { dot: '#f0a35e' });
  lab('B', wp(PEOPLE.B.head).add(V(0, .38, 0)), 'Detective B', 6.9, { dot: '#6aaef0' });
  lab('lamp', V(.62, 2.06, 0), 'pendant lamp', 7.9);
  if (lt > 7.3) drawEyeline(edCam, BVIEW, sstep(7.3, 7.8, lt));
  if (lt > 9.0) {
    const a = sstep(9.0, 9.5, lt);
    drawPath(PATHS.side, edCam, BVIEW, { alpha: a, u: (lt - 9) % 3 / 3 });
    drawFrustum(pose0, edCam, BVIEW, { alpha: a });
    lab('cam', pose0.pos.clone().add(V(0, .32, 0)), 'shot_01 · 35mm · push-in', 8.9, { fg: '#ff8a8f' });
  }
  ctx.restore();
  caption('The scene is explicit: every object has a position, a facing and a size you can read and change.', lt, 10.2);
};

// 3 · Edit --------------------------------------------------------------
const EVIEW = R(40, 112, 700, 500), CHAT = R(760, 112, 480, 262), PREV = R(800, 392, 400, 225);
const EDITS = [
  { t: .6, you: 'Slide B’s chair 12 cm toward the table', code: 'move("B", { by: [-0.12, 0] })' },
  { t: 3.8, you: 'Have B raise a hand to make a point', code: 'pose("B", "hand_up", { at: 1.6 })' },
  { t: 7.0, you: 'Start the camera lower, end closer', code: 'shot("01").from([-0.4,1.06,3.65])' },
];
SEG.edit = (lt, dur) => {
  header('Step 2 — Edit the blocking', 'Change the scene, not the prompt', lt);
  const k1 = sstep(1.6, 2.6, lt), k2 = sstep(4.8, 5.4, lt), k3 = sstep(8.0, 9.0, lt);
  show('chat', true, sstep(.1, .5, lt)); place('chat', CHAT);
  let s = '';
  EDITS.forEach((e, i) => {
    if (lt < e.t) return;
    const done = lt > e.t + 1.9;
    s += `${C('you ›', '#ffb057')} ${esc(e.you)}\n${C('agent ›', '#7ee0a8')} ${hl(e.code)} ${done ? C('✓', '#7ee0a8') : C('…', '#9aa3b2')}\n\n`;
  });
  if (lt > 10.2) s += C('Each edit re-previews instantly —\nno video generated, no credits spent.', '#c9d1dc');
  html('chat', s);
  setScales({});
  const uPrev = (lt % 5) / 5;
  // editor view shows the blocking at a fixed moment of the shot
  setBlocking(shotState(.7, k1, k2));
  const pathNow = { p0: PATHS.side.p0.clone().lerp(PATHS.sideEdit.p0, k3), p1: PATHS.side.p1.clone().lerp(PATHS.sideEdit.p1, k3), t0: PATHS.side.t0.clone().lerp(PATHS.sideEdit.t0, k3), t1: PATHS.side.t1.clone().lerp(PATHS.sideEdit.t1, k3), fov: 38 };
  const pose0 = camPose(pathNow, 0);
  placeGizmo(pose0, true); camGizmo.scale.setScalar(1);
  orbit(edCam, EVIEW, 5.9, 3.7, .74 + lt * .01, V(-.1, .5, 1.05), 42);
  view(EVIEW, edCam, 'editor');
  frame(EVIEW, '3D editor', { dot: '#7ee0a8' });
  clipTo(EVIEW);
  drawFootprint(PEOPLE.A, edCam, EVIEW, '#f0a35e', .8);
  const hiB = sstep(1.0, 1.4, lt) * (1 - sstep(3.0, 3.4, lt));
  drawFootprint(PEOPLE.B, edCam, EVIEW, hiB > 0 ? '#ffd166' : '#6aaef0', .8, 2 + hiB * 2);
  if (hiB > 0) {
    const a = proj(V(1.05, .02, .55), edCam, EVIEW), b = proj(V(.93, .02, .55), edCam, EVIEW);
    polyline([a, b], { color: '#ffd166', w: 3, alpha: hiB }); arrowHead(b, a, '#ffd166', 10, hiB);
    tag(a.x + 20, a.y + 22, '−12 cm', { fg: '#ffd166', size: 12, alpha: hiB });
  }
  const hi2 = sstep(4.2, 4.6, lt) * (1 - sstep(6.4, 6.8, lt));
  if (hi2 > 0) { const p = proj(wp(PEOPLE.B.hand.L), edCam, EVIEW); ctx.save(); ctx.globalAlpha = hi2; ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, 7); ctx.stroke(); ctx.restore(); tag(p.x, p.y - 40, 'pose: hand_up', { fg: '#ffd166', size: 12, alpha: hi2 }); }
  drawEyeline(edCam, EVIEW, .9);
  if (k3 > 0 && k3 < 1 || (lt > 7.4 && lt < 9.6)) drawPath(PATHS.side, edCam, EVIEW, { alpha: .3, color: '#9aa3b2' });
  drawPath(pathNow, edCam, EVIEW, { u: uPrev, color: lt > 7.4 && lt < 9.6 ? '#ffd166' : '#ffffff' });
  drawFrustum(pose0, edCam, EVIEW);
  ctx.restore();
  // shot preview (proxy) — plays the move with current edits
  setBlocking(shotState(uPrev, k1, k2));
  setShot(shotCam, PREV, camPose(pathNow, uPrev));
  view(PREV, shotCam, 'proxy');
  frame(PREV, 'shot_01 preview', { dot: '#ff5a5f' });
  caption('You direct like a director: “move B”, “raise a hand”, “lower the camera” — and see it immediately.', lt, 10.6);
};

// 4 · Proxy -------------------------------------------------------------
SEG.proxy = (lt, dur) => {
  const u = clamp((lt - .8) / 6.2);
  setScales({}); setBlocking(shotState(u));
  setShot(shotCam, FULL, camPose(PATHS.sideEdit, u));
  view(FULL, shotCam, 'proxy');
  const g = ctx.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, 'rgba(8,10,13,.85)'); g.addColorStop(1, 'rgba(8,10,13,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 140);
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
  for (const f of [1 / 3, 2 / 3]) { ctx.beginPath(); ctx.moveTo(W * f, 0); ctx.lineTo(W * f, H); ctx.moveTo(0, H * f); ctx.lineTo(W, H * f); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; const m = 28, L = 26;
  for (const [x, y, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); ctx.stroke(); }
  ctx.restore();
  const fr = Math.floor(u * 150); const tc = `00:00:${String(Math.floor(fr / 30)).padStart(2, '0')}:${String(fr % 30).padStart(2, '0')}`;
  tag(W - 48, 52, 'PROXY · gray-box · shot_01', { anchor: 'right', size: 12, dot: '#ff5a5f' });
  tag(W - 48, 86, tc, { anchor: 'right', size: 13, font: 'DejaVu Sans Mono', weight: 500 });
  header('Step 3 — Lock the shot', 'The “proxy”: a cheap gray-box render of the move', lt);
  caption('Right positions, eyelines, motion and camera move — but no “look” yet. This is what the video model will follow.', lt, 1.4);
};

// 5 · Passes ------------------------------------------------------------
const CELLS = [R(166, 100, 464, 261), R(650, 100, 464, 261), R(166, 373, 464, 261), R(650, 373, 464, 261)];
SEG.passes = (lt, dur) => {
  header('Step 4 — Export the structure', '', lt); show('head', false);
  const u = clamp((lt - .6) / 6.8);
  setScales({}); setBlocking(shotState(u));
  const pose = camPose(PATHS.sideEdit, u);
  const modes = [['proxy', 'Gray-box video (reference video)'], ['depth', 'Depth'], ['normal', 'Surface normals'], ['seg', 'Masks + pose skeletons']];
  CELLS.forEach((rect, i) => {
    setShot(shotCam, rect, pose);
    view(rect, shotCam, modes[i][0]);
    if (modes[i][0] === 'seg') { clipTo(rect); drawSkeleton(PEOPLE.A, shotCam, rect, '#ffe066'); drawSkeleton(PEOPLE.B, shotCam, rect, '#ffe066'); ctx.restore(); }
    frame(rect, modes[i][1], { alpha: sstep(.2 + i * .25, .6 + i * .25, lt) });
  });
  text(150, 72, '', {});
  caption('One scene → many “control signals”: a gray-box clip, or depth / pose / masks.', lt, 1.2);
};

// 6 · Render ------------------------------------------------------------
const CARD1 = R(40, 120, 288, 162), CARD2 = R(40, 318, 288, 162), OUT = R(556, 120, 684, 385), BAR = R(556, 528, 684, 58);
SEG.render = (lt, dur) => {
  header('Step 5 — Render', 'The video model paints the look onto the structure', lt);
  setScales({});
  // inputs
  const uIn = (lt % 5) / 5;
  setBlocking(shotState(uIn));
  setShot(shotCam, CARD1, camPose(PATHS.sideEdit, uIn)); view(CARD1, shotCam, 'proxy');
  frame(CARD1, 'Proxy video → structure', { dot: '#ffb057' });
  setBlocking(shotState(.85));
  setShot(shotCam, CARD2, { pos: V(1.7, 1.5, 2.4), tgt: V(-.2, .95, 0), fov: 40 }); viewStyled(CARD2, shotCam, { vign: .9 });
  frame(CARD2, 'Reference image → look', { dot: '#7ee0a8' });
  show('promptCard', true, sstep(.3, .7, lt));
  html('promptCard', `<b>PROMPT → STYLE</b>1970s noir, warm tungsten pendant, cigarette haze, 35mm film grain.`);
  // model box
  const P = clamp((lt - 1.6) / 6.6); const step = Math.max(1, Math.min(20, Math.ceil(P * 20)));
  show('model', true, sstep(.6, 1.0, lt));
  html('model', `<div style="font-size:34px">🎞️</div><div class="t">Video model</div><div class="s">frozen — no training,<br>just conditioned</div><div class="step">step ${String(step).padStart(2, '0')} / 20</div><div class="s" style="margin-top:8px;color:${step <= 5 ? '#ffc488' : '#7fe3d8'}">${step <= 5 ? 'sees: proxy + ref + prompt' : 'sees: ref + prompt only'}</div>`);
  // arrows
  const ar = (x1, y1, x2, y2, c, a) => { polyline([{ x: x1, y: y1 }, { x: x2, y: y2 }], { color: c, w: 2, alpha: a }); arrowHead({ x: x2, y: y2 }, { x: x1, y: y1 }, c, 9, a); };
  const aa = sstep(.6, 1.0, lt);
  ar(330, 201, 352, 300, '#ffb057', aa); ar(330, 399, 352, 360, '#7ee0a8', aa); ar(330, 564, 352, 430, '#9aa3b2', aa); ar(530, 357, 552, 312, '#ffffff', aa);
  // output
  const playing = lt > 8.5;
  const uOut = playing ? clamp((lt - 8.6) / 4.2) : .72;
  setBlocking(shotState(uOut));
  setShot(shotCam, OUT, camPose(PATHS.sideEdit, uOut));
  if (lt < 1.6) { frame(OUT, null, { color: 'rgba(255,255,255,.08)' }); }
  else viewStyled(OUT, shotCam, { proxyMix: sstep(.2, .85, P), noise: Math.pow(1 - P, 1.25), blur: .014 * Math.pow(1 - P, 2), seed: step, vign: .8 });
  frame(OUT, playing ? 'Output shot (illustration)' : 'Denoising…', { dot: playing ? '#7ee0a8' : '#ffb057' });
  // timeline
  const early = 5;
  for (let i = 0; i < 20; i++) {
    const x = BAR.x + i * (BAR.w / 20), w = BAR.w / 20 - 3;
    const on = i < step; const isEarly = i < early;
    ctx.fillStyle = isEarly ? (on ? '#ffb057' : 'rgba(255,176,87,.22)') : (on ? '#4fd1c5' : 'rgba(79,209,197,.18)');
    ctx.fillRect(x, BAR.y, w, 14);
  }
  text(BAR.x, BAR.y + 34, 'Steps 1–5: proxy in view → layout, motion, camera', { size: 13.5, color: '#ffc488', weight: 600 });
  text(BAR.x + BAR.w, BAR.y + 34, 'Steps 6–20: proxy removed → texture, light, detail', { size: 13.5, color: '#7fe3d8', weight: 600, align: 'right' });
  caption('Microsoft’s Code Video Model does exactly this: proxy for the first 5 of 20 steps, then the model is free. (Output here is a stylized stand-in.)', lt, 8.8);
};

// 7 · Iterate -----------------------------------------------------------
const ED2 = R(40, 170, 400, 300), V1 = R(460, 170, 380, 214), V2 = R(860, 170, 380, 214);
SEG.iterate = (lt, dur) => {
  header('Step 6 — Iterate surgically', 'Change one thing. Everything else stays put.', lt);
  show('iterChat', true, sstep(.3, .7, lt));
  const msg = 'Same scene — make it an over-the-shoulder from behind A.';
  const typed = msg.slice(0, Math.floor(clamp((lt - .5) / 1.4) * msg.length));
  html('iterChat', `${C('you ›', '#ffb057')} ${esc(typed)}${typed.length < msg.length ? '▍' : ''}`);
  setScales({});
  const kc = easeInOut((lt - 2.1) / 1.2);
  const u = (lt % 4.5) / 4.5;
  setBlocking(shotState(.7));
  const poseG = mixPose(camPose(PATHS.sideEdit, 0), camPose(PATHS.ots, 0), kc);
  placeGizmo(poseG, true); camGizmo.scale.setScalar(1);
  orbit(edCam, ED2, 5.2, 4.2, 1.15, V(0, .4, .2), 44);
  view(ED2, edCam, 'editor');
  frame(ED2, '3D editor', { dot: '#7ee0a8' });
  clipTo(ED2);
  if (kc > 0) drawPath(PATHS.sideEdit, edCam, ED2, { alpha: .3, color: '#9aa3b2' });
  drawPath(kc > .5 ? PATHS.ots : PATHS.sideEdit, edCam, ED2, { color: kc > 0 && kc < 1 ? '#ffd166' : '#fff', u });
  drawFrustum(poseG, edCam, ED2);
  ctx.restore();
  setBlocking(shotState(u));
  setShot(shotCam, V1, camPose(PATHS.sideEdit, u)); viewStyled(V1, shotCam, { vign: .8 });
  frame(V1, 'v1 · side push-in');
  const t2 = 3.4;
  if (lt < t2) { frame(V2, null, { color: 'rgba(255,255,255,.08)' }); text(V2.x + V2.w / 2, V2.y + V2.h / 2, 'waiting for edit…', { align: 'center', color: '#5d6675' }); }
  else {
    const k = clamp((lt - t2) / 1.4);
    setShot(shotCam, V2, camPose(PATHS.ots, u));
    viewStyled(V2, shotCam, { proxyMix: sstep(.2, .8, k), noise: Math.pow(1 - k, 1.4), blur: .012 * Math.pow(1 - k, 2), seed: Math.floor(lt * 10), vign: .8 });
    frame(V2, 'v2 · over-the-shoulder', { dot: '#7ee0a8' });
  }
  show('checks', lt > 5.2, sstep(5.2, 5.7, lt));
  html('checks', ['Blocking unchanged', 'Characters unchanged', 'Motion & timing unchanged', 'Only the camera moved'].map((s, i) => `<span class="c" style="opacity:${sstep(5.3 + i * .35, 5.7 + i * .35, lt)}">${i < 3 ? C('✓', '#7ee0a8') : C('➜', '#ffd166')}  ${s}</span>`).join(''));
  caption('With prompt-only video, “same shot, new angle” is a fresh gamble. With previs, it’s a one-line edit.', lt, 7.4);
};

// 8 · Summary -----------------------------------------------------------
const TOOLS_HTML = `<div style="color:#e8ebf0;font-weight:700;font-size:16px;margin-bottom:6px">Where to try it today</div>
  <b style="color:#ffc488">3D stage:</b> Topview 3D Builder (agent skill, runs locally) · Scenario <i>blender-blockout</i> skill · Blender + MCP<br>
  <b style="color:#7fe3d8">Render stage:</b> reference-video models (Seedance, Kling, Topview T1) · ComfyUI + Wan VACE (depth / pose)<br>
  <span style="color:#8a93a3">Research version: Microsoft’s Code Video Model (agent → Three.js proxy → MiniMax-H3)</span>`;
SEG.summary = (lt, dur) => {
  setScales({}); setBlocking(shotState(.8));
  setShot(shotCam, FULL, { pos: V(1.6 - lt * .03, 1.35, 2.9), tgt: V(-.4, .85, 0), fov: 42 });
  viewStyled(FULL, shotCam, { dim: .2, vign: 1.3, blur: .004 });
  show('summary', true, sstep(.1, .6, lt));
  const a = i => `opacity:${sstep(.4 + i * .3, .9 + i * .3, lt)}`;
  html('summary', `
    <div style="position:absolute;left:120px;top:56px;font-size:13px;letter-spacing:.16em;color:#ffb057;font-weight:700">THE IDEA IN ONE SLIDE</div>
    <div style="position:absolute;left:120px;top:78px;font-size:32px;font-weight:800;letter-spacing:-.02em">Who owns what</div>
    <div class="card" style="left:120px;top:140px;width:500px;height:228px;${a(0)}"><h3>🧱 The 3D scene / code owns</h3><ul>
      <li>Where everyone stands &amp; faces</li><li>Who looks at whom (eyelines)</li><li>What moves, and when</li><li>The exact camera path &amp; lens</li></ul></div>
    <div class="card" style="left:660px;top:140px;width:500px;height:228px;${a(1)}"><h3>🎨 The video model owns</h3><ul>
      <li>Look, texture &amp; lighting</li><li>Faces, cloth, hair</li><li>Photoreal detail &amp; micro-motion</li><li>Style from your reference image</li></ul></div>
    <div class="chips" style="top:404px;${a(2)}">
      <span class="chip">Describe</span><span class="arrow">→</span><span class="chip">Block in 3D</span><span class="arrow">→</span><span class="chip">Edit</span><span class="arrow">→</span><span class="chip">Proxy</span><span class="arrow">→</span><span class="chip">Condition</span><span class="arrow">→</span><span class="chip">Render</span><span class="arrow">→</span><span class="chip">Iterate</span></div>
    <div id="tools" style="top:472px;${a(3)}">${TOOLS_HTML}</div>`);
};

// ---------------------------------------------------------------- timeline
const ORDER = [['title', 5], ['problem', 11], ['build', 13], ['edit', 13], ['proxy', 8], ['passes', 10], ['render', 13], ['iterate', 11], ['summary', 10]];
let acc = 0; const TL = ORDER.map(([id, d]) => { const s = { id, start: acc, dur: d }; acc += d; return s; });
window.TOTAL = acc;

window.renderAt = (t) => {
  renderer.setRenderTarget(null); renderer.setScissorTest(false);
  renderer.setViewport(0, 0, W, H); renderer.setClearColor(0x0b0d10, 1); renderer.clear();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ov.width, ov.height); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  for (const id of DOMIDS) show(id, false);
  camGizmo.userData.on = false; camGizmo.scale.setScalar(1);
  let s = TL[TL.length - 1]; for (const x of TL) if (t >= x.start && t < x.start + x.dur) { s = x; break; }
  const lt = t - s.start;
  SEG[s.id](lt, s.dur);
  const isFirst = s === TL[0], isLast = s === TL[TL.length - 1];
  const fin = isFirst ? sstep(0, .7, lt) : sstep(0, .3, lt);
  const fout = isLast ? 1 - sstep(s.dur - 1.0, s.dur, lt) : 1 - sstep(s.dur - .3, s.dur, lt);
  $('fade').style.opacity = String(1 - Math.min(fin, fout));
};

document.fonts.ready.then(() => { window.renderAt(0); window.READY = true; });
