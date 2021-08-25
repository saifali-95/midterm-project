$(document).ready(function () {

  const slider = document.getElementById("myRange");
  console.log(slider, "slider");
  const output = document.getElementById("demo");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
  }

})
