function updateMultiple(formUpd, callBack, userName, userPassword) {
    xmlHttp = GetXmlHttpObject();
    if (xmlHttp == null) {
        alert("XmlHttp not initialized!");
        return 0;
    }
    xmlHttp.onreadystatechange = responseHandler;
    xmlHttp.open("GET", formUpd.url, true, userName, userPassword);
    xmlHttp.send(null);
    function responseHandler() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var xmlDoc = xmlHttp.responseXML;
                if (xmlDoc == null) return 0;
                try {
                    processResponse(xmlDoc);
                } catch (e) {
                    return 0;
                }
                if (callBack != undefined) callBack();
            } else if (xmlHttp.status == 401) alert("Error code 401: Unauthorized");
            else if (xmlHttp.status == 403) alert("Error code 403: Forbidden");
            else if (xmlHttp.status == 404) console.log(':)');
            // else if (xmlHttp.status == 404) alert("Error code 404: URL not found!");
        }
    }
}
function processResponse(xmlDoc) {
    textElementArr = xmlDoc.getElementsByTagName("text");
    for (var i = 0; i < textElementArr.length; i++) {
        try {
            elId = textElementArr[i].childNodes[0].childNodes[0].nodeValue;
            elValue = textElementArr[i].childNodes[1].childNodes[0].nodeValue;
            document.getElementById(elId).value = elValue;
        } catch (error) {
            if (elId == undefined) {
                continue;
            } else if (elValue == undefined) {
                elValue = "";
                document.getElementById(elId).value = elValue;
            }
        }
    }
    checkboxElementArr = xmlDoc.getElementsByTagName("checkbox");
    for (var i = 0; i < checkboxElementArr.length; i++) {
        try {
            elId = checkboxElementArr[i].childNodes[0].childNodes[0].nodeValue;
            elValue = checkboxElementArr[i].childNodes[1].childNodes[0].nodeValue;
            if (elValue.match("true")) document.getElementById(elId).checked = true;
            else document.getElementById(elId).checked = false;
        } catch (error) {
            if (elId == undefined) {
                continue;
            } else if (elValue == undefined) continue;
        }
    }
    selectElementArr = xmlDoc.getElementsByTagName("select");
    for (var i = 0; i < selectElementArr.length; i++) {
        try {
            elId = selectElementArr[i].childNodes[0].childNodes[0].nodeValue;
            elValue = selectElementArr[i].childNodes[1].childNodes[0].nodeValue;
            document.getElementById(elId).value = elValue;
            if (elValue.match("true")) document.getElementById(elId).selected = true;
            else document.getElementById(elId).selected = false;
        } catch (error) {
            if (elId == undefined) {
                continue;
            } else if (elValue == undefined) {
                elValue = "";
                document.getElementById(elId).value = elValue;
            }
        }
    }
    radioElementArr = xmlDoc.getElementsByTagName("radio");
    for (var i = 0; i < radioElementArr.length; i++) {
        try {
            elId = radioElementArr[i].childNodes[0].childNodes[0].nodeValue;
            elValue = radioElementArr[i].childNodes[1].childNodes[0].nodeValue;
            if (elValue.match("true")) document.getElementById(elId).checked = true;
            else document.getElementById(elId).checked = false;
        } catch (error) {
            if (elId == undefined) {
                continue;
            } else if (elValue == undefined) continue;
        }
    }
}
function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        xmlHttp = new XMLHttpRequest();
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}
function periodicObj(url, period) {
    this.url = url;
    this.period = typeof period == "undefined" ? 0 : period;
}
