$(function(){
  $('.menu').click(function(){
    if ($('.dropdown').attr('status') == 'close') {
        $('.dropdown').attr('status', 'open');
        $('.dropdown-menus-close').attr('class', 'dropdown-menus-open');
    } else {
        $('.dropdown').attr('status', 'close');
        $('.dropdown-menus-open').attr('class', 'dropdown-menus-close');
    }
  });
  $('.logout').click(function(){
    $.get('/logout', function(data) {
      window.location.replace('/');
    });
  });
});
