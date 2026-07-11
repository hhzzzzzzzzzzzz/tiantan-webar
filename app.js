const TARGETS = [
  { name: "第 6 页 · 祈年殿时空场", image: "#target-temple" },
  { name: "第 22 页 · 共享古今海报场", image: "#target-poster" },
  { name: "第 27 页 · 市井生活场", image: "#target-city" },
];

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "start";
const previewIndex = Math.max(0, Math.min(2, Number(params.get("target") || 0)));

const sceneRoot = document.getElementById("scene-root");
const startPanel = document.getElementById("start-panel");
const status = document.getElementById("status");
const statusText = document.getElementById("status-text");
const targetSwitcher = document.getElementById("target-switcher");
const homeButton = document.getElementById("home-button");
const modeLabel = document.getElementById("mode-label");

const setStatus = (text, state = "ready") => {
  statusText.textContent = text;
  status.dataset.state = state;
};

const targetPlane = (source) => `
  <a-image src="${source}" width="1.36" height="0.68" position="0 0 -0.034"
    material="shader: flat; transparent: false"></a-image>`;

const qinianHall = () => {
  const columns = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2;
    const x = Math.cos(angle) * 0.120;
    const y = Math.sin(angle) * 0.120;
    return `<a-cylinder position="${x.toFixed(4)} ${y.toFixed(4)} 0.122" radius="0.008" height="0.145" rotation="90 0 0" color="#a84036" roughness="0.74"></a-cylinder>`;
  }).join("");

  return `
    <a-entity class="qinian-hall">
      <a-cylinder position="0 0 0.012" radius="0.215" height="0.024" rotation="90 0 0" color="#d8d1c0"></a-cylinder>
      <a-cylinder position="0 0 0.032" radius="0.178" height="0.020" rotation="90 0 0" color="#f0eadc"></a-cylinder>
      <a-cylinder position="0 0 0.049" radius="0.145" height="0.017" rotation="90 0 0" color="#faf5e9"></a-cylinder>
      <a-cylinder position="0 0 0.114" radius="0.058" height="0.130" rotation="90 0 0" color="#8c302b" roughness="0.82"></a-cylinder>
      ${columns}
      <a-cylinder position="0 0 0.183" radius="0.172" height="0.015" rotation="90 0 0" color="#184a56"></a-cylinder>
      <a-cone position="0 0 0.211" radius-bottom="0.166" radius-top="0.068" height="0.060" rotation="90 0 0" color="#1f5360" metalness="0.18" roughness="0.50"></a-cone>
      <a-torus position="0 0 0.242" radius="0.109" radius-tubular="0.010" color="#d7aa42" metalness="0.34" roughness="0.42"></a-torus>
      <a-cylinder position="0 0 0.262" radius="0.112" height="0.013" rotation="90 0 0" color="#215c67"></a-cylinder>
      <a-cone position="0 0 0.287" radius-bottom="0.112" radius-top="0.046" height="0.052" rotation="90 0 0" color="#2d6874" metalness="0.18" roughness="0.50"></a-cone>
      <a-torus position="0 0 0.314" radius="0.072" radius-tubular="0.008" color="#d7aa42" metalness="0.34" roughness="0.42"></a-torus>
      <a-cylinder position="0 0 0.331" radius="0.074" height="0.012" rotation="90 0 0" color="#347984"></a-cylinder>
      <a-cone position="0 0 0.354" radius-bottom="0.074" radius-top="0.018" height="0.046" rotation="90 0 0" color="#3a7780" metalness="0.18" roughness="0.50"></a-cone>
      <a-cylinder position="0 0 0.389" radius="0.008" height="0.040" rotation="90 0 0" color="#e9bc4e" metalness="0.44"></a-cylinder>
      <a-sphere position="0 0 0.414" radius="0.014" color="#e9bc4e" metalness="0.44"></a-sphere>
      <a-box width="0.150" height="0.052" depth="0.017" position="0 -0.161 0.048" color="#eee7d9"></a-box>
    </a-entity>`;
};

const templeScene = (spinning = true) => `
  <a-entity class="effect temple-scene" model-intro>
    <a-plane width="1.23" height="0.60" position="0 0 -0.024" color="#07162b" opacity="0.28"></a-plane>
    <a-ring position="0 0 0.010" radius-inner="0.38" radius-outer="0.392" color="#d7ab45" opacity="0.72"
      animation="property: rotation; to: 0 0 360; loop: true; dur: 18000; easing: linear"></a-ring>
    <a-ring position="0 0 0.016" radius-inner="0.47" radius-outer="0.477" color="#7cc0c9" opacity="0.38"
      animation="property: rotation; to: 0 0 -360; loop: true; dur: 26000; easing: linear"></a-ring>
    <a-entity class="temple-world" ${spinning ? "world-rotate" : ""} position="0.01 -0.01 0.030">
      <a-cone position="-0.42 0.20 0.075" radius-bottom="0.040" radius-top="0.008" height="0.145" rotation="90 0 0" color="#315c4e"></a-cone>
      <a-cone position="0.41 0.19 0.075" radius-bottom="0.040" radius-top="0.008" height="0.145" rotation="90 0 0" color="#315c4e"></a-cone>
      <a-cone position="-0.40 -0.20 0.075" radius-bottom="0.040" radius-top="0.008" height="0.145" rotation="90 0 0" color="#315c4e"></a-cone>
      <a-cone position="0.40 -0.20 0.075" radius-bottom="0.040" radius-top="0.008" height="0.145" rotation="90 0 0" color="#315c4e"></a-cone>
      <a-box width="0.70" height="0.032" depth="0.022" position="0 -0.29 0.030" color="#c49a69"></a-box>
      ${qinianHall()}
    </a-entity>
    <a-entity position="-0.47 0.23 0.12" class="temple-caption">
      <a-plane width="0.33" height="0.10" color="#102b42" opacity="0.90"></a-plane>
      <a-text value="祈年殿 · 天坛" align="center" width="0.58" color="#f5df9c" position="0 0 0.006"></a-text>
    </a-entity>
    <a-sphere position="0.33 0.24 0.13" radius="0.013" color="#f4cd62" material="emissive: #f4cd62; emissiveIntensity: 0.75"
      animation="property: scale; from: 0.7 0.7 0.7; to: 1.25 1.25 1.25; dir: alternate; loop: true; dur: 1400"></a-sphere>
    <a-sphere position="0.43 0.12 0.10" radius="0.009" color="#82cbd4" material="emissive: #82cbd4; emissiveIntensity: 0.75"
      animation="property: position; from: 0.43 0.10 0.10; to: 0.43 0.15 0.11; dir: alternate; loop: true; dur: 2100"></a-sphere>
  </a-entity>`;

const posterCard = (source, title, note, position, rotation, width, delay) => `
  <a-entity position="${position}" rotation="${rotation}" poster-float="delay: ${delay}">
    <a-box width="${width + 0.028}" height="${width * 0.65 + 0.065}" depth="0.018" position="0 0 -0.006"
      color="#183a42" material="roughness: 0.82"></a-box>
    <a-image src="${source}" width="${width}" height="${width * 0.65}" position="0 0 0.012" material="shader: flat"></a-image>
    <a-plane width="${width}" height="0.07" position="0 ${-(width * 0.325 - 0.035)} 0.024" color="#f2e7cb" opacity="0.95"></a-plane>
    <a-text value="${title}" align="left" width="${width * 1.72}" color="#1d343a" position="${-width * 0.43} ${-(width * 0.325 - 0.035)} 0.028"></a-text>
    <a-text value="${note}" align="right" width="${width * 1.5}" color="#826b41" position="${width * 0.13} ${-(width * 0.325 - 0.035)} 0.029"></a-text>
  </a-entity>`;

const posterScene = () => `
  <a-entity class="poster-scene">
    <a-plane width="1.36" height="0.68" position="0 0 -0.023" color="#dce6cf" opacity="0.46"></a-plane>
    ${posterCard("#poster-forest", "林影", "01", "-0.34 0.08 0.035", "-3 -8 -8", 0.42, 0)}
    ${posterCard("#poster-portrait", "守望", "02", "0.34 0.12 0.115", "4 10 8", 0.36, 500)}
    ${posterCard("#poster-village", "古今同游", "03", "0.16 -0.20 0.19", "-5 3 -2", 0.52, 900)}
    ${posterCard("#poster-map", "时间地图", "04", "-0.37 -0.20 0.13", "4 -12 6", 0.31, 1200)}
    <a-entity position="0.0 0.29 0.11" poster-float="delay: 300">
      <a-plane width="0.47" height="0.105" color="#254e57" opacity="0.93"></a-plane>
      <a-text value="共享古今" align="center" width="0.98" color="#f4e7bf" position="0 0 0.008"></a-text>
    </a-entity>
    <a-circle position="0.50 -0.25 0.08" radius="0.037" color="#e6ba56" opacity="0.86"
      animation="property: scale; from: 0.8 0.8 0.8; to: 1.25 1.25 1.25; dir: alternate; loop: true; dur: 1800"></a-circle>
    <a-circle position="-0.08 0.26 0.14" radius="0.018" color="#87b5a0" opacity="0.88"
      animation="property: position; from: -0.08 0.25 0.14; to: -0.08 0.30 0.14; dir: alternate; loop: true; dur: 2400"></a-circle>
  </a-entity>`;

const cityActor = (source, position, width, height, motion, delay) => `
  <a-entity position="${position}" city-life="motion: ${motion}; delay: ${delay}">
    <a-image src="${source}" width="${width}" height="${height}" position="0 0 ${height / 2}" rotation="-90 0 0"
      material="transparent: true; alphaTest: 0.04; shader: flat"></a-image>
  </a-entity>`;

const cityScene = () => `
  <a-entity class="city-scene">
    <a-plane width="1.28" height="0.19" position="0 -0.22 0.014" color="#d9cb98" opacity="0.82"></a-plane>
    <a-box width="1.19" height="0.018" depth="0.040" position="0 -0.08 0.035" color="#c76554"></a-box>
    <a-box width="0.34" height="0.11" depth="0.078" position="-0.46 0.20 0.050" color="#b97956"></a-box>
    <a-box width="0.28" height="0.09" depth="0.070" position="-0.08 0.22 0.050" color="#8aa69a"></a-box>
    <a-box width="0.30" height="0.10" depth="0.075" position="0.32 0.21 0.052" color="#c59c75"></a-box>
    <a-box width="0.20" height="0.075" depth="0.065" position="0.55 0.17 0.050" color="#9a765c"></a-box>
    <a-plane width="1.20" height="0.018" position="0 -0.01 0.054" color="#f1ddaa"></a-plane>
    ${cityActor("#city-kiosk", "-0.47 0.11 0.048", 0.24, 0.238, "sway", 100)}
    ${cityActor("#city-class", "-0.43 -0.16 0.050", 0.25, 0.158, "gather", 800)}
    ${cityActor("#city-stall", "-0.13 0.07 0.058", 0.23, 0.139, "serve", 430)}
    ${cityActor("#city-photo", "0.10 0.14 0.048", 0.28, 0.147, "pose", 1240)}
    ${cityActor("#city-tea", "0.12 -0.17 0.058", 0.20, 0.172, "talk", 980)}
    ${cityActor("#city-fruit", "0.43 0.06 0.068", 0.18, 0.124, "trade", 620)}
    ${cityActor("#city-children", "0.38 -0.09 0.072", 0.17, 0.077, "play", 320)}
    ${cityActor("#city-magic", "0.52 -0.12 0.070", 0.13, 0.152, "show", 1500)}
    ${cityActor("#city-market", "0.49 -0.21 0.058", 0.20, 0.202, "browse", 1050)}
    ${cityActor("#city-walkers", "-0.08 -0.23 0.078", 0.25, 0.130, "walk", 250)}
    ${cityActor("#city-rickshaw", "-0.48 -0.25 0.060", 0.20, 0.178, "roll", 1350)}
    <a-entity position="0 0.28 0.085" poster-float="delay: 250">
      <a-plane width="0.41" height="0.085" color="#1c4d53" opacity="0.93"></a-plane>
      <a-text value="市井生活 · 人间天坛" align="center" width="0.84" color="#f6e5ae" position="0 0 0.008"></a-text>
    </a-entity>
  </a-entity>`;

AFRAME.registerComponent("world-rotate", {
  init() {
    this.el.setAttribute("animation__turn", {
      property: "rotation",
      from: "0 0 -8",
      to: "0 0 352",
      loop: true,
      dur: 60000,
      easing: "linear",
    });
  },
});

AFRAME.registerComponent("model-intro", {
  init() {
    this.el.object3D.scale.set(0.72, 0.72, 0.72);
    this.el.setAttribute("animation__appear", {
      property: "scale",
      from: "0.72 0.72 0.72",
      to: "1 1 1",
      dur: 900,
      easing: "easeOutBack",
    });
  },
});

AFRAME.registerComponent("poster-float", {
  schema: { delay: { type: "number", default: 0 } },
  init() {
    const position = this.el.getAttribute("position");
    const lift = position.z + 0.014;
    this.el.setAttribute("animation__float", {
      property: "position",
      from: `${position.x} ${position.y} ${position.z}`,
      to: `${position.x} ${position.y + 0.012} ${lift}`,
      dir: "alternate",
      loop: true,
      dur: 2600,
      delay: this.data.delay,
      easing: "easeInOutSine",
    });
  },
});

AFRAME.registerComponent("city-life", {
  schema: {
    motion: { type: "string", default: "sway" },
    delay: { type: "number", default: 0 },
  },
  init() {
    const position = this.el.getAttribute("position");
    const movement = {
      browse: [0.008, 0.004, 2600],
      gather: [0.006, 0.009, 3100],
      play: [0.014, 0.018, 1500],
      pose: [0.004, 0.006, 2800],
      roll: [0.026, 0.004, 3500],
      serve: [0.006, 0.010, 1900],
      show: [0.004, 0.020, 1500],
      sway: [0.006, 0.010, 2400],
      talk: [0.004, 0.008, 2100],
      trade: [0.006, 0.008, 2000],
      walk: [0.032, 0.010, 3300],
    }[this.data.motion] || [0.006, 0.010, 2400];
    this.el.setAttribute("animation__life", {
      property: "position",
      from: `${position.x} ${position.y} ${position.z}`,
      to: `${position.x + movement[0]} ${position.y + movement[1]} ${position.z + 0.006}`,
      dir: "alternate",
      loop: true,
      dur: movement[2],
      delay: this.data.delay,
      easing: "easeInOutSine",
    });
  },
});

AFRAME.registerComponent("preview-fit", {
  init() {
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
    this.el.sceneEl.addEventListener("renderstart", this.resize);
  },
  resize() {
    const aspect = window.innerWidth / window.innerHeight;
    const fov = THREE.MathUtils.degToRad(42);
    const zForWidth = 1.68 / (2 * Math.tan(fov / 2) * aspect);
    const zForHeight = 1.24 / (2 * Math.tan(fov / 2));
    this.el.object3D.position.z = Math.max(zForWidth, zForHeight) + 0.22;
  },
  remove() { window.removeEventListener("resize", this.resize); },
});

AFRAME.registerComponent("drag-rotate", {
  init() {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const canvas = this.el.sceneEl.canvas;
    canvas.addEventListener("pointerdown", (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      this.el.object3D.rotation.y += dx * 0.005;
      this.el.object3D.rotation.x = THREE.MathUtils.clamp(this.el.object3D.rotation.x + dy * 0.003, -0.95, 0.72);
    });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });
  },
});

const assetsMarkup = () => `
  <a-assets timeout="30000">
    <img id="target-temple" src="./assets/target-01.jpg" crossorigin="anonymous" />
    <img id="target-poster" src="./assets/target-02.jpg" crossorigin="anonymous" />
    <img id="target-city" src="./assets/target-03.jpg" crossorigin="anonymous" />
    <img id="poster-forest" src="./assets/poster-forest.jpg" crossorigin="anonymous" />
    <img id="poster-portrait" src="./assets/poster-portrait.jpg" crossorigin="anonymous" />
    <img id="poster-village" src="./assets/poster-village.jpg" crossorigin="anonymous" />
    <img id="poster-map" src="./assets/poster-map.jpg" crossorigin="anonymous" />
    ${["kiosk", "class", "stall", "photo", "tea", "fruit", "children", "magic", "market", "walkers", "rickshaw"].map((name) => `<img id="city-${name}" src="./assets/city-${name}.png" crossorigin="anonymous" />`).join("")}
  </a-assets>`;

const effectFor = (index, includeTarget = false, preview = false) => {
  const target = includeTarget ? targetPlane(TARGETS[index].image) : "";
  if (index === 0) return `${target}${templeScene(!preview)}`;
  if (index === 1) return `${target}${posterScene()}`;
  return `${target}${cityScene()}`;
};

const buildArScene = () => {
  sceneRoot.innerHTML = `
    <a-scene id="ar-scene"
      mindar-image="imageTargetSrc: ./assets/targets.mind; maxTrack: 1; filterMinCF: 0.0001; filterBeta: 0.001; warmupTolerance: 4; missTolerance: 8"
      color-space="sRGB"
      renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true"
      vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false" loading-screen="enabled: false">
      ${assetsMarkup()}
      <a-entity light="type: ambient; intensity: 1.55"></a-entity>
      <a-entity light="type: directional; intensity: 1.9" position="-0.7 1.2 2.2"></a-entity>
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      ${TARGETS.map((target, index) => `<a-entity id="target-${index}" mindar-image-target="targetIndex: ${index}">${effectFor(index)}</a-entity>`).join("")}
    </a-scene>`;

  TARGETS.forEach((target, index) => {
    const anchor = document.getElementById(`target-${index}`);
    anchor.addEventListener("targetFound", () => setStatus(target.name, "found"));
    anchor.addEventListener("targetLost", () => setStatus("移动镜头，重新对准完整书页", "lost"));
  });
};

const buildPreviewScene = () => {
  sceneRoot.innerHTML = `
    <a-scene id="preview-scene" embedded background="color: #d9d3c7" color-space="sRGB"
      renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
      vr-mode-ui="enabled: false" loading-screen="enabled: false">
      ${assetsMarkup()}
      <a-entity light="type: ambient; intensity: 1.55"></a-entity>
      <a-entity light="type: directional; intensity: 2.1" position="-1.2 1.4 2.4"></a-entity>
      <a-entity id="preview-stage" drag-rotate rotation="-55 -13 0">${effectFor(previewIndex, true, true)}</a-entity>
      <a-camera preview-fit fov="42" position="0 0 2" look-controls="enabled: false"></a-camera>
    </a-scene>`;
};

const activateMode = () => {
  if (mode === "start") return;

  startPanel.hidden = true;
  homeButton.hidden = false;
  modeLabel.hidden = false;

  if (mode === "ar") {
    modeLabel.textContent = "将第 6、22 或 27 页完整放入取景框";
    setStatus("正在启动相机…");
    buildArScene();
    const scene = document.getElementById("ar-scene");
    scene.addEventListener("arReady", () => setStatus("相机已就绪，请对准书页"));
    scene.addEventListener("arError", () => setStatus("相机启动失败，请检查 HTTPS 与权限", "lost"));
  } else {
    targetSwitcher.hidden = false;
    modeLabel.textContent = "拖动画面，观看完整场景的前中后层";
    setStatus(TARGETS[previewIndex].name, "found");
    document.querySelectorAll(".target-button").forEach((button) => {
      const index = Number(button.dataset.target);
      button.setAttribute("aria-pressed", String(index === previewIndex));
      button.addEventListener("click", () => { window.location.search = `?mode=preview&target=${index}`; });
    });
    buildPreviewScene();
  }
};

activateMode();
window.lucide?.createIcons({ attrs: { width: 18, height: 18, "stroke-width": 1.8 } });
