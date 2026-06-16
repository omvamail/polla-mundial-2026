# 🏆 Polla Mundialista 2026 — Explicación para No Programadores

Este documento explica **en español sencillo** cómo funciona la aplicación, sin usar palabras técnicas de programación. Si alguien del grupo pregunta "¿cómo hace eso?", aquí está la respuesta.

---

## 🧩 ¿Qué es esto?

Es una **página web** para llevar la quiniela del Mundial 2026 entre amigos. Funciona como una tabla de Excel pero en internet: todos pueden ver los resultados desde su celular, y una sola persona (el admin) actualiza los marcadores reales.

---

## 🏗️ Las partes del proyecto (El "Stack")

Imagina que esto es un **restaurante**:

| Parte | Nombre técnico | Traducción | ¿Qué hace? |
|-------|---------------|------------|------------|
| 🍳 **La cocina** | **Python + Flask** (Backend) | El "cerebro" | Prepara los datos, calcula puntajes, guarda los marcadores |
| 🍽️ **El menú y la presentación** | **HTML + CSS + JavaScript** (Frontend) | La "carta" | Es lo que ves en el celular: colores, tablas, botones |
| 📋 **La nevera** | **JSON** (Archivos de datos) | El "almacén" | Guarda los partidos, los pronósticos y los resultados |
| 🚚 **El mesero** | **Flask** (API) | El "mensajero" | Lleva la información entre la cocina y la mesa |

---

## 🍳 La Cocina — Python + Flask (Backend)

Es el **motor invisible**. Cuando abres la página en el celular, no ves esto, pero es lo que hace que todo funcione.

### Archivo `app.py`

Este es el **jefe de cocina**. Hace tres cosas principales:

#### 1️⃣ Servir la página web (`GET /`)
Cuando alguien escribe la URL en su celular, este archivo le envía la página lista para verse. Es como abrir la puerta del restaurante.

#### 2️⃣ Calcular la tabla de posiciones (`GET /api/data`)
Cada vez que alguien toca la pestaña **"Posiciones"** en el celular, el jefe de cocina:

1. Abre la **nevera** (`data.json`) y saca la lista de los 72 partidos con los pronósticos de cada jugador
2. Abre la **nevera de resultados** (`scores.json`) y mira qué partidos ya tienen marcador real
3. **Compara** lo que cada persona pronosticó contra el resultado real
4. **Cuenta los aciertos** y calcula los puntos
5. **Ordena la tabla** del que va ganando al que va último

> **Ejemplo:** Si Ferney pronosticó que México gana, y el resultado real fue México 2-0, entonces Ferney suma 1 punto. 🎯

#### 3️⃣ Guardar marcadores reales (`POST /api/update_match`)
Cuando el administrador mete los resultados de los partidos:

1. Pide la **contraseña** (como la llave de la cocina 👑)
2. Recibe el número de fila del partido y los goles
3. Guarda eso en su **nevera de resultados** (`scores.json`)
4. La próxima vez que alguien vea la página, los puntos ya estarán actualizados

---

## 🍽️ El Menú — Frontend (Lo que ves en el celular)

Hay **3 archivos** que trabajan juntos para mostrar la página bonita:

### 📄 `index.html` — El "esqueleto"
Es la estructura básica de la página. Define:
- El **encabezado** arriba (el logo y "Polla Mundialista 2026")
- Las **3 pestañas** de abajo (Posiciones, Partidos, Administrar)
- La **ventanita que aparece** cuando tocas un jugador
- Los espacios donde después se rellenan los datos

### 🎨 `style.css` — La "ropa y maquillaje"
Hace que todo se vea bonito:
- **Colores:** Fondo oscuro, letras blancas, detalles azules 🌙
- **Diseño:** Tarjetas con efecto "vidrio" que se ven modernas
- **Animaciones:** Que los números se muevan suavecito
- **Adaptable:** Se ve bien tanto en celular como en computador

### 🧠 `app.js` — El "cerebro de la pantalla"
Es el que **hace que las cosas pasen** cuando tocas botones:

| Botón/Acción | Lo que hace |
|-------------|------------|
| Tocar **Posiciones** | Pide los datos, dibuja la lista de jugadores con sus puntajes, pone corona 👑 al líder |
| Tocar **Partidos** | Muestra todos los partidos, con opción a verlos por grupo (A, B, C…) o por fecha |
| Tocar un **jugador** | Abre una ventana con todos sus pronósticos, filtrado por grupo o por acertados/fallados |
| Tocar **Ver Pronósticos** | Muestra qué pronosticó cada persona para ese partido |
| Escribir en **Administrar** | Si tienes la clave, puedes actualizar resultados |
| Tocar **Guardar** | Envía el resultado al servidor para que lo guarde |

---

## 📋 La Nevera — Archivos de Datos

### 📁 `static/data.json` — Los 72 partidos y pronósticos

Este archivo contiene **TODO lo que cada persona pronosticó**. Se ve así en simple español:

> *"Partido fila 2, Grupo A: México vs Sudáfrica, jueves 11 de junio a las 12:00. Deivid dijo que gana México. Cesar dijo que empatan. Ferney dijo que gana México…"*

Y así con los 72 partidos y los 6 jugadores. **432 pronósticos en total.**

### 📁 `scores.json` — Los resultados reales

Aquí el administrador guarda los marcadores reales:

> *"Partido fila 2: México 2 - Sudáfrica 0"*

Cada vez que el admin mete un resultado, se guarda aquí. Y automáticamente se actualizan los puntos de todos.

---

## 📦 Los Archivos Auxiliares (`scratch/`)

Son como **herramientas de taller** que usó quien creó la página para revisar que todo estuviera bien.

| Archivo | Explicación sencilla |
|---------|---------------------|
| `inspect_excel.py` | Revisó que el Excel original tuviera los datos bien organizados |
| `get_teams.py` | Sacó la lista de los 48 países que juegan el Mundial |
| `check_formulas.py` | Verificó que las cuentas del Excel estuvieran bien |
| `export_scores.py` | Pasó los resultados del Excel al archivo JSON |
| `export_data.py` | Pasó los partidos + pronósticos del Excel al JSON |
| `test_calc.py` | Probó que los cálculos de puntos dieran bien |
| `test_update.py` | Probó que guardar resultados funcionara |
| `verify_row_alignment.py` | Verificó que cada partido estuviera en su fila correcta |
| `check_j1.py` | Revisó los pronósticos de un jugador específico |
| `check_resultados_g.py` | Revisó los resultados generales |

> **No necesitas tocar estos archivos.** Son solo para referencia.

---

## 🔄 ¿Cómo viajan los datos? (El viaje de un clic)

Cuando **Ferney** abre la página desde su casa:

```
Ferney toca "Posiciones" en su celular
        ↓
El celular le pide datos al servidor (como llamar por teléfono 📞)
        ↓
El servidor (app.py) recibe la llamada
        ↓
Abre data.json y scores.json
        ↓
Compara pronósticos vs resultados
        ↓
Calcula puntajes y ordena la tabla
        ↓
Envía la tabla de vuelta al celular
        ↓
El celular (app.js) dibuja la tabla bonita con colores y coronas 👑
        ↓
Ferney ve su posición en la pantalla 🎉
```

---

## 🔐 Las Claves

| ¿Qué es? | Valor | ¿Para qué sirve? |
|----------|-------|-----------------|
| Contraseña de admin | `mundial2026` | Para que solo el organizador pueda actualizar resultados |

> ⚠️ **Importante:** Si alguien más que no sea el admin descubre la clave, podría poner resultados falsos. Si quieres cambiarla, abre `app.py` (línea 7), cambia `mundial2026` por otra cosa, y sube la página de nuevo.

---

## ❓ Preguntas Frecuentes (en español simple)

### ¿Necesito saber programar para usarla?
**No.** Si solo vas a ver la tabla, solo necesitas el link. Si eres el admin, solo necesitas saber escribir números (los goles) y la contraseña.

### ¿Dónde están mis pronósticos?
Están escritos en `static/data.json`. Si necesitas cambiarlos, háblale al que sabe de programación.

### ¿Por qué no se ven las banderas?
Revisa que tengas internet. Las banderas se cargan desde `flagcdn.com`, un sitio externo.

### ¿Por qué la página está en inglés si es en español?
No lo está. Todo está en español. Los nombres técnicos de los archivos están en inglés porque así se escribe código, pero la página se ve completamente en español.

### ¿El líder siempre tiene corona?
Sí 👑. Cada vez que alguien entra a la página, el sistema recalcula quién va primero y le pone la corona.

### ¿Cuánto dura la página?
Hasta que termine la fase de grupos del Mundial (28 de junio). Si quieren agregar octavos, cuartos, etc., hay que modificar el programa.

---

## 📱 Resumen Visual

```
┌─────────────────────────────────────────────┐
│  📱 LO QUE VES (Frontend)                    │
│  ┌───────────────────────────────────────┐   │
│  │  index.html + style.css + app.js      │   │
│  │  (esqueleto + ropa + cerebro visual)  │   │
│  └───────────────────────────────────────┘   │
│                      ↕                       │
│         (se comunican por internet)          │
│                      ↕                       │
│  ┌───────────────────────────────────────┐   │
│  │  🍳 LO QUE NO VES (Backend)           │   │
│  │  app.py (el jefe de cocina)           │   │
│  └───────────────────────────────────────┘   │
│                      ↕                       │
│  ┌───────────────────────────────────────┐   │
│  │  📋 LOS DATOS (Nevera)                │   │
│  │  data.json + scores.json              │   │
│  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```
