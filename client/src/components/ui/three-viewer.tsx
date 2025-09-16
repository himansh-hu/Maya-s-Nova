import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface ThreeViewerProps {
  modelUrl: string;
  className?: string;
  height?: string;
  backgroundColor?: string;
  sensitivity?: number;
  showControls?: boolean;
  customizations?: {
    color?: string;
    material?: string;
    scale?: number;
  };
  isDarkMode?: boolean;
  productName?: string;
}

// Product-specific camera configurations
const PRODUCT_CONFIGS: Record<string, {
  cameraPosition?: [number, number, number];
  targetPosition?: [number, number, number];
  scale?: number;
  minDistance?: number;
  maxDistance?: number;
}> = {
  'model 1': {
    cameraPosition: [0, 0, 2.5],
    scale: 1.2,
    minDistance: 1.5,
    maxDistance: 5
  },
  'model_1': {
    cameraPosition: [0, 0, 2.5],
    scale: 1.2,
    minDistance: 1.5,
    maxDistance: 5
  },
  'model 2': {
    cameraPosition: [0, 0, 2.8],
    scale: 1.3,
    minDistance: 1.8,
    maxDistance: 6
  },
  'model_2': {
    cameraPosition: [0, 0, 2.8],
    scale: 1.3,
    minDistance: 1.8,
    maxDistance: 6
  },
  'model 3': {
    cameraPosition: [0, 0.2, 3],
    scale: 1.1,
    minDistance: 2,
    maxDistance: 6
  },
  'model_3': {
    cameraPosition: [0, 0.2, 3],
    scale: 1.1,
    minDistance: 2,
    maxDistance: 6
  },
  'model 4': {
    cameraPosition: [0, 0.2, 3],
    scale: 1.1,
    minDistance: 2,
    maxDistance: 6
  },
  'model_4': {
    cameraPosition: [0, 0.2, 3],
    scale: 1.1,
    minDistance: 2,
    maxDistance: 6
  },
  'model 5': {
    cameraPosition: [0, 0, 2.5],
    scale: 1.4,
    minDistance: 1.5,
    maxDistance: 5
  },
  'model_5': {
    cameraPosition: [0, 0, 2.5],
    scale: 1.4,
    minDistance: 1.5,
    maxDistance: 5
  },
  'model 6': {
    cameraPosition: [0, 0, 2.8],
    scale: 1.3,
    minDistance: 1.8,
    maxDistance: 6
  },
  'model_6': {
    cameraPosition: [0, 0, 2.8],
    scale: 1.3,
    minDistance: 1.8,
    maxDistance: 6
  },
  'model 7': {
    cameraPosition: [0, 0, 4],
    scale: 2.5,
    minDistance: 2,
    maxDistance: 8
  },
  'model_7': {
    cameraPosition: [0, 0, 4],
    scale: 2.5,
    minDistance: 2,
    maxDistance: 8
  },
  'model 8': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  },
  'model_8': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  },
  'model 9': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  },
  'model_9': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  },
  'model 10': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  },
  'model_10': {
    cameraPosition: [0, 0, 2.2],
    scale: 1.0,
    minDistance: 1.2,
    maxDistance: 4
  }
};

export function ThreeViewer({
  modelUrl,
  className = "",
  height = '400px',
  backgroundColor = 'transparent',
  sensitivity = 0.3,
  showControls = true,
  customizations,
  isDarkMode = false,
  productName = ""
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [rotationSensitivity, setRotationSensitivity] = useState(sensitivity);
  const [zoomSensitivity, setZoomSensitivity] = useState(sensitivity);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const boundingBoxRef = useRef<THREE.Box3 | null>(null);

  // Get product configuration
  const getProductConfig = useCallback(() => {
    const lowerName = productName.toLowerCase().replace(/\s+/g, '');
    for (const [key, config] of Object.entries(PRODUCT_CONFIGS)) {
      if (lowerName.includes(key.replace('_', '')) || lowerName.includes(key.replace(' ', ''))) {
        return config;
      }
    }
    return {};
  }, [productName]);

  // Save/Load user preferences with product-specific keys
  useEffect(() => {
    const storageKey = productName ? `3d-viewer-${productName.toLowerCase().replace(/\s+/g, '-')}` : '3d-viewer-sensitivity';
    const savedSettings = localStorage.getItem(storageKey);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setRotationSensitivity(settings.rotation || sensitivity);
        setZoomSensitivity(settings.zoom || sensitivity);
      } catch (e) {
        console.warn('Could not load saved viewer settings');
      }
    }
  }, [sensitivity, productName]);

  useEffect(() => {
    const storageKey = productName ? `3d-viewer-${productName.toLowerCase().replace(/\s+/g, '-')}` : '3d-viewer-sensitivity';
    localStorage.setItem(storageKey, JSON.stringify({
      rotation: rotationSensitivity,
      zoom: zoomSensitivity
    }));
  }, [rotationSensitivity, zoomSensitivity, productName]);

  // Update controls sensitivity and zoom limits
  useEffect(() => {
    if (controlsRef.current && boundingBoxRef.current) {
      const box = boundingBoxRef.current;
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      controlsRef.current.rotateSpeed = rotationSensitivity;
      controlsRef.current.zoomSpeed = zoomSensitivity;
      controlsRef.current.panSpeed = zoomSensitivity * 0.8;
      
      // Set zoom limits based on model size and product config
      const config = getProductConfig();
      controlsRef.current.minDistance = config.minDistance || maxDim * 0.5;
      controlsRef.current.maxDistance = config.maxDistance || maxDim * 3;
    }
  }, [rotationSensitivity, zoomSensitivity, getProductConfig]);

  // Reset view function with product-specific positioning
  const resetView = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !boundingBoxRef.current) return;
    
    const box = boundingBoxRef.current;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const config = getProductConfig();
    
    // Calculate optimal camera position with product-specific overrides
    let distance = maxDim * 1.5;
    let cameraPos = new THREE.Vector3(0, 0, distance);
    let targetPos = center.clone();
    
    if (config.cameraPosition) {
      cameraPos.set(...config.cameraPosition);
    }
    if (config.targetPosition) {
      targetPos.set(...config.targetPosition);
    }
    
    // Smooth reset animation
    const startPos = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const startTime = performance.now();
    const duration = 600;
    
    const animateReset = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2); // Ease out
      
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerpVectors(startPos, cameraPos, eased);
        controlsRef.current.target.lerpVectors(startTarget, targetPos, eased);
        controlsRef.current.update();
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };
    requestAnimationFrame(animateReset);
  }, [getProductConfig]);

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    const width = containerRef.current.clientWidth;
    const heightPx = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Dynamic background based on theme
    if (backgroundColor !== 'transparent') {
      scene.background = new THREE.Color(backgroundColor);
    } else {
      scene.background = new THREE.Color(isDarkMode ? '#1f2937' : '#f3f4f6');
    }

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: backgroundColor === 'transparent',
      powerPreference: "high-performance"
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.rotateSpeed = rotationSensitivity;
    controls.zoomSpeed = zoomSensitivity;
    controls.panSpeed = zoomSensitivity * 0.8;
    controlsRef.current = controls;

    // Enhanced lighting setup with theme consideration
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.4 : 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 0.8 : 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(2048);
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 0.2 : 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Load model
    const ext = modelUrl.split('.').pop()?.toLowerCase();
    setLoading(true);
    setError(null);
    setLoadingProgress(0);

    const onProgress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setLoadingProgress(progress);
      }
    };

    const onError = (e: any) => {
      console.error('Model loading error:', e);
      setError('Failed to load 3D model');
      setLoading(false);
    };

    const processModel = (object: THREE.Object3D) => {
      // Clear previous model
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }

      const model = object;
      
      // Calculate bounding box FIRST before any transformations
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // CENTER THE MODEL AT ORIGIN - This is the key fix
      // We need to move the model so its center is at (0,0,0)
      model.position.set(-center.x, -center.y, -center.z);
      
      // Get product-specific configuration
      const config = getProductConfig();
      
      // Scale model to fit view optimally with product-specific overrides
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        let scale = 2.5 / maxDim; // Default scale
        
        if (config.scale) {
          scale *= config.scale;
        }
        
        model.scale.setScalar(scale);
        
        if (customizations?.scale) {
          model.scale.multiplyScalar(customizations.scale);
        }
      }

      // Update bounding box after centering and scaling
      const scaledBox = new THREE.Box3().setFromObject(model);
      boundingBoxRef.current = scaledBox;

      // Apply customizations
      if (customizations?.color) {
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat: any) => {
              if (mat?.color) {
                mat.color.set(customizations.color);
                mat.needsUpdate = true;
              }
            });
          }
        });
      }

      // Add shadows
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
      modelRef.current = model;
      
      // Set optimal camera position and controls with product-specific settings
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledMaxDim = Math.max(scaledSize.x, scaledSize.y, scaledSize.z);
      
      let optimalDistance = scaledMaxDim * 1.5;
      let cameraPosition = new THREE.Vector3(0, 0, optimalDistance);
      let targetPosition = new THREE.Vector3(0, 0, 0); // Target the center since model is now centered
      
      if (config.cameraPosition) {
        cameraPosition.set(...config.cameraPosition);
      }
      if (config.targetPosition) {
        targetPosition.set(...config.targetPosition);
      }
      
      camera.position.copy(cameraPosition);
      controls.target.copy(targetPosition);
      controls.minDistance = config.minDistance || scaledMaxDim * 0.8;
      controls.maxDistance = config.maxDistance || scaledMaxDim * 3;
      controls.update();
      
      setLoading(false);
      setLoadingProgress(100);
    };

    // Load based on file type
    if (ext === 'gltf' || ext === 'glb') {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      dracoLoader.setDecoderConfig({ type: 'js' });
      
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      
      gltfLoader.load(
        encodeURI(modelUrl),
        (gltf: { scene: THREE.Object3D<THREE.Object3DEventMap>; }) => processModel(gltf.scene),
        onProgress,
        onError
      );
    } else if (ext === 'obj') {
      const objLoader = new OBJLoader();
      objLoader.load(
        encodeURI(modelUrl),
        (obj: THREE.Object3D<THREE.Object3DEventMap>) => processModel(obj),
        onProgress,
        onError
      );
    } else {
      onError(new Error(`Unsupported format: ${ext}`));
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
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
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      scene.clear();
    };
  }, [modelUrl, backgroundColor, customizations, rotationSensitivity, zoomSensitivity, isDarkMode, getProductConfig]);

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      {/* 3D Container */}
      <div 
        ref={containerRef}
        className={`w-full h-full rounded-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}
        style={{ userSelect: 'none' }}
      />

      {/* Loading State */}
      {loading && (
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-sm flex flex-col items-center justify-center rounded-lg`}>
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mb-3"></div>
          <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
            Loading 3D Model...
          </div>
          {loadingProgress > 0 && (
            <>
              <div className={`w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-1`}>
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {loadingProgress}%
              </div>
            </>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-red-900/50' : 'bg-red-50'
        } flex items-center justify-center rounded-lg`}>
          <div className="text-red-600 text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Controls */}
      {showControls && !loading && !error && (
        <>
          {/* Control Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-50">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-10 h-10 ${
                isDarkMode ? 'bg-gray-700/95 hover:bg-gray-600' : 'bg-white/95 hover:bg-white'
              } shadow-lg rounded-lg flex items-center justify-center transition-all ${
                showSettings ? 'ring-2 ring-blue-400' : ''
              }`}
              title="Sensitivity Settings"
            >
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <button
              onClick={resetView}
              className={`w-10 h-10 ${
                isDarkMode ? 'bg-gray-700/95 hover:bg-gray-600' : 'bg-white/95 hover:bg-white'
              } shadow-lg rounded-lg flex items-center justify-center transition-all`}
              title="Reset View"
            >
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`absolute top-3 right-16 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl shadow-2xl border p-5 w-64 z-40`} style={{ zIndex: 9999 }}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
                Viewer Settings
              </h3>
              
              <div className="space-y-4">
                {/* Rotation Speed */}
                <div>
                  <label className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}>
                    Rotation Speed
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={rotationSensitivity}
                    onChange={(e) => setRotationSensitivity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotationSensitivity - 0.1) / 1.9 * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${(rotationSensitivity - 0.1) / 1.9 * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`
                    }}
                  />
                  <div className={`flex justify-between text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } mt-1`}>
                    <span>0.1x</span>
                    <span className="font-medium">{rotationSensitivity.toFixed(1)}x</span>
                    <span>2x</span>
                  </div>
                </div>

                {/* Zoom Speed */}
                <div>
                  <label className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}>
                    Zoom Speed
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={zoomSensitivity}
                    onChange={(e) => setZoomSensitivity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(zoomSensitivity - 0.1) / 1.9 * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${(zoomSensitivity - 0.1) / 1.9 * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`
                    }}
                  />
                  <div className={`flex justify-between text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } mt-1`}>
                    <span>0.1x</span>
                    <span className="font-medium">{zoomSensitivity.toFixed(1)}x</span>
                    <span>2x</span>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <label className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}>
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Slow', rotation: 0.2, zoom: 0.2 },
                      { label: 'Normal', rotation: 0.5, zoom: 0.5 },
                      { label: 'Fast', rotation: 1.0, zoom: 1.0 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setRotationSensitivity(preset.rotation);
                          setZoomSensitivity(preset.zoom);
                        }}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className={`absolute bottom-3 left-3 ${
            isDarkMode ? 'bg-gray-900/80 text-gray-200' : 'bg-black/70 text-white'
          } text-xs px-3 py-2 rounded-lg backdrop-blur-sm`}>
            🖱️ Drag • 🖲️ Zoom • ⚙️ Settings
          </div>
        </>
      )}
    </div>
  );
}