interface Props {
  className?: string;
}

export const Footer = ({ className = "" }: Props) => (
  <footer className={`text-xs text-muted-foreground/50 text-center pt-4 ${className}`}>
    © {new Date().getFullYear()} Juan Portugal
  </footer>
);
