
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        {/* LOGO + Inicio + Mercado button */}
        <Logo />

        {/* Sheet menu para mobile */}
        <MobileSidebar 
          user={user} 
          notificationCount={notificationCount} 
          onSignOut={handleSignOut} 
        />

        {/* Espaciador */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile auth section - positioned at the very right edge */}
          <div className="flex items-center space-x-2 md:hidden ml-auto">
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
