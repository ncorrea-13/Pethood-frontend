import { Redirect } from 'expo-router';

/** Pestaña central de la barra: el botón FAB navega al alta de mascota. */
export default function AccionTab() {
  return <Redirect href="/mascotas/crear" />;
}
