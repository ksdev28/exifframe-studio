import { useState, useCallback } from 'react';
import { Download, Camera, Sparkles, Settings2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UploadZone } from '@/components/UploadZone';
import { FrameSelector } from '@/components/FrameSelector';
import { FramePreview } from '@/components/FramePreview';
import { MetadataEditor } from '@/components/MetadataEditor';
import { LogoSelector } from '@/components/LogoSelector';
import { useExifParser } from '@/hooks/useExifParser';
import { generateFramedImage, downloadBlob } from '@/utils/canvasRenderer';
import type { ExifPayload, FrameStyle, FrameOptions } from '@/types/exif';
import type { BrandId } from '@/components/BrandLogos';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('classic');
  const [exifData, setExifData] = useState<ExifPayload | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Frame options
  const [brandId, setBrandId] = useState<BrandId>('none');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);

  const frameOptions: FrameOptions = {
    brandId,
    customLogoUrl,
    showLogo,
  };

  const { parseExif, isLoading: isParsingExif, defaultPayload } = useExifParser();

  const handleFileSelect = useCallback(async (file: File) => {
    // Revoke old URL if exists
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));

    // Parse EXIF data
    const data = await parseExif(file);
    setExifData(data);

    // Auto-select brand based on make if available
    const makeLower = data.make.toLowerCase();
    const brandMappings: Record<string, BrandId> = {
      'sony': 'sony',
      'canon': 'canon',
      'nikon': 'nikon',
      'fujifilm': 'fujifilm',
      'fuji': 'fujifilm',
      'panasonic': 'panasonic',
      'lumix': 'panasonic',
      'olympus': 'olympus',
      'om system': 'olympus',
      'pentax': 'pentax',
      'leica': 'leica',
      'hasselblad': 'hasselblad',
      'samsung': 'samsung',
      'apple': 'apple',
      'google': 'google',
      'xiaomi': 'xiaomi',
      'huawei': 'huawei',
      'oppo': 'oppo',
      'vivo': 'vivo',
      'oneplus': 'oneplus',
      'dji': 'dji',
      'gopro': 'gopro',
      'ricoh': 'ricoh',
      'sigma': 'sigma',
    };

    for (const [key, value] of Object.entries(brandMappings)) {
      if (makeLower.includes(key)) {
        setBrandId(value);
        break;
      }
    }

    toast({
      title: "Foto carregada",
      description: `Metadados extraídos de ${file.name}`,
    });
  }, [imageUrl, parseExif]);

  const handleDownload = useCallback(async () => {
    if (!imageFile || !exifData) return;

    setIsDownloading(true);
    try {
      const blob = await generateFramedImage(imageFile, exifData, frameStyle, frameOptions);
      const filename = `${imageFile.name.replace(/\.[^.]+$/, '')}_framed.jpg`;
      downloadBlob(blob, filename);

      toast({
        title: "Download concluído",
        description: "Sua foto emoldurada foi salva.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar a imagem emoldurada.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [imageFile, exifData, frameStyle, frameOptions]);

  const handleMetadataChange = useCallback((data: ExifPayload) => {
    setExifData(data);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              ExifFrame
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Molduras com metadados
            </span>
          </div>

          {imageFile && (
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !exifData}
              className="gap-2"
            >
              {isDownloading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse-subtle" />
                  Processando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 space-y-4">
            {/* Upload */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="sidebar-section">
                <h2 className="sidebar-section-title">Foto</h2>
                <UploadZone onFileSelect={handleFileSelect} hasImage={!!imageFile} />
                {isParsingExif && (
                  <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">
                    Lendo metadados...
                  </p>
                )}
              </div>

              {/* Frame Styles */}
              <div className="sidebar-section">
                <h2 className="sidebar-section-title">Estilo da Moldura</h2>
                <FrameSelector selected={frameStyle} onSelect={setFrameStyle} />
              </div>

              {/* Logo Selector */}
              <div className="sidebar-section">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="sidebar-section-title mb-0">Logo da Marca</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showLogo"
                      checked={showLogo}
                      onCheckedChange={setShowLogo}
                      className="scale-75"
                    />
                    <Label htmlFor="showLogo" className="text-[10px] text-muted-foreground cursor-pointer">
                      Exibir
                    </Label>
                  </div>
                </div>
                <LogoSelector
                  selectedBrand={brandId}
                  onSelectBrand={setBrandId}
                  customLogoUrl={customLogoUrl}
                  onCustomLogoChange={setCustomLogoUrl}
                />
              </div>

              {/* Metadata Editor */}
              {exifData && (
                <div className="sidebar-section">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="sidebar-section-title mb-0">Metadados</h2>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="advanced"
                        checked={showAdvanced}
                        onCheckedChange={setShowAdvanced}
                        className="scale-75"
                      />
                      <Label htmlFor="advanced" className="text-[10px] text-muted-foreground cursor-pointer">
                        Editar
                      </Label>
                    </div>
                  </div>

                  {showAdvanced ? (
                    <MetadataEditor data={exifData} onChange={handleMetadataChange} />
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Câmera</span>
                        <span className="text-foreground font-medium">{exifData.make} {exifData.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lente</span>
                        <span className="text-foreground">{exifData.lens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Config.</span>
                        <span className="text-foreground font-mono text-xs">{exifData.settings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data</span>
                        <span className="text-foreground">{exifData.date}</span>
                      </div>
                      {exifData.photographer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fotógrafo</span>
                          <span className="text-foreground">{exifData.photographer}</span>
                        </div>
                      )}
                      {exifData.location && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Local</span>
                          <span className="text-foreground">{exifData.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            {!imageFile && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Settings2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Como usar</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faça upload de uma foto com dados EXIF. O ExifFrame irá extrair automaticamente as configurações da câmera e permitir que você escolha um estilo de moldura.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Preview Area */}
          <main className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-2xl">
              {!imageFile ? (
                <div className="aspect-[3/4] bg-card border border-border rounded-xl flex flex-col items-center justify-center p-8">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Faça upload de uma foto para ver a prévia
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2 text-center max-w-xs">
                    Suporta JPEG, PNG, WEBP, HEIC e TIFF com metadados EXIF
                  </p>
                </div>
              ) : (
                <div className="animate-scale-in">
                  <FramePreview
                    imageUrl={imageUrl}
                    data={exifData || defaultPayload}
                    style={frameStyle}
                    options={frameOptions}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            O ExifFrame processa fotos localmente no seu navegador. Nenhuma imagem é enviada para servidores.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
