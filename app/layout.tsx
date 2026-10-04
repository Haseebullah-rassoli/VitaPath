import "./globals.css";

export const metadata = {
  title: "VitaPath",
  description: "Privacy-first CV and application document builder",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
