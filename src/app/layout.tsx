import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import ThemeRegistry from './theme/ThemeRegistry';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

export const metadata: Metadata = {
  title: 'Car Dealer Dashboard',
  description: 'Car Dealer Admin Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <QueryClientProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}