importStylesheet("User:Lingvist200/edit-meaning.css");
var edit_mode = false;
function get_language_meaning(lang, number, text) {
    regexp = new RegExp('\\{\\{значение[^#]*язык\\s?=\\s?' + lang + '\\n', 'g');
    matches = text.match(regexp);
    return matches[number - 1];
}
function template_to_object(template) {
    template = template.replace(/\{\{значение/, '');
    template = template.split('\n');
    object = {};
    for ( var i in template ) {
        if (template[i] == '') continue;
        cur = template[i].replace(/^\|/, '').split(/\s?=\s?/);
        object[cur[0]] = cur[1];
    }
    return object;
}
function object_to_template(object) {
    template = '{{значение\n';
    for ( var key in object ) {
        template += '|' + key + ' = ' + object[key] + '\n';
    }
    template += '}}';
    return template;
}
function edit_meaning(el) {
    if (el.editing == 'true') return;
    el.editing = 'true';
    $(el).append('<br><div onclick="add_onyms(this);" style="display:inline-block;color:DimGray; font-variant:small-caps; margin-left:20px;cursor:pointer;\
    border: 1px solid #ccc;width:11%;"><img src="//cdn0.iconfinder.com/data/icons/ikooni-outline-free-basic/128/free-10-24.png">\
    добавить</div>');
    $(el).find('.edit-button').removeClass('edit-button').addClass('edit-button-clicked').show();
}
function save_meaning() {
    edit_mode = false;
}
function add_onyms(el) {
    meaning = el.parentNode;
    lang_code = meaning.className.split(" ")[1];
    index = $.inArray(meaning, $('.meaning.' + lang_code)) + 1;
    $.get("/w/index.php", {title:wgPageName, action:'raw'}, function(data) {
        mng = get_language_meaning(lang_code, index, data);
        mng = template_to_object(mng);
        mng_copy = mng;
        console.log(mng); // Debug
        adding = '&nbsp;<div class="onym"><ul>';
        $(meaning).find('.meaning-header').each(function () { 
             if (typeof $(this).html() == "string") delete mng_copy[$(this).html().replace(":", "")];
        });
        for ( var prop in mng_copy ) {
            if ( prop.match(/онимы$/) || prop == 'конверсивы' ) {
                adding += '<li><a onclick="set_onym(this.innerHTML)">' + prop.toUpperCase() + '</a></li>';
            }
        }
        $(meaning).append(adding + '</ul></div>');
    });
}
function set_onym(type) {
    set_onym_type = type;
    $(".onym").remove();
    $(meaning).find('.add-onym').append('<br>\
    <span class="meaning-header" style="color:DimGray; font-variant:small-caps; margin-left:20px;font-size:80%;">'+type+':</span> \
    <input type="text" class="onym-save" onkeypress="if(event.keyCode==13){sof.save(this);}">\
    <img onclick="sof.cancel(this.parentNode)" width="16" style="position:relative; right:4%;" src="//upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Red_x.svg/240px-Red_x.svg.png">')
}
function edit_page(code, summary, hook) {
    token = mw.user.tokens.get('editToken');
    $.post('/w/api.php', {
        action : 'edit', title : wgPageName, summary : summary, text : code, token : token
    }, hook);
}
var sof = {
    save: function (el) {
        $(el).parent().find('img').attr('src', '//upload.wikimedia.org/wikipedia/commons/2/2a/Loading_Key.gif');
        onym_val = el.value;
        ovym_val_list = onym_val.split(/,\s*/);
        $.get("/w/index.php", {title:wgPageName, action:'raw'}, function(data) {
            ccc = data; // Debug
            mng_old = get_language_meaning(lang_code, index, data);
            mng_old = template_to_object(mng_old);
            mng_old[set_onym_type.toLowerCase()] = onym_val;
            mng_old = object_to_template(mng_old).replace(/\}\}$/, '');
            data = data.replace(get_language_meaning(lang_code, index, data), mng_old);
            edit_page(data, 'Добавлены ' + set_onym_type.toLowerCase(), function(data) {
                sof.done();
            });
        });
    },
    done: function () {
        console.log('Done!');
        lnks = $.parseHTML('<a href="/wiki/' + onym_val.replace(/,\s*/g, '"></a>, <a href="/wiki/').replace(/^"/, '') + '"></a>');
        $(lnks).each(function () {
            $(this).html(decodeURIComponent($(this).attr('href').replace(/^.{6}/, '')));
        });
    }
};
//
if ( $('.meaning').length > 0 ) {
    $('.meaning').append('<font class="add-onym"></font>');
    $('.meaning').prepend('<span class="edit-hover" onclick="edit_meaning(this.parentNode)" style="height: 60px;margin-left: -45px;margin-top:-25px;position: absolute;width: 85px;"> </span>\
    <img src="//upload.wikimedia.org/wikipedia/commons/d/d3/InterlanguageLinks-Asset-Pencil.gif" \
    style="position:absolute;left:1.5%;display:none;cursor:pointer;" class="edit-button">');
    $('.edit-hover').mouseover(function () {$(this).parent().find('.edit-button').show();});
    $('.edit-hover').mouseout(function () {$(this).parent().find('.edit-button').hide();});
}
