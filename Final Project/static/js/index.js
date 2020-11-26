// JS to loop through all of my divs & take the "park_id" from the buttons in these divs, & send that id to flask with ajax
// use JS to grab every button on my page by their designated class_name "add_to_parks_buttons" into a HTML collection

let add_to_button = document.getElementsByClassName("add_to_parks_buttons");
let button_id;

// loop through every button in the HTMl collection, detect when the [i]th "Add to My Parks" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < add_to_button.length; i++) {
  add_to_button[i].onclick = function(){
    button_id = add_to_button[i].id;

    // perform ajax call to flask with Jquery, to transmit my extracted "park_id" from one of the buttons
    // since JS is asynchronous, our function will complete before the request completes, hence why we need the $.when function down below
    // https://api.jquery.com/jquery.ajax/?fbclid=IwAR1pyVNbZvL-wjHamaczGlDexOjj6ePV8LAVhrg_0Bvy-sJsTYbXGcLC1YE
    // https://stackoverflow.com/questions/44644114/whats-a-non-deprecated-way-of-doing-a-synchronous-ajax-call-using-jquery
    // https://stackoverflow.com/questions/22372597/jquery-not-sending-json-on-ajax-post-request

    $.when($.ajax({
      method: 'POST',
      url: "/parkcall",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ clicked_button : button_id })

    // the response our flask web server will pass back to AJAX
    })).done(function(response) {
      console.log(response);

      // https://howtocreateapps.com/fetch-and-display-json-html-javascript/
      if (response.hasOwnProperty('success_notification')){
        console.log('Success!');
        var extracted_response = response.success_notification
        console.log(extracted_response)

        // https://stackoverflow.com/questions/10082330/dynamically-create-bootstrap-alerts-box-through-javascript
        // call the #alert_placeholder temp div and populate it with the boostrap banner
        bootstrap_alert = function() {}
        bootstrap_alert.warning = function() {
          $('#alert_placeholder').html('<div class="alert alert-primary fade show p-1" role="alert" style="position:abolute;z-index:999;">'+extracted_response+'</span></div>')
        }
        // call this function to display the alert and the div
        bootstrap_alert.warning(extracted_response);

        // function to hide the alert after 3.5 secs
        $(document).ready(function() {
          setTimeout(function() {
            $(".alert").alert('close');
          }, 3500);
        });

      } else {
        console.log('Failure!');
        var extracted_response = response.error_notification
        console.log(extracted_response)

        // https://stackoverflow.com/questions/10082330/dynamically-create-bootstrap-alerts-box-through-javascript
        // call the #alert_placeholder temp div and populate it with the boostrap banner
        bootstrap_alert = function() {}
        bootstrap_alert.warning = function() {
          $('#alert_placeholder').html('<div class="alert alert-danger fade show p-1" role="alert" style="position:abolute;z-index:999;">'+extracted_response+'</span></div>')
        }
        // call this function to display the alert and the div
        bootstrap_alert.warning();

        // function to hide the alert after 3.5 secs
        $(document).ready(function() {
          setTimeout(function() {
            $(".alert").alert('close');
          }, 3500);
        });
      }
    })
  }
};

// script that will listen for the localstorage to have a park id in it, then use jscript  to click on that div to center the map
// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload
// https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick
// https://stackoverflow.com/questions/588040/window-onload-vs-document-onload
// https://stackoverflow.com/questions/17569012/simulate-a-click-on-a-element-using-javascript-jquery\

window.onload = function() {
  var clicked_button_id = localStorage.getItem('button_id');

  if (clicked_button_id){
    var clicked_park_id = document.getElementById("Park " + clicked_button_id);
    clicked_park_id.click();
    clicked_park_id.scrollIntoView({ behavior: 'smooth',});
    localStorage.removeItem('button_id');
  }
};

// call GoToReviews.js script to loop through all of my divs & take the "go_to_reviews" from the buttons in these divs, & send that id to our browser's local storage to be used later
// use JS to grab every button on my page by their designated class_name "go_to_reviews" into a HTML collection
let goto_reveiw_button = document.getElementsByClassName("go_to_reviews");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
// grab the clicked collected buttons id & then store it in the "local storage" of the browser to be accessed later in our "/reviews" app route later
for (let i = 0; i < goto_reveiw_button.length; i++){
    goto_reveiw_button[i].onclick = function(){
        button_id = goto_reveiw_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/reviews";
    }
};

// JS to render the map and markers to the client

// perform a 'GET' ajax call to flask with Jquery, to pull the JSON  trigger this ajax call when the document loads
// the $.ajax method takes many parameters, some of which are required and others optional.
// it contains two callback options success and error to handle the response received.

$(document).ready(function(){
  var json_object = null;
  $.when($.ajax({
    url: "/homepage",
    type: 'GET',
    success: function(result){
      json_result = result;
      initMap(json_result);
    },
    error: function(error){
      console.log('Error ${error}');
    }
  }));
});

// https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs
// create a dict to store the markers that get generated by the add_markers function

var currently_highlighted;
var marker_selected;

function initMap(MyResult){
  var options = {
    zoom:12,
    center:{lat:49.2827, lng:-123.1207},
    disableDefaultUI: true,
    clickableIcons: false
  }

  var map = new google.maps.Map(document.getElementById('map'), options);
  console.log("JSON object from Flask back end:", MyResult);

  // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
  // loop through the 'result', which containes a list. remember when we created a json string with the key 'result' in jasonify from flask like this: return jsonify({'result' : json_list})
  // MyResult[key] is the list. The full list of JSON strings. loop through the lengh of how many list indxes there are here
  // then parse the JSON string at the list index contained inside the 'result' being looped through into a new JSON object in a variable

  for (var key in MyResult){
    for (i = 0; i < MyResult[key].length; i++){
      var json_obj = JSON.parse(MyResult[key][i]);
      // parse the string values of the current lat and long in our dict as floats for the addMarker function to understand
      // https://www.w3schools.com/jsref/jsref_parsefloat.asp
      park_id = json_obj['place_id'];
      FloatLat = parseFloat(json_obj['location_lat']);
      FloatLong = parseFloat(json_obj['location_long']);
      addMarker({lat: FloatLat, lng: FloatLong}, park_id);
    }
  }

  // add marker function to add markers to our map
  function addMarker(coords, park_id){
    var info_box_park = document.getElementById("Park " + park_id);
    var marker = new google.maps.Marker({
      position:coords,
      map:map,
      icon: 'https://i.imgur.com/5rNpwiF.png'
    });

    // my own "scroll" function, so we don't end up repeating it's code when called/needed
    // un-higlights old element if the currently highlighted global variable is set to anything, then change that selected divs backround colour to white
    // highlights new element, takes the id string from the "info_box_park" & stores it inside of the var "currently_highlighted", to identify that selected dom, sets that selected doms colour to grey
    // https://stackoverflow.com/questions/11064081/javascript-change-google-map-marker-color

    function scroll(){
      map.setZoom(12);
      map.panTo(marker.getPosition());
      info_box_park.scrollIntoView({ behavior: 'smooth',});

      if (currently_highlighted){
        document.getElementById(currently_highlighted).style.backgroundColor = "white";
      }
      currently_highlighted = info_box_park.id;
      info_box_park.style.backgroundColor = "#f2f2f2";

      if (marker_selected){
        marker_selected.setIcon('https://i.imgur.com/5rNpwiF.png')
      }
      marker_selected = marker;
      marker.setIcon('https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1')
    }

    // my own "zoom" function, does the same as zoom but doesnt scroll the div
    function zoom(){
      map.setZoom(12);
      map.panTo(marker.getPosition());

      if (currently_highlighted){
        document.getElementById(currently_highlighted).style.backgroundColor = "white";
      }
      currently_highlighted = info_box_park.id;
      info_box_park.style.backgroundColor = "#f2f2f2";

      if (marker_selected){
        marker_selected.setIcon('https://i.imgur.com/5rNpwiF.png')
      }
      marker_selected = marker;
      marker.setIcon('https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1')
    }

    // listener to call the zoom function for when a marker is clicked on
    marker.addListener('click', function(){scroll();});

    // listener we put on the info_box_park div when clicked on, it'll centre the map on the marker
    info_box_park.addEventListener('click', function(){zoom();});
  }
}
