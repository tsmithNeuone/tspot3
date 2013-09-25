var geocoder;
var cur_lat;
var cur_lng;
var default_address;

$(document).ready(function() {
	$("#search_latitude").parent().hide();
	$("#search_longitude").parent().hide();
	$("#center_search_fields").find("a").hide();
	geocoder = new google.maps.Geocoder();
	default_address = "Austin, TX";
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(set_cur_position, err);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
	$("#search_address").focus(function() {
		if (this.value = default_address) {
			this.value = '';
		}
	});
	$("#search_address").blur(function() {
		// if input is empty, reset value to default
		if (this.value.length == 0) {
			this.value = default_address;
		}
	});
	// $("#search_address").focus(function() {
	// // when input is focused, clear its contents
	// if (this.value == default_address) {
	// this.value = "";
	// }
	//
	// });
});

function set_cur_position(position) {
	cur_lat = position.coords.latitude;
	cur_lng = position.coords.longitude;

	var latlng = new google.maps.LatLng(cur_lat, cur_lng);
	geocoder.geocode({
		'latLng' : latlng
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				default_address = results[1].formatted_address;
				document.getElementById("search_address").value = default_address;
			} else {
				alert('No results found');
			}
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});

};

function err() {
	alert("Geolocation failed. Make sure your browser supports geolocation!");
};
