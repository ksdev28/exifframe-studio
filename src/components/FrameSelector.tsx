import type { FrameStyle, FrameConfig } from '@/types/exif';
import { FRAME_CONFIGS } from '@/types/exif';
import { cn } from '@/lib/utils';

interface FrameSelectorProps {
  selected: FrameStyle;
  onSelect: (style: FrameStyle) => void;
}

// Mini preview thumbnails for each frame style
function FrameThumbnail({ style, isSelected }: { style: FrameStyle; isSelected: boolean }) {
  const baseClasses = "w-full h-full";
  
  const renderMiniPreview = () => {
    switch (style) {
      case 'classic':
        return (
          <div className={cn(baseClasses, "flex flex-col")}>
            <div className="flex-1 bg-gradient-to-br from-slate-600 to-slate-800" />
            <div className="h-[20%] bg-white flex items-center px-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="flex-1 ml-1">
                <div className="h-0.5 w-3/4 bg-slate-300 rounded" />
                <div className="h-0.5 w-1/2 bg-slate-200 rounded mt-0.5" />
              </div>
            </div>
          </div>
        );
      case 'elegant':
        return (
          <div className={cn(baseClasses, "flex flex-col")}>
            <div className="flex-1 bg-gradient-to-br from-amber-700 to-amber-900" />
            <div className="h-[22%] bg-white flex flex-col items-center justify-center">
              <div className="text-[4px] font-display italic text-slate-700">HASSELBLAD</div>
              <div className="h-0.5 w-2/3 bg-slate-200 rounded mt-0.5" />
            </div>
          </div>
        );
      case 'cinematic':
        return (
          <div className={cn(baseClasses, "relative")}>
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900" />
            <div className="absolute bottom-1 left-1 right-1 flex justify-between">
              <div className="h-0.5 w-4 bg-white/80 rounded" />
              <div className="h-0.5 w-6 bg-white/80 rounded" />
            </div>
          </div>
        );
      case 'badge':
        return (
          <div className={cn(baseClasses, "flex flex-col")}>
            <div className="flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-t" />
            <div className="h-[25%] bg-white flex flex-col items-center justify-center">
              <div className="w-2 h-2 bg-yellow-400 mb-0.5" />
              <div className="h-0.5 w-2/3 bg-slate-300 rounded" />
            </div>
          </div>
        );
      case 'insta':
        return (
          <div className={cn(baseClasses, "bg-white p-1 flex flex-col")}>
            <div className="flex-1 bg-gradient-to-br from-pink-400 to-purple-600 rounded-sm" />
            <div className="h-[18%] flex flex-col items-center justify-center mt-0.5">
              <div className="text-[3px] text-slate-600">SONY</div>
              <div className="h-0.5 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        );
      default:
        return <div className={cn(baseClasses, "bg-slate-600")} />;
    }
  };

  return (
    <div className={cn(
      "frame-template-btn",
      isSelected && "selected"
    )}>
      {renderMiniPreview()}
    </div>
  );
}

export function FrameSelector({ selected, onSelect }: FrameSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {FRAME_CONFIGS.map((config) => (
        <button
          key={config.id}
          onClick={() => onSelect(config.id)}
          className="group"
          title={`${config.name}: ${config.description}`}
        >
          <FrameThumbnail style={config.id} isSelected={selected === config.id} />
          <p className={cn(
            "text-[10px] mt-1 text-center truncate transition-colors",
            selected === config.id ? "text-primary font-medium" : "text-muted-foreground"
          )}>
            {config.name}
          </p>
        </button>
      ))}
    </div>
  );
}
