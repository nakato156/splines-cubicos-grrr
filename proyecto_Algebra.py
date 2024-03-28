import random
import numpy as np 

#Definimos el valor de N, en un valor aleatorio entre 8 y 12
n = random.randint(8, 12)

#Generamos los n pares ordenados

def generacionParesOrdenados(n):
    pares = []
    for i in range(n):
        x = random.randint(0, 100)
        y = random.randint(0, 100)
        pares.append((x, y))
    return pares

pares = generacionParesOrdenados(n)
print(f"Pares ordenados: {pares}")