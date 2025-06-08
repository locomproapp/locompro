
import React from 'react';
import { User } from 'lucide-react';

interface Profile {
  full_name: string | null;
}

interface Post {
  contact_info: any;
  profiles?: Profile | null;
}

interface BuyerInfoProps {
  post: Post;
}

const BuyerInfo = ({ post }: BuyerInfoProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <User className="h-4 w-4" />
        Comprador
      </h3>
      <div className="text-muted-foreground">
        <p className="font-medium">
          {post.profiles?.full_name || 'Usuario anónimo'}
        </p>
        {post.contact_info && (
          <div className="mt-2 text-sm">
            <pre className="bg-muted p-2 rounded text-xs">
              {JSON.stringify(post.contact_info, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInfo;
