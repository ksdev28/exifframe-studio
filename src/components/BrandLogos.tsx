// Brand logos as SVG components
// Camera and smartphone manufacturers

export type BrandId = 
  | 'custom'
  | 'none'
  | 'leica'
  | 'hasselblad'
  | 'sony'
  | 'canon'
  | 'nikon'
  | 'fujifilm'
  | 'panasonic'
  | 'olympus'
  | 'pentax'
  | 'samsung'
  | 'apple'
  | 'google'
  | 'xiaomi'
  | 'huawei'
  | 'oppo'
  | 'vivo'
  | 'oneplus'
  | 'dji'
  | 'gopro'
  | 'ricoh'
  | 'sigma';

export interface BrandConfig {
  id: BrandId;
  name: string;
  color?: string;
}

export const BRAND_LIST: BrandConfig[] = [
  { id: 'none', name: 'Nenhuma' },
  { id: 'custom', name: 'Personalizada' },
  { id: 'leica', name: 'Leica', color: '#E21B24' },
  { id: 'hasselblad', name: 'Hasselblad', color: '#000000' },
  { id: 'sony', name: 'Sony', color: '#000000' },
  { id: 'canon', name: 'Canon', color: '#BC0024' },
  { id: 'nikon', name: 'Nikon', color: '#FFCC00' },
  { id: 'fujifilm', name: 'Fujifilm', color: '#ED1A3A' },
  { id: 'panasonic', name: 'Panasonic', color: '#0F58A8' },
  { id: 'olympus', name: 'Olympus', color: '#08326B' },
  { id: 'pentax', name: 'Pentax', color: '#000000' },
  { id: 'samsung', name: 'Samsung', color: '#1428A0' },
  { id: 'apple', name: 'Apple', color: '#000000' },
  { id: 'google', name: 'Google Pixel', color: '#4285F4' },
  { id: 'xiaomi', name: 'Xiaomi', color: '#FF6700' },
  { id: 'huawei', name: 'Huawei', color: '#CF0A2C' },
  { id: 'oppo', name: 'Oppo', color: '#1BA784' },
  { id: 'vivo', name: 'Vivo', color: '#415FFF' },
  { id: 'oneplus', name: 'OnePlus', color: '#EB0028' },
  { id: 'dji', name: 'DJI', color: '#000000' },
  { id: 'gopro', name: 'GoPro', color: '#00A8E8' },
  { id: 'ricoh', name: 'Ricoh', color: '#CC0000' },
  { id: 'sigma', name: 'Sigma', color: '#000000' },
];

interface BrandLogoProps {
  brand: BrandId;
  size?: number;
  className?: string;
  customLogoUrl?: string | null;
}

export function BrandLogo({ brand, size = 24, className = '', customLogoUrl }: BrandLogoProps) {
  if (brand === 'none') return null;
  
  if (brand === 'custom' && customLogoUrl) {
    return (
      <img 
        src={customLogoUrl} 
        alt="Custom logo" 
        width={size} 
        height={size} 
        className={`object-contain ${className}`}
        style={{ maxWidth: size, maxHeight: size }}
      />
    );
  }

  const logoStyle = { width: size, height: size };

  switch (brand) {
    case 'leica':
      return (
        <svg viewBox="0 0 100 100" style={logoStyle} className={className}>
          <circle cx="50" cy="50" r="45" fill="#E21B24"/>
          <text x="50" y="58" textAnchor="middle" fill="white" fontSize="22" fontFamily="serif" fontStyle="italic">Leica</text>
        </svg>
      );
    
    case 'hasselblad':
      return (
        <svg viewBox="0 0 200 40" style={{ width: size * 4, height: size }} className={className}>
          <text x="0" y="32" fill="currentColor" fontSize="28" fontFamily="sans-serif" fontWeight="300" letterSpacing="8">HASSELBLAD</text>
        </svg>
      );
    
    case 'sony':
      return (
        <svg viewBox="0 0 120 40" style={{ width: size * 2.5, height: size }} className={className}>
          <text x="0" y="32" fill="currentColor" fontSize="36" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">SONY</text>
        </svg>
      );
    
    case 'canon':
      return (
        <svg viewBox="0 0 140 40" style={{ width: size * 3, height: size }} className={className}>
          <text x="0" y="34" fill="#BC0024" fontSize="38" fontFamily="serif" fontWeight="400">Canon</text>
        </svg>
      );
    
    case 'nikon':
      return (
        <svg viewBox="0 0 120 40" style={{ width: size * 2.5, height: size }} className={className}>
          <rect x="0" y="5" width="120" height="30" fill="#FFCC00" rx="2"/>
          <text x="60" y="28" textAnchor="middle" fill="black" fontSize="22" fontFamily="sans-serif" fontWeight="700">Nikon</text>
        </svg>
      );
    
    case 'fujifilm':
      return (
        <svg viewBox="0 0 160 40" style={{ width: size * 3.5, height: size }} className={className}>
          <text x="0" y="32" fill="#ED1A3A" fontSize="28" fontFamily="sans-serif" fontWeight="700">FUJIFILM</text>
        </svg>
      );
    
    case 'panasonic':
      return (
        <svg viewBox="0 0 180 40" style={{ width: size * 3.5, height: size }} className={className}>
          <text x="0" y="30" fill="#0F58A8" fontSize="26" fontFamily="sans-serif" fontWeight="700" letterSpacing="3">LUMIX</text>
        </svg>
      );
    
    case 'olympus':
      return (
        <svg viewBox="0 0 160 40" style={{ width: size * 3.5, height: size }} className={className}>
          <text x="0" y="32" fill="#08326B" fontSize="30" fontFamily="sans-serif" fontWeight="400" letterSpacing="2">OLYMPUS</text>
        </svg>
      );
    
    case 'pentax':
      return (
        <svg viewBox="0 0 140 40" style={{ width: size * 3, height: size }} className={className}>
          <text x="0" y="32" fill="currentColor" fontSize="32" fontFamily="sans-serif" fontWeight="700" letterSpacing="2">PENTAX</text>
        </svg>
      );
    
    case 'samsung':
      return (
        <svg viewBox="0 0 180 40" style={{ width: size * 4, height: size }} className={className}>
          <text x="0" y="32" fill="#1428A0" fontSize="30" fontFamily="sans-serif" fontWeight="700" letterSpacing="3">SAMSUNG</text>
        </svg>
      );
    
    case 'apple':
      return (
        <svg viewBox="0 0 40 48" style={{ width: size * 0.8, height: size }} className={className}>
          <path fill="currentColor" d="M34.5 26.4c-.1-5.4 4.4-8 4.6-8.1-2.5-3.7-6.4-4.2-7.8-4.2-3.3-.3-6.5 2-8.1 2s-4.3-1.9-7-1.9c-3.6.1-7 2.1-8.8 5.4-3.8 6.5-1 16.2 2.7 21.5 1.8 2.6 3.9 5.5 6.7 5.4 2.7-.1 3.7-1.7 7-1.7s4.2 1.7 7 1.7 4.8-2.6 6.5-5.2c2.1-3 2.9-5.9 3-6-.1 0-5.7-2.2-5.8-8.7M29.2 9.6c1.5-1.8 2.5-4.3 2.2-6.8-2.1.1-4.7 1.4-6.2 3.2-1.4 1.6-2.6 4.1-2.2 6.5 2.3.2 4.7-1.2 6.2-2.9"/>
        </svg>
      );
    
    case 'google':
      return (
        <svg viewBox="0 0 100 40" style={{ width: size * 2, height: size }} className={className}>
          <text x="0" y="28" fill="#4285F4" fontSize="22" fontFamily="sans-serif" fontWeight="500">Pixel</text>
        </svg>
      );
    
    case 'xiaomi':
      return (
        <svg viewBox="0 0 120 40" style={{ width: size * 2.5, height: size }} className={className}>
          <text x="0" y="32" fill="#FF6700" fontSize="30" fontFamily="sans-serif" fontWeight="600">Xiaomi</text>
        </svg>
      );
    
    case 'huawei':
      return (
        <svg viewBox="0 0 140 40" style={{ width: size * 3, height: size }} className={className}>
          <text x="0" y="32" fill="#CF0A2C" fontSize="28" fontFamily="sans-serif" fontWeight="600">HUAWEI</text>
        </svg>
      );
    
    case 'oppo':
      return (
        <svg viewBox="0 0 100 40" style={{ width: size * 2, height: size }} className={className}>
          <text x="0" y="32" fill="#1BA784" fontSize="32" fontFamily="sans-serif" fontWeight="700">OPPO</text>
        </svg>
      );
    
    case 'vivo':
      return (
        <svg viewBox="0 0 80 40" style={{ width: size * 1.5, height: size }} className={className}>
          <text x="0" y="32" fill="#415FFF" fontSize="32" fontFamily="sans-serif" fontWeight="600">vivo</text>
        </svg>
      );
    
    case 'oneplus':
      return (
        <svg viewBox="0 0 140 40" style={{ width: size * 3, height: size }} className={className}>
          <text x="0" y="32" fill="#EB0028" fontSize="28" fontFamily="sans-serif" fontWeight="600">OnePlus</text>
        </svg>
      );
    
    case 'dji':
      return (
        <svg viewBox="0 0 60 40" style={{ width: size * 1.2, height: size }} className={className}>
          <text x="0" y="32" fill="currentColor" fontSize="36" fontFamily="sans-serif" fontWeight="700">DJI</text>
        </svg>
      );
    
    case 'gopro':
      return (
        <svg viewBox="0 0 120 40" style={{ width: size * 2.5, height: size }} className={className}>
          <text x="0" y="32" fill="#00A8E8" fontSize="28" fontFamily="sans-serif" fontWeight="800">GoPro</text>
        </svg>
      );
    
    case 'ricoh':
      return (
        <svg viewBox="0 0 100 40" style={{ width: size * 2, height: size }} className={className}>
          <text x="0" y="32" fill="#CC0000" fontSize="30" fontFamily="sans-serif" fontWeight="600">RICOH</text>
        </svg>
      );
    
    case 'sigma':
      return (
        <svg viewBox="0 0 120 40" style={{ width: size * 2.5, height: size }} className={className}>
          <text x="0" y="32" fill="currentColor" fontSize="28" fontFamily="sans-serif" fontWeight="700">SIGMA</text>
        </svg>
      );
    
    default:
      return null;
  }
}

// For canvas rendering - draw brand logo text
export function drawBrandLogo(
  ctx: CanvasRenderingContext2D,
  brand: BrandId,
  x: number,
  y: number,
  size: number,
  customLogoImg?: HTMLImageElement | null
): void {
  if (brand === 'none') return;
  
  if (brand === 'custom' && customLogoImg) {
    const aspectRatio = customLogoImg.width / customLogoImg.height;
    let drawWidth = size;
    let drawHeight = size;
    
    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio;
    } else {
      drawWidth = size * aspectRatio;
    }
    
    ctx.drawImage(customLogoImg, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight);
    return;
  }

  const config = BRAND_LIST.find(b => b.id === brand);
  if (!config) return;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  switch (brand) {
    case 'leica':
      // Draw red circle with text
      ctx.fillStyle = '#E21B24';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `italic ${size * 0.35}px Georgia, serif`;
      ctx.fillText('Leica', x, y + size * 0.05);
      break;
    
    case 'hasselblad':
      ctx.fillStyle = '#333333';
      ctx.font = `300 ${size * 0.5}px Arial, sans-serif`;
      ctx.letterSpacing = '4px';
      ctx.fillText('HASSELBLAD', x, y);
      break;
    
    case 'sony':
      ctx.fillStyle = '#000000';
      ctx.font = `700 ${size * 0.7}px Arial, sans-serif`;
      ctx.fillText('SONY', x, y);
      break;
    
    case 'canon':
      ctx.fillStyle = '#BC0024';
      ctx.font = `400 ${size * 0.7}px Georgia, serif`;
      ctx.fillText('Canon', x, y);
      break;
    
    case 'nikon':
      // Yellow background rectangle
      const nikonWidth = size * 2;
      const nikonHeight = size * 0.6;
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x - nikonWidth / 2, y - nikonHeight / 2, nikonWidth, nikonHeight);
      ctx.fillStyle = '#000000';
      ctx.font = `700 ${size * 0.4}px Arial, sans-serif`;
      ctx.fillText('Nikon', x, y + 2);
      break;
    
    case 'fujifilm':
      ctx.fillStyle = '#ED1A3A';
      ctx.font = `700 ${size * 0.5}px Arial, sans-serif`;
      ctx.fillText('FUJIFILM', x, y);
      break;
    
    case 'panasonic':
      ctx.fillStyle = '#0F58A8';
      ctx.font = `700 ${size * 0.5}px Arial, sans-serif`;
      ctx.fillText('LUMIX', x, y);
      break;
    
    case 'apple':
      ctx.fillStyle = '#000000';
      ctx.font = `400 ${size * 0.5}px Arial, sans-serif`;
      ctx.fillText('', x, y); // Apple logo would need special font
      ctx.fillText('iPhone', x, y);
      break;
    
    default:
      ctx.fillStyle = config.color || '#333333';
      ctx.font = `600 ${size * 0.5}px Arial, sans-serif`;
      ctx.fillText(config.name.toUpperCase(), x, y);
  }
  
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
