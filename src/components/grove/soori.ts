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

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d") as CanvasRenderingContext2D);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* The body is one smooth egg: a sphere pushed wider towards the bottom, like the plush original. */
const EGG = { w: 1.27, lean: 0.2, h: 1.55, cy: 1.7 };

function eggRadius(y: number) {
  const n = THREE.MathUtils.clamp((y - EGG.cy) / EGG.h, -1, 1);
  return EGG.w * Math.sqrt(1 - n * n) * (1 - EGG.lean * n);
}

/** Point on the front of the egg at (x, y), pushed `push` along the surface normal. */
function frontPoint(x: number, y: number, push = 0) {
  const r = eggRadius(y);
  const p = new V(x, y, Math.sqrt(Math.max(0, r * r - x * x)));
  const normal = new V(p.x, (p.y - EGG.cy) * 0.45, p.z).normalize();
  return { pos: p.addScaledVector(normal, push), normal };
}

/** Turns a unit-sphere geometry into the egg, with analytic normals so there is no seam. */
function shapeEgg(geo: THREE.BufferGeometry, push = 0) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const { w, lean, h, cy } = EGG;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i);
    const ny = pos.getY(i);
    const nz = pos.getZ(i);
    const a = w * (1 - lean * ny);
    const m = new V(nx / a, (ny + (lean * w * (nx * nx + nz * nz)) / a) / h, nz / a).normalize();
    pos.setXYZ(i, nx * a + m.x * push, cy + ny * h + m.y * push, nz * a + m.z * push);
    nor.setXYZ(i, m.x, m.y, m.z);
  }
  pos.needsUpdate = true;
  nor.needsUpdate = true;
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
  const tex = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
    const t = canvasTex(w, h, draw);
    textures.push(t);
    return t;
  };

  /* ---------- textures ---------- */
  const eyeTex = tex(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 70, 4, 64, 64, 64);
    g.addColorStop(0, "#1c1512"); g.addColorStop(0.6, "#0a0807"); g.addColorStop(1, "#030203");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.ellipse(86, 40, 11, 9, -0.4, 0, Math.PI * 2); ctx.fill();
  });

  // Jersey print, laid out in front-projected body units: x in [-1.28, 1.28], y in [0.15, 1.43], 400px per unit.
  const px = (x: number) => (x + 1.28) * 400;
  const py = (y: number) => (1.43 - y) * 400;
  const neck = (x: number) => 1.1 + 0.2 * Math.pow(x / 1.15, 2);
  const jerseyTex = tex(1024, 512, (ctx) => {
    // lace side panels
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px(s * 1.28), py(neck(1.28) - 0.03));
      for (let x = 1.28; x >= 0.8; x -= 0.04) ctx.lineTo(px(s * x), py(neck(x) - 0.03));
      ctx.lineTo(px(s * 0.8), py(0.15));
      ctx.lineTo(px(s * 1.28), py(0.15));
      ctx.closePath();
      ctx.clip();
      const g = ctx.createLinearGradient(px(s * 1.28), 0, px(s * 0.8), 0);
      g.addColorStop(0, "rgba(168,160,194,.7)"); g.addColorStop(1, "rgba(168,160,194,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 512);
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2;
      for (let k = -520; k < 1100; k += 16) {
        ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 512, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(k + 512, 0); ctx.lineTo(k, 512); ctx.stroke();
      }
      ctx.restore();
    }

    // neckline trim
    ctx.strokeStyle = "#e6c8b6"; ctx.lineWidth = 14; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath();
    for (let x = -1.25; x <= 1.25; x += 0.02) {
      if (x === -1.25) ctx.moveTo(px(x), py(neck(x)));
      else ctx.lineTo(px(x), py(neck(x)));
    }
    ctx.stroke();

    // Hanwha swoosh logo
    const lx = px(0);
    const ly = py(1.0);
    const lg = ctx.createLinearGradient(lx - 100, ly, lx + 100, ly);
    lg.addColorStop(0, "#f8a21c"); lg.addColorStop(1, "#ee6a1e");
    ctx.strokeStyle = lg; ctx.lineCap = "round";
    [[11, 30, 0], [9, 18, -16], [7, 6, -30]].forEach(([w, dy, lift]) => {
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(lx - 96 + (30 + lift) * 0.5, ly + dy);
      ctx.quadraticCurveTo(lx - 10, ly - 26 + lift, lx + 98, ly - 6 + lift * 0.4);
      ctx.stroke();
    });

    // wordmark (pre-stretched vertically: the belly curves away from the camera)
    ctx.fillStyle = "#1b1a22"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const family = "'Segoe UI', Arial, Helvetica, sans-serif";
    ctx.font = `700 60px ${family}`;
    const size = (60 * 400) / ctx.measureText("Hanwha Life").width;
    ctx.font = `700 ${size}px ${family}`;
    for (const [str, y] of [["Hanwha Life", 0.76], ["Esports", 0.5]] as const) {
      ctx.save();
      ctx.translate(px(0), py(y));
      ctx.scale(1, 1.25);
      ctx.fillText(str, 0, 0);
      ctx.restore();
    }
  });

  /* ---------- materials ---------- */
  const M = {
    body: new THREE.MeshPhysicalMaterial({
      color: "#f5f0f7", roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.55,
      sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color("#e7defa"),
    }),
    jersey: new THREE.MeshStandardMaterial({
      map: jerseyTex, transparent: true, roughness: 0.85, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    }),
    cup: new THREE.MeshPhysicalMaterial({ color: "#8d91b4", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, metalness: 0.1 }),
    cupCap: new THREE.MeshPhysicalMaterial({ color: "#a9adcd", roughness: 0.4, clearcoat: 0.6 }),
    pad: new THREE.MeshStandardMaterial({ color: "#4d5070", roughness: 0.8 }),
    boom: new THREE.MeshStandardMaterial({ color: "#2b2b33", roughness: 0.5 }),
    micTip: new THREE.MeshPhysicalMaterial({ color: "#44444f", roughness: 0.4, clearcoat: 0.6 }),
    beakTop: new THREE.MeshPhysicalMaterial({ color: "#f6a23a", roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
    beakBot: new THREE.MeshPhysicalMaterial({ color: "#f2992f", roughness: 0.42, clearcoat: 0.5 }),
    mouth: new THREE.MeshStandardMaterial({ color: "#7a2a22", roughness: 0.6 }),
    toe: new THREE.MeshPhysicalMaterial({ color: "#1d1c22", roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
    eye: new THREE.MeshPhysicalMaterial({ map: eyeTex, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04 }),
    arc: new THREE.MeshStandardMaterial({ color: "#16141a", roughness: 0.5 }),
  };

  /* ---------- geometry helpers ---------- */
  const sphereGeo = new THREE.SphereGeometry(1, 48, 32);
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

  const bodyGeo = new THREE.SphereGeometry(1, 96, 64);
  shapeEgg(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, M.body);
  body.castShadow = true;
  body.receiveShadow = true;
  torso.add(body);

  // jersey print: a patch of the egg surface, lifted a hair, UV-mapped straight from the front
  {
    const patch = new THREE.SphereGeometry(1, 96, 32, Math.PI / 2 - 1.35, 2.7, 1.75, 1.15);
    shapeEgg(patch, 0.01);
    const p = patch.attributes.position;
    const uv = patch.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + 1.28) / 2.56, (p.getY(i) - 0.15) / 1.28);
    torso.add(new THREE.Mesh(patch, M.jersey));
  }

  // little nub arms (they take over the old wing animation)
  const armGeo = new THREE.CapsuleGeometry(0.19, 0.28, 12, 24);
  armGeo.translate(0, 0.38, 0);
  function makeWing(s: number) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 1.1, 1.2, 0.45);
    const inner = new THREE.Group();
    pivot.add(inner);
    const arm = new THREE.Mesh(armGeo, M.body);
    arm.rotation.z = -s * 2.55;
    arm.castShadow = true;
    inner.add(arm);
    torso.add(pivot);
    return inner;
  }
  const wingR = makeWing(1);
  const wingL = makeWing(-1);

  // tiny tail nub
  const tail = new THREE.Group();
  tail.position.set(0, 0.95, -1.15);
  torso.add(tail);
  const nub = blob(M.body, 0.34, 0.3, 0.26);
  nub.position.set(0, 0.05, -0.08);
  tail.add(nub);

  // feet, mostly tucked under the belly
  function makeFoot(s: number) {
    const g = new THREE.Group();
    g.position.set(s * 0.4, 0, 0.12);
    g.rotation.y = s * 0.2;
    [-0.17, 0, 0.17].forEach((x, i) => {
      const t = blob(M.toe, 0.12, 0.1, 0.18);
      t.position.set(x, 0.12, 0.14 + (i === 1 ? 0.04 : 0));
      t.rotation.y = x * 1.3;
      g.add(t);
    });
    const heel = blob(M.toe, 0.2, 0.14, 0.2);
    heel.position.set(0, 0.2, -0.02);
    g.add(heel);
    bird.add(g);
  }
  makeFoot(1);
  makeFoot(-1);

  /* ---------- face (rotates about the neck axis; the egg is a body of revolution so it stays on the surface) ---------- */
  const NECK_Y = 1.6;
  const headPivot = new THREE.Group();
  headPivot.position.set(0, NECK_Y, 0);
  torso.add(headPivot);
  const head = new THREE.Group();
  head.position.set(0, -NECK_Y, 0);
  headPivot.add(head);

  // swept-back tuft with a smaller spike behind it
  function spike(r: number, h: number, bend: number) {
    const geo = new THREE.ConeGeometry(r, h, 32, 10).translate(0, h / 2, 0);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + bend * Math.pow(p.getY(i) / h, 2));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, M.body);
    m.scale.z = 0.7;
    m.castShadow = true;
    return m;
  }
  const tuft = new THREE.Group();
  tuft.position.set(0, EGG.cy + EGG.h - 0.08, 0.02);
  head.add(tuft);
  const mainSpike = spike(0.23, 0.62, 0.2);
  mainSpike.rotation.z = -0.08;
  const backSpike = spike(0.12, 0.34, 0.1);
  backSpike.position.set(0.3, -0.03, -0.05);
  backSpike.rotation.z = -0.5;
  tuft.add(mainSpike, backSpike);

  // eyes: small glossy dots set wide apart
  const eyes: Array<{ ball: THREE.Mesh; arc: THREE.Mesh }> = [];
  const EYE_H = 0.17;
  [1, -1].forEach((s) => {
    const { pos, normal } = frontPoint(s * 0.68, 1.58, 0.02);
    const g = new THREE.Group();
    g.position.copy(pos);
    g.quaternion.setFromUnitVectors(Z, normal);
    const ball = new THREE.Mesh(eyeGeo, M.eye);
    ball.scale.set(0.15, EYE_H, 0.08);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.034, 12, 32, Math.PI), M.arc);
    arc.position.set(0, -0.03, 0.05);
    arc.visible = false;
    g.add(ball, arc);
    head.add(g);
    eyes.push({ ball, arc });
  });

  // small flat duck beak
  const beak = new THREE.Group();
  {
    const { pos, normal } = frontPoint(0, 1.5, -0.01);
    beak.position.copy(pos);
    beak.quaternion.setFromUnitVectors(Z, normal);
    head.add(beak);
  }
  const upper = blob(M.beakTop, 0.3, 0.13, 0.17);
  upper.position.set(0, 0.0, 0.0);
  const lower = blob(M.beakBot, 0.27, 0.095, 0.15);
  lower.position.set(0, -0.045, -0.01);
  const mouth = blob(M.mouth, 0.2, 0.05, 0.08);
  mouth.position.set(0, -0.04, -0.02);
  beak.add(mouth, lower, upper);

  // headphones: lavender ear cups on the sides
  [1, -1].forEach((s) => {
    const cup = new THREE.Group();
    cup.position.set(s * 1.33, 1.74, 0);
    head.add(cup);
    const shell = blob(M.cup, 0.15, 0.44, 0.38);
    cup.add(shell);
    const cap = blob(M.cupCap, 0.04, 0.3, 0.26);
    cap.position.x = s * 0.13;
    cup.add(cap);
    const cush = blob(M.pad, 0.1, 0.36, 0.3);
    cush.position.x = -s * 0.1;
    cup.add(cush);
  });

  // mic boom hugging the front, from the viewer's-left cup down to the mouth
  {
    const pts = [
      new V(-1.4, 1.54, 0.26),
      frontPoint(-1.22, 1.38, 0.1).pos,
      frontPoint(-1.0, 1.22, 0.11).pos,
      frontPoint(-0.8, 1.14, 0.13).pos,
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const boom = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.03, 12), M.boom);
    boom.castShadow = true;
    head.add(boom);
    const end = curve.getPoint(1);
    const tan = curve.getTangent(1);
    const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.12, 8, 20), M.micTip);
    tip.quaternion.setFromUnitVectors(Y, tan);
    tip.position.copy(end).addScaledVector(tan, 0.07);
    tip.castShadow = true;
    head.add(tip);
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
    headPivot.rotation.set(cur.hx * 0.5, cur.hy * 0.75, cur.hz * 0.8);
    wingR.rotation.set(cur.wrf, 0, cur.wr);
    wingL.rotation.set(cur.wlf, 0, -cur.wl);
    tail.rotation.set(cur.tx, cur.ty, 0);
    const happy = cur.happy > 0.5;
    for (const e of eyes) {
      e.ball.visible = !happy;
      e.arc.visible = happy;
      e.ball.scale.y = EYE_H * blink;
    }
    lower.rotation.x = cur.mouth * 0.35;
    mouth.scale.y = 0.05 + cur.mouth * 0.05;
  }

  function dispose() {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.geometry.dispose();
    });
    Object.values(M).forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  }

  return { root, meshes, update, dispose };
}
