################## Dengue
# Edad promedio por estado de las personas con dengue
# Edad promedio por estado y por sexo de personas con dengue

dengue <- read.csv("dengue_abierto.csv")
# install.packages("readxl")
library(readxl)
catalogo_sexo <- read_excel("Catálogos_Dengue.xlsx", sheet = "CATÁLOGO SEXO")
catalogo_entidad <- read_excel("Catálogos_Dengue.xlsx", sheet = "CATÁLOGO ENTIDAD")
catalogo_municipio <- read_excel("Catálogos_Dengue.xlsx", sheet = "CATÁLOGO MUNICIPIO")

catalogo_sexo
dengue$SEXO

dengue2 <- merge(dengue, catalogo_sexo, by.x="SEXO", by.y="CLAVE") # unión o fusión
dengue2$DESCRIPCIÓN
table(dengue2$DESCRIPCIÓN)

catalogo_entidad

catalogo_entidad$CLAVE_ENTIDAD <- as.numeric(catalogo_entidad$CLAVE_ENTIDAD)
catalogo_entidad

dengue3 <- merge(dengue2, catalogo_entidad, by.x="ENTIDAD_RES", by.y="CLAVE_ENTIDAD") # unión o fusión
table(dengue3$ABREVIATURA)

aggregate(EDAD_ANOS ~ ABREVIATURA, FUN = mean, data=dengue3)
aggregate(EDAD_ANOS ~ ABREVIATURA+DESCRIPCIÓN, FUN = mean, data=dengue3)
aggregate(EDAD_ANOS ~ DESCRIPCIÓN+ABREVIATURA, FUN = mean, data=dengue3)

# Municipios
catalogo_municipio$CLAVE_MUNICIPIO <- as.numeric(catalogo_municipio$CLAVE_MUNICIPIO)
catalogo_municipio$CLAVE_ENTIDAD <- as.numeric(catalogo_municipio$CLAVE_ENTIDAD)

dengue4 <- merge(x = dengue3, y = catalogo_municipio, by.x=c("ENTIDAD_RES", "MUNICIPIO_RES"),
      by.y=c("CLAVE_ENTIDAD","CLAVE_MUNICIPIO"))
dengue4$MUNICIPIO

dengue4$MUNIUNICO <- paste0(dengue4$ABREVIATURA, " - ", dengue4$MUNICIPIO)

sort(table(dengue4$MUNIUNICO), decreasing = TRUE)[1:10]
sort(table(dengue4$ABREVIATURA), decreasing = TRUE)[1:5]

sum(dengue4[1,15:20])
comorbilidades <- 12 - rowSums(dengue4[,15:20])
table(comorbilidades)
dengue4[which(comorbilidades == 6),]

tabla1 <- table(comorbilidades, dengue4$DEFUNCION)

prop.table(tabla1, 1)
prop.table(tabla1, 2)

# Meses con mayor cantidad de casos de dengue
library(lubridate)
dengue4$FECHA_SIGN_SINTOMAS
fecha_sint <- as.Date(dengue4$FECHA_SIGN_SINTOMAS, tryFormats = "%d/%m/%Y")
months(fecha_sint)
meses <- month(fecha_sint, label = TRUE)
table(fecha_sint)
sort(table(meses), decreasing = TRUE)

# Graficación
plot(sort(table(fecha_sint), decreasing = TRUE))
plot(sort(table(fecha_sint)))
ts.plot(fecha_sint)

tabla_estados <- data.frame(table(dengue4$ABREVIATURA))
dim(tabla_estados)
barplot(tabla_estados[1:10,2], names.arg = tabla_estados[1:10,1])

