import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Akses Akun - Survei Digital Wisatawan Nusantara',
  description: 'Login atau register untuk mengakses Survei Digital Wisatawan Nusantara oleh BPS RI',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}