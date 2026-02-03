import React, { useState, useEffect } from 'react';
import { 
  SectionBlock, HeroBlock, FeatureBlock, ContentBlock, GalleryBlock, 
  ContactBlock, FooterBlock, HtmlBlock, DriveBlock, VideoBlock, ImageBlock,
  TickerBlock, OrgChartBlock, StatsBlock, TimeBlock, VisitorBlock, SpeechBlock,
  CalendarBlock, DownloadsBlock, FaqBlock, CtaBlock, CountdownBlock, NoticeBlock,
  TableBlock, StaffGridBlock, TestimonialBlock, LinkListBlock, NewsBlock, DefinitionBlock, OrgMember
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

// --- RENDERERS ---

export const HeroRenderer: React.FC<{ block: HeroBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="relative min-h-[500px] w-full flex flex-col items-center justify-center text-center text-white overflow-hidden group">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${block.data.bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary/90" />
      {!isPreview && <ImageControl label="URL Gambar Latar" url={block.data.bgImage} onChange={(val) => onUpdate(block.id, { ...block.data, bgImage: val })} />}
      <div className="relative z-10 p-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="mb-6 w-full max-w-5xl flex flex-col items-center">
           {isPreview ? (
             <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-center mx-auto drop-shadow-lg" style={{ textWrap: 'balance' }}>{block.data.title}</h1>
           ) : (
             <textarea value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-4xl md:text-6xl font-extrabold bg-transparent text-center border-b-2 border-transparent hover:border-white/30 focus:border-white outline-none w-full placeholder-white/40 transition-all resize-none overflow-hidden mx-auto" placeholder="Tajuk Utama Sekolah" rows={2} style={{ textWrap: 'balance' }} onClick={e=>e.stopPropagation()} />
           )}
        </div>
        <div className="mb-10 w-full max-w-4xl flex flex-col items-center">
          {isPreview ? (
            <p className="text-lg md:text-xl font-light opacity-95 text-center mx-auto max-w-2xl leading-relaxed" style={{ textWrap: 'balance' }}>{block.data.subtitle}</p>
          ) : (
            <textarea value={block.data.subtitle} onChange={(e) => onUpdate(block.id, { ...block.data, subtitle: e.target.value })} className="text-lg md:text-xl bg-transparent text-center border-b border-transparent hover:border-white/30 focus:border-white outline-none w-full resize-none h-24 placeholder-white/40 font-light mx-auto" placeholder="Slogan sekolah..." style={{ textWrap: 'balance' }} onClick={e=>e.stopPropagation()} />
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
    <div className={`py-16 px-8 max-w-5xl mx-auto text-${block.data.alignment} flex flex-col`}>
      <div className="mb-8 w-full">
        {isPreview ? <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 border-b-4 border-secondary inline-block pb-1">{block.data.title}</h2> : <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className={`text-3xl md:text-4xl font-bold text-gray-800 w-full bg-transparent border-b-2 border-dashed border-blue-100 focus:border-primary outline-none text-${block.data.alignment} py-2 transition-all`} placeholder="Tajuk Artikel" onClick={e=>e.stopPropagation()} />}
      </div>
      <div className="relative group w-full">
        {isPreview ? <div className="prose prose-blue max-w-none text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{block.data.body}</div> : <textarea value={block.data.body} onChange={(e) => onUpdate(block.id, { ...block.data, body: e.target.value })} className="w-full h-64 p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 focus:border-primary focus:bg-white outline-none resize-none transition-all text-lg shadow-sm" placeholder="Tulis maklumat sekolah anda di sini..." onClick={e=>e.stopPropagation()} />}
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

export const FeatureRenderer: React.FC<{ block: FeatureBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {isPreview ? (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">{block.data.title}</h2>
        ) : (
          <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-3xl font-bold text-center w-full mb-12 bg-transparent border-b outline-none" placeholder="Tajuk Ciri" onClick={e=>e.stopPropagation()} />
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {block.data.features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group relative">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                 {getIconByName(feature.icon, "w-8 h-8")}
              </div>
              {!isPreview && (
                 <select 
                   value={feature.icon} 
                   onChange={(e) => {
                     const newFeatures = [...block.data.features];
                     newFeatures[idx].icon = e.target.value;
                     onUpdate(block.id, { ...block.data, features: newFeatures });
                   }}
                   className="absolute top-2 right-2 text-xs border rounded opacity-0 group-hover:opacity-100"
                   onClick={e => e.stopPropagation()}
                 >
                   {iconList.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                 </select>
              )}
              {isPreview ? (
                <>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <input value={feature.title} onChange={(e) => { const nf = [...block.data.features]; nf[idx].title = e.target.value; onUpdate(block.id, { ...block.data, features: nf }); }} className="text-center font-bold text-xl border-b outline-none" placeholder="Tajuk" onClick={e=>e.stopPropagation()} />
                  <textarea value={feature.description} onChange={(e) => { const nf = [...block.data.features]; nf[idx].description = e.target.value; onUpdate(block.id, { ...block.data, features: nf }); }} className="text-center text-gray-600 border rounded p-1 resize-none text-sm" placeholder="Deskripsi" rows={3} onClick={e=>e.stopPropagation()} />
                  <button onClick={(e) => { e.stopPropagation(); const nf = block.data.features.filter((_, i) => i !== idx); onUpdate(block.id, { ...block.data, features: nf }); }} className="text-red-500 text-xs">Padam</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, { ...block.data, features: [...block.data.features, { title: 'Ciri Baru', description: 'Deskripsi', icon: 'Star' }] })} className="mt-8 mx-auto flex items-center gap-2 px-6 py-2 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:text-primary hover:border-primary hover:bg-white transition-all">
            <Icons.Plus size={20} /> Tambah Ciri
          </button>
        )}
      </div>
    </div>
  );
};

export const GalleryRenderer: React.FC<{ block: GalleryBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {isPreview ? (
           <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">{block.data.title}</h2>
        ) : (
           <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-3xl font-bold text-center w-full mb-10 bg-transparent border-b outline-none" placeholder="Tajuk Galeri" onClick={e=>e.stopPropagation()} />
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {block.data.images.map((img, idx) => (
            <div key={idx} className="aspect-square relative group rounded-lg overflow-hidden bg-gray-100">
               <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               {!isPreview && (
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-2 transition-opacity gap-2">
                   <input value={img} onChange={(e) => { const ni = [...block.data.images]; ni[idx] = e.target.value; onUpdate(block.id, { ...block.data, images: ni }); }} className="text-xs w-full p-1 rounded" placeholder="Image URL" onClick={e=>e.stopPropagation()} />
                   <button onClick={(e) => { e.stopPropagation(); const ni = block.data.images.filter((_, i) => i !== idx); onUpdate(block.id, { ...block.data, images: ni }); }} className="text-white bg-red-500 p-1 rounded hover:bg-red-600"><Icons.Trash2 size={16} /></button>
                 </div>
               )}
            </div>
          ))}
          {!isPreview && (
            <button onClick={() => onUpdate(block.id, { ...block.data, images: [...block.data.images, 'https://picsum.photos/400/400'] })} className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50 transition-all">
              <Icons.Plus size={32} />
              <span className="text-sm font-bold mt-2">Tambah</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContactRenderer: React.FC<{ block: ContactBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  // Helper to extract valid map URL from potential iframe code
  const getMapSrc = (input: string) => {
    if (!input) return '';
    const srcMatch = input.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) return srcMatch[1];
    if (input.trim().startsWith('http')) return input;
    return '';
  };

  const mapSrc = getMapSrc(block.data.mapUrl);

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
         <div>
            {isPreview ? <h2 className="text-3xl font-bold mb-6 text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-3xl font-bold mb-6 w-full border-b outline-none" placeholder="Hubungi Kami" onClick={e=>e.stopPropagation()} />}
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-lg"><Icons.MapPin size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Alamat</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.address}</p> : <textarea value={block.data.address} onChange={(e) => onUpdate(block.id, { ...block.data, address: e.target.value })} className="w-full border rounded p-2 text-sm resize-none" rows={3} placeholder="Alamat Sekolah" onClick={e=>e.stopPropagation()} />}
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-lg"><Icons.Phone size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Telefon</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.phone}</p> : <input value={block.data.phone} onChange={(e) => onUpdate(block.id, { ...block.data, phone: e.target.value })} className="w-full border rounded p-2 text-sm" placeholder="No. Telefon" onClick={e=>e.stopPropagation()} />}
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-primary rounded-lg"><Icons.Mail size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">Emel</h4>
                    {isPreview ? <p className="text-gray-600">{block.data.email}</p> : <input value={block.data.email} onChange={(e) => onUpdate(block.id, { ...block.data, email: e.target.value })} className="w-full border rounded p-2 text-sm" placeholder="Alamat Emel" onClick={e=>e.stopPropagation()} />}
                  </div>
               </div>
            </div>
         </div>
         <div className="bg-gray-100 rounded-xl overflow-hidden min-h-[300px] relative group">
            {mapSrc ? (
               <iframe 
                 src={mapSrc} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, minHeight: '300px' }} 
                 allowFullScreen 
                 loading="lazy" 
               />
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                 <Icons.MapPin size={48} className="mb-2 opacity-30" />
                 <p className="text-xs">Peta tidak tersedia</p>
               </div>
            )}
            {!isPreview && (
               <div className="absolute bottom-4 left-4 right-4 bg-white p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                 <input value={block.data.mapUrl} onChange={(e) => onUpdate(block.id, { ...block.data, mapUrl: e.target.value })} className="w-full text-xs border rounded p-1" placeholder="Paste Embed Code Here (<iframe...>)" onClick={e=>e.stopPropagation()} />
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export const FooterRenderer: React.FC<{ block: FooterBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="bg-gray-900 text-white py-8 px-4 text-center">
      {isPreview ? (
        <p className="opacity-70 text-sm">{block.data.copyright}</p>
      ) : (
        <input value={block.data.copyright} onChange={(e) => onUpdate(block.id, { ...block.data, copyright: e.target.value })} className="bg-transparent text-center w-full text-sm text-gray-300 border-b border-gray-700 outline-none" placeholder="Copyright info..." onClick={e=>e.stopPropagation()} />
      )}
    </div>
  );
};

export const HtmlRenderer: React.FC<{ block: HtmlBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4" style={{ minHeight: block.data.height }}>
       {isPreview ? (
         <div dangerouslySetInnerHTML={{ __html: block.data.code }} />
       ) : (
         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
           <label className="block text-xs font-bold text-gray-500 mb-2">HTML / Embed Code</label>
           <textarea value={block.data.code} onChange={(e) => onUpdate(block.id, { ...block.data, code: e.target.value })} className="w-full h-32 p-2 font-mono text-xs border rounded mb-2" placeholder="<div>...</div>" onClick={e=>e.stopPropagation()} />
           <div className="flex gap-2 items-center">
             <label className="text-xs text-gray-500">Ketinggian:</label>
             <input value={block.data.height} onChange={(e) => onUpdate(block.id, { ...block.data, height: e.target.value })} className="text-xs border rounded p-1 w-20" placeholder="auto" onClick={e=>e.stopPropagation()} />
           </div>
         </div>
       )}
    </div>
  );
};

export const DriveRenderer: React.FC<{ block: DriveBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-6 text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-2xl font-bold mb-6 w-full border-b outline-none" placeholder="Tajuk Dokumen" onClick={e=>e.stopPropagation()} />}
      <div className="w-full border rounded-xl overflow-hidden shadow-sm bg-gray-100 relative" style={{ height: block.data.height }}>
        {block.data.embedUrl ? (
          <iframe src={block.data.embedUrl} width="100%" height="100%" style={{ border: 0 }} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Dokumen tidak ditemui</div>
        )}
        {!isPreview && (
          <div className="absolute top-2 right-2 bg-white p-2 rounded shadow flex flex-col gap-2 w-64">
             <input value={block.data.embedUrl} onChange={(e) => onUpdate(block.id, { ...block.data, embedUrl: e.target.value })} className="text-xs border rounded p-1 w-full" placeholder="Google Drive Embed URL" onClick={e=>e.stopPropagation()} />
             <input value={block.data.height} onChange={(e) => onUpdate(block.id, { ...block.data, height: e.target.value })} className="text-xs border rounded p-1 w-full" placeholder="Height (e.g. 500px)" onClick={e=>e.stopPropagation()} />
          </div>
        )}
      </div>
    </div>
  );
};

export const VideoRenderer: React.FC<{ block: VideoBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
       {isPreview ? <h2 className="text-2xl font-bold mb-6 text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-2xl font-bold mb-6 w-full border-b outline-none" placeholder="Tajuk Video" onClick={e=>e.stopPropagation()} />}
       <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative">
          {block.data.url ? (
            <iframe src={getEmbedUrl(block.data.url)} title={block.data.title} className="w-full h-full" allowFullScreen frameBorder="0" />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">Tiada Video URL</div>
          )}
          {!isPreview && (
            <div className="absolute bottom-4 left-4 right-4 bg-white p-2 rounded shadow">
              <input value={block.data.url} onChange={(e) => onUpdate(block.id, { ...block.data, url: e.target.value })} className="w-full text-xs border rounded p-1" placeholder="YouTube URL" onClick={e=>e.stopPropagation()} />
            </div>
          )}
       </div>
    </div>
  );
};

export const ImageRenderer: React.FC<{ block: ImageBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const getAnimationClass = () => {
    switch (block.data.animation) {
      case 'zoom': return 'animate-[pulse_4s_ease-in-out_infinite] hover:scale-105'; // Simplified zoom effect
      case 'pan': return 'hover:object-left-top object-center transition-all duration-[5s] hover:scale-125'; 
      default: return '';
    }
  };

  return (
    <div className="py-12 px-4 flex flex-col items-center w-full group relative">
      <div className={`relative ${block.data.width === 'full' ? 'w-full' : block.data.width === 'large' ? 'max-w-6xl' : 'max-w-4xl'} overflow-hidden rounded-xl shadow-lg`}>
        <img 
          src={block.data.url} 
          className={`w-full h-full object-cover transition-transform duration-700 ${getAnimationClass()}`} 
          style={block.data.animation === 'pan' ? { transformOrigin: 'center center' } : {}}
        />
        {!isPreview && (
          <>
            <ImageControl label="Image URL" url={block.data.url} onChange={(v) => onUpdate(block.id, { ...block.data, url: v })} />
            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow flex gap-2 items-center text-xs z-30">
               <span className="font-bold">Animasi:</span>
               <select 
                 value={block.data.animation || 'none'} 
                 onChange={(e) => onUpdate(block.id, { ...block.data, animation: e.target.value })}
                 className="border rounded p-1"
                 onClick={e => e.stopPropagation()}
               >
                 <option value="none">Tiada (Statik)</option>
                 <option value="zoom">Nadi (Zoom)</option>
                 <option value="pan">Pan (Gerak)</option>
               </select>
            </div>
          </>
        )}
      </div>
      {isPreview ? block.data.caption && <p className="mt-2 text-gray-500 italic">{block.data.caption}</p> : <input value={block.data.caption} onChange={(e) => onUpdate(block.id, { ...block.data, caption: e.target.value })} className="mt-2 text-center border-b" placeholder="Caption" onClick={e=>e.stopPropagation()} />}
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
            <h3 className={`font-bold text-gray-900 ${isLeader ? 'text-xl' : 'text-sm'}`}>{member.name}</h3>
            <p className={`text-primary font-bold uppercase tracking-wider ${isLeader ? 'text-base' : 'text-[10px]'}`}>{member.position}</p>
          </>
        ) : (
          <div className="flex flex-col gap-1 w-full items-center">
            <input value={member.name} onChange={(e) => { const nm = [...block.data.members]; nm[idx].name = e.target.value; onUpdate(block.id, { ...block.data, members: nm }); }} className={`text-center font-bold bg-transparent border-b border-transparent hover:border-gray-300 outline-none ${isLeader ? 'text-lg' : 'text-xs'}`} placeholder="Nama" onClick={e=>e.stopPropagation()} />
            <input value={member.position} onChange={(e) => { const nm = [...block.data.members]; nm[idx].position = e.target.value; onUpdate(block.id, { ...block.data, members: nm }); }} className="text-center text-xs text-primary border-b border-transparent hover:border-blue-300 outline-none" placeholder="Jawatan" onClick={e=>e.stopPropagation()} />
            <button onClick={(e) => {e.stopPropagation(); const nm = block.data.members.filter(m => m.id !== member.id); onUpdate(block.id, { ...block.data, members: nm }); }} className="text-red-500 text-[10px] hover:underline">Padam</button>
          </div>
        )}
      </div>
      
      {!isPreview && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 opacity-0 group-hover:opacity-100 text-gray-400">
          <Icons.Layout size={12} />
        </div>
      )}
    </div>
  );

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {isPreview ? (
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 uppercase tracking-wide">{block.data.title}</h2>
        ) : (
          <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="block w-full text-center text-3xl font-bold mb-16 bg-transparent border-b-2 border-dashed border-blue-200 outline-none" placeholder="Tajuk Carta Organisasi" onClick={e=>e.stopPropagation()} />
        )}
        
        {/* Leader Section (First Item) */}
        {block.data.members.length > 0 && (
           <div className="flex justify-center w-full relative">
              {/* Connector Line */}
              {block.data.members.length > 1 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-300 -mb-12"></div>}
              {renderMember(block.data.members[0], 0, true)}
           </div>
        )}

        {/* Subordinates Grid (Rest of items) */}
        {block.data.members.length > 1 && (
          <div className="mt-12 pt-12 border-t-2 border-gray-100 w-full relative">
             {/* Horizontal Connector */}
             <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gray-300 -mt-[1px]"></div>
             
             {/* Vertical Connectors for grid */}
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

export const NewsRenderer: React.FC<{ block: NewsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const tagColors: Record<string, string> = {
    KUR: 'bg-blue-100 text-blue-700',
    HEM: 'bg-pink-100 text-pink-700',
    KOK: 'bg-orange-100 text-orange-700',
    PENT: 'bg-gray-100 text-gray-700'
  };

  const tagLabels: Record<string, string> = {
    KUR: 'KURIKULUM',
    HEM: 'HAL EHWAL MURID',
    KOK: 'KO-KURIKULUM',
    PENT: 'PENTADBIRAN'
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><Icons.Newspaper className="text-primary"/> {block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold w-full mb-8 bg-transparent border-b outline-none" onClick={e=>e.stopPropagation()} />}
      
      <div className="grid md:grid-cols-2 gap-6">
        {block.data.items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative group">
             <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                   {isPreview ? (
                     <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${tagColors[item.tag]}`}>{tagLabels[item.tag]}</span>
                   ) : (
                     <select value={item.tag} onChange={(e)=>{const ni=[...block.data.items];ni[idx].tag=e.target.value as any;onUpdate(block.id,{...block.data,items:ni})}} className="text-xs border rounded bg-gray-50" onClick={e=>e.stopPropagation()}>
                       <option value="KUR">KURIKULUM</option>
                       <option value="HEM">HEM</option>
                       <option value="KOK">KO-KURIKULUM</option>
                       <option value="PENT">PENTADBIRAN</option>
                     </select>
                   )}
                   {isPreview ? <span className="text-xs text-gray-400 font-mono pt-0.5">{item.date}</span> : <input type="date" value={item.date} onChange={(e)=>{const ni=[...block.data.items];ni[idx].date=e.target.value;onUpdate(block.id,{...block.data,items:ni})}} className="text-xs border rounded" onClick={e=>e.stopPropagation()} />}
                </div>
                {!isPreview && <button onClick={(e)=>{e.stopPropagation(); const ni=block.data.items.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data,items:ni})}} className="text-red-400 hover:text-red-600"><Icons.Trash2 size={14}/></button>}
             </div>
             
             {isPreview ? (
                <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
             ) : (
                <input value={item.title} onChange={(e)=>{const ni=[...block.data.items];ni[idx].title=e.target.value;onUpdate(block.id,{...block.data,items:ni})}} className="font-bold text-lg w-full bg-transparent outline-none border-b border-dashed border-gray-200 mb-2" placeholder="Tajuk Berita" onClick={e=>e.stopPropagation()} />
             )}

             {isPreview ? (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.content}</p>
             ) : (
                <textarea value={item.content} onChange={(e)=>{const ni=[...block.data.items];ni[idx].content=e.target.value;onUpdate(block.id,{...block.data,items:ni})}} className="w-full text-sm h-20 resize-none border rounded p-2" placeholder="Isi kandungan ringkas..." onClick={e=>e.stopPropagation()} />
             )}
          </div>
        ))}
      </div>
      {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {id:uuidv4(), title:'Berita Baru', date: new Date().toISOString().split('T')[0], tag:'PENT', content:'Isi kandungan...'}]})} className="mt-6 w-full py-2 border-2 border-dashed rounded-lg text-gray-400 hover:text-primary flex justify-center items-center gap-2"><Icons.Plus size={16}/> Tambah Berita</button>}
    </div>
  );
};

export const DefinitionRenderer: React.FC<{ block: DefinitionBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
         {/* Image Section */}
         <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-64 h-64 relative bg-white rounded-full shadow-xl flex items-center justify-center p-6 border-4 border-white mb-4">
               <img src={block.data.imageUrl} className="max-w-full max-h-full object-contain" alt="Logo/Flag" />
               {!isPreview && <ImageControl label="Gambar" url={block.data.imageUrl} onChange={(v) => onUpdate(block.id, { ...block.data, imageUrl: v })} />}
            </div>
         </div>

         {/* Content Section */}
         <div className="w-full md:w-2/3">
            {isPreview ? <h2 className="text-3xl font-bold mb-8 text-primary border-b-2 border-secondary inline-block pb-2">{block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold w-full mb-8 bg-transparent border-b outline-none" placeholder="Tajuk (Maksud Logo)" onClick={e=>e.stopPropagation()} />}
            
            <div className="grid gap-4">
               {block.data.items.map((item, idx) => (
                 <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1.5 w-3 h-3 rounded-full bg-secondary shrink-0"></div>
                    <div className="flex-1">
                       <div className="flex gap-2 items-center mb-1">
                          {isPreview ? (
                             <span className="font-bold text-gray-800 uppercase text-sm tracking-wider">{item.term}</span>
                          ) : (
                             <input value={item.term} onChange={(e)=>{const ni=[...block.data.items];ni[idx].term=e.target.value;onUpdate(block.id,{...block.data,items:ni})}} className="font-bold text-sm bg-white border rounded px-1" placeholder="Istilah/Warna" onClick={e=>e.stopPropagation()} />
                          )}
                          <span className="text-gray-400">:</span>
                       </div>
                       {isPreview ? (
                          <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
                       ) : (
                          <input value={item.definition} onChange={(e)=>{const ni=[...block.data.items];ni[idx].definition=e.target.value;onUpdate(block.id,{...block.data,items:ni})}} className="w-full text-sm border-b border-dashed outline-none" placeholder="Maksud" onClick={e=>e.stopPropagation()} />
                       )}
                    </div>
                    {!isPreview && <button onClick={(e)=>{e.stopPropagation(); const ni=block.data.items.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data,items:ni})}} className="text-red-400"><Icons.Trash2 size={14}/></button>}
                 </div>
               ))}
            </div>
            {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {term:'Warna/Simbol', definition:'Maksud tersirat...'}]})} className="mt-4 text-xs text-gray-500 hover:text-primary flex items-center gap-1"><Icons.Plus size={12}/> Tambah Definisi</button>}
         </div>
      </div>
    </div>
  );
};

export const TickerRenderer: React.FC<{ block: TickerBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="w-full flex items-stretch h-12 shadow-md">
      {/* Label Section */}
      <div className="bg-primary text-white px-6 flex items-center justify-center shrink-0 relative z-10 font-bold uppercase tracking-wider text-sm md:text-base border-r border-blue-700 min-w-[150px]">
        {isPreview ? (
           block.data.label
        ) : (
           <input 
             value={block.data.label} 
             onChange={(e) => onUpdate(block.id, { ...block.data, label: e.target.value })}
             className="bg-transparent text-white text-center w-full outline-none border-b border-white/20 hover:border-white focus:bg-white/10 transition-colors"
             onClick={(e) => e.stopPropagation()}
             placeholder="LABEL"
           />
        )}
        <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-primary border-b-[8px] border-b-transparent"></div>
      </div>

      {/* Scrolling Text Section */}
      <div className="flex-1 bg-white flex items-center overflow-hidden relative border-b border-gray-100">
         {!isPreview && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex gap-1 bg-gray-100 p-1 rounded-lg shadow-sm border border-gray-200">
             <button onClick={(e) => {e.stopPropagation(); onUpdate(block.id, { ...block.data, direction: block.data.direction === 'left' ? 'right' : 'left' })}} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Tukar Arah"><Icons.ArrowUp className={block.data.direction === 'left' ? '-rotate-90' : 'rotate-90'} size={14} /></button>
             <button onClick={(e) => {e.stopPropagation(); onUpdate(block.id, { ...block.data, speed: block.data.speed > 10 ? 5 : 20 })}} className="p-1 hover:bg-gray-200 rounded font-mono text-xs w-6 text-gray-600">{block.data.speed}s</button>
          </div>
        )}
        
        <div 
          className="whitespace-nowrap inline-block text-gray-800 font-medium w-full"
          style={{
            animation: isPreview ? `marquee-${block.data.direction} ${block.data.speed}s linear infinite` : 'none',
            paddingLeft: isPreview ? '100%' : '20px',
          }}
        >
          <style>
            {`
              @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
              @keyframes marquee-right { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }
            `}
          </style>
          {isPreview ? (
            <span className="mx-4">{block.data.text}</span>
          ) : (
            <input 
              value={block.data.text} 
              onChange={(e) => onUpdate(block.id, { ...block.data, text: e.target.value })}
              className="bg-white/50 text-gray-800 w-full outline-none py-1 px-2 border-b border-dashed border-gray-300 focus:border-primary focus:bg-white"
              placeholder="Tulis info terkini di sini untuk dipaparkan..."
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const SpeechRenderer: React.FC<{ block: SpeechBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-20 px-6 bg-amber-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-bl-full -mr-16 -mt-16 z-0"></div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-start relative z-10">
         <div className="relative group">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <img src={block.data.imageUrl} alt="Author" className="w-full h-full object-cover" />
               {!isPreview && <ImageControl label="Gambar Penulis" url={block.data.imageUrl} onChange={(val) => onUpdate(block.id, { ...block.data, imageUrl: val })} />}
            </div>
            <div className="mt-4 text-center">
               {isPreview ? (
                 <>
                   <h3 className="font-bold text-lg text-gray-900">{block.data.authorName}</h3>
                   <p className="text-sm text-primary font-medium">{block.data.authorRole}</p>
                 </>
               ) : (
                 <div className="flex flex-col gap-2">
                    <input value={block.data.authorName} onChange={(e) => onUpdate(block.id, { ...block.data, authorName: e.target.value })} className="text-center font-bold text-lg bg-transparent border-b border-gray-300 outline-none" placeholder="Nama Guru Besar" onClick={e=>e.stopPropagation()} />
                    <input value={block.data.authorRole} onChange={(e) => onUpdate(block.id, { ...block.data, authorRole: e.target.value })} className="text-center text-sm text-primary bg-transparent border-b border-blue-200 outline-none" placeholder="Jawatan" onClick={e=>e.stopPropagation()} />
                 </div>
               )}
            </div>
         </div>
         <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <Icons.MessageSquare size={32} className="text-secondary" />
               {isPreview ? (
                  <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide border-l-4 border-secondary pl-4">{block.data.title}</h2>
               ) : (
                  <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-3xl font-bold bg-transparent border-b-2 border-dashed border-gray-300 w-full outline-none" placeholder="Tajuk Ucapan" onClick={e=>e.stopPropagation()} />
               )}
            </div>
            {isPreview ? (
               <div className="prose prose-lg text-gray-600 leading-loose text-justify italic font-serif">
                 {block.data.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
               </div>
            ) : (
               <textarea value={block.data.text} onChange={(e) => onUpdate(block.id, { ...block.data, text: e.target.value })} className="w-full h-80 p-6 bg-white rounded-xl border border-gray-200 shadow-inner outline-none resize-none font-serif italic text-lg leading-loose" placeholder="Isi kandungan ucapan..." onClick={e=>e.stopPropagation()} />
            )}
         </div>
      </div>
    </div>
  );
};

export const StatsRenderer: React.FC<{ block: StatsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4 bg-primary text-white">
      <div className="max-w-6xl mx-auto">
        {isPreview ? (
          <h2 className="text-3xl font-bold text-center mb-12">{block.data.title}</h2>
        ) : (
          <input value={block.data.title} onChange={(e) => onUpdate(block.id, { ...block.data, title: e.target.value })} className="text-3xl font-bold text-center w-full mb-12 bg-transparent border-b border-white/30 text-white outline-none" onClick={e=>e.stopPropagation()} />
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {block.data.items.map((item, idx) => (
             <div key={item.id} className="text-center group relative">
               <div className="text-secondary mb-4 flex justify-center">{getIconByName(item.icon, "w-10 h-10")}</div>
               {!isPreview && (
                 <select 
                   value={item.icon} 
                   onChange={(e) => { const ni = [...block.data.items]; ni[idx].icon = e.target.value; onUpdate(block.id, { ...block.data, items: ni }); }}
                   className="absolute top-0 right-10 text-black text-xs opacity-0 group-hover:opacity-100"
                   onClick={e=>e.stopPropagation()}
                 >
                    {iconList.map(i => <option key={i} value={i}>{i}</option>)}
                 </select>
               )}
               {isPreview ? (
                 <>
                   <div className="text-4xl md:text-5xl font-bold mb-2">{item.value}</div>
                   <div className="text-sm font-bold uppercase tracking-widest opacity-80">{item.label}</div>
                 </>
               ) : (
                 <div className="flex flex-col gap-2">
                   <input value={item.value} onChange={(e) => { const ni = [...block.data.items]; ni[idx].value = e.target.value; onUpdate(block.id, { ...block.data, items: ni }); }} className="text-center text-4xl bg-transparent border-b border-white/20 w-full" onClick={e=>e.stopPropagation()} />
                   <input value={item.label} onChange={(e) => { const ni = [...block.data.items]; ni[idx].label = e.target.value; onUpdate(block.id, { ...block.data, items: ni }); }} className="text-center text-xs bg-transparent border-b border-white/20 w-full" onClick={e=>e.stopPropagation()} />
                   <button onClick={(e) => { e.stopPropagation(); const ni = block.data.items.filter((_, i) => i !== idx); onUpdate(block.id, { ...block.data, items: ni }); }} className="text-red-300 text-xs">Padam</button>
                 </div>
               )}
             </div>
           ))}
        </div>
        {!isPreview && (
          <button onClick={() => onUpdate(block.id, { ...block.data, items: [...block.data.items, { id: uuidv4(), label: 'LABEL', value: '100', icon: 'Star' }] })} className="mt-8 mx-auto block text-sm border border-white px-4 py-2 rounded hover:bg-white hover:text-primary">Tambah Statistik</button>
        )}
      </div>
    </div>
  );
};

export const TimeRenderer: React.FC<{ block: TimeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: block.data.format === '12h' });
  };

  const formatDate = () => {
    return time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={`py-8 px-4 flex flex-col justify-center items-${block.data.alignment}`} style={{ backgroundColor: block.data.bgColor, color: block.data.textColor }}>
      <div className="text-4xl md:text-6xl font-mono font-bold tracking-widest">{formatTime()}</div>
      {block.data.showDate && <div className="text-lg md:text-xl mt-2 opacity-80 font-medium">{formatDate()}</div>}
      {!isPreview && (
        <div className="mt-4 flex gap-4 bg-white p-2 rounded text-black text-xs">
           <label>BG Color: <input type="color" value={block.data.bgColor} onChange={(e) => onUpdate(block.id, { ...block.data, bgColor: e.target.value })} /></label>
           <label>Text Color: <input type="color" value={block.data.textColor} onChange={(e) => onUpdate(block.id, { ...block.data, textColor: e.target.value })} /></label>
           <label><input type="checkbox" checked={block.data.format === '12h'} onChange={(e) => onUpdate(block.id, { ...block.data, format: e.target.checked ? '12h' : '24h' })} /> 12H Format</label>
           <label><input type="checkbox" checked={block.data.showDate} onChange={(e) => onUpdate(block.id, { ...block.data, showDate: e.target.checked })} /> Show Date</label>
        </div>
      )}
    </div>
  );
};

export const VisitorRenderer: React.FC<{ block: VisitorBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-8 px-4 bg-white border-y border-gray-100 flex justify-center">
      <div className="flex items-center gap-6 px-8 py-4 bg-gray-50 rounded-full shadow-inner border border-gray-200">
         <div className="flex flex-col items-end">
            {isPreview ? <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{block.data.label}</span> : <input value={block.data.label} onChange={(e) => onUpdate(block.id, { ...block.data, label: e.target.value })} className="text-xs text-right bg-transparent border-b" onClick={e=>e.stopPropagation()} />}
            <div className="text-2xl font-mono font-bold text-gray-800 tracking-widest">
               {block.data.count.toLocaleString()}
            </div>
         </div>
         {block.data.showLiveIndicator && (
           <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> LIVE
           </div>
         )}
         {!isPreview && (
           <div className="flex flex-col gap-1 ml-4 border-l pl-4">
              <label className="text-xs">Count: <input type="number" value={block.data.count} onChange={(e) => onUpdate(block.id, { ...block.data, count: parseInt(e.target.value) })} className="w-20 border rounded px-1" onClick={e=>e.stopPropagation()} /></label>
              <label className="text-xs flex gap-1"><input type="checkbox" checked={block.data.showLiveIndicator} onChange={(e) => onUpdate(block.id, { ...block.data, showLiveIndicator: e.target.checked })} /> Live Tag</label>
           </div>
         )}
      </div>
    </div>
  );
};

export const CalendarRenderer: React.FC<{ block: CalendarBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold text-center mb-8 uppercase text-primary border-b-2 border-secondary inline-block mx-auto">{block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold text-center w-full mb-8 bg-transparent border-b-2 border-dashed" placeholder="Tajuk Kalendar" onClick={e=>e.stopPropagation()} />}
      <div className="grid gap-4 md:grid-cols-2">
        {block.data.events.map((evt, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-primary flex gap-4 items-center group relative">
            <div className="bg-blue-50 p-2 rounded-lg text-center min-w-[60px]">
              {isPreview ? <><span className="block text-xl font-bold text-primary">{evt.date}</span><span className="block text-xs uppercase text-gray-500 font-bold">{evt.month}</span></> : <div className="flex flex-col gap-1"><input value={evt.date} onChange={(e)=>{const n=[...block.data.events];n[idx].date=e.target.value;onUpdate(block.id,{...block.data,events:n})}} className="text-center w-full text-xs border rounded" placeholder="DD" onClick={e=>e.stopPropagation()} /><input value={evt.month} onChange={(e)=>{const n=[...block.data.events];n[idx].month=e.target.value;onUpdate(block.id,{...block.data,events:n})}} className="text-center w-full text-xs border rounded" placeholder="MMM" onClick={e=>e.stopPropagation()} /></div>}
            </div>
            <div className="flex-1">
              {isPreview ? <><h4 className="font-bold text-gray-800">{evt.title}</h4><p className="text-xs text-gray-500">{evt.desc}</p></> : <div className="flex flex-col gap-1"><input value={evt.title} onChange={(e)=>{const n=[...block.data.events];n[idx].title=e.target.value;onUpdate(block.id,{...block.data,events:n})}} className="font-bold w-full text-sm border-b" placeholder="Nama Program" onClick={e=>e.stopPropagation()} /><input value={evt.desc} onChange={(e)=>{const n=[...block.data.events];n[idx].desc=e.target.value;onUpdate(block.id,{...block.data,events:n})}} className="text-xs w-full text-gray-500 border-b" placeholder="Tempat / Masa" onClick={e=>e.stopPropagation()} /></div>}
            </div>
            {!isPreview && <button onClick={(e)=>{e.stopPropagation(); const n=block.data.events.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data,events:n})}} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"><Icons.Trash2 size={16}/></button>}
          </div>
        ))}
      </div>
      {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, events: [...block.data.events, {date:'01', month:'JAN', title:'Program Baru', desc:'Lokasi'}]})} className="mt-4 w-full py-2 border-2 border-dashed rounded-lg text-gray-400 hover:text-primary flex justify-center items-center gap-2 transition-colors"><Icons.Plus size={16}/> Tambah Peristiwa</button>}
    </div>
  );
};

export const DownloadsRenderer: React.FC<{ block: DownloadsBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Icons.Download className="text-primary"/> {block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold w-full mb-6 bg-transparent border-b" onClick={e=>e.stopPropagation()} />}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {block.data.items.map((item, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between group">
             <div className="flex items-center gap-4 flex-1">
               <div className={`p-2 rounded font-bold text-xs ${item.type==='PDF'?'bg-red-100 text-red-600':item.type==='DOC'?'bg-blue-100 text-blue-600':'bg-green-100 text-green-600'}`}>{item.type}</div>
               {isPreview ? <a href={item.url} target="_blank" className="font-medium text-gray-700 hover:text-primary hover:underline">{item.title}</a> : <input value={item.title} onChange={(e)=>{const n=[...block.data.items];n[idx].title=e.target.value;onUpdate(block.id,{...block.data,items:n})}} className="font-medium flex-1 border-b border-transparent focus:border-gray-300 outline-none" placeholder="Nama Fail" onClick={e=>e.stopPropagation()} />}
             </div>
             {isPreview ? <a href={item.url} target="_blank" className="p-2 text-gray-400 hover:text-primary"><Icons.Download size={18} /></a> : <div className="flex gap-2 items-center"><select value={item.type} onChange={(e)=>{const n=[...block.data.items];n[idx].type=e.target.value as any;onUpdate(block.id,{...block.data,items:n})}} className="text-xs border rounded p-1" onClick={e=>e.stopPropagation()}><option value="PDF">PDF</option><option value="DOC">DOC</option><option value="FORM">FORM</option></select><input value={item.url} onChange={(e)=>{const n=[...block.data.items];n[idx].url=e.target.value;onUpdate(block.id,{...block.data,items:n})}} className="text-xs border rounded w-32 p-1" placeholder="URL" onClick={e=>e.stopPropagation()} /><button onClick={(e)=>{e.stopPropagation(); const n=block.data.items.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data,items:n})}} className="text-red-500 hover:text-red-700"><Icons.Trash2 size={16}/></button></div>}
          </div>
        ))}
      </div>
      {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {title:'Fail Baru', url:'#', type:'PDF'}]})} className="mt-4 w-full py-2 border-2 border-dashed rounded-lg text-gray-400 hover:text-primary flex justify-center items-center gap-2"><Icons.Plus size={16}/> Tambah Fail</button>}
    </div>
  );
};

export const FaqRenderer: React.FC<{ block: FaqBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="py-12 px-4 max-w-3xl mx-auto">
      {isPreview ? <h2 className="text-3xl font-bold text-center mb-10">{block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center w-full mb-10 bg-transparent border-b" onClick={e=>e.stopPropagation()} />}
      <div className="space-y-4">
        {block.data.items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
             <div onClick={() => isPreview && setOpenIdx(openIdx === idx ? null : idx)} className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {isPreview ? <span className="font-bold text-gray-800">{item.question}</span> : <input value={item.question} onChange={(e)=>{const n=[...block.data.items];n[idx].question=e.target.value;onUpdate(block.id,{...block.data,items:n})}} className="font-bold w-full bg-transparent outline-none" placeholder="Soalan" onClick={e=>e.stopPropagation()} />}
                <Icons.ArrowDown className={`transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} size={16} />
             </div>
             {(openIdx === idx || !isPreview) && (
               <div className="p-4 border-t border-gray-100 bg-white">
                 {isPreview ? <p className="text-gray-600 leading-relaxed">{item.answer}</p> : <textarea value={item.answer} onChange={(e)=>{const n=[...block.data.items];n[idx].answer=e.target.value;onUpdate(block.id,{...block.data,items:n})}} className="w-full h-20 text-sm border p-2 rounded resize-none" placeholder="Jawapan" onClick={e=>e.stopPropagation()} />}
                 {!isPreview && <button onClick={(e)=>{e.stopPropagation(); const n=block.data.items.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data,items:n})}} className="mt-2 text-red-500 text-xs flex items-center gap-1 hover:text-red-700"><Icons.Trash2 size={12}/> Padam</button>}
               </div>
             )}
          </div>
        ))}
      </div>
      {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, items: [...block.data.items, {question:'Soalan Baru?', answer:'Jawapan di sini.'}]})} className="mt-4 w-full py-2 border-2 border-dashed rounded-lg text-gray-400 hover:text-primary flex justify-center items-center gap-2"><Icons.Plus size={16}/> Tambah Soalan</button>}
    </div>
  );
};

export const CtaRenderer: React.FC<{ block: CtaBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 text-center text-white relative overflow-hidden" style={{ backgroundColor: block.data.bgColor }}>
      {!isPreview && <div className="absolute top-2 right-2 bg-white p-2 rounded text-gray-800 text-xs z-20 flex gap-2 items-center shadow"><label>Warna:</label><input type="color" value={block.data.bgColor} onChange={(e)=>onUpdate(block.id, {...block.data, bgColor: e.target.value})} /></div>}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-left">
           {isPreview ? <h2 className="text-2xl md:text-3xl font-bold leading-tight">{block.data.text}</h2> : <textarea value={block.data.text} onChange={(e)=>onUpdate(block.id, {...block.data, text: e.target.value})} className="text-2xl font-bold bg-white/20 text-white w-full rounded p-2 outline-none" rows={2} onClick={e=>e.stopPropagation()} />}
        </div>
        <div className="shrink-0">
           {isPreview ? <a href={block.data.buttonLink} className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">{block.data.buttonLabel}</a> : <div className="flex flex-col gap-2"><input value={block.data.buttonLabel} onChange={(e)=>onUpdate(block.id, {...block.data, buttonLabel: e.target.value})} className="text-center rounded p-1 text-black" placeholder="Label Butang" onClick={e=>e.stopPropagation()} /><input value={block.data.buttonLink} onChange={(e)=>onUpdate(block.id, {...block.data, buttonLink: e.target.value})} className="text-center rounded p-1 text-black text-xs" placeholder="Link URL" onClick={e=>e.stopPropagation()} /></div>}
        </div>
      </div>
    </div>
  );
};

export const CountdownRenderer: React.FC<{ block: CountdownBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(block.data.targetDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [block.data.targetDate]);

  return (
    <div className="py-12 px-4 bg-gray-900 text-white text-center">
      {isPreview ? <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-6">{block.data.title}</h3> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-xl font-bold text-center bg-transparent border-b border-gray-700 text-gray-400 w-full mb-4 outline-none" onClick={e=>e.stopPropagation()} />}
      <div className="flex justify-center gap-4 md:gap-8">
         {[
           { label: 'HARI', val: timeLeft.days }, 
           { label: 'JAM', val: timeLeft.hours }, 
           { label: 'MINIT', val: timeLeft.minutes }, 
           { label: 'SAAT', val: timeLeft.seconds }
         ].map((item, i) => (
           <div key={i} className="flex flex-col items-center">
             <div className="text-3xl md:text-5xl font-mono font-bold bg-gray-800 px-4 py-3 rounded-xl border border-gray-700 shadow-inner">{String(item.val).padStart(2, '0')}</div>
             <span className="text-[10px] md:text-xs font-bold text-gray-500 mt-2">{item.label}</span>
           </div>
         ))}
      </div>
      {!isPreview && <div className="mt-6 flex justify-center items-center gap-2"><label className="text-sm text-gray-400">Tarikh Sasaran:</label><input type="date" value={block.data.targetDate} onChange={(e)=>onUpdate(block.id, {...block.data, targetDate: e.target.value})} className="text-black rounded p-1" onClick={e=>e.stopPropagation()} /></div>}
    </div>
  );
};

export const NoticeRenderer: React.FC<{ block: NoticeBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  const colors = {
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    blue: 'bg-blue-100 border-blue-300 text-blue-900',
    red: 'bg-red-100 border-red-300 text-red-900',
    green: 'bg-green-100 border-green-300 text-green-900',
  };
  return (
    <div className="py-8 px-4 flex justify-center">
      <div className={`p-6 rounded-xl border-l-4 shadow-sm max-w-2xl w-full relative group transform rotate-1 hover:rotate-0 transition-transform ${colors[block.data.color]}`}>
        {!isPreview && (
          <div className="absolute top-2 right-2 flex gap-1 bg-white/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {(['yellow', 'blue', 'red', 'green'] as const).map(c => (
              <button key={c} onClick={(e)=>{e.stopPropagation(); onUpdate(block.id, {...block.data, color: c})}} className={`w-4 h-4 rounded-full ${colors[c].split(' ')[0]} border border-gray-300`} />
            ))}
          </div>
        )}
        <div className="flex items-start gap-4">
           <Icons.StickyNote className="opacity-50 shrink-0" size={32} />
           <div className="flex-1">
             {isPreview ? <h3 className="font-bold text-lg mb-1">{block.data.title}</h3> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg bg-transparent w-full border-b border-black/10 outline-none" onClick={e=>e.stopPropagation()} />}
             {isPreview ? <p className="leading-relaxed whitespace-pre-wrap">{block.data.content}</p> : <textarea value={block.data.content} onChange={(e)=>onUpdate(block.id, {...block.data, content: e.target.value})} className="w-full h-24 bg-transparent resize-none text-sm border border-black/10 rounded p-1 mt-1 outline-none" onClick={e=>e.stopPropagation()} />}
           </div>
        </div>
      </div>
    </div>
  );
};

export const TableRenderer: React.FC<{ block: TableBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      {isPreview ? <h2 className="text-2xl font-bold mb-6 text-center">{block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-2xl font-bold text-center w-full mb-6 bg-transparent border-b outline-none" onClick={e=>e.stopPropagation()} />}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
             <tr>
               {block.data.headers.map((h, i) => (
                 <th key={i} className="px-6 py-3">
                   {isPreview ? h : <input value={h} onChange={(e)=>{const nh=[...block.data.headers];nh[i]=e.target.value;onUpdate(block.id, {...block.data, headers: nh})}} className="bg-transparent w-full uppercase outline-none" onClick={e=>e.stopPropagation()} />}
                 </th>
               ))}
               {!isPreview && <th className="w-10"></th>}
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {block.data.rows.map((row, idx) => (
               <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{isPreview ? row.col1 : <input value={row.col1} onChange={(e)=>{const nr=[...block.data.rows];nr[idx].col1=e.target.value;onUpdate(block.id,{...block.data, rows:nr})}} className="w-full border-b border-transparent focus:border-gray-300 outline-none" onClick={e=>e.stopPropagation()} />}</td>
                  <td className="px-6 py-4">{isPreview ? row.col2 : <input value={row.col2} onChange={(e)=>{const nr=[...block.data.rows];nr[idx].col2=e.target.value;onUpdate(block.id,{...block.data, rows:nr})}} className="w-full border-b border-transparent focus:border-gray-300 outline-none" onClick={e=>e.stopPropagation()} />}</td>
                  <td className="px-6 py-4">{isPreview ? row.col3 : <input value={row.col3} onChange={(e)=>{const nr=[...block.data.rows];nr[idx].col3=e.target.value;onUpdate(block.id,{...block.data, rows:nr})}} className="w-full border-b border-transparent focus:border-gray-300 outline-none" onClick={e=>e.stopPropagation()} />}</td>
                  {!isPreview && <td className="px-2 text-center"><button onClick={(e)=>{e.stopPropagation(); const nr=block.data.rows.filter((_,i)=>i!==idx);onUpdate(block.id,{...block.data, rows:nr})}} className="text-red-400 hover:text-red-600"><Icons.Trash2 size={14} /></button></td>}
               </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, rows: [...block.data.rows, {col1:'...', col2:'...', col3:'...'}]})} className="mt-2 text-sm text-primary font-bold flex items-center gap-1"><Icons.Plus size={14}/> Tambah Baris</button>}
    </div>
  );
};

export const StaffGridRenderer: React.FC<{ block: StaffGridBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
         {isPreview ? <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">{block.data.title}</h2> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="text-3xl font-bold text-center w-full mb-10 bg-transparent border-b outline-none" onClick={e=>e.stopPropagation()} />}
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {block.data.members.map((m, i) => (
             <div key={m.id} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group relative">
               <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100 relative">
                 <img src={m.imageUrl} className="w-full h-full object-cover" />
                 {!isPreview && <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><input value={m.imageUrl} onChange={(e)=>{const nm=[...block.data.members];nm[i].imageUrl=e.target.value;onUpdate(block.id,{...block.data,members:nm})}} className="text-[10px] w-full mx-2 p-1 rounded" placeholder="URL Foto" onClick={e=>e.stopPropagation()} /></div>}
               </div>
               {isPreview ? <><h4 className="font-bold text-sm text-gray-900 truncate">{m.name}</h4><p className="text-xs text-primary truncate">{m.position}</p></> : <div className="flex flex-col gap-1"><input value={m.name} onChange={(e)=>{const nm=[...block.data.members];nm[i].name=e.target.value;onUpdate(block.id,{...block.data,members:nm})}} className="text-center font-bold text-xs border-b outline-none" placeholder="Nama" onClick={e=>e.stopPropagation()} /><input value={m.position} onChange={(e)=>{const nm=[...block.data.members];nm[i].position=e.target.value;onUpdate(block.id,{...block.data,members:nm})}} className="text-center text-xs text-primary border-b outline-none" placeholder="Jawatan" onClick={e=>e.stopPropagation()} /><button onClick={(e)=>{e.stopPropagation(); const nm=block.data.members.filter(x=>x.id!==m.id);onUpdate(block.id,{...block.data,members:nm})}} className="text-red-500 text-[10px] hover:underline">Padam</button></div>}
             </div>
           ))}
           {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, members: [...block.data.members, {id:uuidv4(), name:'Nama', position:'Guru', imageUrl:'https://picsum.photos/150'}]})} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:bg-white hover:text-primary h-full min-h-[150px]"><Icons.Plus size={24}/><span className="text-xs font-bold mt-2">Tambah</span></button>}
         </div>
      </div>
    </div>
  );
};

export const TestimonialRenderer: React.FC<{ block: TestimonialBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-16 px-4 bg-blue-900 text-white text-center">
      <div className="max-w-3xl mx-auto relative">
        <Icons.Quote size={48} className="mx-auto mb-6 text-blue-400 opacity-50" />
        {isPreview ? <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-8">"{block.data.quote}"</p> : <textarea value={block.data.quote} onChange={(e)=>onUpdate(block.id, {...block.data, quote: e.target.value})} className="w-full bg-blue-800/50 p-4 rounded text-xl text-center mb-6 text-white outline-none border border-blue-700" rows={3} placeholder="Kata-kata..." onClick={e=>e.stopPropagation()} />}
        <div className="flex flex-col items-center">
           {isPreview ? <span className="font-bold text-lg">{block.data.author}</span> : <input value={block.data.author} onChange={(e)=>onUpdate(block.id, {...block.data, author: e.target.value})} className="bg-transparent text-center font-bold text-lg text-white mb-1 border-b border-blue-700 outline-none" placeholder="Nama Penulis" onClick={e=>e.stopPropagation()} />}
           {isPreview ? <span className="text-sm text-blue-200 uppercase tracking-widest">{block.data.role}</span> : <input value={block.data.role} onChange={(e)=>onUpdate(block.id, {...block.data, role: e.target.value})} className="bg-transparent text-center text-sm text-blue-200 w-full border-b border-blue-700 outline-none" placeholder="Jawatan / Alumni Tahun..." onClick={e=>e.stopPropagation()} />}
        </div>
      </div>
    </div>
  );
};

export const LinkListRenderer: React.FC<{ block: LinkListBlock } & RendererProps> = ({ block, isPreview, onUpdate }) => {
  return (
    <div className="py-12 px-4 max-w-sm mx-auto w-full">
       {isPreview ? <h3 className="font-bold text-lg mb-4 border-l-4 border-primary pl-3 text-gray-800">{block.data.title}</h3> : <input value={block.data.title} onChange={(e)=>onUpdate(block.id, {...block.data, title: e.target.value})} className="font-bold text-lg mb-4 w-full border-b outline-none" onClick={e=>e.stopPropagation()} />}
       <ul className="space-y-2">
         {block.data.links.map((link, i) => (
           <li key={i} className="flex items-center group">
             <Icons.Link className="text-gray-400 mr-2" size={14} />
             {isPreview ? <a href={link.url} target="_blank" className="text-blue-600 hover:underline text-sm font-medium truncate flex-1">{link.label}</a> : <div className="flex-1 flex gap-2"><input value={link.label} onChange={(e)=>{const nl=[...block.data.links];nl[i].label=e.target.value;onUpdate(block.id,{...block.data,links:nl})}} className="text-sm border rounded px-1 flex-1 outline-none" placeholder="Teks" onClick={e=>e.stopPropagation()} /><input value={link.url} onChange={(e)=>{const nl=[...block.data.links];nl[i].url=e.target.value;onUpdate(block.id,{...block.data,links:nl})}} className="text-xs border rounded px-1 w-20 outline-none" placeholder="URL" onClick={e=>e.stopPropagation()} /></div>}
             {!isPreview && <button onClick={(e)=>{e.stopPropagation(); const nl=block.data.links.filter((_,idx)=>idx!==i);onUpdate(block.id,{...block.data,links:nl})}} className="ml-2 text-red-400 hover:text-red-600"><Icons.X size={14}/></button>}
           </li>
         ))}
       </ul>
       {!isPreview && <button onClick={()=>onUpdate(block.id, {...block.data, links: [...block.data.links, {label:'Pautan Baru', url:'#'}]})} className="mt-2 text-xs text-gray-500 hover:text-primary flex items-center gap-1"><Icons.Plus size={12}/> Tambah Link</button>}
    </div>
  );
};

// Main Block Renderer Switch
export const BlockRenderer: React.FC<RendererProps> = (props) => {
  const { block, ...rest } = props;
  switch (block.type) {
    case 'hero': return <HeroRenderer block={block as unknown as HeroBlock} {...rest} />;
    case 'content': return <ContentRenderer block={block as unknown as ContentBlock} {...rest} />;
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
    default: return <div className="p-10 bg-red-50 text-red-500 text-center">Block Type Not Recognized: {(block as any).type}</div>;
  }
};
