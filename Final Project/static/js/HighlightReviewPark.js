// global variable to "hold" the div ID of the currently selected/highlioghted park
var currently_highlighted_review;
let init_highlighted_review_div = document.getElementsByClassName("review_parks");

for (let i = 0; i < init_highlighted_review_div.length; i++) {
  init_highlighted_review_div[i].onclick = function(){

    console.log(currently_highlighted_review);
    if (currently_highlighted_review) document.getElementById(currently_highlighted_review).style.backgroundColor = "white";
    currently_highlighted_review = init_highlighted_review_div[i].id;
    console.log(currently_highlighted_review);
    init_highlighted_review_div[i].style.backgroundColor = "#f2f2f2";
  }
}