# CLAUDE.md — MOSSIE

> Contexto operativo mínimo para Claude Code. Leer este archivo completo al iniciar. No cargar documentos extensos salvo que la tarea actual lo requiera.

## 1. Identidad y objetivo

**MOSS (My Own Simple System)** es una aplicación personal para reducir la carga mental de Génesis y decirle con claridad:

1. dónde colocar lo que surge;
2. qué le corresponde hacer ahora.

La usuaria tiene múltiples roles y turnos variables. MOSS debe ser simple, sereno, móvil primero y útil desde cada incremento. La frase rectora es:

> La cotidianidad no puede seguir ahogando el futuro.

## 2. Estado actual

- **Producto:** definición funcional, tecnológica y visual del primer circuito aprobada.
- **Ruta macro:** iniciar en Fase 0 y avanzar a Fase 1 mediante cortes verticales pequeños.
- **Primer producto útil:** Centro de Mando mínimo + Vaciado Mental + Inbox + procesamiento GTD + planificación diaria + ejecución + archivo/historial.
- **Implementación real:** no asumirla desde los documentos. Inspeccionar código, migraciones, pruebas y `git status` antes de afirmar qué está construido.
- **Siguiente paso predeterminado:** identificar la fase/etapa real del repositorio y construir el incremento incompleto más pequeño de la ruta actual.

### Actualizar al cerrar cada sesión

Editar solo este bloque cuando cambie el avance:

```text
ÚLTIMO_INCREMENTO: Alineación de Fase 1 al Flujo GTD v2.0. (1) Navegación del módulo Tareas: abre por defecto en Inbox; orden Inbox·Por planificar·Planificadas·Delegadas·En espera·Bloqueadas·Algún día·Todas·Completadas ("Todas" penúltima, antes de Completadas). (2) Centro de Mando: indicador de Inbox con conteo y acceso directo a Procesar (neutro cuando está vacío, destacado con pendientes). (3) Separación En espera vs Bloqueadas (Flujo v2.0 §17-§18): "En espera" (status='waiting') = fecha de revisión OBLIGATORIA (review_at) + motivo OPCIONAL, limpia execution_date; "Bloqueadas" (status='blocked', nuevo) = requisito de desbloqueo OBLIGATORIO (block_requirement), no permite Completar (candado), Desbloquear→Por planificar. Ambas y "Bloquear/Poner en espera" viven en el menú de cualquier tarea activa procesada; Reanudar/Desbloquear→to_plan. (4) Campos de planificación (Flujo v2.0 §12): el panel ahora captura hora, duración (botones ≤3/15/30/60/Personalizada con regla de 3 minutos → "Hacer ahora y completar"), energía requerida, efecto energético y prioridad (todo opcional; fecha obligatoria). La tarjeta muestra la hora junto a la fecha y una línea tenue con duración·prioridad·energía. (5) Contexto múltiple (Flujo v2.0 §12.5): sección de selección múltiple en el panel (Casa/Trabajo/Iglesia/Fuera/Computadora/Teléfono/Tablet/Con otra persona/Cualquier lugar) guardada en la tabla m2m task_contexts; la tarjeta muestra "Contexto: …". Migraciones: 0009 añade 'blocked'+review_at+block_requirement; 0010 añade scheduled_time, estimated_duration_minutes, energy_required, energy_effect y priority; 0011 crea task_contexts (m2m con RLS heredada de la tarea). (6) Portada de tarjetas minimizada: cada tarjeta muestra solo lo relevante (título + una línea de estado/fecha) y un chevron; al hacer clic se abre un detalle plegable con Capturada, Vence, Motivo/Revisar (En espera), Falta (Bloqueada), Duración, Prioridad, Energía, Efecto, Contexto y la checklist. Tareas simples (p. ej. Inbox sin extras) no muestran chevron. Producción: https://mossie-two.vercel.app.
FASE_TÉCNICA_ACTUAL: Fase 1 en progreso, alineándose al Flujo v2.0 (captura 4 tipos + Inbox + procesamiento GTD + planificación con condiciones y contexto + bandejas En espera y Bloqueadas).
ETAPA_FUNCIONAL_ACTUAL: Capturar→Procesar→Planificar(fecha+hora+duración+energía+efecto+prioridad+contexto)→Hoy, consulta global (Todas), En espera y Bloqueadas funcionando. Falta (Flujo v2.0): configuración de recurrencia (reglas + ocurrencias, fija/desde finalización); reprogramación con contador (reschedule_count) e historial (task_history, incl. guardar execution_date previa al pausar); Delegadas (responsable/seguimiento vinculado); Inbox de ideas; Calendario/Finanzas.
SIGUIENTE_ACCIÓN: CUT de recurrencia (Flujo v2.0 §13): tabla recurrence_rules + configuración en Planificación (frecuencia, intervalo, modo fija/desde finalización) sin generar instancias infinitas.
BLOQUEOS: ninguno (migraciones 0008–0011 aplicadas por la usuaria).
VERIFICADO_CON: Prettier, TypeScript, ESLint y next build (Next 16.3.5) en verde. Verificación EN VIVO (localhost:3000, sesión de la usuaria, migraciones 0002–0011 aplicadas): Tareas abre en Inbox con el orden del doc; indicador de Inbox en Home. En espera y Bloqueadas OK (chip, Reanudar/Desbloquear→Por planificar, candado impide completar). Planificación: fecha + hora + duración (regla de 3 min al elegir ≤3) + energía + efecto + prioridad se guardan y muestran en la tarjeta y en Centro de Mando→Hoy. Contexto múltiple: seleccionar Trabajo + Computadora se guardó en task_contexts y aparece en el detalle; combinaciones y RLS OK. Portada mínima: la tarjeta de Planificadas muestra solo "En progreso · 15 sept" con chevron; al abrir despliega Capturada/Vence/Duración/Prioridad/Energía/Efecto/Contexto y la checklist interactiva; las tareas de Inbox (sin extras) no muestran chevron. completeTask usa .neq('status','blocked') como refuerzo en servidor.
```

No convertir este archivo en bitácora. Mantener únicamente el estado vigente; el historial pertenece a Git o a documentos de avance.

## 3. Jerarquía de fuentes

1. Solicitud actual y decisiones explícitas más recientes de la usuaria.
2. Este `CLAUDE.md` para contexto y ruta.
3. Código, migraciones y pruebas para conocer el estado implementado.
4. Documento específico requerido para el incremento.

Si existe contradicción, detenerse y explicarla antes de cambiar una decisión aprobada. En identidad visual, si existe `moss.css`, sus valores técnicos prevalecen.

## 4. Lectura selectiva: no cargar todo por defecto

Los documentos maestros deben vivir en `docs/` con estos nombres canónicos:

- `docs/MOSS_TECH_STACK_ROADMAP.md`: consultar solo para arquitectura, fases, seguridad, dependencias, organización del código o definición de terminado.
- `docs/MOSS_GTD_Ruta_Vaciado_Mental_MVP.md`: consultar solo para captura, tareas, Inbox, procesamiento, bandejas, planificación, Centro de Mando MVP, estados, datos y pruebas GTD.
- `docs/MOSS_Documento_24_Sistema_Diseno_v1.0_APROBADO.md`: consultar solo al crear o modificar interfaz, estilos, componentes o comportamiento responsive.

Antes de leer un documento largo:

1. buscar encabezados o términos con `rg`;
2. abrir únicamente la sección aplicable;
3. ampliar la lectura solo si falta contexto;
4. no volver a resumir documentos ya resumidos aquí.

## 5. Stack aprobado

- Next.js con App Router.
- React y TypeScript estricto.
- Tailwind CSS y shadcn/ui adaptado a MOSS.
- PostgreSQL mediante Supabase.
- Supabase Auth y RLS.
- Zod en fronteras de entrada.
- pnpm, Git, ESLint y Prettier.
- Despliegue inicial: Vercel + Supabase administrado.
- PWA móvil primero; no app nativa en el inicio.

No agregar ORM, base de datos, backend paralelo o framework alternativo sin necesidad demostrada y ADR.

Dependencias bajo demanda, no al iniciar: React Hook Form, dnd-kit, Recharts, Vitest/Testing Library, Playwright y observabilidad. Instalarlas solo en el primer incremento que realmente las use.

## 6. Principios que no se negocian

- PostgreSQL es la fuente única de verdad; Notion, Calendar, Drive, n8n e IA serán adaptadores futuros.
- Construir por cortes verticales completos, pequeños y verificables.
- Mobile-first para 360–430 px; luego tableta y escritorio.
- Una base maestra de tareas. Las bandejas son vistas filtradas, no tablas duplicadas.
- Capturar no es procesar; procesar no es planificar.
- `deadline_at` y `execution_date` son conceptos distintos.
- Completar archiva; no borra. Usar borrado lógico.
- El sistema recomienda; la usuaria decide.
- Reducir campos y decisiones en cada etapa.
- No anticipar módulos, tablas o integraciones “por si acaso”.
- No usar datos clínicos identificables de pacientes.
- RLS en toda tabla expuesta; denegar por defecto; secretos solo en servidor.

## 7. Ruta de construcción

### Fase 0 — Cimientos mínimos

Proyecto Next.js, TypeScript estricto, estilos base, layouts responsivos, variables sin secretos, Supabase de desarrollo, migraciones, autenticación de la propietaria, perfil básico, PWA mínima, lint/formato, ruta protegida y despliegue funcional.

### Fase 1 — Primer circuito utilizable

Orden funcional:

1. fundamento de datos y navegación;
2. botón global `+` y captura rápida;
3. Inbox y procesamiento;
4. Por planificar, Delegadas, En espera, Algún día y Completadas;
5. planificación;
6. Centro de Mando MVP;
7. cierre e historial.

No avanzar de etapa sin validar la anterior, excepto por una dependencia técnica mínima justificada.

### Después, no ahora

- Fase 2: áreas, sueños, máximo tres metas activas, planificación ampliada, rutinas y hábitos.
- Fase 3: colaboración y permisos granulares.
- Fase 4: integraciones, empezando por Google Calendar cuando exista necesidad validada.
- Fase 5: n8n.
- Fase 6: IA selectiva.
- Fase 7: MCP.
- Fase 8: escalamiento/offline avanzado/app nativa solo con evidencia.

## 8. Circuito funcional actual

```text
Capturar → Inbox → Procesar → Planificar → Hoy → Ejecutar → Cerrar → Archivar
```

### Botón global `+`

- **Tarea** (predeterminada): título obligatorio; normal → Inbox; exprés → Centro de Mando.
- **Evento:** con fecha → Calendario; sin fecha, proponer tarea.
- **Gasto:** → Finanzas o persistencia provisional separada.
- **Idea/asunto:** → Inbox propio.

Permitir capturas consecutivas: guardar, confirmar sin bloquear, limpiar campo y devolver foco. Ante error, conservar el texto. Eventos, gastos, ideas y tareas son entidades separadas.

### Procesamiento GTD adaptado

Campos: título, tipo operativa/estratégica, pilar, urgente, importante, fecha límite, recurrencia, checklist y ruta.

| Urgente | Importante | Sugerencia    |
| ------- | ---------- | ------------- |
| Sí      | Sí         | Atender ahora |
| No      | Sí         | Planificar    |
| Sí      | No         | Delegar       |
| No      | No         | Algún día     |

La sugerencia se puede cambiar. `En espera` es un estado posterior por bloqueo, no una ruta inicial.

### Transiciones esenciales

- Normal guardada → `inbox`.
- Exprés guardada → `express` y Centro de Mando.
- Atender ahora + hoy/mañana → `planned` y Hoy/Preparar mañana.
- Planificar → `to_plan`.
- Delegar → `delegated`, inicialmente `por_delegar` aunque aún no tenga responsable.
- Algún día → `someday`.
- Cualquier activa + bloquear → `waiting`.
- Completar/cancelar → Archivo.
- Toda transición importante → `task_history`.

Estados iniciales compatibles: `inbox`, `express`, `to_plan`, `planned`, `in_progress`, `waiting`, `someday`, `delegated`, `completed`, `canceled`.

### Centro de Mando MVP

Solo incluye:

- fecha completa, hora real y frase motivacional local;
- Tareas exprés;
- Hoy;
- Vencidas;
- Preparar mañana.

No incluir todavía Top 3 avanzado, energía/emoción, hábitos, rutinas, sesiones de enfoque, gráficos, indicadores por pilar ni IA.

## 9. Modelo de datos mínimo orientativo

Mantener semántica aunque los nombres se adapten al repositorio:

- `tasks`: identidad/auditoría, clasificación, procesamiento, planificación, bloqueo y cierre.
- `checklist_items`.
- relación muchos-a-muchos `task_contexts`.
- `task_delegations`.
- `recurrence_rules` separadas de ocurrencias ejecutables.
- `task_history`.
- `ideas`.
- entidades separadas para eventos y gastos.

No crear todas las tablas futuras en una sola migración. Crear únicamente lo necesario para el corte actual. Las recurrencias no deben generar infinitas instancias ni completar toda la serie al completar una ocurrencia.

## 10. Identidad visual resumida

MOSS es **editorial, sereno, sin prisa y aesthetic**: “El musgo no compite, cubre”.

- Primario musgo; fondos papel cálido; arcilla para destacados suaves.
- Spectral para voz editorial; Hanken Grotesk para interfaz.
- Iconos lineales, 1.6 px, redondeados, sin relleno ni multicolor.
- Ritmo espacial de 4 px; tarjetas suaves; una acción principal.
- Objetivos táctiles mínimos de 44×44 px.
- Móvil: barra inferior con captura central y menú Más.
- Escritorio: sidebar contraíble, topbar contextual, centro dominante y FAB.
- Semana inicia el domingo.
- Evitar rojos de ansiedad, saturación alta, sombras duras, exceso de badges, tablas anchas y modales para todo.
- Preferir drawer, edición inline y revelado progresivo.

Para tokens exactos, paleta de pilares y componentes, consultar el documento de diseño o `moss.css`.

## 11. Protocolo de trabajo por solicitud

Antes de editar:

1. leer este archivo;
2. ejecutar `git status` e inspeccionar estructura, código relacionado, migraciones y pruebas;
3. comprobar el bloque Estado actual contra evidencia;
4. identificar fase y etapa;
5. localizar con `rg` solo la sección documental necesaria;
6. proponer o ejecutar el corte vertical más pequeño que cumpla la solicitud;
7. señalar cualquier decisión de producto, datos o permisos que falte.

Durante la implementación:

- preservar cambios ajenos a la tarea;
- mantener reglas de negocio fuera de componentes visuales;
- ejecutar operaciones sensibles en servidor;
- validar entradas;
- contemplar carga, vacío, éxito y error;
- registrar migraciones y decisiones;
- no usar `any` como atajo;
- no desactivar RLS;
- no exponer secretos;
- no hacer reescrituras amplias si basta un cambio incremental.

Antes de cerrar:

1. ejecutar lint, tipos, build y pruebas relevantes disponibles;
2. verificar el recorrido móvil concreto;
3. documentar archivos cambiados, migraciones y decisiones;
4. actualizar el bloque Estado actual con evidencia breve;
5. indicar resultado, verificación, bloqueo real y siguiente acción exacta.

## 12. Definición de terminado

Un incremento está terminado solo si:

- cumple el comportamiento solicitado de extremo a extremo;
- persiste datos reales cuando corresponde;
- funciona primero en móvil y responde en pantallas mayores;
- contempla estados relevantes de interfaz;
- valida entradas y respeta autenticación/RLS;
- incluye migración si cambió el esquema;
- no introduce errores de lint, tipos o compilación;
- incluye pruebas proporcionales al riesgo;
- actualiza documentación y Estado actual;
- puede demostrarse con un recorrido concreto.

## 13. Cuándo pedir decisión

Detenerse y preguntar si la solicitud exige:

- cambiar una decisión aprobada;
- agregar tecnología reservada a otra fase;
- definir permisos o colaboración no especificados;
- elegir entre comportamientos funcionales con consecuencias distintas;
- borrar, migrar o reemplazar datos/trabajo existente;
- ampliar significativamente el alcance.

No preguntar por detalles que el código, este archivo o el documento específico ya resuelven.
