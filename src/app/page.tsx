'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Usamos un pequeño delay para asegurar que la hidratación esté completa
    const timeout = setTimeout(() => {
      const loggedIn = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole');

      if (loggedIn === 'true') {
        if (userRole === 'estandar') {
          router.replace('/assets');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              {isClient ? "Verificando sesión..." : "Iniciando sistema..."}
            </p>
        </div>
    </div>
  );
}
