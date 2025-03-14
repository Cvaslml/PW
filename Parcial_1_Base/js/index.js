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

window.addEventListener("load", function () {

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

  const historialBusquedas = [];

  mapa.on('click', function (evento) {
    let coordenadas = ol.proj.transform(evento.coordinate, 'EPSG:3857', 'EPSG:4326');
    let latitud = coordenadas[1];
    let longitud = coordenadas[0];

    console.log("Latitud:", latitud);
    console.log("Longitud:", longitud);

    obtenerDatosClima(latitud, longitud);
  });

  async function obtenerDatosClima(latitud, longitud) {
    try {
      const urlAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m`;

      const respuesta = await fetch(urlAPI);
      if (!respuesta.ok) {
        throw new Error(`Error en la petición: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      console.log("Datos del clima recibidos:", datos);

      // Actualizar la tabla con los datos de clima
      document.getElementById('latitud').textContent = latitud.toFixed(4);
      document.getElementById('longitud').textContent = longitud.toFixed(4);
      document.getElementById('temperaturaActual').textContent = datos.current.temperature_2m + ' ' + datos.current_units.temperature_2m;
      document.getElementById('humedadActual').textContent = datos.current.relative_humidity_2m + ' ' + datos.current_units.relative_humidity_2m;

      // Se obtiene la temperatura y humedad para usarlos en el historial
      const temperaturaActual = datos.current.temperature_2m;
      const humedadActual = datos.current.relative_humidity_2m;

      // Continuar con la siguiente petición
      obtenerGeolocalizacion(latitud, longitud, temperaturaActual, humedadActual);

      return datos;
    } catch (error) {
      console.error('Error al obtener los datos del clima:', error);
      alert('Error al obtener los datos del clima. Intente nuevamente.');
      return null;
    }
  }

  async function obtenerGeolocalizacion(latitud, longitud, temperatura, humedad) {
    try {
      // Se requiere registrarse en https://geocodify.com/ para obtener una API KEY
      const apiKey = "kFfbhx9CHxn5QQNMyUbID7rrNCJ2h7fT";
      const urlAPI = `https://api.geocodify.com/v2/reverse?api_key=${apiKey}&lat=${latitud}&lng=${longitud}`;

      const respuesta = await fetch(urlAPI);
      if (!respuesta.ok) {
        throw new Error(`Error en la petición de geolocalización: ${respuesta.status}`);
      }


      const datos = await respuesta.json();
      console.log("Datos de geolocalización recibidos:", datos);

      // Extraer datos de país, región y ciudad
      const pais = datos.response.features[0].properties.country || "Desconocido";
      const region = datos.response.features[0].properties.region || "Desconocido";
      const ciudad = datos.response.features[0].properties.county || "Desconocido";

      // Actualizar la tabla con los datos geográficos
      document.getElementById('pais').textContent = pais;
      document.getElementById('region').textContent = region;
      document.getElementById('ciudad').textContent = ciudad;

      // Continuar con la petición de la bandera
      obtenerBanderaPais(pais, region, ciudad, latitud, longitud, temperatura, humedad);

      return datos;
    } catch (error) {
      console.error('Error al obtener los datos de geolocalización:', error);
      console.warn('No se pudo obtener información de geolocalización para esta ubicación.');

      // Agregar al historial con datos desconocidos para país, región y ciudad
      agregarAlHistorial("Desconocido", "Desconocido", "Desconocido", latitud, longitud, temperatura, humedad);
      return null;
    }
  }

  async function obtenerBanderaPais(pais, region, ciudad, latitud, longitud, temperatura, humedad) {
    try {
      const urlAPI = 'https://countriesnow.space/api/v0.1/countries/flag/images';
      const datos = {
        country: pais
      };

      const opciones = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      };

      const respuesta = await fetch(urlAPI, opciones);
      if (!respuesta.ok) {
        throw new Error(`Error en la petición de la bandera: ${respuesta.status}`);
      }


      const respuestaJSON = await respuesta.json();
      console.log("Datos de bandera recibidos:", respuestaJSON);

      // Actualizar la imagen de la bandera
      if (respuestaJSON.data && respuestaJSON.data.flag) {
        document.getElementById('bandera').src = respuestaJSON.data.flag;
      } else {
        document.getElementById('bandera').src = "";
        console.warn('No se pudo obtener la bandera para este país.');
      }

      // Agregar al historial
      agregarAlHistorial(pais, region, ciudad, latitud, longitud, temperatura, humedad);

      return respuestaJSON;
    } catch (error) {
      console.error('Error al obtener la bandera del país:', error);
      console.warn('No se pudo obtener la bandera para este país.');

      // Agregar al historial aunque haya fallado la petición de la bandera
      agregarAlHistorial(pais, region, ciudad, latitud, longitud, temperatura, humedad);
      return null;
    }
  }

  function agregarAlHistorial(pais, region, ciudad, latitud, longitud, temperatura, humedad) {
    const busqueda = {
      pais: pais,
      region: region,
      ciudad: ciudad,
      latitud: latitud.toFixed(4),
      longitud: longitud.toFixed(4),
      temperatura: temperatura,
      humedad: humedad
    };

    historialBusquedas.unshift(busqueda); // Agregar al inicio para mostrar las búsquedas más recientes primero
    actualizarInterfazHistorial();
  }

  function actualizarInterfazHistorial() {
    const tabla_historial = document.getElementById('tabla_historial');
    let cuerpoTabla;

    // Verificar si ya existe el tbody, si no, crearlo
    if (tabla_historial.getElementsByTagName('tbody').length === 0) {
      cuerpoTabla = document.createElement('tbody');
      tabla_historial.appendChild(cuerpoTabla);
    } else {
      cuerpoTabla = tabla_historial.getElementsByTagName('tbody')[0];
    }

    // Limpiar el contenido actual del tbody
    cuerpoTabla.innerHTML = '';

    // Agregar una fila para cada búsqueda en el historial
    historialBusquedas.forEach(busqueda => {
      const fila = document.createElement('tr');

      // Agregar celdas con los datos
      const celdaPais = document.createElement('td');
      celdaPais.textContent = busqueda.pais;
      fila.appendChild(celdaPais);

      const celdaRegion = document.createElement('td');
      celdaRegion.textContent = busqueda.region;
      fila.appendChild(celdaRegion);

      const celdaCiudad = document.createElement('td');
      celdaCiudad.textContent = busqueda.ciudad;
      fila.appendChild(celdaCiudad);

      const celdaLat = document.createElement('td');
      celdaLat.textContent = busqueda.latitud;
      fila.appendChild(celdaLat);

      const celdaLong = document.createElement('td');
      celdaLong.textContent = busqueda.longitud;
      fila.appendChild(celdaLong);

      const celdaTemp = document.createElement('td');
      celdaTemp.textContent = busqueda.temperatura;
      fila.appendChild(celdaTemp);

      const celdaHum = document.createElement('td');
      celdaHum.textContent = busqueda.humedad;
      fila.appendChild(celdaHum);

      // Agregar la fila al cuerpo de la tabla
      cuerpoTabla.appendChild(fila);
    });
  }
});
