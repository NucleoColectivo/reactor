import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16.5 4V14" />
      <path d="M16.5 14L12.5 9" />
      <path d="M12.5 9V20" />
      <path d="M8.5 4V14" />
      <path d="M4.5 9H12.5" />
    </svg>
  );
}
