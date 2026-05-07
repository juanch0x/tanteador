import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useResetAll } from "@/store/store";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const resetAll = useResetAll();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetAll();
    setResetDone(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col px-6 pt-14 pb-10 gap-6">
        <header>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-4 -ml-1"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-sm text-muted-foreground mt-1">Pelota Paleta</p>
        </header>

        <div className="flex flex-col gap-4">
          {/* Dark mode — not yet implemented */}
          <div className="bg-card border border-border rounded-xl px-4 py-4 flex items-center justify-between opacity-40">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Modo oscuro</span>
              <span className="text-xs text-muted-foreground">Próximamente</span>
            </div>
            <div className="w-11 h-6 rounded-full bg-muted border border-border" />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Zona de peligro
          </p>

          {resetDone ? (
            <p className="text-sm text-muted-foreground">
              Todos los datos fueron eliminados correctamente.
            </p>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full h-14 text-base rounded-xl"
                >
                  Resetear datos del tanteador
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente todos los datos del
                    tanteador: el partido en curso y todo el historial de
                    partidos. No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sí, borrar todo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Footer className="mt-auto" />
      </div>
    </PageTransition>
  );
};
