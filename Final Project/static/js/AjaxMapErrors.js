// use JS to grab every button on my page by their designated class_name "add_to_parks_buttons"
// these buttons by their clase name are stored in an array, into a single variable
let add_to_button = document.getElementsByClassName("add_to_parks_buttons");

// loop through every button on the page by its collected "element", detect when the [i]th "Add to My Parks" button looped through is clicked & store it inside "button_id"
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
        console.log('succ');
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
          }, 3000);
        });

      } else {
        console.log('fail');
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
          }, 3000);
        });
      }
    })
  }
}