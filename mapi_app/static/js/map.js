var map, directionsService, directionsRenderer, miubicacion, htmlGoogle, nearEvents = [], groupMarkers = [];

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
    document.getElementById("map"), {zoom: 11, center: {lat: -33.4688845, lng: -70.6654369},
    mapTypeId: 'styleMap',
    restriction: {
      latLngBounds: chileBounds,
      strictBounds: false,
    },
    disableDefaultUI: true,
    zoomControl: true,
<<<<<<< HEAD
=======
    mapTypeControl: true,
>>>>>>> parent of cfd4b66... caca
    streetViewControl: true,
  });

  directionsRenderer.setMap(map);
<<<<<<< HEAD

  map.mapTypes.set('styleMap', new google.maps.StyledMapType(styleMap, { name: 'Mapi Map' }));

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  var openEventsDiv = document.createElement('div');
  var opendiv = new openEventsControl(openEventsDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(openEventsDiv);

  var searchControlDiv = document.createElement('div');
  var mapdiv = new mapTypeControl(searchControlDiv, map);
  searchControlDiv.id = 'searchBarControl';
  searchControlDiv.className = 'col-sm-8';
  var srcControl = searchBarControl(searchControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchControlDiv);

  addEvents()
}

// Funciones para crear todos los botones custom del mapa
function obtainGpsControl(controlDiv, map) {

  var obtainGpsControl = document.createElement('div');
  obtainGpsControl.title = 'Pincha el boton para centrar tu ubicacion';
  obtainGpsControl.id = 'obtainGpsControl';
  controlDiv.appendChild(obtainGpsControl);

  var obtainGpsText = document.createElement('div');
  obtainGpsText.id = 'obtainGpsText';
  obtainGpsText.innerHTML = '<img id="iconGps" src="static/img/gps.png" alt="GPS img">';
  obtainGpsControl.appendChild(obtainGpsText);
  obtainGpsControl.addEventListener('click', function() {

    if(miubicacion !== undefined){
      map.setCenter(miubicacion);
      map.setZoom(14);
    }else
      alert("Por favor activa el gps o acepta el permiso para acceder a esta funcionalidad")
  });
}

function mapTypeControl(controlDiv, map){
  var typeButton = document.createElement('button');
  typeButton.className = 'dropbtn';
  typeButton.title = 'Seleciona la vista del mapa';
  typeButton.innerHTML = 'Tipo de mapa';
  controlDiv.appendChild(typeButton);

  var typeDiv = document.createElement('div');
  typeDiv.className = 'dropdown-content';
  typeDiv.id = 'myDropdown';
  typeButton.appendChild(typeDiv);

  var mapiA = document.createElement('a');
  mapiA.innerHTML = 'Mapi Map';
  typeDiv.appendChild(mapiA);

  var satelliteiA = document.createElement('a');
  satelliteiA.innerHTML = 'Satelital';
  typeDiv.appendChild(satelliteiA);

  typeButton.addEventListener('click', function() {
    document.getElementById("myDropdown").classList.toggle("show");
  });
  mapiA.addEventListener('click', function() {
    map.setMapTypeId('styleMap');
  });
  satelliteiA.addEventListener('click', function() {
    map.setMapTypeId('satellite');
  });
}

//Funcion que cierra el Drop menu del tipo al hacer click en la pantalla
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function searchBarControl(controlDiv) {

  var searchBarInput = document.createElement('input');
  searchBarInput.id = 'searchBarInput';
  searchBarInput.title = 'Ingresa el nombre del evento';
  controlDiv.appendChild(searchBarInput);
 
  var searchBarButton = document.createElement('button');
  searchBarButton.id = 'searchBarButton';
  searchBarButton.title = 'Pincha para buscar el evento';
  searchBarButton.innerHTML = 'Buscar';
  controlDiv.appendChild(searchBarButton);

  searchBarButton.addEventListener('click', function() {
    alert("Busca tus eventos proximamente")
  });
}

function CenterControl(controlDiv, map) {

  var centerControl = document.createElement('div');
  centerControl.id = 'centerControl';
  centerControl.title = 'Pincha el boton para centrar tu ubicacion';
  controlDiv.appendChild(centerControl);

  var centercControlText = document.createElement('div');
  centercControlText.id = 'centercControlText';
  centercControlText.innerHTML = '<img id="iconGps" src="static/img/gps.gif" alt="GPS img">';
  centerControl.appendChild(centercControlText);
  centerControl.addEventListener('click', function() {

    alert("Por favor danos los permisos de ubicacion para poder mostrarte los eventos cerca de tu ubicacion y poder encontrarlos mas facil")
    if (navigator.geolocation ){
      navigator.geolocation.getCurrentPosition(setMyPosition,showError);
    }
    else{
      alert("Dispositivo incompatible con la funcion de GPS")
    }
    centerControl.removeChild(centercControlText);
    controlDiv.removeChild(centerControl);
    var obtaintGps = new obtainGpsControl(controlDiv, map);
  });
}

function openEventsControl(controlDiv, map) {

  var openEventsControl = document.createElement('div');
  openEventsControl.id = 'openEventsControl';
  openEventsControl.title = 'Pincha el boton para abrir el listado de eventos';
  controlDiv.appendChild(openEventsControl);

  var openEventsText = document.createElement('div');
  openEventsText.id = 'centercControlText';
  openEventsText.innerHTML = '<img id="iconEvents" src="static/img/events.png" alt="event list img">';
  openEventsControl.appendChild(openEventsText);

  openEventsControl.addEventListener('click', function() {
    if(miubicacion == undefined){
      openPanelR();
    }else{
      calcNearEvents();
      setTimeout(function(){
        openPanelR();
      }, 2000);
    }
  });
}

// Funcion que agrega un rango en el marcador de posicion
function rangoGps(){
  var cityCircle = new google.maps.Circle({
    strokeColor: '#7dcdcd',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#7dcdcd',
    fillOpacity: 0.35,
    map: map,
    center: miubicacion,
    radius: 1500
  });  
}
=======
  map.mapTypes.set('styleMap', new google.maps.StyledMapType(styleMap, { name: 'My Style' }));
  addEvents()
}

>>>>>>> parent of cfd4b66... caca

// Funcion que trae las cordenadas desde la api y las coloca en el mapa, junto con la animacion bounce y se le agrega una funcion click para abrir tarjeta
function addEvents(){
  var markerEvents;
  fetch('api/events/list')
  .then( res => res.json())
  .then(events => {

    for (var i = 0; i < events.length; i++) {       

      LatLng = [{lat: parseFloat(events[i].latitude), lng: parseFloat(events[i].longitude)}]

      markerEvents = new google.maps.Marker({
          id: events[i].id,
          position: LatLng[0],
          title: events[i].name,
          map: map,
          type: events[i].table
      });
      markerEvents.customInfo = events[i].id+","+events[i].table +","+ events[i].latitude+","+ events[i].longitude;

<<<<<<< HEAD
      google.maps.event.addListener(markerEvents, 'click', function () {
        openPanel(this.customInfo);
=======
      markerEvents.addListener('click', function () {
        abrirPanel();
>>>>>>> parent of cfd4b66... caca
      });
      groupMarkers.push(markerEvents)


    }

    var markerCluster = new MarkerClusterer(map, groupMarkers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }) 
}


// Funcion que abre y cierra la tarjeta de evento al hacerle click
<<<<<<< HEAD
function openPanel(customInfo){
  document.getElementById("menuPanel").style.width="50%";
  document.getElementById("map").style.width="50%";
  document.getElementById("map").style.marginLeft="50%";
  document.getElementById("map").style.transition= "all 1s";
  showDetailEvent(customInfo)
=======
function abrirPanel(){
  document.getElementById("menuPanel").style.width="100%";
>>>>>>> parent of cfd4b66... caca
}
function closePanel(){
  document.getElementById("menuPanel").style.width="0%";
  document.getElementById("map").style.width="100%";
  document.getElementById("map").style.marginLeft="0";
  document.getElementById("map").style.transition= "all 1s";
  setTimeout(function(){
    detailContent = document.querySelector(".panelContent");
    detail = detailContent.querySelector("#detailEvent");
    detailContent.removeChild(detail);
  }, 1000); 
}

// Funcion que abre y cierra la lista de eventos cercanos o todos al hacerle click
function openPanelR(){
  var detailContent = document.querySelector(".panelContent");
  var detail = detailContent.querySelector("#detailEvent");
  document.getElementById("menuPanel").style.width="0%";
  document.getElementById("map").style.width="100%";
  document.getElementById("map").style.marginLeft="0";
  document.getElementById("menuPanelR").style.width="100%";
  if(nearEvents[0]==undefined){
    document.getElementById("neartEventsBtn").disabled=true;
  }
  else document.getElementById("neartEventsBtn").disabled=false;
  showAllEvents();
  if(detail!==null){
    setTimeout(function(){
      detailContent.removeChild(detail);
    }, 1000);
  }
}

function closePanelR(){
  document.getElementById("menuPanelR").style.width="0%";
  setTimeout(function(){
    card = document.querySelector(".eventListTable");
    card.querySelectorAll('*').forEach(n => n.remove());
  }, 1000); 

}

//Funcion que busca mi posicion y la pone en el mapa
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
    map.setZoom(14);
    rangoGps()
  }

// Funcion que muestra los errores del gps
function showError(error){
  var mes = "";
  switch(error.code) 
    {
<<<<<<< HEAD
=======
    case error.PERMISSION_DENIED:
      mes="Por favor concede permisos de GPS para acceder a toda la funcionalidad del mapa";
      break;
>>>>>>> parent of cfd4b66... caca
    case error.POSITION_UNAVAILABLE:
      mes="La posicion esta inhabilitada";
      alert(mes)
      break;
    case error.TIMEOUT:
      mes="Se ha sobrepasado el tiempo limite de espera para el GPS";
      alert(mes)
      break;
    case error.UNKNOWN_ERROR:
      mes="Error de GPS desconocido";
      alert(mes)
      break;
    }
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

// Funcion que trae los eventos mas cercanos desde tu posicion en un rango de 1500 metros
 function calcNearEvents(){
  const R = 6371;
  const pi = Math.PI;
  nearEvents = [];

  fetch('api/events/list')
  .then( res => res.json())
  .then(events => {
    for (var i = 0; i < events.length; i++) {  

      const lat1 = miubicacion.lat;
      const lon1 = miubicacion.lng;

      const lat2 = parseFloat(events[i].latitude);
      const lon2 = parseFloat(events[i].longitude);

      const chLat = lat2-lat1;
      const chLon = lon2-lon1;

      const dLat = chLat*(pi/180);
      const dLon = chLon*(pi/180);

      const rLat1 = lat1*(pi/180);
      const rLat2 = lat2*(pi/180);

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c;
      if(d < 1.6){
        nearEvents.push(events[i]);
      }
    }
  })
}

//Funcion que muestra el detalle del evento al hacerle click
function showDetailEvent(customInfo){
  detail = document.querySelector(".panelContent")
  var id = customInfo.split(',')[0];
  var typeEvent = customInfo.split(',')[1];

  fetch('api/events/detail/'+typeEvent+'/'+id)
  .then( res => res.json())
  .then(events => {
    detailEvent = document.createElement('div');
    detailEvent.id = "detailEvent";
    detailEvent.innerHTML = 
      `<h1>${events.name}</h1>
      <img src='/media/workshops/2020/06/08/curso-online-pasteleria-reposteria_amp_primaria_1_1560502963.jpg' alt='caca'>
      <b><p>Comuna:</b> ${events.commune}</p>
      <b><p>Tipo de evento:</b> ${typeEvent} - ${events.type}</p>
      <b><p>Descripcion:</b>  ${events.description}</p>
      <b><p>Direccion:</b>  ${events.address}</p>
      <b><p>Inicio:</b>  ${events.start_date}, ${events.start_time}</p>
      <b><p>Termino:</b>  ${events.ended_date}, ${events.ended_time}</p>
      <b><p>Puntuaciones:</b></p>
      <p><img id="starsImg" src="static/img/5stars.png" alt="5 estrellas imagen"> = <b>${events.five_stars}</b></p>
      <p><img id="starsImg" src="static/img/4stars.png" alt="4 estrellas imagen"> = <b>${events.four_stars}</b></p>
      <p><img id="starsImg" src="static/img/3stars.png" alt="3 estrellas imagen"> = <b>${events.three_stars}</b></p>
      <p><img id="starsImg" src="static/img/2stars.png" alt="2 estrellas imagen"> = <b>${events.two_stars}</b></p>
      <p><img id="starsImg" src="static/img/1stars.png" alt="1 estrellas imagen"> = <b>${events.one_stars}</b></p>
      <h1>Comentarios de la gente</h1>
      <p>${events.comments}</p>`;

    detail.appendChild(detailEvent);
   })
}

//Funcion que trae todos los eventos para mostrar
async function showAllEvents(){

  card = document.querySelector(".eventListTable");
  for (var i = 0; i < groupMarkers.length; i++){
    var imgsrc = "";

    await fetch('api/events/detail/'+groupMarkers[i].type+'/'+groupMarkers[i].id)
    .then( res => res.json())
    .then(events => {
      listAll = document.createElement('li');
      listAll.id = "listEvents";

      if(events.image=="undefined") imgsrc = 'static/img/imgundefined.jpg';
      else imgsrc = events.image;

      listAll.innerHTML = 
        `<h1 onclick="centerEventClick(${events.longitude}, ${events.latitude})">${events.name}</h1>
        <h2 id="cordsFilter">${events.longitude},${events.latitude}</h2>
        <img src='${imgsrc}' alt='caca'>
        <b><p>Comuna:</b> ${events.commune}</p>
        <b><p>Categoria de evento:</b>${events.type}</p>
        <b><p>Tipo de evento:</b>${groupMarkers[i].type}</p>
        <b><p>Descripcion:</b>  ${events.description}</p>
        <b><p>Inicio:</b>  ${events.start_date}, ${events.start_time}</p>
        <b><p>Termino:</b>  ${events.ended_date}, ${events.ended_time}</p>`;
        
      card.appendChild(listAll);  
    })    
  }
}

//Funcion que al clickear el titulo del evento lo centra en el mapa
function centerEventClick(lng, lat){
  closePanelR()
  LatLng = [{lat: parseFloat(lat), lng: parseFloat(lng)}]
  latE = lat;
  lngE = lng;

  map.setCenter(LatLng[0]);
  map.setZoom(18);

  for (i = 0; i < groupMarkers.length; i++){
    
    if(latE===parseFloat(groupMarkers[i].customInfo.split(',')[2]) & lngE===parseFloat(groupMarkers[i].customInfo.split(',')[3]) ){
      groupMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
      eventCircle = new google.maps.Circle({
        strokeWeight: 0,
        fillColor: 'red',
        fillOpacity: 0.35,
        map: map,
        center: {lat: parseFloat(groupMarkers[i].customInfo.split(',')[2]), lng: parseFloat(groupMarkers[i].customInfo.split(',')[3])},
        radius: 40
      });  
      resetMarker(groupMarkers, i, eventCircle)
    }
  }
}

//Funcion que quita la animacion y circulo en 4 segundos
function resetMarker(mark, i, eventCircle){
  setTimeout(() => {      
    eventCircle.setMap(null);
    mark[i].setAnimation(null); 
  }, 4000);
}

// Funcion que filtra los eventos en la lista por nombre
function nameFilterEvent() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("filterInputName");
  filter = input.value.toUpperCase();

  ul = document.getElementsByClassName("eventListTable");
  li = ul[0].getElementsByTagName("li");
  
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("h1")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
  }
}

// Funciones para filtar los eventos por tipo de evento
function buttonFilterEvent(type) {
  
  var filter, ul, li, i, txtValue, txtValue1, txtValue2;
  filter = type.toUpperCase();
  input = document.getElementById("filterInputName");
  input.value = '';
  ul = document.getElementsByClassName("eventListTable");
  li = ul[0].getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
      
      p = li[i].getElementsByTagName("p")[1];
      p2 = li[i].getElementsByTagName("p")[2];
      
      txtValue = p.textContent.split(':')[1];
      txtValue2 = p2.textContent.split(':')[1];
      txtValue1 = txtValue.split('-')[0];
      txtValue2 = txtValue2.split('-')[0];

      if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1)  {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
      if (filter=="ALL"){
        li[i].style.display = "";
      }
    }
}

//Funcion para filtrar los eventos cercanos en la lista
function buttonFilterNearEvent(){
  var ul = document.getElementsByClassName("eventListTable");
  var filtro = ul[0].getElementsByTagName("h2");
  var li = ul[0].getElementsByTagName("li");
  var name = ul[0].getElementsByTagName("h1");
  for (i = 0; i < li.length; i++){
    var flag=0;
    for (i2 = 0; i2 < nearEvents.length; i2++){
      if(nearEvents[i2].latitude===filtro[i].textContent.split(',')[1] & nearEvents[i2].longitude===filtro[i].textContent.split(',')[0]){
        li[i].style.display = "";
        console.log(name[i]);
        flag++;
      }
    }
    if(flag==0){
      li[i].style.display = "none";
    }
  }
}