import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ConnectiveLinesProps {
  width?: number;
  height?: number;
  nodeCount?: number;
  color?: 'purple' | 'yellow' | 'violet' | 'green';
  animated?: boolean;
  showDataFlow?: boolean;
  className?: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  connections: string[];
  isActive: boolean;
}

export const ConnectiveLines: React.FC<ConnectiveLinesProps> = ({
  width = 400,
  height = 300,
  nodeCount = 12,
  color = 'purple',
  animated = true,
  showDataFlow = true,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  const colorMap = {
    purple: {
      primary: '#9D4EDD',
      secondary: '#7B2CBF',
      accent: '#FEE440',
      glow: 'rgba(157, 78, 221, 0.3)'
    },
    yellow: {
      primary: '#FEE440',
      secondary: '#9D4EDD',
      accent: '#7B2CBF',
      glow: 'rgba(254, 228, 64, 0.3)'
    },
    violet: {
      primary: '#7B2CBF',
      secondary: '#9D4EDD',
      accent: '#FEE440',
      glow: 'rgba(123, 44, 191, 0.3)'
    },
    green: {
      primary: '#06FFA5',
      secondary: '#9D4EDD',
      accent: '#7B2CBF',
      glow: 'rgba(6, 255, 165, 0.3)'
    }
  };

  const colors = colorMap[color];

  // Generate nodes in a network pattern
  const generateNodes = (): Node[] => {
    const nodes: Node[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Create central hub
    nodes.push({
      id: 'center',
      x: centerX,
      y: centerY,
      connections: [],
      isActive: true
    });

    // Create layers around the center
    const layers = Math.ceil(Math.sqrt(nodeCount - 1));
    let nodeIndex = 1;

    for (let layer = 1; layer <= layers && nodeIndex < nodeCount; layer++) {
      const nodesInLayer = Math.min(6 * layer, nodeCount - nodeIndex);
      const radius = (layer * Math.min(width, height)) / (layers * 2.5);

      for (let i = 0; i < nodesInLayer && nodeIndex < nodeCount; i++) {
        const angle = (i * 2 * Math.PI) / nodesInLayer;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        nodes.push({
          id: `node-${nodeIndex}`,
          x,
          y,
          connections: [],
          isActive: Math.random() > 0.3
        });
        nodeIndex++;
      }
    }

    // Create connections
    nodes.forEach((node, index) => {
      if (node.id === 'center') {
        // Connect center to some random nodes
        const connectionCount = Math.min(4, nodes.length - 1);
        const availableNodes = nodes.slice(1);
        for (let i = 0; i < connectionCount; i++) {
          const randomIndex = Math.floor(Math.random() * availableNodes.length);
          node.connections.push(availableNodes[randomIndex].id);
        }
      } else {
        // Connect to nearby nodes
        const nearbyNodes = nodes.filter((otherNode, otherIndex) => {
          if (otherIndex === index || otherNode.id === node.id) return false;
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          return distance < 80;
        });

        const connectionCount = Math.min(3, nearbyNodes.length);
        for (let i = 0; i < connectionCount; i++) {
          const randomIndex = Math.floor(Math.random() * nearbyNodes.length);
          if (!node.connections.includes(nearbyNodes[randomIndex].id)) {
            node.connections.push(nearbyNodes[randomIndex].id);
          }
        }
      }
    });

    return nodes;
  };

  const [nodes] = React.useState(generateNodes);

  // Animation loop for data flow
  useEffect(() => {
    if (!animated || !showDataFlow) return;

    let time = 0;
    const animate = () => {
      time += 0.02;
      
      if (svgRef.current) {
        const dataParticles = svgRef.current.querySelectorAll('.data-particle');
        dataParticles.forEach((particle, index) => {
          const offset = (time + index * 0.5) % 1;
          const opacity = Math.sin(offset * Math.PI);
          (particle as SVGElement).style.opacity = opacity.toString();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated, showDataFlow]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.1
      }
    }
  };

  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const connectionVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 0.7,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      variants={animated ? containerVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id={`connection-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2"/>
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2"/>
          </linearGradient>
        </defs>

        {/* Connections */}
        <g className="connections">
          {nodes.map(node => 
            node.connections.map(connectionId => {
              const targetNode = nodes.find(n => n.id === connectionId);
              if (!targetNode) return null;

              const pathId = `path-${node.id}-${connectionId}`;
              
              return (
                <g key={`${node.id}-${connectionId}`}>
                  <motion.path
                    id={pathId}
                    d={`M ${node.x} ${node.y} Q ${(node.x + targetNode.x) / 2} ${(node.y + targetNode.y) / 2 - 20} ${targetNode.x} ${targetNode.y}`}
                    stroke={`url(#connection-gradient-${color})`}
                    strokeWidth="2"
                    fill="none"
                    filter={`url(#glow-${color})`}
                    variants={animated ? connectionVariants : undefined}
                    initial={animated ? "initial" : undefined}
                    animate={animated ? "animate" : undefined}
                  />
                  
                  {/* Data flow particles */}
                  {showDataFlow && (
                    <motion.circle
                      className="data-particle"
                      r="3"
                      fill={colors.accent}
                      filter={`url(#glow-${color})`}
                      initial={{ opacity: 0 }}
                      animate={animated ? {
                        opacity: [0, 1, 0],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }
                      } : { opacity: 0.7 }}
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${Math.random() * 3}s`}
                      >
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                    </motion.circle>
                  )}
                </g>
              );
            })
          )}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map(node => (
            <motion.g
              key={node.id}
              variants={animated ? nodeVariants : undefined}
              initial={animated ? "initial" : undefined}
              animate={animated ? "animate" : undefined}
            >
              {/* Node glow */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.id === 'center' ? 12 : 8}
                fill={colors.glow}
                animate={animated && node.isActive ? {
                  r: [node.id === 'center' ? 12 : 8, node.id === 'center' ? 18 : 12, node.id === 'center' ? 12 : 8],
                  opacity: [0.3, 0.7, 0.3],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }
                } : undefined}
              />
              
              {/* Main node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.id === 'center' ? 8 : 5}
                fill={node.id === 'center' ? colors.accent : colors.primary}
                stroke={node.id === 'center' ? colors.primary : colors.secondary}
                strokeWidth="2"
                filter={`url(#glow-${color})`}
                className="cursor-pointer"
                whileHover={{ scale: 1.3 }}
                animate={animated && node.isActive ? {
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }
                } : undefined}
              />
              
              {/* Node pulse ring */}
              {node.isActive && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.id === 'center' ? 8 : 5}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="1"
                  opacity="0"
                  animate={animated ? {
                    r: [node.id === 'center' ? 8 : 5, node.id === 'center' ? 25 : 20],
                    opacity: [0.8, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeOut"
                    }
                  } : undefined}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* Central energy burst */}
        {animated && (
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r="0"
            fill="none"
            stroke={colors.accent}
            strokeWidth="3"
            opacity="0"
            animate={{
              r: [0, 100],
              opacity: [1, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                delay: 5,
                ease: "easeOut"
              }
            }}
          />
        )}
      </svg>

      {/* Network stats overlay */}
      <div className="absolute top-2 right-2 text-xs text-gray-500 font-roboto-mono">
        <div>Nodos: {nodes.length}</div>
        <div>Activos: {nodes.filter(n => n.isActive).length}</div>
        <div>Conexiones: {nodes.reduce((sum, node) => sum + node.connections.length, 0)}</div>
      </div>
    </motion.div>
  );
};
