var backup = $("#wpTextbox1")[0].value.match(/\{\{unfinished([\|\w=1|\n|\s])*\}\}/g);
function makeunfinished(l){
	$("#wpTextbox1")[0].value = $("#wpTextbox1")[0].value.replace(/\{\{unfinished([\|\w=1|\s|\n])*/g, $("#wpTextbox1")[0].value.match(/\{\{unfinished([\|\w=1|\n|\s])*/g)[0] + "|" + l + "=1");
	$(".unfinished." + l)[0].disabled = true;
	if(!$("#wpSummary")[0].value.match(/User:Lingvist200\/unfinished.js/g)) $("#wpSummary")[0].value += "+[[User:Lingvist200/unfinished.js|автоматическая правка шаблона {{unfinished}}]]";
}
function deleteunfinished(l){
	$("#wpTextbox1")[0].value = $("#wpTextbox1")[0].value.replace(/\{\{unfinished[\|\w=1|\n|\s]*\}\}/g, $("#wpTextbox1")[0].value.match(/\{\{unfinished[\|\w=1|\n|\s]*\}\}/g)[0].replace(new RegExp("(\\n|)\\|" + l + "=(1|)", "gi"), ""));
	$(".unfinished." + l).removeAttr("disabled");
	if(!$("#wpSummary")[0].value.match(/User:Lingvist200\/unfinished.js/g)){
		if($("#wpSummary")[0].value != ""){
			$("#wpSummary")[0].value += "+[[User:Lingvist200/unfinished.js|автоматическая правка шаблона {{unfinished}}]]";
		}else{
			$("#wpMinoredit")[0].checked = true;
			$("#wpSummary")[0].value = "[[User:Lingvist200/unfinished.js|автоматическая правка шаблона {{unfinished}}]]";
		}
	}
}
function totaldeleteunfinished(l){
	$("#wpTextbox1")[0].value = $("#wpTextbox1")[0].value.replace(/(\n|)\{\{unfinished[\|\w=1|\n|\s]*\}\}/g, "");
	$(".unfinished.create").removeAttr("disabled");
	$(".unfinished.totaldelete")[0].disabled = true;
}
function createunfinished(){
	if(!$("#wpTextbox1")[0].value.match(/\{\{unfinished/g)){
		$("#wpTextbox1")[0].value += "{{unfinished}}";	
		$(".unfinished.create")[0].disabled = true;
		$(".unfinished.totaldelete").removeAttr("disabled");
	}
}
function refresh(){
	$("#wpTextbox1")[0].value = $("#wpTextbox1")[0].value.replace(/\{\{unfinished([\|\w=1])*\}\}/g, backup[0]);
	$(".unfinished").removeAttr("disabled");
	var par = backup[0].match(/\|\w(?=\||=)/g);
	for(i = 0; i < par.length; i ++){
		$(".unfinished." + par[i].split("")[1])[0].disabled = true;
	}
	$("#wpSummary")[0].value = "";
}
if(wgAction.match(/edit|submit/gi) && wgNamespaceNumber === 0){
	if($("#wpTextbox1")[0].value.match(/\{\{unfinished\|\w\w/g)){var lang = $("#wpTextbox1")[0].value.match(/\{\{unfinished\|\w\w/g)[0].replace(/\{\{unfinished\|/g, "")}else{var lang = ""}
	$(".wikiEditor-ui-text")[0].innerHTML += 'В статье не хватает данных о : <input type="button" class="unfinished m" onclick="'+"makeunfinished('m')"+'" value="Морфологии"><input type="button" class="unfinished delete m" onclick="'+"deleteunfinished('m')"+'" value="X"><input type="button" class="unfinished p" onclick="'+"makeunfinished('p')"+'" value="Произношении"><input type="button" class="unfinished delete p" onclick="'+"deleteunfinished('p')"+'" value="X"><input type="button" class="unfinished s" onclick="'+"makeunfinished('s')"+'" value="Семантике"><input type="button" class="unfinished delete s" onclick="'+"deleteunfinished('s')"+'" value="X"><input type="button" class="unfinished e" onclick="'+"makeunfinished('e')"+'" value="Этимологии"><input type="button" class="unfinished delete e" onclick="'+"deleteunfinished('e')"+'" value="X"><input type="button" class="unfinished t" onclick="'+"makeunfinished('t')"+'" value="Переводе"><input type="button" class="unfinished delete t" onclick="'+"deleteunfinished('t')"+'" value="X"> | <input type="button" class="unfinished refresh" onclick="refresh()" value="↺"> | <input type="button" class="unfinished totaldelete" onclick="totaldeleteunfinished()" value="☇☇☇"> <input type="button" class="unfinished create" onclick="createunfinished()" value="∅→">';
	$("#wpTextbox1")[0].value = $("#wpTextbox1")[0].value.replace(/\{\{unfinished[\|\w=1|\s|\n]*\}\}/g, "{{unfinished" + "|" + lang + "}}");
	refresh();
}
