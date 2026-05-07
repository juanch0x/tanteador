type Props = {
  title: string;
  subtitle?: string;
};
export const PageTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle && <h4 className="text-lg">{subtitle}</h4>}
    </div>
  );
};
