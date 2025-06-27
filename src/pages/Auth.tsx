
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const signupParam = searchParams.get('signup');
  const initialIsSignUp = signupParam === 'true';

  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignUp(signupParam === 'true');
  }, [signupParam]);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Desactivar emailRedirectTo y hacer login automático tras registro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Usuario ya registrado",
              description: "Este email ya está registrado. Intenta iniciar sesión.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error al registrarse",
              description: error.message,
              variant: "destructive"
            });
          }
        } else if (data.user && data.session) {
          // Registro exitoso y sesión iniciada automáticamente
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente.",
          });
          navigate('/');
        } else {
          // Si por algún motivo no hay sesión, intentar iniciar sesión explícitamente
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (loginError) {
            toast({
              title: "Error al iniciar sesión",
              description: loginError.message,
              variant: "destructive"
            });
          } else {
            toast({
              title: "¡Bienvenido!",
              description: "Has iniciado sesión correctamente.",
            });
            navigate('/');
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error al iniciar sesión",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      {/* Back Arrow - positioned absolutely in top left */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 hover:bg-white/10"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">LoCompro</h1>
            <h2 className="text-xl font-semibold text-foreground">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? (isSignUp ? 'Registrando...' : 'Iniciando sesión...') 
                : (isSignUp ? 'Registrarse' : 'Iniciar sesión')
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            </p>
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp); 
                if (!isSignUp) {
                  navigate("/auth?signup=true", { replace: true });
                } else {
                  navigate("/auth", { replace: true });
                }
              }}
              className="mt-1"
            >
              {isSignUp ? 'Iniciar sesión' : 'Registrarse'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
