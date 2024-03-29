//透過預設按鈕，帶入 attribute, type, value 和 note 到相對應欄位
$('button.default').on('click', function(){
    const btn = $(this);

    //取得 button 的自訂屬性 data-*
    let attribute = btn.attr('data-attribute');
    let type = btn.attr('data-type');
    let value = btn.attr('data-value');
    let note = btn.attr('data-note');

    //帶到相關應欄位中
    $('input#txt_attribute').val(attribute);
    $('input#txt_type').val(type);
    $('input#txt_value').val(value);
    $('input#txt_note').val(note);
});

//判斷 caseid, tagger, caseindex 是否都有填寫，有則開啟匯出 xml 的按鈕
$('input#txt_caseid, input#txt_tagger, input#txt_caseindex').on("keyup", function(){
    let btnExport = $('button#btnExport');

    //若是每一個 metadata 欄位的字數，各別都大於 0，就開啟匯出 xml 按鈕; 反之則關閉
    if($('input#txt_caseid').val().length > 0 && $('input#txt_tagger').val().length > 0 && $('input#txt_caseindex').val().length > 0){
        btnExport.attr('disabled', false)
    } else {
        btnExport.attr('disabled', true);
    }
});

//標註功能
$('button#btnTag').on('click', function(){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }

    let attribute = $('input#txt_attribute').val();
    let type = $('input#txt_type').val();
    let value = $('input#txt_value').val();
    let note = $('input#txt_note').val();

    $('input#txt_attribute, input#txt_type, input#txt_value, input#txt_note').val('');

    var el = document.getElementById("txtContext");
    el.focus();
    var sel = getInputSelection(el);
    el.setRangeText(`<${attribute} type="${type}" value="${value}" note="${note}">${text}</${attribute}>`, sel.start, sel.end);
});

//匯入資料
$('input#btnImport').on('change', function(evt){
    let file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        //取得檔案內文
        var text = e.target.result;

        //檢查是否為 xml document 格式
        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(text,"text/xml");
        if( xmlDoc.documentElement.nodeName != 'document' ){
            alert('請匯入正確的 xml 格式');
            return false;
        }

        //將檔案內文放到 textarea 當中
        $('textarea#txtContext').val(text);
    }
    reader.readAsText(file);
});

//匯出 xml
$('button#btnExport').on('click', function(){
    //取得 metadata 資料
    let txt_caseid = $('input#txt_caseid').val();
    let txt_tagger = $('input#txt_tagger').val();
    let txt_caseindex = $('input#txt_caseindex').val();

    //metadata 資料沒填寫完，則跳出通知
    if(txt_caseid == "" || txt_tagger == "" || txt_caseindex == ""){
        alert('請確實填寫 metadata');
        return false;
    }

    //匯入純文字資料時的處理方式
    // let strXmlTemplate = `<?xml version="1.0" encoding="UTF-8"?><document><head>`;
    // strXmlTemplate += `<caseid>${txt_caseid}</caseid><tagger>${txt_tagger}</tagger><caseindex>${txt_caseindex}</caseindex>`;
    // strXmlTemplate += `<ProsecutorName type="Pname" n="1"></ProsecutorName> <!-- 哪個地方檢察署的檢察官 n 第幾個--> <DefendantName type="Dname" n="1"></DefendantName> <!-- 被告 n 第幾個--> <LawyerName type="Lname" n="1"></LawyerName> <!-- 律師 n 第幾個--> <JudgeName type="Jname" n="1"></JudgeName> <!-- 法官 n 第幾個--> <TAGBOX> <CrimeName type="Cname" value="0" note=""></CrimeName> <!-- 罪名 note 你自己的意見--> <prison_m type="month" value="0" note=""></prison_m> <!-- 月刑期 value=幾個月 --> <CrimeR type="c57_1" value="0" note=""></CrimeR> <!-- 刑法57_1 動機目的 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_2" value="0" note=""></CrimeR> <!-- 刑法57_2 受刺激 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_3" value="0" note=""></CrimeR> <!-- 刑法57_3 手段 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_4" value="0" note=""></CrimeR> <!-- 刑法57_4 生活狀況 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_5" value="0" note=""></CrimeR> <!-- 刑法57_5 品行 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_6" value="0" note=""></CrimeR> <!-- 刑法57_6 智識程度 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_7" value="0" note=""></CrimeR> <!-- 刑法57_7 關係 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_8" value="0" note=""></CrimeR> <!-- 刑法57_8 違反義務 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_9" value="0" note=""></CrimeR> <!-- 刑法57_9 所生損害 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <CrimeR type="c57_10" value="0" note=""></CrimeR><!-- 刑法57_10 罪後態度 value=0未知未提 1偏輕 2中立 3偏重 4並存--> <agg type="c47" value="1" note=""></agg> <!-- 刑法47 累犯 value=0無 1有--> <agg type="c70" value="1" note=""></agg> <!-- 兒少70 value=0無 1有--> <agg type="c112" value="1" note=""></agg><!-- 兒少112 value=0無 1有--> <agg type="c134" value="1" note=""></agg><!-- 刑法134 公務員 value=0無 1有--> <mit type="c18_2" value="1" note=""></mit> <!-- 刑法18_2 未滿18歲 value=0無 1有--> <mit type="c18_3" value="1" note=""></mit> <!-- 刑法18_3 超80歲 value=0無 1有--> <mit type="c19_2" value="1" note=""></mit> <!-- 刑法19_2 精神障礙 value=0無 1有--> <mit type="c20" value="1" note=""></mit> <!-- 刑法20 瘖啞 value=0無 1有--> <mit type="c23" value="1" note=""></mit> <!-- 刑法23 防衛過當 value=0無 1有--> <mit type="c24_1" value="1" note=""></mit> <!-- 刑法24_1 避難過當 value=0無 1有--> <mit type="c25_2" value="1" note=""></mit> <!-- 刑法25_2 普通未遂 value=0無 1有--> <mit type="c27_1" value="1" note=""></mit> <!-- 刑法27_1 中止犯 value=0無 1有--> <mit type="c30" value="1" note=""></mit> <!-- 刑法30 幫助犯 value=0無 1有--> <mit type="c37_1" value="1" note=""></mit> <!-- 刑法37_1 無身份或特定關係 value=0無 1有--> <mit type="c59" value="1" note=""></mit> <!-- 刑法59 情堪憫恕 value=0無 1有--> <mit type="c62" value="1" note=""></mit><!-- 刑法62 自首 value=0無 1有--> <mit type="c63" value="1" note=""></mit> <!-- 刑法63 老幼處刑 value=0無 1有--> <mit type="cp14_1" value="1" note=""></mit> <!-- 證人保護法14_1 value=0無 1有--> <mit type="cp7" value="1" note=""></mit> <!-- 刑事妥速審判法第 7 條 value=0無 1有--> </TAGBOX> </head>`;
    // strXmlTemplate += `<body><CrimeR type="specialPoint" value="0" note=""></CrimeR> <!-- 本案值得注意之處 -->`;
    // let content = $('textarea#txtContext').val();
    // strXmlTemplate += content;
    // strXmlTemplate += `</body></document>`;
    // strXmlTemplate = strXmlTemplate.replace(/\n/gm, "");

    //匯入 xml 時的文字資料處理方式
    let strXML = $('textarea#txtContext').val();
    let parser = new DOMParser();
    xmlDoc = parser.parseFromString(strXML,"text/xml");
    xmlDoc.getElementsByTagName("caseid")[0].childNodes[0].nodeValue = txt_caseid;
    xmlDoc.getElementsByTagName("tagger")[0].childNodes[0].nodeValue = txt_tagger;
    xmlDoc.getElementsByTagName("caseindex")[0].childNodes[0].nodeValue = txt_caseindex;
    let strXmlTemplate = (new XMLSerializer()).serializeToString(xmlDoc);

    //去除內文的斷行
    // strXmlTemplate = strXmlTemplate.replace(/\n/gm, "");

    //判斷使用瀏覽器的平台，給不同的資料匯出 mime
    if(navigator.platform == 'Win32'){
        uriContent = "data:application/octet-stream," + encodeURIComponent(strXmlTemplate);
    } else if(navigator.platform == 'macIntel'){
        uriContent = "data:text/xml," + encodeURIComponent(strXmlTemplate);
    } else {
        uriContent = "data:application/octet-stream," + encodeURIComponent(strXmlTemplate);
    }

    //建立 a node，透過 download 屬性來下載檔案
    var link = document.createElement("a");
    link.href = uriContent;
    link.download = `${txt_caseid}.xml`;
    link.click();

    //清空 metadata 欄位值
    $('input#txt_caseid, input#txt_tagger, input#txt_caseindex').val('');
});

//取得選取文字的頭、尾位置(position)
function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
    
    //el.selectStart 跟 el.selectEnd 都是選取文字的頭跟尾的位置(string position)
    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();
        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}