var good_users = 'Mullanur|87.218.233.95|78.132.137.69|89.138.48.220|87.220.133.54|Me~dewiktionary|KoreanQuoter'
good_users = good_users.split('|');
$( ".mw-userlink" ).each(function( i ) {
  if ( good_users.indexOf ( $( this ).text() ) != -1 ) {
      $( this ).removeClass('new');
      $( this ).parent().addClass('gu');
      $( this ).attr('style', 'color: green; font-weight: bold;');
      $( this ).parent().attr('style', 'background-color: #FFB6C1;');
  }
});
$('.mw-changeslist')[0].innerHTML = $('.mw-changeslist')[0].innerHTML.replace("</h4>",
"</h4><button onclick='hgu();'>Скрыть доверенных участников</button>\
<button onclick='sgu();'>Показать только доверенных участников</button>"
);
var v = {hgu : false, sgu : false};
function sgu () {
    if ( v.sgu === false ) {
        $(".mw-changeslist li.gu").show();
        $(".mw-changeslist li").not('.gu').hide();
    } else {
        $(".mw-changeslist li").not('.gu').show();
    }
    v.sgu =! v.sgu;
}
function hgu () {
    if ( v.hgu === false ) {
        $(".mw-changeslist li.gu").hide();
    } else $(".mw-changeslist li.gu").show();
    v.hgu =! v.hgu;
}
