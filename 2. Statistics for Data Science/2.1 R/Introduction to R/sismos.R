# Ctrl + l - Clean the console
x <- 5
sismos <- read.csv("D:\\Alejandro\\dev\\miacd\\2. Statistics for Data Science\\2.1 R\\Introduction to R\\SSNMX_catalogo_19000101_20251004.csv")
dim(sismos)
colnames(sismos)
fechas <- as.Date(sismos$Fecha, tryFormats = "%d/%m/%Y")
months(fechas)
install.packages("lubridate")
library(lubridate)
anios <- year(fechas)

meses <- month(fechas, label = TRUE)
table(meses)
table(anios)

sismos2 <- sismos[anios>=1980,]
dim(sismos2)
dim(sismos)

sismos$anio <- anios
sismos$mes <- meses
sismos$dias <-day(fechas)
colnames(sismos)

sismos2 <- sismos[sismos$anio>=1980,]
table(sismos2$anio)
table(sismos2$mes)

head(sismos2$Magnitud,50)
tail(sismos2$Magnitud,50)

sismos2$Magnitud <- as.numeric(sismos2$Magnitud)
sismos2$Magnitud

mean(sismos2$Magnitud,na.rm = TRUE)

summary(sismos2$Magnitud)

table(sismos2$Magnitud == 8.2)

is.na(sismos2$Magnitud)

sismoper<-sismos2[sismos2$Magnitud >= 5 & !is.na(sismos2$Magnitud),]
table(sismoper$mes)

estaturas<-c(69,71,67,66,59,73,80,70,72,69,68,72,59,76,
             67,74,67,74,64,63,71,66,67,62,62,57,71,56,
             69,65,79,70,71,78,75,65,61,57,59,66,
             63,61,64,61,60,62,65,59,70,77)
sum(estaturas) * (1/length(estaturas))
median(estaturas) # Mediana
sort(estaturas)[25]
sort(estaturas)[(length(estaturas)/2)]
(sort(estaturas)[length(estaturas)/2] + sort(estaturas)[(length(estaturas)/2) + 1])/2 # Mediana
  
frecuencias_estaturas <- table(estaturas)  
max(frecuencias_estaturas)  
elemento <- which(frecuencias_estaturas == max(frecuencias_estaturas)) # Moda
length(frecuencias_estaturas)
names(frecuencias_estaturas)[elemento]


# Rango
range(estaturas)

# Dispersión
diff(range(estaturas))
max(estaturas) - min(estaturas)

# Rango interquartil
ceiling(0.25*length(estaturas),0)
round(0.75*length(estaturas),0)
estaturas_ordenadas <- sort(estaturas)
estaturas_ordenadas[round(0.75*length(estaturas),0)] - estaturas_ordenadas[ceiling(0.25*length(estaturas))]

#Filtrar la base a registros validos
sismos2$Magnitud <- as.numeric(sismos2$Magnitud)
sismos2<-sismos[anios>=1980 ,]
dim(sismos2)

sismos2$Magnitud <- as.numeric(sismos2$Magnitud)
sismos3<-sismos2[!is.na(sismos2$Magnitud),]


#Rango intercunatílico de las magnitudes
max(sismos3$Magnitud)-min(sismos3$Magnitud)

sismo_orde<-sort(sismos3$Magnitud)
sismo_orde[trunc(length(sismos3$Magnitud)*.75)]-
  sismo_orde[round(length(sismos3$Magnitud)*.25)]
sum(abs(sismos3$Magnitud-mean(sismos3$Magnitud)))/(length(sismos3$Magnitud))

# DMA
sum(abs(sismos3$Magnitud-mean(sismos3$Magnitud)))/(length(sismos3$Magnitud))

vari_magni <- sum((sismos3$Magnitud - mean(sismos3$Magnitud)) ^ 2) / (length(sismos3$Magnitud) - 1)
vari_magni

sqrt(vari_magni)

# Mediana
sismo_orde[ceiling(length(sismos3$Magnitud) / 2)]
median(sismos3$Magnitud)

# Moda
frecuencia_sismos <- table(sismos3$Magnitud)
frecuencia_sismos
which(frecuencia_sismos == max(frecuencia_sismos))
names(frecuencia_sismos)[which(frecuencia_sismos == max(frecuencia_sismos))]
