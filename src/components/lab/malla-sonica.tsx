'use client';
import { useEffect, useRef } from 'react';

export function MallaSonica() {
  const canvasRef = useRef(null);
  const hiddenVideoRef = useRef(null);
  const beatIndicatorRef = useRef(null);
  const sysMsgRef = useRef(null);
  const startBtnRef = useRef(null);
  const startScreenRef = useRef(null);
  const uiLayerRef = useRef(null);
  const controlsPanelRef = useRef(null);
  const toggleHeaderRef = useRef(null);
  const valAudioRef = useRef(null);
  const valVideoRef = useRef(null);
  const valTensionRef = useRef(null);
  const inpAudioRef = useRef(null);
  const inpVideoRef = useRef(null);
  const inpTensionRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const CONFIG = {
      gridSize: 40,
      perspective: 800,
      baseZ: 250,
      dampening: 0.93,
      tension: 0.03,
      videoInfluence: 180,
      audioInfluence: 250,
      idleTimeout: 3000,
      beatThreshold: 1.4,
      glitchIntensity: 0,
    };

    let canvas, ctx;
    let width, height;
    let points = [];
    let particles = [];
    let ripples = [];
    let audioContext, analyser, microphone, dataArray;
    let volHistory = [];
    let averageVolume = 0;
    let isBeat = false;
    let hiddenVideo, videoCanvas, videoCtx;
    let prevFrameData = null;
    let isVideoActive = false;
    let mouseX = -9999,
      mouseY = -9999;
    let gyroX = 0,
      gyroY = 0;
    let isGyroActive = false;
    let isRunning = false;
    let lastInteractionTime = Date.now();
    let frameCount = 0;

    const beatIndicator = beatIndicatorRef.current;
    const sysMsg = sysMsgRef.current;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * 1500 + 500;
        this.baseSize = Math.random() * 2;
      }
      update(speed, beatSize) {
        this.z -= speed;
        if (this.z <= 1) this.reset();
        this.currentSize = this.baseSize * beatSize;
      }
      draw() {
        if (!ctx) return;
        const scale = CONFIG.perspective / (CONFIG.perspective + this.z);
        const sx = this.x * scale + width / 2;
        const sy = this.y * scale + height / 2;
        if (sx < 0 || sx > width || sy < 0 || sy > height) return;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(
          0.8,
          (2000 - this.z) / 2000
        )})`;
        ctx.beginPath();
        ctx.arc(sx, sy, this.currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Point {
      constructor(x, y, z) {
        this.baseX = x;
        this.baseY = y;
        this.baseZ = z;
        this.currentZ = z;
        this.velocityZ = 0;
        this.targetZ = 0;
      }
      update() {
        const displacement = this.currentZ - this.baseZ - this.targetZ;
        const force = -CONFIG.tension * displacement;
        this.velocityZ += force;
        this.velocityZ *= CONFIG.dampening;
        this.currentZ += this.velocityZ;
        this.targetZ *= 0.9;
      }
      applyForce(f) {
        this.velocityZ += f;
      }
    }

    function init() {
      canvas = canvasRef.current;
      if (!canvas) return;
      ctx = canvas.getContext('2d', { alpha: false });
      hiddenVideo = hiddenVideoRef.current;
      videoCanvas = document.createElement('canvas');
      videoCtx = videoCanvas.getContext('2d', { willReadFrequently: true });

      resize();
      createWorld();
      setupControls();

      window.addEventListener('resize', resize);

      const updateMouse = (x, y) => {
        mouseX = x;
        mouseY = y;
        lastInteractionTime = Date.now();
      };
      window.addEventListener('mousemove', (e) =>
        updateMouse(e.clientX, e.clientY)
      );
      window.addEventListener(
        'touchstart',
        (e) => updateMouse(e.touches[0].clientX, e.touches[0].clientY),
        { passive: false }
      );
      window.addEventListener(
        'touchmove',
        (e) => {
          updateMouse(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
          if (frameCount % 5 === 0) addRipple(mouseX, mouseY, 50);
        },
        { passive: false }
      );
      window.addEventListener('touchend', () => {
        mouseX = -9999;
      });

      window.addEventListener('deviceorientation', (e) => {
        if (e.beta !== null) {
          gyroX = Math.min(Math.max(e.gamma, -45), 45);
          gyroY = Math.min(Math.max(e.beta - 45, -45), 45);
          if (!isGyroActive) isGyroActive = true;
          lastInteractionTime = Date.now();
        }
      });

      startBtnRef.current.addEventListener('click', startExperience);
      toggleHeaderRef.current.addEventListener('click', () => {
        controlsPanelRef.current.classList.toggle('collapsed');
      });
    }

    function createWorld() {
      points = [];
      particles = [];
      const range = Math.max(width, height) * 1.3;
      const step = range / CONFIG.gridSize;

      for (let y = 0; y < CONFIG.gridSize; y++) {
        for (let x = 0; x < CONFIG.gridSize; x++) {
          const pX = ((x - CONFIG.gridSize / 2) * step) + width / 2;
          const pY = ((y - CONFIG.gridSize / 2) * step) + height / 2;
          points.push(new Point(pX, pY, 0));
        }
      }
      for (let i = 0; i < 80; i++) particles.push(new Particle());
    }

    function setupControls() {
      const bind = (id, prop, ref, valRef) => {
        if (!ref || !valRef) return;
        ref.addEventListener('input', (e) => {
          CONFIG[prop] = parseFloat(e.target.value);
          valRef.innerText = CONFIG[prop];
        });
      };
      bind('audio', 'audioInfluence', inpAudioRef.current, valAudioRef.current);
      bind('video', 'videoInfluence', inpVideoRef.current, valVideoRef.current);
      bind('tension', 'tension', inpTensionRef.current, valTensionRef.current);
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (points.length > 0) createWorld();
    }

    function addRipple(x, y, strength) {
      ripples.push({ x, y, strength, radius: 0, age: 0 });
    }

    function analyzeAudio() {
      if (!analyser) return;
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < 40; i++) sum += dataArray[i];
      const bassVol = sum / 40;

      let totalSum = 0;
      for (let i = 0; i < dataArray.length; i++) totalSum += dataArray[i];
      averageVolume = totalSum / dataArray.length;

      volHistory.push(bassVol);
      if (volHistory.length > 30) volHistory.shift();

      const localAvg = volHistory.reduce((a, b) => a + b, 0) / volHistory.length;

      if (bassVol > localAvg * CONFIG.beatThreshold && bassVol > 50) {
        if (!isBeat) {
          isBeat = true;
          onBeat();
        }
      } else {
        isBeat = false;
      }
      
      for(let i=0; i<5; i++) {
        if(barsRef.current[i]) {
            const h = Math.min(100, dataArray[i === 0 ? 2 : i * 10 * (i < 4 ? 1 : 2.5)] / 2);
            barsRef.current[i].style.height = h + '%';
        }
      }
    }

    function onBeat() {
      if (!beatIndicator) return;
      beatIndicator.classList.add('active');
      setTimeout(() => beatIndicator.classList.remove('active'), 100);

      CONFIG.glitchIntensity = 15;

      addRipple(width / 2, height / 2, 200);

      particles.forEach((p) => (p.z += 50));
    }

    async function startExperience() {
      const btn = startBtnRef.current;
      btn.innerText = 'ACCEDIENDO...';

      try {
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          await DeviceOrientationEvent.requestPermission();
        }

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        const streamA = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(streamA);
        microphone.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const streamV = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 30 },
        });
        hiddenVideo.srcObject = streamV;
        isVideoActive = true;
        hiddenVideo.onloadedmetadata = () => {
          videoCanvas.width = CONFIG.gridSize;
          videoCanvas.height = CONFIG.gridSize;
          hiddenVideo.play();
        };

        startScreenRef.current.style.opacity = '0';
        setTimeout(() => (startScreenRef.current.style.display = 'none'), 800);
        uiLayerRef.current.style.display = 'flex';

        isRunning = true;
        animate();
      } catch (e) {
        alert('Error: Permisos denegados.');
        btn.innerText = 'REINTENTAR';
      }
    }

    function animate() {
      if (!isRunning) return;
      requestAnimationFrame(animate);
      frameCount++;

      analyzeAudio();

      if (CONFIG.glitchIntensity > 0) CONFIG.glitchIntensity *= 0.9;

      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, width, height);

      let motionData = new Float32Array(CONFIG.gridSize * CONFIG.gridSize).fill(
        0
      );
      if (isVideoActive && hiddenVideo.readyState === 4) {
        videoCtx.drawImage(
          hiddenVideo,
          0,
          0,
          CONFIG.gridSize,
          CONFIG.gridSize
        );
        const frame = videoCtx.getImageData(
          0,
          0,
          CONFIG.gridSize,
          CONFIG.gridSize
        ).data;
        if (prevFrameData) {
          for (let i = 0; i < motionData.length; i++) {
            const diff = Math.abs(
              frame[i * 4 + 1] - prevFrameData[i * 4 + 1]
            );
            if (diff > 20) motionData[i] = diff / 255;
          }
        }
        prevFrameData = frame;
      }

      const time = Date.now() * 0.001;
      const isIdle = Date.now() - lastInteractionTime > CONFIG.idleTimeout;
      if (sysMsg) {
        sysMsg.innerText = isIdle
          ? 'MODO: REPOSO (ESPERANDO INTERACCIÓN)'
          : 'MODO: ACTIVO // TRACKING';
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 15;
        r.strength *= 0.92;
        r.age++;
        if (r.strength < 1) ripples.splice(i, 1);
      }

      const pX = new Float32Array(points.length);
      const pY = new Float32Array(points.length);
      const pZ = new Float32Array(points.length);
      const pVisible = new Int8Array(points.length);

      let pIndex = 0;
      for (let y = 0; y < CONFIG.gridSize; y++) {
        for (let x = 0; x < CONFIG.gridSize; x++) {
          const p = points[pIndex];

          const distCenter = Math.hypot(
            x - CONFIG.gridSize / 2,
            y - CONFIG.gridSize / 2
          );
          if (averageVolume > 5) {
            const wave = Math.sin(distCenter * 0.5 - time * 8);
            p.applyForce(
              wave * (averageVolume / 255) * CONFIG.audioInfluence * 0.15
            );
          }

          const mIdx = y * CONFIG.gridSize + (CONFIG.gridSize - 1 - x);
          if (motionData[mIdx] > 0) {
            p.applyForce(-motionData[mIdx] * CONFIG.videoInfluence);
            lastInteractionTime = Date.now();
          }

          if (ripples.length > 0) {
            const scaleBase =
              CONFIG.perspective / (CONFIG.perspective + CONFIG.baseZ);
            const sx = (p.baseX - width / 2) * scaleBase + width / 2;
            const sy = (p.baseY - height / 2) * scaleBase + height / 2;

            for (const r of ripples) {
              const d = Math.hypot(sx - r.x, sy - r.y);
              if (Math.abs(d - r.radius) < 40) {
                p.velocityZ += Math.sin((d - r.radius) * 0.1) * r.strength * 0.1;
              }
            }
          }

          if (isIdle) {
            p.targetZ =
              Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 30;
          }

          p.update();

          const scale =
            CONFIG.perspective / (CONFIG.perspective + p.currentZ + CONFIG.baseZ);
          pX[pIndex] = (p.baseX - width / 2) * scale + width / 2;
          pY[pIndex] = (p.baseY - height / 2) * scale + height / 2;
          pZ[pIndex] = p.currentZ;

          if (
            scale > 0 &&
            pX[pIndex] > -100 &&
            pX[pIndex] < width + 100 &&
            pY[pIndex] > -100 &&
            pY[pIndex] < height + 100
          ) {
            pVisible[pIndex] = 1;
          } else {
            pVisible[pIndex] = 0;
          }

          pIndex++;
        }
      }

      particles.forEach((p) => {
        p.update(2 + averageVolume / 30, isBeat ? 2 : 1);
        p.draw();
      });

      const drawMeshLines = (offsetX, offsetY, colorOverride) => {
        ctx.lineWidth = 1;
        for (let y = 0; y < CONFIG.gridSize; y++) {
          for (let x = 0; x < CONFIG.gridSize; x++) {
            const i = y * CONFIG.gridSize + x;
            if (!pVisible[i]) continue;

            const px = pX[i] + offsetX;
            const py = pY[i] + offsetY;

            let strokeStyle;
            if (colorOverride) {
              strokeStyle = colorOverride;
              ctx.globalAlpha = 0.6;
            } else {
              ctx.globalAlpha = 1.0;
              const zVal = Math.abs(pZ[i]);
              const energy = Math.min(1, zVal / 150 + averageVolume / 300);
              const hue = 180 + energy * 150;
              const lit = 50 + energy * 40;
              strokeStyle = `hsl(${hue}, 100%, ${lit}%)`;

              if (isBeat && Math.random() > 0.9) strokeStyle = '#fff';
            }

            ctx.strokeStyle = strokeStyle;
            ctx.beginPath();
            if (x < CONFIG.gridSize - 1 && pVisible[i + 1]) {
              ctx.moveTo(px, py);
              ctx.lineTo(pX[i + 1] + offsetX, pY[i + 1] + offsetY);
            }
            if (y < CONFIG.gridSize - 1 && pVisible[i + CONFIG.gridSize]) {
              ctx.moveTo(px, py);
              ctx.lineTo(
                pX[i + CONFIG.gridSize] + offsetX,
                pY[i + CONFIG.gridSize] + offsetY
              );
            }
            ctx.stroke();
          }
        }
      };

      drawMeshLines(0, 0, null);

      if (CONFIG.glitchIntensity > 1) {
        const off = CONFIG.glitchIntensity;
        drawMeshLines(off, 0, '#ff0055');
        drawMeshLines(-off, 0, '#00e5ff');
      }

      ctx.globalAlpha = 1.0;

      if (isGyroActive && mouseX < 0) {
        const gx = (0.5 + gyroX * 0.03) * width;
        const gy = (0.5 + gyroY * 0.03) * height;
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(gx, gy, 20 + averageVolume / 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    init();

    return () => {
      window.removeEventListener('resize', resize);
      isRunning = false;
    };
  }, []);

  return (
    <>
      <style>{`
        body {
            margin: 0;
            overflow: hidden;
            background-color: #020204;
            color: white;
            font-family: 'Courier New', Courier, monospace;
            overscroll-behavior: none;
            touch-action: none;
        }
        canvas {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
        .crt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            z-index: 5;
            pointer-events: none;
            box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
        }
        #ui-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem;
            box-sizing: border-box;
        }
        .hud-panel {
            background: rgba(10, 10, 15, 0.85);
            border: 1px solid rgba(255, 0, 85, 0.3);
            padding: 15px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            pointer-events: auto;
            margin-bottom: 10px;
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hud-panel::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 10px;
            height: 10px;
            border-top: 2px solid #ff0055;
            border-right: 2px solid #ff0055;
        }
        .hud-panel::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid #ff0055;
            border-left: 2px solid #ff0055;
        }
        .hud-panel:hover {
            border-color: #ff0055;
            box-shadow: 0 0 30px rgba(255, 0, 85, 0.3);
            transform: translateY(-2px);
        }
        #start-screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #050505;
            z-index: 50;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            pointer-events: auto;
            padding: 20px;
        }
        .glitch-text {
            position: relative;
            color: white;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-shadow: 2px 0 #ff0055, -2px 0 #00e5ff;
        }
        input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
            margin: 10px 0;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 12px;
            width: 20px;
            background: #ff0055;
            cursor: pointer;
            margin-top: -5px;
            border: none;
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
        }
        button.start-btn {
            background: #ff0055;
            border: none;
            padding: 15px 50px;
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.2rem;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            margin-top: 40px;
            letter-spacing: 2px;
            clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
            transition: all 0.2s;
        }
        button.start-btn:hover {
            background: white;
            color: #ff0055;
            box-shadow: 0 0 40px #ff0055;
        }
        .control-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            color: #ff0055;
            margin-bottom: 5px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .collapsible-content {
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            max-height: 500px;
            opacity: 1;
            overflow: hidden;
        }
        .collapsed .collapsible-content {
            max-height: 0;
            opacity: 0;
        }
        .beat-flash {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 20px;
            height: 20px;
            background: #fff;
            opacity: 0;
            border-radius: 50%;
            pointer-events: none;
            transition: opacity 0.1s;
        }
        .beat-flash.active { opacity: 1; box-shadow: 0 0 20px white; }
        #sys-msg {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.5);
            margin-top: 5px;
        }
      `}</style>
      <div className="crt-overlay"></div>
      <div className="beat-flash" ref={beatIndicatorRef}></div>

      <video
        ref={hiddenVideoRef}
        id="hidden-video"
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      ></video>
      <canvas ref={canvasRef} id="simulation"></canvas>

      <div ref={startScreenRef} id="start-screen">
        <h1 className="text-5xl md:text-8xl mb-2 glitch-text">MALLA 5.0</h1>
        <p className="text-sm md:text-xl text-cyan-400 tracking-[0.5em] mb-12">
          SYSTEM_ULTRA // MEDELLÍN
        </p>

        <div className="flex flex-col gap-4 text-xs text-gray-400 max-w-md text-left border-l-2 border-[#ff0055] pl-4">
          <p>&gt;&gt; DETECTOR DE BEATS ACTIVADO</p>
          <p>&gt;&gt; RENDERIZADO DE ABERRACIÓN CROMÁTICA</p>
          <p>&gt;&gt; ONDAS DE CHOQUE HÁPTICAS</p>
        </div>

        <button ref={startBtnRef} className="start-btn">
          EJECUTAR
        </button>
      </div>

      <div
        ref={uiLayerRef}
        id="ui-layer"
        style={{ display: 'none' }}
      >
        <div
          ref={controlsPanelRef}
          id="controls-panel"
          className="hud-panel w-full max-w-[260px] mt-8"
        >
          <div
            className="flex justify-between items-center cursor-pointer group mb-4"
            ref={toggleHeaderRef}
          >
            <h3 className="text-white font-bold text-xs tracking-widest">
              CONTROL_PANEL
            </h3>
            <div className="text-[#ff0055] text-xs">[ - ]</div>
          </div>

          <div className="collapsible-content space-y-4">
            <div>
              <div className="control-label">
                <span>AUDIO_GAIN</span>
                <span ref={valAudioRef}>250</span>
              </div>
              <input
                ref={inpAudioRef}
                type="range"
                min="0"
                max="600"
                defaultValue="250"
              />
            </div>

            <div>
              <div className="control-label">
                <span>MOTION_SENS</span>
                <span ref={valVideoRef}>180</span>
              </div>
              <input
                ref={inpVideoRef}
                type="range"
                min="0"
                max="400"
                defaultValue="180"
              />
            </div>

            <div>
              <div className="control-label">
                <span>ELASTICITY</span>
                <span ref={valTensionRef}>0.03</span>
              </div>
              <input
                ref={inpTensionRef}
                type="range"
                min="0.01"
                max="0.1"
                step="0.005"
                defaultValue="0.03"
              />
            </div>
          </div>

          <div ref={sysMsgRef} id="sys-msg">
            ESPERANDO SEÑAL...
          </div>
        </div>

        <div className="hud-panel self-end w-auto text-right">
          <div className="text-[9px] text-gray-400 mb-1 tracking-widest">
            ENERGY OUTPUT
          </div>
          <div className="flex items-end justify-end gap-1 h-8">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} ref={el => barsRef.current[i] = el} className="w-2 bg-[#ff0055] transition-all duration-75" style={{height: `${i*10}%`}}></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
