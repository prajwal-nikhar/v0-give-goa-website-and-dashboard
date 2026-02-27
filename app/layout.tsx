
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }> ) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageWrapper>
            <Navbar />
            {children}
            <Footer />
          </PageWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
