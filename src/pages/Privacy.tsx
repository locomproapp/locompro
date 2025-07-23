import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Política de Privacidad
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Aquí te explicamos cómo recopilamos, usamos y protegemos tu información.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información que Recopilamos</CardTitle>
                <CardDescription>
                  Tipos de datos que podemos recopilar cuando usas LoCompro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información de la Cuenta</h4>
                  <p className="text-muted-foreground">
                    Cuando creas una cuenta, recopilamos información como tu nombre, dirección de correo electrónico y datos de contacto que nos proporcionas voluntariamente.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información de Uso</h4>
                  <p className="text-muted-foreground">
                    Recopilamos información sobre cómo interactúas con nuestra plataforma, incluyendo las publicaciones que creas, las ofertas que realizas y las búsquedas que haces.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información Técnica</h4>
                  <p className="text-muted-foreground">
                    Podemos recopilar información técnica como tu dirección IP, tipo de navegador, sistema operativo y datos de cookies para mejorar tu experiencia.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cómo Usamos tu Información</CardTitle>
                <CardDescription>
                  Las formas en que utilizamos los datos que recopilamos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Proporcionar y mantener nuestros servicios de marketplace</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Facilitar la comunicación entre compradores y vendedores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Mejorar y personalizar tu experiencia en la plataforma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Enviarte notificaciones importantes sobre tu cuenta y actividad</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Prevenir fraudes y mantener la seguridad de la plataforma</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compartir Información</CardTitle>
                <CardDescription>
                  Cuándo y con quién podemos compartir tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  No vendemos, alquilamos ni intercambiamos tu información personal con terceros. Solo compartimos información en las siguientes circunstancias:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Con otros usuarios cuando publicas ofertas o solicitudes (información pública del perfil)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Con proveedores de servicios que nos ayudan a operar la plataforma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Cuando sea requerido por ley o para proteger nuestros derechos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tus Derechos</CardTitle>
                <CardDescription>
                  Control sobre tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tienes derecho a:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Acceder a la información que tenemos sobre ti</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Corregir o actualizar tu información</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Eliminar tu cuenta y datos asociados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Optar por no recibir ciertos tipos de comunicaciones</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguridad de los Datos</CardTitle>
                <CardDescription>
                  Cómo protegemos tu información
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye encriptación de datos, acceso restringido y auditorías regulares de seguridad.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
                <CardDescription>
                  ¿Tienes preguntas sobre esta política?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tu información personal, puedes contactarnos a través de nuestros canales oficiales. Nos comprometemos a responder a tus consultas de manera oportuna.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Última actualización:</strong> Enero 2025
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;