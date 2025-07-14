import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/other/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Survei Digital Wisatawan Nusantara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/bps_mini_icon2.png" />
      </head>
      <body
        className={`${mulish.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}