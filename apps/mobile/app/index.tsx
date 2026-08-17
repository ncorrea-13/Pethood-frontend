import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { obtenerToken } from '@/lib/session';

export default function Index() {
  const [destino, setDestino] = useState<'/home' | '/login' | null>(null);

  useEffect(() => {
    void obtenerToken().then((token) => {
      setDestino(token ? '/home' : '/login');
    });
  }, []);

  if (!destino) return null;
  return <Redirect href={destino} />;
}
