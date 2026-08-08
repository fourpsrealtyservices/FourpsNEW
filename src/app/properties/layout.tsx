import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Commercial Properties | FourPs Realty",
  description: "Search verified retail, office, co-working and warehouse listings across Hyderabad's top business corridors.",
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
