import React, { useState } from 'react';
import { LearnerProfile } from '../types/induction';
import { SENA_REGIONALES, POPULAR_PROGRAMS } from '../data/senaData';
import { X, UserCheck, Shield, BookMarked, MapPin, Hash, Sparkles } from 'lucide-react';

interface LearnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  learner: LearnerProfile;
  onSave: (updated: LearnerProfile) => void;
}

export const LearnerProfileModal: React.FC<LearnerProfileModalProps> = ({
  isOpen,
  onClose,
  learner,
  onSave
}) => {
  const [formData, setFormData] = useState<LearnerProfile>(learner);
  const [isCustomProgram, setIsCustomProgram] = useState(
    !POPULAR_PROGRAMS.includes(learner.formationProgram)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.documentNumber.trim()) {
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-[#39A900] to-teal-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <UserCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ficha de Caracterización del Aprendiz</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Datos oficiales para la evaluación formativa y emisión del Certificado de Inducción
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nombres y Apellidos Completos *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Carlos Eduardo Ramírez Peña"
                className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Document Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tipo Doc. *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value as LearnerProfile['documentType'] })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
              >
                <option value="CC">C.C. (Cédula de Ciudadanía)</option>
                <option value="TI">T.I. (Tarjeta de Identidad)</option>
                <option value="PPT">P.P.T. (Permiso por Protección)</option>
                <option value="CE">C.E. (Cédula de Extranjería)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Número de Documento *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  placeholder="Ej. 1020304050"
                  className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Program & Ficha Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Programa de Formación *
              </label>
              <button
                type="button"
                onClick={() => setIsCustomProgram(!isCustomProgram)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium underline"
              >
                {isCustomProgram ? 'Elegir de la lista frecuente' : 'Escribir otro programa'}
              </button>
            </div>

            {isCustomProgram ? (
              <input
                type="text"
                required
                value={formData.formationProgram}
                onChange={(e) => setFormData({ ...formData, formationProgram: e.target.value })}
                placeholder="Ej. Tecnólogo en Gestión de la Producción Industrial"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
              />
            ) : (
              <select
                value={formData.formationProgram}
                onChange={(e) => setFormData({ ...formData, formationProgram: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
              >
                {POPULAR_PROGRAMS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Ficha Number & Regional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Número de Ficha *
              </label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="Ej. 2904512"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Regional SENA *
              </label>
              <select
                value={formData.regional}
                onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
              >
                {SENA_REGIONALES.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Training Center */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Centro de Formación *
            </label>
            <input
              type="text"
              required
              value={formData.trainingCenter}
              onChange={(e) => setFormData({ ...formData, trainingCenter: e.target.value })}
              placeholder="Ej. Centro de Servicios Financieros / Centro Metalmecánico"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-800 dark:text-white transition-colors"
            />
          </div>

          {/* Info note */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Estos datos se plasmarán en el <strong>Certificado Digital Oficial de Inducción</strong> y pueden almacenarse automáticamente en la <strong>Hoja de Cálculo de Google Sheets</strong> alojada en tu Google Drive para el control institucional de la ficha.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Guardar Ficha del Aprendiz</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
