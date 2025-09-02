
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Profile = () => {
  const {
    user,
    loading: authLoading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user, authLoading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const {
      error
    } = await supabase.auth.updateUser({
      data: {
        full_name: fullName
      }
    });
    setLoading(false);
    if (error) {
      toast.error('Error al actualizar el perfil: ' + error.message);
    } else {
      toast.success('Perfil actualizado con éxito');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user) {
    return <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-8">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>;
  }

  return <div className="flex flex-col min-h-screen bg-muted/40">
      <Navigation />
      <main className="flex-1 w-full max-w-3xl mx-auto pt-8 py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>Actualizá tu información personal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Tu nombre completo" />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Mobile-only logout button - positioned outside the card */}
        <div className="md:hidden mt-6">
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Profile;
