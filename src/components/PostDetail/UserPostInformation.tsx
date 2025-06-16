import React from 'react';
import { ExternalLink } from 'lucide-react';

interface UserPost {
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  zone: string;
  condition: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
  reference_url: string | null;
}

interface UserPostInformationProps {
  post: UserPost;
}

const UserPostInformation = ({ post }: UserPostInformationProps) => {
  function formatPrice(min: number | null, max: number | null) {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Precio a consultar';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return format(min);
    if (max) return format(max);
    return 'Precio a consultar';
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function formatCondition(condition: string) {
    const conditionMap: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'cualquiera': 'Cualquier estado'
    };
    return conditionMap[condition] || condition;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        {post.title}
      </h1>
      
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
          <p className="text-lg text-primary font-bold">{formatPrice(post.min_price, post.max_price)}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
          <p className="text-base text-foreground">{post.zone}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Estado</h3>
          <p className="text-base text-foreground">{formatCondition(post.condition)}</p>
        </div>

        {post.description && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Descripción</h3>
            <p className="text-base text-foreground whitespace-pre-wrap">{post.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha</h3>
          <p className="text-base text-foreground">{formatDate(post.created_at)}</p>
        </div>
        
        {post.profiles?.full_name && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
            <p className="text-base text-foreground">{post.profiles.full_name}</p>
          </div>
        )}

        {post.reference_url && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Enlace de referencia</h3>
            <a
              href={post.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-base"
            >
              Ver ejemplo
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostInformation;
