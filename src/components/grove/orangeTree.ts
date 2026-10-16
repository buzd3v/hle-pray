import * as THREE from "three";

export interface Fruit {
  index: number;
  /** Group holding the orange, calyx and leaves. Reparented while it falls. */
  group: THREE.Group;
  /** Position in canopy-local space. */
  home: THREE.Vector3;
  material: THREE.MeshStandardMaterial;
  phase: number;
  picked: boolean;
  /** 0..1 hover highlight, eased every frame. */
  hover: number;
}

export interface OrangeTree {
  group: THREE.Group;
  canopy: THREE.Group;
  fruits: Fruit[];
  update: (now: number, shake: number, dt: number) => void;
  dispose: () => void;
}

export const CANOPY_CENTER = new THREE.Vector3(0, 6.1, -0.3);

// Deterministic pseudo random so the tree looks the same on every visit.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// [angle around the tree (0 = facing the camera), angle from the top]
const FRUIT_SPOTS: Array<[number, number]> = [
  [-0.55, 1.25], [0.35, 1.05], [0.95, 1.3], [-1.15, 1.0], [0.0, 1.55],
  [1.5, 0.95], [-0.2, 0.62], [-1.6, 1.4], [0.65, 0.62], [2.6, 1.15], [-2.5, 1.0],
  [0.2, 0.9], [-0.95, 0.78], [1.1, 0.8], [-0.4, 1.35],
];

export function createOrangeTree(): OrangeTree {
  const rand = rng(20260);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const track = <T extends THREE.BufferGeometry>(g: T) => {
    geometries.push(g);
    return g;
  };
  const mat = <T extends THREE.Material>(m: T) => {
    materials.push(m);
    return m;
  };

  const group = new THREE.Group();

  /* ---------- trunk + branches ---------- */
  const barkMat = mat(new THREE.MeshStandardMaterial({ color: "#5b3a26", roughness: 1 }));
  const trunkGeo = track(new THREE.CylinderGeometry(0.62, 1.15, 5.0, 24, 12, false));
  trunkGeo.translate(0, 2.5, 0);
  {
    const p = trunkGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      const flare = y < 0.7 ? (0.7 - y) * 0.35 : 0;
      const a = Math.atan2(p.getZ(i), p.getX(i));
      const r = 1 + flare * (0.6 + 0.4 * Math.sin(a * 5));
      p.setX(i, p.getX(i) * r + Math.sin(y * 0.55) * 0.14);
      p.setZ(i, p.getZ(i) * r - y * 0.035);
    }
    trunkGeo.computeVertexNormals();
  }
  const trunk = new THREE.Mesh(trunkGeo, barkMat);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.position.z = -0.6;
  group.add(trunk);

  const branchGeo = track(new THREE.CylinderGeometry(0.14, 0.3, 1, 10));
  branchGeo.translate(0, 0.5, 0);
  const trunkTop = new THREE.Vector3(0.1, 4.7, -0.78);
  ([[-1.9, 6.1, -0.2], [1.9, 6.3, -0.5], [0.1, 6.9, -1.0], [-0.9, 6.0, 1.0], [1.1, 5.9, 0.9]] as const).forEach(([x, y, z]) => {
    const end = new THREE.Vector3(x, y, z);
    const dir = end.clone().sub(trunkTop);
    const b = new THREE.Mesh(branchGeo, barkMat);
    b.position.copy(trunkTop);
    b.scale.set(1, dir.length(), 1);
    b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    b.castShadow = true;
    group.add(b);
  });

  /* ---------- canopy ---------- */
  const canopy = new THREE.Group();
  canopy.position.copy(CANOPY_CENTER);
  group.add(canopy);

  const RX = 3.5;
  const RY = 2.5;
  const RZ = 3.1;

  const leafColors = ["#2f7d32", "#3a8f3b", "#276b2c", "#4a9a3f"].map((c) => new THREE.Color(c));
  const blobGeo = track(new THREE.IcosahedronGeometry(1, 3));
  const blobMats = leafColors.map((c) =>
    mat(new THREE.MeshStandardMaterial({ color: c.clone().multiplyScalar(0.8), roughness: 0.9 })),
  );
  const blobCount = 30;
  for (let i = 0; i < blobCount; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(1 - rand() * 1.15); // keep it a dome, a bit flat underneath
    const k = 0.45 + rand() * 0.5;
    const m = new THREE.Mesh(blobGeo, blobMats[i % blobMats.length]);
    const s = 1.05 + rand() * 0.55;
    m.scale.set(s * 1.1, s * 0.9, s * 1.05);
    m.position.set(
      RX * k * Math.sin(phi) * Math.sin(theta),
      RY * k * Math.cos(phi) - 0.2,
      RZ * k * Math.sin(phi) * Math.cos(theta),
    );
    m.castShadow = true;
    m.receiveShadow = true;
    canopy.add(m);
  }

  // leaf cards to break up the smooth blobs
  const leafGeo = track(new THREE.SphereGeometry(1, 8, 6));
  const leafMat = mat(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.7 }));
  const LEAVES = 420;
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, LEAVES);
  leaves.castShadow = true;
  const tmp = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < LEAVES; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(1 - rand() * 1.2);
    const nx = Math.sin(phi) * Math.sin(theta);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.cos(theta);
    const normal = new THREE.Vector3(nx / RX, ny / RY, nz / RZ).normalize();
    tmp.position.set(RX * nx * 1.02, RY * ny * 1.02 - 0.1, RZ * nz * 1.02);
    tmp.quaternion.setFromUnitVectors(up, normal);
    tmp.rotateY(rand() * Math.PI * 2);
    tmp.rotateX(0.5 + rand() * 0.5);
    const s = 0.7 + rand() * 0.6;
    tmp.scale.set(0.34 * s, 0.05 * s, 0.17 * s);
    tmp.updateMatrix();
    leaves.setMatrixAt(i, tmp.matrix);
    leaves.setColorAt(i, leafColors[Math.floor(rand() * leafColors.length)]);
  }
  canopy.add(leaves);

  /* ---------- oranges ---------- */
  const peelTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      const v = 90 + Math.floor(rand() * 110);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.beginPath();
      ctx.arc(rand() * 256, rand() * 256, 0.8 + rand() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 1);
    textures.push(t);
    return t;
  })();

  const fruitGeo = track(new THREE.SphereGeometry(0.4, 40, 28));
  const calyxGeo = track(new THREE.SphereGeometry(0.12, 16, 12));
  const stemGeo = track(new THREE.CylinderGeometry(0.014, 0.02, 0.2, 8));
  const leafFruitGeo = track(new THREE.SphereGeometry(1, 12, 8));
  const hitGeo = track(new THREE.SphereGeometry(0.7, 8, 6));
  const calyxMat = mat(new THREE.MeshStandardMaterial({ color: "#2f6b2a", roughness: 0.8 }));
  const stemMat = mat(new THREE.MeshStandardMaterial({ color: "#4b6b2a", roughness: 0.9 }));
  const fruitLeafMat = mat(new THREE.MeshStandardMaterial({ color: "#3a9a3a", roughness: 0.6 }));
  const hitMat = mat(new THREE.MeshBasicMaterial({ visible: false }));

  const fruits: Fruit[] = FRUIT_SPOTS.map(([theta, phi], index) => {
    const material = mat(
      new THREE.MeshStandardMaterial({
        color: "#ff8a1c",
        roughness: 0.5,
        bumpMap: peelTex,
        bumpScale: 0.9,
        emissive: new THREE.Color("#ff5a00"),
        emissiveIntensity: 0.3,
      }),
    );
    const g = new THREE.Group();
    const orange = new THREE.Mesh(fruitGeo, material);
    orange.scale.set(1, 0.94, 1);
    orange.castShadow = true;
    g.add(orange);
    const calyx = new THREE.Mesh(calyxGeo, calyxMat);
    calyx.scale.set(1.5, 0.35, 1.5);
    calyx.position.y = 0.36;
    g.add(calyx);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.5;
    g.add(stem);
    [-1, 1].forEach((s) => {
      const leaf = new THREE.Mesh(leafFruitGeo, fruitLeafMat);
      leaf.scale.set(0.25, 0.03, 0.11);
      leaf.position.set(s * 0.2, 0.52, 0.02);
      leaf.rotation.z = s * 0.35;
      g.add(leaf);
    });
    const hit = new THREE.Mesh(hitGeo, hitMat);
    g.add(hit);
    g.traverse((o) => {
      o.userData.fruit = index;
    });

    const home = new THREE.Vector3(
      RX * 0.97 * Math.sin(phi) * Math.sin(theta),
      RY * 0.97 * Math.cos(phi) - 0.15,
      RZ * 0.97 * Math.sin(phi) * Math.cos(theta),
    );
    g.position.copy(home);
    canopy.add(g);
    return { index, group: g, home, material, phase: rand() * Math.PI * 2, picked: false, hover: 0 };
  });

  /* ---------- per-frame ---------- */
  function update(now: number, shake: number, dt: number) {
    canopy.rotation.z = Math.sin(now * 0.7) * 0.01 + Math.sin(now * 26) * 0.028 * shake;
    canopy.rotation.x = Math.sin(now * 0.5) * 0.006 + Math.sin(now * 23 + 1) * 0.02 * shake;
    for (const f of fruits) {
      if (f.group.parent !== canopy) continue;
      f.group.rotation.z = Math.sin(now * 1.3 + f.phase) * 0.05 + Math.sin(now * 31 + f.phase) * 0.18 * shake;
      f.hover += ((f.group.userData.hovered ? 1 : 0) - f.hover) * (1 - Math.exp(-12 * dt));
      const s = f.group.userData.growth ?? 1;
      f.group.scale.setScalar((1 + f.hover * 0.14) * s);
      f.material.emissiveIntensity = 0.3 + f.hover * 0.55;
    }
  }

  function dispose() {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    leaves.dispose();
  }

  return { group, canopy, fruits, update, dispose };
}
