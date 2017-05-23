rep = [
	["a", "ä", "а"],
	["æ", "=", "а"],
	["ɐ", "=", "ʌ"],
	["ə", "=", "ъ"],
	["ɛ", "=", "э"],
	["e", "=", "э"],
	["i", "=", "и"],
	["ɪ", "=", "и"],
	["ɨ", "=", "ы"],
	["o", "o̞", "о"],
	["ɵ", "=", "о"],
	["u", "=", "у"],
	["ʉ", "ʉ̞", "у"],
	["ʊ", "=", "у"],
	["ɪ̯", "=", "и̯"],
	["b", "=", "б"],
	["p", "=", "п"],
	["v", "=", "в"],
	["f", "=", "ф"],
	["ɡ", "=", "г"],
	["k", "=", "к"],
	["d", "d̪", "д"],
	["t", "t̪", "т"],
	["ʐ", "=", "ж"],
	["ʂ", "=", "ш"],
	["ʑː", "=", "ж’:"],
	["ɕː", "=", "щ"],
	["z", "z̪", "з"],
	["s", "s̪", "с"],
	["ɣ", "=", "γ"],
	["x", "=", "х"],
	["l", "=", "л"],
	["ɫ", "ɫ̪", "л"],
	["m", "=", "м"],
	["n", "n̪", "н"],
	["r", "=", "р"],
	["j", "=", "й"],
	["d͡z", "=", "͡дз"],
	["t͡s", "=", "ц"],
	["dʲ͡zʲ", "=", "͡д’з’"],
	["tʲ͡sʲ", "=", "ц’"],
	["d͡ʐ", "=", "͡дж"],
	["t͡ʂ", "=", "ч"],
	["d͡ʑ", "=", "͡дж’"],
	["t͡ɕ", "=", "ч’"],
	["ʲ", "=", "’"],
	["ː", "=", " :"]
];
function make_three_p (tr) {
	ipa = tr;
	ipap = tr;
	rla = tr;
	for ( i = 0; i < rep.length; i ++ ) {
		if ( rep[i][1] != '=' ) {
			ipap = ipap.replace(new RegExp(rep[i][0], "g"), rep[i][1]);
		}
		rla = rla.replace(new RegExp(rep[i][0], "g"), rep[i][2]);
	}
	rla = rla.replace(/ˈ([^уеыаоэяию]*)([уеыаоэяию])/g, "$1$2\u0301");
	rla = rla.replace(/ˌ([^уеыаоэяию]*)([уеыаоэяию])/g, "$1$2\u0300");
	rla = rla.replace(/т͡ɕ/g, 'ч');
	return [ipa, ipap, rla];
}

transcr = $('.rutr');

for ( d = 0; d < transcr.length; d ++ ) {
	ipa_c = $(transcr[d]).text();
	vars = make_three_p(ipa_c);
	tsc = [];
	for ( j = 0; j < vars.length; j ++ ) {
		tsc.push(vars[j].match(/\[[^\]]+/g)[0]);
	}
  $(transcr[d]).find('span').remove();
	for ( w = 0; w < 3; w ++ ) {
			$(transcr[d])[0].innerHTML += '<font class="tr t' + w + '">' + tsc[w].replace('[','') + '</font>';
			console.log('<font class="tr t' + w + '">' + tsc[w].replace('[','') + '</font>');
	}
  $(transcr[d]).html($(transcr[d]).html().replace('[]', '[') + ']');
	$('.tr').hide();
	$('.t0').toggle();
	$(transcr[d]).find('a').remove();
	$(transcr[d]).prepend('<a onclick="choose_tr(this, this.parentNode, 0)">МФА</a> (<a onclick="choose_tr(this, this.parentNode.parentNode, 1)">МФА+</a> / <a onclick="choose_tr(this, this.parentNode.parentNode, 2)">РЛА</a>)');
	$(transcr[d]).find('a').css('cursor', 'pointer');
	
}
function choose_tr(ur, el, i) {
	$(el).find('.tr').hide();
	$(el).find('.t' + i).show();
	$(el).find('a').css('color', '');
	$(ur).css('color', 'black');
}
