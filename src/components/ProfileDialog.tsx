
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const ProfileDialog = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user && open) {
      loadProfile();
    }
  }, [user, open]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      } else {
        setProfile(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone || null,
          location: profile.location || null,
          bio: profile.bio || null,
          avatar_url: profile.avatar_url || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus datos se guardaron correctamente"
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Mi Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mi Perfil</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Próximamente: Subir foto de perfil
            </p>
          </div>

          <div>
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ciudad, Provincia"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
