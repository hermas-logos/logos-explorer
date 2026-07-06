import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Compass, Map } from 'lucide-react';
import ep04MindMap from '../data/mindmaps/ep04-mindmap.json'; // Loads coordinates automatically

interface Node {
  id: string;
  type?: string;
  data: {
    label: string;
    description: string;
    reference?: string;
  };
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

export function MindMapGraph() {
  const [nodes] = useState<Node[]>(ep04MindMap.nodes);
  const [edges] = useState<Edge[]>(ep04MindMap.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Canvas Pan & Zoom States
  const [pan, setPan] = useState({ x: 180, y: 220 });
  const [zoom, setZoom] = useState(0.75);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-select root node at start
  useEffect(() => {
    const root = ep04MindMap.nodes.find(n => n.id === 'root');
    if (root) setSelectedNode(root);
  }, []);

  // Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.node-element')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile viewport pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('.node-element')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const recenterMap = () => {
    setPan({ x: 180, y: 220 });
    setZoom(0.75);
    const root = ep04MindMap.nodes.find(n => n.id === 'root');
    if (root) setSelectedNode(root);
  };

  return (
    <div className="relative w-full h-full bg-[#040301] text-stone-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Interactive Drag Canvas */}
      <div 
        ref={containerRef}
        className={`flex-1 w-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        
        {/* Dynamic SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {edges.map((edge) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);

              if (!sourceNode || !targetNode) return null;

              const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={isHighlighted ? '#f59e0b' : '#331b07'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={edge.animated ? '5,5' : undefined}
                  />
                  {edge.label && (
                    <text
                      x={(sourceNode.position.x + targetNode.position.x) / 2}
                      y={(sourceNode.position.y + targetNode.position.y) / 2 - 8}
                      fill="#d97706"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic HTML Coordinate Nodes */}
        <div 
          className="absolute inset-0 pointer-events-none origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {nodes.map((node) => {
            const isRoot = node.id === 'root';
            const isSelected = selectedNode?.id === node.id;
            
            let nodeStyle = "bg-[#0f0904] border-amber-950/80 text-amber-100 hover:border-amber-500/40";
            if (isRoot) {
              nodeStyle = "bg-amber-500 text-stone-950 border-amber-400 font-serif font-bold shadow-lg shadow-amber-500/10";
            } else if (isSelected) {
              nodeStyle = "bg-amber-950/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/30";
            }

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`node-element absolute pointer-events-auto px-4 py-2.5 rounded-xl border text-xs leading-none tracking-wide text-center transition-all duration-300 flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 ${nodeStyle}`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                }}
              >
                <span>{node.data.label}</span>
                {node.data.reference && !isRoot && (
                  <span className={`text-[8px] uppercase tracking-wider ${isSelected ? 'text-amber-400' : 'text-stone-500'}`}>
                    {node.data.reference}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation and Zoom HUD */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 pointer-events-auto z-10">
        <button
          onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={recenterMap}
          className="p-2 rounded-lg bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 transition-colors shadow-lg"
          title="Recenter Map"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Node Details Drawer (Mobile Aligned) */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/95 border border-amber-950/20 shadow-2xl backdrop-blur-md animate-slideUp pointer-events-auto z-10 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-amber-500 font-extrabold flex items-center gap-1">
              <Map className="w-3.5 h-3.5 text-amber-400" /> Concept Node {selectedNode.data.reference ? `• ${selectedNode.data.reference}` : ''}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-stone-500 hover:text-stone-300 text-xs font-bold font-mono px-1"
            >
              &times;
            </button>
          </div>
          <h4 className="text-sm font-bold font-serif text-stone-100">{selectedNode.data.label}</h4>
          <p className="text-xs text-stone-300 leading-relaxed">{selectedNode.data.description}</p>
        </div>
      )}
    </div>
  );
}