import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Market Updates | FourPs Realty",
  description: "Stay informed about Hyderabad's commercial real estate market — trends, analysis, and expert insights.",
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
