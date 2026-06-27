import { useState } from 'react';
import { ChevronRight, ChevronDown, GitCommit, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MindMapNode, StudyProfile } from '../types';

interface MindMapProps {
  mindMapData: {
    academic_en: MindMapNode;
    esl_en: MindMapNode;
    translated_es: MindMapNode;
    translated_id: MindMapNode;
  };
  activeProfile: StudyProfile;
}

function MindMapNodeView({ node, depth = 0 }: { node: MindMapNode; depth: number; key?: number | string }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4 md:ml-6 relative">
      {/* Decorative connecting lines */}
      {depth > 0 && (
        <div className="absolute -left-4 top-0 bottom-0 w-px bg-indigo-900/40" />
      )}
      {depth > 0 && (
        <div className="absolute -left-4 top-4.5 w-4 h-px bg-indigo-900/40" />
      )}

      <div className="flex items-start gap-2 py-1.5">
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mt-0.5 p-1 rounded hover:bg-neutral-800 text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-600 flex-shrink-0 relative -left-1" />
        )}

        <div
          onClick={() => hasChildren && setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs md:text-sm transition-all duration-200 select-none ${
            hasChildren
              ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200 font-medium hover:border-indigo-500/30 cursor-pointer'
              : 'bg-neutral-900/40 border-neutral-800/40 text-neutral-300'
          }`}
        >
          {hasChildren && <GitCommit size={12} className="text-indigo-500" />}
          <span>{node.label}</span>
          {hasChildren && (
            <span className="text-[10px] text-indigo-400/80 px-1.5 py-0.2 bg-indigo-950/40 rounded-full border border-indigo-900/30 font-mono">
              {node.children?.length} nodes
            </span>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pl-2 border-l border-indigo-900/20 my-1">
              {node.children?.map((childNode, index) => (
                <MindMapNodeView key={index} node={childNode} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MindMap({ mindMapData, activeProfile }: MindMapProps) {
  const rootNode = mindMapData[activeProfile] || mindMapData['academic_en'];

  return (
    <div id="mindmap-container" className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
        <h3 className="font-serif text-lg text-indigo-200 flex items-center gap-2">
          <Network size={18} className="text-indigo-400" />
          Interactive Text Mind Map
        </h3>
        <span className="text-xs font-mono text-neutral-400">Expand and collapse notes</span>
      </div>

      <div className="bg-neutral-900/20 rounded-xl p-4 md:p-6 border border-neutral-800/40 overflow-x-auto">
        <MindMapNodeView node={rootNode} depth={0} />
      </div>
    </div>
  );
}
