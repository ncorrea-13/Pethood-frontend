import { PantallaPendiente } from "@/components/ui/PantallaPendiente";

export default function DashboardAdminPage() {
  return (
    <PantallaPendiente
      gui="GUI-39 / GUI-40"
      hu="HU-14.1"
      titulo="Dashboard Admin"
      descripcion="Estadísticas globales de la plataforma (usuarios, refugios, publicaciones, campañas). GUI-40 cubre el estado vacío sin datos agregados todavía."
    />
  );
}
