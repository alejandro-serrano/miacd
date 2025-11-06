# 0) Instala y carga readxl si no lo tienes
install.packages("readxl")  # ejecutar sólo la primera vez
library(readxl)

marginacion_base <- read_excel("IMM_2020.xlsx", sheet = "IMM_2020")
names(marginacion_base)
variables_estudio <- vars <- c("ANALF","SBASC","OVSDE","OVSEE","OVSAE","OVPT","VHAC","PL.5000","PO2SM")

entidades <- unique(marginacion_base$NOM_ENT)

for (variable in variables_estudio) {
  marginacion_base[[variable]] <- as.numeric(marginacion_base[[variable]])
}

resultados <- list()

for (estado in entidades) {
  datos_estado <- marginacion_base[marginacion_base$NOM_ENT == estado, ]
  estadisticas_estado <- list()
  
  for (variable in variables_estudio) {
    estado_actual <- marginacion_base[[variable]]
    rango <- range(estado_actual, na.rm = TRUE)
    rango_intercuantilico <- IQR(estado_actual, na.rm = TRUE)
    media <- mean(estado_actual, na.rm = TRUE)
    mediana <- median(estado_actual, na.rm = TRUE)
    desviacion_estandar <- sd(estado_actual, na.rm = TRUE)
    
#    calculo_estadisticas <- c(
#      "Rango Mínimo" = rango[1],
#      "Rango Máximo" = rango[2],
#      "Rango Intercuantílico" = rango_intercuantilico,
#      "Media" = media,
#      "Mediana" = mediana,
#      "Desviación Estandar" = desviacion_estandar
#    )
    
    calculo_estadisticas <- data.frame(
      Variable = variable,
      Rango_Min = rango[1],
      Rango_Max = rango[2],
      Rango_Intercuantilico = rango_intercuantilico,
      Media = media,
      Mediana = mediana,
      Desviacion_Estandar = desviacion_estandar
    )
    
    estadisticas_estado[[variable]] <- calculo_estadisticas
  }
  
  df_estado <- do.call(rbind, estadisticas_estado)
  rownames(df_estado) <- NULL
  
  resultados[[estado]] <- df_estado
}


for (estado in sort(names(resultados))) {
  
  # Imprimimos un encabezado claro
  print(paste("=================================================="))
  print(paste("   Entidad Federativa:", estado))
  print(paste("=================================================="))
  
  # Imprimimos el data.frame completo.
  # Usamos round() sobre el data.frame para un reporte más limpio.
  # Necesitamos seleccionar solo las columnas numéricas para redondear.
  
  df_a_imprimir <- resultados[[estado]]
  
  # Columnas numéricas (de la 2 a la 7)
  cols_numericas <- c("Rango_Min", "Rango_Max", "Rango_Intercuantilico", 
                      "Media", "Mediana", "Desviacion_Estandar")
  
  # Aplicamos el redondeo usando 'lapply' (función base de R)
  df_a_imprimir[cols_numericas] <- lapply(df_a_imprimir[cols_numericas], round, digits = 3)
  
  print(df_a_imprimir)
  
  # Añadimos un espacio para separar las entidades
  print(" ")
}
# 
# imprimir_resultados(resultados[["Aguascalientes"]], "Aguascalientes")
# df_aguascalientes <- resultados[["Aguascalientes"]]
# 
# imprimir_resultados(resultados[["Baja California"]], "Baja California")
# df_baja_california <- resultados[["Baja California"]]
# 
# imprimir_resultados(resultados[["Baja California Sur"]], "Baja California Sur")
# df_baja_california_sur <- resultados[["Baja California Sur"]]
# 
# 
# imprimir_resultados(resultados[["Campeche"]], "Campeche")
# df_campeche <- resultados[["Campeche"]]
# 
# imprimir_resultados(resultados[["Campeche"]], "Campeche")
# df_coahuila <- resultados[["Coahuila de Zaragoza"]]
# df_colima <- resultados[["Colima"]]
# df_chiapas <- resultados[["Chiapas"]]
# df_chihuahua <- resultados[["Chihuahua"]]
# df_cdmx <- resultados[["Ciudad de México"]]
# df_durango <- resultados[["Durango"]]
# df_guanajuato <- resultados[["Guanajuato"]]
# df_guerrero <- resultados[["Guerrero"]]
# df_hidalgo <- resultados[["Hidalgo"]]
# df_jalisco <- resultados[["Jalisco"]]
# df_edo_mx <- resultados[["México"]]
# df_michoacan <- resultados[["Michoacán de Ocampo"]]
# df_morelos <- resultados[["Morelos"]]
# df_nayarit <- resultados[["Nayarit"]]
# df_nuevo_leon <- resultados[["Nuevo León"]]
# df_oaxaca <- resultados[["Oaxaca"]]
# df_puebla <- resultados[["Puebla"]]
# df_queretaro <- resultados[["Querétaro"]]
# df_quintana_roo <- resultados[["Quintana Roo"]]
# df_san_luis_potosi <- resultados[["San Luis Potosí"]]
# df_sinaloa <- resultados[["Sinaloa"]]
# df_sonora <- resultados[["Sonora"]]
# df_tabasco <- resultados[["Tabasco"]]
# df_tamaulipas <- resultados[["Tamaulipas"]]
# df_tlaxcala <- resultados[["Tlaxcala"]]
# df_veracruz <- resultados[["Veracruz de Ignacio de la Llave"]]
# df_yucatan <- resultados[["Yucatán"]]
# df_zacatecas <- resultados[["Zacatecas"]]



# ----------------------------------------------------------------------------------------
# for (estado in sort(entidades)) {
  
  # Imprimimos un encabezado claro para cada entidad
  #print(paste("=================================================="))
  #print(paste("   Entidad Federativa:", estado))
  #print(paste("=================================================="))
  
  # Imprimimos el bloque de estadísticas para esa entidad.
  # R automáticamente formatea la lista de manera legible.
  #print(resultados[[estado]])
  
  # Añadimos un espacio para separar las entidades
  #print(" ")
#}
# ----------------------------------------------------------------------------------------


# --- Estadística para la Ciencia de Datos ---
# --- Parte 2: Gráfico de Correlación ---

# Cargar los datos (usando la ruta que ya definimos)


# 1. Creamos un nuevo Data Frame con solo las variables de interés.
datos_correlacion <- marginacion_base[, variables_estudio]

# --- PASO 2: Cálculo de la Matriz de Correlación ---

# La función 'cor' de R base calcula la matriz de correlación de Pearson.
# 'use = "pairwise.complete.obs"' es importante para manejar los valores NA 
# (por ejemplo, si algún municipio tiene datos faltantes en las variables porcentuales)
matriz_correlacion <- cor(datos_correlacion, use = "pairwise.complete.obs")

print("--- Matriz de Correlación (Pearson) ---")
# Redondeamos a 2 decimales para una mejor lectura en la consola
print(round(matriz_cor, 2))

# --- PASO 3: Generación del Gráfico de Correlación (Visualización) ---

# --- Opción 1 (Recomendada y más interpretable): Usando la librería 'corrplot' ---
# Si puedes usar librerías (aún siendo principiantes, es la mejor práctica visual):
install.packages("corrplot") # Si no la tienes instalada
library(corrplot)
  
  # Abrir un nuevo dispositivo gráfico (opcional, pero ayuda a la visualización)
  # x11() # Para Linux/Windows
  # quartz() # Para Mac
  
  # Generamos un mapa de calor de correlación (heatmap)
corrplot(matriz_correlacion, 
         method = "color", # Muestra cuadrados de color
         type = "upper",   # Muestra solo la parte superior (la matriz es simétrica)
         tl.col = "black", # Color de las etiquetas
         tl.srt = 45,      # Rotación de las etiquetas (para que no se encimen)
         addCoef.col = "black", # Agrega los valores numéricos
         number.cex = 0.7) # Tamaño de los números

  # Agregamos un título
title("Gráfico de Correlación de Indicadores de Marginación", line = 3)

# Interpretaciones Clave (Basadas en la Lógica de los Datos):
# 
# 1. Correlaciones Positivas Fuertes (Números altos, ej., r>0.7):
#    - Educación y Pobreza de Ingresos: Se espera una correlación muy fuerte
#     entre ANALF (analfabetismo) y SBASC (población sin educación básica) con
#     PO2SM (población con ingresos ≤2 salarios mínimos). Esto significa que 
#     donde hay alta falta de educación básica, hay mayor población con bajos ingresos, 
#     reforzando el ciclo de marginación.
# 
#    - Vivienda de Calidad: Los indicadores de carencias en la vivienda suelen estar
#     muy correlacionados entre sí. Por ejemplo, OVSDE (sin drenaje/excusado),
#     OVSEE (sin electricidad), OVSAE (sin agua entubada) y OVPT (piso de tierra) 
#     mostrarán una correlación positiva alta. 
#     Si un municipio carece de un servicio básico de vivienda, es muy probable 
#     que carezca de los demás.
# 
#   - Hacinamiento (VHAC): También se correlaciona positivamente con las otras 
#     carencias de vivienda, pues ambas son manifestaciones de pobreza de infraestructura.
# 
# 2. Correlaciones Negativas o Débiles (Números bajos, ej., r<0.3):
#   - Correlación entre Desarrollo de Servicios y Variables Rurales: Es posible 
#   encontrar correlaciones más débiles o incluso negativas entre variables
#   como PL.5000 (población en localidades rurales/pequeñas) y algunos indicadores de vivienda,
#   aunque suele ser más compleja. En general, en municipios con alta dispersión rural (PL.5000),
#   las carencias de servicios (OVSDE, OVSAE) pueden ser elevadas, resultando en una correlación positiva.
# 
# La falta de correlación indicaría que la carencia de un servicio o condición
# no está sistemáticamente relacionada con la carencia de otra.
# 
# Conclusión: El gráfico de correlación sirve para confirmar la coherencia conceptual 
# del Índice de Marginación. Las variables fueron elegidas porque se espera que se muevan juntas.
# Las áreas con cuadrados oscuros (cercanos a 1) confirman que la marginación es un
# fenómeno multidimensional donde las carencias se acumulan
# (mala vivienda → baja educación → bajos ingresos).

# --- Parte 3: Gráfico de Densidad del IMN_2020 por Entidad ---

entidades_interes <- c("Nuevo León", "Durango", "Jalisco", "Veracruz de Ignacio de la Llave", "Chiapas")
variable_imn <- "IMN_2020"
datos_entidades_estudio <- marginacion_base[marginacion_base$NOM_ENT %in% entidades_interes, ]
datos_entidades_estudio[[variable_imn]] <- as.numeric(datos_entidades_estudio[[variable_imn]])

# --- PASO 1: Filtrado de Datos por Entidad ---

nuevo_leon_imn <- na.omit(subset(marginacion_base, NOM_ENT == "Nuevo León")[[variable_imn]])
durango_imn <- na.omit(subset(marginacion_base, NOM_ENT == "Durango")[[variable_imn]])
jalisco_imn <- na.omit(subset(marginacion_base, NOM_ENT == "Jalisco")[[variable_imn]])
veracruz_imn <- na.omit(subset(marginacion_base, NOM_ENT == "Veracruz de Ignacio de la Llave")[[variable_imn]])
chiapas_imn <- na.omit(subset(marginacion_base, NOM_ENT == "Chiapas")[[variable_imn]])


densidad_nuevo_leon <- density(nuevo_leon_imn)
densidad_durango <- density(durango_imn)
densidad_jalisco <- density(jalisco_imn)
densidad_veracruz <- density(veracruz_imn)
densidad_chiapas <- density(chiapas_imn)

colores <- c("cadetblue", "coral", "antiquewhite4", "brown", "goldenrod")

min_x_vals <- c(min(densidad_nuevo_leon$x),
                min(densidad_durango$x),
                min(densidad_jalisco$x),
                min(densidad_veracruz$x),
                min(densidad_chiapas$x))

max_x_vals <- c(max(densidad_nuevo_leon$x),
                max(densidad_durango$x),
                max(densidad_jalisco$x),
                max(densidad_veracruz$x),
                max(densidad_chiapas$x))

rango_x <- c(min(min_x_vals), max(max_x_vals))

max_y_vals <- c(max(densidad_nuevo_leon$y),
                max(densidad_durango$y),
                max(densidad_jalisco$y),
                max(densidad_veracruz$y),
                max(densidad_chiapas$y))

rango_y <- c(0, max(max_y_vals))

plot(densidad_nuevo_leon, 
     xlim = rango_x, 
     ylim = rango_y,
     main = "Densidad del Indice de Marginación Normalizado (IMN_2020) por Entidad",
     xlab = "Índice de Marginación Normalizado (IMN_2020)",
     ylab = "Densidad",
     col = colores[1],
     lwd = 2)

lines(densidad_durango, col = colores[2], lwd = 2)
lines(densidad_jalisco, col = colores[3], lwd = 2)
lines(densidad_veracruz, col = colores[4], lwd = 2)
lines(densidad_chiapas, col = colores[5], lwd = 2)

legend("topleft", 
       legend = entidades_interes, 
       col = colores, 
       lwd = 2, 
       cex = 0.8)

# El análisis comparativo de las curvas de densidad del Índice de Marginación Normalizado (IMN_2020)
# revela contrastes fundamentales en la distribución de la marginación a nivel municipal
# entre las entidades seleccionadas.
# Entidad Posición de la Curva (Tendencia Central) Forma de la Curva (Dispersión/Heterogeneidad) Conclusión Clave
# Nuevo León
# Muy hacia la izquierda (valores bajos, $\approx 0$ o negativos).
# Alta y Estrecha (Baja dispersión).
# La mayoría de sus municipios presentan una marginación muy baja y homogénea, 
# con el núcleo de municipios altamente industrializados dominando la distribución.
# 
# Jalisco
# Hacia la izquierda (valores bajos).Ancha/Asimétrica (Dispersión Media-Alta).
# La distribución muestra heterogeneidad.
# Coexisten municipios de muy baja marginación (Zona Metropolitana de Guadalajara) 
# y un grupo considerable de municipios rurales con marginación media o alta.
# 
# Durango
# Cerca del centro (valores cercanos al promedio nacional).
# Ancha (Dispersión Media).
# Muestra una distribución más equilibrada alrededor del promedio nacional.
# Su curva es más plana, indicando una mezcla continua de municipios de baja y alta marginación.
# Veracruz
# Hacia la derecha (valores altos).
# Ancha y Plana (Alta dispersión).
# Presenta una alta dispersión de la marginación, reflejando el fuerte contraste
# entre su franja costera y sus extensas regiones rurales.
# La mayoría de sus municipios se encuentran en la zona de marginación media-alta.
# 
# Chiapas
# Significativamente hacia la derecha (valores muy altos).Alta y Estrecha (sesgada a la derecha).
# Sus municipios tienen la marginación más alta y concentrada.
# El pico de la curva está lejos a la derecha, indicando que la mayor parte de la 
# población municipal se ubica en los niveles más severos de marginación.
# 


# --- Parte 4: Resumen de Población Total (POB_TOT) por Entidad ---
variable_pob <- "POB_TOT"
marginacion_base[[variable_pob]] <- as.numeric(marginacion_base[[variable_pob]])

# Creamos un data frame vacío para almacenar los resultados
resumen_poblacion <- data.frame(
  Entidad = character(),
  Poblacion_Total_Municipal = numeric(),
  stringsAsFactors = FALSE
)

for (estado in entidades) {
  # Seleccionamos la POB_TOT para el estado actual
  poblacion_estado <- subset(marginacion_base, NOM_ENT == estado)[[variable_pob]]
  
  # Calculamos la suma
  suma_poblacion <- sum(poblacion_estado)
  
  # Creamos una nueva fila
  nueva_fila <- data.frame(
    Entidad = estado,
    Poblacion_Total_Municipal = suma_poblacion,
    stringsAsFactors = FALSE
  )
  
  # Añadimos la nueva fila al data frame de resultados usando rbind (base R)
  resumen_poblacion <- rbind(resumen_poblacion, nueva_fila)
}

resumen_poblacion <- resumen_poblacion[order(resumen_poblacion$Entidad), ]

resumen_poblacion$Poblacion_Total_Municipal_Formato <- 
  format(resumen_poblacion$Poblacion_Total_Municipal, big.mark = ",", scientific = FALSE)

print(resumen_poblacion[, c("Entidad", "Poblacion_Total_Municipal_Formato")])

poblacion_nacional_calculada <- sum(resumen_poblacion$Poblacion_Total_Municipal)
print(paste0("Total Nacional Calculado (Suma de las 32 Entidades): ", 
             format(poblacion_nacional_calculada, big.mark = ",", scientific = FALSE)))


# --- Estadística para la Ciencia de Datos ---
# --- Parte 5: Comparación de Boxplots del Índice de Marginación (IM_2020) ---

# Definir las entidades de interés
entidades_boxplot <- c("Chiapas", "Guerrero", "Nuevo León", "Tamaulipas", "Durango")

# --- PASO 1: Preparación de Datos ---


# 2. Filtrar los datos para incluir solo las 5 entidades
datos_boxplot <- subset(marginacion_base, NOM_ENT %in% entidades_boxplot)

# 3. Eliminar filas con NA en el índice de marginación
datos_boxplot <- na.omit(datos_boxplot[, c("NOM_ENT", variable_imn)])


# --- PASO 2: Generación del Boxplot ---

print("Generando Gráfico de Boxplots para el Índice de Marginación (IM_2020)...")

# 1. Generar el boxplot
# Fórmula: Variable ~ Grupo (IM_2020 por NOM_ENT)
boxplot(IMN_2020 ~ NOM_ENT, 
        data = datos_boxplot,
        main = "Comparación del Índice de Marginación Municipal (IM_2020)",
        xlab = "Entidad Federativa",
        ylab = "Índice de Marginación (IM_2020)",
        col = colores, # Asignación de colores
        #las = 2, # Rotar etiquetas del eje X verticalmente para mejor lectura
        outline = TRUE) # Mostrar outliers (puntos fuera de los bigotes)

print("Gráfico de Boxplots generado.")


# Entidad	Posición de la Caja (Mediana)	Tamaño de la Caja y Bigotes (Dispersión)	Valores Atípicos (Outliers)	Conclusión Principal
# Chiapas y Guerrero
# Más alta. El 50% central está en los valores más altos del índice.
# Compacta/Alta: Esto indica que sus municipios son homogéneamente marginados.
# La gran mayoría se agrupa en índices muy altos.	Pocos o nulos hacia la baja.
# Alta Marginación Concentrada. Son los estados con la peor situación generalizada a nivel municipal.
# Nuevo León
# Más baja. La mediana se encuentra en los valores más bajos.	Muy compacta y baja.
# La dispersión es mínima y se concentra en valores muy positivos (baja marginación).
# Posibles atípicos hacia la alta marginación (municipios rurales aislados).
# Baja Marginación Concentrada. Sus municipios son, en su mayoría, los menos marginados.
# 
# Tamaulipas y Durango	Posición intermedia (más cerca de la zona media del gráfico).
# Más amplias. La caja y los bigotes se extienden significativamente.
# Probables atípicos en ambas direcciones (baja y alta marginación).
# Heterogeneidad. Estos estados muestran la mayor desigualdad interna.
# Coexisten municipios de baja marginación (ciudades principales) y municipios con
# problemas severos (zonas rurales o fronterizas).



# Distribuciones de probabilidad

# 1. El 30% de un determinado pueblo ve un concurso que hay en televisión. Desde el
# concurso se llama por teléfono a 10 personas del pueblo elegidas al azar. Determinar la
# probabilidad que, de las 10 personas elegidas:
# 

# Datos:
# Número de eventos n = 10
# Probabilidad de éxito p = 0.30

# (a) Más de ocho personas estén viendo el programa
# $P(X=9) + P(X=10)$
prob_mas_de_ocho <- dbinom(x = 9, size = 10, prob = 0.30) + dbinom(x = 10, size = 10, prob = 0.30)
prob_mas_de_ocho

# 
# (b) Al menos una persona de las diez esté viendo el programa
# $P(X \ge 1) = 1 - P(X < 1)$
prob_al_menos_1 <- 1 - pbinom(q = 0, size = 10, prob = 0.30)
prob_al_menos_1

# Probabilidad (X ≥ 1): 0.9718

# Se estudia la distribución de células de levadura en 400 cuadrículas de un hemacitómetro.
# Este es un aparato semejante al utilizado para hacer los recuentos de las células sanguíneas
# y de otras estructuras microscópicas suspendidas en líquidos. ¿Cuál es la probabilidad
# de encontrar dos células en las cuadriculas observadas? Después de haber muestreado
# 400 cuadrículas y contado la cantidad de células de levadura en cada una de ellas, se
# obtuvo la siguiente tabla de frecuencias:
#   
# (a) Calcular el valor esperado de células por cuadrícula E(X)

conteo_celulas <- c(0, 1, 2, 3, 4, 5, 6, 7, 8)
frecuencia <- c(75, 103, 121, 54, 30, 13, 2, 1, 1)
sum_celulas_por_frequencia <- sum(conteo_celulas * frecuencia)
total_cuadriculas <- sum(frecuencia)

E_X <- sum_celulas_por_frequencia / total_cuadriculas
E_X

# (b) ¿Cuál es la probabilidad de encontrar dos células en las cuadriculas observadas?
lambda <- E_X # 1.9425
x_valor <- 2          # Queremos P(X=2)

# Calcular la probabilidad con dpois
prob_dos_celulas <- dpois(x = x_valor, lambda = lambda)

# Mostrar resultado
print(paste("Probabilidad de encontrar 2 células P(X=2):", round(prob_dos_celulas, 4)))

# Utilizando el modelo de Poisson basado en nuestros datos, la probabilidad teórica
# de encontrar exactamente dos células en una cuadrícula elegida al azar es del 25.05%.

# (c) Calcular la probabilidad de que los conteos de células se encuentren entre 3 y 7.

# Esto significa que queremos la probabilidad de que
# $X$ sea mayor o igual a 3 y menor o igual a 7: $P(3 \le X \le 7)$.
# Como $X$ es discreta, esto es la suma de las probabilidades puntuales:
# $P(X=3) + P(X=4) + P(X=5) + P(X=6) + P(X=7)$.

# Parámetros
lambda <- E_X # 1.9425

# Calcular las probabilidades puntuales para X=3, 4, 5, 6, 7
prob_3 <- dpois(x = 3, lambda = lambda)
prob_4 <- dpois(x = 4, lambda = lambda)
prob_5 <- dpois(x = 5, lambda = lambda)
prob_6 <- dpois(x = 6, lambda = lambda)
prob_7 <- dpois(x = 7, lambda = lambda)

# Sumar las probabilidades
prob_rango_3_a_7 <- prob_3 + prob_4 + prob_5 + prob_6 + prob_7

# Mostrar resultados detallados
print(paste("P(X=3):", round(prob_3, 4)))
print(paste("P(X=4):", round(prob_4, 4)))
print(paste("P(X=5):", round(prob_5, 4)))
# ...
print(paste("Probabilidad (3 <= X <= 7):", round(prob_rango_3_a_7, 4)))

# La probabilidad teórica de que una cuadrícula seleccionada al azar contenga entre 3 y 7 células
# de levadura es del 15.84%. Esto refleja que la mayoría de los conteos se concentran
# en los valores más bajos (cercanos a la media de 1.94), por lo que la probabilidad
# de encontrar conteos en este rango superior es menor.


# 3. La longitud X de ciertos tornillos es una variable aleatoria con distribucion normal de
# 
# media 30mm y desviacion tipica 0.2mm. Se aceptan como validos aquellos que cumplen
# 
# 29.5mm < X < 30.4mm. Calcular las siguientes probabilidades:

# Datos del problema:
#   Media ($\mu$): 30 mm
#   Desviación Típica ($\sigma$): 0.2 mm
#   Rango Aceptable: $29.5 \text{ mm} < X < 30.4 \text{ mm}$

#   
# (a) Tornillos no aceptables por cortos
# $$P(X \le 29.5)$$
media <- 30
desviacion_tipica <- 0.2
limite_corto <- 29.5

# P(X <= 29.5)
prob_cortos <- pnorm(q = limite_corto, mean = media, sd = desviacion_tipica)

print(paste("Probabilidad de tornillos no aceptables por cortos P(X <= 29.5):", round(prob_cortos, 4)))

# La probabilidad de que un tornillo sea rechazado por ser demasiado corto (menos de 29.5 mm)
# es muy baja, de solo 0.62%. Esto indica que el proceso de fabricación está bien centrado y 
# la longitud mínima está alejada del valor promedio.
# 
# (b) Tornillos no aceptables por largos
# 
# Los tornillos no son aceptables por largos si su longitud
# $X$ es mayor o igual a $30.4 \text{ mm}$.$$P(X \ge 30.4) = 1 - P(X < 30.4)$$

limite_largo <- 30.4

# P(X >= 30.4) = 1 - P(X < 30.4)
prob_largos <- 1 - pnorm(q = limite_largo, mean = media, sd = desviacion_tipica)

print(paste("Probabilidad de tornillos no aceptables por largos P(X >= 30.4):", round(prob_largos, 4)))

# La probabilidad de que un tornillo sea rechazado por ser demasiado largo (más de 30.4 mm) es del 2.28%.
# Esta probabilidad es mayor que la de ser corto, sugiriendo una ligera asimetría 
# en la distribución de rechazos (el límite superior está más cerca del promedio, 
#                                 o el proceso tiene una ligera tendencia a ser largo).

# (c) Tornillos no validos
# 

# Los tornillos no válidos son aquellos que son cortos O largos:
#   $$P(\text{No Válidos}) = P(X \le 29.5) + P(X \ge 30.4)$$

# P(No Válidos) = P(Cortos) + P(Largos)
prob_no_validos <- prob_cortos + prob_largos

# Para verificar, calculamos primero la probabilidad de que SÍ sean válidos:
# P(29.5 < X < 30.4) = P(X < 30.4) - P(X <= 29.5)
prob_validos <- pnorm(limite_largo, media, desviacion_tipica) - pnorm(limite_corto, media, desviacion_tipica)

# Y P(No Válidos) = 1 - P(Válidos)
prob_no_validos_alternativa <- 1 - prob_validos

print(paste("Probabilidad de tornillos no validos (Sumando a y b):", round(prob_no_validos, 4)))
print(paste("Probabilidad de tornillos no validos (1 - P(Válidos)):", round(prob_no_validos_alternativa, 4)))

# Probabilidad de tornillos no validos: 0.0290 (o 2.90%)


# (d) ¿Cual es la probabilidad que de una muestra de 15 tornillos entre 13 y 15 tornillos resulten validos?
# Esta pregunta combina la Distribución Normal (para hallar la probabilidad de éxito)
# con la Distribución Binomial (para la probabilidad en una muestra de ensayos).
# Paso 1: Determinar la probabilidad de éxito ($p$ en la Binomial).
# La probabilidad de que un solo tornillo sea válido es 
# $p = P(\text{Válido})$ calculado en la parte (c):$$p = P(29.5 < X < 30.4) \approx 0.9710$$
#   
#   Paso 2: Usar la Distribución Binomial.
# Número de ensayos ($n$): 15Probabilidad de éxito ($p$): $0.9710$Queremos $P(13 \le Y \le 15)$, donde $Y$ es el número de tornillos válidos.$$P(Y=13) + P(Y=14) + P(Y=15)$$

# Parámetros Binomiales
n_muestra <- 15 # Tamaño de la muestra
p_valido <- prob_validos # Probabilidad de que un tornillo sea válido (0.9709...)

# Calculamos las probabilidades puntuales con dbinom
prob_13 <- dbinom(x = 13, size = n_muestra, prob = p_valido)
prob_14 <- dbinom(x = 14, size = n_muestra, prob = p_valido)
prob_15 <- dbinom(x = 15, size = n_muestra, prob = p_valido)

# Sumamos las probabilidades
prob_rango_13_a_15 <- prob_13 + prob_14 + prob_15

print(paste("Probabilidad (Y=13):", round(prob_13, 4)))
print(paste("Probabilidad (Y=14):", round(prob_14, 4)))
print(paste("Probabilidad (Y=15):", round(prob_15, 4)))
print(paste("Probabilidad (13 <= Y <= 15):", round(prob_rango_13_a_15, 4)))

# Resultado:Probabilidad ($13 \le Y \le 15$): 0.9930 (o 99.30%)

# Resultado:
#   
#   Probabilidad de tornillos no validos: 0.0290 (o 2.90%)
# 
# Interpretación Simple del Resultado (c)
# 
# La probabilidad total de que un tornillo seleccionado al azar no sea válido
# (ya sea por corto o por largo) es de aproximadamente 2.90%.
# Esto significa que el 97.10% de los tornillos producidos cumplen con las especificaciones
# de calidad.


# (d) ¿Cuál es la probabilidad que de una muestra de 15 tornillos entre 13 y 15 
# tornillos resulten validos?
#   
# Esta pregunta combina la Distribución Normal (para hallar la probabilidad de éxito)
# con la Distribución Binomial (para la probabilidad en una muestra de ensayos).
# 
# Paso 1: Determinar la probabilidad de éxito ($p$ en la Binomial).
# 
# La probabilidad de que un solo tornillo sea válido es
# 
# $p = P(\text{Válido})$ calculado en la parte (c):$$p = P(29.5 < X < 30.4) \approx 0.9710$$
#   
# Paso 2: Usar la Distribución Binomial.Número de ensayos ($n$): 15
# 
# Probabilidad de éxito ($p$): $0.9710$Queremos $P(13 \le Y \le 15)$, 
# donde $Y$ es el número de tornillos válidos.$$P(Y=13) + P(Y=14) + P(Y=15)$$R# Parámetros Binomiales

n_muestra <- 15 # Tamaño de la muestra
p_valido <- prob_validos # Probabilidad de que un tornillo sea válido (0.9709...)

# Calculamos las probabilidades puntuales con dbinom
prob_13 <- dbinom(x = 13, size = n_muestra, prob = p_valido)
prob_14 <- dbinom(x = 14, size = n_muestra, prob = p_valido)
prob_15 <- dbinom(x = 15, size = n_muestra, prob = p_valido)

# Sumamos las probabilidades
prob_rango_13_a_15 <- prob_13 + prob_14 + prob_15

print(paste("Probabilidad (Y=13):", round(prob_13, 4)))
print(paste("Probabilidad (Y=14):", round(prob_14, 4)))
print(paste("Probabilidad (Y=15):", round(prob_15, 4)))
print(paste("Probabilidad (13 <= Y <= 15):", round(prob_rango_13_a_15, 4)))

# Resultado:Probabilidad ($13 \le Y \le 15$): 0.9930 (o 99.30%)
# 
# Interpretación Simple del Resultado (d)
# 
# Dado que casi el 97.1% de los tornillos son válidos, la probabilidad de que en una
# muestra pequeña de 15, entre 13 y 15 resulten ser válidos es extremadamente alta,
# alcanzando el 99.30%. Es decir, es casi seguro que la muestra tendrá muy pocos o
# ningún tornillo defectuoso.



# 4. Se tiene conocido por estudios previos que el tiempo de vida util de computadoras
# personales de cierta marca sigue una distribucion N(1000,20) dias.

# Datos Iniciales (Distribución Normal):
# Tiempo de vida útil ($X$): Sigue una $N(\mu, \sigma^2)$
# Media ($\mu$): 1000 días
# Desviación Típica ($\sigma$): 20 días



# (a) ¿A partir de cuantas horas se espera que fallen minimo el 95% de las computadoras?

# Esta es una pregunta de cuantil, que requiere encontrar el valor $x$ tal que $P(X \le x) = 0.95$.
# Usaremos la función qnorm().
# 
# Paso 1: Hallar el Cuantil en Días.

media <- 1000
desviacion_tipica <- 20
probabilidad <- 0.95

# 1. Hallar el cuantil: qnorm(probabilidad, media, sd)
dias_95_percentil <- qnorm(p = probabilidad, mean = media, sd = desviacion_tipica)
print(paste("Días (95% percentil):", round(dias_95_percentil, 2)))  


# Paso 2: Convertir Días a Horas.$$1 \text{ día} = 24 \text{ horas}$$

horas_95_percentil <- dias_95_percentil * 24

print(paste("Horas (95% percentil):", round(horas_95_percentil, 2)))

# Resultado:Días (95% percentil): 1032.90 díasHoras (95% percentil): 24789.58 horas
# 
# Interpretación Simple del Resultado (a)
# 
# Se espera que el 95% de las computadoras fallen antes de las 24,789.58 horas (o 1032.90 días).
# Por lo tanto, el tiempo de vida útil debe ser superior a esta cantidad de horas
# para estar en el 5% de las computadoras más duraderas. O, mirando el 95% que fallan
# antes, este es el límite superior de tiempo para la gran mayoría.


# (b) La garantia determina que se reemplazara una computadora si dura sin fallar
# menos de 800 dias. Determinar cual es la probabilidad de que reemplacen los equipos
# a cierto cliente.

# Una computadora se reemplaza si falla en menos de 800 días ($X < 800$).
# Usaremos pnorm().$$P(X < 800)$$

limite_garantia <- 800

# 1. Calcular la probabilidad P(X < 800)
prob_reemplazo <- pnorm(q = limite_garantia, mean = media, sd = desviacion_tipica)

print(paste("Probabilidad de reemplazo (P(X < 800 días)):", round(prob_reemplazo, 8)))

# Resultado:Probabilidad de reemplazo ($P(X < 800 \text{ días})$): 0.00000000 (cercano a cero)
# 
# Interpretación Simple del Resultado (b)
# 
# La probabilidad de que una computadora de esta marca falle antes de los 800 días
# es extremadamente baja, casi cero. Esto indica que la garantía de 800 días está 
# muy alejada de la media de 1000 días (a 10 desviaciones estándar de distancia), 
# y es prácticamente seguro que la empresa no tendrá que reemplazar equipos bajo esta cláusula.

# (c) Dado un lote de 20 computadoras, ¿cual es numero esperado de computadoras que se regresen?

# Esta es una pregunta de valor esperado de una Distribución Binomial, donde el "éxito"
# es que una computadora sea regresada (falle antes de 800 días).
# Paso 1: Determinar los parámetros de la Binomial.Número de ensayos ($n$): 20
# 
# Probabilidad de éxito ($p$): $P(X < 800) \approx 0$ 
# (Usamos el valor exacto de R, aunque es muy pequeño).
# 
# Paso 2: Calcular el valor esperado $E(Y)$.En una distribución Binomial,
# el valor esperado es:$$E(Y) = n \times p$$

n_lote_20 <- 20
p_regreso <- prob_reemplazo # Valor exacto muy pequeño

# Calcular el número esperado de regresos: n * p
valor_esperado_regresos <- n_lote_20 * p_regreso

print(paste("Número Esperado de regresos (E(Y)):", valor_esperado_regresos))

# Resultado:Número Esperado de regresos ($E(Y)$): $7.62 \times 10^{-18}$

# Interpretación Simple del Resultado (c)
# El número esperado de computadoras que se regresen de un lote de 20 es extremadamente
# cercano a cero.
# Dada la alta fiabilidad del equipo (la garantía es muy corta en comparación con la vida media),
# la empresa puede esperar que, estadísticamente, casi nunca tendrá que reemplazar
# una computadora de este lote.

# (d) ¿Cual es la probabilidad de que se regresen entre una y dos computadoras de 
# un lote de 30 computadoras?

# Esta es una pregunta de probabilidad puntual Binomial
# $P(1 \le Y \le 2)$ . $P(Y=1) + P(Y=2)$
# 
# Paso 1: Determinar los parámetros de la Binomial.Número de ensayos ($n$): 30
# Probabilidad de éxito ($p$): $P(X < 800) \approx 0$
# 
# Paso 2: Calcular la probabilidad $P(Y=1) + P(Y=2)$.

n_lote_30 <- 30
p_regreso <- prob_reemplazo # Valor exacto muy pequeño

# 1. Probabilidad de que se regrese 1 computadora P(Y=1)
prob_1 <- dbinom(x = 1, size = n_lote_30, prob = p_regreso)

# 2. Probabilidad de que se regresen 2 computadoras P(Y=2)
prob_2 <- dbinom(x = 2, size = n_lote_30, prob = p_regreso)

# 3. Sumar las probabilidades
prob_1_o_2_regresadas <- prob_1 + prob_2

print(paste("Probabilidad de 1 o 2 regresos:", round(prob_1_o_2_regresadas, 8)))

# Resultado:
# Probabilidad de 1 o 2 regresos: $0.00000000$ (cercano a cero)
# 
# Interpretación Simple del Resultado (d)
# 
# Debido a que la probabilidad de que una sola computadora sea devuelta es prácticamente
# cero (ver parte b), la probabilidad de que una o dos de un lote de 30 sean devueltas
# es también prácticamente nula. Es una confirmación más de la alta fiabilidad del
# producto bajo los términos de la garantía.
# 



