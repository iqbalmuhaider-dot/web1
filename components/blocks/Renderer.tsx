import React, { useState, useEffect, useRef } from 'react';
import { 
  SectionBlock, HeroBlock, FeatureBlock, ContentBlock, GalleryBlock, 
  ContactBlock, FooterBlock, HtmlBlock, DriveBlock, VideoBlock, ImageBlock,
  TickerBlock, OrgChartBlock, StatsBlock, TimeBlock, VisitorBlock, SpeechBlock,
  CalendarBlock, DownloadsBlock, FaqBlock, CtaBlock, CountdownBlock, NoticeBlock,
  TableBlock, StaffGridBlock, TestimonialBlock, LinkListBlock, NewsBlock, DefinitionBlock, 
  DividerBlock, SpacerBlock, TitleBlock, NavbarBlock, HistoryBlock, OrgMember, Page, FeatureItem, StatItem, FaqItem
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
      className="relative w-full flex flex-col items-center justify-center text-center text-white overflow-hidden group transition-all duration-300"
      style={{ minHeight: `${height}px` }}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${block.data.bgImage})` }}
      />
      <div 
        className="absolute inset-0 bg-primary transition-opacity duration-300" 
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

export const DividerRenderer: React.FC<{ block: DividerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-4 px-8 w-full group relative flex items-center justify-center h-full">
      <hr 
        className="w-full"
        style={{ 
          borderTopStyle: block.data.style, 
          borderColor: block.data.color, 
          borderTopWidth: `${block.data.thickness}px` 
        }} 
      />
      {!isPreview && (
        <div className="absolute top-0 right-0 -mt-8 bg-white p-2 rounded shadow flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 z-20">
           <select value={block.data.style} onChange={(e) => onUpdate(block.id, { ...block.data, style: e.target.value })} className="text-xs border rounded">
             <option value="solid">Solid</option>
             <option value="dashed">Dashed</option>
             <option value="dotted">Dotted</option>
           </select>
           <input type="color" value={block.data.color} onChange={(e) => onUpdate(block.id, { ...block.data, color: e.target.value })} className="w-6 h-6 border rounded cursor-pointer" />
           <input type="number" min="1" max="10" value={block.data.thickness} onChange={(e) => onUpdate(block.id, { ...block.data, thickness: parseInt(e.target.value) })} className="w-12 text-xs border rounded px-1" />
           <span className="text-[10px] text-gray-500">px</span>
        </div>
      )}
    </div>
  );
};

export const SpacerRenderer: React.FC<{ block: SpacerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div 
      className="w-full relative group transition-all" 
      style={{ height: `${block.data.height}px` }}
    >
      {!isPreview && (
        <div className="absolute inset-0 bg-gray-100/50 border border-dashed border-gray-300 flex items-center justify-center opacity-50 hover:opacity-100">
           <div className="bg-white px-2 py-1 rounded shadow text-xs flex gap-2 items-center">
             <Icons.ArrowUp size={10} />
             <input 
               type="range" 
               min="10" 
               max="200" 
               value={block.data.height} 
               onChange={(e) => onUpdate(block.id, { ...block.data, height: parseInt(e.target.value) })}
               className="w-24"
             />
             <span>{block.data.height}px</span>
             <Icons.ArrowDown size={10} />
           </div>
        </div>
      )}
    </div>
  );
};

export const OrgChartRenderer: React.FC<{ block: OrgChartBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;

    const newMembers = [...block.data.members];
    const [draggedItem] = newMembers.splice(draggedIdx, 1);
    newMembers.splice(dropIndex, 0, draggedItem);

    onUpdate(block.id, { ...block.data, members: newMembers });
    setDraggedIdx(null);
  };

  const fs = block.data.fontSize || 'md';
  const nameSize = fs === 'sm' ? 'text-sm' : fs === 'md' ? 'text-lg' : fs === 'lg' ? 'text-xl' : 'text-2xl';
  const roleSize = fs === 'sm' ? 'text-[10px]' : fs === 'md' ? 'text-xs' : fs === 'lg' ? 'text-sm' : 'text-base';

  const renderMember = (member: OrgMember, idx: number, isLeader: boolean) => (
    <div 
      key={member.id} 
      draggable={!isPreview}
      onDragStart={(e) => !isPreview && handleDragStart(e, idx)}
      onDragOver={(e) => !isPreview && handleDragOver(e, idx)}
      onDrop={(e) => !isPreview && handleDrop(e, idx)}
      className={`flex flex-col items-center group relative transition-all duration-300 ${!isPreview ? 'cursor-move hover:scale-105' : ''} ${isLeader ? 'w-64 mb-12 z-20' : 'w-48'}`}
    >
      <div className={`${isLeader ? 'w-48 h-48 border-8' : 'w-32 h-32 border-4'} rounded-full overflow-hidden border-white shadow-lg mb-4 relative bg-gray-100 flex-shrink-0`}>
        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
        {!isPreview && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <input value={member.imageUrl} onChange={(e) => { const nm = [...block.data.members]; nm[idx].imageUrl = e.target.value; onUpdate(block.id, { ...block.data, members: nm }); }} className="text-[10px] w-20 p-1 rounded" placeholder="URL" onClick={e=>e.stopPropagation()} />
            </div>
        )}
      </div>
      
      <div className={`text-center w-full ${isLeader ? 'bg-primary/5 p-4 rounded-xl' : ''}`}>
        {isPreview ? (
          <>
            <h3 className={`font-bold text-gray-900 ${isLeader ? nameSize.replace('text-','text-xl md:text-') : nameSize}`}>{member.name}</h3>
            <p className={`text-primary font-bold uppercase tracking-wider ${roleSize}`}>{member.position}</p>
          </>
        ) : (
          <div className="flex flex-col gap-1 w-full items-center">
            <input value={member.name} onChange={(e) => { const nm = [...block.data.members]; nm[idx].name = e.target.value; onUpdate(block.id, { ...block.data, members: nm }); }} className={`text-center font-bold bg-transparent border-b border-transparent hover:border-gray-300 outline-none ${nameSize}`} placeholder="Nama" onClick={e=>e.stopPropagation()} />
            <input value={member.position} onChange={(e) => { const nm = [...block.data.members]; nm[idx].position = e.target.value; onUpdate(block.id, { ...block.data, members: nm }); }} className={`text-center text-primary border-b border-transparent hover:border-blue-300 outline-none ${roleSize}`} placeholder="Jawatan" onClick={e=>e.stopPropagation()} />
            <button onClick={(e) => {e.stopPropagation(); const nm = block.data.members.filter(m => m.id !== member.id); onUpdate(block.id, { ...block.data, members: nm }); }} className="text-red-500 text-[10px] hover:underline">Padam</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-16 px-4 bg-white relative group">
      {!isPreview && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
        </div>
      )}
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {isPreview ? (
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 uppercase tracking-wide">{block.data.title}</h2>
        ) : (
          <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="block w-full text-center text-3xl font-bold mb-16 bg-transparent border-b-2 border-dashed border-blue-200 outline-none" placeholder="Tajuk Carta Organisasi" onClick={e=>e.stopPropagation()} />
        )}
        
        {block.data.members.length > 0 && (
           <div className="flex justify-center w-full relative">
              {block.data.members.length > 1 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-300 -mb-12"></div>}
              {renderMember(block.data.members[0], 0, true)}
           </div>
        )}

        {block.data.members.length > 1 && (
          <div className="mt-12 pt-12 border-t-2 border-gray-100 w-full relative">
             <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gray-300 -mt-[1px]"></div>
             <div className="flex justify-center gap-8 flex-wrap">
               {block.data.members.slice(1).map((member, idx) => (
                 <div key={member.id} className="relative pt-8">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-300"></div>
                    {renderMember(member, idx + 1, false)}
                 </div>
               ))}
             </div>
          </div>
        )}

        {!isPreview && (
          <button onClick={() => onUpdate(block.id, { ...block.data, members: [...block.data.members, { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200' }] })} className="mt-12 flex items-center gap-2 px-6 py-2 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50 transition-all">
            <Icons.UserPlus size={20} />
            <span className="font-bold text-sm">Tambah Ahli</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const FeatureRenderer: React.FC<{ block: FeatureBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 group relative">
       {!isPreview && (
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
        </div>
      )}
      {isPreview ? (
        <h2 className={`${getSizeClass(block.data.fontSize, 'title').replace('text-6xl','text-3xl')} font-bold text-center mb-8`}>{block.data.title}</h2>
      ) : (
        <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className={`${getSizeClass(block.data.fontSize, 'title').replace('text-6xl','text-3xl')} w-full text-center font-bold mb-8 border-b border-dashed outline-none bg-transparent`} placeholder="Title" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {block.data.features.map((f, i) => (
          <div key={i} className="p-4 border rounded-lg text-center bg-white shadow-sm hover:shadow-md transition-shadow relative group/item">
            {!isPreview && <button onClick={()=> {const nf=[...block.data.features]; nf.splice(i,1); onUpdate(block.id, {...block.data, features: nf})}} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover/item:opacity-100"><Icons.X size={14}/></button>}
            <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
               {getIconByName(f.icon, "w-6 h-6")}
            </div>
            {isPreview ? <h3 className="font-bold mb-1">{f.title}</h3> : <input value={f.title} onChange={e => {const nf=[...block.data.features]; nf[i].title=e.target.value; onUpdate(block.id, {...block.data, features: nf})}} className="text-center font-bold w-full border-b border-transparent hover:border-gray-200 outline-none mb-1" />}
            {isPreview ? <p className="text-sm text-gray-600">{f.description}</p> : <textarea value={f.description} onChange={e => {const nf=[...block.data.features]; nf[i].description=e.target.value; onUpdate(block.id, {...block.data, features: nf})}} className="text-center text-sm w-full border-b border-transparent hover:border-gray-200 outline-none resize-none" />}
            {isPreview && f.link && <a href={f.link} target="_blank" rel="noreferrer" className="inline-block mt-2 text-primary text-xs font-bold hover:underline">Buka Pautan &rarr;</a>}
            {!isPreview && <input value={f.link||''} placeholder="URL Pautan..." onChange={e => {const nf=[...block.data.features]; nf[i].link=e.target.value; onUpdate(block.id, {...block.data, features: nf})}} className="text-center text-xs w-full mt-2 text-blue-500" />}
          </div>
        ))}
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, {...block.data, features: [...block.data.features, {title: "Baru", description: "Desc", icon: "Star"}]})} className="p-4 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary">
            <Icons.Plus />
          </button>
        )}
      </div>
    </div>
  )
}

export const GalleryRenderer: React.FC<{ block: GalleryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4">
       {isPreview ? <h2 className="text-2xl font-bold text-center mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center text-2xl font-bold mb-6 bg-transparent outline-none" />}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {block.data.images.map((url, i) => (
           <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
             <img src={url} alt="" className="w-full h-full object-cover" />
             {!isPreview && (
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <input value={url} onChange={e=>{const ni=[...block.data.images]; ni[i]=e.target.value; onUpdate(block.id, {...block.data, images: ni})}} className="w-11/12 text-xs p-1 rounded" />
                  <button onClick={()=>{const ni=[...block.data.images]; ni.splice(i,1); onUpdate(block.id, {...block.data, images: ni})}} className="bg-red-500 text-white p-1 rounded"><Icons.Trash2 size={14}/></button>
               </div>
             )}
           </div>
         ))}
         {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, images: [...block.data.images, 'https://picsum.photos/400']})} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary"><Icons.Plus/></button>}
       </div>
    </div>
  )
}

export const ContactRenderer: React.FC<{ block: ContactBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-12 px-8 bg-gray-50 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
           {isPreview ? <h2 className="text-3xl font-bold text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold bg-transparent w-full" />}
           
           <div className="flex items-start gap-3 text-gray-600">
             <Icons.MapPin className="shrink-0 mt-1" />
             {isPreview ? <p>{block.data.address}</p> : <textarea value={block.data.address} onChange={e=>onUpdate(block.id, {...block.data, address: e.target.value})} className="w-full bg-transparent border rounded p-1" />}
           </div>
           <div className="flex items-center gap-3 text-gray-600">
             <Icons.Phone className="shrink-0" />
             {isPreview ? <p>{block.data.phone}</p> : <input value={block.data.phone} onChange={e=>onUpdate(block.id, {...block.data, phone: e.target.value})} className="w-full bg-transparent border rounded p-1" />}
           </div>
           <div className="flex items-center gap-3 text-gray-600">
             <Icons.Mail className="shrink-0" />
             {isPreview ? <p>{block.data.email}</p> : <input value={block.data.email} onChange={e=>onUpdate(block.id, {...block.data, email: e.target.value})} className="w-full bg-transparent border rounded p-1" />}
           </div>
        </div>
        <div className="flex-1 h-64 bg-gray-200 rounded-xl overflow-hidden relative group">
           {block.data.mapUrl ? (
             <div className="w-full h-full" dangerouslySetInnerHTML={{__html: block.data.mapUrl}} />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">Tiada Peta</div>
           )}
           {!isPreview && <textarea value={block.data.mapUrl} onChange={e=>onUpdate(block.id, {...block.data, mapUrl: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/90 p-4 text-xs font-mono border-2 border-primary" placeholder="Paste iframe embed code here..." />}
        </div>
     </div>
   )
}

export const FooterRenderer: React.FC<{ block: FooterBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-6 px-4 bg-gray-900 text-white text-center">
       {isPreview ? <p className="text-sm opacity-70">{block.data.copyright}</p> : <input value={block.data.copyright} onChange={e=>onUpdate(block.id, {...block.data, copyright: e.target.value})} className="bg-transparent text-center w-full text-sm text-gray-300" />}
    </div>
  )
}

export const HtmlRenderer: React.FC<{ block: HtmlBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="w-full relative group" style={{ minHeight: block.data.height || '100px' }}>
       {isPreview ? (
         <div dangerouslySetInnerHTML={{ __html: block.data.code }} />
       ) : (
         <div className="p-4 border-2 border-dashed border-gray-300 rounded bg-gray-50">
           <div className="text-xs font-bold text-gray-400 mb-2">HTML EMBED</div>
           <textarea value={block.data.code} onChange={e=>onUpdate(block.id, {...block.data, code: e.target.value})} className="w-full h-32 font-mono text-xs p-2 border rounded" placeholder="<code>...</code>" />
           <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} placeholder="Height (e.g. 200px)" className="mt-2 text-xs border rounded p-1" />
         </div>
       )}
     </div>
   )
}

export const DriveRenderer: React.FC<{ block: DriveBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="w-full flex flex-col items-center py-4">
        {isPreview ? <h3 className="font-bold mb-2">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-center font-bold mb-2 bg-transparent" placeholder="Tajuk Dokumen" />}
        <div className="w-full border rounded-xl overflow-hidden relative group" style={{ height: block.data.height || '500px' }}>
           {block.data.embedUrl ? <iframe src={block.data.embedUrl} className="w-full h-full border-0" /> : <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">Tiada Dokumen</div>}
           {!isPreview && (
             <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-8 transition-opacity">
               <input value={block.data.embedUrl} onChange={e=>onUpdate(block.id, {...block.data, embedUrl: e.target.value})} className="w-full border p-2 mb-2" placeholder="Google Drive Embed URL" />
               <input value={block.data.height} onChange={e=>onUpdate(block.id, {...block.data, height: e.target.value})} className="w-32 border p-2" placeholder="Height (500px)" />
             </div>
           )}
        </div>
     </div>
   )
}

export const VideoRenderer: React.FC<{ block: VideoBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   const getEmbed = (url: string) => {
     if(!url) return '';
     if(url.includes('youtube.com') || url.includes('youtu.be')) {
       const id = url.split('v=')[1] || url.split('/').pop();
       return `https://www.youtube.com/embed/${id}`;
     }
     return url;
   }
   return (
     <div className="py-8 px-4 max-w-4xl mx-auto">
        {isPreview ? <h3 className="text-xl font-bold mb-4 text-center">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center text-xl font-bold mb-4 bg-transparent" placeholder="Tajuk Video" />}
        <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
           <iframe src={getEmbed(block.data.url)} className="w-full h-full" allowFullScreen />
           {!isPreview && (
             <div className="absolute top-2 right-2 p-2 bg-white rounded shadow opacity-0 group-hover:opacity-100">
               <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} placeholder="YouTube URL" className="text-xs p-1 w-48 border rounded" />
             </div>
           )}
        </div>
     </div>
   )
}

export const ImageRenderer: React.FC<{ block: ImageBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   const widthClass = block.data.width === 'small' ? 'max-w-sm' : block.data.width === 'medium' ? 'max-w-2xl' : block.data.width === 'large' ? 'max-w-5xl' : 'w-full';
   const animClass = block.data.animation === 'zoom' ? 'hover:scale-105 transition-transform duration-700' : '';
   
   return (
     <div className="py-8 px-4 flex flex-col items-center relative group">
        <div className={`${widthClass} rounded-2xl overflow-hidden shadow-lg`}>
          <img src={block.data.url} alt={block.data.caption} className={`w-full h-auto ${animClass}`} />
        </div>
        {block.data.caption && (
           isPreview ? <p className="mt-2 text-sm text-gray-500 italic">{block.data.caption}</p> : <input value={block.data.caption} onChange={e=>onUpdate(block.id, {...block.data, caption: e.target.value})} className="mt-2 text-center text-sm italic bg-transparent w-full" />
        )}
        {!isPreview && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded shadow opacity-0 group-hover:opacity-100 flex flex-col gap-2">
             <input value={block.data.url} onChange={e=>onUpdate(block.id, {...block.data, url: e.target.value})} className="text-xs border p-1 rounded" placeholder="Image URL" />
             <select value={block.data.width} onChange={e=>onUpdate(block.id, {...block.data, width: e.target.value})} className="text-xs border p-1 rounded">
                <option value="small">Kecil</option>
                <option value="medium">Sederhana</option>
                <option value="large">Besar</option>
                <option value="full">Penuh</option>
             </select>
             <select value={block.data.animation} onChange={e=>onUpdate(block.id, {...block.data, animation: e.target.value})} className="text-xs border p-1 rounded">
                <option value="none">Tiada Animasi</option>
                <option value="zoom">Zoom</option>
             </select>
          </div>
        )}
     </div>
   )
}

export const TickerRenderer: React.FC<{ block: TickerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="bg-primary text-white py-2 overflow-hidden flex relative group">
        <div className="bg-secondary text-primary font-bold px-4 py-1 z-10 shrink-0 shadow-lg flex items-center">
           {isPreview ? block.data.label : <input value={block.data.label} onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} className="bg-transparent w-20 text-center font-bold text-primary" />}
        </div>
        <div className="flex-1 overflow-hidden relative flex items-center">
           <div className="animate-marquee whitespace-nowrap pl-full" style={{ animationDuration: `${30 - (block.data.speed || 15)}s` }}>
              {isPreview ? <span className="inline-block px-4">{block.data.text}</span> : <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="bg-transparent text-white w-96" />}
           </div>
        </div>
     </div>
   )
}

export const StatsRenderer: React.FC<{ block: StatsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 bg-white">
       {isPreview ? <h2 className="text-2xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center text-2xl font-bold mb-10 bg-transparent" />}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {block.data.items.map((stat, i) => (
             <div key={stat.id} className="flex flex-col items-center text-center p-4 border rounded-xl relative group/item">
                {!isPreview && <button onClick={()=>{const ni=[...block.data.items]; ni.splice(i,1); onUpdate(block.id, {...block.data, items: ni})}} className="absolute top-1 right-1 text-red-500 opacity-0 group-hover/item:opacity-100"><Icons.X size={12}/></button>}
                <div className="text-primary mb-2 bg-blue-50 p-3 rounded-full">{getIconByName(stat.icon, "w-8 h-8")}</div>
                {isPreview ? <div className="text-3xl font-extrabold text-gray-800">{stat.value}</div> : <input value={stat.value} onChange={e=>{const ni=[...block.data.items]; ni[i].value=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="text-center text-3xl font-bold w-full" />}
                {isPreview ? <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div> : <input value={stat.label} onChange={e=>{const ni=[...block.data.items]; ni[i].label=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="text-center text-sm w-full" />}
             </div>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {id: uuidv4(), label: "Label", value: "00", icon: "Star"}]})} className="border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 p-8 hover:border-primary hover:text-primary"><Icons.Plus/></button>}
       </div>
    </div>
  )
}

export const TimeRenderer: React.FC<{ block: TimeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   const [time, setTime] = useState(new Date());
   useEffect(() => { const t = setInterval(()=>setTime(new Date()), 1000); return ()=>clearInterval(t); }, []);
   
   return (
     <div className="p-4" style={{ backgroundColor: block.data.bgColor, color: block.data.textColor, textAlign: block.data.alignment }}>
        <div className="text-3xl font-mono font-bold tracking-widest">
           {time.toLocaleTimeString([], { hour12: block.data.format === '12h' })}
        </div>
        {block.data.showDate && <div className="text-sm opacity-80 mt-1">{time.toLocaleDateString()}</div>}
        {!isPreview && (
          <div className="mt-2 flex gap-2 justify-center text-black text-xs">
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} />
             <input type="color" value={block.data.textColor} onChange={e=>onUpdate(block.id, {...block.data, textColor: e.target.value})} />
             <button onClick={()=>onUpdate(block.id, {...block.data, format: block.data.format==='12h'?'24h':'12h'})}>{block.data.format}</button>
          </div>
        )}
     </div>
   )
}

export const VisitorRenderer: React.FC<{ block: VisitorBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="p-4 border rounded-lg bg-white shadow-sm flex items-center justify-between max-w-xs mx-auto">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-green-100 text-green-600 rounded-full"><Icons.Eye size={20} /></div>
           <div>
              <div className="text-xs text-gray-500 uppercase font-bold">{block.data.label}</div>
              <div className="text-xl font-bold font-mono">1,234,567</div>
           </div>
        </div>
        {block.data.showLiveIndicator && (
           <div className="flex items-center gap-1 text-xs text-red-500 font-bold animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> LIVE
           </div>
        )}
        {!isPreview && <input value={block.data.label} onChange={e=>onUpdate(block.id, {...block.data, label: e.target.value})} className="w-20 text-xs border rounded ml-2" />}
     </div>
   )
}

export const SpeechRenderer: React.FC<{ block: SpeechBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-6 bg-white">
       <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 h-56 shrink-0 rounded-xl overflow-hidden shadow-lg border-4 border-white relative group">
             <img src={block.data.imageUrl} className="w-full h-full object-cover" />
             {!isPreview && <input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="absolute bottom-0 w-full text-xs p-1 opacity-0 group-hover:opacity-100" />}
          </div>
          <div className="flex-1 text-center md:text-left relative group">
             {isPreview ? <h2 className="text-2xl font-bold text-primary mb-4">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold text-primary w-full mb-4 bg-transparent" />}
             <div className="relative">
                <Icons.Quote className="absolute -top-4 -left-4 text-gray-200 w-12 h-12 -z-10" />
                {isPreview ? <p className="text-gray-700 leading-relaxed italic">{block.data.text}</p> : <textarea value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="w-full h-32 bg-transparent border-b border-dashed" />}
             </div>
             <div className="mt-6">
                {isPreview ? <div className="font-bold">{block.data.authorName}</div> : <input value={block.data.authorName} onChange={e=>onUpdate(block.id, {...block.data, authorName: e.target.value})} className="font-bold w-full bg-transparent" />}
                {isPreview ? <div className="text-sm text-gray-500">{block.data.authorRole}</div> : <input value={block.data.authorRole} onChange={e=>onUpdate(block.id, {...block.data, authorRole: e.target.value})} className="text-sm text-gray-500 w-full bg-transparent" />}
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

export const CalendarRenderer: React.FC<{ block: CalendarBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-8 px-4">
        {isPreview ? <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Icons.Calendar className="text-primary"/> {block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-xl font-bold mb-6 w-full" />}
        <div className="space-y-3">
           {block.data.events.map((ev, i) => (
             <div key={i} className="flex gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 group relative">
                <div className="bg-primary/10 text-primary rounded-lg p-2 text-center min-w-[60px] flex flex-col justify-center">
                   {isPreview ? <span className="text-xl font-bold block leading-none">{ev.date}</span> : <input value={ev.date} onChange={e=>{const ne=[...block.data.events]; ne[i].date=e.target.value; onUpdate(block.id, {...block.data, events: ne})}} className="w-full text-center font-bold bg-transparent" />}
                   {isPreview ? <span className="text-[10px] uppercase font-bold">{ev.month}</span> : <input value={ev.month} onChange={e=>{const ne=[...block.data.events]; ne[i].month=e.target.value; onUpdate(block.id, {...block.data, events: ne})}} className="w-full text-center text-[10px] bg-transparent" />}
                </div>
                <div className="flex-1">
                   {isPreview ? <h4 className="font-bold text-gray-800">{ev.title}</h4> : <input value={ev.title} onChange={e=>{const ne=[...block.data.events]; ne[i].title=e.target.value; onUpdate(block.id, {...block.data, events: ne})}} className="w-full font-bold bg-transparent" />}
                   {isPreview ? <p className="text-sm text-gray-500">{ev.desc}</p> : <input value={ev.desc} onChange={e=>{const ne=[...block.data.events]; ne[i].desc=e.target.value; onUpdate(block.id, {...block.data, events: ne})}} className="w-full text-sm bg-transparent" />}
                </div>
                {!isPreview && <button onClick={()=>{const ne=[...block.data.events]; ne.splice(i,1); onUpdate(block.id, {...block.data, events: ne})}} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"><Icons.Trash2 size={14}/></button>}
             </div>
           ))}
           {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, events: [...block.data.events, {date: '01', month: 'JAN', title: 'Acara', desc: 'Info'}]})} className="w-full py-2 border-2 border-dashed rounded text-gray-400 hover:text-primary"><Icons.Plus className="mx-auto"/></button>}
        </div>
     </div>
   )
}

export const DownloadsRenderer: React.FC<{ block: DownloadsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-6 px-4 bg-gray-50 rounded-xl">
        {isPreview ? <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Icons.Download size={18} /> {block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg mb-4 w-full bg-transparent" />}
        <div className="space-y-2">
           {block.data.items.map((item, i) => (
             <div key={i} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 hover:border-primary transition-colors group relative">
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.type==='PDF'?'bg-red-100 text-red-600':item.type==='DOC'?'bg-blue-100 text-blue-600':'bg-green-100 text-green-600'}`}>{item.type}</span>
                   {isPreview ? <span className="font-medium text-sm">{item.title}</span> : <input value={item.title} onChange={e=>{const ni=[...block.data.items]; ni[i].title=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="bg-transparent" />}
                </div>
                <a href={item.url} className="text-gray-400 hover:text-primary"><Icons.Download size={16} /></a>
                {!isPreview && (
                  <div className="absolute right-10 flex gap-2 bg-white">
                     <input value={item.url} onChange={e=>{const ni=[...block.data.items]; ni[i].url=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="text-xs border w-32" placeholder="URL" />
                     <button onClick={()=>{const ni=[...block.data.items]; ni.splice(i,1); onUpdate(block.id, {...block.data, items: ni})}} className="text-red-500"><Icons.Trash2 size={14}/></button>
                  </div>
                )}
             </div>
           ))}
           {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {title: "Fail Baru", url: "#", type: "PDF"}]})} className="w-full py-2 border border-dashed rounded text-xs text-gray-500">Tambah Fail</button>}
        </div>
     </div>
   )
}

export const FaqRenderer: React.FC<{ block: FaqBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4">
       {isPreview ? <h2 className="text-2xl font-bold text-center mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold w-full text-center mb-8 bg-transparent" />}
       <div className="space-y-4 max-w-3xl mx-auto">
          {block.data.items.map((item, i) => (
             <details key={i} className="group bg-white border border-gray-200 rounded-lg overflow-hidden open:ring-2 open:ring-primary/10">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800 hover:bg-gray-50 relative">
                   {isPreview ? <span>{item.question}</span> : <input value={item.question} onClick={e=>e.preventDefault()} onChange={e=>{const ni=[...block.data.items]; ni[i].question=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="w-full bg-transparent" />}
                   <Icons.ChevronDown className="group-open:rotate-180 transition-transform" />
                   {!isPreview && <button onClick={(e)=>{e.preventDefault(); const ni=[...block.data.items]; ni.splice(i,1); onUpdate(block.id, {...block.data, items: ni})}} className="absolute right-10 text-red-500"><Icons.Trash2 size={14}/></button>}
                </summary>
                <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                   {isPreview ? <p>{item.answer}</p> : <textarea value={item.answer} onChange={e=>{const ni=[...block.data.items]; ni[i].answer=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="w-full h-20 bg-transparent border-none resize-none" />}
                </div>
             </details>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {question: "Soalan?", answer: "Jawapan..."}]})} className="w-full py-3 border-2 border-dashed rounded text-gray-400">Tambah Soalan</button>}
       </div>
    </div>
  )
}

export const CtaRenderer: React.FC<{ block: CtaBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-12 px-8 text-center rounded-2xl my-8 mx-4" style={{ backgroundColor: block.data.bgColor }}>
        {isPreview ? <h2 className="text-3xl font-bold text-white mb-6">{block.data.text}</h2> : <input value={block.data.text} onChange={e=>onUpdate(block.id, {...block.data, text: e.target.value})} className="text-3xl font-bold text-white text-center w-full bg-transparent mb-6" />}
        <a href={block.data.buttonLink} className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-lg">
           {isPreview ? block.data.buttonLabel : <input value={block.data.buttonLabel} onChange={e=>onUpdate(block.id, {...block.data, buttonLabel: e.target.value})} className="text-center w-32" />}
        </a>
        {!isPreview && (
          <div className="mt-4 flex gap-2 justify-center">
             <input value={block.data.buttonLink} onChange={e=>onUpdate(block.id, {...block.data, buttonLink: e.target.value})} placeholder="Link URL" className="text-xs p-1 rounded" />
             <input type="color" value={block.data.bgColor} onChange={e=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} />
          </div>
        )}
     </div>
   )
}

export const CountdownRenderer: React.FC<{ block: CountdownBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   // Simple countdown logic
   return (
     <div className="py-8 px-4 text-center bg-gray-900 text-white rounded-xl">
        {isPreview ? <h3 className="uppercase tracking-widest text-xs font-bold mb-4 text-primary">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-center bg-transparent text-primary w-full text-xs font-bold uppercase" />}
        <div className="flex justify-center gap-4 md:gap-8 font-mono">
           {['HARI', 'JAM', 'MINIT', 'SAAT'].map(label => (
             <div key={label} className="flex flex-col">
               <span className="text-3xl md:text-5xl font-bold">00</span>
               <span className="text-[10px] text-gray-500">{label}</span>
             </div>
           ))}
        </div>
        {!isPreview && <input type="date" value={block.data.targetDate} onChange={e=>onUpdate(block.id, {...block.data, targetDate: e.target.value})} className="mt-4 text-black p-1 rounded" />}
     </div>
   )
}

export const NoticeRenderer: React.FC<{ block: NoticeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   const colors: any = { yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800', blue: 'bg-blue-50 border-blue-200 text-blue-800', red: 'bg-red-50 border-red-200 text-red-800', green: 'bg-green-50 border-green-200 text-green-800' };
   return (
     <div className={`p-6 rounded-xl border-l-4 ${colors[block.data.color]} relative group my-4`}>
        {isPreview ? <h4 className="font-bold flex items-center gap-2 mb-2"><Icons.AlertTriangle size={18}/> {block.data.title}</h4> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold w-full bg-transparent mb-2" />}
        {isPreview ? <p className="text-sm opacity-90">{block.data.content}</p> : <textarea value={block.data.content} onChange={e=>onUpdate(block.id, {...block.data, content: e.target.value})} className="w-full bg-transparent text-sm h-16 resize-none" />}
        {!isPreview && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
             <select value={block.data.color} onChange={e=>onUpdate(block.id, {...block.data, color: e.target.value})} className="text-xs border rounded">
                <option value="yellow">Kuning</option>
                <option value="blue">Biru</option>
                <option value="red">Merah</option>
                <option value="green">Hijau</option>
             </select>
          </div>
        )}
     </div>
   )
}

export const TableRenderer: React.FC<{ block: TableBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-8 px-4 overflow-x-auto">
        {isPreview ? <h3 className="font-bold text-xl mb-4">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-xl mb-4 w-full bg-transparent" />}
        <table className="w-full text-sm border-collapse">
           <thead>
              <tr className="bg-gray-100 text-left">
                 {block.data.headers.map((h, i) => (
                   <th key={i} className="p-3 border-b-2 border-gray-200">
                     {isPreview ? h : <input value={h} onChange={e=>{const nh=[...block.data.headers] as [string,string,string]; nh[i]=e.target.value; onUpdate(block.id, {...block.data, headers: nh})}} className="bg-transparent w-full font-bold" />}
                   </th>
                 ))}
                 {!isPreview && <th className="w-10"></th>}
              </tr>
           </thead>
           <tbody>
              {block.data.rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                   <td className="p-3">{isPreview ? row.col1 : <input value={row.col1} onChange={e=>{const nr=[...block.data.rows]; nr[i].col1=e.target.value; onUpdate(block.id, {...block.data, rows: nr})}} className="w-full bg-transparent"/>}</td>
                   <td className="p-3">{isPreview ? row.col2 : <input value={row.col2} onChange={e=>{const nr=[...block.data.rows]; nr[i].col2=e.target.value; onUpdate(block.id, {...block.data, rows: nr})}} className="w-full bg-transparent"/>}</td>
                   <td className="p-3">{isPreview ? row.col3 : <input value={row.col3} onChange={e=>{const nr=[...block.data.rows]; nr[i].col3=e.target.value; onUpdate(block.id, {...block.data, rows: nr})}} className="w-full bg-transparent"/>}</td>
                   {!isPreview && <td><button onClick={()=>{const nr=[...block.data.rows]; nr.splice(i,1); onUpdate(block.id, {...block.data, rows: nr})}} className="text-red-500"><Icons.Trash2 size={14}/></button></td>}
                </tr>
              ))}
           </tbody>
        </table>
        {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, rows: [...block.data.rows, {col1: '-', col2: '-', col3: '-'}]})} className="mt-2 text-xs text-blue-500 hover:underline">+ Tambah Baris</button>}
     </div>
   )
}

export const StaffGridRenderer: React.FC<{ block: StaffGridBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   // Reusing logic from Gallery/Org but simple grid
   return (
     <div className="py-8 px-4">
        {isPreview ? <h2 className="text-2xl font-bold text-center mb-8">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full text-center text-2xl font-bold mb-8 bg-transparent" />}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {block.data.members.map((m, i) => (
             <div key={m.id} className="flex flex-col items-center text-center group relative">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-100 shadow-sm">
                   <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                </div>
                {isPreview ? <div className="font-bold text-sm leading-tight">{m.name}</div> : <input value={m.name} onChange={e=>{const nm=[...block.data.members]; nm[i].name=e.target.value; onUpdate(block.id, {...block.data, members: nm})}} className="text-center font-bold text-sm w-full bg-transparent" />}
                {isPreview ? <div className="text-xs text-gray-500">{m.position}</div> : <input value={m.position} onChange={e=>{const nm=[...block.data.members]; nm[i].position=e.target.value; onUpdate(block.id, {...block.data, members: nm})}} className="text-center text-xs w-full bg-transparent text-gray-400" />}
                {!isPreview && (
                   <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex flex-col items-end">
                      <button onClick={()=>{const nm=[...block.data.members]; nm.splice(i,1); onUpdate(block.id, {...block.data, members: nm})}} className="text-red-500"><Icons.Trash2 size={12}/></button>
                      <input value={m.imageUrl} onChange={e=>{const nm=[...block.data.members]; nm[i].imageUrl=e.target.value; onUpdate(block.id, {...block.data, members: nm})}} className="w-24 text-[10px] border" placeholder="Img URL" />
                   </div>
                )}
             </div>
           ))}
           {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, members: [...block.data.members, {id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/100'}]})} className="aspect-square rounded-full border-2 border-dashed flex items-center justify-center text-gray-300 hover:border-primary hover:text-primary"><Icons.Plus/></button>}
        </div>
     </div>
   )
}

export const TestimonialRenderer: React.FC<{ block: TestimonialBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-12 px-8 bg-blue-50 text-center relative rounded-2xl my-8">
        <Icons.Quote className="absolute top-4 left-4 text-blue-200 w-16 h-16" />
        <div className="relative z-10 max-w-2xl mx-auto">
           {isPreview ? <p className="text-xl font-medium italic text-gray-800 mb-6 leading-relaxed">"{block.data.quote}"</p> : <textarea value={block.data.quote} onChange={e=>onUpdate(block.id, {...block.data, quote: e.target.value})} className="w-full h-32 text-center text-xl italic bg-transparent border-none resize-none" />}
           <div className="flex flex-col items-center">
              <div className="w-12 h-1 bg-primary mb-2 rounded-full"></div>
              {isPreview ? <span className="font-bold text-gray-900">{block.data.author}</span> : <input value={block.data.author} onChange={e=>onUpdate(block.id, {...block.data, author: e.target.value})} className="text-center font-bold bg-transparent" placeholder="Nama" />}
              {isPreview ? <span className="text-sm text-gray-500">{block.data.role}</span> : <input value={block.data.role} onChange={e=>onUpdate(block.id, {...block.data, role: e.target.value})} className="text-center text-sm text-gray-500 bg-transparent" placeholder="Jawatan/Alumni" />}
           </div>
        </div>
     </div>
   )
}

export const LinkListRenderer: React.FC<{ block: LinkListBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-6 px-4">
       {isPreview ? <h3 className="font-bold mb-3 uppercase text-xs text-gray-500 tracking-wider">{block.data.title}</h3> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold mb-3 w-full bg-transparent text-xs uppercase" />}
       <ul className="space-y-2">
          {block.data.links.map((link, i) => (
             <li key={i} className="flex items-center gap-2 group relative">
                <Icons.Link size={14} className="text-primary shrink-0" />
                {isPreview ? <a href={link.url} className="text-sm hover:underline hover:text-primary truncate">{link.label}</a> : (
                  <div className="flex-1 flex gap-2">
                     <input value={link.label} onChange={e=>{const nl=[...block.data.links]; nl[i].label=e.target.value; onUpdate(block.id, {...block.data, links: nl})}} className="flex-1 text-sm bg-transparent border-b border-dashed" />
                     <input value={link.url} onChange={e=>{const nl=[...block.data.links]; nl[i].url=e.target.value; onUpdate(block.id, {...block.data, links: nl})}} className="flex-1 text-xs text-blue-500 bg-transparent border-b border-dashed" placeholder="https://" />
                  </div>
                )}
                {!isPreview && <button onClick={()=>{const nl=[...block.data.links]; nl.splice(i,1); onUpdate(block.id, {...block.data, links: nl})}} className="text-red-400 opacity-0 group-hover:opacity-100"><Icons.X size={12}/></button>}
             </li>
          ))}
          {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, links: [...block.data.links, {label: "Pautan Baru", url: "#"}]})} className="text-xs text-gray-400 hover:text-primary mt-2 flex items-center gap-1"><Icons.Plus size={12}/> Tambah Link</button>}
       </ul>
    </div>
  )
}

export const NewsRenderer: React.FC<{ block: NewsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
           <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-2">
              {isPreview ? <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-primary -mb-3 pb-2 inline-block">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold bg-transparent" />}
              {isPreview && <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">Lihat Semua <Icons.ExternalLink size={14}/></button>}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.data.items.map((news, i) => (
                 <div key={news.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all relative group">
                    <div className="flex justify-between items-start mb-4">
                       <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">{news.tag}</span>
                       <span className="text-xs text-gray-400 font-mono">{news.date}</span>
                    </div>
                    {isPreview ? <h3 className="font-bold text-lg mb-2 leading-tight hover:text-primary cursor-pointer">{news.title}</h3> : <input value={news.title} onChange={e=>{const ni=[...block.data.items]; ni[i].title=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="w-full font-bold text-lg mb-2 border-b border-dashed" />}
                    {isPreview ? <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{news.content}</p> : <textarea value={news.content} onChange={e=>{const ni=[...block.data.items]; ni[i].content=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="w-full text-sm h-20 resize-none border-none bg-transparent" />}
                    {!isPreview && (
                       <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 bg-white p-1 shadow rounded border">
                          <input type="date" value={news.date} onChange={e=>{const ni=[...block.data.items]; ni[i].date=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="text-[10px] border p-1" />
                          <select value={news.tag} onChange={e=>{const ni=[...block.data.items]; ni[i].tag=e.target.value as any; onUpdate(block.id, {...block.data, items: ni})}} className="text-[10px] border p-1 w-full">
                             <option>PENTADBIRAN</option>
                             <option>KURIKULUM</option>
                             <option>HAL EHWAL MURID</option>
                             <option>KOKURIKULUM</option>
                          </select>
                          <button onClick={()=>{const ni=[...block.data.items]; ni.splice(i,1); onUpdate(block.id, {...block.data, items: ni})}} className="bg-red-500 text-white text-xs p-1 rounded">Padam</button>
                       </div>
                    )}
                 </div>
              ))}
              {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {id: uuidv4(), title: 'Berita Baru', date: new Date().toISOString().split('T')[0], tag: 'PENTADBIRAN', content: 'Isi kandungan berita...'}]})} className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 hover:text-primary hover:border-primary"><Icons.Plus size={32}/><span className="text-sm font-bold mt-2">Tambah Berita</span></button>}
           </div>
        </div>
     </div>
   )
}

export const DefinitionRenderer: React.FC<{ block: DefinitionBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
   return (
     <div className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-start">
           <div className="w-full md:w-1/3 flex flex-col items-center">
              <img src={block.data.imageUrl} alt="Logo" className="w-48 h-auto object-contain mb-4" />
              {!isPreview && <input value={block.data.imageUrl} onChange={e=>onUpdate(block.id, {...block.data, imageUrl: e.target.value})} className="text-xs border p-1 w-full rounded" placeholder="Image URL" />}
           </div>
           <div className="flex-1 w-full">
              {isPreview ? <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">{block.data.title}</h2> : <input value={block.data.title} onChange={e=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full border-b" />}
              <div className="space-y-6">
                 {block.data.items.map((item, i) => (
                    <div key={i} className="group relative">
                       {isPreview ? <h4 className="font-bold text-primary text-lg mb-1">{item.term}</h4> : <input value={item.term} onChange={e=>{const ni=[...block.data.items]; ni[i].term=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="font-bold text-primary text-lg w-full bg-transparent" />}
                       {isPreview ? <p className="text-gray-600 leading-relaxed text-sm text-justify">{item.definition}</p> : <textarea value={item.definition} onChange={e=>{const ni=[...block.data.items]; ni[i].definition=e.target.value; onUpdate(block.id, {...block.data, items: ni})}} className="w-full h-20 text-sm bg-transparent border-l-2 border-gray-200 pl-2 resize-none" />}
                       {!isPreview && <button onClick={()=>{const ni=[...block.data.items]; ni.splice(i,1); onUpdate(block.id, {...block.data, items: ni})}} className="absolute top-0 right-0 text-red-400 opacity-0 group-hover:opacity-100"><Icons.X size={14}/></button>}
                    </div>
                 ))}
                 {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {term: 'Istilah', definition: 'Definisi...'}]})} className="text-sm text-blue-500 hover:underline">+ Tambah Definisi</button>}
              </div>
           </div>
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