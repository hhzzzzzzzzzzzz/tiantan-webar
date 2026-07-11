const TARGETS = [
  { name: "第 18 页 · 祈年殿", image: "#target-qinian" },
  { name: "第 20 页 · 古树浮雕", image: "#target-relief" },
  { name: "第 27 页 · 人物分层", image: "#target-people" },
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

const qinianHall = (animated = true) => {
  const columns = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2;
    const x = Math.cos(angle) * 0.092;
    const y = Math.sin(angle) * 0.092;
    return `<a-cylinder position="${x.toFixed(4)} ${y.toFixed(4)} 0.105" radius="0.006" height="0.12" rotation="90 0 0" color="#a6382d" metalness="0.05" roughness="0.76"></a-cylinder>`;
  }).join("");

  return `
    <a-entity class="effect qinian-effect" ${animated ? "qinian-rise" : ""}>
      <a-cylinder position="0 0 0.010" radius="0.170" height="0.020" rotation="90 0 0" color="#d9d4c6"></a-cylinder>
      <a-cylinder position="0 0 0.026" radius="0.145" height="0.018" rotation="90 0 0" color="#eee9dc"></a-cylinder>
      <a-cylinder position="0 0 0.042" radius="0.120" height="0.016" rotation="90 0 0" color="#f7f2e6"></a-cylinder>
      <a-cylinder position="0 0 0.105" radius="0.102" height="0.118" rotation="90 0 0" color="#7e2b27" roughness="0.82"></a-cylinder>
      ${columns}
      <a-torus position="0 0 0.161" radius="0.112" radius-tubular="0.010" color="#234c55" metalness="0.22" roughness="0.56"></a-torus>
      <a-cone position="0 0 0.187" radius-bottom="0.148" radius-top="0.052" height="0.054" rotation="90 0 0" color="#1f4c55" metalness="0.18" roughness="0.55"></a-cone>
      <a-torus position="0 0 0.214" radius="0.090" radius-tubular="0.009" color="#d0a23e" metalness="0.35" roughness="0.42"></a-torus>
      <a-cone position="0 0 0.232" radius-bottom="0.112" radius-top="0.038" height="0.042" rotation="90 0 0" color="#2f6770" metalness="0.18" roughness="0.52"></a-cone>
      <a-torus position="0 0 0.253" radius="0.069" radius-tubular="0.008" color="#d0a23e" metalness="0.35" roughness="0.42"></a-torus>
      <a-cone position="0 0 0.270" radius-bottom="0.084" radius-top="0.022" height="0.034" rotation="90 0 0" color="#356e74" metalness="0.18" roughness="0.5"></a-cone>
      <a-cylinder position="0 0 0.298" radius="0.008" height="0.035" rotation="90 0 0" color="#e4b84f" metalness="0.45"></a-cylinder>
      <a-sphere position="0 0 0.320" radius="0.013" color="#e4b84f" metalness="0.45"></a-sphere>
      <a-ring position="0 0 0.006" radius-inner="0.182" radius-outer="0.190" color="#e5b74f" opacity="0.8"
        animation="property: rotation; to: 0 0 360; loop: true; dur: 12000; easing: linear"></a-ring>
    </a-entity>`;
};

const reliefSurface = () => `
  <a-entity class="effect relief-effect" relief-breathe>
    <a-box position="0 0 -0.014" width="1.020" height="0.520" depth="0.025" color="#b9aa8d" roughness="1"></a-box>
    <a-plane position="0 0 0.012"
      geometry="primitive: plane; width: 1; height: 0.5; segmentsWidth: 120; segmentsHeight: 60"
      relief-surface="colorMap: ./assets/relief-color.jpg; depthMap: ./assets/relief-depth.jpg; displacement: 0.10">
    </a-plane>
  </a-entity>`;

const peopleLayers = () => `
  <a-entity class="effect people-effect">
    <a-image src="#people-far" position="0.125 0 0.018" width="0.75" height="0.375" material="transparent: true; alphaTest: 0.05; shader: flat"></a-image>
    <a-image src="#people-mid" position="0.125 0 0.052" width="0.75" height="0.375" material="transparent: true; alphaTest: 0.05; shader: flat"
      animation="property: position; from: 0.125 -0.002 0.052; to: 0.125 0.002 0.056; dir: alternate; loop: true; dur: 2600; easing: easeInOutSine"></a-image>
    <a-image src="#people-near" position="0.125 0 0.092" width="0.75" height="0.375" material="transparent: true; alphaTest: 0.05; shader: flat"
      animation="property: position; from: 0.125 -0.003 0.092; to: 0.125 0.004 0.100; dir: alternate; loop: true; dur: 2100; easing: easeInOutSine"></a-image>
  </a-entity>`;

AFRAME.registerComponent("relief-surface", {
  schema: {
    colorMap: { type: "string" },
    depthMap: { type: "string" },
    displacement: { type: "number", default: 0.06 },
  },
  init() {
    this.applyMaterial = this.applyMaterial.bind(this);
    this.el.addEventListener("object3dset", this.applyMaterial);
    this.applyMaterial();
  },
  applyMaterial() {
    const mesh = this.el.getObject3D("mesh");
    if (!mesh || this.applied) return;
    this.applied = true;
    const loader = new THREE.TextureLoader();
    const colorMap = loader.load(this.data.colorMap);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    mesh.material = new THREE.MeshStandardMaterial({
      map: colorMap,
      roughness: 0.9,
      metalness: 0,
    });
    mesh.material.needsUpdate = true;

    const depthImage = new Image();
    depthImage.crossOrigin = "anonymous";
    depthImage.onload = () => {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const width = 241;
      const height = 121;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(depthImage, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height).data;

      for (let index = 0; index < positions.count; index += 1) {
        const u = THREE.MathUtils.clamp(positions.getX(index) + 0.5, 0, 1);
        const v = THREE.MathUtils.clamp(0.5 - positions.getY(index) * 2, 0, 1);
        const pixelX = Math.round(u * (width - 1));
        const pixelY = Math.round(v * (height - 1));
        const value = pixels[(pixelY * width + pixelX) * 4] / 255;
        positions.setZ(index, value * this.data.displacement - 0.008);
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.attributes.normal.needsUpdate = true;
    };
    depthImage.src = this.data.depthMap;
  },
});

AFRAME.registerComponent("qinian-rise", {
  init() {
    this.el.object3D.scale.set(0.001, 0.001, 0.001);
    this.el.setAttribute("animation__rise", {
      property: "scale",
      from: "0.001 0.001 0.001",
      to: "1 1 1",
      dur: 1500,
      easing: "easeOutBack",
      autoplay: false,
    });
  },
});

const revealQinianHall = (hall) => {
  if (!hall) return;
  hall.object3D.scale.set(1, 1, 1);
  hall.components.animation__rise?.beginAnimation();
};

AFRAME.registerComponent("relief-breathe", {
  init() {
    this.el.setAttribute("animation__relief", {
      property: "position",
      from: "0 0 0",
      to: "0 0 0.012",
      dir: "alternate",
      loop: true,
      dur: 3200,
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
    const zForWidth = 1.48 / (2 * Math.tan(fov / 2) * aspect);
    const zForHeight = 0.82 / (2 * Math.tan(fov / 2));
    this.el.object3D.position.z = Math.max(zForWidth, zForHeight) + 0.24;
  },
  remove() {
    window.removeEventListener("resize", this.resize);
  },
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
      this.el.object3D.rotation.x = THREE.MathUtils.clamp(this.el.object3D.rotation.x + dy * 0.003, -0.9, 0.7);
    });
    canvas.addEventListener("pointerup", () => { dragging = false; });
    canvas.addEventListener("pointercancel", () => { dragging = false; });
  },
});

const assetsMarkup = () => `
  <a-assets timeout="15000">
    <img id="target-qinian" src="./assets/target-01.jpg" crossorigin="anonymous" />
    <img id="target-relief" src="./assets/target-02.jpg" crossorigin="anonymous" />
    <img id="target-people" src="./assets/target-03.jpg" crossorigin="anonymous" />
    <img id="people-far" src="./assets/people-far.png" crossorigin="anonymous" />
    <img id="people-mid" src="./assets/people-mid.png" crossorigin="anonymous" />
    <img id="people-near" src="./assets/people-near.png" crossorigin="anonymous" />
  </a-assets>`;

const buildArScene = () => {
  sceneRoot.innerHTML = `
    <a-scene id="ar-scene"
      mindar-image="imageTargetSrc: ./assets/targets.mind; maxTrack: 1; filterMinCF: 0.0001; filterBeta: 0.001; warmupTolerance: 4; missTolerance: 8"
      color-space="sRGB"
      renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      loading-screen="enabled: false">
      ${assetsMarkup()}
      <a-entity light="type: ambient; intensity: 1.35"></a-entity>
      <a-entity light="type: directional; intensity: 1.6" position="-0.6 1.1 2.1"></a-entity>
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity id="target-0" mindar-image-target="targetIndex: 0">
        <a-entity position="0.24 0.055 0.018" scale="0.72 0.72 0.72">${qinianHall()}</a-entity>
      </a-entity>
      <a-entity id="target-1" mindar-image-target="targetIndex: 1">${reliefSurface()}</a-entity>
      <a-entity id="target-2" mindar-image-target="targetIndex: 2">${peopleLayers()}</a-entity>
    </a-scene>`;

  TARGETS.forEach((target, index) => {
    const anchor = document.getElementById(`target-${index}`);
    anchor.addEventListener("targetFound", () => {
      setStatus(target.name, "found");
      revealQinianHall(anchor.querySelector("[qinian-rise]"));
    });
    anchor.addEventListener("targetLost", () => setStatus("移动镜头，重新对准整页", "lost"));
  });
};

const previewEffect = (index) => {
  if (index === 0) {
    return `
      <a-image src="#target-qinian" width="1.36" height="0.68" position="0 0 -0.03" material="shader: flat"></a-image>
      <a-entity position="0.32 0.075 0" scale="1.05 1.05 1.05">${qinianHall(false)}</a-entity>`;
  }
  if (index === 1) return reliefSurface().replace('class="effect relief-effect"', 'class="effect relief-effect" scale="1.34 1.34 1.34"');
  return `
    <a-image src="#target-people" width="1.42" height="0.477" position="0 0 -0.03" material="shader: flat"></a-image>
    <a-entity scale="1.42 1.42 1.42">${peopleLayers()}</a-entity>`;
};

const buildPreviewScene = () => {
  sceneRoot.innerHTML = `
    <a-scene id="preview-scene" embedded
      background="color: #d9d3c7"
      color-space="sRGB"
      renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true"
      vr-mode-ui="enabled: false"
      loading-screen="enabled: false">
      ${assetsMarkup()}
      <a-entity light="type: ambient; intensity: 1.4"></a-entity>
      <a-entity light="type: directional; intensity: 1.9" position="-1.2 1.4 2.4"></a-entity>
      <a-entity id="preview-stage" drag-rotate position="0 0 0" rotation="-34 -9 0">
        ${previewEffect(previewIndex)}
      </a-entity>
      <a-camera preview-fit fov="42" position="0 0 2" look-controls="enabled: false"></a-camera>
    </a-scene>`;

  const hall = document.querySelector("#preview-stage [qinian-rise]");
  document.getElementById("preview-scene").addEventListener("loaded", () => {
    revealQinianHall(hall);
  });
};

const activateMode = () => {
  if (mode === "start") {
    sceneRoot.style.background = "#111312";
    return;
  }

  startPanel.hidden = true;
  homeButton.hidden = false;
  modeLabel.hidden = false;

  if (mode === "ar") {
    modeLabel.textContent = "将第 18、20 或 27 页完整放入取景框";
    setStatus("正在启动相机…");
    buildArScene();
    const scene = document.getElementById("ar-scene");
    scene.addEventListener("arReady", () => setStatus("相机已就绪，请对准书页"));
    scene.addEventListener("arError", () => setStatus("相机启动失败，请检查 HTTPS 与权限", "lost"));
  } else {
    targetSwitcher.hidden = false;
    modeLabel.textContent = "拖动画面，可从侧面查看厚度";
    setStatus(TARGETS[previewIndex].name, "found");
    document.querySelectorAll(".target-button").forEach((button) => {
      const index = Number(button.dataset.target);
      button.setAttribute("aria-pressed", String(index === previewIndex));
      button.addEventListener("click", () => {
        window.location.search = `?mode=preview&target=${index}`;
      });
    });
    buildPreviewScene();
  }
};

activateMode();
window.lucide?.createIcons({ attrs: { width: 18, height: 18, "stroke-width": 1.8 } });
