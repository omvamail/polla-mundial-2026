# 🏆 Polla Mundialista 2026 — Documentación del Proyecto

## 📋 Descripción General

Aplicación web tipo **quiniela/apuesta** para el **Mundial de Fútbol 2026**. Un grupo de 6 amigos registran sus pronósticos para los 72 partidos de la fase de grupos (Grupos A–L). Un administrador ingresa los resultados reales, y el sistema calcula automáticamente la tabla de posiciones.

**Participantes:** Deivid, Cesar, Ferney, Edisabet, Jhair, Duvan  
**Partidos:** 72 (Fase de grupos — 12 grupos × 6 partidos c/u)  
**Idioma UI:** Español

---

## 🧱 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Python + Flask | Python 3.14 / Flask |
| **Frontend** | HTML5 + CSS3 + JavaScript (Vanilla) | Sin frameworks |
| **Estilos** | CSS personalizado (Glassmorphism / Dark theme) | Puro |
| **Iconos** | Font Awesome 6.4.0 | CDN |
| **Tipografía** | Google Fonts — Outfit | CDN |
| **Banderas** | flagcdn.com (w80) | CDN |
| **Datos** | JSON plano (`data.json`, `scores.json`) | Archivos locales |
| **Entorno** | Python virtualenv (`venv/`) | — |

⚠️ **No usa base de datos.** Todo el almacenamiento es en archivos JSON.

---

## 📁 Estructura del Proyecto

```
D:\Apuesta_mundial\
├── app.py                           # Servidor Flask (API + Static)
├── scores.json                      # Marcadores reales ingresados por admin
├── Marcadores Mundial 2026.xlsx     # Backup/planilla Excel de marcadores
├── DOCUMENTACION_PROYECTO.md        # ← Este archivo
├── COMO_COMPARTIR.md                # Guía para compartir con participantes
│
├── static/                          # Frontend web
│   ├── index.html                   # SPA — Página principal
│   ├── style.css                    # Estilos (dark mode, glassmorphism)
│   ├── app.js                       # Lógica JS (aprox. 995 líneas)
│   └── data.json                    # 72 partidos + predicciones de cada jugador
│
├── scratch/                         # Scripts auxiliares (análisis, debugging)
│   ├── check_formulas.py
│   ├── check_j1.py
│   ├── check_resultados_g.py
│   ├── export_data.py
│   ├── export_scores.py
│   ├── get_teams.py
│   ├── inspect_excel.py
│   ├── test_calc.py
│   ├── test_update.py
│   └── verify_row_alignment.py
│
└── venv/                            # Entorno virtual Python
```

---

## ⚙️ Funcionamiento Interno

### Backend (`app.py`)

- **Ruta `GET /`** — Sirve `index.html` y archivos estáticos.
- **Ruta `GET /api/data`** — Lee `data.json` y `scores.json`, los fusiona calculando:
  - Resultado de cada partido (Local / Visitante / Empate)
  - Aciertos por participante (1 punto por pronóstico correcto)
  - Tabla de posiciones ordenada por puntos (↓), aciertos (↓), nombre (↑)
- **Ruta `POST /api/update_match`** — Permite al admin actualizar el marcador real de un partido. Validación por contraseña (`mundial2026`).
- **Almacenamiento:** `scores.json` guarda los resultados reales (ej: `{"2": {"goles_local": 2, "goles_visitante": 0}}`)

### Frontend (`static/`)

- **Arquitectura SPA** con 3 pestañas en barra inferior:
  1. **Posiciones** — Ranking de jugadores con puntajes
  2. **Partidos** — Fixture completo, vista por grupo o por fecha
  3. **Administrar** — Panel protegido con contraseña para ingresar resultados
- **Modal interactivo** — Al tocar un jugador, muestra todas sus predicciones con filtros
- **Sin frameworks JS** — Manipulación directa del DOM

### Lógica de Puntuación

- Cada pronóstico acertado = **1 punto**
- Se acierta cuando la predicción del jugador coincide con el resultado real
- Predicciones posibles: `Gana Local (L)`, `Gana Visitante (V)`, `Empate (E)`

---

## 🔐 Credenciales

| Rol | Usuario/Clave |
|-----|--------------|
| Admin password | `mundial2026` |

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Activar entorno virtual
source venv/bin/activate    # Linux/Mac/Git Bash
# o en PowerShell:
.\venv\Scripts\Activate.ps1

# 2. Iniciar servidor (puerto 5000 por defecto)
python app.py
# El servidor corre en http://localhost:5000
```

---

## 🛠️ Scripts Auxiliares (`scratch/`)

Estos scripts se usaron durante el desarrollo para depuración, inspección del Excel y verificación de datos. No son parte de la app en producción.

| Script | Propósito |
|--------|-----------|
| `inspect_excel.py` | Leer el archivo Excel y mostrar su estructura |
| `get_teams.py` | Extraer lista de equipos desde data.json |
| `check_formulas.py` | Verificar fórmulas en el Excel |
| `export_scores.py` | Exportar scores desde Excel a JSON |
| `export_data.py` | Exportar data desde Excel a JSON |
| `test_calc.py` | Probar cálculos de puntuación |
| `test_update.py` | Probar endpoint de actualización |
| `verify_row_alignment.py` | Verificar alineación de filas |
| `check_j1.py` | Verificar predicciones de J1 |
| `check_resultados_g.py` | Verificar resultados globales |

---

## 📊 Datos del Mundial 2026

- **Formato:** 48 selecciones, 12 grupos de 4 equipos
- **Fase de grupos:** 72 partidos (11–28 de junio 2026)
- **Equipos participantes:** 48 países de todas las confederaciones
- **País anfitrión:** Estados Unidos 🇺🇸 (también Canadá 🇨🇦 y México 🇲🇽 como coanfitriones)

---

## 🧪 Posibles Mejoras Futuras

- [ ] Agregar soporte para fase de eliminatorias (octavos, cuartos, etc.)
- [ ] Base de datos (SQLite/PostgreSQL) en vez de JSON plano
- [ ] Autenticación individual por jugador
- [ ] Puntajes diferenciados (más puntos por marcador exacto vs solo resultado)
- [ ] Despliegue en la nube (Render, Railway, Fly.io)
- [ ] Soporte para múltiples grupos/quinielas
