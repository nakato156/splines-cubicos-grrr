document.addEventListener("DOMContentLoaded", init);

let puntos = []
let myChart;

function init(){
    const btnGraficar = document.getElementById("btn-graficar");
    btnGraficar.addEventListener("click", graficar);

    const btnGenerarPuntos = document.getElementById("btn-generar-puntos");
    const cantPuntos = document.getElementById("cantPuntos");
    btnGenerarPuntos.addEventListener("click", (e) => generarPuntos(cantPuntos.value));
}

async function obtenerCoeficientes(n){
    const req = await fetch("/api/interpolar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ puntos })
    });
    const res = await req.json();
    return [res.x, res.S, res.puntos];
}

// Reconstruye la función de interpolación
function cubicInterpolation(x, coefficients) {
    return coefficients[0] + coefficients[1]*x + coefficients[2]*Math.pow(x, 2) + coefficients[3]*Math.pow(x, 3);
}

async function graficar(){
    if(!puntos.length) return Swal.fire({ icon: 'error', text: 'No hay puntos para graficar'});

    // Recibe los coeficientes del spline cúbico
    const [x, S, pares] = await obtenerCoeficientes(8);

    let xValues = x
    let yValues = S

 
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Puntos',
                    data: pares,
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    type: 'scatter',
                    showLine: false
                },
                {
                    label: 'Interpolación cúbica',
                    data: yValues,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    pointRadius: 0,
                    showLine: true,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    grid: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    min: Math.min(...yValues.map(point => point[1])) - 2,
                    grid: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Color blanco para las etiquetas de la leyenda
                    }
                },
                tooltip: {
                    displayColors: false
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)' // Cambiamos el color de las líneas de la cuadrícula a blanco con opacidad
                },
            }
        },
    });
}

function mostrarPuntos(puntos, div){
    let xs = [], ys = [];
    for(const [x, y] of puntos){
        xs.push(`<td class="py-3 px-4">${x}</td>`)
        ys.push(`<td class="py-3 px-4">${y}</td>`)
    }

    const tr_x = `<tr class="border-b border-blue-gray-200"><td class="py-3 px-4 text-neutral-400">X</td>${xs.join(' ')}</tr>`
    const tr_y = `<tr class="border-b border-blue-gray-200"><td class="py-3 px-4 text-neutral-400">Y</td>${ys.join(' ')}</tr>`

    div.innerHTML = `${tr_x}${tr_y}`;
}

function generarPuntos(n){

    if(n < 8 || n > 15) return Swal.fire({ icon: 'warning', text: 'La cantidad de puntos debe estar en el rango de 8 a 15'});

    fetch(`/api/generar-puntos?n=${n}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(res => res.json() )
    .then(res_puntos => {
        if(res_puntos.msg) throw res_puntos;
        puntos = res_puntos;
        const tablePuntos = document.getElementById("bodyTablePuntos")
        mostrarPuntos(res_puntos, tablePuntos)
    })
    .catch(err => {
        console.log(err, puntos)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.msg ?? "Ha ocurrido un error"
        })
    })
}