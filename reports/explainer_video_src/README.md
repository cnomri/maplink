# Explainer video source

The explainer video (`../Previs first AI video explainer.mp4`) is a small Three.js scene. It is rendered frame by frame in headless Chromium, then encoded to MP4 with ffmpeg.

- `scene.js`: the scene and all on-screen graphics. It has the room, two mannequins, the camera paths and the render passes (gray-box, depth, normals, masks + pose). `window.renderAt(t)` draws the frame at time `t`.
- `index.html`: the page that loads the scene.
- `render.cjs`: the renderer.
  - `node render.cjs stills 10,20` saves PNGs of individual frames.
  - `node render.cjs video 0 94 out.mp4` renders a time range in seconds.

Requirements: `npm install three@0.170.0` in this folder, plus Playwright and ffmpeg.

The "final look" shots are a stylized Three.js render standing in for real video-model output. They are not AI-generated footage.
