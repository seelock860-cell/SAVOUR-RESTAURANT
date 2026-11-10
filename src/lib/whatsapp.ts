/**
 * Formats a phone number for direct WhatsApp wa.me links.
 * Converts local Nigerian formats (e.g. 09024971419) or international (+234...) to clean digits: 2349024971419
 */
export const cleanWhatsAppNumber = (rawNumber?: string): string => {
  const digits = (rawNumber || '09024971419').replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    return '234' + digits.slice(1);
  }
  if (!digits.startsWith('234') && digits.length === 10) {
    return '234' + digits;
  }
  return digits || '2349024971419';
};

export const getWhatsAppUrl = (rawNumber?: string, message?: string): string => {
  const cleanNumber = cleanWhatsAppNumber(rawNumber);
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${textParam}`;
};
