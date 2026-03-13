# ¡Ni muy caro, ni muy barato! — Un modelo de para encontrar el precio ideal en Airbnb
**Proyecto Final · Aprendizaje Automático · MIACD**
Manuel Alejandro Serrano Macias · ID 0286155

---

## Descripción

Presentación interactiva desarrollada con [Reveal.js](https://revealjs.com/) y [D3.js](https://d3js.org/) que muestra el proceso completo de un modelo predictivo de precios para Airbnb CDMX. Incluye análisis exploratorio, comparación de tres modelos de aprendizaje automático, reducción de dimensionalidad por selección de variables y PCA, y una recomendación de precio para el departamento de Gabriela en Coyoacán.

## Estructura del proyecto

```
airbnb/
├── airbnb.html             Presentación principal (abrir esto)
├── style.css               Estilos de la presentación
├── data/
│   └── airbnb_data.json    Datos pre-calculados para las gráficas
└── js/
    ├── grafico1_alcaldias.js        Precio mediano por alcaldía
    ├── grafico2_habitaciones.js     Precio por número de habitaciones
    ├── grafico3_modelos.js          Comparación R², MAE y RMSE
    ├── grafico4_importancia.js      Feature Importance del Random Forest
    ├── grafico5_coyoacan.js         Distribución de precios en Coyoacán
    ├── grafico6_pca_varianza.js     Varianza explicada acumulada por PCA
    └── grafico7_dim_comparacion.js  Comparación completa de estrategias
```

> **Importante:** La presentación usa `d3.json()` para cargar los datos desde `data/airbnb_data.json`.
> Los navegadores bloquean este tipo de peticiones cuando se abre el archivo directamente
> (`file://`), por lo que **es necesario abrir el proyecto desde un servidor local**.

---

## Cómo visualizarlo

### Opción 1 — Live Server en VS Code (recomendado)

1. Instala la extensión **Live Server** de Ritwick Dey en VS Code:
   - Abre VS Code → `Ctrl+Shift+X` (o `Cmd+Shift+X` en Mac)
   - Busca `Live Server` e instala la extensión de **Ritwick Dey**

2. Abre la carpeta del proyecto en VS Code:
   ```
   Archivo → Abrir carpeta → selecciona airbnb/
   ```

3. Haz clic derecho sobre `airbnb.html` en el explorador de archivos y selecciona:
   ```
   Open with Live Server
   ```

4. Se abrirá automáticamente en tu navegador en:
   ```
   http://127.0.0.1:5500/airbnb.html
   ```

---

### Opción 2 — Servidor en Python

**Python 3** (cualquier sistema operativo):

1. Abre una terminal y navega a la carpeta del proyecto:
   ```bash
   cd ruta/a/airbnb
   ```

2. Inicia el servidor:
   ```bash
   python3 -m http.server 8000
   ```

3. Abre tu navegador y ve a:
   ```
   http://localhost:8000/airbnb.html
   ```

4. Para detener el servidor presiona `Ctrl+C` en la terminal.

> En Windows puede ser necesario usar `python` en lugar de `python3`:
> ```bash
> python -m http.server 8000
> ```

---

## Controles de la presentación

| Tecla / Acción | Función |
|---|---|
| `→` o `Espacio` | Siguiente slide |
| `←` | Slide anterior |
| `F` | Pantalla completa |
| `S` | Abrir vista de presentador (con notas) |
| `Esc` | Vista general de slides |
| Hover sobre gráficas | Muestra tooltip con datos exactos |

> La vista de presentador (`S`) abre una ventana secundaria con las notas del script,
> el slide actual, el siguiente slide y un cronómetro.

---

## Tecnologías utilizadas

| Librería | Versión | Uso |
|---|---|---|
| [Reveal.js](https://revealjs.com/) | CDN | Motor de presentación |
| [D3.js](https://d3js.org/) | v7 (CDN) | Visualizaciones interactivas |

No requiere instalación de dependencias. Todo se carga desde CDN excepto los datos locales.

---

## Notas

- Las gráficas se renderizan al entrar a cada slide para optimizar el rendimiento.
- Todos los tooltips son interactivos — pasa el cursor sobre cualquier barra o punto.
- Los datos en `airbnb_data.json` son los resultados finales del modelo; no se requiere
  el dataset original de Airbnb para visualizar la presentación.
