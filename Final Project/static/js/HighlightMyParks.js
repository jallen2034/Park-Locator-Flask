// global variable to "hold" the div ID of the currently selected/highlioghted park
// take all of the divs by the element "list_item_myparks" and store them in an array to loop through later
var currently_highlighted_park;
console.log(currently_highlighted_park);
let init_highlighted_park_div = document.getElementsByClassName("list_item_myparks");

// loop through this "init_highlighted_park_div array" containing all of the divs for this class
for (let i = 0; i < init_highlighted_park_div.length; i++) {
  // subscribe this function to the div in the index being looped through when one of the divs in this array is clicked
  init_highlighted_park_div[i].onclick = function(){
    console.log(currently_highlighted_park);
    if (currently_highlighted_park) document.getElementById(currently_highlighted_park).style.backgroundColor = "white";
    currently_highlighted_park = init_highlighted_park_div[i].id;
    console.log(currently_highlighted_park);
    init_highlighted_park_div[i].style.backgroundColor = "#f2f2f2";
  }
}
