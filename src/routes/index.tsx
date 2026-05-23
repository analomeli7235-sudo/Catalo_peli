import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Film, Play, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineCatálogo — Inicio" },
      { name: "description", content: "Catálogo de películas: regístrate o inicia sesión." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/30">
              <Film className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Bienvenido a <span className="text-primary">CineCatálogo</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Explora un catálogo de películas seleccionado para ti. Regístrate como
            nuevo usuario o inicia sesión para comenzar tu experiencia cinematográfica.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Registrarme
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-5 w-5" />
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
