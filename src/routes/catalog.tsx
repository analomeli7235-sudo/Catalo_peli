import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Film } from "lucide-react";

type Movie = {
  id: string;
  title: string;
  year: number;
  image_url: string;
};

export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [{ title: "Catálogo — CineCatálogo" }] }),
  component: CatalogPage,
});

function CatalogPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("movies")
      .select("id,title,year,image_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMovies(data ?? []);
        setFetching(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Catálogo de películas</h1>
          <p className="mt-2 text-muted-foreground">Selecciona una película para ver sus detalles.</p>
        </div>
        {fetching ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <Film className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No hay películas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((m) => (
              <Link key={m.id} to="/movie/$id" params={{ id: m.id }}>
                <Card className="group overflow-hidden border-border bg-card pt-0 transition hover:ring-2 hover:ring-primary">
                  <div className="aspect-[2/3] overflow-hidden bg-muted">
                    <img
                      src={m.image_url}
                      alt={m.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="line-clamp-1 text-sm font-semibold text-foreground">{m.title}</h2>
                    <p className="text-xs text-muted-foreground">{m.year}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}