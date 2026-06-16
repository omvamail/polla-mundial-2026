# 📤 Cómo Compartir la Polla Mundialista 2026 con los Participantes

Eres el **administrador** de esta quiniela. El resto del grupo (Deivid, Cesar, Ferney, Edisabet, Jhair, Duvan) necesita poder **ver la página web**. Aquí tienes todas las formas de hacerlo.

---

## 🎯 Opción 1: Deploy en la Nube (RECOMENDADA) ⭐

La forma más fácil: subir la app a un servicio gratuito para que todos accedan desde el celular.

### 1A — Render (Muy fácil, gratuito)

1. **Sube el proyecto a GitHub:**
   ```bash
   # Crear repositorio en github.com (manual)
   git init
   git add .
   git commit -m "Polla Mundial 2026"
   git remote add origin https://github.com/TU_USUARIO/polla-mundial-2026.git
   git push -u origin main
   ```

2. **Ve a https://render.com** → Regístrate con GitHub

3. **Crea un Web Service:**
   - Click en **New +** → **Web Service**
   - Conecta tu repo de GitHub
   - **Name:** `polla-mundial-2026`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install flask`
   - **Start Command:** `gunicorn app:app`
   - **Plan:** **Free** ($0/mes)
   - **Advanced** → Add `Health Check Path: /api/data`
   - Click **Create Web Service**

4. ⏳ Espera 2-3 minutos a que haga deploy

5. 🎉 **Compartes el link:** `https://polla-mundial-2026.onrender.com`

> ✅ **Ventaja:** Todos ven los cambios en tiempo real.  
> ⚠️ **Nota:** En el plan Free, si nadie la visita en ~15 min se "duerme". Al abrirla de nuevo tarda ~30s en despertar.

### 1B — Railway (Alternativa)

1. Crea cuenta en https://railway.app
2. Conecta GitHub → Deploy desde el repo
3. Railway detecta automáticamente que es Python
4. Agrega variable de entorno: `PORT=5000`
5. Obtienes URL tipo `polla-mundial-2026.up.railway.app`

### 1C — Fly.io

```bash
# Instalar flyctl
fly launch
fly deploy
fly open
```

---

## 🏠 Opción 2: Servidor Local + ngrok (Túnel Público)

Ideal si NO quieres subir nada a la nube, pero los participantes deben verse con otros.

1. **Descarga ngrok** de https://ngrok.com (gratuito)

2. **Inicia la app local:**
   ```bash
   cd D:\Apuesta_mundial
   .\venv\Scripts\Activate
   python app.py
   # Tu app corre en http://localhost:5000
   ```

3. **Exponer con ngrok** (en otra terminal):
   ```bash
   ngrok http 5000
   ```

4. **ngrok te dará una URL pública** como: `https://a1b2c3d4.ngrok.io`

5. **Compartes ese link** por WhatsApp.

> ✅ **Ventaja:** No requiere GitHub, ni deploy.  
> ⚠️ **Desventaja:** Tu PC debe estar **encendida** con la app corriendo mientras otros la usen. La URL de ngrok cambia cada vez que reinicias (en la versión gratis).

---

## 🌐 Opción 3: GitHub Pages (Solo Frontend Estático)

Si quieres algo más sencillo pero **sin funcionalidad admin** (no se pueden actualizar resultados):

1. El frontend (`index.html`, `style.css`, `app.js`, `data.json`) necesita el backend. Como GitHub Pages es solo estático, **no funcionaría el `fetch('/api/data')`**.

2. **Solución alternativa:** Modificar `app.js` para cargar `data.json` directamente y deshabilitar el panel admin. No recomendado si necesitas actualizar marcadores.

---

## 📱 Opción 4: Compartir el Excel + Esta App Localmente

Cada quien puede correr la app en su propia PC, pero **los datos NO se sincronizan**:

```bash
# Cada participante:
git clone https://github.com/TU_USUARIO/polla-mundial-2026.git
cd polla-mundial-2026
pip install flask
python app.py
# Abrir http://localhost:5000
```

> ❌ Los marcadores reales los actualiza el admin en su PC — los demás no los verían.

---

## ✅ Recomendación Final

**Usa Render (Opción 1A).** Es gratis, no requiere tener tu PC encendida, y los participantes pueden abrir el link desde cualquier celular.

---

## 📝 Instrucciones para Compartir con los Participantes

Cuando ya tengas la app desplegada, envía este texto por WhatsApp:

---

**🏆 ¡Ya está lista la Polla Mundialista 2026!**

Entra aquí para ver la tabla de posiciones y los resultados:
🔗 **[AQUÍ VA EL LINK DE RENDER]**

Funciones:
- 📊 **Posiciones** — Ranking actualizado con puntajes
- ⚽ **Partidos** — Todos los 72 partidos, busca por grupo o fecha
- 🔍 Toca cualquier jugador para ver sus predicciones detalladas
- 👑 Si ves una corona, es el líder actual

¡A seguir la tabla y que gane el mejor pronosticador! 🎉

---

> **Nota para admin:** La contraseña del panel de administración es `mundial2026`. La puedes cambiar editando la línea 7 de `app.py`:
> ```python
> PASSWORD_ADMIN = "mundial2026"
> ```
> Cámbiala y haz deploy de nuevo si quieres mayor seguridad.

---

## 🚧 Solución de Problemas

| Problema | Solución |
|----------|----------|
| App "se duerme" en Render | Es normal en el plan Free. Abrir la URL despierta el servicio (~30s) |
| Banderas no cargan | Verificar conexión a Internet (flagcdn.com) |
| Error 500 al cargar datos | Revisar que `data.json` y `scores.json` tengan formato válido |
| Admin no puede guardar | Verificar que la contraseña coincida con `app.py` línea 7 |
| Puerto ocupado | Usar: `python app.py` — por defecto corre en puerto 5000 |
