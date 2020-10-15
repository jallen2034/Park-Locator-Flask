// JS script to highlight a div clicked on
// global variable to "hold" the div ID of the currently selected/highlioghted park
// https://www.youtube.com/watch?v=oUpEKosnC8E&list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2s-V&index=3
// store the colected elements into a HTML collection
var currently_highlighted_review;
var init_highlighted_review_div = document.getElementsByClassName("review_parks");

// loop through the HTML collection + store the buttons id in global var
for (let i = 0; i < init_highlighted_review_div.length; i++) {
  init_highlighted_review_div[i].onclick = function(){
    if (currently_highlighted_review){
     document.getElementById(currently_highlighted_review).style.backgroundColor = "white";
    }
    currently_highlighted_review = init_highlighted_review_div[i].id;
    init_highlighted_review_div[i].style.backgroundColor = "#f2f2f2";
  }
}

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

// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload
// https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick
// https://stackoverflow.com/questions/588040/window-onload-vs-document-onload
window.onload = function() {
  var clicked_button_id = localStorage.getItem('button_id');
  console.log(clicked_button_id);

  if (clicked_button_id){
    // https://stackoverflow.com/questions/17569012/simulate-a-click-on-a-element-using-javascript-jquery\
    var clicked_park_id = document.getElementById("Park " + clicked_button_id);
    console.log(clicked_park_id);
    clicked_park_id.click();
    clicked_park_id.scrollIntoView({ behavior: 'smooth',});
    localStorage.removeItem('button_id');
  }
};

// JS script to filter the divs by inout in the text search box
// grab the id/reference to the form we want & attach an event listener to this search bar's/texts keyup() presseses (not working)
// https://stackoverflow.com/questions/12402101/store-data-from-a-form-into-a-javascript-variable/12402127
function TextSearch() {
  const searchText = document.getElementById('form-text').value
  const SearchTerm = searchText.toLowerCase();
  console.log(SearchTerm);
  var review_parks_tohide = document.getElementsByClassName("review_parks");

  // loop through the HTML collection of divs
  // grab the skatepark name from the "title" tag of the div being looped through in the HTML collection
  // https://www.w3schools.com/jsref/jsref_indexof.asp
  for (let i = 0; i < review_parks_tohide.length; i++){
    const title = review_parks_tohide[i].title;
    if (!SearchTerm || title.toLowerCase().indexOf(SearchTerm) != -1) {
      review_parks_tohide[i].style.display = 'block'
    } else {
      review_parks_tohide[i].style.display = 'none'
    }
  }
}
