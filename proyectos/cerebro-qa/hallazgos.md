# Ejemplos de hallazgos

Observaciones históricas de la versión Windows 2026.10.09.1044. Los pasos describen lo documentado en la sesión; no se ha comprobado su presencia en versiones actuales.

## C-01 · Conversión incorrecta de un decimal

**Severidad en el informe:** crítica.

**Recorrido observado:** ingresar una medición de peso de `78,5` y guardar. Comparar con el ingreso de `78.5`.

- Esperado: conservar 78,5 kg en ambos formatos admitidos o indicar claramente el formato requerido.
- Observado: con coma se mostró 785 kg; con punto se guardó 78,5 kg.
- Impacto: afecta el registro, el historial y el gráfico.
- Propuesta: normalizar el formato regional y validar el valor antes de guardar.
- Criterio de repetición propuesto: comprobar coma, punto, valores enteros y rechazo de entradas inválidas sin cambiar silenciosamente el número.

## A-02 · Sin acción visible para eliminar mediciones

**Severidad en el informe:** alta.

**Recorrido observado:** buscar cómo abrir y eliminar los registros desde Resumen y Registro.

- Esperado: poder corregir o eliminar un dato incorrecto.
- Observado: no se encontró una acción disponible en ese recorrido.
- Impacto: el valor erróneo permanece en las tendencias.
- Propuesta: añadir edición y eliminación visibles, con confirmación.
- Criterio de repetición propuesto: retirar una medición de prueba y comprobar que desaparezca del historial y del gráfico tras reiniciar.

## A-04 · Aceptación de una fecha inexistente

**Severidad en el informe:** alta.

**Recorrido observado:** introducir `31/02/2026` mediante la captura rápida `Ctrl+K` y guardar el evento.

- Esperado: rechazar la fecha y solicitar corrección.
- Observado: se guardó un evento en el día actual a las 15:30.
- Impacto: la actividad termina asociada a una fecha distinta de la introducida.
- Propuesta: validar el día contra el mes y el año antes de persistirlo.
- Criterio de repetición propuesto: rechazar fechas imposibles, comprobar años bisiestos y conservar correctamente las fechas válidas.

## Seguimiento

El informe original también documentó otros hallazgos de estabilidad y experiencia de uso. Este portafolio selecciona tres ejemplos para mostrar cómo se comunica un defecto, su impacto y la forma de verificar una corrección. No se incluye material confidencial del fabricante ni evidencia de una corrección posterior.
