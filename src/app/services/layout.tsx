import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | FourPs Realty",
  description: "Retail leasing, office advisory, co-working, warehousing and investment advisory across Hyderabad.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
