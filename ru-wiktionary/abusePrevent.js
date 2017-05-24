var AbusePrevent = new Object();
AbusePrevent.diffFuncs = new Object();
// settings
AbusePrevent.settings = new Object();
AbusePrevent.settings.clearStorageAfter = 300;
AbusePrevent.settings.maxAnonEditsCount = 10; // between reloads
AbusePrevent.settings.maxPersonalEditCount = 4; // between reloads
AbusePrevent.settings.defaultProtectionEditCount = 2;
AbusePrevent.settings.defaultProtectionType = 'edit=sysop|move=sysop';
AbusePrevent.settings.defaultBlockExpiry = '20 minutes';
// filter rules
AbusePrevent.filterRules = function () {
    var oldid = AbusePrevent.oldid;
    // common rules
    AbusePrevent.do_if(
        'affected_pages', AbusePrevent.diffBase.properties.title,
        '>=', AbusePrevent.settings.defaultProtectionEditCount, AbusePrevent.truncheon.protect
    );
    if (AbusePrevent.diffBase.properties.title == 'Викисловарь:Сообщения об ошибках') {
        return AbusePrevent.done(0);
    }
    // filter 1
    AbusePrevent.filterNumber = 1;
    AbusePrevent.filterName = 'Добавление неформатных значений';
    var dff = AbusePrevent.diffFuncs.getByLocus('meaning');
    var dff2 = AbusePrevent.diffFuncs.getByLocus('onyms');
    dff = dff.concat(dff2);
    for ( var j = 0; j < dff.length; j ++ ) {
        if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                function (a) { return a.match(/#[^А-ЯЁЙа-яёйA-Za-z]*$/) !== null },
                function (b) { return (b.match(/#[^\[\]]+$/) !== null && b.match(/#.*[А-ЯЁЙа-яёйA-Za-z]+.*$/) !== null) }
        )) {
            AbusePrevent.truncheon.rollback(oldid);
            //AbusePrevent.truncheon.block();
            return AbusePrevent.done(1);
        }
        if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                function (a) { return a === null },
                function (b) { return (b.match(/#[^\[\]]+$/) !== null && b.match(/#.*[А-ЯЁЙа-яёйA-Za-z]+.*$/) !== null) }
        )) {
            AbusePrevent.truncheon.rollback(oldid);
            // AbusePrevent.truncheon.block();  // temporary disabled
            return AbusePrevent.done(1);
        }
        if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                function (a) { return true },
                function (b) { return b.match(/\d*\.*\s*[А-ЯЁЙа-яёйA-Za-z]+/) !== null }
        )) {
            AbusePrevent.truncheon.rollback(oldid);
            // AbusePrevent.truncheon.block();  // temporary disabled
            return AbusePrevent.done(1);
        }
    }
    // filter 2
    AbusePrevent.filterNumber = 2;
    AbusePrevent.filterName = 'Добавление мусорных строк (кириллица)';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                function (a) {
                    return (
                        (a.match(/[^ёуеыпоэяию]/g) !== null ? a.match(/[^ёуеыпоэяию]/g) : []).length /
                        (a.match(/[ёуеыпоэяию]/g) !== null ? a.match(/[^ёуеыпоэяию]/g) : []).length
                    ) < 4
                },
                function (b) {
                    return (
                        (b.match(/[^ёуеыпоэяию]/g) !== null ? b.match(/[^ёуеыпоэяию]/g) : []).length /
                        (b.match(/[ёуеыпоэяию]/g) !== null ? b.match(/[^ёуеыпоэяию]/g) : []).length
                    ) > 4}
        )) {
            AbusePrevent.truncheon.rollback(oldid);
            return AbusePrevent.done(2);
        }
    }
    // filter 3
    var obscene = [
        '(?:\w*(?:[хxh](?:[уyu][иiu])|[пnp][еиeiu](?:[з3z][дd]|[дd](?:[еаоeoa0][рpr]|[рpr]))|[бb6][лl]я[дd]|[оo0][хxh][уyu][еe]|[мm][уyu][дd][еоиаeioau0]|[дd][еe][рpr][ьb]|[гrg][аоoa0][вbv][нhn]|[уyu][еёe][бb6])|[хxh][\W_]*(?:[уyu][\W_]*[йиеёяeiju])|[пnp][\W_]*[еиeiu][\W_]*(?:[з3z][\W_]*[дd]|[дd][\W_]*(?:[еаоeoa0][\W_]*[рpr]|[рpr]))|[бb6][\W_]*[лl][\W_]*я[\W_]*[дd]|[оo0][\W_]*[хxh][\W_]*[уyu][\W_]*[еe]|[мm][\W_]*[уyu][\W_]*[дd][\W_]*[еоиаeioau0]|[дd][\W_]*[еe][\W_]*[рpr][\W_]*[ьb]|[гrg][\W_]*[аоoa0][\W_]*[вbv][\W_]*[нhn]|[уyu][\W_]*[еёe][\W_]*[бb6]|[ёеe][бb6])\w+',
        'ж[\W_]*(?:[оo0][\W_]*[пnp][\W_]*(?:[аa]|[oо0](?:[\W_]*[хxh])?|[уеыeyiuё]|[оo0][\W_]*[йj])\w*)',
        '[дd][\W_]*[еe][\W_]*[рpr][\W_]*(?:[ьb][\W_]*)?[мm][\W_]*[оуеаeoya0u](?:[\W_]*[мm])?',
        '[чc][\W_]*[мm][\W_]*(?:[оo0]|[ыi][\W_]*[рpr][\W_]*[еиьяeibu])',
        '[сsc][\W_]*[уuy][\W_]*(?:(?:[чc][\W_]*)?[кk][\W_]*[ауиiyau](?:[\W_]*[нhn](?:[\W_]*[оo0][\W_]*[йj]|[\W_]*[уаыyiau])?)?|[чc][\W_]*(?:(?:[ьb][\W_]*)?(?:[еёяиeiu]|[еиeiu][\W_]*[йj])|[аa][\W_]*[рpr][\W_]*[ыауеeyiau]))',
        '[гrg][\W_]*(?:[аоoa0][\W_]*(?:[нhn][\W_]*[дd][\W_]*[аоoa0][\W_]*[нhn](?:[\W_]*[ыуyiu])?|[вbv][\W_]*[нhn][\W_]*[оаoa0](?:[\W_]*(?:[мm]|[еe][\W_]*[дd](?:[\W_]*[ыуаеeyiau]|[\W_]*[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?)?))?)|[нhn][\W_]*(?:[иiu][\W_]*[дd][\W_]*(?:[ыуеаeyiau]|[оo0][\W_]*[йj])|[уyu][сsc](?:[\W_]*[аыуyiau]|[\W_]*[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?)?))',
        '(?:[нhn][\W_]*[еe][\W_]*)?(?:(?:[з3z][\W_]*[аa]|[оo0][тt]|[пnp][\W_]*[оo0]|[пnp][\W_]*(?:[еe][\W_]*[рpr][\W_]*[еe]|[рpr][\W_]*[оеиeiou0]|[иiu][\W_]*[з3z][\W_]*[дd][\W_]*[оo0])|[нhn][\W_]*[аa]|[иiu][\W_]*[з3z]|[дd][\W_]*[оo0]|[вbv][\W_]*[ыi]|[уyu]|[рpr][\W_]*[аa][\W_]*[з3z]|[з3z][\W_]*[лl][\W_]*[оo0]|[тt][\W_]*[рpr][\W_]*[оo0]|[уyu])[\W_]*)?(?:[вbv][\W_]*[ыi][\W_]*)?(?:[ъьb][\W_]*)?(?:[еёe][\W_]*[бb6](?:(?:[\W_]*[оеёаиуeioyau0])?(?:[\W_]*[нhn](?:[\W_]*[нhn])?[\W_]*[яуаиьiybau]?)?(?:[\W_]*[вbv][\W_]*[аa])?(?:(?:[\W_]*(?:[иеeiu]ш[\W_]*[ьb][\W_]*[сsc][\W_]*я|[тt][\W_]*(?:(?:[ьb][\W_]*)?[сsc][\W_]*я|[ьb]|[еe][\W_]*[сsc][\W_]*[ьb]|[еe]|[оo0]|[иiu][\W_]*[нhn][\W_]*[уыеаeyiau])|(?:щ[\W_]*(?:[иiu][\W_]*[йj]|[аa][\W_]*я|[иеeiu][\W_]*[еe]|[еe][\W_]*[гrg][\W_]*[оo0])|ю[\W_]*[тt])(?:[\W_]*[сsc][\W_]*я)?|[еe][\W_]*[мтmt]|[кk](?:[\W_]*[иаiau])?|[аa][\W_]*[лl](?:[\W_]*[сsc][\W_]*я)?|[лl][\W_]*(?:[аa][\W_]*[нhn]|[оаoa0](?:[\W_]*[мm])?|(?:[иiu][\W_]*)?[сsc][\W_]*[ьяb]|[иiu]|[аa][\W_]*[сsc][\W_]*[ьb])|[рpr][\W_]*[ьb]|[сsc][\W_]*[яьb]|[нhn][\W_]*[оo0]|[чc][\W_]*(?:[иiu][\W_]*[хxh]|[еe][\W_]*[сsc][\W_]*[тt][\W_]*[ьиibu](?:[\W_]*ю)?)|(?:[тt][\W_]*[еe][\W_]*[лl][\W_]*[ьb][\W_]*[сsc][\W_]*[кk][\W_]*|[сsc][\W_]*[тt][\W_]*|[лl][\W_]*[иiu][\W_]*[вbv][\W_]*|[чтtc][\W_]*)?(?:[аa][\W_]*я|[оo0][\W_]*[йемejm]|[ыi][\W_]*[хйеejxh]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[иiu][\W_]*[еe]|[оo0][\W_]*[мm][\W_]*[уyu]|[иiu][\W_]*[йj]|[еe][\W_]*[вbv]|[иiu][\W_]*[мm](?:[\W_]*[иiu])?)|[чтыйилijltcu]))?)|[\W_]*[ыi](?:(?:[\W_]*[вbv][\W_]*[аa]|[\W_]*[нhn](?:[\W_]*[нhn])?)(?:(?:[\W_]*(?:[иеeiu]ш[\W_]*[ьb][\W_]*[сsc][\W_]*я|[тt][\W_]*(?:[ьb][\W_]*[сsc][\W_]*я|[ьb]|[еe][\W_]*[сsc][\W_]*[ьb]|[еe]|[иiu][\W_]*[нhn][\W_]*[уыеаeyiau])|(?:щ[\W_]*(?:[иiu][\W_]*[йj]|[аa][\W_]*я|[иеeiu][\W_]*[еe]|[еe][\W_]*[гrg][\W_]*[оo0])|ю[\W_]*[тt])(?:[\W_]*[сsc][\W_]*я)?|[еe][\W_]*[мтmt]|[лl][\W_]*(?:(?:[иiu][\W_]*)?[сsc][\W_]*[ьяb]|[иiu]|[аa][\W_]*[сsc][\W_]*[ьb])|(?:[сsc][\W_]*[тt][\W_]*|[лl][\W_]*[иiu][\W_]*[вbv][\W_]*|[чтtc][\W_]*)?(?:[аa][\W_]*я|[оo0][\W_]*[йемejm]|[ыi][\W_]*[хйеejxh]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[иiu][\W_]*[еe]|[оo0][\W_]*[мm][\W_]*[уyu]|[иiu][\W_]*[йj]|[еe][\W_]*[вbv]|[иiu][\W_]*[мm](?:[\W_]*[иiu])?))))|[рpr][\W_]*[ьb]))|я[\W_]*[бb6](?:[\W_]*[оеёаиуeioyau0])?(?:(?:[\W_]*[нhn](?:[\W_]*[нhn])?[\W_]*[яуаиьiybau]?)?(?:(?:[\W_]*(?:[иеeiu]ш[\W_]*[ьb][\W_]*[сsc][\W_]*я|[тt][\W_]*(?:[ьb][\W_]*[сsc][\W_]*я|[ьb]|[еe][\W_]*[сsc][\W_]*[ьb]|[еe]|[иiu][\W_]*[нhn][\W_]*[уыеаeyiau])|(?:щ[\W_]*(?:[иiu][\W_]*[йj]|[аa][\W_]*я|[иеeiu][\W_]*[еe]|[еe][\W_]*[гrg][\W_]*[оo0])|ю[\W_]*[тt])(?:[\W_]*[сsc][\W_]*я)?|[еe][\W_]*[мтmt]|[кk](?:[\W_]*[иаiau])?|[аa][\W_]*[лl](?:[\W_]*[сsc][\W_]*я)?|[лl][\W_]*(?:[аa][\W_]*[нhn]|[оаoa0](?:[\W_]*[мm])?|(?:[иiu][\W_]*)?[сsc][\W_]*[ьяb]|[иiu])|[рpr][\W_]*[ьb]|[сsc][\W_]*[яьb]|[нhn][\W_]*[оo0]|[чc][\W_]*(?:[иiu][\W_]*[хxh]|[еe][\W_]*[сsc][\W_]*[тt][\W_]*[ьиibu](?:[\W_]*ю)?)|(?:[тt][\W_]*[еe][\W_]*[лl][\W_]*[ьb][\W_]*[сsc][\W_]*[кk][\W_]*|[сsc][\W_]*[тt][\W_]*|[лl][\W_]*[иiu][\W_]*[вbv][\W_]*|[чтtc][\W_]*)?(?:[аa][\W_]*я|[оo0][\W_]*[йемejm]|[ыi][\W_]*[хйеejxh]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[иiu][\W_]*[еe]|[оo0][\W_]*[мm][\W_]*[уyu]|[иiu][\W_]*[йj]|[еe][\W_]*[вbv]|[иiu][\W_]*[мm](?:[\W_]*[иiu])?)|[чмйилijlmcu]))|(?:[\W_]*[нhn](?:[\W_]*[нhn])?[\W_]*[яуаиьiybau]?)))|я[\W_]*[бb6][\W_]*(?:[еёаиуeiyau][\W_]*)?(?:[нhn][\W_]*(?:[нhn][\W_]*)?(?:[яуаиьiybau][\W_]*)?)?[тt])',
        '\w*[вbv][\W_]*([ыиiu]+[\W_]*[еёe]+[\W_]*[бb6][\W_]*[аоoa0][\W_]*[нhn])\w*',
        '([сsc]|[оo0][\W_]*[бb6])[\W_]*[ьъb][\W_]*[еяёe][\W_]*[бb6][\W_]*(?:([уyu]|[оo0][\W_]*[сз3szc])|(?:[еиёауeiyau](?:[\W_]*[лl](?:[\W_]*[иоаioau0])?|[\W_]*ш[\W_]*[ьb]|[\W_]*[тt][\W_]*[еe])?(?:[\W_]*[сsc][\W_]*[ьяb])?))',
        '[еe][\W_]*(?:[бb6][\W_]*(?:[уyu][\W_]*[кk][\W_]*[еe][\W_]*[нhn][\W_]*[тt][\W_]*[иiu][\W_]*[йj]|[еe][\W_]*[нhn][\W_]*(?:[ьb]|я(?:[\W_]*[мm])?)|[иiu][\W_]*(?:[цc][\W_]*[кk][\W_]*[аa][\W_]*я|[чc][\W_]*[еe][\W_]*[сsc][\W_]*[кk][\W_]*[аa][\W_]*я)|[лl][\W_]*[иiu][\W_]*щ[\W_]*[еe]|[аa][\W_]*(?:[лl][\W_]*[ьb][\W_]*[нhn][\W_]*[иiu][\W_]*[кk](?:[\W_]*[иаiau])?|[тt][\W_]*[оo0][\W_]*[рpr][\W_]*[иiu][\W_]*[йj]|[нhn][\W_]*(?:[тt][\W_]*[рpr][\W_]*[оo0][\W_]*[пnp]|[аa][\W_]*[тt][\W_]*[иiu][\W_]*(?:[кk]|[чc][\W_]*[еe][\W_]*[сsc][\W_]*[кk][\W_]*[иiu][\W_]*[йj]))))|[дd][\W_]*[рpr][\W_]*[иiu][\W_]*[тt])',
        '[нhn][\W_]*[еe][\W_]*[вbv][\W_]*[рpr][\W_]*[оo0][\W_]*[тt][\W_]*ъ[\W_]*[еe][\W_]*[бb6][\W_]*[аa][\W_]*[тt][\W_]*[еe][\W_]*[лl][\W_]*[ьb][\W_]*[сsc][\W_]*[кk][\W_]*[иiu][\W_]*(?:[ыиiu][\W_]*[йj]|[аa][\W_]*я|[оo0][\W_]*[ейej]|[ыi][\W_]*[хxh]|[ыi][\W_]*[еe]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu])',
        '[уyu][\W_]*(?:[ёеe][\W_]*[бb6][\W_]*(?:[иiu][\W_]*щ[\W_]*[еаea]|[аa][\W_]*[нhn](?:[\W_]*[тt][\W_]*[уyu][\W_]*[сsc])?(?:[\W_]*[аоoa0][\W_]*[вмbmv]|[\W_]*[ыуеаeyiau])?)|[рpr][\W_]*[оo0][\W_]*[дd](?:[\W_]*[аоoa0][\W_]*[вмbmv]|[\W_]*[ыуеаeyiau])?|[бb6][\W_]*[лl][\W_]*ю[\W_]*[дd][\W_]*(?:[оo0][\W_]*[кk]|[кk][\W_]*(?:[аоoa0][\W_]*[вмbmv](?:[\W_]*[иiu])?|[иуеаeiyau])?))',
        '[мm][\W_]*(?:[уyu][\W_]*[дd][\W_]*(?:[оo0][\W_]*[хxh][\W_]*[аa][\W_]*(?:[тt][\W_]*[ьb][\W_]*[сsc][\W_]*я|ю[\W_]*[сsc][\W_]*[ьb]|[еe][\W_]*ш[\W_]*[ьb][\W_]*[сsc][\W_]*я)|[аa][\W_]*(?:[кk](?:[\W_]*[иаiau]|[оo0][мвbmv])?|[чc][\W_]*(?:[ьb][\W_]*[еёe]|[иiu][\W_]*[нhn][\W_]*[уыаyiau]|[кk][\W_]*(?:[аиеуeiyau]|[оo0][\W_]*[йj])))|[еe][\W_]*[нhn][\W_]*[ьb]|[иiu][\W_]*[лl](?:[\W_]*[аеоыeoia0]?))|[аa][\W_]*[нhn][\W_]*[дd][\W_]*[уаyau]|[лl][\W_]*(?:[иiu][\W_]*[нhn]|я))',
        '(?:[мm][\W_]*(?:[оo0][\W_]*[з3z][\W_]*[гrg]|[уyu][\W_]*[дd])|[дd][\W_]*(?:[оo0][\W_]*[лl][\W_]*[бb6]|[уyu][\W_]*[рpr])|[сsc][\W_]*[кk][\W_]*[оo0][\W_]*[тt])[\W_]*[аоoa0][\W_]*(?:[хxh][\W_]*[уyu][\W_]*[ийяiju]|[ёеe][\W_]*[бb6](?:[\W_]*[еоeo0][\W_]*[вbv]|[\W_]*[ыаia]|[\W_]*[сsc][\W_]*[тt][\W_]*[вbv][\W_]*[оуoy0u](?:[\W_]*[мm])?|[иiu][\W_]*[з3z][\W_]*[мm])?)',
        '(?:[нhn][\W_]*[еe][\W_]*|[з3z][\W_]*[аa][\W_]*|[оo0][\W_]*[тt][\W_]*|[пnp][\W_]*[оo0][\W_]*|[нhn][\W_]*[аa][\W_]*|[рpr][\W_]*[аa][\W_]*[сз3szc][\W_]*)?(?:[пnp][\W_]*[иiu][\W_]*[з3z][\W_]*[дd][\W_]*[ияеeiu]|(?:ъ)?[еёe][\W_]*[бb6][\W_]*[аa])[\W_]*(?:(?:([тt][\W_]*[ьb]|[лl])[\W_]*[сsc][\W_]*я|[тt][\W_]*[ьb]|[лl][\W_]*[иiu]|[аa][\W_]*[лl]|[лl]|c[\W_]*[ьb]|[иiu][\W_]*[тt]|[иiu]|[тt][\W_]*[еe]|[чc][\W_]*[уyu]|ш[\W_]*[ьb])|(?:[йяиiju]|[иеeiu][\W_]*[мm](?:[\W_]*[иiu])?|[йj][\W_]*[сsc][\W_]*(?:[кk][\W_]*(?:[ыиiu][\W_]*[йеej]|[аa][\W_]*я|[оo0][\W_]*[еe]|[ыi][\W_]*[хxh]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu])|[тt][\W_]*[вbv][\W_]*[оуаoya0u](?:[\W_]*[мm])?)))',
        '[пnp][\W_]*[еиыeiu][\W_]*[дd][\W_]*[аеэоeoa0][\W_]*[рpr](?:(?:[\W_]*[аa][\W_]*[сз3szc](?:(?:[\W_]*[тt])?(?:[\W_]*[ыi]|[\W_]*[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?|[\W_]*[кk][\W_]*[аиiau])?|(?:[\W_]*[ыуаеeyiau]|[\W_]*[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?|[\W_]*[оo0][\W_]*[вbv])))|[\W_]*(?:[ыуаеeyiau]|[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?|[оo0][\W_]*[вbv]|[нhn][\W_]*я))?',
        '[пnp][\W_]*[иiu][\W_]*[з3z][\W_]*(?:[ьb][\W_]*)?[дd][\W_]*(?:[ёеe][\W_]*(?:[нhn][\W_]*[ыi][\W_]*ш(?:[\W_]*[ьb])?|[шнжhn](?:[\W_]*[ьb])?)|[уyu][\W_]*(?:[йj](?:[\W_]*[тt][\W_]*[еe])?|[нhn](?:[\W_]*[ыi])?)|ю[\W_]*(?:[кk](?:[\W_]*(?:[аеуиeiyau]|[оo0][\W_]*[вbv]|[аa][\W_]*[мm](?:[\W_]*[иiu])?))?|[лl](?:[ьиibu]|[еe][\W_]*[йj]|я[\W_]*[хмmxh]))|[еe][\W_]*[цc]|[аоoa0][\W_]*(?:[нhn][\W_]*[уyu][\W_]*)?[тt][\W_]*(?:[иiu][\W_]*[йj]|[аa][\W_]*я|[оo0](?:[\W_]*[ейej])?|[ыi][\W_]*[ейхejxh]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu]|[еe][\W_]*[еe]|[ауьеыeyibau])|[аa][\W_]*[нhn][\W_]*[уyu][\W_]*[лl](?:[\W_]*[аиiau])?|[ыеуиаeiyau]|[оаoa0][\W_]*(?:[йj]|[хxh][\W_]*[уyu][\W_]*[йj]|[еёe][\W_]*[бb6]|(?:[рpr][\W_]*[оo0][\W_]*[тt]|[гrg][\W_]*[оo0][\W_]*[лl][\W_]*[оo0][\W_]*[вbv])[\W_]*(?:[ыиiu][\W_]*[йj]|[аa][\W_]*я|[оo0][\W_]*[ейej]|[ыi][\W_]*[хxh]|[ыi][\W_]*[еe]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu])|[бb6][\W_]*(?:[рpr][\W_]*[аa][\W_]*[тt][\W_]*[иiu][\W_]*я|[оo0][\W_]*[лl](?:[\W_]*[аыуyiau])?)))',
        '[пnp][\W_]*(?:[аa][\W_]*[дd][\W_]*[лl][\W_]*[аоыoia0]|[оаoa0][\W_]*[сsc][\W_]*[кk][\W_]*[уyu][\W_]*[дd][\W_]*(?:[ыуаеeyiau]|[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?)|[иеeiu][\W_]*[дd][\W_]*(?:[иiu][\W_]*[кk]|[рpr][\W_]*[иiu][\W_]*[лl](?:[\W_]*[лl])?)(?:[\W_]*[оаoa0][\W_]*[мвbmv]|[\W_]*[иуеоыаeioyau0])?|[рpr][\W_]*[оo0][\W_]*[бb6][\W_]*[лl][\W_]*я[\W_]*[дd][\W_]*[оo0][\W_]*[мm])',
        '(?:[з3z][\W_]*[аa][\W_]*|[оo0][\W_]*[тt][\W_]*|[нhn][\W_]*[аa][\W_]*)?[сsc][\W_]*[рpr][\W_]*(?:[аa][\W_]*[тt][\W_]*[ьb]|[аa][\W_]*[лl](?:[\W_]*[иiu])?|[eуиiyu])',
        '[сsc][\W_]*[рpr][\W_]*[аa][\W_]*(?:[кk][\W_]*(?:[аеиуeiyau]|[оo0][\W_]*[йj])|[нhn](?:[\W_]*[нhn])?(?:[ьb]|(?:[\W_]*[ыi][\W_]*[йеej]|[\W_]*[аa][\W_]*я|[\W_]*[оo0][\W_]*[еe]))|[лl][\W_]*[ьb][\W_]*[нhn][\W_]*[иiu][\W_]*[кk](?:[\W_]*[иiu]|[\W_]*[оаoa0][\W_]*[мm])?)',
        '(?:[з3z][\W_]*[аa][\W_]*)?[тt][\W_]*[рpr][\W_]*[аa][\W_]*[хxh][\W_]*(?:[нhn][\W_]*(?:[уyu](?:[\W_]*[тt][\W_]*[ьb](?:[\W_]*[сsc][\W_]*я)?|[\W_]*[сsc][\W_]*[ьb]|[\W_]*[лl](?:[\W_]*[аиiau])?)?|[еиeiu][\W_]*ш[\W_]*[ьb][\W_]*[сsc][\W_]*я)|[аa][\W_]*(?:[лl](?:[\W_]*[аоиioau0])?|[тt][\W_]*[ьb](?:[\W_]*[сsc][\W_]*я)?|[нhn][\W_]*(?:[нhn][\W_]*)?(?:[ыиiu][\W_]*[йj]|[аa][\W_]*я|[оo0][\W_]*[йеej]|[ыi][\W_]*[хxh]|[ыi][\W_]*[еe]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu])))',
        '(?:[нhn][\W_]*[иеeiu][\W_]*|[пnp][\W_]*[оo0][\W_]*|[нhn][\W_]*[аa][\W_]*|[оаoa0][\W_]*(?:[тt][\W_]*)?|[дd][\W_]*[аоoa0][\W_]*|[з3z][\W_]*[аa][\W_]*)?(?:(?:[хxh][\W_]*(?:[еиeiu][\W_]*(?:[йj][\W_]*)?[рpr]|[уyu](?:[\W_]*[йj])?))(?:[\W_]*[еоёeo0][\W_]*[вbv](?:[\W_]*[аa][\W_]*ю[\W_]*щ|[\W_]*ш)?)?(?:[\W_]*[аиеeiau][\W_]*[лнlhn])?(?:[нhn])?(?:[\W_]*(?:[иаоёяыеeioau0][юяиевмйbeijmvu]|я[\W_]*(?:[мm](?:[\W_]*[иiu])?|[рpr][\W_]*(?:ю|[иiu][\W_]*(?:[тt](?:[\W_]*[ьеeb][\W_]*[сsc][\W_]*[яьb])?|[лl](?:[\W_]*[иоаioau0])?))|[чc][\W_]*(?:[аиiau][\W_]*[тt](?:[\W_]*[сsc][\W_]*я)|[иiu][\W_]*[лl](?:[\W_]*[иоаioau0])?)|[чc](?:[\W_]*[ьb])?)|[еe][\W_]*(?:[тt][\W_]*(?:[оo0][\W_]*[йj]|[аьуybau])|[еe][\W_]*(?:[тt][\W_]*[еe]|ш[\W_]*[ьb]))|[аыоуяюйиijoyau0]|[лl][\W_]*[иоiou0]|[чc][\W_]*[уyu])))',
        '(?:[хxh][\W_]*(?:[еиeiu][\W_]*(?:[йj][\W_]*)?[рpr]|[уyu][\W_]*[йj]))',
        '[хxh][\W_]*[уyu][\W_]*(?:[еёиeiu][\W_]*(?:[сsc][\W_]*[оo0][\W_]*[сsc]|[пnp][\W_]*[лl][\W_]*[еe][\W_]*[тt]|[нhn][\W_]*[ыi][\W_]*ш)(?:[\W_]*[аыуyiau]|[\W_]*[оаoa0][\W_]*[мm](?:[\W_]*[иiu])?|[нhn][\W_]*(?:[ыиiu][\W_]*[йj]|[аa][\W_]*я|[оo0][\W_]*[йеej]|[ыi][\W_]*[хxh]|[ыi][\W_]*[еe]|[ыi][\W_]*[мm](?:[\W_]*[иiu])?|[уyu][\W_]*ю|[оo0][\W_]*[мm][\W_]*[уyu]))?|[дd][\W_]*[оo0][\W_]*ё[\W_]*[бb6][\W_]*[иiu][\W_]*[нhn][\W_]*(?:[оo0][\W_]*[йj]|[аеыуeyiau]))',
        '[бb6][\W_]*[лl][\W_]*(я|[еe][аa])(?:[\W_]*[дтdt][ьъ]?[\W_]*(?:[ьb]|[иiu]|[кk][\W_]*[иiu]|[сsc][\W_]*[тt][\W_]*[вbv][\W_]*[оo0]|[сsc][\W_]*[кk][\W_]*(?:[оo0][\W_]*[ейej]|[иiu][\W_]*[еe]|[аa][\W_]*я|[иiu][\W_]*[йj]|[оo0][\W_]*[гrg][\W_]*[оo0])))?',
        '[вbv][\W_]*[ыi][\W_]*[бb6][\W_]*[лl][\W_]*я[\W_]*[дd][\W_]*(?:[оo0][\W_]*[кk]|[кk][\W_]*(?:[иуаеeiyau]|[аa][\W_]*[мm](?:[\W_]*[иiu])?))',
        '(?:[з3z][\W_]*[аоoa0][\W_]*)(?:[пnp][\W_]*[аоoa0][\W_]*[дd][\W_]*[лl][\W_]*[оыаoia0]|[лl][\W_]*[уyu][\W_]*[пnp][\W_]*(?:[оo0][\W_]*[йj]|[аеыуeyiau]))',
        'ш[\W_]*[лl][\W_]*ю[\W_]*[хxh][\W_]*(?:[ауеиeiyau]|[оo0][\W_]*[йj])',
        '[аa][\W_]*[нhn][\W_]*[уyu][сsc](?:[\W_]*[еаыуeyiau]|[\W_]*[оo0][\W_]*[мm])?',
        'г[ао]вн.*|g[ao]vn.*'
    ];
    AbusePrevent.filterNumber = 3;
    AbusePrevent.filterName = 'Обсценная лексика';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        for ( var o = 0; o < obscene.length; o ++ ) {
            if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                    function (a) { return a.match(new RegExp(obscene[o], 'gi')) === null },
                    function (b) { return b.match(new RegExp(obscene[o], 'gi')) !== null }
            )) {
                AbusePrevent.truncheon.rollback(oldid);
                // AbusePrevent.truncheon.block();  // temporary disabled
                return AbusePrevent.done(3);
            }
        }
    }
    // filter 4
    AbusePrevent.filterNumber = 4;
    AbusePrevent.filterName = 'Морфологическая деструкция';
    if (AbusePrevent.diffBase.properties.marker !== false) {
        if (AbusePrevent.diffBase.properties.marker == 'изменение подтверждённого морфемного разбора') {
            AbusePrevent.truncheon.rollback(oldid);
            return AbusePrevent.done(4);
        }
    }
    // filter 5
    AbusePrevent.filterNumber = 5;
    AbusePrevent.filterName = 'Вандализм устойчивых выражений';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        if (dff[j].common_locus == 'phrases') {
            AbusePrevent.truncheon.rollback(oldid);
            // AbusePrevent.truncheon.block();  // temporary disabled
            return AbusePrevent.done(5);
        }
    }
    // filter 6
    AbusePrevent.filterNumber = 6;
    AbusePrevent.filterName = 'Неоформленный шаблон Википедии';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        console.log(dff[j]);
        if (AbusePrevent.diffFuncs.diffPlainMatch(dff[j],
                function (a) {
                    return true
                },
                function (b) {
                    return b.match(/\{\{[Вв]икипедия\|/g).length > 0
                }
        )) {
            AbusePrevent.truncheon.correct(function (c) {
                return c.replace(/\{\{[Вв]икипедия\|[^\}]+\}\}/g, '{{википедия}}');
            });
            return AbusePrevent.done(6);
        }
    }
    // filter 7
    AbusePrevent.filterNumber = 7;
    AbusePrevent.filterName = 'Вандализм этимологии';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        if (dff[j].common_locus == 'etymology') {
            AbusePrevent.truncheon.rollback(oldid);
            // AbusePrevent.truncheon.block();  // temporary disabled
            return AbusePrevent.done(7);
        }
    }
    // filter 8
    AbusePrevent.filterNumber = 8;
    AbusePrevent.filterName = 'Проблемы при редактировании нижней части статьи';
    var dff = AbusePrevent.diffBase.changes;
    for ( var j = 0; j < dff.length; j ++ ) {
        if (dff[j].common_locus == 'bottom') {
            AbusePrevent.truncheon.rollback(oldid);
            return AbusePrevent.done(8);
        }
    }
    return AbusePrevent.done(0);
};
AbusePrevent.diffFuncs.getByLocus = function (locus) {
    AbusePrevent.returnedDiffs = new Array();
    for ( var i = 0; i < AbusePrevent.diffBase.changes.length; i ++ ) {
        if (AbusePrevent.diffBase.changes[i].common_locus == locus) {
            AbusePrevent.returnedDiffs.push(AbusePrevent.diffBase.changes[i]);
        }
    }
    return AbusePrevent.returnedDiffs;
};
AbusePrevent.diffFuncs.diffPlainMatch = function (diff, part1_func, part2_func) {
    try {
        if ( part1_func(diff.plain_text[0] !== null ? diff.plain_text[0] : '')
        && part2_func(diff.plain_text[1] !== null ? diff.plain_text[1] : '')
        ) {
            return true;
        }
    } catch (e) { return false; }
    return false;
};
AbusePrevent.truncheon = new Object();
AbusePrevent.truncheon.messages = new Object();
AbusePrevent.truncheon.messages.sign = '[[User talk:Lingüista/AbusePrevent.js|AbusePrevent]]: автоматический ';
AbusePrevent.truncheon.messages.rollback = function () {
    return AbusePrevent.truncheon.messages.sign + 'автоматический откат некорректной правки';
};
AbusePrevent.truncheon.messages.block = function () {
    return AbusePrevent.truncheon.messages.sign + 'автоматическая блокировка нарушителя';
};
AbusePrevent.truncheon.messages.correct = function () {
    return AbusePrevent.truncheon.messages.sign + 'автоматическая коррекция неоформленной правки, код ' + AbusePrevent.filterNumber;
};
AbusePrevent.truncheon.messages.protect = function () {
    return AbusePrevent.truncheon.messages.sign + 'автоматическая защита затронутой страницы';
};
AbusePrevent.truncheon.protect = function () {
    try {
        var page = AbusePrevent.diffBase.properties.title;
    } catch (e) { return; }
    $.get('/w/api.php?action=query&meta=tokens&format=json', function(data) {
        $.post('/w/api.php', {
            action: 'protect',
            title: AbusePrevent.diffBase.properties.title,
            protections: AbusePrevent.settings.defaultProtectionType,
            expiry: '3 hours',
            reason: AbusePrevent.truncheon.messages.protect(),
            token: data.query.tokens.csrftoken
        });
    });
};
AbusePrevent.truncheon.correct = function (correct_func) {
    // todo: possibility of using oldid raw for correction
    $.get('/wiki/' + encodeURIComponent(AbusePrevent.diffBase.properties.title) + '?action=raw', function (data) {
        $.post('/w/api.php', {
            action: 'edit',
            title: AbusePrevent.diffBase.properties.title,
            summary: AbusePrevent.truncheon.messages.correct(),
            text: correct_func(data),
            token: mw.user.tokens.get('editToken')
        });
    });
};
AbusePrevent.truncheon.rollback = function (oldid) {
    $.get('/w/index.php', {
        action: 'edit',
        oldid: oldid
    }, function (data) {
        AbusePrevent.requestedValue = $(data).find('#wpTextbox1').val();
        $.post('/w/api.php', {
            action: 'edit',
            title: $(data).find('#firstHeading').text().substr(16),
            summary: AbusePrevent.truncheon.messages.rollback() + ', фильтр ' + AbusePrevent.filterNumber,
            text: AbusePrevent.requestedValue,
            token: mw.user.tokens.get('editToken')
        });
    });
};
AbusePrevent.truncheon.block = function () {
    try {
        var user = AbusePrevent.diffBase.properties.user;
    } catch (e) { return; }
    $.get('/w/api.php?action=query&meta=tokens&format=json', function(data) {
        $.post('/w/api.php', {
            action: 'block',
            user: user,
            expiry: AbusePrevent.settings.defaultBlockExpiry,
            reason: AbusePrevent.truncheon.messages.block(),
            nocreate: 1,
            noemail: 1,
            token: data.query.tokens.csrftoken
        });
    });
};
AbusePrevent.htmlDiff = function (data, oldSource) {
    if (arguments.length > 2) AbusePrevent.hook = arguments[2]
    else AbusePrevent.hook = function () {};
    AbusePrevent.diff = $(data);
    AbusePrevent.diffColumn = AbusePrevent.diff.find('.diff-contentalign-left tbody');
    AbusePrevent.diffStrSplit = new RegExp (
        '<tr>.*\n.+diff-lineno">.+\n.+diff-lineno.+\n.*<\/tr>.*'
    ,'g');
    AbusePrevent.diffLineTags = AbusePrevent.diff.find('.diff-lineno');
    AbusePrevent.diffLines = new Array();
    for ( var a = 0; a < AbusePrevent.diffLineTags.length; a += 2 ) {
        AbusePrevent.diffLines.push (
            Number ( $(AbusePrevent.diffLineTags[a]).text().match(/\d+/)[0] )
        );
    }
    AbusePrevent.diffBase = new Object();
    AbusePrevent.diffBase.properties = new Object();
    AbusePrevent.diffBase.changes = new Array();
    if (AbusePrevent.diff.find('#mw-diff-ntitle2').length > 0) {
    /* ---------------------- */
    AbusePrevent.diffBase.properties.title = AbusePrevent.diff.find('#firstHeading').text().substr(25).replace(/.$/, '');
    if (AbusePrevent.diffBase.properties.title.match(/^[А-ЯЁЙ][а-яёй]+:/g, AbusePrevent.diffBase.properties.title)) {
        AbusePrevent.diffBase.properties.namespace = AbusePrevent.diffBase.properties.title.match(/^[А-ЯЁЙ][а-яёй]+/g)[0];
    } else AbusePrevent.diffBase.properties.namespace = 0;
    AbusePrevent.diffBase.properties.user = AbusePrevent.diff.find('#mw-diff-ntitle2 a bdi').text();
    AbusePrevent.diffBase.properties.date = AbusePrevent.diff.find('#mw-diff-ntitle1 strong')
    AbusePrevent.diffBase.properties.date = AbusePrevent.diffBase.properties.date.text().replace(/^Версия\s|\s\(.+$/g, '');
    AbusePrevent.diffBase.properties.summary = AbusePrevent.diff.find('#mw-diff-ntitle3 .comment').text().replace(/^[\(\)]|[\(\)]$/g, '');
    if ($('.mw-tag-marker').length > 0) {
        AbusePrevent.diffBase.properties.marker = $('.mw-tag-marker').text()
    } else AbusePrevent.diffBase.properties.marker = false;
    if (AbusePrevent.diff.find('#differences-nextlink').length > 0) {
        return AbusePrevent.done(0);
    }
    /* ---------------------- */
    }
    AbusePrevent.diffStrings = AbusePrevent.diffColumn.html().split(AbusePrevent.diffStrSplit).slice(1);
    AbusePrevent.locusField = AbusePrevent.extractLoci(oldSource);
    for ( var i = 0; i < AbusePrevent.diffStrings.length; i ++ ) {
        AbusePrevent.diffString = AbusePrevent.diffStrings[i];
        AbusePrevent.stringColumns = $(AbusePrevent.diffString);
        for ( var j = 0; j < AbusePrevent.stringColumns.length; j += 2 ) {
            AbusePrevent.sch = $(AbusePrevent.stringColumns[j]).html();
            if (AbusePrevent.sch === undefined) break;
            if ( AbusePrevent.sch.match('<td class="diff-marker">&nbsp;</td>') ) {
                AbusePrevent.diffBase.changes.push (
                    {
                        plain_text: [null, null],
                        removed_parts: null,
                        added_parts: null,
                        ra_pairs: null,
                        common_line: AbusePrevent.diffLines[i],
                        common_locus: AbusePrevent.determineLocus (
                            AbusePrevent.locusField,
                            AbusePrevent.diffLines[i]
                        )
                    }
                );
            }
            else if (
                !AbusePrevent.sch.match('<td class="diff-marker">&nbsp;</td>') 
                && AbusePrevent.sch.match(/<td class="diff-marker">[−+]<\/td>/g).length == 1
            ) {
                AbusePrevent.lonelySign = AbusePrevent.sch.match(/<td class="diff-marker">[−+]<\/td>/g)[0]
                AbusePrevent.lonelySign = AbusePrevent.lonelySign.replace('<td class="diff-marker">', '')[0]
                AbusePrevent.scannedClass = AbusePrevent.lonelySign == '+' ? '.diff-addedline' : '.diff-deletedline';
                AbusePrevent.addedText = $(AbusePrevent.stringColumns[j]).find(AbusePrevent.scannedClass).text();
                AbusePrevent.diffBase.changes.push (
                    {
                        plain_text: [ null, AbusePrevent.addedText ],
                        removed_parts: null,
                        added_parts: AbusePrevent.addedText,
                        ra_pairs: new Array(['', AbusePrevent.addedText]),
                        common_line: AbusePrevent.diffLines[i],
                        common_locus: AbusePrevent.determineLocus (
                            AbusePrevent.locusField,
                            AbusePrevent.diffLines[i]
                        )
                    }
                );
            }
            else {
                AbusePrevent.dbPush = new Object();
                AbusePrevent.dbPush.plain_text = [
                    $(AbusePrevent.stringColumns[j]).find('.diff-deletedline').text(),
                    $(AbusePrevent.stringColumns[j]).find('.diff-addedline').text()
                ];
                AbusePrevent.dbPush.removed_parts = new Array();
                AbusePrevent.dbPush.added_parts = new Array();
                AbusePrevent.dbPush.ra_pairs = new Array();
                AbusePrevent.dbPush.common_line =  AbusePrevent.diffLines[i];
                AbusePrevent.dbPush.common_locus = AbusePrevent.determineLocus (
                    AbusePrevent.locusField,
                    AbusePrevent.diffLines[i]
                );
                AbusePrevent.deletedParts = $(AbusePrevent.stringColumns[j]).find('td div del.diffchange-inline');
                AbusePrevent.addedParts = $(AbusePrevent.stringColumns[j]).find('td div ins.diffchange-inline');
                for ( var q = 0; q < AbusePrevent.deletedParts.length; q ++ ) {
                    AbusePrevent.dbPush.removed_parts.push ( 
                        $(AbusePrevent.deletedParts[q]).text()
                    );
                }
                for ( var e = 0; e < AbusePrevent.addedParts.length; e ++ ) {
                    AbusePrevent.dbPush.added_parts.push ( 
                        $(AbusePrevent.addedParts[e]).text()
                    );
                }
                AbusePrevent.dbPartsMax = null;
                if (AbusePrevent.dbPush.added_parts.length > AbusePrevent.dbPush.removed_parts.length) {
                    AbusePrevent.dbPartsMax = AbusePrevent.dbPush.added_parts.length;
                } 
                else if (AbusePrevent.dbPush.added_parts.length < AbusePrevent.dbPush.removed_parts.length) {
                    AbusePrevent.dbPartsMax = AbusePrevent.dbPush.removed_parts.length;
                }
                else if (AbusePrevent.dbPush.added_parts.length == AbusePrevent.dbPush.removed_parts.length) {
                    AbusePrevent.dbPartsMax = AbusePrevent.dbPush.added_parts.length;
                }
                for ( var c = 0; c < AbusePrevent.dbPartsMax; c ++ ) {
                    AbusePrevent.dbPush.ra_pairs.push (
                        new Array (
                            (AbusePrevent.dbPush.removed_parts[c] !== undefined ? AbusePrevent.dbPush.removed_parts[c] : ""),
                            (AbusePrevent.dbPush.added_parts[c] !== undefined ? AbusePrevent.dbPush.added_parts[c] : "")
                        )
                    )
                }
                AbusePrevent.diffBase.changes.push (AbusePrevent.dbPush);
            }
        }
    }
    AbusePrevent.hook();
};
AbusePrevent.getDiff = function (from, to) {
    AbusePrevent.oldid = from;
    $.get('/w/index.php', {diff: to, oldid: from}, function (data) {
        AbusePrevent.diffData = data;
        AbusePrevent.getOldidRaw(from, AbusePrevent.htmlDiff, data);
    });
};
AbusePrevent.extractLoci = function (source) {
    AbusePrevent.sourceSplitted = source.split(/\n/g);
    AbusePrevent.extractedLoci = new Object();
    for ( var i = 0; i < AbusePrevent.sourceSplitted.length; i ++ ) {
        if ( AbusePrevent.sourceSplitted[i].match(/={2,}/g) ) {
            AbusePrevent.stitle = AbusePrevent.sourceSplitted[i].match(/={2,}[^=]+={2,}/g)[0];
            AbusePrevent.stitle = AbusePrevent.stitle.replace(/={2,}\s*|\s*={2,}/g, '');
            AbusePrevent.stitleCodes = {
                'Морфологические и синтаксические свойства' : 'morpho-syntax',
                'Произношение' : 'pronunciation',
                'Семантические свойства' : 'semantic',
                'Значение' : 'meaning',
                'Синонимы' : 'onyms',
                'Антонимы' : 'onyms',
                'Гиперонимы' : 'onyms',
                'Гипонимы' : 'onyms',
                'Родственные слова' : 'cognats',
                'Этимология' : 'etymology',
                'Фразеологизмы и устойчивые сочетания' : 'phrases',
                'Пословицы и поговорки' : 'phrases',
                'Перевод' : 'translation',
                'Библиография' : 'bottom'
            };
            AbusePrevent.stitlePriority = [
                'morpho-syntax', 'pronunciation', 'semantic', 'meaning', 'onyms', 'cognats', 'etymology',
                'phrases', 'translation', 'bottom'
            ];
            if (AbusePrevent.stitleCodes[AbusePrevent.stitle] !== undefined) {
                AbusePrevent.extractedLoci[i] = AbusePrevent.stitleCodes[AbusePrevent.stitle];
            }
        }
    }
    return AbusePrevent.extractedLoci;
};
AbusePrevent.getOldidRaw = function (oldid, hook, data_sent) {
    AbusePrevent.oldid = oldid;
    $.get('/w/api.php', {
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        format: 'json',
        revids : oldid
    }, function (data) {
        for (var id in data.query.pages) {
            //hook(data_sent, data.query.pages[id].revisions[0]['*']);
            hook(data_sent, data.query.pages[id].revisions[0]['*'], AbusePrevent.filterRules);
        }
    });
};
// TODO: if there is a {{-lang-}} separator between the locus and the diff string, the diff string should not be confused with the locus
AbusePrevent.determineLocus = function(locField, stringIndex) {
    AbusePrevent.majorIndices = new Array();
    for (var index in locField) {
        if (stringIndex >= index) {
            AbusePrevent.majorIndices.push(index);
        }
    }
    AbusePrevent.majorIndices.sort (function(a, b){
        return b - a
    });
    return locField[AbusePrevent.majorIndices[0]];
};
if ( ! window.localStorage.AbusePrevent ) {
    window.localStorage.setItem('AbusePrevent', JSON.stringify({
        done_iterations : 0,
        user_edits : {},
        affected_pages : {}
    }));
}
AbusePrevent.do_if = function (section, name, op, value, func) {
        return;
    /*if ( ['<', '==', '>', '<=', '>=', '==='].indexOf(op) === -1 ) return;
    if ( eval(
        "JSON.parse(window.localStorage.getItem('AbusePrevent'))[section][name]" + op + "value"
    )) {
        func();
    } else return;*/
};
AbusePrevent.done = function (code) {
    /*AbusePrevent.wls = JSON.parse(window.localStorage.getItem('AbusePrevent'));
    if (code !== 0) {
        var incr = function (section, name) {
            if ( ! AbusePrevent.wls[section][name] ) AbusePrevent.wls[section][name] = 1
            else AbusePrevent.wls[section][name] ++;
        };
        incr('affected_pages', AbusePrevent.diffBase.properties.title);
        incr('user_edits', AbusePrevent.diffBase.properties.user);
    }
    if ( AbusePrevent.wls.done_iterations > AbusePrevent.settings.clearStorageAfter ) {
        window.localStorage.removeItem('AbusePrevent');
    } else {
        AbusePrevent.wls.done_iterations ++;
        window.localStorage.setItem('AbusePrevent', JSON.stringify(AbusePrevent.wls));
    }*/
    AbusePreventHandler.done();
};
try {
    if (AbusePreventHandler == 1) {
        throw "AbusePrevent Fatal Error: No final function was specified!";
    }
} catch (e) {
    throw "AbusePrevent Fatal Error: No final function was specified!";
}
