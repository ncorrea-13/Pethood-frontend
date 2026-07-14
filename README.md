# PetHood — Frontend (monorepo)

Monorepo con las dos apps cliente de PetHood, que consumen la misma API REST del backend (`pethood-backend`, repo hermano):

- **[`apps/mobile/`](apps/mobile/)** — app móvil (Expo SDK 57 + TypeScript + NativeWind). Ya tiene código real (auth, componentes base). Ver su README para el setup detallado.
- **`apps/web-admin/`** — panel de administración de escritorio (Next.js + Tailwind). Todavía no tiene código, es un placeholder.
- **`packages/shared/`** — tipos, cliente API y validaciones comunes a ambas apps. Todavía no tiene código.

## Setup rápido

Cada app es un proyecto npm independiente (no usamos npm workspaces todavía, cada una con su propio `package.json`/lockfile). Para arrancar la mobile:

```powershell
git clone https://github.com/ncorrea-13/Pethood-frontend.git
cd Pethood-frontend/apps/mobile
npm ci
npx expo start --clear
```

Guía completa de entorno (Node 22, npm, Expo Go, troubleshooting) en [`apps/mobile/README.md`](apps/mobile/README.md).

## Documentación

Las convenciones de este repo (pantallas, reglas de negocio de frontend, estructura del monorepo) están en `CLAUDE.md`. Los documentos rectores del proyecto completo (constitución, requisitos, modelo de datos, arquitectura, specs) viven en `../Pethood-backend/docs/`.
