# MOSSIE — Documento 1
## Centro de Mando (Home)

**Versión:** 1.1
**Última actualización:** 14 de septiembre de 2026
**Estado:** Documento funcional autocontenido. No depende de ningún otro documento para entenderse.
**Cambios en esta versión:** se añadió el detalle de qué muestra cada pilar en el Home, los patrones de interacción reutilizables y la capa de motivación.

---

## Cómo leer este documento

El Centro de Mando (o **Home**) es la pantalla principal de MOSSIE: la primera que se abre cada día. Este documento explica **qué es**, **qué muestra**, **cómo se comporta** y **cómo va a crecer**.

Está escrito para entenderse solo. No hace falta abrir ningún otro archivo. Cuando algo aún no está definido en profundidad, se dice explícitamente: *"pendiente de detallar más adelante"*.

> **La idea en una frase:** el Home reúne **todo lo que corresponde a hoy** —de todas las áreas de tu vida—, tú lo vas ejecutando y marcando **sin entrar a ninguna otra pantalla** y **sin tener que pensar qué sigue**.

> **Para qué sirve, en el fondo:** que seas **imparable, enfocada, con claridad y avanzando**. Todo lo que hace el Home debe empujar hacia eso; si un elemento no aporta a ejecutar el día o a sostener la motivación, no va en el Home.

---

## Este documento crecerá con la aplicación

MOSSIE se construye por partes. Hoy existen unas pocas áreas; con el tiempo se sumarán muchas más. **El Home está diseñado para escalar:** cada área nueva se "enchufa" mostrando su propia tarjeta de *hoy*, sin rediseñar la pantalla.

- A medida que la web avance, **el Home mostrará más cosas** y este documento se ampliará.
- Lo de aquí es la **base estable**; encima se agregan pilares.
- Ninguna versión futura rompe lo construido: solo suma.
- Lo que sigue es la **intención de lo que quiero mostrar**. Con el avance se quitarán y agregarán cosas.

En resumen: **no es un punto final, es un punto de partida que sigue escalando.**

---

## 1. Qué es el Centro de Mando

El Home es una **superficie de ejecución**: sirve para *hacer* el día, no para planificarlo ni configurarlo.

Funciona como un **agregador de "hoy"**: cada área le entrega al Home un resumen de lo que toca hoy, y el Home lo compone en una sola pantalla ordenada.

Tres reglas que gobiernan todo lo demás:

1. **Hoy primero.** El Home muestra lo de hoy. Lo de otros días vive en los planificadores; lo sin fecha, en "Algún día". La única excepción es una **mirada operativa mínima** que protege el día: vencidas importantes, pagos próximos o vencidos, preparación de mañana y una **Mirada de mañana** en solo lectura.
2. **Lo vacío se oculta.** Si hoy no hay clase del bebé o no toca ejercicio, esa tarjeta no aparece.
3. **El Home no es dueño de la información.** No guarda copias: consulta cada área, muestra su rebanada de "hoy" y, al marcar o cambiar algo, lo escribe en el dato original.

**Regla de oro:** el Home organiza *cómo se ven y se ejecutan* las cosas; cada área conserva su propia lógica. El Home nunca decide reglas de finanzas, salud, hogar, etc.

---

## 2. Patrones de interacción reutilizables

Estos comportamientos se repiten en casi todos los pilares. Se definen **una sola vez aquí** y aplican en todo el Home. Así el sistema se siente consistente y el documento no se repite.

**a) Modo ejecución vs. modo lectura.**
- *Ejecución* (lo de hoy): puedo marcar, editar y actuar.
- *Lectura* (lo de mañana): versión compacta, pequeña, **sin acciones**, solo para ver el panorama y no agarrarme por sorpresa.
Todo lo de mañana —tareas, eventos, cumpleaños, pagos, comidas, mantenimiento— se agrupa en una única **Mirada de mañana** en modo lectura.

**b) Tocar para ver el detalle.** Muchas tarjetas muestran solo título (y a veces foto). Al tocarlas se abre su detalle: pasos del ejercicio, receta, lección, contenido de la clase, etc.

**c) Menú de tres puntos.** En cualquier elemento accionable, el menú "⋮" ofrece: **Editar · No realizar hoy · Marcar como completado · Abrir en sesión de enfoque · Poner en cola.**

**d) Cola y sesión de enfoque.** Casi todo lo ejecutable (tarea, rutina, receta, lección, estudio) puede **mandarse a la cola** o **abrirse directo en una sesión de enfoque**.

**e) Al completar.**
- Las **prioridades (Top 3)** se **tachan y colapsan**, pero quedan visibles como **logro del día** (efecto motivador).
- Las **tareas normales** completadas se **archivan** en un registro. No es que "desaparezcan": ese registro alimenta el conteo de logros del día y la **medición de patrones** (qué haces, cuándo, con qué energía).

**f) "Mi forma de hacerlo" (motor de energía).** MOSSIE toma tu **energía actual** y ajusta lo que te propone: cuando estás con baja energía, **colapsa o baja de prioridad** lo que exige mucha concentración y **resalta lo que sí puedes hacer ahora**. Aplica a tareas, rutinas de ejercicio y sesiones de enfoque. La decisión final siempre es tuya.

**g) Lista de compra única.** Existe **una sola lista de compra** para todo (limpieza, comida, bebé, higiene, belleza…). Cualquier pilar que detecte algo por comprar (un producto por terminarse, un ingrediente faltante) lo agrega a esa misma lista.

**h) Ocultar lo vacío.** Si hoy algo no aplica, no ocupa espacio.

---

## 3. Cómo se conectan las áreas (el contrato de "hoy")

Para que sumar áreas sea casi automático, **todas usan el mismo formato de tarjeta**. El Home solo las recibe y las pinta. Cada tarjeta trae: título, prioridad visual (`crítica · importante · secundaria · opcional`), si hoy aplica, orden, acciones disponibles, contenido de hoy y si es decorativa.

- **Orden:** el Home ordena por prioridad visual, no por área.
- **Carga progresiva:** al abrir carga primero lo crítico (estado del día + ejecución); el resto se carga al bajar. La pantalla abre rápido aunque haya muchas áreas.
- **Resiliencia:** si una tarjeta falla, se oculta y se registra el error; **no tumba el Home**.

---

## 4. Cómo se ve la pantalla (layout)

El orden de importancia es siempre el mismo; cambia la disposición según el dispositivo.

### En el celular (uso principal): una sola columna
1. Encabezado: título, fecha, hora, frase/versículo y **disponible para gastar**.
2. Franja de atención (solo si aplica): vencidas, recordatorios, sesión en pausa.
3. Captura rápida y Procesar Inbox.
4. Prioridades del día (Top 3).
5. Tareas de hoy.
6. Hábitos y demás acciones de hoy.
7. Bienestar, sesión de enfoque, guía del día, pilares y accesos (tarjetas colapsables).
8. Mirada de mañana (lectura).
9. Cierre del día.

### En computadora: encabezado + tres columnas (25% / 50% / 25%)
- **Encabezado a todo el ancho:** título, fecha, hora pequeña, frase/versículo y disponible para gastar.
- **Columna izquierda (registrar e iniciar):** ánimo/energía pendiente, estado operativo, iniciar/retomar sesión, cronómetro y mini guía del día.
- **Columna central (ejecutar):** Top 3, tareas de hoy, hábitos, rutinas, eventos que requieran detalle, cola de enfoque y cierre.
- **Columna derecha (consultar y acceder):** próximos, seguimientos, rachas, periodo estratégico, lectura de hoy, pagos, suplementos, proyectos/metas y accesos.

**Criterio de ubicación:** si algo necesita explicación, varios campos o interacción compleja, va en la **columna central** o abre una ventana. Las laterales solo muestran versiones compactas.

**Encabezado en tres niveles:** (1) fecha a la izquierda + hora pequeña a la derecha; (2) título; (3) frase o versículo con su referencia. Nunca se convierte en tarjeta gigante ni contiene listas de tareas.

---

## 5. Las zonas del Home (dónde vive cada cosa)

El orden de zonas (1 → 5) es la jerarquía fija del Home.

### Zona 1 — Cabecera, captura y estado
- **Título, fecha completa y hora en tiempo real.**
- **Frase o versículo del día**, de una biblioteca curada por ti (MOSSIE nunca inventa el texto).
- **Disponible para gastar:** la **suma del dinero disponible de todas las cuentas** (no el bloqueado). Solo el número general va aquí arriba; el detalle por cuenta/área/categoría vive en la pestaña Resumen.
- **Captura rápida (+):** botón siempre a la mano, porque una idea o tarea puede surgir en cualquier momento. Captura y sigue; se procesa después.
- **Procesar Inbox:** botón con **contador de pendientes**, para saber de un vistazo qué tan urgente está el Inbox.
- **Barra de progreso del día** (tareas + eventos).
- **Top 3 del día** y **Quick menu** (ver §8).

### Zona 2 — Bienestar y constancia (indicadores)
Panel de un vistazo, **configurable y colapsable**. Incluye ánimo, energía y sueño (ver §6.1), agua (resumen; el checklist se marca en Zona 3), rachas y progreso de hábitos. *(Los hábitos llevan progreso propio y no suman a la barra global.)*

### Zona 3 — Ejecución del día (el núcleo)
Reúne lo que hay que hacer hoy y responde en segundos: **qué es imprescindible, qué sigue y cuándo conviene hacerlo.** Contiene Top 3, lista de tareas de hoy, hábitos, agua (checklist), eventos de hoy, guía del día y los seguimientos. El detalle de tareas y eventos está en §6.2.

### Zona 4 — Lo que toca hoy desde cada pilar
Aquí cada pilar muestra su rebanada de hoy (comida, salud, espiritualidad, estudio, hogar, familia, trabajo, pagos, etc.). El detalle está en §7.

### Zona 5 — Cierre del día
Preparar mañana (comida, ropa, bultos), checklist de cierre editable, y **reflexión + calificación del día**. Ver §11.

### Vista hermana: pestaña "Resumen de hoy"
Métricas filtradas solo a hoy, para ver avance sin entrar a análisis históricos. Ver §10.

---

## 6. Ejecución y bienestar en detalle

### 6.1 Ánimo, energía y sueño

Al abrir la sección de bienestar por la mañana, MOSSIE pregunta: **hora en que me acosté, hora en que me levanté, si dormí en casa y cuántas veces (aprox.) se interrumpió el sueño.** Con eso —más si hice mi rutina de sueño de la noche anterior— **el sistema evalúa la calidad de sueño** (no la pregunta directo: la deriva). También pregunta **ánimo y energía**.

El registro de **ánimo y energía se hace 3 veces al día** (mañana, alrededor de la 1–2 p. m. y en el cierre). Cada registro guarda su hora real y **modifica el Centro de Mando**: si me levanté con mucha energía pero a la 1 p. m. ya estoy baja, el Home **colapsa las tareas que piden alta energía y concentración** y resalta lo que sí puedo hacer ahora (patrón "Mi forma de hacerlo", §2f).

### 6.2 Tareas y eventos del día

**Ruta del Inbox → ejecución:**

| Elemento | Dónde y cómo aparece |
|---|---|
| Tareas planificadas para hoy | Columna central, **modo ejecución** (marcar, editar, ★, sesión de enfoque). |
| Próxima acción (tareas de mañana) | **Modo lectura**, tamaño pequeño, dentro de la Mirada de mañana. Solo para ver el panorama. |
| Tareas en espera con fecha límite | Aparecen **cuando están próximas a vencer (1–3 días antes)**, en una sección compacta de seguimiento. |
| Tareas delegadas | Se trabajan **como tareas normales de hoy** (el seguimiento es tarea mía), junto al resto, con un **identificador** que las marca como delegadas. |
| Tareas vencidas importantes | Sección compacta y colapsable de seguimiento. |

**Top 3 (prioridades):** son las tareas más importantes del día. **No se repiten** en la lista de tareas de hoy (si están en el Top 3, se muestran solo arriba). Al completarlas se tachan y colapsan, y quedan visibles como logro.

**Al completar tareas normales:** se archivan en un registro que alimenta los logros del día y la medición de patrones (§2e).

**Eventos de hoy:** cumpleaños, reuniones, citas, eventos especiales. Van en **su propia sección**, separados de las tareas (hora, título, lugar, persona), pero **sí cuentan en la barra global** cuando pueden marcarse como realizados. Los eventos de mañana van en la Mirada de mañana (lectura).

**Iniciar enfoque desde una tarea:** cada tarea puede abrir una sesión de enfoque vinculada, usando su título como objetivo. Si ya hay una sesión activa, obliga a decidir qué hacer con ella antes de empezar otra.

---

## 7. Qué muestra cada pilar en el Home

Cada pilar entrega su tarjeta de "hoy". Todos usan los patrones de §2 (tocar para ver detalle, menú ⋮, cola/sesión de enfoque, modo lectura para mañana, ocultar lo vacío).

### Finanzas
- **Disponible para gastar** (suma del disponible de todas las cuentas) arriba, en Zona 1.
- **Pagos del día.** Cada pago tiene botón **"Pagar"**:
  - Si es **manual**: al tocar "Pagar" muestra **de qué cuenta** saldrá.
  - Si es **automático**: solo **confirmo** que se realizó y se descontó de la cuenta programada.
  - **Reprogramar pago:** con una breve explicación de por qué no en esa fecha (opcional).
- **Recurrentes** (suscripciones, pagos de deudas, etc.) aparecen **en su fecha debida**, sin que yo tenga que recordarlos.
- **Pagos de mañana:** en la Mirada de mañana (lectura), junto a tareas y eventos.
- **En la pestaña Resumen:** detalle por cuentas, áreas y categorías, para hacer "rejuegos".

### Salud
- **Ánimo, energía y sueño:** ver §6.1.
- **Rutina de ejercicio:** si hoy toca, aparece una tarjeta clickeable con **solo título + foto de portada** ("rutina para hoy"). Si no toca, **no aparece nada**. Al tocar, se ve la rutina **paso a paso por ejercicio**. El menú ⋮ ofrece editar, no realizar, marcar completado, abrir en sesión de enfoque o poner en cola. Con "Mi forma de hacerlo", propone **cuál rutina puedo hacer hoy según mi energía actual**. Su progreso va al Resumen del día.
- **Comida personal:** metas y progreso de **calorías y proteínas** (se gestionan desde Salud). Van en la pestaña Resumen; el planificador de comidas se ve en el pilar Comida.
- **Suplementos:** según el horario que corresponda, aparecen las **fotos de los suplementos** para marcar si los tomé. **Permanecen visibles hasta que los tome o hasta que termine el día.** No se "vencen": MOSSIE no me reprocha no haber tomado el de ayer.
- **Hidratación:** checklist de **vasos de agua** del día (meta base **8 vasos**, puedo agregar más). Cada vaso = 200 ml; puede verse en vasos y en ml.

### Comida
Dividida en **personal** (desde Salud, para calorías/proteínas) y **familiar** (desde Hogar). Ambas **comparten inventario, recetas y planificador**; el Home solo muestra lo que corresponde.
- **Hoy con fotos:** desayuno, almuerzo y cena. Cada comida es clickeable → **receta en su interior**; se puede **poner en cola de sesión de enfoque** (cocinar).
- **Mañana en modo lectura:** solo el título de cada comida.
- **Lista de compra** y planner del día se muestran de forma apropiada (la lista de compra es la única, §2g).
- **Metas y progreso** de calorías/proteínas → pestaña Resumen.

### Espiritualidad
- **Capítulo y lección** que tocan hoy, con opción de **marcar como completado** y **agregar a sesión de estudio**.
- **Motivo de oración del día.**
- **Próximos eventos** del pilar → en la Mirada de mañana / próxima acción.
- **Tareas** del pilar → entre las tareas de hoy o mañana según corresponda.

### Estudio
- **Qué capítulo estudiar hoy, exámenes, prácticas y tareas por entregar**, en su sección; se pueden **poner en cola** o **abrir en sesión de enfoque de estudio**.
- **Aviso de fin de periodo:** cuando un periodo se está terminando, MOSSIE me notifica.

### Imagen y proyección
- **Rutinas pendientes del día**, **citas**, y **productos próximos a terminarse** para reposición (estos alimentan la lista de compra única).

### Familia y amigos
- **Eventos y cumpleaños** de hoy (ejecución) o mañana (lectura).
- **Tareas relacionadas** con ellos → en las tareas de hoy.
- **Recordatorio de contacto por vitalidad:** cuándo debo contactar o visitar a alguien para mantener viva la relación. **Solo aparece cuando es momento** de contactar por llamada, mensaje o visita.

### Familia nuclear
Se divide en dos:
- **Matrimonio:** proyectos activos, eventos, citas, reuniones del hogar y **problemáticas pendientes por hablar**, filtrado a hoy. **Bloque colapsado** por defecto. Incluye una **barra de vitalidad** basada en su satisfacción y la mía. *(La forma de capturar "su satisfacción" queda pendiente de detallar más adelante.)*
- **Maternidad:** rutina del día, **hito activo**, **"qué cosa nueva vi hoy que hizo por primera vez conmigo"**, y la **clase de estimulación temprana** del día.

### Trabajo
- **Registro de novedades** durante la ronda: si falta un colaborador o hay una situación, poder anotarla rápido con **nota de voz** (la ronda debe ser ágil). *(La nota de voz se guarda primero; la transcripción puede sumarse más adelante.)*
- **Checklist ordenado** de lo que debo hacer en mis días de trabajo.
- **Tareas de seguimiento** y posibilidad de agregar **tareas express** rápidas.

### Hogar
- **Tareas domésticas del día** y **zona del día** (rotación de limpieza).
- **Productos próximos a terminar** → a la lista de compra única.
- **Mantenimiento** de hoy o mañana (lectura).
- **Remodelación activa** y **eventos cercanos**.

### Negocio
**Bloqueada por ahora** (aún no iniciado). Se muestra como sección deshabilitada, lista para activarse cuando corresponda.

---

## 8. Acciones rápidas vs. accesos

- **Quick menu (ejecuta al instante, no navega):** Captura rápida (+), Procesar Inbox (con contador), Resumen del día, Lista de compra, Iniciar sesión. **Prohibido** poner aquí "Ir a Finanzas", "Ir a Configuración", etc.
- **Accesos directos (navegan a pantallas completas):** pilares, planificadores, calendario, etc. Van en su propia tarjeta, aparte, en la columna derecha.

Regla simple: **una acción rápida ejecuta; un acceso directo navega.**

---

## 9. Sesiones de enfoque

La herramienta de enfoque **es la cara visible de una "Sesión de trabajo"**, no un cronómetro aparte.

- **Al iniciar** se abre un **modal** para concentrarme, donde voy **rellenando los campos según corresponda** (objetivo, notas, y en las especializadas, los pasos propios de la actividad).
- **Controles:** detener, cancelar, próxima acción, completar. **No puedo tener dos sesiones activas al mismo tiempo.**
- **Al pausar:** puedo **reanudar**, y MOSSIE me pide **"¿por dónde me quedé?"** y **"¿cuál es la próxima acción?"** para **recuperar el contexto rápido** al volver (se leen guardados, no se generan).
- **Sesiones normales:** pertenecen mayormente a **tareas del Inbox** que **duran lo suficiente** para que valga la pena trabajarlas en sesión.
- **Sesiones especializadas:** rutinas o actividades recurrentes (ejercicio, estudio, culto, cocina…) que se abren desde una plantilla configurable. Se apoyan en **"Mi forma de hacerlo"** para proponer la versión adecuada a mi energía actual. Cada una guarda sus datos en su propio pilar.
- **Cola de enfoque:** puedo preparar varios elementos; al terminar uno, ofrece el siguiente sin obligarme a decidir de nuevo (pero no lo inicia sin confirmar).

---

## 10. Pestaña "Resumen de hoy"

Segunda vista del Home. Muestra solo datos **ya generados hoy**, para ver el avance sin entrar a análisis históricos:

- Progreso de tareas, eventos y hábitos; **logros del día** (incluye lo archivado).
- Agua, sesiones y tiempo enfocado.
- **Ánimo/energía a lo largo del día** (respetando la hora real de cada registro).
- **Calorías y proteínas:** metas y progreso.
- **Finanzas:** detalle por cuentas, áreas y categorías para rejuegos.
- **Proyectos, objetivos y metas:** las barras de progreso, más claras que en Home.

Las tendencias históricas complejas pertenecen a un módulo de análisis, **pendiente de detallar más adelante**.

---

## 11. Cierre del día

Última sección, abajo. Incluye **preparar mañana** (comida, ropa, bultos), un **checklist de cierre editable** (agregar, quitar o pausar ítems; se resetea cada día a medianoche) y la **reflexión + calificación del día**.

Ítems de arranque del checklist:
- [ ] Vi la planificación de comida de mañana
- [ ] Preparé la ropa y los bultos de mañana
- [ ] Hice el resumen y la calificación del día
- [ ] Registré mis gastos del día
- [ ] Contacté a las personas pendientes
- [ ] Leí la Biblia
- [ ] Vacié el Inbox

*(No incluye "definir prioridades de mañana": las prioridades se marcan con ★ en cualquier momento, sin ritual nocturno.)*

---

## 12. Time blocking (guía del día)

Guía rápida de **cómo dividir mi tiempo hoy**: qué grupo de tareas conviene hacer en cada franja. Es una **guía visual**, no contiene tareas dentro ni tiene checkbox.

**Alcance por ahora:** solo quiero **poder modificarlo** y **verlo en el Home** para guiarme. Lo demás (que se genere solo, que se sincronice con la planificación semanal) queda pendiente de detallar más adelante.

---

## 13. Proyectos, objetivos, metas y recompensas

- **Proyectos, objetivos y metas activas** con sus **barras de progreso**: versión **mini en el Home** y **más clara en el Resumen**.
- **Recompensas de mis logros siempre visibles.** Este es un principio, no un adorno: ver el avance y las recompensas en la misma pantalla sostiene la motivación mejor que solo tachar tareas. Si mostrar los logros del día produce más efecto que ocultarlos, **se muestran**.

---

## 14. Continuidad e inteligencia (propone, yo confirmo)

Tres ayudas que **solo aparecen cuando aportan algo** (si no, no se muestran):

- **Retomar la sesión:** si hay una sesión en pausa, el Home la ofrece arriba; retomar recupera el contexto en menos de 10 segundos (leído, no generado) y reanuda de verdad.
- **Copiloto sereno:** una línea discreta señala lo que conviene notar (p. ej. "llevas cinco cambios de tarea esta mañana", "tu energía viene bajando"), sin alarmas rojas. Propone, nunca actúa solo; puedo descartarlo.
- **Qué hacer ahora según tu energía:** empareja mi energía actual con la que pide cada tarea y sugiere lo viable ahora ("Mi forma de hacerlo").

**Principio firme:** la inteligencia **nunca** marca tareas, mueve dinero ni replanifica sola. Propone; yo confirmo.

---

## 15. Conceptos que no se deben mezclar

| Concepto | Qué es | ¿Se completa? |
|---|---|---|
| Prioridad (Top 3) | Una tarea de hoy marcada como top; no se repite en la lista | Sí, es la misma tarea |
| Tarea | Una acción única | Sí |
| Hábito | Acción recurrente cuya constancia se mide | Sí, con su registro |
| Rutina | Secuencia ordenada de pasos recurrentes | Se completa la ejecución |
| Proyecto | Resultado que necesita varias tareas | Avanzan sus tareas |
| Bloque de tiempo | Franja orientativa del día | No; es una guía |
| Evento | Compromiso con fecha, hora y lugar | Puede marcarse realizado |
| Sesión | Período de ejecución con enfoque | Sí, al terminar |

**Origen de una tarea:** puede nacer de un **proyecto** (no pasa por Inbox), por **captura** (sí pasa por Inbox) o desde un **pilar** con recurrencia (no pasa por Inbox; ej.: limpieza, plan del bebé, ejercicio).

---

## 16. Reglas de negocio (las que no se rompen)

1. **Solo hoy** en las tarjetas; **lo vacío se oculta**. Lo de mañana va en modo lectura.
2. **Marcar actualiza el progreso al instante.**
3. **Captura rápida siempre accesible**; el Inbox se procesa aparte, con contador.
4. **Prioridades no se duplican:** el Top 3 se muestra solo arriba.
5. **Al completar:** prioridades se tachan y colapsan (logro visible); tareas normales se archivan (registro + patrones).
6. **Delegadas = tareas de hoy** con identificador; el seguimiento es mío.
7. **En espera** solo aparecen cuando faltan **1–3 días** para vencer.
8. **Sin alarmas rojas ni lenguaje de culpa.** Todo avisa con tono sereno.
9. **Ánimo/energía 3 veces al día**; cada registro reajusta qué resalta o colapsa el Home según la energía.
10. **Calidad de sueño se deriva**, no se pregunta directo.
11. **Suplementos** permanecen hasta tomarse o hasta fin del día; no se reprochan al día siguiente.
12. **Una sola lista de compra** para todos los pilares.
13. **Pagos:** manual → "Pagar" muestra la cuenta; automático → solo confirmo; reprogramar con nota opcional.
14. **Disponible para gastar** = suma del disponible de todas las cuentas (no el bloqueado); el detalle va al Resumen.
15. **Una sola sesión de enfoque activa** a la vez; pausar guarda "por dónde me quedé" y "próxima acción".
16. **El bloque de tiempo no contiene tareas.**
17. **El Home no inventa datos:** si un pilar no existe (o Negocio, que está bloqueado), su tarjeta no se muestra.
18. **La inteligencia propone, yo confirmo.**
19. **Los logros y recompensas se mantienen visibles** para sostener la motivación.

---

## 17. Principios de diseño y motivación

1. **Claridad sobre densidad.** Ante la duda, mostrar menos. Zonas claras, tarjetas colapsables, ocultar lo vacío y visibilidad configurable.
2. **Sereno, sin culpa.** Nada de rojos agresivos ni números de ansiedad. Lo no hecho no se castiga; se reprograma.
3. **Motivación visible.** Logros del día, rachas y recompensas a la vista, en la misma pantalla que la ejecución.
4. **Se adapta a mi energía**, no al revés (§2f, §6.1).
5. **Un solo siguiente paso.** El Home siempre deja claro qué hacer ahora; nunca me deja pensando "¿y ahora qué?".
6. **Guardar primero.** Lo que registro (incluida la nota de voz de la ronda) se guarda de inmediato, aunque la sincronización o la inteligencia vengan después.

---

## 18. Riesgos a cuidar mientras el Home escala

1. **Sobrecarga visual** (el riesgo #1: es muchísima información). → Ocultar lo vacío, colapsables, visibilidad configurable, tres columnas en escritorio y el motor de energía que colapsa lo que no aplica ahora. **La disciplina en esto es lo que hace que el Home dé claridad en vez de abrumar.**
2. **Rendimiento** al reunir datos de muchos pilares. → Vista "hoy" consolidada + carga progresiva.
3. **Dependencia de muchos pilares.** → El contrato de "hoy" permite construirlo tarjeta por tarjeta.
4. **Datos incompletos de un pilar.** → El Home no calcula lógica ajena ni inventa datos.

---

## 19. Orden de construcción (por fases)

**Fase A — Home ejecutable mínimo.** Encabezado con hora, frase/versículo y disponible para gastar; captura rápida y Procesar Inbox con contador; layout responsive; Top 3 sin duplicar; tareas de hoy (con delegadas identificadas) y eventos separados; hábitos; agua; ánimo/energía en 3 ventanas con reajuste por energía; guía del día editable; sesión de enfoque simple con pausa/reanudar y recuperación de contexto; Mirada de mañana en lectura; cierre del día con reflexión; ocultar lo vacío y tolerar fallos de una tarjeta.

**Fase B — Pilares y continuidad.** Tarjetas de hoy de cada pilar (salud/ejercicio, comida con fotos, suplementos, espiritualidad, estudio, hogar, familia, trabajo, finanzas/pagos); cola de enfoque; sesiones especializadas; "Mi forma de hacerlo"; lista de compra única; pestaña Resumen; barras de proyectos/metas y recompensas visibles.

**Fase C — Integraciones e inteligencia.** Copiloto y sugerencias por energía; análisis histórico y patrones; transcripción de notas de voz; automatizaciones; activación de Negocio.

### Criterios mínimos de aceptación
1. Marcar una prioridad actualiza la tarea original y no deja copia abajo.
2. Una tarea normal completada se archiva y alimenta el registro; una prioridad completada queda visible como logro.
3. Una tarea delegada aparece entre las de hoy con su identificador.
4. Las tareas en espera solo aparecen a 1–3 días de vencer.
5. Un pago manual muestra la cuenta al pagar; uno automático solo se confirma.
6. Al bajar la energía a mediodía, el Home colapsa lo de alta concentración y resalta lo viable.
7. Al pausar y retomar una sesión se conservan tiempo, "por dónde me quedé" y próxima acción.
8. Un suplemento sin tomar sigue visible hasta el fin del día y no se reprocha al día siguiente.
9. Una tarjeta sin datos no ocupa espacio; una con error no derriba el Home.
10. En celular se mantiene el orden de importancia, sin tres columnas apretadas.
11. La pantalla abre y permite ejecutar lo esencial aunque las integraciones o la inteligencia no estén disponibles.

---

## 20. Puntos a afinar (honesto, para no olvidarlos)

Estos quedan **pendientes de detallar más adelante**; no bloquean el arranque:
- Cómo se captura "la satisfacción de él" para la barra de vitalidad del matrimonio.
- Cómo se define y se detecta la "rutina de sueño de la noche anterior" que entra en la calidad de sueño.
- La transcripción de las notas de voz del trabajo (por ahora, solo se guarda el audio).
- Reglas finas del time blocking (por ahora: solo modificar y ver).
- El módulo de análisis histórico (el Resumen de hoy cubre lo del día; las tendencias vienen después).

---

*Fin del Documento 1 — Centro de Mando (Home) de MOSSIE.*
*Base estable del Home; se ampliará a medida que la aplicación crezca.*
