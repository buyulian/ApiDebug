/***********id********/
var ID_USER_NAME = "id-user-name";
var ID_LOGIN = "login-button";
var ID_LOGOUT = "id-logout";
var ID_NOTICE = "id-notice";
var ID_WEB_EDIT_INTERFACE = "id-web-edit-interface";
var ID_WEB_VIEW_INTERFACE = "id-web-view-interface";
var ID_IFRAME_DIALOG_TITLE = "id-iframe-dialog-title"
var ID_IFRAME_DIALOG_IFRAME = "iframe-dialog-iframe";
var ID_IFRAME_DIALOG_CLOSE = "iframe-dialog-close";
var ID_CURRENT_PROJECT_NAME = "id-current-project-name";
var ID_CURRENT_PROJECT_COVER = "id-current-project-cover";
var ID_PROJECT_LIST_CONTENT = "id-project-list-content";
var ID_CHANGE_PROJECT = "id-change-project";
var ID_MAX_PROJECT_TIP = "id-max-project-tip";
var ID_CONTRACT = "id-contract";
var ID_URL_ENCODE_TEXT= "id-url-encode-text";
var ID_URL_DECODE= "id-url-decode";
var ID_URL_ENCODE= "id-url-encode";
var ID_TO_TIMESTAMP = "id-to-timestamp";
var ID_IP_ADDRESS = "id-ip-address";
var ID_IP_TEXT = "id-ip-text";
var ID_IP_RESULT = "id-ip-result";

var ID_PHONE_BELONG = "id-phone-belong";
var ID_PHONE_BELONG_TEXT = "id-phone-belong-text";
var ID_PHONE_BELONG_RESULT = "id-phone-belong-result";

var ID_TO_DATE = "id-to-date";
var ID_TIMESTAMP_TEXT = "id-timestamp-text";
var ID_TIMESTAMP_RESULT = "id-timestamp-result";

var ID_QR_TOOL_GET_BROWSER_URL = "id-qr-tool-get-browser-url";
var TRUE = "true";
var EMPTY_ARRAY = "[]";
// 数字版本，和插件版本保持一致，一位对两位： 1.1.4
var PLUG_VERSION = 10104;

// 本地数据
var QR_HISTORY = "crap-data-qr-history";
var USER_LOGIN_INFO = "crap-data-user-info";

var CURRENT_PROJECT_UNIKEY = "crap-data-current-project-unikey";
var CURRENT_PROJECT_NAME = "crap-data-current-project-name";
var CURRENT_PROJECT_COVER = "crap-data-current-project-cover";

var CRAP_DEBUG_MODULES = "crap-debug-modules";
var ADVERTISEMENT = "http://crap.cn/mock/trueExam.do?id=155030837878212000015&cache=true";
var INIT_URL = "/admin/init.do";
var LOGOUT_URL = "/user/loginOut.do";

// zh-CN 华 -中国
// zh-HK 华 - 香港的 SAR
// zh-MO 华 - 澳门的 SAR
// zh-SG 华 -新加坡
// zh-TW 华 -台湾
var LANG_ZH_CN = "zh-CN";
var LANG_ZH_HK = "zh-HK";
var LANG_ZH_MO = "zh-MO";
var LANG_ZH_SG = "zh-SG";
var LANG_ZH_TW = "zh-TW";

// en 英国
// en-AU 英国 -澳洲
// en-BZ 英国 -伯利兹
// en-CA 英国 -加拿大
// en-CB 英国 -加勒比海
// en-IE 英国 -爱尔兰
// en-JM 英国 -牙买加
// en-NZ 英国 - 新西兰
// en-PH 英国 -菲律宾共和国
// en-ZA 英国 - 南非
// en-TT 英国 - 千里达托贝哥共和国
// en-GB 英国 - 英国
// en-US 英国 - 美国
// en-ZW 英国 -津巴布韦

var LANG_EN = "en";
var LANG_EN_AU = "en-AU";
var LANG_EN_CA = "en-CA";
var LANG_EN_IE = "en-IE";
var LANG_EN_NZ = "en-NZ";
var LANG_EN_GB = "en-GB";
var LANG_EN_US = "en-US";

var SUPPORT_LANGUAGE_ZH = [LANG_ZH_CN, LANG_ZH_HK, LANG_ZH_MO, LANG_ZH_SG, LANG_ZH_TW];
var SUPPORT_LANGUAGE_EN = [LANG_EN, LANG_EN_AU, LANG_EN_CA, LANG_EN_IE, LANG_EN_NZ, LANG_EN_GB, LANG_EN_US];

var WEB_SITE_URL = "crap-web-site-url";
var WEB_HTTP_TIMEOUT = "crap-http-timeout";
var SETTING_LANGUAGE = "crap-setting-language";
var NOTICE_CLICK = "crap-notice-click";
var MENU_WIDTH = "crap-menu-width";
var AUTO_FIX = "crap-setting-auto-fix";

var ATTR_HREF = "crap-href";
var ATTR_HREF_PARAMS = "crap-href-params";
var ATTR_HREF_TITLE = "crap-href-title";
var ATTR_IFRAME_CLOSE = "crap-iframe-close";
var ATTR_HREF_NEW_PAGE = "crap-href-new-page";

/***********js 提示，必须以l_开头：表示language **********/
var _en = "_en";
var l_responseNotJsonTip = "l_responseNotJsonTip";
var l_logoutSuccessTip = "l_logoutSuccessTip";
var l_loginTitle = "l_loginTitle";
var l_editInterfaceTitle = "l_editInterfaceTitle";
var l_successTip = "l_successTip";
var l_clearLocalData = "l_clearLocalData";
var l_clearSuccessLogoutFail = "l_clearSuccessLogoutFail";
var l_clearSuccessLogoutSuccess = "l_clearSuccessLogoutSuccess";
var l_moduleNameIsNullTip = "l_moduleNameIsNullTip";
var l_input_format_error= "l_input_format_error";
var l_confirmDelete = "l_confirmDelete";
var l_formatErrorTip = "l_formatErrorTip";
var l_timeoutFormatErrorTip = "l_timeoutFormatErrorTip";
var l_menuWidthErrorTip = "l_menuWidthErrorTip";
var l_languageChangeTip = "l_languageChangeTip";
var l_updateSuccessTip = "l_updateSuccessTip";
var l_netErrorTip = "l_netErrorTip";
var l_unknownErrorTip = "l_unknownErrorTip";
var l_clickSendTip = "l_clickSendTip";
var l_urlIsNullTip = "l_urlIsNullTip";
var l_connectingError = "l_connectingError";
var l_interfaceNameIsNullTip = "l_interfaceNameIsNullTip";
var l_selectModuleTip = "l_selectModuleTip";
var l_saveInterface = "l_saveInterface";
var l_edit = "l_edit";
var l_closeAlertTip = "l_closeAlertTip";
var l_varSaveSuccess = "l_varSaveSuccess";
var l_save = "l_save";
var l_manageEnvVariable = "l_manageEnvVariable";
var l_envVariable = "l_envVariable";
var l_jsonToolErrorTip = "l_jsonToolErrorTip";
var l_defDebugName = "l_defDebugName";
var l_changeProject = "l_changeProject";
var l_netError = "l_netError";
var l_notLogin = "l_notLogin";
var l_vipTip = "l_vipTip";
var l_notVipTip = "l_notVipTip";
var l_noEnvVariable = "l_noEnvVariable";
var l_applyPermission = "l_applyPermission";
var l_getBrowserUrlFail = "l_getBrowserUrlFail";
var l_getBrowserUrlFail_en = "l_getBrowserUrlFail_en";


var textObj = {
    "l_getBrowserUrlFail":"获取浏览器地址失败",
    "l_getBrowserUrlFail_en":"Get browser url fail",
    "l_getBrowserUrl":"获取浏览器地址",
    "l_getBrowserUrl_en":"Get browser url",
    "l_logoutSuccessTip":"退出登陆成功!",
    "l_logoutSuccessTip_en":"Logout success!",
    "l_input_format_error":"输入的时间格式有误",
    "l_input_format_error_en":"Input time format error",

    "l_successTip":"成功 !",
    "l_successTip_en" :"Success !",

    "l_clearLocalData" : "确定要删除本地数据吗?",
    "l_clearLocalData_en" : "Delete local data, Are you sure ?",

    "l_clearSuccessLogoutFail":"清除数据本地数据成功，但退出登陆失败!",
    "l_clearSuccessLogoutFail_en":"Clear local data success, But logout fail!",

    "l_clearSuccessLogoutSuccess":"清除数据本地数据成功，退出成功!",
    "l_clearSuccessLogoutSuccess_en":"Clear local data success, Logout success!",

    "l_moduleNameIsNullTip" :"模块名不能为空!",
    "l_moduleNameIsNullTip_en" :"Module name is empty!",

    "l_confirmDelete":"确定删除？",
    "l_confirmDelete_en":"Confirm delete?",

    "l_formatErrorTip":"格式化异常，请检查json格式是否有误：",
    "l_formatErrorTip_en":"Format error, please check input data:",

    "l_timeoutFormatErrorTip":"异常! 超时时间必须是数字，且必须大于1000!",
    "l_timeoutFormatErrorTip_en":"Error! Timeout must be number, and must then 1000!",

    "l_languageChangeTip":"修改成功，刷新页面后生效!",
    "l_languageChangeTip_en":"Change success, Please refresh page!",

    "l_menuWidthErrorTip":"菜单宽度必须大于15，小于50",
    "l_menuWidthErrorTip_en":"Menu width must big than 15, less than 50",

    "l_updateSuccessTip":"修改成功!",
    "l_updateSuccessTip_en":"Update success!",

    "l_netErrorTip":"网络异常",
    "l_netErrorTip_en":"Net error",
    "l_unknownErrorTip":"未知异常",
    "l_unknownErrorTip_en":"Unknown error",

    "l_clickSendTip":"请点击【发送】按钮获取返回数据",
    "l_clickSendTip_en":"Please click [Send] button to get a response",

    "l_responseNotJsonTip":"返回数据不是Json格式",
    "l_responseNotJsonTip_en":"Response data is not json",

    "l_urlIsNullTip":"接口Url不能为空！",
    "l_urlIsNullTip_en":"Interface url can't be null!",

    "l_interfaceNameIsNullTip":"接口名不能为空！",
    "l_interfaceNameIsNullTip_en":"Interface name can't be null！",


    "l_connectingError":"连接网络时发生异常： ",
    "l_connectingError_en":"There was an error connecting to :",

    "l_selectModuleTip":"点击选择模块",
    "l_selectModuleTip_en":"Select module",

    "l_saveInterface" :"保存接口:",
    "l_saveInterface_en" :"Save Interface:",

    "l_edit":"编辑",
    "l_edit_en":"edit",

    "l_closeAlertTip":"请勿禁用【确认】弹窗，直接操作非常危险!",
    "l_closeAlertTip_en":"Do not forbid [confirm] dialog, is very dangerous",

    "l_varSaveSuccess":"环境变量保存成功!",
    "l_varSaveSuccess_en":"Environment Variable Save Success!",

    "l_save" :"提交保存",
    "l_save_en" :"Submit",

    "l_manageEnvVariable":"管理环境变量",
    "l_manageEnvVariable_en":"Manage environment variable",

    "l_noEnvVariable":"暂无环境变量",
    "l_noEnvVariable_en":"No environment",

    "l_envVariable":"未选择环境",
    "l_envVariable_en":"Unselected environment",
    "l_jsonToolErrorTip":"第LINE_NUM行，第POSITION_NUM个字符异常",
    "l_jsonToolErrorTip_en":"Line LINE_NUM, POSITION_NUM character exception",

    "l_loginTitle":"登陆",
    "l_loginTitle_en":"Login",
    "l_editInterfaceTitle":"编辑接口",
    "l_editInterfaceTitle_en":"Edit interface",

    "l_defDebugName":"默认调试项目",
    "l_defDebugName_en":"Def project",
    "l_changeProject":"切换项目",
    "l_changeProject_en":"Change project",

    "l_netError":"网路异常，请检查网络后再试",
    "l_netError_en":"Net error, please check net and try later",

    "l_notLogin":"抱歉，未登录",
    "l_notLogin_en":"Sorry, please login",
    "l_vipTip":"你是VIP用户，最多支持VIP_NUM个项目",
    "l_vipTip_en":"You are vip user, Up to VIP_NUM projects supported",
    "l_notVipTip":"非VIP用户最多支持MAX_NUM个项目，可联系客服88元开通一年VIP（买一年赠一年），VIP用户最多支持50个项目 ",
    "l_notVipTip_en":"You are not vip user, MAX_NUM is max",

    "l_applyPermission":"获取cookie权限失败，接口调试需要获取cookie权限，请重新授权",
    "l_applyPermission_en":"Check cookie permission fail. Need cookie permission to show cookie, please grant."

}

var defInterfaces = [
                {
                     "version": 0,
                     "paramType": "",
                     "moduleId": "154011858172009000003",
                     "id": "1637496636470-4IR9998TO7",
                     "name": "演示-GET：手机归属地查询",
                     "method": "GET",
                     "url": "https://cx.shouji.360.cn/phonearea.php",
                     "params": "number:17688888888",
                     "headers": "",
                     "status": 1,
                     "webProjectId": "154011597595107000015",
                     "webModuleId": "154011858172009000003",
                     "webId": "163749669355812048909"
                },
                {
                     "version": 0,
                     "paramType": "application/x-www-form-urlencoded;charset=UTF-8",
                     "moduleId": "154011858172009000003",
                     "id": "1637496591329-LTRL41OQ6J",
                     "name": "演示-POST：淘宝IP查询",
                     "method": "POST",
                     "url": "https://ip.taobao.com/outGetIpInfo",
                     "params": "accessKey:alibaba-inc\nip:11.11.11.11",
                     "headers": "",
                     "status": 1,
                     "webProjectId": "154011597595107000015",
                     "webModuleId": "154011858172009000003",
                     "webId": "163749669365112048910"
                },
                {
                     "version": 7,
                     "paramType": "application/x-www-form-urlencoded;charset=UTF-8",
                     "moduleId": "154011858172009000003",
                     "id": "1584265849206-SPWMH7IHY1",
                     "name": "演示-POST：普通Form表单参数",
                     "method": "POST",
                     "url": "http://api.crap.cn/visitor/example/post.do",
                     "params": "param:%E6%B5%8B%E8%AF%9522\nemail:crap.cn%40gmail.com\n555:%E6%88%91",
                     "headers": "token:",
                     "status": 1,
                     "webProjectId": "154011597595107000015",
                     "webModuleId": "154011858172009000003",
                     "webId": "158426586290012000025"
                },
                {
                     "version": 3,
                     "paramType": "application/json",
                     "moduleId": "154011858172009000003",
                     "id": "154011913874312000005",
                     "name": "演示-JSON：JSON格式参数",
                     "method": "POST",
                     "url": "http://api.crap.cn/visitor/example/json.do",
                     "params": "{\n\"id\":\"8989-dddvdg\",\n\"name\":\"文章标题-JSON格式参数演示\",\n\"brief\":\"快速入门json参数\",\n\"category\":\"分类\"\n}",
                     "headers": "",
                     "status": 1,
                     "webProjectId": "154011597595107000015",
                     "webModuleId": "154011858172009000003",
                     "webId": "154011913874312000005"
                },
                {
                     "version": 3,
                     "paramType": "application/xml",
                     "moduleId": "154011858172009000003",
                     "id": "154011911702612000002",
                     "name": "演示-XML：XML格式参数",
                     "method": "POST",
                     "url": "http://api.crap.cn/visitor/example/xml.do",
                     "params": "<users>\n<name>用户名</name>\n<value>value值</value>\n</users>",
                     "headers": "",
                     "status": 1,
                     "webProjectId": "154011597595107000015",
                     "webModuleId": "154011858172009000003",
                     "webId": "154011911702612000002"
                }
           ];

