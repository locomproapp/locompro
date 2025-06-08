
import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

interface ContactInfoProps {
  contactInfo: any;
}

const ContactInfo = ({ contactInfo }: ContactInfoProps) => {
  if (!contactInfo) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Contacto:</h4>
      <div className="flex flex-wrap gap-2">
        {contactInfo.email && (
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            <Mail className="h-3 w-3" />
            {contactInfo.email}
          </a>
        )}
        {contactInfo.phone && (
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
          >
            <Phone className="h-3 w-3" />
            {contactInfo.phone}
          </a>
        )}
        {contactInfo.whatsapp && (
          <a
            href={`https://wa.me/${contactInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
