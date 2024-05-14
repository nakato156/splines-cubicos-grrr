from flask import Blueprint, request, jsonify
from ..functions import interpolacion, generacionParesOrdenados, to_latex
import numpy as np

api_routes = Blueprint('api', __name__, url_prefix='/api')

@api_routes.get('/generar-puntos')
def generarPuntos():
    n = request.args.get('n')
    try:
        n = int(n)
    except:
        return {"msg": "El valor debe ser un entero"}, 400
    
    print(n)
    if n < 8 or n > 15:
        return {"msg": "El valor debe estar entre 8 y 15"}, 400
    return jsonify(generacionParesOrdenados(n).tolist())

@api_routes.post('/interpolar')
def interpolar():
    data:dict = request.json
    pares = data.get('puntos')

    try:
        pares = np.array(pares)
    except:
        return {"msg": "No se pudo procesar el formato de los puntos"}, 400

    xs, S, coef = interpolacion(pares)
    return jsonify({ "S": S.tolist(), "x": xs.tolist(), "puntos": pares.tolist(), "funcion": to_latex(coef, pares[:, 0])})