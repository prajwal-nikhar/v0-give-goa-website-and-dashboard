import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import PageWrapper from './page-wrapper';
import { Navbar } from '@/components/navbar';
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SLRI',
  description: 'A platform to connect students with projects that make a difference.',
  icons: {
    icon: [
      {
        url: '/gim-logo.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-black bg-fixed bg-center bg-cover bg-no-repeat`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Picture 1.png')",
        }}
      >
        <div className="min-h-screen bg-background/90">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PageWrapper>
              <Navbar />
              {children}
            </PageWrapper>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}