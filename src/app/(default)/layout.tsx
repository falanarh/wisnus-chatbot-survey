import { Header } from "@/components/Header";
import { Merriweather_Sans } from "next/font/google";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header fontClass={merriweatherSans.className} />
      {children}
    </>
  );
}