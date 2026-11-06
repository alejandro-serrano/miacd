import numpy as np
import plotly.graph_objects as go
from nltk.corpus import stopwords

# Límites (simétricos) ahora para 3D
max_x = np.max(np.abs(reduced_matrix[:, 0]))
max_y = np.max(np.abs(reduced_matrix[:, 1]))
max_z = np.max(np.abs(reduced_matrix[:, 2]))

# Datos (mantenemos target_words y el coloreo por stopwords)
sw = set(stopwords.words("spanish"))
n = len(target_words)
x = reduced_matrix[:n, 0]
y = reduced_matrix[:n, 1]
z = reduced_matrix[:n, 2]
colors = ['red' if w in sw else 'black' for w in target_words]

# Plotly 3D: puntos + texto
fig = go.Figure(data=go.Scatter3d(
    x=x, y=y, z=z,
    mode='markers+text',
    text=target_words,
    textposition='top center',
    marker=dict(size=3, color=colors)
))

# Ejes con mismos rangos que antes (simétricos), sin leyenda
fig.update_layout(
    scene=dict(
        xaxis=dict(range=[-max_x, max_x]),
        yaxis=dict(range=[-max_y, max_y]),
        zaxis=dict(range=[-max_z, max_z])
    ),
    showlegend=False,
    width=1000, height=800,
    margin=dict(l=0, r=0, b=0, t=0)
)

fig.show()