# PetHood — Frontend Mobile

Aplicación móvil del Proyecto Final **PetHood**, construida con Expo SDK 57, TypeScript estricto, Expo Router y NativeWind.

## Arrancar la app

```powershell
npx expo start --clear
```

O con npm:

```powershell
npm start
```

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

## Warnings de Node (EBADENGINE)

Si ves avisos `Unsupported engine`, tu versión de Node no está en la lista oficial de Expo SDK 57. Son **warnings** y no suelen bloquear el arranque. Para evitarlos, usá **Node 22 LTS** o **Node 24+**.
