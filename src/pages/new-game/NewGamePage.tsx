import { PageTitle } from "@/components/shared/PageTitle";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useInitializeMatch } from "@/store/store";
import { useNavigate } from "react-router";

const validationSchema = z.object({
  teamA: z.string(),
  teamB: z.string(),
});

type FormType = z.infer<typeof validationSchema>;

const defaultValues: FormType = {
  teamA: "",
  teamB: "",
};

export const NewGamePage = () => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
  });
  const initializeMatch = useInitializeMatch();
  const navigate = useNavigate();

  const onSubmit = (values: FormType) => {
    initializeMatch({
      teamNames: {
        A: values.teamA.length > 0 ? values.teamA : "Equipo A",
        B: values.teamB.length > 0 ? values.teamB : "Equipo B",
      },
    });
    navigate("/game");
  };

  return (
    <div className="flex flex-col h-screen px-6 pt-16 pb-10">
      <PageTitle
        title="Nuevo partido"
        subtitle="Opcional — los nombres ayudan a que el historial sea más útil."
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 pt-10 gap-6"
      >
        <FieldSet>
          <FieldGroup>
            <Controller
              name="teamA"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="team_a">Equipo A</FieldLabel>
                  <Input
                    {...field}
                    id="team_a"
                    aria-invalid={fieldState.invalid}
                    placeholder="Juan Martinez - Mariano Ramirez"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="teamB"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="team_b">Equipo B</FieldLabel>
                  <Input
                    {...field}
                    id="team_b"
                    aria-invalid={fieldState.invalid}
                    placeholder="Jorge Perez - Javier Gomez"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <div className="flex-1" />

        <Button type="submit" size="lg" className="w-full h-14 text-base rounded-xl">
          Empezar partido
        </Button>
      </form>
    </div>
  );
};
