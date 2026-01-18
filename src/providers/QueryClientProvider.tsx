'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute - data is fresh for 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
        retry: 1, // Only retry failed requests once
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch on component mount if data is fresh
        refetchOnReconnect: false, // Don't refetch when reconnecting
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return makeQueryClient();
  } else {
    // Browser: create a QueryClient once and reuse
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryClientProviderProps {
  children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  // have a suspense boundary between this and the code that may
  // suspend because React will throw away the client on the initial
  // render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </TanStackQueryClientProvider>
  );
}
