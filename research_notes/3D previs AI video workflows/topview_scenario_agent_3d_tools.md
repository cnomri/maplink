# Agent-driven 3D previs for AI video: Topview 3D Builder, Scenario "3D OS", and alternatives (as of 2026-10-31)

Research method note: GitHub repo metadata came from the GitHub search API. README, CLI reference and skill files were read in full from raw.githubusercontent.com (cited below at their github.com/blob URLs). PyPI release history came from the PyPI JSON API. Network limits in this session blocked direct fetches of topview.ai, dev.to and x.com. Claims from those sites come only from search-engine snippets and summaries and are labeled that way. Tweet dates were decoded from X status IDs (snowflake timestamps). They were not read off the pages.

## Which claims in the pasted summary hold up?

### Takeaway
The Topview 3D Builder part of the pasted summary is accurate in almost every detail: the repo, Apache 2.0, the Oct 15 announcement, the supported agents, local-first operation, 4 characters, 121 poses and primitives. It leaves out three things: the assets are CC BY 4.0 (not Apache), characters have no body animation (static poses only), and the video stage is a paid cloud step. "Topview T1" is real (announced Oct 21, 2026). "Scenario 3D OS" is only half-verified. Scenario's open-source skill library and its Blender/Maya/Unreal expert skills are real. But the name "3D OS" and the "~80 skills" figure appear only in a third-party X post from Oct 30, 2026, not in any Scenario repo or official source I could reach.

### Cited Findings
- VERIFIED: The repo `github.com/topviewai/topview-3d-builder` exists, is public, and is Apache-2.0 licensed — [GitHub repo](https://github.com/topviewai/topview-3d-builder)
- VERIFIED, WITH NUANCE: "Code, schemas and docs: Apache License 2.0". The built-in characters and poses are under CC BY 4.0, credited as "Scene3D built-in assets © Topview, CC BY 4.0" — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- VERIFIED: The announcement tweet x.com/TopviewAIhq/status/2110615678805774657 exists. Its ID decodes to 2026-10-15 06:16 UTC. Search snippet of its text: "We just open-sourced Topview 3D Builder 🎬 Stop rolling the AI lottery. Start building the shot. Describe a scene in ChatGPT, Claude, or any AI agent, or drop in a reference image, and get an editable 3D set. Block your characters, props, and camera. Lock in composition, spatial…" — [TopviewAI on X](https://x.com/TopviewAIhq/status/2110615678805774657)
- VERIFIED, WITH NUANCE on "open-sourced ~Oct 15": the repo was created 2026-09-24 and last pushed 2026-10-16 — [GitHub repo](https://github.com/topviewai/topview-3d-builder). The CLI's first PyPI release (0.1.0) was 2026-09-24. Version 0.1.7 went up 2026-10-15 05:34 UTC, about 40 minutes before the announcement tweet — [PyPI topview-3d-cli](https://pypi.org/project/topview-3d-cli/). Oct 15 is the public launch date. Whether the repo was already public in late September is unknown.
- VERIFIED: It works with "ChatGPT / Codex, Qoder, Claude Code, Cursor and any agent with skills support". The summary leaves out Qoder — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- VERIFIED: "4 characters + 121 poses + basic primitives". The README lists 4 characters (child, youth, woman, man), 121 poses (sitting, standing, walking, fighting, crawling, reaching and more), primitive props and unlimited cameras — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md). The CLI doc names "the five primitives" — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- VERIFIED: "Runs locally by default (no account, no upload for the 3D stage)". README: "Everything before the video runs on your machine, free, with no account and no upload." and "Every project stays in a `.topview-3d/` folder on your machine." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- VERIFIED: "drop a reference image". README examples include "Reference image: … Prompt: Build the 3D scene from the reference image." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- PARTLY MISLEADING on "characters, poses … camera moves": camera moves are supported. Character animation is not. The skill says: "There is **no motion library**: never promise walk cycles or other body animation". Movement is limited to a static pose plus `transform.position` / `transform.rotation` keyframes on the whole character — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- VERIFIED, WITH NUANCE on "export … to Topview's models or any other video model": the generation step first looks for a service the user named or already has installed. It offers Topview only if nothing is found, and Topview generation goes through a cloud MCP server with OAuth sign-in and credits — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- VERIFIED: Topview T1 exists. An @TopviewAIhq post (ID decodes to 2026-10-21 14:21 UTC) reads: "Introducing Topview T1 🎬 Topview's newest AI video model. Built to rival Seedance 2.5 1080P quality at 62% lower cost…" — [TopviewAI on X](https://x.com/TopviewAIhq/status/2112912062007607635)
- PARTLY VERIFIED: Scenario open-source skills that drive Blender, Maya, Unreal and others exist. The repo describes "teams of skills that drive DCC … software and game engines installed on your machine (ZBrush, Blender, Maya, Unreal Engine, Unity, Godot, Roblox Studio)" — [scenario-labs/skills README](https://github.com/scenario-labs/skills/blob/main/README.md)
- UNVERIFIED: the "3D OS" name and "~80 skills". The only source is a third-party post (ID decodes to 2026-10-30 23:57 UTC): "@Scenario_gg just released 3D OS: → 6 specialized departments → 80 production-ready skills → Direct integration with professional 3D tools" — [Charly Wargnier on X](https://x.com/DataChaz/status/2116318684893663241). The string "3D OS" does not appear in the scenario-labs/skills README or INSTALL.md (checked 2026-10-31) — [README](https://github.com/scenario-labs/skills/blob/main/README.md), [INSTALL.md](https://github.com/scenario-labs/skills/blob/main/INSTALL.md)

### Inferences
- The pasted summary reads like a fair condensation of Topview's own README and launch post. Its main error is leaving things out: the asset license, the lack of body animation, and the fact that the video step is a paid cloud step.
- "3D OS" is probably a marketing bundle, a "department" grouping of skills inside scenario-labs/skills. It follows Scenario's own "GameDev OS" post from Sept 25. It does not appear to be a separate product or repo. The "80" may count a subset of skills. The README currently lists 167 skill rows, 87 of them DCC/engine "expert tools" (see the Scenario section).

### Gaps
- I could not confirm whether the Topview repo was public before Oct 15. The GitHub events and visibility history were not accessible.
- I could not read the full text of either Topview X post or any Scenario post first-hand, because x.com was not reachable from this session.

## Topview 3D Builder: what it is, tech stack, how the agent drives it, assets, importing your own models

### Takeaway
Topview 3D Builder is an Agent Skill plus a Python CLI (`topview-3d-cli`), with a Node/Playwright headless-Chromium renderer and a local Next.js editor called "Studio". It is not an MCP server for the 3D stage. The agent edits a JSON "director document" by running CLI commands that take JSON specs and return JSON. Each edit is validated and measured (framing, grounding, collisions), and the agent renders PNG frames that it is told to look at. You can import your own `.glb`/`.gltf` models and pose JSON files. FBX and Mixamo are not mentioned anywhere.

### Cited Findings
- Repo stats as of 2026-10-31: 268 stars, 70 forks, 0 open issues, main language TypeScript, about 102 MB, created 2026-09-24, last pushed 2026-10-16. No GitHub releases are listed — [GitHub repo](https://github.com/topviewai/topview-3d-builder)
- Tagline: "From an idea, to a 3D scene built by your agent, to a real animated video. Free, runs locally, no sign-up." Positioning: "a **3D director's stage for AI video** … The 3D scene fixes blocking, scale and camera angles. Texture, lighting and performance come from the video model." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- Pipeline as stated: "An idea → Agent builds the 3D scene → Auto-check and refine → Multi-camera render → Real animated video" — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- Architecture: "`topview-3d-cli` edits a local, offline director project with the same operation semantics as the hosted `Scene3dLiveOperationService`, and renders it with the Node/Playwright renderer in `editor/packages/director-cli`." This also implies a hosted (cloud) version of the same scene engine on topview.ai — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Agent interface: every command prints one JSON object on stdout and uses exit codes 0, 1 and 2. Write commands are atomic, support `--dry-run`, and use optimistic concurrency (`expectedSceneSequence`) — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Main editing commands:
  - `node batch` takes 1–64 changes: `add_primitive`, `add_library` (characters/props), `add_camera` (presetId, optional subject), `update`, `delete`, `repeat_primitive`.
  - `pose batch` / `pose apply` pose characters.
  - `document apply` applies low-level ops (`director.node.upsert`, `director.clip.upsert` with `cameraMotion|motion|pathMotion`, `director.fcurves.set` for keyframe curves).
  - `evaluate` runs numerical checks: framing, frustum, ground penetration.
  - `inspect nodes` / `inspect views` measure meshes and render each camera.
  - `render` writes PNG frames.
  — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Project format: `<dir>/.topview-3d/` holds `metadata.json`, `entities.json` (the authoritative store, with an operation log), derived `document.json` and `fcurves.json`, `bom.json` (the plan and constraint record), plus `assets/` and `renders/` — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Scene conventions: right-handed, Y up, metres, Euler degrees. Every scene keeps a mandatory bird's-eye "layout_overview" camera. The default timeline is 24 fps, 120 frames — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- The skill runs a 10-stage workflow and pauses for user approval between stages: Understand → Layout → Props → People → Pose → Cameras → Edit → Check → Studio → Generate — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- Studio, the GUI: `topview-3d-cli studio open <dir>` starts a local server on `127.0.0.1:3002` (a prebuilt `server.js`, or `next dev` in `editor/apps/studio`). Studio edits are written back through `project adopt` — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md). The README markets it as "A full 3D editor, not just an agent … everything your agent can do has a matching panel you can use by hand" — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md). The skill tells the agent to open Studio only for viewing and never to drive it with browser automation — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- Built-in assets: "four built-in characters (Child, Youth, Female, Man), 121 poses with cover images, and the five primitives". "Phase 1 ships no motion library." A motion clip whose asset is missing renders in the base pose with a `MOTION_NOT_AVAILABLE` warning — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Custom models: `asset import (--project <dir> | --builtin) <file> --kind character|prop|pose` copies "a `.glb`/`.gltf` model or pose `.json`" into the asset root and records size and SHA-256 — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md). The add-prop guide: "When the user provides a `.glb` / `.gltf` file for a specific object, import it into the project", for example `asset import --project <dir> model.glb --kind prop --id sofa-01`. It also warns that "imported models carry no dimension annotations", so measure them before placing — [add-prop.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/add-prop.md)
- Pose files must have hips and 1–256 bone quaternions and be at most 1 MiB (`POSE_ASSET_INVALID`) — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- The agent is told to build props from "1–4 primitives first; imported models only when needed" and that "a phone can be a slab" — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- Recommended agent LLM, per the README: "Qwen 3.8 Flash … costs about 1/150 of GPT 6 Astra and reaches a similar result". Ratings: Qwen 3.8 Flash 5 stars, Opus 5.5 3 stars ("Strong aesthetics, but expensive"), Astra 3 stars. The acknowledgements thank "the Qwen team for their strong support of this project" — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- Community ports: a ComfyUI custom node, "Topview 3D Builder for ComfyUI" (Apache-2.0, created 2026-10-16), says it is "based on our other project", builds scenes in ComfyUI, and exports "images or white-model animations directly to the canvas" as IMAGE / VIDEO outputs — [ComfyUI-Topview-3D-Builder](https://github.com/gyx85542-dot/ComfyUI-Topview-3D-Builder). The same account hosts a "Topview 3D Builder README preview" repo created 2026-10-14, which suggests a Topview-affiliated developer — [3d-builder-readme-preview](https://github.com/gyx85542-dot/3d-builder-readme-preview)

### Inferences
- How it works, in plain terms: you chat with your coding agent, and the agent writes small JSON edit lists ("add a man here, sit him on this box, add a camera at eye height looking at him"). It runs them through `topview-3d-cli`, which validates them, measures the result and renders snapshots. The agent looks at the snapshots and fixes problems, and you can open Studio in a browser to inspect or drag things yourself. Nothing leaves your machine until you approve a video generation.
- The stack (Draco decoder, glTF assets, Playwright/Chromium WebGL rendering, Next.js editor) points to a three.js-style WebGL engine. Three.js is not named in any file I read, so this stays an inference.
- The Qwen-first recommendation and the Qwen acknowledgement suggest a commercial partnership. Treat the model ratings as vendor marketing, not a benchmark.

### Gaps
- I could not see the full repo file tree (the GitHub API tree endpoint was blocked) or the TypeScript editor source, so the 3D library in use is unconfirmed.
- FBX and Mixamo import is not mentioned in any file I read. Only glTF/GLB and pose JSON are documented. Whether imported custom characters work with the 121 poses depends on the rig (`--rig` option). Compatibility rules were not documented in the files I read.

## Install and run: prerequisites, OS support, browser, account and API keys

### Takeaway
You need Python 3.11+, Node.js 20.6+ (with npm), and uv or pipx. The first render downloads a pinned headless Chromium. It is documented for macOS, Linux and Windows. No GPU requirement is stated, and building and rendering need no account or API key. The only steps that need an account are the optional AI video generation and the LLM agent you run it in.

### Cited Findings
- Prerequisites: "You need Python 3.11+, Node.js 20.6+, and either uv or pipx." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- Install commands:
  - Claude Code: `claude plugin marketplace add https://github.com/topviewai/topview-3d-builder.git` then `claude plugin install topview-3d-builder@topview-3d-builder`, then restart.
  - Cursor: `git clone … ~/.cursor/plugins/local/topview-3d-builder`.
  - Any skills-capable agent, including Qoder: `npx skills add https://github.com/topviewai/topview-3d-builder.git`, then pick `topview-3d-cli`.
  - ChatGPT/Codex: install from a ChatGPT plugin page.
  — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- Beginner path: paste one sentence into your agent ("Install the Topview 3D Builder plugin from https://github.com/topviewai/topview-3d-builder … Follow the install steps in the README, then tell me when to restart."), restart, then ask something like "Build a scene: a character sits next to a box. Render a front view." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- "The first render downloads a browser component once; after that it is cached." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md). `topview-3d-cli browser ensure [--with-deps]` installs pinned Playwright and Chromium. `--with-deps` also installs Linux system packages via sudo — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md), [doctor-browser.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/doctor-browser.md)
- OS support: install locations are documented for macOS and Linux (`~/.local/share/topview-3d-cli/venv`) and Windows (`$env:LOCALAPPDATA\topview-3d-cli\venv`). There is a `scripts/install.sh` and a `scripts\install.ps1` for Windows. Cache paths are given for all three — [doctor-browser.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/doctor-browser.md), [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- The CLI is on PyPI as `topview-3d-cli`, requires Python ≥3.11, and is at 0.1.8 (2026-10-16). Releases: 0.1.0–0.1.2 on 2026-09-24, 0.1.4 on 09-26, 0.1.5–0.1.6 on 09-28, 0.1.7 on 10-15, 0.1.8 on 10-16 — [PyPI](https://pypi.org/project/topview-3d-cli/). The skill pins `topview-3d-cli==0.1.8` — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- `topview-3d-cli doctor --json` checks python, node, the renderer runtime, built-in assets, Playwright and Chromium — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Sandbox caveat: "Rendering fails inside an agent sandbox although `doctor` passes: the sandbox blocks the browser … ask the user to approve running the render command outside the sandbox". The doctor guide mentions macOS Mach-port lookups of the GPU process — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md), [doctor-browser.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/doctor-browser.md)
- Account and keys: "Building, editing and rendering are free and need no account." — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md). Chromium "blocks every request outside the local server and the optional `publicAssetBase`"; rendering "never downloads assets by default" — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Browser use: the 3D Studio runs as a local web app in your browser (localhost:3002). There is also a hosted "3D Builder" page on topview.ai — [README links to topview.ai/3d-builder](https://github.com/topviewai/topview-3d-builder/blob/main/README.md). A YouTube video titled "Topview Film Studio 3D Builder: Direct AI Video Scenes Before Generation" suggests the hosted version sits inside Topview's Film Studio (title only, video not watched) — [YouTube](https://www.youtube.com/watch?v=b8xJZBINI_s)

### Inferences
- A beginner needs Node and Python installed and an agent subscription (Claude Code, Cursor, Codex and so on). The agent does the rest. The likeliest friction points are agent sandboxes blocking headless Chromium, and Studio needing `pnpm install` in checkout installs.
- Because rendering is headless Chromium/WebGL, a discrete GPU is probably not required. This is not stated.

### Gaps
- No official minimum hardware or GPU spec was found.
- I could not fetch the hosted topview.ai/3d-builder page or the Academy tutorial (topview.ai was not reachable from this session), so the hosted version's features and pricing are unverified.

## What gets exported, and how the handoff to video models works (and whether it is paid)

### Takeaway
Local outputs are PNG frames, a contact sheet and a JSON render manifest. You get a gray-box MP4/WebM video by downloading it from Studio or by having the agent stitch frames with ffmpeg. Nothing in the docs mentions depth maps, pose skeletons, camera-path files or glTF scene export. By default the handoff is reference-video ("omni") generation: the gray-box clip becomes `<<<Video1>>>` in a structured prompt. Image-to-video with a first frame and text-only modes are fallbacks. The agent uses whatever generation service you already have and suggests Topview only if you have none. Generating through Topview is a cloud step that needs an account, OAuth and credits.

### Cited Findings
- `render` writes `frame-<n>.png`, `contact-sheet.png` and `render.json` (run id, camera, resolution, document SHA-256, versions) into `.topview-3d/renders/<runId>/`. The payload can set `frames`, `width`, `height`, `cameraNodeId` — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Video reference: either export from Studio ("open the render preview, choose the camera and the frame range, set the output type to video and download it"), or "`topview-3d-cli render <dir> payload.json` takes at most 9 frames per call, so render the story camera over the frame range in batches of 9 … and encode them with `ffmpeg`" — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- Default mode: "For a video, the default is the omni mode (reference-video generation): the exported video is the reference, called `Video1` … Use another mode (first-frame image to video, text only) only when the user asks for it or the service has no omni mode." — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- Prompt construction: the prompt has a fixed opening line, a "Reference lock", a Spec, Scene and subject, a timeline in seconds, Sound Design, a Prohibited list and Assumptions. "Lock layout, motion and camera; change the look." Target models named: "Seedance, MiniMax H3, Kling, Jimeng, Runway, Luma and similar" — [video-prompt.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/video-prompt.md)
- Which service is used, in order: (1) a service the user named; (2) generation tools or skills already on the machine (a skill, an MCP tool, "a ComfyUI-style workflow runner, or an installed generation CLI"); (3) only if nothing is found, Topview — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- Topview handoff: the agent registers an MCP server named `topview-browser` at `https://mcp-browser.topview.ai`. The user completes Topview OAuth. The agent checks the connection with a read-only call such as the credit balance; "Do not submit paid generation to test the connection." The video tool takes `taskType` `omni_reference` with `inputVideos` / `inputImages`. Alternatively the agent uses the `topview-skill` with `auth.py login` — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- Cost transparency: before each call the agent must show the service and model, mode, reference, full prompt, duration, aspect ratio, resolution, "the cost and the waiting time" (via `estimate-cost`), and that the reference is uploaded. "Never purchase credits or create extra variants on your own." — [generate.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/generate.md)
- Provenance: `generation record` logs a result made elsewhere (provider, model, prompt, reference frames or video with sha256, outputs). It "never opens a network connection" and rejects credential fields — [CLI reference](https://github.com/topviewai/topview-3d-builder/blob/main/docs/topview-3d-cli.md)
- Topview's general agent skill repo, `topviewai/skill` (Apache-2.0), calls a hosted MCP `topview-mcp` (production URL `https://mcp.topview.ai`) for "Videos, images, avatars, TTS, voices, and boards". Credentials are handled by host OAuth — [topviewai/skill README](https://github.com/topviewai/skill)
- The plugin manifest describes the final step: "the last step can hand the frames to an image or video generation service once you confirm." — [plugin.json](https://github.com/topviewai/topview-3d-builder/blob/main/.claude-plugin/plugin.json)
- Stated limitation (search snippet attributed to Topview's own write-up): "a reference frame can't guarantee that a video model will keep your layout" and poses are static — [Topview dev.to post (via search snippet; not fetched)](https://dev.to/topviewai/from-one-prompt-to-an-editable-3d-scene-we-open-sourced-a-local-first-agent-workflow-npa)

### Inferences
- For a non-expert, the practical recipe is: (1) build and check the scene with the agent; (2) export the gray-box video from Studio; (3) feed it to any video model that accepts a reference video (Seedance-style "omni/reference" modes, or similar video-to-video features), along with the generated prompt. If your model only accepts a start image, use a rendered PNG as the first frame and accept looser camera control.
- Handoff to Topview's own models is paid by credit, since the Topview MCP checks credit balance and estimates cost. The 3D stage itself is free.

### Gaps
- No depth, normal, segmentation or skeleton (OpenPose-style) passes, no camera-path export (FBX/USD/JSON for other tools), and no glTF scene export are documented. I found no evidence they exist, so treat them as absent until verified.
- I could not confirm whether Topview T1 specifically supports the `omni_reference` (reference-video) mode the 3D Builder uses by default.

## Topview the company, Topview T1, and pricing

### Takeaway
Topview (topview.ai, @TopviewAIhq) is a commercial AI video and ad platform with avatars, e-commerce data tools, and aggregated third-party models such as Seedance. T1 is its first-party video model, announced 2026-10-21. It is marketed as matching Seedance 2.5 at 1080p for 62% less, about $0.22/sec according to third parties. Plans reportedly run from about $8/mo (Basic) to $112/mo (Ultra monthly), with Ultra annual about $600/yr. Pricing details conflict across sources.

### Cited Findings
- Topview's GitHub account publishes `ai-video-editor` (2024), `api` (2024), `skill` (Mar 2026), `codex-topview-ai` ("research content, write Seedance prompts, generate media, and publish videos to social platforms", May 2026), `plugins` (Aug 2026) and `topview-3d-builder` — [topviewai on GitHub](https://github.com/topviewai)
- The `topviewai/skill` repo covers media generation plus "ecommerce / KOL research" (Amazon, TikTok Shop, Shopee, YouTube KOL) via `topview-mcp` — [topviewai/skill](https://github.com/topviewai/skill)
- T1 launch text (search snippet of the official post): "Introducing Topview T1 🎬 Topview's newest AI video model. Built to rival Seedance 2.5 1080P quality at 62% lower cost. More shots. More iterations. A much smaller bill. Plus, Ultra Annual users get 30 days of unlimited T1 generation." — [TopviewAI on X](https://x.com/TopviewAIhq/status/2112912062007607635)
- Third-party pricing claim: "$0.22/sec vs $0.585/sec" (T1 vs Seedance 2.5) — [Alex Prompter on X](https://x.com/alex_prompter/status/2112965161573093743); "Just $0.22/sec for 1080p" — [Zephyra Leigh on X](https://x.com/ZephyraLeigh/status/2112940793774354915/video/1)
- Official T1 product page (search summary only, not fetched): outputs 720p and 1080p, videos up to 30 seconds, input from text, a first-frame image, or multiple references — [topview.ai/topview-t1](https://www.topview.ai/topview-t1)
- Lookalike domains are not official and should be ignored: topviewt1.org, topview-t1.org, topview-t1.net, topview-t1.video — [search results, e.g. topviewt1.org](https://topviewt1.org/)
- Plans (third-party analysis, search snippet, likely novoads.ai): "TopView's pricing page, read in US dollars on 2026-10-21, priced its individual plans from $8 a month (Basic) to $112 a month (Ultra) on monthly billing, and sold Ultra for a year at $599.9 paid upfront" — [novoads.ai Topview pricing](https://novoads.ai/en/blog/topview-pricing). Topview's Seedance 2.5 campaign page lists Ultra annual at "$600 … $50/month, billed annually" — [Topview Seedance 2.5 campaign](https://www.topview.ai/campaign/seedance-2-5)
- Conflicts: the unlimited window for Ultra annual is given as 30 days in one place and 60 days in an older campaign page. Pro pricing is listed as $16/mo in one directory (last checked March 2026) and $29/seat/mo in another — [novoads.ai](https://novoads.ai/en/blog/topview-pricing), [aitoolsatlas.ai pricing](https://aitoolsatlas.ai/tools/topview-ai/pricing)
- Platform-level complaints (not about 3D Builder): Trustpilot reviewers report billing/credit frustrations, needing multiple regenerations, and credits not rolling over — [Trustpilot](https://www.trustpilot.com/review/topview.ai?page=9). Reviews also mention lag and bugs — [Techraisal review](https://www.techraisal.com/blog/topview-ai-review-after-use-honest-results-limitations_1765798474/), [Product Hunt reviews](https://www.producthunt.com/products/topview-ai/reviews)

### Inferences
- The 3D Builder works as a funnel for Topview's paid video generation, T1 included. The local stage is free and open, and the paid step comes after it. It is still provider-agnostic in practice.
- T1's quality and cost claims are vendor marketing. I found no independent benchmark.

### Gaps
- Company background (HQ, founders, funding) was not researched or found.
- The T1 per-credit cost, and whether T1 is offered inside the 3D Builder's MCP handoff, are unverified.
- topview.ai/pricing could not be fetched directly, so all price figures are second-hand.

## Scenario "3D OS": does it exist, what the skills are, how they integrate with Blender/Maya/Unreal, license and dates

### Takeaway
Scenario (scenario.com, @Scenario_gg, GitHub `scenario-labs`) maintains an MIT-licensed Agent Skills repo with 1,343 stars. It has two layers. (a) Skills that call Scenario's paid cloud MCP for image, video, 3D and texture generation. (b) "Expert tools": 87 skills in 7 families that drive locally installed ZBrush, Blender, Maya, Unreal, Unity, Godot and Roblox Studio, mostly through Python scripts, headless runs and the apps' own MCP bridges. These are what the pasted summary calls "3D OS". The brand name and the 80-skill count come from a third-party post a day old. The most relevant skill for previs is `scenario-blender-blockout` (added 2026-10-17), which builds camera-locked gray-box playblasts for render-to-real video models such as Seedance.

### Cited Findings
- Repo: `scenario-labs/skills`, MIT, created 2026-08-12, 1,343 stars and 162 forks as of 2026-10-31. Description: "skills that pick the right model, price before spending … through the Scenario MCP, plus expert teams that drive Blender, Maya, ZBrush, Unreal, and Unity" — [scenario-labs/skills](https://github.com/scenario-labs/skills)
- Two layers, per the README: Scenario skills work "through the Scenario MCP server" (`claude mcp add --transport http scenario https://mcp.scenario.com/mcp`, Scenario account via OAuth or API key). Expert tools "drive DCC … software and game engines installed on your machine … They need the application, not the Scenario MCP server" — [README](https://github.com/scenario-labs/skills/blob/main/README.md)
- Install: `npx skills add scenario-labs/skills` (interactive menu). Each expert family installs as a set, because "its specialists import the lead skill's scripts". Skills follow the agentskills.io format and target "Claude Code, Cursor, Codex, Copilot, and 70+ others" — [README](https://github.com/scenario-labs/skills/blob/main/README.md)
- Expert tool families as listed in the README on 2026-10-31 (87 skills total):
  - ZBrush 2026: 9, "through its agent bridge … full live tests of every skill are still pending".
  - Blender 5.2: 15, "through Python, headless or in a live session … previs, blockouts for render-to-real video".
  - Maya 2027: 11, "through Python, batch or live".
  - Unreal Engine 5.8: 10, "on macOS through Editor Python, headless jobs, and Epic's Unreal MCP server … cinematics".
  - Unity 6.3: 14.
  - Godot 4.7: 14.
  - Roblox Studio: 14, "through its built-in MCP server".
  — [README](https://github.com/scenario-labs/skills/blob/main/README.md)
- The whole README lists 167 skill rows. That includes the cloud skills: model families (Seedance, Kling, Veo, Runway, Luma, Wan and others) and 3D generation (Meshy, Rodin, Sparc3D, 3D worlds/splats) — [README](https://github.com/scenario-labs/skills/blob/main/README.md)
- Dates from the changelog:
  - 2026-09-26: "add expert tools for DCC software and game engines" (#159).
  - 2026-10-04: Godot expert tools.
  - 2026-10-17: "scenario-blender-blockout: add blockouts for render-to-real video" (#243) and "scenario-blender: add the Blender extension skill".
  - 2026-10-20: Roblox Studio expert tools.
  - Latest release: 0.60.1, 2026-10-29.
  — [CHANGELOG](https://github.com/scenario-labs/skills/blob/main/CHANGELOG.md)
- Blender family details: ported from `edemaistre/blender-expert-skills`, built 2026-09-24. Thirteen skills are "distilled from about 200 expert videos". Each has a tested `bx_<domain>.py`. "all 12 test suites pass headless on Blender 5.2.1". Headless invocation is `blender --background --factory-startup --python-exit-code 1 --python script.py`. "Real sculpt/paint brushes need a live Blender window (e.g. through an MCP bridge)". Known limits: "headless sculpting reaches concept quality … procedural retopology still needs a human pass" — [Blender family README](https://github.com/scenario-labs/skills/blob/main/skills/dcc/blender/README.md)
- `scenario-blender-blockout`: turns "a text brief or a reference image" into "a Blender blockout whose playblast guides a render-to-real video pass (a video model that takes a reference clip, such as Seedance, or the Render Video lane of the Scenario Blender Plugin)". It uses color-coded proxies at metric scale, character stand-ins (colored capsules, capsules with features, rigged gray mannequins), "a camera locked to the timeline", "a hand-off sheet for the video prompt". Its principle: "the blockout has full authority over motion and layout and none over look" — [scenario-blender-blockout SKILL.md](https://github.com/scenario-labs/skills/blob/main/skills/dcc/blender/scenario-blender-blockout/SKILL.md). Its `K.walk_path` solves planted-foot walking per frame, so unlike Topview it does animate figures — [Blender family README](https://github.com/scenario-labs/skills/blob/main/skills/dcc/blender/README.md)
- `scenario-blender-previs-storyboard` is for director/editor animatics (shot lists, 180-degree rule, Video Sequencer). It warns: "do not hand a director's animatic to a video model as is: rebuild it with scenario-blender-blockout" — [previs SKILL.md](https://github.com/scenario-labs/skills/blob/main/skills/dcc/blender/scenario-blender-previs-storyboard/SKILL.md)
- Companion plugins:
  - `scenario-labs/blender-plugin`: "AI images, video, 3D and PBR materials in the viewport, plus a local MCP server for agents. Blender 5.0+ extension, GPL-3.0-or-later"; 918 stars; created 2026-08-30.
  - `unreal-plugin`: created 2026-10-19, "local Scenario MCP server for agents".
  - `maya-plugin`: "in development", created 2026-10-19.
  - Unity and Godot plugins.
  — [scenario-labs on GitHub](https://github.com/scenario-labs)
- Earlier branding: Scenario's own post (decodes to 2026-09-25) said "We just open-sourced a whole game studio. Meet GameDev OS by Scenario … 64 skills across 9 roles, all inside your coding agent" — [Scenario on X](https://x.com/Scenario_gg/status/2103460573895659982)
- "3D OS" claim (third party, 2026-10-30): "6 specialized departments → 80 production-ready skills". Departments named in search summaries: Animation (rigging, motion capture, video-to-motion), Art, Modeling (image-to-3D, hard surface), Look Dev (PBR, texturing, lighting), Worlds (walkable environments, skyboxes, splats), Pipeline (retopology, UV baking, game-ready export). Tools named: Blender, Maya, ZBrush, Unreal, Unity, Godot, Roblox — [Charly Wargnier on X](https://x.com/DataChaz/status/2116318684893663241)

### Inferences
- The pasted description of "3D OS" (modeling, animation, materials, lighting, game-ready exports; Blender, Maya, Unreal) matches the actual repo contents. It is probably a curated role or department bundle of scenario-labs/skills, mixing local DCC expert skills with cloud Scenario MCP skills such as image-to-3D, video-to-motion and skyboxes. It is not a separate standalone product.
- For AI-video previs specifically, Scenario's approach is Blender-centric and more capable than Topview's: real rigs, walk paths, crowds and traffic. It is also much heavier, since it needs Blender 5.2 installed, and its cloud-generation steps need a paid Scenario account.
- Some Unreal, Unity, Godot and Roblox procedures are documented as tested "on macOS". Windows support for those families may be incomplete. The changelog does show "run the Godot toolkit on Windows", so this varies by family.

### Gaps
- No official Scenario page or post using the name "3D OS" was reachable. The exact 80-skill composition and its official release date are unverified.
- Scenario MCP pricing and credit costs were not researched.

## Comparable and alternative agent-to-3D and previs tools, and which a beginner could use today for blocking

### Takeaway
The main open alternatives are generic DCC bridges: Blender MCP, Epic's Unreal MCP, Roblox Studio's MCP, and Scenario's Blender/Unreal plugins with local MCP. They are powerful, but you need to know the host app. Traditional previs apps (Previs Pro, FrameForge, Blender itself) give accurate cameras without an agent. Of the tools verified here, Topview 3D Builder is the easiest for a beginner who only wants to lock blocking and camera for an AI video. I verified little about the commercial AI-native options (Intangible, Autodesk Flow Studio, Cascadeur, Higgsfield, and the 3D-aware features of Runway, Luma and Kling) in this pass.

### Cited Findings
- Blender MCP (Siddharth Ahuja): now listed as `ahujasid/mcp-for-blender` (topic `blender-mcp`), "Community plugin to control Blender 3D with any LLM of your choice. Not affiliated with the official Blender Foundation." 32,887 stars, created 2025-03-07, actively updated (2026-10-31) — [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender)
- Other Blender MCP variants include `bpy-dev/blender-mcp`, "Independent enhanced distribution of Blender Lab MCP" (created 2026-09-09), which hints at an official Blender Lab MCP. Also `dhakalnirajan/blender-open-mcp` (open-weights models) — [GitHub search results: bpy-dev/blender-mcp](https://github.com/bpy-dev/blender-mcp), [blender-open-mcp](https://github.com/dhakalnirajan/blender-open-mcp)
- Epic's Unreal MCP server and Roblox Studio's built-in MCP server exist and are used by Scenario's expert skills — [scenario-labs/skills README](https://github.com/scenario-labs/skills/blob/main/README.md)
- Previs-category roundups (2026, several with commercial ties) consistently describe Blender as "Open-source 3D camera blocking with full geometric accuracy" with a "steep learning curve". FrameForge is called purpose-built for blocking and camera placement. AI-first tools (LTX Studio, Katalist, Luma Dream Machine) are said to offer storyboards and animatics with less camera precision — [Higgsfield blog](https://higgsfield.ai/blog/ai-previsualization-tools), [techmymoney 2026](https://techmymoney.com/2026/08/04/best-ai-previz-tools-filmmakers-2026/), [Previs Pro comparison](https://wiki.previspro.com/compare)
- Previs Pro calls itself a tool combining "native 3D scene blocking with real camera optics". A competitor roundup disputes its virtual-camera accuracy — [Previs Pro comparison](https://wiki.previspro.com/compare), [Higgsfield blog](https://higgsfield.ai/blog/ai-previsualization-tools)
- Topview's README contrasts itself with "Many code-driven 3D scene tools [that] can only be changed through an agent" and ships a GUI (Studio) alongside — [README](https://github.com/topviewai/topview-3d-builder/blob/main/README.md)
- A ComfyUI route exists via the community node "Topview 3D Builder for ComfyUI", which outputs IMAGE/VIDEO straight into a ComfyUI graph for local video models — [ComfyUI-Topview-3D-Builder](https://github.com/gyx85542-dot/ComfyUI-Topview-3D-Builder)

### Inferences
- Beginner ranking for "block a shot, then hand it to a video model", from the evidence above:
  1. **Topview 3D Builder.** It is purpose-built, works through any coding agent plus a GUI, uses fixed mannequins and poses, runs automatic checks, and writes the video prompt for you. Limits: no body animation, primitives only unless you bring GLBs.
  2. **Scenario's `scenario-blender-blockout`.** It is richer, with walks, crowds and vehicles, but needs Blender 5.2 and some comfort with Blender.
  3. **Blender MCP.** It is the most flexible, but it is a general Blender remote control with no previs workflow or checks built in.
  4. **Traditional previs apps** (Previs Pro, FrameForge). These give accurate optics with no agent. They suit people who prefer manual control.
- Commercial AI-video platforms increasingly accept reference videos (Seedance-style "omni/reference" modes). Any of these gray-box tools can therefore feed them, so the choice of previs tool and the choice of video model are largely independent.

### Gaps
- Not verified in this pass: Intangible (AI-native 3D previs), Cascadeur, Shot Designer, Autodesk Flow Studio (formerly Wonder Studio), Higgsfield's own camera/3D tools, and the 3D-aware or camera-control features of Runway, Luma and Kling as of Oct 2026. The search returned only listicles without primary detail on these. Treat any claims about them as unchecked.
- Unreal and Unity MCP server repos (official Epic or community) were not looked up directly. Their star counts and status are unknown.

## Early user feedback: limitations, bugs, quality issues

### Takeaway
The Topview 3D Builder is two weeks old and has little independent feedback. The repo shows 0 open issues, I found no Reddit or Hacker News threads, and the X reactions I saw were mostly promotional reposts. The most concrete limitations come from Topview itself: static poses only, no walk cycles, mannequins and primitives, a reference frame that doesn't guarantee the video model keeps the layout, and headless-Chromium sandbox problems.

### Cited Findings
- The GitHub repo shows `open_issues_count: 0` as of 2026-10-31, with 268 stars and 70 forks — [GitHub repo](https://github.com/topviewai/topview-3d-builder)
- Self-stated limits (search snippet of Topview's dev.to post): "four built-in characters, 121 static poses, simple primitives, static cameras, and root-level keyframing. We would rather state that plainly than market the project as a full 3D animation suite. The project is still early." — [Topview on DEV Community (via search snippet; not fetched)](https://dev.to/topviewai/from-one-prompt-to-an-editable-3d-scene-we-open-sourced-a-local-first-agent-workflow-npa)
- The skill itself states: "Scope in this version: primitive props, the four built-in characters …, 121 static poses, static cameras and root keyframes … never promise walk cycles". It also notes "Thin lines, stripes, z-fighting and aliasing are renderer artifacts" — [SKILL.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/SKILL.md)
- Agent sandboxes can block Chromium rendering even when `doctor` passes. The user has to approve running render outside the sandbox — [doctor-browser.md](https://github.com/topviewai/topview-3d-builder/blob/main/skills/topview-3d-cli/references/doctor-browser.md)
- Influencer and launch coverage (largely promotional) on 2026-10-15: "TopviewAI open-sourced a tool that lets you block the scene first … place characters and simple props, pick poses, position cameras, and re…" — [Laurence Moroney on X](https://x.com/lmoroney/status/2110766685145669891); also [Akansha Khandelwal on X](https://x.com/techwithakansha/status/2110644144427458572), [Paul Sims on X](https://x.com/SimslearnAi/status/2110643768076747151)
- A YouTube commenter on the hosted Film Studio 3D Builder asked for the ability to "use my existing TopView AI video renders or use my video as reference stills to set up a stage scene" (search summary) — [YouTube](https://www.youtube.com/watch?v=b8xJZBINI_s)
- For Scenario's Blender skills, the self-reported limits are that headless sculpting reaches only concept quality, hair-curve and Grease Pencil strokes can't be scripted, and retopology needs a human pass. ZBrush live tests are "still pending" — [Blender family README](https://github.com/scenario-labs/skills/blob/main/skills/dcc/blender/README.md), [scenario-labs/skills README](https://github.com/scenario-labs/skills/blob/main/README.md). The skills repo has 24 open issues — [scenario-labs/skills](https://github.com/scenario-labs/skills)

### Inferences
- The README demos (a runner doing a flip, a basketball jump, a dragon flight) show generated videos. With no motion library, the 3D blockouts behind them can only have moved posed mannequins or primitives by root keyframes. The video model invents the body motion. Expect less control over action beats than over camera and placement.
- Engagement looks driven by launch and influencer activity, not organic community use, so far. Quality reports from real users will probably surface over the next weeks.

### Gaps
- Closed GitHub issues and PR discussions could not be read (the API was blocked for this repo in this session).
- I found no Reddit, Hacker News or substantive YouTube review threads for either tool.
- No side-by-side tests (blockout vs generated video fidelity across models) from third parties were found.
