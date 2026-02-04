import React, { useState } from 'react';
import { Icons } from '../ui/Icons';
import { BlockType, Page } from '../../types';

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
  pages: Page[];
  activePageId: string;
  onSwitchPage: (id: string) => void;
  onAddPage: (name: string, parentId?: string) => void;
  onDeletePage: (id: string) => void;
  onMovePage: (id: string, direction: 'up' | 'down') => void;
  onTogglePage: (id: string) => void;
}

const PageItem: React.FC<{
  page: Page;
  depth: number;
  activePageId: string;
  onSwitchPage: (id: string) => void;
  onTogglePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onMovePage: (id: string, direction: 'up' | 'down') => void;
  onSetTargetParent: (id: string) => void;
}> = ({ page, depth, activePageId, onSwitchPage, onTogglePage, onDeletePage, onMovePage, onSetTargetParent }) => {
  const isActive = activePageId === page.id;
  const hasChildren = page.subPages && page.subPages.length > 0;
  const isExpanded = page.isOpen;

  return (
    <div className="select-none">
      <div 
        onClick={() => onSwitchPage(page.id)}
        className={`group flex items-center justify-between p-2 pr-1 rounded-xl mb-1 cursor-pointer transition-all border ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100' : 'hover:bg-gray-50 border-transparent'}`}
        style={{ marginLeft: `${depth * 12}px` }}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              onTogglePage(page.id); 
            }}
            className={`p-1 rounded-lg hover:bg-white text-gray-400 shadow-sm border border-transparent hover:border-gray-100 ${hasChildren ? 'visible' : 'invisible'}`}
          >
            {isExpanded ? <Icons.ArrowDown size={10} /> : <Icons.ArrowUp size={10} className="rotate-90" />}
          </button>

          <Icons.Globe size={14} className={isActive ? 'text-primary' : 'text-gray-400'} />
          <div className="truncate">
            <span className={`block text-xs font-bold ${isActive ? 'text-primary' : 'text-gray-600'}`}>
              {page.name}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSetTargetParent(page.id); }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
            title="Tambah Sub-halaman"
          >
            <Icons.Plus size={12} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMovePage(page.id, 'up'); }}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"
          >
            <Icons.ArrowUp size={12} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeletePage(page.id); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Padam Halaman"
          >
            <Icons.Trash2 size={12} />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l-2 border-blue-50 ml-3.5 pl-1.5 my-1">
           {page.subPages!.map(sub => (
             <PageItem key={sub.id} page={sub} depth={depth + 1} activePageId={activePageId} onSwitchPage={onSwitchPage} onTogglePage={onTogglePage} onDeletePage={onDeletePage} onMovePage={onMovePage} onSetTargetParent={onSetTargetParent} />
           ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ onAddBlock, pages, activePageId, onSwitchPage, onAddPage, onDeletePage, onMovePage, onTogglePage }) => {
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('components');
  const [newPageName, setNewPageName] = useState('');
  const [targetParentId, setTargetParentId] = useState<string | null>(null);

  const tools = [
    { type: 'title', icon: 'Type', label: 'Tajuk (Title)', desc: 'Tajuk Seksyen' },
    { type: 'hero', icon: 'Layout', label: 'Hero Banner', desc: 'Gambar utama & tajuk' },
    { type: 'navbar', icon: 'AlignJustify', label: 'Menu Navigasi', desc: 'Bar menu pautan' },
    { type: 'history', icon: 'Book', label: 'Sejarah', desc: 'Teks Sejarah Sekolah' },
    { type: 'audio', icon: 'Music', label: 'Muzik / Audio', desc: 'Pemain Lagu MP3' },
    { type: 'ticker', icon: 'Activity', label: 'Info Ticker', desc: 'Teks bergerak' },
    { type: 'content', icon: 'Type', label: 'Teks & Artikel', desc: 'Perenggan maklumat' },
    { type: 'image', icon: 'Image', label: 'Gambar', desc: 'Satu gambar besar' },
    { type: 'gallery', icon: 'Image', label: 'Galeri Foto', desc: 'Grid gambar-gambar' },
    { type: 'feature', icon: 'Link', label: 'Pautan/Ciri', desc: 'Grid Pautan/Ikon' },
    { type: 'news', icon: 'Newspaper', label: 'Info Terkini', desc: 'Berita & Tag Unit' },
    { type: 'time', icon: 'Clock', label: 'Jam Digital', desc: 'Waktu & Tarikh' },
    { type: 'calendar', icon: 'Calendar', label: 'Takwim', desc: 'Senarai Acara' },
    { type: 'visitor', icon: 'Eye', label: 'Pelawat', desc: 'Kaunter Pelawat' },
    { type: 'stats', icon: 'BarChart', label: 'Dashboard', desc: 'Statistik Guru/Murid' },
    { type: 'orgChart', icon: 'Users', label: 'Carta Organisasi', desc: 'Senarai AJK/Guru' },
    { type: 'staffGrid', icon: 'Grid', label: 'Grid Staf', desc: 'Galeri Gambar Guru' },
    { type: 'definition', icon: 'Flag', label: 'Maksud/Definisi', desc: 'Logo, Bendera dll' },
    { type: 'speech', icon: 'MessageSquare', label: 'Sekapur Sirih', desc: 'Ucapan Guru Besar' },
    { type: 'divider', icon: 'Link', label: 'Divider (Garis)', desc: 'Pemisah Melintang' },
    { type: 'spacer', icon: 'Layout', label: 'Spacer (Ruang)', desc: 'Ruang Kosong Mendatar' },
    { type: 'countdown', icon: 'Timer', label: 'Kiraan Detik', desc: 'Menuju hari penting' },
    { type: 'downloads', icon: 'Download', label: 'Muat Turun', desc: 'Fail & Borang' },
    { type: 'faq', icon: 'HelpCircle', label: 'Soalan Lazim', desc: 'Soal Jawab (FAQ)' },
    { type: 'cta', icon: 'Megaphone', label: 'Call to Action', desc: 'Pautan Utama' },
    { type: 'notice', icon: 'StickyNote', label: 'Papan Kenyataan', desc: 'Nota lekat ringkas' },
    { type: 'table', icon: 'Table', label: 'Jadual', desc: 'Jadual ringkas' },
    { type: 'testimonial', icon: 'MessageSquare', label: 'Testimoni', desc: 'Kata Alumni' },
    { type: 'linkList', icon: 'List', label: 'Senarai Link', desc: 'Pautan Teks' },
    { type: 'video', icon: 'Video', label: 'YouTube', desc: 'Embed video sekolah' },
    { type: 'drive', icon: 'Drive', label: 'Google Drive', desc: 'Dokumen/PDF Embed' },
    { type: 'contact', icon: 'MapPin', label: 'Hubungi Kami', desc: 'Alamat & Peta' },
    { type: 'html', icon: 'Code', label: 'HTML Custom', desc: 'Widget Facebook dll' },
    { type: 'footer', icon: 'ArrowDown', label: 'Footer', desc: 'Hakcipta sekolah' },
  ];

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim()) {
      onAddPage(newPageName, targetParentId || undefined);
      setNewPageName('');
      setTargetParentId(null);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col shadow-xl z-20 overflow-hidden">
      <div className="flex p-2 bg-gray-50/50 border-b border-gray-100">
        <button onClick={() => setActiveTab('components')} className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'components' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Icons.Layout size={14} /> Widget
        </button>
        <button onClick={() => setActiveTab('pages')} className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'pages' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Icons.Globe size={14} /> Halaman
        </button>
      </div>

      {activeTab === 'components' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white no-scrollbar">
          {tools.map((tool) => (
            <button key={tool.type} onClick={() => onAddBlock(tool.type as BlockType)} className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-50 bg-white hover:border-primary/30 hover:shadow-md transition-all group text-left">
              <div className="bg-blue-50 p-2.5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {React.createElement((Icons as any)[tool.icon] || Icons.Sparkles, { size: 18 })}
              </div>
              <div className="overflow-hidden">
                <span className="block font-bold text-gray-700 text-xs truncate uppercase tracking-wider">{tool.label}</span>
                <span className="block text-[10px] text-gray-400 truncate">{tool.desc}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
           <div className="p-4 border-b border-gray-100">
             <form onSubmit={handleCreatePage} className="space-y-2">
               {targetParentId && (
                 <div className="flex justify-between items-center text-[10px] font-bold text-primary bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100">
                   <span>Tambah Sub-page</span>
                   <button type="button" onClick={() => setTargetParentId(null)}><Icons.X size={10} /></button>
                 </div>
               )}
               <div className="flex gap-2">
                  <input type="text" value={newPageName} onChange={(e) => setNewPageName(e.target.value)} placeholder="Nama halaman..." className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary transition-all" />
                  <button type="submit" disabled={!newPageName.trim()} className="bg-primary text-white p-2 rounded-xl hover:bg-blue-700 shadow-md"><Icons.Plus size={16} /></button>
               </div>
             </form>
           </div>
           <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
             {pages.map(page => (
               <PageItem key={page.id} page={page} depth={0} activePageId={activePageId} onSwitchPage={onSwitchPage} onTogglePage={onTogglePage} onDeletePage={onDeletePage} onMovePage={onMovePage} onSetTargetParent={setTargetParentId} />
             ))}
           </div>
        </div>
      )}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center"></div>
    </div>
  );
};