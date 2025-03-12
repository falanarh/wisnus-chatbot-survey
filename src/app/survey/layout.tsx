import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survei Wisatawan Nusantara 2025",
  description: "Survei Digital Wisatawan Nusantara oleh BPS RI"
};

export default function SurveyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}