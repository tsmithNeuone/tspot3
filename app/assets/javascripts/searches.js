var map;

$(document).ready(function() {
	$("#search_latitude").parent().hide();
	$("#search_longitude").parent().hide();
	initialize();
});


function initialize() {
  var mapOptions = {
    center : new google.maps.LatLng(30.294646,-97.737336),
    zoom : 12,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}