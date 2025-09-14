// client/src/components/ThreeGLTFViewer.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"; // uncomment if you use Draco compressed .glb

type Props = {
  src: string; // URL to .glb (ex: "/products/groot.glb")
  height?: number | string; // e.g. 480 or "100%"
  autoRotate?: boolean;
};

export default function ThreeGLTFViewer({
  src,
  height = 420,
  autoRotate = false,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene + camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b0b);

    const width = container.clientWidth || 600;
    const h = typeof height === "number" ? height : container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(45, width / (typeof h === "number" ? h : 420), 0.1, 1000);
    camera.position.set(0, 0.5, 3); // Better default position for GLB models

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, typeof h === "number" ? h : 420);
   renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    // Better zoom limits for GLB models
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.enablePan = true; // Enable panning for better navigation

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    // Loader (GLTF)
    const loader = new GLTFLoader();

    // Optional: If your .glb files are Draco compressed, uncomment and configure:
    // const draco = new DRACOLoader();
    // draco.setDecoderPath("/draco/"); // place draco decoder files in public/draco/
    // loader.setDRACOLoader(draco);

    let modelRoot: THREE.Group | null = null;

    function fitCameraToObject(object: THREE.Object3D, camera: THREE.PerspectiveCamera, controls: OrbitControls, factor = 1.2) {
      const box = new THREE.Box3().setFromObject(object);
      if (!box.isEmpty()) {
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * factor;
        if (!isFinite(cameraZ) || cameraZ === 0) cameraZ = 2; // fallback
        camera.position.set(center.x, center.y, cameraZ + 0.3);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();

        // Set sensible zoom limits based on model size
        const minDistance = Math.max(0.1, maxDim * 0.3);
        const maxDistance = Math.max(3, maxDim * 10);
        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;
      }
    }

    loader.load(
      src,
      (gltf) => {
        modelRoot = gltf.scene;
        // validate geometry: skip meshes with no valid positions
        let hasValid = false;
        modelRoot.traverse((child: any) => {
          if (child.isMesh) {
            const pos = child.geometry?.attributes?.position;
            if (pos && pos.count > 0 && Array.from(pos.array).every((v: number) => Number.isFinite(v))) {
              hasValid = true;
            }
          }
        });

        if (!hasValid) {
          console.warn("GLTF loaded but no valid mesh positions found:", src);
        }

        // optional: adjust default scale if extremely large/small
        // Compute bounding box to decide scale normalization
        const box = new THREE.Box3().setFromObject(modelRoot);
        if (!box.isEmpty()) {
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 100 || maxDim < 0.001) {
            const scaleFactor = 1 / Math.max(maxDim, 1);
            modelRoot.scale.setScalar(scaleFactor);
          }
        }

        scene.add(modelRoot);
        fitCameraToObject(modelRoot, camera, controls);
      },
      (progress) => {
        // optional: you can expose progress via event or console for now
        // console.log("GLTF loading:", src, (progress.loaded / (progress.total || 1) * 100).toFixed(1) + "%");
      },
      (err) => {
        console.error("Error loading GLTF:", err);
      }
    );

    // Animate
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handling
    const onResize = () => {
      const w = container.clientWidth;
      const h = typeof height === "number" ? height : container.clientHeight || 420;
      camera.aspect = w / (typeof h === "number" ? h : 420);
      camera.updateProjectionMatrix();
      renderer.setSize(w, typeof h === "number" ? h : 420);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      window.removeEventListener("resize", onResize);

      controls.dispose();
      if (modelRoot) {
        scene.remove(modelRoot);
        modelRoot.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: any) => m.dispose?.());
            } else {
              obj.material?.dispose?.();
            }
            if (obj.material?.map) obj.material.map.dispose?.();
          }
        });
      }

      renderer.dispose();
      try {
        const gl = renderer.getContext();
        const lose = gl.getExtension("WEBGL_lose_context");
        lose?.loseContext();
      } catch (e) {
        // ignore
      }

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
    };
  }, [src, height, autoRotate]);

  return <div ref={mountRef} style={{ width: "100%", height }} />;
}
