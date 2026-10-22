import React, { useState, useMemo } from 'react';
import { SENA_GLOSSARY } from '../data/senaData';
import { Search, X, BookOpen, BookmarkCheck, Lightbulb, Filter } from 'lucide-react';

interface RegulationsSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationsSearch: React.FC<RegulationsSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('todos');

  const chapters = useMemo(() => {
    const list = Array.from(new Set(SENA_GLOSSARY.map((item) => item.chapter)));
    return ['todos', ...list];
  }, []);

  const filteredItems = useMemo(() => {
    return SENA_GLOSSARY.filter((item) => {
      const matchQuery =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.practicalExample.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchChapter =
        selectedChapter === 'todos' || item.chapter === selectedChapter;

      return matchQuery && matchChapter;
    });
  }, [searchTerm, selectedChapter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
              Acuerdo 007 de 2012
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Consultor del Reglamento & Glosario SENA</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Encuentra definiciones, deberes, derechos, faltas y conceptos clave del reglamento del aprendiz.
          </p>

          {/* Search Box */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por término: debido proceso, contrato de aprendizaje, deserción..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs transition-colors">
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Capítulos:</span>
          </span>
          {chapters.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedChapter === ch
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {ch === 'todos' ? 'Todos los capítulos' : ch}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No encontramos coincidencias</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Intenta buscar términos como &ldquo;derecho&rdquo;, &ldquo;sanción&rdquo;, &ldquo;etapa productiva&rdquo; o &ldquo;comité&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 bg-white dark:bg-slate-800/60 hover:shadow-sm transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{item.term}</span>
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                    {item.chapter}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-start gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold">En la práctica:</strong> {item.practicalExample}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end transition-colors">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors"
          >
            Entendido, volver a la inducción
          </button>
        </div>

      </div>
    </div>
  );
};
