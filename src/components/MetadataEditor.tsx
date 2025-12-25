import type { ExifPayload } from '@/types/exif';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MetadataEditorProps {
  data: ExifPayload;
  onChange: (data: ExifPayload) => void;
}

export function MetadataEditor({ data, onChange }: MetadataEditorProps) {
  const handleChange = (field: keyof ExifPayload, value: string) => {
    const updated = { ...data, [field]: value };
    
    // Auto-rebuild settings string when individual fields change
    if (['focalLength', 'aperture', 'shutter', 'iso'].includes(field)) {
      updated.settings = `${updated.focalLength} ${updated.aperture} ${updated.shutter} ${updated.iso}`;
    }
    
    onChange(updated);
  };

  const fields: { key: keyof ExifPayload; label: string; placeholder: string }[] = [
    { key: 'make', label: 'Brand', placeholder: 'Sony' },
    { key: 'model', label: 'Camera', placeholder: 'A7IV' },
    { key: 'lens', label: 'Lens', placeholder: '35mm f/1.4' },
    { key: 'focalLength', label: 'Focal', placeholder: '35mm' },
    { key: 'aperture', label: 'Aperture', placeholder: 'f/2.8' },
    { key: 'shutter', label: 'Shutter', placeholder: '1/250s' },
    { key: 'iso', label: 'ISO', placeholder: 'ISO400' },
    { key: 'date', label: 'Date', placeholder: '2024.01.15' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {fields.slice(0, 2).map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={key} className="text-xs text-muted-foreground">
              {label}
            </Label>
            <Input
              id={key}
              value={data[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="metadata-input h-8 text-sm"
            />
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="lens" className="text-xs text-muted-foreground">
          Lens
        </Label>
        <Input
          id="lens"
          value={data.lens}
          onChange={(e) => handleChange('lens', e.target.value)}
          placeholder="35mm f/1.4"
          className="metadata-input h-8 text-sm"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {fields.slice(3, 7).map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={key} className="text-[10px] text-muted-foreground">
              {label}
            </Label>
            <Input
              id={key}
              value={data[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="metadata-input h-8 text-xs"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label htmlFor="date" className="text-xs text-muted-foreground">
          Date
        </Label>
        <Input
          id="date"
          value={data.date}
          onChange={(e) => handleChange('date', e.target.value)}
          placeholder="2024.01.15"
          className="metadata-input h-8 text-sm"
        />
      </div>
    </div>
  );
}
