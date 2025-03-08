/*
  QUIZ 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://api.open-meteo.com/ usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario selecciona diferentes ubicaciones en el mapa.
*/

let map;
let historial = [];

// Al cargar la página
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
        let latitud = coordinates[1].toFixed(6); // Limitar decimales
        let longitud = coordinates[0].toFixed(6);

        console.log("Latitud:", latitud);
        console.log("Longitud:", longitud);

        // Mostrar latitud y longitud en la tabla
        document.querySelector("#tabla_datos tbody tr:nth-child(1) td:nth-child(2)").textContent = latitud;
        document.querySelector("#tabla_datos tbody tr:nth-child(2) td:nth-child(2)").textContent = longitud;

        // Consultar API de clima
        obtenerClima(latitud, longitud);
    });
});
