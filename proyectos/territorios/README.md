# Territorios · Demostración de aplicación web

Calendario, consulta por grupo y mapas para organizar salidas. **Versión de portafolio de Isidora TI Studio, con datos ficticios.**

## Qué resuelve

Permite consultar qué actividades hay en una fecha, filtrar por grupo y abrir el territorio correspondiente en un mapa. La interfaz está pensada para uso desde el teléfono y permite ampliar la letra.

## Esta versión

Se adaptaron los componentes de la aplicación original a una demo independiente con React, TypeScript y Vite. El calendario genera ejemplos para cinco días desde la fecha actual. Los responsables, puntos de encuentro y polígonos de territorios son ficticios. El mapa base contiene datos geográficos públicos de OpenStreetMap.

La demo es de consulta: no incluye el servidor, la base de datos compartida ni la autenticación de la aplicación original. No publica sus datos de coordinación.

## Funciones

- Calendario mensual y selección de fecha.
- Filtro por grupo con preferencia guardada en el navegador.
- Consulta de hora, sector y punto de encuentro de ejemplo.
- Mapa vectorial con acercamiento y selección de territorio.
- Ajuste del tamaño de letra.
- Preparación de recursos para uso sin conexión mediante un service worker.
- Opción de ubicación del navegador, únicamente si la persona la solicita y autoriza. No se envía a un servidor de esta demo.

## Ejecutar

Requisitos: Node.js 22.13 o posterior y npm.

```bash
npm install
npm run dev
```

Para generar y servir la versión compilada:

```bash
npm run build
npm run preview
```

Abre la dirección local que muestre Vite. Usa la versión compilada para probar el modo sin conexión: el service worker se genera durante el build. Necesita HTTPS o localhost y una primera carga con conexión. El caché depende del navegador y puede eliminarse.

## Estructura

| Archivo | Función |
| --- | --- |
| `src/App.tsx` | Calendario, grupos y tarjetas de salidas |
| `src/demo-data.ts` | Generación de registros ficticios |
| `src/offline-map.tsx` | Mapa vectorial e interacción |
| `src/territory-shapes.json` | Polígonos ficticios |
| `public/roads-data.json` | Mapa base de OpenStreetMap |
| `scripts/build-sw.mjs` | Generación del caché de recursos compilados |

## Validación

El build ejecuta la comprobación de tipos y compila los recursos. Las pruebas visuales en navegador, GPS y recuperación sin conexión deben verificarse en el dispositivo de destino; no se certifican por el hecho de compilar.

## Créditos

Aplicación y adaptación para portafolio: **Isidora TI Studio**. Mapa base: © OpenStreetMap contributors, ODbL 1.0. La atribución se conserva en los datos y en la interfaz. Los límites ficticios no representan territorios reales.
