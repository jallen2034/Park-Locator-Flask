// use JS to grab every button on my page by their designated class_name "go_to_on_map"
// these buttons by their clase name are stored in an array, into a single variable
let goto_map_button = document.getElementsByClassName("go_to_on_map");

// loop through every button in this array by its collected "element", add a listener to each index to detect when the [i]th "go_to_on_map" button looped through is clicked & store it inside "button_id"
for (let i = 0; i < goto_map_button.length; i++){
    goto_map_button[i].onclick = function(){
        // grab the collected buttons id & then store it in the "local storage" of the browser to be accessed later in our "/" app route
        button_id = goto_map_button[i].id;
        localStorage.setItem('button_id', button_id);
        console.log(localStorage.getItem('button_id'));
        document.location.href="/";
    }
}