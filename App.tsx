import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WebsiteData, SectionBlock, BlockType, Page, BlockWidth, BlockPadding, BlockStyle } from './types';
import { INITIAL_DATA } from './constants';
import { Sidebar } from './components/editor/Sidebar';
import { BlockRenderer } from './components/blocks/Renderer';
import { BlockWrapper } from './components/blocks/BlockWrapper';
import { Icons } from './components/ui/Icons';
import { 
  saveWebsiteData, 
  loadWebsiteData, 
  loginWithGoogle, 
  logoutUser, 
  subscribeToAuth 
} from './services/firebase';
import { SettingsModal } from './components/SettingsModal';

// --- HELPER FUNCTIONS FOR TREE MANIPULATION ---

const findPageRecursive = (pages: Page[], id: string): Page | null => {
  for (const page of pages) {
    if (page.id === id) return page;
    if (page.subPages) {
      const found = findPageRecursive(page.subPages, id);
      if (found) return found;
    }
  }
  return null;
};

const isParentOf = (page: Page, targetId: string): boolean => {
  if (!page.subPages) return false;
  for (const sub of page.subPages) {
    if (sub.id === targetId) return true;
    if (isParentOf(sub, targetId)) return true;
  }
  return false;
};

const updatePageRecursive = (pages: Page[], id: string, updateFn: (p: Page) => Page): Page[] => {
  return pages.map(page => {
    if (page.id === id) return updateFn(page);
    if (page.subPages) return { ...page, subPages: updatePageRecursive(page.subPages, id, updateFn) };
    return page;
  });
};

const deletePageRecursive = (pages: Page[], id: string): Page[] => {
  return pages
    .filter(p => p.id !== id)
    .map(p => ({
      ...p,
      subPages: p.subPages ? deletePageRecursive(p.subPages, id) : []
    }));
};

const addSubPageRecursive = (pages: Page[], parentId: string, newPage: Page): Page[] => {
  return pages.map(page => {
    if (page.id === parentId) {
      return { 
        ...page, 
        subPages: [...(page.subPages || []), newPage],
        isOpen: true 
      };
    }
    if (page.subPages) return { ...page, subPages: addSubPageRecursive(page.subPages, parentId, newPage) };
    return page;
  });
};

const movePageRecursive = (pages: Page[], id: string, direction: 'up' | 'down'): { newPages: Page[], success: boolean } => {
  const index = pages.findIndex(p => p.id === id);
  if (index !== -1) {
    const newArr = [...pages];
    if (direction === 'up' && index > 0) {
      [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
      return { newPages: newArr, success: true };
    }
    if (direction === 'down' && index < newArr.length - 1) {
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return { newPages: newArr, success: true };
    }
    return { newPages: pages, success: false };
  }

  let handled = false;
  const nextPages = pages.map(page => {
    if (page.subPages && !handled) {
      const result = movePageRecursive(page.subPages, id, direction);
      if (result.success) {
        handled = true;
        return { ...page, subPages: result.newPages };
      }
    }
    return page;
  });
  return { newPages: nextPages, success: handled };
};

// --- NAV ITEM COMPONENT ---
interface NavItemProps {
  page: Page;
  activePageId: string;
  onSwitchPage: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ page, activePageId, onSwitchPage }) => {
  const hasChildren = page.subPages && page.subPages.length > 0;
  const isActive = activePageId === page.id;
  const isChildActive = isParentOf(page, activePageId);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0 z-50" ref={containerRef}>
      <button 
         onClick={() => hasChildren ? setIsOpen(!isOpen) : onSwitchPage(page.id)}
         className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 border border-transparent whitespace-nowrap select-none ${
           isActive || (isOpen && hasChildren)
             ? 'bg-primary text-white shadow-lg' 
             : isChildActive 
               ? 'text-primary bg-blue-50 border-blue-100 font-semibold' 
               : 'text-gray-600 hover:text-primary hover:bg-gray-50'
         }`}
      >
        <span className="font-medium text-sm">{page.name}</span>
        {hasChildren && <Icons.ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} />}
      </button>

      {/* Modern Dropdown Panel */}
      {hasChildren && isOpen && (
         <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-[100] overflow-visible">
            {page.subPages!.map(sub => (
               <button 
                  key={sub.id}
                  onClick={() => { onSwitchPage(sub.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 last:border-0 ${activePageId === sub.id ? 'text-primary font-bold' : 'text-gray-700'}`}
               >
                  <div className={`w-1.5 h-1.5 rounded-full ${activePageId === sub.id ? 'bg-primary' : 'bg-gray-300'}`} />
                  {sub.name}
               </button>
            ))}
         </div>
      )}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<WebsiteData>(INITIAL_DATA);
  const [isPreview, setIsPreview] = useState(true);
  const [activePageId, setActivePageId] = useState<string>(INITIAL_DATA.pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Menu State

  useEffect(() => {
    if (data.primaryColor) document.documentElement.style.setProperty('--color-primary', data.primaryColor);
    if (data.secondaryColor) document.documentElement.style.setProperty('--color-secondary', data.secondaryColor);
  }, [data.primaryColor, data.secondaryColor]);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const savedData = await loadWebsiteData();
      if (savedData) {
        setData(prev => ({
          ...savedData,
          primaryColor: savedData.primaryColor || prev.primaryColor,
          secondaryColor: savedData.secondaryColor || prev.secondaryColor,
        }));
        if (!findPageRecursive(savedData.pages, activePageId)) {
          setActivePageId(savedData.pages[0]?.id || 'utama');
        }
      }
      const unsubscribe = subscribeToAuth((currentUser) => {
        if (!user) setUser(currentUser);
        if (!currentUser && !user) setIsPreview(true);
        setIsLoading(false);
      });
      return () => unsubscribe();
    };
    initData();
  }, []);

  const activePage = findPageRecursive(data.pages, activePageId) || data.pages[0];
  const hasSubPages = activePage.subPages && activePage.subPages.length > 0;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await saveWebsiteData(data);
    setIsSaving(false);
  };

  const handleAdminLogin = async () => {
    if (user) {
      if (window.confirm("Adakah anda ingin log keluar?")) {
        await logoutUser();
        setUser(null);
        setIsPreview(true);
      }
    } else {
      const password = window.prompt("Masukkan Kata Laluan Admin:");
      if (password === "admin123") {
        setUser({ uid: 'admin-local', email: 'admin@skmt.edu.my', displayName: 'Admin SKMT' } as any);
        setIsPreview(false);
      } else if (password === "" || password === null) {
        await loginWithGoogle();
      } else {
        alert("Kata laluan salah.");
      }
    }
  };

  const addBlock = (type: BlockType) => {
    if (hasSubPages) {
      alert("Halaman ini adalah direktori (mengandungi sub-halaman).");
      return;
    }

    const id = uuidv4();
    // DEFINE DEFAULTS FOR ALL BLOCK TYPES TO PREVENT CRASHES
    const defaults: any = {
       hero: { type: 'hero', data: { title: "Tajuk Baru", subtitle: "Subtajuk", bgImage: "https://picsum.photos/1920/1080", fontSize: 'md', height: 500 }, width: 'w-full' },
       title: { type: 'title', data: { text: "Tajuk Seksyen", alignment: 'center', fontSize: '2xl', url: '' }, width: 'w-full' },
       navbar: { type: 'navbar', data: { style: 'light', alignment: 'center' }, width: 'w-full' },
       history: { type: 'history', data: { title: "Sejarah Sekolah", body: "Ditubuhkan pada tahun..." }, width: 'w-full' },
       audio: { type: 'audio', data: { title: "Lagu Sekolah", audioUrl: "", autoPlay: false }, width: 'w-full' },
       feature: { type: 'feature', data: { title: "Ciri-Ciri", features: [{ title: "Ciri 1", description: "Deskripsi", icon: "Star" }], fontSize: 'md' }, width: 'w-full' },
       content: { type: 'content', data: { title: "Tajuk", body: "Kandungan teks...", alignment: "left", fontSize: 'md' }, width: 'w-full' },
       gallery: { type: 'gallery', data: { title: "Galeri", images: ["https://picsum.photos/400"] }, width: 'w-full' },
       contact: { type: 'contact', data: { title: "Hubungi", email: "info@skmt.edu.my", phone: "123", address: "Alamat", mapUrl: "", socialLinks: [] }, width: 'w-full' },
       footer: { type: 'footer', data: { copyright: "© 2024 SKMT" }, width: 'w-full' },
       ticker: { type: 'ticker', data: { label: "INFO", text: "Teks bergerak...", direction: 'left', speed: 20 }, width: 'w-full' },
       time: { type: 'time', data: { format: '12h', showDate: true, alignment: 'center', bgColor: '#1e40af', textColor: '#ffffff' }, width: 'w-full' },
       button: { type: 'button', data: { label: "Butang", linkType: "external", url: "#", alignment: "center", style: "primary", size: "md" }, width: 'w-full' },
       divider: { type: 'divider', data: { style: 'solid', color: '#e5e7eb', thickness: 2 }, width: 'w-full' },
       spacer: { type: 'spacer', data: { height: 50 }, width: 'w-full' },
       
       // Missing Defaults Added Below to Fix White Screen
       linkList: { type: 'linkList', data: { title: "Pautan Pantas", links: [{ label: "Pautan 1", url: "#" }] }, width: 'w-full' },
       table: { type: 'table', data: { title: "Jadual", headers: ["Perkara", "Keterangan", "Catatan"], rows: [{col1: "Data 1", col2: "Data 2", col3: "Data 3"}] }, width: 'w-full' },
       visitor: { type: 'visitor', data: { label: "Jumlah Pelawat", count: 1234, showLiveIndicator: true }, width: 'w-full' },
       orgChart: { type: 'orgChart', data: { title: "Carta Organisasi", members: [{ id: uuidv4(), name: "Nama", position: "Jawatan", imageUrl: "https://picsum.photos/200" }] }, width: 'w-full' },
       staffGrid: { type: 'staffGrid', data: { title: "Direktori Staf", members: [{ id: uuidv4(), name: "Cikgu A", position: "Guru", imageUrl: "https://picsum.photos/200" }] }, width: 'w-full' },
       calendar: { type: 'calendar', data: { title: "Takwim Sekolah", events: [{ date: "1", month: "JAN", title: "Acara", desc: "Keterangan" }] }, width: 'w-full' },
       faq: { type: 'faq', data: { title: "Soalan Lazim", items: [{ question: "Soalan 1?", answer: "Jawapan..." }] }, width: 'w-full' },
       downloads: { type: 'downloads', data: { title: "Muat Turun", items: [{ title: "Borang", url: "#", type: "PDF" }] }, width: 'w-full' },
       countdown: { type: 'countdown', data: { title: "Menuju Hari Sukan", targetDate: new Date().toISOString().split('T')[0] }, width: 'w-full' },
       cta: { type: 'cta', data: { text: "Sertai Kami Sekarang!", buttonLabel: "Daftar", buttonLink: "#", bgColor: "#1e40af" }, width: 'w-full' },
       notice: { type: 'notice', data: { title: "Notis Penting", content: "Sila ambil perhatian...", color: "yellow" }, width: 'w-full' },
       testimonial: { type: 'testimonial', data: { quote: "Sekolah terbaik!", author: "Alumni", role: "Bekas Pelajar" }, width: 'w-full' },
       news: { type: 'news', data: { title: "Berita Terkini", items: [{ id: uuidv4(), title: "Berita Utama", date: new Date().toISOString().split('T')[0], tag: "UMUM", content: "Isi berita..." }] }, width: 'w-full' },
       definition: { type: 'definition', data: { title: "Definisi", imageUrl: "https://picsum.photos/300", items: [{ term: "Istilah", definition: "Maksud" }] }, width: 'w-full' },
       video: { type: 'video', data: { title: "Video Korporat", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }, width: 'w-full' },
       drive: { type: 'drive', data: { title: "Dokumen Drive", embedUrl: "", height: "500px" }, width: 'w-full' },
       html: { type: 'html', data: { code: "<div>HTML Code</div>", height: "100px" }, width: 'w-full' },
       speech: { type: 'speech', data: { title: "Sekapur Sirih", text: "Ucapan...", imageUrl: "https://picsum.photos/300", authorName: "Nama", authorRole: "Jawatan", fontSize: "md", alignment: "left", imageSize: "medium" }, width: 'w-full' },
       stats: { type: 'stats', data: { title: "Statistik", items: [{ id: uuidv4(), label: "Murid", value: "1000", icon: "Users" }] }, width: 'w-full' }
    };
    
    // Generic fallback if type is somehow not in defaults
    const newBlock = { id, style: {}, ...(defaults[type] || { type, data: {}, width: 'w-full' }) };
    if (!defaults[type] && type === 'image') {
        newBlock.data = { url: "https://picsum.photos/800/400", caption: "", width: "medium" };
    }

    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
        ...page,
        sections: [...page.sections, newBlock]
      }))
    }));
  };

  const updateBlock = (id: string, newData: any) => {
    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
        ...page,
        sections: page.sections.map(s => s.id === id ? { ...s, data: newData } : s)
      }))
    }));
  };

  const updateBlockWidth = (id: string, width: BlockWidth) => {
    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
        ...page,
        sections: page.sections.map(s => s.id === id ? { ...s, width } : s)
      }))
    }));
  };

  const updateBlockPadding = (id: string, padding: BlockPadding) => {
    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
        ...page,
        sections: page.sections.map(s => s.id === id ? { ...s, padding } : s)
      }))
    }));
  };

  const updateBlockStyle = (id: string, style: BlockStyle) => {
    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
        ...page,
        sections: page.sections.map(s => s.id === id ? { ...s, style } : s)
      }))
    }));
  };

  const deleteBlock = (blockId: string) => {
    if (window.confirm("Padam widget?")) {
      setData(prev => ({
        ...prev,
        pages: updatePageRecursive(prev.pages, activePageId, (page) => ({
          ...page,
          sections: page.sections.filter(s => s.id !== blockId)
        }))
      }));
      setSelectedBlockId(null);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setData(prev => {
      const page = findPageRecursive(prev.pages, activePageId);
      if (!page) return prev;
      const newSections = [...page.sections];
      if (direction === 'up' && index > 0) [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      else if (direction === 'down' && index < newSections.length - 1) [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      return {
        ...prev,
        pages: updatePageRecursive(prev.pages, activePageId, (p) => ({ ...p, sections: newSections }))
      };
    });
  };

  const addPage = (name: string, parentId?: string) => {
    const newPageId = uuidv4();
    const newPage: Page = {
      id: newPageId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      sections: [{ id: uuidv4(), type: 'hero', data: { title: name, subtitle: "", bgImage: "https://picsum.photos/1920/1080", height: 400 }, width: 'w-full' }],
      subPages: [],
      isOpen: true
    };
    setData(prev => {
      const newPages = parentId ? addSubPageRecursive(prev.pages, parentId, newPage) : [...prev.pages, newPage];
      return { ...prev, pages: newPages };
    });
    setActivePageId(newPageId);
  };

  const deletePage = (id: string) => {
    if (data.pages.some(p => p.id === id) && data.pages.length === 1) {
      alert("Halaman terakhir tidak boleh dipadam.");
      return;
    }
    if (!window.confirm("Padam halaman ini?")) return;
    const newPages = deletePageRecursive(data.pages, id);
    setData({ ...data, pages: newPages });
    if (!findPageRecursive(newPages, activePageId)) setActivePageId(newPages[0]?.id || 'utama');
  };

  const movePage = (id: string, direction: 'up' | 'down') => {
    setData(prev => {
      const result = movePageRecursive(prev.pages, id, direction);
      return result.success ? { ...prev, pages: result.newPages } : prev;
    });
  };

  const togglePageOpen = (id: string) => {
    setData(prev => ({
      ...prev,
      pages: updatePageRecursive(prev.pages, id, (page) => ({ ...page, isOpen: !page.isOpen }))
    }));
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className={`flex h-screen bg-slate-50 flex-col overflow-hidden font-${data.font || 'sans'}`}>
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        currentFont={data.font || 'sans'}
        onFontChange={(font) => setData(prev => ({ ...prev, font }))}
        primaryColor={data.primaryColor || '#1e40af'}
        onPrimaryColorChange={(c) => setData(prev => ({ ...prev, primaryColor: c }))}
        secondaryColor={data.secondaryColor || '#fbbf24'}
        onSecondaryColorChange={(c) => setData(prev => ({ ...prev, secondaryColor: c }))}
      />
      
      {/* GLOBAL TOP HEADER (Updated to be Sticky & Responsive) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-[100] shadow-sm">
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Icons.AlignJustify size={24} />
           </button>
        </div>

        <div className="hidden md:flex items-center gap-3 min-w-[180px]"></div>

        {/* Desktop Navigation */}
        <nav className="flex-1 hidden md:flex justify-center px-4 h-full items-center">
           <div className="flex gap-2 items-center flex-wrap justify-center h-full overflow-visible">
             {data.pages.map(page => (
               <NavItem 
                 key={page.id} 
                 page={page} 
                 activePageId={activePageId}
                 onSwitchPage={setActivePageId}
               />
             ))}
           </div>
        </nav>

        {/* Brand Name on Mobile (Centered) */}
        <div className="md:hidden flex-1 text-center font-bold text-gray-800 text-sm truncate px-2">
           {data.title}
        </div>

        <div className="flex items-center gap-2 min-w-[100px] md:min-w-[180px] justify-end">
          {user ? (
             <div className="flex items-center gap-2">
                <button onClick={() => setShowSettings(true)} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"><Icons.Sparkles size={18} /></button>
                <div className="hidden md:flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <button onClick={() => setIsPreview(false)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}><Icons.Edit size={12} /></button>
                  <button onClick={() => setIsPreview(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}><Icons.Eye size={12} /></button>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm">{isSaving ? '...' : 'Simpan'}</button>
                <button onClick={() => { if(window.confirm('Log keluar?')) { setUser(null); setIsPreview(true); logoutUser(); } }} className="hidden md:block p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Icons.LogIn className="rotate-180" size={18} /></button>
             </div>
          ) : (
            <button onClick={handleAdminLogin} className="flex items-center justify-center p-2 text-gray-300 hover:text-primary hover:bg-blue-50 rounded-full"><Icons.LogIn size={20} /></button>
          )}
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
         <div className="md:hidden fixed inset-0 top-16 z-[90] bg-white overflow-y-auto pb-20 animate-in slide-in-from-top-10">
            <div className="p-4 space-y-2">
               {data.pages.map(page => (
                  <div key={page.id} className="border-b border-gray-100 pb-2">
                     <button 
                        onClick={() => { setActivePageId(page.id); setMobileMenuOpen(false); }}
                        className={`w-full text-left py-3 px-4 rounded-xl font-bold text-lg ${activePageId === page.id ? 'bg-blue-50 text-primary' : 'text-gray-800'}`}
                     >
                        {page.name}
                     </button>
                     {page.subPages && page.subPages.length > 0 && (
                        <div className="pl-6 space-y-1 mt-1">
                           {page.subPages.map(sub => (
                              <button
                                 key={sub.id}
                                 onClick={() => { setActivePageId(sub.id); setMobileMenuOpen(false); }}
                                 className={`w-full text-left py-2 px-4 rounded-lg text-sm font-medium ${activePageId === sub.id ? 'text-primary bg-blue-50/50' : 'text-gray-600'}`}
                              >
                                 {sub.name}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
               {user && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                     <button onClick={() => { setIsPreview(!isPreview); setMobileMenuOpen(false); }} className="w-full text-left py-3 px-4 flex items-center gap-3 font-bold text-gray-700">
                        {isPreview ? <Icons.Edit size={18}/> : <Icons.Eye size={18}/>}
                        {isPreview ? 'Mod Sunting' : 'Mod Lihat'}
                     </button>
                     <button onClick={() => { if(window.confirm('Log keluar?')) { setUser(null); setIsPreview(true); logoutUser(); setMobileMenuOpen(false); } }} className="w-full text-left py-3 px-4 flex items-center gap-3 font-bold text-red-500">
                        <Icons.LogIn className="rotate-180" size={18} /> Log Keluar
                     </button>
                  </div>
               )}
            </div>
         </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out z-30 h-full border-r border-gray-200 ${isPreview || !user ? 'w-0 opacity-0 overflow-hidden border-none' : 'w-72 opacity-100 hidden md:block'}`}>
          <div className="w-72 h-full"> 
            <Sidebar onAddBlock={addBlock} pages={data.pages} activePageId={activePageId} onSwitchPage={setActivePageId} onAddPage={addPage} onDeletePage={deletePage} onMovePage={movePage} onTogglePage={togglePageOpen} />
          </div>
        </div>

        <main id="main-content" className="flex-1 overflow-y-auto bg-slate-100 scroll-smooth relative h-full flex flex-col" onClick={() => setSelectedBlockId(null)}>
          <div className={`flex-1 w-full flex flex-col items-center justify-start ${(isPreview || !user) ? 'p-0' : 'p-8'}`}>
             <div className={`w-full mx-auto transition-all duration-500 ease-in-out ${(isPreview || !user) ? 'max-w-none rounded-none shadow-none border-0 overflow-hidden' : 'max-w-7xl bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-visible'} min-h-[calc(100vh-100px)] flex flex-col relative`}>
               {!isPreview && user && (
                 <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-40 shadow-sm rounded-t-3xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Halaman Aktif</span>
                      <div className="flex items-center gap-2">
                         <Icons.Globe size={16} className="text-primary" />
                         <span className="font-bold text-xl text-gray-800">{activePage.name}</span>
                      </div>
                    </div>
                 </div>
               )}

               {hasSubPages ? (
                 <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[50vh] p-8">
                   <div className="max-w-5xl w-full">
                     <div className="text-center mb-12">
                       <h1 className="text-4xl font-bold text-gray-800 mb-3">{activePage.name}</h1>
                       <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {activePage.subPages!.map(sub => (
                         <button 
                           key={sub.id}
                           onClick={() => setActivePageId(sub.id)}
                           className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all group flex flex-col items-center gap-4 text-center"
                         >
                           <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                             <Icons.FileText size={32} />
                           </div>
                           <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary">{sub.name}</h3>
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className={`flex-1 w-full flex flex-wrap content-start items-start ${(isPreview || !user) ? '' : 'pb-32'}`}>
                   {activePage.sections.map((block, index) => (
                     <BlockWrapper 
                        key={block.id} 
                        block={block} 
                        index={index} 
                        total={activePage.sections.length} 
                        onMoveUp={(idx) => moveBlock(idx, 'up')} 
                        onMoveDown={(idx) => moveBlock(idx, 'down')} 
                        onDelete={deleteBlock} 
                        onUpdateWidth={updateBlockWidth}
                        onUpdatePadding={updateBlockPadding}
                        onUpdateStyle={updateBlockStyle}
                        isPreview={isPreview || !user} 
                        isSelected={selectedBlockId === block.id} 
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                       <BlockRenderer 
                          block={block} 
                          isPreview={isPreview || !user} 
                          onUpdate={updateBlock}
                          allPages={data.pages} // Pass for Navbar
                          activePageId={activePageId}
                          onSwitchPage={setActivePageId}
                        />
                     </BlockWrapper>
                   ))}
                   {!isPreview && user && activePage.sections.length === 0 && (
                     <div className="w-full flex flex-col items-center justify-center py-20 text-gray-400">
                        <Icons.Layout size={48} className="mb-4 opacity-20" />
                        <p>Halaman ini kosong. Pilih widget di sebelah kiri untuk bermula.</p>
                     </div>
                   )}
                 </div>
               )}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}