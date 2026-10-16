import * as THREE from "three";

export type SooriMode =
  | "idle"
  | "wave"
  | "jump"
  | "flap"
  | "happy"
  | "look"
  | "dance"
  | "crouch"
  | "reach"
  | "watch"
  | "give";

export interface Soori {
  /** Outer group: position / scale / facing are controlled by the scene. */
  root: THREE.Group;
  /** Every mesh of the bird, for raycasting taps. */
  meshes: THREE.Mesh[];
  update: (mode: SooriMode, t: number, dt: number, now: number) => void;
  dispose: () => void;
}

const V = THREE.Vector3;
const Z = new V(0, 0, 1);
const Y = new V(0, 1, 0);
const ACCENT = new THREE.Color("#ff7a1a");

function canvasTex(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d") as CanvasRenderingContext2D, size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Pose {
  y: number;
  sq: number;
  sway: number;
  turn: number;
  hx: number;
  hy: number;
  hz: number;
  wl: number;
  wr: number;
  wlf: number;
  wrf: number;
  tx: number;
  ty: number;
  happy: number;
  mouth: number;
}

const BASE: Pose = {
  y: 0, sq: 0, sway: 0, turn: 0, hx: 0, hy: 0, hz: 0,
  wl: 0.45, wr: 0.45, wlf: 0, wrf: 0, tx: 0, ty: 0, happy: 0, mouth: 0,
};
const sin = Math.sin;
const abs = Math.abs;
const ease = (k: number) => k * k * (3 - 2 * k);

function poseFor(mode: SooriMode, t: number): Pose {
  const p: Pose = { ...BASE };
  switch (mode) {
    case "idle":
      p.sq = sin(t * 2.2) * 0.014; p.hz = sin(t * 0.9) * 0.06; p.hx = sin(t * 1.1) * 0.03;
      p.wl = p.wr = 0.42 + sin(t * 2.2) * 0.07; p.ty = sin(t * 1.6) * 0.14; p.tx = sin(t * 2.2) * 0.04;
      break;
    case "wave":
      p.wr = 2.25 + sin(t * 9) * 0.5; p.wrf = -0.25; p.wl = 0.4 + sin(t * 4.5) * 0.08;
      p.hz = -0.16 + sin(t * 4.5) * 0.06; p.sway = -0.05; p.happy = 1; p.mouth = 0.6; p.ty = sin(t * 3) * 0.2;
      break;
    case "flap": {
      const f = sin(t * 17);
      p.wl = p.wr = 1.05 + f * 0.95; p.wlf = p.wrf = -0.15;
      p.y = 0.32 + sin(t * 2.2) * 0.08 + sin(t * 17 - 1.2) * 0.035; p.sq = -0.03;
      p.tx = f * 0.1; p.hx = -0.06; p.mouth = 0.35;
      break;
    }
    case "jump": {
      const T = 1.3;
      const ph = (t % T) / T;
      if (ph < 0.2) {
        const k = ease(ph / 0.2); p.sq = 0.17 * k; p.wl = p.wr = 0.12; p.hx = 0.1 * k;
      } else if (ph < 0.72) {
        const k = (ph - 0.2) / 0.52;
        p.y = sin(k * Math.PI) * 1.45; p.sq = -0.12 * sin(Math.min(1, k * 1.6) * Math.PI);
        p.wl = p.wr = 1.25 + sin(t * 22) * 0.75; p.happy = 1; p.mouth = 0.8; p.hx = -0.15; p.tx = -0.3;
      } else {
        const k = (ph - 0.72) / 0.28;
        p.sq = 0.16 * sin(k * Math.PI) * (1 - k * 0.3); p.wl = p.wr = 0.6 * (1 - k) + 0.28; p.happy = k < 0.5 ? 1 : 0;
      }
      break;
    }
    case "happy": {
      const h = abs(sin(t * 6.5));
      p.y = h * 0.38; p.sq = -0.05 * h + 0.1 * Math.pow(1 - h, 8);
      p.wl = p.wr = 1.35 + sin(t * 13) * 0.6; p.happy = 1; p.mouth = 1;
      p.hz = sin(t * 3.25) * 0.13; p.ty = sin(t * 13) * 0.25;
      break;
    }
    case "look":
      p.hy = sin(t * 1.1) * 0.78; p.hx = sin(t * 0.55) * 0.12 - 0.03; p.hz = sin(t * 1.1) * 0.08;
      p.turn = sin(t * 1.1 - 0.4) * 0.18; p.ty = -sin(t * 1.1) * 0.2; p.sq = sin(t * 2.2) * 0.01;
      break;
    case "dance": {
      const b = t * 5.5;
      p.sway = sin(b) * 0.14; p.y = abs(sin(b)) * 0.2; p.sq = -abs(sin(b)) * 0.04;
      p.wl = 1.0 + sin(b) * 0.75; p.wr = 1.0 - sin(b) * 0.75;
      p.hz = -sin(b) * 0.18; p.hy = sin(b / 2) * 0.25; p.happy = 1; p.mouth = 0.6; p.ty = sin(b) * 0.35;
      break;
    }
    // --- orange picking sequence ---
    case "crouch": {
      const k = ease(Math.min(1, t / 0.4));
      p.sq = 0.17 * k; p.wl = p.wr = 0.12; p.hx = 0.1 * k;
      break;
    }
    case "reach": {
      const k = Math.min(1, t / 0.75);
      p.y = sin(k * Math.PI) * 1.0; p.sq = -0.1 * sin(Math.min(1, k * 1.6) * Math.PI);
      p.wl = p.wr = 1.6 + sin(t * 22) * 0.6; p.hx = -0.28; p.mouth = 0.8; p.tx = -0.3;
      break;
    }
    case "watch": {
      p.hx = 0.32; p.wl = p.wr = 0.5 + sin(t * 3) * 0.05; p.mouth = 0.3;
      p.sq = 0.14 * Math.exp(-t * 6) * sin(Math.min(t, 0.4) * 8);
      break;
    }
    case "give": {
      p.wr = 1.3 + sin(t * 3) * 0.05; p.wrf = -0.7; p.wl = 0.45; p.hz = -0.1; p.hx = -0.05;
      p.happy = 1; p.mouth = 0.6; p.y = abs(sin(t * 4)) * 0.06; p.ty = sin(t * 5) * 0.2;
      break;
    }
  }
  return p;
}

export function createSoori(): Soori {
  const textures: THREE.Texture[] = [];
  const tex = (size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void, srgb = true) => {
    const t = canvasTex(size, draw, srgb);
    textures.push(t);
    return t;
  };

  /* ---------- textures ---------- */
  const furTex = tex(256, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const v = Math.pow(Math.random(), 0.75) * 255;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, false);
  furTex.wrapS = furTex.wrapT = THREE.RepeatWrapping;
  furTex.repeat.set(4, 2);
  furTex.generateMipmaps = false;
  furTex.minFilter = THREE.LinearFilter;

  const eyeTex = tex(512, (ctx, s) => {
    ctx.fillStyle = "#0b0604"; ctx.fillRect(0, 0, s, s);
    let g = ctx.createRadialGradient(256, 360, 10, 256, 290, 250);
    g.addColorStop(0, "#b77243"); g.addColorStop(0.42, "#6a371f"); g.addColorStop(0.8, "#2a140b"); g.addColorStop(1, "#0d0604");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(256, 256, 250, 0, Math.PI * 2); ctx.fill();
    g = ctx.createRadialGradient(256, 228, 0, 256, 228, 165);
    g.addColorStop(0, "#040201"); g.addColorStop(0.8, "#120804"); g.addColorStop(1, "rgba(18,8,4,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(256, 228, 165, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.ellipse(338, 150, 66, 60, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.arc(178, 352, 24, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.ellipse(300, 400, 70, 26, -0.25, 0, Math.PI * 2); ctx.fill();
  });

  const blushTex = tex(128, (ctx, s) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,140,150,.85)"); g.addColorStop(0.55, "rgba(255,150,160,.45)"); g.addColorStop(1, "rgba(255,160,170,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
  });

  const logoTex = tex(256, (ctx) => {
    ctx.strokeStyle = "#fff"; ctx.lineCap = "round";
    ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(48, 150); ctx.quadraticCurveTo(120, 70, 210, 92); ctx.stroke();
    ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(70, 186); ctx.quadraticCurveTo(130, 128, 196, 134); ctx.stroke();
  });

  /* ---------- materials ---------- */
  const M = {
    furBase: new THREE.MeshStandardMaterial({ color: "#d6cfc9", roughness: 1 }),
    white: new THREE.MeshPhysicalMaterial({ color: "#f7f3ef", roughness: 0.85, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color("#ffffff") }),
    darkFeather: new THREE.MeshPhysicalMaterial({ color: "#34333a", roughness: 0.8, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color("#8a8a95") }),
    black: new THREE.MeshPhysicalMaterial({ color: "#121214", roughness: 0.3, metalness: 0.15, clearcoat: 0.9, clearcoatRoughness: 0.2 }),
    matte: new THREE.MeshStandardMaterial({ color: "#1d1d21", roughness: 0.75 }),
    cushion: new THREE.MeshPhysicalMaterial({ color: "#25252a", roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color("#555") }),
    accent: new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 7, roughness: 0.4 }),
    beakTop: new THREE.MeshPhysicalMaterial({ color: "#f7b52e", roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.3 }),
    beakBot: new THREE.MeshPhysicalMaterial({ color: "#e8902a", roughness: 0.4, clearcoat: 0.5 }),
    mouth: new THREE.MeshStandardMaterial({ color: "#7a2a22", roughness: 0.6 }),
    toe: new THREE.MeshPhysicalMaterial({ color: "#161619", roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
    eye: new THREE.MeshPhysicalMaterial({ map: eyeTex, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, emissive: "#ffffff", emissiveMap: eyeTex, emissiveIntensity: 0.12 }),
    blush: new THREE.MeshBasicMaterial({ map: blushTex, transparent: true, depthWrite: false }),
    logo: new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false }),
  };

  const FUR_LAYERS = 16;
  const furMats: THREE.MeshStandardMaterial[] = [];
  for (let i = 1; i <= FUR_LAYERS; i++) {
    const f = i / FUR_LAYERS;
    furMats.push(new THREE.MeshStandardMaterial({
      color: new THREE.Color().lerpColors(new THREE.Color("#d9d2cb"), new THREE.Color("#ffffff"), Math.pow(f, 0.6)),
      roughness: 1, alphaMap: furTex, alphaTest: 0.12 + f * 0.82,
    }));
  }
  function addFur(mesh: THREE.Mesh, radius: number, length: number) {
    for (let i = 1; i <= FUR_LAYERS; i++) {
      const shell = new THREE.Mesh(mesh.geometry, furMats[i - 1]);
      shell.scale.setScalar(1 + (length / radius) * (i / FUR_LAYERS));
      shell.receiveShadow = true;
      mesh.add(shell);
    }
  }

  /* ---------- geometry helpers ---------- */
  const sphereGeo = new THREE.SphereGeometry(1, 48, 32);
  const featherGeo = new THREE.SphereGeometry(1, 32, 24).translate(0, 1, 0);
  {
    const p = featherGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const t = p.getY(i) / 2;
      const k = 0.7 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15));
      p.setX(i, p.getX(i) * k);
    }
    featherGeo.computeVertexNormals();
  }
  function feather(w: number, h: number, d: number, mat: THREE.Material = M.white) {
    const m = new THREE.Mesh(featherGeo, mat);
    m.scale.set(w, h / 2, d);
    m.castShadow = true;
    return m;
  }
  function blob(mat: THREE.Material, sx: number, sy: number, sz: number) {
    const m = new THREE.Mesh(sphereGeo, mat);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    return m;
  }
  const eyeGeo = new THREE.SphereGeometry(1, 48, 32);
  {
    const p = eyeGeo.attributes.position;
    const uv = eyeGeo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.5 + 0.5, p.getY(i) * 0.5 + 0.5);
  }

  /* ---------- body ---------- */
  const root = new THREE.Group();
  const bird = new THREE.Group();
  root.add(bird);
  const torso = new THREE.Group();
  bird.add(torso);

  const body = new THREE.Mesh(sphereGeo, M.furBase);
  body.scale.set(0.9, 0.84, 0.84); body.position.y = 0.94; body.castShadow = true;
  addFur(body, 0.87, 0.06);
  torso.add(body);

  // chest fluff (scalloped bib)
  ([[1.26, 0.8, 7, 1.9], [1.08, 0.86, 6, 1.5]] as const).forEach(([y, rr, n, spread]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / (n - 1) - 0.5) * spread;
      const m = blob(M.white, 0.2, 0.14, 0.09);
      m.position.set(Math.sin(a) * rr, y, Math.cos(a) * rr * 0.95);
      m.rotation.set(0.3, a, 0);
      torso.add(m);
    }
  });

  // wings
  function makeWing(s: number) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.74, 1.3, 0.1);
    pivot.rotation.y = -s * 0.32;
    const inner = new THREE.Group();
    pivot.add(inner);
    ([[1.95, 0.72, 0.34], [2.3, 0.98, 0.38], [2.65, 0.95, 0.36], [2.95, 0.8, 0.32], [3.22, 0.6, 0.26]] as const).forEach(([ang, len, w], i) => {
      const f = feather(w, len, 0.13);
      f.rotation.z = -s * ang; f.position.z = -i * 0.025;
      inner.add(f);
    });
    const sh = blob(M.white, 0.36, 0.38, 0.2);
    sh.position.set(s * 0.05, -0.05, 0.02);
    inner.add(sh);
    torso.add(pivot);
    return inner;
  }
  const wingR = makeWing(1);
  const wingL = makeWing(-1);

  // tail
  const tail = new THREE.Group();
  tail.position.set(0, 0.74, -0.64);
  torso.add(tail);
  const tailFeathers: Array<[number, number, number, boolean?]> = [
    [-0.5, 0.75, 0.2], [0.5, 0.75, 0.2], [-0.25, 0.92, 0.22], [0.25, 0.92, 0.22], [0, 1.1, 0.24, true],
  ];
  tailFeathers.forEach(([fan, len, w, dark]) => {
    const g = new THREE.Group();
    g.rotation.order = "YXZ";
    g.rotation.set(-1.05 - (dark ? 0.12 : 0), fan, 0);
    g.add(feather(w, len, 0.1));
    if (dark) {
      const tip = feather(w * 0.92, len * 0.46, 0.105, M.darkFeather);
      tip.position.y = len * 0.6;
      g.add(tip);
    }
    tail.add(g);
  });

  // feet
  function makeFoot(s: number) {
    const g = new THREE.Group();
    g.position.set(s * 0.36, 0, 0.18);
    g.rotation.y = s * 0.22;
    [-0.18, 0, 0.18].forEach((x, i) => {
      const t = blob(M.toe, 0.135, 0.11, 0.2);
      t.position.set(x, 0.1, 0.14 + (i === 1 ? 0.05 : 0));
      t.rotation.y = x * 1.3;
      g.add(t);
    });
    const heel = blob(M.toe, 0.22, 0.15, 0.2);
    heel.position.set(0, 0.13, -0.04);
    g.add(heel);
    bird.add(g);
  }
  makeFoot(1);
  makeFoot(-1);

  // head
  const R = 1.13;
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.58, 0);
  torso.add(headPivot);
  const head = new THREE.Group();
  head.position.set(0, 0.64, 0.04);
  headPivot.add(head);
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), M.furBase);
  headMesh.castShadow = true;
  addFur(headMesh, R, 0.07);
  head.add(headMesh);

  // tuft
  const tuft = new THREE.Group();
  tuft.position.set(0, R - 0.14, 0.06);
  head.add(tuft);
  ([[0, 0.78, 0.3, -0.1], [0.62, 0.55, 0.26, 0.05], [-0.58, 0.52, 0.25, 0.1], [0.22, 0.5, 0.24, -0.6], [-0.28, 0.46, 0.23, -0.65]] as const).forEach(([rz, h, w, rx]) => {
    const f = feather(w, h, 0.16);
    f.rotation.set(rx, 0, rz);
    tuft.add(f);
  });

  // eyes + blush
  const eyes: Array<{ ball: THREE.Mesh; arc: THREE.Mesh }> = [];
  [1, -1].forEach((s) => {
    const dir = new V(s * 0.39, 0.0, 0.92).normalize();
    const g = new THREE.Group();
    g.position.copy(dir).multiplyScalar(R - 0.02);
    g.quaternion.setFromUnitVectors(Z, dir);
    const ball = new THREE.Mesh(eyeGeo, M.eye);
    ball.scale.set(0.3, 0.345, 0.14);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.045, 12, 32, Math.PI), M.black);
    arc.position.set(0, -0.04, 0.1);
    arc.visible = false;
    g.add(ball, arc);
    head.add(g);
    eyes.push({ ball, arc });
    const bdir = new V(s * 0.62, -0.24, 0.75).normalize();
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.21, 32), M.blush);
    blush.position.copy(bdir).multiplyScalar(R + 0.055);
    blush.quaternion.setFromUnitVectors(Z, bdir);
    head.add(blush);
  });

  // beak
  const beak = new THREE.Group();
  {
    const bd = new V(0, -0.15, 1).normalize();
    beak.position.copy(bd).multiplyScalar(R - 0.04);
    beak.quaternion.setFromUnitVectors(Z, bd);
    head.add(beak);
  }
  const upperGeo = new THREE.ConeGeometry(0.17, 0.32, 40);
  upperGeo.rotateX(Math.PI / 2);
  const upper = new THREE.Mesh(upperGeo, M.beakTop);
  upper.scale.set(1.45, 0.66, 1.1); upper.position.set(0, 0.035, 0.12); upper.rotation.x = 0.1; upper.castShadow = true;
  const lowerGeo = new THREE.ConeGeometry(0.13, 0.22, 32);
  lowerGeo.rotateX(Math.PI / 2);
  const lower = new THREE.Mesh(lowerGeo, M.beakBot);
  lower.scale.set(1.3, 0.55, 1.05); lower.position.set(0, -0.04, 0.08);
  const mouth = blob(M.mouth, 0.12, 0.06, 0.08);
  mouth.position.set(0, -0.015, 0.08);
  beak.add(upper, lower, mouth);

  // headphones
  const hp = new THREE.Group();
  hp.rotation.x = -0.1;
  head.add(hp);
  const band = new THREE.Mesh(new THREE.TorusGeometry(R + 0.14, 0.08, 20, 120, Math.PI), M.black);
  band.castShadow = true;
  hp.add(band);
  const pad = new THREE.Mesh(new THREE.TorusGeometry(R + 0.07, 0.05, 12, 96, Math.PI * 0.62), M.cushion);
  pad.rotation.z = Math.PI * 0.19;
  hp.add(pad);
  [1, -1].forEach((s) => {
    const cup = new THREE.Group();
    cup.position.set(s * (R + 0.11), -0.1, 0);
    hp.add(cup);
    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.16), M.black);
    slider.position.set(s * 0.03, 0.34, 0);
    cup.add(slider);
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.26, 64), M.black);
    shell.rotation.z = Math.PI / 2; shell.castShadow = true;
    cup.add(shell);
    const cush = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.1, 16, 48), M.cushion);
    cush.rotation.y = Math.PI / 2; cush.position.x = -s * 0.15;
    cup.add(cush);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.06, 64), M.matte);
    cap.rotation.z = Math.PI / 2; cap.position.x = s * 0.15;
    cup.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.024, 12, 96), M.accent);
    ring.rotation.y = Math.PI / 2; ring.position.x = s * 0.185;
    cup.add(ring);
    const logo = new THREE.Mesh(new THREE.CircleGeometry(0.19, 48), M.logo);
    logo.rotation.y = (s * Math.PI) / 2; logo.position.x = s * 0.186;
    cup.add(logo);
  });
  // mic boom
  {
    const k = R / 1.05;
    const curve = new THREE.CatmullRomCurve3(
      [new V(1.13, -0.38, 0.18), new V(1.05, -0.6, 0.6), new V(0.72, -0.72, 0.98), new V(0.3, -0.7, 1.13)].map((p) => p.multiplyScalar(k)),
    );
    const boom = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.032, 12), M.black);
    boom.castShadow = true;
    hp.add(boom);
    const end = curve.getPoint(1);
    const tan = curve.getTangent(1);
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.16, 8, 20), M.black);
    tip.quaternion.setFromUnitVectors(Y, tan);
    tip.position.copy(end).addScaledVector(tan, 0.07);
    hp.add(tip);
    const mr = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.014, 8, 32), M.accent);
    mr.quaternion.setFromUnitVectors(Z, tan);
    mr.position.copy(end).addScaledVector(tan, -0.02);
    hp.add(mr);
  }

  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });

  /* ---------- animation ---------- */
  const cur: Pose = { ...BASE };
  let blink = 1;
  let nextBlink = 2;

  function update(mode: SooriMode, t: number, dt: number, now: number) {
    const target = poseFor(mode, t);
    for (const k of Object.keys(target) as Array<keyof Pose>) {
      const rate = k === "y" || k === "sq" ? 24 : 10;
      cur[k] += (target[k] - cur[k]) * (1 - Math.exp(-rate * dt));
    }
    if (now > nextBlink) {
      blink = 0.08;
      if (now > nextBlink + 0.12) {
        blink = 1;
        nextBlink = now + 2.2 + Math.random() * 3;
      }
    }

    bird.position.y = cur.y;
    bird.scale.set(1 + cur.sq * 0.6, 1 - cur.sq, 1 + cur.sq * 0.6);
    torso.rotation.set(0, cur.turn, cur.sway);
    headPivot.rotation.set(cur.hx, cur.hy, cur.hz);
    wingR.rotation.set(cur.wrf, 0, cur.wr);
    wingL.rotation.set(cur.wlf, 0, -cur.wl);
    tail.rotation.set(cur.tx, cur.ty, 0);
    const happy = cur.happy > 0.5;
    for (const e of eyes) {
      e.ball.visible = !happy;
      e.arc.visible = happy;
      e.ball.scale.y = 0.345 * blink;
    }
    lower.rotation.x = 0.12 + cur.mouth * 0.4;
    mouth.scale.y = 0.05 + cur.mouth * 0.05;
    M.accent.emissiveIntensity = 7 + sin(now * 2) * 1.2;
  }

  function dispose() {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
    Object.values(M).forEach((m) => m.dispose());
    furMats.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  }

  return { root, meshes, update, dispose };
}
