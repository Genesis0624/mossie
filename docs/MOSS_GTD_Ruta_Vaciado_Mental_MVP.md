# MOSS — Especificación funcional y de datos

## Ruta GTD adaptada: captura, Inbox, procesamiento, planificación, ejecución y aprendizaje

**Producto:** MOSS — My Own Simple System  
**Documento dirigido a:** Claude, como agente de desarrollo  
**Versión:** 1.0  
**Estado:** Requisitos funcionales aprobados para comenzar implementación  
**Prioridad actual:** Construir la ruta de vaciado mental y un Centro de Mando mínimo viable

---

## 1. Propósito de este documento

Este documento concentra en una sola especificación todas las decisiones funcionales y de arquitectura de datos necesarias para implementar en MOSS una adaptación personal del método Getting Things Done (GTD).

Claude debe usar este documento como fuente principal para construir:

1. La captura rápida global.
2. Las tareas exprés.
3. El Inbox de tareas y el Inbox de ideas o asuntos.
4. El procesamiento de tareas mediante una matriz de Eisenhower adaptada.
5. Las bandejas posteriores al procesamiento.
6. La planificación de tareas.
7. La parte mínima de ejecución que corresponde al Centro de Mando.
8. El cierre, archivo e historial necesarios para analizar patrones en fases posteriores.

No se debe intentar construir todavía el Centro de Mando definitivo, la inteligencia artificial avanzada ni todos los módulos de vida. La prioridad es dejar completa y sólida la ruta operativa desde la captura hasta la ejecución básica.

---

## 2. Visión del sistema

MOSS existe para reducir la carga mental de una persona con múltiples roles, horarios y turnos variables. Debe responder constantemente dos preguntas:

1. **¿Dónde coloco lo que acaba de surgir en mi cabeza?**
2. **¿Qué me corresponde hacer ahora?**

El flujo general es:

```text
Capturar → Procesar → Planificar → Ejecutar → Cerrar → Archivar → Aprender → Mejorar
```

El sistema toma principios de GTD, pero no debe replicarlo de forma literal. La experiencia debe estar adaptada a la realidad de la usuaria:

- Dos trabajos y turnos variables.
- Responsabilidades familiares, espirituales, profesionales y personales.
- Cambios de energía durante el día.
- Necesidad de capturar con muy poca fricción.
- Riesgo de acumular, sobreplanificar y dejar tareas sin concluir.
- Necesidad de proteger tareas estratégicas frente a los asuntos operativos.

---

## 3. Principios obligatorios de producto

### 3.1 Una sola fuente de verdad

Debe existir una única base o entidad maestra de tareas. Inbox, Por planificar, Delegadas, En espera, Algún día, Hoy y Archivo son vistas filtradas de los mismos registros; no deben ser tablas independientes que dupliquen una tarea.

### 3.2 Capturar no es procesar

La captura debe pedir la mínima información posible. El usuario no debe tomar decisiones complejas mientras intenta vaciar su mente.

### 3.3 Procesar no es planificar

En el procesamiento se decide qué es la tarea y cuál será su ruta. En la planificación se decide cuándo, dónde y bajo qué condiciones se hará.

### 3.4 Fecha límite no es fecha de ejecución

- **Fecha límite:** último momento real para completar una tarea.
- **Fecha de ejecución:** día elegido para trabajarla.

Estas propiedades nunca deben fusionarse.

### 3.5 El Centro de Mando es para ejecutar

No debe convertirse en una vista de toda la vida ni de toda la base de datos. Solo muestra lo que necesita atención hoy, más los componentes mínimos definidos en este documento.

### 3.6 El sistema recomienda; la usuaria decide

La matriz, los filtros y los futuros algoritmos pueden sugerir rutas y orden, pero la usuaria siempre puede modificar la decisión.

### 3.7 Reducir fricción

No mostrar campos que no correspondan a la etapa actual. Usar valores predeterminados y datos automáticos siempre que sea posible.

### 3.8 No borrar conocimiento operativo

Completar una tarea la archiva; no la elimina. El historial se conservará para detectar patrones, fugas de tiempo y oportunidades de mejora.

---

## 4. Terminología de interfaz

- **Módulo:** cuadrante o sección permanente dentro de una pantalla.
- **Modal:** ventana temporal que aparece encima de la pantalla.
- **Tarjeta:** representación visual de una tarea o registro.
- **Inbox:** bandeja que contiene elementos sin procesar.
- **Ruta de procesamiento:** destino elegido al procesar una tarea.
- **Estado general:** etapa actual del ciclo de vida de la tarea.
- **Tarea exprés:** acción inmediata vinculada al contexto actual, que no pasa por la ruta normal de planificación.
- **Tarea operativa:** mantiene funcionando la vida cotidiana.
- **Tarea estratégica:** hace avanzar una meta, proyecto o sistema intencional.

---

## 5. Arquitectura funcional general

```text
Botón global “+”
├── Tarea
│   ├── Normal → Inbox de tareas
│   └── Exprés → Módulo Tareas exprés del Centro de Mando
├── Evento → Calendario
├── Gasto → Finanzas
└── Idea o asunto → Inbox de ideas y asuntos

Inbox de tareas
└── Procesar
    ├── Atender ahora → Planificación rápida → Hoy/Mañana
    ├── Planificar → Por planificar
    ├── Delegar → Delegadas
    └── Algún día → Algún día

Estados posteriores
├── Planificada → Hoy cuando fecha_ejecucion = fecha actual
├── En espera → Bloqueada por persona, recurso o paso previo
├── Completada → Archivo
└── Cancelada → Archivo
```

---

## 6. Navegación requerida para esta fase

La aplicación debe contar, como mínimo, con accesos a:

1. **Centro de Mando.**
2. **Inbox.**
3. **Por planificar.**
4. **Delegadas.**
5. **En espera.**
6. **Algún día.**
7. **Archivo o Completadas**, aunque inicialmente puede ser una vista sencilla.
8. **Botón global “+”**, visible y accesible desde las pantallas principales, especialmente en móvil.

El Inbox puede usar pestañas internas para separar tareas de ideas/asuntos. Las demás bandejas pueden estar como pestañas de una pantalla general de Tareas o como rutas independientes, según la navegación existente, pero deben conservar los filtros y comportamientos aquí especificados.

### 6.1 Pestañas recomendadas en la sección Tareas

```text
Inbox | Por planificar | Delegadas | En espera | Algún día | Completadas
```

Dentro de **Inbox**:

```text
Tareas | Ideas y asuntos
```

No mezclar eventos ni gastos en estas pestañas:

- Los eventos van directamente al calendario.
- Los gastos van directamente a Finanzas.

---

## 7. Centro de Mando — alcance mínimo viable

### 7.1 Objetivo de esta fase

El Centro de Mando definitivo se diseñará y optimizará después. En esta fase solo debe construirse lo indispensable para recibir y ejecutar los elementos provenientes de la ruta GTD.

### 7.2 Encabezado obligatorio

Debe mostrar siempre:

- Fecha completa actual.
- Hora real actual, actualizada automáticamente.
- Frase de motivación.

Ejemplo visual de contenido:

```text
Viernes, 11 de septiembre de 2026
5:42 p. m.
“La cotidianidad no puede seguir ahogando el futuro.”
```

La frase puede comenzar como una frase fija o provenir de una lista local. No implementar IA para generarla en esta etapa.

### 7.3 Módulos GTD que sí pertenecen al MVP

#### A. Tareas exprés

Debe mostrar las tareas exprés pendientes del contexto o día actual.

Cada elemento muestra:

- Checkbox.
- Título.
- Editar.
- Eliminar.
- Opción de agregar otra tarea exprés.

Comportamiento:

- Al marcar el checkbox, la tarea se completa y deja de mostrarse en el módulo.
- La tarea queda en el historial; no se borra físicamente.
- Cuando no existan tareas, mostrar un estado vacío claro y el botón para agregar.

#### B. Hoy

Debe mostrar:

- Tareas con fecha de ejecución igual a hoy.
- Tareas vencidas pendientes.
- Instancias recurrentes generadas para hoy.

Cada tarjeta debe mostrar inicialmente:

- Checkbox.
- Título.
- Hora o bloque, cuando exista.
- Prioridad.
- Fecha límite solo si está cercana o vencida.
- Duración estimada, si existe.
- Contexto, si existe.
- Indicador de tarea estratégica, si corresponde.
- Acceso al detalle o checklist.

Acciones mínimas:

- Completar.
- Editar.
- Reprogramar.
- Poner en espera.
- Delegar.
- Abrir checklist.

#### C. Vencidas

Puede ser una subsección de Hoy o un módulo pequeño independiente. Debe mostrar tareas cuya fecha límite o fecha de ejecución ya pasó y que no están completadas, canceladas ni bloqueadas justificadamente.

Acciones:

- Hacer hoy.
- Reprogramar.
- Delegar.
- Enviar a Algún día.
- Cancelar.

#### D. Preparar mañana

Debe mostrar:

- Tareas con fecha de ejecución mañana.
- Eventos de mañana, si la integración interna del calendario ya está disponible.
- Tareas cuya fecha límite sea mañana.

Acciones mínimas:

- Abrir detalle.
- Cambiar fecha, hora o bloque.
- Añadir o revisar checklist.
- Reprogramar.

No construir todavía un sistema complejo de materiales y preparación; basta con mostrar la información y permitir editar el checklist.

### 7.4 Elementos que no son obligatorios en este MVP

- Top 3 avanzado.
- Modal de energía y emoción.
- Orden inteligente basado en aprendizaje.
- Sesiones de enfoque completas.
- Indicadores por pilar.
- Hábitos y rutinas.
- Métricas complejas.
- Recomendaciones de IA.
- Gráficos.
- Centro de Mando definitivo.

La arquitectura debe permitir agregarlos después sin rehacer la base de tareas.

---

## 8. Captura rápida global

### 8.1 Acceso

Un botón global **“+”** debe estar disponible desde las pantallas principales. Debe ser especialmente accesible en móvil.

Al abrirlo, mostrar cuatro tipos:

1. Tarea, seleccionada por defecto.
2. Evento.
3. Gasto.
4. Idea o asunto.

### 8.2 Comportamiento común

- El modal tiene una X en la esquina superior derecha.
- Al guardar, mostrar confirmación breve no bloqueante.
- Debe ser posible seguir capturando sin cerrar el modal.
- Después de guardar, limpiar los campos y devolver el foco al campo principal.
- Ofrecer **Guardar** y, si se considera útil, **Guardar y cerrar**.
- Evitar navegación adicional o formularios largos.

### 8.3 Captura de tarea

Campos visibles:

- Título, obligatorio.
- Es tarea exprés, interruptor sí/no.

Reglas:

- Valor predeterminado de `es_expres`: falso.
- Si es normal, crearla con estado `inbox`.
- Si es exprés, crearla como `expres` y mostrarla directamente en el módulo Tareas exprés.
- El tipo de tarea será `operativa` por defecto.

### 8.4 Captura de evento

Campos:

- Nombre del evento, obligatorio.
- Fecha, requerida para considerarlo evento.
- Hora, opcional mientras está por confirmar.
- Lugar o enlace, opcional.
- Modalidad: presencial, virtual o por confirmar.
- Checklist breve de preparación, opcional.

Reglas:

- Con fecha, se guarda directamente como evento y no pasa por Inbox.
- Si no tiene hora, puede guardarse como evento de día completo o con hora pendiente.
- Sin fecha, no es todavía un evento ejecutable: debe guardarse como tarea en Inbox, por ejemplo `Definir fecha de: [nombre]`.
- Las acciones de preparación son checklist o tareas relacionadas; el evento no debe duplicarse como tarea.

### 8.5 Captura de gasto

Campos:

- Concepto, obligatorio.
- Monto, obligatorio.
- Cuenta utilizada, seleccionada desde las cuentas registradas en Finanzas.
- Fecha, automática y editable.

Reglas:

- Va directamente a Finanzas.
- No pasa por Inbox.
- Dejar preparada la relación con cuentas para futuras actualizaciones automáticas de saldo o deuda.
- Si Finanzas todavía no está implementado, puede habilitarse una persistencia mínima compatible con la futura relación, sin mezclar el gasto con tareas.

### 8.6 Captura de idea o asunto

Este tipo incluye ideas, temas que investigar, posibilidades de negocio, decisiones, deseos, recursos o asuntos que todavía no tienen una acción definida.

Campos:

- Título o texto libre, obligatorio.
- Enlace/recurso, opcional.

Reglas:

- Va al Inbox de Ideas y asuntos.
- No crea automáticamente una tarea.
- Más adelante podrá convertirse en tarea, proyecto, meta, sueño, decisión, investigación o referencia.

---

## 9. Tareas exprés

### 9.1 Definición

Una tarea exprés surge dentro de un contexto y debe atenderse allí, sin pasar por el procesamiento y la planificación normal.

Ejemplo:

```text
Informar al gestor de camas que la habitación 234 está fuera de servicio.
```

### 9.2 Datos mínimos

- ID.
- Título.
- `es_expres = true`.
- Fecha y hora de creación.
- Contexto actual, si está disponible; opcional para el MVP.
- Estado: pendiente o completada.
- Fecha y hora de finalización.

No pedir:

- Pilar.
- Energía.
- Duración.
- Prioridad.
- Fecha límite.
- Proyecto.

### 9.3 Cierre del contexto

En una versión posterior, al terminar el turno o el contexto, las tareas exprés pendientes deben poder:

- Convertirse en tarea normal del Inbox.
- Reprogramarse.
- Completarse.
- Eliminarse.

Para el MVP, basta con edición, completado y eliminación manual.

---

## 10. Pantalla Inbox

### 10.1 Objetivo

Contener solamente capturas que todavía necesitan una decisión. Una vez procesada, una tarea sale del Inbox.

### 10.2 Orden

Orden predeterminado:

```text
Más antigua → más reciente
```

Esto evita que las capturas antiguas queden enterradas.

### 10.3 Tarjeta horizontal de tarea

Cada registro debe mostrar:

- Checkbox al inicio.
- Título.
- Fecha u hora de captura.
- CTA principal: **Procesar**.
- Menú secundario: Editar y Eliminar.
- Área clicable para abrir el detalle.

Comportamientos:

- Checkbox: completa directamente una tarea que ya se resolvió sin procesarla.
- Procesar: abre el modal o panel de procesamiento.
- Editar: permite corregir el título.
- Eliminar: solicita confirmación y usa borrado lógico/papelera.
- Abrir tarjeta: muestra la información disponible y el historial básico.

### 10.4 Estado vacío

Cuando no haya tareas:

- Mostrar un mensaje claro de Inbox vacío.
- Ofrecer el botón Capturar.
- No llenar la pantalla con estadísticas irrelevantes.

### 10.5 Pestaña Ideas y asuntos

Cada tarjeta muestra:

- Título.
- Enlace, cuando exista.
- Fecha de captura.
- Abrir.
- Editar.
- Eliminar.
- Procesar/Transformar.

Destinos futuros previstos:

- Convertir en tarea.
- Convertir en proyecto.
- Convertir en meta.
- Convertir en sueño.
- Convertir en decisión.
- Convertir en investigación.
- Guardar como referencia.
- Enviar a Algún día.
- Archivar o eliminar.

En el MVP se puede implementar como mínimo: convertir en tarea, archivar y eliminar, dejando preparada la arquitectura para los otros destinos.

---

## 11. Procesamiento de tareas

### 11.1 Propósito

Decidir:

- Qué tipo de tarea es.
- A qué pilar pertenece.
- Su urgencia e importancia.
- Si es recurrente.
- Si requiere varios pasos.
- Si tiene una fecha límite real.
- Qué ruta seguirá.

No se debe llenar todavía toda la planificación.

### 11.2 Campos visibles

1. **Título**, editable.
2. **Tipo de tarea**:
   - Operativa, predeterminada.
   - Estratégica.
3. **Pilar**, selector o relación con los pilares existentes.
4. **Urgente**, interruptor.
5. **Importante**, interruptor.
6. **Fecha límite**, opcional.
7. **Es recurrente**, interruptor.
8. **Frecuencia**, condicional.
9. **Tiene varios pasos**, interruptor.
10. **Checklist**, condicional.
11. **Ruta sugerida y ruta elegida**.

### 11.3 Campos excluidos

No añadir al formulario general:

- Requiere acción.
- Módulo o área funcional.
- Acción concreta.
- Resultado esperado.
- Depende de alguien.
- Eliminar como estado.
- Convertir en proyecto como ruta normal.

Razones:

- Toda entidad en Tareas ya requiere acción.
- El título contiene la acción ejecutable.
- Eliminar se realiza mediante papelera.
- Completar se realiza mediante checkbox.
- Los proyectos deben originarse principalmente desde el núcleo estratégico.

### 11.4 Matriz de Eisenhower adaptada

| Urgente | Importante | Recomendación inicial |
| ------- | ---------- | --------------------- |
| Sí      | Sí         | Atender ahora         |
| No      | Sí         | Planificar            |
| Sí      | No         | Delegar               |
| No      | No         | Algún día             |

La interfaz debe:

- Calcular y mostrar una recomendación al cambiar los dos interruptores.
- Explicar brevemente por qué se recomienda esa ruta.
- Permitir que la usuaria seleccione otra ruta.
- No guardar hasta que se confirme la decisión.

### 11.5 Rutas disponibles

- Atender ahora.
- Planificar.
- Delegar.
- Algún día.

`En espera` no es una ruta inicial de la matriz; es un estado posterior para tareas bloqueadas.

---

## 12. Ruta Atender ahora

### 12.1 Significado

No significa obligatoriamente ejecutar en ese segundo. Significa que la tarea requiere una decisión inmediata de agenda porque debe atenderse hoy o mañana temprano.

### 12.2 Interacción

Al seleccionar Atender ahora, abrir una planificación rápida dentro del mismo flujo o en un segundo paso.

Campos:

- Hoy o mañana.
- Fecha de ejecución.
- Hora, opcional.
- Duración estimada.
- Energía necesaria.
- Efecto energético.
- Contexto.
- Prioridad.
- Bloque de tiempo, opcional.

### 12.3 Resultado

- Con fecha de hoy: estado `planificada`, aparece en Hoy.
- Con fecha de mañana: estado `planificada`, aparece en Preparar mañana.
- Sale del Inbox.

---

## 13. Ruta Planificar

### 13.1 Significado

La tarea sí se hará, pero todavía debe colocarse conscientemente en el calendario o planificador.

### 13.2 Resultado

- Ruta: `planificar`.
- Estado: `por_planificar`.
- Sale del Inbox.
- Aparece en la pestaña Por planificar.

### 13.3 Pantalla Por planificar

Orden recomendado:

1. Fecha límite más cercana.
2. Prioridad.
3. Antigüedad.

Acciones:

- Planificar.
- Editar.
- Delegar.
- Enviar a Algún día.
- Poner en espera.
- Completar.
- Eliminar.

Al planificar, solicitar las propiedades de planificación y cambiar el estado a `planificada`.

---

## 14. Ruta Delegar

### 14.1 Significado

Incluye tanto tareas que todavía deben asignarse como tareas que ya están en manos de otra persona.

### 14.2 Resultado al procesar

- Ruta: `delegar`.
- Estado general compatible con la implementación, preferiblemente `delegada` o `por_planificar` más un estado específico de delegación.
- Estado de delegación: `por_delegar`.
- Sale del Inbox.
- Aparece en la pestaña Delegadas.

### 14.3 Estados de delegación

- Por delegar.
- Delegada.
- Confirmada.
- En seguimiento.
- Completada.
- Devuelta o requiere intervención.

### 14.4 Propiedades condicionales

- Responsable.
- Fecha de delegación.
- Fecha acordada.
- Instrucciones.
- Checklist.
- Evidencia o resultado esperado, opcional solo en delegación.
- Próxima fecha de seguimiento.
- Notas.

### 14.5 Pantalla Delegadas

Filtros o grupos:

- Por delegar.
- En manos de otra persona.
- Requiere seguimiento.
- Devueltas.
- Completadas, como filtro histórico.

Acciones:

- Asignar responsable.
- Marcar como delegada.
- Registrar seguimiento.
- Cambiar fecha acordada.
- Marcar completada.
- Recuperar la tarea para ejecución propia.
- Poner en espera.

Las tareas `por_delegar` deben aparecer en esta misma pantalla; no crear otra bandeja.

---

## 15. Ruta Algún día

### 15.1 Significado

Tarea válida, pero sin intención cercana de ejecución.

Características habituales:

- No tiene fecha de ejecución.
- Generalmente no tiene fecha límite.
- No necesita atención en el periodo actual.

### 15.2 Resultado

- Ruta: `algun_dia`.
- Estado: `algun_dia`.
- Sale del Inbox.
- Aparece en la pestaña Algún día.

### 15.3 Acciones

- Activar y enviar a Por planificar.
- Planificar directamente.
- Delegar.
- Editar.
- Completar.
- Cancelar o eliminar.

No usar Algún día como depósito automático para todo lo que todavía no tenga fecha. Si la intención es hacerlo pronto y solo falta escoger el día, corresponde a Por planificar.

---

## 16. Estado En espera

### 16.1 Significado

Una tarea está bloqueada porque depende de una condición externa.

Motivos posibles:

- Persona.
- Respuesta.
- Recurso.
- Dinero.
- Autorización.
- Tiempo disponible específico.
- Otra tarea.
- Paso previo.

### 16.2 Propiedades

- Motivo de espera.
- Esperando a quién o qué.
- Fecha de seguimiento.
- Tarea bloqueadora, opcional.
- Notas.

### 16.3 Pantalla En espera

Debe mostrar primero:

1. Seguimientos vencidos.
2. Seguimientos de hoy.
3. Próximos seguimientos.
4. Sin fecha de seguimiento.

Acciones:

- Marcar desbloqueada.
- Reprogramar seguimiento.
- Delegar.
- Completar.
- Cancelar.

Al desbloquear, preguntar si vuelve a Por planificar o si se planifica inmediatamente.

---

## 17. Tareas con checklist

### 17.1 Regla

Una tarea puede tener varios pasos sin convertirse en proyecto.

Usar checklist cuando:

- Existe un único resultado pequeño.
- Los pasos forman parte de la misma acción.
- No requiere administración independiente de entregables.

Los proyectos se crearán principalmente desde metas o el núcleo estratégico.

### 17.2 Datos del checklist

Cada ítem debe tener:

- ID.
- ID de tarea.
- Título.
- Orden.
- Completado sí/no.
- Fecha de completado.

La tarea puede mostrar progreso calculado:

```text
ítems completados / ítems totales
```

No completar automáticamente la tarea al completar el último ítem sin una decisión explícita o una preferencia configurable. Para el MVP, puede sugerir completar la tarea.

---

## 18. Recurrencia

### 18.1 Principio técnico

Completar una ocurrencia no debe completar todas las futuras. La regla recurrente y las instancias ejecutables deben tratarse separadamente, aunque compartan la misma entidad lógica.

### 18.2 Opciones de interfaz

- Diaria.
- Días laborables, lunes a viernes.
- Fines de semana.
- Semanal.
- Mensual.
- Anual.
- Personalizada.

### 18.3 Configuración personalizada

- Cada X días.
- Cada X semanas.
- Cada X meses.
- Días específicos de la semana.
- Día concreto del mes.
- Primer, segundo, tercer, cuarto o último día específico del mes.
- Fecha de inicio.
- Fecha de finalización, opcional.
- Número máximo de repeticiones, opcional.

Ejemplos que deben poder representarse:

- Todos los días laborables.
- Sábados y domingos.
- Interdiario.
- Cada tres semanas.
- Cada primer jueves del mes.
- Cada último viernes del mes.
- El día 15 de cada mes.
- Cada tres meses.

### 18.4 Recomendación de modelo

Separar:

- `recurrence_rule`: definición de recurrencia.
- `task`: tarea u ocurrencia concreta.

Cada instancia debe guardar referencia a la regla que la originó.

Evitar generar infinitas ocurrencias por adelantado. Generar dentro de una ventana controlada o al acercarse la próxima fecha.

---

## 19. Planificación

### 19.1 Propiedades visibles

- Fecha de ejecución.
- Hora, opcional.
- Duración estimada.
- Energía necesaria: baja, media o alta.
- Efecto energético: me da energía, neutral o me quita energía.
- Contexto, selección múltiple.
- Prioridad: alta, media o baja.
- Bloque de tiempo, opcional.
- Posición manual dentro del día, si ya existe ordenamiento.

### 19.2 Contextos iniciales

- Trabajo.
- Casa.
- Iglesia.
- Fuera de casa.
- Computadora.
- Teléfono.
- Tablet.
- Con otra persona.
- Cualquier lugar.

Permitir combinación de contextos, por ejemplo `Trabajo + computadora`.

### 19.3 Bloques iniciales

- Mañana.
- Mediodía.
- Tarde.
- Noche.

Los horarios de la usuaria son variables; no asumir bloques rígidos asociados siempre a las mismas horas.

### 19.4 Regla sin fecha

- Si la tarea se procesó con intención de hacerse pronto, pero todavía no tiene fecha: `por_planificar`.
- Si no existe intención cercana: `algun_dia`.
- No enviar automáticamente toda tarea sin fecha a Algún día.

---

## 20. Ejecución y orden inicial en Hoy

En el MVP, el orden puede basarse en reglas deterministas. No implementar todavía aprendizaje automático.

### 20.1 Capas de orden

1. Hora fija o ventana obligatoria.
2. Tareas vencidas.
3. Fecha límite hoy.
4. Fecha límite mañana.
5. Urgente e importante.
6. Prioridad alta, media y baja.
7. Compatibilidad de contexto.
8. Compatibilidad de energía.
9. Duración compatible con el tiempo disponible, cuando pueda calcularse.
10. Orden manual establecido por la usuaria.

### 20.2 Reglas

- La energía ajusta el orden, pero no oculta una fecha límite crítica.
- Una tarea que requiere un contexto no disponible no debe sugerirse como “ahora”.
- Las tareas con hora fija conservan su ubicación.
- Permitir reordenamiento manual.
- No convertir el orden en una puntuación visible complicada.
- Proteger la visibilidad de las tareas estratégicas; en fases posteriores se implementará un Top 3 o cuota estratégica.

### 20.3 Subgrupos visuales recomendados

- Ahora.
- Próximas.
- Más tarde.
- Vencidas.

Para el MVP, si esto añade complejidad excesiva, basta con Vencidas y Hoy ordenadas mediante las reglas anteriores.

---

## 21. Cierre, archivo e historial

### 21.1 Al completar

Registrar automáticamente:

- Fecha y hora real de finalización.
- Estado `completada`.
- Duración real, si existió temporizador o sesión de enfoque.
- Número de reprogramaciones acumuladas.
- Relación con pilar, meta o proyecto.

La tarea deja las vistas activas y aparece en Archivo/Completadas.

### 21.2 Al no completar

Permitir:

- Reprogramar.
- Poner en espera.
- Delegar.
- Enviar a Algún día.
- Cancelar.

Motivo opcional de no ejecución:

- No tuve tiempo.
- No tuve energía.
- Surgió algo urgente.
- Calculé mal la duración.
- No tenía los recursos.
- Dependía de otra persona.
- Perdió importancia.
- No estaba suficientemente clara.
- No quise hacerla.
- Otro.

### 21.3 Archivo

El Archivo es una vista de la misma fuente de datos. Debe conservar:

- Datos originales.
- Historial de estados.
- Fechas de ejecución anteriores.
- Reprogramaciones.
- Bloqueos.
- Delegaciones.
- Checklist.
- Motivo de cancelación o incumplimiento.

Aplicar borrado lógico para permitir recuperación y análisis futuro.

---

## 22. Aprendizaje y mejora futura

No implementar todavía la inteligencia avanzada, pero capturar desde ahora los datos necesarios para poder detectar:

- Horarios de mayor cumplimiento.
- Diferencias entre duración estimada y real.
- Reprogramaciones repetidas.
- Sobrecarga diaria.
- Tareas que dan o quitan energía.
- Contextos incompatibles.
- Tareas estratégicas desplazadas por operativas.
- Tareas por delegar que nunca se asignan.
- Tareas en espera sin seguimiento.
- Recurrencias poco realistas.
- Pilares atendidos o descuidados.
- Exceso de tareas exprés.

La futura ruta será:

```text
Datos históricos → patrones → fugas → recomendación → experimento → evaluación → ajuste
```

Las futuras recomendaciones nunca deben aplicar cambios sin confirmación de la usuaria.

---

## 23. Modelo de datos recomendado

Los nombres técnicos pueden adaptarse a las convenciones del repositorio, pero no se debe perder la separación semántica.

### 23.1 Entidad `tasks`

#### Identidad y auditoría

| Campo        | Tipo sugerido     | Requerido | Notas                                               |
| ------------ | ----------------- | --------: | --------------------------------------------------- |
| id           | UUID              |        Sí | Clave primaria                                      |
| user_id      | UUID              |        Sí | Propietaria de la tarea                             |
| title        | string            |        Sí | Acción ejecutable                                   |
| created_at   | datetime          |        Sí | Automático                                          |
| updated_at   | datetime          |        Sí | Automático                                          |
| completed_at | datetime nullable |        No | Automático al completar                             |
| deleted_at   | datetime nullable |        No | Borrado lógico                                      |
| source       | enum              |        Sí | capture, express, goal, project, recurrence, manual |

#### Clasificación

| Campo      | Tipo sugerido | Requerido | Notas                              |
| ---------- | ------------- | --------: | ---------------------------------- |
| task_type  | enum          |        Sí | operational por defecto, strategic |
| pillar_id  | UUID nullable |        No | Relación con pilares               |
| goal_id    | UUID nullable |        No | Para tareas estratégicas           |
| project_id | UUID nullable |        No | Para tareas estratégicas           |
| is_express | boolean       |        Sí | false por defecto                  |

#### Procesamiento

| Campo              | Tipo sugerido          | Requerido | Notas                               |
| ------------------ | ---------------------- | --------: | ----------------------------------- |
| status             | enum                   |        Sí | Ver estados generales               |
| processing_route   | enum nullable          |        No | attend_now, plan, delegate, someday |
| is_urgent          | boolean                |        Sí | false por defecto                   |
| is_important       | boolean                |        Sí | false por defecto                   |
| deadline_at        | datetime/date nullable |        No | Fecha límite real                   |
| has_multiple_steps | boolean                |        Sí | false por defecto                   |
| processed_at       | datetime nullable      |        No | Fecha de salida del Inbox           |

#### Planificación

| Campo                      | Tipo sugerido            | Requerido | Notas                                             |
| -------------------------- | ------------------------ | --------: | ------------------------------------------------- |
| execution_date             | date nullable            |        No | Fecha elegida                                     |
| scheduled_time             | time nullable            |        No | Hora opcional                                     |
| estimated_duration_minutes | integer nullable         |        No | Duración estimada                                 |
| energy_required            | enum nullable            |        No | low, medium, high                                 |
| energy_effect              | enum nullable            |        No | gives, neutral, drains                            |
| priority                   | enum nullable            |        No | low, medium, high                                 |
| time_block                 | enum/string nullable     |        No | morning, midday, afternoon, night o personalizado |
| manual_order               | decimal/integer nullable |        No | Orden drag-and-drop                               |

#### Bloqueo y cierre

| Campo                 | Tipo sugerido        | Requerido | Notas                        |
| --------------------- | -------------------- | --------: | ---------------------------- |
| waiting_reason        | string nullable      |        No | Motivo de bloqueo            |
| waiting_for           | string nullable      |        No | Persona, recurso o condición |
| follow_up_date        | date nullable        |        No | Próximo seguimiento          |
| blocking_task_id      | UUID nullable        |        No | Relación autorreferente      |
| reschedule_count      | integer              |        Sí | 0 por defecto                |
| non_completion_reason | enum/string nullable |        No | Motivo opcional              |
| canceled_at           | datetime nullable    |        No | Cierre por cancelación       |

### 23.2 Estados generales `task_status`

Valores iniciales:

```text
inbox
express
to_plan
planned
in_progress
waiting
someday
delegated
completed
canceled
```

Notas:

- Si la arquitectura prefiere que `express`, `someday` o `delegated` sean ruta/tipo y no estado, se puede normalizar, pero las vistas deben conservar exactamente el comportamiento descrito.
- Evitar que una misma tarea tenga estados incompatibles.
- El estado es el ciclo de vida; `processing_route` explica la decisión tomada.

### 23.3 Entidad `task_contexts`

Relación muchos-a-muchos entre tareas y contextos.

Campos mínimos:

- task_id.
- context_id.

No almacenar contextos combinados como una sola cadena si se necesita filtrar cada uno de forma independiente.

### 23.4 Entidad `checklist_items`

- id.
- task_id.
- title.
- position.
- is_completed.
- completed_at.

### 23.5 Entidad `task_delegations`

- id.
- task_id.
- assignee/contact.
- delegation_status.
- delegated_at.
- agreed_due_date.
- next_follow_up_at.
- instructions.
- expected_evidence.
- notes.

### 23.6 Entidad `recurrence_rules`

- id.
- source_task_id o template_id.
- frequency_type.
- interval_value.
- days_of_week.
- day_of_month.
- ordinal_week.
- weekday.
- starts_at.
- ends_at.
- max_occurrences.
- next_occurrence_at.
- is_active.

### 23.7 Entidad `task_history`

Registrar eventos relevantes:

- id.
- task_id.
- event_type.
- previous_value, cuando corresponda.
- new_value, cuando corresponda.
- metadata JSON, si se necesita.
- created_at.

Eventos mínimos:

- created.
- edited.
- processed.
- route_changed.
- planned.
- rescheduled.
- delegated.
- blocked.
- unblocked.
- completed.
- canceled.
- soft_deleted.

### 23.8 Entidad `ideas`

- id.
- user_id.
- title_or_content.
- resource_url.
- status: inbox, processed, archived, deleted.
- converted_type, nullable.
- converted_entity_id, nullable.
- created_at.
- updated_at.
- deleted_at.

### 23.9 Eventos y gastos

Eventos y gastos no deben compartir la tabla `tasks` como si fueran tareas. Deben tener entidades propias y relaciones cuando sea necesario.

---

## 24. Reglas de transición

| Desde            | Acción                 | Hacia                        |
| ---------------- | ---------------------- | ---------------------------- |
| Captura normal   | Guardar                | Inbox                        |
| Captura exprés   | Guardar                | Exprés/Centro de Mando       |
| Inbox            | Completar              | Completada/Archivo           |
| Inbox            | Atender ahora + hoy    | Planificada/Hoy              |
| Inbox            | Atender ahora + mañana | Planificada/Preparar mañana  |
| Inbox            | Planificar             | Por planificar               |
| Inbox            | Delegar                | Delegadas/Por delegar        |
| Inbox            | Algún día              | Algún día                    |
| Por planificar   | Asignar fecha          | Planificada                  |
| Planificada      | Fecha = hoy            | Visible en Hoy               |
| Cualquier activa | Bloquear               | En espera                    |
| En espera        | Desbloquear            | Por planificar o Planificada |
| Cualquier activa | Delegar                | Delegadas                    |
| Cualquier activa | Completar              | Completada/Archivo           |
| Cualquier activa | Cancelar               | Cancelada/Archivo            |

Toda transición importante debe actualizar `task_history`.

---

## 25. Validaciones y casos límite

### Captura

- No permitir título vacío.
- Al guardar múltiples tareas, evitar dobles envíos por clic repetido.
- Mantener el modal abierto después de Guardar.
- Si falla el guardado, conservar el texto escrito.

### Eventos

- Sin fecha, convertir o proponer guardar como tarea.
- No exigir hora si está por confirmar.
- Diferenciar lugar presencial y enlace virtual sin obligar ambos.

### Procesamiento

- No permitir confirmar sin una ruta.
- Pilar puede ser requerido en la experiencia final; si todavía no están cargados los pilares, permitir temporalmente procesar sin pilar y marcarlo para completar después.
- Fecha límite anterior a hoy debe advertir, no fallar silenciosamente.
- `operativa` es el valor predeterminado.

### Planificación

- Fecha de ejecución anterior a hoy debe advertir.
- La fecha de ejecución puede ser posterior a la fecha límite solo con advertencia y confirmación.
- Cambiar la fecha de ejecución incrementa `reschedule_count` cuando la tarea ya estaba planificada.
- Quitar la fecha de una tarea planificada debe requerir elegir Por planificar o Algún día.

### Delegación

- Una tarea puede estar Por delegar sin responsable.
- Para cambiarla a Delegada, sí debe existir responsable.
- Una tarea delegada sigue perteneciendo a la base maestra y conserva su pilar.

### En espera

- Recomendar fecha de seguimiento, pero no bloquear el guardado en el MVP.
- Al llegar la fecha de seguimiento, mostrarla como acción pendiente sin cambiar automáticamente su estado.

### Recurrencia

- Evitar duplicar ocurrencias.
- Editar una instancia no debe modificar toda la serie sin preguntar.
- Ofrecer en fases posteriores: editar esta ocurrencia, esta y futuras o toda la serie.

---

## 26. Requisitos de UX/UI

- Diseño mobile-first para captura y Centro de Mando.
- Botones y checkboxes con áreas táctiles cómodas.
- Formularios mediante revelado progresivo: mostrar campos condicionales solo cuando apliquen.
- Guardado rápido y retroalimentación inmediata.
- Estados vacíos útiles.
- Confirmación para acciones destructivas.
- Colores pastel por pilar, sin depender únicamente del color para comunicar significado.
- Iconos acompañados de texto o etiquetas accesibles.
- Navegación y foco por teclado cuando corresponda.
- No recargar tarjetas con todas las propiedades internas.
- Mantener edición rápida desde tarjetas y detalle completo al abrir.
- La interfaz debe sentirse simple aunque la base de datos sea robusta.

---

## 27. Notificaciones y recordatorios

Preparar puntos de extensión para recordatorios de procesamiento alrededor de:

- 1:00–2:00 p. m.
- 9:30–10:00 p. m.

Estos son recordatorios sugeridos, no obligaciones ni penalizaciones.

Para el MVP:

- Puede implementarse un indicador visual de cantidad pendiente en Inbox.
- Las notificaciones reales pueden posponerse si requieren infraestructura adicional.
- No bloquear el uso del sistema por no realizar una revisión.

---

## 28. Alcance de implementación por etapas

### Etapa 1 — Fundamento de datos y navegación

- Crear o ajustar entidad maestra de tareas.
- Crear estados, rutas y relaciones.
- Crear checklist.
- Crear ideas/asuntos.
- Preparar recurrencia, delegación e historial.
- Crear navegación base de Tareas.
- No duplicar datos existentes.

### Etapa 2 — Captura rápida

- Botón global +.
- Modal con cuatro tipos.
- Captura consecutiva sin cierre.
- Enrutamiento correcto de tarea, evento, gasto e idea.
- Tareas exprés.

### Etapa 3 — Inbox y procesamiento

- Pestañas Tareas e Ideas/asuntos.
- Orden antiguo a reciente.
- Tarjetas y acciones.
- Modal de procesamiento.
- Matriz de Eisenhower.
- Rutas y transiciones.

### Etapa 4 — Bandejas posteriores

- Por planificar.
- Delegadas.
- En espera.
- Algún día.
- Completadas/Archivo.

### Etapa 5 — Planificación

- Formulario completo de planificación.
- Fecha de ejecución, hora, duración, energía, contexto, prioridad y bloque.
- Reprogramación e historial.

### Etapa 6 — Centro de Mando MVP

- Encabezado con fecha completa, hora real y frase motivacional.
- Tareas exprés.
- Hoy.
- Vencidas.
- Preparar mañana.
- Acciones mínimas de ejecución.

### Etapa 7 — Cierre e historial

- Completar, cancelar y archivar.
- Motivo opcional de no ejecución.
- Historial de transiciones.
- Datos preparados para análisis futuro.

No comenzar una etapa posterior sin validar los criterios de aceptación de la anterior, salvo que la arquitectura técnica exija implementar una dependencia mínima.

---

## 29. Criterios de aceptación del MVP

El MVP de esta ruta se considera funcional cuando:

1. La usuaria puede abrir el botón + desde móvil y capturar varias tareas consecutivas.
2. Una tarea normal aparece en Inbox.
3. Una tarea exprés aparece en el Centro de Mando sin pasar por Inbox.
4. Un evento con fecha va al calendario y no al Inbox.
5. Un gasto va a Finanzas o a su persistencia provisional separada.
6. Una idea aparece en Ideas y asuntos.
7. El Inbox se ordena de la captura más antigua a la más reciente.
8. Una tarea puede editarse, completarse, eliminarse y procesarse.
9. La matriz sugiere una ruta sin impedir que la usuaria la cambie.
10. Atender ahora permite planificar para hoy o mañana.
11. Planificar envía la tarea a Por planificar.
12. Delegar envía la tarea a Delegadas con estado Por delegar.
13. Algún día envía la tarea a su pestaña correspondiente.
14. Una tarea bloqueada puede pasar a En espera y conservar seguimiento.
15. Una tarea puede contener checklist.
16. Una tarea recurrente genera instancias independientes sin duplicarlas.
17. Una tarea con fecha de hoy aparece en Hoy.
18. Una tarea de mañana aparece en Preparar mañana.
19. Una tarea vencida se identifica claramente.
20. Completar una tarea la retira de las vistas activas y conserva su historial.
21. El Centro de Mando muestra siempre fecha completa, hora real y frase motivacional.
22. No existen bases duplicadas para cada bandeja.

---

## 30. Pruebas funcionales mínimas

### Caso 1 — Vaciado mental consecutivo

1. Abrir +.
2. Capturar tres tareas usando Guardar.
3. Verificar que el modal permanezca abierto y el input se limpie.
4. Cerrar el modal.
5. Verificar las tres tareas en Inbox en el orden correcto.

### Caso 2 — Tarea exprés

1. Capturar tarea con Es exprés activado.
2. Verificar que no aparezca en Inbox.
3. Verificar que aparezca en Centro de Mando > Tareas exprés.
4. Completarla.
5. Verificar que desaparezca del módulo y aparezca en historial.

### Caso 3 — Procesar y atender ahora

1. Abrir una tarea del Inbox.
2. Marcar urgente e importante.
3. Verificar recomendación Atender ahora.
4. Elegir hoy y completar planificación rápida.
5. Verificar que salga del Inbox y aparezca en Hoy.

### Caso 4 — Procesar para planificar

1. Marcar importante y no urgente.
2. Confirmar Planificar.
3. Verificar que aparezca en Por planificar.
4. Asignar fecha de mañana.
5. Verificar que aparezca en Preparar mañana.

### Caso 5 — Delegación pendiente

1. Elegir Delegar sin responsable.
2. Verificar que aparezca en Delegadas > Por delegar.
3. Añadir responsable.
4. Cambiar a Delegada.
5. Definir seguimiento.

### Caso 6 — En espera

1. Tomar una tarea activa.
2. Ponerla en espera por falta de autorización.
3. Añadir fecha de seguimiento.
4. Verificar que desaparezca de Hoy y aparezca en En espera.
5. Desbloquearla y devolverla a Por planificar.

### Caso 7 — Fecha límite y ejecución

1. Crear tarea con fecha límite mañana.
2. Planificarla para hoy.
3. Confirmar que ambas fechas se conservan por separado.
4. Reprogramarla para después de la fecha límite.
5. Verificar advertencia y registro de reprogramación.

### Caso 8 — Recurrencia

1. Crear tarea para el primer jueves de cada mes.
2. Generar una ocurrencia.
3. Completarla.
4. Verificar que la regla continúe activa y la próxima ocurrencia no quede completada.

### Caso 9 — Archivo

1. Completar una tarea con checklist.
2. Verificar que salga de las bandejas activas.
3. Abrirla en Completadas.
4. Confirmar que conserva checklist, fechas, pilar e historial.

---

## 31. Instrucciones directas para Claude

1. Antes de modificar código, inspeccionar la arquitectura existente, esquema, estados y componentes relacionados.
2. No eliminar ni reemplazar trabajo existente sin justificar la migración.
3. Reutilizar la base maestra de tareas si ya existe; realizar migraciones seguras.
4. No crear una tabla diferente para cada pestaña.
5. Mantener separadas las entidades de tareas, ideas, eventos y gastos.
6. Implementar mobile-first el botón + y el Centro de Mando MVP.
7. Construir cada etapa en cambios pequeños y verificables.
8. Añadir pruebas de reglas de transición y filtros.
9. Documentar migraciones, decisiones y cualquier desviación necesaria.
10. Si una decisión técnica entra en conflicto con este documento, conservar primero el comportamiento funcional y explicar la alternativa antes de aplicarla.
11. No añadir campos o funciones “por si acaso” que aumenten fricción.
12. No implementar todavía IA ni automatizaciones costosas.
13. Mantener puntos de extensión para análisis de patrones sin mostrar esa complejidad en el MVP.

---

## 32. Resumen final del alcance actual

Esta fase debe entregar una ruta completa y utilizable:

```text
Captura rápida
→ Inbox
→ Procesamiento
→ Atender ahora / Por planificar / Delegadas / Algún día
→ Planificación
→ Hoy y Preparar mañana
→ Ejecución
→ Completadas e historial
```

El Centro de Mando de esta fase no es el definitivo. Solo debe incluir:

- Fecha completa.
- Hora real.
- Frase motivacional.
- Tareas exprés.
- Tareas de hoy.
- Vencidas.
- Preparar mañana.

El objetivo no es construir toda MOSS de una vez. El objetivo es dejar funcionando el primer circuito operativo que permita descargar la mente, decidir con claridad y ejecutar lo que realmente corresponde.
