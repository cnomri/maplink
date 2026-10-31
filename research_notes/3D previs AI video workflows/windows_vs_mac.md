# Windows PC vs MacBook (Apple Silicon) for an agent-driven 3D-previs-to-AI-video workflow (as of 2026-10-31)

Research note: Several primary sites could not be reached from the research environment (DNS blocked): opendata.blender.org, docs.comfy.org, docs.ltx.io, notebookcheck.com/.net, 9to5mac.com, dev.to, lilting.ch, modelfit.io. For these, figures come from search-result summaries of those pages (URL still cited) rather than full-page reads. They are flagged "(search snippet)" below and should be treated as slightly lower confidence. Fully read pages: Claude Code setup + sandboxing docs (code.claude.com), GitHub READMEs for Wan2.2, HunyuanVideo-1.5, blender-mcp, topview-3d-builder.

## 1. Agent tooling (Claude Code, Cursor, Codex): which OS is first-class?

### Takeaway
All three agents run natively on both Windows and macOS in 2026, but macOS is the lower-friction platform: Claude Code's sandbox works natively on macOS and Linux/WSL2 but **not on native Windows**, and native-Windows users still hit shell/MCP-spawn issues (Git Bash vs PowerShell, `cmd /c` wrappers, PATH). On Windows, running Claude Code inside WSL2 gets you close to Mac/Linux parity.

### Cited Findings
- Claude Code official system requirements: macOS 13.0+; Windows 10 1809+ or Windows Server 2019+; Ubuntu 20.04+/Debian 10+/Alpine 3.19+; 4 GB+ RAM; x64 or ARM64; shells Bash, Zsh, PowerShell, or CMD — [Claude Code docs: Advanced setup](https://code.claude.com/docs/en/setup)
- Windows options table in the official docs: Native Windows (Git for Windows optional; **Sandboxing: Not supported**; "Windows-native projects and tools"), WSL 2 (Sandboxing: Supported; "Linux toolchains or sandboxed command execution"), WSL 1 (Sandboxing not supported) — [Claude Code docs: Advanced setup](https://code.claude.com/docs/en/setup)
- On native Windows, Git for Windows "is recommended ... so Claude Code can use the Bash tool. If Git for Windows is not installed, Claude Code uses PowerShell as the shell tool instead"; Git Bash is needed by the Bash tool and the Monitor tool; if Claude Code can't find Git Bash, set `CLAUDE_CODE_GIT_BASH_PATH` — [Claude Code docs: Advanced setup](https://code.claude.com/docs/en/setup)
- Sandboxing doc: "The sandbox runs on macOS, Linux, and WSL2. On native Windows, Claude Code runs commands unsandboxed. To use the sandbox on a Windows machine, run Claude Code inside a WSL2 distribution." macOS uses the built-in Seatbelt framework (no extra packages); Linux/WSL2 use bubblewrap + socat — [Claude Code docs: Sandboxing](https://code.claude.com/docs/en/sandboxing)
- Sandboxing platform differences: on macOS, git over SSH (fetch/pull/push) fails inside the sandbox even when the host is allowed; on Linux/WSL2 it works once allowed. `network.allowLocalBinding` works on macOS but has no effect on Linux/WSL2 — [Claude Code docs: Sandboxing](https://code.claude.com/docs/en/sandboxing)
- Desktop app for Claude Code is available for macOS, Windows, and Linux — [Claude Code docs: Advanced setup](https://code.claude.com/docs/en/setup)
- Reported native-Windows friction (GitHub issues, user-reported): a docs issue says v2.1.120 made Git Bash optional with PowerShell fallback — [GitHub issue #53068](https://github.com/anthropics/claude-code/issues/53068); a March 2026 bug showed "Claude Code on Windows requires git-bash" error — [claudeissues.com #37908](https://claudeissues.com/issue/37908-bug-error-claude-code-on-windows-requires-git-bash); an issue reported crashes in PowerShell/Windows Terminal that didn't occur in Git Bash — [GitHub issue #20118](https://github.com/anthropics/claude-code/issues/20118) (search snippet)
- MCP-specific Windows issues: a guide reports that as of v2.1.72 local stdio MCP servers were ignored on native Windows, with common fix of wrapping `npx` in `cmd /c` — [mcp.directory guide (2026)](https://mcp.directory/blog/claude-code-mcp-on-windows-native-wsl-2026-complete-fix-guide); a path-with-spaces bug (`Program Files\Git\bin\bash.exe` split) for MCP servers, closed Jan 2026 — [claudeissues.com #4528](https://claudeissues.com/issue/4528-windows-git-bash-path-resolution-failure-for-mcp-server); a September 2026 report that setting `CLAUDE_CODE_SHELL_PREFIX` on Windows breaks stdio MCP server spawns, still open — [claudeissues.com #91581](https://claudeissues.com/issue/91581-windows-claude-code-shell-prefix-is-used-as-the-executable-for-stdio-mcp-server) (search snippets; current fix status unverified)
- Blender MCP README Windows-specific notes: Cursor on Windows needs `"command": "cmd", "args": ["/c", "uvx", "mcp-for-blender"]`; `spawn uvx ENOENT` because GUI clients may not inherit PATH (use full path to `uvx.exe`); Windows Defender may block the one-line installer (use winget). macOS install is `brew install uv` or a curl one-liner; Claude Code config is `claude mcp add blender uvx mcp-for-blender` — [ahujasid/blender-mcp README](https://github.com/ahujasid/blender-mcp)
- OpenAI Codex on Windows: official page offers native Codex app, CLI, IDE extension, or WSL2; recommends the native Windows sandbox by default ("elevated" mode preferred, "unelevated" fallback); WSL2 suggested for Linux-native tooling; Windows 10 1809+ required — [OpenAI Codex docs: Windows](https://developers.openai.com/codex/windows) (search snippet); WSL1 no longer supported from Codex 0.115 (Linux sandbox moved to bubblewrap) — [danielvaughan.com, Apr 2026](https://codex.danielvaughan.com/2026/04/01/codex-cli-windows-native-sandbox-wsl/) (secondary); a third-party blog says Windows support was still labelled experimental as of March 2026 — same source, not confirmed in official docs
- Codex Windows app launch coverage — [SD Times](https://sdtimes.com/sdt_dev/openai-releases-codex-for-windows/)

### Inferences
- macOS is "first-class with fewer footnotes" for terminal agents: same POSIX shell the docs/examples assume, native sandboxing, no `cmd /c` or Git Bash path workarounds for MCP servers. Windows is fully supported but has more moving parts.
- Best Windows setup for agents: run Claude Code/Codex inside **WSL2** (sandbox supported, Linux toolchains) unless the agent must drive Windows-native apps (e.g., Blender MCP talking to Windows Blender, ComfyUI on Windows) — in which case native Windows + Git for Windows is simpler, accepting no sandbox.
- Cursor is a cross-platform desktop IDE on both; the main OS difference surfaces in MCP config (Windows `cmd /c` wrappers).

### Gaps
- Did not fetch Cursor's official OS support page; no first-party statement on Cursor Windows vs macOS parity.
- Could not verify which of the reported Windows MCP/shell bugs are fixed in the current (Oct 2026) Claude Code release.

## 2. Local AI video generation (Wan 2.x, LTX-Video/LTX-2, HunyuanVideo via ComfyUI): NVIDIA vs Apple Silicon

### Takeaway
Local open-video generation is overwhelmingly an NVIDIA/CUDA workload: official repos assume CUDA (HunyuanVideo 1.5 says Linux + NVIDIA only), LTX Desktop runs Apple Silicon in API-only mode, and FP8 checkpoints fail on Apple's Metal backend. Macs can run GGUF-quantized models in ComfyUI or MLX ports, but reported times are many times slower (e.g., ~82 min for a 2-second Wan 2.2 clip on M1 Max) vs seconds-to-minutes on a 16–32 GB RTX card.

### Cited Findings
**Official VRAM requirements (NVIDIA)**
- Wan2.2 official README: T2V-A14B, I2V-A14B, S2V-14B single-GPU inference "at least 80GB VRAM" (with `--offload_model True --convert_model_dtype`); TI2V-5B 720p (1280x704) needs "at least 24GB VRAM (e.g., RTX 4090)" with `--offload_model True --convert_model_dtype --t5_cpu`; TI2V-5B "can generate a 5-second 720P video in under 9 minutes on a single consumer-grade GPU" without specific optimization. README makes no mention of Mac/MPS. Release dates: Wan2.2 Jul 28 2025; S2V Aug 26 2025; Animate-14B Sep 19 2025 — [Wan-Video/Wan2.2 GitHub](https://github.com/Wan-Video/Wan2.2)
- HunyuanVideo 1.5 official README: "Minimum GPU Memory: 14 GB (with model offloading enabled)"; "NVIDIA GPU with CUDA support"; OS: Linux only; step-distilled 480p I2V model generates "within 75 seconds" on a single RTX 4090 (75% end-to-end reduction); sparse attention requires H-series GPUs; FP8 GEMM support added Dec 23 2025; no Mac/MPS mention — [Tencent-Hunyuan/HunyuanVideo-1.5 GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- LTX official docs (search snippet): LTX Desktop on Apple Silicon is limited to API mode (needs an LTX API key); local generation targets NVIDIA GPUs with ≥16 GB VRAM — [LTX docs quick start](https://docs.ltx.io/open-source-model/getting-started/quick-start)
- LTX-2: practical floor 24 GB GPU, 32 GB+ for intended experience; LTX-2 19B checkpoints ~43.3 GB on disk — [localaimaster LTX-2 setup guide](https://localaimaster.com/blog/ltx-2-local-setup-guide) (secondary)

**Community quantization/offload numbers (NVIDIA, secondary sources; figures conflict)**
- Wan 2.2 TI2V-5B FP8 fits an 8 GB GPU with ComfyUI offloading (noticeably slower) — [wan27.org requirements guide (2026)](https://wan27.org/blog/wan-2-2-requirements-guide)
- Wan 2.2 14B int8: 16 GB minimum / 20 GB comfortable at 720p; 14B Q4: 12 GB minimum at 480p; int8 14B on 16 GB called "practical floor" for postable results — [localaimaster Wan VRAM by GPU](https://localaimaster.com/blog/wan-vram-requirements-by-gpu)
- GGUF Q4/Q5 14B can squeeze onto 6 GB at 480p with text encoder offloaded; moving T5 encoder to system RAM is the most effective VRAM saver — [Evetech Wan 2.2 / LTX-2 VRAM article](https://evezone.evetech.co.za/quick-bytes/vram-needed-for-local-ai-video-generation-wan-2-2-and-ltx-2) (secondary)
- Full-precision 14B pipeline needs 54–65 GB VRAM by one guide vs ~28 GB by another — conflict noted across [wan27.org](https://wan27.org/blog/wan-2-2-requirements-guide) and [localaimaster](https://localaimaster.com/blog/wan-vram-requirements-by-gpu)

**NVIDIA speed data points (user reports, search snippets)**
- RTX 5070 Ti: Wan 2.2, 81 frames ~80 s at 640 base resolution with lightx2v LoRA, FP16, Sage attention; RTX 5060 Ti 16 GB + 32 GB RAM: 720x1024, 81 frames (5 s @16 fps) ~5 min each with lightx2v 4-step LoRA (heavy pagefile use); 81-frame 1280x720 I2V (4+4 sampler) ~90–120 s before a regression to 220–240 s; RTX 5090: 145 frames at ~1 MP in under 5 min on base template — [Reddit snapshot 1](https://reddit.sentinel-team.org/posts/1r9u7x4/snapshots/2026-02-21T03%3A51%3A00.739012Z), [Reddit snapshot 2](https://reddit.sentinel-team.org/posts/1rd90vg/snapshots/2026-02-25T20%3A00%3A13.604354Z), [Reddit snapshot 3](https://reddit.sentinel-team.org/posts/1rf0j3z/snapshots/2026-02-27T15%3A30%3A06.548433Z) (which number is in which thread not fully verified)
- RTX 5090 vs 4090 ComfyUI Wan benchmark article exists but could not be read — [dev.to runcai](https://dev.to/runcai/rtx-5090-vs-4090-for-comfyui-wan-benchmarks-vram-and-when-to-rent-cloud-gpu-2fja)

**Apple Silicon status and speed**
- ComfyUI Desktop: Windows 10+ with NVIDIA CUDA GPU; macOS 13+ on Apple Silicon (M1+); Beta on both; Intel Macs unsupported by desktop app; 8 GB RAM min / 16 GB recommended; ~4.85 GB disk per install — [ComfyUI docs: Desktop FAQ](https://docs.comfy.org/installation/desktop/faq), [ComfyUI docs: system requirements](https://docs.comfy.org/installation/system_requirements) (search snippets); AMD GPUs unsupported by Windows desktop app per [comfyui-wiki desktop guide](https://comfyui-wiki.com/en/install/install-comfyui/comfyui-desktop-installation-guide)
- M1 Max 64 GB, ComfyUI: FP8 Wan checkpoint errored within ~55 s because Metal lacks a Float8 type (official template assumes NVIDIA); workaround is GGUF; Wan 2.2 GGUF took ~82 minutes for a 2-second clip; LTX-2 ~7 min for a 1.3-second clip; community MPS fork reported ~10 min for 8 frames at 480p (1.3B model) on M1 Pro — [lilting.ch (EN)](https://lilting.ch/en/articles/ltx2-wan22-mac-local-video-gen), [lilting.ch (JA)](https://lilting.ch/articles/ltx2-wan22-mac-local-video-gen) (search snippets; older M1-generation hardware)
- M4 Max 36 GB with FastVideo MLX: distilled derivative of Wan 5B, 1280x704, 3 steps, 81 frames in 151.42 s (page notes not comparable to base Wan 2.2) — [modelfit.io Wan 2.2 5B on Mac](https://modelfit.io/video/wan-2-2-5b/) (search snippet)
- M4 Max 64 GB can run Wan 2.1 T2V 14B Q4 GGUF (~12 GB of ~48 GB usable), no timings — [localmodel-run](https://localmodel-run.pages.dev/can-i-run/wan-2-1-t2v-14b/apple-m4-max-64gb)
- MPS in ComfyUI "works, but it's 2-4x slower than NVIDIA CUDA for the same operation" — [pasqualepillitteri.it ComfyUI Mac guide](https://pasqualepillitteri.it/en/news/19801/comfyui-mac-ai-images-guide) (secondary)
- A Hacker News commenter: on a 128 GB M4 Max Mac Studio, a 15 s 480p video in ComfyUI took ~1.5 hours (GGUF quant) — [HN comment](https://hn.svelte.dev/item/49252179) (anecdote; model named in snippet not verified)
- Mac unified memory realistic floor for video work 32 GB+; generation much slower than NVIDIA — [Earngenix VRAM/hardware guide](https://www.earngenix.com/tutorials/vram-hardware-guide-ai-video-comfyui) (secondary); Reddit Feb 2026: one commenter says Mac needs 64 GB+ RAM to be viable — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rd57fb/snapshots/2026-02-25T20%3A00%3A13.604354Z) (anecdote)
- MLX alternative: community project "Phosphene" runs LTX 2.3 on Apple MLX, one-click via Pinokio, Apple Silicon only, no published memory requirements — [LTX-2 search results via ltx.io blog / Reddit](https://reddit.sentinel-team.org/posts/1t0k7k1/snapshots/2026-05-15T21%3A30%3A42.175693Z) (search snippet; exact source page for Phosphene not confirmed)
- Draw Things (Mac app) reportedly has strong memory saving for Wan video, no timing given — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rhgo2s/snapshots/2026-03-02T19%3A03%3A34.217167Z) (anecdote)
- General AI gap: RTX 4090 ~127 tok/s vs M4 Max ~55 tok/s on 8B LLMs; CUDA 2–4x faster than MLX at same model size; image gen 3–8 s/image CUDA vs 15–30 s/image Apple (unspecified models) — [localaimaster MLX vs CUDA](https://localaimaster.com/blog/mlx-vs-cuda-local-ai); German June 2026 report M4 Max ~60 tok/s vs 4090 ~110 tok/s on Llama 3.1 8B — [borncity.com](https://borncity.com/news/m4-max-vs-rtx-4090-apple-ki-bleibt-beim-tempo-deutlich-zurueck/)
- M5 Pro/M5 Max (Mar 2026) add GPU "Neural Accelerators"; M5 Max up to 128 GB unified memory, up to 614 GB/s bandwidth; 128 GB only with 40-core GPU — [MacRumors, 2026-03-03](https://www.macrumors.com/2026/03/03/apple-unveils-macbook-pro-with-m5-pro-and-m5-max-chips-with-neural-accelerators/), [Apple support spec page](https://support.apple.com/en-gb/126318) (search snippet)

### Inferences
- For local Wan/LTX/Hunyuan with depth/pose control in ComfyUI, a Windows PC with an RTX card of 16 GB+ VRAM is the clear choice; 24–32 GB (RTX 4090/5090) is the comfortable tier for 14B models at 720p and for LTX-2.
- Rough order of magnitude: an RTX 16–32 GB card with speed LoRAs (lightx2v) produces a 5-second 480–720p clip in ~1–5 minutes; a Mac via ComfyUI/MPS with GGUF is typically tens of minutes to over an hour for a similar clip (based on M1 Max/M4 Max reports above; M5-generation Macs with Neural Accelerators may narrow the gap but no measured video-model numbers were found).
- A Mac's advantage is capacity (64–128 GB unified memory can load models that don't fit in a 12–16 GB card), not speed. FP8 workflows (common in official ComfyUI templates) will not run on Metal; Mac users must use GGUF or MLX ports.
- ControlNet-style depth/pose control workflows (Wan Fun/VACE etc.) are built and tested primarily on CUDA; expect more custom-node breakage on Mac (inference, not verified per node).

### Gaps
- No measured Wan 2.2 14B or LTX-2 timing on M4 Max/M5 Max under ComfyUI found.
- No clean like-for-like RTX 4070/4090/5090 seconds-per-clip table from a primary benchmark source (dev.to article unreadable).
- Could not read LTX and ComfyUI official docs pages directly (blocked); relied on snippets.

## 3. 3D: Blender (Metal vs OptiX/CUDA), Blender MCP, Three.js/WebGPU browser tools, Unreal on Mac

### Takeaway
Desktop NVIDIA cards remain far ahead in Blender Cycles (RTX 4090 ~13,000 / RTX 5090 ~17,800 Open Data median vs M4 Max ~5,200), but the newest Apple chips (M5 Max) are reported roughly on par with a laptop RTX 5090. For agent-built previs (Blender MCP, Three.js/browser tools like Topview 3D Builder) render speed matters little; both OSes work. Unreal Engine on Mac lacks hardware ray tracing.

### Cited Findings
- Blender Open Data medians (Blender 3.6.0): RTX 5090 17,822.17 vs RTX 4090 13,064.17 (~36% faster) — [Tom's Hardware (2025)](https://www.tomshardware.com/pc-components/gpus/rtx-5090-beats-rtx-4090-by-36-percent-in-the-blender-benchmark-rtx-5090d-is-40-percent-faster-than-rtx-4090d); similar ~37% per [Notebookcheck](https://www.notebookcheck.net/GeForce-RTX-5090-crushes-RTX-4090-in-Blender-benchmark-leads-predecessor-by-almost-37.948848.0.html) (search snippet). A newer Renderjuice comparison derived from Open Data medians lists RTX 5090 at 15,016.75, leading 4090 by 28.5% (numbers shift as data accumulates) — [Renderjuice](https://www.development.renderjuice.com/gpus/compare/rtx-4090-vs-rtx-5090)
- M4 Max (40-core GPU) Blender Open Data ~5,209 average over 32 tests, beating RTX 4070, near RTX 4080 laptop; desktop RTX 4090 averages ~10,880 in the same comparison; M4 Max ~30% behind mobile RTX 4090 — [Club386 (Nov 2024, older)](https://www.club386.com/apple-m4-max-chip-beats-nvidias-rtx-4070-in-blender), [9to5mac (Nov 2024, older)](https://9to5mac.com/2024/11/17/m4-max-blender-benchmark/), [iPhoneSoft](https://iphonesoft.fr/2024/11/18/puce-m4-max-jeu-egal-rtx-4080-blender) (search snippets)
- Blender "Monster" scene: RTX 5090 7,311.1 vs M4 Max 2,527.6 — [hostbor.com](https://hostbor.com/rtx-5090-vs-apple-m4-max/) (secondary)
- M5 Max vs RTX 5090 laptop (2026): one test had RTX 5090 laptop at 11 s vs M5 Max 16 s; the Nvidia laptop shut down mid-tests needing recharge — [NoobFeed](https://www.noobfeed.com/hardware/m5-max-vs-rtx-5090-laptop); claims of ~10% Nvidia lead in Blender 4.5/5.0 shifting to Apple advantage in Blender 5.1 — [Applesfera](https://www.applesfera.com/portatil/bestias-nvidia-necesitan-ser-ladrillo-enchufado-para-rendir-al-maximo-nuevo-m5-max-apple-acaba-humillarlas-su-propio-terreno) (secondary, unverified against Open Data); power under load M5 Max ~85–140 W vs RTX 5090 laptop 160–175 W (Notebookcheck measurements cited secondarily) — [Applesfera](https://www.applesfera.com/portatil/bestias-nvidia-necesitan-ser-ladrillo-enchufado-para-rendir-al-maximo-nuevo-m5-max-apple-acaba-humillarlas-su-propio-terreno)
- Caveat: Open Data is user-submitted with unknown power settings/background apps — [MacRumors forum](https://forums.macrumors.com/threads/3d-rendering-on-apple-silicon-cpu-gpu.2269416/page-104)
- Blender MCP: Blender 3.0+, Python 3.10+, uv; install paths for macOS, Windows, Linux; Windows needs extra PATH/`cmd /c` handling (see Q1); no auth on its socket server; run only one MCP instance — [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)
- Unreal Engine on Mac: Epic's spec page lists Lumen with software ray tracing on Apple Silicon M1+, hardware ray tracing (and MegaLights) not currently supported — [Epic: hardware & software specs](https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-and-software-specifications-for-unreal-engine); Nanite on Apple GPUs requires Shader Model 6 (macOS 15+, M2 or newer; M1 unsupported) — [Epic tech blog, Jan 2025](https://www.unrealengine.com/en-US/tech-blog/bringing-unreal-engine-on-macos-up-to-feature-parity-with-windowsprogress-report); UE 5.2 introduced native Apple Silicon support with "notable limitations" — [Epic tech blog (2023, older)](https://www.unrealengine.com/en-US/tech-blog/unreal-engine-5-2-brings-native-support-for-apple-silicon-and-other-developments-for-macos)

### Inferences
- For previs (blockouts, camera moves, depth/pose passes), Eevee/Workbench or browser renders are fast on any modern machine; Cycles speed only matters for final-quality 3D renders.
- Three.js/WebGPU tools are browser-based and cross-platform; performance tracks the GPU (an M-series Max or an RTX card both handle previs-scale scenes). No OS-specific restrictions found.
- If the user plans Unreal-based previs with hardware RT/path tracing, Windows + NVIDIA is required; Mac Unreal is acceptable for software-Lumen previs on M2+.

### Gaps
- Could not access Blender Open Data directly for current (Blender 4.5/5.x) medians for M4/M5 Pro/Max vs RTX 40/50 laptop and desktop cards.
- No WebGPU/Three.js cross-platform performance benchmarks found.

## 4. Editing: DaVinci Resolve / Final Cut / Premiere / CapCut on Apple Silicon vs Windows

### Takeaway
Apple Silicon MacBooks are the stronger laptop editing platform in 2026: PugetBench reports M5 Pro/Max MacBooks beating RTX 5090 laptops in Resolve and Adobe tests, with hardware ProRes engines, long battery life, and Final Cut Pro available only on Mac. A desktop NVIDIA PC remains strong for Resolve, but the Mac's media engines and battery give it the edge for mobile editing.

### Cited Findings
- PugetBench (via Notebookcheck, Mar 2026): M5 Pro/M5 Max MacBooks "clearly beat the mobile GeForce RTX 5090" in Adobe and DaVinci Resolve tests. 16" M5 Max (40-core GPU): Premiere Pro Extended 139,339; Resolve Standard 127,090 / Extended 88,696. 14" M5 Max: Resolve 115,172 / 82,713. 16" M5 Pro (20-core GPU): Resolve 83,560 / 58,878. Resolve 20.3 Studio — [Notebookcheck.net](https://www.notebookcheck.net/Apple-s-M5-Pro-M5-Max-easily-beat-the-RTX-5090-in-PugetBench-creator-benchmarks.1252582.0.html), [Notebookcheck.com (DE)](https://www.notebookcheck.com/Apples-M5-Pro-M5-Max-sind-der-RTX-5090-in-PugetBench-Tests-deutlich-ueberlegen.1252480.0.html) (search snippets); a summary claims ~40–50% M5 Max lead over mobile RTX 5090 in GPU-heavy tests — [lavx news](https://news.lavx.hu/article/apple-s-m5-pro-m5-max-easily-beat-rtx-5090-in-pugetbench-creator-benchmarks) (unverified)
- Puget's own PugetBench Resolve compare pages show many M4 Max (32-core) results; desktop RTX 5090 values not extracted — [PugetBench compare M4 Max vs RTX 5090](https://www.pugetsystems.com/pugetbench/results/compare/PugetBench%20for%20DaVinci%20Resolve/17/GPU/Apple%20M4%20Max(32%20Cores)/NVIDIA%20GeForce%20RTX%205090/)
- Apple claims M5 Max MacBook Pro is up to 5.4x faster for video effects in DaVinci Resolve Studio vs M1 Max — [PetaPixel, 2026-03-03](https://petapixel.com/2026/03/03/apples-new-macbook-pro-with-m5-pro-and-m5-max-are-supercharged-for-creative-pros/)
- M5 Max media engine: hardware H.264, HEVC, ProRes, ProRes RAW, AV1 decode; two video encode engines and two ProRes encode/decode engines; up to 24 hours video playback (one retailer says 22 hours streaming — conflict); fast charge 50% in 30 min with 96 W+ adapter; up to four external displays — [MacRumors](https://www.macrumors.com/2026/03/03/apple-unveils-macbook-pro-with-m5-pro-and-m5-max-chips-with-neural-accelerators/), [Videomaker](https://www.videomaker.com/news/apple-announces-new-macbook-pro-with-m5-pro-and-m5-max/), [B&H listing](https://www.bhphotovideo.com/c/product/1957186-REG/apple_mbp_m5p_80_14_macbook_pro_m5.html) (search snippets)
- RTX 5090 laptop in a comparison could not complete tests on battery and shut down — [NoobFeed](https://www.noobfeed.com/hardware/m5-max-vs-rtx-5090-laptop)
- Puget's broader Mac vs PC content-creation analysis exists (2024, older) — [Puget Systems: Mac vs PC for content creation 2024](https://www.pugetsystems.com/labs/articles/mac-vs-pc-for-content-creation-2024/) (not read)

### Inferences
- Final Cut Pro is Mac-only (Apple product; not separately sourced in this research). Resolve, Premiere, and CapCut run on both.
- For a creator who edits AI clips (H.264/HEVC/ProRes from cloud models) on the go, a Pro/Max MacBook is the better editing machine; a Windows desktop with a recent RTX card is comparable for Resolve when plugged in, and NVIDIA-specific Resolve AI features (not researched here) may differ.

### Gaps
- No primary Puget article comparing M5 Max vs desktop RTX 5090 Resolve scores was read.
- Did not research CapCut OS feature parity or Premiere-specific GPU acceleration differences.

## 5. If only cloud video models are used (Veo, Kling, Seedance, Runway), does OS matter?

### Takeaway
Largely no. With cloud generation, the heavy compute is off-machine; the remaining differentiators are agent-tooling polish (macOS smoother, Windows best via WSL2), editing (Mac media engines, battery, Final Cut), and Blender/Unreal if used locally.

### Cited Findings
- Topview 3D Builder: building and rendering run locally, need no account and upload nothing; video generation is a separate step — [topviewai/topview-3d-builder README](https://github.com/topviewai/topview-3d-builder)
- LTX Desktop on Apple Silicon runs in API (cloud) mode — [LTX docs](https://docs.ltx.io/open-source-model/getting-started/quick-start) (search snippet)
- Claude Code (the orchestrator) runs on both macOS 13+ and Windows 10 1809+ — [Claude Code docs](https://code.claude.com/docs/en/setup)

### Inferences
- Cloud model web UIs and APIs (Veo, Kling, Seedance, Runway) are browser/HTTP-based and OS-agnostic (general knowledge; no per-vendor OS restriction found).
- In a cloud-only workflow, the MacBook is the more pleasant all-round machine (native agent sandbox, POSIX shell, editing efficiency, battery); the Windows PC is fully adequate and becomes preferable only if local GPU work (ComfyUI, Cycles, Unreal HW RT) is added.

### Gaps
- Did not verify each cloud vendor's desktop apps or upload tools for OS restrictions.

## 6. Tool-specific OS restrictions (Topview 3D Builder, Scenario, ComfyUI Desktop)

### Takeaway
Topview 3D Builder states no OS restriction (needs Python 3.11+, Node 20.6+, uv/pipx, and downloads a headless browser component on first render), so it should run on both. ComfyUI Desktop requires NVIDIA on Windows and Apple Silicon on Mac. Scenario was not verified.

### Cited Findings
- Topview 3D Builder: "a 3D director's stage for AI video"; agent builds a scene, checks it, renders camera views, hands off for video generation; requires "Python 3.11+, Node.js 20.6+, and either uv or pipx"; "The first render downloads a browser component once; after that it is cached"; OS and GPU requirements not stated; install for Claude Code via `claude plugin marketplace add https://github.com/topviewai/topview-3d-builder.git` then `claude plugin install topview-3d-builder@topview-3d-builder`; Cursor via clone to `~/.cursor/plugins/local/`; also ChatGPT/Codex, Qoder, any skills-capable agent via `npx skills add` — [topviewai/topview-3d-builder README](https://github.com/topviewai/topview-3d-builder)
- Repository releases page shows no published releases — [GitHub releases](https://github.com/topviewai/topview-3d-builder/releases) (search snippet)
- Components described as agent skill/plugin, CLI (`topview-3d-cli`), local visual editor (Studio), renderer using Node.js + Chromium outputting PNG frames; projects in `.topview-3d/` — [aiwiki.ai](https://aiwiki.ai/wiki/topview_3d_builder) (secondary)
- Hosted Topview 3D Builder plugin priced at $0.10 per scene — [topview.ai plugin page](https://www.topview.ai/es/3d-builder-plugin) (search snippet)
- Separate ComfyUI extension "ComfyUI-Topview-3D-Builder" (offline 3D scene editor); install instructions clone from a different account (gyx85542-dot) — verify provenance — [comfy.icu listing](https://comfy.icu/extension/topviewai__ComfyUI-Topview-3D-Builder)
- ComfyUI Desktop: Windows 10+ + NVIDIA CUDA GPU; macOS 13+ Apple Silicon M1+; Beta — [ComfyUI docs FAQ](https://docs.comfy.org/installation/desktop/faq) (search snippet)
- HunyuanVideo 1.5 reference code: Linux only, NVIDIA CUDA — [HunyuanVideo-1.5 GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)

### Inferences
- Topview's Node/Chromium renderer and Python CLI are cross-platform stacks; on Windows expect the usual PATH/`uv` friction seen with Blender MCP. Its local renders are previs frames (not GPU-heavy AI inference).
- HunyuanVideo on Windows realistically runs via ComfyUI native nodes rather than the Linux-only reference repo (inference).

### Gaps
- Scenario (scenario.com) OS support not researched — likely web-based, unverified.
- Topview `docs/topview-3d-cli.md` not read; may contain OS notes.

## 7. Which specs to check on each machine, thresholds, and decision framework

### Takeaway
On Windows, the decisive spec is the NVIDIA GPU model and its dedicated VRAM (≥16 GB to do serious local video; 24–32 GB comfortable; 8–12 GB = 5B/quantized 480p only; no NVIDIA = cloud-only). On the Mac, check chip generation/tier (Pro/Max, M4/M5) and unified memory (≥32 GB minimum for any local video, 64 GB+ for 14B models), but expect it to be the editing/agent machine rather than the local-generation box.

### Cited Findings
- VRAM tiers: Wan 2.2 5B FP8 on 8 GB with offload — [wan27.org](https://wan27.org/blog/wan-2-2-requirements-guide); 14B Q4 12 GB @480p, 14B int8 16 GB @720p (20 GB comfortable) — [localaimaster](https://localaimaster.com/blog/wan-vram-requirements-by-gpu); HunyuanVideo 1.5 min 14 GB with offload — [HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5); LTX local ≥16 GB NVIDIA — [LTX docs](https://docs.ltx.io/open-source-model/getting-started/quick-start) (snippet); LTX-2 24 GB practical floor — [localaimaster LTX-2](https://localaimaster.com/blog/ltx-2-local-setup-guide); Wan2.2 TI2V-5B official 24 GB (RTX 4090) — [Wan2.2](https://github.com/Wan-Video/Wan2.2)
- System RAM matters when offloading: 5060 Ti 16 GB with only 32 GB RAM relied heavily on pagefile — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rd90vg/snapshots/2026-02-25T20%3A00%3A13.604354Z) (snippet); disk: LTX-2 19B checkpoints ~43.3 GB — [localaimaster LTX-2](https://localaimaster.com/blog/ltx-2-local-setup-guide)
- Mac: 32 GB+ unified realistic floor — [Earngenix](https://www.earngenix.com/tutorials/vram-hardware-guide-ai-video-comfyui); 64 GB+ suggested — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rd57fb/snapshots/2026-02-25T20%3A00%3A13.604354Z); M4 Max 64 GB usable ~48 GB for models — [localmodel-run](https://localmodel-run.pages.dev/can-i-run/wan-2-1-t2v-14b/apple-m4-max-64gb); M5 Max up to 128 GB, 614 GB/s — [MacRumors](https://www.macrumors.com/2026/03/03/apple-unveils-macbook-pro-with-m5-pro-and-m5-max-chips-with-neural-accelerators/)
- Unreal Nanite on Mac needs M2+ and macOS 15+ — [Epic tech blog](https://www.unrealengine.com/en-US/tech-blog/bringing-unreal-engine-on-macos-up-to-feature-parity-with-windowsprogress-report)
- ComfyUI Desktop on Windows needs NVIDIA (AMD unsupported) — [ComfyUI docs FAQ](https://docs.comfy.org/installation/desktop/faq), [comfyui-wiki](https://comfyui-wiki.com/en/install/install-comfyui/comfyui-desktop-installation-guide)

### Inferences
**How to check specs (standard OS methods; not separately sourced)**
- Windows: run `nvidia-smi` in a terminal (GPU name + total memory), or Task Manager > Performance > GPU ("Dedicated GPU memory"); Settings > System > About (RAM, CPU, Windows version/build — need Win10 1809+ / Win11); check free SSD space (plan 100–300 GB for models). Note whether the GPU is a laptop variant (laptop RTX cards have less VRAM/power than same-named desktop cards) and whether it's NVIDIA vs AMD/Intel (AMD/Intel = ComfyUI Desktop unsupported, effectively cloud-only for video).
- Mac: Apple menu > About This Mac (chip e.g. "M4 Max", memory e.g. "64 GB", macOS version — need macOS 13+ for Claude Code/ComfyUI Desktop, 15+ for Unreal Nanite); for GPU core count, `system_profiler SPDisplaysDataType`. Intel Mac = cloud-only, no ComfyUI Desktop.

**Decision matrix (suggested)**
- Windows has NVIDIA RTX with ≥16 GB VRAM (e.g., 4080/4090/5070 Ti/5080/5090 desktop, or 5090 laptop) + ≥32 GB system RAM (64 GB better): use the PC for local ComfyUI video (Wan/LTX/Hunyuan + depth/pose control), Blender Cycles, Unreal; run Claude Code in WSL2 (sandboxed) or natively with Git for Windows when driving Windows apps via MCP.
- Windows has NVIDIA 8–12 GB (e.g., 3060 12 GB, 4060/4070 8–12 GB): workable for Wan 5B/quantized 14B at 480p and previs; treat 720p/14B as slow; lean on cloud models for finals.
- Windows has no NVIDIA GPU / <8 GB: no meaningful local video; PC is just another agent/edit box.
- Mac is M-series Pro/Max with ≥32 GB (ideally M4/M5 Max, 48–128 GB): best as primary agent-coding + previs (Three.js/Topview, Blender MCP) + editing machine (Resolve/Final Cut/Premiere/CapCut), with cloud video models. Local video possible via GGUF/MLX but expect much slower clips; not the box to iterate on local generation.
- Mac is base M-chip or ≤16 GB: fine for agents, browser previs, cloud generation, light editing; skip local video models.
- Owning both (user's case): split roles — Mac = "director's chair" (Claude Code, scene building, cloud generation, editing); Windows/NVIDIA = "render node" for ComfyUI/Blender (can be driven remotely, e.g., ComfyUI API over LAN). If the PC lacks a ≥12–16 GB NVIDIA GPU, do everything on the Mac with cloud models.

### Gaps
- No primary-source per-GPU seconds-per-clip table across 4070/4090/5090 for a standardized Wan/LTX workflow.
- No measured M5-generation Mac numbers for local video models (Neural Accelerator impact on PyTorch MPS/MLX video unknown).
- Laptop vs desktop VRAM capacities for specific RTX models not sourced in this research.
