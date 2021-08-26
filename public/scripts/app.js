
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
  };

  $('#deleteItem').submit(function() {
    if(confirm('Are you sure to delete the item?')) {
      return true;
    } else {
      return false;
    }
  });

  $('.fa-heart').click(function() {
    const productId = $(this).parent().attr('id')
    $.ajax({
      url:'/favourite',
      type:'POST',
      data: {productId},
    })
    .done(() => {
      location.reload();
    })
    .fail(() => {
      if(confirm("Please login first")) {
        window.location.href = "/login"
      } else {
        return false;
      }
    })
  })
});
