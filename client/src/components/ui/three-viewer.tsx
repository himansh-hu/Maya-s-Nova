import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
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
    if (!containerRef.current) return;
    
    // Initialize Three.js scene
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // If the background is not transparent, set the background color
    if (backgroundColor !== 'transparent') {
      scene.background = new THREE.Color(backgroundColor);
    }
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: backgroundColor === 'transparent'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load 3D model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
    
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    
    setLoading(true);
    gltfLoader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;
        
        // Normalize scale
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = 2 / maxDim;
          model.scale.multiplyScalar(scale);
          
          // Apply custom scale if provided
          if (customizations?.scale) {
            model.scale.multiplyScalar(customizations.scale);
          }
        }
        
        // Apply customizations
        if (customizations?.color) {
          model.traverse((node) => {
            if (node instanceof THREE.Mesh && node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach((mat) => {
                  if (mat.color) {
                    mat.color.set(customizations.color!);
                  }
                });
              } else if (node.material.color) {
                node.material.color.set(customizations.color);
              }
            }
          });
        }
        
        scene.add(model);
        modelRef.current = model;
        setLoading(false);
      },
      (progress) => {
        // Progress callback
        console.log(`Loading model: ${(progress.loaded / progress.total) * 100}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      scene.clear();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [modelUrl, backgroundColor]);
  
  // Update model when customizations change
  useEffect(() => {
    if (!modelRef.current) return;
    
    // Apply color customization
    if (customizations?.color) {
      modelRef.current.traverse((node) => {
        if (node instanceof THREE.Mesh && node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => {
              if (mat.color) {
                mat.color.set(customizations.color!);
              }
            });
          } else if (node.material.color) {
            node.material.color.set(customizations.color);
          }
        }
      });
    }
    
    // Apply scale customization
    if (customizations?.scale && modelRef.current) {
      // Reset scale first
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const baseScale = 2 / maxDim;
        modelRef.current.scale.set(baseScale, baseScale, baseScale);
        modelRef.current.scale.multiplyScalar(customizations.scale);
      }
    }
  }, [customizations]);
  
  // Control functions
  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };
  
  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };
  
  const handleReset = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.z = 5;
    }
  };
  
  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
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
      
      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center space-x-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={handleReset}
            title="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Fullscreen button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/80 backdrop-blur-sm"
        onClick={handleFullscreen}
        title="Toggle fullscreen"
      >
        <Expand className="h-4 w-4" />
      </Button>
    </div>
  );
}
