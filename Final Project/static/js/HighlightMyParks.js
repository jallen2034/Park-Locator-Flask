var currently_highlighted_park;
let highlighted_park_div = document.getElementsByClassName("list_item");

for (let i = 0; i < highlighted_park_div.length; i++) {
  highlighted_park_div[i].onclick = function(){

    if (currently_highlighted_park) document.getElementById(currently_highlighted_park).style.backgroundColor = "white";
    currently_highlighted_park = highlighted_park_div[i].id;
    highlighted_park_div[i].style.backgroundColor = "#f2f2f2";
  }
}