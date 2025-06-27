
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild className="capitalize">
        <Link to="/auth">Iniciar Sesión</Link>
      </Button>
      <Button asChild>
        <Link to="/auth?signup=true">Registrarse</Link>
      </Button>
    </div>
  );
}
