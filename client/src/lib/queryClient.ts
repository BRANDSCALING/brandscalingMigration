import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};

  // Check for development admin credentials first
  const devAdminId = localStorage.getItem('devAdminId');
  if (devAdminId === 'admin-dev-12345') {
    headers['x-dev-admin-id'] = devAdminId;
  }
  // Add Firebase auth token if user is logged in
  else if (auth.currentUser) {
    try {
      // Force refresh to get a fresh token
      const token = await auth.currentUser.getIdToken(true);
      if (token && token !== 'undefined') {
        headers.Authorization = `Bearer ${token}`;
      } else {
        // Fallback to development mode
        headers['x-dev-admin-id'] = 'admin-dev-12345';
        localStorage.setItem('devAdminId', 'admin-dev-12345');
      }
    } catch (error) {
      console.warn('Failed to get auth token, using development mode:', error);
      // Fallback to development mode
      headers['x-dev-admin-id'] = 'admin-dev-12345';
      localStorage.setItem('devAdminId', 'admin-dev-12345');
    }
  } else {
    // No auth user, use development mode
    headers['x-dev-admin-id'] = 'admin-dev-12345';
    localStorage.setItem('devAdminId', 'admin-dev-12345');
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Parse JSON response
  try {
    return await res.json();
  } catch (error) {
    // If response is not JSON, return empty object
    return {};
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};

    // Add Firebase auth token if user is logged in
    if (auth.currentUser) {
      try {
        // Force refresh to get a fresh token
        const token = await auth.currentUser.getIdToken(true);
        headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
