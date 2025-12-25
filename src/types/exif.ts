import type { BrandId } from '@/components/BrandLogos';

export interface ExifPayload {
  make: string;
  model: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutter: string;
  iso: string;
  date: string;
  settings: string; // Pre-formatted: "35mm f/1.4 1/250s ISO160"
  // New fields
  photographer: string;
  location: string;
}

export type FrameStyle = 
  | 'classic'      // Style A: Leica minimalist
  | 'elegant'      // Style B: Hasselblad centered
  | 'cinematic'    // Style C: Dark overlay
  | 'badge'        // Style D: Nikon yellow badge
  | 'insta';       // Style E: White border all around

export interface FrameConfig {
  id: FrameStyle;
  name: string;
  description: string;
}

export const FRAME_CONFIGS: FrameConfig[] = [
  { id: 'classic', name: 'Classic', description: 'Minimalist Leica style' },
  { id: 'elegant', name: 'Elegant', description: 'Hasselblad centered' },
  { id: 'cinematic', name: 'Cinematic', description: 'Dark overlay text' },
  { id: 'badge', name: 'Badge', description: 'Yellow badge style' },
  { id: 'insta', name: 'Passe-partout', description: 'White border all around' },
];

export interface FrameOptions {
  brandId: BrandId;
  customLogoUrl: string | null;
  showLogo: boolean;
}
