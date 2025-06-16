
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag, ExternalLink } from 'lucide-react';

const formatPrice = (min: number | null, max: number | null) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return `Desde ${format(min)}`;
    if (max) return `Hasta ${format(max)}`;
    return 'Presupuesto abierto';
};

const formatCondition = (condition: string | null) => {
    console.log('=== FORMATEANDO CONDITION ===');
    console.log('condition recibida:', condition, '(tipo:', typeof condition, ')');
    
    if (!condition || condition === null || condition === 'null') {
        console.log('Condition es nula, devolviendo "No especificado"');
        return 'No especificado';
    }
    
    const map: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'cualquiera': 'Cualquiera'
    };
    
    const result = map[condition] || condition.charAt(0).toUpperCase() + condition.slice(1);
    console.log('Condition formateada:', result);
    return result;
};

const DetailsCard = ({ buyRequest }: { buyRequest: any }) => {
    console.log('=== RENDERIZANDO DETAILS CARD ===');
    console.log('buyRequest completo:', JSON.stringify(buyRequest, null, 2));
    
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

                    {/* CONDICIÓN DEL PRODUCTO - Con debugging explícito */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Condición del producto</h3>
                        {/* Debug info visible en desarrollo */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-red-500 mb-1">
                                DEBUG: condition = "{buyRequest.condition}" (tipo: {typeof buyRequest.condition})
                            </div>
                        )}
                        <p className="text-base text-foreground">{formatCondition(buyRequest.condition)}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
                        <p className="text-base text-foreground">{buyRequest.zone}</p>
                    </div>

                    {/* DESCRIPCIÓN - Con debugging explícito */}
                    {buyRequest.description && buyRequest.description !== null && buyRequest.description !== 'null' && buyRequest.description.trim() !== '' ? (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
                            {/* Debug info visible en desarrollo */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="text-xs text-red-500 mb-1">
                                    DEBUG: description = "{buyRequest.description}" (tipo: {typeof buyRequest.description}, length: {buyRequest.description?.length || 0})
                                </div>
                            )}
                            <p className="text-base text-foreground whitespace-pre-wrap">
                                {buyRequest.description}
                            </p>
                        </div>
                    ) : (
                        process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-red-500">
                                DEBUG: Description no mostrada. Valor: "{buyRequest.description}" (tipo: {typeof buyRequest.description})
                            </div>
                        )
                    )}

                    {/* ENLACE DE REFERENCIA - Con debugging explícito */}
                    {buyRequest.reference_url && buyRequest.reference_url !== null && buyRequest.reference_url !== 'null' && buyRequest.reference_url.trim() !== '' ? (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Enlace de referencia</h3>
                            {/* Debug info visible en desarrollo */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="text-xs text-red-500 mb-1">
                                    DEBUG: reference_url = "{buyRequest.reference_url}" (tipo: {typeof buyRequest.reference_url})
                                </div>
                            )}
                            <a
                                href={buyRequest.reference_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline text-base"
                            >
                                Ver ejemplo
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    ) : (
                        process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-red-500">
                                DEBUG: Reference URL no mostrada. Valor: "{buyRequest.reference_url}" (tipo: {typeof buyRequest.reference_url})
                            </div>
                        )
                    )}

                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha</h3>
                        <p className="text-base text-foreground">
                            {new Date(buyRequest.created_at).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>

                    {buyRequest.profiles?.full_name && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                            <p className="text-base text-foreground">{buyRequest.profiles.full_name}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsCard;
