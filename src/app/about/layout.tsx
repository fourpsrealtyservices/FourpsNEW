import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Jhansi Desavath | FourPs Realty",
  description: "Founder story, mission and process behind FourPs Realty Services — Hyderabad's commercial real estate advisory.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
