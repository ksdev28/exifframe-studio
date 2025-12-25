import { useState, useCallback } from 'react';
import { Download, Camera, Sparkles, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UploadZone } from '@/components/UploadZone';
import { FrameSelector } from '@/components/FrameSelector';
import { FramePreview } from '@/components/FramePreview';
import { MetadataEditor } from '@/components/MetadataEditor';
import { useExifParser } from '@/hooks/useExifParser';
import { generateFramedImage, downloadBlob } from '@/utils/canvasRenderer';
import type { ExifPayload, FrameStyle } from '@/types/exif';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('classic');
  const [exifData, setExifData] = useState<ExifPayload | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

    toast({
      title: "Photo loaded",
      description: `Extracted metadata from ${file.name}`,
    });
  }, [imageUrl, parseExif]);

  const handleDownload = useCallback(async () => {
    if (!imageFile || !exifData) return;

    setIsDownloading(true);
    try {
      const blob = await generateFramedImage(imageFile, exifData, frameStyle);
      const filename = `${imageFile.name.replace(/\.[^.]+$/, '')}_framed.jpg`;
      downloadBlob(blob, filename);

      toast({
        title: "Download complete",
        description: "Your framed photo has been saved.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not generate the framed image.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }, [imageFile, exifData, frameStyle]);

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
              Photo metadata frames
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
                  Processing...
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
                <h2 className="sidebar-section-title">Photo</h2>
                <UploadZone onFileSelect={handleFileSelect} hasImage={!!imageFile} />
                {isParsingExif && (
                  <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">
                    Reading metadata...
                  </p>
                )}
              </div>

              {/* Frame Styles */}
              <div className="sidebar-section">
                <h2 className="sidebar-section-title">Frame Style</h2>
                <FrameSelector selected={frameStyle} onSelect={setFrameStyle} />
              </div>

              {/* Metadata Editor */}
              {exifData && (
                <div className="sidebar-section">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="sidebar-section-title mb-0">Metadata</h2>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="advanced"
                        checked={showAdvanced}
                        onCheckedChange={setShowAdvanced}
                        className="scale-75"
                      />
                      <Label htmlFor="advanced" className="text-[10px] text-muted-foreground cursor-pointer">
                        Edit
                      </Label>
                    </div>
                  </div>

                  {showAdvanced ? (
                    <MetadataEditor data={exifData} onChange={handleMetadataChange} />
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Camera</span>
                        <span className="text-foreground font-medium">{exifData.make} {exifData.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lens</span>
                        <span className="text-foreground">{exifData.lens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Settings</span>
                        <span className="text-foreground font-mono text-xs">{exifData.settings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="text-foreground">{exifData.date}</span>
                      </div>
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
                    <p className="text-sm font-medium text-foreground">Getting started</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a photo with EXIF data. ExifFrame will automatically extract camera settings and let you choose a beautiful frame style.
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
                  <Camera className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Upload a photo to see the preview
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2 text-center max-w-xs">
                    Supports JPEG, PNG, WEBP, HEIC, and TIFF with embedded EXIF metadata
                  </p>
                </div>
              ) : (
                <div className="animate-scale-in">
                  <FramePreview
                    imageUrl={imageUrl}
                    data={exifData || defaultPayload}
                    style={frameStyle}
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
            ExifFrame processes photos locally in your browser. No images are uploaded to any server.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
