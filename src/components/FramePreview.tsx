import type { ExifPayload, FrameStyle, FrameOptions } from '@/types/exif';
import { cn } from '@/lib/utils';
import { BrandLogo } from './BrandLogos';
import { MapPin, User } from 'lucide-react';

interface FramePreviewProps {
  imageUrl: string | null;
  data: ExifPayload;
  style: FrameStyle;
  options: FrameOptions;
}

export function FramePreview({ imageUrl, data, style, options }: FramePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="frame-preview-container w-full aspect-[3/4] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Upload a photo to preview</p>
      </div>
    );
  }

  return (
    <div className="frame-preview-container w-full animate-fade-in">
      <FrameRenderer imageUrl={imageUrl} data={data} style={style} options={options} />
    </div>
  );
}

function FrameRenderer({ imageUrl, data, style, options }: { imageUrl: string; data: ExifPayload; style: FrameStyle; options: FrameOptions }) {
  switch (style) {
    case 'classic':
      return <ClassicFrame imageUrl={imageUrl} data={data} options={options} />;
    case 'elegant':
      return <ElegantFrame imageUrl={imageUrl} data={data} options={options} />;
    case 'cinematic':
      return <CinematicFrame imageUrl={imageUrl} data={data} options={options} />;
    case 'badge':
      return <BadgeFrame imageUrl={imageUrl} data={data} options={options} />;
    case 'insta':
      return <InstaFrame imageUrl={imageUrl} data={data} options={options} />;
    default:
      return <ClassicFrame imageUrl={imageUrl} data={data} options={options} />;
  }
}

interface FrameComponentProps {
  imageUrl: string;
  data: ExifPayload;
  options: FrameOptions;
}

// Style A: Classic Leica
function ClassicFrame({ imageUrl, data, options }: FrameComponentProps) {
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {options.showLogo && options.brandId !== 'none' && (
            <div className="flex-shrink-0">
              <BrandLogo brand={options.brandId} size={28} customLogoUrl={options.customLogoUrl} />
            </div>
          )}
          <div className={options.showLogo && options.brandId !== 'none' ? "border-l border-frame-text-muted/30 pl-3" : ""}>
            <p className="text-frame-text-dark font-semibold text-sm">{data.model}</p>
            <p className="text-frame-text-muted text-xs">{data.settings}</p>
          </div>
        </div>
        <div className="text-right">
          {data.photographer && (
            <p className="text-frame-text-dark text-xs font-medium flex items-center justify-end gap-1">
              <User className="w-3 h-3" />
              {data.photographer}
            </p>
          )}
          {data.location && (
            <p className="text-frame-text-muted text-[10px] flex items-center justify-end gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {data.location}
            </p>
          )}
          <p className="text-frame-text-muted text-[10px]">{data.date}</p>
        </div>
      </div>
    </div>
  );
}

// Style B: Elegant Hasselblad
function ElegantFrame({ imageUrl, data, options }: FrameComponentProps) {
  const showBrandLogo = options.showLogo && options.brandId !== 'none';
  
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="py-5 px-4 flex flex-col items-center text-center">
        {/* Show logo OR text brand name, not both */}
        {showBrandLogo ? (
          <div className="mb-2">
            <BrandLogo brand={options.brandId} size={28} customLogoUrl={options.customLogoUrl} />
          </div>
        ) : (
          <p className="font-display text-lg tracking-[0.2em] text-frame-text-dark uppercase mb-2">
            {data.make}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-frame-text-muted">
          <span>{data.model}</span>
          <span className="text-frame-text-muted/40">|</span>
          <span>{data.settings}</span>
          {data.location && (
            <>
              <span className="text-frame-text-muted/40">|</span>
              <span>{data.location}</span>
            </>
          )}
        </div>
        {data.photographer && (
          <p className="mt-2 text-xs text-frame-text-dark font-medium">{data.photographer}</p>
        )}
        <p className="mt-1 text-[10px] text-frame-text-muted/70">{data.date}</p>
      </div>
    </div>
  );
}

// Style C: Cinematic (overlay)
function CinematicFrame({ imageUrl, data, options }: FrameComponentProps) {
  return (
    <div className="w-full relative shadow-elegant">
      <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      
      {/* Top logo */}
      {options.showLogo && options.brandId !== 'none' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <BrandLogo brand={options.brandId} size={20} customLogoUrl={options.customLogoUrl} />
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-frame-text-light text-[10px] opacity-70">{data.date}</p>
            {data.location && (
              <p className="text-frame-text-light text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {data.location}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-frame-text-light text-sm font-medium font-mono">{data.settings}</p>
            {data.photographer && (
              <p className="text-frame-text-light text-xs opacity-80 mt-0.5">© {data.photographer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Style D: Badge (Nikon style)
function BadgeFrame({ imageUrl, data, options }: FrameComponentProps) {
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full rounded-t-lg overflow-hidden">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="py-4 px-4 flex flex-col items-center text-center">
        {options.showLogo && options.brandId !== 'none' ? (
          <div className="mb-2">
            <BrandLogo brand={options.brandId} size={24} customLogoUrl={options.customLogoUrl} />
          </div>
        ) : (
          <div className="w-5 h-5 bg-nikon mb-2" />
        )}
        <p className="text-frame-text-dark text-sm font-bold tracking-wide font-mono">
          {data.settings}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-frame-text-muted">
          {data.location && <span>{data.location}</span>}
          {data.location && data.date && <span>•</span>}
          <span>{data.date}</span>
        </div>
        {data.photographer && (
          <p className="mt-1 text-[10px] text-frame-text-dark">by {data.photographer}</p>
        )}
      </div>
    </div>
  );
}

// Style E: Insta / Passe-partout
function InstaFrame({ imageUrl, data, options }: FrameComponentProps) {
  const showBrandLogo = options.showLogo && options.brandId !== 'none';
  
  return (
    <div className="w-full bg-frame-white p-3 shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block rounded-sm" />
      </div>
      <div className="pt-4 pb-2 flex flex-col items-center text-center">
        {/* Show logo OR text brand name, not both */}
        {showBrandLogo ? (
          <div className="mb-2">
            <BrandLogo brand={options.brandId} size={24} customLogoUrl={options.customLogoUrl} />
          </div>
        ) : (
          <p className="text-frame-text-dark text-xs font-semibold tracking-[0.2em] uppercase mb-1">
            {data.make}
          </p>
        )}
        <p className="text-[11px] text-frame-text-muted font-mono">
          {data.settings}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-frame-text-muted/70">
          {data.location && <span>{data.location}</span>}
          {data.location && <span>•</span>}
          <span>{data.date}</span>
        </div>
        {data.photographer && (
          <p className="mt-1.5 text-[10px] text-frame-text-dark">© {data.photographer}</p>
        )}
      </div>
    </div>
  );
}
