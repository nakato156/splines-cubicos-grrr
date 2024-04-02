from flask import Blueprint, request, jsonify
from ..functions import interpolacion, generacionParesOrdenados

api_routes = Blueprint('api', __name__, url_prefix='/api')

@api_routes.get('/generar-puntos')
def generarPuntos():
    n = request.args.get('n')
    return jsonify(generacionParesOrdenados(n))

@api_routes.post('/interpolar')
def interpolar():
    n = request.json['n']
    pares = generacionParesOrdenados(n)
    xs, S = interpolacion(pares)
    return jsonify({ "S": S.tolist(), "x": xs.tolist(), "puntos": pares.tolist()})