# Code/3D as the control layer, video model as the renderer: Microsoft Research's "Code Video Model" and related work (as of 2026-10-31)

Note on access: in this research session, github.com was reachable but arxiv.org, huggingface.co, x.com, researchgate.net and *.github.io project pages were blocked by the network sandbox. Primary verification therefore relied on (a) a full clone of the official code repo, (b) a clone of the project-page source repo, which contains the actual tech report PDF (read in full), and (c) clones of the READMEs of the related projects' official GitHub repos. Items sourced only from search-result snippets or third-party blogs are labeled. arXiv links for older foundational papers are listed from prior knowledge and were NOT fetched in this session.

## 1. Does Code Video Model exist? Title, authors, affiliation, date, models used, code, license

### Takeaway
Yes. "Code Video Model" is a real October 2026 technical report with a public repo, published under Microsoft Research branding. The pasted summary is broadly accurate. The coding agent is OpenAI's GPT-6 Astra (`gpt-6-astra`) driven through the GitHub Copilot CLI. The renderer is the frozen Ref2VA (reference-to-video+audio) variant of MiniMax-H3. The code is Apache-2.0 and the examples are CC BY 4.0. It is not on arXiv: the report is a PDF on the project page with a ResearchGate DOI. The specific X post could not be verified.

### Cited Findings
- **Title:** "Code Video Model". The bibtex is `@misc{liang2026codevideomodel, ... year = {2026}, month = oct, note = {Preprint}, doi = {10.13140/RG.2.2.34014.80961}, url = {https://code-video-model.github.io/tech_report.pdf}}`. There is no arXiv ID. — [CodeVideoModel README](https://github.com/code-video-model/CodeVideoModel)
- **Authors:** Zhiyang Liang, Jiawei Zhang, Gordon Guocheng Qian, Dongdong Chen, and Ziyu Wan (Ziyu Wan is marked "† Project Lead"). The cover page credits the "Code Video Model Team". — [Tech report PDF, "Contributors" section](https://code-video-model.github.io/tech_report.pdf), read from the page-source repo copy at [code-video-model.github.io repo, project-page-template/tech_report.pdf](https://github.com/code-video-model/code-video-model.github.io)
- **Affiliation:** every page of the report has a "Microsoft Research" header. The report does not give per-author affiliations. The project's own Chinese blog post says "微软团队提出 Code Video Model" ("a Microsoft team proposes Code Video Model"). — [Tech report PDF](https://code-video-model.github.io/tech_report.pdf); [project-page source, code_video_model_blog.md](https://github.com/code-video-model/code-video-model.github.io)
- **Date:** the last commit to the project-page repo is 2026-10-12 and the last commit to the code repo is 2026-10-13. This fits "mid-October 2026". — [code repo](https://github.com/code-video-model/CodeVideoModel); [page repo](https://github.com/code-video-model/code-video-model.github.io) (from git log of clones)
- **LLM:** the README says "The Three.js stage uses GPT-6". In the code, `PROGRAM_MODEL = "gpt-6-astra"`. The agent is launched as `copilot ... --model gpt-6-astra --agent video-prompt-threejs --reasoning-effort xhigh --allow-all-tools --autopilot`, i.e. through the GitHub Copilot CLI. — [cvm/__init__.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/__init__.py); [cvm/program.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/program.py)
- The report says "GPT-6 [29] serves as the coding agent". Reference [29] is "OpenAI. GPT-6 Astra System Card. September 2026, deploymentsafety.openai.com/gpt-6-astra". — [Tech report §4.1 and references](https://code-video-model.github.io/tech_report.pdf)
- **Reference-image model:** GPT-Image-2 via OpenRouter. The report says Nano Banana could also be used. — [README](https://github.com/code-video-model/CodeVideoModel); [Tech report §3.1](https://code-video-model.github.io/tech_report.pdf)
- **Video model:** "We use the R2V variant of MiniMax-H3 [8] with all weights frozen. Videos are generated at 960×544 resolution for 5 seconds ... N = 20 sampling steps ... K = 5." The code pins HF repo `MiniMaxAI/MiniMax-H3` at revision `42ed227e...` into `models/MiniMax-H3-ref2va`. The checkpoint holds a `transformer`, a `transformer_ref`, a VAE, an audio VAE, and a Qwen3-VL-based text encoder. — [Tech report §4.1](https://code-video-model.github.io/tech_report.pdf); [configs/h3_checkpoint.json](https://github.com/code-video-model/CodeVideoModel/blob/main/configs/h3_checkpoint.json)
- **Seedance 2.5:** used only in a separate "Generation with Closed-Source Model" demo (§6, Fig. 14, through public APIs). All quantitative results use MiniMax-H3. A search-engine summary saying "the paper's figures name Seedance 2.5 as the generator" is misleading. — [Tech report §6](https://code-video-model.github.io/tech_report.pdf)
- **License:** project code is Apache-2.0 and the bundled examples are CC BY 4.0. Third-party components keep their own terms: Three.js r160 is MIT, and the scene code adapted from CodeVideoBench is MIT. The MiniMax-H3 weights are not bundled. Copilot CLI and GPT-Image-2 are obtained separately, and users pay their own API charges. — [THIRD_PARTY_NOTICES.md](https://github.com/code-video-model/CodeVideoModel/blob/main/examples/LICENSES/THIRD_PARTY_NOTICES.md)
- **Released assets:** the repo includes all inference code: text→Three.js agent harness, renderer (Playwright/Chromium), browser viewer, reference-image generation, H3 generation, pair/edit generation, and the VLM evaluator. It also has 5 example cases. No model weights are trained or released, since the method is training-free. — [README](https://github.com/code-video-model/CodeVideoModel)
- **Benchmark:** CodeVideoBench has 22 cases across 8 categories. It ships Three.js programs, proxy videos, reference images and prompts on Hugging Face. — [README](https://github.com/code-video-model/CodeVideoModel); [HF dataset (not fetched, host blocked)](https://huggingface.co/datasets/code-video-model/CodeVideoBench)
- **Community uptake:** search results list a ComfyUI custom node that adapts the Three.js proxy stage. Only the search snippet was seen; the node was not opened. — [slmonker/ComfyUI-CodeVideo-ThreeJS](https://github.com/slmonker/ComfyUI-CodeVideo-ThreeJS)
- **Claim-by-claim check of the pasted summary:**

| Pasted claim | Verdict | Source |
|---|---|---|
| "Code Video Model (Microsoft Research), released mid-October 2026" | Verified (MSR branding on the report; commits on Oct 12–13, 2026) | [Tech report](https://code-video-model.github.io/tech_report.pdf), [repo](https://github.com/code-video-model/CodeVideoModel) |
| "A coding agent (GPT-6 class models) turns the prompt into executable Three.js code" | Verified: GPT-6 Astra via GitHub Copilot CLI, with iterative visual self-review | [cvm/program.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/program.py) |
| "Code handles scene layout, object motion, camera trajectories, and physics" | Verified with a nuance. "Physics" means dynamics the agent writes as equations in the program (double pendulum, spring recoil, Newton's cradle). No separate physics engine is mandated. | [Tech report §1, §3.1, Fig. 8](https://code-video-model.github.io/tech_report.pdf) |
| "Renders a fast proxy video + reference image" | Verified. The proxy renders in under 1 minute. The reference image is GPT-Image-2 restyling the first or a representative frame, or the user supplies one. | [Tech report abstract, §3.1](https://code-video-model.github.io/tech_report.pdf) |
| "Frozen video model (MiniMax-H3)" | Verified (R2V/Ref2VA variant, weights frozen) | [Tech report §4.1](https://code-video-model.github.io/tech_report.pdf) |
| "Training-free early-step schedule" | Verified: the proxy is attended for the first K=5 of N=20 steps (25%), then removed | [Tech report §3.3](https://code-video-model.github.io/tech_report.pdf), [cvm/video.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/video.py) |
| "Project: code-video-model.github.io" | Exists (source repo cloned; the live host was blocked in this session) | [page repo](https://github.com/code-video-model/code-video-model.github.io) |
| "Post: x.com/guocheng_qian/status/2109445639323140401" | NOT verified. x.com was unreachable and searches found no copy. Guocheng Qian is a listed contributor, so the attribution is plausible. | — |
| "Part of a broader 'Code World Models' wave (AgentGarten, StreamRender, Eden Live, Matrix Game, etc.)" | Largely verified. All exist, with different conditioning designs (see Q4). "StreamRender" is actually "StreamRender-H3" (NVIDIA Labs). "Matrix Game" fits only for Matrix-Game 4.0 (Oct 2026); earlier versions are action-conditioned world models. | see Q4 |

### Inferences
- "Microsoft Research" rests on the report's branding and the team's blog. No microsoft.com page was found or fetched, so the affiliation is self-asserted by the authors. It is probably accurate, but it is not confirmed by an independent Microsoft channel.
- The coding agent is reached through GitHub Copilot CLI with `gpt-6-astra`. Reproducing the "text → program" stage as shipped therefore needs a Copilot plan with GPT-6 Astra access. The "proxy → final video" stage needs only local MiniMax-H3 weights plus a proxy, reference image and prompt. That stage can be run on any user-made proxy, e.g. one rendered from Blender or Unreal at 960×544, 124 frames, 24 fps, H.264.

### Gaps
- The X post content could not be retrieved (x.com blocked; no mirror found).
- The live project page, the HF dataset card and the ResearchGate page were not reachable in-session. Their content was inferred from the repos.
- Individual author affiliations are not stated anywhere I could read.

## 2. Exactly how does the conditioning work, and why do early steps control layout and late steps control appearance? Results and limitations

### Takeaway
It is not SDEdit, and it is not a ControlNet. The clean proxy video goes into MiniMax-H3's native reference pathways: Qwen3-VL multimodal-encoder tokens, plus VAE-latent reference tokens packed into the transformer sequence. These pathways are active only for the first 5 of 20 denoising steps. After that they are deleted from the context, and the remaining 15 steps see only the text prompt and the reference image. Generation starts from pure noise. The authors measured that the proxy's influence on the model's prediction is strongest in the earliest steps and decays afterwards. Keeping the proxy for all steps "copies the flat Three.js look". Putting the same 5 conditioned steps at the end gives little structural control.

### Cited Findings
**The problem being solved**
- "We observe that existing video models tend to copy the flat appearance of the proxy video into the generated clip." When an R2V model gets the proxy as its reference plus a prompt asking for a target look, it "returns the flat Three.js look, which the prompt cannot override". — [Tech report abstract, §1](https://code-video-model.github.io/tech_report.pdf)

**The two native pathways, as formalized**
- In MiniMax-H3, visual references enter through (1) a multimodal encoder pathway Q based on Qwen3-VL and (2) a visual VAE pathway E. The two conditioning states are:
  - C_base = (Q(c, I_r), E(I_r))
  - C_full = (Q(c, I_r, V_c), E(I_r), E(V_c))

  Here I_r is the reference image, V_c is the proxy video, and c is the prompt plus a short instruction naming the roles. — [Tech report §3.2, Eq. 1–2](https://code-video-model.github.io/tech_report.pdf)

**The schedule**
- C_i = C_full if i ≤ K, else C_base, with K=5 and N=20. "The prompt and reference image remain active throughout sampling." The proxy's "conditioning tokens are removed" after step K. — [Tech report §1, §3.3, Eq. 3](https://code-video-model.github.io/tech_report.pdf)

**What the code actually does**
- `generate()` in cvm/video.py:
  - draws the initial video and audio latents from pure Gaussian noise. The RNG stream is named `"sdedit_base_noise"`, but the proxy is never noised into the starting latent.
  - builds `base` (reference image only) and `full` (reference image plus proxy video) conditions.
  - loops `for i in range(STEPS): condition = full if i < keep_steps else base`.
  - uses the native H3 flow-matching schedule ("Expected the native H3 20-update schedule with shifts 12/3", video/audio).
  - VAE-encodes the proxy and the reference image, adds light noise to them (`scheduler.scale_noise(latent, g.keyframe_noise_aug, noise)`), and packs them as extra rows ahead of the generated-video tokens in the transformer input.

  — [cvm/video.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/video.py)
- The code appends this text to the prompt: "The provided image condition is a visual style reference. Transfer its color palette, lighting, texture, material treatment... Do not copy the image's exact composition, object identity, pose, or spatial layout." So the reference image is explicitly framed as appearance-only. — [cvm/video.py, `STYLE_REFERENCE`](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/video.py)
- Fixed output contract: 960×544, 24 fps, 124 frames (about 5.2 s), with generated audio. Defaults: STEPS=20, KEEP_STEPS=5, SEED=42. — [cvm/__init__.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/__init__.py)

**How the proxy and reference image are produced**
- The agent's instructions say the proxy is "a structural Video Condition. Prioritize recognizable semantic objects, camera and composition, depth and occlusion, trajectories, action timing, cuts, and readable materials. Do not chase photorealism."
  - No external textures or images are allowed.
  - A deterministic `seek(t)` is required.
  - After the first build, the agent must make ≥4 refinement passes using VLM review of rendered keyframes and contact sheets: camera/composition, geometry/depth/occlusion, motion/timing, and materials/lighting.
  - The agent must export a per-frame camera trajectory JSON (position, quaternion, fov).

  — [prompts/program.md](https://github.com/code-video-model/CodeVideoModel/blob/main/prompts/program.md); [prompts/camera_contract.md](https://github.com/code-video-model/CodeVideoModel/blob/main/prompts/camera_contract.md)
- The reference image comes from a "strict appearance-only style transfer" of the proxy's first frame by GPT-Image-2 (1536×864). The prompt says to "Preserve exactly every visible object... camera viewpoint... Change only visual appearance: convert existing surfaces to photorealistic PBR materials". — [prompts/reference.txt](https://github.com/code-video-model/CodeVideoModel/blob/main/prompts/reference.txt); [README](https://github.com/code-video-model/CodeVideoModel)

**Why early steps carry structure (the authors' evidence)**
- The authors ran a step-wise sensitivity probe. At cached states of a fully conditioned run, they removed one pathway group and measured the relative change in the model's velocity prediction, S = ||v_full − v_without|| / ||v_full||. Results:
  - The proxy's VAE-pathway sensitivity is strongest early and decays continuously.
  - The proxy's encoder-pathway response drops sharply after the first update and stays weaker.

  — [Tech report §4.3, Eq. 4, Fig. 4a](https://code-video-model.github.io/tech_report.pdf)
- Query-feature visualization at step 15:
  - K=1 gives distinct feature maps and poor structure.
  - K=5 gives feature maps close to K=20 (full).
  - However, K=20 outputs keep the synthetic Three.js style, while K=5 follows the reference appearance.

  — [Tech report §4.3, Fig. 4b](https://code-video-model.github.io/tech_report.pdf)
- Pathway roles: "appearance is more strongly influenced by the encoder pathway, whereas motion is more strongly governed by the VAE pathway." Using both pathways (dual-path) beats either one alone. — [Tech report §4.3, Fig. 7, Table 5](https://code-video-model.github.io/tech_report.pdf)
- Independent prior evidence: a camera-control analysis of video DiTs (AC3D) found camera motion is set very early in denoising (about the first 10%) and lives mostly in low frequencies. On that basis it restricts camera conditioning to early steps and blocks. — [arXiv 2411.18673 (AC3D), via search snippet](https://www.arxiv.org/pdf/2411.18673)
- Background (prior knowledge, not fetched):
  - SDEdit edits by noising a guide image to an intermediate level and denoising. Low noise preserves the guide; high noise lets the prior rewrite it. — [SDEdit, arXiv 2108.01073](https://arxiv.org/abs/2108.01073)
  - Diffusion models are known to form coarse content at high noise and fine detail at low noise. — [Perception Prioritized Training, arXiv 2204.00227](https://arxiv.org/abs/2204.00227); [eDiff-I, arXiv 2211.01324](https://arxiv.org/abs/2211.01324)

**Quantitative results**

Scores are on CodeVideoBench: 22 cases, each scored 0–100 by a VLM judge on Structure, Style and Quality, with overall = mean.
- Overall scores. "Learned" baselines were trained for a specific control signal; "training-free" ones reuse the same frozen MiniMax-H3. — [Tech report Table 1](https://code-video-model.github.io/tech_report.pdf)

  | Method | Control signal / base model | Qwen-27B | GPT-5.6 | GPT-6 |
  |---|---|---|---|---|
  | **Code Video Model** | proxy, early-step (H3) | **85.17** | **82.09** | **85.82** |
  | VACE | depth (Wan) | 74.29 | 73.10 | 80.59 |
  | Go-with-the-Flow | optical flow (CogVideoX) | 48.48 | 55.23 | 65.84 |
  | Diffusion as Shader | 3D tracking (CogVideoX) | 59.28 | 67.66 | 72.90 |
  | H3 text-to-video | prompt only | 63.80 | 67.59 | 69.09 |
  | H3 R2V | proxy at all steps | 75.22 | 78.72 | 80.94 |
  | H3 SDEdit | noised proxy latent | 64.37 | 68.66 | 69.22 |

- Dimension breakdown (Qwen-27B judge). Code Video Model does not have the best Structure; it wins by keeping Structure fairly high while recovering Style. — [Tech report Table 4](https://code-video-model.github.io/tech_report.pdf)

  | Method | Structure | Style | Quality |
  |---|---|---|---|
  | Code Video Model | 81.98 | 80.33 | 93.20 |
  | SDEdit | 93.92 | 10.34 | 88.86 |
  | R2V (full-step) | 87.67 | 57.07 | 80.91 |
  | VACE | 78.74 | 57.59 | 86.55 |

- Schedule ablation (overall, Qwen-27B). Noising the proxy condition at σ=0.6 for all steps is the strongest alternative. — [Tech report Table 2, Table 6](https://code-video-model.github.io/tech_report.pdf)

  | Configuration | Overall (Qwen-27B) |
  |---|---|
  | first 5 steps (default) | 85.17 |
  | first 7 steps | 82.91 |
  | first 3 steps | 81.83 |
  | all 20 steps | 75.22 |
  | last 5 steps | 69.43 |
  | no proxy | 71.32 |
  | no reference image | 61.52 |
  | proxy noised to σ=0.6, all steps | 82.74 |

- Blinded user study, overall scores: Code Video Model 8.17, R2V 7.64, VACE 7.00, SDEdit 6.85, T2V 6.70, Diffusion as Shader 6.55, Go-with-the-Flow 5.32. On Structure alone, Code Video Model scored 6.92, below SDEdit (8.64) and R2V (7.81). The number of raters and the scale are not stated beyond "volunteers". — [Tech report Table 3](https://code-video-model.github.io/tech_report.pdf)

**Stated limitations**
- "Exact correspondence remains challenging in applications that require frame-by-frame and pixel-level alignment." When the reference image and proxy have "substantially different topologies", the model keeps the composition and motion but "may not reproduce every object boundary, pose, or spatial relation exactly". This matters for "strict compositing, paired supervision, and geometry-sensitive editing." — [Tech report §8](https://code-video-model.github.io/tech_report.pdf)
- Coupled conditioning: a nighttime reference darkens outputs, but "blue recoloring largely reverts to the warm daylight palette", so "proxy guidance and the pretrained prior can override particular reference-image edits". With mismatched subjects, "outputs retain the synthetic proxy subject while adding a realistic reference-only subject." — [Tech report §4.3, Fig. 11](https://code-video-model.github.io/tech_report.pdf)

### Inferences
- **Plain-language mechanism.** A diffusion or flow video model starts from TV static and removes noise over 20 passes.
  - Early passes are taken at very high noise. Each pass mainly decides the big, blurry, low-frequency facts: where things are, how they move, and where the camera goes.
  - Later passes, at lower noise, commit to edges, textures, materials and lighting.
  - Code Video Model shows the model the gray-box proxy only during the first 5 passes. That is long enough to lock in "the car is here and turns left while the camera orbits".
  - It then hides the proxy. For the last 15 passes the model sees only the prompt and the photoreal reference image, so it paints realistic surfaces onto an already-decided layout instead of copying the flat gray materials.
- **Why this differs from SDEdit.** SDEdit pushes the proxy's own pixels, partly noised, into the starting point. That forces a single trade-off knob: low noise keeps structure but also the flat look, and high noise frees the look but loses structure (SDEdit Style = 10.34). Early-step conditioning keeps the proxy clean but limits the time window during which the model can "look at" it.
- **Why this differs from ControlNet/VACE.** Those add trained modules that inject depth or pose at every step. Code Video Model trains nothing. It relies on H3's existing reference-video input, which was trained for real reference videos, and makes the out-of-distribution proxy usable by limiting its exposure.
- **The noise schedule (my own calculation).** The repo asserts H3's native timestep shift of 12. If H3 uses the standard SD3-style shift formula σ' = 12s/(1+11s) on a uniform 20-step grid, the first 5 steps span σ ≈ 1.00 → 0.97. Even step 15 is still at σ ≈ 0.80, and σ drops below 0.5 only in the last ~2 steps. So "the first 25% of steps" are all taken at near-pure noise, exactly where low-frequency layout and motion are decided. This is my inference from the shift value and was not reported by the authors.
- **Structure is "soft".** Because the proxy is removed after step 5, later steps can drift from it. That fits Code Video Model's lower Structure scores relative to full-step R2V and SDEdit. In practice the method trades some geometric fidelity for appearance.

### Gaps
- The report does not quantify the `keyframe_noise_aug` level applied to the reference latents, wall-clock generation time for H3, or VRAM needs. The code defaults to two GPUs (text encoder on `cuda:1`, generator on `cuda:0`) with CPU offload.
- How conditioning was done for the Seedance 2.5 closed-API demo is not described. A public API presumably cannot apply a per-step schedule.
- The number of user-study participants is not given.
- No per-category breakdown is given, e.g. physics versus gaming.

## 3. The broader family of structure-conditioned video generation usable today, and which accept a gray-box proxy video

### Takeaway
Three families can consume a 3D or "gray-box" previs today:
- **(a) Extract signals from the proxy.** Render or extract depth, pose, edges, flow or 3D tracks from the proxy and feed them to a trained control model: VACE, Wan Fun Control, Diffusion as Shader, Go-with-the-Flow.
- **(b) Use explicit camera control** from the 3D camera path: CameraCtrl, MotionCtrl, Uni3C, ReCamMaster, and vendor camera tools.
- **(c) Feed the proxy video itself** to a video-to-video or reference-video model: MiniMax-H3 R2V (with Code Video Model's schedule), Runway Aleph, Luma Modify Video, Kling reference modes, EdenLive, Matrix-Game 4.0.

Only (c) takes the raw gray-box render directly. (a) needs the 3D scene to export depth, normals, segmentation or poses, which a Three.js, Blender or Unreal previs can do trivially.

### Cited Findings
**Signal-based control, (a), as used in the paper's baselines**
- VACE (Alibaba) unifies references, depth, pose and mask conditions. Code Video Model used VACE with depth derived from the program as its strongest learned baseline. — [Tech report §2, §4.1](https://code-video-model.github.io/tech_report.pdf); [VACE arXiv 2503.07598 (not fetched)](https://arxiv.org/abs/2503.07598); [ali-vilab/VACE GitHub (not fetched)](https://github.com/ali-vilab/VACE)
- Go-with-the-Flow encodes motion through flow-warped noise. Diffusion as Shader uses 3D-aware control rendered from tracking signals. Both were baselines, with "all control signals derived from the same underlying program." — [Tech report §2, §4.1](https://code-video-model.github.io/tech_report.pdf); [Go-with-the-Flow arXiv 2501.08331](https://arxiv.org/abs/2501.08331); [Diffusion as Shader arXiv 2501.03847](https://arxiv.org/abs/2501.03847)
- The foundational image-level method is ControlNet, a trained copy of the encoder injecting a spatial condition (depth, edges, pose) at every step. — [ControlNet arXiv 2302.05543 (prior knowledge, not fetched)](https://arxiv.org/abs/2302.05543)
- Wan "Fun Control" models (Canny, depth, pose, MLSD and camera-trajectory control on Wan 2.1/2.2) are distributed through Alibaba PAI's VideoX-Fun. — [VideoX-Fun GitHub (prior knowledge, not fetched)](https://github.com/aigc-apps/VideoX-Fun)

**Camera control, (b)**
- CameraCtrl (Plücker-embedding camera conditioning), MotionCtrl (camera plus object trajectories), Uni3C (point-cloud-guided camera plus human-motion control) and ReCamMaster (re-rendering an existing video along a new camera path) are 2024–2025 research models with public code. — [CameraCtrl arXiv 2404.02101](https://arxiv.org/abs/2404.02101); [MotionCtrl arXiv 2312.03641](https://arxiv.org/abs/2312.03641); [Uni3C arXiv 2504.14899](https://arxiv.org/abs/2504.14899); [ReCamMaster arXiv 2503.11647](https://arxiv.org/abs/2503.11647) (all from prior knowledge; not fetched this session)

**Raw-proxy, video-to-video, (c)**
- **MiniMax-H3 open weights** (33B, 768p plus stereo audio) arrived on Hugging Face and ModelScope on 2026-08-03. They come with T2V, I2V and reference-to-video (Ref2VA) variants and native ComfyUI workflows. Code Video Model's early-step trick runs on this Ref2VA path. — [ComfyUI Wiki news, 2026-08-03](https://comfyui-wiki.com/en/news/2026-08-03-minimax-h3-open-weights-comfyui); [Gigazine](https://gigazine.net/gsc_news/en/20260803-minimax-h3-video-generation-ai); [cvm/video.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/video.py)
- **Closed models:** the paper ran its pipeline on Seedance 2.5 through public APIs, which "suggest[s] that code-driven scene specification extends beyond MiniMax-H3." — [Tech report §6](https://code-video-model.github.io/tech_report.pdf)
- **Runway Aleph** is Runway's Gen-4-based video-to-video editing model that preserves source motion and timing while applying text edits. "Runway Aleph 2" is listed by API aggregators with keyframe and image guidance. Luma "Modify Video" (Ray 2-based) restyles existing footage with emphasis on structural similarity. Kling's O-series reference/Omni modes are positioned for object and character replacement. All of this is third-party, secondhand information. — [atlabs.ai comparison](https://www.atlabs.ai/blog/runway-aleph-vs-luma-modify-video); [Scenario help: Luma Modify Video](https://help.scenario.com/articles/4556939523-luma-modify-video-the-essentials); [layer.ai: Runway Aleph 2](https://layer.ai/docs/models/runway-aleph2); [seedance.tv roundup](https://www.seedance.tv/fr/blog/best-ai-video-to-video-models-2026)
- A French aggregator reports Kling 4.0 was announced 2026-09-28 with keyframe control and an Omni reference mode. This is unconfirmed by any official Kling source. — [seedance.tv roundup](https://www.seedance.tv/fr/blog/best-ai-video-to-video-models-2026)
- **EdenLive (VAST)** takes "reference videos" from a program or engine and renders "enhanced videos in real time at 24 fps or higher, even on a consumer GPU (RTX 5090)". Weights are open (5B on Wan2.2-TI2V-5B at 720p; 14B on Wan2.1-I2V-14B at 480p), Apache-2.0. Proxy frames are embedded with a "proxy-DINO" vision encoder. — [VAST-AI-Research/EdenLive README](https://github.com/VAST-AI-Research/EdenLive)
- **Matrix-Game 4.0 (Skywork):** "The game engine owns gameplay, physics and input. A causal video model renders the clean low-poly RGB stream." Optimized presets reach up to 67 FPS on an RTX 5080 at 864×480. — [SkyworkAI/Matrix-Game, Matrix-Game-4 README](https://github.com/SkyworkAI/Matrix-Game/tree/main/Matrix-Game-4)

### Inferences
- **For a user with a gray-box previs today:**
  - The most direct open path is MiniMax-H3 Ref2VA plus the Code Video Model repo. Its `generate_video` step accepts any 960×544/124-frame/24 fps H.264 proxy, not just agent-written Three.js.
  - Second is Wan-VACE or Fun Control with depth or pose exported from the previs scene.
  - Third is closed V2V tools (Aleph, Modify, Kling reference). These take the render directly but expose only an overall strength or adherence control, with no per-step schedule.
- **Rule of thumb from the paper's numbers:** signal-based control (depth etc.) keeps geometry well but needs a trained adapter per signal. Raw-proxy V2V with full conditioning leaks the gray look. Strength sliders behave like SDEdit's single trade-off knob.

### Gaps
- I could not verify current (Oct 2026) product specifics for Runway, Luma or Kling camera-control and V2V features from official pages. Only aggregator snippets were seen.
- Wan 2.5/2.6-era VACE or Fun Control releases after mid-2026 were not checked.
- It is unverified whether ComfyUI's native H3 Ref2VA node exposes a way to drop the reference video after K steps, e.g. by chaining two samplers.

## 4. Verification of ATAS, MotionBricks, and the "code world model" projects; are "GPT-6" and "MiniMax-H3" real?

### Takeaway
All named items exist. ATAS is accurately described. MotionBricks is real and open, but "recently open-sourced" overstates it: the initial release was 2026-04-27, and the training pipeline is still on the roadmap. The "pairs well with a Gemini planner" claim has no source and looks like editorializing. "StreamRender" is NVIDIA Labs' StreamRender-H3, "Eden Live" is VAST's EdenLive, and "Matrix Game" fits the code-world pattern only in Matrix-Game 4.0. GPT-6 (as "GPT-6 Astra", Sept 2026) and MiniMax-H3 (open weights Aug 2026) are both real, according to multiple outlets.

### Cited Findings
**ATAS**
- "Any Time, Any Space: A World-State-Centric Framework for Agentic Video Generation", arXiv 2610.20571. Authors are Weijie Wang, Haomin Zhang et al. (Zhejiang University, Monash, BAIR/UC Berkeley, Adelaide University), under an MIT license.
- How it works: a world-state compiler turns a screenplay into shot requests (scene, camera, time, event). A scene memory holds static geometry in one shared frame, and an event memory indexes dynamic observations by scene, event and time. "The world changes only when film review, registration and the state check all pass."
- Code released: a CPU client plus a GPU geometry service (about 20 GB), using Pi3X and SAM3. The client needs a `DASHSCOPE_API_KEY` (Alibaba Cloud) and an LLM endpoint.
- Sources: [ziplab/ATAS README](https://github.com/ziplab/ATAS); [arXiv 2610.20571 (not fetched)](https://arxiv.org/abs/2610.20571); [hyper.ai summary](https://hyper.ai/en/papers/2610.20571)
- Aggregator note: across four video-generator backbones ATAS reportedly improved all inter-shot consistency metrics, but the abstract does not name the backbones or the six human-rating criteria. — [aiweekly.co](https://aiweekly.co/alerts/atas-tops-all-six-human-rating-criteria-for-long-form-video)

**MotionBricks (NVIDIA)**
- "MotionBricks: Scalable Real-Time Motions with Modular Latent Generative Model and Smart Primitives", arXiv 2604.24833, SIGGRAPH 2026 / TOG. It claims "zero-shot motion synthesis at 15,000 FPS". News: "2026-04-27 — Initial public release: interactive demo, pretrained checkpoints (VQVAE · pose · root), synthetic training code". Roadmap: full training pipeline in GR00T-WBC/GEAR-SONIC is still pending.
- License: Apache-2.0 for code and the NVIDIA Open Model License for weights.
- It generates skeletal character motion for animation and robotics (Unitree G1), not video.
- Sources: [NVlabs/GR00T-WholeBodyControl/motionbricks README](https://github.com/NVlabs/GR00T-WholeBodyControl/tree/main/motionbricks); [project page](https://nvlabs.github.io/motionbricks/); [xbpeng.github.io project](https://xbpeng.github.io/projects/MotionBricks/index.html); [Gigazine 2026-06-15](https://wbgsv0a.gigazine.net/gsc_news/en/20260615-nvidia-motionbricks/)
- No source found pairing MotionBricks with a Gemini planner. The README has no mention of Gemini, LLMs or planners. — [motionbricks README](https://github.com/NVlabs/GR00T-WholeBodyControl/tree/main/motionbricks)

**AgentGarten (MirroS Lab)**
- "Code Worlds for Evolving Agents", arXiv 2610.12374, released 2026-10-08, Apache-2.0.
- Simulators and game engines hold state, and a shared neural renderer generates observations "from the depth and surface normals each world exports". The renderer adapts NVIDIA Cosmos3-Nano with the Wan 2.2 VAE (bidirectional → autoregressive → "Adversarial Forcing" few-step distillation).
- The renderer code is released. The code worlds and the agent loop are "will be released".
- Sources: [MirroS-Lab/AgentGarten README](https://github.com/MirroS-Lab/AgentGarten); [Awesome-Code-World-Models list](https://github.com/Danzer1xxxxChan/Awesome-Code-World-Models)

**StreamRender-H3 (NVIDIA Labs, Sana / Sol-Engine)**
- "Code runs the world; a video model renders it." It takes a semantic map from a code game engine and generates full appearance with a two-step streaming renderer built on MiniMax-H3 Ref2VA.
- Claimed latency is 218 ms diffusion render (down from 799.7 ms) and 23.8 ms VAE decode, on GB200 per the project page; these are self-reported.
- It was merged into the Sana project site on 2026-10-11. A HF model `Efficient-Large-Model/StreamRender-H3` is listed in search results (not fetched).
- Sources: [NVlabs/Sana PR #533](https://github.com/NVlabs/Sana/pull/533); [project page (not fetched)](https://nvlabs.github.io/Sana/Sol-Engine/StreamRender-H3/); [HF model (not fetched)](https://huggingface.co/Efficient-Large-Model/StreamRender-H3); [AI Tamer write-up (snippet)](https://aitamer.news/posts/nvlabs-streamrender-h3-generative-renderer/)

**EdenLive (VAST / Tripo, "Project Eden")**
- "EdenLive: Real-Time Generative Rendering from Any Visual Reference". It decouples "state evolution (maintained by coding agents or engines) and appearance (rendered by EdenLive)".
- Open 5B and 14B weights (Wan-based), streaming code, and an "EdenGolem" prompt-to-playable-game skill. Apache-2.0. Last commit 2026-10-20.
- Sources: [VAST-AI-Research/EdenLive README](https://github.com/VAST-AI-Research/EdenLive); [HF VAST-AI/EdenLive (not fetched)](https://huggingface.co/VAST-AI/EdenLive)

**Matrix-Game (Skywork)**
- Matrix-Game 1.0 (May 2025), 2.0 (Aug 2025) and 3.0 (Mar 27, 2026) are action-conditioned interactive world models, not code-driven. 3.0 is based on Wan2.2-TI2V-5B, Apache-2.0. — [SkyworkAI/Matrix-Game](https://github.com/SkyworkAI/Matrix-Game); [search summary of HF card](https://huggingface.co/Skywork/Matrix-Game-3.0/blob/main/README.md)
- Matrix-Game 4.0 (arXiv 2610.27999, Oct 2026) is code-driven. It covers "streaming neural rendering for executable low-poly games" across three demo games (Medieval Castle, Ancient Egypt, City Racing), with RTX 5090/5080/5070 Ti presets added 2026-10-15/16. — [Matrix-Game-4 README](https://github.com/SkyworkAI/Matrix-Game/tree/main/Matrix-Game-4)

**Other code-world projects cited by the Code Video Model report itself**
- Code World Model: "Coding Agent as World Brain", arXiv 2608.25927, 2026-08-26 (Westlake University AGI Lab and NTU). Released: inference code plus a public CWM LoRA for MiniMax-H3 BF16 Ref2VA. Its condition is an RGB anchor picture plus a Depth + Semantic-ID video, so this one is trained (LoRA), unlike Code Video Model. — [buaacyw/code-world-model README and INFERENCE.md](https://github.com/buaacyw/code-world-model); [Tech report ref. 22](https://code-video-model.github.io/tech_report.pdf)
- Programmable World Model: arXiv 2609.10540 (AlayaLab). State is held as state-augmented 3D OBBs and compiled into pixel-aligned controls. Its PROWBench benchmark came out 2026-10-11. Inference code and weights are NOT released (roadmap unchecked). — [AlayaLab/pwm README](https://github.com/AlayaLab/pwm); [Tech report ref. 23](https://code-video-model.github.io/tech_report.pdf)

**GPT-6**
- Real, as "GPT-6 Astra". OpenAI launched it on 2026-09-03/04 with API ID `gpt-6-astra`, under restricted or trusted access (reportedly the first OpenAI model rated "Critical" for cyber under its Preparedness Framework). Reported price: $10/$50 per M input/output tokens. — [Fox Business](https://www.foxbusiness.com/technology/openai-unveils-gpt-6-astra-major-advances-ai-capabilities); [Xinhua, 2026-09-04](https://www.news.cn/tech/20260904/52716c2faaa64d228cc311a10acc4a6a/c.html); [apiyi docs](https://docs.apiyi.com/en/news/gpt-6-astra-launch)
- The Code Video Model report also uses "GPT-5.6" as a judge model. That name was not independently verified here. — [Tech report §4.1](https://code-video-model.github.io/tech_report.pdf)

**MiniMax-H3**
- Real. The API launched 2026-07-31 and open weights followed 2026-08-03 (H3-Base, 33B dense, 768p plus stereo audio). The 2K upscaler stays hosted-only. — [ComfyUI Wiki](https://comfyui-wiki.com/en/news/2026-08-03-minimax-h3-open-weights-comfyui); [Gigazine](https://gigazine.net/gsc_news/en/20260803-minimax-h3-video-generation-ai)
- License: the "MiniMax H3 Community License". Multiple secondary sources say it excludes the US, EU, UK and South Korea from the "Applicable Territory", and caps free commercial use at $20M annual revenue. The primary license text was not read. — [WaveSpeed](https://wavespeed.ai/blog/minimax-h3/minimax-h3-community-license/); [Comfy support](https://support.comfy.org/articles/6065098425-minimax-commercial-licensing-who-needs-a-license-and-how-to-get-one); [aiweekly.co (FR)](https://aiweekly.co/fr/alerts/minimax-ouvre-les-poids-de-h3-mais-exclut-us-ue-uk-et-core)

### Inferences
- The "Code World Models" wave splits into two conditioning philosophies:
  - **Trained renderers** take an engineered intermediate signal: CWM (H3 + LoRA on depth/semantic ID), StreamRender-H3 (semantic maps, distilled), AgentGarten (depth + normals on Cosmos3-Nano), PWM (3D OBB controls), EdenLive (DINO-encoded proxy frames).
  - **Training-free** use of the raw RGB proxy: Code Video Model. Matrix-Game 4.0 also consumes a clean low-poly RGB stream, but with its own trained causal model.
- MiniMax-H3 Ref2VA has become a common backbone for this wave: Code Video Model, CWM and StreamRender-H3 all build on it. Its community license (territory exclusions, if confirmed) is therefore a practical constraint for US, EU or UK users running these pipelines locally.
- ATAS and MotionBricks are adjacent, not code-to-video renderers. ATAS is multi-shot world memory. MotionBricks would supply character animation inside an engine or Three.js previs, which a proxy-then-render pipeline could then restyle.

### Gaps
- No primary source was found for "MotionBricks + Gemini planner". It may come from a social-media demo that could not be located.
- The StreamRender-H3 weights and HF card could not be opened (host blocked).
- The ATAS backbone list and human-eval numbers need the arXiv PDF (blocked).
- The MiniMax H3 license territory clause was not read from the primary text.

## 5. Known weaknesses of the proxy-then-render approach

### Takeaway
The main documented weaknesses are:
- Soft or inexact structure adherence: no pixel-level alignment, and it drifts on topology mismatches.
- Coupling or leakage between proxy and reference: flat-look leakage if conditioned too long, and reference edits overridden by the prior.
- Short fixed-length clips: about 5 s at 960×544.
- Heavy compute and gated dependencies: a ~210 GB checkpoint, multiple GPUs, and a restricted-access frontier LLM.
- Evaluation that rests largely on VLM judges.

Identity drift and texture flicker across shots are not specifically measured in the Code Video Model report.

### Cited Findings
- **No pixel-exact correspondence; topology mismatches.** "May not reproduce every object boundary, pose, or spatial relation exactly." This is unsuitable for "strict compositing, paired supervision, and geometry-sensitive editing." — [Tech report §8](https://code-video-model.github.io/tech_report.pdf)
- **Proxy appearance leakage.** It is the core motivating failure: full-step R2V Style is 57.07 versus 80.33 for Code Video Model, and SDEdit Style is 10.34 (Qwen judge). Too-short exposure (K=3) loses structure: 67.18 versus 81.98. — [Tech report Tables 4, 6](https://code-video-model.github.io/tech_report.pdf)
- **Proxy-subject leakage on mismatch.** With mismatched subjects, "outputs retain the synthetic proxy subject while adding a realistic reference-only subject." — [Tech report §4.3, Fig. 11a](https://code-video-model.github.io/tech_report.pdf)
- **Reference edits can be overridden.** "Blue recoloring largely reverts to the warm daylight palette." — [Tech report §4.3, Fig. 11b](https://code-video-model.github.io/tech_report.pdf)
- **Structure fidelity is lower than in structure-maximizing baselines.** In the user study, Code Video Model's Structure score was 6.92, versus SDEdit 8.64 and R2V 7.81. — [Tech report Table 3](https://code-video-model.github.io/tech_report.pdf)
- **Physics plausibility is only as good as the program.** Dynamics are "grounded wherever a mathematical description exists". The final clip's physics follows the proxy only as strictly as soft structure adherence allows. — [Tech report §1](https://code-video-model.github.io/tech_report.pdf)
- **Fixed clip format.** 124 frames at 24 fps, 960×544, single shot. The code rejects other proxy formats. — [cvm/__init__.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/__init__.py)
- **Compute and cost.**
  - The H3 checkpoint verification "reads about 210 GB". — [download_h3.py](https://github.com/code-video-model/CodeVideoModel/blob/main/download_h3.py)
  - The default run uses `cuda:1` for the text encoder and `cuda:0` for generation, with CPU offload. — [inference/generate_video.py](https://github.com/code-video-model/CodeVideoModel/blob/main/inference/generate_video.py)
  - The agent stage runs GPT-6 Astra at `--reasoning-effort xhigh` with multiple VLM review passes. — [cvm/program.py](https://github.com/code-video-model/CodeVideoModel/blob/main/cvm/program.py)
  - GPT-6 Astra is reported at $10/$50 per M tokens with restricted access. — [apiyi docs](https://docs.apiyi.com/en/news/gpt-6-astra-launch)
- **Latency.** The proxy renders in "less than a minute". No figure is given for the H3 generation stage. — [Tech report abstract](https://code-video-model.github.io/tech_report.pdf)
- **Real-time variants.** These trade quality for speed through distillation: StreamRender-H3 claims 218 ms per chunk on GB200 [PR #533](https://github.com/NVlabs/Sana/pull/533); EdenLive claims ≥24 fps on an RTX 5090 [EdenLive README](https://github.com/VAST-AI-Research/EdenLive); Matrix-Game 4.0 claims up to 67 FPS on an RTX 5080 at 864×480 [Matrix-Game-4 README](https://github.com/SkyworkAI/Matrix-Game/tree/main/Matrix-Game-4).
- **Multi-shot consistency is an open problem.** ATAS exists precisely because passing prompts or recent frames between shots "does not provide a shared spatial frame for revisiting a scene or a time-indexed record". — [hyper.ai summary of ATAS](https://hyper.ai/en/papers/2610.20571); [ziplab/ATAS](https://github.com/ziplab/ATAS)
- **Evaluation caveats.**
  - CodeVideoBench is small (22 cases) and built by the same agent pipeline ("an agent-generated program defines structure ... a restyled representative frame defines appearance").
  - Scores come from VLM judges (QwenVL-3.8-27B, GPT-5.6, GPT-6). GPT-6 is also the coding agent.
  - Sources: [Tech report §4.1](https://code-video-model.github.io/tech_report.pdf); [prompts/evaluation](https://github.com/code-video-model/CodeVideoModel/tree/main/prompts/evaluation)

### Inferences
- **Identity drift and texture flicker within a clip.** Nothing in the report measures these directly. The Quality rubric does penalize "texture crawling", "flicker" and "identity/count persistence", and Code Video Model scored 90–93 on Quality. That suggests within-clip flicker is not a dominant failure for 5 s clips, but this is judged by VLMs rather than measured. Across clips and shots, nothing ties identity together except reusing the same reference image. Expect drift without something like ATAS.
- **Proxy artifacts leaking through.** Beyond the flat look, any proxy defect (interpenetrating geometry, wrong scale, bad occlusion) is "structure". The model tends to follow it in the early steps, and the later steps can only partially fix it. The agent's ≥4 VLM-review passes exist to catch these before generation.
- **Rights and licensing.** Using H3 locally in the US, EU or UK may be barred by the H3 Community License, if the secondary reports are accurate. That is a non-technical but decisive weakness for some users. The alternatives are Wan-based (VACE, EdenLive) or closed APIs, where the early-step schedule cannot be applied.
- **Cost.** One clip requires a frontier-LLM agentic coding session plus one image-model call plus a 33B video-model run on multi-GPU hardware. Iteration is cheap only at the proxy stage, which is the authors' "fast previs" argument.

### Gaps
- No measured wall-clock or VRAM numbers for the H3 stage in Code Video Model.
- No quantitative identity-drift or flicker metrics, and no multi-shot evaluation.
- No independent replication of the CodeVideoBench results was found.
- No human-rater count for the user study.
