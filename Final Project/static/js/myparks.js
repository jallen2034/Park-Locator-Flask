// JS script to send an ajax request to my server to delete a users saved park asynchronously
// use JS to grab every button on my page by their designated class_name "remove_from_parks_button"
let del_button = document.getElementsByClassName("remove_from_parks_buttons");
let park_div = document.getElementsByClassName("list_item_myparks");

// loop through every button on the page by its collected "element", detect when the [i]th "Add to My Parks" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < del_button.length; i++) {
  del_button[i].onclick = function(){
    button_id = del_button[i].id;

    /* perform ajax call to flask with jquery, to transmit my extracted "park_id" from one of the buttons
    * since JS is asynchronous, our function will complete before the request completes, hence why we need the $.when function down below
    * https://api.jquery.com/jquery.ajax/?fbclid=IwAR1pyVNbZvL-wjHamaczGlDexOjj6ePV8LAVhrg_0Bvy-sJsTYbXGcLC1YE
    * https://stackoverflow.com/questions/44644114/whats-a-non-deprecated-way-of-doing-a-synchronous-ajax-call-using-jquery
    * https://stackoverflow.com/questions/22372597/jquery-not-sending-json-on-ajax-post-request */
    $.when($.ajax({
      method: 'POST',
      url: "/parkdelete",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ clicked_button : button_id })

      // the response our flask web server will pass back to AJAX
    })).done(function(response) {
      console.log(response);
      console.log('Ajax call to delete park has been successful!');
      var extracted_response = response.success_notification;
      console.log(extracted_response);

      // https://stackoverflow.com/questions/10082330/dynamically-create-bootstrap-alerts-box-through-javascript
      // call the #alert_placeholder temp div and populate it with the boostrap banner
      bootstrap_alert = function() {}
      bootstrap_alert.warning = function(extracted_response) {
        $('#alert_placeholder').html('<div class="alert alert-primary fade show p-1" role="alert" style="position:abolute;z-index:999;">'+extracted_response+'</span></div>')
      }
      // display the alert and the div
      bootstrap_alert.warning(extracted_response);

      // function to hide the alert after 3.5 secs
      $(document).ready(function() {
        setTimeout(function() {
          $(".alert").alert('close');
        }, 3000);
      });
    })
    // https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
    park_div[i].style.display = "none"
  }
}

// JS to highlight the parks
// global variable to "hold" the div ID of the currently selected/highlioghted park
// take all of the divs by the element "list_item_myparks" and store them in a HTML collection to loop through later
var currently_highlighted_park;
var init_highlighted_park_div = document.getElementsByClassName("list_item_myparks");

// loop through this "init_highlighted_park_div HTML collection" containing all of the divs for this class
// subscribe this function to the div in the index being looped through when one of the divs in this array is clicked
for (let i = 0; i < init_highlighted_park_div.length; i++) {
  init_highlighted_park_div[i].onclick = function(){
    if (currently_highlighted_park){
      document.getElementById(currently_highlighted_park).style.backgroundColor = "white";
    }
    currently_highlighted_park = init_highlighted_park_div[i].id;
    init_highlighted_park_div[i].style.backgroundColor = "#f2f2f2";
  }
}

// JS script to loop through all of my divs & take the "go_to_on_map" from the buttons in these divs, & send that id to our browser's local storage to be used later
// use JS to grab every button on my page by their designated class_name "go_to_on_map"
// these buttons by their clase name are stored in an array, into a single variable
let goto_map_button = document.getElementsByClassName("go_to_on_map");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < goto_map_button.length; i++){
    goto_map_button[i].onclick = function(){
        button_id = goto_map_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/";
    }
}

// call MapAjax.js script to loop through all of my divs & take the "go_to_reviews" from the buttons in these divs, & send that id to our browser's local storage to be used later
// use JS to grab every button on my page by their designated class_name "go_to_reviews"
// these buttons by their class name are stored in an array, into a signle variable
let goto_reveiw_button = document.getElementsByClassName("go_to_reviews");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < goto_reveiw_button.length; i++){
    goto_reveiw_button[i].onclick = function(){
        button_id = goto_reveiw_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/reviews";
    }
};
