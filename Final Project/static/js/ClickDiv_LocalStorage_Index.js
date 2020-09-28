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
