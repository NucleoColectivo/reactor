'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function TejidoAudiovisual() {
  const mountRef = useRef(null);
  const startButtonRef = useRef(null);
  const startScreenRef = useRef(null);
  const errorMessageRef = useRef(null);
  const themeInputRef = useRef(null);
  const generateSceneButtonRef = useRef(null);
  const buttonTextRef = useRef(null);
  const geminiStatusRef = useRef(null);
  const videoElementRef = useRef(null);
  const btnSphereRef = useRef(null);
  const btnPlaneRef = useRef(null);
  const paramSpeedRef = useRef(null);
  const paramNoiseRef = useRef(null);
  const paramBloomRef = useRef(null);

  useEffect(() => {
    const apiKey = "";
    let scene, camera, renderer, composer, controls, bloomPass;
    let audioContext, analyser, dataArray, frequencyTexture, smoothedFrequencyData;
    let targetColors = null;
    let transitionProgress = 1;
    let smoothedAudioLevel = 0;
    let currentVisualizer = null;
    let sceneSettings = {
      speed: 1.0,
      noiseStrength: 1.0,
      bloomStrength: 1.2,
      colors: ["#FF0055", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"]
    };
    let currentSpeed = 1.0;
    let currentNoise = 1.0;
    let timeOffset = 0;

    const sphereVertexShader = `
        uniform float uTime;
        uniform float uAudioLevel;
        uniform float uNoiseStrength;
        uniform sampler2D uVideoTexture;
        attribute vec3 initialPosition;
        varying vec3 vColor;
        
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
        float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.0);Pi0=mod(Pi0,289.0);Pi1=mod(Pi1,289.0);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.0);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0/7.0;vec4 gy0=fract(floor(gx0)/7.0)-0.5;gx0=fract(gx0);vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.0));gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);vec4 gx1=ixy1/7.0;vec4 gy1=fract(floor(gx1)/7.0)-0.5;gx1=fract(gx1);vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.0));gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}
        
        void main() {
            vColor = color;
            vec3 pos = initialPosition;
            vec3 normal = normalize(initialPosition);
            
            float noise = cnoise(initialPosition * 0.05 + uTime * 0.3) * (5.0 * uNoiseStrength);
            pos += normal * noise;
            
            vec4 screenPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vec2 uv = screenPos.xy / screenPos.w * 0.5 + 0.5;
            uv.x = 1.0 - uv.x;
            
            vec4 videoColor = texture2D(uVideoTexture, uv);
            float brightness = (videoColor.r + videoColor.g + videoColor.b) / 3.0;
            
            float displacement = brightness * 60.0 * (1.0 + uAudioLevel * 5.0); 
            pos += normal * displacement;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.0 * (1.0 + uAudioLevel) * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const planeVertexShader = `
        uniform float uTime;
        uniform float uNoiseStrength;
        uniform sampler2D uFrequencyTexture;
        varying vec3 vColor;
        
        void main() {
            vColor = color;
            vec3 pos = position;
            
            float freq = texture2D(uFrequencyTexture, vec2(uv.x, 0.5)).r;
            
            float wave = sin(uv.y * (8.0 * uNoiseStrength) + uTime) * (5.0 * uNoiseStrength);
            
            pos.z += (freq * 80.0) + wave;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 3.0 * (1.0 + freq * 2.0);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
        varying vec3 vColor;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if(dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
            gl_FragColor = vec4(vColor, alpha);
        }
    `;

    const visualizers = {
      sphere: {
          mesh: null,
          init: () => {
              const particleCount = 20000;
              const geometry = new THREE.BufferGeometry();
              const positions = new Float32Array(particleCount * 3);
              const colors = new Float32Array(particleCount * 3);
              const palette = sceneSettings.colors.map(c => new THREE.Color(c));

              for (let i = 0; i < particleCount; i++) {
                  const i3 = i * 3;
                  const radius = 50;
                  const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
                  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

                  positions[i3] = radius * Math.cos(theta) * Math.sin(phi);
                  positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
                  positions[i3 + 2] = radius * Math.cos(phi);
                  
                  const color = palette[Math.floor(Math.random() * palette.length)];
                  colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
              }
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
              geometry.setAttribute('initialPosition', new THREE.BufferAttribute(positions.slice(), 3));
              geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
              
              const material = new THREE.ShaderMaterial({
                  uniforms: {
                      uTime: { value: 0.0 },
                      uAudioLevel: { value: 0.0 },
                      uNoiseStrength: { value: 1.0 },
                      uVideoTexture: { value: new THREE.VideoTexture(videoElementRef.current) }
                  },
                  vertexShader: sphereVertexShader,
                  fragmentShader: fragmentShader,
                  vertexColors: true, 
                  blending: THREE.AdditiveBlending, 
                  transparent: true, 
                  depthWrite: false
              });
              visualizers.sphere.mesh = new THREE.Points(geometry, material);
              scene.add(visualizers.sphere.mesh);
          },
          update: (time) => {
              const uniforms = visualizers.sphere.mesh.material.uniforms;
              uniforms.uTime.value = time;
              uniforms.uNoiseStrength.value = currentNoise;
              const bassLevel = dataArray.slice(0, 20).reduce((a, b) => a + b, 0) / 20 / 255;
              smoothedAudioLevel = THREE.MathUtils.lerp(smoothedAudioLevel, bassLevel, 0.1);
              uniforms.uAudioLevel.value = smoothedAudioLevel;
          }
      },
      plane: {
          mesh: null,
          init: () => {
              const planeSize = 250;
              const segments = 100;
              const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
              const colors = new Float32Array(geometry.attributes.position.count * 3);
              const palette = sceneSettings.colors.map(c => new THREE.Color(c));
              
              for (let i = 0; i < colors.length / 3; i++) {
                  const color = palette[Math.floor(Math.random() * palette.length)];
                  colors[i*3] = color.r; colors[i*3+1] = color.g; colors[i*3+2] = color.b;
              }
              geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
              
              const material = new THREE.ShaderMaterial({
                  uniforms: {
                      uTime: { value: 0.0 },
                      uNoiseStrength: { value: 1.0 },
                      uFrequencyTexture: { value: frequencyTexture }
                  },
                  vertexShader: planeVertexShader,
                  fragmentShader: fragmentShader,
                  vertexColors: true, 
                  blending: THREE.AdditiveBlending, 
                  transparent: true, 
                  depthWrite: false
              });
              visualizers.plane.mesh = new THREE.Points(geometry, material);
              visualizers.plane.mesh.rotation.x = -Math.PI / 2.2;
              scene.add(visualizers.plane.mesh);
          },
          update: (time) => {
              for(let i = 0; i < dataArray.length; i++) {
                  const v = dataArray[i] / 255;
                  const p = smoothedFrequencyData[i];
                  smoothedFrequencyData[i] = THREE.MathUtils.lerp(p, v, 0.2);
              }
              const uniforms = visualizers.plane.mesh.material.uniforms;
              uniforms.uTime.value = time;
              uniforms.uNoiseStrength.value = currentNoise;
              frequencyTexture.needsUpdate = true;
          }
      }
    };
    function switchVisualizer(name) {
      if (currentVisualizer === visualizers[name]) return;
      if (currentVisualizer && currentVisualizer.mesh) {
          scene.remove(currentVisualizer.mesh);
          currentVisualizer.mesh.geometry.dispose();
          currentVisualizer.mesh.material.dispose();
      }
      if (name === 'sphere') gsapCameraMove(0, 0, 100);
      else if (name === 'plane') gsapCameraMove(0, 60, 120);
      currentVisualizer = visualizers[name];
      currentVisualizer.init();
      btnSphereRef.current.classList.toggle('active', name === 'sphere');
      btnPlaneRef.current.classList.toggle('active', name === 'plane');
    }
    function gsapCameraMove(x, y, z) {
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(x, y, z);
      let progress = 0;
      function animateMove() {
          progress += 0.02;
          if(progress <= 1) {
              camera.position.lerpVectors(startPos, endPos, progress);
              controls.target.set(0,0,0);
              requestAnimationFrame(animateMove);
          }
      }
      animateMove();
    }
    async function getSceneFromGemini(prompt) {
      geminiStatusRef.current.textContent = 'Analizando vibra...';
      generateSceneButtonRef.current.disabled = true;
      buttonTextRef.current.innerHTML = `Pensando...`;
      const systemPrompt = `Act as an expert VJ (Visual Jockey). You receive a description of a mood or scene. You must return a JSON object to configure a WebGL visualizer.
      Return JSON with these keys:
      - "colors": Array of 5 hex color strings.
      - "speed": Float between 0.1 (slow/calm) and 3.0 (chaotic/fast).
      - "noiseStrength": Float between 0.1 (smooth) and 3.0 (distorted).
      - "bloomStrength": Float between 0.5 (subtle) and 3.0 (glowing).
      Input: "${prompt}"`;
      const payload = {
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" }
      };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      try {
          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await response.json();
          if (!result.candidates || result.candidates.length === 0) {
              throw new Error(result.error?.message || "No candidates returned from API");
          }
          const jsonText = result.candidates[0].content.parts[0].text;
          const parsedJson = JSON.parse(jsonText);
          updateSceneParams(parsedJson);
          geminiStatusRef.current.textContent = '¡Escena transformada!';
      } catch (error) {
          console.error("API Call failed, switching to offline random mode:", error);
          geminiStatusRef.current.textContent = 'Modo Offline/Aleatorio activado.';
          updateSceneParams({
              colors: ["#"+Math.floor(Math.random()*16777215).toString(16), "#"+Math.floor(Math.random()*16777215).toString(16), "#"+Math.floor(Math.random()*16777215).toString(16)],
              speed: 0.5 + Math.random() * 2.0,
              noiseStrength: 0.5 + Math.random() * 1.5,
              bloomStrength: 0.5 + Math.random() * 2.0
          });
      } finally {
          generateSceneButtonRef.current.disabled = false;
          buttonTextRef.current.innerHTML = 'Transformar Escena';
          setTimeout(() => { geminiStatusRef.current.textContent = ''; }, 3000);
      }
    }
    function updateSceneParams(params) {
      if(params.colors) updatePalette(params.colors);
      if(params.speed) sceneSettings.speed = params.speed;
      if(params.noiseStrength) sceneSettings.noiseStrength = params.noiseStrength;
      if(params.bloomStrength) sceneSettings.bloomStrength = params.bloomStrength;
      paramSpeedRef.current.textContent = `Vel: ${sceneSettings.speed.toFixed(1)}x`;
      paramNoiseRef.current.textContent = `Ruido: ${sceneSettings.noiseStrength.toFixed(1)}`;
      paramBloomRef.current.textContent = `Brillo: ${sceneSettings.bloomStrength.toFixed(1)}`;
    }
    function updatePalette(newColorsHex) {
      sceneSettings.colors = newColorsHex;
      const newColors = newColorsHex.map(hex => new THREE.Color(hex));
      const colorBuffer = currentVisualizer.mesh.geometry.attributes.color;
      targetColors = new Float32Array(colorBuffer.count * 3);
      for (let i = 0; i < colorBuffer.count; i++) {
          const paletteColor = newColors[Math.floor(Math.random() * newColors.length)];
          targetColors[i * 3] = paletteColor.r;
          targetColors[i * 3 + 1] = paletteColor.g;
          targetColors[i * 3 + 2] = paletteColor.b;
      }
      transitionProgress = 0;
    }
    function init() {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.002);
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 100;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ReinhardToneMapping;
      mountRef.current.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      const renderScene = new RenderPass(scene, camera);
      bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0.1; 
      bloomPass.strength = 1.2; 
      bloomPass.radius = 0.5;
      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      window.addEventListener('resize', onWindowResize, false);
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate() {
      requestAnimationFrame(animate);
      currentSpeed = THREE.MathUtils.lerp(currentSpeed, sceneSettings.speed, 0.05);
      currentNoise = THREE.MathUtils.lerp(currentNoise, sceneSettings.noiseStrength, 0.05);
      bloomPass.strength = THREE.MathUtils.lerp(bloomPass.strength, sceneSettings.bloomStrength, 0.05);
      timeOffset += 0.01 * currentSpeed;
      if (analyser) {
          analyser.getByteFrequencyData(dataArray);
          currentVisualizer.update(timeOffset);
          if (targetColors && transitionProgress < 1) {
              transitionProgress += 0.01;
              const colorBuffer = currentVisualizer.mesh.geometry.attributes.color;
              for (let i = 0; i < colorBuffer.count; i++) {
                  const i3 = i * 3;
                  colorBuffer.array[i3] = THREE.MathUtils.lerp(colorBuffer.array[i3], targetColors[i3], transitionProgress);
                  colorBuffer.array[i3 + 1] = THREE.MathUtils.lerp(colorBuffer.array[i3 + 1], targetColors[i3 + 1], transitionProgress);
                  colorBuffer.array[i3 + 2] = THREE.MathUtils.lerp(colorBuffer.array[i3 + 2], targetColors[i3 + 2], transitionProgress);
              }
              colorBuffer.needsUpdate = true;
          }
      }
      controls.update();
      composer.render();
    }
    async function startMedia() {
      try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoElementRef.current.srcObject = mediaStream;
          videoElementRef.current.style.display = 'block';
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(mediaStream);
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);
          dataArray = new Uint8Array(analyser.frequencyBinCount);
          smoothedFrequencyData = new Float32Array(dataArray.length);
          frequencyTexture = new THREE.DataTexture(smoothedFrequencyData, dataArray.length, 1, THREE.RedFormat, THREE.FloatType);
          startScreenRef.current.style.opacity = '0';
          setTimeout(() => startScreenRef.current.style.display = 'none', 1000);
          switchVisualizer('sphere');
          animate();
      } catch (err) {
          console.error("Error media:", err);
          errorMessageRef.current.innerHTML = "⚠️ No se pudo acceder a la cámara o micrófono.<br>Por favor revisa los permisos del navegador.";
      }
    }
    const handleGenerateScene = () => {
      const prompt = themeInputRef.current.value;
      if (prompt) getSceneFromGemini(prompt);
    };
    if (themeInputRef.current) {
        themeInputRef.current.addEventListener('keyup', (event) => { if (event.key === 'Enter') handleGenerateScene(); });
    }
    if(startButtonRef.current) {
        startButtonRef.current.addEventListener('click', () => { init(); startMedia(); });
    }
    if(btnSphereRef.current) {
        btnSphereRef.current.addEventListener('click', () => switchVisualizer('sphere'));
    }
    if(btnPlaneRef.current) {
        btnPlaneRef.current.addEventListener('click', () => switchVisualizer('plane'));
    }
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef}>
      <style>{`
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; font-family: 'Inter', sans-serif; }
        canvas { display: block; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; color: white; z-index: 10; }
        .overlay h1, .overlay p { text-shadow: 0 0 10px rgba(0,0,0,0.8); }
        .ui-interactive { pointer-events: auto; }
        #video-preview { position: absolute; bottom: 1.5rem; right: 1.5rem; width: 120px; height: 90px; border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.2); object-fit: cover; transform: scaleX(-1); z-index: 20; pointer-events: auto; display: none; }
        .scene-switcher button { background-color: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px); }
        .scene-switcher button.active { background-color: #8B5CF6; border-color: #8B5CF6; }
        .loader-icon { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div id="ui-container">
        <div className="overlay">
          <div className="ui-interactive self-start max-w-md">
            <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-lg p-3 border border-gray-800 shadow-2xl">
              <label className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 block">AI VJ Copilot ✨</label>
              <div className="flex items-center space-x-2 mb-2">
                <input type="text" ref={themeInputRef} placeholder="Ej: tormenta eléctrica intensa..." className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
              </div>
              <button ref={generateSceneButtonRef} onClick={() => themeInputRef.current.value && getSceneFromGemini(themeInputRef.current.value)} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300 ease-in-out shadow-lg flex items-center justify-center">
                <span ref={buttonTextRef}>Transformar Escena</span>
              </button>
              <div className="mt-2 flex justify-between text-[10px] text-gray-400 font-mono">
                <span ref={paramSpeedRef}>Vel: 1.0x</span>
                <span ref={paramNoiseRef}>Ruido: 1.0</span>
                <span ref={paramBloomRef}>Brillo: 1.2</span>
              </div>
              <p ref={geminiStatusRef} className="text-xs text-purple-300 mt-1 h-4 text-center"></p>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center pt-6">
            <div className="scene-switcher ui-interactive flex space-x-2 p-1 rounded-lg">
              <button ref={btnSphereRef} className="active text-white font-bold py-2 px-4 rounded-md text-sm transition-all">Esfera</button>
              <button ref={btnPlaneRef} className="text-white font-bold py-2 px-4 rounded-md text-sm transition-all">Plano Espectral</button>
            </div>
          </div>
        </div>
        <div ref={startScreenRef} className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="text-center p-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Tejido Audiovisual PRO</h1>
            <p className="text-lg text-gray-300 mb-8">Una experiencia VJ reactiva potenciada por Gemini.</p>
            <button ref={startButtonRef} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Iniciar Experiencia
            </button>
            <p ref={errorMessageRef} className="mt-4 text-red-400"></p>
            <p className="text-xs text-gray-500 mt-8">Asegúrate de permitir el acceso a cámara y micrófono.</p>
          </div>
        </div>
        <video ref={videoElementRef} id="video-preview" autoPlay playsInline muted></video>
      </div>
    </div>
  );
}
