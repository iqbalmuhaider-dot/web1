import React, { useState, useEffect } from 'react';
import { 
  SectionBlock, HeroBlock, FeatureBlock, ContentBlock, GalleryBlock, 
  ContactBlock, FooterBlock, HtmlBlock, DriveBlock, VideoBlock, ImageBlock,
  TickerBlock, OrgChartBlock, StatsBlock, TimeBlock, VisitorBlock, SpeechBlock,
  CalendarBlock, DownloadsBlock, FaqBlock, CtaBlock, CountdownBlock, NoticeBlock,
  TableBlock, StaffGridBlock, TestimonialBlock, LinkListBlock, NewsBlock, DefinitionBlock, 
  DividerBlock, SpacerBlock, OrgMember
} from '../../types';
import { getIconByName, Icons, iconList } from '../ui/Icons';
import { v4 as uuidv4 } from 'uuid';

interface RendererProps {
  block: SectionBlock;
  isPreview: boolean;
  onUpdate: (id: string, data: any) => void;
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

// Helper for Date Formatting (d/m/yyyy)
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  return `${parseInt(d)}/${parseInt(m)}/${y}`; 
};

// --- RENDERERS ---

export const HeroRenderer: React.FC<{ block: HeroBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="relative min-h-[500px] w-full flex flex-col items-center justify-center text-center text-white overflow-hidden group">
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
           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Gelap/Cerah</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={block.data.overlayOpacity ?? 0.8} 
                onChange={(e) => onUpdate(block.id, { ...block.data, overlayOpacity: parseFloat(e.target.value) })}
                className="w-20"
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

export const ContentRenderer: React.FC<{ block: ContentBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className={`py-16 px-8 max-w-5xl mx-auto text-${block.data.alignment} flex flex-col relative group`}>
      {!isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
        </div>
      )}
      <div className="mb-8 w-full">
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
    <div className="py-4 px-8 w-full group relative">
      <hr 
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

  // Font size scaler
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
    <div className="py-12 px-4 max-w-7xl mx-auto group relative">
       {!isPreview && (
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
           <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
        </div>
      )}
      <div className="text-center mb-12">
         {isPreview ? <h2 className={`${getSizeClass(block.data.fontSize, 'title').replace('text-6xl','text-4xl')} font-bold`}>{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-center w-full font-bold text-3xl border-b border-dashed border-gray-300 outline-none" placeholder="Tajuk Ciri" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {block.data.features.map((feature, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative group/item">
            <div className="mb-4 text-primary p-3 bg-blue-50 rounded-full">
               {getIconByName(feature.icon, "w-8 h-8")}
            </div>
            {isPreview ? (
              <>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                {feature.link && <a href={feature.link} className="mt-4 text-primary font-bold text-xs hover:underline uppercase tracking-wide">Buka Pautan &rarr;</a>}
              </>
            ) : (
              <div className="flex flex-col w-full gap-2">
                 <input value={feature.title} onChange={e => { const newF = [...block.data.features]; newF[idx].title = e.target.value; onUpdate(block.id, {...block.data, features: newF}) }} className="text-center font-bold border rounded p-1" placeholder="Title" onClick={e=>e.stopPropagation()} />
                 <textarea value={feature.description} onChange={e => { const newF = [...block.data.features]; newF[idx].description = e.target.value; onUpdate(block.id, {...block.data, features: newF}) }} className="text-center border rounded p-1 text-xs" placeholder="Desc" onClick={e=>e.stopPropagation()} />
                 <select value={feature.icon} onChange={e => { const newF = [...block.data.features]; newF[idx].icon = e.target.value; onUpdate(block.id, {...block.data, features: newF}) }} className="text-xs border rounded" onClick={e=>e.stopPropagation()}>
                    {iconList.map(i => <option key={i} value={i}>{i}</option>)}
                 </select>
                 <input value={feature.link || ''} onChange={e => { const newF = [...block.data.features]; newF[idx].link = e.target.value; onUpdate(block.id, {...block.data, features: newF}) }} className="text-center text-xs border rounded p-1" placeholder="Link (Optional)" onClick={e=>e.stopPropagation()} />
                 <button onClick={(e) => { e.stopPropagation(); const newF = block.data.features.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, features: newF}) }} className="text-red-500 text-xs">Remove</button>
              </div>
            )}
          </div>
        ))}
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, {...block.data, features: [...block.data.features, { title: 'New Feature', description: 'Desc', icon: 'Star' }]})} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50 transition-all min-h-[200px]">
            <Icons.Plus size={32} />
            <span className="font-bold mt-2">Add Feature</span>
          </button>
        )}
      </div>
    </div>
  )
}

export const GalleryRenderer: React.FC<{ block: GalleryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        {isPreview ? <h2 className="text-3xl font-bold">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-center font-bold text-3xl border-b border-dashed w-full outline-none" placeholder="Tajuk Galeri" />}
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {block.data.images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden shadow-md">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {!isPreview && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 gap-2">
                 <input value={img} onChange={e => { const newImg = [...block.data.images]; newImg[idx] = e.target.value; onUpdate(block.id, {...block.data, images: newImg}) }} className="text-xs w-full rounded p-1" placeholder="Image URL" onClick={e=>e.stopPropagation()} />
                 <button onClick={e => { e.stopPropagation(); const newImg = block.data.images.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, images: newImg}) }} className="text-white bg-red-500 p-1 rounded text-xs"><Icons.Trash2 size={12} /></button>
              </div>
            )}
          </div>
        ))}
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, {...block.data, images: [...block.data.images, 'https://picsum.photos/400']})} className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-50">
            <Icons.Plus size={32} />
            <span>Add Image</span>
          </button>
        )}
      </div>
    </div>
  )
}

export const ContactRenderer: React.FC<{ block: ContactBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const isIframeCode = block.data.mapUrl && block.data.mapUrl.includes('<iframe');

  return (
    <div className="py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          {isPreview ? <h2 className="text-4xl font-bold mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="bg-transparent text-4xl font-bold mb-6 border-b border-gray-700 outline-none w-full" />}
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full text-primary"><Icons.MapPin /></div>
              <div>
                <h3 className="font-bold mb-1 text-gray-400 uppercase text-xs">Alamat</h3>
                {isPreview ? <p className="text-lg">{block.data.address}</p> : <textarea value={block.data.address} onChange={e => onUpdate(block.id, {...block.data, address: e.target.value})} className="bg-gray-800 rounded p-2 w-full text-white" />}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full text-primary"><Icons.Phone /></div>
              <div>
                <h3 className="font-bold mb-1 text-gray-400 uppercase text-xs">Telefon</h3>
                {isPreview ? <p className="text-lg">{block.data.phone}</p> : <input value={block.data.phone} onChange={e => onUpdate(block.id, {...block.data, phone: e.target.value})} className="bg-gray-800 rounded p-2 w-full text-white" />}
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full text-primary"><Icons.Mail /></div>
              <div>
                <h3 className="font-bold mb-1 text-gray-400 uppercase text-xs">Emel</h3>
                {isPreview ? <p className="text-lg">{block.data.email}</p> : <input value={block.data.email} onChange={e => onUpdate(block.id, {...block.data, email: e.target.value})} className="bg-gray-800 rounded p-2 w-full text-white" />}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[400px] bg-gray-800 rounded-2xl overflow-hidden relative group">
           {isIframeCode ? (
             <div 
               className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
               dangerouslySetInnerHTML={{ __html: block.data.mapUrl }} 
             />
           ) : block.data.mapUrl ? (
             <iframe src={block.data.mapUrl} className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-500">Tiada Peta</div>
           )}

           {!isPreview && (
             <div className="absolute top-4 right-4 w-full max-w-sm">
               <textarea 
                 value={block.data.mapUrl} 
                 onChange={e => onUpdate(block.id, {...block.data, mapUrl: e.target.value})} 
                 className="w-full bg-white text-black p-2 rounded-lg text-xs shadow-lg h-24 font-mono opacity-20 group-hover:opacity-100 transition-opacity focus:opacity-100" 
                 placeholder="Paste Google Maps Embed HTML Code (<iframe...>)" 
               />
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export const FooterRenderer: React.FC<{ block: FooterBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="bg-gray-950 py-8 text-center text-gray-500 text-sm">
      {isPreview ? <p>{block.data.copyright}</p> : <input value={block.data.copyright} onChange={e => onUpdate(block.id, {...block.data, copyright: e.target.value})} className="bg-transparent text-center w-full border-b border-gray-800 outline-none" />}
    </div>
  )
}

export const HtmlRenderer: React.FC<{ block: HtmlBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="w-full" style={{ height: isPreview ? block.data.height : 'auto' }}>
      {isPreview ? (
        <div dangerouslySetInnerHTML={{ __html: block.data.code }} />
      ) : (
        <div className="p-4 bg-gray-100 border rounded-lg">
           <div className="flex justify-between mb-2">
             <span className="font-bold text-xs text-gray-500">HTML Code Editor</span>
             <input value={block.data.height} onChange={e => onUpdate(block.id, {...block.data, height: e.target.value})} className="text-xs border rounded px-1 w-20" placeholder="Height" />
           </div>
           <textarea value={block.data.code} onChange={e => onUpdate(block.id, {...block.data, code: e.target.value})} className="w-full h-48 font-mono text-xs p-2 border rounded" placeholder="<div>Your HTML here</div>" />
        </div>
      )}
    </div>
  )
}

export const DriveRenderer: React.FC<{ block: DriveBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="w-full py-8 px-4">
      {isPreview ? (
         <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden" style={{ height: block.data.height }}>
           <h3 className="bg-gray-50 p-3 border-b font-bold text-gray-700 flex items-center gap-2"><Icons.Drive size={18} /> {block.data.title}</h3>
           {block.data.embedUrl ? <iframe src={block.data.embedUrl} className="w-full h-full" /> : <div className="h-full flex items-center justify-center text-gray-400">Tiada Dokumen</div>}
         </div>
      ) : (
        <div className="p-4 border rounded bg-gray-50">
          <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full border p-2 mb-2 rounded" placeholder="Document Title" />
          <input value={block.data.embedUrl} onChange={e => onUpdate(block.id, {...block.data, embedUrl: e.target.value})} className="w-full border p-2 mb-2 rounded" placeholder="Google Drive Embed URL" />
          <input value={block.data.height} onChange={e => onUpdate(block.id, {...block.data, height: e.target.value})} className="w-full border p-2 rounded" placeholder="Height (e.g., 500px)" />
        </div>
      )}
    </div>
  )
}

export const VideoRenderer: React.FC<{ block: VideoBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Already an embed URL?
    if (url.includes('/embed/')) return url;
    
    let videoId = '';
    
    try {
        // Handle standard youtube.com/watch?v=...
        if (url.includes('v=')) {
            // Split by v= and then take the first part before any ampersand
            videoId = url.split('v=')[1].split('&')[0];
        } 
        // Handle short youtu.be/ID
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
    } catch (e) {
        console.error("Error parsing YouTube URL", e);
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const embedUrl = getEmbedUrl(block.data.url);

  return (
    <div className="py-12 px-4 bg-black">
       <div className="max-w-4xl mx-auto">
          {!isPreview && <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="w-full bg-gray-900 text-white p-2 mb-4 rounded" placeholder="Video Title" />}
          <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden relative shadow-2xl border border-gray-700">
             {embedUrl ? (
               <iframe 
                 src={embedUrl} 
                 className="w-full h-full" 
                 title={block.data.title || "YouTube video player"}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 allowFullScreen
                 frameBorder="0"
               ></iframe>
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <Icons.Video size={48} className="opacity-50" />
                  <p>Masukkan URL YouTube yang sah</p>
               </div>
             )}
          </div>
          {!isPreview && (
             <div className="mt-4">
               <label className="text-xs text-gray-400 font-bold ml-1 uppercase">URL YouTube</label>
               <input value={block.data.url} onChange={e => onUpdate(block.id, {...block.data, url: e.target.value})} className="w-full mt-1 bg-gray-900 text-white p-2 rounded border border-gray-700 focus:border-primary outline-none" placeholder="https://www.youtube.com/watch?v=..." />
               <p className="text-[10px] text-gray-500 mt-1 ml-1">Menyokong pautan biasa dan pautan 'youtu.be'.</p>
             </div>
          )}
       </div>
    </div>
  )
}

export const ImageRenderer: React.FC<{ block: ImageBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const widthClass = block.data.width === 'full' ? 'max-w-full' : block.data.width === 'large' ? 'max-w-5xl' : block.data.width === 'medium' ? 'max-w-3xl' : 'max-w-xl';
  const animClass = block.data.animation === 'zoom' ? 'hover:scale-105 transition-transform duration-700' : block.data.animation === 'pan' ? 'hover:object-left transition-all duration-1000' : '';
  
  return (
    <div className="py-12 px-4 flex flex-col items-center">
      <div className={`w-full ${widthClass} overflow-hidden rounded-2xl shadow-xl relative group`}>
        <img src={block.data.url} alt={block.data.caption} className={`w-full h-auto object-cover ${animClass}`} />
        {(block.data.caption || !isPreview) && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-white">
            {isPreview ? <p className="font-medium text-lg text-center">{block.data.caption}</p> : <input value={block.data.caption} onChange={e => onUpdate(block.id, {...block.data, caption: e.target.value})} className="bg-transparent text-center w-full outline-none text-white" placeholder="Kapsyen Gambar" />}
          </div>
        )}
        {!isPreview && <ImageControl label="Gambar" url={block.data.url} onChange={(v) => onUpdate(block.id, {...block.data, url: v})} />}
      </div>
      {!isPreview && (
        <div className="mt-4 flex gap-2">
           <select value={block.data.width} onChange={e => onUpdate(block.id, {...block.data, width: e.target.value})} className="border rounded p-1 text-sm">
             <option value="small">Kecil</option>
             <option value="medium">Sederhana</option>
             <option value="large">Besar</option>
             <option value="full">Penuh</option>
           </select>
           <select value={block.data.animation} onChange={e => onUpdate(block.id, {...block.data, animation: e.target.value})} className="border rounded p-1 text-sm">
             <option value="none">Tiada Animasi</option>
             <option value="zoom">Zoom on Hover</option>
           </select>
        </div>
      )}
    </div>
  )
}

export const TickerRenderer: React.FC<{ block: TickerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format date as dd/mm/yyyy
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

  return (
    <div className="bg-primary text-white overflow-hidden flex items-stretch h-10 shadow-md">
       <div className="bg-secondary text-primary font-black px-4 flex items-center shrink-0 text-sm uppercase tracking-wider relative z-10 gap-2">
         {isPreview ? block.data.label : <input value={block.data.label} onChange={e => onUpdate(block.id, {...block.data, label: e.target.value})} className="bg-transparent w-24 outline-none font-bold" />}
         <span className="text-[10px] font-mono opacity-80 border-l border-primary/20 pl-2 hidden md:block">{currentDate}</span>
       </div>
       <div className="flex-1 flex items-center bg-primary overflow-hidden relative">
         {isPreview ? (
           <div className="whitespace-nowrap animate-marquee px-4" style={{ animationDuration: `${30 - block.data.speed}s` }}>
             {block.data.text} &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; {block.data.text} &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; {block.data.text}
           </div>
         ) : (
           <input value={block.data.text} onChange={e => onUpdate(block.id, {...block.data, text: e.target.value})} className="w-full bg-transparent outline-none px-4 text-white" placeholder="Teks Ticker" />
         )}
       </div>
    </div>
  )
}

export const StatsRenderer: React.FC<{ block: StatsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 bg-blue-50">
       <div className="max-w-6xl mx-auto px-4">
         {isPreview ? <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="block w-full text-center text-3xl font-bold mb-12 bg-transparent outline-none" />}
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {block.data.items.map((item, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm text-center border border-blue-100">
               <div className="text-secondary mx-auto mb-4 flex justify-center">{getIconByName(item.icon, "w-8 h-8")}</div>
               {isPreview ? (
                 <>
                   <div className="text-4xl font-black text-gray-800 mb-1">{item.value}</div>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</div>
                 </>
               ) : (
                 <div className="flex flex-col gap-2">
                   <input value={item.value} onChange={e => { const ni = [...block.data.items]; ni[idx].value = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-center font-black text-2xl w-full border-b" />
                   <input value={item.label} onChange={e => { const ni = [...block.data.items]; ni[idx].label = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-center text-xs uppercase w-full border-b" />
                   <select value={item.icon} onChange={e => { const ni = [...block.data.items]; ni[idx].icon = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded w-full">
                      {iconList.map(i => <option key={i} value={i}>{i}</option>)}
                   </select>
                   <button onClick={() => { const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, items: ni}) }} className="text-red-500 text-xs">Remove</button>
                 </div>
               )}
             </div>
           ))}
           {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, items: [...block.data.items, { id: uuidv4(), label: 'LABEL', value: '00', icon: 'Star' }]})} className="border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center p-6 text-gray-400 hover:text-primary hover:bg-white transition-all"><Icons.Plus /></button>}
         </div>
       </div>
    </div>
  )
}

export const TimeRenderer: React.FC<{ block: TimeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`py-8 px-8 text-${block.data.alignment}`} style={{ backgroundColor: block.data.bgColor, color: block.data.textColor }}>
       <div className="font-mono text-5xl font-bold tracking-tight">
          {time.toLocaleTimeString([], { hour12: block.data.format === '12h' })}
       </div>
       {block.data.showDate && <div className="text-lg opacity-80 mt-1 font-medium">{time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
       
       {!isPreview && (
         <div className="mt-4 p-2 bg-white/10 rounded flex gap-4 text-xs">
           <label className="flex items-center gap-1"><input type="checkbox" checked={block.data.format === '12h'} onChange={e => onUpdate(block.id, {...block.data, format: e.target.checked ? '12h' : '24h'})} /> 12H Format</label>
           <label className="flex items-center gap-1"><input type="checkbox" checked={block.data.showDate} onChange={e => onUpdate(block.id, {...block.data, showDate: e.target.checked})} /> Show Date</label>
           <input type="color" value={block.data.bgColor} onChange={e => onUpdate(block.id, {...block.data, bgColor: e.target.value})} />
           <input type="color" value={block.data.textColor} onChange={e => onUpdate(block.id, {...block.data, textColor: e.target.value})} />
         </div>
       )}
    </div>
  )
}

export const VisitorRenderer: React.FC<{ block: VisitorBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm inline-flex items-center gap-4">
      <div className="bg-green-100 p-3 rounded-full text-green-600 animate-pulse"><Icons.Eye /></div>
      <div>
        {isPreview ? <div className="text-xs font-bold text-gray-500 uppercase">{block.data.label}</div> : <input value={block.data.label} onChange={e => onUpdate(block.id, {...block.data, label: e.target.value})} className="text-xs font-bold border-b w-24" />}
        <div className="text-2xl font-black font-mono tracking-widest text-gray-800">
           {block.data.count.toLocaleString()}
        </div>
      </div>
      {block.data.showLiveIndicator && <div className="flex items-center gap-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold animate-pulse"><div className="w-1.5 h-1.5 bg-red-600 rounded-full" /> LIVE</div>}
    </div>
  )
}

export const SpeechRenderer: React.FC<{ block: SpeechBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const alignment = block.data.alignment || 'left';
  const alignClass = alignment === 'center' ? 'text-center' : alignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="py-16 px-4 bg-white relative group">
       {!isPreview && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
             <div className="bg-white p-1 rounded-lg border border-gray-200 flex gap-1 shadow-sm">
               <button 
                 onClick={() => onUpdate(block.id, { ...block.data, alignment: 'left' })} 
                 className={`p-1 rounded ${alignment === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                 title="Align Left"
               >
                 <Icons.AlignLeft size={16} />
               </button>
               <button 
                 onClick={() => onUpdate(block.id, { ...block.data, alignment: 'center' })} 
                 className={`p-1 rounded ${alignment === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                 title="Align Center"
               >
                 <Icons.AlignCenter size={16} />
               </button>
               <button 
                 onClick={() => onUpdate(block.id, { ...block.data, alignment: 'justify' })} 
                 className={`p-1 rounded ${alignment === 'justify' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                 title="Justify"
               >
                 <Icons.AlignJustify size={16} />
               </button>
             </div>
             <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
          </div>
        )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-64 shrink-0 relative">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-2 border-4 border-white">
            <img src={block.data.imageUrl} className="w-full h-full object-cover" alt="Author" />
          </div>
          {!isPreview && <div className="absolute inset-0 z-10 flex items-center justify-center"><ImageControl label="Foto" url={block.data.imageUrl} onChange={v => onUpdate(block.id, {...block.data, imageUrl: v})} /></div>}
        </div>
        <div className="flex-1 text-center md:text-left relative w-full">
           {isPreview ? <h2 className="text-3xl font-bold mb-6 text-primary">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-6 text-primary w-full border-b outline-none bg-transparent" />}
           
           {isPreview ? (
             <div className={`${getSizeClass(block.data.fontSize, 'body')} text-gray-600 leading-loose italic whitespace-pre-wrap ${alignClass}`}>"{block.data.text}"</div>
           ) : (
             <textarea value={block.data.text} onChange={e => onUpdate(block.id, {...block.data, text: e.target.value})} className={`w-full h-48 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none resize-none ${alignClass}`} />
           )}
           
           <div className="mt-8">
             {isPreview ? <div className="font-bold text-lg text-gray-900">{block.data.authorName}</div> : <input value={block.data.authorName} onChange={e => onUpdate(block.id, {...block.data, authorName: e.target.value})} className="font-bold text-lg border-b w-full outline-none" placeholder="Nama Penulis" />}
             {isPreview ? <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">{block.data.authorRole}</div> : <input value={block.data.authorRole} onChange={e => onUpdate(block.id, {...block.data, authorRole: e.target.value})} className="text-sm font-medium text-gray-400 border-b w-full outline-none" placeholder="Jawatan" />}
           </div>
        </div>
      </div>
    </div>
  )
}

export const CalendarRenderer: React.FC<{ block: CalendarBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold mb-8 text-center">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-8 text-center w-full border-b outline-none bg-transparent" />}
      
      <div className="space-y-4">
        {block.data.events.map((evt, idx) => (
          <div key={idx} className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="w-24 bg-primary text-white flex flex-col items-center justify-center p-4 shrink-0">
               {isPreview ? <span className="text-3xl font-bold leading-none">{evt.date}</span> : <input value={evt.date} onChange={e => { const ne = [...block.data.events]; ne[idx].date = e.target.value; onUpdate(block.id, {...block.data, events: ne}) }} className="w-12 text-center bg-transparent border-b border-white/30 text-white font-bold" />}
               {isPreview ? <span className="text-xs uppercase font-medium opacity-80 mt-1">{evt.month}</span> : <input value={evt.month} onChange={e => { const ne = [...block.data.events]; ne[idx].month = e.target.value; onUpdate(block.id, {...block.data, events: ne}) }} className="w-12 text-center bg-transparent border-b border-white/30 text-xs mt-1" />}
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center">
               {isPreview ? <h3 className="font-bold text-lg text-gray-800">{evt.title}</h3> : <input value={evt.title} onChange={e => { const ne = [...block.data.events]; ne[idx].title = e.target.value; onUpdate(block.id, {...block.data, events: ne}) }} className="font-bold w-full border-b outline-none" placeholder="Event Title" />}
               {isPreview ? <p className="text-sm text-gray-500">{evt.desc}</p> : <input value={evt.desc} onChange={e => { const ne = [...block.data.events]; ne[idx].desc = e.target.value; onUpdate(block.id, {...block.data, events: ne}) }} className="text-sm w-full border-b outline-none" placeholder="Description/Location" />}
            </div>
            {!isPreview && (
              <button onClick={() => { const ne = block.data.events.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, events: ne}) }} className="bg-red-50 text-red-500 px-4 hover:bg-red-100"><Icons.Trash2 size={16} /></button>
            )}
          </div>
        ))}
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, {...block.data, events: [...block.data.events, { date: '01', month: 'JAN', title: 'New Event', desc: 'Description' }]})} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-primary hover:border-primary">
            <Icons.Plus size={18} /> Tambah Acara
          </button>
        )}
      </div>
    </div>
  )
}

export const DownloadsRenderer: React.FC<{ block: DownloadsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Icons.Download className="text-primary" /> {block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full border-b bg-transparent outline-none" />}
      
      <div className="grid gap-3">
         {block.data.items.map((item, idx) => (
           <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group">
             <div className="bg-gray-100 p-2 rounded text-gray-600 font-bold text-xs w-12 text-center">{item.type}</div>
             <div className="flex-1">
               {isPreview ? <a href={item.url} className="font-medium text-blue-700 hover:underline">{item.title}</a> : <input value={item.title} onChange={e => { const ni = [...block.data.items]; ni[idx].title = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="font-medium w-full border-b outline-none" />}
             </div>
             {isPreview ? (
               <a href={item.url} className="p-2 text-gray-400 hover:text-primary bg-gray-50 rounded-full"><Icons.Download size={18} /></a>
             ) : (
               <div className="flex gap-2">
                 <input value={item.url} onChange={e => { const ni = [...block.data.items]; ni[idx].url = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded w-32" placeholder="URL" />
                 <select value={item.type} onChange={e => { const ni = [...block.data.items]; ni[idx].type = e.target.value as any; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded">
                   <option>PDF</option><option>DOC</option><option>FORM</option>
                 </select>
                 <button onClick={() => { const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, items: ni}) }} className="text-red-500"><Icons.Trash2 size={14} /></button>
               </div>
             )}
           </div>
         ))}
         {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, items: [...block.data.items, { title: 'New File', url: '#', type: 'PDF' }]})} className="text-sm text-primary font-bold">+ Add File</button>}
      </div>
    </div>
  )
}

export const FaqRenderer: React.FC<{ block: FaqBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
       <div className="text-center mb-10">
         {isPreview ? <h2 className="text-3xl font-bold">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center w-full border-b bg-transparent outline-none" />}
       </div>
       <div className="space-y-4">
         {block.data.items.map((item, idx) => (
           <details key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
               {isPreview ? <span>{item.question}</span> : <input value={item.question} onClick={e => e.preventDefault()} onChange={e => { const ni = [...block.data.items]; ni[idx].question = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="w-full bg-transparent border-b border-dashed outline-none" />}
               <span className="transition group-open:rotate-180 ml-4"><Icons.ArrowDown size={16} /></span>
             </summary>
             <div className="text-gray-600 p-5 border-t border-gray-100 bg-white leading-relaxed">
               {isPreview ? <p>{item.answer}</p> : (
                 <div className="flex flex-col gap-2">
                   <textarea value={item.answer} onChange={e => { const ni = [...block.data.items]; ni[idx].answer = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="w-full p-2 border rounded text-sm" rows={3} />
                   <button onClick={() => { const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, items: ni}) }} className="text-red-500 text-xs self-end">Remove Question</button>
                 </div>
               )}
             </div>
           </details>
         ))}
         {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, items: [...block.data.items, { question: 'Question?', answer: 'Answer.' }]})} className="w-full py-2 bg-gray-100 rounded border border-dashed text-gray-500 hover:bg-gray-200">Add Question</button>}
       </div>
    </div>
  )
}

export const CtaRenderer: React.FC<{ block: CtaBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-8 text-center" style={{ backgroundColor: block.data.bgColor }}>
      <div className="max-w-4xl mx-auto text-white">
         {isPreview ? <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">{block.data.text}</h2> : <textarea value={block.data.text} onChange={e => onUpdate(block.id, {...block.data, text: e.target.value})} className="text-3xl font-bold w-full bg-transparent text-center text-white border-b border-white/20 outline-none resize-none h-32" />}
         
         <div className="flex flex-col items-center gap-4">
           {isPreview ? (
             <a href={block.data.buttonLink} className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform">{block.data.buttonLabel}</a>
           ) : (
             <div className="flex gap-2 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
               <input value={block.data.buttonLabel} onChange={e => onUpdate(block.id, {...block.data, buttonLabel: e.target.value})} className="bg-white text-black px-4 py-2 rounded-lg" placeholder="Button Label" />
               <input value={block.data.buttonLink} onChange={e => onUpdate(block.id, {...block.data, buttonLink: e.target.value})} className="bg-white text-black px-4 py-2 rounded-lg" placeholder="Link URL" />
               <input type="color" value={block.data.bgColor} onChange={e => onUpdate(block.id, {...block.data, bgColor: e.target.value})} className="h-10 w-10 cursor-pointer rounded" />
             </div>
           )}
         </div>
      </div>
    </div>
  )
}

export const CountdownRenderer: React.FC<{ block: CountdownBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const target = new Date(block.data.targetDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const dist = target - now;
      if (dist < 0) {
        setTimeLeft(null);
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

  const TimeBox = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-white text-primary font-black text-3xl md:text-5xl w-20 h-20 md:w-32 md:h-32 flex items-center justify-center rounded-2xl shadow-lg border-b-4 border-blue-100">
        {val < 10 ? `0${val}` : val}
      </div>
      <div className="mt-3 font-bold uppercase tracking-widest text-xs md:text-sm text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="py-16 px-4 bg-gray-50 text-center">
      {isPreview ? <h2 className="text-2xl font-bold mb-10 text-gray-700 uppercase tracking-wide">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold text-center bg-transparent border-b w-full outline-none mb-10" />}
      
      <div className="flex justify-center flex-wrap gap-y-6">
        {timeLeft ? (
          <>
            <TimeBox val={timeLeft.days} label="Hari" />
            <TimeBox val={timeLeft.hours} label="Jam" />
            <TimeBox val={timeLeft.minutes} label="Minit" />
            <TimeBox val={timeLeft.seconds} label="Saat" />
          </>
        ) : (
          <div className="text-xl font-bold text-gray-400">Acara Telah Tamat / Tarikh Tidak Sah</div>
        )}
      </div>
      
      {!isPreview && (
        <div className="mt-8">
           <label className="text-xs font-bold text-gray-500">Target Date: </label>
           <input type="date" value={block.data.targetDate} onChange={e => onUpdate(block.id, {...block.data, targetDate: e.target.value})} className="border p-2 rounded ml-2" />
        </div>
      )}
    </div>
  )
}

export const NoticeRenderer: React.FC<{ block: NoticeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const colors: any = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    green: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`p-6 my-4 rounded-xl border-l-4 ${colors[block.data.color]} shadow-sm max-w-4xl mx-auto flex items-start gap-4 relative group`}>
       <div className="pt-1"><Icons.Megaphone size={24} /></div>
       <div className="flex-1">
          {isPreview ? (
            <>
               <h3 className="font-bold text-lg mb-1">{block.data.title}</h3>
               <p className={`${getSizeClass(block.data.fontSize, 'body')} opacity-90`}>{block.data.content}</p>
            </>
          ) : (
            <div className="flex flex-col gap-2">
               <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold bg-transparent border-b border-black/10 outline-none" />
               <textarea value={block.data.content} onChange={e => onUpdate(block.id, {...block.data, content: e.target.value})} className="bg-transparent border border-black/10 rounded p-1 text-sm h-24" />
            </div>
          )}
       </div>
       {!isPreview && (
         <div className="flex flex-col gap-2 opacity-50 group-hover:opacity-100">
            <select value={block.data.color} onChange={e => onUpdate(block.id, {...block.data, color: e.target.value})} className="text-xs border rounded p-1">
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </select>
            <FontSizeControl value={block.data.fontSize} onChange={(v) => onUpdate(block.id, { ...block.data, fontSize: v })} />
         </div>
       )}
    </div>
  )
}

export const TableRenderer: React.FC<{ block: TableBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-6">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-6 w-full border-b bg-transparent outline-none" />}
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left bg-white">
           <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
             <tr>
               {[0,1,2].map(i => (
                 <th key={i} className="p-4 border-b">
                   {isPreview ? block.data.headers[i] : <input value={block.data.headers[i]} onChange={e => { const nh = [...block.data.headers]; nh[i] = e.target.value; onUpdate(block.id, {...block.data, headers: nh}) }} className="bg-transparent w-full uppercase outline-none" />}
                 </th>
               ))}
               {!isPreview && <th className="w-10"></th>}
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {block.data.rows.map((row, idx) => (
               <tr key={idx} className="hover:bg-gray-50">
                 {['col1','col2','col3'].map((col) => (
                   <td key={col} className="p-4 text-sm">
                     {isPreview ? (row as any)[col] : <input value={(row as any)[col]} onChange={e => { const nr = [...block.data.rows]; (nr[idx] as any)[col] = e.target.value; onUpdate(block.id, {...block.data, rows: nr}) }} className="w-full bg-transparent border-b border-transparent hover:border-gray-200 outline-none" />}
                   </td>
                 ))}
                 {!isPreview && (
                   <td className="p-2 text-center">
                     <button onClick={() => { const nr = block.data.rows.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, rows: nr}) }} className="text-red-400 hover:text-red-600"><Icons.Trash2 size={14} /></button>
                   </td>
                 )}
               </tr>
             ))}
           </tbody>
        </table>
      </div>
      {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, rows: [...block.data.rows, { col1: '-', col2: '-', col3: '-' }]})} className="mt-2 text-sm text-primary font-bold">+ Add Row</button>}
    </div>
  )
}

export const StaffGridRenderer: React.FC<{ block: StaffGridBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-wide border-b pb-4">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center w-full mb-12 border-b bg-transparent outline-none" />}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
         {block.data.members.map((member, idx) => (
           <div key={idx} className="flex flex-col items-center group relative">
             <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-md">
               <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               {!isPreview && <div className="absolute top-2 right-2"><ImageControl label="" url={member.imageUrl} onChange={v => { const nm = [...block.data.members]; nm[idx].imageUrl = v; onUpdate(block.id, {...block.data, members: nm}) }} /></div>}
             </div>
             {isPreview ? (
               <div className="text-center">
                 <h3 className="font-bold text-gray-900 text-sm">{member.name}</h3>
                 <p className="text-xs text-primary font-medium uppercase mt-0.5">{member.position}</p>
               </div>
             ) : (
               <div className="w-full space-y-1">
                 <input value={member.name} onChange={e => { const nm = [...block.data.members]; nm[idx].name = e.target.value; onUpdate(block.id, {...block.data, members: nm}) }} className="text-center font-bold text-sm w-full border-b" placeholder="Name" />
                 <input value={member.position} onChange={e => { const nm = [...block.data.members]; nm[idx].position = e.target.value; onUpdate(block.id, {...block.data, members: nm}) }} className="text-center text-xs text-primary w-full border-b" placeholder="Role" />
                 <button onClick={() => { const nm = block.data.members.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, members: nm}) }} className="w-full text-center text-[10px] text-red-400">Remove</button>
               </div>
             )}
           </div>
         ))}
         {!isPreview && (
           <button onClick={() => onUpdate(block.id, {...block.data, members: [...block.data.members, { id: uuidv4(), name: 'Nama', position: 'Jawatan', imageUrl: 'https://picsum.photos/200/300' }]})} className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-primary transition-all">
             <Icons.Plus size={32} />
           </button>
         )}
      </div>
    </div>
  )
}

export const TestimonialRenderer: React.FC<{ block: TestimonialBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-20 px-8 bg-blue-50 text-center relative overflow-hidden">
      <div className="absolute top-10 left-10 text-9xl text-blue-100 font-serif opacity-50 z-0">"</div>
      <div className="relative z-10 max-w-4xl mx-auto">
         {isPreview ? (
           <blockquote className="text-2xl md:text-4xl font-serif text-blue-900 leading-relaxed italic mb-8">
             "{block.data.quote}"
           </blockquote>
         ) : (
           <textarea value={block.data.quote} onChange={e => onUpdate(block.id, {...block.data, quote: e.target.value})} className="w-full h-32 bg-transparent text-2xl text-center italic border-b border-blue-200 outline-none resize-none mb-8" placeholder="Quote Text..." />
         )}
         
         <div className="flex flex-col items-center">
            {isPreview ? <div className="font-bold text-gray-900">{block.data.author}</div> : <input value={block.data.author} onChange={e => onUpdate(block.id, {...block.data, author: e.target.value})} className="font-bold text-center bg-transparent border-b w-64" placeholder="Author Name" />}
            {isPreview ? <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">{block.data.role}</div> : <input value={block.data.role} onChange={e => onUpdate(block.id, {...block.data, role: e.target.value})} className="text-sm text-center bg-transparent border-b w-64 mt-1" placeholder="Role / Batch" />}
         </div>
      </div>
    </div>
  )
}

export const LinkListRenderer: React.FC<{ block: LinkListBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 max-w-sm mx-auto w-full">
      {isPreview ? <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">{block.data.title}</h3> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg mb-4 w-full border-b pb-2 bg-transparent outline-none" />}
      
      <ul className="space-y-2">
        {block.data.links.map((link, idx) => (
          <li key={idx} className="flex items-center gap-2 group">
             <Icons.Link className="text-primary w-4 h-4" />
             <div className="flex-1">
               {isPreview ? <a href={link.url} className="text-blue-600 hover:underline block truncate">{link.label}</a> : (
                 <div className="flex gap-2">
                    <input value={link.label} onChange={e => { const nl = [...block.data.links]; nl[idx].label = e.target.value; onUpdate(block.id, {...block.data, links: nl}) }} className="flex-1 border-b text-sm" placeholder="Label" />
                    <input value={link.url} onChange={e => { const nl = [...block.data.links]; nl[idx].url = e.target.value; onUpdate(block.id, {...block.data, links: nl}) }} className="flex-1 border-b text-xs text-gray-500" placeholder="URL" />
                 </div>
               )}
             </div>
             {!isPreview && <button onClick={() => { const nl = block.data.links.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, links: nl}) }} className="text-red-400 opacity-0 group-hover:opacity-100"><Icons.X size={14} /></button>}
          </li>
        ))}
      </ul>
      {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, links: [...block.data.links, { label: 'New Link', url: '#' }]})} className="mt-3 text-xs text-primary font-bold bg-blue-50 px-3 py-1 rounded">+ Add Link</button>}
    </div>
  )
}

export const NewsRenderer: React.FC<{ block: NewsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Icons.Newspaper className="text-primary" /> {block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold mb-8 w-full border-b bg-transparent outline-none" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {block.data.items.map((item, idx) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full">
             <div className="flex justify-between items-start mb-4">
                {isPreview ? <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{item.tag}</span> : <select value={item.tag} onChange={e => { const ni = [...block.data.items]; ni[idx].tag = e.target.value as any; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded w-32"><option>PENTADBIRAN</option><option>KURIKULUM</option><option>HAL EHWAL MURID</option><option>KOKURIKULUM</option><option>PPKI</option><option>KELAB KEBAJIKAN GURU DAN STAF</option></select>}
                {isPreview ? <span className="text-xs text-gray-400 font-mono">{formatDate(item.date)}</span> : <input type="date" value={item.date} onChange={e => { const ni = [...block.data.items]; ni[idx].date = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded" />}
             </div>
             
             <div className="flex-1">
               {isPreview ? (
                  item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block font-bold text-lg mb-2 text-gray-800 hover:text-primary leading-snug hover:underline decoration-primary decoration-2 underline-offset-2 transition-all cursor-pointer">
                      {item.title}
                      <Icons.ExternalLink className="inline ml-1 w-3 h-3 text-gray-400" />
                    </a>
                  ) : (
                    <h3 className="font-bold text-lg mb-2 text-gray-800 leading-snug">{item.title}</h3>
                  )
               ) : (
                 <div className="flex flex-col gap-2 mb-2">
                   <textarea value={item.title} onChange={e => { const ni = [...block.data.items]; ni[idx].title = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="w-full font-bold text-lg border-b" rows={2} placeholder="Tajuk Berita" />
                   <input value={item.link || ''} onChange={e => { const ni = [...block.data.items]; ni[idx].link = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="text-xs border rounded p-1 w-full bg-gray-50 text-gray-600" placeholder="URL Pautan (Optional)" />
                 </div>
               )}
               
               {isPreview ? <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p> : <textarea value={item.content} onChange={e => { const ni = [...block.data.items]; ni[idx].content = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="w-full text-sm border rounded p-1 h-20" placeholder="Ringkasan berita..." />}
             </div>
             
             {!isPreview && <button onClick={() => { const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, items: ni}) }} className="absolute top-2 right-2 text-red-300 hover:text-red-500"><Icons.Trash2 size={16} /></button>}
          </div>
        ))}
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, {...block.data, items: [...block.data.items, { id: uuidv4(), title: 'Berita Baru', date: new Date().toISOString().split('T')[0], tag: 'HAL EHWAL MURID', content: 'Kandungan berita...', link: '' }]})} className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 text-gray-400 hover:bg-gray-50 hover:text-primary transition-all min-h-[250px]">
            <Icons.Plus size={32} />
          </button>
        )}
      </div>
    </div>
  )
}

export const DefinitionRenderer: React.FC<{ block: DefinitionBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 w-full">
           {isPreview ? <h2 className="text-3xl font-bold mb-8 text-primary uppercase tracking-wide border-l-4 border-secondary pl-4">{block.data.title}</h2> : <input value={block.data.title} onChange={e => onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold mb-8 w-full border-b bg-transparent outline-none" />}
           
           <div className="space-y-6">
             {block.data.items.map((item, idx) => (
               <div key={idx} className="flex gap-4 group">
                 <div className="w-12 h-1 bg-secondary mt-3 shrink-0"></div>
                 <div className="flex-1">
                   {isPreview ? <h3 className="font-bold text-lg text-gray-900">{item.term}</h3> : <input value={item.term} onChange={e => { const ni = [...block.data.items]; ni[idx].term = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="font-bold text-lg w-full border-b" placeholder="Term" />}
                   {isPreview ? <p className="text-gray-600 leading-relaxed">{item.definition}</p> : <textarea value={item.definition} onChange={e => { const ni = [...block.data.items]; ni[idx].definition = e.target.value; onUpdate(block.id, {...block.data, items: ni}) }} className="w-full border rounded p-1 text-sm mt-1" placeholder="Definisi" />}
                 </div>
                 {!isPreview && <button onClick={() => { const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, {...block.data, items: ni}) }} className="text-red-400 opacity-0 group-hover:opacity-100"><Icons.Trash2 size={14} /></button>}
               </div>
             ))}
             {!isPreview && <button onClick={() => onUpdate(block.id, {...block.data, items: [...block.data.items, { term: 'Istilah', definition: 'Maksud...' }]})} className="text-sm text-primary font-bold">+ Add Item</button>}
           </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-center relative group">
           <img src={block.data.imageUrl} alt="Definition Visual" className="w-64 h-auto object-contain drop-shadow-2xl" />
           {!isPreview && <div className="absolute inset-0 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageControl label="Visual" url={block.data.imageUrl} onChange={v => onUpdate(block.id, {...block.data, imageUrl: v})} /></div>}
        </div>
      </div>
    </div>
  )
}

export const BlockRenderer: React.FC<RendererProps> = (props) => {
  const { block, ...rest } = props;
  switch (block.type) {
    case 'hero': return <HeroRenderer block={block as HeroBlock} {...rest} />;
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