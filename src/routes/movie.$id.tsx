import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Calendar, Film, User } from "lucide-react";

type Movie = {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string;
  synopsis: string;
  image_url: string;
};

export const Route = createFileRoute("/movie/$id")({
  head: () => ({ meta: [{ title: "Película — CineCatálogo" }] }),
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setMovie(data as Movie | null);
        setFetching(false);
      });
  }, [id, user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </Link>
        {fetching ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : !movie ? (
          <p className="text-muted-foreground">Película no encontrada.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <img
              src={movie.image_url}
              alt={movie.title}
              className="w-full rounded-lg border border-border object-cover shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-foreground">{movie.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {movie.year}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="h-4 w-4" /> {movie.director}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-accent-foreground">
                  <Film className="h-4 w-4" /> {movie.genre}
                </span>
              </div>
              <h2 className="mt-8 text-xl font-semibold text-foreground">Sinopsis</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{movie.synopsis}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}