// use JS to grab every button on my page by their designated class_name "go_to_reviews"
// these buttons by their class name are stored in an array, into a signle variable
let goto_reveiw_button = document.getElementsByClassName("go_to_reviews");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < goto_reveiw_button.length; i++){
    goto_reveiw_button[i].onclick = function(){
        // grab the collected buttons id & then store it in the "local storage" of the browser to be accessed later in our "/reviews" app route later
        button_id = goto_reveiw_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/reviews";
    }
}