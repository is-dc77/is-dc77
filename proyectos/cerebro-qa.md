# Cerebro · Caso de pruebas de software

**Área:** QA y pruebas funcionales · **Fecha de la evaluación:** 9 de octubre de 2026

## Participación

Trabajo de testeo y documentación de hallazgos sobre una aplicación de terceros. Mi participación presentada aquí corresponde a la evaluación del producto.

## Objetivo

Comprobar los flujos principales, la conservación de datos y el comportamiento ante entradas inválidas; documentar resultados y prioridades de corrección.

## Alcance realizado

- Sesión guiada de pruebas en Windows.
- Instalación y conservación de datos.
- Creación, edición y eliminación de movimientos financieros.
- Persistencia de hábitos, citas y metas.
- Uso sin conexión.
- Respaldo local y restauración.
- Revisión técnica del APK y pruebas de funciones extraídas.

El APK no se ejecutó en un teléfono Android. La sincronización entre equipos, GPS, notificaciones y nube quedaron pendientes.

## Ejemplos documentados

| Caso | Resultado esperado | Observación |
| --- | --- | --- |
| Crear, editar y eliminar un gasto | El saldo refleja cada operación | Los saldos coincidieron con los valores esperados |
| Crear una nota sin conexión y reiniciar | La nota se conserva | La nota permaneció disponible |
| Restaurar un respaldo | Recuperar el estado guardado | Se recuperó el estado anterior |
| Registrar un decimal con coma | Conservar el valor ingresado | Se detectó una conversión incorrecta |
| Ingresar una fecha inexistente | Rechazarla y pedir corrección | Se aceptó y se asignó otra fecha |

## Entregable

Informe con alcance, resultados, clasificación de hallazgos, propuestas de corrección y criterios para repetir las pruebas. Esta ficha resume la evaluación histórica de la versión observada; no describe el estado actual del producto.

## Competencias mostradas

Diseño de recorridos de prueba, comparación de resultados esperados y observados, validación de entradas, revisión de persistencia y comunicación de defectos.

## Límites

La evaluación no constituye una auditoría de seguridad ni una certificación del producto. No se distribuyen instaladores ni código del fabricante.
