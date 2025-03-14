/*
  Parcial 1 - PROGRAMACIÓN WEB
  Respetado estudiante teniendo en cuenta el proyecto proporcionado deberá desarrollar las siguientes funcionalidades en el sitio web:

  1) Solicitar datos del clima a la API de https://open-meteo.com/en/docs usando las coordenadas seleccionadas por el usuario en el mapa. 
  2) Solicitar los datos de Geolocalización en la API de https://geocodify.com/
  3) Solicitar la imágen de la bandera del pais donde está ubicado el punto seleccionado al servicio:https://documenter.getpostman.com/view/1134062/T1LJjU52#89ad7ab2-e3e1-4d8a-b99d-44e1c149e788  
  2) Cuando llega la respuesta del servidor, si es correcta mostrar los datos en la tabla correspondiente. 
  3) Desarrollar un historial de busquedas anteriores que vaya cargando en la medida que el usuario 
  selecciona diferentes ubicaciones en el mapa, dicho historial debe ser una TABLA.
*/

let mapa;
let historial = [];

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar el mapa con OpenLayers
    mapa = new ol.Map({
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

    mapa.on('click', function (evt) {
        let coordenadas = ol.proj.toLonLat(evt.coordinate);
        let latitud = coordenadas[1];
        let longitud = coordenadas[0];
        console.log("Latitud:", latitud);
        console.log("Longitud:", longitud);

        obtenerDatosClima(latitud, longitud);
        obtenerDatosGeolocalizacion(latitud, longitud);
    });
});

function obtenerDatosClima(lat, lon) {
    let urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(urlClima)
        .then(response => response.json())
        .then(data => {
            if (data.current_weather) {
                let temperatura = data.current_weather.temperature;
                let humedad = data.current_weather.relative_humidity;
                mostrarEnTabla(lat, lon, temperatura, humedad);
            }
        })
        .catch(error => console.error("Error al obtener datos del clima:", error));
}

function obtenerDatosGeolocalizacion(lat, lon) {
    let urlGeo = `https://geocodify.com/api/v2/reverse?lat=${lat}&lng=${lon}&api_key=TU_API_KEY`;

    fetch(urlGeo)
        .then(response => response.json())
        .then(data => {
            if (data.response && data.response.features.length > 0) {
                let pais = data.response.features[0].properties.country;
                obtenerBandera(pais);
            }
        })
        .catch(error => console.error("Error al obtener geolocalización:", error));
}

function obtenerBandera(pais) {
    let urlBandera = "https://countriesnow.space/api/v0.1/countries/flag/images";

    fetch(urlBandera)
        .then(response => response.json())
        .then(data => {
            let paisData = data.data.find(item => item.name === pais);
            if (paisData) {
                document.getElementById("bandera").src = paisData.flag;
            }
        })
        .catch(error => console.error("Error al obtener la bandera:", error));
}

function mostrarEnTabla(lat, lon, temp, humedad) {
    let tabla = document.getElementById("historial");
    let fila = tabla.insertRow();
    fila.insertCell(0).innerText = lat;
    fila.insertCell(1).innerText = lon;
    fila.insertCell(2).innerText = temp + "°C";
    fila.insertCell(3).innerText = humedad + "%";
}
