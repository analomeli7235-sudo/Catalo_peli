import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type Movie = {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string;
  synopsis: string;
  image_url: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administración — CineCatálogo" }] }),
  component: AdminPage,
});

const schema = z.object({
  title: z.string().trim().min(1, "Título requerido").max(200),
  year: z.coerce.number().int().min(1888).max(2100),
  director: z.string().trim().min(1, "Director requerido").max(200),
  genre: z.string().trim().min(1, "Género requerido").max(100),
  synopsis: z.string().trim().min(1, "Sinopsis requerida").max(2000),
  image_url: z.string().trim().url("URL de imagen inválida").max(500),
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [form, setForm] = useState({
    title: "",
    year: "",
    director: "",
    genre: "",
    synopsis: "",
    image_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const load = async () => {
    const { data } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
    setMovies((data ?? []) as Movie[]);
  };

  useEffect(() => {
    if (user && isAdmin) load();
  }, [user, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("movies").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Película agregada");
    setForm({ title: "", year: "", director: "", genre: "", synopsis: "", image_url: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta película?")) return;
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Película eliminada");
    load();
  };

  if (loading) return null;

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Acceso restringido</h1>
              <p className="mt-2 text-muted-foreground">
                Esta sección está disponible solo para administradores.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[400px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Agregar película</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="year">Año</Label>
                <Input id="year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="director">Director</Label>
                <Input id="director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="genre">Género</Label>
                <Input id="genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="synopsis">Sinopsis</Label>
                <Textarea id="synopsis" rows={4} value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image_url">URL de imagen</Label>
                <Input id="image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." required />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Guardando..." : "Agregar película"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Películas existentes ({movies.length})</h2>
          <div className="space-y-3">
            {movies.map((m) => (
              <Card key={m.id}>
                <CardContent className="flex items-center gap-4 p-3">
                  <img src={m.image_url} alt={m.title} className="h-20 w-14 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {m.year} · {m.director} · {m.genre}
                    </p>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}