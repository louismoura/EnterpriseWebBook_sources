/**
 * @author
 */
window.onload = function() {

	/* --------- login module start -------------- */
	(function() {

		//login section elements
		var loginLink = document.getElementById("login-link");
		var loginForm = document.getElementById("login-form");
		var loginSubmit = document.getElementById('login-submit');
		var logoutLink = document.getElementById('logout-link');
		var profileLink = document.getElementById('profile-link');
		var authorizedSection = document.getElementById("authorized");

		var userName = document.getElementById('username');
		var userPassword = document.getElementById('password');

		function showLoginForm() {
			loginLink.style.display = "none";
			loginForm.style.display = "block";
			loginSubmit.style.display = "block";
		}

		loginLink.addEventListener('click', showLoginForm, false);

		function showAuthorizedSection() {
			authorizedSection.style.display = "block";
			loginForm.style.display = "none";
			loginSubmit.style.display = "none";
		}

		function logIn() {
			//check credential
			var userNameValue = userName.value;
			var userNameValueLength = userName.value.length;
			var userPasswordValue = userPassword.value;
			var userPasswordLength = userPassword.value.length;

			if (userNameValueLength == 0 || userPasswordLength == 0) {
				if (userNameValueLength == 0) {
					console.log('username is empty');
				}
				if (userPasswordLength == 0) {
					console.log('password is empty');
				}
			} else if (userNameValue != 'admin' || userPasswordValue != '1234') {
				console.log('username or password is invalid');
			} else if (userNameValue == 'admin' && userPasswordValue == '1234') {
				showAuthorizedSection();
			}
		}

		loginSubmit.addEventListener('click', logIn, false);

		function logOut() {
			userName.value = '';
			userPassword.value = '';
			authorizedSection.style.display = "none";
			loginLink.style.display = "block";
		}


		logoutLink.addEventListener('click', logOut, false);

		function getProfile() {
			console.log('Profile link was clicked');
		}


		profileLink.addEventListener('click', getProfile, false);

	})();
	/* --------- login module end  -------------- */

	/* --------- make donation module start -------------- */
	(function() {
		var donateBotton = document.getElementById('donate-botton');
		var donationAddress = document.getElementById('donation-address');
		var donateFormContainer = document.getElementById('donate-form-container');
		var customAmount = document.getElementById('customAmount');
		var donateForm = document.forms['_xclick'];
		var donateLaterLink = document.getElementById('donate-later-link');
		var checkedInd = 2;

		function showDotationForm() {
			donationAddress.style.display = "none";
			donateFormContainer.style.display = "block";
		}


		donateBotton.addEventListener('click', showDotationForm, false);

		//uncheck selected radio buttons if custom amount was choosen
		function onCustomAmountFocus() {
			for (var i = 0; i < donateForm.length; i++) {
				if (donateForm[i].type == 'radio') {
					donateForm[i].onclick = function() {
						customAmount.value = '';
					}
				}
				if (donateForm[i].type == 'radio' && donateForm[i].checked == true) {
					checkedInd = i;
					donateForm[i].checked = false;
				}
			}
		}


		customAmount.addEventListener('focus', onCustomAmountFocus, false);

		function onCustomAmountBlur() {
			var value = customAmount.value;
			if (value == '') {
				donateForm[checkedInd].checked = true;
			}
		}


		customAmount.addEventListener('blur', onCustomAmountBlur, false);

		function donateLater() {
			donationAddress.style.display = "block";
			donateFormContainer.style.display = "none";
		}


		donateLaterLink.addEventListener('click', donateLater, false);

	})();
	/* --------- make donation module end -------------- */

	/* --------- start // google maps | multi markers | json data -------------- */

	(function() {

		var geocoder = new google.maps.Geocoder();

		var locationUI = document.getElementById('location-ui');
		var locationMap = document.getElementById('location-map');

		var resizeMapLink = document.getElementById('resize-map');

		// latitude = 39.8097343 longitude = -98.55561990000001
		// Lebanon, KS 66952, USA Geographic center of the contiguous United States
		// the center point of the map
		var latitudeOfMapCenter = 39.8097343;
		var longitudeOfMapCenter = -98.55561990000001;

		var campaignsCount = 0;

		//setup map's options
		var mapOptions = {
			center : new google.maps.LatLng(latitudeOfMapCenter, longitudeOfMapCenter),
			zoom : 3,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions : {
				style : google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position : google.maps.ControlPosition.TOP_RIGHT
			}
		};

		var map = new google.maps.Map(locationMap, mapOptions);

        function resizemap() {
			var textCont = resizeMapLink.textContent;
			var locationMap = document.getElementById('location-map');
			if (textCont == "increase map's size") {
				
				locationMap.className = "increased";
				
				//other option - works in modern browsers 
				//locationMap.classList.remove('reduced');
				//locationMap.classList.add('increased');
				
				resizeMapLink.textContent = "reduce map's size";
				google.maps.event.trigger(map, "resize");
			} else if (textCont == "reduce map's size") {
				
				locationMap.className = "reduced";
				
				//other option - works in modern browsers 
				//locationMap.classList.remove('increased');
				//locationMap.classList.add('reduced');
				
				resizeMapLink.textContent = "increase map's size";
				google.maps.event.trigger(map, "resize");
			}
		}

		resizeMapLink.addEventListener('click', resizemap, false);

		function createCampaignsMap(campaigns) {

			var infowindow = new google.maps.InfoWindow();
			var marker;

			// self invoking function, passing the number of iterations as an argument i.e. campaigns count
			(function getCoordinatesByAddress(e) {

				var address = campaigns.items[e - 1].location;
				var campaignsTitle = campaigns.items[e - 1].title;
				var campaignsDescription = campaigns.items[e - 1].description;

				//get latitude and longitude by city name from json data
				geocoder.geocode({
					'address' : address,
					'country' : 'USA'
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						//we should waiting for google's geocoder.geocode results and than call function again

						//getting coordinates
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();
						
						//create marker
						marker = new google.maps.Marker({
							position : new google.maps.LatLng(latitude, longitude),
							map : map,
							title : address
						});
						
						//adding click event to the marker to show info-bubble with data from json
						google.maps.event.addListener(marker, 'click', (function(marker) {
							return function() {
								var content = '<p class="infowindow"><b>' + campaignsTitle + '</b><br/>' + campaignsDescription + '<br/><i>' + address + '</i></p>';
								infowindow.setContent(content);
								infowindow.open(map, marker);
							}
						})(marker));
						
						if (--e) {
							getCoordinatesByAddress(e);
						}

					} else {
						console.log('Error getting location data');
					}
				});

			})(campaignsCount);

		}

		function showCampaignsInfo(campaigns) {
			//get data from parsed json data
			campaignsCount = campaigns.items.length;

			var message = "<h3>" + campaigns.header + "</h3>" + "On " + campaigns.timestamp + " we run " + campaignsCount + " campaigns.";
			
			locationUI.innerHTML = message + locationUI.innerHTML;
			resizeMapLink.style.visibility = "visible";

			createCampaignsMap(campaigns);
		}

		function loadData(dataUrl) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', dataUrl);

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
                   if ((xhr.status >= 200 && xhr.status < 300) || 
                                             xhr.status === 304) {
						var jsonData = xhr.responseText;

						//parse the campaign data
						var campaignsData = JSON.parse(jsonData).campaigns;
						showCampaignsInfo(campaignsData);
					} else {
						console.log(xhr.statusText);
						// Show the error on the Web page
                        tempContainer.innerHTML += '<p class="error">Error getting ' + 
                                      target.name + ": "+ xhr.statusText + 
                                      ",code: "+ xhr.status + "</p>";
					}
				}
			}
			xhr.send();
		}

		var dataUrl = 'data/campaignsdata.json';
		loadData(dataUrl);

	})();
	/* --------- google maps | multi markers | json data  // end -------------- */

}
