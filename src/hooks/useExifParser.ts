import { useState, useCallback } from 'react';
import ExifReader from 'exifreader';
import type { ExifPayload } from '@/types/exif';

// Default payload when no EXIF data
const DEFAULT_PAYLOAD: ExifPayload = {
  make: 'Camera',
  model: 'Model',
  lens: '50mm',
  focalLength: '50mm',
  aperture: 'f/2.8',
  shutter: '1/125s',
  iso: 'ISO400',
  date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
  settings: '50mm f/2.8 1/125s ISO400',
};

/**
 * Format shutter speed from decimal to fractional notation
 * e.g., 0.004 -> "1/250s", 2 -> "2s"
 */
function formatShutterSpeed(value: number): string {
  if (value >= 1) {
    return `${Math.round(value)}s`;
  }
  const denominator = Math.round(1 / value);
  return `1/${denominator}s`;
}

/**
 * Format aperture value
 * e.g., 2.8 -> "f/2.8", 4.0 -> "f/4"
 */
function formatAperture(value: number): string {
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
  // Remove trailing .0
  const clean = formatted.replace(/\.0$/, '');
  return `f/${clean}`;
}

/**
 * Format focal length
 * e.g., 35 -> "35mm"
 */
function formatFocalLength(value: number): string {
  return `${Math.round(value)}mm`;
}

/**
 * Clean up lens model string
 * Removes excessive prefixes and camera make if it repeats
 */
function cleanLensModel(lens: string, make: string): string {
  if (!lens) return '';
  
  let cleaned = lens;
  
  // Remove make prefix if it exists
  const makeVariants = [make, make.toUpperCase(), make.toLowerCase()];
  for (const variant of makeVariants) {
    if (cleaned.startsWith(variant + ' ')) {
      cleaned = cleaned.substring(variant.length + 1);
    }
  }
  
  // Trim and limit length
  cleaned = cleaned.trim();
  if (cleaned.length > 25) {
    // Try to extract just focal range and aperture
    const focalMatch = cleaned.match(/(\d+(?:-\d+)?mm)/i);
    const apertureMatch = cleaned.match(/[fF][\s/]?(\d+\.?\d*(?:-\d+\.?\d*)?)/);
    
    if (focalMatch) {
      let short = focalMatch[1];
      if (apertureMatch) {
        short += ` f/${apertureMatch[1]}`;
      }
      return short;
    }
  }
  
  return cleaned;
}

/**
 * Format date from EXIF format to display format
 * e.g., "2023:09:19 14:30:00" -> "2023.09.19"
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Handle EXIF date format "YYYY:MM:DD HH:MM:SS"
  const match = dateStr.match(/(\d{4}):(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}`;
  }
  
  // Try ISO format
  const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}.${isoMatch[2]}.${isoMatch[3]}`;
  }
  
  return dateStr;
}

/**
 * Get value from EXIF tag, handling various formats
 */
function getTagValue(tags: any, ...keys: string[]): any {
  for (const key of keys) {
    if (tags[key]) {
      const tag = tags[key];
      if (tag.description !== undefined) return tag.description;
      if (tag.value !== undefined) return tag.value;
      return tag;
    }
  }
  return null;
}

/**
 * Get numeric value from EXIF tag
 */
function getNumericValue(tags: any, ...keys: string[]): number | null {
  const value = getTagValue(tags, ...keys);
  if (value === null) return null;
  
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

export function useExifParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExif = useCallback(async (file: File): Promise<ExifPayload> => {
    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer, { expanded: true });
      
      const exif = tags.exif || {};
      const image = tags.file || {};
      
      // Extract make
      const make = getTagValue(exif, 'Make', 'make') || 
                   getTagValue(image, 'Make') || '';
      
      // Extract model
      const model = getTagValue(exif, 'Model', 'model') || 
                    getTagValue(image, 'Model') || '';
      
      // Extract and format focal length
      const focalLengthNum = getNumericValue(exif, 'FocalLength', 'FocalLengthIn35mmFilm');
      const focalLength = focalLengthNum 
        ? formatFocalLength(focalLengthNum) 
        : DEFAULT_PAYLOAD.focalLength;
      
      // Extract and format aperture
      const apertureNum = getNumericValue(exif, 'FNumber', 'ApertureValue');
      const aperture = apertureNum 
        ? formatAperture(apertureNum) 
        : DEFAULT_PAYLOAD.aperture;
      
      // Extract and format shutter speed
      const shutterNum = getNumericValue(exif, 'ExposureTime', 'ShutterSpeedValue');
      const shutter = shutterNum 
        ? formatShutterSpeed(shutterNum) 
        : DEFAULT_PAYLOAD.shutter;
      
      // Extract ISO
      const isoNum = getNumericValue(exif, 'ISOSpeedRatings', 'ISO', 'PhotographicSensitivity');
      const iso = isoNum ? `ISO${Math.round(isoNum)}` : DEFAULT_PAYLOAD.iso;
      
      // Extract and format date
      const dateRaw = getTagValue(exif, 'DateTimeOriginal', 'DateTime', 'CreateDate') || '';
      const date = formatDate(dateRaw) || DEFAULT_PAYLOAD.date;
      
      // Extract and clean lens model
      const lensRaw = getTagValue(exif, 'LensModel', 'Lens', 'LensInfo') || '';
      const lens = cleanLensModel(lensRaw, make) || focalLength;
      
      // Build settings string
      const settings = `${focalLength} ${aperture} ${shutter} ${iso}`;
      
      const payload: ExifPayload = {
        make: make || DEFAULT_PAYLOAD.make,
        model: model || DEFAULT_PAYLOAD.model,
        lens,
        focalLength,
        aperture,
        shutter,
        iso,
        date,
        settings,
      };

      setIsLoading(false);
      return payload;
    } catch (err) {
      console.error('EXIF parsing error:', err);
      setError('Could not read EXIF data');
      setIsLoading(false);
      return DEFAULT_PAYLOAD;
    }
  }, []);

  return {
    parseExif,
    isLoading,
    error,
    defaultPayload: DEFAULT_PAYLOAD,
  };
}
