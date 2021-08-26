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
    })
    .done(() => {
      window.location = "/seller/mylist";
    })
    // $("#addItem")[0].reset();
  };

  $('.fa-heart').click(function() {
    const productId = $(this).parent().attr('id')
    $.ajax({
      url:'/favourite',
      type:'POST',
      data: {productId}
    })
    .done(() => {
        location.reload();
    })
  })
});
