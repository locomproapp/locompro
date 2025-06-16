
export interface FormData {
  title: string;
  description: string;
  min_price: string;
  max_price: string;
  reference_url: string;
  zone: string;
  condition: string;
  images: string[];
}

export interface CreatePostDialogProps {
  onPostCreated?: () => void;
}
