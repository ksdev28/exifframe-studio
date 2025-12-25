import type { ExifPayload, FrameStyle } from '@/types/exif';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface FramePreviewProps {
  imageUrl: string | null;
  data: ExifPayload;
  style: FrameStyle;
}

export function FramePreview({ imageUrl, data, style }: FramePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="frame-preview-container w-full aspect-[3/4] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Upload a photo to preview</p>
      </div>
    );
  }

  return (
    <div className="frame-preview-container w-full animate-fade-in">
      <FrameRenderer imageUrl={imageUrl} data={data} style={style} />
    </div>
  );
}

function FrameRenderer({ imageUrl, data, style }: { imageUrl: string; data: ExifPayload; style: FrameStyle }) {
  switch (style) {
    case 'classic':
      return <ClassicFrame imageUrl={imageUrl} data={data} />;
    case 'elegant':
      return <ElegantFrame imageUrl={imageUrl} data={data} />;
    case 'cinematic':
      return <CinematicFrame imageUrl={imageUrl} data={data} />;
    case 'badge':
      return <BadgeFrame imageUrl={imageUrl} data={data} />;
    case 'insta':
      return <InstaFrame imageUrl={imageUrl} data={data} />;
    default:
      return <ClassicFrame imageUrl={imageUrl} data={data} />;
  }
}

// Style A: Classic Leica
function ClassicFrame({ imageUrl, data }: { imageUrl: string; data: ExifPayload }) {
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Circle className="w-6 h-6 text-leica fill-leica" />
          <div className="border-l border-frame-text-muted/30 pl-3">
            <p className="text-frame-text-dark font-semibold text-sm">{data.model}</p>
            <p className="text-frame-text-muted text-xs">{data.settings}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-frame-text-dark text-xs font-medium">{data.lens}</p>
          <p className="text-frame-text-muted text-xs">{data.date}</p>
        </div>
      </div>
    </div>
  );
}

// Style B: Elegant Hasselblad
function ElegantFrame({ imageUrl, data }: { imageUrl: string; data: ExifPayload }) {
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="py-5 px-4 flex flex-col items-center text-center">
        <p className="font-display text-lg tracking-[0.3em] text-frame-text-dark uppercase">
          {data.make}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-frame-text-muted">
          <span>{data.model}</span>
          <span className="text-frame-text-muted/40">|</span>
          <span>{data.settings}</span>
        </div>
        <p className="mt-1 text-[10px] text-frame-text-muted/70">{data.date}</p>
      </div>
    </div>
  );
}

// Style C: Cinematic (overlay)
function CinematicFrame({ imageUrl, data }: { imageUrl: string; data: ExifPayload }) {
  return (
    <div className="w-full relative shadow-elegant">
      <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-frame-text-light text-[10px] opacity-70">{data.date}</p>
            <p className="text-frame-text-light text-xs font-medium mt-0.5">{data.make}</p>
          </div>
          <div className="text-right">
            <p className="text-frame-text-light text-sm font-medium font-mono">{data.settings}</p>
            <p className="text-frame-text-light text-[10px] opacity-70 mt-0.5">{data.lens}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Style D: Badge (Nikon style)
function BadgeFrame({ imageUrl, data }: { imageUrl: string; data: ExifPayload }) {
  return (
    <div className="w-full bg-frame-white flex flex-col shadow-elegant">
      <div className="relative w-full rounded-t-lg overflow-hidden">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block" />
      </div>
      <div className="py-4 px-4 flex flex-col items-center text-center">
        <div className="w-5 h-5 bg-nikon mb-2" />
        <p className="text-frame-text-dark text-sm font-bold tracking-wide font-mono">
          {data.settings}
        </p>
        <p className="mt-1 text-[10px] text-frame-text-muted">{data.date}</p>
      </div>
    </div>
  );
}

// Style E: Insta / Passe-partout
function InstaFrame({ imageUrl, data }: { imageUrl: string; data: ExifPayload }) {
  return (
    <div className="w-full bg-frame-white p-3 shadow-elegant">
      <div className="relative w-full">
        <img src={imageUrl} alt="Preview" className="w-full h-auto block rounded-sm" />
      </div>
      <div className="pt-4 pb-2 flex flex-col items-center text-center">
        <p className="text-frame-text-dark text-xs font-semibold tracking-[0.2em] uppercase">
          {data.make}
        </p>
        <p className="mt-1 text-[11px] text-frame-text-muted font-mono">
          {data.settings}
        </p>
        <p className="mt-0.5 text-[10px] text-frame-text-muted/70">{data.date}</p>
      </div>
    </div>
  );
}
