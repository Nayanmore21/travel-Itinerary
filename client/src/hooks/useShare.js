import { useState } from 'react';
import { toast } from 'sonner';
import { useShareItinerary } from './useItineraries';

export const useShare = (itinerary) => {
  const [isPublic, setIsPublic] = useState(itinerary?.isPublic || false);
  const [shareToken, setShareToken] = useState(itinerary?.shareToken || null);
  const { enable, disable } = useShareItinerary();

  const shareUrl = shareToken
    ? `${window.location.origin}/s/${shareToken}`
    : null;

  const toggleSharing = async (checked) => {
    if (checked) {
      const { data } = await enable.mutateAsync(itinerary._id);
      setShareToken(data.data.shareToken);
      setIsPublic(true);
    } else {
      await disable.mutateAsync(itinerary._id);
      setIsPublic(false);
    }
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => toast.success('Link copied!'));
  };

  const shareNative = () => {
    if (navigator.share && shareUrl) {
      navigator.share({
        title: itinerary.tripSummary?.title,
        text: `Check out my ${itinerary.tripSummary?.totalDays}-day trip to ${itinerary.tripSummary?.destination}`,
        url: shareUrl,
      });
    }
  };

  const shareTwitter = () => {
    if (!shareUrl) return;
    const text = `Just planned my ${itinerary.tripSummary?.totalDays}-day trip to ${itinerary.tripSummary?.destination} with TripCraft ✈`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareWhatsApp = () => {
    if (!shareUrl) return;
    const text = `Check out my travel itinerary: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    if (!shareUrl) return;
    const subject = `My trip to ${itinerary.tripSummary?.destination}`;
    const body = `I planned my trip with TripCraft. Check out my itinerary: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return {
    isPublic,
    shareUrl,
    shareToken,
    toggleSharing,
    copyLink,
    shareNative,
    shareTwitter,
    shareWhatsApp,
    shareEmail,
    isEnabling: enable.isPending,
    isDisabling: disable.isPending,
  };
};
