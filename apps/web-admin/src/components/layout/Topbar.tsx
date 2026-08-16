interface TopbarProps {
  email: string;
}

export function Topbar({ email }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <span className="text-sm font-semibold text-pethood-orange">PetHood</span>
      <span className="text-sm text-neutral-500">{email}</span>
    </header>
  );
}
