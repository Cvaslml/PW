/*
  QUIZ 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://api.open-meteo.com/ usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario selecciona diferentes ubicaciones en el mapa.
*/

let map;
let historial = [];

window.addEventListener("load", function() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            }),
        ],
        view: new ol.View({
            center: ol.proj.transform([-72.265911, 3.7644111], 'EPSG:4326', 'EPSG:3857'),
            zoom: 5,
        }),
    });

    map.on('click', function(evt) {
        let coordinates = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        let latitud = coordinates[1].toFixed(6);
        let longitud = coordinates[0].toFixed(6);

        document.querySelector("#tabla_datos tbody tr:nth-child(1) td:nth-child(2)").textContent = latitud;
        document.querySelector("#tabla_datos tbody tr:nth-child(2) td:nth-child(2)").textContent = longitud;

        obtenerClima(latitud, longitud);
    });
});

function obtenerClima(latitud, longitud) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,relative_humidity_2m`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.hourly) {
                let temperatura = data.hourly.temperature_2m[0];
                let humedad = data.hourly.relative_humidity_2m[0];

                document.querySelector("#tabla_datos tbody tr:nth-child(3) td:nth-child(2)").textContent = temperatura;
                document.querySelector("#tabla_datos tbody tr:nth-child(4) td:nth-child(2)").textContent = humedad;
                
                actualizarHistorial(latitud, longitud, temperatura, humedad);
            }
        })
        .catch(error => console.error("Error obteniendo los datos del clima:", error));
}

function actualizarHistorial(latitud, longitud, temperatura, humedad) {
    historial.push({ latitud, longitud, temperatura, humedad });
    
    let tablaHistorial = document.querySelector("#tabla_historial");
    let fila = document.createElement("tr");
    fila.innerHTML = `<td>${latitud}</td><td>${longitud}</td><td>${temperatura}</td><td>${humedad}</td>`;
    tablaHistorial.appendChild(fila);
}
