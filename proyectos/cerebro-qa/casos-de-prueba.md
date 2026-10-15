# Casos documentados

Resultados transcritos del informe de la sesión del 9 de octubre de 2026; no son ejecuciones nuevas ni una suite automatizada.

| ID | Recorrido | Resultado esperado | Resultado observado | Estado |
| --- | --- | --- | --- | --- |
| QA-01 | Instalar, abrir y reinstalar | La aplicación abre y conserva los datos de prueba | Se abrió y conservó los datos | Pasó |
| QA-02 | Crear cuenta con $100.000; registrar gasto de $8.000; editar a $5.000; eliminar | Saldos de $92.000, $95.000 y $100.000 | Coincidieron con lo esperado | Pasó |
| QA-03 | Registrar gasto e ingreso con captura rápida | El saldo final corresponde a los movimientos | Se recuperó el saldo esperado de $100.000 | Pasó en la sesión |
| QA-04 | Crear hábito diario, marcarlo y reiniciar | Conservar el hábito marcado | Conservó “1 de 1 hecho hoy” | Pasó |
| QA-05 | Crear cita válida para el día siguiente y reiniciar | Conservar fecha y hora | Conservó ambos datos | Pasó |
| QA-06 | Crear meta, reiniciar, abrirla y eliminarla | Conservarla y permitir eliminarla | Conservó y eliminó la meta | Pasó |
| QA-07 | Crear nota sin Wi-Fi, cerrar y reabrir sin conexión | Conservar la nota | Permaneció disponible | Pasó |
| QA-08 | Crear respaldo, modificar datos y restaurar | Recuperar el estado anterior | Se recuperó el estado anterior | Pasó |
| QA-09 | Ingresar peso con coma decimal | Guardar 78,5 kg | Mostró 785 kg; con punto decimal guardó el valor correcto | Falló |
| QA-10 | Buscar eliminación de una medición corporal incorrecta | Poder corregir o retirar el registro | No se encontró una acción visible en Resumen ni Registro | Falló en el recorrido observado |
| QA-11 | Ingresar 31/02/2026 por captura rápida | Rechazar la fecha inexistente | Se aceptó y asignó el día actual a las 15:30 | Falló |
| QA-12 | Usar la aplicación completa en Android real | Validar instalación y flujos en dispositivo | No se ejecutó el APK en un teléfono | Pendiente |

## Lectura de resultados

“Pasó” describe la sesión observada y no garantiza todos los datos o escenarios posibles. QA-03 no incluye importes detallados en el informe disponible; debe concretarse antes de convertirlo en un caso repetible de regresión.
