function crapTrim(val) {
    if (val && val.length > 0){
        return val.trim();
    }
    return val;
}

function drawCurrentProject() {
    setHtml(ID_CURRENT_PROJECT_NAME, getLocDataDef(CURRENT_PROJECT_NAME, getText(l_defDebugName)));
    setAttr(ID_CURRENT_PROJECT_COVER, "src", getLocDataDef(CURRENT_PROJECT_COVER, "source/image/defCover.jpg"));
}

// 查询当前项目
function getCurrentProjectUniKey() {
    return getLocData(CURRENT_PROJECT_UNIKEY);
}

function setCurrentProjectUniKey(unikey, projectName, projectCover) {
    saveLocData(CURRENT_PROJECT_UNIKEY, unikey);
    saveLocData(CURRENT_PROJECT_NAME, projectName);
    if (projectCover && projectCover.indexOf("http") != 0){
        projectCover = getWebSiteUrl() + "/" + projectCover;
    }
    saveLocData(CURRENT_PROJECT_COVER, projectCover);
}

function getLocJsonData(key, def) {
    try {
        return $.parseJSON(getLocDataDef(key, def));
    } catch (e){
        console.warn(e);
        return $.parseJSON(def);
    }
}
/***********获取本地存储的数据**********/
function getLocData(key){
    try{
        var value = localStorage[key];
        if(value){
            return value;
        }
    }catch(e){
        console.warn(e);
        return "";
    }
    return "";
}

function getLocDataDef(key, def){
    try{
        var value = localStorage[key];
        if(value){
            return value;
        }
    } catch(e){
        console.warn(e);
        return def;
    }
    return def;
}
/*********存储数据至本地***********/
function saveLocData(key, value){
    try{
        localStorage[key] = value;
        return true;
    }catch(e){
        console.warn(e);
        return false;
    }
}

/**********登陆****************/
function getLoginInfoDAO(callBack) {
    httpPost(INIT_URL, true, callBack);
}
function drawLoginInfoDAO(response) {
    var projectUniKey = getCurrentProjectUniKey();
    var modules = getLocJsonData(CRAP_DEBUG_MODULES + projectUniKey, EMPTY_ARRAY);

    // 登陆成功，当前无模板，需要刷新加载远程数据
    if (response.success == 1){
        setHtml(ID_USER_NAME, "Hi, " + response.data.sessionAdminName + " !");
        showDiv(ID_USER_NAME);
        hiddenDiv(ID_LOGIN);
        showDiv(ID_LOGOUT);
        saveLocData(USER_LOGIN_INFO ,JSON.stringify(response.data));
        if (modules.length == 0){
            syncProject();
        }
    } else {
        if (projectUniKey == "" && modules.length == 0){
            initExampleData();
            drawCurrentProject();
            getLocalModules();
        }
    }
}

function initExampleData(){
    var projectUniKey = "def-" + new Date().getTime() + "-" + random(10);
    var moduleId = "def-" + new Date().getTime() + "-" + random(8);
    setCurrentProjectUniKey(projectUniKey, "默认演示-Example", "http://plug.crap.cn/resources/avatar/avatar0.jpg");
    localStorage[CRAP_DEBUG_MODULES + projectUniKey] = "[{\"moduleName\":\"默认演示-Example\",\"moduleId\":\"" + moduleId + "\",\"version\":1,\"status\":1}]";
    localStorage['crap-debug-interface-' + moduleId] = JSON.stringify(defInterfaces);
}

$("#" + ID_LOGOUT).click(function(){
    httpPost(LOGOUT_URL, true, drawLogoutDAO);
});

function drawLogoutDAO(response) {
    alert(getText(l_logoutSuccessTip),3,"success");
    if (response.success == 1){
        hiddenDiv(ID_USER_NAME);
        showDiv(ID_LOGIN);
        hiddenDiv(ID_LOGOUT);
    }
}

/**********系统设置**************/
function getMenuWidth(){
    try {
        var menuWidth = localStorage[MENU_WIDTH];
        menuWidth = parseFloat(menuWidth);
        if (menuWidth && menuWidth != null && menuWidth.toString() != "NaN" && menuWidth > 15 && menuWidth < 50) {
            return menuWidth;
        } else {
            return 15;
        }
    }catch(e){
        return 15;
    }
}

function getAutoFix(){
    try {
        var autoFix = localStorage[AUTO_FIX];
        if (autoFix && autoFix != null && (autoFix == "true" || autoFix == "false")) {
            return (autoFix == "true");
        } else {
            return true;
        }
    }catch(e){
        return true;
    }
}

function getHttpTimeout(){
    try {
        var httpTimeout = localStorage[WEB_HTTP_TIMEOUT];
        httpTimeout = parseFloat(httpTimeout);
        if (httpTimeout && httpTimeout != null && httpTimeout.toString() != "NaN" && httpTimeout > 1000) {
            return httpTimeout;
        } else {
            return 10000;
        }
    }catch(e){
        return 10000;
    }
}
function getWebSiteUrl(){
    var webSiteUrl = localStorage[WEB_SITE_URL];
    if (webSiteUrl && webSiteUrl != null && webSiteUrl != ''){
        if (webSiteUrl.indexOf("http://") == 0 || webSiteUrl.indexOf("https://") == 0 ){
            return webSiteUrl;
        }
        return "http://" + webSiteUrl;
    }else{
        return "http://api.crap.cn";
    }
}

function getLanguage(){
    try {
        var language = localStorage[SETTING_LANGUAGE] || navigator.language;
        if ($.inArray(language, SUPPORT_LANGUAGE_ZH) != -1){
            return LANG_ZH_CN;
        }
        if ($.inArray(language, SUPPORT_LANGUAGE_EN) != -1){
            return LANG_EN;
        }
        return LANG_ZH_CN;
    } catch (e){
        return LANG_ZH_CN;
    }
}

function getText(name) {
    if (getLanguage() == LANG_ZH_CN){
        return textObj[name];
    } else {
        return textObj[name + _en];
    }
}

function i18nInit() {
    $.i18n.init({
        lng : getLanguage(), //指定语言
        resGetPath : 'source/locales/__lng__/__ns__.json',
        lngWhitelist:[LANG_ZH_CN, LANG_EN],
        preload:[LANG_ZH_CN, LANG_EN],
        ns: {
            namespaces: ['translation'],
            defaultNs: 'translation'   //默认使用的，不指定namespace时
        }
    },function(err, t){
        $('[data-i18n]').i18n(); // 通过选择器集体翻译
    });
}