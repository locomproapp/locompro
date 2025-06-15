
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

const formatPrice = (min: number | null, max: number | null) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return `Desde ${format(min)}`;
    if (max) return `Hasta ${format(max)}`;
    return 'Presupuesto abierto';
};

const formatCondition = (condition: string | null) => {
    if (!condition) return 'No especificado';
    const map: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'cualquiera': 'Cualquiera'
    };
    return map[condition] || condition.charAt(0).toUpperCase() + condition.slice(1);
};

const DetailsCard = ({ buyRequest }: { buyRequest: any }) => {
    const isActive = buyRequest.status === 'active';
    
    return (
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? 'ACTIVA' : 'CERRADA'}
                    </Badge>
                    {buyRequest.categories && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {buyRequest.categories.name}
                        </Badge>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {buyRequest.title}
                </h1>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
                        <p className="text-lg text-primary font-bold">{formatPrice(buyRequest.min_price, buyRequest.max_price)}</p>
                    </div>

                    {buyRequest.condition && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Condición del producto</h3>
                            <p className="text-base text-foreground">{formatCondition(buyRequest.condition)}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
                        <p className="text-base text-foreground">{buyRequest.zone}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
                        <p className="text-base text-foreground whitespace-pre-wrap">
                            {buyRequest.description || 'No se especificaron características.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsCard;
