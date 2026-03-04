import { ReactNode } from "react";

export default function LaboratorioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container py-12 md:py-24">
        {children}
    </div>
  );
}
