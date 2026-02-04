import React, { useState, useEffect, useRef } from 'react';
import { 
  SectionBlock, HeroBlock, FeatureBlock, ContentBlock, GalleryBlock, 
  ContactBlock, FooterBlock, HtmlBlock, DriveBlock, VideoBlock, ImageBlock,
  TickerBlock, OrgChartBlock, StatsBlock, TimeBlock, VisitorBlock, SpeechBlock,
  CalendarBlock, DownloadsBlock, FaqBlock, CtaBlock, CountdownBlock, NoticeBlock,
  TableBlock, StaffGridBlock, TestimonialBlock, LinkListBlock, NewsBlock, DefinitionBlock, 
  DividerBlock, SpacerBlock, TitleBlock, NavbarBlock, HistoryBlock, AudioBlock, ButtonBlock,
  OrgMember, Page
} from '../../types';
import { getIconByName, Icons } from '../ui/Icons';
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
  <div className="bg-white/95 backdrop-blur p-3 rounded-xl shadow-xl border border-blue-100 text-xs flex flex-col gap-2 z-20 transition-all duration-300">
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
             <select value={block.data.style} onClick={e=>e.stopPropagation()} onChange={e => onUpdate(block.id, {...block.data, style: e.target.value})} className="text-xs border rounded text-black">
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
        <>
          {/* LEFT BOTTOM: BACKGROUND IMAGE URL */}
          <div className="absolute bottom-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageControl label="URL Gambar Latar" url={block.data.bgImage} onChange={(val) => onUpdate(block.id, { ...block.data, bgImage: val })} />
          </div>

          {/* RIGHT BOTTOM: OVERLAY & HEIGHT */}
          <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-end">
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
                  onClick={e=>e.stopPropagation()}
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
                  onClick={e=>e.stopPropagation()}
                />
             </div>
             <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
          </div>
        </>
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
      </div>
    </div>
  );
};

export const ButtonRenderer: React.FC<{ block: ButtonBlock } & RendererProps> = ({ block, isPreview, onUpdate, allPages, onSwitchPage }) => {
  const styles = {
    primary: 'bg-primary text-white hover:bg-blue-800 shadow-md',
    secondary: 'bg-secondary text-white hover:bg-yellow-500 shadow-md',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const alignClass = block.data.alignment === 'center' ? 'justify-center' : block.data.alignment === 'right' ? 'justify-end' : 'justify-start';

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) return;
    if (block.data.linkType === 'internal' && block.data.pageId && onSwitchPage) {
      onSwitchPage(block.data.pageId);
    }
  };

  const href = block.data.linkType === 'external' ? block.data.url : '#';
  const target = block.data.linkType === 'external' ? '_blank' : '_self';

  return (
    <div className={`py-6 px-6 flex ${alignClass} relative group`}>
      {isPreview ? (
         <a 
           href={href} 
           target={target}
           onClick={handleClick}
           className={`inline-block font-bold rounded-full transition-all active:scale-95 ${styles[block.data.style]} ${sizes[block.data.size]}`}
         >
           {block.data.label}
         </a>
      ) : (
         <div className={`inline-block font-bold rounded-full border border-dashed border-gray-300 relative ${styles[block.data.style]} ${sizes[block.data.size]}`}>
            <input 
              value={block.data.label} 
              onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} 
              className="bg-transparent text-center outline-none w-auto min-w-[100px]"
              placeholder="Label Button"
            />
         </div>
      )}

      {!isPreview && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-white p-3 rounded-lg shadow-xl border border-gray-100 z-10 flex flex-col gap-2 w-64">
           <div className="flex gap-1 bg-gray-100 p-1 rounded">
              <button onClick={()=>onUpdate(block.id, {...block.data, linkType: 'external'})} className={`flex-1 text-xs py-1 rounded ${block.data.linkType === 'external' ? 'bg-white shadow' : ''}`}>External</button>
              <button onClick={()=>onUpdate(block.id, {...block.data, linkType: 'internal'})} className={`flex-1 text-xs py-1 rounded ${block.data.linkType === 'internal' ? 'bg-white shadow' : ''}`}>Halaman</button>
           </div>
           
           {block.data.linkType === 'external' ? (
             <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} placeholder="https://example.com" className="text-xs border p-2 rounded" />
           ) : (
             <select value={block.data.pageId} onChange={e=>onUpdate(block.id, {...block.data, pageId: e.target.value})} className="text-xs border p-2 rounded">
                <option value="">Pilih Halaman...</option>
                {allPages?.map(p => (
                   <React.Fragment key={p.id}>
                     <option value={p.id}>{p.name}</option>
                     {p.subPages?.map(s => <option key={s.id} value={s.id}>-- {s.name}</option>)}
                   </React.Fragment>
                ))}
             </select>
           )}
           
           <div className="flex gap-2">
             <select value={block.data.style} onChange={e=>onUpdate(block.id, {...block.data, style: e.target.value})} className="flex-1 text-xs border p-1 rounded">
               <option value="primary">Primary</option>
               <option value="secondary">Secondary</option>
               <option value="outline">Outline</option>
             </select>
             <select value={block.data.size} onChange={e=>onUpdate(block.id, {...block.data, size: e.target.value})} className="flex-1 text-xs border p-1 rounded">
               <option value="sm">Kecil</option>
               <option value="md">Sederhana</option>
               <option value="lg">Besar</option>
             </select>
           </div>
           
           <div className="flex justify-between bg-gray-50 p-1 rounded">
             <button onClick={()=>onUpdate(block.id, {...block.data, alignment: 'left'})} className={`p-1 rounded ${block.data.alignment === 'left' ? 'bg-white shadow' : ''}`}><Icons.AlignLeft size={14}/></button>
             <button onClick={()=>onUpdate(block.id, {...block.data, alignment: 'center'})} className={`p-1 rounded ${block.data.alignment === 'center' ? 'bg-white shadow' : ''}`}><Icons.AlignCenter size={14}/></button>
             <button onClick={()=>onUpdate(block.id, {...block.data, alignment: 'right'})} className={`p-1 rounded ${block.data.alignment === 'right' ? 'bg-white shadow' : ''}`}><Icons.AlignRight size={14}/></button>
           </div>
        </div>
      )}
    </div>
  )
}

// --- MISSING RENDERERS IMPLEMENTATION ---

export const HistoryRenderer: React.FC<{ block: HistoryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 max-w-4xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold mb-6 text-center">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-6 w-full text-center bg-transparent border-b border-dashed" />}
      {isPreview ? <p className="leading-loose text-justify text-gray-700 whitespace-pre-wrap">{block.data.body}</p> : <textarea value={block.data.body} onChange={e=>onUpdate(block.id, {...block.data, body: e.target.value})} className="w-full h-48 border p-2 rounded bg-transparent" />}
    </div>
  )
}

export const AudioRenderer: React.FC<{ block: AudioBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-6 flex flex-col items-center">
      {isPreview ? <h3 className="font-bold mb-3">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold mb-3 text-center bg-transparent" />}
      <audio controls autoPlay={block.data.autoPlay} className="w-full max-w-md">
        <source src={block.data.audioUrl} type="audio/mpeg" />
      </audio>
      {!isPreview && (
        <div className="mt-2 flex gap-2">
          <input value={block.data.audioUrl} onChange={e=>onUpdate(block.id, {...block.data, audioUrl: e.target.value})} placeholder="URL Audio MP3" className="border p-1 rounded text-sm w-64" />
          <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={block.data.autoPlay} onChange={e=>onUpdate(block.id, {...block.data, autoPlay: e.target.checked})} /> AutoPlay</label>
        </div>
      )}
    </div>
  )
}

export const ContentRenderer: React.FC<{ block: ContentBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className={`py-8 px-6 text-${block.data.alignment}`}>
      {isPreview ? <h3 className={`${getSizeClass(block.data.fontSize, 'title')} font-bold mb-4`}>{block.data.title}</h3> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-2xl w-full bg-transparent mb-4" />}
      {isPreview ? (
        <div className={`${getSizeClass(block.data.fontSize, 'body')} whitespace-pre-wrap leading-relaxed text-gray-700`}>{block.data.body}</div>
      ) : (
        <textarea value={block.data.body} onChange={e => onUpdate(block.id, {...block.data, body: e.target.value})} className="w-full h-32 bg-transparent border p-2 rounded" />
      )}
      {!isPreview && (
        <div className="mt-2 flex gap-2 relative z-20">
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'left'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignLeft size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'center'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignCenter size={14}/></button>
             <button onClick={() => onUpdate(block.id, {...block.data, alignment: 'right'})} className="p-1 hover:bg-gray-100 rounded"><Icons.AlignRight size={14}/></button>
             <FontSizeControl value={block.data.fontSize} onChange={v => onUpdate(block.id, {...block.data, fontSize: v})} />
        </div>
      )}
    </div>
  )
}

export const FeatureRenderer: React.FC<{ block: FeatureBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
      {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
         {(block.data.features || []).map((f, i) => (
           <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border hover:shadow-lg transition-all bg-white relative group">
              <div className="bg-blue-50 p-4 rounded-full text-primary mb-4">{getIconByName(f.icon, "w-8 h-8")}</div>
              {isPreview ? <h4 className="font-bold text-xl mb-2">{f.title}</h4> : <input value={f.title} onChange={e=>{const n=[...block.data.features];n[i].title=e.target.value;onUpdate(block.id,{...block.data, features:n})}} className="font-bold text-xl mb-2 text-center bg-transparent w-full" />}
              {isPreview ? <p className="text-gray-600 text-sm">{f.description}</p> : <textarea value={f.description} onChange={e=>{const n=[...block.data.features];n[i].description=e.target.value;onUpdate(block.id,{...block.data, features:n})}} className="text-center w-full bg-transparent text-sm h-16" />}
              {!isPreview && (
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white shadow rounded p-1 flex flex-col gap-1">
                    <input value={f.icon} onChange={e=>{const n=[...block.data.features];n[i].icon=e.target.value;onUpdate(block.id,{...block.data, features:n})}} className="text-xs border p-1" placeholder="Icon Name" />
                    <input value={f.link || ''} onChange={e=>{const n=[...block.data.features];n[i].link=e.target.value;onUpdate(block.id,{...block.data, features:n})}} className="text-xs border p-1" placeholder="Link URL" />
                    <button onClick={()=>{const n=[...block.data.features];n.splice(i,1);onUpdate(block.id,{...block.data,features:n})}} className="text-red-500 text-xs">Delete</button>
                 </div>
              )}
           </div>
         ))}
         {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, features: [...(block.data.features || []), {title: 'Baru', description: 'Keterangan', icon: 'Star'}]})} className="border-2 border-dashed rounded-xl flex items-center justify-center p-10 text-gray-400">Tambah</button>}
      </div>
    </div>
  )
}

export const GalleryRenderer: React.FC<{ block: GalleryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
      {isPreview ? <h2 className="text-3xl font-bold text-center mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-8 w-full bg-transparent" />}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {(block.data.images || []).map((img, i) => (
            <div key={i} className="aspect-square relative group overflow-hidden rounded-xl">
               <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
               {!isPreview && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <input value={img} onChange={e=>{const n=[...block.data.images];n[i]=e.target.value;onUpdate(block.id,{...block.data, images:n})}} className="w-3/4 text-xs p-1 rounded" />
                     <button onClick={()=>{const n=[...block.data.images];n.splice(i,1);onUpdate(block.id,{...block.data, images:n})}} className="ml-2 bg-red-500 text-white p-1 rounded"><Icons.Trash2 size={12}/></button>
                  </div>
               )}
            </div>
         ))}
         {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, images: [...(block.data.images || []), 'https://picsum.photos/400']})} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400"><Icons.Plus size={32}/></button>}
      </div>
    </div>
  )
}

export const ContactRenderer: React.FC<{ block: ContactBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-gray-50 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      <div className="flex-1 space-y-6">
         {isPreview ? <h2 className="text-3xl font-bold">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold w-full bg-transparent" />}
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="bg-white p-2 rounded shadow-sm text-primary"><Icons.Mail /></div>
               {isPreview ? <span>{block.data.email}</span> : <input value={block.data.email} onChange={e=>onUpdate(block.id, {...block.data, email: e.target.value})} className="bg-transparent border-b w-full" />}
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-white p-2 rounded shadow-sm text-primary"><Icons.Phone /></div>
               {isPreview ? <span>{block.data.phone}</span> : <input value={block.data.phone} onChange={e=>onUpdate(block.id, {...block.data, phone: e.target.value})} className="bg-transparent border-b w-full" />}
            </div>
            <div className="flex items-start gap-3">
               <div className="bg-white p-2 rounded shadow-sm text-primary"><Icons.MapPin /></div>
               {isPreview ? <span>{block.data.address}</span> : <textarea value={block.data.address} onChange={e=>onUpdate(block.id, {...block.data, address: e.target.value})} className="bg-transparent border w-full h-20" />}
            </div>
         </div>
         
         {/* SOCIAL MEDIA SECTION */}
         <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">Ikuti Kami</h4>
            <div className="flex flex-wrap gap-3">
               {(block.data.socialLinks || []).map((link, i) => (
                  <div key={i} className="relative group">
                     <a href={isPreview ? link.url : '#'} target="_blank" rel="noreferrer" className="bg-white p-3 rounded-full shadow-sm text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:shadow-md">
                        {getIconByName(link.icon, "w-5 h-5")}
                     </a>
                     {!isPreview && (
                        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-xl border z-20 w-48 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="text-[10px] font-bold text-gray-400 mb-1">EDIT SOSIAL MEDIA</div>
                           <input value={link.icon} onChange={e => { const n = [...(block.data.socialLinks || [])]; n[i].icon = e.target.value; onUpdate(block.id, { ...block.data, socialLinks: n }); }} className="text-xs border p-1 rounded w-full mb-1" placeholder="Icon (e.g Facebook)" />
                           <input value={link.url} onChange={e => { const n = [...(block.data.socialLinks || [])]; n[i].url = e.target.value; onUpdate(block.id, { ...block.data, socialLinks: n }); }} className="text-xs border p-1 rounded w-full mb-1" placeholder="URL" />
                           <button onClick={() => { const n = [...(block.data.socialLinks || [])]; n.splice(i, 1); onUpdate(block.id, { ...block.data, socialLinks: n }); }} className="text-xs text-red-500 hover:underline w-full text-left">Padam</button>
                        </div>
                     )}
                  </div>
               ))}
               {!isPreview && (
                  <button 
                     onClick={() => onUpdate(block.id, { ...block.data, socialLinks: [...(block.data.socialLinks || []), { icon: 'Facebook', url: 'https://facebook.com' }] })}
                     className="bg-gray-100 p-3 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors border border-dashed border-gray-300"
                     title="Tambah Media Sosial"
                  >
                     <Icons.Plus size={20} />
                  </button>
               )}
            </div>
         </div>

      </div>
      <div className="flex-1 h-80 bg-gray-200 rounded-xl overflow-hidden relative group">
         <div dangerouslySetInnerHTML={{ __html: block.data.mapUrl }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
         {!isPreview && <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 p-4"><textarea value={block.data.mapUrl} onChange={e=>onUpdate(block.id, {...block.data, mapUrl: e.target.value})} className="w-full h-full text-xs p-2 rounded" placeholder="Paste Google Maps Embed Code here" /></div>}
      </div>
    </div>
  )
}

export const FooterRenderer: React.FC<{ block: FooterBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 bg-gray-900 text-white text-center">
       {isPreview ? <p className="text-sm opacity-70">{block.data.copyright}</p> : <input value={block.data.copyright} onChange={e=>onUpdate(block.id, {...block.data, copyright: e.target.value})} className="text-sm text-center bg-transparent w-full" />}
    </div>
  )
}

export const HtmlRenderer: React.FC<{ block: HtmlBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-6 px-4" style={{ minHeight: block.data.height }}>
       {isPreview ? (
         <div dangerouslySetInnerHTML={{ __html: block.data.code }} />
       ) : (
         <div className="border border-dashed border-gray-400 p-4 rounded bg-gray-50">
            <div className="mb-2 text-xs font-bold text-gray-500 uppercase">HTML / Embed Code</div>
            <textarea value={block.data.code} onChange={e=>onUpdate(block.id, {...block.data, code: e.target.value})} className="w-full h-32 font-mono text-xs p-2 border rounded" placeholder="<div>Code...</div>" />
            <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} className="mt-2 text-xs border p-1 w-24" placeholder="Height (px)" />
         </div>
       )}
    </div>
  )
}

export const DriveRenderer: React.FC<{ block: DriveBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 flex flex-col items-center">
       {isPreview ? <h3 className="font-bold mb-4">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold mb-4 text-center bg-transparent" />}
       <div className="w-full max-w-4xl border rounded-xl overflow-hidden shadow-sm" style={{ height: block.data.height }}>
          <iframe src={block.data.embedUrl} className="w-full h-full border-0" />
       </div>
       {!isPreview && (
         <div className="mt-2 flex gap-2 w-full max-w-xl">
            <input value={block.data.embedUrl} onChange={e=>onUpdate(block.id, {...block.data, embedUrl: e.target.value})} className="flex-1 border p-2 text-xs rounded" placeholder="Google Drive Embed URL" />
            <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} className="w-24 border p-2 text-xs rounded" placeholder="Height" />
         </div>
       )}
    </div>
  )
}

export const VideoRenderer: React.FC<{ block: VideoBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  // Convert normal YT link to embed if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
       {isPreview ? <h3 className="font-bold mb-4 text-center text-xl">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold mb-4 text-center w-full bg-transparent text-xl" />}
       <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
          <iframe src={getEmbedUrl(block.data.url)} className="w-full h-full" allowFullScreen />
          {!isPreview && <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 p-4"><input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} className="w-full p-2 rounded" placeholder="YouTube URL" /></div>}
       </div>
    </div>
  )
}

export const ImageRenderer: React.FC<{ block: ImageBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const widthClass = block.data.width === 'full' ? 'w-full' : block.data.width === 'large' ? 'max-w-5xl' : block.data.width === 'medium' ? 'max-w-3xl' : 'max-w-md';
  
  return (
    <div className="py-8 px-4 flex flex-col items-center">
       <div className={`${widthClass} relative group rounded-xl overflow-hidden shadow-lg`}>
          <img src={block.data.url} className={`w-full h-auto ${block.data.animation === 'zoom' ? 'hover:scale-105 transition-transform duration-700' : ''}`} />
          {block.data.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-center text-sm backdrop-blur-sm">
               {isPreview ? block.data.caption : <input value={block.data.caption} onChange={e=>onUpdate(block.id, {...block.data, caption: e.target.value})} className="bg-transparent text-center w-full text-white" />}
            </div>
          )}
          {!isPreview && (
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white p-2 rounded shadow flex flex-col gap-2 w-64">
                <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} className="text-xs border p-1 rounded" placeholder="Image URL" />
                <input value={block.data.caption} onChange={e=>onUpdate(block.id, {...block.data, caption: e.target.value})} className="text-xs border p-1 rounded" placeholder="Caption" />
                <select value={block.data.width} onChange={e=>onUpdate(block.id, {...block.data, width: e.target.value})} className="text-xs border p-1 rounded">
                   <option value="small">Kecil</option>
                   <option value="medium">Sederhana</option>
                   <option value="large">Besar</option>
                   <option value="full">Penuh</option>
                </select>
                <select value={block.data.animation} onChange={e=>onUpdate(block.id, {...block.data, animation: e.target.value})} className="text-xs border p-1 rounded">
                   <option value="none">Tiada Animasi</option>
                   <option value="zoom">Zoom Hover</option>
                </select>
             </div>
          )}
       </div>
    </div>
  )
}

export const TickerRenderer: React.FC<{ block: TickerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="w-full bg-primary text-white overflow-hidden flex h-10 items-center">
       <div className="bg-secondary text-primary font-bold px-4 h-full flex items-center z-10 shrink-0 shadow-md">
          {isPreview ? block.data.label : <input value={block.data.label} onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} className="bg-transparent w-20" />}
       </div>
       <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="whitespace-nowrap animate-marquee px-4 font-medium" style={{ animationDuration: `${30 - block.data.speed}s` }}>
             {isPreview ? block.data.text : <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="bg-transparent w-[500px] text-white placeholder-white/50" />}
          </div>
       </div>
       {!isPreview && <input type="range" min="1" max="25" value={block.data.speed} onChange={e=>onUpdate(block.id, {...block.data, speed: parseInt(e.target.value)})} className="w-20 mr-2" />}
    </div>
  )
}

export const StatsRenderer: React.FC<{ block: StatsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-primary/5">
      {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
      <div className="flex flex-wrap justify-center gap-6">
        {(block.data.items || []).map((item, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-64 text-center relative group hover:-translate-y-1 transition-transform">
              <div className="text-primary mx-auto mb-2 flex justify-center">{getIconByName(item.icon, "w-10 h-10")}</div>
              {isPreview ? <div className="text-4xl font-extrabold text-gray-800 mb-1">{item.value}</div> : <input value={item.value} onChange={e=>{const n=[...block.data.items];n[i].value=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-4xl font-extrabold text-center w-full" />}
              {isPreview ? <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.label}</div> : <input value={item.label} onChange={e=>{const n=[...block.data.items];n[i].label=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-sm font-bold text-center w-full bg-transparent" />}
              {!isPreview && (
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col bg-white shadow rounded p-1">
                    <input value={item.icon} onChange={e=>{const n=[...block.data.items];n[i].icon=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-xs border p-1 w-20" />
                    <button onClick={()=>{const n=[...block.data.items];n.splice(i,1);onUpdate(block.id,{...block.data, items:n})}} className="text-red-500 text-xs">Del</button>
                 </div>
              )}
           </div>
        ))}
        {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...(block.data.items || []), {id:uuidv4(), label:'Label', value:'100', icon:'Star'}]})} className="w-64 border-2 border-dashed rounded-2xl flex items-center justify-center text-gray-400">Tambah</button>}
      </div>
    </div>
  )
}

export const TimeRenderer: React.FC<{ block: TimeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  return (
    <div className={`py-4 px-6 flex items-center justify-${block.data.alignment}`} style={{ backgroundColor: block.data.bgColor, color: block.data.textColor }}>
       <div className="text-center">
          <div className="text-4xl font-mono font-bold tracking-widest leading-none">
             {time.toLocaleTimeString('en-US', { hour12: block.data.format === '12h' })}
          </div>
          {block.data.showDate && <div className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">{time.toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>}
       </div>
       {!isPreview && (
          <div className="ml-4 bg-white text-black p-2 rounded text-xs flex flex-col gap-1">
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} />
             <input type="color" value={block.data.textColor} onChange={e=>onUpdate(block.id, {...block.data, textColor: e.target.value})} />
             <select value={block.data.format} onChange={e=>onUpdate(block.id, {...block.data, format: e.target.value})}><option value="12h">12 Jam</option><option value="24h">24 Jam</option></select>
             <button onClick={()=>onUpdate(block.id, {...block.data, alignment: 'center'})}>Align Center</button>
          </div>
       )}
    </div>
  )
}

export const SpeechRenderer: React.FC<{ block: SpeechBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 max-w-5xl mx-auto">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
       <div className={`flex flex-col md:flex-row gap-8 items-${block.data.alignment === 'center' ? 'center' : 'start'}`}>
          <div className="shrink-0 relative group">
             <img src={block.data.imageUrl} className={`rounded-xl shadow-lg object-cover ${block.data.imageSize === 'small' ? 'w-48 h-64' : 'w-72 h-96'}`} />
             {!isPreview && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2"><input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="w-full text-xs" /></div>}
          </div>
          <div className="flex-1">
             <div className="relative bg-blue-50 p-8 rounded-2xl rounded-tl-none">
                <Icons.Quote className="absolute top-4 left-4 text-blue-200 w-10 h-10" />
                {isPreview ? <p className="relative z-10 text-gray-700 leading-relaxed whitespace-pre-wrap">{block.data.text}</p> : <textarea value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="w-full h-40 bg-transparent relative z-10" />}
             </div>
             <div className="mt-4 ml-4">
                {isPreview ? <div className="font-bold text-lg">{block.data.authorName}</div> : <input value={block.data.authorName} onChange={e=>onUpdate(block.id, {...block.data, authorName: e.target.value})} className="font-bold text-lg w-full bg-transparent" />}
                {isPreview ? <div className="text-sm text-gray-500 uppercase tracking-wider">{block.data.authorRole}</div> : <input value={block.data.authorRole} onChange={e=>onUpdate(block.id, {...block.data, authorRole: e.target.value})} className="text-sm w-full bg-transparent" />}
             </div>
          </div>
       </div>
    </div>
  )
}

export const DownloadsRenderer: React.FC<{ block: DownloadsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 max-w-4xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-8 w-full bg-transparent" />}
      <div className="grid gap-4">
        {(block.data.items || []).map((item, i) => (
           <a key={i} href={isPreview ? item.url : '#'} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 group relative bg-white">
              <div className="bg-red-100 text-red-600 p-3 rounded-lg mr-4"><Icons.FileText /></div>
              <div className="flex-1">
                 {isPreview ? <h4 className="font-bold">{item.title}</h4> : <input value={item.title} onChange={e=>{const n=[...block.data.items];n[i].title=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="font-bold w-full bg-transparent" />}
                 <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 font-bold">{item.type}</span>
              </div>
              <Icons.Download className="text-gray-400" />
              {!isPreview && (
                <div className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 flex gap-2">
                   <input value={item.url} onChange={e=>{const n=[...block.data.items];n[i].url=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-xs border p-1 w-40" placeholder="URL" />
                   <button onClick={()=>{const n=[...block.data.items];n.splice(i,1);onUpdate(block.id,{...block.data, items:n})}} className="text-red-500"><Icons.Trash2 size={14}/></button>
                </div>
              )}
           </a>
        ))}
        {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...(block.data.items || []), {title:'Dokumen Baru', url:'#', type:'PDF'}]})} className="border-2 border-dashed p-4 rounded-xl text-center text-gray-400">Tambah Muat Turun</button>}
      </div>
    </div>
  )
}

export const FaqRenderer: React.FC<{ block: FaqBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  return (
    <div className="py-12 px-6 max-w-3xl mx-auto">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
       <div className="space-y-4">
          {(block.data.items || []).map((item, i) => (
             <div key={i} className="border rounded-xl overflow-hidden bg-white">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left p-4 font-bold flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                   {isPreview ? item.question : <input value={item.question} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.items];n[i].question=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="w-full bg-transparent" />}
                   <Icons.ChevronDown className={`transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                {(openIdx === i || !isPreview) && (
                   <div className="p-4 border-t relative group">
                      {isPreview ? <p className="text-gray-600">{item.answer}</p> : <textarea value={item.answer} onChange={e=>{const n=[...block.data.items];n[i].answer=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="w-full h-20 bg-transparent" />}
                      {!isPreview && <button onClick={()=>{const n=[...block.data.items];n.splice(i,1);onUpdate(block.id,{...block.data, items:n})}} className="absolute top-2 right-2 text-red-500"><Icons.Trash2 size={14}/></button>}
                   </div>
                )}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...(block.data.items || []), {question:'Soalan?', answer:'Jawapan'}]})} className="w-full p-4 border-2 border-dashed rounded-xl text-gray-400">Tambah Soalan</button>}
       </div>
    </div>
  )
}

export const CtaRenderer: React.FC<{ block: CtaBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-6 text-center" style={{ backgroundColor: block.data.bgColor }}>
       {isPreview ? <h2 className="text-3xl font-bold text-white mb-6">{block.data.text}</h2> : <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="text-3xl font-bold text-white mb-6 w-full text-center bg-transparent" />}
       <a href={isPreview ? block.data.buttonLink : '#'} className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1">
          {isPreview ? block.data.buttonLabel : <input value={block.data.buttonLabel} onChange={e=>onUpdate(block.id, {...block.data, buttonLabel: e.target.value})} className="text-center w-32 bg-transparent" />}
       </a>
       {!isPreview && (
          <div className="mt-4 flex justify-center gap-2">
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} />
             <input value={block.data.buttonLink} onChange={e=>onUpdate(block.id, {...block.data, buttonLink: e.target.value})} placeholder="URL" className="p-1 rounded text-xs" />
          </div>
       )}
    </div>
  )
}

export const CountdownRenderer: React.FC<{ block: CountdownBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState<{d:number, h:number, m:number, s:number}>({d:0,h:0,m:0,s:0});

  useEffect(() => {
    const calc = () => {
       const diff = new Date(block.data.targetDate).getTime() - new Date().getTime();
       if (diff > 0) {
          setTimeLeft({
             d: Math.floor(diff / (1000 * 60 * 60 * 24)),
             h: Math.floor((diff / (1000 * 60 * 60)) % 24),
             m: Math.floor((diff / 1000 / 60) % 60),
             s: Math.floor((diff / 1000) % 60)
          });
       }
    };
    const t = setInterval(calc, 1000);
    calc();
    return () => clearInterval(t);
  }, [block.data.targetDate]);

  return (
    <div className="py-12 px-6 bg-primary text-white text-center">
       {isPreview ? <h3 className="text-2xl font-bold mb-8 uppercase tracking-widest">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-8 text-center bg-transparent text-white w-full" />}
       <div className="flex justify-center gap-4 md:gap-8">
          {Object.entries(timeLeft).map(([k, v]) => (
             <div key={k} className="flex flex-col items-center">
                <div className="text-4xl md:text-6xl font-bold font-mono bg-white/10 p-4 rounded-xl backdrop-blur-sm min-w-[80px] md:min-w-[120px]">{v.toString().padStart(2, '0')}</div>
                <div className="text-xs uppercase mt-2 font-bold opacity-60">{k === 'd' ? 'Hari' : k === 'h' ? 'Jam' : k === 'm' ? 'Minit' : 'Saat'}</div>
             </div>
          ))}
       </div>
       {!isPreview && <input type="date" value={block.data.targetDate} onChange={e=>onUpdate(block.id, {...block.data, targetDate: e.target.value})} className="mt-6 text-black p-2 rounded" />}
    </div>
  )
}

export const NoticeRenderer: React.FC<{ block: NoticeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const colors: any = {
     yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
     blue: 'bg-blue-50 border-blue-200 text-blue-900',
     red: 'bg-red-50 border-red-200 text-red-900',
     green: 'bg-green-50 border-green-200 text-green-900',
  };

  return (
    <div className={`p-6 m-6 rounded-xl border-l-4 shadow-sm ${colors[block.data.color]}`}>
       <div className="flex gap-4">
          <Icons.Info size={24} className="shrink-0 mt-1" />
          <div className="flex-1">
             {isPreview ? <h4 className="font-bold text-lg mb-1">{block.data.title}</h4> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg w-full bg-transparent" />}
             {isPreview ? <p className="opacity-90">{block.data.content}</p> : <textarea value={block.data.content} onChange={e=>onUpdate(block.id, {...block.data, content: e.target.value})} className="w-full h-20 bg-transparent mt-1" />}
          </div>
       </div>
       {!isPreview && (
          <div className="mt-4 flex gap-2 justify-end">
             {Object.keys(colors).map(c => (
                <button key={c} onClick={()=>onUpdate(block.id, {...block.data, color: c})} className={`w-6 h-6 rounded-full ${colors[c].split(' ')[0]} border border-gray-300 ${block.data.color===c?'ring-2 ring-black':''}`}></button>
             ))}
          </div>
       )}
    </div>
  )
}

export const TestimonialRenderer: React.FC<{ block: TestimonialBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-white border border-gray-100 rounded-xl shadow-lg max-w-3xl mx-auto my-8 relative">
       <Icons.Quote className="text-gray-200 absolute top-4 left-4 w-16 h-16 -z-10" />
       <div className="text-center">
          {isPreview ? <p className="text-xl italic text-gray-700 mb-6 font-serif">"{block.data.quote}"</p> : <textarea value={block.data.quote} onChange={e=>onUpdate(block.id, {...block.data, quote: e.target.value})} className="text-xl italic text-center w-full h-24 bg-transparent" />}
          <div className="flex flex-col items-center">
             <div className="w-10 h-1 bg-primary rounded-full mb-3"></div>
             {isPreview ? <h4 className="font-bold">{block.data.author}</h4> : <input value={block.data.author} onChange={e=>onUpdate(block.id, {...block.data, author: e.target.value})} className="font-bold text-center w-full" placeholder="Nama" />}
             {isPreview ? <span className="text-xs text-gray-500 uppercase tracking-wider">{block.data.role}</span> : <input value={block.data.role} onChange={e=>onUpdate(block.id, {...block.data, role: e.target.value})} className="text-xs text-center w-full mt-1" placeholder="Jawatan" />}
          </div>
       </div>
    </div>
  )
}

export const NewsRenderer: React.FC<{ block: NewsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-3xl font-bold mb-8 flex items-center gap-2"><Icons.Newspaper className="text-primary"/> {block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-8 w-full bg-transparent" />}
       <div className="space-y-4">
          {(block.data.items || []).map((item, i) => (
             <div key={i} className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow group relative">
                <div className="bg-blue-50 text-primary font-bold text-center p-2 rounded-lg w-16 shrink-0 leading-tight">
                   <span className="text-xl block">{item.date.split('-')[2]}</span>
                   <span className="text-[10px] uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">{item.tag}</span>
                      {isPreview ? <h4 className="font-bold">{item.title}</h4> : <input value={item.title} onChange={e=>{const n=[...block.data.items];n[i].title=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="font-bold w-full" />}
                   </div>
                   {isPreview ? <p className="text-sm text-gray-600">{item.content}</p> : <textarea value={item.content} onChange={e=>{const n=[...block.data.items];n[i].content=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-sm w-full h-16 bg-transparent" />}
                </div>
                {!isPreview && (
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 bg-white shadow rounded p-1 z-10">
                      <input type="date" value={item.date} onChange={e=>{const n=[...block.data.items];n[i].date=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="text-[10px]" />
                      <button onClick={()=>{const n=[...block.data.items];n.splice(i,1);onUpdate(block.id,{...block.data, items:n})}} className="text-red-500 text-xs">Delete</button>
                   </div>
                )}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...(block.data.items || []), {id:uuidv4(), title:'Berita', date:'2024-01-01', tag:'UMUM', content:'Kandungan'}]})} className="w-full py-2 border-2 border-dashed rounded-lg text-gray-400">Tambah Berita</button>}
       </div>
    </div>
  )
}

export const DefinitionRenderer: React.FC<{ block: DefinitionBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 flex flex-col md:flex-row gap-10 items-center">
       <div className="w-64 shrink-0 relative group">
          <img src={block.data.imageUrl} className="w-full h-auto" />
          {!isPreview && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"><input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="w-3/4 text-xs p-1" /></div>}
       </div>
       <div className="flex-1">
          {isPreview ? <h2 className="text-3xl font-bold mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-6 w-full bg-transparent" />}
          <div className="grid gap-6">
             {(block.data.items || []).map((item, i) => (
                <div key={i} className="flex gap-4 group relative">
                   <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0"></div>
                   <div>
                      {isPreview ? <h4 className="font-bold text-lg">{item.term}</h4> : <input value={item.term} onChange={e=>{const n=[...block.data.items];n[i].term=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="font-bold text-lg w-full bg-transparent" />}
                      {isPreview ? <p className="text-gray-600">{item.definition}</p> : <textarea value={item.definition} onChange={e=>{const n=[...block.data.items];n[i].definition=e.target.value;onUpdate(block.id,{...block.data, items:n})}} className="w-full h-16 bg-transparent" />}
                   </div>
                   {!isPreview && <button onClick={()=>{const n=[...block.data.items];n.splice(i,1);onUpdate(block.id,{...block.data, items:n})}} className="absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100"><Icons.Trash2 size={14}/></button>}
                </div>
             ))}
             {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...(block.data.items || []), {term:'Istilah', definition:'Maksud'}]})} className="text-sm text-primary font-bold">+ Tambah</button>}
          </div>
       </div>
    </div>
  )
}

export const DividerRenderer: React.FC<{ block: DividerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-4 px-6 relative group">
       <hr style={{ borderTopStyle: block.data.style as any, borderColor: block.data.color, borderWidth: `${block.data.thickness}px` }} />
       {!isPreview && (
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-white shadow rounded p-1 flex gap-2 border">
             <select value={block.data.style} onChange={e=>onUpdate(block.id, {...block.data, style: e.target.value})} className="text-xs border p-1 rounded">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
             </select>
             <input type="number" value={block.data.thickness} onChange={e=>onUpdate(block.id, {...block.data, thickness: parseInt(e.target.value)})} className="w-12 text-xs border p-1 rounded" />
             <input type="color" value={block.data.color} onChange={e=>onUpdate(block.id, {...block.data, color: e.target.value})} className="w-6 h-6 rounded" />
          </div>
       )}
    </div>
  )
}

export const SpacerRenderer: React.FC<{ block: SpacerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="relative group hover:bg-gray-50 transition-colors" style={{ height: block.data.height }}>
       {!isPreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
             <span className="text-xs font-bold text-gray-400 mr-2">Tinggi:</span>
             <input type="range" min="10" max="200" value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: parseInt(e.target.value)})} className="w-32" />
             <span className="text-xs font-mono ml-2">{block.data.height}px</span>
          </div>
       )}
    </div>
  )
}

// --- END RENDERERS ---

export const CalendarRenderer: React.FC<{ block: CalendarBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [today, setToday] = useState<{gregorian: string, hijri: string} | null>(null);

  useEffect(() => {
    const date = new Date();
    // Gregorian
    const gDate = new Intl.DateTimeFormat('ms-MY', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    }).format(date);
    
    // Hijri
    const hDate = new Intl.DateTimeFormat('ms-MY-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);

    setToday({ gregorian: gDate, hijri: hDate });
  }, []);

  return (
    <div className="py-12 px-6 bg-white">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-6 w-full bg-transparent" />}
       
       {/* CALENDAR HEADER (Hijri & Masihi) */}
       <div className="max-w-3xl mx-auto mb-10 bg-gradient-to-r from-primary to-blue-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl"><Icons.Calendar size={32} /></div>
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80 font-bold">Hari Ini</div>
              <div className="text-xl md:text-2xl font-bold">{today?.gregorian}</div>
            </div>
          </div>
          <div className="bg-white/10 h-px w-full md:w-px md:h-12"></div>
          <div className="text-center md:text-right">
             <div className="text-xs uppercase tracking-widest opacity-80 font-bold">Takwim Hijrah</div>
             <div className="text-xl md:text-2xl font-serif text-secondary">{today?.hijri}</div>
          </div>
       </div>

       <div className="max-w-3xl mx-auto space-y-4">
          {(block.data.events || []).map((ev, idx) => (
             <div key={idx} className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow group relative bg-gray-50">
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center w-20 shrink-0 text-center shadow-sm">
                   <span className="text-xs font-bold text-red-500 uppercase">{isPreview ? ev.month : <input value={ev.month} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.events]; n[idx].month=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="w-full text-center bg-transparent" />}</span>
                   <span className="text-2xl font-bold text-gray-800">{isPreview ? ev.date : <input value={ev.date} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.events]; n[idx].date=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="w-full text-center bg-transparent" />}</span>
                </div>
                <div className="flex-1">
                   {isPreview ? <h4 className="font-bold text-lg">{ev.title}</h4> : <input value={ev.title} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.events]; n[idx].title=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="font-bold text-lg w-full bg-transparent" />}
                   {isPreview ? <p className="text-gray-600 text-sm mt-1">{ev.desc}</p> : <input value={ev.desc} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.events]; n[idx].desc=e.target.value; onUpdate(block.id,{...block.data, events:n})}} className="text-gray-600 text-sm w-full bg-transparent" />}
                </div>
                {!isPreview && <button onClick={()=>{const n=[...block.data.events]; n.splice(idx,1); onUpdate(block.id, {...block.data, events:n})}} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><Icons.Trash2 size={14}/></button>}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, events:[...(block.data.events || []), {date:'1', month:'JAN', title:'Acara Baru', desc:'Keterangan'}]})} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-400 hover:text-primary hover:border-primary">Tambah Acara</button>}
       </div>
    </div>
  )
}

export const VisitorRenderer: React.FC<{ block: VisitorBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="p-4 bg-white border rounded-xl shadow-sm inline-flex items-center gap-3 relative group">
       <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Icons.Eye size={20} /></div>
       <div>
          <div className="text-xs text-gray-500 uppercase font-bold">{block.data.label}</div>
          <div className="font-mono font-bold text-xl">{block.data.count.toLocaleString()}</div>
       </div>
       {!isPreview && (
         <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 bg-white shadow rounded border">
           <input type="number" value={block.data.count} onClick={e=>e.stopPropagation()} onChange={e=>onUpdate(block.id, {...block.data, count: parseInt(e.target.value)})} className="w-20 border rounded p-1 text-sm" />
           <input value={block.data.label} onClick={e=>e.stopPropagation()} onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} className="w-20 border rounded p-1 text-xs mt-1" />
         </div>
       )}
    </div>
  )
}

export const OrgChartRenderer: React.FC<{ block: OrgChartBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateMember = (idx: number, field: string, val: string) => {
    const m = [...(block.data.members || [])];
    m[idx] = { ...m[idx], [field]: val };
    onUpdate(block.id, { ...block.data, members: m });
  };

  return (
    <div className="py-12 px-6">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-12">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-12 w-full bg-transparent" />}
       <div className="flex flex-wrap justify-center gap-8">
          {(block.data.members || []).map((m, idx) => (
             <div key={idx} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-48 relative group hover:-translate-y-2 transition-transform">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-primary bg-gray-100">
                   <img src={m.imageUrl} className="w-full h-full object-cover" />
                </div>
                {isPreview ? <h4 className="font-bold text-center leading-tight">{m.name}</h4> : <input value={m.name} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'name', e.target.value)} className="font-bold text-center w-full text-sm bg-transparent" />}
                {isPreview ? <span className="text-xs text-primary font-bold uppercase tracking-wider mt-1 text-center">{m.position}</span> : <input value={m.position} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'position', e.target.value)} className="text-xs text-primary font-bold text-center w-full bg-transparent" />}
                
                {!isPreview && (
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 bg-white/90 p-1 rounded shadow z-10">
                      <input value={m.imageUrl} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'imageUrl', e.target.value)} className="text-[9px] w-32 border p-1" placeholder="Img URL" />
                      <button onClick={()=>{const n=[...block.data.members]; n.splice(idx,1); onUpdate(block.id,{...block.data, members:n})}} className="bg-red-500 text-white text-[9px] rounded p-1">Padam</button>
                   </div>
                )}
             </div>
          ))}
          {!isPreview && (
             <button onClick={()=>onUpdate(block.id, {...block.data, members: [...(block.data.members || []), { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200' }]})} className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
                <Icons.Plus size={32} />
             </button>
          )}
       </div>
    </div>
  )
}

export const StaffGridRenderer: React.FC<{ block: StaffGridBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateMember = (idx: number, field: string, val: string) => {
    const m = [...(block.data.members || [])];
    m[idx] = { ...m[idx], [field]: val };
    onUpdate(block.id, { ...block.data, members: m });
  };

  return (
    <div className="py-12 px-6 bg-white">
       {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center mb-10 w-full bg-transparent" />}
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {(block.data.members || []).map((m, idx) => (
             <div key={idx} className="group relative">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                   <img src={m.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   {!isPreview && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2"><input value={m.imageUrl} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'imageUrl', e.target.value)} className="w-full text-xs p-1" placeholder="URL Gambar" /></div>}
                </div>
                {isPreview ? <h4 className="font-bold text-sm truncate">{m.name}</h4> : <input value={m.name} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'name', e.target.value)} className="font-bold text-sm w-full bg-transparent border-b border-transparent hover:border-gray-200" />}
                {isPreview ? <p className="text-xs text-gray-500 truncate">{m.position}</p> : <input value={m.position} onClick={e=>e.stopPropagation()} onChange={e=>updateMember(idx, 'position', e.target.value)} className="text-xs text-gray-500 w-full bg-transparent border-b border-transparent hover:border-gray-200" />}
                {!isPreview && <button onClick={()=>{const n=[...block.data.members]; n.splice(idx,1); onUpdate(block.id,{...block.data, members:n})}} className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 z-10"><Icons.X size={10}/></button>}
             </div>
          ))}
          {!isPreview && (
             <button onClick={()=>onUpdate(block.id, {...block.data, members: [...(block.data.members || []), { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200' }]})} className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
                <Icons.Plus size={32} />
             </button>
          )}
       </div>
    </div>
  )
}

export const LinkListRenderer: React.FC<{ block: LinkListBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-6 bg-white border border-gray-100 rounded-xl shadow-sm max-w-sm mx-auto w-full">
       {isPreview ? <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Icons.Link size={18} className="text-primary"/> {block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg mb-4 w-full bg-transparent" />}
       <ul className="space-y-2">
          {(block.data.links || []).map((l, idx) => (
             <li key={idx} className="flex items-center gap-2 group">
                <Icons.ArrowUp className="rotate-45 text-gray-400 w-4 h-4" />
                {isPreview ? <a href={l.url} className="text-primary hover:underline underline-offset-4 flex-1">{l.label}</a> : <div className="flex-1 flex gap-1"><input value={l.label} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.links]; n[idx].label=e.target.value; onUpdate(block.id, {...block.data, links:n})}} className="w-1/2 bg-gray-50 text-xs p-1 rounded border" placeholder="Label" /><input value={l.url} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.links]; n[idx].url=e.target.value; onUpdate(block.id, {...block.data, links:n})}} className="w-1/2 bg-gray-50 text-xs p-1 rounded border" placeholder="URL" /></div>}
                {!isPreview && <button onClick={()=>{const n=[...block.data.links]; n.splice(idx,1); onUpdate(block.id, {...block.data, links:n})}} className="text-red-400"><Icons.X size={12}/></button>}
             </li>
          ))}
       </ul>
       {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, links:[...(block.data.links || []), {label:'Pautan', url:'#'}]})} className="mt-4 text-xs font-bold text-primary flex items-center gap-1"><Icons.Plus size={12}/> Tambah</button>}
    </div>
  )
}

export const TableRenderer: React.FC<{ block: TableBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const updateRow = (idx: number, col: 'col1' | 'col2' | 'col3', val: string) => {
    const r = [...(block.data.rows || [])];
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
                   {(block.data.headers || ["", "", ""]).map((h, i) => (
                      <th key={i} className="p-4 font-bold text-gray-700">{isPreview ? h : <input value={h} onClick={e=>e.stopPropagation()} onChange={e=>{const n=[...block.data.headers]; n[i]=e.target.value; onUpdate(block.id, {...block.data, headers:n as any})}} className="bg-transparent w-full" />}</th>
                   ))}
                   {!isPreview && <th className="p-4 w-10"></th>}
                </tr>
             </thead>
             <tbody className="divide-y">
                {(block.data.rows || []).map((row, idx) => (
                   <tr key={idx} className="bg-white hover:bg-gray-50">
                      <td className="p-4">{isPreview ? row.col1 : <input value={row.col1} onClick={e=>e.stopPropagation()} onChange={e=>updateRow(idx, 'col1', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-300" />}</td>
                      <td className="p-4">{isPreview ? row.col2 : <input value={row.col2} onClick={e=>e.stopPropagation()} onChange={e=>updateRow(idx, 'col2', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-300" />}</td>
                      <td className="p-4">{isPreview ? row.col3 : <input value={row.col3} onClick={e=>e.stopPropagation()} onChange={e=>updateRow(idx, 'col3', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-blue-300" />}</td>
                      {!isPreview && <td className="p-4"><button onClick={()=>{const n=[...block.data.rows]; n.splice(idx,1); onUpdate(block.id, {...block.data, rows:n})}} className="text-red-400"><Icons.Trash2 size={14}/></button></td>}
                   </tr>
                ))}
             </tbody>
          </table>
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, rows:[...(block.data.rows || []), {col1:'-', col2:'-', col3:'-'}]})} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-500 uppercase">Tambah Baris</button>}
       </div>
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
    case 'button': return <ButtonRenderer block={block as unknown as ButtonBlock} {...rest} />;
    default: return <div className="p-10 bg-red-50 text-red-500 text-center">Block Type Not Recognized: {(block as any).type}</div>;
  }
};