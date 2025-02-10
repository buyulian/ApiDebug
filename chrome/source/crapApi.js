var isLogin = false;
$(function(){
    i18nInit();
    getLocalModules();
    //getHistorys();
    //openMyDialog("title",500);
    var pageName = getValue("id-page-name")
    if (pageName == "debug"){
        $("#left").width(getMenuWidth() + '%');
        $("#right").width((100- getMenuWidth()) + '%');

        refreshSyncIco(-1);
        //getLoginInfoDAO(drawLoginInfoDAO);

        // 当前环境
        drawCurrentEnv();
        drawNotice();
        drawCurrentProject();


        // getAdvertisement();
    } else if (pageName == "setting"){
        $("#" + WEB_SITE_URL).val(getWebSiteUrl());
        $("#" + WEB_HTTP_TIMEOUT).val(getHttpTimeout());
        $("#" + SETTING_LANGUAGE).val(getLanguage());
        $("#" + MENU_WIDTH).val(getMenuWidth());
        $("#" + AUTO_FIX).val(getAutoFix() + "");
    } else if (pageName == "json"){
        $("#response-row").focus();
    }

    // 数据同步服务器
    $("#synch").click(function() {
        syncProject();
    });

    // 数据同步服务器
    $("#export-data").click(function() {
        exportData();
    });

    // 数据同步服务器
    $("#import-data").click(function() {
        importData();
    });
    $('#import-data').on('change', function(event) {
        var file = event.target.files[0]; // 获取选中的文件
    
        if (file) {
            // 创建FileReader对象来读取文件
            var reader = new FileReader();

            // 定义文件读取完成后的回调函数
            reader.onload = function(e) {
                var content = e.target.result;
                // 尝试将读取的内容解析为JSON对象
                try {
                    var jsonObj = JSON.parse(content);
                    localStorage.clear();
                    // 遍历JSON对象并将键值对存储到localStorage
                    for (var key in jsonObj) {
                        if (jsonObj.hasOwnProperty(key)) {
                            localStorage.setItem(key, jsonObj[key]);
                        }
                    }
                    alert('JSON数据已成功导入到localStorage。');
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('解析JSON失败。');
                }
            };

            // 读取文件内容为文本
            reader.readAsText(file);
        }
      });

    $("#id-search").keyup(function(event){
        if (event != null && event.keyCode != 13){
            return;
        }

        var value = $.trim(getValue("id-search-text"));
        if (hasClass("modules", "none")){
            searchHistorys(value);
        } else {
            searchLocalModules(value);
        }
    });

    $("#id-clear-search").click(function(){
        setValue("id-search-text", "");
        getLocalModules();
    });



    $("#historys-title").click(function(){
        $("#historys").removeClass("none");
        $("#modules").addClass("none");
        $("#modules-title").removeClass("bb2");
        $(this).addClass("bb2");
        getHistorys();
    });
    $("#modules-title").click(function(){
        $("#historys").addClass("none");
        $("#modules").removeClass("none");
        $("#historys-title").removeClass("bb2");
        $(this).addClass("bb2");
        getLocalModules();
    });

    var saveAs = true;
    // 保存
    $("#save-interface").click(function(){
        if( handerStr($("#interface-id").val()) == "" || handerStr($("#module-id").val())== ""){
            saveAs = false;
            intitSaveInterfaceDialog();
        }else{
            // 直接保存
            $("#save-interface-name").val($("#interface-name").val());
            var moduleId = $("#module-id").val();
            if( saveInterface(moduleId) ){
                alert(getText(l_successTip));
            }
        }
    });

    // 另存为
    $("#save-as-interface").click(function(){
        saveAs = true;
        intitSaveInterfaceDialog();
    });

    $("#save-interface-submit").click(function(){
        saveInterface("", saveAs);
    });

    $(".close-dialog").click(function(){
        var id = $(this).attr("crap-data");
        closeMyDialog(id);
    });
    $("#clear-local-data").click(function(){
        if(!myConfirm(getText(l_clearLocalData))){
            return false;
        }
        clearLocalStorage(getCurrentProjectUniKey());
        getLocalModules();
        $.ajax({
            type : "POST",
            url : getWebSiteUrl()+"/user/loginOut.do",
            async : true,
            data : "",
            complete: function(responseData, textStatus){
                if(textStatus == "error"){
                    alert(getText(l_clearSuccessLogoutFail), 5, "error", 500);
                }
                else if(textStatus == "success"){
                    alert(getText(l_clearSuccessLogoutSuccess), 5, "success", 500);
                }else{
                    alert(getText(l_clearSuccessLogoutFail), 5, "error", 500);
                }
                $("#float").fadeOut(300);
            }
        });
    });

    // 模块标题点击
    $("#modules").on("click",".panel-heading", function(e) {
        if ($(this).find("div").hasClass("collapsed")){
            $(".module-title-ico").html("&#xe615;");
            $(this).find(".module-title-ico").html("&#xe624;");
        } else {
            $(this).find(".module-title-ico").html("&#xe615;");
        }
    });

    $("#modules").on("click",".interface", function() {
        var urlInfo = $.parseJSON( decodeURIComponent($(this).attr("crap-data")) );
        $("#url").val(urlInfo.url);
        $("#interface-id").val(urlInfo.id);
        $("#module-id").val(urlInfo.moduleId);
        $("#interface-name").val(handerStr(urlInfo.name));
        $("#headers-bulk").val(urlInfo.headers);

        var systemConfig = urlInfo.systemConfig;
        if(systemConfig) {
            $("#system-div-timeout").val(systemConfig.timeout);
        }
        $("#method").val(urlInfo.method);
        $("#method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#param-type-value").prop("checked",true);
            $("#params-bulk").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#customer-type-value").prop("checked",true);
            // 下拉选择 customer-type
            $("#customer-type").val(urlInfo.paramType);
            $("#customer-type").change();
            $("#customer-value").val(urlInfo.params);
            $("#headers-bulk-edit-div .key-value-edit").click();
        }
        $("input[name='param-type']").change();

        $(".interface").removeClass("bg-main");
        $(this).addClass("bg-main");

        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);
        // 编辑、查看接口
        if (urlInfo.webModuleId != null && urlInfo.webProjectId != null && urlInfo.webId != null){
            setAttr(ID_WEB_EDIT_INTERFACE, ATTR_HREF_PARAMS, urlInfo.webProjectId + "|" + urlInfo.webId);
            setAttr(ID_WEB_VIEW_INTERFACE, ATTR_HREF_PARAMS, urlInfo.webProjectId + "|" + urlInfo.webId);
            showDiv(ID_WEB_EDIT_INTERFACE);
            showDiv(ID_WEB_VIEW_INTERFACE);
        }
    });

    $("#historys").on("click","div", function() {
        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);

        var urlInfo = $.parseJSON( decodeURIComponent($(this).attr("crap-data")) );
        $("#url").val(urlInfo.url);
        $("#interface-id").val("-1");
        $("#module-id").val("-1");
        $("#interface-name").val(handerStr(urlInfo.name));
        $("#headers-bulk").val(urlInfo.headers);
        $("#method").val(urlInfo.method);
        $("#method").change();

        if($.inArray(urlInfo.paramType, customerTypes) == -1){
            urlInfo.paramType = "x-www-form-urlencoded;charset=UTF-8";
            $("#param-type-value").prop("checked",true);
            $("#params-bulk").val(urlInfo.params);
            $(".key-value-edit").click();
        }else{
            $("#customer-type-value").prop("checked",true);
            // 下拉选择 customer-type
            $("#customer-type").val(urlInfo.paramType);
            $("#customer-type").change();
            $("#customer-value").val(urlInfo.params);
            $("#headers-bulk-edit-div .key-value-edit").click();
        }
        $("input[name='param-type']").change();


        $(".history-div").removeClass("bg-main");
        $(this).addClass("bg-main");
    });

    $("#new-interface").click(function() {
        hiddenDiv(ID_WEB_EDIT_INTERFACE);
        hiddenDiv(ID_WEB_VIEW_INTERFACE);

        $("#interface-name").val("");
        $("#headers-bulk").val("");
        $("#params-bulk").val("");
        $("#url").val("");
        $("#interface-id").val("-1");
        $("#module-id").val("-1");
        $("#method").val("GET");
        $("#method").change();

        $("#param-type-value").prop("checked",true);
        $("#params-bulk").val("");
        $(".key-value-edit").click();
        $("input[name='param-type']").change();

        $(".interface").removeClass("bg-main");
        $(".history-div").removeClass("bg-main");
    });
    $("#save-module-submit").click(function() {
       if($("#rename-module-name").val() == ""){
           alert(getText(l_moduleNameIsNullTip), 5, "error", 300);
           return false;
       }
        renameModule( $("#rename-module-id").val(), $("#rename-module-name").val());
        getLocalModules();
        closeMyDialog("dialog2");
    });

    /******删除接口*********/
	$("#modules").on("click",".delete-interface", function() {
        if(!myConfirm(getText(l_confirmDelete)))
        {
            return false;
        }
        var ids = $(this).attr("crap-data").split("|");
		deleteInterface(ids[0],ids[1]);
		getLocalModules();	
		return false;// 不在传递至父容器
    });
    /*******上移接口**********/
    $("#modules").on("click",".up-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        upInterface(ids[0],ids[1]);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******下移接口**********/
    $("#modules").on("click",".down-interface", function() {
        var ids = $(this).attr("crap-data").split("|");
        downInterface(ids[0],ids[1]);
        getLocalModules();
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".delete-module", function() {
        if(!myConfirm(getText(l_confirmDelete)))
        {
            return false;
        }
        var moduleId = $(this).attr("crap-data");
        deleteModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******上移**********/
    $("#modules").on("click",".up-module", function() {
        var moduleId = $(this).attr("crap-data");
        upModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });
    /*******下移**********/
    $("#modules").on("click",".down-module", function() {
        var moduleId = $(this).attr("crap-data");
        downModule(moduleId);
        getLocalModules();
        return false;// 不在传递至父容器
    });

    $("#modules").on("click",".rename-module", function() {
        var moduleId = $(this).attr("crap-data");
        $("#rename-module-id").val(moduleId);
        lookUp('dialog2', '', '', 400 ,7,'');
        $("#dialog-content").css("max-height",($(document).height()*0.8)+'px');
        showMessage('dialog2','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

	$("#open-debug").click(function(){
			window.open("debug.html")
	});
    $("#more-tools").click(function(){
        window.open("moreTools.html")
    });
    $("#open-json").click(function(){
        window.open("json.html")
    });
    $("#set-web-site").click(function(){
        window.open("setting.html")
    });

    $("#qr-tool").click(function(){
       showDiv("qr-tool-div");
       setHtml("qr-tool-img", "");
       chrome.tabs.query({active:true, currentWindow:true},getQrHref);


    });

    $("#qr-tool-text").on("keydown keyup input", function (e) {
        var url = getValue("qr-tool-text");
        if (url != ""){
            setHtml("qr-tool-img", "");
            new QRCode(document.getElementById("qr-tool-img"), url);
            if (url.trim() != textObj[l_getBrowserUrlFail] && url.trim() != textObj[l_getBrowserUrlFail_en]){
                saveLocData(QR_HISTORY, url);
            }
        }
    });

    $(".submitSetting").click(function(event){
        var _this=$(event.target);
        var name = _this.attr('crap-data-name');
        setSetting(name,$("#" + name).val(), _this);
    });

    $("#" + ID_URL_ENCODE).click(function(event){
        setValue(ID_URL_ENCODE_TEXT, encodeURIComponent(getValue(ID_URL_ENCODE_TEXT)));
    });
    $("#" + ID_URL_DECODE).click(function(event){
        setValue(ID_URL_ENCODE_TEXT, decodeURIComponent(getValue(ID_URL_ENCODE_TEXT)));
    });


    $("#" + ID_IP_ADDRESS).click(function(event){
        var ipValue = getValue(ID_IP_TEXT);
        var result = "";
        try {
            if (ipValue && ipValue.trim().length <= 0) {
                return;
            }
            httpPost("https://ip.taobao.com/outGetIpInfo?accessKey=alibaba-inc&ip=" + ipValue, true, function(response) {
                //0：成功，1：服务器异常，2：请求参数异常，3：服务器繁忙，4：个人qps超出。
                if (response.code == 0){
                    setValue(ID_IP_RESULT, format(JSON.stringify(response.data)));
                } else if (response.code == 1){
                    setValue(ID_IP_RESULT, "服务器异常「system error」" + ":" + response.msg);
                } else if (response.code == 2){
                   setValue(ID_IP_RESULT, "IP地址格式有误「param error」" + ":" + response.msg);
                } else if (response.code == 3){
                   setValue(ID_IP_RESULT, "服务器繁忙「system busy」" + ":" + response.msg);
                } else if (response.code == 4){
                    setValue(ID_IP_RESULT, "个人qps超出限制，稍后再试「please try later」" + ":" + response.msg);
                } else {
                  setValue(ID_IP_RESULT, response.code + ":" + response.msg);
                }
            });
        } catch (e){
            setValue(ID_IP_RESULT, "网络一次「network error」:" + e);
        }
    });

    $("#" + ID_PHONE_BELONG).click(function(event){
            var phoneValue = getValue(ID_PHONE_BELONG_TEXT);
            var result = "";
            try {
                if (phoneValue && phoneValue.trim().length <= 0) {
                    return;
                }
                httpPost("https://cx.shouji.360.cn/phonearea.php?number=" + phoneValue, true, function(response) {
                    //0：成功，1：服务器异常，2：请求参数异常，3：服务器繁忙，4：个人qps超出。
                    if (response.code == 0){
                        setValue(ID_PHONE_BELONG_RESULT, format(JSON.stringify(response.data)));
                    } else if (response.code == 1){
                        setValue(ID_PHONE_BELONG_RESULT, "电话格式有误「param error」" + ":" + response.msg);
                    } else {
                      setValue(ID_PHONE_BELONG_RESULT, response.code);
                    }
                });
            } catch (e){
                setValue(ID_PHONE_BELONG_RESULT, "网络一次「network error」:" + e);
            }
    });


    $("#" + ID_TO_TIMESTAMP).click(function(event){
        var timestampText = getValue(ID_TIMESTAMP_TEXT);
        var result = "";
        try {
            if (timestampText && timestampText.trim().length > 0) {
                if(new Date(timestampText)  && !isNaN(new Date(timestampText) )){
                    result = new Date(timestampText).getTime();
                } else {
                    result = getText(l_input_format_error);
                }
            } else {
                result = new Date().getTime();
            }
        } catch (e){
            result = getText(l_input_format_error) + ":" +  e;
        }
        setValue(ID_TIMESTAMP_RESULT, result)
    });

    $("#" + ID_TO_DATE).click(function(event){
        var timestampText = getValue(ID_TIMESTAMP_TEXT);
        var result = "";
        try {
            if (timestampText && timestampText.trim().length > 0) {
                result = timestampText * 1;
                if (result < 9999999999){
                    result = result * 1000;
                }
            } else {
                result = new Date().getTime();
            }
            result = new Date(result).toLocaleDateString().replace(/\//g, "-") + " " + new Date(result).toTimeString().substr(0, 8);
        } catch (e){
            result = getText(l_input_format_error) + ":" +  e;
        }
        setValue(ID_TIMESTAMP_RESULT, result)
    });




	$(".params-headers-table").on("keyup","input", function() {
      if($(this).val() != ''){
          var tr = $(this).parent().parent();
          if( tr.hasClass("last") ){
              var table = tr.parent();
              table.append(paramsTr);
              tr.removeClass("last");
          }
      }
    });

	// 当前是否显示批量编辑
	var showBulkParams = false;
	var showBulkHeaders = false;
	
	// 批量编辑
	$(".bulk-edit").click(function(){
       var preId = $(this).attr("crap-data-value");
	   if( preId == "headers"){
		   showBulkHeaders = true;
	   }
	   if( preId == "params"){
			showBulkParams = true;
	   }
	   $("#"+preId+"-table").addClass("none");
	   $("#"+preId+"-bulk-edit-div").removeClass("none");
	    var bulkParams = "";
	    var texts = $("#"+preId+"-div input[type='text']");
		// 获取所有文本框
		var key = "";
		$.each(texts, function(i, val) {
			   try {
				   if(val.getAttribute("data-stage") == "value"){
					   var p = key+":" + val.value;
					   if( p != ":"){
						   bulkParams += p + "\n";
					   }	
				   }else if(val.getAttribute("data-stage") == "key"){
						key = val.value;
				   }
			   } catch (ex) { }
		});
		$("#"+preId+"-bulk").val(bulkParams);
    });
	
	// key-value编辑
	$(".key-value-edit").click(function(){
       var preId = $(this).attr("crap-data-value");
	   if( preId == "headers"){
		   showBulkHeaders = false;
	   }
	   if( preId == "params"){
			showBulkParams = false;
	   }
	   $("#"+preId+"-table").removeClass("none");
	   $("#"+preId+"-bulk-edit-div").addClass("none");
	    var bulkParams = $("#"+preId+"-bulk").val();
		var params = bulkParams.split("\n");
		$("#"+preId+"-table tbody").empty();
	    for(var i=0 ; i< params.length; i++){
			if( params[i].trim() != ""){
				var p = params[i].split(":");
				if(p.length>2){
                    for(var j=2 ; j< p.length; j++){
                        p[1] = p[1] +":" + p[j];
                    }
                }
				var key = crapTrim(p[0]);
				var value = "";
				if(p.length >1 ){
					value = crapTrim(p[1]);
				}
                var keyInput = document.createElement("input");
                keyInput.setAttribute("class","form-control") ;
                keyInput.setAttribute("data-stage","key") ;
                keyInput.setAttribute("type","text") ;
                keyInput.setAttribute("value",key) ;

                var valueInput = document.createElement("input");
                valueInput.setAttribute("class","form-control") ;
                valueInput.setAttribute("data-stage","value") ;
                valueInput.setAttribute("type","text") ;
                valueInput.setAttribute("value",decodeURIComponent(value)) ;

                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.appendChild(keyInput)
                var td2 = document.createElement("td");
                td2.appendChild(valueInput)
                tr.appendChild(td1);
                tr.appendChild(td2);

                $(tr).append("<td class='w20'><i class='iconfont cursor color-adorn'>&#xe69d;</i></td>");
                $("#"+preId+"-table tbody").append(tr)
			}
		}
		$("#"+preId+"-table tbody").append(paramsTr);
    });
	
	$("#format-row").click(function(){
	    var rowData = originalResponseText;
	    if( rowData == ""){
            originalResponseText = $("#response-row").val();
            rowData = originalResponseText;
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $("#response-row").val(rowData);
        responseShow("response-row");
        $('#response-row').removeAttr("readonly");
        originalResponseText = "";
    });

    $("#format-pretty").click(function(){
        var rowData = originalResponseText;
        if( rowData == ""){
            originalResponseText = $("#response-row").val();
            rowData = originalResponseText;
        }
        try{
            var jsonFormatResult = format(rowData);
            if (jsonFormatResult != null && jsonFormatResult != '') {
                $("#response-row").val(jsonFormatResult);
            }
        }catch(e){
            console.warn(e)
            $("#response-row").val(rowData);
        }
        changeBg("btn-default", "btn-main", "response-menu",this);
        $('#response-row').attr("readonly","readonly");
        responseShow("response-row");
    });

    $('.response-json').on('click', function() {
       if( !formatJson() ){
            return;
       }
       changeBg("btn-default", "btn-main", "response-menu",this);
	   var value = $(this).attr("crap-data-value");
	   var key = $(this).attr("crap-data-name");
       $('#response-pretty').JSONView(key, value);
       responseShow("response-pretty");
    });

    $(".params-headers-table").on("click","i",function() {
        var tr = $(this).parent().parent();
        // 最后一行不允许删除
        if( tr.hasClass("last")){
            return;
        }
        tr.remove();
    });

    // 请求头、参数切换
  $(".params-title").click(function(){
        $(".params-title").removeClass("adorn-bb2");
        $(this).addClass("adorn-bb2");
        var contentDiv = $(this).attr("data-stage");
        $("#headers-div").addClass("none");
        $("#params-div").addClass("none");
        $("#system-div").addClass("none");
        $("#"+contentDiv).removeClass("none");
  });

    $(".response-title").click(function(){
        $(".response-title").removeClass("bb2");

        $(this).addClass("bb2");
        var contentDiv = $(this).attr("data-stage");
        $(".response-header").addClass("none");
        $(".response-body").addClass("none");
        $(".response-cookie").addClass("none");
        $("."+contentDiv).removeClass("none");

        if (contentDiv == "response-cookie"){
            applyPermission();
        }
    });


    $("#method").change(function() {
        if( $("#method").val() != "GET"){
            if($("#content-type").hasClass("none")){
                $("#content-type").removeClass("none");
            }
        }else{
            $("#param-type-value").prop("checked",true);
            $("input[name='param-type']").change();
            if(!$("#content-type").hasClass("none")){
                $("#content-type").addClass("none");
            }
        }
    });

    // param-type=customer
    $("#customer-type").change(function() {
        $("#customer-type-value").val( $("#customer-type").val() );
    });
    // 单选param-type监控
    $("input[name='param-type']").change(function(){
        var crapData = $("input[name='param-type']:checked").attr("crap-data");
        if( crapData && crapData=="customer") {
            $("#customer-type").removeClass("none")
            $("#params-table").addClass("none");
            $("#customer-div").removeClass("none");
        }else{
            $("#customer-type").addClass("none");
            $("#customer-div").addClass("none");
            $("#params-table").removeClass("none");
        }
    });

  // 插件调试send
  $("#send").click(function(){
      applyPermission();
	  if( showBulkHeaders ){
		 $("#headers-bulk-edit-div .key-value-edit").click();
	  }
	  if( showBulkParams ){
		 $("#params-bulk-edit-div .key-value-edit").click();
	  }
      callAjax();
  });

    // 初始化提示
    $("#" + ID_NOTICE).click(function(){
        saveLocData(NOTICE_CLICK, "yes");
    });

    // 跳转
    $(".goHref").click(function(){
        var href = $(this).attr(ATTR_HREF);

        if (!href){
            return false;
        }

        if (href.indexOf('PLUG:') == 0){
            href = href.replace("PLUG:", "");
        }else if (href.indexOf('http') != 0){
            href = getWebSiteUrl() + "/" + href;
        }

        var hrefParamStr = $(this).attr(ATTR_HREF_PARAMS);
        if (hrefParamStr){
            var hrefParams = hrefParamStr.split("|");
            for(var i=0; i<hrefParams.length;i++) {
                href = href.replace('{{'+ i + "}}", hrefParams[i]);
            }
        }

        if ($(this).attr(ATTR_HREF_NEW_PAGE) == TRUE){
            window.open(href);
            return false;
        }

        setAttr(ID_IFRAME_DIALOG_IFRAME, "src", href);
        setHtml(ID_IFRAME_DIALOG_TITLE, getText($(this).attr(ATTR_HREF_TITLE)))
        lookUp('iframe-dialog', '', '', 1100 ,7,'');
        $("#iframe-dialog").css("height","640px");
        $(".look-up-content").css("height","600px");
        $("#iframe-dialog").css("top","60px");

        showMessage('iframe-dialog','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    $("#" + ID_QR_TOOL_GET_BROWSER_URL).click(function(){
        chrome.tabs.query({active:true, currentWindow:true},getBrowserUrlCallBack);
    });

    // 登陆
    $("#login-button").click(function(){
        setAttr(ID_IFRAME_DIALOG_IFRAME, "src", getWebSiteUrl() + "/loginOrRegister.do#/login")
        setAttr(ID_IFRAME_DIALOG_CLOSE, ATTR_IFRAME_CLOSE, TRUE)
        setHtml(ID_IFRAME_DIALOG_TITLE, getText(l_loginTitle))
        lookUp('iframe-dialog', '', '', 1100 ,7,'');
        $("#iframe-dialog").css("height","640px");
        $(".look-up-content").css("height","600px");
        $("#iframe-dialog").css("top","60px");

        showMessage('iframe-dialog','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    // 常用工具
    $(".develop-tool").click(function(){
        setAttr(ID_IFRAME_DIALOG_IFRAME, "src",  $(this).attr("crap-data-url"));
        setAttr(ID_IFRAME_DIALOG_CLOSE, ATTR_IFRAME_CLOSE, "false");
        setHtml(ID_IFRAME_DIALOG_TITLE, $(this).attr("crap-data-title"));
        setAttr(ID_IFRAME_DIALOG_IFRAME, "src",  $(this).attr("crap-data-url"));
       setAttr(ID_IFRAME_DIALOG_IFRAME, "style", $(this).attr("crap-data-style"));

        lookUp('iframe-dialog', '', '', 1100 ,7,'');
        $("#iframe-dialog").css("height","640px");
        $(".look-up-content").css("height","600px");
        $("#iframe-dialog").css("top","60px");
        showMessage('iframe-dialog','false',false,-1);
        showMessage('fade','false',false,-1);
        return false;// 不在传递至父容器
    });

    $("#" + ID_IFRAME_DIALOG_CLOSE).click(function(){
        if (getAttr(ID_IFRAME_DIALOG_CLOSE, ATTR_IFRAME_CLOSE) == TRUE) {
            window.location.reload();
        }
        return false;
    });

    // div 拖动
    $("#left").resizable(
        {
            autoHide: true,
            handles: 'e',
            maxWidth: 700,
            minWidth: 180,
            resize: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();

                var divTwo = $("#right");
                var divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
            },
            stop: function(e, ui)
            {
                var parentWidth = $(window).width();
                var remainingSpace = parentWidth - ui.element.width();
                var divTwo = $("#right");
                var divTwoWidth = remainingSpace/parentWidth*100+"%";
                divTwo.width(divTwoWidth);
                ui.element.css(
                    {
                        width: ui.element.width()/parentWidth*100+"%",
                    });
                localStorage[MENU_WIDTH] = ui.element.width()/parentWidth*100;
            }
        });
})
