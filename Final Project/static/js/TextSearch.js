// grab the id/reference to the form we want & attach an event listener to this search bar's/texts keyup() presseses (not working)
// https://stackoverflow.com/questions/12402101/store-data-from-a-form-into-a-javascript-variable/12402127
function TextSearch() {
  const searchText = document.getElementById('form-text').value
  const SearchTerm = searchText.toLowerCase();
  console.log(SearchTerm);
  var review_parks_tohide = document.getElementsByClassName("review_parks");

  // loop through the HTML collection of divs
  for (let i = 0; i < review_parks_tohide.length; i++){
    // grab the skatepark name from the "title" tag of the div being looped through in the HTML collection
    const title = review_parks_tohide[i].title;
    // https://www.w3schools.com/jsref/jsref_indexof.asp
    if (!SearchTerm || title.toLowerCase().indexOf(SearchTerm) != -1) {
      review_parks_tohide[i].style.display = 'block'
    } else {
      review_parks_tohide[i].style.display = 'none'
    }
  }
}
