# PetHood — Frontend Mobile

Aplicación móvil del Proyecto Final **PetHood**, construida con Expo SDK 57, TypeScript estricto, Expo Router y NativeWind. Vive dentro del monorepo `pethood-frontend`, en `apps/mobile/` (ver `../../CLAUDE.md` para el panorama completo del monorepo).

## Configuración inicial del equipo

Todos deben configurar el entorno **igual**. No uses Yarn, pnpm ni Bun: en esta app trabajamos solo con **npm** y el `package-lock.json` versionado.

### Stack de entorno acordado

| Herramienta | Versión obligatoria | Notas |
| --- | --- | --- |
| **Node.js** | **22 LTS** (`^22.13.0`) | Fijada en `.nvmrc` y `package.json` → `engines` |
| **npm** | **≥ 10** (viene con Node 22) | Único package manager permitido |
| **Git** | Cualquiera reciente | Clone / pull / push |
| **Editor** | Cursor o VS Code | Instalá las extensiones recomendadas del repo |
| **Expo Go** | Última de la store | Para probar en el celular |

> Expo SDK 57 acepta también algunos Node 24/26, pero **el equipo usa Node 22 LTS** para no mezclar versiones. Node 23 (impar) no está soportado.

### Checklist rápido (primera vez)

```text
1. Instalar Node 22 LTS
2. Clonar el repo (pethood-frontend)
3. cd apps/mobile
4. npm ci
5. npx expo-doctor
6. npx expo start --clear
7. Abrir con Expo Go (o emulador)
```

---

### 1. Instalar Node.js 22 LTS

Descargá la LTS 22 desde [nodejs.org](https://nodejs.org/) **o** usá un version manager.

Con **nvm-windows** / **nvm**:

```powershell
nvm install 22
nvm use 22
```

Con **fnm**:

```powershell
fnm install
fnm use
```

(`fnm` / `nvm` leen el archivo `.nvmrc` de esta carpeta, que fija `22`.)

Verificá:

```powershell
node -v
npm -v
```

Esperado:

- `node -v` → `v22.x.x` (mínimo `v22.13.0`)
- `npm -v` → `10.x.x` o superior

Si tenés otra versión (por ejemplo Node 23), cambiate a 22 antes de instalar dependencias. El archivo `.npmrc` tiene `engine-strict=true`: `npm` fallará si no cumplís `engines`.

### 2. Clonar el repositorio

```powershell
git clone https://github.com/ncorrea-13/Pethood-frontend.git
cd Pethood-frontend/apps/mobile
```

### 3. Instalar dependencias (misma resolución para todos)

Usá **siempre** el lockfile, desde `apps/mobile/`:

```powershell
npm ci
```

`npm ci` instala exactamente lo que dice `package-lock.json`. Así todos quedan con las mismas versiones.

Solo usá `npm install` si agregás o actualizás paquetes a propósito y vas a **commitear** el `package-lock.json` actualizado.

**No hagas esto en el setup inicial:**

- `yarn` / `pnpm` / `bun`
- Borrar `package-lock.json` "para regenerarlo"
- Ignorar avisos de `engines` cambiando de Node

### 4. Verificar que el entorno está OK

```powershell
npx expo-doctor
```

Si marca paquetes desalineados con el SDK:

```powershell
npx expo install --fix
```

Si eso modifica `package-lock.json`, coordiná con el equipo y commiteá el cambio en un PR (no lo dejes solo en tu máquina).

### 5. Extensiones del editor (Cursor / VS Code)

Al abrir el proyecto, aceptá las recomendaciones de `../../.vscode/extensions.json` (incluye **Expo Tools**) y los settings compartidos en `../../.vscode/settings.json`.

### 6. App en el celular — Expo Go

1. Instalá **Expo Go** desde Play Store (Android) o App Store (iOS).
2. Celular y PC en la **misma red Wi‑Fi** (sin VPN).

#### Opcional — emuladores

- **Android:** [Android Studio](https://developer.android.com/studio) + un AVD.
- **iOS:** solo macOS + Xcode.

### 7. Variables de entorno

Hoy **no hay** `.env` obligatorios. Cuando se integre el backend, se documentarán acá (por ejemplo `EXPO_PUBLIC_API_URL`) y se agregará un `.env.example` para que todos usen las mismas keys.

---

## Arrancar la app

Desde `apps/mobile/`:

```powershell
npx expo start --clear
```

Equivalente:

```powershell
npm start
```

En la terminal de Metro:

| Acción | Tecla / cómo |
| --- | --- |
| Celular (Expo Go) | Escaneá el QR |
| Emulador Android | `a` |
| Simulador iOS | `i` (solo macOS) |
| Navegador | `w` |

Si el QR no conecta: `npx expo start --tunnel`.

---

## Reglas para que el equipo no se desaline

1. **Node 22** (leer `.nvmrc`).
2. **Solo npm** + respetar `package-lock.json`.
3. Nuevas deps con `npx expo install <paquete>` (mantiene compatibilidad con SDK 57), no con versiones arbitrarias a mano.
4. Si regenerás lockfile o corrés `expo install --fix`, **commiteá** el resultado para el resto.
5. No subas `node_modules/`, `.expo/` ni `.env*.local` (ya están en `../../.gitignore`).

---

## Stack

- Expo SDK 57 + TypeScript estricto
- Expo Router (`/app`)
- NativeWind v4 + Tailwind CSS
- Colores institucionales: `#FF7A45` (naranja), `#F5EBE0` (beige)

## Estructura

```
app/
  (auth)/
    login.tsx
    register.tsx
components/
  CustomInput.tsx
  CustomButton.tsx
  PetHoodLogo.tsx
```

Ver pantallas GUI-XX y reglas de negocio de esta app en `../../CLAUDE.md`.

## Troubleshooting

### `npm ci` / `npm install` falla por engines

Tu Node no es 22.x compatible. Cambiá a Node 22 (`nvm use 22` / `fnm use`) y reintentá.

### Warnings EBADENGINE

Indican Node fuera del rango de Expo. Con Node 22 LTS no deberían aparecer.

### Dependencias rotas / instalación rara

**No borres** `package-lock.json`. Limpiá solo `node_modules` y reinstalá desde el lock:

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
```

### La app no abre / Metro colgado

```powershell
npx expo start --clear
```

### Celular no conecta al servidor de desarrollo

- Misma Wi‑Fi, sin VPN.
- Firewall de Windows: permití Node/Expo en redes privadas.
- Tunnel: `npx expo start --tunnel`.
