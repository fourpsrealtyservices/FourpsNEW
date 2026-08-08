import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Corridors — HITEC City, Financial District, Gachibowli, Kokapet | FourPs Realty",
  description: "Explore Hyderabad's top commercial real estate corridors — rents, occupiers, and appreciation potential.",
};

export default function GrowthCorridorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
