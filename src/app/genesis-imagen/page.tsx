'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Image as ImageIcon, Music, Cpu, X, Youtube, Heart, Layers, Sparkles, Hexagon, Users, BookOpen, Share2, Zap, MonitorPlay, Settings, CircleDashed, AlignJustify, MoveHorizontal, FileImage, Bot, MessageSquare, ExternalLink, Send } from 'lucide-react';
import { continueDialogue, type DialogueMessage } from '@/ai/flows/dialogue-flow';

// --- DATOS DE VIDEOS ---
const videoDatabase = {
  liquid: [
    { id: 'l1', title: "Grateful Dead Live 1973", author: "Winterland Concert", videoId: "jWI3b-Y7KJA", category: "classics" },
    { id: 'l2', title: "Soft Machine - UFO Club", author: "Psychedelic Scene 1967", videoId: "QWV2Co4X4pw", category: "classics" },
    { id: 'l4', title: "Liquid Loops", author: "The Joshua Light Show", videoId: "6Xc4g00FFLk", category: "classics" },
    { id: 'l6', title: "Pink Floyd - Echoes", author: "Visual Atmosphere", videoId: "GyifuiQ6p48", category: "classics" },
    { id: 'l5', title: "Key to the Sun", author: "SIMA Light Show", videoId: "86Wp96uG-N8", category: "technique" },
    { id: 'l3', title: "FLUID Performance", author: "Atsushi Harata", videoId: "LJOISAHunjQ", category: "technique" },
    { id: 'l7', title: "Kinection Experiment", author: "Heat & Color", videoId: "RrZxw1Jb9vA", category: "technique" },
    { id: 'l9', title: "Ink In Motion", author: "Macro Art", videoId: "TbV7loKp69s", category: "technique" },
    { id: 'l10', title: "Colors in Macro", author: "Chemical Reaction", videoId: "NghuDXuVzRk", category: "technique" }
  ],
  music: [
    { id: 'm2', title: "An Optical Poem", author: "Oskar Fischinger (1938)", videoId: "aEI-Jm3kTGQ", category: "pioneers" },
    { id: 'm6', title: "Catalog (Analog Computer)", author: "John Whitney (1961)", videoId: "gNbSjMFd7j4", category: "pioneers" },
    { id: 'm3', title: "A Phantasy in Colors", author: "Norman McLaren", videoId: "gHonAXuMHZE", category: "pioneers" },
    { id: 'm4', title: "Early Abstractions", author: "Harry Smith", videoId: "UpNTwXycNww", category: "pioneers" },
    { id: 'm1', title: "Counterpoint in Space", author: "Thomas Wilfred (Lumia)", videoId: "TW733Ut5zE0", category: "contemporary" },
    { id: 'm5', title: "Sync", author: "Max Hattler", videoId: "z0nO0dXXio4", category: "contemporary" },
    { id: 'm7', title: "Nocturnos (Debussy)", author: "Orquesta UdeA", videoId: "JLfLSjbm4s8", category: "contemporary" }
  ],
  scanimation: [
    { id: 's1', title: "FANCY CORRIDOR", author: "Creama Wong", videoId: "mwTcZPKVyj0", category: "inspiration", description: "Instalación inmersiva en RISD usando Scanimation a gran escala." },
    { id: 's2', title: "Historia de LIFETILES", author: "Rufus Butler Seder", videoId: "w5oiM9CdlAA", category: "inspiration", description: "El creador de los libros Scanimation explica sus murales ópticos." },
    { id: 's3', title: "Tutorial: Photoshop", author: "Técnica Digital", videoId: "zuxBBZNGvTM", category: "tutorial", description: "Cómo crear la rejilla de interferencia paso a paso." },
    { id: 's4', title: "Tutorial: Illustrator", author: "Vectores Precisos", videoId: "GEJbGsXotsI", category: "tutorial", description: "Guía para crear ilusiones ópticas vectoriales." },
    { id: 's5', title: "Dibujando a Pac-Man", author: "Técnica Manual", videoId: "UW5bcsax78I", category: "tutorial", description: "Ilusión óptica analógica dibujada a mano." },
    { id: 's6', title: "The Wizard of Oz", author: "Scanimation Book", videoId: "sPYs593L9EI", category: "inspiration", description: "Aplicación comercial de la técnica lenticular de barreras en formato de libro." },
    { id: 's7', title: "Star Wars: Scanimation", author: "Rufus Butler Seder", videoId: "r4i6j2jffvI", category: "inspiration", description: "Libro que revive escenas icónicas de la galaxia a través del movimiento óptico manual." },
    { id: 's8', title: "Amazing Illusions #7", author: "Compilation", videoId: "Vl_lt-1F84U", category: "inspiration", description: "Recopilación de ilusiones ópticas sorprendentes basadas en acetatos rayados." }
  ],
  ai: [
    { id: 'a1', title: "How Far is Too Far? | The Age of A.I.", author: "YouTube Originals", videoId: "UwsrzCVZAb8", category: "documentary", description: "¿Puede la IA hacer música o arte? Will.i.am y Mark Sagar exploran los límites creativos y la simulación digital." },
    { id: 'a2', title: "The AI art boom is here", author: "Vox", videoId: "SVcsDDABEkM", category: "generative", description: "Un análisis detallado sobre cómo los generadores de imágenes (Midjourney, DALL-E) están transformando el panorama del arte visual." },
    { id: 'a3', title: "In the Age of AI (Full Documentary)", author: "FRONTLINE PBS", videoId: "5dZ_lvDgevk", category: "documentary", description: "Una mirada profunda a cómo la inteligencia artificial está cambiando la vida, los empleos y la privacidad global." },
    { id: 'a4', title: "America's Next Great Leap", author: "NVIDIA", videoId: "r6RT0JJgRIc", category: "innovation", description: "La visión de la industria tecnológica sobre el futuro de la supercomputación y el impacto de la Inteligencia Artificial." }
  ]
};

// --- COMPONENTE: BLOQUE DE TEXTO HISTÓRICO ---
const HistoryBlock = ({ title, children, align = "left", accentColor = "primary" }) => {
  const shadowColor = accentColor === 'accent' ? 'shadow-accent/20' : 'shadow-primary/20';
  const borderColor = accentColor === 'accent' ? 'border-accent' : 'border-primary';
  const glowColor = accentColor === 'accent' ? 'bg-accent/10' : 'bg-primary/10';

  return (
    <div className={`my-20 flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"} animate-in slide-in-from-bottom-10 fade-in duration-1000`}>
      <div className="max-w-3xl relative group">
        <div className={`absolute -top-10 ${align === "right" ? "-right-10" : "-left-10"} w-48 h-48 ${glowColor} rounded-full blur-[80px] pointer-events-none transition-colors duration-700 group-hover:opacity-100 opacity-50`}></div>
        <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6 relative z-10 font-headline tracking-tight leading-tight">
          {title}
        </h3>
        <div className={`bg-card/60 backdrop-blur-2xl border-l-4 ${borderColor} p-8 md:p-10 rounded-r-xl ${shadowColor} shadow-2xl hover:bg-card/80 transition-all duration-500 relative z-10 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light space-y-5 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: TARJETA DE VIDEO MEJORADA ---
const VideoCard = ({ video, onClick, isLiked, onToggleLike }) => {
  const thumbnailUrl = video.videoId ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` : null;

  return (
    <div 
      className="group relative aspect-video bg-secondary rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer border border-border hover:border-primary/50"
      onClick={() => onClick(video)}
    >
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 scale-100 group-hover:scale-110"/>
      ) : (
        <div className={`w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110`}>
          <MonitorPlay className="w-12 h-12 text-foreground/40 group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
        <div className="w-16 h-16 bg-foreground/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl ring-1 ring-foreground/20 group-hover:ring-primary/50 group-hover:bg-primary/80 transition-all duration-300">
          <Play className="w-6 h-6 text-white ml-1 fill-white" />
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onToggleLike(video); }}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-primary text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20 border border-foreground/10 hover:border-transparent"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-white/70'}`} />
      </button>

      <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center">
          <Youtube className="w-3 h-3 mr-2" /> {video.author}
        </p>
        <h4 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-primary-foreground transition-colors">{video.title}</h4>
      </div>
    </div>
  );
};

// --- COMPONENTE INTERACTIVO: LABORATORIO ÓPTICO ---
const OpticalLaboratory = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [gridType, setGridType] = useState('vertical');
  const [baseType, setBaseType] = useState('muybridge');
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["MOVER", "CREAR", "ÓPTICA", "ILUSIÓN"];

  const handleChangeWord = () => {
    setWordIndex((prev) => (prev + 1) % words.length);
  };

  const getGridStyle = () => {
    switch(gridType) {
      case 'vertical': return 'repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--background)) 3px, hsl(var(--background)) 7px)';
      case 'horizontal': return 'repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(var(--background)) 3px, hsl(var(--background)) 7px)';
      case 'circles': return 'repeating-radial-gradient(circle at center, transparent, transparent 4px, hsl(var(--background)) 4px, hsl(var(--background)) 10px)';
      default: return '';
    }
  };

  const getGridTransform = () => {
    switch(gridType) {
      case 'vertical': return `translateX(-${pos.x}px)`;
      case 'horizontal': return `translateY(-${pos.y}px)`;
      case 'circles': return `translate(-${pos.x * 0.5}px, -${pos.y * 0.5}px)`;
      default: return '';
    }
  };

  const renderBaseLayer = () => {
    switch (baseType) {
      case 'text':
        return (
          <div className="absolute inset-0 flex items-center justify-center transition-colors duration-500">
            <div className="text-[7rem] md:text-[10rem] font-black text-black leading-none tracking-tighter opacity-[0.15] select-none transform scale-110">
              {words[wordIndex]}
            </div>
            <div className="absolute inset-0 w-full h-full z-30 flex justify-center items-center pointer-events-none">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-yellow-500 mix-blend-difference select-none drop-shadow-2xl">
                {words[wordIndex]}
              </h1>
            </div>
          </div>
        );
      case 'moire':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-white opacity-90">
             <div className="w-full h-full bg-[repeating-radial-gradient(circle_at_center,black,black_2px,transparent_2px,transparent_8px)] opacity-50"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-[repeating-radial-gradient(circle_at_center,black,black_2px,transparent_2px,transparent_8px)] opacity-50 mix-blend-multiply" style={{ transform: `translate(${pos.x * 0.1}px, ${pos.y * 0.1}px)` }}></div>
          </div>
        );
      case 'muybridge':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden">
             <div className="w-full h-full flex items-center justify-center opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, black, black 4px, transparent 4px, transparent 8px)' }}>
                <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 fill-black animate-pulse duration-1000">
                   <path d="M20,60 Q30,50 40,60 T60,60 T80,60 L80,40 Q70,30 60,40 T40,40 T20,40 Z" />
                   <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="10" fill="black" className="opacity-0">Caballo Muybridge</text>
                </svg>
                <div className="absolute text-black font-bold text-lg mix-blend-difference pointer-events-none">SIMULACIÓN: CABALLO MUYBRIDGE</div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/3 bg-secondary/30 p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
        <div>
          <div className="flex items-center text-accent font-bold uppercase tracking-widest text-xs mb-6">
            <Settings className="w-4 h-4 mr-2" /> Panel de Control
          </div>
          <h3 className="text-foreground font-bold text-xl mb-4">1. Ejercicio (Imagen Base)</h3>
          <div className="flex flex-col gap-2 mb-8">
             <button onClick={() => { setBaseType('muybridge'); setGridType('vertical'); }} className={`flex items-center p-3 rounded-xl border transition-all ${baseType === 'muybridge' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground hover:border-foreground/50'}`}>
               <FileImage className="w-5 h-5 mr-3" /> El Caballo de Muybridge
             </button>
             <button onClick={() => { setBaseType('moire'); setGridType('circles'); }} className={`flex items-center p-3 rounded-xl border transition-all ${baseType === 'moire' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground hover:border-foreground/50'}`}>
               <CircleDashed className="w-5 h-5 mr-3" /> Patrones de Moiré
             </button>
             <button onClick={() => { setBaseType('text'); setGridType('vertical'); }} className={`flex items-center p-3 rounded-xl border transition-all ${baseType === 'text' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground hover:border-foreground/50'}`}>
               <AlignJustify className="w-5 h-5 mr-3" /> Texto Oculto
             </button>
          </div>
          <h3 className="text-foreground font-bold text-xl mb-4">2. Rejilla (Barrera)</h3>
          <div className="flex gap-2">
            <button onClick={() => setGridType('vertical')} className={`flex-1 p-2 rounded-lg border flex justify-center transition-all ${gridType === 'vertical' ? 'bg-accent/20 border-accent text-accent' : 'bg-background/50 border-border text-muted-foreground'}`} title="Vertical"><AlignJustify className="rotate-90 w-5 h-5"/></button>
            <button onClick={() => setGridType('horizontal')} className={`flex-1 p-2 rounded-lg border flex justify-center transition-all ${gridType === 'horizontal' ? 'bg-accent/20 border-accent text-accent' : 'bg-background/50 border-border text-muted-foreground'}`} title="Horizontal"><AlignJustify className="w-5 h-5"/></button>
            <button onClick={() => setGridType('circles')} className={`flex-1 p-2 rounded-lg border flex justify-center transition-all ${gridType === 'circles' ? 'bg-accent/20 border-accent text-accent' : 'bg-background/50 border-border text-muted-foreground'}`} title="Circular"><CircleDashed className="w-5 h-5"/></button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed flex items-center">
            <MoveHorizontal className="w-4 h-4 mr-2" />
            Arrastra sobre el lienzo para mover la rejilla y revelar la animación.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-2/3 h-96 lg:h-auto relative overflow-hidden cursor-move bg-white group"
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
           }}
           onTouchMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             setPos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
           }}
           onClick={baseType === 'text' ? handleChangeWord : undefined}
      >
        <div className="absolute top-4 right-4 z-40 bg-background/60 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-medium text-foreground border border-border flex items-center shadow-lg">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" /> Simulador Activo
        </div>
        {renderBaseLayer()}
        {baseType !== 'moire' && (
          <div className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] z-20 mix-blend-hard-light" 
               style={{ 
                 backgroundImage: getGridStyle(),
                 transform: getGridTransform(),
                 transition: 'transform 0.05s linear' 
               }}>
          </div>
        )}
        <div className="absolute bottom-6 w-full text-center z-40 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-medium tracking-wide uppercase px-5 py-2.5 rounded-full border border-border shadow-2xl">
            ↔ Mueve para animar
          </span>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENTE CHATBOT "EL CURADOR" (GEMINI) ---
const CuratorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DialogueMessage[]>([
    { role: 'model', content: '¡Bienvenido al Archivo Visual! Soy tu asistente de IA. ¿Qué deseas explorar hoy? ¿Arte cinético, patrones de Moiré o el futuro del diseño?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: DialogueMessage = { role: 'user', content: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    
    setInputText('');
    setIsLoading(true);

    try {
      const customPrompt = "Eres 'El Curador', un guía experto en historia del arte visual, tecnología e ilusiones ópticas para una aplicación llamada 'Génesis de la Imagen'. Tu estilo es breve, inspirador y educativo. Responde preguntas sobre Luz Líquida, Música Visual, Scanimation e IA.";
      const botReply = await continueDialogue({
          history: newHistory,
          customSystemPrompt: customPrompt
      });
      setMessages(prev => [...prev, { role: 'model', content: botReply }]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', content: "Error de conexión. Intenta más tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-secondary border border-border w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gradient-to-r from-accent to-primary p-4 flex justify-between items-center">
            <h3 className="text-primary-foreground font-bold text-sm flex items-center">
              <Bot className="w-4 h-4 mr-2" /> El Curador AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-accent text-accent-foreground rounded-br-none' 
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-muted-foreground text-xs italic ml-2">Escribiendo...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-secondary border-t border-border flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-background/30 border border-border rounded-full px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              placeholder="Pregunta algo..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-primary hover:bg-primary/90 p-2 rounded-full text-primary-foreground transition-colors" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-accent to-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat IA
          </span>
        </button>
      )}
    </div>
  );
};


export default function GenesisImagenPage() {
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('likes_lab');
    if (saved) setLikedVideos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('likes_lab', JSON.stringify(likedVideos));
  }, [likedVideos]);

  const toggleLike = (video) => {
    setLikedVideos(prev => prev.find(v => v.id === video.id) ? prev.filter(v => v.id !== video.id) : [...prev, video]);
  };

  const navItems = [
    { id: 'intro', label: 'Inicio', icon: Hexagon },
    { id: 'liquid', label: 'Luz Líquida', icon: ImageIcon },
    { id: 'music', label: 'Música Visual', icon: Music },
    { id: 'scanimation', label: 'Scanimation', icon: Layers },
    { id: 'ai', label: 'Futuro (IA)', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/30 overflow-x-hidden">
      
      <CuratorChat />

      <nav className="pt-24 pb-12 flex justify-center z-10 relative">
        <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-2xl border border-border p-2 rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-5 py-3.5 rounded-full text-sm font-bold transition-all duration-500 relative overflow-hidden ${
                  isActive
                    ? 'text-primary-foreground shadow-lg scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {isActive && (
                   <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-accent"></div>
                )}
                <item.icon className={`w-4 h-4 md:mr-2 relative z-10 ${isActive ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }} />
                <span className="hidden md:inline relative z-10 tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {activeTab === 'intro' && (
        <header className="px-6 pb-12 text-center relative flex flex-col items-center justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background blur-[100px] -z-10 pointer-events-none"></div>
          
          <div className="animate-in fade-in zoom-in duration-1000">
            <div className="inline-flex items-center space-x-2 bg-secondary/50 backdrop-blur-md text-muted-foreground px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-border mb-8 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Archivo Interactivo</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-foreground mb-6 drop-shadow-2xl font-headline">
              GÉNESIS DE LA <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-yellow-400">
                IMAGEN
              </span>
            </h1>
            
            <p className="text-muted-foreground text-xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
              Una cronología visual: De la materia analógica a la inteligencia artificial.
            </p>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-6 pb-48">

        {activeTab !== 'intro' && (
          <div className="text-center mb-16 animate-in fade-in">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl font-headline">
              {navItems.find(item => item.id === activeTab)?.label.toUpperCase()}
            </h1>
          </div>
        )}

        {activeTab === 'intro' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="max-w-4xl mx-auto text-center mb-24 mt-12">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight font-headline">
                La historia de la ilusión óptica es la historia de nuestra relación con la tecnología.
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Este laboratorio explora cómo hemos pasado de manipular la luz y la química en los años 60, a programar píxeles y algoritmos en el presente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                {[
                  { id: 'liquid', title: "Luz Líquida", desc: "El origen analógico y psicodélico.", icon: ImageIcon },
                  { id: 'music', title: "Música Visual", desc: "Ver el sonido, escuchar la imagen.", icon: Music },
                  { id: 'scanimation', title: "Scanimation", desc: "Movimiento mecánico sin electricidad.", icon: Layers },
                  { id: 'ai', title: "Inteligencia Artificial", desc: "La nueva frontera de la creación.", icon: Cpu }
                ].map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => setActiveTab(card.id)}
                    className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 hover:bg-secondary transition-all duration-300 cursor-pointer group"
                  >
                    <card.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-foreground font-bold text-xl mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm">{card.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'liquid' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <HistoryBlock title="La Revolución Psicodélica (1966)">
              <p>Los espectáculos de luz líquida no fueron simple decoración: fueron el primer <strong>hackeo visual masivo</strong> de la percepción colectiva. Artistas como <strong>The Joshua Light Show</strong> convirtieron retroproyectores en instrumentos performáticos.</p>
              <p>Aceite, anilinas, calor y vidrio: química en tiempo real. No había render, no había exportar. Era error, accidente y materia viva.</p>
            </HistoryBlock>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-32">
              {videoDatabase.liquid.filter(v => v.category === 'classics').map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
              ))}
            </div>

            <HistoryBlock title="Materia, Fluido y Tiempo" align="right">
              <p>La luz líquida demuestra algo esencial: el movimiento no es digital por naturaleza, es físico. Artistas contemporáneos como <strong>Atsushi Harata</strong> retoman esa tradición, trabajando a escala microscópica para revelar universos invisibles.</p>
              <p>En una era obsesionada con pantallas, volver al fluido es recordar que la imagen nace en la materia antes que en el píxel.</p>
            </HistoryBlock>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoDatabase.liquid.filter(v => v.category === 'technique').map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <HistoryBlock title="Sinestesia y Abstracción Radical">
              <p>Antes de que existiera After Effects, existía tijera y metrónomo. <strong>Oskar Fischinger</strong>, <strong>Norman McLaren</strong> y <strong>Harry Smith</strong> entendieron algo profundo: el sonido puede traducirse en geometría.</p>
              <p>No buscaban ilustrar música, sino estructurarla visualmente. La música visual es disciplina, matemática y sensibilidad.</p>
            </HistoryBlock>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
              {videoDatabase.music.filter(v => v.category === 'pioneers').map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
              ))}
            </div>

            <HistoryBlock title="Del Cálculo Bélico al Arte" align="right">
              <p><strong>John Whitney</strong> utilizó computadoras diseñadas para calcular trayectorias de misiles. Donde el ejército veía precisión balística, él vio coreografía matemática.</p>
              <p>El arte digital no nació en Silicon Valley, nació en el reciclaje creativo de máquinas industriales. Cada herramienta nueva puede servir para dominar o para imaginar.</p>
            </HistoryBlock>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoDatabase.music.filter(v => v.category === 'contemporary').map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scanimation' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex flex-col mb-16">
               <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold uppercase tracking-widest border border-accent/20 w-max mb-6">
                  Ilusión Óptica Activa
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-foreground leading-tight tracking-tighter mb-6 font-headline">
                 El Arte de la <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Barrera de Paralaje</span>
               </h2>
               <p className="text-muted-foreground text-xl leading-relaxed font-light max-w-3xl mb-12">
                 Un kinegrama no engaña al ojo: entrena al cerebro. Alternando fragmentos de imagen detrás de una rejilla rayada, activamos un principio óptico centenario. <strong>No hay batería. No hay software.</strong>
               </p>
               
               <OpticalLaboratory />
             </div>

             <div className="my-24 bg-gradient-to-b from-secondary/40 to-background p-10 md:p-16 rounded-[3rem] border border-border">
               <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center font-headline">
                 <BookOpen className="w-8 h-8 mr-4 text-accent" />
                 Ejercicios del Taller: Aprender Haciendo
               </h3>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="bg-background/50 p-8 rounded-2xl border border-border">
                   <h4 className="text-xl font-bold text-foreground mb-4">1. La Matemática del Kinegrama</h4>
                   <p className="text-muted-foreground text-sm leading-relaxed">
                     Para crear la ilusión, debemos dividir el movimiento. Si animamos en 12 fases (ej. una rueda girando), nuestra máscara base debe tener un patrón específico: <strong>4 puntos en blanco y 8 cubiertos por franja</strong>. Esto asegura que solo se revele una fase de movimiento a la vez mientras desplazamos la rejilla.
                   </p>
                 </div>
                 <div className="bg-background/50 p-8 rounded-2xl border border-border">
                   <h4 className="text-xl font-bold text-foreground mb-4">2. El Caballo de Muybridge</h4>
                   <p className="text-muted-foreground text-sm leading-relaxed">
                     Las franjas no son arbitrarias. Al procesar la clásica animación de Muybridge, las franjas de la imagen base se desdibujan en un programa (como Processing o Photoshop). El espaciado de la lámina de acetato debe coincidir matemáticamente con la separación de los fotogramas impresos para que el trote cobre vida.
                   </p>
                 </div>
                 <div className="bg-background/50 p-8 rounded-2xl border border-border">
                   <h4 className="text-xl font-bold text-foreground mb-4">3. Patrones de Moiré</h4>
                   <p className="text-muted-foreground text-sm leading-relaxed">
                     Superponer dos tramas de líneas idénticas (como círculos concéntricos o diamantes) y desplazarlas genera un patrón de interferencia conocido como efecto Moiré. Es la forma más básica de crear ondas visuales y volumen a partir de líneas planas, usado extensamente en el arte cinético (Op-Art).
                   </p>
                 </div>
               </div>
             </div>

             <HistoryBlock title="La Persistencia de lo Analógico">
               <p>En plena cultura táctil y digital, la scanimation demuestra que el asombro no depende de la electrónica. Desde los murales inmersivos como "Fancy Corridor" hasta los libros de <strong>Rufus Butler Seder</strong>, la técnica revive cada vez que alguien decide mover una lámina rayada.</p>
             </HistoryBlock>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
               {videoDatabase.scanimation.filter(v => v.category === 'inspiration').map(video => (
                 <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
               ))}
             </div>

             <HistoryBlock title="Tutoriales Prácticos" align="right">
               <p>Crea tus propios kinegramas utilizando herramientas digitales como Photoshop e Illustrator, o explora la técnica manual dibujando personajes icónicos como Pac-Man. La teoría se comprende en la práctica.</p>
             </HistoryBlock>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {videoDatabase.scanimation.filter(v => v.category === 'tutorial').map(video => (
                 <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
               ))}
             </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto mt-6">
            
            <div className="relative group cursor-pointer w-full mb-24" onClick={() => setSelectedVideo({ title: "The Age of AI", author: "YouTube Originals", videoId: "f2aocKWrPG8", description: "Documental completo sobre cómo la Inteligencia Artificial está remodelando el mundo laboral y creativo." })}>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-accent rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
              
              <div className="relative w-full aspect-video md:aspect-[21/9] bg-secondary rounded-[2rem] overflow-hidden shadow-2xl border border-border">
                <img src="https://img.youtube.com/vi/f2aocKWrPG8/maxresdefault.jpg" alt="AI Doc" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out"/>
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 md:w-28 md:h-28 bg-[#1a73e8] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(26,115,232,0.6)] group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                      <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2 fill-white" />
                   </div>
                </div>

                <div className="absolute top-8 left-8">
                  <span className="text-white/80 font-bold text-xl md:text-2xl tracking-tighter opacity-80 mix-blend-overlay">YouTube Originals</span>
                </div>
                <div className="absolute bottom-8 left-8">
                  <span className="text-white font-black text-4xl md:text-6xl tracking-tighter drop-shadow-lg font-headline">THE AGE OF <br/>A.I.</span>
                </div>
              </div>
            </div>

            <HistoryBlock title="Inteligencia, Creatividad y Control" align="left" accentColor="primary">
              <p>La Inteligencia Artificial no es magia ni amenaza mística. Es estadística aplicada a escala masiva. Puede generar imágenes, música, texto. Pero no tiene intención.</p>
              <p>La creatividad humana no desaparece. <strong>Se desplaza.</strong> La cuestión central ya no es técnica. Es ética, económica y cultural.</p>
            </HistoryBlock>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {videoDatabase.ai.map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} isLiked={likedVideos.some(v => v.id === video.id)} onToggleLike={toggleLike} />
              ))}
            </div>
            
          </div>
        )}

      </main>

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity animate-in fade-in duration-300" 
            onClick={() => setSelectedVideo(null)}
          ></div>
          
          <div className="bg-card w-full max-w-6xl rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative z-10 border border-border flex flex-col lg:flex-row max-h-[95vh] animate-in zoom-in-95 duration-500 ease-out">
            <div className="w-full lg:w-3/4 bg-black aspect-video lg:aspect-auto flex items-center justify-center relative">
               {selectedVideo.videoId ? (
                 <iframe 
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allowFullScreen
                    allow="autoplay"
                  ></iframe>
               ) : (
                  <div className="text-center">
                    <MonitorPlay className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                    <p className="text-muted-foreground text-xl font-light">Vista previa no disponible</p>
                  </div>
               )}
            </div>
            
            <div className="w-full lg:w-1/4 p-8 lg:p-10 bg-card flex flex-col border-l border-border overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <span className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">{selectedVideo.author}</span>
                <button onClick={() => setSelectedVideo(null)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-full transition-colors bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-3xl font-bold text-foreground mb-6 leading-tight tracking-tight font-headline">{selectedVideo.title}</h3>
              
              <div className="flex-grow">
                <p className="text-muted-foreground text-base leading-relaxed font-light">
                  {selectedVideo.description || "Explora este referente visual histórico. Una pieza fundamental en el archivo de Núcleo Colectivo."}
                </p>
              </div>
              
              {selectedVideo.videoId && (
                <div className="mt-10">
                  <a 
                    href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 bg-foreground text-background hover:bg-foreground/80 text-sm font-bold rounded-2xl transition-all hover:scale-[1.02] shadow-xl"
                  >
                    Abrir en YouTube <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};
