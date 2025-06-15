
export interface FormData {
  title: string;
  description: string;
  minPrice: string;
  maxPrice: string;
  referenceLink: string;
  zone: string;
  contactInfo: string;
  images: string[];
}

export interface CreatePostDialogProps {
  onPostCreated?: () => void;
}
