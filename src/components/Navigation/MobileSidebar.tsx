
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, Home, History, User, LogOut, ChevronDown, ChevronRight, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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

interface MobileSidebarProps {
  user: any;
  notificationCount: number;
  onSignOut: () => Promise<void>;
}

export function MobileSidebar({ user, notificationCount, onSignOut }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const [historialOpen, setHistorialOpen] = React.useState(false);

  const handleSignOut = async () => {
    await onSignOut();
    setOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      return "/profile";
    } else {
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
  );
}
