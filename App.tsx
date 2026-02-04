import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WebsiteData, SectionBlock, BlockType, Page } from './types';
import { INITIAL_DATA } from './constants';
import { Sidebar } from './components/editor/Sidebar';
import { BlockRenderer } from './components/blocks/Renderer';
import { BlockWrapper } from './components/blocks/BlockWrapper';
import { Icons } from './components/ui/Icons';
import { 
  saveWebsiteData, 
  loadWebsiteData, 
  isFirebaseConfigured, 
  loginWithGoogle, 
  logoutUser, 
  subscribeToAuth 
} from './services/firebase';
import { SettingsModal } from './components/SettingsModal';
import { User } from 'firebase/auth';

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

// --- EXTRACTED NavItem COMPONENT ---
interface NavItemProps {
  page: Page;
  depth?: number;
  activePageId: string;
  onSwitchPage: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ page, depth = 0, activePageId, onSwitchPage }) => {
  const hasChildren = page.subPages && page.subPages.length > 0;
  const isActive = activePageId === page.id;
  const isChildActive = isParentOf(page, activePageId);
  
  // State for click-toggle behavior
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      // Toggle dropdown only
      setIsOpen(!isOpen);
    } else {
      // Navigate
      onSwitchPage(page.id);
      setIsOpen(false);
    }
  };

  const handleSubPageClick = (id: string) => {
    onSwitchPage(id);
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button 
         onClick={handleMainClick}
         className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 border border-transparent whitespace-nowrap select-none ${
           isActive || (isOpen && hasChildren)
             ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' 
             : isChildActive 
               ? 'text-primary bg-blue-50 border-blue-100 font-semibold' 
               : 'text-gray-600 hover:text-primary hover:bg-gray-50'
         }`}
      >
        <span className="font-medium text-sm">{page.name}</span>
        {hasChildren && (
          <Icons.ChevronDown 
            size={14} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
            style={{ opacity: 0.8 }} 
          />
        )}
      </button>

      {/* Modern Dropdown Panel */}
      {hasChildren && isOpen && (
         <div className="absolute top-full left-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
           {/* Decorative Arrow Tip */}
           <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
           
           <div className="flex flex-col gap-1 relative bg-white rounded-xl overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                Sub-Halaman
              </div>
              
              {page.subPages!.map(sub => (
                <button 
                  key={sub.id}
                  onClick={(e) => { e.stopPropagation(); handleSubPageClick(sub.id); }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 group ${
                    activePageId === sub.id 
                      ? 'bg-blue-50 text-primary' 
                      : 'hover:bg-gray-50 text-gray-700 hover:pl-5'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activePageId === sub.id ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary/50'}`}></div>
                  <span className="truncate">{sub.name}</span>
                </button>
              ))}
           </div>
         </div>
      )}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<WebsiteData>(INITIAL_DATA);
  const [isPreview, setIsPreview] = useState(true); // Default to PREVIEW (Website mode)
  const [activePageId, setActivePageId] = useState<string>(INITIAL_DATA.pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Theme Application
  useEffect(() => {
    if (data.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', data.primaryColor);
    }
    if (data.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', data.secondaryColor);
    }
  }, [data.primaryColor, data.secondaryColor]);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      
      // Load data immediately regardless of auth
      const savedData = await loadWebsiteData();
      if (savedData) {
        setData(prev => ({
          ...savedData,
          // Ensure theme colors are loaded, fallback to prev/defaults if missing
          primaryColor: savedData.primaryColor || prev.primaryColor,
          secondaryColor: savedData.secondaryColor || prev.secondaryColor,
        }));
        if (!findPageRecursive(savedData.pages, activePageId)) {
          setActivePageId(savedData.pages[0]?.id || 'utama');
        }
      }

      // Subscribe to Auth State
      const unsubscribe = subscribeToAuth((currentUser) => {
        if (!user) setUser(currentUser); // Only set if not already locally set (for password bypass)
        if (!currentUser && !user) {
          setIsPreview(true); // Force preview if logged out
        }
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
    const result = await saveWebsiteData(data);
    setIsSaving(false);
    if (result.success) setLastSaved(new Date());
    else alert("Gagal menyimpan: " + (result.error || "Ralat tidak diketahui"));
  };

  const handleAdminLogin = async () => {
    if (user) {
      // If logged in, logout
      const confirmLogout = window.confirm("Adakah anda ingin log keluar?");
      if (confirmLogout) {
        await logoutUser();
        setUser(null);
        setIsPreview(true);
      }
    } else {
      // Ask for password first
      const password = window.prompt("Masukkan Kata Laluan Admin (Atau biarkan kosong untuk Log Masuk Google):");
      
      if (password === "admin123") {
        // Bypass login
        setUser({ uid: 'admin-local', email: 'admin@skmt.edu.my', displayName: 'Admin SKMT' } as User);
        setIsPreview(false);
        alert("Log masuk berjaya (Mod Admin).");
      } else if (password === "" || password === null) {
        // Fallback to Google Login
        await loginWithGoogle();
      } else {
        alert("Kata laluan salah.");
      }
    }
  };

  const addBlock = (type: BlockType) => {
    // Prevent adding blocks to a parent directory page
    if (hasSubPages) {
      alert("Halaman ini adalah direktori (mengandungi sub-halaman). Sila pilih atau cipta sub-halaman untuk menambah widget.");
      return;
    }

    const id = uuidv4();
    const defaults: any = {
       hero: { type: 'hero', data: { title: "Tajuk Baru", subtitle: "Subtajuk deskripsi", bgImage: "https://picsum.photos/1920/1080", buttonText: "Klik", fontSize: 'md' } },
       feature: { type: 'feature', data: { title: "Ciri-Ciri", features: [{ title: "Ciri 1", description: "Deskripsi", icon: "Star" }, { title: "Ciri 2", description: "Deskripsi", icon: "Heart" }, { title: "Ciri 3", description: "Deskripsi", icon: "Shield" }], fontSize: 'md' } },
       content: { type: 'content', data: { title: "Tajuk", body: "Kandungan teks...", alignment: "left", fontSize: 'md' } },
       footer: { type: 'footer', data: { copyright: "© 2024 SK Masjid Tanah. Hak Cipta Terpelihara." } },
       gallery: { type: 'gallery', data: { title: "Galeri Foto", images: ["https://picsum.photos/400/300", "https://picsum.photos/400/301", "https://picsum.photos/400/302"] } },
       contact: { type: 'contact', data: { title: "Hubungi Kami", email: "info@skmt.edu.my", phone: "+606-1234567", address: "Jalan Sekolah, 78300 Masjid Tanah, Melaka", mapUrl: "" } },
       html: { type: 'html', data: { code: "<div style='padding:20px; background:#f0f0f0; text-align:center'>Custom HTML Area</div>", height: "auto" } },
       drive: { type: 'drive', data: { title: "Dokumen Sekolah", embedUrl: "", height: "500px" } },
       video: { type: 'video', data: { title: "", url: "" } },
       image: { type: 'image', data: { url: "https://picsum.photos/800/400", caption: "", width: "medium", animation: "none" } },
       // Updated Existing Types
       ticker: { type: 'ticker', data: { label: "INFO TERKINI", text: "Pendaftaran murid tahun 1 kini dibuka.", direction: 'left', speed: 20 } },
       orgChart: { type: 'orgChart', data: { title: "Carta Organisasi", members: [{ id: '1', name: "Guru Besar", position: "Guru Besar", imageUrl: "https://picsum.photos/200" }, { id: '2', name: "PK Pentadbiran", position: "Penolong Kanan 1", imageUrl: "https://picsum.photos/201" }], fontSize: 'md' } },
       stats: { type: 'stats', data: { title: "Dashboard Sekolah", items: [{ id: '1', label: "MURID", value: "850", icon: "Users" }, { id: '2', label: "GURU", value: "45", icon: "Briefcase" }, { id: '3', label: "STAF", value: "12", icon: "Settings" }] } },
       time: { type: 'time', data: { format: '12h', showDate: true, alignment: 'center', bgColor: '#1e40af', textColor: '#ffffff' } },
       visitor: { type: 'visitor', data: { label: "Jumlah Pelawat", count: 12405, showLiveIndicator: true } },
       speech: { type: 'speech', data: { title: "Sekapur Sirih", text: "Assalamualaikum dan selamat sejahtera...", imageUrl: "https://picsum.photos/400/500", authorName: "Guru Besar", authorRole: "GB SKMT", fontSize: 'md' } },
       // 10 New Types
       calendar: { type: 'calendar', data: { title: "Takwim Sekolah", events: [{ date: "15", month: "MAC", title: "Mesyuarat PIBG", desc: "Dewan Sekolah, 8.00 Pagi" }, { date: "22", month: "APR", title: "Hari Sukan", desc: "Padang Sekolah" }] } },
       downloads: { type: 'downloads', data: { title: "Muat Turun", items: [{ title: "Borang Pendaftaran", url: "#", type: "PDF" }, { title: "Jadual Waktu", url: "#", type: "DOC" }] } },
       faq: { type: 'faq', data: { title: "Soalan Lazim", items: [{ question: "Bila sekolah dibuka?", answer: "Sekolah dibuka pada pukul 7.00 pagi setiap hari persekolahan." }] } },
       cta: { type: 'cta', data: { text: "Pendaftaran Murid Tahun 1 Sesi 2025 Kini Dibuka!", buttonLabel: "Daftar Sekarang", buttonLink: "#", bgColor: "#1e40af" } },
       countdown: { type: 'countdown', data: { title: "Menuju Hari Sukan Tahunan", targetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] } },
       notice: { type: 'notice', data: { title: "Perhatian", content: "Sila bawa baju sukan pada hari Rabu.", color: "yellow", fontSize: 'md' } },
       table: { type: 'table', data: { title: "Waktu Operasi Pejabat", headers: ["Hari", "Masa Buka", "Masa Tutup"], rows: [{ col1: "Isnin - Khamis", col2: "8.00 Pagi", col3: "5.00 Petang" }, { col1: "Jumaat", col2: "8.00 Pagi", col3: "12.15 Tengahari" }] } },
       staffGrid: { type: 'staffGrid', data: { title: "Barisan Pentadbir", members: [{ id: '1', name: "Cikgu Ali", position: "GB", imageUrl: "https://picsum.photos/150" }, { id: '2', name: "Cikgu Siti", position: "PK HEM", imageUrl: "https://picsum.photos/151" }] } },
       testimonial: { type: 'testimonial', data: { quote: "Sekolah ini telah membentuk sahsiah diri saya menjadi insan berguna.", author: "Azman Bin Ali", role: "Alumni 1998" } },
       linkList: { type: 'linkList', data: { title: "Pautan Luar", links: [{ label: "Portal KPM", url: "https://www.moe.gov.my" }, { label: "SAPS Ibu Bapa", url: "https://sapsnkra.moe.gov.my" }] } },
       news: { type: 'news', data: { title: "Info Terkini", items: [{ id: '1', title: "Gotong Royong Perdana", date: "2024-03-20", tag: 'HEM', content: "Semua ibu bapa dijemput hadir untuk menjayakan program ini." }] } },
       definition: { type: 'definition', data: { title: "Maksud Logo Sekolah", imageUrl: "https://picsum.photos/300", items: [{ term: "Merah", definition: "Keberanian" }, { term: "Biru", definition: "Perpaduan" }] } },
       divider: { type: 'divider', data: { style: 'solid', color: '#e5e7eb', thickness: 2 } },
       spacer: { type: 'spacer', data: { height: 50 } },
    };
    
    if (!defaults[type]) return;
    const newBlock = { id, ...defaults[type] };
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

  const deleteBlock = (blockId: string) => {
    if (window.confirm("Adakah anda pasti mahu memadam widget ini?")) {
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
      sections: [{ id: uuidv4(), type: 'hero', data: { title: name, subtitle: "Selamat Datang", bgImage: "https://picsum.photos/1920/1080", buttonText: "Info", fontSize: 'md' } }],
      subPages: [],
      isOpen: true
    };
    
    setData(prev => {
      const newPages = parentId ? addSubPageRecursive(prev.pages, parentId, newPage) : [...prev.pages, newPage];
      return { ...prev, pages: newPages };
    });
    // If adding a sub-page, we stay on parent to show the new folder structure, or switch?
    // Let's switch to the new page to allow immediate editing.
    setActivePageId(newPageId);
  };

  const deletePage = (id: string) => {
    const isRoot = data.pages.some(p => p.id === id);
    if (isRoot && data.pages.length === 1) {
      alert("Halaman terakhir tidak boleh dipadam.");
      return;
    }

    if (!window.confirm("AWAS: Padam halaman ini akan memadam semua konten dan sub-halamannya. Teruskan?")) return;

    const newPages = deletePageRecursive(data.pages, id);
    setData({ ...data, pages: newPages });
    
    const activeExists = findPageRecursive(newPages, activePageId);
    if (!activeExists) {
      setActivePageId(newPages[0]?.id || 'utama');
    }
  };

  const movePage = (id: string, direction: 'up' | 'down') => {
    setData(prev => {
      const result = movePageRecursive(prev.pages, id, direction);
      if (result.success) return { ...prev, pages: result.newPages };
      return prev;
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
      
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 justify-between shrink-0 z-40 shadow-sm relative">
        <div className="flex items-center gap-3 min-w-[180px]">
          {/* Logo removed as requested */}
        </div>

        <nav className="flex-1 flex justify-center px-4 h-full items-center">
           <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
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

        <div className="flex items-center gap-2 min-w-[180px] justify-end">
          {user ? (
             <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setShowSettings(true)} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"><Icons.Sparkles size={18} /></button>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <button onClick={() => setIsPreview(false)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}><Icons.Edit size={12} /></button>
                  <button onClick={() => setIsPreview(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}><Icons.Eye size={12} /></button>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm">{isSaving ? 'Saving...' : 'Simpan'}</button>
                <button onClick={() => { if(window.confirm('Log keluar?')) { setUser(null); setIsPreview(true); logoutUser(); } }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Log Keluar"><Icons.LogIn className="rotate-180" size={18} /></button>
             </div>
          ) : (
            <button 
              onClick={handleAdminLogin}
              className="flex items-center justify-center p-2 text-gray-300 hover:text-primary hover:bg-blue-50 rounded-full transition-all"
              title="Log Masuk Admin"
            >
              <Icons.LogIn size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out z-30 h-full border-r border-gray-200 ${isPreview || !user ? 'w-0 opacity-0 overflow-hidden border-none' : 'w-72 opacity-100'}`}>
          <div className="w-72 h-full"> 
            <Sidebar onAddBlock={addBlock} pages={data.pages} activePageId={activePageId} onSwitchPage={setActivePageId} onAddPage={addPage} onDeletePage={deletePage} onMovePage={movePage} onTogglePage={togglePageOpen} />
          </div>
        </div>

        <main id="main-content" className="flex-1 overflow-y-auto bg-slate-100 scroll-smooth relative h-full flex flex-col" onClick={() => setSelectedBlockId(null)}>
          <div className={`flex-1 w-full flex flex-col items-center justify-start ${(isPreview || !user) ? 'p-0' : 'p-8'}`}>
             <div className={`w-full mx-auto transition-all duration-500 ease-in-out ${(isPreview || !user) ? 'max-w-none rounded-none shadow-none border-0 overflow-hidden' : 'max-w-7xl bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-visible'} min-h-[calc(100vh-100px)] flex flex-col relative`}>
               {!isPreview && user && (
                 <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm rounded-t-3xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Halaman Aktif</span>
                      <div className="flex items-center gap-2">
                         <Icons.Globe size={16} className="text-primary" />
                         <span className="font-bold text-xl text-gray-800">{activePage.name}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-mono border border-blue-100">/{activePage.slug}</div>
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
                           <div>
                             <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{sub.name}</h3>
                             <span className="text-xs text-gray-400 font-mono mt-1 block">Klik untuk melihat</span>
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className={`flex-1 w-full ${(isPreview || !user) ? '' : 'pb-32'}`}>
                   {activePage.sections.map((block, index) => (
                     <BlockWrapper 
                        key={block.id} 
                        block={block} 
                        index={index} 
                        total={activePage.sections.length} 
                        onMoveUp={(idx) => moveBlock(idx, 'up')} 
                        onMoveDown={(idx) => moveBlock(idx, 'down')} 
                        onDelete={deleteBlock} 
                        isPreview={isPreview || !user} 
                        isSelected={selectedBlockId === block.id} 
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                       <BlockRenderer 
                          block={block} 
                          isPreview={isPreview || !user} 
                          onUpdate={updateBlock} 
                        />
                     </BlockWrapper>
                   ))}
                   {!isPreview && user && activePage.sections.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-20 text-gray-400">
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