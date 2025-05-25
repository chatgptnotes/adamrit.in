// WhatsApp notification helper
export async function sendWhatsAppNotification(suggestion: string) {
  const phoneNumber = '919373111709'; // Indian number with country code
  const message = encodeURIComponent(
    `🔔 New Feature Suggestion for Dr. Murali!\n\n` +
    `"${suggestion}"\n\n` +
    `Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
    `Please review this suggestion in the database.`
  );
  
  // Create WhatsApp Web link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  // For automatic sending, you would need WhatsApp Business API
  // For now, this will open WhatsApp Web with pre-filled message
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
  
  return whatsappUrl;
} 