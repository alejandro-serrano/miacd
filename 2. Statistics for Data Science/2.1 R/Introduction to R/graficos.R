library(lubridate)

sismos<-read.csv("SSNMX_catalogo_19000101_20251004.csv")

fechas<-as.Date(sismos$Fecha,tryFormats = "%d/%m/%Y")
sismos11<-sismos[year(fechas)>=1980,] #Por año

sismos11$Magnitud <- as.numeric(sismos11$Magnitud) # Se generan NAs
sismos22 <- sismos11[!is.na(sismos11$Magnitud),] # Valores de magnitud cuantificadas

sismos22$Estado2[which(sismos22$Estado2 == " OAx")] <- " OAX"
sismos33 <- sismos22[sismos22$Estado2 %in% c(" OAX", " CHIS", " GRO", " HGO"),]

sort(table(sismos33$Estado2), decreasing = TRUE)

table(sismos22$Estado2)[order(table(sismos22$Estado2))]

frecu_tabla <- data.frame(table(sismos22$Estado2))
frecu_tabla[order(frecu_tabla$Freq, decreasing = TRUE),] # Frecuencia
frecu_tabla[order(frecu_tabla$Var1, decreasing = FALSE),] # Nombre

## Boxplot
boxplot(sismos33$Magnitud)

boxplot(Magnitud~Estado2, data=sismos33)
boxplot(sismos33$Magnitud~sismos33$Estado2, col = "blue", range=2, horizontal = TRUE)

grafico_falso <- boxplot(Magnitud~Estado2, data=sismos33, plot = FALSE, range = 2.5)
grafico_falso$stats


sismosHGO <- sismos33[sismos33$Estado2==" HGO",]

install.packages("beeswarm")
library("beeswarm")

beeswarm(sismosHGO$Magnitud, col=2, cex=0.5, pch=18)

hist(sismosHGO$Magnitud, breaks="Freedman-Diaconis")
hist(sismosHGO$Magnitud)
hist(sismosHGO$Magnitud, breaks=seq(0,5,0.5))
range(sismosHGO$Magnitud)

plot(density(sismosHGO$Magnitud), ylim=c(0,2))
lines(density(sismos33$Magnitud))

library(car)
densityPlot(sismos33$Magnitud~as.factor(sismos33$Estado2))

library(readxl)
turismo<-read_excel("Turismo.xlsx")

par(fig=c(0,0.7,0,0.7)) #Jugar con este parámetro
plot(turismo$AN, turismo$`S&P`, xlab="AN",
     ylab="S&P")
par(fig=c(0,0.7,0.4,1), new=TRUE)
boxplot(turismo$AN, horizontal=TRUE, axes=FALSE)
par(fig=c(0.65,1,0,0.7),new=TRUE)
boxplot(turismo$`S&P`, axes=FALSE)
mtext("Dispersión + Boxplot", side=3, outer=TRUE, line=-3)
dev.off()

# Gráfico 3D
install.packages("scatterplot3d")
library(scatterplot3d)
scatterplot3d(turismo[,2:4], pch = 3)
scatterplot3d(x=turismo$AN,y=turismo$TIC,z=turismo$Precios,pch=3)
scatterplot3d(turismo[,2:4], color=1:nrow(turismo))
scatterplot3d(turismo[,2:4], color=turismo["continente"])

install.packages("rgl")
library(rgl)
plot3d(x=turismo$AN,y=turismo$TIC,z=turismo$Precios,pch=3)

install.packages("aplpack")
library(aplpack)
faces(turismo[,2:6])
faces(turismo[,2:6],labels=as.factor(turismo$Pais))


