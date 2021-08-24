$(document).ready(function () {

  $(".card").click(function() {
    window.location = $(this).find("div").attr("img");
    return false;
  });

})
