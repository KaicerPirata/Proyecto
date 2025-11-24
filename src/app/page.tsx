
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn === 'true') {
      if (userRole === 'estandar') {
        router.replace('/assets');
      } else {
        // Instead of rendering the dashboard component, redirect to its route
        router.replace('/dashboard');
      }
    } else {
      router.replace('/login');
    }
    // We don't set loading to false here because the redirection will unmount this component.
  }, [router]);

  // Display a loading spinner while the redirection logic is processed.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
