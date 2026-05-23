import { Link, useNavigate } from "@tanstack/react-router";
import { Film, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Film className="h-6 w-6 text-primary" />
          CineCatálogo
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/catalog">
                <Button variant="ghost">Catálogo</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}