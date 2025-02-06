function drawProjectDAO(response) {
    if (response.success == 1){
        var html = "";
        var projectId = null;
        for(var i=0 ; i< response.data.length; i++) {
            var project = response.data[i];
            html = html +   "<input type='radio' name='selected-project' ";
            if (project.uniKey == getCurrentProjectUniKey()){
                html = html + " checked=true ";
                projectId = project.id;
            }
            html = html + " value='" + encodeURIComponent(JSON.stringify(project))  + "'/> &nbsp;&nbsp;" + project.name + "<br/>";
        }
        setHtml(ID_PROJECT_LIST_CONTENT, html);

        if (projectId){
            httpPost("/user/project/detail.do?id=" + projectId, true, drawProjectDetailDAO);
        }

        var loginInfo = getLocJsonData(USER_LOGIN_INFO, "{}");

        // 登陆
        if (loginInfo.sessionAdminName){
            var vipNum = loginInfo.settingMap.VIP_PLUG_PRO_NUM;
            var maxNum = loginInfo.settingMap.PLUG_MAX_PRO_NUM;
            if (loginInfo.attributes && loginInfo.attributes.indexOf(";vipPostWoman:1;") >= 0){
               setHtml(ID_MAX_PROJECT_TIP, getText(l_vipTip).replace("VIP_NUM", vipNum));
            } else {
                showDiv(ID_CONTRACT);
                setHtml(ID_MAX_PROJECT_TIP, getText(l_notVipTip).replace("VIP_NUM", vipNum).replace("MAX_NUM", maxNum));
            }
        }

        return;
    }

    if (response.error && response.error.code == 'E000021'){
        setHtml(ID_PROJECT_LIST_CONTENT, getText(l_notLogin));
        return;
    }

    if (response.error){
        setHtml(ID_PROJECT_LIST_CONTENT, getText(l_netError) + "#" + response.error.message);
        return
    }
    setHtml(ID_PROJECT_LIST_CONTENT, getText(l_netError));
}

function drawProjectDetailDAO(response) {
    if (response.success == 1){
        var project = response.data;
        showDiv("id-invite-user");
        setHtml("id-invite-project-name", project.name);
        setAttr("id-invite-project-name", "href", getWebSiteUrl() + "/admin.do#/user/project?pageName=项目详情&dataType=interface&menu_a=menu-project&menu_b=menu_main&projectId=" + project.id)
        setHtml("id-invite-url", project.inviteUrl);
    }
}

$(function() {
    var pageName = getValue("id-page-name")
    if(pageName == "changeProject"){
        httpPost("/user/project/list.do?isPlug=true", true, drawProjectDAO, null, 5000);
    }

    $("#" + ID_CHANGE_PROJECT).click(function () {
        var selectVal = $("input[name='selected-project']:checked").val();
        var projectStr = decodeURIComponent(selectVal);
        var project = $.parseJSON(projectStr);

        if (project.name.length > 15) {
            project.name = project.name.substr(0, 15) + "...";
        }
        if (project.cover && project.cover.indexOf("http") != 0) {
            project.cover = getWebSiteUrl() + "/" + project.cover;
        }
        setCurrentProjectUniKey(project.uniKey, project.name, project.cover);
        window.parent.location.reload();
    });
});