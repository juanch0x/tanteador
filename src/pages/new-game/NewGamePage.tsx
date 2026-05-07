import { PageTitle } from "@/components/shared/PageTitle";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
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
    <div className="px-2">
      <PageTitle
        title="Nuevo juego!"
        subtitle="Si es posible, añada los nombres de los jugadores con el fin de que los datos históricos posteriores sean mas útiles"
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col pt-5 gap-5"
      >
        <FieldSet>
          <FieldGroup>
            <Controller
              name="teamA"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="team_a">Equipo B</FieldLabel>
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
        <Button type="submit">Empezar!</Button>
      </form>
    </div>
  );
};
