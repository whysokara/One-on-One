import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One-on-One",
  description: "A lightweight performance memory board for managers and reportees.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
