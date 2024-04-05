import numpy as np
from scipy.interpolate import CubicSpline
import matplotlib.pyplot as plt


def encontrarRepetidosX(arreglo) :
    valores_x = arreglo[:,0]
    #Verificar si hay repetidos
    unicos, counts = np.unique(valores_x, return_counts=True)
    repetidos = unicos[counts > 1]
    #Reemplazarlos si es asi
    for repetido in repetidos:
        while repetido in arreglo[:, 0]:
            nuevo_valor = np.random.randint(0, 50)
            if nuevo_valor not in arreglo[:, 0]:
                arreglo[np.where(arreglo[:, 0] == repetido)[0][0], 0] = nuevo_valor

    return arreglo    

def generacionParesOrdenados(n:int) -> np.ndarray:
    pares = np.random.randint(0, 50, (n, 2))
    pares = encontrarRepetidosX(pares)
    i_pares = np.argsort(pares[:, 0])
    return pares[i_pares]

def interpolacion(pares:np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    x, y = pares[:, 0], pares[:, 1]
    sc = CubicSpline(x, y)

    p_min, p_max = x[0], x[-1]
    xs = np.arange(p_min, p_max + 0.1, 0.1)
    S = sc(xs)

    # fig, ax = plt.subplots(figsize=(6.5, 4))
    # ax.plot(x, y, 'o', label='data')
    # ax.plot(xs, S, label="S")
    # ax.plot(xs, sc(xs, 1), label="S'")
    # ax.plot(xs, sc(xs, 2), label="S''")

    # ax.set_xlim(-0.5, p_max + 5)
    # ax.legend(loc='lower left', ncol=2)
    # plt.savefig("interpolacion.png")

    return xs, S
