var map, directionsService, directionsRenderer, miubicacion, htmlGoogle;

var chileBounds = {
  north: -17.2,
  south: -57,
  west: -79,
  east: -65 ,
};

//Mapa que inicializa el mapa, sus configuraciones y los servicios de direcciones.
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  
  map = new google.maps.Map(
    document.getElementById("map"), {zoom: 9, center: {lat: -33.4718926, lng: -70.8304006},
    mapTypeId: 'styleMap',
    restriction: {
      latLngBounds: chileBounds,
      strictBounds: false,
    },
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
  });

  directionsRenderer.setMap(map);
  map.mapTypes.set('styleMap', new google.maps.StyledMapType(styleMap, { name: 'My Style' }));
  addEvents()
}


// Funcion que trae las cordenadas desde la api y las coloca en el mapa, junto con la animacion bounce y se le agrega una funcion click para abrir tarjeta
function addEvents(){
  var groupMarkers = [];
  var markerEvents;
  fetch('http://127.0.0.1:8000/api/events/list')
  .then( res => res.json())
  .then(events => {

    for (var i = 0; i < events.length; i++) {       

      LatLng = [{lat: parseFloat(events[i].latitude), lng: parseFloat(events[i].longitude)}]

      markerEvents = new google.maps.Marker({
          id: events[i].id,
          position: LatLng[0],
          title:"Mi posicion",
          map: map 
      });

      markerEvents.addListener('click', function () {
        abrirPanel();
      });
      groupMarkers.push(markerEvents)
    }

    var markerCluster = new MarkerClusterer(map, groupMarkers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }) 
}


// Funcion que abre y cierra la tarjeta de evento al hacerle click
function abrirPanel(){
  document.getElementById("menuPanel").style.width="100%";
}
function cerrarPanel(){
  document.getElementById("menuPanel").style.width="0%";
}


// Funcion que inicializa el GPS, consigue la posicion y la marca en el mapa, si no, arroja una alerta con el error obtenido.
function initGps()
  {
    if (navigator.geolocation)
      {
      navigator.geolocation.getCurrentPosition(setMyPosition,showError);
      }
  }

function setMyPosition(position)
  {
    miubicacion = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    var markerGps = new google.maps.Marker({
      position: miubicacion,
      title:"Mi posicion"
    });

    markerGps.setMap(map);
    map.setCenter(miubicacion);
    map.setZoom(16);
  }

function showError(error){
  var mes = "";
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      mes="Por favor concede permisos de GPS para acceder a toda la funcionalidad del mapa";
      break;
    case error.POSITION_UNAVAILABLE:
      mes="La posicion esta inhabilitada";
      break;
    case error.TIMEOUT:
      mes="Se ha sobrepasado el tiempo limite de espera para el GPS";
      break;
    case error.UNKNOWN_ERROR:
      mes="Error de GPS desconocido";
      break;
    }
    alert(mes)
}

// Funcion que calcula la ruta entre mi posicion del gps y la del evento, luego hace visible el boton de ruta para abrir google maps con la ruta creada
function calcRoute(i) {  
    var start = miubicacion;
    var end = events[i].LatLng[0];
    var request = {
      origin: start,
      destination: end,
      travelMode: "DRIVING"
    };
    if(miubicacion !== undefined){
      htmlGoogle = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;

      document.querySelector("#controlText").style.visibility="visible";
      document.querySelector("#controlUI").style.visibility="visible";

      directionsService.route(request, function(result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    } else{
      alert("No tenemos acceso a tu ubicacion aun, revisa que hayas dado permiso al GPS para usar esta funcion")
    }
}