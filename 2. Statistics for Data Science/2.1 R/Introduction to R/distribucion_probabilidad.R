# Distribuciones de probabilidad

# n = 50 p = 0.3
# P(X = 10) + P(X = 11) + ... + P(X = 40)
# P(10 <= x <= 40)

pbinom(40, size = 50, prob = 0.3, lower.tail = TRUE) - # Probabilidad de hasta 40 fumadores
pbinom(9, size = 50, prob = 0.3, lower.tail = TRUE)
# 95.97 % Es muy probable tener entre 10 y 40 fumadores
# ¿Cuál es el valor esperado de fumadores?
# n * p
50*.3

# P(X <= 40) - P(X <= 9)  -> P(X <= 40) - P(X < 10)

# P(X >= 25) = P(X = 25) + P(X = 26) + .. + P(X = 50)
# P(X>=x), x = 25
# 1 - P(X <= 24)
# P(X <= 24) + P(X >= 25) = 1
# P(X >= 25) = 1 - P(X <= 24) 
1 - pbinom(24, prob = 0.3, size = 50)
pbinom(24, prob = 0.3, size = 50, lower.tail = FALSE)

choose(4,2)
