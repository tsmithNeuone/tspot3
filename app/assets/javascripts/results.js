var map;
var vendor_key_names = [];
var vendor_markers = [];
var vendor_details = [];
var lat_lng_bounds = new google.maps.LatLngBounds();
var offset_of_vendors = 0;
var num_vendors = 0;
$(document).ready(function() {
	initialize();
	//loads the map first
	getVendorData();
	$("#next_vendors_button").click(function() {
		getNext10();
	});
	if (offset_of_vendors == 0) {
		$("#prev_vendors_button").hide();
	}
	$("#prev_vendors_button").click(function() {
		getPrev10();
	});
	$("#redo_search_button").click(function(){
		redoSearch();
	});
});

function initialize() {//map options for google map. can add customization stuff in here.
	var mapOptions = {
		center : new google.maps.LatLng(30.294646, -97.737336),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function getVendorData() {
	var search_lat = $("#data_lat").text();
	//uses the data hidden in fields on results page.
	var search_lng = $("#data_lng").text();
	var search_category = $("#data_category").text();
	var api = $.ajax({//ajax to internal wrapper using rest-client gem
		//tried to use straight ajax but it wasn't working because of the cross domain issue.
		url : "/searches/api_call_nearby",
		data : {
			lat : search_lat,
			lng : search_lng,
			offset : offset_of_vendors
		},

	});

	api.done(function(data) {//successful call to my internal wrapper for the api call.

		/****************************************************************************************************/
		/*	Loop through each of the 10 vendors returned from query											*/
		/****************************************************************************************************/
		var timeOutIndexVendors = 0;
		var tempCount = 0;
		num_vendors = data.vendors.length;
		if (data.vendors.length == 0) {//if there are no results throw an error and map stays centered on default center...currently Austin as of [10/7/13]
			alert("No results found!");
			$("#next_vendors_button").hide();
		} else {
			$.each(data.vendors, function() {//this is a call to the nearby function with the parameters
				//from the search page. TODO: Add the categories ID to the parameters.
				var tempVendor = new Vendor(this.name, this.id, this.address, this.city, this.zip, this.state, this.longitude, this.latitude, this.score, this.gun_sign, this.permit_valid, this.violation, this.distance, this.rating, this.price, this.cuisines);
				var tempLatLng = new google.maps.LatLng(this.latitude, this.longitude);
				var tempID = "marker_" + this.name + this.latitude + this.longitude;
				var z_index = tempCount;
				//unique id:assumes non-duplicated data
				lat_lng_bounds.extend(tempLatLng);
				//duplicate results... FIXME: supposedly elten will have some one "clean up" the data
				//results way off... FIXME: some of the data is in San Fransisco and who knows where else... make a
				//query to check bounds of the data (ie check limit of Lat and Lng)
				vendor_key_names.push(tempID);
				vendor_details[tempCount] = tempVendor;
				addResultDiv(this, tempCount, tempVendor.id, offset_of_vendors);

				setTimeout(function() {//affects how fast the markers drop on to the map
					var marker = new google.maps.Marker({
						position : tempLatLng,
						map : map,
						id : tempID,
						animation : google.maps.Animation.DROP,
						name : tempVendor.name,
						zIndex : z_index,

					});
					vendor_markers.push(marker);
					google.maps.event.addListener(marker, 'click', function() {
						vendor_index = vendor_key_names.indexOf(this.id);
						vendor_click(vendor_index);
					});
					//store all the markers in a hash table by
					//a unique id made from the name, lat, and lng... see above (tempID)
				}, timeOutIndexVendors * 100);
				//changing this number changes how long between pins falling for vendors
				$("#vendor_" + tempCount).click(function() {
					//adds details under the name of the vendor on click and makes the carker bounce on the map.
					var vendor_index = this.dataset.id;
					vendor_click(vendor_index);
				});

				tempCount++;
				timeOutIndexVendors++;

			});

			/****************************************************************************************************/
			/*	End loop through vendors from api call															*/
			/****************************************************************************************************/
			map.fitBounds(lat_lng_bounds);

			if (map.getZoom() > 15) {
				map.setZoom(15);
			}
		}
	});
	api.fail(function(jq, textStatus, errorThr) {
		alert(textStatus + errorThr);
	});
	api.always(function(x) {
	});

};

function vendor_click(index) {
	var marker = vendor_markers[index];
	map.panTo(marker.getPosition());
	marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
		marker.setAnimation(null);
	}, 1465);
	
	append_vendor_detail(index);
}

function redoSearch(){
	$("#data_lat").text(map.getCenter().lat());
	$("#data_lng").text(map.getCenter().lng());
	offset_of_vendors = 0;
	clearVendorData();
	getVendorData();
	$("#prev_vendors_button").hide();
	
}

function getNext10() {
	//gets the next 10 nearest vendors calling the newarby api with an offset
	$("#prev_vendors_button").show();
	clearVendorData();
	offset_of_vendors += 10;
	getVendorData();
}

function getPrev10() {
	//gets the previous 10 vendors using the nearby api,
	if (offset_of_vendors > 10) {
		clearVendorData();
		offset_of_vendors -= 10;
		getVendorData();
	} else {//less than 10 vendors offset, need to hide the prev 10 button and only get the first 10 vendors
		offset_of_vendors = 0;
		clearVendorData();
		getVendorData();
		$("#prev_vendors_button").hide();
	}
}

function clearVendorData() {
	//clears all of the arrays containing info on the vendors
	//use before getting the next/prev 10
	$("#results").empty();
	vendor_key_names = [];
	vendor_details = [];
	for (var i = 0; i < vendor_markers.length; i++) {
		vendor_markers[i].setMap(null);
	}
	vendor_markers = [];
}

function addResultDiv(vendorObj, count, vendor_id, offset) {
	var divToAdd = "<div id=\"vendor_" + count + "\" class=\"vendors_div\" data-detail_id=\"";
	divToAdd += vendor_id + "\" data-id=\"" + count + "\">" + (count + 1 + offset) + ". " + toProperCase(vendorObj.name);
	divToAdd += "</br>" + "</div>";
	$("#results").append(divToAdd);
}

function append_vendor_detail(index) {
	//clears the detail from the other divs and adds the details of the div or marker that was clicked

	if (document.getElementById("vendor_detail") !== null) {
		$("#vendor_detail").remove();
	}

	for (var vendor_reset_count = 0; vendor_reset_count < num_vendors; vendor_reset_count++) {
		$("#vendor_" + vendor_reset_count).css("font-size", 16);
	};
	$("#vendor_" + index).css("font-size", 20);

	var detail_text = "<div id=\"vendor_detail\">";
	var vendor = vendor_details[index];
	for (var prop in vendor) {
		detail_text += prop + ": " + vendor[prop] + ", <br>";
	}
	detail_text += "</div>";
	$("#vendor_" + index).append(detail_text);
}

function toProperCase(str)//got this off stack overflow...may not work right for first words ie
//"The Boulevard" becomes "the Boulevard"
{
	var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with', 'llc'];
	return str.replace(/\w\S*/g, function(txt, offset) {
		if (offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1) {
			return txt.toLowerCase();
		}
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function Vendor(name, id, address, city, zip, state, longitude, latitude, score, gun_sign, permit_valid, violation, distance, rating, price, cuisines) {
	this.name = name;
	this.id = id;
	this.address = address;
	this.city = city;
	this.zip = zip;
	this.state = state;
	this.longitude = longitude;
	this.latitude = latitude;
	this.score = score;
	this.gun_sign = gun_sign;
	this.permit_valid = permit_valid;
	this.violation = violation;
	this.distance = distance;
	this.rating = rating;
	this.price = price;
	this.cuisines = cuisines;
}
