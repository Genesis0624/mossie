# MOSS — Documento 24

## Sistema de Diseño e Identidad para Claude Code

**Versión:** 1.0  
**Estado:** Aprobado  
**Última actualización:** 24 de julio de 2026  
**Documento complementario:** MOSS — Diseño UX/UI Base v1.0  
**Regla de precedencia técnica:** Si algo difiere de `moss.css`, prevalece `moss.css`.

---

# 1. Esencia de marca

**Editorial, sereno, sin prisa, aesthetic.**

> **El musgo no compite, cubre.**

La interfaz debe:

- respirar;
- mostrar una acción principal;
- evitar rojos de ansiedad;
- combinar serif para carácter y sans para utilidad;
- funcionar mobile-first;
- mantener densidad equilibrada;
- sentirse elegante, personal y profesional.

Marca:

```text
MOSS
```

Descriptor:

```text
My Own Simple System
```

---

# 2. Color

```css
:root {
  --moss-50: oklch(0.96 0.014 138);
  --moss-100: oklch(0.93 0.022 140);
  --moss-200: oklch(0.86 0.032 143);
  --moss-300: oklch(0.76 0.042 145);
  --moss-400: oklch(0.66 0.052 147);
  --moss-500: oklch(0.56 0.06 148);
  --moss-600: oklch(0.49 0.064 149);
  --moss-700: oklch(0.43 0.065 150);
  --moss-800: oklch(0.36 0.055 151);
  --moss-900: oklch(0.29 0.04 152);

  --paper: oklch(0.985 0.005 120);
  --paper-2: oklch(0.965 0.007 125);
  --ink: oklch(0.255 0.018 152);
  --ink-soft: oklch(0.44 0.016 150);
  --ink-mute: oklch(0.6 0.012 150);
  --line: oklch(0.9 0.008 130);
  --line-2: oklch(0.85 0.01 135);

  --clay: oklch(0.68 0.085 55);
  --clay-50: oklch(0.95 0.02 60);

  --r-md: 12px;
  --r-lg: 18px;
  --r-xl: 28px;
  --r-pill: 999px;

  --shadow-sm: 0 1px 2px oklch(0.4 0.02 150 / 0.06);
  --shadow-md: 0 4px 16px oklch(0.4 0.02 150 / 0.08);
  --shadow-lg: 0 12px 40px oklch(0.4 0.02 150 / 0.12);
}
```

Uso:

- `moss-700`: primario;
- `moss-50`: selección;
- `paper`: fondo;
- `paper-2`: superficies;
- `clay`: destacados suaves.

---

# 3. Pilares

- Fe: terracota pastel.
- Familia nuclear: rosa pastel.
- Familia y amigos: amarillo pastel.
- Salud: verde pastel.
- Finanzas: morado pastel.
- Hogar: azul pastel.
- Estudios: marrón pastel.
- Negocio: gris pastel.
- Trabajo: coral pastel.
- Imagen: aqua pastel.

Cuando varios pilares conviven:

- usar línea lateral fina;
- fondo neutro;
- punto pequeño;
- nombre o icono;
- no usar muchos fondos de color.

---

# 4. Tipografía

## Spectral

- titulares;
- frases;
- citas;
- versículos;
- voz editorial.

## Hanken Grotesk

- navegación;
- datos;
- formularios;
- botones;
- etiquetas;
- controles.

Escala:

| Rol              | Fuente          | Tamaño |
| ---------------- | --------------- | -----: |
| Display          | Spectral        |  64 px |
| H1               | Spectral        |  40 px |
| H2               | Spectral        |  27 px |
| Cita             | Spectral Italic |  30 px |
| Cuerpo editorial | Spectral        |  19 px |
| UI               | Hanken          |  16 px |
| Etiqueta         | Hanken          |  11 px |

---

# 5. Iconografía

- línea;
- trazo 1.6 px;
- extremos redondeados;
- caja 24×24;
- sin relleno;
- un solo color;
- no multicolor.

---

# 6. Espaciado

Ritmo base:

```text
4 px
```

Escala:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

La interfaz es compacta pero respirable.

---

# 7. Componentes

| Componente       | Especificación                             |
| ---------------- | ------------------------------------------ |
| Botón primario   | fondo musgo, texto papel, radio pill       |
| Botón secundario | fondo papel, borde tenue                   |
| Botón ghost      | sin fondo                                  |
| Botón flotante   | musgo, plus, sombra-lg                     |
| Chip             | fondo suave, radio pill                    |
| Input            | paper-2, borde line-2, radio-md            |
| Checkbox         | musgo al completar                         |
| Progreso         | pista moss-100, relleno moss-500/600       |
| Tarjeta          | paper, borde line, radio-lg, shadow-sm     |
| Drawer           | panel lateral o inferior según dispositivo |
| Toast            | feedback breve con Deshacer                |
| Sidebar          | paper-2, activo moss-50                    |
| Tab bar móvil    | cinco accesos con captura central          |

---

# 8. Layout

## Escritorio

```text
sidebar contraíble
+ topbar contextual
+ tres columnas
+ central dominante
+ FAB
```

## Móvil

```text
barra inferior
+ captura central
+ menú Más
```

## Semana

Comienza el domingo.

---

# 9. Reglas UX/UI

- evitar demasiados modales;
- preferir drawer, inline y panel lateral;
- paneles estratégicos colapsables;
- paneles vacíos colapsados;
- Centro de Mando con pocos gráficos;
- usar barras de progreso;
- Análisis puede incluir gráficos completos;
- proyectos en galería;
- búsqueda en lista;
- pilares como dashboards con imágenes;
- modo oscuro después del MVP.

---

# 10. Do’s & Don’ts

## Sí

- aire;
- jerarquía;
- progreso visible;
- tono sereno;
- una acción principal;
- iconos lineales;
- fondos cálidos;
- bordes suaves.

## No

- rojos de ansiedad;
- badges agresivos;
- sombras duras;
- saturación alta;
- iconos rellenos;
- muchos colores juntos;
- interfaces dramáticas;
- modales para todo.

---

# 11. Integración con Diseño UX/UI Base

Este documento define los tokens y la identidad visual.

El documento:

```text
MOSS — Diseño UX/UI Base v1.0
```

define:

- navegación;
- layouts;
- comportamiento responsive;
- Centro de Mando;
- Inbox;
- proyectos;
- pilares;
- búsqueda;
- métricas;
- componentes;
- wireframes prioritarios.

Ambos documentos deben usarse juntos.

---

# 12. Entrega técnica

Claude debe generar:

- `moss.css`;
- tokens Tailwind;
- fuentes;
- paleta de pilares;
- componentes;
- AppShell;
- documentación Storybook o equivalente si se aprueba más adelante.

---

# Cierre

> **MOSS debe sentirse como el espacio de una mujer organizada: sereno, elegante y útil.**
