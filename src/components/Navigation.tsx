
import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, ShoppingCart, Tag, LogOut, Home, Bell, User, History, ChevronDown, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { useSellerNotifications } from '@/hooks/useSellerNotifications';
import ChatListDialog from './ChatListDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MobileLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode;
}

function MobileLink({
  to,
  children,
  onOpenChange,
  icon,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 text-base font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-3 transition-colors"
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default function Navigation() {
  const { user, signOut } = useAuth();
  const { notificationCount } = useSellerNotifications();
  const [open, setOpen] = React.useState(false);
  const [historialOpen, setHistorialOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      // User is logged in, go to profile
      return "/profile";
    } else {
      // User is not logged in, go to login page
      return "/auth";
    }
  };

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        {/* LOGO + Inicio + Mercado button */}
        <div className="mr-4 hidden md:flex items-center" style={{gap: 0, height: '2.5rem'}}>
          <Link to="/" className="flex items-center" style={{height: '2.5rem'}}>
            <img 
              src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
              alt="LoCompro" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span
              className="font-medium text-xl tracking-tight"
              style={{
                fontFamily: 'inherit',
                color: 'inherit',
                letterSpacing: 0,
                fontWeight: 500,
                lineHeight: '2.5rem',
                display: 'inline-block',
                marginLeft: '0.5rem',
                verticalAlign: 'baseline',
                paddingTop: 0,
              }}
            >
              LoCompro
            </span>
          </Link>
          {/* New: Inicio link */}
          <Button
            asChild
            variant="ghost"
            className="ml-4 capitalize"
          >
            <Link to="/">Inicio</Link>
          </Button>
          {/* Mercado button remains as before, now to the right of Inicio */}
          <Button
            asChild
            variant="ghost"
            className="ml-2 capitalize"
          >
            <Link to="/marketplace">Mercado</Link>
          </Button>
        </div>

        {/* Sheet menu para mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-80 bg-sidebar border-sidebar-border p-0 flex flex-col fixed inset-y-0 left-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          >
            {/* Header with logo and close button */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
                  alt="LoCompro" 
                  className="h-6 w-6 object-contain mr-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <ShoppingBag className="mr-2 h-5 w-5 text-sidebar-primary hidden" />
                <span className="text-lg font-bold text-sidebar-foreground">LoCompro</span>
              </div>
            </div>
            
            {/* Scrollable content area */}
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col space-y-1">
                {/* Main navigation items */}
                <MobileLink 
                  to="/" 
                  onOpenChange={setOpen}
                  icon={<Home className="h-5 w-5" />}
                >
                  Inicio
                </MobileLink>
                
                <MobileLink 
                  to="/marketplace" 
                  onOpenChange={setOpen}
                  icon={<ShoppingBag className="h-5 w-5" />}
                >
                  Mercado
                </MobileLink>
                
                {/* Historial collapsible section - only show if user is logged in */}
                {user && (
                  <Collapsible open={historialOpen} onOpenChange={setHistorialOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full gap-3 text-base font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-3 transition-colors">
                      <div className="flex items-center gap-3">
                        <History className="h-5 w-5" />
                        <span>Historial</span>
                      </div>
                      {historialOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      <div className="ml-8 space-y-1 border-l border-sidebar-border pl-4">
                        <MobileLink 
                          to="/my-requests" 
                          onOpenChange={setOpen}
                          icon={<ShoppingCart className="h-4 w-4" />}
                        >
                          Mis publicaciones
                        </MobileLink>
                        
                        <Link
                          to="/my-offers"
                          className="flex items-center gap-3 text-base font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-3 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <Tag className="h-4 w-4" />
                          <span className="flex-1">Mis Ofertas</span>
                          {notificationCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {notificationCount}
                            </Badge>
                          )}
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {/* Mi Perfil - always visible */}
                <MobileLink 
                  to={handleProfileClick()} 
                  onOpenChange={setOpen}
                  icon={<User className="h-5 w-5" />}
                >
                  Mi perfil
                </MobileLink>
              </div>
            </ScrollArea>
            
            {/* Fixed bottom section for logout */}
            {user && (
              <div className="border-t border-sidebar-border p-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 p-3"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar sesión
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Espaciador */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile profile avatar - positioned at far right */}
          <div className="flex items-center space-x-2 md:hidden ml-auto">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full p-0">
              <Link to={handleProfileClick()}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                  <AvatarFallback className="text-sm">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="Avatar" />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {notificationCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                      >
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-requests" className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Mis publicaciones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-offers" className="w-full flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Mis Ofertas
                      {notificationCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {notificationCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="capitalize">
                  <Link to="/auth">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?signup=true">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
