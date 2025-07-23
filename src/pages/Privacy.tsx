import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Users, Lock, Eye, Settings, CheckCircle } from 'lucide-react';
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
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Política de Privacidad
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información cuando utilizás LoCompro.
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Información de cuenta */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Información de cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Nombre, dirección de correo electrónico y datos de contacto que proporciona voluntariamente al registrarse.
                </p>
              </CardContent>
            </Card>

            {/* Información de uso */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  Información de uso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Actividad registrada en la plataforma, incluyendo publicaciones creadas, ofertas enviadas y búsquedas realizadas.
                </p>
              </CardContent>
            </Card>

            {/* Información técnica */}
            <Card className="border-l-4 border-l-primary md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-primary" />
                  Información técnica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dirección IP, tipo de navegador, sistema operativo y cookies para garantizar la seguridad y mejorar la experiencia de usuario.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cómo usamos tu info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
                Uso de la información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Operar y mantener nuestros servicios</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Facilitar la comunicación entre usuarios</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Mejorar y personalizar la experiencia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Detectar y prevenir actividades fraudulentas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dos columnas para el resto */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Compartir info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Compartir información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  La información personal se comparte únicamente en los siguientes casos:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Información pública del perfil al realizar publicaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Proveedores de servicios técnicos necesarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cumplimiento de obligaciones legales</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tus derechos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Derechos del usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Acceder a su información personal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Rectificar o actualizar datos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Solicitar eliminación de cuenta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Gestionar preferencias de comunicación</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seguridad - destacada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Seguridad de los datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Se implementan medidas de seguridad técnicas y organizativas para proteger la información personal contra accesos no autorizados, alteraciones o eliminaciones. Esto incluye cifrado de datos, controles de acceso y auditorías periódicas de seguridad.
              </p>
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                Última actualización: julio de 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;