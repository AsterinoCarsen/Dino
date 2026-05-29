import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Analytics />
      <div className="md:hidden h-16" /> {/* Bottom spacer for mobile */}
    </QueryClientProvider>
  );
}