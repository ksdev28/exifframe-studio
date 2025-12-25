import type { ExifPayload, FrameStyle, FrameOptions } from '@/types/exif';
import type { BrandId } from '@/components/BrandLogos';
import { drawBrandLogo } from '@/components/BrandLogos';

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
      canvasHeight = imageHeight + padding * 2 + Math.round(imageHeight * 0.1);
      imageX = padding;
      imageY = padding;
      barHeight = Math.round(imageHeight * 0.1);
      break;
    
    default:
      // Bottom bar styles (classic, elegant, badge)
      barHeight = Math.round(imageHeight * FRAME_BAR_RATIO);
      canvasHeight = imageHeight + barHeight;
      break;
  }

  return { imageWidth, imageHeight, canvasWidth, canvasHeight, imageX, imageY, barHeight };
}

async function loadCustomLogo(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawClassicFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig,
  options: FrameOptions,
  customLogoImg: HTMLImageElement | null
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
  
  let textStartX = padding;
  
  // Draw brand logo if enabled
  if (options.showLogo && options.brandId !== 'none') {
    const logoSize = barHeight * 0.6;
    const logoX = padding + logoSize / 2;
    const logoY = barY + barHeight / 2;
    
    if (options.brandId === 'custom' && customLogoImg) {
      const aspectRatio = customLogoImg.width / customLogoImg.height;
      let drawWidth = logoSize;
      let drawHeight = logoSize;
      if (aspectRatio > 1) {
        drawHeight = logoSize / aspectRatio;
      } else {
        drawWidth = logoSize * aspectRatio;
      }
      ctx.drawImage(customLogoImg, logoX - drawWidth / 2, logoY - drawHeight / 2, drawWidth, drawHeight);
    } else {
      drawBrandLogo(ctx, options.brandId, logoX, logoY, logoSize, customLogoImg);
    }
    
    textStartX = padding + logoSize + padding;
  }
  
  // Model text (bold)
  ctx.fillStyle = '#333333';
  ctx.font = `600 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(data.model, textStartX, barY + barHeight * 0.45);
  
  // Settings text (smaller, gray)
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${smallFontSize}px Arial, sans-serif`;
  ctx.fillText(data.settings, textStartX, barY + barHeight * 0.72);
  
  // Right side - photographer, location, date
  ctx.textAlign = 'right';
  
  if (data.photographer) {
    ctx.fillStyle = '#333333';
    ctx.font = `500 ${smallFontSize}px Arial, sans-serif`;
    ctx.fillText(`© ${data.photographer}`, imageWidth - padding, barY + barHeight * 0.35);
  }
  
  if (data.location) {
    ctx.fillStyle = '#888888';
    ctx.font = `400 ${smallFontSize * 0.9}px Arial, sans-serif`;
    ctx.fillText(data.location, imageWidth - padding, barY + barHeight * 0.55);
  }
  
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${smallFontSize * 0.9}px Arial, sans-serif`;
  ctx.fillText(data.date, imageWidth - padding, barY + barHeight * 0.78);
  
  ctx.textAlign = 'left';
}

function drawElegantFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig,
  options: FrameOptions,
  customLogoImg: HTMLImageElement | null
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Frame bar
  const barY = imageHeight;
  const brandFontSize = Math.round(barHeight * 0.25);
  const infoFontSize = Math.round(barHeight * 0.14);
  
  ctx.textAlign = 'center';
  
  // Draw brand logo if enabled
  if (options.showLogo && options.brandId !== 'none') {
    const logoSize = barHeight * 0.35;
    drawBrandLogo(ctx, options.brandId, imageWidth / 2, barY + barHeight * 0.22, logoSize, customLogoImg);
  }
  
  // Brand name (centered)
  ctx.fillStyle = '#333333';
  ctx.font = `italic 400 ${brandFontSize}px Georgia, serif`;
  ctx.fillText(data.make.toUpperCase(), imageWidth / 2, barY + barHeight * 0.5);
  
  // Info line with location
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${infoFontSize}px Arial, sans-serif`;
  let infoText = `${data.model}  |  ${data.settings}`;
  if (data.location) {
    infoText += `  |  ${data.location}`;
  }
  ctx.fillText(infoText, imageWidth / 2, barY + barHeight * 0.7);
  
  // Photographer and date
  let bottomText = data.date;
  if (data.photographer) {
    bottomText = `${data.photographer}  •  ${data.date}`;
  }
  ctx.font = `400 ${infoFontSize * 0.9}px Arial, sans-serif`;
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText(bottomText, imageWidth / 2, barY + barHeight * 0.88);
  
  ctx.textAlign = 'left';
}

function drawCinematicFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig,
  options: FrameOptions,
  customLogoImg: HTMLImageElement | null
) {
  const { imageWidth, imageHeight } = config;
  
  // Draw image
  ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  
  // Top logo if enabled
  if (options.showLogo && options.brandId !== 'none') {
    const logoSize = imageWidth * 0.05;
    drawBrandLogo(ctx, options.brandId, imageWidth / 2, logoSize * 1.5, logoSize, customLogoImg);
  }
  
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
  
  // Left side - date, location
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${smallFontSize}px Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(data.date, padding, bottomY - fontSize * 1.8);
  
  if (data.location) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `500 ${fontSize}px Arial, sans-serif`;
    ctx.fillText(data.location, padding, bottomY - fontSize * 0.5);
  }
  
  // Right side - settings and photographer
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `500 ${fontSize}px "Courier New", monospace`;
  ctx.fillText(data.settings, imageWidth - padding, bottomY - fontSize * 1.8);
  
  if (data.photographer) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `400 ${smallFontSize}px Arial, sans-serif`;
    ctx.fillText(`© ${data.photographer}`, imageWidth - padding, bottomY - fontSize * 0.5);
  }
  
  ctx.textAlign = 'left';
}

function drawBadgeFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig,
  options: FrameOptions,
  customLogoImg: HTMLImageElement | null
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
  
  ctx.textAlign = 'center';
  
  // Logo or yellow badge
  if (options.showLogo && options.brandId !== 'none') {
    const logoSize = barHeight * 0.35;
    drawBrandLogo(ctx, options.brandId, imageWidth / 2, barY + barHeight * 0.25, logoSize, customLogoImg);
  } else {
    // Yellow badge (Nikon style)
    const badgeSize = Math.round(barHeight * 0.25);
    const badgeX = (imageWidth - badgeSize) / 2;
    const badgeY = barY + barHeight * 0.12;
    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);
  }
  
  // Settings (bold, centered)
  ctx.fillStyle = '#333333';
  ctx.font = `700 ${settingsFontSize}px "Courier New", monospace`;
  ctx.fillText(data.settings, imageWidth / 2, barY + barHeight * 0.58);
  
  // Location and date
  let bottomText = data.date;
  if (data.location) {
    bottomText = `${data.location}  •  ${data.date}`;
  }
  ctx.fillStyle = '#888888';
  ctx.font = `400 ${dateFontSize}px Arial, sans-serif`;
  ctx.fillText(bottomText, imageWidth / 2, barY + barHeight * 0.78);
  
  // Photographer
  if (data.photographer) {
    ctx.font = `400 ${dateFontSize}px Arial, sans-serif`;
    ctx.fillText(`by ${data.photographer}`, imageWidth / 2, barY + barHeight * 0.92);
  }
  
  ctx.textAlign = 'left';
}

function drawInstaFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: ExifPayload,
  config: CanvasConfig,
  options: FrameOptions,
  customLogoImg: HTMLImageElement | null
) {
  const { imageWidth, imageHeight, canvasWidth, canvasHeight, imageX, imageY, barHeight } = config;
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw image
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
  
  // Text area below image
  const textY = imageY + imageHeight;
  const brandFontSize = Math.round(barHeight * 0.2);
  const settingsFontSize = Math.round(barHeight * 0.16);
  const dateFontSize = Math.round(barHeight * 0.12);
  
  ctx.textAlign = 'center';
  
  // Brand logo if enabled
  if (options.showLogo && options.brandId !== 'none') {
    const logoSize = barHeight * 0.25;
    drawBrandLogo(ctx, options.brandId, canvasWidth / 2, textY + barHeight * 0.18, logoSize, customLogoImg);
  }
  
  // Brand (centered)
  ctx.fillStyle = '#333333';
  ctx.font = `600 ${brandFontSize}px Arial, sans-serif`;
  ctx.fillText(data.make.toUpperCase(), canvasWidth / 2, textY + barHeight * 0.4);
  
  // Settings
  ctx.fillStyle = '#666666';
  ctx.font = `400 ${settingsFontSize}px "Courier New", monospace`;
  ctx.fillText(data.settings, canvasWidth / 2, textY + barHeight * 0.58);
  
  // Location and date
  let bottomText = data.date;
  if (data.location) {
    bottomText = `${data.location}  •  ${data.date}`;
  }
  ctx.fillStyle = '#999999';
  ctx.font = `400 ${dateFontSize}px Arial, sans-serif`;
  ctx.fillText(bottomText, canvasWidth / 2, textY + barHeight * 0.74);
  
  // Photographer
  if (data.photographer) {
    ctx.fillStyle = '#666666';
    ctx.font = `400 ${dateFontSize}px Arial, sans-serif`;
    ctx.fillText(`© ${data.photographer}`, canvasWidth / 2, textY + barHeight * 0.9);
  }
  
  ctx.textAlign = 'left';
}

export async function generateFramedImage(
  imageFile: File,
  data: ExifPayload,
  style: FrameStyle,
  options: FrameOptions
): Promise<Blob> {
  // Load custom logo if needed
  let customLogoImg: HTMLImageElement | null = null;
  if (options.brandId === 'custom' && options.customLogoUrl) {
    customLogoImg = await loadCustomLogo(options.customLogoUrl);
  }

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
            drawClassicFrame(ctx, img, data, config, options, customLogoImg);
            break;
          case 'elegant':
            drawElegantFrame(ctx, img, data, config, options, customLogoImg);
            break;
          case 'cinematic':
            drawCinematicFrame(ctx, img, data, config, options, customLogoImg);
            break;
          case 'badge':
            drawBadgeFrame(ctx, img, data, config, options, customLogoImg);
            break;
          case 'insta':
            drawInstaFrame(ctx, img, data, config, options, customLogoImg);
            break;
          default:
            drawClassicFrame(ctx, img, data, config, options, customLogoImg);
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
