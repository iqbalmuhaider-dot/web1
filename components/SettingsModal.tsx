import React, { useState, useEffect } from 'react';
import { Icons } from './ui/Icons';
import { initFirebase } from '../services/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onFontChange: (font: string) => void;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (color: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, currentFont, onFontChange,
  primaryColor, onPrimaryColorChange, secondaryColor, onSecondaryColorChange
}) => {
  const [firebaseConfigStr, setFirebaseConfigStr] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'theme' | 'system'>('theme');

  useEffect(() => {
    if (isOpen) {
      const storedFb = localStorage.getItem('skmt_firebase_config');
      if (storedFb) setFirebaseConfigStr(storedFb);
    }
  }, [isOpen]);

  const handleSaveConfig = () => {
    try {
      if (firebaseConfigStr.trim()) {
        JSON.parse(firebaseConfigStr);
        localStorage.setItem('skmt_firebase_config', firebaseConfigStr);
        initFirebase();
      }
      
      setStatus('Disimpan! Sila refresh jika perlu.');
      setTimeout(() => {
        setStatus('');
      }, 2000);
    } catch (e) {
      setStatus('Ralat: Format JSON Firebase tidak sah.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Icons.Settings className="text-primary" /> Tetapan
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"><Icons.X /></button>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'theme' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Tema & Warna
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${activeTab === 'system' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Pangkalan Data
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'theme' ? (
            <div className="space-y-8">
              {/* Fonts */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Jenis Tulisan (Font)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'sans', label: 'Moderna', font: 'font-sans' },
                    { val: 'serif', label: 'Klasik', font: 'font-serif' },
                    { val: 'mono', label: 'Teknikal', font: 'font-mono' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => onFontChange(opt.val)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${currentFont === opt.val ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      <span className={`block text-lg ${opt.font} mb-1`}>Ag</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Warna Tema</label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-gray-700">Warna Utama (Primary)</span>
                       <span className="text-xs text-gray-500">Warna dominan untuk butang, header & highlight.</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{primaryColor}</span>
                       <input 
                         type="color" 
                         value={primaryColor}
                         onChange={(e) => onPrimaryColorChange(e.target.value)}
                         className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
                       />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-gray-700">Warna Kedua (Secondary)</span>
                       <span className="text-xs text-gray-500">Warna aksen untuk elemen hiasan.</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{secondaryColor}</span>
                       <input 
                         type="color" 
                         value={secondaryColor}
                         onChange={(e) => onSecondaryColorChange(e.target.value)}
                         className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
                       />
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-xs flex gap-3 items-start">
                <Icons.Info size={16} className="shrink-0 mt-0.5" />
                <p>Perubahan tema dipaparkan secara langsung. Jangan lupa tekan butang <b>Simpan</b> di bahagian atas laman untuk mengekalkan perubahan.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-xs border border-yellow-200">
                 <h4 className="font-bold mb-1 flex items-center gap-2"><Icons.AlertTriangle size={14}/> Zon Teknikal</h4>
                 Ruangan ini adalah untuk konfigurasi sambungan ke Firebase. Hanya ubah jika anda tahu apa yang anda lakukan.
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Firebase Configuration (JSON)</label>
                <textarea 
                  rows={8}
                  value={firebaseConfigStr}
                  onChange={(e) => setFirebaseConfigStr(e.target.value)}
                  placeholder='{"apiKey": "...", ...}'
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs font-mono focus:ring-2 ring-primary focus:border-primary outline-none"
                />
              </div>

              {status && (
                <div className={`p-3 rounded-xl text-sm font-bold text-center ${status.includes('Ralat') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {status}
                </div>
              )}

              <button 
                onClick={handleSaveConfig}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Icons.Save size={16} /> Simpan Konfigurasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};