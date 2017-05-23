/*
Dieses JS-Programm ist vom Benutzer [[User:Lingüista]] entwickelt. Es wird für die automatische Erstellung der Wortformen der lateinischen Wörter gebraucht.
*/
Version = 'neu) ([[Benutzer:Lingüista/latein.js|latein]] 1.1';
LoadingURL = '//upload.wikimedia.org/wikipedia/commons/2/2a/Loading_Key.gif';
function Inh(A, F) {
	jQuery.ajax({
        url: '/w/index.php?title=' + A + '&action=raw',
        success: F,
        async: false
    });
}
function Eltern(El, Zahl) {
	var a = El.parentNode;
	for ( i = 0 ; i < (Zahl - 1); i ++ ) {
		a = a.parentNode;
	}
	return a;
}
Makron = {};
function F(Wort) {
	var W = Wort;
	var Ersätze = [
		['ā', 'a'], ['ē', 'e'], ['ī', 'i'], ['ō', 'o'], ['ū', 'u'], ['ȳ', 'y'], ['ӯ', 'y'],
		['ă', 'a'], ['ĕ', 'e'], ['ĭ', 'i'], ['ŏ', 'o'], ['ŭ', 'u']
	];
	for ( i = 0 ; i < Ersätze.length; i ++ ) {
		Wort = Wort.replace(new RegExp(Ersätze[i][0], 'g'), Ersätze[i][1]);
	}
	Makron[Wort] = W;
	return Wort;
}
function Worttrennung(w) {
	vollständig = true;
	if ( arguments.length > 1 && arguments[1] === false ) vollständig = false;
	v = w.match(/[euiyoa]+/g);
	c = w.match(/[^euiyoa]+/g);
	s = [];
	for ( j = 0; j < w.length; j ++ ) {
		if ( s.length == 0 ) {
			s.push(w[j]);
		}
		else {
			if ( s[s.length - 1].match(/[euiyoa]+/g) ) {
				if ( w[j].match(/[euiyoa]+/g) ) s[s.length - 1] += w[j];
				else s.push(w[j]);
			} else {
				if ( w[j].match(/[^euiyoa]+/g) ) s[s.length - 1] += w[j];
				else s.push(w[j]);
			}
		}
	}
	a = '';
	cu = s.join('-');
	function nas (p, t) {
		cep = cu.match(new RegExp(p, 'g'))[0].replace(/-/g, '');
		if ( cep !== null ) {
			a += (cu.match(new RegExp(p, 'g'))[0].replace(/-/g, '') + '|');
			cu = cu.replace(new RegExp(p + (t === true ? '-' : ''), 'g'), '');
			console.log(cu);
			console.log(a);
		}
	}
	var buff = false;
	while ( cu.match(/[euiyoa]/g) !== null && cu.match(/[euiyoa]/g).length > 1 ) {
		
		// pa|ter
		if ( cu.match(/^[^euiyoa-]{1,3}-[euiyoa]-[^euiyoa-]-[euiyoa]/g) ) {
			nas('^[^euiyoa]{1,3}-[euiyoa]', true);
			//console.log(': pa|ter');
		}
		// cat|tus
		if ( cu.match(/^[^euiyoa]-[euiyoa]-[^euiyoa-]{2}/g) ) {
			nas('^[^euiyoa]-[euiyoa]-[^euiyoa-]', false);
			//console.log(': cat|tus');
		}
		// ur|bis
		if ( cu.match(/^[euiyoa]-[^euiyoa-]{2}/g) ) {
			nas('^[euiyoa]-[^euiyoa-]', false);
			//console.log(': ur|bis');
		}
		//per|do
		if ( cu.match(/^[^euiyoa-]-[euiyoa]-[^euiyoa-]{2}/g) ) {
			nas('^[^euiyoa-]-[euiyoa]-[^euiyoa-]', false);
			//console.log(': per|do');
		}
		//me|us
		if ( cu.match(/^[^euiyoa-]*-[euiyoa]{2}/g) ) {
			nas('^[^euiyoa-]*-[euiyoa]', false);
			//console.log(': me|us');
		}
		//u|bi
		if ( cu.match(/^[euiyoa]-[^euiyoa-]-[euiyoa]+$|^[euiyoa]-[^euiyoa-]-[euiyoa]+-/g) ) {
			nas('^[euiyoa]', false);
			//console.log(': u|bi');
		}
		//a|u|rum
		if ( cu.match(/^[euiyoa]{2}-/g) ) {
			nas('^[euiyoa]', false);
			//console.log(': a|u|rum');
		}
		//sub|stan|ti|a
		if ( cu.match(/^[^euiyoa]{2,3}-[euiyoa]-[^euiyoa-]{2,}/g) ) {
			nas('^[^euiyoa]{2,3}-[euiyoa]-[^euiyoa]', false);
			//console.log(': sub|stan|ti|a');
		}
		//sub|stra|men
		if ( cu.match(/^[^euiyoa-]{2,3}-[euiyoa]-/g) ) {
			nas('^[^euiyoa]{2,3}-[euiyoa]-', false);
			//console.log(': sub|stra|men');
		}
		//...stan|ti|a
		if ( cu.match(/^[^euiyoa]{1,3}-[euiyoa]-[^euiyoa-]{2,}/g) ) {
			nas('^[^euiyoa]{1,3}-[euiyoa]-[^euiyoa-]', false);
			//console.log(': ...stan|ti|a');
		}
		//
		cu = cu.replace(/^-(?=[^euiyoa-])/g, '');
		if ( buff !== false && cu == buff ) break;
		buff = cu;
	}
	a += cu.replace(/-/g, '');
	// tr, pr etc.
	a = a.replace(/([tpfgcb])\|r/g, "|$1r");
	// Diphthonge ae, au
	a = a.replace(/(a)\|([eu])/g, "$1$2");
	// oe-Diphthong
	a = a.replace(/(o)\|(e)/g, "$1$2");
	// eu-Diphthong
	a = a.replace(/(e)\|(u)\|/g, "$1$2|");
	// iu = ju
	a = a.replace(/(i)\|(u)\|/g, "$1$2|");
	// qu als einzige Silbe nicht wahrnehmen
	a = a.replace(/qu\|([euiyoa][^euioya]*)/g, "qu$1|");
	// qua|e-Trennung vermeiden
	a = a.replace(/qua\|e/, "quae|")
	// griechische Diphthonge korrigieren
	a = a.replace(/t\|h/g, "|th");
	a = a.replace(/p\|h/g, "|ph");
	a = a.replace(/c\|h/g, "|ch");
	// ë abgrenzen
	a = a.replace(/([euiyoa])(?=ë)/g, "$1|");
	// | am ende löschen
	a = a.replace(/\|$/g, "");
	// |||... -> |
	a = a.replace(/\|{2,}/g, "|");
	if ( vollständig ) {
		// manche Präfixe als enzige Silben
		if ( WortBeginntVomPräfix ) {
			for ( i = 0; i < GeschlP.length; i ++ ) {
				pt = new RegExp(GeschlP[i].replace(/.$/, '') + '\\|' + GeschlP[i].match(/.$/)[0], 'g');
				a = a.replace(pt, GeschlP[i] + '|');
			}
		}
		//
		vw = Makron[w];
		nz = a;
		a = a.split('|');
		b = [];
		for ( i = 0; i < a.length; i ++ ) {
			var p = new RegExp('^.{' + a[i].length + '}', 'g');
			b[i] = a[i].replace(p, vw.match(p)[0]);
			vw = vw.replace(vw.match(p)[0], '');
		}
		return b.join('·');
	}
	else {
		return a.split('|').join('·');
	}
}
function Nachricht(N) {
	console.log(N);
}
Inh(wgPageName, function (T) { Artikel = T; });
if ( Artikel.match(/Wortart\|\w+(?=\|Latein\}\})/g) !== null && Artikel.match(/==.+\{\{Sprache\|Latein\}\}.+/g) ) {
	Wortarten = Artikel.match(/Wortart\|\w+(?=\|Latein\}\})/g);
	for ( i = 0 ; i < Wortarten.length ; i ++ ) {
		Wortarten[i] = Wortarten[i].replace('Wortart|', '');
	}
	if (Wortarten.length != Artikel.match(/\{\{Latein\s[^Ü]+Übersicht/g).length) {
		Nachricht('Die Zahlen stimmen nicht überein!');
		ZSÜ = false;
	} else ZSÜ = true;
} else ZSÜ = false;
if ( ZSÜ && wgAction == 'view') {
	var Sprachtitel = $('h2 span.mw-headline');
	for ( i = 0 ; i < Sprachtitel.length ; i ++ ) {
		if ( Sprachtitel[i].id.match(/\.28Latein\.29/g) ) {
			Titel = $(Sprachtitel[i]).parent();
			continue;
		}
	}
	var h3 = $('h3');
	if ( Titel.next().prop("tagName") == "H3" ) {
		var ETI = $.inArray(Titel.next()[0], h3);
	}
	else {
		var ETI = $.inArray(Titel.next().find('h3')[0], h3);
	}
	var Tabellen = [];
	for ( i = 0; i < Wortarten.length; i ++ ) {
		Tabellen.push( $(h3[ETI + i]).next()[0] );
	}
	$(Tabellen).append('<small><center><a style="position:absolute;cursor:pointer;"	onclick="Anlegen(Eltern(this, 3), Eltern(this, 1))">\
	Flektierte Formen anlegen</a><br>\
	<p style="position: relative; display: none; left: 50%;" class="latein-script-loading">\
	<img width="16" src="' + LoadingURL + '">&nbsp;<a style="cursor:pointer;"></a></p></center></small>');
}
function BSenden(Name, Inhalt) {
	Erstellung = JSON.parse(
			$.ajax({
				url:mw.util.wikiScript('api'),
				method: 'POST',
				data: { action: 'edit',
						title: Name,
						summary: Version,
						text: Inhalt,
						token: mw.user.tokens.get('editToken'),
						format: 'json'
					  },
				async:false
			})
			.responseText
		);
}
function Bearbeiten(Name, Inhalt) {
	Inhalt = Inhalt.replace(/\t+\n/g, '\n');
	if ( Angelegt[Name] == 0 ) {
		BSenden(Name, Inhalt);
	} else {
		Inh(Name, function (T) { Ziel = T; });
		if ( ! Ziel.match(/\{\{Sprache\|Latein\}\}/g) ) {
			Interwiki = new RegExp('\\[\\[\\w+:' + Name + '\\]\\]', 'g');
			if ( Ziel.match(Interwiki) !== null ) {
				Ziel = Ziel.replace(Ziel.match(Interwiki)[0], "\n" + Inhalt + "\n\n" + Ziel.match(Interwiki)[0]);
			}
			else {
				Ziel += "\n" + Inhalt;
			}
			console.log(Ziel);
			BSenden(Name, Ziel);
		}
	}
}

function Anlegen(Tab, Ct) {
	// über den Präfix fragen
	GeschlP = 'ab ad ex in ob sub'.split(' ');
	var Frage = 'Beginnt das Wort "' + wgTitle + '" vom Präfix, oder ist es einfach ein Zusammenfallen? (Ok=beginnt/Cancel=Zusammenfallen)';
	if ( wgTitle.match( new RegExp('^(' + GeschlP.join('|') + ')', 'g') ) && confirm(Frage) === true ) {
		WortBeginntVomPräfix = true;
	} else WortBeginntVomPräfix = false;
	WA = Wortarten[Tabellen.indexOf(Tab)];
	correct = true;
	if ( WA == 'Substantiv' ) {
		j = 1;
		Formen = {'Singular':{},'Plural':{}};
		Angelegt = {};
		tb_tr = $(Tab).find('tbody tr');
		while ( tb_tr.get(j) !== undefined ) {
			console.log(0);
			tr = $ ( tb_tr.get(j) );
			if ( tr.children().length > 3 ) {
				Nachricht('Es gibt mehr Parameter, als 1 Singular und 1 Plural!');
				correct = false;
				break;
			}
			th = $(tr.find('th'));
			td = tr.find('td');
			td0 = $( td.get(0) );
			td1 = $( td.get(1) );
			if ( td0.text().match(/\w/g) ) Formen['Singular'][th.text()] = F(td0.text());
			if ( td1.text().match(/\w/g) ) Formen['Plural'][th.text()] = F(td1.text());
			Angelegt[F(td0.text())] = (td0.html().match('vorhanden') ? 0 : 1);
			Angelegt[F(td1.text())] = (td1.html().match('vorhanden') ? 0 : 1);
			j ++;
		}
		Wörter = {};
		for ( var Zahl in Formen ) {
			for ( var Kasus in Formen[Zahl] ) {
				Punkt = "* " + Kasus + " " + Zahl + " des Substantivs '''[["
				+ wgTitle + "]]'''\n";
				var Mrk = Formen[Zahl][Kasus];
				if ( Formen[Zahl][Kasus] !== undefined ) {
					Wörter[Mrk] += Punkt;
				}
				else {
					Wörter[Mrk] = Punkt;
				}
				Wörter[Mrk] = Wörter[Mrk].replace(/^undefined/g, '');
			}
		}
		Vorlage = "== @PN ({{Sprache|Latein}}) ==\n=== {{Wortart|Deklinierte Form|Latein}} ===\
		\n\n{{Worttrennung}}\n:@WT\n\n{{Grammatische Merkmale}}\n@FF\
		\n{{Grundformverweis Dekl|" + wgTitle + "}}";
		lsl = $ (Ct).find('p.latein-script-loading');
		$ (lsl).toggle();
		for ( var Wort in Wörter ) {
			$ (lsl).find('a').attr('href', '/wiki/' + encodeURIComponent(Wort));
			$ (lsl).find('a').html(Wort);
			Bearbeiten( Wort, Vorlage.replace('@WT', Worttrennung(Wort))
			.replace('@FF', Wörter[Wort]).replace('@PN', Makron[Wort]) );
		}
		$ (lsl).toggle();
	}
}
