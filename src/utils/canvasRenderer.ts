import type { ExifPayload, FrameStyle } from '@/types/exif';

const FRAME_BAR_RATIO = 0.12; // 12% of image height for bottom bar
const PADDING_RATIO = 0.04; // 4% padding for insta style

interface CanvasConfig {
  imageWidth: number;
  imageHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  imageX: number;
  imageY: number;
  barHeight: number;
}

function calculateConfig(img: HTMLImageElement, style: FrameStyle): CanvasConfig {
  const imageWidth = img.naturalWidth;
  const imageHeight = img.naturalHeight;
  
  let canvasWidth = imageWidth;
  let canvasHeight = imageHeight;
  let imageX = 0;
  let imageY = 0;
  let barHeight = 0;

  switch (style) {
    case 'cinematic':
      // No extra space, text overlaid on image
      break;
    
    case 'insta':
      // Padding all around
      const padding = Math.round(imageWidth * PADDING_RATIO);
      canvasWidth = imageWidth + padding * 2;
      canvasHeight = imageHeight + padding * 2 + Math.round(imageHeight * 0.08);
      imageX = padding;
      imageY = padding;
      barHeight = Math.round(imageHeight * 0.08);
      break;
    
    default:
      // Bottom bar styles (classic, elegant, badge)
      barHeight = Math.round(imageHeight * FRAME_BAR_RATIO);
      canvasHeight = imageHeight + barHeight;
      break;
  }

  return { imageWidth, imageHeight, canvasWidth, canvasHeight, imageX, imageY, barHeight };
}

function drawClassicFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Frame bar
  const barY = imageHeight;
  const fontSize = Math.round(barHeight * 0.18);
  const smallFontSize = Math.round(barHeight * 0.14);
  const padding = Math.round(imageWidth * 0.03);
  
  // Red circle (Leica style logo)
  const circleRadius = Math.round(barHeight * 0.2);
  const circleX = padding + circleRadius;
  const circleY = barY + barHeight / 2;
  ctx.fillStyle = '#E21B24';
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Model text (bold)
  ctx.fillStyle = '#333333';
  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
  const textX = circleX + circleRadius + padding;
  ctx.fillText(data.model, textX, barY + barHeight * 0.45);
  
  // Settings text (smaller, gray)
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${smallFontSize}px Inter, sans-serif`;
  ctx.fillText(data.settings, textX, barY + barHeight * 0.72);
  
  // Right side - lens and date
  ctx.textAlign = 'right';
  ctx.fillStyle = '#333333';
  ctx.font = `500 ${smallFontSize}px Inter, sans-serif`;
  ctx.fillText(data.lens, imageWidth - padding, barY + barHeight * 0.45);
  
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${smallFontSize}px Inter, sans-serif`;
  ctx.fillText(data.date, imageWidth - padding, barY + barHeight * 0.72);
  
  ctx.textAlign = 'left';
}

function drawElegantFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Frame bar
  const barY = imageHeight;
  const brandFontSize = Math.round(barHeight * 0.28);
  const infoFontSize = Math.round(barHeight * 0.14);
  
  // Brand name (centered, serif)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333333';
  ctx.font = `italic 400 ${brandFontSize}px "Playfair Display", Georgia, serif`;
  ctx.letterSpacing = '0.2em';
  ctx.fillText(data.make.toUpperCase(), imageWidth / 2, barY + barHeight * 0.42);
  
  // Info line
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${infoFontSize}px Inter, sans-serif`;
  const infoText = `${data.model}  |  ${data.settings}`;
  ctx.fillText(infoText, imageWidth / 2, barY + barHeight * 0.65);
  
  // Date (smaller)
  ctx.font = `400 ${infoFontSize * 0.85}px Inter, sans-serif`;
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText(data.date, imageWidth / 2, barY + barHeight * 0.85);
  
  ctx.textAlign = 'left';
}

function drawCinematicFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig
) {
  const { imageWidth, imageHeight } = config;
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Gradient overlay at bottom
  const gradientHeight = imageHeight * 0.25;
  const gradient = ctx.createLinearGradient(0, imageHeight - gradientHeight, 0, imageHeight);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, imageHeight - gradientHeight, imageWidth, gradientHeight);
  
  const fontSize = Math.round(imageWidth * 0.025);
  const smallFontSize = Math.round(imageWidth * 0.018);
  const padding = Math.round(imageWidth * 0.03);
  const bottomY = imageHeight - padding;
  
  // Left side - date and make
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${smallFontSize}px Inter, sans-serif`;
  ctx.fillText(data.date, padding, bottomY - fontSize * 1.5);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `500 ${fontSize}px Inter, sans-serif`;
  ctx.fillText(data.make, padding, bottomY);
  
  // Right side - settings and lens
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `500 ${fontSize}px "JetBrains Mono", monospace`;
  ctx.fillText(data.settings, imageWidth - padding, bottomY - fontSize * 1.5);
  
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${smallFontSize}px Inter, sans-serif`;
  ctx.fillText(data.lens, imageWidth - padding, bottomY);
  
  ctx.textAlign = 'left';
}

function drawBadgeFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Frame bar
  const barY = imageHeight;
  const settingsFontSize = Math.round(barHeight * 0.2);
  const dateFontSize = Math.round(barHeight * 0.12);
  
  // Yellow badge (Nikon style)
  const badgeSize = Math.round(barHeight * 0.28);
  const badgeX = (imageWidth - badgeSize) / 2;
  const badgeY = barY + barHeight * 0.15;
  ctx.fillStyle = '#FFCC00';
  ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);
  
  // Settings (bold, centered)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333333';
  ctx.font = `700 ${settingsFontSize}px "JetBrains Mono", monospace`;
  ctx.fillText(data.settings, imageWidth / 2, barY + barHeight * 0.65);
  
  // Date (smaller, gray)
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${dateFontSize}px Inter, sans-serif`;
  ctx.fillText(data.date, imageWidth / 2, barY + barHeight * 0.85);
  
  ctx.textAlign = 'left';
}

function drawInstaFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, imageX, imageY, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
  
  // Text area below image
  const textY = imageY + imageHeight;
  const brandFontSize = Math.round(barHeight * 0.25);
  const settingsFontSize = Math.round(barHeight * 0.2);
  const dateFontSize = Math.round(barHeight * 0.15);
  
  // Brand (centered)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333333';
  ctx.font = `600 ${brandFontSize}px Inter, sans-serif`;
  ctx.letterSpacing = '0.15em';
  ctx.fillText(data.make.toUpperCase(), canvasWidth / 2, textY + barHeight * 0.35);
  
  // Settings
  ctx.fillStyle = '#666666';
  ctx.font = `400 ${settingsFontSize}px "JetBrains Mono", monospace`;
  ctx.fillText(data.settings, canvasWidth / 2, textY + barHeight * 0.6);
  
  // Date
  ctx.fillStyle = '#999999';
  ctx.font = `400 ${dateFontSize}px Inter, sans-serif`;
  ctx.fillText(data.date, canvasWidth / 2, textY + barHeight * 0.82);
  
  ctx.textAlign = 'left';
}

export async function generateFramedImage(
  imageFile: File,
  data: ExifPayload,
  style: FrameStyle
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    
    img.onload = () => {
      try {
        const config = calculateConfig(img, style);
        
        const canvas = document.createElement('canvas');
        canvas.width = config.canvasWidth;
        canvas.height = config.canvasHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw based on style
        switch (style) {
          case 'classic':
            drawClassicFrame(ctx, img, data, config);
            break;
          case 'elegant':
            drawElegantFrame(ctx, img, data, config);
            break;
          case 'cinematic':
            drawCinematicFrame(ctx, img, data, config);
            break;
          case 'badge':
            drawBadgeFrame(ctx, img, data, config);
            break;
          case 'insta':
            drawInstaFrame(ctx, img, data, config);
            break;
          default:
            drawClassicFrame(ctx, img, data, config);
        }
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate image'));
            }
          },
          'image/jpeg',
          0.95
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
