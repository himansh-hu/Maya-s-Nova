import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Button } from '@/components/ui/button';
import { Expand, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreeViewerProps {
  modelUrl: string;
  className?: string;
  height?: string;
  backgroundColor?: string;
  customizations?: {
    color?: string;
    material?: string;
    scale?: number;
  };
}

export function ThreeViewer({
  modelUrl,
  className,
  height = '400px',
  backgroundColor = 'transparent',
  customizations
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;
    
    const width = containerRef.current.clientWidth;
    const heightPx = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    if (backgroundColor !== 'transparent') {
      scene.background = new THREE.Color(backgroundColor);
    }
    
    const camera = new THREE.PerspectiveCamera(75, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 3); // Better default position for GLB models
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: backgroundColor === 'transparent' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Use modern color space API
    // @ts-ignore - available in three r152+
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1; // Allow closer zoom for better detail viewing
    controls.maxDistance = 15; // Allow further zoom for larger models
    controls.enablePan = true; // Enable panning for better navigation
    controlsRef.current = controls;
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const ext = modelUrl.split('.').pop()?.toLowerCase();
    const safeUrl = encodeURI(modelUrl);
    setLoading(true);

    const normalizeAndAdd = (object: THREE.Object3D) => {
      const model = object;
      // Compute bounding box robustly by merging mesh bounds
      const overallBox = new THREE.Box3();
      let hasValidGeometry = false;
      model.traverse((node) => {
        const mesh = node as THREE.Mesh;
        if (mesh && (mesh as any).isMesh && mesh.geometry) {
          const geom = mesh.geometry as THREE.BufferGeometry;
          const pos = geom.getAttribute('position');
          if (pos && pos.count > 0 && isFinite(pos.getX(0))) {
            geom.computeBoundingBox();
            if (geom.boundingBox) {
              overallBox.union(geom.boundingBox.applyMatrix4(mesh.matrixWorld));
              hasValidGeometry = true;
            }
          }
        }
      });

      if (hasValidGeometry) {
        const center = overallBox.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const size = overallBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          // Scale to fit in a 2.5-unit box for better visibility of GLB models
          const scale = 2.5 / maxDim;
          model.scale.multiplyScalar(scale);
          if (customizations?.scale) model.scale.multiplyScalar(customizations.scale);
          
          // Position model slightly above center for better viewing
          model.position.y += 0.2;
        }
      }

      if (customizations?.color) {
        model.traverse((node) => {
          const mesh = node as THREE.Mesh;
          if (mesh && (mesh as any).isMesh) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat: any) => { if (mat && mat.color) mat.color.set(customizations.color); });
          }
        });
      }

      scene.add(model);
      modelRef.current = model;
      setLoading(false);
      
      // Auto-fit camera to the model for better viewing
      if (controlsRef.current && hasValidGeometry) {
        const newBox = new THREE.Box3().setFromObject(model);
        const newSize = newBox.getSize(new THREE.Vector3());
        const newMaxDim = Math.max(newSize.x, newSize.y, newSize.z);
        
        if (newMaxDim > 0) {
          const distance = newMaxDim * 2.5;
          camera.position.set(distance, distance * 0.5, distance);
          camera.lookAt(0, 0, 0);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      }
    };

    const onError = (e: any) => {
      console.error('Error loading model:', e);
      setError('Failed to load 3D model');
      setLoading(false);
    };

    if (ext === 'gltf' || ext === 'glb') {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      gltfLoader.load(safeUrl, (gltf) => normalizeAndAdd(gltf.scene), undefined, onError);
    } else if (ext === 'obj') {
      const objLoader = new OBJLoader();
      objLoader.load(safeUrl, (obj) => normalizeAndAdd(obj), undefined, onError);
    } else {
      onError(new Error(`Unsupported model format: ${ext || 'unknown'}`));
    }
    
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      controls.dispose();
    };
  }, [modelUrl, backgroundColor, customizations?.scale, customizations?.color]);
  
  useEffect(() => {
    if (!modelRef.current) return;
    if (customizations?.color) {
      modelRef.current.traverse((node) => {
        const mesh = node as THREE.Mesh;
        if (mesh && (mesh as any).isMesh) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat: any) => { if (mat && mat.color) mat.color.set(customizations.color); });
        }
      });
    }
    if (customizations?.scale) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (isFinite(maxDim) && maxDim > 0) {
        const baseScale = 2 / maxDim;
        modelRef.current.scale.set(baseScale, baseScale, baseScale);
        modelRef.current.scale.multiplyScalar(customizations.scale);
      }
    }
  }, [customizations]);
  
  const handleZoomIn = () => { controlsRef.current?.dollyIn(1.2); controlsRef.current?.update(); };
  const handleZoomOut = () => { controlsRef.current?.dollyOut(1.2); controlsRef.current?.update(); };
  const handleReset = () => { if (controlsRef.current && cameraRef.current) { controlsRef.current.reset(); cameraRef.current.position.z = 5; } };
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen(); else containerRef.current.requestFullscreen();
  };
  
  return (
    <div className={cn("relative rounded-lg overflow-hidden border bg-background", className)} style={{ height }}>
      <div ref={containerRef} className="w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading 3D Model...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="max-w-md p-6 text-center">
              <p className="text-destructive mb-2">Failed to load 3D model</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center space-x-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleZoomOut} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleReset} title="Reset view">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleZoomIn} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/80 backdrop-blur-sm" onClick={handleFullscreen} title="Toggle fullscreen">
        <Expand className="h-4 w-4" />
      </Button>
    </div>
  );
}
