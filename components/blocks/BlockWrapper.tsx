import React, { useState } from 'react';
import { SectionBlock, BlockWidth, BlockPadding, BlockStyle } from '../../types';
import { Icons } from '../ui/Icons';

interface BlockWrapperProps {
  block: SectionBlock;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  onUpdateWidth: (id: string, width: BlockWidth) => void;
  onUpdatePadding: (id: string, padding: BlockPadding) => void;
  onUpdateStyle: (id: string, style: BlockStyle) => void;
  children: React.ReactNode;
  isPreview: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const widthOptions: { label: string, value: BlockWidth }[] = [
  { label: '25%', value: 'w-1/4' },
  { label: '33%', value: 'w-1/3' },
  { label: '50%', value: 'w-1/2' },
  { label: '66%', value: 'w-2/3' },
  { label: '75%', value: 'w-3/4' },
  { label: '100%', value: 'w-full' },
];

const paddingOptions: { label: string, value: BlockPadding }[] = [
  { label: '0px', value: 'py-0' },
  { label: 'S', value: 'py-4' },
  { label: 'M', value: 'py-12' },
  { label: 'L', value: 'py-20' },
  { label: 'XL', value: 'py-32' },
];

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdateWidth,
  onUpdatePadding,
  onUpdateStyle,
  children,
  isPreview,
  isSelected,
  onClick
}) => {
  const [showStylePanel, setShowStylePanel] = useState(false);

  // Map internal width values to Tailwind classes
  // In edit mode, we want the width to apply effectively to allow side-by-side
  const widthClass = block.width || 'w-full';
  
  // Padding class applied to the container or inner wrapper
  const paddingClass = block.padding || 'py-0';

  // Apply custom styles
  const blockStyle = block.style || {};
  const customStyles: React.CSSProperties = {
    backgroundColor: blockStyle.backgroundColor || 'transparent',
    backgroundImage: blockStyle.backgroundImage ? `url(${blockStyle.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: blockStyle.textColor || 'inherit',
  };

  // Mobile is w-full, Tablet/Desktop follows the setting. 
  // Using simple flex behavior: flex-grow-0 ensures it respects the width.
  const containerClass = isPreview 
    ? `relative ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass} ${paddingClass}`
    : `relative group transition-all duration-200 mb-0 p-1 flex-shrink-0 ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass} ${paddingClass}`;

  // Allow overflow for navbar to let dropdowns show
  const allowOverflow = block.type === 'navbar';

  if (isPreview) {
    return (
      <div className={containerClass} style={customStyles}>
        {/* Overlay if opacity is set */}
        {blockStyle.backgroundOpacity !== undefined && (
           <div 
             className="absolute inset-0 z-0 pointer-events-none" 
             style={{ backgroundColor: blockStyle.backgroundColor || 'black', opacity: (blockStyle.backgroundOpacity || 0) / 100 }} 
           />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  const handleStyleUpdate = (key: keyof BlockStyle, value: any) => {
    onUpdateStyle(block.id, { ...blockStyle, [key]: value });
  };

  return (
    <div 
      className={`${containerClass} z-10`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div 
        className={`h-full border-2 rounded-xl transition-all relative flex flex-col ${isSelected ? 'border-primary ring-2 ring-primary/20 z-30 shadow-2xl' : 'border-transparent hover:border-dashed hover:border-gray-300'}`}
        style={customStyles}
      >
        {/* Overlay for editor preview */}
        {blockStyle.backgroundOpacity !== undefined && (
           <div 
             className="absolute inset-0 z-0 pointer-events-none rounded-lg" 
             style={{ backgroundColor: blockStyle.backgroundColor || 'black', opacity: (blockStyle.backgroundOpacity || 0) / 100 }} 
           />
        )}

        {/* --- TOP RIGHT: SETUP WIDGET (Width, Height & Style) --- */}
        {isSelected && (
          <div className="absolute -top-3 right-4 z-[50] flex gap-2 animate-in fade-in slide-in-from-bottom-1">
             {/* Width Controls */}
             <div className="bg-gray-900 text-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold text-gray-400 px-1"><Icons.Columns size={10}/></span>
                {widthOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdateWidth(block.id, opt.value)}
                    className={`px-1.5 py-1 text-[9px] font-bold rounded ${block.width === opt.value || (!block.width && opt.value === 'w-full') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    title={`Lebar: ${opt.label}`}
                  >
                    {opt.label}
                  </button>
                ))}
             </div>
             {/* Height/Padding Controls */}
             <div className="bg-gray-900 text-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold text-gray-400 px-1"><Icons.ChevronsUp size={10}/></span>
                {paddingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdatePadding(block.id, opt.value)}
                    className={`px-1.5 py-1 text-[9px] font-bold rounded ${block.padding === opt.value ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                    title={`Tinggi (Padding): ${opt.label}`}
                  >
                    {opt.label}
                  </button>
                ))}
             </div>
             {/* Style Controls Toggle */}
             <div className="bg-gray-900 text-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-700 relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className={`px-2 py-1 text-[9px] font-bold rounded flex items-center gap-1 ${showStylePanel ? 'bg-primary' : 'hover:bg-gray-800'}`}
                  title="Tukar Background & Tema"
                >
                  <Icons.Edit size={10} /> Style
                </button>

                {/* Dropdown Style Panel */}
                {showStylePanel && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 p-3 rounded-xl shadow-2xl border border-gray-200 w-64 z-50 flex flex-col gap-3">
                     <h4 className="text-xs font-bold text-gray-500 uppercase border-b pb-1">Tetapan Tema Widget</h4>
                     
                     <div className="flex gap-2 items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1"><Icons.Layout size={12}/> Background</span>
                        <input 
                          type="color" 
                          value={blockStyle.backgroundColor || '#ffffff'} 
                          onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                        />
                     </div>

                     <div className="flex gap-2 items-center justify-between">
                        <span className="text-xs font-bold flex items-center gap-1"><Icons.Type size={12}/> Warna Teks</span>
                        <input 
                          type="color" 
                          value={blockStyle.textColor || '#000000'} 
                          onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                        />
                     </div>

                     <div>
                        <span className="text-xs font-bold mb-1 block flex items-center gap-1"><Icons.Image size={12}/> Gambar Latar (URL)</span>
                        <input 
                          type="text" 
                          value={blockStyle.backgroundImage || ''}
                          onChange={(e) => handleStyleUpdate('backgroundImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full text-xs border p-1.5 rounded"
                        />
                     </div>

                     {blockStyle.backgroundImage && (
                       <div>
                          <span className="text-xs font-bold mb-1 block flex items-center gap-1">Opacity Overlay ({blockStyle.backgroundOpacity || 0}%)</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="90" 
                            step="10"
                            value={blockStyle.backgroundOpacity || 0}
                            onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                       </div>
                     )}
                     
                     <button 
                        onClick={() => onUpdateStyle(block.id, {})}
                        className="text-[10px] text-red-500 hover:underline text-right mt-1"
                     >
                        Reset Style
                     </button>
                  </div>
                )}
             </div>
          </div>
        )}
        
        {/* --- BLOCK CONTENT --- */}
        <div className={`relative z-10 h-full rounded-lg ${allowOverflow ? '' : 'overflow-hidden'}`}>
          {children}
        </div>

        {/* --- BOTTOM CENTER: LINK PAUTAN (Move/Delete) --- */}
        {/* Always visible on hover or selected */}
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-[50] transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="bg-white shadow-xl rounded-full px-1.5 py-1 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-bold px-2 text-primary uppercase tracking-wider select-none max-w-[80px] truncate border-r border-gray-200 mr-1">{block.type}</span>
            
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveUp(index); }} 
              disabled={index === 0}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 disabled:opacity-30 transition-colors"
              title="Naik Atas"
            >
              <Icons.ArrowUp size={14} />
            </button>
            
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoveDown(index); }} 
              disabled={index === total - 1}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 disabled:opacity-30 transition-colors"
              title="Turun Bawah"
            >
              <Icons.ArrowDown size={14} />
            </button>
            
            <div className="h-3 w-px bg-gray-300 mx-1"></div>

            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                onDelete(block.id); 
              }} 
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors active:bg-red-200"
              title="Padam Widget Ini"
            >
              <Icons.Trash2 size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};