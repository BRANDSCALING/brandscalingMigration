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

  // Check for admin session first
  const adminId = localStorage.getItem('adminId');
  if (adminId) {
    headers['x-admin-id'] = 'admin-dev-12345';
  }
  // Check for student session
  else {
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    if (studentId && studentEmail) {
      headers['x-student-id'] = studentId;
      headers['x-student-email'] = studentEmail;
    }
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

    // Check for admin session first
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      headers['x-admin-id'] = 'admin-dev-12345';
    } else {
      // Check for student session
      const studentId = localStorage.getItem('studentId');
      const studentEmail = localStorage.getItem('studentEmail');
      if (studentId && studentEmail) {
        headers['x-student-id'] = studentId;
        headers['x-student-email'] = studentEmail;
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
