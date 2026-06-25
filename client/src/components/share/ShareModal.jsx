import { lazy, Suspense } from 'react';
import { Copy, Mail, Download, Link2, QrCode, Share } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useShare } from '@/hooks/useShare';

// Lazy-load PDF renderer to avoid large initial bundle
const ExportPDFButton = lazy(() => import('./ExportPDFButton'));

const WhatsAppIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const ShareModal = ({ itinerary, onClose }) => {
  const share = useShare(itinerary);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Itinerary</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="link" className="flex-1 gap-1.5"><Link2 className="h-3.5 w-3.5" />Link</TabsTrigger>
            <TabsTrigger value="social" className="flex-1 gap-1.5"><Share className="h-3.5 w-3.5" />Social</TabsTrigger>
            <TabsTrigger value="export" className="flex-1 gap-1.5"><Download className="h-3.5 w-3.5" />PDF</TabsTrigger>
          </TabsList>

          {/* TAB 1: Public Link + QR */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <Label htmlFor="public-toggle" className="flex-1">
                <p className="font-medium">Public link</p>
                <p className="text-xs text-muted-foreground mt-0.5">Anyone with the link can view</p>
              </Label>
              <Switch
                id="public-toggle"
                checked={share.isPublic}
                onCheckedChange={share.toggleSharing}
                disabled={share.isEnabling || share.isDisabling}
              />
            </div>

            {share.shareUrl && (
              <>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={share.shareUrl}
                    className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm truncate"
                  />
                  <Button size="sm" variant="outline" onClick={share.copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-2 py-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <QrCode className="h-3 w-3" />
                    QR code for quick sharing
                  </p>
                  <div className="rounded-lg border p-3 bg-white">
                    <QRCodeSVG value={share.shareUrl} size={160} />
                  </div>
                </div>
              </>
            )}

            {!share.shareUrl && !share.isEnabling && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Toggle the switch to generate a shareable link
              </p>
            )}
            {share.isEnabling && (
              <div className="flex justify-center py-4"><LoadingSpinner /></div>
            )}
          </TabsContent>

          {/* TAB 2: Social */}
          <TabsContent value="social" className="space-y-3 mt-4">
            {!share.shareUrl && (
              <p className="text-sm text-muted-foreground text-center py-2 rounded-lg border p-3">
                Enable the public link first (Link tab) before sharing socially.
              </p>
            )}

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={share.shareTwitter}
              disabled={!share.shareUrl}
            >
              <XIcon />
              Share on Twitter / X
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={share.shareWhatsApp}
              disabled={!share.shareUrl}
            >
              <WhatsAppIcon />
              Share on WhatsApp
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={share.shareEmail}
              disabled={!share.shareUrl}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              Share via Email
            </Button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={share.shareNative}
                disabled={!share.shareUrl}
              >
                <Share className="h-4 w-4" />
                Share…
              </Button>
            )}
          </TabsContent>

          {/* TAB 3: PDF Export */}
          <TabsContent value="export" className="mt-4">
            <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner /></div>}>
              <ExportPDFButton itinerary={itinerary} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
