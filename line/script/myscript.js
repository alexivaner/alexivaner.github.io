$(document).ready(function() {
  $("#next_3").click(function(event) {
    event.preventDefault();
    localStorage.setItem('jenis_game', $('#jenisgame').find(":selected").text());
    var url = $(this).data('target');
    alert("Jenis game yang dipilih: " + localStorage.getItem('jenis_game'));
    location.replace(url);
  });

  $("#next_4").click(function(event) {
    event.preventDefault();
    localStorage.setItem('jenis_voucher', $("input:radio[name='radios']:checked").val());
    var url = $(this).data('target');
    alert("Jenis voucher yang dipilih: " + localStorage.getItem('jenis_voucher'));
    location.replace(url);
  });


  $("#next_5").click(function(event) {
    event.preventDefault();
    localStorage.setItem('id_player', $("#idplayer").val());
    var url = $(this).data('target');
    alert("ID Player adalah : " + localStorage.getItem('id_player'));
    location.replace(url);
  });

  $("#next_6").click(function(event) {
    event.preventDefault();
    localStorage.setItem('tempat_bayar', $("input:radio[name='radios']:checked").val());
    var url = $(this).data('target');
    alert("ID Player is: " + localStorage.getItem('tempat_bayar'));
    location.replace(url);
  });

  $("#prev_4,#prev_5,#prev_6,#prev_7").click(function(event) {
    event.preventDefault();
    var url = $(this).data('target');
    location.replace(url);
  });
});
