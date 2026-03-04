'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Brain, MessageSquare, Eye, Palette, FlaskConical, Scale, Trophy, CheckCircle, XCircle, Lightbulb, Cpu, Sparkles } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const moduleData = [
    {
        title: "Fundamentos de IA",
        description: "Introducción al universo de la Inteligencia Artificial. Explora la historia, conceptos fundamentales y el contexto actual de la IA.",
        meta: ["⏱ 3-4 horas", "🎯 Nivel: Básico", "🧠 Objetivo: Comprender"],
        icon: <Brain />,
        content: [
            {
                title: "¿Qué es la Inteligencia Artificial?",
                text: [
                    "La <strong>Inteligencia Artificial (IA)</strong> es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana. Esto incluye el razonamiento, el aprendizaje, la percepción y la toma de decisiones.",
                    "A diferencia de la programación tradicional, donde defines reglas explícitas, la IA aprende patrones a partir de datos. No le dices \"si X entonces Y\", sino que le muestras miles de ejemplos y ella descubre las reglas."
                ]
            },
            {
                title: "Historia Breve",
                list: [
                    "<strong>1950:</strong> Alan Turing propone el Test de Turing",
                    "<strong>1956:</strong> Se acuña el término \"Inteligencia Artificial\" en Dartmouth",
                    "<strong>1980s:</strong> Sistemas expertos y primeros inviernos de IA",
                    "<strong>1997:</strong> Deep Blue vence a Kasparov en ajedrez",
                    "<strong>2012:</strong> Revolución del Deep Learning con AlexNet",
                    "<strong>2022:</strong> Explosión de IA generativa con ChatGPT y Stable Diffusion"
                ]
            },
            {
                title: "Conceptos Fundamentales",
                text: [
                    "<strong>Machine Learning (ML):</strong> Sistemas que aprenden de datos sin ser programados explícitamente.",
                    "<strong>Deep Learning (DL):</strong> Subset de ML que usa redes neuronales profundas con múltiples capas.",
                    "<strong>Redes Neuronales:</strong> Modelos inspirados en el cerebro humano, compuestos por neuronas artificiales.",
                    "<strong>Entrenamiento:</strong> Proceso de alimentar datos al modelo para que aprenda patrones.",
                    "<strong>Inferencia:</strong> Uso del modelo entrenado para hacer predicciones sobre nuevos datos."
                ],
                interactiveBox: {
                    title: "💡 Analogía",
                    text: [
                        "Piensa en la IA como enseñar a un niño a reconocer perros:",
                        "<strong>Programación tradicional:</strong> Le dices \"si tiene 4 patas, pelo y ladra, es un perro\"<br><strong>Machine Learning:</strong> Le muestras 1000 fotos de perros y 1000 de gatos, y él aprende las diferencias"
                    ]
                }
            },
            {
                title: "Tipos de IA",
                text: [
                    "<strong>IA Débil (Narrow AI):</strong> Especializada en una tarea específica (reconocimiento facial, traducción)",
                    "<strong>IA General (AGI):</strong> Hipotética IA con capacidades humanas completas (aún no existe)",
                    "<strong>Superinteligencia:</strong> IA que supera la inteligencia humana en todos los aspectos (ciencia ficción... por ahora)"
                ]
            }
        ],
        quiz: {
            question: "¿Cuál es la diferencia principal entre ML y programación tradicional?",
            options: [
                { text: "La programación tradicional es más rápida", feedback: "La programación tradicional usa reglas explícitas, no aprende de datos." },
                { text: "ML aprende de datos, programación tradicional usa reglas definidas", feedback: "Exacto. ML aprende patrones de datos, mientras que la programación tradicional usa reglas definidas por humanos." },
                { text: "ML no usa computadoras", feedback: "Ambos usan computadoras, la diferencia está en cómo procesan información." }
            ],
            correctIndex: 1
        }
    },
    {
        title: "IA Conversacional",
        description: "Domina el arte de interactuar con modelos de lenguaje. Aprende prompt engineering y comprende cómo funcionan los LLMs.",
        meta: ["⏱ 4-5 horas", "🎯 Nivel: Intermedio", "💬 Objetivo: Interactuar"],
        icon: <MessageSquare />,
        content: [
            {
                title: "¿Qué son los LLMs?",
                text: [
                    "Los <strong>Large Language Models (LLMs)</strong> son modelos de IA entrenados con enormes cantidades de texto para entender y generar lenguaje natural. ChatGPT, Claude, GPT-4, Gemini... todos son LLMs.",
                    "No \"entienden\" como un humano, pero predicen probabilísticamente qué palabra debería seguir basándose en patrones aprendidos de millones de textos."
                ],
                interactiveBox: {
                    title: "🔍 ¿Cómo funcionan?",
                    text: [
                        "1. <strong>Tokenización:</strong> El texto se divide en \"tokens\" (palabras o fragmentos)<br>2. <strong>Embeddings:</strong> Cada token se convierte en números (vectores)<br>3. <strong>Atención:</strong> El modelo analiza relaciones entre tokens<br>4. <strong>Generación:</strong> Predice el siguiente token más probable"
                    ]
                }
            },
            {
                title: "Prompt Engineering",
                text: ["El <strong>prompt</strong> es la instrucción que le das al modelo. Un buen prompt es la diferencia entre una respuesta mediocre y una excelente."],
                list: [
                    "<strong>Sé específico:</strong> \"Resume en 3 puntos\" vs \"Resume\"",
                    "<strong>Da contexto:</strong> \"Eres un experto en física cuántica...\"",
                    "<strong>Usa ejemplos:</strong> Few-shot learning (mostrar ejemplos)",
                    "<strong>Estructura:</strong> Usa formato claro (listas, secciones)",
                    "<strong>Itera:</strong> Refina el prompt basándote en resultados"
                ],
                codeBlock: `Ejemplo de prompt básico:\n"Explica la fotosíntesis"\n\nEjemplo de prompt avanzado:\n"Eres un profesor de biología explicando fotosíntesis a estudiantes de 12 años.\nUsa una analogía con cocina y divide la explicación en 3 pasos simples.\nIncluye un dato curioso al final."`
            },
            {
                title: "Limitaciones y Consideraciones",
                list: [
                    "<strong>Alucinaciones:</strong> Pueden inventar información con confianza",
                    "<strong>Sesgo:</strong> Reflejan sesgos de sus datos de entrenamiento",
                    "<strong>Sin conocimiento del mundo real:</strong> No saben qué pasó después de su fecha de corte",
                    "<strong>No razonan como humanos:</strong> Son predictores estadísticos sofisticados"
                ]
            }
        ],
        quiz: {
            question: "¿Qué es un \"token\" en el contexto de LLMs?",
            options: [
                { text: "Una unidad de texto que el modelo procesa (palabra o fragmento)", feedback: "Correcto. Los tokens son fragmentos de texto (palabras o partes) que el modelo procesa." },
                { text: "Una forma de pagar por usar el modelo", feedback: "Eso sería una moneda o crédito de API, no un token en procesamiento de lenguaje." },
                { text: "Un número en la red neuronal", feedback: "Eso sería un parámetro del modelo, no un token." }
            ],
            correctIndex: 0
        }
    },
    {
        title: "Visión por Computador",
        description: "Enseña a las máquinas a \"ver\". Experimenta con reconocimiento de imágenes y detección de objetos.",
        meta: ["⏱ 3-4 horas", "🎯 Nivel: Intermedio", "👁 Objetivo: Percibir"],
        icon: <Eye />,
        content: [
             {
                title: "¿Qué es Visión por Computador?",
                text: [
                    "La <strong>Visión por Computador</strong> es el campo de IA que permite a las máquinas \"entender\" imágenes y videos. Desde reconocer rostros hasta conducción autónoma.",
                    "Para una computadora, una imagen es solo una matriz de números (píxeles RGB). La visión por computador extrae significado de esos números."
                ]
            },
            {
                title: "Redes Neuronales Convolucionales (CNNs)",
                text: [ "Las <strong>CNNs</strong> son el tipo de red neuronal especializado en procesar imágenes. Funcionan aplicando \"filtros\" que detectan patrones visuales en diferentes niveles:" ],
                list: [
                    "<strong>Capa 1:</strong> Detecta bordes y líneas simples",
                    "<strong>Capa 2:</strong> Combina bordes en formas (círculos, rectángulos)",
                    "<strong>Capa 3:</strong> Reconoce partes de objetos (ojos, ruedas, ventanas)",
                    "<strong>Capa Final:</strong> Identifica objetos completos (perro, auto, casa)"
                ],
                interactiveBox: {
                    title: "🔬 Analogía Visual",
                    text: [
                        "Es como cuando dibujas: primero trazas líneas básicas, luego formas, después detalles, y finalmente tienes la imagen completa.",
                        "Las CNNs hacen este proceso en reversa: desde píxeles hasta concepto."
                    ]
                }
            },
            {
                title: "Tareas Principales",
                text: [
                    "<strong>Clasificación de Imágenes:</strong> \"¿Qué hay en esta imagen?\" → \"Un gato\"",
                    "<strong>Detección de Objetos:</strong> \"¿Dónde están los objetos?\" → Cajas delimitadoras",
                    "<strong>Segmentación:</strong> \"¿Qué píxel pertenece a qué objeto?\" → Máscaras precisas",
                    "<strong>Reconocimiento Facial:</strong> Identificar personas específicas"
                ]
            },
        ],
        quiz: {
            question: "¿Qué detectan las primeras capas de una CNN?",
            options: [
                { text: "Objetos completos como perros o gatos", feedback: "Las primeras capas detectan patrones simples, no objetos completos." },
                { text: "Colores de la imagen", feedback: "Los colores son información de píxeles, pero las capas detectan patrones." },
                { text: "Bordes y líneas simples", feedback: "¡Exacto! Las primeras capas detectan características básicas como bordes y líneas." },
            ],
            correctIndex: 2
        }
    },
    {
        title: "IA Generativa",
        description: "Crea contenido original con IA. Desde generación de imágenes hasta el futuro de la creatividad artificial.",
        meta: ["⏱ 4-5 horas", "🎯 Nivel: Avanzado", "🎨 Objetivo: Generar"],
        icon: <Palette />,
        content: [
            {
                title: "¿Qué es IA Generativa?",
                text: [
                    "La <strong>IA Generativa</strong> crea contenido nuevo: imágenes, texto, música, código. No solo clasifica o predice: genera algo que nunca existió.",
                    "Diferencia clave: La IA discriminativa dice \"esto es un gato\", la IA generativa dice \"te voy a crear un gato que nunca existió\"."
                ]
            },
            {
                title: "Modelos Principales",
                text: [
                    "<strong>GANs (Generative Adversarial Networks):</strong> Dos redes compitiendo: un <strong>Generador</strong> que crea imágenes falsas, y un <strong>Discriminador</strong> que trata de detectarlas. Compiten hasta que el generador es tan bueno que el discriminador no puede diferenciar real de falso.",
                    "<strong>Diffusion Models (Modelos de Difusión):</strong> La tecnología detrás de DALL-E, Midjourney, Stable Diffusion. Aprenden a \"quitar ruido\" de imágenes: comienzan con ruido puro y gradualmente lo transforman en la imagen deseada.",
                    "<strong>Transformers:</strong> Arquitectura detrás de GPT, BERT, y modelos de lenguaje. Usan \"atención\" para entender relaciones entre elementos (palabras, píxeles)."
                ],
                interactiveBox: {
                    title: "💡 Analogía: Falsificador vs Detective",
                    text: [
                        "Imagina un falsificador (generador) creando billetes falsos, y un detective (discriminador) tratando de detectarlos. El falsificador mejora cada vez que lo atrapan, hasta que sus billetes son indistinguibles de los reales."
                    ]
                }
            }
        ],
        quiz: {
            question: "¿Cómo funcionan los GANs?",
            options: [
                { text: "Copian imágenes existentes de internet", feedback: "Los GANs no copian datos existentes, generan contenido nuevo." },
                { text: "Dos redes compiten: una genera, otra discrimina", feedback: "Correcto. Un generador crea, un discriminador evalúa, y compiten para mejorar." },
                { text: "Una sola red que aprende de ejemplos etiquetados", feedback: "Eso sería un modelo supervisado simple, no un GAN." }
            ],
            correctIndex: 1
        }
    },
    {
        title: "Redes Neuronales",
        description: "Mira dentro de la \"caja negra\". Entiende la arquitectura interna de los modelos de IA.",
        meta: ["⏱ 5-6 horas", "🎯 Nivel: Avanzado", "🔬 Objetivo: Construir"],
        icon: <FlaskConical />,
        content: [
            {
                title: "Anatomía de una Red Neuronal",
                text: [
                    "Una red neuronal artificial está inspirada (vagamente) en el cerebro humano. Está compuesta de:",
                ],
                list: [
                    "<strong>Neuronas:</strong> Unidades de procesamiento que reciben, procesan y transmiten información",
                    "<strong>Pesos (weights):</strong> Valores que determinan la importancia de cada conexión",
                    "<strong>Sesgos (bias):</strong> Valores que permiten ajustar la salida",
                    "<strong>Funciones de activación:</strong> Introducen no-linealidad (ReLU, sigmoid, tanh)"
                ],
                 interactiveBox: {
                    title: "🧠 El Perceptrón: La Neurona Más Simple",
                    codeBlock: `1. Recibe inputs (x1, x2, x3...)\n2. Multiplica cada input por su peso (w1, w2, w3...)\n3. Suma todo y añade el sesgo (bias)\n4. Aplica función de activación\n5. Produce output\n\nMatemáticamente: output = f(w1*x1 + w2*x2 + ... + b)`
                }
            },
            {
                title: "Entrenamiento: Backpropagation",
                text: ["El <strong>backpropagation</strong> es el algoritmo que permite a las redes aprender:"],
                list: [
                    "1. <strong>Forward pass:</strong> Datos pasan por la red, se genera predicción",
                    "2. <strong>Calcular error:</strong> Comparar predicción con respuesta correcta",
                    "3. <strong>Backward pass:</strong> Propagar el error de vuelta por la red",
                    "4. <strong>Ajustar pesos:</strong> Modificar pesos para reducir el error",
                    "5. <strong>Repetir:</strong> Miles de veces hasta que la red aprenda"
                ]
            }
        ],
        quiz: {
            question: "¿Qué hace el backpropagation?",
            options: [
                { text: "Pasa datos de entrada a salida", feedback: "Eso es el forward pass, no backpropagation." },
                { text: "Calcula el error de la predicción", feedback: "Eso es calcular el error, pero backprop hace más." },
                { text: "Propaga el error hacia atrás y ajusta los pesos", feedback: "Correcto. Backpropagation propaga el error hacia atrás y ajusta los pesos para reducirlo." }
            ],
            correctIndex: 2
        }
    },
    {
        title: "Ética e IA",
        description: "La responsabilidad de crear con IA. Sesgos, privacidad, impacto social y dilemas éticos.",
        meta: ["⏱ 3-4 horas", "🎯 Nivel: Crítico", "⚖️ Objetivo: Reflexionar"],
        icon: <Scale />,
        content: [
            {
                title: "¿Por qué importa la ética en IA?",
                text: [
                    "La IA no es neutral. Los modelos aprenden de datos creados por humanos, que reflejan nuestros sesgos, desigualdades y prejuicios. Si no somos cuidadosos, amplificamos problemas sistémicos.",
                    "Además, las decisiones de IA afectan vidas reales: empleos, acceso a crédito, justicia criminal, salud. No es solo código: es responsabilidad social."
                ]
            },
            {
                title: "Sesgos Algorítmicos",
                text: ["<strong>¿Qué son?</strong> Patrones discriminatorios que la IA aprende de datos sesgados."],
                interactiveBox: {
                    title: "📊 Casos Reales",
                    list: [
                        "<strong>Reconocimiento facial:</strong> Menor precisión en personas de piel oscura",
                        "<strong>Contratación:</strong> Amazon descartó un sistema que discriminaba mujeres",
                        "<strong>Justicia:</strong> Algoritmo COMPAS sesgado contra afroamericanos",
                        "<strong>Traducción:</strong> Google Translate asignaba géneros estereotipados"
                    ]
                }
            }
        ],
        quiz: {
            question: "¿Cuál es la fuente principal de sesgos en IA?",
            options: [
                { text: "Las máquinas son naturalmente sesgadas", feedback: "Las máquinas aprenden de datos, los sesgos vienen de ahí." },
                { text: "Errores de programación", feedback: "El código puede tener problemas, pero el sesgo viene principalmente de los datos." },
                { text: "Datos de entrenamiento que reflejan sesgos humanos", feedback: "Correcto. Los datos de entrenamiento reflejan sesgos históricos y sociales." }
            ],
            correctIndex: 2
        }
    }
];

const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const moduleImages = {
    "Fundamentos de IA": "hero-bg-neural-art",
    "IA Conversacional": "hero-bg-cosmic-digital",
    "Visión por Computador": "hero-bg-photography-lens",
    "IA Generativa": "hero-bg-digital-symphony",
    "Redes Neuronales": "hero-bg-neural-art",
    "Ética e IA": "hero-bg-synesthesia-senses"
};

const Quiz = ({ moduleIndex, quiz, onAnswer, isAnswered, onSelectOption, selectedOption }) => {
    return (
        <div className="mt-8 border-t-2 border-border pt-6">
            <h3 className="font-headline text-xl font-bold text-primary mb-4">{quiz.question}</h3>
            <RadioGroup onValueChange={(value) => onSelectOption(parseInt(value))} disabled={isAnswered} value={selectedOption !== null ? String(selectedOption) : ""}>
                {quiz.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === quiz.correctIndex;
                    return (
                        <Label key={i} htmlFor={`q-${moduleIndex}-${i}`} className={cn(
                            "flex items-start gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70",
                            isAnswered && isCorrect ? "border-green-500 bg-green-500/10" : "border-border",
                            isAnswered && isSelected && !isCorrect ? "border-destructive bg-destructive/10" : "",
                            !isAnswered && "hover:bg-muted/50 hover:border-primary/50"
                        )}>
                            <RadioGroupItem value={String(i)} id={`q-${moduleIndex}-${i}`} />
                            <div className="flex-1 space-y-2">
                                <span className="text-base font-mono">{option.text}</span>
                                {isAnswered && isSelected && (
                                    <p className={cn("text-sm font-mono", isCorrect ? "text-green-700 dark:text-green-400" : "text-destructive")}>{option.feedback}</p>
                                )}
                            </div>
                            {isAnswered && isSelected && (isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-destructive" />)}
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
    );
};


export default function JuegoIAPage() {
    const [view, setView] = useState('welcome');
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [completedModules, setCompletedModules] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem('labIA-progress');
        if (saved) {
            const data = JSON.parse(saved);
            setCurrentModuleIndex(data.currentModule || 0);
            setCompletedModules(data.completedModules || []);
        }
    }, []);

    const saveProgress = (modIndex, compModules) => {
        localStorage.setItem('labIA-progress', JSON.stringify({
            currentModule: modIndex,
            completedModules: compModules,
        }));
    };

    const startLab = () => {
        setView('module');
        setCurrentModuleIndex(0);
        setCompletedModules([]);
        setQuizAnswers({});
    };

    const handleSelectQuizOption = (optionIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [currentModuleIndex]: {
                selected: optionIndex,
                isCorrect: optionIndex === currentModule.quiz.correctIndex,
            }
        }));
    };

    const handleNextModule = () => {
        const newCompleted = [...new Set([...completedModules, currentModuleIndex])];
        setCompletedModules(newCompleted);

        if (currentModuleIndex < moduleData.length - 1) {
            const nextIndex = currentModuleIndex + 1;
            setCurrentModuleIndex(nextIndex);
            saveProgress(nextIndex, newCompleted);
        } else {
            setView('completion');
            saveProgress(currentModuleIndex, newCompleted);
        }
    };
    
    const handlePreviousModule = () => {
        if (currentModuleIndex > 0) {
            const prevIndex = currentModuleIndex - 1;
            setCurrentModuleIndex(prevIndex);
            saveProgress(prevIndex, completedModules);
        }
    };

    const returnToHome = () => {
        setView('welcome');
    };

    const progressPercentage = Math.round((completedModules.length / moduleData.length) * 100);
    const currentModule = moduleData[currentModuleIndex];
    const currentQuizAnswer = quizAnswers[currentModuleIndex];

    const achievementIcons = [<Brain key="b" />, <MessageSquare key="m" />, <Eye key="e" />, <Palette key="p" />, <FlaskConical key="f" />, <Scale key="s" />];
    
    const imageId = moduleImages[currentModule.title];
    const image = PlaceHolderImages.find(p => p.id === imageId);


    return (
        <div className="container py-12 md:py-24">
             <AnimatePresence mode="wait">
                {view === 'welcome' && (
                    <motion.div key="welcome" initial="hidden" animate="visible" exit="exit" variants={motionVariants} transition={{ duration: 0.3 }} className="text-center max-w-3xl mx-auto">
                        <Cpu size={80} className="text-primary mx-auto mb-8 animate-pulse" />
                        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-4">
                            <span className="block">LABORATORIO</span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">DE INTELIGENCIA ARTIFICIAL</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-mono mb-12">
                            Un recorrido inmersivo desde la herramienta hasta la conciencia crítica. Sistema de formación experiencial en IA.
                        </p>
                        <Button size="lg" onClick={startLab} className="font-mono text-lg px-12 py-8 rounded-none">
                            INICIAR LABORATORIO <ArrowRight className="ml-4" />
                        </Button>
                    </motion.div>
                )}

                {view === 'module' && (
                     <motion.div key="module" initial="hidden" animate="visible" exit="exit" variants={motionVariants} transition={{ duration: 0.3 }}>
                         <Card className="max-w-4xl mx-auto overflow-hidden">
                            <CardHeader className="!p-0 !border-b-0">
                                <div className="relative h-[24rem] w-full overflow-hidden flex flex-col justify-between text-white p-6">
                                    {image && (
                                        <Image 
                                            src={image.imageUrl} 
                                            alt={image.description} 
                                            fill 
                                            className="object-cover z-0"
                                            data-ai-hint={image.imageHint} 
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10"></div>
                                    
                                    <div className="relative z-20 w-full max-w-xs">
                                        <div className="font-mono text-xs text-white/70 uppercase tracking-wider mb-1">
                                            MÓDULO {currentModuleIndex + 1}/{moduleData.length} &nbsp;|&nbsp; PROGRESO: {progressPercentage}%
                                        </div>
                                        <Progress value={progressPercentage} className="h-1 bg-white/20" />
                                    </div>

                                    <div className="relative z-20 text-center">
                                        <div className="inline-block bg-black/30 p-3 text-primary mb-4 rounded-lg backdrop-blur-sm border border-primary/20">
                                            {React.cloneElement(currentModule.icon, { size: 32 })}
                                        </div>
                                        <h1 className="font-headline text-5xl md:text-7xl tracking-tighter text-white leading-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>{currentModule.title}</h1>
                                        <p className="mt-2 text-base lg:text-lg text-white/80 max-w-2xl mx-auto font-mono">{currentModule.description}</p>
                                    </div>
                                    
                                    <div className="relative z-20 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/80 font-mono backdrop-blur-sm bg-black/20 py-2 px-4 rounded-md w-fit mx-auto">
                                        {currentModule.meta.map((item, i) => {
                                            const iconMatch = item.match(/^(⏱|🎯|🧠|💬|👁|🎨|🔬|⚖️)/);
                                            const icon = iconMatch ? iconMatch[0] : null;
                                            const text = icon ? item.substring(icon.length).trim() : item;
                                            
                                            return (
                                                <span key={i} className="flex items-center gap-2">
                                                    {icon && <span className="text-lg">{icon}</span>}
                                                    <span>{text}</span>
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 divide-y-2 divide-border p-6 md:p-8">
                               {currentModule.content.map((section, i) => (
                                   <div key={i} className="py-6 first:pt-0 last:pb-0">
                                      <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-3">
                                        <Sparkles className="h-6 w-6" />
                                        {section.title}
                                      </h2>
                                      <div className="prose prose-lg prose-invert max-w-none font-mono text-muted-foreground space-y-4">
                                          {section.text?.map((p, j) => <p key={j} dangerouslySetInnerHTML={{ __html: p }} />)}
                                          {section.list && (
                                              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 !p-0 !m-0">
                                                  {section.list.map((item, j) => (
                                                      <li key={j} className="flex items-start gap-3 !p-0 !m-0">
                                                          <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                                          <span dangerouslySetInnerHTML={{ __html: item }} />
                                                      </li>
                                                  ))}
                                              </ul>
                                          )}
                                      </div>
                                       {section.interactiveBox && (
                                            <Alert variant="default" className="mt-6 border-dashed border-accent/40 bg-accent/10 text-base">
                                                <Lightbulb className="h-6 w-6 text-accent" />
                                                <AlertTitle className="font-bold text-accent text-lg">{section.interactiveBox.title}</AlertTitle>
                                                <AlertDescription className="prose prose-invert font-mono text-accent-foreground/80 mt-2" dangerouslySetInnerHTML={{ __html: section.interactiveBox.text?.join('<br/>') || '' }} />
                                                 {section.interactiveBox.codeBlock && <pre className="mt-4 bg-black/30 p-4 text-sm font-mono overflow-x-auto border border-foreground/20">{section.interactiveBox.codeBlock}</pre>}
                                                  {section.interactiveBox.list && <ul className="list-disc list-inside mt-2 space-y-1">{section.interactiveBox.list.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>}
                                            </Alert>
                                        )}
                                        {section.codeBlock && <pre className="mt-6 bg-black/50 p-4 text-sm font-mono overflow-x-auto border border-foreground/20">{section.codeBlock}</pre>}
                                   </div>
                               ))}
                               {currentModule.quiz && (
                                   <Quiz
                                        moduleIndex={currentModuleIndex}
                                        quiz={currentModule.quiz}
                                        onSelectOption={handleSelectQuizOption}
                                        isAnswered={currentQuizAnswer !== undefined}
                                        selectedOption={currentQuizAnswer?.selected}
                                   />
                               )}
                            </CardContent>
                             <CardFooter className="justify-between">
                                <Button variant="outline" onClick={handlePreviousModule} disabled={currentModuleIndex === 0}>
                                    <ArrowLeft className="mr-2" /> Anterior
                                </Button>
                                <Button onClick={handleNextModule} disabled={currentQuizAnswer === undefined}>
                                   {currentModuleIndex === moduleData.length - 1 ? 'Completar Laboratorio' : 'Siguiente Módulo'} <ArrowRight className="ml-2" />
                                </Button>
                            </CardFooter>
                         </Card>
                     </motion.div>
                )}

                {view === 'completion' && (
                    <motion.div key="completion" initial="hidden" animate="visible" exit="exit" variants={motionVariants} transition={{ duration: 0.3 }}>
                        <Card className="max-w-4xl mx-auto text-center">
                             <CardHeader>
                                <Trophy className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
                                <CardTitle className="font-headline text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-primary">
                                    ¡Laboratorio Completado!
                                </CardTitle>
                                <CardDescription className="text-lg !mt-4 max-w-2xl mx-auto">
                                     Has finalizado el recorrido. Ahora tienes las bases para trabajar con IA de manera crítica y responsable.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-headline text-2xl mb-6">Logros Desbloqueados</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    {moduleData.map((mod, i) => (
                                        <Card key={i} className="bg-muted/30 p-4 md:p-6 flex flex-col items-center justify-center gap-2">
                                            <div className="text-primary mb-2">{React.cloneElement(achievementIcons[i], { size: 40 })}</div>
                                            <p className="font-bold font-mono text-base md:text-lg text-center">{mod.meta[2].split(': ')[1]}</p>
                                            <p className="text-xs text-muted-foreground font-mono text-center">{mod.title}</p>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Button size="lg" onClick={returnToHome} className="font-mono px-8 py-6">Volver al Inicio</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

             </AnimatePresence>
        </div>
    );
}
