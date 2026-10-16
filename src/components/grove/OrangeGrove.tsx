"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createSoori, type SooriMode } from "./soori";
import { createOrangeTree, type Fruit } from "./orangeTree";

export interface OrangeGroveHandle {
  /** Soori shakes the tree, catches an orange and hands it to the visitor. */
  pickOrange: (fruitIndex?: number) => void;
  celebrate: () => void;
  stopCelebrate: () => void;
}

interface OrangeGroveProps {
  handleRef?: React.Ref<OrangeGroveHandle>;
  /** The visitor clicked an orange on the tree. The parent decides whether to start the pick. */
  onRequestPick: (fruitIndex: number) => void;
  /** The orange reached the visitor. */
  onPickDone: () => void;
}

interface Api {
  pick: (fruitIndex?: number) => void;
  celebrate: (on: boolean) => void;
}

const V = THREE.Vector3;
const ease = (k: number) => k * k * (3 - 2 * k);
const SOORI_POS = new V(0, 0, 1.7);
const LAND = new V(0.5, 0.4, 3.2);
const HELD = new V(1.7, 2.0, 3.0);

function radialTexture(stops: Array<[number, string]>) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function OrangeGrove({ handleRef, onRequestPick, onPickDone }: OrangeGroveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<Api | null>(null);
  const cbRef = useRef({ onRequestPick, onPickDone });

  useEffect(() => {
    cbRef.current = { onRequestPick, onPickDone };
  });

  useImperativeHandle(
    handleRef,
    () => ({
      pickOrange: (i) => apiRef.current?.pick(i),
      celebrate: () => apiRef.current?.celebrate(true),
      stopCelebrate: () => apiRef.current?.celebrate(false),
    }),
    [],
  );

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canvas: HTMLCanvasElement = el;
    const host = canvas.parentElement as HTMLElement;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch (error) {
      // No WebGL: keep the pick flow alive so the page still works without the 3D scene.
      console.error("WebGL unavailable, orange grove disabled", error);
      apiRef.current = {
        pick: () => {
          window.setTimeout(() => cbRef.current.onPickDone(), 700);
        },
        celebrate: () => {},
      };
      return () => {
        apiRef.current = null;
      };
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#0d0f16", 28, 70);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.3;

    const TARGET = new V(0, 4.3, 0.6);
    const POLAR = Math.PI / 2 + 0.05;
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 300);

    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enableZoom = false; // keep the mouse wheel for page scrolling
    controls.enablePan = false;
    controls.minPolarAngle = controls.maxPolarAngle = POLAR;
    controls.rotateSpeed = 0.6;
    canvas.style.touchAction = "pan-y"; // vertical swipes scroll the page, horizontal drags rotate
    let interacted = false;
    controls.addEventListener("start", () => {
      interacted = true;
    });

    /* ---------- backdrop ---------- */
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const g = <T extends THREE.BufferGeometry>(x: T) => {
      geometries.push(x);
      return x;
    };
    const m = <T extends THREE.Material>(x: T) => {
      materials.push(x);
      return x;
    };

    scene.add(
      new THREE.Mesh(
        g(new THREE.SphereGeometry(120, 48, 24)),
        m(
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            fog: false,
            uniforms: { top: { value: new THREE.Color("#0b0e1c") }, horizon: { value: new THREE.Color("#3a2216") } },
            vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
            fragmentShader: `uniform vec3 top, horizon; varying vec3 vP;
              void main(){
                float h = vP.y * .5 + .5;
                vec3 c = mix(horizon, top, smoothstep(.5, .86, h));
                vec2 d = vP.xy - vec2(0., .1);
                c += vec3(1., .45, .12) * exp(-dot(d, d) * 16.) * .22 * step(vP.z, .2);
                gl_FragColor = vec4(c, 1.);
              }`,
          }),
        ),
      ),
    );

    {
      const n = 140;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const e = 0.12 + Math.random() * 1.2;
        pos[i * 3] = Math.cos(a) * Math.cos(e) * 100;
        pos[i * 3 + 1] = Math.sin(e) * 100;
        pos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * 100;
      }
      const geo = g(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(
        new THREE.Points(geo, m(new THREE.PointsMaterial({ color: "#ffffff", size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55, fog: false }))),
      );
    }

    const ground = new THREE.Mesh(
      g(new THREE.CircleGeometry(16, 64)),
      m(new THREE.MeshStandardMaterial({ color: "#16291b", roughness: 1 })),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const glowTex = radialTexture([[0, "rgba(255,255,255,.9)"], [0.4, "rgba(255,255,255,.25)"], [1, "rgba(255,255,255,0)"]]);
    textures.push(glowTex);
    const ringMat = m(new THREE.MeshStandardMaterial({ color: "#ff7a1a", emissive: new THREE.Color("#ff7a1a"), emissiveIntensity: 5, roughness: 0.4 }));
    const ring = new THREE.Mesh(g(new THREE.TorusGeometry(4.3, 0.035, 12, 200)), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    scene.add(ring);
    const floorGlow = new THREE.Mesh(
      g(new THREE.PlaneGeometry(13, 13)),
      m(new THREE.MeshBasicMaterial({ map: glowTex, color: "#ff7a1a", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = 0.03;
    scene.add(floorGlow);

    // grass tufts
    {
      const tuftGeo = g(new THREE.ConeGeometry(0.07, 0.45, 4));
      tuftGeo.translate(0, 0.22, 0);
      const count = 220;
      const grass = new THREE.InstancedMesh(tuftGeo, m(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1 })), count);
      const o = new THREE.Object3D();
      const cols = ["#2c5a30", "#356b38", "#1f4a26"].map((c) => new THREE.Color(c));
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2.2 + Math.random() * 9;
        o.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 0.5);
        o.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * 6, (Math.random() - 0.5) * 0.4);
        const s = 0.6 + Math.random() * 1.1;
        o.scale.set(s, s, s);
        o.updateMatrix();
        grass.setMatrixAt(i, o.matrix);
        grass.setColorAt(i, cols[i % cols.length]);
      }
      grass.receiveShadow = true;
      scene.add(grass);
      geometries.push(tuftGeo);
    }

    // fireflies
    const FIREFLIES = 70;
    const ffBase = new Float32Array(FIREFLIES * 3);
    const ffPos = new Float32Array(FIREFLIES * 3);
    for (let i = 0; i < FIREFLIES; i++) {
      ffBase[i * 3] = (Math.random() - 0.5) * 14;
      ffBase[i * 3 + 1] = 0.6 + Math.random() * 7;
      ffBase[i * 3 + 2] = (Math.random() - 0.3) * 9;
    }
    const ffGeo = g(new THREE.BufferGeometry());
    ffGeo.setAttribute("position", new THREE.BufferAttribute(ffPos, 3));
    const ffTex = radialTexture([[0, "rgba(255,255,255,1)"], [0.35, "rgba(255,255,255,.5)"], [1, "rgba(255,255,255,0)"]]);
    textures.push(ffTex);
    scene.add(
      new THREE.Points(
        ffGeo,
        m(new THREE.PointsMaterial({ map: ffTex, size: 9, sizeAttenuation: false, color: new THREE.Color(5, 3, 1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );

    /* ---------- lights ---------- */
    scene.add(new THREE.HemisphereLight("#dfe8ff", "#1a2a1c", 0.75));
    const key = new THREE.DirectionalLight("#ffe9d0", 2.4);
    key.position.set(5, 11, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -8, right: 8, top: 12, bottom: -3, near: 1, far: 40 });
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.03;
    key.shadow.radius = 5;
    scene.add(key);
    const rim = new THREE.DirectionalLight("#ff7a1a", 3.0);
    rim.position.set(-6, 5, -8);
    scene.add(rim);
    const fill = new THREE.DirectionalLight("#9fb4ff", 0.8);
    fill.position.set(-7, 3, 6);
    scene.add(fill);

    /* ---------- actors ---------- */
    const tree = createOrangeTree();
    scene.add(tree.group);
    const soori = createSoori();
    soori.root.position.copy(SOORI_POS);
    scene.add(soori.root);

    /* ---------- post-processing ---------- */
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.45, 2.2));
    composer.addPass(new OutputPass());

    /* ---------- sizing ---------- */
    function resize() {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const tn = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(12.6 / (2 * tn), 10 / (2 * tn * camera.aspect));
      if (!interacted) {
        camera.position.set(0, TARGET.y + dist * Math.cos(POLAR), TARGET.z + dist * Math.sin(POLAR));
      } else {
        camera.position.sub(controls.target).setLength(dist).add(controls.target);
      }
      controls.update();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let onScreen = true;
    const visObserver = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true;
    });
    visObserver.observe(host);

    /* ---------- state ---------- */
    const clock = new THREE.Clock();
    const fruits = tree.fruits;
    let danceOn = false;
    let temp: { mode: SooriMode; start: number; dur: number } | null = { mode: "wave", start: 0.8, dur: 2.8 };
    let shake = 0;
    interface Seq {
      start: number;
      fruit: Fruit;
      detached: boolean;
      from: THREE.Vector3;
    }
    let seq: Seq | null = null;
    const regrow: Array<{ fruit: Fruit; at: number }> = [];

    function startPick(index?: number) {
      if (seq) return;
      let fruit = index !== undefined ? fruits[index] : undefined;
      if (!fruit || fruit.picked) {
        const available = fruits.filter((f) => !f.picked);
        if (!available.length) {
          cbRef.current.onPickDone();
          return;
        }
        // Prefer oranges on the side facing the visitor so they can follow the action.
        const facing = available.filter((f) => f.home.z > 0.5);
        const pool = facing.length ? facing : available;
        fruit = pool[Math.floor(Math.random() * pool.length)];
      }
      fruit.group.userData.hovered = false;
      fruit.picked = true; // claimed, so it can't be clicked again while in flight
      temp = null;
      seq = { start: clock.elapsedTime, fruit, detached: false, from: new V() };
    }

    apiRef.current = {
      pick: startPick,
      celebrate: (on) => {
        danceOn = on;
        if (on) temp = null;
      },
    };

    /* ---------- pointer interaction ---------- */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    function aim(e: PointerEvent) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
    }
    function pickableFruitAt(e: PointerEvent): Fruit | null {
      aim(e);
      const live = fruits.filter((f) => !f.picked && f.group.parent === tree.canopy);
      const hit = ray.intersectObjects(
        live.map((f) => f.group),
        true,
      )[0];
      return hit ? (fruits[hit.object.userData.fruit as number] ?? null) : null;
    }

    let down: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 450) return;
      down = null;
      if (seq) return;
      const fruit = pickableFruitAt(e);
      if (fruit) {
        cbRef.current.onRequestPick(fruit.index);
        return;
      }
      aim(e);
      if (!danceOn && ray.intersectObjects(soori.meshes, false).length) {
        temp = { mode: Math.random() < 0.5 ? "happy" : "jump", start: clock.elapsedTime, dur: 1.9 };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.buttons) return;
      let hovered: Fruit | null = null;
      if (!seq) hovered = pickableFruitAt(e);
      for (const f of fruits) f.group.userData.hovered = f === hovered;
      canvas.style.cursor = hovered ? "pointer" : "grab";
    };
    const onLeave = () => {
      for (const f of fruits) f.group.userData.hovered = false;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    /* ---------- loop ---------- */
    const camNear = new V();
    let raf = 0;

    function runPickSequence(now: number, dt: number): { mode: SooriMode; t: number } {
      const s = seq as Seq;
      const e = now - s.start;
      const f = s.fruit;
      let mode: SooriMode;
      let t: number;
      if (e < 0.45) {
        mode = "crouch"; t = e;
      } else if (e < 1.2) {
        mode = "reach"; t = e - 0.45;
        shake = Math.min(1, (e - 0.45) / 0.3);
      } else if (e < 2.1) {
        mode = "watch"; t = e - 1.2;
      } else {
        mode = "give"; t = e - 2.1;
      }
      if (e >= 1.2) shake *= Math.exp(-4 * dt);

      if (e >= 0.95 && !s.detached) {
        s.detached = true;
        f.group.getWorldPosition(s.from);
        scene.attach(f.group);
        f.group.rotation.set(0, 0, 0);
        f.group.scale.setScalar(1);
      }
      if (s.detached) {
        const p = f.group.position;
        if (e < 1.6) {
          const k = (e - 0.95) / 0.65;
          p.x = s.from.x + (LAND.x - s.from.x) * ease(k);
          p.z = s.from.z + (LAND.z - s.from.z) * ease(k);
          p.y = s.from.y + (LAND.y - s.from.y) * k * k;
          f.group.rotation.z = e * 9;
        } else if (e < 1.95) {
          const k = (e - 1.6) / 0.35;
          p.copy(LAND);
          p.y += 0.45 * Math.sin(k * Math.PI) * (1 - k * 0.3);
          f.group.rotation.z = e * 9 * (1 - k);
        } else if (e < 2.1) {
          p.copy(LAND);
        } else if (e < 2.8) {
          const k = ease((e - 2.1) / 0.7);
          p.lerpVectors(LAND, HELD, k);
          p.y += Math.sin(k * Math.PI) * 0.8;
          f.group.scale.setScalar(1 + 0.4 * k);
          f.group.rotation.z *= 0.9;
        } else if (e < 3.5) {
          p.copy(HELD);
          p.y += Math.sin((e - 2.8) * 6) * 0.06;
          f.group.scale.setScalar(1.4 + Math.sin((e - 2.8) * 6) * 0.04);
        } else if (e < 4.1) {
          const k = ease((e - 3.5) / 0.6);
          camNear.copy(HELD).lerp(camera.position, 0.7);
          p.lerpVectors(HELD, camNear, k);
          f.group.scale.setScalar(1.4 + 1.2 * k);
        } else {
          f.group.visible = false;
          regrow.push({ fruit: f, at: now + 5 });
          seq = null;
          shake = 0;
          cbRef.current.onPickDone();
        }
      }
      return { mode, t };
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = clock.elapsedTime;

      let mode: SooriMode = "idle";
      let t = now;
      if (seq) {
        ({ mode, t } = runPickSequence(now, dt));
      } else if (danceOn) {
        mode = "dance"; t = now;
      } else if (temp) {
        if (now - temp.start >= 0) {
          if (now - temp.start < temp.dur) {
            mode = temp.mode; t = now - temp.start;
          } else {
            temp = null;
          }
        }
      }
      soori.update(mode, t, dt, now);

      for (let i = regrow.length - 1; i >= 0; i--) {
        const r = regrow[i];
        if (now < r.at) continue;
        const f = r.fruit;
        if (f.group.parent !== tree.canopy) {
          tree.canopy.add(f.group);
          f.group.position.copy(f.home);
          f.group.rotation.set(0, 0, 0);
          f.group.visible = true;
          f.group.userData.growth = 0;
        }
        const k = Math.min(1, (now - r.at) / 1.2);
        f.group.userData.growth = 1 - Math.pow(1 - k, 3) * Math.cos(k * 4);
        if (k >= 1) {
          f.group.userData.growth = 1;
          f.picked = false;
          regrow.splice(i, 1);
        }
      }
      tree.update(now, shake, dt);

      for (let i = 0; i < FIREFLIES; i++) {
        const ph = i * 1.7;
        ffPos[i * 3] = ffBase[i * 3] + Math.sin(now * 0.4 + ph) * 0.8;
        ffPos[i * 3 + 1] = ffBase[i * 3 + 1] + Math.sin(now * 0.7 + ph * 1.3) * 0.5;
        ffPos[i * 3 + 2] = ffBase[i * 3 + 2] + Math.cos(now * 0.35 + ph) * 0.8;
      }
      ffGeo.attributes.position.needsUpdate = true;
      ringMat.emissiveIntensity = 4.5 + Math.sin(now * 2) * 0.8;

      controls.update(dt);
      if (onScreen) composer.render(dt);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visObserver.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      apiRef.current = null;
      controls.dispose();
      soori.dispose();
      tree.dispose();
      geometries.forEach((x) => x.dispose());
      materials.forEach((x) => x.dispose());
      textures.forEach((x) => x.dispose());
      envTex.dispose();
      pmrem.dispose();
      rt.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Soori and the lucky orange tree"
      className="absolute inset-0 h-full w-full"
      style={{ cursor: "grab", outline: "none" }}
    />
  );
}
