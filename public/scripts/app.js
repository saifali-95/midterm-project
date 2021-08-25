$(document).ready(function() {

  const success = () => {
    console.log("That was successful!!");
  }
  const formSubmitHandler = (e,form) => {
    e.preventDefault();
    const $text = form.serialize();
    formHandler($text, success);
  };

  $('#addItem').submit(function(e) {
    formSubmitHandler(e, $(this));
  });

  const formHandler = function($txt, callback) {
    $.ajax({
      url:'/products/addItem',
      type: 'POST',
      data: $txt,
      success: callback
    });
    $("#addItem")[0].reset();
    window.location = "/seller/mylist";
  };

  // $('.item1').click(function() {
  //   window.location = $(this).data('href');
  // });
});
