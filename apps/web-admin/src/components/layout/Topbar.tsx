import { LogOut, PawPrint, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions";

interface TopbarProps {
  rol: string;
}

export function Topbar({ rol }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <span className="flex items-center gap-2 text-sm font-semibold text-pethood-orange">
        <PawPrint className="h-5 w-5" strokeWidth={2} />
        PetHood
      </span>
      <div className="flex items-center gap-3 text-sm text-neutral-700">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pethood-orange/10 text-pethood-orange-dark">
          <UserRound className="h-4 w-4" strokeWidth={2} />
        </span>
        {rol}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>
      </div>
    </header>
  );
}
