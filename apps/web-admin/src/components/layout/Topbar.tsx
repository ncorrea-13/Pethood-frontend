import { PawPrint, UserRound } from "lucide-react";

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
      <div className="flex items-center gap-2 text-sm text-neutral-700">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pethood-orange/10 text-pethood-orange-dark">
          <UserRound className="h-4 w-4" strokeWidth={2} />
        </span>
        {rol}
      </div>
    </header>
  );
}
