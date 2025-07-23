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
                  Tu cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Nombre, email y datos de contacto que nos brindás voluntariamente al registrarte.
                </p>
              </CardContent>
            </Card>

            {/* Información de uso */}
            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-secondary" />
                  Tu actividad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Publicaciones, ofertas y búsquedas que realizás en la plataforma.
                </p>
              </CardContent>
            </Card>

            {/* Información técnica */}
            <Card className="border-l-4 border-l-accent md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-accent-foreground" />
                  Datos técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  IP, navegador y cookies para mejorar tu experiencia y seguridad.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cómo usamos tu info */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
                ¿Para qué usamos tu información?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Operar nuestros servicios</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Conectar compradores y vendedores</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Mejorar tu experiencia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Prevenir fraudes</span>
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
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Compartir información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    ✅ No vendemos tus datos
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Jamás vendemos, alquilamos o intercambiamos tu información personal.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Solo compartimos cuando:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Publicás algo (visible públicamente)</li>
                    <li>• Usamos servicios técnicos</li>
                    <li>• La ley lo requiere</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Tus derechos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Tus derechos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Ver tu información</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Modificar tus datos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Eliminar tu cuenta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">Controlar notificaciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seguridad - destacada */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Shield className="h-6 w-6" />
                🔒 Seguridad de los datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Protegemos tu información con cifrado, controles de acceso y auditorías periódicas para mantener tus datos seguros.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">
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