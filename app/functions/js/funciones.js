var puntos = [];
var n = 0;
var clicks = 0;
document.getElementById("agregarN").addEventListener("click", function(){
    
    n = document.getElementById("valor_n").value;

    if (n < 8 || n > 12 || n == " ") {
        alert("El valor de n debe ser entre 8 y 12");
    }
})

document.getElementById("agregarPunto").addEventListener("click", function() {
    //Obtencion de los valores ingresados
    
    var x = document.getElementById("coordenadaX").value;
    var y = document.getElementById("coordenadaY").value;
    
    //Validamos los valores de X e Y
    if (x < 0 || x > 50) {
        alert("El valor de x debe ser entre 0 y 50");
        return;
    }
    else if (y < 0 || y > 50) {
        alert("El valor de y debe ser entre 0 y 50");
        return;
    }

    //Botones de funcionamineto de Splines
    const botones_fun = document.getElementById("container_func");

    //Botones para el ingreso de pares ordenados

    var botonReinicio = document.getElementById("reiniciarIngreso");

    if (n === 0 && puntos.length!=0) {
        alert("Se debe ingresar primero el valor de n.");
        return;
    }

    if (x !== "" && y !== "") {
        x = parseInt(x);
        y = parseInt(y);

        var xRepetido = puntos.some(function(punto) {
            return punto[0] === x;
        });

        if (xRepetido) {
            alert("El valor de x ya ha sido ingresado anteriormente. Por favor, ingrese otro valor de x.");
            return;
        }

        var nuevoPunto = [x, y];
        puntos.push(nuevoPunto);        

        //Ordenar de manera creciente los puntos de acuerdo a X
        puntos = 
        puntos.sort(function(a, b) {
            return a[0] - b[0];
        });

        document.getElementById("coordenadaX").value = "";
        document.getElementById("coordenadaY").value = "";
    } 
    else {
        alert("Por favor ingrese valores válidos para las coordenadas.");
    }

    if (puntos.length != 0) {
        botonReinicio.style.display="flex";
    }
    
    if (puntos.length >= n) {
        alert("Se han ingresado todos los puntos permitidos.");
        document.getElementById("coordenadaX").value = "";
        document.getElementById("coordenadaY").value = "";
        botones_fun.style.display="block";        
        return;
    }
});

document.getElementById("reiniciarIngreso").addEventListener("click", function() {
    reiniciarIngreso();
    var botonReinicio = document.getElementById("reiniciarIngreso");
    botonReinicio.style.display="none";
});

document.getElementById("mostrarTabla").addEventListener("click", function () {
    mostrarPuntosEnTabla();
})

function reiniciarIngreso() {
    
    n = 0;
    document.getElementById("valor_n").value = "";

    puntos = [];
    
    document.getElementById("puntosIngresados").innerHTML = "";
    document.getElementById("container_func").style.display = "none";
    
    document.getElementById("coordenadaX").value = "";
    document.getElementById("coordenadaY").value = "";    
}

function mostrarPuntosEnTabla() {
    // Crear tabla
    var tabla = document.createElement("table");
    tabla.classList.add("tabla-puntos"); 

    
    var encabezado = document.createElement("tr");
    var encabezadoX = document.createElement("th");
    encabezadoX.textContent = "Coordenada X";
    encabezado.appendChild(encabezadoX);
    var encabezadoY = document.createElement("th");
    encabezadoY.textContent = "Coordenada Y";
    encabezado.appendChild(encabezadoY);
    // Agregar encabezado para el ícono de edición
    var encabezadoEditar = document.createElement("th");
    encabezadoEditar.textContent = "Editar";
    encabezado.appendChild(encabezadoEditar);
    tabla.appendChild(encabezado);

    
    for (var i = 0; i < puntos.length; i++) {
        var fila = document.createElement("tr");
        var puntoX = document.createElement("td");
        puntoX.textContent = puntos[i][0];
        fila.appendChild(puntoX);
        var puntoY = document.createElement("td");
        puntoY.textContent = puntos[i][1];
        fila.appendChild(puntoY);
        // Agregar ícono de lápiz para editar
        var iconoEditar = document.createElement("td");
        var iconoLapiz = document.createElement("i");
        iconoLapiz.classList.add("fas", "fa-pencil-alt");
        iconoLapiz.setAttribute("data-indice", i); 
        iconoLapiz.addEventListener("click", function(event) {
            var indice = event.target.getAttribute("data-indice");
            editarFila(indice);
        });
        iconoEditar.appendChild(iconoLapiz);
        fila.appendChild(iconoEditar);
        tabla.appendChild(fila);
    }

    
    var contenedor = document.getElementById("puntosIngresados");
    contenedor.innerHTML = ""; 
    contenedor.appendChild(tabla);
}

function editarFila(indice) {
    var fila = puntos[indice]; 
    
    var nuevaX, nuevaY;
    do {
        nuevaX = prompt("Ingrese el nuevo valor de X:", fila[0]); 
        nuevaY = prompt("Ingrese el nuevo valor de Y:", fila[1]);

        if (nuevaX === null || nuevaY === null) {
            return; 
        }

        nuevaX = parseInt(nuevaX);
        nuevaY = parseInt(nuevaY);

        var xExistente = puntos.some(function(punto, index) {
            return index !== indice && punto[0] === nuevaX;
        });

        if (xExistente) {
            alert("El valor de X ya existe en otro punto. Por favor, ingrese un valor de X único.");
        }
    } while (xExistente);

    puntos[indice] = [nuevaX, nuevaY];
    
    puntos = 
    puntos.sort(function(a, b) {
        return a[0] - b[0];
    });
    
    
    mostrarPuntosEnTabla();
}




