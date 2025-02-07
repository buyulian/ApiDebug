function syncProject() {
    $("#float").fadeIn(300);

    var projectUniKey = getCurrentProjectUniKey();
    var modules = getLocJsonData(CRAP_DEBUG_MODULES + projectUniKey, EMPTY_ARRAY);

    for(var i=0 ; i<modules.length; i++){
        var debugs = getLocJsonData('crap-debug-interface-' + modules[i].moduleId, EMPTY_ARRAY);
        modules[i].debugs = debugs;
    }

    $.ajax({
        type : "POST",
        url : getWebSiteUrl() + "/user/crapDebug/v1/synch.do?projectUniKey=" + projectUniKey + "&plugVersion=" + PLUG_VERSION + "&defProjectName=" + getText(l_defDebugName),
        async : true,
        data : JSON.stringify(modules),
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        complete: function(responseData, textStatus){
            if(textStatus == "error"){
                alert("Status:" + responseData.status + "\nStatusText:" + responseData.statusText +"\nTextStatus: " + textStatus);
            }
            else if(textStatus == "success"){
                var responseJson = $.parseJSON(responseData.responseText);
                if( responseJson.success == 1){
                    // 删除提交的项目：项目为空，但是返回的不为空，是默认项目
                    var data = responseJson.data;

                    clearLocalStorage(projectUniKey);
                    // 清除返回的项目
                    clearLocalStorage(data.projectUniKey);

                    setCurrentProjectUniKey(data.projectUniKey, data.projectName, data.projectCover);
                    var moduleList =  data.moduleList;
                    // 存储服务器同步的数据
                    console.log("模块总数：" + moduleList.length);

                    for(var i=moduleList.length-1;i>=0; i--){
                        var resModule = moduleList[i];

                        console.log("处理模块：" + i + "（" + resModule.moduleName + "），状态：" + resModule.status);
                        if(resModule.status == -1){
                            continue;
                        }

                        saveModule(resModule.moduleName, resModule.moduleUniKey, resModule.version, resModule.status);

                        var debugs = resModule.debugs;
                        console.log("处理模块接口：" + i + "，" + resModule.moduleName + "，接口数量：" + debugs.length);

                        for(var j=debugs.length-1;j>=0;j--){
                            saveInterfaceDetail(debugs[j].moduleUniKey, debugs[j].paramType, debugs[j].uniKey,
                                debugs[j].name, debugs[j].method, debugs[j].url, debugs[j].params,
                                debugs[j].headers, debugs[j].version, debugs[j].status,
                                debugs[j].webProjectId, debugs[j].webModuleId, debugs[j].webId);
                        }
                    }

                    getLocalModules();
                    alert(getText(l_successTip),3,"success");
                    refreshSyncIco(1);
                }else{
                    alert(responseJson.error.message,5,"error");
                }
            }else{
                alert("Status:" + responseData.status + "\nStatusText:" + responseData.statusText +"\nTextStatus: " + textStatus);
            }
            $("#float").fadeOut(300);
        }
    });
}
/***************** 系统设置 *****************/
function setSetting(name, value, _this){
    // 超时时间校验
    if (name == WEB_HTTP_TIMEOUT){
        var httpTimeout = parseFloat(value);
        if (httpTimeout.toString() == "NaN" || httpTimeout < 1000) {
            _this.text(getText(l_timeoutFormatErrorTip));
            return;
        }
    }

    if (name == MENU_WIDTH){
        var menuWidth = parseFloat(value);
        if (menuWidth.toString() == "NaN" || menuWidth < 18 || menuWidth > 50) {
            _this.text(getText(l_menuWidthErrorTip));
            return;
        }
    }

    localStorage[name] = value;
    _this.addClass("btn-adorn")

    if (name == SETTING_LANGUAGE){
        _this.text(getText(l_languageChangeTip));
        return;
    }
    _this.text(getText(l_updateSuccessTip));
}

// 删除模块、接口
function clearLocalStorage(projectUniKey) {
    var modules = getLocJsonData(CRAP_DEBUG_MODULES + projectUniKey, "[]");

    for(var i=0 ; i<modules.length; i++){
        var moduleId = modules[i].moduleId;
        localStorage.removeItem('crap-debug-interface-' + moduleId);
    }
    localStorage.removeItem(CRAP_DEBUG_MODULES + projectUniKey);
}
// 导出数据
function exportData() {
  // 使用方法
  exportLocalStorageToFile(); // 这将触发下载localStorage数据的文件
}
function exportLocalStorageToFile() {
    // 收集localStorage中的所有数据
    let data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(data);
  
    // 创建一个Blob对象，其内容是上面的JSON字符串
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // 创建一个指向该Blob的URL
    const fileUrl = URL.createObjectURL(blob);
  
    // 创建一个临时的a标签用于下载
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = 'localStorageData.json'; // 指定下载文件的名称
  
    // 模拟点击下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
  
    // 清理：撤销创建的URL并移除a标签
    // URL.revokeObjectURL(fileUrl);
    // document.body.removeChild(downloadLink);
  }

/************* 插件广告 ****************/
function getAdvertisement() {
    try {
        var result = httpPost(ADVERTISEMENT, true, getAdvertisementCallback, null);
    }catch (e){
        console.error(e);
    }
}
function getAdvertisementCallback(result) {
    try {
        if (result.text && result.text != '') {
            setHtml("id-advertisement-text", result.text);
            showDiv("id-advertisement-text");
        }
        if (result.imgUrl && result.imgUrl != '') {
            setAttr("id-advertisement-img", "src", result.imgUrl);
        }
        if (result.href && result.href != '') {
            setAttr("id-advertisement-href", "href", result.href);
        }
    }catch (e){
        console.error(e);
    }
}

/********* html基本操作方法**********/
function setHtml(id, html) {
    $("#" + id).html(html);
}
function showDiv(id) {
    $("#" + id).removeClass("ndis");
}
function hiddenDiv(id) {
    $("#" + id).addClass("ndis");
}
function fadeIn(id, time) {
    $("#" + id).fadeIn(time);
}
function fadeOut(id, time) {
    $("#" + id).fadeOut(time);
}
function getAttr(id, name) {
    return $("#" + id).attr(name);
}
function setAttr(id, name, value) {
    $("#" + id).attr(name, value);
}
function getValue(id) {
    if ($("#" + id)){
        return $("#" + id).val();
    }
    return null;
}
function setValue(id, val) {
    $("#" + id).val(val);
}

function prop(id) {
    $("#" + id).prop("checked",true);
}

/********* http *******/
function httpPost(url, myAsync, callBack, callBackParams, timeOut){
    if (url.indexOf("https://") != 0 && url.indexOf("http://") != 0){
        url = getWebSiteUrl() + url;
    }

    var result;
    $.ajax({
        type: "POST",
        url: url,
        async: myAsync,
        data: true,
        timeout: timeOut ? timeOut : 3000,
        beforeSend: function (request) {
            // 通过body传递参数时后需要设置
            //request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        },
        complete: function (responseData, textStatus) {
            if (textStatus == "success") {
                var responseJson = $.parseJSON(responseData.responseText);
                result = responseJson;
                if (callBack) {
                    callBack(responseJson, callBackParams);
                }
            } else if (textStatus == "timeout") {
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"" + getText(l_netErrorTip) + "\",\"message\":\"timeout\"}}")
                if (callBack) {
                    responseJson = {};
                    responseJson.data = result;
                    callBack(responseJson, callBackParams);
                }
            }
            else {
                result = $.parseJSON("{\"success\":0,\"data\":null,\"error\":{\"code\":\"" + getText(l_unknownErrorTip) + "\",\"message\":\"" + getText(l_unknownErrorTip) +"\"}}")
                if (callBack) {
                    responseJson = {};
                    responseJson.data = result;
                    callBack(responseJson, callBackParams);
                }
            }
        }
    });
    return result;
}

var paramsTr = "<tr class='last'>";
paramsTr += "<td><input type='text' class='form-control' data-stage='key'></td>";
paramsTr += "<td><input type='text' class='form-control' data-stage='value'></td>";
paramsTr += "<td class='w20'><i class='iconfont cursor color-adorn'>&#xe69d;</i></td>";
paramsTr += "</tr>";

var moduleDiv = "<div class='panel panel-info no-radius b0 mt0 left-menu-border-top'>";
moduleDiv += "      <div class='panel-heading no-radius rel' data-parent='#modules'>";
moduleDiv += "          <div class='cursor' data-toggle='collapse' data-parent='#modules' href='#panel_ca_moduleId' crap-data='ca_moduleId'>";
moduleDiv += "              <i class='iconfont module-title-ico f16'>&#xe624;</i>&nbsp;&nbsp;  ca_moduleName";
moduleDiv += "		        <span class='more'>";
moduleDiv += "			        <i class='iconfont fr h lh40'>&#xe75f;</i>";
moduleDiv += "			        <span class='t0 h'><i class='iconfont interface-menu rename-module mt0 lh40 fr'crap-data='ca_moduleId'>&#xe69e;</i></span>";
moduleDiv += "	                <span class='t0 h'><i class='iconfont interface-menu delete-module mt0 lh40 fr' crap-data='ca_moduleId'>&#xe69d;</i></span>";
moduleDiv += "			        <span class='t0 h'><i class='iconfont interface-menu down-module  mt0 lh40 fr' crap-data='ca_moduleId'>&#xe65e;</i></span>";
moduleDiv += "			        <span class='t0 h'><i class='iconfont interface-menu up-module  mt0 lh40 fr' crap-data='ca_moduleId'>&#xe8e9;</i></span>";
moduleDiv += "		        </span>";
moduleDiv += "          </div>";
moduleDiv += "      </div>";
moduleDiv += "      <div id='panel_ca_moduleId' class='panel-collapse BGEEE collapse in'>";
moduleDiv += "          <div class='panel-body b0 p0'>";
moduleDiv += "              ca_interfaces";
moduleDiv += "           </div>";
moduleDiv += "       </div>";
moduleDiv += "   </div>";

var interfaceDiv = "<div crap-data=\"ca_interfaceInfo\" class='interface pl20 pr20 rel' title='ca_name'>";
interfaceDiv += "		<i class='iconfont ca_method'>ca_methodIcon</i>&nbsp;&nbsp;ca_name";
interfaceDiv += "		<span class='more'>";
interfaceDiv += "			<i class='iconfont fr'>&#xe75f;</i>";
interfaceDiv += "			<span class='t0 h'><i class='iconfont interface-menu delete-interface' crap-data='ca_moduleId|ca_id'>&#xe69d;</i></span>";
interfaceDiv += "			<span class='t0 h'><i class='iconfont interface-menu down-interface' crap-data='ca_moduleId|ca_id'>&#xe65e;</i></span>";
interfaceDiv += "			<span class='t0 h'><i class='iconfont interface-menu up-interface' crap-data='ca_moduleId|ca_id'>&#xe8e9;</i></span>";
interfaceDiv += "		</span>";
interfaceDiv += "	</div>";

// Custom param types
var customerTypes = ["text/plain", "application/json", "application/xml"];
var leftEnlarge = true;

function formatJson(){
    var rowData = originalResponseText;
    if( rowData == ""){
        rowData = $("#response-row").val();
    }
    if(rowData == ""){
        alert(getText(l_clickSendTip));
        return false;
    }
    try {
        $.parseJSON( rowData );
    } catch (e) {
        console.warn(e);
        alert(getText(l_responseNotJsonTip));
        return;
    }
    if( $("#response-row").hasClass("hidden") == false){
        $("#response-row").addClass("hidden");
    }
    $("#response-pretty").removeClass("none");
    $("#response-pretty").JSONView(rowData);
    return true;
}

function changeBg(removeClass, addClass, selectClass,click_button){
    $("."+selectClass).removeClass(addClass);
    $("."+selectClass).addClass(removeClass);
    $(click_button).removeClass(removeClass);
    $(click_button).addClass(addClass);
}

function hasClass(divId, cla) {
    return !($("#" + divId).hasClass(cla) == false);
}

function responseShow(showDiv){
    if( showDiv == "response-row"){
        if( $("#response-row").hasClass("hidden")){
            $("#response-row").removeClass("hidden");
        }
        if( $("#response-pretty").hasClass("none") == false){
            $("#response-pretty").addClass("none");
        }
    }else if( showDiv == "response-pretty"){
        if( $("#response-row").hasClass("hidden") == false){
            $("#response-row").addClass("hidden");
        }
        $("#response-pretty").removeClass("none");
    }

}

function getHeadersStr(){
    var headers = "";
    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                if(key.trim() != "" || val.value.trim() != ""){
                    headers += "&"+key + "=" + encodeURIComponent(val.value);
                }
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
    return headers;
}

function beforeSendHandleHeaders(request){
    if( $("#method").val() != "GET") {
        request.setRequestHeader("Content-Type", $('input:radio[name="param-type"]:checked').val());
    }

    var texts = $("#headers-div input[type='text']");
    // 获取所有文本框
    var key = "";
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage") == "value"){
                var value = val.value;
                var varList = getAllVar(getCurrentEnvId())
                for(var i = 0 ; i< varList.length; i++){
                    var variable = varList[i];
                    value = value.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
                    value = value.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);
                    key = key.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
                    key = key.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);
                }
                request.setRequestHeader(key, value);
            }else if(val.getAttribute("data-stage") == "key"){
                key = val.value;
            }
        } catch (ex) {
            console.warn(ex);
        }
    });
}

function getParams(){
    var texts = $("#params-div input[type='text']");
    var data = "";
    // 获取所有文本框
    var key = "";
    var autoFix = getAutoFix();
    $.each(texts, function(i, val) {
        try {
            if(val.getAttribute("data-stage")  == "value"){
                if( key != "") {
                    var value = val.value;
                    if (autoFix) {value = value.trim()};
                    data += "&" + key + "=" + encodeURIComponent(value);
                }
            } else if(val.getAttribute("data-stage")  == "key"){
                key = val.value;
                if (autoFix) {key = key.trim()};
            }
        } catch (ex) {
            console.warn(ex);
            alert(ex);
        }
    });
    if (data != ''){
        data = data.substr(1);
    }
    return data;
}

var originalResponseText = "";
function callAjax() {
    var originUrl = $("#url").val().trim();
    if (originUrl == ''){
        $("#response-row").val(getText(l_urlIsNullTip));
        $("#format-row").click();
        return;
    }

    if(getAutoFix() && originUrl.indexOf("http://") != 0 && originUrl.indexOf("https://") != 0 ) {
        originUrl = "http://" + originUrl;
    }

    setValue("url", originUrl);

    originalResponseText = "";
    var url = originUrl;
    var method = $("#method").val();
    var params =  getParams();
    var customerParam = ($.inArray($('input:radio[name="param-type"]:checked').val(), customerTypes) != -1);
    if(customerParam) {
        params = $("#customer-value").val();
    } else {
        // 表单参数优先url参数
        if( originUrl.indexOf("?") > 0){
            url = originUrl.split("?")[0] + "?";
            var urlParams = originUrl.split("?")[1].split("&");

            for(var i=0; i<urlParams.length; i++ ){
                if( urlParams[i] != "" && urlParams[i].indexOf("=") > 0){
                    // 参数中不存在，则使用url中的
                    if(("&" + params).indexOf("&" + urlParams[i].split("=")[0] + "=") < 0){
                        url += urlParams[i] + "&";
                    }
                } else {
                    url += urlParams[i] + "&";
                }
            }

            url = url.substr(0, url.length - 1);
        }
    }

    // 变量
    // "signType=tm_cn&storeId=%7B%7BstoreId%7D%7D&from=xlsgzt"
    var varList = getAllVar(getCurrentEnvId())
    for(var i = 0 ; i< varList.length; i++){
        var variable = varList[i];
        url = url.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
        url = url.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);

        params = params.replace(new RegExp("\\{\\{" + variable.key + "\\}\\}", "g"), variable.value);
        params = params.replace(new RegExp("%7B%7B" + variable.key + "%7D%7D", "g"), variable.value);
    }

    $("#float").fadeIn(300);

    var httpTimeout = getHttpTimeout();
    var timingTime = httpTimeout;

    // 倒计时提示
    setHtml("id-timing",(httpTimeout/1000) + ' s');
    var setTime = setInterval(function(){
        timingTime = timingTime - 1000;
        if (timingTime <= 0 && timingTime <= 0) {
            setHtml("id-timing", "")
            clearInterval(setTime);  //清除定时器
        }
        setHtml("id-timing",(timingTime/1000) + ' s')
    },1000);

    $.ajax({
        type : method,
        url : url,
        async : true,
        data : params,
        timeout: httpTimeout,
        beforeSend: function(request) {
            beforeSendHandleHeaders(request);
            $("#response-row").val("");
            $(".response-header .headers").html("");
            $(".response-header .general").html("");
            $("#response-pretty").html("");
            $(".response-cookie .table").append("");
            $("#format-row").click();
        },
        complete: function(responseData, textStatus){
            if(textStatus == "success" || (textStatus == "error" && responseData.responseText != "")){
                try{
                    originalResponseText = responseData.responseText;
                    var data = responseData.responseText;
                    $("#response-row").val(data);
                    var head = responseData.getAllResponseHeaders().toString().huanhang();
                    $(".response-header .headers").html(head);
                    var general ="Request URL: " + url +"<br>Request Method: " + method +"<br>Status Code: " + responseData.status;
                    $(".response-header .general").html(general);
                    $("#response-pretty").html("");

                    var rootDomainStr =getRootDomain(url);
                    chrome.cookies.getAll({domain: rootDomainStr}, function(cookies){
                        $(".response-cookie .table tr").empty();
                        $(".response-cookie .table").append("<tr class='fb'><td>Name</td> <td>Value</td> <td>Path</td><td>Domain</td><td>ExpirationDate</td></tr>");
                        var a =  document.createElement('a');
                        a.href = url;
                        for(i=0; i<cookies.length;i++) {
                            if( ("."+a.host).endWith(cookies[i].domain) ){
                                var cookieStr = "<tr>";
                                cookieStr += "<td class='w-p-10 break-word'>" + cookies[i].name + "</td>";
                                cookieStr += "<td class='w-p-30 break-word'>"  + cookies[i].value + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>"  + cookies[i].path + "</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].domain +"</td>";
                                cookieStr += "<td class='w-p-20 break-word'>" + cookies[i].expirationDate +"</td>";
                                cookieStr += "</tr>";
                                $(".response-cookie .table").append(cookieStr)
                            }
                        }
                    });
                }catch(e){
                    $("#format-row").click();
                }

                try {
                    $.parseJSON( data );
                    $("#json-expand").click();
                } catch (e) {
                    $("#format-row").click();
                }
            }else{
                $("#response-row").val("textStatus: " + textStatus +"\n\n" + getText(l_connectingError) + url);
                $("#format-row").click();
            }
            clearInterval(setTime);  //清除定时器
            setHtml("id-timing", "");
            $("#float").fadeOut(300);
        }
    });


    // 记录历史
    try{
        var historys;
        try{
            historys = $.parseJSON( localStorage['crap-debug-history'] );
        }catch(e){
            historys = $.parseJSON( "[]" );
        }

        if( !customerParam) {
            params = params.replace(/=/g, ":").replace(/&/g,"\n");
        }

        var h  ={"paramType": $("input[name='param-type']:checked").val(), "name": $("#interface-name").val(),"method":method, "url" : url,
            "params" : params, "headers": getHeadersStr().replace(/=/g, ":").replace(/&/g,"\n")};

        // 如果已经存在则删除
        for(var i=0; i<historys.length;i++){
            if(JSON.stringify(historys[i]) == JSON.stringify(h)){
                historys.splice(i,1);
            }
        }

        historys.unshift(h);
        // 如果历史记录>20，则删除最后一个
        if(historys.length > 20){
            historys.pop();
        }
        localStorage['crap-debug-history'] = JSON.stringify(historys);
    }catch(e){
        console.warn(e);
    }
    getHistorys();
}

function getRootDomain(url) {
    var a =  document.createElement('a');
    a.href = url;
    var hosts =a.host.split('.');
    return hosts.length ==2 ? a.host : hosts[hosts.length-2]+"."+hosts[hosts.length-1];
}

// 数据存储
function searchHistorys(key){
    var historys = getLocJsonData("crap-debug-history", "[]");
    var historysText = "";
    for(var i=0 ; i<historys.length; i++){
        var historyStr = JSON.stringify(historys[i]);
        var title =  historys[i].name;
        if( handerStr(title) == ""){
            title = handerStr(historys[i].url);
        }

        if (key != null && key !='' && historyStr.indexOf(key) < 0){
            continue;
        }

        historysText += "<div class='history-div' crap-data=\""+ encodeURIComponent(historyStr) + "\">" + title +"</div>";
    }
    $("#historys").html(historysText);
}

// 数据存储
function getHistorys(){
    searchHistorys(null)
}

function getLocalModules() {
    searchLocalModules(null);
}
// 数据存储
function searchLocalModules(key){
    // 模块对应的项目ID为 用户ID + "-debug"该项目模块下只有接口调试记录，可以共享，一个用户有且仅有一个调试目录
    var modules;
    var projectUniKey = getCurrentProjectUniKey();
    try{
        modules = $.parseJSON( localStorage[CRAP_DEBUG_MODULES + projectUniKey] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }
    var moduleText = "";
    for(var i=0 ; i<modules.length; i++){
        var module = modules[i];
        if(module.status == -1){
            continue;
        }

        var moduleName = module.moduleName;
        var moduleId = module.moduleId;

        // 第一个文件夹默认打开
        moduleText += moduleDiv.replace(/ca_moduleId/g,moduleId).replace(/ca_moduleName/g,moduleName);

        var interfaces = getLocJsonData('crap-debug-interface-' + moduleId, "[]")

        var interfaceText = "";
        for(var j=0; j<interfaces.length; j++){
            if(interfaces[j].status == -1){
                continue;
            }

            var interfaceStr = JSON.stringify(interfaces[j]);
            if (key != null && key !='' && interfaceStr.indexOf(key) < 0){
                continue;
            }

             interfaceText += interfaceDiv.replace(/ca_interfaceInfo/g,encodeURIComponent(interfaceStr))
								.replace(/ca_name/g,interfaces[j].name)
								.replace(/ca_id/g,interfaces[j].id)
								.replace(/ca_moduleId/g,interfaces[j].moduleId);

             if (interfaces[j].method == "GET"){
                 interfaceText = interfaceText.replace("ca_methodIcon","&#xe645;");
                 interfaceText = interfaceText.replace("ca_method","GET");
             } else if(interfaces[j].method == "PUT"){
                 interfaceText = interfaceText.replace("ca_methodIcon","&#xe6c4;");
                 interfaceText = interfaceText.replace("ca_method","PUT");
             } else if(interfaces[j].method == "DELETE"){
                 interfaceText = interfaceText.replace("ca_methodIcon","&#xe602;");
                 interfaceText = interfaceText.replace("ca_method","DELETE");
             }  else{
                interfaceText = interfaceText.replace("ca_methodIcon","&#xe6c4;");
                interfaceText = interfaceText.replace("ca_method","POST");
            }
        }
        moduleText = moduleText.replace("ca_interfaces", interfaceText);
    }
    $("#modules").html( moduleText );
}
/**********删除接口*********/
function deleteInterface(moduleId, id) {
    var interfaces;
    try{
        interfaces = $.parseJSON( localStorage['crap-debug-interface-' + moduleId] )
    }catch(e){
        interfaces = $.parseJSON( "[]" );
        console.warn(e);
    }

    // 如果已经存在则删除
    for(var i=0; i<interfaces.length;i++){
        if(interfaces[i].id == id){
            interfaces[i].status = -1;
            break;
        }
    }
    localStorage['crap-debug-interface-' + moduleId] = JSON.stringify(interfaces);
    refreshSyncIco(0);
    return true;
}

function deleteModule(moduleId) {
    var modules;
    try{
        modules = $.parseJSON( localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }

    // 如果已经存在则删除
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            modules[i].status = -1;
            break;
        }
    }
    localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] = JSON.stringify(modules);
    refreshSyncIco(0);
    return true;
}


function renameModule(moduleId,moduleName) {
    var modules;
    try{
        modules = $.parseJSON( localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }

    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId){
            modules[i].moduleName = moduleName;
            modules[i].version = modules[i].version + 1;
            break;
        }
    }
    localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] = JSON.stringify(modules);
    refreshSyncIco(0);
    return true;
}
function saveModule(moduleName, moduleId,version,status) {
    var modules;
    try {
        var localModules = localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()];
        if (localModules == null){
            localModules = "[]";
        }
        modules = $.parseJSON(localModules);
    } catch (e) {
        modules = $.parseJSON("[]");
        console.warn(e);
    }
    // 如果已经存在则删除
    for(var i=0; i<modules.length;i++){
        if(modules[i].moduleId == moduleId) {
            if (version == 0) {
                version = modules[i].version + 1;
            }
            modules.splice(i, 1);
        }
    }
    var m = {"moduleName": moduleName, "moduleId": moduleId,"version": version,"status":status};
    modules.unshift(m);
    localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] = JSON.stringify(modules);
    refreshSyncIco(0);
    return modules;
}
function saveInterfaceDetail(moduleId, paramType, id, name, method, url, params, headers,version,status,webProjectId,webModuleId,webId) {
    var interfaces;
    try {
        var localInterfaces = localStorage['crap-debug-interface-' + moduleId];
        if (localInterfaces == null){
            localInterfaces = "[]";
        }
        interfaces = $.parseJSON(localInterfaces);
    } catch (e) {
        interfaces = $.parseJSON("[]");
        console.warn(e);
    }
    var h = {
        "version": version,
        "paramType": paramType,
        "moduleId": moduleId,
        "id": id,
        "name": name,
        "method": method,
        "url": url,
        "params": params,
        "headers": headers,
        "version":version,
        "status":status,
        "webProjectId" : webProjectId,
        "webModuleId" : webModuleId,
        "webId" : webId
    };

    // 如果已经存在则删除
    for (var i = 0; i < interfaces.length; i++) {
        if (interfaces[i].id == h.id) {
            h.interfaceId = interfaces[i].interfaceId;
            h.status = interfaces[i].status;
            h.moduleId = interfaces[i].moduleId;
            h.webProjectId  = interfaces[i].webProjectId;
            h.webModuleId  = interfaces[i].webModuleId;
            h.webId  = interfaces[i].webId;

            if(version == 0) {
                h.version = interfaces[i].version + 1;
            }
            interfaces.splice(i, 1);
            break;
        }
    }
    interfaces.unshift(h);
    localStorage['crap-debug-interface-' + moduleId] = JSON.stringify(interfaces);
    refreshSyncIco(0);
}
// save interface and module
function saveInterface(moduleId, saveAs) {
    if( handerStr($("#url").val()) == ""){
        alert(getText(l_urlIsNullTip));
        return false;
    }
    if( handerStr($("#save-interface-name").val()) == ""){
        alert(getText(l_interfaceNameIsNullTip));
        return false;
    }

    // if moduleId is null,then create a new moduleId, but moduleName must be input
    if( handerStr($("#save-module-id").val()) == "" && handerStr(moduleId) == ""){
        var moduleName = $("#save-module-name").val();
        var allModules = getAllModules();
        for(var i=0; i< allModules.length;i++){
            if(handerStr(allModules[i].moduleName) == handerStr(moduleName)){
                moduleId = allModules[i].moduleId;
                break;
            }
        }

        if (handerStr(moduleId) == ""){
            moduleId = "ffff-"+new Date().getTime() + "-" + random(10);
            if( handerStr(moduleName) == ""){
                alert(getText(l_moduleNameIsNullTip));
                return;
            }
            // save module
            saveModule(moduleName, moduleId, 0, 1);
        }

    }else{
        if( handerStr(moduleId) == "" ){
            moduleId = $("#save-module-id").val();
        }
    }

    // if interfaceId is null, meaning it's a new interface,should create a id
    // if id is not null, but saveAs is true,meaning should create a new interface base on the current interface,so id should be created
    var id = $("#interface-id").val();
    if( handerStr(id) == "" || saveAs){
        id = new Date().getTime() + "-" + random(10);
    }

    var method = $("#method").val();
    var params =  getParams();

    // if params submit by form, then should format params, else mean param is custom and nothing need to do
    // as:
    // a:666
    // b:777
    var paramType = $('input:radio[name="param-type"]:checked').val();
    if(  $.inArray(paramType, customerTypes) == -1) {
        params = params.replace(/=/g, ":").replace(/&/g,"\n");
    }else{
        params = $("#customer-value").val();
    }

    var headers = getHeadersStr().replace(/=/g, ":").replace(/&/g,"\n");
    var paramType = "";
    if(method != "GET"){
        paramType = $("input[name='param-type']:checked").val()
    }

    var name = $("#save-interface-name").val();
    var url = $("#url").val();
    saveInterfaceDetail(moduleId, paramType, id, name, method, url, params, headers, 0, 1, null, null, null);
    closeMyDialog("dialog");
    getLocalModules();
    return true;
}

function intitSaveInterfaceDialog(){
    $("#save-interface-name").val($("#interface-name").val());
    // 循环获取所有module
    var modules;
    try{
        modules = $.parseJSON( localStorage[CRAP_DEBUG_MODULES + getCurrentProjectUniKey()] )
    }catch(e){
        modules = $.parseJSON( "[]" );
        console.warn(e);
    }
    $("#save-module-id").find("option").remove();
    $("#save-module-id").append("<option value='-1'>--" + getText(l_selectModuleTip) + "--</option>");
    for(var i=0 ; i<modules.length; i++) {
        if(modules[i].status != -1) {
            $("#save-module-id").append("<option value='" + modules[i].moduleId + "'>" + modules[i].moduleName + "</option>");
        }
    }
    openDialog(getText(l_saveInterface) + $("#interface-name").val(),500);
}

/****状态码转提示*************/
function getErrorTip(status){
	if(status == 404){
		return "-ERR_FILE_NOT_FOUND: 没有找到文件!";
	}
	if(status == 500){
		return "";
	}
}
/**********打开Dialog******************/
function openDialog(title,iwidth){
    if(!iwidth){
        iwidth = 400;
    }
    //对话框最高为浏览器的百分之80
    lookUp('dialog', '', '', iwidth ,7,'');
    $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
    showMessage('dialog','false',false,-1);
    showMessage('fade','false',false,-1);
    title = title? title:getText(l_edit);
    $("#dialog-title").html(title);
}
function closeMyDialog(tagDiv){
    iClose(tagDiv);
    iClose('fade');
}
/************************覆盖弹框**************************************/
function alert(tipMessage, tipTime, isSuccess, width){
    if( !width){
        width = 200;
    }
	tipTime = tipTime?tipTime:2;
	if(tipMessage!=""){
		if(tipMessage!="false"&&tipMessage!=false) {
            $("#tip-div").html(tipMessage);
            if (tipMessage.length > 35){
                width = 300;
            }
            if (tipMessage.length > 75){
                width = 500;
            }
            if (tipMessage.length > 150){
                width = 800;
            }
        }
	}
	$("#tip-div").css("left",  ($(window).width()/2 - width/2) +"px").css("width", width+"px");
    $("#tip-div").removeClass("text-success");
    $("#tip-div").removeClass("text-error");
    $("#tip-div").addClass("text-" + isSuccess);

	showMessage("tip-div",tipMessage,false,tipTime);
}
function myConfirm(message){
    var begin = Date.now();

    var result = window.confirm(message);
    var end = Date.now();
    if (end - begin < 10) {
        alert(getText(l_closeAlertTip), 5, "error", 500);
        return true;
    }
    return result;
}
/** *********************页面提示信息显示方法************************* */
/**
 * 显示的div，提示信息，是否晃动，自动隐藏时间：-1为不隐藏，其它为隐藏时间（单位秒) message
 * 为false时表示不需要提示信息，仅需要显示div即可
 */
function showMessage(id,message,ishake,time){
    if(message!=""){
        if(message!="false"&&message!=false)
            $("#"+id).html(message);
        $("#"+id).fadeIn(300);
        if(ishake){
            shake(id);
        }
        if(time!=-1){
            if(isNaN(time))
                time=2000;
            else if(time>0)
                time = time * 1000;
            setTimeout(function(){
                if(time!=0){
                    $("#"+id).fadeOut(500);
                }
                else{
                    $("#"+id).fadeOut(300);
                }
                $("#"+id).hide("fast");
            },time);
        }
    }
}
// 晃动div
function shake(o){
    var $panel = $("#"+o);
    var box_left =0;
    $panel.css({'left': box_left});
    for(var i=1; 4>=i; i++){
        $panel.animate({left:box_left-(8-2*i)},50);
        $panel.animate({left:box_left+2*(8-2*i)},50);
    }
}
/*******************************************************************************
 * 根据点击位置设置div左边
 *
 * @param id
 * @param e
 *            为空时，局浏览器中部
 * @param lHeight
 * @param lWidth
 * @param onMouse
 *            div是否覆盖点击的点:(0).不覆盖，div居浏览器中部 (1).X轴居中 (2).Y轴居中 (3).X、Y轴均居中
 *            (4).右下方,(5).id左下方 6:居中，不需要考虑浏览器滚动 7：居中，高度不定，最大不超过浏览器80%
 */
function lookUp(id, e, lHeight, lWidth ,onMouse, positionId) {
    var lObj = self.document.getElementById(id);
    var lTop;
    var lLeft;
    //居中，高度不定，最大不超过浏览器80%
    if(onMouse==7){
        lLeft=$(window).width()/2 - (lWidth/2);
        lObj.style.top = '200px';
        lObj.style.width = lWidth + 'px';
        lObj.style.height = "auto";
        lObj.style.left = lLeft + 'px';
        return;
    }

    //如果传入了event
    if(e.clientY&&onMouse&&onMouse!=0){
        lTop = e.clientY;
        lLeft = e.clientX;
        if(onMouse==1){
            lLeft = lLeft - (lWidth/2);
        }else if(onMouse==2){
            lTop = lTop - (lHeight/2);
        }
        else if(onMouse==3){
            lTop = lTop - (lHeight/2);
            lLeft = lLeft - (lWidth/2);
        }else if(onMouse==4){
            lTop = e.clientY;
            lLeft = e.clientX;
        }
    }else{
        lTop=$(window).height()/2 - (lHeight/2);
        lLeft=$(window).width()/2 - (lWidth/2);
    }
    if(onMouse==5){
        lTop = $("#"+positionId).offset().top+$("#"+positionId).outerHeight()-1;
        lLeft = $("#"+positionId).offset().left-1;
    }
    if (lLeft < 0) lLeft = 5;
    if ((lLeft + lWidth*1) > $(window).width()) lLeft = $(window).width() - lWidth - 20;
    if ((lTop + lHeight*1) > $(window).height()) lTop =  $(window).height() - lHeight - 70;

    lObj.style.width = lWidth + 'px';
    lObj.style.left = (lLeft + document.documentElement.scrollLeft) + 'px';

    lObj.style.height = lHeight + 'px';
    lObj.style.top =  lTop + 'px';
}

/**************************** 隐藏div *******************************/
function iClose(id){
    $("#"+id).fadeOut(300);
}
function iShow(id){
    $("#"+id).fadeIn(300);
}

String.prototype.endWith=function(endStr){
    var str = this;
    if(endStr.length == 0 || this.length == 0){
        return false;
    }
    if(str.length < endStr.length){
        return false;
    }
    str = str.substr(str.length - endStr.length);
    return (str == endStr)
}
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
String.prototype.huanhang = function () {
    return this.replace(/\n/g, "<br>");
}
function handerStr(str){
    if( !str || str.trim() == "" || str == "NaN" || str == "undefined" || str == "-1"){
        return "";
    }
    return str.trim();
}
function random(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
}
//chrome.windows.create({url :"debug.html" },function(){});//函数后面都有一个functon(){},这个应该标识执行函数的意思吧。
/**
 * 刷新是否同步颜色标识
 * -1：初始化，从数据库读取
 * 1：同步
 * 0：有未同步数据
 * @param isSync
 */
function refreshSyncIco(isSync){
    var key = "crap-debug-isSync";
    var value = "";
    if(isSync == -1){
        value = getLocData(key);
    }else if(isSync == 1){
        value = "true";
        saveLocData(key, value);
    }else if(isSync == 0){
        value = "false";
        saveLocData(key, value);
    }
    $("#synch-ico").removeClass("GET");
    $("#synch-ico").removeClass("POST");
    if(value == "true"){
        $("#synch-ico").addClass("GET");
    }else if(value == "false"){
        $("#synch-ico").addClass("POST");
    }
}

function applyPermission() {
    try {
        chrome.permissions.contains({
                "permissions": ["cookies"],
                "origins": ["http://*/*", "https://*/*"]
            }, function (result) {
                if (!result) {
                    chrome.permissions.request({
                        "permissions": ["cookies"],
                        "origins": ["http://*/*", "https://*/*"]
                    }, function (granted) {
                        if (!granted) {
                            alert(getText(l_applyPermission), 5, "error", 500);
                            return;
                        }
                    });
                }
            }
        );
    } catch (e){}
}

function getBrowserUrlCallBack(tabs) {
    if (tabs[0].url){
        var qrValue = tabs[0].url;
        setValue("qr-tool-text", qrValue);
        setTimeout(function () {
            new QRCode(document.getElementById("qr-tool-img"), qrValue);
        }, 20);
    } else {
        setValue("qr-tool-text", getText(l_getBrowserUrlFail));
    }
}

function getQrHref(tabs) {
    try {
        if (tabs[0].url){
            var qrValue = tabs[0].url;
            var qrHistory = getLocData(QR_HISTORY);
            if (qrHistory && qrHistory.length > 0){
                qrValue = qrHistory;
            }

            setValue("qr-tool-text", qrValue);
            setTimeout(function () {
                new QRCode(document.getElementById("qr-tool-img"), qrValue);
            }, 20);
        } else {
            var qrValue = "http://api.fesdfe32cdsfe.cn";
            var qrHistory = getLocData(QR_HISTORY);
            if (qrHistory && qrHistory.length > 0){
                qrValue = qrHistory;
            }
            setValue("qr-tool-text", qrValue);
            new QRCode(document.getElementById("qr-tool-img"), qrValue);
        }

    }catch (e){
        setValue("qr-tool-text", "http://api.fesdfe32cdsfe.cn");
        new QRCode(document.getElementById("qr-tool-img"), "http://api.fesdfe32cdsfe.cn");
    }
}