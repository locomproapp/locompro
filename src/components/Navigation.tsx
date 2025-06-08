
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
import { Package, Menu, ShoppingCart, Tag, LogOut, Home, Bell, User } from "lucide-react";
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

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img 
              src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
              alt="LoCompro" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Package className="h-6 w-6 text-primary hidden" />
            <span className="hidden font-bold sm:inline-block">LoCompro</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explorar</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          to="/"
                        >
                          <img 
                            src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
                            alt="LoCompro" 
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <Package className="h-6 w-6 hidden" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            LoCompro
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Conecta compradores y vendedores en tu zona
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/marketplace"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Marketplace</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explora productos disponibles
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/market"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Solicitudes</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ve qué buscan los compradores
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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
          <SheetContent side="left" className="w-80 bg-sidebar border-sidebar-border p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center p-6 border-b border-sidebar-border">
                <img 
                  src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
                  alt="LoCompro" 
                  className="h-8 w-8 object-contain mr-3"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Package className="mr-3 h-6 w-6 text-sidebar-primary hidden" />
                <span className="text-xl font-bold text-sidebar-foreground">LoCompro</span>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col space-y-2">
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
                    icon={<Package className="h-5 w-5" />}
                  >
                    Marketplace
                  </MobileLink>
                  
                  <MobileLink 
                    to="/market" 
                    onOpenChange={setOpen}
                    icon={<ShoppingCart className="h-5 w-5" />}
                  >
                    Solicitudes de Compra
                  </MobileLink>
                  
                  {user && (
                    <>
                      <div className="border-t border-sidebar-border my-4 pt-4">
                        <h4 className="text-sm font-semibold text-sidebar-foreground/70 mb-3 px-3">
                          Mi Cuenta
                        </h4>
                        
                        <MobileLink 
                          to="/my-requests" 
                          onOpenChange={setOpen}
                          icon={<ShoppingCart className="h-5 w-5" />}
                        >
                          Mis Solicitudes
                        </MobileLink>
                        
                        <MobileLink 
                          to="/my-offers" 
                          onOpenChange={setOpen}
                          icon={<Tag className="h-5 w-5" />}
                        >
                          <span className="flex items-center justify-between w-full">
                            <span>Mis Ofertas</span>
                            {notificationCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {notificationCount}
                              </Badge>
                            )}
                          </span>
                        </MobileLink>
                        
                        <div className="flex items-center gap-3 p-3 mt-4 rounded-md bg-sidebar-accent/50">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback>
                              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.user_metadata?.full_name || 'Usuario'}
                            </p>
                            <p className="text-xs text-sidebar-foreground/70 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
              
              {user && (
                <div className="p-4 border-t border-sidebar-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar />
          </div>
          
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
                  <Link to="/my-requests" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mis Solicitudes
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
              <Button variant="ghost" asChild>
                <Link to="/auth">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
