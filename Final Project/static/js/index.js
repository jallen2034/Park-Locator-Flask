// JS to loop through all of my divs & take the "park_id" from the buttons in these divs, & send that id to flask with ajax
// use JS to grab every button on my page by their designated class_name "add_to_parks_buttons" into a HTML collection
let add_to_button = document.getElementsByClassName("add_to_parks_buttons");
let button_id;

// loop through every button in the HTMl collection, detect when the [i]th "Add to My Parks" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < add_to_button.length; i++) {
  add_to_button[i].onclick = function(){
    button_id = add_to_button[i].id;

    /* perform ajax call to flask with Jquery, to transmit my extracted "park_id" from one of the buttons
    * since JS is asynchronous, our function will complete before the request completes, hence why we need the $.when function down below
    * https://api.jquery.com/jquery.ajax/?fbclid=IwAR1pyVNbZvL-wjHamaczGlDexOjj6ePV8LAVhrg_0Bvy-sJsTYbXGcLC1YE
    * https://stackoverflow.com/questions/44644114/whats-a-non-deprecated-way-of-doing-a-synchronous-ajax-call-using-jquery
    * https://stackoverflow.com/questions/22372597/jquery-not-sending-json-on-ajax-post-request */
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
        bootstrap_alert.warning = function(extracted_response) {
          $('#alert_placeholder').html('<div class="alert alert-primary fade show p-1" role="alert" style="position:abolute;z-index:999;">'+extracted_response+'</span></div>')
        }
        // display the alert and the div
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
        bootstrap_alert.warning = function(extracted_response) {
          $('#alert_placeholder').html('<div class="alert alert-danger fade show p-1" role="alert" style="position:abolute;z-index:999;">'+extracted_response+'</span></div>')
        }
        // display the alert and the div
        bootstrap_alert.warning(extracted_response);

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
  console.log(clicked_button_id);

  if (clicked_button_id){
    var clicked_park_id = document.getElementById("Park " + clicked_button_id);
    console.log(clicked_park_id);
    clicked_park_id.click();
    clicked_park_id.scrollIntoView({ behavior: 'smooth',});
    localStorage.removeItem('button_id');
  }
};

// call GoToReviews.js script to loop through all of my divs & take the "go_to_reviews" from the buttons in these divs, & send that id to our browser's local storage to be used later
// use JS to grab every button on my page by their designated class_name "go_to_reviews" into a HTML collection
let goto_reveiw_button = document.getElementsByClassName("go_to_reviews");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < goto_reveiw_button.length; i++){
    //grab the clicked collected buttons id & then store it in the "local storage" of the browser to be accessed later in our "/reviews" app route later
    goto_reveiw_button[i].onclick = function(){
        button_id = goto_reveiw_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/reviews";
    }
};
