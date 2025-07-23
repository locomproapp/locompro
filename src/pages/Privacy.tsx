import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Política de Privacidad
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información cuando utilizás LoCompro.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información que recopilamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Podemos recopilar los siguientes tipos de datos:
                </p>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información de la cuenta</h4>
                  <p className="text-muted-foreground">
                    Cuando creás una cuenta, recopilamos información como tu nombre, dirección de correo electrónico y otros datos de contacto que nos brindás voluntariamente.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información de uso</h4>
                  <p className="text-muted-foreground">
                    Registramos tu actividad dentro de la plataforma, incluyendo publicaciones creadas, ofertas enviadas y búsquedas realizadas.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Información técnica</h4>
                  <p className="text-muted-foreground">
                    Recopilamos datos técnicos como dirección IP, tipo de navegador, sistema operativo y cookies, para mejorar la seguridad y experiencia de uso.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cómo usamos tu información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Utilizamos los datos que recopilamos para:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Operar y mantener nuestros servicios de compraventa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Facilitar la comunicación entre compradores y vendedores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Mejorar y personalizar tu experiencia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Enviarte notificaciones relevantes sobre tu cuenta o actividad</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Detectar y prevenir fraudes o actividades indebidas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compartir información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  No vendemos, alquilamos ni intercambiamos tu información personal con terceros. Solo compartimos información en los siguientes casos:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Con otros usuarios cuando publicás ofertas o solicitudes (visible públicamente)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Con proveedores de servicios que nos asisten en el funcionamiento de la plataforma</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Cuando sea requerido por ley o para proteger nuestros derechos legales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tus derechos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Tenés derecho a:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Acceder a la información que tenemos sobre vos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Modificar o actualizar tus datos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Solicitar la eliminación de tu cuenta y la información asociada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Elegir no recibir ciertos tipos de comunicaciones</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguridad de los datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aplicamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, alteraciones o eliminaciones. Esto incluye cifrado, controles de acceso y auditorías periódicas.
                </p>
                <p className="text-muted-foreground mt-6 font-medium">
                  Última actualización: julio de 2025
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