import { Button } from "@/components/ui/Button";

// GUI-02 equivalente para web-admin — un único login para Admin y Refugio;
// el backend devuelve los roles del usuario y "/" reenvía al dashboard correspondiente.
// Falta integrar con POST /api/v1/auth/login (spec 001) — por ahora es solo estructura.
export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <form className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-neutral-900">Ingresar</h1>
        <p className="mb-6 text-sm text-neutral-500">Panel de administradores y refugios de PetHood.</p>

        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          disabled
        />

        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mb-6 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          disabled
        />

        <Button type="submit" className="w-full" disabled>
          Ingresar
        </Button>
      </form>
    </div>
  );
}
