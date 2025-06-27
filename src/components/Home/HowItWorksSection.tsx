
import React, { useRef } from 'react';
import { Search, Package, Handshake, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HowItWorksSectionProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const HowItWorksSection = ({ isOpen, onToggle }: HowItWorksSectionProps) => {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleToggle = (open: boolean) => {
    onToggle(open);
    
    if (open && howItWorksRef.current) {
      // Small delay to allow the content to render
      setTimeout(() => {
        if (howItWorksRef.current) {
          const rect = howItWorksRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const elementHeight = rect.height;
          const scrollTop = window.pageYOffset + rect.top - (viewportHeight - elementHeight) / 2;
          
          window.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }
      }, 200);
    } else if (!open) {
      // Scroll to top when closing
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="block md:hidden mb-16 mt-8 sm:mt-12" style={{ minHeight: 'calc(100vh - 600px)' }}>
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <div className="bg-white rounded-lg shadow-sm border border-border p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">¿Cómo Funciona?</h3>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent ref={howItWorksRef}>
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recibí ofertas</h3>
                  <p className="text-sm text-muted-foreground">La gente que tenga lo que buscás te lo va a ofrecer.</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Publicá el producto que buscás</h3>
                  <p className="text-sm text-muted-foreground">Describí que buscás, con características, tu presupuesto y de dónde sos.</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Handshake className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Elegí la mejor</h3>
                  <p className="text-sm text-muted-foreground">Compará las ofertas y quedate con la que más te sirva.</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HowItWorksSection;
