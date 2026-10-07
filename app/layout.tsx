import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: new URL("https://haseebullah-rassoli.github.io/VitaPath/"),
  title: {
    default: "VitaPath — Your next chapter starts here",
    template: "%s | VitaPath",
  },
  description:
    "Build professional resumes, European and Gulf CVs, scholarship applications, and letters. Guided editing, live previews, private account storage, and PDF printing.",
  icons: { icon: "/VitaPath/favicon.svg" },
  openGraph: {
    title: "VitaPath — Build your path. Present your best.",
    description: "Thoughtful documents for a world of possibilities.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
