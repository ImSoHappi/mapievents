var map;
var directionsService, directionsRenderer;
var miubicacion, interval;
var InforObj = [], htmlGoogle;

var events = [
  {
    eventName: "Holi", eventDescrip: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis sapien at arcu laoreet euismod. Donec faucibus ut mauris at blandit. Morbi blandit accumsan aliquet. Ut dapibus tincidunt sem et tincidunt. Quisque suscipit blandit nulla, ac tincidunt lectus pellentesque eu. Etiam accumsan porttitor aliquam. Mauris volutpat finibus tempus. Donec fermentum mattis nisl, nec varius neque blandit nec. Ut et mollis eros, nec semper sem. Quisque varius convallis leo, in luctus sem semper quis. Etiam dignissim suscipit massa et feugiat. Quisque placerat accumsan dictum. Quisque ac dui pretium, pretium est non, ultricies elit. Fusce non placerat lorem, nec laoreet dolor. Phasellus elementum convallis dolor, vel auctor ex sagittis eget. Maecenas at lectus at ipsum tempor bibendum eu nec dui. Sed eu nulla nec mi lacinia maximus. Curabitur id orci id sem efficitur hendrerit. Fusce rhoncus enim scelerisque lorem consequat, id mollis arcu tincidunt. Sed fringilla laoreet maximus. Cras erat odio, consequat nec consequat ut, vehicula non quam. Donec semper elit eu magna finibus, at interdum risus varius. Nam ac tortor a neque dapibus semper quis et lorem. Donec nunc risus, tristique sit amet felis faucibus, pulvinar viverra lacus. Aenean et lorem porttitor, semper quam eget, tempus magna. Proin augue metus, iaculis sed magna non, ultrices feugiat lectus. Aenean tempus sapien tortor, at elementum risus molestie at. Aliquam a felis sapien.", LatLng: [{lat: -33.5131875,lng: -70.7434274}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.5102713, lng: -70.7446505}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.5122013, lng: -70.7466005}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.5118882, lng: -70.7490976}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.5085687, lng: -70.7441473}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.4971285, lng: -70.7420424}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.4724315, lng: -70.7544879}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat: -33.516237, lng: -70.762556}]
  },
  {
    eventName: "Holi", eventDescrip: "Holi", LatLng: [{lat:-33.471286, lng: -70.627287}]
  },
]; 

function CenterControl(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.setAttribute("id", "controlUI");
  controlUI.title = 'Click para iniciar el viaje';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.setAttribute("id", "controlText");
  controlText.innerHTML = 'Comenzar el viaje';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    window.open(htmlGoogle);
  });
}

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  // Centra el mapa en Maipu
  map = new google.maps.Map(
    document.getElementById("map"), {zoom: 12, center: {lat: -33.5116635, lng: -70.7702235},
    mapTypeId: google.maps.MapTypeId.ROADMA,
    disableDefaultUI: true});
  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  directionsRenderer.setMap(map);
  addEvents();
}

function addEvents(){
  for (var i = 0; i < events.length; i++) {
    var contentString = '<div id="content"><h1>'+ events[i].eventName +'</h1><p>'+ events[i].eventDescrip +'</p></div><button onClick="calcRoute('+ i +');">Ver Camino</button>';
    const markerEvents = new google.maps.Marker({
        position: events[i].LatLng[0],
        map: map
    });

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200,
    });

    markerEvents.addListener('click', function () {
        closeOtherInfo();
        infowindow.open(markerEvents.get('map'), markerEvents);
        InforObj[0] = infowindow;
    });
  }
}

function closeOtherInfo() {
  if (InforObj.length > 0) {
      InforObj[0].set("marker", null);
      InforObj[0].close();
      InforObj.length = 0;
  }
}

function initGps()
  {
    interval = setInterval(function(){   
      if (navigator.geolocation)
      {
      navigator.geolocation.getCurrentPosition(updatePosition,showError);   
      }
      else{
        clearInterval(interval)
      }
    }, 3000)  
  }

function updatePosition(position)
  {
    miubicacion = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    updateGps(miubicacion);
  }

function showError(error){
  if(sessionStorage.getItem("Permission")=="0")
  {
    return false
  }
  var mes = "";
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      mes="El usuario a denegado el permiso de GPS";
      break;
    case error.POSITION_UNAVAILABLE:
      mes="La posicion esta inhabilitada";
      break;
    case error.TIMEOUT:
      mes="Se ha sobrepasado el tiempo limite para el GPS";
      break;
    case error.UNKNOWN_ERROR:
      mes="Error de GPS desconocido";
      break;
    }
    alert(mes)
    sessionStorage.setItem("Permission", "0");
    clearInterval(interval)
}

function updateGps(miubicacion){
  var markerGps = new google.maps.Marker({
    position: miubicacion,
    title:"Mi posicion"
  });
  if(this.miubicacionMarker) {
    miubicacionMarker.setMap(null);; 
  }     
  markerGps.setMap(map);
  this.miubicacionMarker = markerGps;
}

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
      alert("No tenemos acceso a tu ubicacion aun, revisa que hayas dado permiso al GPS")
    }
}