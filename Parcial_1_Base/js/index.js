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

window.addEventListener("load",function(){

    map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
        ],
        view: new ol.View({
          center: ol.proj.transform([-72.265911,3.7644111], 'EPSG:4326', 'EPSG:3857'),
          zoom: 5,
        }),
      });
    
    map.on('click', function(evt){
        let coordinates = ol.proj.toLonLat(evt.coordinate);
        let latitud = coordinates[1];
        let longitud = coordinates[0];
        console.log("Latitud:",latitud);
        console.log("Longitud:",longitud);
    });

})
