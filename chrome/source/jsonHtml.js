$("#json-html-format-pretty").click(function(){
    var rowData = $("#response-row").val();

    try{
        var jsonFormatResult = format(rowData);
        if (jsonFormatResult != null && jsonFormatResult != '') {
            $("#response-row").val(jsonFormatResult);
        }
    } catch(e){
        console.warn(e)
    }

    try {
        $("#response-pretty").JSONView($("#response-row").val());
        $("#json-html-json-expand").click();
    } catch (e){
        console.warn(e);
        showErrorTip(e.message, rowData);
    }
});

$('.json-html-response-json').on('click', function() {

    var jsonStr = $("#response-row").val();
    try {
        $("#response-pretty").JSONView(jsonStr);

        changeBg("btn-default", "btn-main", "response-menu",this);
        var value = $(this).attr("crap-data-value");
        var key = $(this).attr("crap-data-name");
        $('#response-pretty').JSONView(key, value);
    }catch (e){
        console.warn(e);
        showErrorTip(e.message, jsonStr);
    }
});

var errorTip2 = "<div style='background-color:#ffdede;color:red;' class='p10'> <i class='iconfont'>&#xe6a7;</i> &nbsp;";
var errorTip = "<div style='background-color:#ffdede;color:red;' class='p10'> <i class='iconfont'>&#xe6bc;</i> &nbsp;";
var errorTipEnd = "</div>"
function showErrorTip(message, jsonStr) {
    var divErrorMsg = errorTip + message + errorTipEnd;
    if (message.indexOf("position") >0){
        try {
            var p0 = message.indexOf("position");
            var p1 = message.substr(message.indexOf("position") + 8);
            var positionNum = parseFloat($.trim(message.substr(message.indexOf("position") + 8)));

            var errorStart = jsonStr.substr(0, positionNum);

            var errorEnd = jsonStr.substr(positionNum);
            var errorEnd = errorEnd.split("\n")[0];
            if (errorEnd.length > 20){
                errorEnd = errorEnd.substr(0, 20);
            }

            var lineNum = errorStart.split("\n").length;
            var errLineText = errorStart.split("\n")[lineNum -1];
            var errLinePos = errLineText.length;

            divErrorMsg = divErrorMsg + "<br/><pre class='BGF5 r0 b0 break-word'>"  + errorStart + "</pre>";
            divErrorMsg = divErrorMsg + errorTip2 + (getText(l_jsonToolErrorTip).replace("LINE_NUM", lineNum).replace("POSITION_NUM", errLinePos)) + errorTipEnd;


            if (errLineText.length > 20){
                errLineText = "..." + errLineText.substr(errLineText.length -20, errLineText.length - 1)
            }

            var tableError = "<table><tr><td></td><td class='color-adorn'>↓</td><td></td></tr>" +
                "<tr><td>" + errLineText + "</td><td></td><td>" + errorEnd + "</td></tr></table>"

            setHtml("response-pretty", divErrorMsg + tableError);
        } catch(e){
            console.warn(e);
            setHtml("response-pretty", divErrorMsg);
        }
    } else{
        setHtml("response-pretty", divErrorMsg);
    }

}