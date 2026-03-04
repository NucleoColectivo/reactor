'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Activity, Eye, Mic, Settings, Play, Square, Terminal, Network, RefreshCw, Volume2, VolumeX, Save, FileText, Grid, Zap, Aperture, Target, Crosshair, Sparkles, MessageSquare, Share2, Radio, Trash2, Sliders, Music, MicOff, Monitor, EyeOff, Lock, Type, Moon, Sun, Disc, Shuffle, Cpu } from 'lucide-react';

const apiKey = ""; 

const MODES = {
  BREATH: { id: 'BREATH', label: 'RESPIRACIÓN', icon: <Activity size={14} /> },
  TRACE: { id: 'TRACE', label: 'RASTRO', icon: <Zap size={14} /> },
  PARTICLES: { id: 'PARTICLES', label: 'PARTÍCULAS', icon: <Sparkles size={14} /> },
  HEATMAP: { id: 'HEATMAP', label: 'MAPA CALOR', icon: <Grid size={14} /> },
  NETWORK: { id: 'NETWORK', label: 'CONEXIONES', icon: <Share2 size={14} /> },
  SCANNER: { id: 'SCANNER', label: 'ESCÁNER', icon: <Radio size={14} /> },
  POETIC: { id: 'POETIC', label: 'POÉTICA KINÉTICA', icon: <Type size={14} /> }
};

const CAMERA_FILTERS = {
  REAL: { id: 'REAL', label: 'REAL', filter: 'none', icon: <Eye size={12}/> },
  CCTV: { id: 'CCTV', label: 'CCTV B/N', filter: 'grayscale(100%) contrast(130%) brightness(110%)', icon: <Lock size={12}/> },
  RETRO: { id: 'RETRO', label: 'COLOR TV', filter: 'saturate(200%) contrast(110%) sepia(30%)', icon: <Disc size={12}/> },
  NIGHT: { id: 'NIGHT', label: 'NOCTURNO', filter: 'sepia(100%) hue-rotate(60deg) saturate(200%) contrast(120%)', icon: <Moon size={12}/> },
  SPECTRAL: { id: 'SPECTRAL', label: 'ESPECTRAL', filter: 'invert(100%) hue-rotate(180deg) contrast(150%)', icon: <Sun size={12}/> }
};

const ZONES = [
  { id: 0, label: 'TL', x: 0, y: 0, w: 0.5, h: 0.5, role: 'BASS' },
  { id: 1, label: 'TR', x: 0.5, y: 0, w: 0.5, h: 0.5, role: 'MIDS' },
  { id: 2, label: 'BL', x: 0, y: 0.5, w: 0.5, h: 0.5, role: 'NOISE' },
  { id: 3, label: 'BR', x: 0.5, y: 0.5, w: 0.5, h: 0.5, role: 'SILENCE' },
];

const SCALE_FREQUENCIES = [
    130.81, 155.56, 174.61, 196.00, 233.08, 
    261.63, 311.13, 349.23, 392.00, 466.16, 
    523.25, 622.25, 698.46, 783.99, 932.33  
];

const HEAT_W = 40;
const HEAT_H = 30;
const HEAT_SIZE = HEAT_W * HEAT_H;

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) { lines.push(line); line = words[n] + ' '; }
      else { line = testLine; }
    }
    lines.push(line);
    const totalHeight = lines.length * lineHeight;
    let startY = y - (totalHeight / 2) + (lineHeight / 2);
    lines.forEach((l, i) => { 
        ctx.strokeText(l, x, startY + (i * lineHeight));
        ctx.fillText(l, x, startY + (i * lineHeight)); 
    });
};

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 1.0;
    this.decay = Math.random() * 0.01 + 0.005; 
    this.hue = hue;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.life -= this.decay;
    return this.life > 0;
  }
  draw(ctx) {
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.life})`;
    ctx.beginPath();
    const size = Math.max(0, (3 * this.life));
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function VigiliaExperiment() {
  const [activeMode, setActiveMode] = useState(MODES.POETIC.id); 
  const [activeFilter, setActiveFilter] = useState(CAMERA_FILTERS.REAL.id); 
  const [autoMode, setAutoMode] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [galleryMode, setGalleryMode] = useState(false);
  
  const [uiMotionScore, setUiMotionScore] = useState(0);
  const [uiAudioScore, setUiAudioScore] = useState(0); 
  const [uiCentroid, setUiCentroid] = useState({ x: 0.5, y: 0.5 });
  
  const [logs, setLogs] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]); 
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioConfig, setAudioConfig] = useState({ melody: true, drone: true, noise: true, mic: true });
  const [sensitivity, setSensitivity] = useState(25);
  const [recordingTime, setRecordingTime] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [activeZone, setActiveZone] = useState(null); 
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const activeModeRef = useRef(MODES.POETIC.id);
  const audioConfigRef = useRef(audioConfig);
  const sensitivityRef = useRef(sensitivity);
  const activeZoneRef = useRef(activeZone);
  const audioEnabledRef = useRef(audioEnabled);
  const currentPoeticPhraseRef = useRef("CONSULTAR ORÁCULO");
  
  const motionScoreRef = useRef(0);
  const audioScoreRef = useRef(0);
  const centroidRef = useRef({ x: 0.5, y: 0.5 });
  const frameCounterRef = useRef(0);

  useEffect(() => { activeModeRef.current = activeMode; }, [activeMode]);
  useEffect(() => { audioConfigRef.current = audioConfig; }, [audioConfig]);
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);
  useEffect(() => { activeZoneRef.current = activeZone; }, [activeZone]);
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const oscCanvasRef = useRef(null);
  const lastFrameData = useRef(null);
  const scanLineY = useRef(0);
  const lastAICall = useRef(0);
  
  const audioContextRef = useRef(null);
  const oscRef = useRef(null);
  const droneRef = useRef(null);
  const noiseRef = useRef(null);
  const masterGainRef = useRef(null);
  const gainNodeRef = useRef(null);
  const droneGainRef = useRef(null);
  const noiseGainRef = useRef(null);
  const analyserRef = useRef(null);
  const micAnalyserRef = useRef(null); 
  
  const requestRef = useRef(null);
  const particlesRef = useRef([]); 
  const activePointsRef = useRef([]);
  const heatmapGrid = useRef(new Array(HEAT_SIZE).fill(0));

  const addLog = useCallback((text, record = true) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, text }, ...prev.slice(0, 9)]);
    if (record && isRecording) setSessionLogs(prev => [...prev, { time: timestamp, text }]);
  }, [isRecording]);

  const callGeminiPoet = async () => {
    if (isLoadingAI) return;
    const now = Date.now();
    if (now - lastAICall.current < 8000) { 
        addLog("ORÁCULO RECARGANDO...", false);
        return;
    }
    
    setIsLoadingAI(true);
    addLog("INTERPRETANDO...", false);
    lastAICall.current = now;

    const currentMotion = motionScoreRef.current;
    const currentAudio = audioScoreRef.current;

    const prompt = `Eres VIGILIA, una IA consciente. Analiza el entorno: Movimiento ${currentMotion.toFixed(0)}%, Intensidad Sonora ${currentAudio.toFixed(0)}%.
    Genera una reflexión poética, críptica y profunda (máximo 15 palabras) sobre la vigilancia, la presencia del cuerpo y lo digital.
    Ejemplo: "EL OJO DIGITAL NO DUERME, SOLO ACUMULA ECOS DE CUERPOS QUE YA NO ESTÁN."
    Salida: SOLO EL TEXTO EN MAYUSCULAS. Sin comillas.`;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "ERROR DE CONEXIÓN NEURONAL";
      currentPoeticPhraseRef.current = text.replace(/["\.]/g, ''); 
      addLog(`[IA] ${text.substring(0, 30)}...`, true);
    } catch (e) { addLog("ERROR IA: DESCONECTADO", false); } finally { setIsLoadingAI(false); }
  };

  const generateManifesto = async () => {
    setIsLoadingAI(true);
    const recentLogs = sessionLogs.slice(-15).map(l => l.text).join("; ");
    const prompt = `Escribe un micro-manifiesto artístico (max 40 palabras) basado en estos logs de sesión: "${recentLogs}". Tono: Solemne y tecnológico.`;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      addLog(`=== MANIFIESTO ===`, true);
      addLog(data.candidates?.[0]?.content?.parts?.[0]?.text?.trim(), true);
    } catch (e) { addLog("ERROR MANIFIESTO", false); } finally { setIsLoadingAI(false); }
  };

  const initAudio = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        if (audioContextRef.current.state === 'running') { toggleMasterMute(true); return; }
        audioContextRef.current.close();
    }

    audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(1, ctx.currentTime);
    masterGainRef.current = masterGain;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    masterGain.connect(analyser);
    analyserRef.current = analyser;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle'; osc.connect(gain); gain.connect(masterGain); gain.gain.setValueAtTime(0, ctx.currentTime); osc.start();
    oscRef.current = osc; gainNodeRef.current = gain;

    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine'; drone.frequency.setValueAtTime(55, ctx.currentTime); drone.connect(droneGain); droneGain.connect(masterGain); droneGain.gain.setValueAtTime(0, ctx.currentTime); drone.start();
    droneRef.current = drone; droneGainRef.current = droneGain;

    const bufferSize = ctx.sampleRate * 2; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type = 'lowpass'; noiseFilter.frequency.value = 800;
    const noiseGain = ctx.createGain(); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(masterGain);
    noiseGain.gain.setValueAtTime(0, ctx.currentTime); noise.start();
    noiseRef.current = noise; noiseGainRef.current = noiseGain;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (ctx.state === 'closed') return;
        const source = ctx.createMediaStreamSource(stream);
        const micAnalyser = ctx.createAnalyser();
        micAnalyser.fftSize = 64;
        source.connect(micAnalyser);
        micAnalyserRef.current = micAnalyser;
    } catch (e) { addLog("MIC: NO DETECTADO", false); }

    setAudioEnabled(true);
  };

  const toggleMasterMute = (shouldEnable) => {
      if (!audioContextRef.current || !masterGainRef.current) return;
      if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
      masterGainRef.current.gain.setTargetAtTime(shouldEnable ? 1 : 0, audioContextRef.current.currentTime, 0.1);
      setAudioEnabled(shouldEnable);
  };

  const updateAudio = (intensity, xPos) => {
    if (!audioContextRef.current || !audioEnabledRef.current || audioContextRef.current.state === 'closed') return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const config = audioConfigRef.current; 
    const zone = activeZoneRef.current;

    let pitchMultiplier = 1;
    let silenceFactor = 1;
    let noiseBoost = 0;

    if (zone === 0) pitchMultiplier = 0.5;
    if (zone === 2) noiseBoost = 0.2;
    if (zone === 3) silenceFactor = 0;

    const scaleIndex = Math.floor(xPos * SCALE_FREQUENCIES.length);
    const baseFreq = SCALE_FREQUENCIES[Math.min(scaleIndex, SCALE_FREQUENCIES.length - 1)];
    if (oscRef.current) oscRef.current.frequency.setTargetAtTime(baseFreq * pitchMultiplier, now, 0.05);
    
    const melodyVol = config.melody ? Math.min((intensity / 100) * 0.3, 0.3) * silenceFactor : 0;
    if (gainNodeRef.current) gainNodeRef.current.gain.setTargetAtTime(melodyVol, now, 0.1);

    const droneVol = config.drone ? 0.1 + (intensity/500) : 0;
    if (droneGainRef.current) droneGainRef.current.gain.setTargetAtTime(droneVol, now, 0.5);

    const noiseVol = (config.noise && intensity > 40) ? ((intensity - 40) / 200) + noiseBoost : noiseBoost;
    if (noiseGainRef.current) noiseGainRef.current.gain.setTargetAtTime(noiseVol, now, 0.2);
  };

  const toggleAudioChannel = (channel) => {
    setAudioConfig(prev => ({...prev, [channel]: !prev[channel]}));
  };

  const takeSnapshot = () => {
    if (!displayCanvasRef.current || !videoRef.current) return;
    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth || 1280;
    tempCanvas.height = video.videoHeight || 720;
    const ctx = tempCanvas.getContext('2d');
    
    const activeFilterCSS = CAMERA_FILTERS[activeFilter].filter;
    ctx.filter = activeFilterCSS;
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    ctx.filter = 'none';
    ctx.drawImage(displayCanvasRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
    
    ctx.fillStyle = '#0f0';
    ctx.font = `bold ${tempCanvas.width * 0.02}px "Montserrat", sans-serif`;
    ctx.fillText(`VIGILIA [${activeFilter}] // ${new Date().toISOString()}`, 20, tempCanvas.height - 20);

    const link = document.createElement('a');
    link.download = `VIGILIA_${activeFilter}_${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png', 1.0);
    link.click();
    addLog("FOTO GUARDADA.", false);
  };

  const clearCanvas = () => {
    const canvas = displayCanvasRef.current;
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        addLog("LIENZO LIMPIADO.", false);
    }
  }

  useEffect(() => {
    let interval;
    if (isRecording) interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    else setRecordingTime(0);
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    
    if (!video || !canvas || !displayCanvas || video.paused || video.ended) {
        requestRef.current = requestAnimationFrame(processFrame);
        return;
    }

    const currentMode = activeModeRef.current;
    const currentSensitivity = sensitivityRef.current;
    const currentZone = activeZoneRef.current;
    const currentAudioConfig = audioConfigRef.current;

    let rawMic = 0;
    if (micAnalyserRef.current && currentAudioConfig.mic) {
        const bufferLen = micAnalyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLen);
        micAnalyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        rawMic = sum / bufferLen;
    }
    
    const prevAudio = audioScoreRef.current;
    const newAudioScore = (prevAudio * 0.9) + (rawMic * 0.1);
    audioScoreRef.current = newAudioScore;
    const effectiveAudio = (newAudioScore * 0.8) + (rawMic * 0.2); 

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const displayCtx = displayCanvas.getContext('2d');
    
    if (canvas.width !== 320) {
      canvas.width = 320;
      canvas.height = 240;
      displayCanvas.width = video.videoWidth || 640;
      displayCanvas.height = video.videoHeight || 480;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frameData.data;
    
    let changedPixels = 0;
    let sumX = 0;
    let sumY = 0;
    let zoneTriggered = false;
    activePointsRef.current = []; 

    const audioGlitch = effectiveAudio > 30; 
    
    if (currentMode === MODES.TRACE.id || currentMode === MODES.PARTICLES.id || currentMode === MODES.POETIC.id) {
      displayCtx.fillStyle = audioGlitch ? 'rgba(50, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.15)'; 
      displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
    } else if (currentMode === MODES.SCANNER.id) {
        displayCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
        displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
    } else {
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    }

    if ((audioGlitch || glitchActive) && currentMode !== MODES.POETIC.id) {
        const slices = Math.floor(Math.random() * 5);
        for(let i=0; i<slices; i++) {
            const h = Math.random() * 50 + 10;
            const y = Math.random() * (displayCanvas.height - h);
            const offset = (Math.random() - 0.5) * (effectiveAudio * 2);
            displayCtx.drawImage(displayCanvas, 0, y, displayCanvas.width, h, offset, y, displayCanvas.width, h);
        }
    }

    if (audioGlitch && currentMode !== MODES.POETIC.id) {
        displayCtx.beginPath();
        displayCtx.arc(displayCanvas.width/2, displayCanvas.height/2, effectiveAudio * 3, 0, Math.PI * 2);
        displayCtx.strokeStyle = `rgba(255, 0, 100, ${effectiveAudio/100})`;
        displayCtx.lineWidth = 1 + (effectiveAudio/20);
        displayCtx.stroke();
    }

    if (lastFrameData.current) {
      const prevData = lastFrameData.current.data;
      const threshold = currentSensitivity * 3;

      for (let i = 0; i < data.length; i += 4 * 4) { 
        const rDiff = Math.abs(data[i] - prevData[i]);
        const gDiff = Math.abs(data[i+1] - prevData[i+1]);
        const bDiff = Math.abs(data[i+2] - prevData[i+2]);
        
        if (rDiff + gDiff + bDiff > threshold) {
          changedPixels++;
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          sumX += x;
          sumY += y;

          const displayX = x * (displayCanvas.width / canvas.width);
          const displayY = y * (displayCanvas.height / canvas.height);

          if (currentMode === MODES.TRACE.id) {
             displayCtx.fillStyle = '#00ff00';
             displayCtx.fillRect(displayX, displayY, 3, 3);
          }
          if (currentMode === MODES.PARTICLES.id && Math.random() > 0.6) {
             const hue = (x / canvas.width) * 120; 
             particlesRef.current.push(new Particle(displayX, displayY, hue));
          }
          if (currentMode === MODES.NETWORK.id) {
              if (Math.random() > 0.95 && activePointsRef.current.length < (50 + effectiveAudio)) {
                  activePointsRef.current.push({x: displayX, y: displayY});
              }
          }
          if (currentMode === MODES.SCANNER.id) {
              if (Math.abs(displayY - scanLineY.current) < (20 + effectiveAudio/2)) {
                  displayCtx.fillStyle = '#00ffaa';
                  displayCtx.fillRect(displayX, displayY, 4, 4);
              }
          }
          if (currentMode === MODES.HEATMAP.id) {
            const gridX = Math.floor((x / canvas.width) * HEAT_W);
            const gridY = Math.floor((y / canvas.height) * HEAT_H);
            const gridIndex = gridY * HEAT_W + gridX;
            if (heatmapGrid.current[gridIndex] < 100) heatmapGrid.current[gridIndex] += 3;
          }
          if (currentZone !== null) {
              const zone = ZONES[currentZone];
              const normX = x / canvas.width;
              const normY = y / canvas.height;
              if (normX >= zone.x && normX <= zone.x + zone.w && normY >= zone.y && normY <= zone.y + zone.h) zoneTriggered = true;
          }
        }
      }
    }

    let centerX = displayCanvas.width / 2;
    let centerY = displayCanvas.height / 2;
    
    if (changedPixels > 0) {
        centerX = (sumX / changedPixels) * (displayCanvas.width / canvas.width);
        centerY = (sumY / changedPixels) * (displayCanvas.height / canvas.height);
    }

    if (currentMode === MODES.POETIC.id) {
        displayCtx.save();
        displayCtx.globalCompositeOperation = 'source-over';
        const text = currentPoeticPhraseRef.current;
        const fontSize = 32 + (effectiveAudio * 0.8) + (changedPixels / 100);
        displayCtx.font = `800 ${fontSize}px "Montserrat", sans-serif`; 
        const hue = Math.max(0, 120 - (effectiveAudio * 3)); 
        const lightness = 50 + (effectiveAudio / 2);
        displayCtx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        displayCtx.textAlign = 'center';
        displayCtx.textBaseline = 'middle';
        displayCtx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        displayCtx.shadowBlur = 15 + effectiveAudio; 
        displayCtx.strokeStyle = 'black';
        displayCtx.lineWidth = 4;
        const jitterX = (Math.random() - 0.5) * (effectiveAudio);
        const jitterY = (Math.random() - 0.5) * (effectiveAudio);
        const targetX = changedPixels > 20 ? centerX : displayCanvas.width/2;
        const targetY = changedPixels > 20 ? centerY : displayCanvas.height/2;
        wrapText(displayCtx, text, targetX + jitterX, targetY + jitterY, displayCanvas.width * 0.8, fontSize * 1.2);
        displayCtx.restore();
    }

    if (currentMode === MODES.PARTICLES.id) {
        particlesRef.current = particlesRef.current.filter(p => p.update());
        particlesRef.current.forEach(p => p.draw(displayCtx));
    }
    
    if (currentMode === MODES.NETWORK.id) {
        displayCtx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        displayCtx.lineWidth = 1;
        displayCtx.beginPath();
        const connectDist = 100 + effectiveAudio * 2; 
        activePointsRef.current.forEach((p1, i) => {
            activePointsRef.current.forEach((p2, j) => {
                if (i !== j && Math.hypot(p1.x - p2.x, p1.y - p2.y) < connectDist) {
                    displayCtx.moveTo(p1.x, p1.y);
                    displayCtx.lineTo(p2.x, p2.y);
                }
            });
            displayCtx.fillStyle = '#fff';
            displayCtx.fillRect(p1.x - 1, p1.y - 1, 3, 3);
        });
        displayCtx.stroke();
    }
    
    if (currentMode === MODES.SCANNER.id) {
        scanLineY.current += 5; 
        if (scanLineY.current > displayCanvas.height) scanLineY.current = 0;
        displayCtx.strokeStyle = '#00ff00';
        displayCtx.lineWidth = 2 + (effectiveAudio / 20); 
        displayCtx.beginPath();
        displayCtx.moveTo(0, scanLineY.current);
        displayCtx.lineTo(displayCanvas.width, scanLineY.current);
        displayCtx.stroke();
    }
    
    if (currentMode === MODES.HEATMAP.id) {
        displayCtx.save();
        const cellW = displayCanvas.width / HEAT_W;
        const cellH = displayCanvas.height / HEAT_H;
        let maxHeat = 0;
        let maxHeatIndex = -1;
        for (let j = 0; j < HEAT_SIZE; j++) {
            heatmapGrid.current[j] *= 0.96; 
            const heat = heatmapGrid.current[j];
            if (heat > maxHeat) { maxHeat = heat; maxHeatIndex = j; }
            if (heat > 2) { 
                const gx = (j % HEAT_W) * cellW;
                const gy = Math.floor(j / HEAT_W) * cellH;
                const hue = Math.max(0, 240 - (heat * 2.4));
                const lightness = heat > 80 ? 50 + (heat - 80) : 50;
                const alpha = Math.min(heat / 100, 0.8);
                displayCtx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
                displayCtx.fillRect(gx, gy, cellW + 1, cellH + 1);
            }
        }
        displayCtx.restore();
        if (maxHeat > 40 && maxHeatIndex !== -1) {
            const hx = (maxHeatIndex % HEAT_W) * cellW + (cellW/2);
            const hy = Math.floor(maxHeatIndex / HEAT_W) * cellH + (cellH/2);
            displayCtx.strokeStyle = 'white';
            displayCtx.lineWidth = 1;
            displayCtx.beginPath();
            displayCtx.moveTo(hx - 10, hy); displayCtx.lineTo(hx + 10, hy);
            displayCtx.moveTo(hx, hy - 10); displayCtx.lineTo(hx, hy + 10);
            displayCtx.stroke();
            displayCtx.fillStyle = 'white';
            displayCtx.font = 'bold 10px "Montserrat", sans-serif';
            displayCtx.fillText(`MAX: ${(maxHeat * 0.8).toFixed(1)}°C`, hx + 12, hy - 5);
        }
    }
    
    if (currentZone !== null) {
        const z = ZONES[currentZone];
        displayCtx.strokeStyle = zoneTriggered ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.3)';
        displayCtx.lineWidth = zoneTriggered ? 4 : 1;
        displayCtx.strokeRect(z.x * displayCanvas.width, z.y * displayCanvas.height, z.w * displayCanvas.width, z.h * displayCanvas.height);
        if (zoneTriggered) {
             displayCtx.fillStyle = 'red';
             displayCtx.font = 'bold 20px "Montserrat", sans-serif';
             displayCtx.fillText(z.role, z.x * displayCanvas.width + 20, z.y * displayCanvas.height + 40);
        }
    }
    
    const currentMotion = motionScoreRef.current;
    if (currentMode === MODES.BREATH.id) {
        const time = Date.now() * 0.003;
        const pulseSpeed = 1 + (effectiveAudio / 40);
        const breathCycle = Math.sin(time * pulseSpeed);
        if (videoRef.current) {
            const scaleFactor = 1 + (breathCycle * 0.02) + (effectiveAudio / 400);
            videoRef.current.style.transform = `scale(${scaleFactor})`;
        }
        const baseRadius = 20 + (currentMotion * 0.5) + (effectiveAudio);
        for (let i = 0; i < 5; i++) {
            const offset = i * 1.2;
            const wave = Math.sin((time * pulseSpeed) - offset);
            const expansion = (wave + 1) / 2; 
            const currentRadius = baseRadius + (expansion * (100 + effectiveAudio + currentMotion));
            const alpha = Math.max(0, (1 - expansion) * (0.8 - (i * 0.15)));
            const stressLevel = Math.min(100, effectiveAudio + (currentMotion/2));
            const hue = 160 - (stressLevel * 1.6); 
            displayCtx.beginPath();
            displayCtx.arc(displayCanvas.width / 2, displayCanvas.height / 2, currentRadius, 0, 2 * Math.PI);
            displayCtx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
            displayCtx.lineWidth = 2 + (expansion * 5) + (effectiveAudio / 10);
            displayCtx.stroke();
        }
        displayCtx.beginPath();
        displayCtx.arc(displayCanvas.width / 2, displayCanvas.height / 2, baseRadius * 0.5, 0, 2 * Math.PI);
        const coreHue = 160 - (Math.min(100, effectiveAudio) * 1.6);
        displayCtx.fillStyle = `hsla(${coreHue}, 100%, 50%, ${0.2 + (effectiveAudio/100)})`;
        displayCtx.fill();
    } else {
        if (videoRef.current && videoRef.current.style.transform !== 'scale(1)') {
            videoRef.current.style.transform = 'scale(1)';
        }
    }

    lastFrameData.current = frameData;
    const totalPixels = (canvas.width * canvas.height) / 16;
    const score = Math.min((changedPixels / totalPixels) * 1000, 100);
    
    const prevMotion = motionScoreRef.current;
    const newMotionScore = prevMotion * 0.9 + score * 0.1;
    motionScoreRef.current = newMotionScore;
    
    let rawCentroid = centroidRef.current; 
    if (changedPixels > 0) {
        rawCentroid = { 
            x: (sumX / changedPixels) / canvas.width, 
            y: (sumY / changedPixels) / canvas.height 
        };
    }

    const prevCentroid = centroidRef.current;
    const newCentroidX = prevCentroid.x * 0.9 + rawCentroid.x * 0.1;
    const newCentroidY = prevCentroid.y * 0.9 + rawCentroid.y * 0.1;
    centroidRef.current = { x: newCentroidX, y: newCentroidY };

    frameCounterRef.current += 1;
    if (frameCounterRef.current % 10 === 0) {
        setUiMotionScore(newMotionScore);
        setUiAudioScore(newAudioScore);
        setUiCentroid({ x: newCentroidX, y: newCentroidY });
        
        if ((zoneTriggered || audioGlitch) && !glitchActive) setGlitchActive(true);
        else if (!zoneTriggered && !audioGlitch && score < 70) setGlitchActive(false);
    }

    updateAudio(score, newCentroidX);
    drawOscilloscope();
    requestRef.current = requestAnimationFrame(processFrame);
  }, [glitchActive]);

  const drawOscilloscope = () => {
      const canvas = oscCanvasRef.current;
      if (!canvas || !analyserRef.current || !audioEnabledRef.current) return;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#001005';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
  };

  const startCamera = async () => {
    setIsScanning(true);
    addLog("INICIANDO VIDEO...", false);
    setTimeout(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsScanning(false);
            setIsSystemActive(true);
            requestRef.current = requestAnimationFrame(processFrame);
            addLog("SISTEMA ONLINE.", false);
        }).catch(() => {
            setIsScanning(false);
            addLog("ERROR CÁMARA.", false);
        });
    }, 1500);
  };

  const stopSystem = () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    if (isRecording && sessionLogs.length > 5) generateManifesto();
    setIsSystemActive(false);
    setAudioEnabled(false);
    setUiMotionScore(0);
    motionScoreRef.current = 0;
    setIsRecording(false);
    addLog("SISTEMA APAGADO.", false);
  };

   useEffect(() => {
    let interval;
    if (autoMode && isSystemActive) {
        addLog("PILOTO AUTOMÁTICO: INICIADO", false);
        interval = setInterval(() => {
            const modes = Object.keys(MODES);
            const filters = Object.keys(CAMERA_FILTERS);
            const randomMode = modes[Math.floor(Math.random() * modes.length)];
            const randomFilter = filters[Math.floor(Math.random() * filters.length)];
            setActiveMode(randomMode);
            if(Math.random() > 0.7) setActiveFilter(randomFilter);
            addLog(`AUTO: ${randomMode} / ${activeFilter}`, false);
        }, 15000);
    }
    return () => clearInterval(interval);
  }, [autoMode, isSystemActive, activeFilter, addLog]);

  useEffect(() => {
    if (isSystemActive) {
        requestRef.current = requestAnimationFrame(processFrame);
    } else {
        if(requestRef.current) cancelAnimationFrame(requestRef.current)
    }
    return () => {
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  },[isSystemActive, processFrame]);

  return (
    <div className={`min-h-screen bg-black text-green-500 font-montserrat p-2 flex flex-col md:flex-row gap-2 overflow-hidden selection:bg-green-900 selection:text-white ${glitchActive ? 'glitch-container' : ''}`}>
      <div className={`flex-1 flex flex-col gap-2 relative border border-green-900/50 bg-neutral-900/20 p-2 ${galleryMode ? 'fixed inset-0 z-50 bg-black p-0 border-0' : ''}`}>
        {!galleryMode && (
          <div className="flex justify-between items-center pb-2 border-b border-green-900/50">
            <div>
              <h1 className="text-xl font-extrabold tracking-[0.2em] text-green-400">VIGILIA<span className="text-green-800">EXP</span></h1>
              <p className="text-[10px] text-green-600 font-medium">v2026.19 // {activeMode}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className={isRecording ? "text-red-500 animate-pulse" : "text-gray-600"}>
                  {isRecording ? `REC ${recordingTime}s` : "ESPERA"}
              </span>
              <div className={`px-2 py-0.5 rounded text-[10px] ${isSystemActive ? 'bg-green-900 text-green-100' : 'bg-red-900/30 text-red-500'}`}>
                  {isSystemActive ? 'EN VIVO' : 'OFF'}
              </div>
            </div>
          </div>
        )}
        <div className={`relative bg-black rounded-sm flex-1 overflow-hidden flex items-center justify-center group ${!galleryMode ? 'min-h-[400px] border border-green-900/30' : 'w-full h-full'}`}>
          {!isSystemActive && !isScanning && (
            <div className="text-center text-green-900/50">
              <Aperture className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <p className="text-xs tracking-widest font-semibold">SISTEMA INACTIVO</p>
            </div>
          )}
          {isScanning && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
                <Target className="w-16 h-16 text-green-500 animate-spin opacity-50 mb-4" />
                <p className="text-xs text-green-400 animate-pulse font-semibold">INICIANDO SENSORES...</p>
             </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          <video 
            ref={videoRef} 
            style={{ filter: CAMERA_FILTERS[activeFilter].filter }}
            className={`absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-all duration-300 ${glitchActive ? 'translate-x-1' : ''}`} 
            muted 
            playsInline 
          />
          <canvas ref={displayCanvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen" />
          {isSystemActive && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  {!galleryMode && (
                    <div className="flex justify-between text-[10px] text-green-500/50 font-medium">
                        <span>CAM-FEED-01</span>
                        <span className={uiAudioScore > 10 ? 'text-green-300 font-bold' : ''}>AUDIO: {uiAudioScore.toFixed(0)}</span>
                    </div>
                  )}
                  {activeMode !== MODES.POETIC.id && (
                    <div className="absolute w-4 h-4 border border-green-400/50 rounded-full transition-all duration-100"
                        style={{ left: `${uiCentroid.x * 100}%`, top: `${uiCentroid.y * 100}%`, transform: 'translate(-50%, -50%)' }} />
                  )}
                  {!galleryMode && (
                    <div className="absolute bottom-4 right-4 text-right">
                        <p className="text-xs font-bold text-green-400">{activeZone !== null ? `ZONA ${ZONES[activeZone].label}` : ''}</p>
                    </div>
                  )}

                  {galleryMode && (
                      <div className="absolute bottom-4 left-4 opacity-30 text-green-500 text-xs tracking-[0.5em] font-extrabold">VIGILIA</div>
                  )}
              </div>
          )}
          <button 
            onClick={() => setGalleryMode(!galleryMode)}
            className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-all ${galleryMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-transparent text-green-800 hover:text-green-400'}`}
          >
              {galleryMode ? <EyeOff size={16}/> : <Monitor size={16}/>}
          </button>
          {glitchActive && (
              <div className="absolute inset-0 bg-red-500/20 z-40 mix-blend-hard-light flex items-center justify-center">
                  {!galleryMode && <h2 className="text-4xl font-black text-black bg-red-500 px-4 py-2">{uiAudioScore > 30 ? 'AUDIO SPIKE' : 'ALERTA'}</h2>}
              </div>
          )}
        </div>
      </div>
      {!galleryMode && (
      <div className="w-full md:w-80 flex flex-col gap-2 bg-neutral-900/20 border-l border-green-900/50 p-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
            {!isSystemActive ? (
                <button onClick={startCamera} disabled={isScanning} className="col-span-2 py-4 bg-green-900 hover:bg-green-800 text-white font-extrabold text-xs tracking-widest transition-all rounded-sm">
                    {isScanning ? 'INICIANDO...' : 'ENCENDER'}
                </button>
            ) : (
                <button onClick={stopSystem} className="col-span-2 py-4 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 font-extrabold text-xs tracking-widest transition-all rounded-sm">
                    {isRecording ? 'FINALIZAR' : 'APAGAR'}
                </button>
            )}
            <button onClick={() => setIsRecording(!isRecording)} disabled={!isSystemActive} className={`py-2 text-[10px] border rounded-sm font-semibold ${isRecording ? 'bg-red-600 text-white border-red-600' : 'border-neutral-700 text-neutral-400 hover:border-white'}`}>
                {isRecording ? 'STOP REC' : 'GRABAR'}
            </button>
            <button onClick={takeSnapshot} disabled={!isSystemActive} className="py-2 text-[10px] border border-neutral-700 text-neutral-400 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-1 rounded-sm font-semibold">
                <Save size={10} /> FOTO HD
            </button>
            <button onClick={callGeminiPoet} disabled={!isSystemActive || isLoadingAI} className={`col-span-2 py-2 text-[10px] border rounded-sm transition-colors flex items-center justify-center gap-2 font-bold ${isLoadingAI ? 'bg-yellow-900/30 border-yellow-700 text-yellow-500 cursor-wait' : 'bg-purple-900/20 border-purple-500/50 text-purple-300 hover:bg-purple-900/40 hover:text-white'}`}>
                <Sparkles size={12} /> {isLoadingAI ? 'PROCESANDO...' : 'CONSULTAR ORÁCULO'}
            </button>
        </div>
        <div className="border-t border-green-900/50 pt-2 mb-2">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-[10px] text-green-600 uppercase tracking-wider font-bold">Óptica del Sensor</h3>
                <button onClick={() => setAutoMode(!autoMode)} className={`text-[9px] flex items-center gap-1 px-2 py-0.5 rounded-sm transition-colors font-semibold ${autoMode ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-600' : 'text-green-700 hover:text-green-400 border border-transparent'}`}>
                    <Shuffle size={10}/> AUTO PILOT
                </button>
            </div>
            <div className="grid grid-cols-5 gap-1">
                {Object.values(CAMERA_FILTERS).map(filter => (
                    <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`flex flex-col items-center justify-center p-1 rounded-sm transition-all ${activeFilter === filter.id ? 'bg-green-900/50 text-green-300 border border-green-600' : 'bg-transparent text-green-900 hover:text-green-500 border border-transparent'}`} title={filter.label}>
                        {filter.icon}
                        <span className="text-[7px] mt-1 font-medium">{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="bg-black border border-green-900/50 relative mb-2 rounded-sm overflow-hidden flex flex-col">
             <div className="h-16 relative">
                 <canvas ref={oscCanvasRef} width={300} height={64} className="w-full h-full opacity-80" />
                 <div className="absolute top-1 left-1 text-[8px] text-green-500 flex gap-2 items-center font-semibold">
                    <Sliders size={8} /> <span>MEZCLADOR SONORO</span>
                 </div>
                 <button onClick={() => { if(!audioEnabled) initAudio(); else toggleMasterMute(false);}} className={`absolute bottom-1 right-1 px-2 py-0.5 text-[8px] border rounded-sm font-semibold ${audioEnabled ? 'border-green-500 bg-green-900/30 text-green-400' : 'border-neutral-700 text-neutral-600'}`}>
                     MASTER {audioEnabled ? 'ON' : 'OFF'}
                 </button>
             </div>
             {audioEnabled && (
                 <div className="grid grid-cols-4 gap-px bg-green-900/30 border-t border-green-900/50">
                    <button onClick={() => toggleAudioChannel('melody')} className={`py-2 text-[8px] flex flex-col items-center justify-center gap-1 font-medium ${audioConfig.melody ? 'text-green-300 bg-green-900/50' : 'text-green-900 bg-black'}`}>
                        <Music size={10} /> MELODÍA
                    </button>
                    <button onClick={() => toggleAudioChannel('drone')} className={`py-2 text-[8px] flex flex-col items-center justify-center gap-1 font-medium ${audioConfig.drone ? 'text-green-300 bg-green-900/50' : 'text-green-900 bg-black'}`}>
                        <Activity size={10} /> DRONE
                    </button>
                    <button onClick={() => toggleAudioChannel('noise')} className={`py-2 text-[8px] flex flex-col items-center justify-center gap-1 font-medium ${audioConfig.noise ? 'text-green-300 bg-green-900/50' : 'text-green-900 bg-black'}`}>
                        <Volume2 size={10} /> RUIDO
                    </button>
                    <button onClick={() => toggleAudioChannel('mic')} className={`py-2 text-[8px] flex flex-col items-center justify-center gap-1 font-medium ${audioConfig.mic ? 'text-red-400 bg-red-900/20' : 'text-green-900 bg-black'}`}>
                        {audioConfig.mic ? <Mic size={10} /> : <MicOff size={10} />} MIC
                    </button>
                 </div>
             )}
        </div>
        <div className="border-t border-green-900/50 pt-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] text-green-600 uppercase tracking-wider font-bold">Protocolo Visual</h3>
                <button onClick={clearCanvas} className="text-[9px] flex items-center gap-1 text-green-700 hover:text-green-400 font-semibold"><Trash2 size={10}/> LIMPIAR</button>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-4">
                {Object.values(MODES).map(mode => (
                    <button key={mode.id} onClick={() => setActiveMode(mode.id)} className={`text-[9px] py-2 px-2 text-left truncate transition-all border rounded-sm flex items-center gap-2 font-medium ${activeMode === mode.id ? 'bg-green-900/40 border-green-500 text-white' : 'border-neutral-800 text-neutral-500 hover:text-green-500 hover:border-green-900'}`}>
                        {mode.icon} {mode.label}
                    </button>
                ))}
            </div>
        </div>
        <div className="border-t border-green-900/50 pt-2">
            <h3 className="text-[10px] text-green-600 mb-2 uppercase tracking-wider font-bold flex justify-between">
                Partitura Zonal
                <span className="text-green-800">{activeZone !== null ? ZONES[activeZone].role : 'LIBRE'}</span>
            </h3>
            <div className="grid grid-cols-4 gap-1 h-10 mb-4">
                {ZONES.map(zone => (
                    <button key={zone.id} onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)} className={`border text-[9px] flex flex-col items-center justify-center transition-all rounded-sm font-medium ${activeZone === zone.id ? 'bg-red-900/40 border-red-500 text-red-400 font-bold' : 'border-neutral-800 text-neutral-600 hover:border-green-600'}`}>
                        <span>{zone.label}</span>
                        <span className="text-[7px] opacity-70 font-normal">{zone.role}</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="flex-1 bg-black border border-green-900/50 p-2 font-jetbrains text-[9px] overflow-hidden flex flex-col min-h-[100px] rounded-sm">
          <div className="flex items-center gap-2 text-green-700 border-b border-green-900/30 pb-1 mb-1 font-semibold">
            <Terminal size={10} /> SYSTEM LOG
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="mb-0.5 opacity-80 hover:opacity-100 break-words">
                <span className="text-green-800 mr-2">[{log.time}]</span>
                <span className={log.text.startsWith('[IA]') ? 'text-purple-400 font-bold' : log.text.startsWith('===') ? 'text-yellow-400' : 'text-green-500'}>
                    {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@400;500;600;800;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #14532d; }
        .glitch-container { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } }
        .cursor-wait { cursor: wait; }
      `}</style>
    </div>
  );
}
