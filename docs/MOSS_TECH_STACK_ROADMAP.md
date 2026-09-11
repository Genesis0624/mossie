# MOSS — Stack tecnológico y ruta progresiva de construcción

**Versión:** 1.0  
**Propósito:** documento rector para Claude Code y para cualquier desarrollador que trabaje en MOSS.  
**Principio central:** construir una aplicación útil desde el primer incremento, sin instalar ni desarrollar capacidades que todavía no se necesitan.

---

## 1. Visión técnica

MOSS (My Own Simple System) es una aplicación personal de gestión integral de vida. Debe reducir la carga mental de su propietaria y mostrarle con claridad qué necesita hacer a continuación. Tendrá múltiples módulos, pero se construirá por etapas y mediante cortes verticales completos.

La aplicación debe funcionar en celular, tableta y computadora. El celular es el dispositivo principal para la ejecución diaria, el Centro de Mando y el Vaciado Mental. La tableta y la computadora se utilizarán principalmente para planificación, configuración, revisión y análisis.

MOSS será inicialmente una aplicación web progresiva (PWA), móvil primero. No se desarrollarán aplicaciones nativas separadas para Android o iOS durante la primera etapa.

La arquitectura debe permitir en el futuro:

- múltiples usuarios con acceso limitado por rol y por recurso;
- automatizaciones mediante n8n;
- integraciones con Google Calendar, Google Drive, Notion y otros servicios;
- llamadas selectivas a modelos de inteligencia artificial;
- conexión con asistentes mediante MCP;
- crecimiento modular sin reescribir el núcleo;
- exportación y migración de los datos.

Estas capacidades futuras deben ser posibles, pero no deben implementarse antes de que exista una necesidad funcional comprobada.

---

## 2. Decisión arquitectónica principal

La base aprobada es:

- **Frontend y aplicación web:** Next.js con App Router.
- **Lenguaje:** TypeScript en modo estricto.
- **Interfaz:** React, Tailwind CSS y componentes de shadcn/ui adaptados al sistema visual de MOSS.
- **Base de datos:** PostgreSQL administrado inicialmente mediante Supabase.
- **Autenticación:** Supabase Auth.
- **Autorización:** Row Level Security (RLS) de PostgreSQL más un modelo propio de miembros, roles y permisos.
- **Validación:** Zod en las fronteras de entrada de datos.
- **Despliegue inicial:** Vercel para la aplicación y Supabase administrado para datos y autenticación.
- **Control de código:** repositorio Git privado perteneciente a la propietaria.
- **Gestor de paquetes:** pnpm.

No agregar otra base de datos, otro framework de frontend, un backend paralelo o un ORM sin una necesidad demostrable y una decisión arquitectónica documentada.

### Política de versiones

Al iniciar el repositorio se usarán versiones estables compatibles entre sí. Las versiones exactas quedarán fijadas en `package.json` y `pnpm-lock.yaml`. Este documento no debe obligar al proyecto a versiones que puedan quedar obsoletas.

---

## 3. Principios obligatorios de construcción

### 3.1 Móvil primero

Cada pantalla se diseña primero para un ancho aproximado de 360–430 px. Luego se adapta a tableta y escritorio. La interfaz debe poder utilizarse cómodamente con una mano cuando la acción lo permita.

Requisitos mínimos:

- objetivos táctiles de al menos 44 × 44 px;
- navegación principal accesible con el pulgar;
- formularios breves y progresivos;
- botón de captura siempre fácil de alcanzar;
- estados vacíos, carga, error y confirmación;
- contraste y tipografía legibles;
- no depender de acciones que solo funcionen con hover;
- evitar tablas anchas en las funciones de uso diario.

### 3.2 Construcción por cortes verticales

Una función se considera construida cuando incluye, según corresponda:

1. experiencia móvil;
2. validación;
3. persistencia real;
4. seguridad y autorización;
5. estados de carga, vacío y error;
6. prueba de su comportamiento crítico.

No construir primero decenas de tablas, pantallas falsas o servicios futuros. Cada incremento debe producir una parte utilizable del sistema.

### 3.3 Fuente única de verdad

PostgreSQL será la fuente oficial del estado operativo de MOSS. Notion, Google Calendar, Drive y n8n serán servicios conectados, no la base principal.

### 3.4 Portabilidad y propiedad

- El esquema se controlará mediante migraciones SQL versionadas.
- Los secretos nunca se guardarán en el repositorio.
- Los datos deben poder exportarse.
- La lógica esencial no debe existir únicamente en Vercel, n8n, Notion o un proveedor de IA.
- Las integraciones externas deben estar detrás de adaptadores o servicios internos.

### 3.5 Simplicidad deliberada

No implementar una tecnología porque “podría hacer falta”. Incorporarla cuando exista un problema real, un caso de uso aprobado y un criterio de entrada cumplido.

---

## 4. Stack que se utilizará desde el inicio

### 4.1 Herramientas iniciales obligatorias

| Tecnología          | Uso inicial                                         |
| ------------------- | --------------------------------------------------- |
| Next.js App Router  | Rutas, layouts, renderizado y funciones de servidor |
| React               | Componentes e interacción de interfaz               |
| TypeScript estricto | Tipado y prevención de errores                      |
| Tailwind CSS        | Estilos responsivos y tokens visuales               |
| shadcn/ui           | Base de componentes accesibles y modificables       |
| Supabase PostgreSQL | Persistencia relacional                             |
| Supabase Auth       | Cuenta inicial de la propietaria                    |
| RLS                 | Protección de registros desde la base               |
| Zod                 | Validar datos que entran al sistema                 |
| pnpm                | Dependencias y scripts                              |
| Git                 | Historial y recuperación del código                 |
| ESLint y Prettier   | Calidad y formato consistentes                      |

### 4.2 Herramientas permitidas cuando aparezca el primer caso concreto

- React Hook Form: cuando los formularios superen la captura mínima o requieran validaciones de varios campos.
- dnd-kit: cuando se construyan planificadores con arrastrar y soltar.
- Recharts: cuando haya indicadores que realmente necesiten gráficos.
- Vitest y Testing Library: para lógica y componentes con comportamiento crítico.
- Playwright: para recorridos completos esenciales como captura, procesamiento y ejecución.
- Sentry u observabilidad equivalente: cuando la aplicación empiece a utilizarse fuera del entorno local de forma regular.

Claude no debe instalar todas estas dependencias al crear el proyecto. Debe incorporarlas en el primer incremento que las necesite.

---

## 5. Ruta progresiva de implementación

Las fases indican evolución técnica, no una lista cerrada de todas las funciones del producto. Los requisitos funcionales de cada módulo vivirán en sus documentos específicos.

### Fase 0 — Cimientos mínimos

**Objetivo:** disponer de un proyecto seguro, ejecutable y preparado para desarrollar el primer flujo real.

Construir únicamente:

- repositorio y proyecto Next.js;
- TypeScript estricto;
- Tailwind y base del sistema visual;
- estructura mínima de layouts móvil/tableta/escritorio;
- variables de entorno con archivo de ejemplo sin secretos;
- proyecto Supabase de desarrollo;
- migraciones SQL versionadas;
- autenticación de la propietaria;
- perfil básico de usuario;
- PWA instalable en su forma mínima;
- configuración de lint, formato y scripts esenciales;
- una ruta protegida y una verificación básica de funcionamiento.

No construir todavía n8n, IA, MCP, Google Calendar, Notion, Drive, permisos complejos ni todos los módulos de datos.

**Criterio para cerrar la fase:**

- la propietaria puede iniciar sesión desde celular y computadora;
- la sesión está protegida;
- la aplicación se adapta a ambos tamaños;
- una migración puede recrear el esquema inicial;
- el proyecto puede desplegarse sin errores;
- no hay secretos expuestos en el repositorio.

### Fase 1 — Primer núcleo utilizable

**Objetivo:** crear el recorrido mínimo que reduzca carga mental desde el primer uso.

Orden funcional recomendado:

1. Centro de Mando mínimo.
2. Botón universal de Vaciado Mental.
3. Captura rápida de tarea con título y guardado inmediato.
4. Inbox de tareas.
5. Procesamiento GTD adaptado a la realidad de la propietaria.
6. Planificación básica del día.
7. Ejecución y marcado como completado.

Construir solamente las tablas y reglas necesarias para este flujo. El modelo debe admitir expansión mediante migraciones, pero no debe incluir campos especulativos sin uso aprobado.

**Criterio para cerrar la fase:**

- se puede capturar una tarea en pocos segundos desde el celular;
- la tarea aparece en Inbox;
- se puede procesar, planificar para un día, visualizar en Hoy y completar;
- recargar o cambiar de dispositivo conserva el estado;
- las políticas RLS impiden acceso anónimo;
- el recorrido crítico tiene al menos una prueba automatizada de extremo a extremo.

### Fase 2 — Núcleo estratégico y planificación

**Objetivo:** relacionar la ejecución diaria con áreas, sueños y metas activas.

Incorporar progresivamente:

- áreas de vida;
- sueños;
- metas;
- activación trimestral con límite definido;
- relación entre metas y tareas estratégicas;
- planificadores semanal, mensual y trimestral;
- rutinas y hábitos cuando su flujo funcional esté completamente definido;
- vistas ampliadas para tableta y computadora.

En esta fase pueden incorporarse dnd-kit y formularios más avanzados si los planificadores lo requieren.

**Criterio para avanzar:**

- el flujo diario funciona de manera estable;
- las metas activas pueden conectarse con acciones concretas;
- la propietaria utiliza el sistema con suficiente regularidad para validar las reglas;
- existen datos reales que justifican indicadores o automatizaciones.

### Fase 3 — Colaboración y permisos granulares

**Objetivo:** permitir que otras personas participen sin ver ni modificar información que no les corresponde.

Antes de invitar a alguien, crear:

- entidades de espacio personal o grupo de colaboración;
- miembros e invitaciones;
- roles generales;
- permisos por área, módulo, recurso y acción;
- asignación de tareas;
- registro de acciones relevantes;
- políticas RLS para cada tabla compartida;
- pruebas específicas de aislamiento de datos.

Los roles podrán incluir propietaria, familiar, colaborador, cuidador, personal del hogar e invitado, pero los nombres definitivos y permisos se definirán con casos reales.

**Criterio para comenzar esta fase:** existe al menos una persona real que necesita entrar y están definidos exactamente los datos y acciones que debe utilizar.

**Criterio para cerrarla:** dos cuentas con permisos diferentes han sido probadas y ninguna puede acceder a información fuera de su alcance, ni desde la interfaz ni mediante solicitudes directas.

### Fase 4 — Integraciones externas

**Objetivo:** conectar MOSS con servicios existentes sin perder el control del dato.

Orden recomendado, sujeto a necesidad real:

1. Google Calendar.
2. Google Drive.
3. Notion.
4. Otros servicios aprobados.

Cada integración debe incluir:

- adaptador interno;
- autorización segura;
- registro del identificador externo;
- control de sincronización;
- tratamiento de duplicados;
- estado de error y reintento;
- decisión explícita sobre qué sistema manda en cada dato.

**Regla:** no construir sincronización bidireccional por defecto. Empezar con el sentido mínimo necesario.

**Criterio para iniciar una integración:** existe una acción manual repetitiva o una duplicación de información suficientemente frecuente como para justificarla.

### Fase 5 — Automatizaciones con n8n

**Objetivo:** automatizar procesos estables y repetibles.

n8n actuará como orquestador. No será la fuente de verdad ni contendrá la única copia de reglas esenciales.

Primeros candidatos posibles:

- sincronizar eventos aprobados con Google Calendar;
- crear recordatorios externos;
- guardar o relacionar archivos en Drive;
- ejecutar resúmenes periódicos;
- disparar una llamada de IA solicitada desde MOSS.

Requisitos antes de activar un flujo:

- webhook autenticado;
- operación idempotente cuando pueda repetirse;
- registro de ejecución;
- manejo de fallos;
- posibilidad de reintentar sin duplicar información;
- secretos almacenados fuera del código.

**Criterio para iniciar esta fase:** el proceso ya se ejecuta correctamente de forma manual, se repite con frecuencia y sus reglas son estables.

### Fase 6 — Inteligencia artificial selectiva

**Objetivo:** utilizar IA donde reduzca trabajo cognitivo o mejore una decisión, manteniendo control de costos y privacidad.

La IA se consumirá a través de una capa interna independiente del proveedor. La interfaz no llamará directamente al modelo.

Cada función de IA debe declarar:

- propósito concreto;
- datos mínimos que necesita;
- acción que la activa;
- modelo o clase de modelo apropiado;
- límite de costo o uso;
- respuesta estructurada validada;
- comportamiento si la IA falla;
- si requiere confirmación antes de guardar cambios.

Primeros casos posibles:

- ayudar a procesar elementos de Inbox;
- comparar metas candidatas;
- sugerir una planificación según energía, urgencia y carga;
- analizar cierres semanales o mensuales.

No enviar toda la base de datos a un modelo. No permitir que la IA elimine, reprograme masivamente o comparta información sin confirmación explícita.

**Criterio para iniciar un caso de IA:** la función manual ya está definida, se conoce qué entrada y salida necesita y el beneficio esperado justifica su costo.

### Fase 7 — MCP y ecosistema de asistentes

**Objetivo:** permitir que asistentes autorizados consulten y ejecuten acciones controladas en MOSS.

El servidor MCP se construirá solo después de que las APIs internas, permisos y registros de auditoría sean estables. Expondrá herramientas pequeñas y explícitas, por ejemplo consultar tareas de hoy, capturar una idea o crear una tarea.

**Criterio para iniciar esta fase:** MOSS posee una API interna estable, autorización granular y casos claros en los que un asistente externo aporta valor.

### Fase 8 — Escalamiento y aplicación nativa, solamente si se justifican

Evaluar:

- caché y cola offline más avanzada;
- notificaciones push;
- procesamiento en segundo plano;
- aplicación nativa mediante Expo/React Native;
- alojamiento propio de servicios;
- colas de trabajo y observabilidad avanzada.

Estas decisiones requieren métricas o limitaciones comprobadas. La aplicación nativa no es un destino obligatorio.

---

## 6. Arquitectura lógica prevista

```text
Interfaz Next.js/PWA
        ↓
Capa de aplicación y casos de uso
        ↓
PostgreSQL/Supabase + RLS
        ↓
Adaptadores opcionales: n8n, Google, Notion, IA y MCP
```

La interfaz no debe contener reglas críticas de seguridad. Las reglas de negocio reutilizables deben vivir fuera de los componentes visuales. Las operaciones sensibles se ejecutan en el servidor y la base aplica autorización como última barrera.

### Organización orientativa del código

```text
src/
  app/                 rutas y layouts
  components/          componentes compartidos
  features/            módulos funcionales
  lib/                 utilidades e infraestructura
  server/              casos de uso y servicios protegidos
  integrations/        adaptadores externos cuando existan
  styles/              tokens y estilos globales
supabase/
  migrations/          esquema versionado
  seed.sql              datos mínimos de desarrollo si se requieren
tests/                  pruebas que no pertenezcan junto a una feature
docs/                   decisiones y especificaciones
```

La estructura puede ajustarse si el repositorio demuestra otra necesidad, pero debe mantenerse modular y comprensible.

---

## 7. Datos, archivos y sincronización

- PostgreSQL guarda datos estructurados, relaciones, estados, permisos e identificadores externos.
- Supabase Storage podrá utilizarse para archivos propios pequeños cuando exista un caso funcional.
- Google Drive podrá almacenar documentos y evidencias que convenga conservar allí.
- MOSS guardará metadatos y enlaces de esos archivos, no copias innecesarias.
- Notion no reemplazará las tablas operativas de MOSS.
- Toda sincronización debe indicar origen, destino, última ejecución, estado y error relevante.

---

## 8. Seguridad mínima desde el primer día

- Activar RLS en todas las tablas accesibles mediante la API.
- Denegar por defecto y permitir únicamente mediante políticas explícitas.
- No exponer claves de servicio al navegador.
- Validar entradas en el servidor.
- Separar datos de desarrollo y producción.
- No utilizar información clínica identificable de pacientes en MOSS.
- Registrar cambios sensibles cuando se incorporen colaboradores, finanzas o integraciones.
- Aplicar mínimo privilegio a usuarios, automatizaciones y proveedores externos.

---

## 9. Rendimiento y experiencia esperada

Desde el primer núcleo:

- la captura debe sentirse inmediata;
- el Centro de Mando debe cargar solamente los datos necesarios;
- las consultas deben filtrar y paginar cuando aumente el volumen;
- los índices de base de datos se agregan según consultas reales;
- debe existir retroalimentación visual al guardar;
- una falla de red no debe hacer desaparecer silenciosamente lo escrito;
- la interfaz debe respetar zonas seguras y teclado móvil.

El modo offline completo no se construirá en la primera fase. Primero se protegerá la captura ante fallos y se observará la necesidad real. Una cola offline y sincronización avanzada se añadirán cuando el uso lo justifique.

---

## 10. Reglas específicas para Claude Code

Antes de implementar cualquier solicitud, Claude debe:

1. identificar la fase actual del proyecto;
2. leer el requisito funcional correspondiente;
3. inspeccionar el código y las migraciones existentes;
4. proponer el corte vertical más pequeño que entregue valor;
5. evitar añadir tecnologías reservadas para fases futuras;
6. señalar si una solicitud exige una decisión de producto, datos o permisos aún no definida;
7. preservar cambios existentes que no formen parte de la tarea;
8. ejecutar las verificaciones relevantes antes de declarar terminado el incremento.

Claude no debe:

- construir módulos completos por anticipación;
- crear todas las tablas futuras en una sola migración;
- instalar librerías sin utilizarlas en el incremento actual;
- usar `any` como salida fácil;
- desactivar RLS para resolver problemas;
- poner claves secretas en código, ejemplos o registros;
- conectar la interfaz directamente a servicios de IA con secretos públicos;
- trasladar reglas centrales únicamente a n8n;
- asumir permisos de colaboradores que no hayan sido definidos;
- realizar una reescritura amplia cuando una mejora incremental resuelve el problema.

### Definición de terminado de una tarea técnica

Una tarea se considera terminada cuando:

- cumple el comportamiento solicitado;
- funciona primero en móvil y se adapta a pantallas mayores;
- contempla carga, vacío, éxito y error cuando corresponda;
- valida las entradas;
- respeta autenticación y autorización;
- incluye migración si modificó datos;
- no introduce errores de lint, tipos o compilación;
- incorpora pruebas proporcionales al riesgo;
- actualiza la documentación afectada;
- puede demostrarse mediante un recorrido concreto.

---

## 11. Registro de decisiones

Las decisiones que cambien la arquitectura deben documentarse en `docs/decisions/` como ADR breves que incluyan:

- contexto;
- decisión;
- alternativas consideradas;
- consecuencias;
- fecha y estado.

Se necesita un ADR antes de:

- agregar otra base de datos;
- introducir un ORM;
- crear una aplicación nativa;
- cambiar proveedor de autenticación;
- implementar sincronización bidireccional;
- alojar Supabase o n8n por cuenta propia;
- permitir acciones autónomas de IA;
- modificar el modelo general de permisos.

---

## 12. Estado inicial aprobado

La aplicación comenzará en la **Fase 0** y su primer producto útil será la **Fase 1: Centro de Mando mínimo + Vaciado Mental + Inbox + procesamiento + planificación del día + ejecución**.

Todo lo demás queda reconocido como parte de la evolución posible de MOSS, no como trabajo inmediato.

La pregunta rectora antes de añadir cualquier pieza será:

> ¿Esta tecnología o complejidad es necesaria para entregar el siguiente resultado útil y comprobable?

Si la respuesta es no, se documenta para más adelante y no se construye todavía.
