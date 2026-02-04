import React, { useState, useEffect, useRef } from 'react';
import { 
  SectionBlock, HeroBlock, FeatureBlock, ContentBlock, GalleryBlock, 
  ContactBlock, FooterBlock, HtmlBlock, DriveBlock, VideoBlock, ImageBlock,
  TickerBlock, OrgChartBlock, StatsBlock, TimeBlock, VisitorBlock, SpeechBlock,
  CalendarBlock, DownloadsBlock, FaqBlock, CtaBlock, CountdownBlock, NoticeBlock,
  TableBlock, StaffGridBlock, TestimonialBlock, LinkListBlock, NewsBlock, DefinitionBlock, 
  DividerBlock, SpacerBlock, TitleBlock, NavbarBlock, HistoryBlock, AudioBlock, OrgMember, Page, FeatureItem, StatItem, FaqItem
} from '../../types';
import { getIconByName, Icons, iconList } from '../ui/Icons';
import { v4 as uuidv4 } from 'uuid';

interface RendererProps {
  block: SectionBlock;
  isPreview: boolean;
  onUpdate: (id: string, data: any) => void;
  // We need pages for the Navbar widget
  allPages?: Page[];
  onSwitchPage?: (id: string) => void;
  activePageId?: string;
}

// Helper for Image Inputs
const ImageControl = ({ label, url, onChange }: { label: string, url: string, onChange: (val: string) => void }) => (
  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-xl border border-blue-100 text-xs flex flex-col gap-2 z-20 group-hover:opacity-100 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
    <label className="font-bold text-primary flex items-center gap-1">
      <Icons.Image size={12} /> {label}
    </label>
    <input 
      type="text" 
      value={url} 
      onChange={(e) => onChange(e.target.value)}
      className="border border-blue-100 rounded-lg px-2 py-1.5 w-56 outline-none focus:ring-2 ring-primary/20 transition-all"
      placeholder="https://..."
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

// Helper for Font Size
const FontSizeControl = ({ value, onChange }: { value?: string, onChange: (val: string) => void }) => {
  return (
    <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm" onClick={e=>e.stopPropagation()}>
      <button onClick={() => onChange('sm')} className={`p-1 text-xs rounded ${value === 'sm' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`} title="Kecil"><Icons.Type size={10} /></button>
      <button onClick={() => onChange('md')} className={`p-1 text-xs rounded ${(!value || value === 'md') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`} title="Sederhana"><Icons.Type size={12} /></button>
      <button onClick={() => onChange('lg')} className={`p-1 text-xs rounded ${value === 'lg' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`} title="Besar"><Icons.Type size={14} /></button>
      <button onClick={() => onChange('xl')} className={`p-1 text-xs rounded ${value === 'xl' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`} title="Ekstra Besar"><Icons.Type size={16} /></button>
    </div>
  );
};

const getSizeClass = (size?: string, type: 'title' | 'body' = 'body') => {
  const map: any = {
    sm: { title: 'text-2xl', body: 'text-sm' },
    md: { title: 'text-4xl', body: 'text-base' },
    lg: { title: 'text-5xl', body: 'text-lg' },
    xl: { title: 'text-6xl', body: 'text-xl' }
  };
  return map[size || 'md'][type];
};

// --- RENDERERS ---

const NavItemWidget: React.FC<{ page: Page; activePageId?: string; onSwitchPage?: (id: string) => void }> = ({ page, activePageId, onSwitchPage }) => {
  const hasChildren = page.subPages && page.subPages.length > 0;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => {
           if (hasChildren) setIsOpen(!isOpen);
           else onSwitchPage?.(page.id);
        }}
        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors ${activePageId === page.id ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
      >
        {page.name}
        {hasChildren && <Icons.ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} />}
      </button>

      {hasChildren && isOpen && (
         <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
            {page.subPages?.map(sub => (
              <button 
                key={sub.id}
                onClick={() => { onSwitchPage?.(sub.id); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium border-b border-gray-50 last:border-0 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                {sub.name}
              </button>
            ))}
         </div>
      )}
    </div>
  )
}

export const NavbarRenderer: React.FC<{ block: NavbarBlock } & RendererProps> = ({ block, isPreview, onUpdate, allPages, activePageId, onSwitchPage }) => {
  const styles: any = {
    transparent: 'bg-transparent',
    light: 'bg-white shadow-sm border-b border-gray-100',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-primary text-white'
  };

  return (
    <div className={`w-full py-3 px-6 ${styles[block.data.style]} flex items-center relative group`}>
       <div className={`flex-1 flex gap-2 flex-wrap ${block.data.alignment === 'center' ? 'justify-center' : block.data.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {allPages?.map(page => (
            <NavItemWidget key={page.id} page={page} activePageId={activePageId} onSwitchPage={onSwitchPage} />
          ))}
       </div>
       
       {!isPreview && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white p-1 rounded border shadow-sm z-10">
             <select value={block.data.style} onChange={e => onUpdate(block.id, {...block.data, style: e.target.value})} className="text-xs border rounded text-black">
               <option value="light">Putih</option>
               <option value="transparent">Lutsinar</option>
               <option value="dark">Gelap</option>
               <option value="primary">Warna Tema</option>
             </select>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'left'})} className="p-1 hover:bg-gray-100 rounded text-black"><Icons.AlignLeft size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'center'})} className="p-1 hover:bg-gray-100 rounded text-black"><Icons.AlignCenter size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'right'})} className="p-1 hover:bg-gray-100 rounded text-black"><Icons.AlignRight size={14}/></button>
          </div>
       )}
    </div>
  )
}

export const TitleRenderer: React.FC<{ block: TitleBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const sizeMap: any = {
    'sm': 'text-xl',
    'md': 'text-2xl',
    'lg': 'text-3xl',
    'xl': 'text-4xl',
    '2xl': 'text-5xl'
  };

  return (
    <div className="py-6 px-4 relative group">
       {isPreview ? (
         <h2 
           className={`${sizeMap[block.data.fontSize]} font-bold text-${block.data.alignment} tracking-tight leading-tight`} 
           style={{ color: block.data.color || 'inherit' }}
         >
           {block.data.text}
         </h2>
       ) : (
         <input 
           value={block.data.text} 
           onChange={e => onUpdate(block.id, {...block.data, text: e.target.value})}
           className={`w-full bg-transparent border-b border-dashed border-gray-300 outline-none ${sizeMap[block.data.fontSize]} font-bold text-${block.data.alignment}`}
           style={{ color: block.data.color }}
           placeholder="Masukkan Tajuk..."
         />
       )}
       
       {!isPreview && (
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border p-1 rounded flex gap-2 shadow-sm z-10">
             <FontSizeControl value={block.data.fontSize === '2xl' ? 'xl' : block.data.fontSize} onChange={v => onUpdate(block.id, {...block.data, fontSize: v === 'xl' ? '2xl' : v})} />
             <input type="color" value={block.data.color || '#000000'} onChange={e => onUpdate(block.id, {...block.data, color: e.target.value})} className="w-6 h-6 rounded cursor-pointer border-0" />
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'left'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignLeft size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'center'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignCenter size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'right'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignRight size={14}/></button>
          </div>
       )}
    </div>
  )
}

export const HeroRenderer: React.FC<{ block: HeroBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const height = block.data.height || 500;
  
  return (
    <div 
      className="relative w-full flex flex-col items-center justify-center text-center text-white overflow-hidden group transition-all duration-300 rounded-b-3xl shadow-lg"
      style={{ minHeight: `${height}px` }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${block.data.bgImage})` }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/50 to-primary/30 transition-opacity duration-300" 
        style={{ opacity: block.data.overlayOpacity ?? 0.8 }} 
      />
      
      {!isPreview && (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 items-end">
           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2 w-48">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
                 <span>Gelap Overlay</span>
                 <span>{((block.data.overlayOpacity ?? 0.8) * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={block.data.overlayOpacity ?? 0.8} 
                onChange={(e) => onUpdate(block.id, { ...block.data, overlayOpacity: parseFloat(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mt-2">
                 <span>Tinggi Banner</span>
                 <span>{height}px</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="1000" 
                step="50" 
                value={height} 
                onChange={(e) => onUpdate(block.id, { ...block.data, height: parseInt(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
           </div>
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
           <ImageControl label="URL Gambar Latar" url={block.data.bgImage} onChange={(val) => onUpdate(block.id, { ...block.data, bgImage: val })} />
        </div>
      )}

      <div className="relative z-10 p-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="mb-6 w-full max-w-5xl flex flex-col items-center">
           {isPreview ? (
             <h1 className={`${getSizeClass(block.data.fontSize, 'title')} font-extrabold mb-4 leading-tight text-center mx-auto drop-shadow-lg`} style={{ textWrap: 'balance' }}>{block.data.title}</h1>
           ) : (
             <textarea value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className={`${getSizeClass(block.data.fontSize, 'title')} font-extrabold bg-transparent text-center border-b-2 border-transparent hover:border-white/30 focus:border-white outline-none w-full placeholder-white/40 transition-all resize-none overflow-hidden mx-auto`} placeholder="Tajuk Utama Sekolah" rows={2} style={{ textWrap: 'balance' }} onClick={e=>e.stopPropagation()} />
           )}
        </div>
        <div className="mb-10 w-full max-w-4xl flex flex-col items-center">
          {isPreview ? (
            <p className={`${getSizeClass(block.data.fontSize, 'body')} font-light opacity-95 text-center mx-auto max-w-2xl leading-relaxed`} style={{ textWrap: 'balance' }}>{block.data.subtitle}</p>
          ) : (
            <textarea value={block.data.subtitle} onChange={(e) => onUpdate(block.id, { ...block.data, subtitle: e.target.value })} className={`${getSizeClass(block.data.fontSize, 'body')} bg-transparent text-center border-b border-transparent hover:border-white/30 focus:border-white outline-none w-full resize-none h-24 placeholder-white/40 font-light mx-auto`} placeholder="Slogan sekolah..." style={{ textWrap: 'balance' }} onClick={e=>e.stopPropagation()} />
           )}
        </div>
        <div className="flex justify-center gap-4 w-full">
          <button className="bg-secondary text-primary font-bold px-8 py-3 rounded-full hover:bg-white hover:scale-105 transition-all shadow-xl active:scale-95 border-2 border-secondary">
            {isPreview ? block.data.buttonText : <input value={block.data.buttonText} onChange={(e) => onUpdate(block.id, { ...block.data, buttonText: e.target.value })} className="bg-transparent text-center w-32 outline-none placeholder-primary/60" placeholder="Teks Butang" onClick={(e) => e.stopPropagation()} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export const HistoryRenderer: React.FC<{ block: HistoryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-8 bg-amber-50/50 relative border-y border-amber-100">
       {isPreview ? (
         <>
           <h2 className="text-4xl font-serif font-bold text-center mb-10 text-amber-900 border-b-2 border-amber-200 pb-4 mx-auto max-w-3xl">{block.data.title}</h2>
           <div className="prose prose-lg prose-amber max-w-4xl mx-auto text-justify font-serif leading-loose whitespace-pre-wrap text-gray-800">
             {block.data.body}
           </div>
         </>
       ) : (
         <div className="flex flex-col gap-6 max-w-4xl mx-auto">
           <input 
             value={block.data.title} 
             onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})}
             className="text-4xl font-serif font-bold text-center w-full bg-transparent border-b-2 border-amber-200 outline-none pb-2 text-amber-900 placeholder-amber-900/30"
             placeholder="Tajuk Sejarah (Contoh: Sejarah Sekolah)"
           />
           <div className="relative">
             <label className="absolute -top-6 left-0 text-xs font-bold text-amber-700/50 uppercase tracking-widest">Kandungan Sejarah</label>
             <textarea 
               value={block.data.body} 
               onChange={e => onUpdate(block.id, {...block.data, body: e.target.value})}
               className="w-full h-[500px] p-6 bg-white border-2 border-amber-100 rounded-xl font-serif text-lg leading-relaxed focus:border-amber-300 focus:ring-4 ring-amber-100 outline-none resize-y shadow-sm"
               placeholder="Tulis atau tampal teks sejarah sekolah di sini. Gunakan 'Enter' untuk perenggan baru."
             />
           </div>
         </div>
       )}
    </div>
  )
}

export const ContentRenderer: React.FC<{ block: ContentBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className={`py-12 px-8 h-full flex flex-col justify-center text-${block.data.alignment} relative group`}>
      {!isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
        </div>
      )}
      <div className="mb-6 w-full">
        {isPreview ? <h2 className={`${getSizeClass(block.data.fontSize, 'title').replace('text-6xl','text-4xl')} font-bold text-gray-800 mb-2 border-b-4 border-secondary inline-block pb-1`}>{block.data.title}</h2> : <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className={`${getSizeClass(block.data.fontSize, 'title').replace('text-6xl','text-4xl')} font-bold text-gray-800 w-full bg-transparent border-b-2 border-dashed border-blue-100 focus:border-primary outline-none text-${block.data.alignment} py-2 transition-all`} placeholder="Tajuk Artikel" onClick={e=>e.stopPropagation()} />}
      </div>
      <div className="relative w-full">
        {isPreview ? <div className={`prose prose-blue max-w-none text-gray-600 ${getSizeClass(block.data.fontSize, 'body')} leading-relaxed whitespace-pre-wrap`}>{block.data.body}</div> : <textarea value={block.data.body} onChange={(e) => onUpdate(block.id, { ...block.data, body: e.target.value })} className={`w-full h-64 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 focus:border-primary focus:bg-white outline-none resize-none transition-all ${getSizeClass(block.data.fontSize, 'body')} shadow-sm`} placeholder="Tulis maklumat sekolah anda di sini..." onClick={e=>e.stopPropagation()} />}
      </div>
      {!isPreview && (
        <div className="mt-6 flex gap-3 justify-end opacity-60 hover:opacity-100 transition-opacity">
          <button onClick={() => onUpdate(block.id, { ...block.data, alignment: 'left' })} className={`p-2 border rounded-lg transition-colors ${block.data.alignment === 'left' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-200'}`} title="Kiri"><Icons.Layout size={18} /></button>
          <button onClick={() => onUpdate(block.id, { ...block.data, alignment: 'center' })} className={`p-2 border rounded-lg transition-colors ${block.data.alignment === 'center' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-200'}`} title="Tengah"><Icons.Monitor size={18} /></button>
          <button onClick={() => onUpdate(block.id, { ...block.data, alignment: 'right' })} className={`p-2 border rounded-lg transition-colors ${block.data.alignment === 'right' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-200'}`} title="Kanan"><Icons.Layout size={18} className="transform rotate-180" /></button>
        </div>
      )}
    </div>
  );
};

export const VideoRenderer: React.FC<{ block: VideoBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   const getEmbed = (url: string) => {
     if (!url) return '';
     
     // Extracts 11-char ID from common YouTube formats (standard, short, embed)
     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
     const match = url.match(regExp);
     const videoId = (match && match[2].length === 11) ? match[2] : null;
     
     if (videoId) {
        // Construct clean embed URL with origin to fix Error 153
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${origin}`;
     }
     
     return '';
   }

   return (
     <div className="py-8 px-4 max-w-4xl mx-auto">
        {isPreview ? <h3 className="text-xl font-bold mb-4 text-center">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center text-xl font-bold mb-4 bg-transparent" placeholder="Tajuk Video" />}
        <div className="aspect-video bg-black rounded-3xl overflow-hidden relative group shadow-2xl ring-4 ring-gray-100">
           {getEmbed(block.data.url) ? (
              <iframe 
                src={getEmbed(block.data.url)} 
                className="w-full h-full" 
                allowFullScreen 
                title={block.data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
           ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                <Icons.Video size={48} className="mb-2 opacity-50" />
                <span className="text-sm">Video tidak dijumpai atau URL tidak sah.</span>
                {!isPreview && <span className="text-xs mt-1">Sila masukkan URL YouTube yang sah (cth: https://youtu.be/...)</span>}
              </div>
           )}
           
           {!isPreview && (
             <div className="absolute top-2 right-2 p-2 bg-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
               <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} placeholder="YouTube URL" className="text-xs p-1 w-64 border rounded" />
             </div>
           )}
        </div>
     </div>
   )
}

export const AudioRenderer: React.FC<{ block: AudioBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
       <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 relative group">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
             <Icons.Music className="text-primary w-8 h-8 animate-pulse" />
          </div>
          <div className="flex-1">
             {isPreview ? <h3 className="font-bold text-lg text-gray-800 mb-2">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg w-full bg-transparent mb-2 border-b border-dashed" placeholder="Tajuk Lagu/Audio" />}
             
             {block.data.audioUrl ? (
                <audio controls className="w-full h-8" src={block.data.audioUrl}>
                  Browser anda tidak menyokong elemen audio.
                </audio>
             ) : (
                <div className="text-xs text-gray-400 italic">Tiada fail audio dipilih.</div>
             )}
          </div>
          
          {!isPreview && (
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white p-2 rounded shadow border border-gray-100 transition-opacity flex flex-col gap-2 z-10">
                <input value={block.data.audioUrl} onChange={e=>onUpdate(block.id, {...block.data, audioUrl: e.target.value})} className="text-xs border p-1 rounded w-64" placeholder="URL Audio (MP3 Link)" />
                <label className="flex items-center gap-2 text-xs">
                   <input type="checkbox" checked={block.data.autoPlay} onChange={e=>onUpdate(block.id, {...block.data, autoPlay: e.target.checked})} /> Autoplay
                </label>
             </div>
          )}
       </div>
    </div>
  )
}

export const SpeechRenderer: React.FC<{ block: SpeechBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  // Enhanced image sizes for better visibility
  const imgSizeClass = block.data.imageSize === 'small' ? 'w-48 h-64' : 
                       block.data.imageSize === 'medium' ? 'w-72 h-96' : 
                       block.data.imageSize === 'large' ? 'w-96 h-[36rem]' : 
                       block.data.imageSize === 'full' ? 'w-full max-w-xl aspect-[3/4]' : 'w-72 h-96';

  return (
    <div className="py-16 px-6 bg-white">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className={`${imgSizeClass} shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group transition-all duration-300 ring-1 ring-gray-100 hover:scale-[1.01]`}>
             <img src={block.data.imageUrl} className="w-full h-full object-cover" />
             {!isPreview && (
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                 <input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="w-11/12 text-[10px] p-1 rounded" placeholder="URL Gambar" onClick={e=>e.stopPropagation()} />
                 <select 
                    value={block.data.imageSize || 'medium'} 
                    onChange={e=>onUpdate(block.id, {...block.data, imageSize: e.target.value})} 
                    onClick={e=>e.stopPropagation()}
                    className="text-xs p-1 rounded"
                 >
                    <option value="small">Kecil (Small)</option>
                    <option value="medium">Sederhana (Standard)</option>
                    <option value="large">Besar (Large)</option>
                    <option value="full">Penuh (Full)</option>
                 </select>
               </div>
             )}
          </div>
          <div className="flex-1 text-center md:text-left relative group">
             {isPreview ? <h2 className="text-4xl font-extrabold text-primary mb-6 drop-shadow-sm leading-tight">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-4xl font-extrabold text-primary w-full mb-6 bg-transparent" />}
             <div className="relative">
                <Icons.Quote className="absolute -top-8 -left-8 text-blue-50 w-24 h-24 -z-10" />
                {isPreview ? <p className="text-gray-700 leading-loose italic text-lg md:text-xl font-light">{block.data.text}</p> : <textarea value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="w-full h-48 bg-transparent border-b border-dashed p-2 text-lg" />}
             </div>
             <div className="mt-8 pt-6 border-t-2 border-gray-50">
                {isPreview ? <div className="font-bold text-2xl text-gray-900">{block.data.authorName}</div> : <input value={block.data.authorName} onChange={e=>onUpdate(block.id, {...block.data, authorName: e.target.value})} className="font-bold w-full bg-transparent text-2xl" />}
                {isPreview ? <div className="text-sm font-bold text-secondary uppercase tracking-widest mt-1">{block.data.authorRole}</div> : <input value={block.data.authorRole} onChange={e=>onUpdate(block.id, {...block.data, authorRole: e.target.value})} className="text-sm text-secondary w-full bg-transparent uppercase font-bold" />}
             </div>
             {!isPreview && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100">
                   <FontSizeControl value={block.data.fontSize} onChange={v=>onUpdate(block.id, {...block.data, fontSize: v})} />
                </div>
             )}
          </div>
       </div>
    </div>
  )
}

// ... (Rest of the file remains unchanged, export BlockRenderer with new cases handled)

export const FeatureRenderer: React.FC<{ block: FeatureBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateFeature = (idx: number, field: string, value: string) => {
    const newFeatures = [...block.data.features];
    newFeatures[idx] = { ...newFeatures[idx], [field]: value };
    onUpdate(block.id, { ...block.data, features: newFeatures });
  };

  return (
    <div className="py-16 px-6 bg-slate-50">
       <div className="max-w-7xl mx-auto">
         {isPreview ? <h2 className="text-4xl font-extrabold text-center mb-12 text-slate-800">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-4xl font-extrabold text-center mb-12 w-full bg-transparent" />}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {block.data.features.map((item, idx) => (
             <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center relative group border border-slate-100">
               <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                 {getIconByName(item.icon, "w-8 h-8")}
               </div>
               {isPreview ? <h3 className="font-bold text-xl mb-3 text-slate-800">{item.title}</h3> : <input value={item.title} onChange={e=>updateFeature(idx, 'title', e.target.value)} className="font-bold text-xl mb-3 text-center w-full bg-transparent" />}
               {isPreview ? <p className="text-slate-600 leading-relaxed">{item.description}</p> : <textarea value={item.description} onChange={e=>updateFeature(idx, 'description', e.target.value)} className="text-slate-600 w-full bg-transparent text-center" />}
               
               {!isPreview && (
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                   <button onClick={()=>{const n=[...block.data.features]; n.splice(idx,1); onUpdate(block.id,{...block.data, features:n})}} className="text-red-500 bg-white p-1 rounded border shadow"><Icons.Trash2 size={12}/></button>
                 </div>
               )}
             </div>
           ))}
           {!isPreview && (
             <button onClick={()=>onUpdate(block.id, {...block.data, features: [...block.data.features, {title: "Baru", description: "...", icon: "Star"}]})} className="border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center p-8 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors">
               <Icons.Plus size={32} />
               <span className="text-sm font-bold mt-2">Tambah Ciri</span>
             </button>
           )}
         </div>
       </div>
    </div>
  )
}

export const GalleryRenderer: React.FC<{ block: GalleryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-8 w-full bg-transparent" />}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {block.data.images.map((url, idx) => (
           <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
              <img src={url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              {!isPreview && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                   <input value={url} onChange={e=>{const n=[...block.data.images]; n[idx]=e.target.value; onUpdate(block.id,{...block.data, images:n})}} className="w-11/12 text-xs p-1 rounded" />
                   <button onClick={()=>{const n=[...block.data.images]; n.splice(idx,1); onUpdate(block.id,{...block.data, images:n})}} className="bg-red-500 text-white p-1 rounded text-xs">Padam</button>
                </div>
              )}
           </div>
         ))}
         {!isPreview && (
            <button onClick={()=>onUpdate(block.id, {...block.data, images: [...block.data.images, "https://picsum.photos/400"]})} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
              <Icons.Plus size={32} />
            </button>
         )}
       </div>
    </div>
  )
}

export const ContactRenderer: React.FC<{ block: ContactBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
         <div className="flex-1 space-y-6">
            {isPreview ? <h2 className="text-3xl font-bold text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold w-full bg-transparent" />}
            
            <div className="space-y-4">
               <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-primary"><Icons.MapPin size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Alamat</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.address}</p> : <textarea value={block.data.address} onChange={e=>onUpdate(block.id, {...block.data, address: e.target.value})} className="w-full h-20 bg-gray-50 border border-gray-200 rounded p-2 text-sm" />}
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-primary"><Icons.Phone size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Telefon</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.phone}</p> : <input value={block.data.phone} onChange={e=>onUpdate(block.id, {...block.data, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm" />}
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-primary"><Icons.Mail size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Emel</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.email}</p> : <input value={block.data.email} onChange={e=>onUpdate(block.id, {...block.data, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm" />}
                  </div>
               </div>
            </div>
         </div>
         <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden h-[400px] relative group">
            <div dangerouslySetInnerHTML={{ __html: block.data.mapUrl }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
            {!isPreview && (
               <div className="absolute inset-x-0 bottom-0 bg-white/90 p-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-bold mb-1">Kod Embed Google Maps:</p>
                  <textarea value={block.data.mapUrl} onChange={e=>onUpdate(block.id, {...block.data, mapUrl: e.target.value})} className="w-full h-20 text-xs border p-1 rounded" />
               </div>
            )}
         </div>
      </div>
    </div>
  )
}

export const FooterRenderer: React.FC<{ block: FooterBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="bg-gray-900 text-white py-8 px-6 text-center">
       {isPreview ? <p className="opacity-70 text-sm">{block.data.copyright}</p> : <input value={block.data.copyright} onChange={e=>onUpdate(block.id, {...block.data, copyright: e.target.value})} className="w-full bg-transparent text-center text-sm opacity-70 border-b border-gray-700" />}
    </div>
  )
}

export const HtmlRenderer: React.FC<{ block: HtmlBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="relative group min-h-[100px]" style={{ height: block.data.height }}>
       <div dangerouslySetInnerHTML={{ __html: block.data.code }} className="w-full h-full overflow-hidden" />
       {!isPreview && (
          <div className="absolute inset-0 bg-white/95 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-4 border border-gray-200 shadow-lg flex flex-col">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500">HTML Code Editor</span>
                <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} placeholder="Height (e.g. 400px)" className="text-xs border p-1 rounded w-32" />
             </div>
             <textarea value={block.data.code} onChange={e=>onUpdate(block.id, {...block.data, code: e.target.value})} className="flex-1 w-full border p-2 font-mono text-xs" />
          </div>
       )}
    </div>
  )
}

export const DriveRenderer: React.FC<{ block: DriveBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 w-full">
       {isPreview ? <h3 className="font-bold text-xl mb-4 text-center">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center font-bold text-xl mb-4 bg-transparent" placeholder="Tajuk Dokumen" />}
       <div className="w-full border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-gray-50 relative group" style={{ height: block.data.height || '600px' }}>
          {block.data.embedUrl ? (
             <iframe src={block.data.embedUrl} className="w-full h-full" />
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">Tiada Dokumen Dipilih</div>
          )}
          {!isPreview && (
             <div className="absolute top-2 right-2 bg-white p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <input value={block.data.embedUrl} onChange={e=>onUpdate(block.id, {...block.data, embedUrl: e.target.value})} placeholder="URL Embed Google Drive" className="text-xs border p-1 rounded w-64" />
                <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} placeholder="Tinggi (px)" className="text-xs border p-1 rounded w-64" />
             </div>
          )}
       </div>
    </div>
  )
}

export const ImageRenderer: React.FC<{ block: ImageBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const widthClass = block.data.width === 'small' ? 'max-w-sm' : block.data.width === 'medium' ? 'max-w-2xl' : block.data.width === 'large' ? 'max-w-5xl' : 'w-full';
  
  return (
    <div className="py-8 px-4 flex flex-col items-center group relative">
       <div className={`${widthClass} w-full rounded-2xl overflow-hidden shadow-lg relative`}>
          <img src={block.data.url} className={`w-full h-auto ${block.data.animation === 'zoom' ? 'hover:scale-105 transition-transform duration-700' : ''}`} />
          {block.data.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white p-4 backdrop-blur-sm">
               {isPreview ? <p className="text-center">{block.data.caption}</p> : <input value={block.data.caption} onChange={e=>onUpdate(block.id, {...block.data, caption: e.target.value})} className="w-full bg-transparent text-center text-white" />}
            </div>
          )}
       </div>
       {!isPreview && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded shadow flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
             <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} placeholder="Image URL" className="text-xs border p-1 rounded w-48" />
             <input value={block.data.caption} onChange={e=>onUpdate(block.id, {...block.data, caption: e.target.value})} placeholder="Kapsyen" className="text-xs border p-1 rounded w-48" />
             <select value={block.data.width} onChange={e=>onUpdate(block.id, {...block.data, width: e.target.value})} className="text-xs border p-1 rounded">
               <option value="small">Kecil</option>
               <option value="medium">Sederhana</option>
               <option value="large">Besar</option>
               <option value="full">Penuh</option>
             </select>
          </div>
       )}
    </div>
  )
}

export const TickerRenderer: React.FC<{ block: TickerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="bg-blue-900 text-white overflow-hidden py-2 flex items-center relative">
       <div className="bg-secondary text-primary font-bold px-4 py-1 z-10 text-xs shrink-0 mx-2 rounded uppercase tracking-wider shadow-lg">
          {isPreview ? block.data.label : <input value={block.data.label} onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} className="bg-transparent w-20 text-center" />}
       </div>
       <div className="flex-1 overflow-hidden relative h-6">
         {isPreview ? (
           // Using marquee tag for simplicity and robustness in generated code
           React.createElement('marquee', { scrollamount: block.data.speed, direction: block.data.direction }, block.data.text)
         ) : (
           <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="w-full bg-transparent text-white px-2" placeholder="Teks bergerak..." />
         )}
       </div>
       {!isPreview && (
          <div className="absolute right-2 top-1 bg-white p-1 rounded shadow opacity-50 hover:opacity-100 z-20 flex gap-1">
             <input type="number" value={block.data.speed} onChange={e=>onUpdate(block.id, {...block.data, speed: parseInt(e.target.value)})} className="w-10 text-xs text-black border" title="Kelajuan" />
          </div>
       )}
    </div>
  )
}

export const OrgChartRenderer: React.FC<{ block: OrgChartBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateMember = (idx: number, field: string, val: string) => {
    const m = [...block.data.members];
    m[idx] = { ...m[idx], [field]: val };
    onUpdate(block.id, { ...block.data, members: m });
  };

  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-12">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-12 w-full bg-transparent" />}
       <div className="flex flex-wrap justify-center gap-8">
          {block.data.members.map((m, idx) => (
             <div key={idx} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-48 relative group hover:-translate-y-2 transition-transform">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-primary">
                   <img src={m.imageUrl} className="w-full h-full object-cover" />
                </div>
                {isPreview ? <h4 className="font-bold text-center leading-tight">{m.name}</h4> : <input value={m.name} onChange={e=>updateMember(idx, 'name', e.target.value)} className="font-bold text-center w-full text-sm bg-transparent" />}
                {isPreview ? <span className="text-xs text-primary font-bold uppercase tracking-wider mt-1 text-center">{m.position}</span> : <input value={m.position} onChange={e=>updateMember(idx, 'position', e.target.value)} className="text-xs text-primary font-bold text-center w-full bg-transparent" />}
                
                {!isPreview && (
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 bg-white/90 p-1 rounded shadow">
                      <input value={m.imageUrl} onChange={e=>updateMember(idx, 'imageUrl', e.target.value)} className="text-[9px] w-20 border" placeholder="Img URL" />
                      <button onClick={()=>{const n=[...block.data.members]; n.splice(idx,1); onUpdate(block.id,{...block.data, members:n})}} className="bg-red-500 text-white text-[9px] rounded">Padam</button>
                   </div>
                )}
             </div>
          ))}
          {!isPreview && (
             <button onClick={()=>onUpdate(block.id, {...block.data, members: [...block.data.members, { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200' }]})} className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
                <Icons.Plus size={32} />
             </button>
          )}
       </div>
    </div>
  )
}

export const StatsRenderer: React.FC<{ block: StatsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-primary text-white">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10 text-white/90">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent text-white" />}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {block.data.items.map((item, idx) => (
             <div key={idx} className="text-center group relative">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">{isPreview ? item.value : <input value={item.value} onChange={e=>{const n=[...block.data.items]; n[idx].value=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="bg-transparent text-center w-full" />}</div>
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">{isPreview ? item.label : <input value={item.label} onChange={e=>{const n=[...block.data.items]; n[idx].label=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="bg-transparent text-center w-full" />}</div>
                {!isPreview && <button onClick={()=>{const n=[...block.data.items]; n.splice(idx,1); onUpdate(block.id, {...block.data, items:n})}} className="absolute top-0 right-0 text-red-300 opacity-0 group-hover:opacity-100"><Icons.X size={12}/></button>}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items:[...block.data.items, {id:uuidv4(), label:'Label', value:'100', icon:'Star'}]})} className="border-2 border-white/20 rounded-xl flex items-center justify-center text-white/50 hover:bg-white/10"><Icons.Plus/></button>}
       </div>
    </div>
  )
}

export const TimeRenderer: React.FC<{ block: TimeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  return (
    <div className="py-4 px-6 text-center" style={{ backgroundColor: block.data.bgColor, color: block.data.textColor }}>
       <div className="text-3xl font-mono font-bold tracking-widest">
          {time.toLocaleTimeString([], { hour12: block.data.format === '12h' })}
       </div>
       {block.data.showDate && <div className="text-sm opacity-80 mt-1">{time.toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
       {!isPreview && (
          <div className="mt-2 flex justify-center gap-2">
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} className="w-6 h-6 rounded overflow-hidden" />
             <input type="color" value={block.data.textColor} onChange={e=>onUpdate(block.id, {...block.data, textColor: e.target.value})} className="w-6 h-6 rounded overflow-hidden" />
          </div>
       )}
    </div>
  )
}

export const VisitorRenderer: React.FC<{ block: VisitorBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="p-4 bg-white border rounded-xl shadow-sm inline-flex items-center gap-3">
       <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Icons.Eye size={20} /></div>
       <div>
          <div className="text-xs text-gray-500 uppercase font-bold">{block.data.label}</div>
          <div className="font-mono font-bold text-xl">{block.data.count.toLocaleString()}</div>
       </div>
       {!isPreview && <input type="number" value={block.data.count} onChange={e=>onUpdate(block.id, {...block.data, count: parseInt(e.target.value)})} className="w-20 border rounded p-1 ml-2 text-sm" />}
    </div>
  )
}

export const CalendarRenderer: React.FC<{ block: CalendarBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-white">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
       <div className="max-w-3xl mx-auto space-y-4">
          {block.data.events.map((ev, idx) => (
             <div key={idx} className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow group relative bg-gray-50">
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center w-20 shrink-0 text-center shadow-sm">
                   <span className="text-xs font-bold text-red-500 uppercase">{isPreview ? ev.month : <input value={ev.month} onChange={e=>{const n=[...block.data.events]; n[idx].month=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="w-full text-center bg-transparent" />}</span>
                   <span className="text-2xl font-bold text-gray-800">{isPreview ? ev.date : <input value={ev.date} onChange={e=>{const n=[...block.data.events]; n[idx].date=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="w-full text-center bg-transparent" />}</span>
                </div>
                <div className="flex-1">
                   {isPreview ? <h4 className="font-bold text-lg">{ev.title}</h4> : <input value={ev.title} onChange={e=>{const n=[...block.data.events]; n[idx].title=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="font-bold text-lg w-full bg-transparent" />}
                   {isPreview ? <p className="text-gray-600 text-sm mt-1">{ev.desc}</p> : <input value={ev.desc} onChange={e=>{const n=[...block.data.events]; n[idx].desc=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="text-gray-600 text-sm w-full bg-transparent" />}
                </div>
                {!isPreview && <button onClick={()=>{const n=[...block.data.events]; n.splice(idx,1); onUpdate(block.id, {...block.data, events:n})}} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><Icons.Trash2 size={14}/></button>}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, events:[...block.data.events, {date:'1', month:'JAN', title:'Acara Baru', desc:'Keterangan'}]})} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-400 hover:text-primary hover:border-primary">Tambah Acara</button>}
       </div>
    </div>
  )
}

export const DownloadsRenderer: React.FC<{ block: DownloadsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Icons.Download /> {block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full bg-transparent" />}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {block.data.items.map((item, idx) => (
             <a href={isPreview ? item.url : '#'} key={idx} className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:bg-blue-50 transition-colors group relative">
                <div className="bg-blue-100 text-primary p-3 rounded-lg font-bold text-xs">{item.type}</div>
                <div className="flex-1 overflow-hidden">
                   {isPreview ? <div className="font-medium truncate">{item.title}</div> : <input value={item.title} onChange={e=>{const n=[...block.data.items]; n[idx].title=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="w-full bg-transparent font-medium" />}
                </div>
                {!isPreview && (
                   <div className="absolute right-2 flex gap-2 opacity-0 group-hover:opacity-100 bg-white p-1 shadow rounded">
                      <input value={item.url} onChange={e=>{const n=[...block.data.items]; n[idx].url=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="text-xs border w-24" placeholder="URL" />
                      <button onClick={()=>{const n=[...block.data.items]; n.splice(idx,1); onUpdate(block.id, {...block.data, items:n})}} className="text-red-500"><Icons.Trash2 size={12}/></button>
                   </div>
                )}
             </a>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items:[...block.data.items, {title:'Dokumen Baru', url:'#', type:'PDF'}]})} className="p-4 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 hover:text-primary"><Icons.Plus /></button>}
       </div>
    </div>
  )
}

export const FaqRenderer: React.FC<{ block: FaqBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  return (
    <div className="py-12 px-6 max-w-3xl mx-auto">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-8 w-full bg-transparent" />}
       <div className="space-y-4">
          {block.data.items.map((item, idx) => (
             <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden group">
                <button onClick={()=>setOpenIdx(openIdx === idx ? null : idx)} className="w-full text-left p-4 bg-white hover:bg-gray-50 font-bold flex justify-between items-center">
                   {isPreview ? item.question : <input value={item.question} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.items]; n[idx].question=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="w-full bg-transparent" />}
                   <Icons.ChevronDown className={`transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`bg-gray-50 p-4 text-gray-600 text-sm leading-relaxed ${openIdx === idx || !isPreview ? 'block' : 'hidden'}`}>
                   {isPreview ? item.answer : <textarea value={item.answer} onChange={e=>{const n=[...block.data.items]; n[idx].answer=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="w-full h-20 bg-transparent border p-1" />}
                   {!isPreview && <button onClick={()=>{const n=[...block.data.items]; n.splice(idx,1); onUpdate(block.id, {...block.data, items:n})}} className="text-red-500 text-xs mt-2 flex items-center gap-1"><Icons.Trash2 size={12}/> Padam</button>}
                </div>
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items:[...block.data.items, {question:'Soalan?', answer:'Jawapan...'}]})} className="w-full p-3 border-2 border-dashed rounded-xl text-center text-gray-400 hover:text-primary">Tambah Soalan</button>}
       </div>
    </div>
  )
}

export const CtaRenderer: React.FC<{ block: CtaBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-6 text-center text-white" style={{ backgroundColor: block.data.bgColor }}>
       <div className="max-w-4xl mx-auto">
          {isPreview ? <h2 className="text-3xl md:text-4xl font-bold mb-8">{block.data.text}</h2> : <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="text-3xl font-bold mb-8 w-full bg-transparent text-center text-white" />}
          <a href={isPreview ? block.data.buttonLink : '#'} className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95">
             {isPreview ? block.data.buttonLabel : <input value={block.data.buttonLabel} onChange={e=>onUpdate(block.id, {...block.data, buttonLabel: e.target.value})} className="bg-transparent text-center w-32 text-gray-900" onClick={e=>e.preventDefault()} />}
          </a>
       </div>
       {!isPreview && (
          <div className="mt-8 flex justify-center gap-4">
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
             <input value={block.data.buttonLink} onChange={e=>onUpdate(block.id, {...block.data, buttonLink: e.target.value})} placeholder="Pautan Butang" className="text-black px-2 rounded" />
          </div>
       )}
    </div>
  )
}

export const CountdownRenderer: React.FC<{ block: CountdownBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  // Simple countdown logic
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({days:0, hours:0, minutes:0, seconds:0});
  
  useEffect(() => {
    const target = new Date(block.data.targetDate).getTime();
    const timer = setInterval(() => {
       const now = new Date().getTime();
       const dist = target - now;
       if (dist < 0) {
          setTimeLeft({days:0, hours:0, minutes:0, seconds:0});
       } else {
          setTimeLeft({
             days: Math.floor(dist / (1000 * 60 * 60 * 24)),
             hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
             minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
             seconds: Math.floor((dist % (1000 * 60)) / 1000)
          });
       }
    }, 1000);
    return () => clearInterval(timer);
  }, [block.data.targetDate]);

  return (
    <div className="py-12 px-6 bg-gray-900 text-white text-center">
       {isPreview ? <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-gray-400">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-xl font-bold mb-8 w-full bg-transparent text-center text-gray-400 uppercase tracking-widest" />}
       <div className="flex justify-center gap-4 md:gap-12">
          {Object.entries(timeLeft).map(([label, val]) => (
             <div key={label} className="flex flex-col items-center">
                <div className="text-4xl md:text-6xl font-bold font-mono bg-gray-800 p-4 rounded-xl shadow-inner mb-2 border border-gray-700">{String(val).padStart(2, '0')}</div>
                <div className="text-xs uppercase font-bold text-gray-500">{label}</div>
             </div>
          ))}
       </div>
       {!isPreview && <input type="date" value={block.data.targetDate} onChange={e=>onUpdate(block.id, {...block.data, targetDate: e.target.value})} className="mt-8 text-black p-2 rounded" />}
    </div>
  )
}

export const NoticeRenderer: React.FC<{ block: NoticeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    green: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`p-6 m-6 rounded-xl border-l-4 shadow-sm ${colorClasses[block.data.color]}`}>
       <div className="flex items-start gap-4">
          <Icons.Info size={24} className="mt-1 shrink-0 opacity-50" />
          <div className="flex-1">
             {isPreview ? <h4 className="font-bold text-lg mb-2">{block.data.title}</h4> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg w-full bg-transparent mb-2" />}
             {isPreview ? <p className="leading-relaxed opacity-90">{block.data.content}</p> : <textarea value={block.data.content} onChange={e=>onUpdate(block.id, {...block.data, content: e.target.value})} className="w-full bg-transparent h-20" />}
          </div>
       </div>
       {!isPreview && (
          <div className="mt-4 flex gap-2">
             {(['yellow', 'blue', 'red', 'green'] as const).map(c => (
                <button key={c} onClick={()=>onUpdate(block.id, {...block.data, color: c})} className={`w-6 h-6 rounded-full border ${c === 'yellow' ? 'bg-yellow-200' : c === 'blue' ? 'bg-blue-200' : c === 'red' ? 'bg-red-200' : 'bg-green-200'}`} />
             ))}
          </div>
       )}
    </div>
  )
}

export const TableRenderer: React.FC<{ block: TableBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateRow = (idx: number, col: 'col1' | 'col2' | 'col3', val: string) => {
    const r = [...block.data.rows];
    r[idx] = { ...r[idx], [col]: val };
    onUpdate(block.id, { ...block.data, rows: r });
  };

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto">
       {isPreview ? <h2 className="text-2xl font-bold mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full bg-transparent" />}
       <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b">
                <tr>
                   {block.data.headers.map((h, i) => (
                      <th key={i} className="p-4 font-bold text-gray-700">{isPreview ? h : <input value={h} onChange={e=>{const n=[...block.data.headers]; n[i]=e.target.value; onUpdate(block.id, {...block.data, headers:n as any})}} className="bg-transparent w-full" />}</th>
                   ))}
                   {!isPreview && <th className="p-4 w-10"></th>}
                </tr>
             </thead>
             <tbody className="divide-y">
                {block.data.rows.map((row, idx) => (
                   <tr key={idx} className="bg-white hover:bg-gray-50">
                      <td className="p-4">{isPreview ? row.col1 : <input value={row.col1} onChange={e=>updateRow(idx, 'col1', e.target.value)} className="w-full bg-transparent" />}</td>
                      <td className="p-4">{isPreview ? row.col2 : <input value={row.col2} onChange={e=>updateRow(idx, 'col2', e.target.value)} className="w-full bg-transparent" />}</td>
                      <td className="p-4">{isPreview ? row.col3 : <input value={row.col3} onChange={e=>updateRow(idx, 'col3', e.target.value)} className="w-full bg-transparent" />}</td>
                      {!isPreview && <td className="p-4"><button onClick={()=>{const n=[...block.data.rows]; n.splice(idx,1); onUpdate(block.id, {...block.data, rows:n})}} className="text-red-400"><Icons.Trash2 size={14}/></button></td>}
                   </tr>
                ))}
             </tbody>
          </table>
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, rows:[...block.data.rows, {col1:'-', col2:'-', col3:'-'}]})} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-500 uppercase">Tambah Baris</button>}
       </div>
    </div>
  )
}

export const StaffGridRenderer: React.FC<{ block: StaffGridBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  // Similar to OrgChart but simpler grid
  const updateMember = (idx: number, field: string, val: string) => {
    const m = [...block.data.members];
    m[idx] = { ...m[idx], [field]: val };
    onUpdate(block.id, { ...block.data, members: m });
  };

  return (
    <div className="py-12 px-6 bg-white">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {block.data.members.map((m, idx) => (
             <div key={idx} className="group relative">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                   <img src={m.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   {!isPreview && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2"><input value={m.imageUrl} onChange={e=>updateMember(idx, 'imageUrl', e.target.value)} className="w-full text-xs" /></div>}
                </div>
                {isPreview ? <h4 className="font-bold text-sm truncate">{m.name}</h4> : <input value={m.name} onChange={e=>updateMember(idx, 'name', e.target.value)} className="font-bold text-sm w-full bg-transparent" />}
                {isPreview ? <p className="text-xs text-gray-500 truncate">{m.position}</p> : <input value={m.position} onChange={e=>updateMember(idx, 'position', e.target.value)} className="text-xs text-gray-500 w-full bg-transparent" />}
                {!isPreview && <button onClick={()=>{const n=[...block.data.members]; n.splice(idx,1); onUpdate(block.id,{...block.data, members:n})}} className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100"><Icons.X size={10}/></button>}
             </div>
          ))}
          {!isPreview && (
             <button onClick={()=>onUpdate(block.id, {...block.data, members: [...block.data.members, { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200' }]})} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
                <Icons.Plus size={32} />
             </button>
          )}
       </div>
    </div>
  )
}

export const TestimonialRenderer: React.FC<{ block: TestimonialBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-6 bg-blue-50 text-center">
       <div className="max-w-3xl mx-auto">
          <Icons.Quote size={48} className="mx-auto text-blue-200 mb-6" />
          {isPreview ? <p className="text-xl md:text-2xl font-serif italic text-gray-700 mb-8 leading-relaxed">"{block.data.quote}"</p> : <textarea value={block.data.quote} onChange={e=>onUpdate(block.id, {...block.data, quote: e.target.value})} className="text-xl font-serif italic text-center w-full bg-transparent h-32" />}
          
          <div className="flex flex-col items-center">
             <div className="w-12 h-1 bg-primary mb-4 rounded-full"></div>
             {isPreview ? <h4 className="font-bold text-lg">{block.data.author}</h4> : <input value={block.data.author} onChange={e=>onUpdate(block.id, {...block.data, author: e.target.value})} className="font-bold text-lg text-center bg-transparent" />}
             {isPreview ? <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">{block.data.role}</span> : <input value={block.data.role} onChange={e=>onUpdate(block.id, {...block.data, role: e.target.value})} className="text-sm text-gray-500 text-center bg-transparent uppercase font-bold" />}
          </div>
       </div>
    </div>
  )
}

export const LinkListRenderer: React.FC<{ block: LinkListBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-6 bg-white border border-gray-100 rounded-xl shadow-sm max-w-sm mx-auto w-full">
       {isPreview ? <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Icons.Link size={18} className="text-primary"/> {block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg mb-4 w-full bg-transparent" />}
       <ul className="space-y-2">
          {block.data.links.map((l, idx) => (
             <li key={idx} className="flex items-center gap-2 group">
                <Icons.ArrowUp className="rotate-45 text-gray-400 w-4 h-4" />
                {isPreview ? <a href={l.url} className="text-primary hover:underline underline-offset-4 flex-1">{l.label}</a> : <div className="flex-1 flex gap-1"><input value={l.label} onChange={e=>{const n=[...block.data.links]; n[idx].label=e.target.value; onUpdate(block.id, {...block.data, links:n})}} className="w-1/2 bg-gray-50 text-xs p-1" /><input value={l.url} onChange={e=>{const n=[...block.data.links]; n[idx].url=e.target.value; onUpdate(block.id, {...block.data, links:n})}} className="w-1/2 bg-gray-50 text-xs p-1" /></div>}
                {!isPreview && <button onClick={()=>{const n=[...block.data.links]; n.splice(idx,1); onUpdate(block.id, {...block.data, links:n})}} className="text-red-400"><Icons.X size={12}/></button>}
             </li>
          ))}
       </ul>
       {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, links:[...block.data.links, {label:'Pautan', url:'#'}]})} className="mt-4 text-xs font-bold text-primary flex items-center gap-1"><Icons.Plus size={12}/> Tambah</button>}
    </div>
  )
}

export const NewsRenderer: React.FC<{ block: NewsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full bg-transparent border-l-4 border-primary pl-4" />}
       <div className="space-y-6">
          {block.data.items.map((item, idx) => (
             <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow relative group">
                <div className="shrink-0 flex md:flex-col items-center gap-2 md:w-24 text-center">
                   <span className="text-2xl font-bold text-primary">{new Date(item.date).getDate()}</span>
                   <span className="text-xs font-bold uppercase text-gray-400">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                   <div className="mb-2">
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{item.tag}</span>
                   </div>
                   {isPreview ? <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3> : <input value={item.title} onChange={e=>{const n=[...block.data.items]; n[idx].title=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="font-bold text-lg mb-2 w-full bg-transparent" />}
                   {isPreview ? <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.content}</p> : <textarea value={item.content} onChange={e=>{const n=[...block.data.items]; n[idx].content=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="text-gray-600 text-sm w-full bg-transparent h-16" />}
                </div>
                {!isPreview && (
                   <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
                      <input type="date" value={item.date} onChange={e=>{const n=[...block.data.items]; n[idx].date=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="text-xs border rounded p-1" />
                      <button onClick={()=>{const n=[...block.data.items]; n.splice(idx,1); onUpdate(block.id, {...block.data, items:n})}} className="text-red-500 bg-white p-1 shadow rounded"><Icons.Trash2 size={14}/></button>
                   </div>
                )}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items:[...block.data.items, {id:uuidv4(), title:'Berita Baru', date: new Date().toISOString().split('T')[0], tag:'PENTADBIRAN', content:'Isi kandungan...'}]})} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-400 hover:text-primary hover:border-primary">Tambah Berita</button>}
       </div>
    </div>
  )
}

export const DefinitionRenderer: React.FC<{ block: DefinitionBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
       <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 shrink-0 relative group">
             <img src={block.data.imageUrl} className="w-full h-auto object-contain" />
             {!isPreview && <input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="absolute bottom-0 left-0 w-full text-xs bg-white/90 border" placeholder="Img URL" />}
          </div>
          <div className="flex-1">
             {isPreview ? <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full bg-transparent border-b pb-2" />}
             <dl className="space-y-4">
                {block.data.items.map((item, idx) => (
                   <div key={idx} className="group relative pl-4 border-l-2 border-gray-200 hover:border-primary transition-colors">
                      <dt className="font-bold text-gray-800">{isPreview ? item.term : <input value={item.term} onChange={e=>{const n=[...block.data.items]; n[idx].term=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="bg-transparent font-bold" />}</dt>
                      <dd className="text-gray-600 text-sm mt-1">{isPreview ? item.definition : <input value={item.definition} onChange={e=>{const n=[...block.data.items]; n[idx].definition=e.target.value; onUpdate(block.id, {...block.data, items:n})}} className="bg-transparent w-full text-sm" />}</dd>
                      {!isPreview && <button onClick={()=>{const n=[...block.data.items]; n.splice(idx,1); onUpdate(block.id, {...block.data, items:n})}} className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-red-400"><Icons.X size={12}/></button>}
                   </div>
                ))}
                {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items:[...block.data.items, {term:'Istilah', definition:'Maksud'}]})} className="text-xs font-bold text-primary">+ Tambah</button>}
             </dl>
          </div>
       </div>
    </div>
  )
}

export const DividerRenderer: React.FC<{ block: DividerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-4 px-6 w-full relative group">
       <hr style={{ borderTopStyle: block.data.style, borderColor: block.data.color, borderTopWidth: block.data.thickness }} />
       {!isPreview && (
          <div className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 bg-white p-1 shadow border flex gap-2">
             <select value={block.data.style} onChange={e=>onUpdate(block.id, {...block.data, style: e.target.value})} className="text-xs border rounded"><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>
             <input type="number" value={block.data.thickness} onChange={e=>onUpdate(block.id, {...block.data, thickness: parseInt(e.target.value)})} className="w-10 text-xs border rounded" />
             <input type="color" value={block.data.color} onChange={e=>onUpdate(block.id, {...block.data, color: e.target.value})} className="w-6 h-6 rounded" />
          </div>
       )}
    </div>
  )
}

export const SpacerRenderer: React.FC<{ block: SpacerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="w-full relative group bg-transparent hover:bg-gray-50/50 transition-colors border border-transparent hover:border-dashed hover:border-gray-200" style={{ height: block.data.height }}>
       {!isPreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
             <span className="text-xs text-gray-400 font-mono">{block.data.height}px</span>
          </div>
       )}
       {!isPreview && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white p-1 rounded shadow pointer-events-auto">
             <input type="range" min="10" max="200" value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: parseInt(e.target.value)})} className="w-24" />
          </div>
       )}
    </div>
  )
}

export const BlockRenderer: React.FC<RendererProps> = (props) => {
  const { block, ...rest } = props;
  switch (block.type) {
    case 'hero': return <HeroRenderer block={block as HeroBlock} {...rest} />;
    case 'title': return <TitleRenderer block={block as TitleBlock} {...rest} />;
    case 'navbar': return <NavbarRenderer block={block as NavbarBlock} {...rest} />;
    case 'history': return <HistoryRenderer block={block as HistoryBlock} {...rest} />;
    case 'audio': return <AudioRenderer block={block as AudioBlock} {...rest} />;
    case 'content': return <ContentRenderer block={block as ContentBlock} {...rest} />;
    case 'feature': return <FeatureRenderer block={block as unknown as FeatureBlock} {...rest} />;
    case 'gallery': return <GalleryRenderer block={block as unknown as GalleryBlock} {...rest} />;
    case 'contact': return <ContactRenderer block={block as unknown as ContactBlock} {...rest} />;
    case 'footer': return <FooterRenderer block={block as unknown as FooterBlock} {...rest} />;
    case 'html': return <HtmlRenderer block={block as unknown as HtmlBlock} {...rest} />;
    case 'drive': return <DriveRenderer block={block as unknown as DriveBlock} {...rest} />;
    case 'video': return <VideoRenderer block={block as unknown as VideoBlock} {...rest} />;
    case 'image': return <ImageRenderer block={block as unknown as ImageBlock} {...rest} />;
    case 'ticker': return <TickerRenderer block={block as unknown as TickerBlock} {...rest} />;
    case 'orgChart': return <OrgChartRenderer block={block as unknown as OrgChartBlock} {...rest} />;
    case 'stats': return <StatsRenderer block={block as unknown as StatsBlock} {...rest} />;
    case 'time': return <TimeRenderer block={block as unknown as TimeBlock} {...rest} />;
    case 'visitor': return <VisitorRenderer block={block as unknown as VisitorBlock} {...rest} />;
    case 'speech': return <SpeechRenderer block={block as unknown as SpeechBlock} {...rest} />;
    case 'calendar': return <CalendarRenderer block={block as unknown as CalendarBlock} {...rest} />;
    case 'downloads': return <DownloadsRenderer block={block as unknown as DownloadsBlock} {...rest} />;
    case 'faq': return <FaqRenderer block={block as unknown as FaqBlock} {...rest} />;
    case 'cta': return <CtaRenderer block={block as unknown as CtaBlock} {...rest} />;
    case 'countdown': return <CountdownRenderer block={block as unknown as CountdownBlock} {...rest} />;
    case 'notice': return <NoticeRenderer block={block as unknown as NoticeBlock} {...rest} />;
    case 'table': return <TableRenderer block={block as unknown as TableBlock} {...rest} />;
    case 'staffGrid': return <StaffGridRenderer block={block as unknown as StaffGridBlock} {...rest} />;
    case 'testimonial': return <TestimonialRenderer block={block as unknown as TestimonialBlock} {...rest} />;
    case 'linkList': return <LinkListRenderer block={block as unknown as LinkListBlock} {...rest} />;
    case 'news': return <NewsRenderer block={block as unknown as NewsBlock} {...rest} />;
    case 'definition': return <DefinitionRenderer block={block as unknown as DefinitionBlock} {...rest} />;
    case 'divider': return <DividerRenderer block={block as unknown as DividerBlock} {...rest} />;
    case 'spacer': return <SpacerRenderer block={block as unknown as SpacerBlock} {...rest} />;
    default: return <div className="p-10 bg-red-50 text-red-500 text-center">Block Type Not Recognized: {(block as any).type}</div>;
  }
};