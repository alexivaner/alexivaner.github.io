$(document).ready(function() {

  $("body").on("click", "#next_3", function() {
    event.preventDefault();
    localStorage.setItem('jenis_game', $('#jenisgame').find(":selected").text());
    // alert("Jenis game yang dipilih: " + localStorage.getItem('jenis_game'));
    var url = $(this).data('target');
    $(".form-horizontal").load(url);
  });

  $("body").on("click", "#next_4", function() {
    event.preventDefault();
    localStorage.setItem('jenis_voucher', $("input:radio[name='radios']:checked").parent().text());
    // alert("Jenis voucher yang dipilih: " + localStorage.getItem('jenis_voucher'));
    var url = $(this).data('target');
    $(".form-horizontal").load(url);
  });


  $("body").on("click", "#next_5", function() {
    event.preventDefault();
    localStorage.setItem('id_player', $("#idplayer").val());
    // alert("ID Player adalah : " + localStorage.getItem('id_player'));
    var url = $(this).data('target');
    $(".form-horizontal").load(url);
  });

  $("body").on("click", "#next_6", function() {
    event.preventDefault();
    localStorage.setItem('tempat_bayar', $("input:radio[name='radios']:checked").parent().text());
    // localStorage.setItem('tempat_bayar', $("input:radio[name='radios']:checked").val());
    // alert("Tempat bayar : " + localStorage.getItem('tempat_bayar'));
    var url = $(this).data('target');
    $(".form-horizontal").load(url, function() {
      $("#tempat_bayar").attr("placeholder", localStorage.getItem('tempat_bayar'));
      $("#id_player").attr("placeholder", localStorage.getItem('id_player'));
      $("#jenis_voucher").attr("placeholder", localStorage.getItem('jenis_voucher'));
      $("#jenis_game").attr("placeholder", localStorage.getItem('jenis_game'));
    });
  });


  $("body").on("click", "#prev_4,#prev_5,#prev_6,#prev_7", function() {
    event.preventDefault();
    var url = $(this).data('target');
    $(".form-horizontal").load(url)
  });
});
