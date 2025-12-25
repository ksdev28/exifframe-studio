import type { ExifPayload } from '@/types/exif';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {/* Photographer signature section */}
      <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
        <h3 className="text-xs font-medium text-primary flex items-center gap-1.5">
          <User className="w-3 h-3" />
          Assinatura
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <Label htmlFor="photographer" className="text-[10px] text-muted-foreground">
              Nome do Fotógrafo
            </Label>
            <Input
              id="photographer"
              value={data.photographer}
              onChange={(e) => handleChange('photographer', e.target.value)}
              placeholder="Seu nome"
              className="metadata-input h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location" className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Localização
            </Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="São Paulo, Brasil"
              className="metadata-input h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Camera info */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground">Câmera</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="make" className="text-[10px] text-muted-foreground">
              Marca
            </Label>
            <Input
              id="make"
              value={data.make}
              onChange={(e) => handleChange('make', e.target.value)}
              placeholder="Sony"
              className="metadata-input h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="model" className="text-[10px] text-muted-foreground">
              Modelo
            </Label>
            <Input
              id="model"
              value={data.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="A7IV"
              className="metadata-input h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="lens" className="text-[10px] text-muted-foreground">
            Lente
          </Label>
          <Input
            id="lens"
            value={data.lens}
            onChange={(e) => handleChange('lens', e.target.value)}
            placeholder="35mm f/1.4"
            className="metadata-input h-8 text-sm"
          />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground">Configurações</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1">
            <Label htmlFor="focalLength" className="text-[10px] text-muted-foreground">
              Focal
            </Label>
            <Input
              id="focalLength"
              value={data.focalLength}
              onChange={(e) => handleChange('focalLength', e.target.value)}
              placeholder="35mm"
              className="metadata-input h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="aperture" className="text-[10px] text-muted-foreground">
              Abertura
            </Label>
            <Input
              id="aperture"
              value={data.aperture}
              onChange={(e) => handleChange('aperture', e.target.value)}
              placeholder="f/2.8"
              className="metadata-input h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="shutter" className="text-[10px] text-muted-foreground">
              Shutter
            </Label>
            <Input
              id="shutter"
              value={data.shutter}
              onChange={(e) => handleChange('shutter', e.target.value)}
              placeholder="1/250s"
              className="metadata-input h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="iso" className="text-[10px] text-muted-foreground">
              ISO
            </Label>
            <Input
              id="iso"
              value={data.iso}
              onChange={(e) => handleChange('iso', e.target.value)}
              placeholder="ISO400"
              className="metadata-input h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <Label htmlFor="date" className="text-[10px] text-muted-foreground">
          Data
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
