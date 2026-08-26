"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { descargarExportacionRefugio } from "@/services/dashboard";
import type { PeriodoDashboard } from "@/types/dashboard";

// GUI-38/GUI-41 — botón "Descargar Reporte (.csv)" del dashboard de refugio (HU-14.3, alcance
// Refugio). El endpoint todavía no existe en el back (ver nota en services/dashboard.ts) —
// esto arma la estructura del lado del cliente para cuando esté disponible.
export function ExportacionRefugio({ periodo, token }: { periodo: PeriodoDashboard; token: string }) {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function exportar() {
    setError(null);
    setDescargando(true);
    try {
      const blob = await descargarExportacionRefugio(periodo, token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-refugio-${periodo.desde}_a_${periodo.hasta}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar la exportación.");
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={exportar} disabled={descargando} className="flex items-center gap-2">
        <Download className="h-4 w-4" strokeWidth={2} />
        {descargando ? "Generando…" : "Descargar Reporte (.csv)"}
      </Button>
      {/* GUI-41 — error de exportación */}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
