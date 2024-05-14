document.addEventListener("DOMContentLoaded", init);

let puntos = [], puntosManual = []
let myChart;
let acordeon_activo;
let funcionS = null;

function init(){
    funcionS = document.getElementById("funcionS")

    const btnGraficar = document.getElementById("btn-graficar");
    
    const btnGenerarPuntos = document.getElementById("btn-generar-puntos");
    const cantPuntos = document.getElementById("cantPuntos");
    
    const acordeones = document.querySelectorAll(".acordeon");
    acordeon_activo = acordeones[0];

    const formManual = document.getElementById("formManual");

    function initListeners(tablePuntos){    
        btnGraficar.addEventListener("click", (e) => graficar(acordeon_activo.classList.contains("random") ? puntos : puntosManual));
        btnGenerarPuntos.addEventListener("click", (e) => generarPuntos(cantPuntos.value));

        acordeones.forEach(acordeon => {
            console.log("holas")
            acordeon.addEventListener("click", (e) => {
                toggleAcordeon(acordeon, acordeon_activo)
            })
        })

        formManual.addEventListener("submit", (e) => {
            const form = new FormData(formManual);
            e.preventDefault();
            agregarPunto(parseInt(form.get("x")), parseInt(form.get("y")), tablePuntos);
        })
    }

    const tablePuntos = document.getElementById("bodyTablePuntos");
    initListeners(tablePuntos)
    toggleAcordeon(acordeon_activo, null);
} 

document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.querySelector("#bodyTablePuntos").parentElement;
    if (tabla) tabla.classList.add('fade-in');
});

async function obtenerCoeficientes(puntos){
    const req = await fetch("/api/interpolar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ puntos })
    });
    const res = await req.json();
    return [res.x, res.S, res.puntos, res.funcion];
}

// Reconstruye la función de interpolación
function cubicInterpolation(x, coefficients) {
    return coefficients[0] + coefficients[1]*x + coefficients[2]*Math.pow(x, 2) + coefficients[3]*Math.pow(x, 3);
}

async function graficar(puntos) {
    if (!puntos.length) return Swal.fire({ icon: 'error', text: 'No hay puntos para graficar' });

    // Recibe los coeficientes del spline cúbico
    const [x, S, pares, func] = await obtenerCoeficientes(puntos);

    // poner la funcion en KaTeX
    console.log(func)
    renderKaTeX(func, funcionS)

    let xValues = x;
    let yValues = S;

    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    if (myChart) myChart.destroy();


    canvas.classList.remove('fade-in');  
    void canvas.offsetWidth;  
    canvas.classList.add('fade-in');

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

    const tr_x = `<tr class="border-b border-blue-gray-200 filaX"><td class="py-3 px-4 text-neutral-400">X</td>${xs.join(' ')}</tr>`
    const tr_y = `<tr class="border-b border-blue-gray-200 filaY"><td class="py-3 px-4 text-neutral-400">Y</td>${ys.join(' ')}</tr>`

    div.innerHTML = `${tr_x}${tr_y}`;
}

function generarPuntos(n) {
    if (n < 8 || n > 12) return Swal.fire({ icon: 'warning', text: 'La cantidad de puntos debe estar en el rango de 8 a 12' });

    fetch(`/api/generar-puntos?n=${n}`, {
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(res => res.json())
    .then(res_puntos => {
        if (res_puntos.msg) throw res_puntos;
        puntos = res_puntos;
        const tablePuntos = document.getElementById("bodyTablePuntos");
        mostrarPuntos(res_puntos, tablePuntos);
        tablePuntos.classList.add('fade-in');
    })
    .catch(err => {
        console.log(err, puntos);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.msg ?? "Ha ocurrido un error"
        });
    });
}

function agregarPunto(x, y, tablePuntos) {
    
    if (puntosManual.length >= 12) {
        Swal.fire({ icon: 'warning', text: 'Se ha alcanzado el máximo de 12 puntos.' });
        return;
    }

    if(puntosManual.some(punto => punto[0] === x))
        return Swal.fire({ icon: 'warning', text: 'El punto ya existe en el eje x' });
    
    puntosManual.push([x, y]);
    
    if(puntos.length){
        tablePuntos.querySelector(".filaX").innerHTML = `<tr class="border-b border-blue-gray-200 filaX"><td class="py-3 px-4 text-neutral-400">X</td></tr>`
        tablePuntos.querySelector(".filaY").innerHTML = `<tr class="border-b border-blue-gray-200 filaX"><td class="py-3 px-4 text-neutral-400">X</td></tr>`
        puntos = []
    }

    if(!tablePuntos.classList.contains('fade-in')) {
        const tr_x = `<tr class="border-b border-blue-gray-200 filaX"><td class="py-3 px-4 text-neutral-400">X</td><td class="py-3 px-4">${x}</td></tr>`
        const tr_y = `<tr class="border-b border-blue-gray-200 filaY"><td class="py-3 px-4 text-neutral-400">Y</td><td class="py-3 px-4">${x}</td></tr>`

        tablePuntos.innerHTML = `${tr_x}${tr_y}`;
        tablePuntos.classList.add('fade-in');
    }else{
        tablePuntos.querySelector(".filaX").innerHTML+=`<td class="py-3 px-4">${x}</td>`
        tablePuntos.querySelector(".filaY").innerHTML+=`<td class="py-3 px-4">${y}</td>`
    }
}

function toggleAcordeon(acordeon, activo) {
    const img = acordeon.querySelector("img");
    const contenido_acordeon = acordeon.nextElementSibling;
    
    //Si el acordeon ingresado es diferente del activo, cerramos el activo:
    if (acordeon !== activo) {
        if (activo) {
            const imgActivo = activo.querySelector("img");
            const contenido_activo = activo.nextElementSibling;
            imgActivo.classList.remove("-rotate-180");
            contenido_activo.classList.remove("max-h-screen", "visible", "opacity-100");
            contenido_activo.classList.add("invisible");
        }
        
        //Abrimos el actual
        img.classList.add("-rotate-180");
        contenido_acordeon.classList.remove("invisible");
        contenido_acordeon.classList.add("max-h-screen", "visible", "opacity-100");
        
        //Lo definimos como el acordeon activo
        acordeon_activo = acordeon;
    } 
    else { //Si el acordeon activo es igual al acordeon ingresado, lo cerramos.
        img.classList.toggle("-rotate-180");
        contenido_acordeon.classList.toggle("max-h-screen");
        contenido_acordeon.classList.toggle("invisible");
        contenido_acordeon.classList.toggle("visible");
        contenido_acordeon.classList.toggle("opacity-100");
        
        //Seteamos el acordeon negativo como nulo, osea no hay activo
        if (!contenido_acordeon.classList.contains("visible")) {
            acordeon_activo = null;
        }
    }
}

function renderKaTeX(string, element){
    katex.render(string, element, {
        throwOnError: false,
    })
}