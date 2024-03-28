import numpy as np

def generacionParesOrdenados(n:int) -> np.ndarray:
    return np.random.randint(0, 100, (n, 2))

def encontrar_coeficientes(pares:np.ndarray) -> np.ndarray:
    x, y = pares[:, 0], pares[:, 1]

def interpolacion(pares:np.ndarray) -> float:
    x, y = pares[:, 0], pares[:, 1]
    a, b, c, d = encontrar_coeficientes(pares)
