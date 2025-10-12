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
