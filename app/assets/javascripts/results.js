var map;
var vendor_array = [];
var vendor_markers_hash = {};
var latlngbounds = new google.maps.LatLngBounds();
$(document).ready(function() {
	initialize();
	//loads the map first
	var search_lat = $("#data_lat").text();
	//uses the data hidden in fields on results page.
	var search_lng = $("#data_lng").text();
	var search_category = $("#data_category").text();
	var api = $.ajax({//ajax to internal wrapper using rest-client gem
		//tried to use straigh ajax but it wasn't working because of the cross domain issue.
		url : "/searches/api_call_nearby",
		data : {
			lat : search_lat,
			lng : search_lng
		},

	});
	
	api.done(function(data) {//successful call to my internal wrapper for the api call.

		var indexOfVendors = 0;
		$.each(data.vendors, function() {//this is a call to the nearby function with the parameters
			//from the search page. TODO: Add the categories ID to the parameters.
			var tempName = this.name;
			var tempLatLng = new google.maps.LatLng(this.latitude, this.longitude);
			var tempID = "marker_" + this.name + this.latitude + this.longitude;
			//unique id:assumes non-duplicated data
			latlngbounds.extend(tempLatLng);
			//duplicate results... FIXME: supposedly elten will have some one "clean up" the data
			$("#results").append(toProperCase(this.name) + "</br>");
			vendor_array.push(tempID);
			setTimeout(function() {
				var marker = new google.maps.Marker({
					position : tempLatLng,
					map : map,
					id : tempID,
					animation : google.maps.Animation.DROP,
					name : tempName,
				});
				vendor_markers_hash[tempID] = marker;
				
				//store all the markers in a hash table by
				//a unique id made from the name, lat, and lng... see above (tempID)
			}, indexOfVendors * 100);
			//changing this number changes how long between pins falling for vendors

			indexOfVendors++;

		});
		map.fitBounds(latlngbounds);
	});
	api.fail(function(jq, textStatus, errorThr) {
		alert(textStatus + errorThr);
	});
	api.always(function(x) {
	});

	//map.setCenter(new google.maps.LatLng(search_lat, search_lng));
	
});
;

function initialize() {//map options for google map. can add customization stuff in here.
	var mapOptions = {
		center : new google.maps.LatLng(30.294646, -97.737336),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function getLocation() {//gets the current coords from HTML5 if user accepts.
	//TODO: handle cases where users do not accept (maybe default to the center of Austin)
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, err);
	} else {
		alert("Geolocation is not supported by this browser.");
	};
};

function err() {
	alert("Geolocation failed. Make sure your browser supports geolocation!");
};

function showPosition(position) {//this is an older function I wrote to move to the
	//current position based on HTML5 coordinates
	var tempvar = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var tempmarker = new google.maps.Marker({
		position : tempvar,
		map : map,
		title : 'Current Position'
	});
	map.panTo(tempvar);
	map.setZoom(14);
};

function toProperCase(str)//got this off stack overflow...may not work right for first words ie
//"The Boulevard" becomes "the Boulevard"
{
	var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with'];
	return str.replace(/\w\S*/g, function(txt, offset) {
		if (offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1) {
			return txt.toLowerCase();
		}
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}