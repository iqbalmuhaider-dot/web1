import React, { useState, useEffect } from 'react';
import { Icons } from './ui/Icons';
import { initFirebase } from '../services/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onFontChange: (font: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentFont, onFontChange }) => {
  const [firebaseConfigStr, setFirebaseConfigStr] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedFb = localStorage.getItem('skmt_firebase_config');
      if (storedFb) setFirebaseConfigStr(storedFb);
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      if (firebaseConfigStr.trim()) {
        JSON.parse(firebaseConfigStr);
        localStorage.setItem('skmt_firebase_config', firebaseConfigStr);
        initFirebase();
      }
      
      setStatus('Disimpan! Sila refresh jika perlu.');
      setTimeout(() => {
        setStatus('');
        onClose();
      }, 1000);
    } catch (e) {
      setStatus('Ralat: Format JSON Firebase tidak sah.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icons.Sparkles className="text-primary" /> Tetapan Sistem
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Penampilan</h3>
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-gray-600">Jenis Font Utama</label>
               <select 
                 value={currentFont}
                 onChange={(e) => onFontChange(e.target.value)}
                 className="border rounded-lg p-2 w-full"
               >
                 <option value="sans">Sans Serif (Moderna)</option>
                 <option value="serif">Serif (Klasik/Formal)</option>
                 <option value="mono">Monospace (Teknikal)</option>
               </select>
            </div>
          </div>

          {/* Database Settings */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Pangkalan Data (Advanced)</h3>
            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-200 mb-2">
               Firebase digunakan untuk menyimpan data website anda.
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Firebase Config (JSON)</label>
            <textarea 
              rows={6}
              value={firebaseConfigStr}
              onChange={(e) => setFirebaseConfigStr(e.target.value)}
              placeholder='{"apiKey": "...", ...}'
              className="w-full border rounded-lg p-2 text-xs font-mono focus:ring-2 ring-primary outline-none"
            />
          </div>

          {status && (
            <div className={`p-2 rounded text-sm text-center ${status.includes('Ralat') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {status}
            </div>
          )}

          <button 
            onClick={handleSave}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};