# MOSSIE — Flujo GTD 

## Captura rápida · Inbox · Procesamiento · Planificación · Ejecución · Cierre

**Producto:** MOSSIE — My Own Simple System  
**Estado:** Especificación funcional consolidada  
**Dirigido a:** diseño UX/UI, arquitectura de datos y desarrollo  

---

## 1. Propósito

Construir el circuito operativo que permita sacar cualquier asunto de la mente, enviarlo al lugar correcto, procesar solo lo que requiere decisión, planificarlo con poca fricción y ejecutarlo desde el Centro de Mando.

```text
CAPTURAR → CLASIFICAR AUTOMÁTICAMENTE → PROCESAR → PLANIFICAR → EJECUTAR → CERRAR
```

Después del cierre:

```text
ARCHIVAR → MEDIR → DETECTAR PATRONES → PROPONER MEJORAS
```

Este flujo adapta GTD a una realidad con turnos variables, múltiples responsabilidades y energía cambiante. Debe sentirse sencillo aunque la arquitectura interna sea completa.

---

## 2. Principios obligatorios

1. **Una sola base maestra de tareas.** Las bandejas son vistas filtradas, no bases duplicadas.
2. **Capturar no es procesar.** Capturar debe tomar segundos.
3. **Procesar no es planificar.** Procesar decide qué es y qué ruta seguirá; planificar decide cuándo y cómo se ejecutará.
4. **Fecha límite y fecha de ejecución son diferentes.** La primera representa el último plazo real; la segunda, el día elegido para trabajar.
5. **Eventos, gastos, ideas y tareas son entidades distintas.** Comparten el acceso de captura, pero no el mismo ciclo de vida.
6. **El sistema sugiere y la usuaria decide.** Toda recomendación de la matriz puede modificarse.
7. **Solo se muestran los campos de la etapa actual.** Usar interruptores, chips, botones rápidos, barras y listas desplegables antes que formularios largos.
8. **Completar conserva; eliminar destruye.** Las completadas se archivan para análisis. Las eliminadas desaparecen definitivamente después de una confirmación.
9. **Mobile-first.** Captura, procesamiento rápido y ejecución diaria deben funcionar especialmente bien en el teléfono. Aunque debe ser responsiva. Porque igual usare  la compu todos los días .
10. **Offline desde la arquitectura.** Las capturas deben poder guardarse localmente y sincronizarse al recuperar conexión.

---

## 3. Mapa general

```text
Botón global “+”
├── Tarea
│   ├── Normal → Inbox de tareas
│   └── Exprés → Centro de Mando / Tareas exprés
├── Idea → Inbox de ideas
├── Gasto → Finanzas
└── Evento → Calendario

Inbox de tareas
└── Procesar
    ├── Atender ahora → Por planificar [ventana hoy/mañana]
    ├── Planificar → Por planificar [fecha libre]
    ├── Delegar → Delegadas [por delegar]
    └── Algún día → Algún día

Por planificar
└── Planificar
    ├── Fecha de ejecución → Planificadas
    ├── Delegar → Delegadas
    ├── Posponer sin compromiso → Algún día
    └── Pausar decisión tomada → En espera

Planificadas
├── Fecha = hoy → Centro de Mando / Hoy
├── Fecha = mañana → Centro de Mando / Preparar mañana
├── Requisito pendiente → Bloqueadas
├── Pausa temporal → En espera
├── Completar → Archivo
└── Eliminar → Eliminación definitiva
```

---

## 4. Navegación del módulo Tareas

### 4.1 Pestañas principales

```text
Todas | Inbox | Por planificar | Planificadas | Delegadas |
En espera | Bloqueadas | Algún día | Completadas
```

- Cada tarea pertenece a **una sola bandeja operativa a la vez**.
- `Todas` es una vista general de tareas activas con su estado; no es otra bandeja ni duplica registros.
- Mostrar la cantidad de elementos junto al nombre de cada pestaña cuando aporte valor.
-Por default siempre abre en inbox. Todas puede estar de penúltima ante de completadas. 
- Las ideas se procesan en una bandeja propia dentro de Inbox o mediante una subpestaña `Ideas`.
- Los eventos y los gastos nunca aparecen en las pestañas de tareas.

### 4.2 Orden general

- Inbox: más antigua primero por defecto.
- Permitir invertir el orden con un control de ordenamiento.
- Bandejas con fecha límite: fecha límite más próxima primero.
- Planificadas: agrupadas por fecha de ejecución.
- Completadas: más reciente primero.

---

## 5. Captura rápida global

### 5.1 Acceso y comportamiento

- Botón `+` visible desde las pantallas principales.
- Abre una hoja inferior o modal mobile-first.
- Cuatro chips: `Tarea` · `Idea` · `Gasto` · `Evento`.
- `Tarea` aparece seleccionada por defecto.
- El primer campo recibe foco automáticamente.
- `Guardar` registra el elemento, limpia el formulario y mantiene el modal abierto para continuar el vaciado mental.
- Incluir `Guardar y cerrar` o una X para finalizar.
- Evitar doble guardado por pulsaciones repetidas.
- Si ocurre un error, conservar lo escrito.

### 5.2 Capturar una tarea

**Campo obligatorio:**

- Título.

**Control adicional:**

- Interruptor `Exprés`, apagado por defecto.

Resultado:

- Tarea normal: estado `Inbox`.
- Tarea exprés: estado `Exprés`, visible directamente en su módulo del Centro de Mando.
- Tipo interno predeterminado: `Operativa`.

El título debe poder editarse durante el procesamiento.

### 5.3 Capturar una idea

**Campo obligatorio:**

- Título o idea.

**Recurso opcional:**

- Un enlace, o
- un archivo adjunto, imagen o multimedia.

En captura se permite un recurso principal. Desde la edición posterior se podrán agregar más recursos.

Resultado:

- Va al Inbox de Ideas.
- No crea una tarea automáticamente.
- No contamina el flujo operativo diario.

### 5.4 Capturar un gasto

**Campos obligatorios:**

- Concepto.
- Monto.
- Cuenta de origen.

La cuenta se selecciona desde Finanzas: efectivo, débito, crédito u otra cuenta registrada.

Resultado:

- Crea un movimiento directamente en Finanzas.
- Descuenta o registra la deuda según la cuenta elegida.
- No pasa por Inbox.
- Categoría, pilar, nota o comprobante se editan después desde el movimiento financiero.

No permitir guardar si falta monto o cuenta, porque no se puede generar un movimiento válido.

### 5.5 Capturar un evento

**Campos obligatorios:**

- Título.
- Fecha.

**Campos opcionales:**

- Hora.
- Lugar.

Resultado:

- Va directamente al Calendario.
- No pasa por Inbox.
- Sin hora se considera evento de día completo o con hora por confirmar.
- Desde la edición se podrán agregar enlace, archivos, checklist de preparación, personas del CRM y recurrencia.
- En una fase posterior podrá sincronizarse con Google Calendar.

No permitir guardar como evento si falta la fecha.

---

## 6. Tareas exprés

### 6.1 Definición

Acciones que surgen dentro del contexto actual y deben resolverse sin esperar procesamiento ni planificación.

Ejemplo:

> Informar al gestor de camas que la habitación 234 está fuera de servicio.

### 6.2 Datos y acciones

Solo requieren:

- Título.
- Fecha y hora de captura automáticas.
- Estado pendiente/completada.

Acciones:

- Completar mediante checkbox.
- Editar.
- Eliminar.
- Convertir en tarea normal del Inbox si deja de ser inmediata.

No pedir pilar, prioridad, energía, duración, fecha límite ni proyecto.

### 6.3 Ubicación

- Módulo propio en el Centro de Mando.
- Botón para añadir una tarea exprés desde ese módulo.
- También puede crearse desde el interruptor `Exprés` de Captura rápida.

---

## 7. Inbox de tareas

### 7.1 Contenido

Solo contiene tareas capturadas que todavía no han sido procesadas.

Una tarea procesada debe salir inmediatamente del Inbox, aunque todavía no esté planificada.

### 7.2 Tarjeta compacta

Cada fila o tarjeta horizontal muestra:

- Checkbox para completar directamente.
- Título.
- Fecha/hora de captura.
- CTA `Procesar`.
- Editar.
- Eliminar.

Abrir la tarjeta muestra el detalle disponible sin obligar a procesarla.

### 7.3 Formas de procesamiento

**Modo individual**

- Abrir cualquier tarea y procesarla.

**Modo secuencial**

- Botón `Procesar todas`.
- Abre el formulario de la primera tarea según el orden activo.
- Flechas `Anterior` y `Siguiente`.
- Contador `Quedan N por procesar`.

`Procesar todas` no significa aplicar la misma decisión a todas. Significa recorrerlas una por una sin cerrar el formulario.

### 7.4 Autoguardado del borrador

- Cada cambio del formulario se guarda como borrador.
- Cambiar con las flechas, cerrar el modal o salir accidentalmente no elimina lo rellenado.
- La tarea sigue en Inbox hasta pulsar `Procesar` y completar la transición.
- Al regresar, el formulario recupera el borrador.

### 7.5 Recordatorio

- A las 10:00 p. m., si existen tareas pendientes en Inbox, enviar un recordatorio suave.
- No avisar si el Inbox está vacío.
- El procesamiento puede realizarse a cualquier hora; las 10:00 p. m. son un apoyo, no una obligación. 

---

## 8. Procesamiento de tareas

### 8.1 Objetivo

Responder rápidamente:

- ¿Qué clase de tarea es?
- ¿A qué pertenece?
- ¿Qué tan urgente e importante es?
- ¿Es única o recurrente?
- ¿Necesita varios pasos?
- ¿Tiene un plazo real?
- ¿Cuál será su siguiente bandeja?

No se decide todavía la fecha de ejecución, duración, energía, contexto ni frecuencia exacta.

### 8.2 Campos

1. **Título**, editable.
2. **Tipo de tarea:** Operativa o Estratégica.
3. **Relación:** Pilar o Proyecto, según el tipo.
4. **Urgente:** interruptor sí/no.
5. **Importante:** interruptor sí/no.
6. **Estructura:** simple o con varios pasos.
7. **Repetición:** única o recurrente.
8. **Fecha límite:** opcional.
9. **Ruta sugerida**, editable antes de confirmar.

### 8.3 Tipo y relación

- `Operativa` aparece por defecto.
- Una operativa se relaciona con un pilar.
- Una estratégica se relaciona con un proyecto y hereda de este su pilar, meta y demás jerarquía.
- Si la tarea estratégica nace desde un proyecto, esas relaciones se completan automáticamente.

### 8.4 Matriz de Eisenhower

| Urgente | Importante | Sugerencia |
|---|---|---|
| Sí | Sí | Atender ahora |
| No | Sí | Planificar |
| Sí | No | Delegar |
| No | No | Algún día |

Interacción:

- Dos interruptores visibles: `Urgente` e `Importante`.
- La recomendación cambia inmediatamente.
- Mostrar una explicación breve.
- Permitir elegir otra ruta.
- Si la usuaria no cambia la sugerencia, confirmar utiliza la ruta propuesta.
- Eliminar no es una ruta de Eisenhower; se realiza con la papelera.

### 8.5 Tarea con varios pasos

Al activar `Varios pasos`:

- Habilitar checklist interno.
- Permitir añadir pasos ahora o después.
- Las subtareas heredan las propiedades de la tarea madre.
- No tienen fecha, energía, contexto ni estado GTD propio.
- Son reordenables y muestran avance, por ejemplo `2 de 5`.
- Completar todas las subtareas no completa automáticamente la tarea madre; puede sugerirlo.

Si los pasos necesitan fechas propias, dependencias independientes o entregables, el sistema puede sugerir promover el trabajo a proyecto. No crear proyectos huérfanos solo para agrupar una lista.

### 8.6 Tarea recurrente

En procesamiento solo se identifica:

```text
Única | Recurrente
```

La regla y la frecuencia se configuran en Planificación.

### 8.7 Resultado

El botón final `Procesar` mueve la tarea a una de estas rutas:

- Atender ahora.
- Planificar.
- Delegar.
- Algún día.

Después de confirmar:

- Registrar fecha/hora de procesamiento.
- Registrar ruta elegida.
- Actualizar historial.
- Retirar del Inbox.

---

## 9. Ruta Atender ahora

### 9.1 Significado

La tarea necesita planificarse de inmediato para hoy o mañana. No significa obligatoriamente ejecutarla en ese segundo.

### 9.2 Resultado

- Sale del Inbox.
- Entra en `Por planificar`.
- Conserva `ruta = Atender ahora`.
- Se identifica visualmente como planificación urgente.
- La fecha de ejecución disponible se limita a hoy o mañana.

La usuaria puede abrir inmediatamente la planificación o continuar procesando el Inbox y planificar después.

---

## 10. Ruta Planificar

### 10.1 Significado

Existe compromiso de hacer la tarea, pero falta elegir su fecha de ejecución.

### 10.2 Resultado

- Sale del Inbox.
- Entra en `Por planificar`.
- Conserva `ruta = Planificar`.
- Puede recibir cualquier fecha válida durante la planificación.

### 10.3 Diferencia frente a Algún día

- `Por planificar`: ya decidí hacerla; solo falta decidir cuándo.
- `Algún día`: podría hacerla, pero no existe un compromiso cercano.

No usar la ausencia de fecha como criterio automático para Algún día.

---

## 11. Bandeja Por planificar

### 11.1 Contenido

Reúne tareas procesadas con ruta `Atender ahora` o `Planificar` que todavía no tienen fecha de ejecución.

### 11.2 Orden

1. Atender ahora.
2. Fecha límite más cercana.
3. Prioridad, si ya existe.
4. Antigüedad.

### 11.3 Acciones

- Planificar.
- Editar procesamiento.
- Delegar.
- Enviar a Algún día.
- Poner en espera.
- Completar.
- Eliminar.

---

## 12. Planificación

### 12.1 Objetivo

Determinar cuándo y bajo qué condiciones se ejecutará una tarea ya procesada.

### 12.2 Campos

1. **Fecha de ejecución**, obligatoria para terminar la planificación.
2. **Hora**, opcional.
3. **Duración estimada**.
4. **Energía necesaria**.
5. **Impacto energético**.
6. **Contexto**, selección múltiple.
7. **Prioridad**.
8. **Checklist**, si tiene varios pasos. Esto mucha veces se llena en procesar.
9. **Regla de recurrencia**, si es recurrente.

No asignar tareas a bloques de time blocking. Los bloques son una guía visual independiente.

### 12.3 Duración y regla de tres minutos

Botones rápidos:

```text
≤3 min | 15 min | 30 min | 1 h | Personalizada
```

La regla de tres minutos aparece **solo en planificación**.

Al seleccionar `≤3 min`, mostrar:

- `Hacer ahora`: completa y archiva la tarea.
- `Planificar de todas formas`: continúa con la fecha de ejecución.

En captura no se muestra esta regla. Si la usuaria decide hacer algo sin registrarlo, simplemente no crea la tarea.

### 12.4 Energía

**Energía requerida**

- Baja.
- Media.
- Alta.

**Efecto energético**

- Me da energía.
- Neutral.
- Me quita energía.

Son dos propiedades distintas. Más adelante permitirán ordenar la ejecución y detectar patrones.

### 12.5 Contexto

Selector múltiple inicial:

- Casa.
- Trabajo.
- Iglesia.
- Fuera de casa.
- Computadora.
- Teléfono/móvil.
- Tablet.
- Con otra persona.
- Cualquier lugar.

Permitir combinaciones como `Trabajo + computadora`.

### 12.6 Prioridad

- Alta.
- Media.
- Baja.

Puede modificarse después desde Planificadas o el Centro de Mando.

La prioridad no sustituye urgencia, importancia ni fecha límite; ayuda a ordenar tareas que ya compiten dentro del mismo día.

### 12.7 Finalizar planificación

Al guardar:

- Estado = `Planificada`.
- Registrar fecha y hora de planificación.
- Aparece en Planificadas.
- Aparece en el Calendario, al menos en su vista Lista de tareas.
- Si la fecha es hoy, aparece en `Centro de Mando > Hoy`.
- Si la fecha es mañana, aparece en `Preparar mañana`.

---

## 13. Recurrencia

### 13.1 Configuración

Si la tarea fue marcada como recurrente, Planificación solicita:

1. Tipo de frecuencia.
2. Intervalo o regla.
3. Fecha de inicio.
4. Fecha de fin o número de repeticiones, opcional.
5. Modo de cálculo de la próxima ocurrencia.

Frecuencias:

- Diaria.
- Días laborables.
- Fines de semana.
- Días específicos de la semana.
- Cada X días/semanas/meses.
- Día específico del mes.
- Primer, segundo, tercer, cuarto o último día de semana del mes.
- Anual.
- Personalizada.

### 13.2 Modos de cálculo

#### A. Calendario fijo

La próxima ocurrencia depende del calendario, aunque la anterior se complete tarde.

Ejemplo:

> Pagar Netflix cada día 25.

La próxima fecha sigue siendo el 25 del mes siguiente.

#### B. Desde la finalización

La próxima fecha se calcula desde el momento en que se completa la ocurrencia actual.

Ejemplo:

> Limpiar el mueble cada 7 días.

Si se completa el 7 de abril, la siguiente corresponde al 14 de abril.

### 13.3 Regla técnica

- La regla recurrente funciona como plantilla.
- Cada ocurrencia es una tarea independiente vinculada a esa regla.
- Completar una ocurrencia no completa las futuras.
- Evitar generar infinitas instancias por adelantado.
- Evitar duplicados.
- En modo `Desde la finalización`, no generar la siguiente hasta completar la actual.
- En modo `Calendario fijo`, generar según la regla, sin depender de la fecha real de completado.

---

## 14. Delegadas

### 14.1 Entrada

Una tarea con ruta `Delegar` entra en esta bandeja aunque todavía no tenga responsable.

Estado inicial de delegación:

```text
Por delegar
```

### 14.2 Estados internos

- Por delegar.
- Delegada.
- Confirmada.
- En seguimiento.
- Completada.
- Devuelta/Requiere intervención.

### 14.3 Planificación de la delegación

Campos:

- Responsable, procedente del CRM.
- Fecha y hora de notificación o entrega de instrucciones.
- Instrucciones clave.
- Fecha límite de entrega o respuesta.
- Fecha de seguimiento.
- Checklist opcional.
- Notas o evidencia esperada, opcionales.

Reglas:

- Puede permanecer `Por delegar` sin responsable.
- Para marcarla `Delegada`, el responsable es obligatorio.
- La fecha de notificación indica cuándo se contactará al responsable.
- La fecha límite indica cuándo se espera el resultado; no es la misma que la fecha de seguimiento.

### 14.4 Tarea de seguimiento vinculada

Al establecer una fecha de seguimiento:

- Crear o actualizar una tarea operativa vinculada a la delegación.
- Título sugerido: `Dar seguimiento a: [tarea delegada]`.
- Fecha de ejecución = fecha de seguimiento.
- Estado = Planificada.
- Aparece en Planificadas y en el Centro de Mando cuando corresponda.
- Completar el seguimiento no completa automáticamente la tarea delegada.
- Cambiar la fecha de seguimiento actualiza la tarea vinculada, no crea duplicados.

### 14.5 Cambios de ruta

Si la usuaria decide ejecutar personalmente una tarea delegada:

- Quitar el flujo activo de delegación.
- Cancelar o cerrar la tarea de seguimiento vinculada.
- Enviar la tarea principal a Por planificar o planificarla directamente.

---

## 15. Algún día

### 15.1 Definición

Tareas procesadas que podrían realizarse en el futuro, pero sin compromiso cercano ni fecha de ejecución.

### 15.2 Orden

1. Con fecha límite, ordenadas por la más próxima.
2. Sin fecha límite, por antigüedad.

Una tarea con fecha límite cercana debe mostrar una advertencia y sugerir moverla a Por planificar o eliminar si ya no es necesario. 

### 15.3 Recordatorio

- Cada dos días, si la bandeja contiene tareas, recordar revisarla.
- No notificar si está vacía.
- El recordatorio abre la bandeja, no mueve tareas automáticamente.

### 15.4 Acciones

- Enviar a Por planificar.
- Planificar directamente.
- Delegar.
- Editar.
- Completar.
- Eliminar.

---

## 16. Planificadas

### 16.1 Contenido

Tareas que poseen fecha de ejecución.

Se visualizan:

- Agrupadas por fecha.
- En el Calendario, como vista temporal.
- En el Centro de Mando solo cuando correspondan a hoy, mañana o estén vencidas.

### 16.2 Acciones

- Completar.
- Editar.
- Reprogramar.
- Cambiar prioridad.
- Abrir checklist.
- Delegar.
- Poner en espera.
- Bloquear.
- Eliminar.

### 16.3 Reprogramación

Al cambiar una fecha:

- Conservar la fecha anterior en el historial.
- Incrementar el contador de reprogramaciones.
- Advertir si la nueva fecha supera la fecha límite.

---

## 17. Bloqueadas

### 17.1 Definición

Tareas que no pueden completarse porque falta un requisito verificable.

Ejemplos:

- Esperar una autorización.
- Recibir un documento.
- Completar otra tarea.
- Disponer de un recurso o dinero.

### 17.2 Propiedades

- Requisito de desbloqueo.
- Tipo de requisito.
- Tarea bloqueadora, si aplica.
- Responsable o fuente, si aplica.
- Fecha de revisión opcional.

### 17.3 Reglas

- Mientras esté bloqueada, deshabilitar `Completar` y explicar el motivo.
- Permitir `Requisito cumplido / Desbloquear`.
- En el MVP el desbloqueo puede ser manual.
- En una fase posterior, una tarea vinculada completada podrá desbloquearla automáticamente.
- Al desbloquear, enviar a Por planificar o abrir Planificación.

---

## 18. En espera

### 18.1 Definición

Tarea ya decidida o planificada que no se ejecutará en la fecha prevista porque otras acciones deben realizarse primero. No está impedida por un requisito externo; está pausada intencionalmente.

### 18.2 Diferencia frente a otras bandejas

- `Bloqueada`: no puedo hacerla.
- `En espera`: podría hacerla, pero decidí pausarla.
- `Por planificar`: quiero hacerla pronto y falta elegir fecha.
- `Algún día`: no existe compromiso cercano.

### 18.3 Al mover a En espera

- Guardar la fecha de ejecución anterior en el historial.
- Limpiar la fecha de ejecución activa para que no aparezca vencida en Hoy.
- Solicitar una fecha de revisión.
- Permitir un motivo opcional.

### 18.4 Acciones

- Reprogramar y volver a Planificadas.
- Enviar a Por planificar.
- Enviar a Algún día.
- Delegar.
- Completar.
- Eliminar.

La fecha de revisión no es una fecha de ejecución; solo indica cuándo volver a decidir.

---

## 19. Completar, archivar y eliminar

### 19.1 Completar

Al completar una tarea:

- Estado = Completada.
- Registrar fecha y hora reales.
- Retirar de las bandejas activas.
- Conservar en Completadas/Archivo.
- Mantener pilar, proyecto, checklist, fechas, delegación e historial.
- Alimentar progreso y análisis.
- Si es recurrente, aplicar la regla correspondiente para la próxima ocurrencia.

Una tarea completada puede reabrirse y enviarse a Por planificar. Esta acción debe quedar en el historial.

### 19.2 Eliminar

- Solicitar confirmación explícita.
- Una vez confirmada, eliminar definitivamente.
- No aparece en Archivo ni en métricas.
- No ofrece recuperación desde la interfaz.

---

## 20. Centro de Mando: elementos que recibe este flujo

El diseño completo del Centro de Mando pertenece a su documento propio. Esta especificación solo determina qué información GTD debe alimentar esa pantalla.

### 20.1 Encabezado mínimo

- Día y fecha completa.
- Hora real actualizada.
- Título de la pantalla.
- Frase motivacional.

### 20.2 Componentes GTD

#### Captura rápida

- Botón `+` global.

#### Indicador de Inbox

- Cantidad de tareas pendientes de procesamiento.
- Acceso directo a Procesar Inbox.
- Estado visual neutro cuando esté vacío y destacado cuando tenga elementos.

#### Tareas exprés

- Checklist inmediato.
- Añadir, editar, completar y eliminar.

#### Hoy

- Tareas planificadas con fecha de ejecución igual a hoy.
- Tareas de seguimiento de delegación correspondientes a hoy.
- Tareas recurrentes generadas para hoy.

#### Vencidas

- Tareas planificadas o con fecha límite superada que todavía requieren una decisión.
- Acciones rápidas: hacer hoy, reprogramar, delegar, enviar a Algún día o eliminar o marcar como completada en caso de que la haya realizado y se haya olvidado registrarlo.

#### Preparar mañana

- Tareas con fecha de ejecución mañana.
- Fechas límite de mañana.
- Eventos de mañana.
- Acceso al detalle y checklist.

#### Eventos

- Los eventos del día pueden mostrarse en un módulo separado.
- No mezclar eventos dentro de la lista de tareas.

### 20.3 Orden inicial de Hoy

Mientras no exista aprendizaje inteligente, usar reglas deterministas:

1. Hora fija.
2. Vencidas.
3. Fecha límite hoy.
4. Fecha límite mañana.
5. Urgencia e importancia.
6. Prioridad.
7. Contexto compatible.
8. Energía compatible.
9. Duración.
10. Orden manual.

La energía ajusta el orden, pero no oculta una fecha límite crítica, puedo reordenar las tareas si lo veo necesario con el método drag and drop.

---

## 21. Calendario

- Es una vista temporal, no una base de datos independiente.
- Contiene eventos y tareas planificadas, visualmente diferenciados.
- Los eventos se editan desde el Calendario.
- Las tareas se pueden abrir, completar o reprogramar desde la vista Lista de tareas.
- La semana comienza en domingo. Y el dia se reinicia a las 12 am.
- La integración bidireccional con Google Calendar es futura.
- No incluir el time blocking dentro del alcance de este flujo; se especifica con el planificador semanal y el documento del Centro de Mando.

---

## 22. Procesamiento de ideas

Las ideas tienen un flujo separado porque todavía no representan una acción ejecutable.

### 22.1 Bandeja

Mostrar:

- Título.
- Vista previa del enlace o adjunto.
- Fecha de captura.
- Procesar.
- Editar.
- Eliminar.

### 22.2 Destinos

Una idea podrá convertirse en:

- Tarea.
- Recurso/Referencia.
- Investigación o estudio.
- Decisión.
- Sueño.
- Meta.
- Proyecto, respetando la jerarquía estratégica.
- Archivo.

Para el MVP se puede comenzar con Tarea, Recurso, Archivo y Eliminar, dejando preparada la extensión.

Al convertir:

- Crear la entidad de destino.
- Conservar relación con la idea de origen.
- Marcar la idea como Procesada.
- No duplicar el mismo resultado si se pulsa dos veces.

---

## 23. Arquitectura de datos

### 23.1 Entidad maestra `tasks`

| Grupo | Propiedades |
|---|---|
| Identidad | `id`, `user_id`, `title`, `created_at`, `updated_at` |
| Origen | `source`, `is_express`, `recurrence_rule_id` |
| Clasificación | `task_type`, `pillar_id`, `project_id` |
| Procesamiento | `processed_at`, `processing_route`, `is_urgent`, `is_important`, `has_multiple_steps`, `is_recurring`, `deadline_at` |
| Planificación | `execution_date`, `scheduled_time`, `estimated_duration_minutes`, `energy_required`, `energy_effect`, `priority`, `planned_at` |
| Estado | `status`, `completed_at`, `reschedule_count` |
| Espera | `review_at`, `waiting_reason` |
| Bloqueo | `block_requirement`, `block_type`, `blocking_task_id`, `block_review_at` |
| Auditoría | `deleted_at` solo si la implementación requiere una transición técnica antes del borrado físico |

Los contextos deben modelarse en una relación muchos-a-muchos para permitir combinaciones y filtros independientes.

### 23.2 Estados generales

```text
inbox
express
to_plan
planned
delegated
waiting
blocked
someday
completed
```

La eliminación definitiva no necesita un estado visible.

### 23.3 Ruta de procesamiento

```text
attend_now
plan
delegate
someday
```

El estado indica dónde está la tarea. La ruta conserva la decisión que la llevó allí.

### 23.4 Entidades auxiliares

#### `task_contexts`

- `task_id`.
- `context_id`.

#### `checklist_items`

- `id`.
- `task_id`.
- `title`.
- `position`.
- `is_completed`.
- `completed_at`.

#### `task_delegations`

- `id`.
- `task_id`.
- `assignee_crm_id`.
- `delegation_status`.
- `notify_at`.
- `instructions`.
- `delivery_deadline`.
- `follow_up_at`.
- `follow_up_task_id`.
- `expected_evidence`.
- `notes`.

#### `recurrence_rules`

- `id`.
- `task_template_id`.
- `frequency_type`.
- `interval_value`.
- `days_of_week`.
- `day_of_month`.
- `ordinal_week`.
- `weekday`.
- `starts_at`.
- `ends_at`.
- `max_occurrences`.
- `calculation_mode`: `fixed_calendar` o `after_completion`.
- `next_occurrence_at`.
- `is_active`.

#### `task_history`

- `id`.
- `task_id`.
- `event_type`.
- `previous_value`.
- `new_value`.
- `metadata`.
- `created_at`.

Eventos mínimos:

```text
created · edited · processed · planned · rescheduled · delegated
blocked · unblocked · paused · resumed · completed · reopened
```

#### `ideas`

- Identidad y contenido.
- Recurso principal.
- Estado.
- Tipo e ID de entidad en la que se convirtió.
- Fechas de creación, procesamiento y archivo.

Eventos, movimientos financieros y archivos adjuntos deben usar sus entidades propias.

---

## 24. Matriz de transiciones

| Desde | Acción | Hacia |
|---|---|---|
| Captura de tarea normal | Guardar | Inbox |
| Captura de tarea exprés | Guardar | Exprés / Centro de Mando |
| Inbox | Procesar: Atender ahora | Por planificar urgente |
| Inbox | Procesar: Planificar | Por planificar |
| Inbox | Procesar: Delegar | Delegadas / Por delegar |
| Inbox | Procesar: Algún día | Algún día |
| Por planificar | Asignar fecha | Planificadas |
| Planificadas | Llegar el día | Centro de Mando / Hoy |
| Cualquier activa | Delegar | Delegadas |
| Cualquier ejecutable | Falta requisito | Bloqueadas |
| Bloqueadas | Cumplir requisito | Por planificar o Planificación |
| Planificada | Pausar voluntariamente | En espera |
| En espera | Reprogramar | Planificadas |
| En espera | Reactivar sin fecha | Por planificar |
| Cualquier activa | Completar | Completadas / Archivo |
| Completadas | Reabrir | Por planificar |
| Cualquier registro | Eliminar y confirmar | Eliminación definitiva |

Toda transición, excepto el borrado final, debe registrarse en el historial.

---

## 25. Validaciones esenciales

### Captura

- Tarea e idea: título obligatorio.
- Gasto: concepto, monto mayor que cero y cuenta obligatorios.
- Evento: título y fecha obligatorios.
- Mantener el modal abierto después de `Guardar`.
- Conservar datos si el guardado falla.

### Procesamiento

- Ruta obligatoria.
- Operativa: pilar obligatorio.
- Estratégica: proyecto obligatorio, excepto durante una migración justificada.
- Fecha límite anterior a hoy: advertir.
- Borrador guardado automáticamente.

### Planificación

- Fecha de ejecución obligatoria para pasar a Planificada.
- Atender ahora solo admite hoy o mañana.
- Si la ejecución supera la fecha límite, advertir y pedir confirmación.
- Reprogramar incrementa el contador y registra fecha anterior.
- Tarea recurrente requiere regla y modo de cálculo.

### Delegación

- `Por delegar` puede no tener responsable.
- `Delegada` requiere responsable.
- Actualizar seguimiento no debe duplicar su tarea vinculada.

### Bloqueadas

- Requisito de desbloqueo obligatorio.
- No permitir completar hasta desbloquear.

### En espera

- Solicitar fecha de revisión.
- No conservar una fecha de ejecución activa que la convierta falsamente en vencida.

### Eliminación

- Requiere confirmación explícita.
- No debe alimentar métricas ni Archivo.

---

## 26. Interacciones y componentes UI

Priorizar:

- Chips para seleccionar tipos y rutas.
- Interruptores para Urgente, Importante, Exprés, Varios pasos y Recurrente.
- Botones rápidos para duración.
- Barras o escalas sencillas para energía cuando se diseñe la interacción final.
- Selectores visuales para pilar, contexto y prioridad.
- Checklist reordenable para subtareas.
- Flechas para procesar anterior/siguiente.
- Menú de acciones secundarias para no saturar tarjetas.
- Arrastrar y soltar cuando aporte claridad en escritorio, siempre con alternativa táctil accesible.

Cada bandeja debe incluir:

- Estado vacío útil.
- Carga.
- Error con reintento.
- Conteo de elementos.
- Filtros colapsables cuando existan varios.

---

## 27. Métricas y aprendizaje futuro

No implementar todavía un motor complejo de IA. Sí conservar desde ahora los datos necesarios para estudiar:

- Tiempo entre captura, procesamiento, planificación y finalización.
- Reprogramaciones.
- Diferencia entre duración estimada y real.
- Cumplimiento según día, hora, contexto y energía.
- Tareas que dan o quitan energía.
- Tareas exprés por contexto.
- Delegaciones sin asignar o con seguimiento atrasado.
- Tareas bloqueadas o en espera durante demasiado tiempo.
- Recurrencias incumplidas.
- Tareas estratégicas desplazadas por operativas.
- Pilares atendidos o descuidados.

La futura ruta será:

```text
Datos → Patrón → Fuga → Recomendación → Prueba → Evaluación → Ajuste
```

Las recomendaciones futuras nunca cambiarán el sistema sin autorización.

---

## 28. Alcance por fases

### Fase 1 — Fundamento

- Base maestra de tareas.
- Estados, rutas e historial.
- Ideas, checklist, recurrencia y delegación.
- Navegación de pestañas.

### Fase 2 — Captura e Inbox

- Botón global +.
- Cuatro tipos de captura.
- Captura consecutiva.
- Offline.
- Inbox de tareas e ideas.
- Tareas exprés.

### Fase 3 — Procesamiento

- Modo individual y secuencial.
- Autoguardado del borrador.
- Matriz de Eisenhower.
- Rutas y transiciones.
- Recordatorio de las 10:00 p. m.

### Fase 4 — Bandejas

- Por planificar.
- Planificadas.
- Delegadas.
- En espera.
- Bloqueadas.
- Algún día.
- Completadas.

### Fase 5 — Planificación

- Fecha, hora, duración, energía, contexto y prioridad.
- Regla de tres minutos.
- Recurrencia fija y desde finalización.
- Seguimiento de delegación.

### Fase 6 — Integración con Centro de Mando

- Encabezado mínimo.
- Indicador de Inbox.
- Tareas exprés.
- Hoy.
- Vencidas.
- Preparar mañana.
- Eventos.

### Fase 7 — Cierre

- Completar y archivar.
- Reabrir.
- Eliminar definitivamente.
- Historial y métricas básicas.

Validar cada fase antes de ampliar el alcance.

---

## 29. Criterios de aceptación principales

1. Se pueden capturar varias tareas consecutivas sin cerrar el modal.
2. Cada tipo de captura llega a su entidad correcta.
3. Un gasto incompleto y un evento sin fecha no pueden guardarse.
4. Las tareas exprés evitan Inbox y aparecen en el Centro de Mando.
5. Inbox solo contiene tareas sin procesar.
6. El orden predeterminado del Inbox es antiguo a reciente y puede invertirse.
7. `Procesar todas` recorre individualmente con anterior/siguiente.
8. Salir del procesamiento conserva el borrador.
9. Eisenhower sugiere una ruta y permite cambiarla.
10. Procesamiento no solicita campos de planificación.
11. Atender ahora entra en Por planificar con ventana hoy/mañana.
12. Planificar entra en Por planificar sin fecha automática.
13. Delegar entra en Delegadas aunque no tenga responsable.
14. Algún día se revisa mediante recordatorio cada dos días.
15. Planificación incluye duración, regla de tres minutos, energía, contexto y prioridad.
16. La recurrencia soporta calendario fijo y cálculo desde finalización.
17. El seguimiento de delegación crea o actualiza una única tarea vinculada.
18. Planificadas de hoy aparecen en el Centro de Mando.
19. Bloqueadas no pueden completarse hasta cumplir el requisito.
20. En espera no aparece como vencida y conserva su fecha anterior en historial.
21. Completar archiva y alimenta métricas.
22. Eliminar retira definitivamente y no alimenta métricas.
23. Ninguna tarea se duplica al cambiar de bandeja.

---

## 30. Instrucciones para implementación

1. Inspeccionar el esquema y los componentes existentes antes de modificar.
2. Reutilizar la base maestra de tareas; no crear tablas por pestaña.
3. Implementar cambios pequeños y verificables.
4. Mantener la lógica de transición fuera de los componentes visuales.
5. Proteger las operaciones contra duplicados y dobles clics.
6. Añadir pruebas para filtros, recurrencias y transiciones.
7. No implementar IA, Google Calendar ni analítica avanzada en el MVP.
8. No incorporar el diseño completo del Centro de Mando ni el planificador semanal dentro de este documento.
9. Ante un conflicto, conservar el comportamiento funcional aquí definido y documentar cualquier adaptación técnica.

---

## 31. Resumen operativo

```text
Capturo sin fricción.
El sistema envía cada elemento a su lugar.
Proceso tareas e ideas en bandejas separadas.
Las tareas salen del Inbox hacia una decisión clara.
Planifico con fecha, duración, energía, contexto y prioridad.
Ejecuto desde el Centro de Mando.
Completo y archivo para aprender.
Elimino solo cuando realmente quiero que desaparezca.´´


