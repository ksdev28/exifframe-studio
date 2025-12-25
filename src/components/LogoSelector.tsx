import { useCallback, useRef, useState } from 'react';
import { Upload, X, Search } from 'lucide-react';
import { BrandLogo, BRAND_LIST, type BrandId } from './BrandLogos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LogoSelectorProps {
  selectedBrand: BrandId;
  onSelectBrand: (brand: BrandId) => void;
  customLogoUrl: string | null;
  onCustomLogoChange: (url: string | null) => void;
}

export function LogoSelector({ 
  selectedBrand, 
  onSelectBrand, 
  customLogoUrl, 
  onCustomLogoChange 
}: LogoSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBrands = BRAND_LIST.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      onCustomLogoChange(url);
      onSelectBrand('custom');
    }
  }, [onCustomLogoChange, onSelectBrand]);

  const handleRemoveCustomLogo = useCallback(() => {
    if (customLogoUrl) {
      URL.revokeObjectURL(customLogoUrl);
    }
    onCustomLogoChange(null);
    if (selectedBrand === 'custom') {
      onSelectBrand('none');
    }
  }, [customLogoUrl, onCustomLogoChange, selectedBrand, onSelectBrand]);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar marca..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm metadata-input"
        />
      </div>

      {/* Custom Logo Upload */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {customLogoUrl ? (
          <div className="flex items-center gap-2 flex-1 p-2 bg-muted rounded-lg">
            <img 
              src={customLogoUrl} 
              alt="Custom logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs text-foreground flex-1 truncate">Logo personalizada</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRemoveCustomLogo}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-3 h-3 mr-1.5" />
            Upload Logo Personalizada
          </Button>
        )}
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
        {filteredBrands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onSelectBrand(brand.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-all",
              "hover:bg-accent min-h-[52px]",
              selectedBrand === brand.id 
                ? "bg-primary/20 ring-1 ring-primary" 
                : "bg-muted/50"
            )}
            title={brand.name}
          >
            {brand.id === 'none' ? (
              <X className="w-4 h-4 text-muted-foreground" />
            ) : brand.id === 'custom' ? (
              <Upload className="w-4 h-4 text-muted-foreground" />
            ) : (
              <div className="w-full h-5 flex items-center justify-center overflow-hidden">
                <BrandLogo brand={brand.id} size={16} customLogoUrl={customLogoUrl} />
              </div>
            )}
            <span className="text-[9px] text-muted-foreground mt-1 truncate w-full text-center">
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
