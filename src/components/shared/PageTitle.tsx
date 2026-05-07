type Props = {
  title: string;
  subtitle?: string;
};
export const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
};
