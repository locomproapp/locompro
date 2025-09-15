
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSellerNotifications } from '@/hooks/useSellerNotifications';
import { MobileSidebar } from './Navigation/MobileSidebar';
import { UserMenu } from './Navigation/UserMenu';
import { UserAvatar } from './Navigation/UserAvatar';
import { AuthButtons } from './Navigation/AuthButtons';
import { Logo } from './Navigation/Logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const { notificationCount } = useSellerNotifications();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background safe-top" style={{ height: '64px' }}>
      <div className="container flex h-full items-center px-4" style={{ height: '64px' }}>
        {/* LOGO + Inicio + Mercado button */}
        <Logo />

        {/* Sheet menu para mobile */}
        <MobileSidebar 
          user={user} 
          notificationCount={notificationCount} 
          onSignOut={handleSignOut} 
        />

        {/* Flex container that takes remaining space */}
        <div className="flex-1 flex items-center justify-end">
          {/* Mobile auth section - positioned flush to the right edge */}
          <div className="md:hidden">
            {user ? (
              <UserAvatar user={user} />
            ) : (
              <Button variant="ghost" asChild className="capitalize">
                <Link to="/auth">Ingresar</Link>
              </Button>
            )}
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <UserMenu 
                user={user} 
                notificationCount={notificationCount} 
                onSignOut={handleSignOut} 
              />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
