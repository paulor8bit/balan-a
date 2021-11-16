var AutorConfig = "FALSE";
function actionTouche(type, tailleMax) {
    var Champ = document.getElementById("sais").value;
    if (type != "ALN_E") Champ = Champ.toUpperCase();
    var Reg = GetRegex(type);
    if (Champ.match(Reg) != null) document.getElementById("sais").value = Champ.replace(Reg, "");
    else document.getElementById("sais").value = Champ;
}
function GetRegex(type) {
    switch (type) {
        case "ALN":
            var Reg = new RegExp("[^A-Z0-9 .:/]", "g");
            break;
        case "ALN_E":
            var Reg = new RegExp("[^A-Za-z0-9 .:/_-]", "g");
            break;
        case "NUM":
            var Reg = new RegExp("[^0-9]", "g");
            break;
        case "SNUM":
            var Reg = new RegExp("[^0-9-]", "g");
            break;
        case "REEL_VALID":
            var Reg = new RegExp("^-?[0-9]*.?[0-9]+$", "g");
            break;
        case "REEL":
            var Reg = new RegExp("[^0-9.]", "g");
            break;
        case "SREEL":
            var Reg = new RegExp("[^0-9.-]", "g");
            break;
        case "DATE_JJ/MM":
            var Reg = new RegExp("^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\\d\\d$", "g");
            break;
        case "DATE_MM/DD":
            var Reg = new RegExp("^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\\d\\d$", "g");
            break;
        case "HEURE":
            var Reg = new RegExp("([0-1]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)", "g");
            break;
        default:
            break;
    }
    return Reg;
}
function verifierIP(ip) {
    var reg = new RegExp("^\\d{3}[.]\\d{3}[.]\\d{3}[.]\\d{3}$", "g");
    if (reg.exec(ip) == null) {
        return false;
    } else {
        var tab = ip.split(".");
        var compterreur = 0;
        for (i = 0; i < 4; i++) {
            if (tab[i] - "0" > 255) {
                compterreur++;
            }
        }
        if (compterreur == 0) {
            return true;
        } else {
            return false;
        }
    }
}
function ValiderSaisie(MsgErrRegex, type, nomChamp) {
    var Info = document.getElementById("info");
    var ValeurVerif = false;
    var Reg;
    var Champ = document.getElementById(nomChamp).value;
    Info.value = type;
    if (Info.value == "ADRIP") {
        ValeurVerif = verifierIP(Champ);
    } else {
        if (Info.value == "LISTE" || Info.value == "ACTION" || Info.value == "NUM" || Info.value == "ALN" || Info.value == "ALN_E" || Info.value == "SNUM") ValeurVerif = true;
        else {
            if (Info.value == "REEL") Info.value = "REEL_VALID";
            Reg = GetRegex(Info.value);
            if (Champ.match(Reg) != null) ValeurVerif = true;
        }
    }
    if (ValeurVerif == true) requete("menu.cgi", "Valider", "POST");
    else {
        alert(MsgErrRegex);
        Info.value = "";
    }
}
function sendForm(action, n_menu, method) {
    var xhr = GetXmlHttpObject();
    switch (n_menu) {
        case "UP_CONFIG":
            var form = document.getElementById("Config");
            break;
        case "UP_FICHE_PROD":
            var form = document.getElementById("FicheProduit");
            break;
        case "UP_FICHE_TARE":
            var form = document.getElementById("FicheTare");
            break;
        default:
            var form = document.getElementById("form");
            break;
    }
    var info = document.getElementById("info");
    var RET_ActUtil = document.getElementById("RET_ActUtil");
    if (info != null) info.value = n_menu;
    if (n_menu == "UP_CONFIG" || n_menu == "UP_FICHE_PROD" || n_menu == "UP_FICHE_TARE") {
        xhr.open("GET", "Demande.cgx?commande=" + n_menu, false);
        xhr.send(null);
        form.enctype = "multipart/form-data";
        form.encoding = "multipart/form-data";
        info.parentNode.removeChild(info);
        RET_ActUtil.parentNode.removeChild(RET_ActUtil);
    }
    if (n_menu == "Index" && AutorConfig == "FALSE") {
        alert(MsgErrAutor);
        return;
    }
    if (action == "restart.cgi") {
        if (confirm(MsgSortie) == false) return;
    }
    form.action = action;
    form.method = method;
    form.submit();
}
var formUpdate = new periodicObj("ValPoids.cgx", 500);
function CallbackPeriodicUp() {
    pdsVal = document.getElementById("ValPoids").value;
    AutorConfig = document.getElementById("info").value;
}
function PeriodicUpdate() {
    updateMultiple(formUpdate, CallbackPeriodicUp);
    pds_Time = setTimeout(PeriodicUpdate, formUpdate.period);
}
var formUpdatePMnet = new periodicObj("UpdatePMnet.cgx", 500);
function CallbackPeriodicUpPMnet() {
    for (i = 1; i <= 19; i++) {
        statut = document.getElementById("StatusCapteur" + i).value;
        Capteur = document.getElementById("CodeCapteur" + i);
        if (MenuAngle == 0) {
            var div = document.createElement("div");
            div.innerHTML = MsgStatutAbsent;
            MsgStatutAbsent = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutInactif;
            MsgStatutInactif = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutAinstaller;
            MsgStatutAinstaller = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutOK;
            MsgStatutOK = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutRemplacant;
            MsgStatutRemplacant = div.firstChild.nodeValue;
            switch (statut) {
                case MsgStatutAbsent:
                    Capteur.style.color = "red";
                    break;
                case MsgStatutInactif:
                    Capteur.style.color = "blue";
                    break;
                case MsgStatutAinstaller:
                    Capteur.style.color = "darkcyan";
                    break;
                case MsgStatutOK:
                case MsgStatutRemplacant:
                    Capteur.style.color = "green";
                    break;
                default:
                    break;
            }
        } else {
            var div = document.createElement("div");
            div.innerHTML = MsgStatutAnglePasFait;
            MsgStatutAnglePasFait = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutAngleDejaFait;
            MsgStatutAngleDejaFait = div.firstChild.nodeValue;
            div.innerHTML = MsgStatutAngleFait;
            MsgStatutAngleFait = div.firstChild.nodeValue;
            switch (statut) {
                case MsgStatutAnglePasFait:
                    Capteur.style.color = "red";
                    break;
                case MsgStatutAngleDejaFait:
                    Capteur.style.color = "blue";
                    break;
                case MsgStatutAngleFait:
                    Capteur.style.color = "green";
                    break;
                default:
                    break;
            }
        }
        if ("CodeCapteur" + i == Capteur_sel) Capteur.style.backgroundColor = "lightGray";
        else Capteur.style.backgroundColor = "white";
    }
}
function PeriodicUpdatePMnet() {
    updateMultiple(formUpdatePMnet, CallbackPeriodicUpPMnet);
    pds_Time = setTimeout(PeriodicUpdatePMnet, formUpdatePMnet.period);
}
function noBack() {
    window.history.forward();
}
function Vide() {
    void 0;
}
function sleep(ms) {
    var dt = new Date();
    dt.setTime(dt.getTime() + ms);
    while (new Date().getTime() < dt.getTime());
}
function requete(action, commande, method) {
    var xhr = GetXmlHttpObject();
    var info = document.getElementById("info");
    if (commande == "Sauvegarder") var Msg = MsgSauv;
    else var Msg = MsgConfirm;
    if (commande != "Restart" && commande != "Zero" && commande != "DL_Config" && commande != "DL_FichesProduit" && commande != "DL_FichesTare") {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var dataRecue = xhr.responseXML;
                var noeudPU = dataRecue.getElementsByTagName("PopUp");
                var noeudPP = dataRecue.getElementsByTagName("PagePerso");
                if (noeudPU[0].getAttribute("Val") == "TRUE") {
                    if (confirm(Msg) == true) document.getElementById("RET_ActUtil").value = 1;
                    else document.getElementById("RET_ActUtil").value = 0;
                }
                if (noeudPP[0].getAttribute("Val") == "TRUE" && info.value != "ACTION") {
                    action = "saisie.cgi";
                }
                if (commande == "Valider") sendForm(action, info.value, method);
                else sendForm(action, commande, method);
            }
        };
    }
    if (commande == "Restart") {
        xhr.open("GET", "Demande.cgx?commande=" + commande, true);
    } else {
        xhr.open("GET", "Demande.cgx?commande=" + commande, false);
    }
    xhr.send(null);
    if (commande == "DL_Config" || commande == "DL_FichesProduit" || commande == "DL_FichesTare") {
        sleep(1000);
        sendForm(action, commande, method);
    }
}
function SaisiePosition(idPosition) {
    Select_Capt("CodeCapteur" + idPosition);
    for (i = 1; i <= 19; i++) {
        Capteur = document.getElementById("CodeCapteur" + i);
        if ("CodeCapteur" + i == Capteur_sel) Capteur.style.backgroundColor = "lightGray";
        else Capteur.style.backgroundColor = "white";
    }
    CodeCapteur = document.getElementById(Capteur_sel).value;
    if (CodeCapteur != " ") {
        var answer = prompt(MsgSaisiePosition + CodeCapteur);
        if (answer != null) {
            var xhr = GetXmlHttpObject();
            idPosition = idPosition.toString();
            while (idPosition.length < 2) idPosition = "0" + idPosition;
            while (answer.length < 2) answer = "0" + answer;
            xhr.open("GET", "Etat_Pmnet.cgx?commande=" + "PMN_AFFECT_POS" + idPosition + answer, false);
            xhr.send(null);
        }
    }
}
function Select_Capt(capteur) {
    Capteur_sel = capteur;
}
function SauvegardePMNET(commande) {
    var xhr = GetXmlHttpObject();
    img1 = new Image();
    img1.src = "Loading.gif";
    xhr.open("GET", "Etat_Pmnet.cgx", false);
    xhr.send(null);
    var dataRecue = xhr.responseXML;
    var modifPmnet = dataRecue.getElementsByTagName("ModifPMNET");
    if (modifPmnet[0].getAttribute("Val") == "TRUE") {
        var save = "FALSE";
        if (commande == "PMN_SAVE_REGLAGE") {
            if (confirm(MsgSauv) == true) var save = "TRUE";
        }
        var windowWidth = 200;
        var windowHeight = 200;
        var centerLeft = parseInt((window.screen.availWidth - windowWidth) / 2);
        var centerTop = parseInt((window.screen.availHeight - windowHeight) / 2);
        var misc_features = ", status=no, location=no, scrollbars=no, resizable=no, titlebar=no, toolbar=no, menubar=no";
        var windowFeatures = "width=" + windowWidth + ",height=" + windowHeight + ",left=" + centerLeft + ",top=" + centerTop + misc_features;
        var popup = window.open("", "pop", windowFeatures);
        var popdoc;
        if (popup) {
            popdoc = popup.document;
            popdoc.write("<img src='Loading.gif' border='0' alt='Please Wait...'/>");
        }
        xhr.open("GET", "Etat_Pmnet.cgx?commande=" + commande + save, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                sleep(8000);
                window.location.href = "menu.cgi?RET_ActUtil=-1&info=1";
                popup.close();
            }
        };
        xhr.send(null);
    } else window.location.href = "menu.cgi?RET_ActUtil=-1&info=1";
}
function SupprimeAllCapteurs() {
    if (confirm(MsgConfirmSuppressionTous) == true) {
        var xhr = GetXmlHttpObject();
        xhr.open("GET", "Etat_Pmnet.cgx?commande=PMN_ALL_SUPPR", false);
        xhr.send(null);
    }
}
function SupprimeCapteur() {
    if (Capteur_sel != 0) {
        if (document.getElementById(Capteur_sel).value != " ") {
            var MsgConfirmSupp = MsgConfirmSuppression + document.getElementById(Capteur_sel).value;
            if (confirm(MsgConfirmSupp) == true) {
                var xhr = GetXmlHttpObject();
                xhr.open("GET", "Etat_Pmnet.cgx?commande=PMN_SUPPR" + Capteur_sel, false);
                xhr.send(null);
            }
        }
    } else alert(MsgSelectCapteur);
}
function RemplaceCapteur() {
    if (Capteur_sel != 0) {
        if (document.getElementById(Capteur_sel).value != " ") {
            var PosCapteur = Capteur_sel.substr(11);
            PosCapteur = document.getElementById("PosCapteur" + PosCapteur).value;
            if (PosCapteur != "--") {
                var MsgConfirmRemp = MsgConfirmRemplacement + PosCapteur;
                if (confirm(MsgConfirmRemp) == true) {
                    var xhr = GetXmlHttpObject();
                    xhr.open("GET", "Etat_Pmnet.cgx?commande=PMN_REMPLACE" + Capteur_sel, false);
                    xhr.send(null);
                }
            } else alert(MsgPasdeposition);
        }
    } else alert(MsgSelectCapteur);
}
function NouveauCapteur() {
    var answer = prompt(MsgSaisieCapteur);
    if (answer != null) {
        while (answer.length < 13) answer = "0" + answer;
        var xhr = GetXmlHttpObject();
        xhr.open("GET", "Etat_Pmnet.cgx?commande=PMN_NOUVEAU" + answer, false);
        xhr.send(null);
    }
}
function CompenseCapteur() {
    if (Capteur_sel != 0) {
        if (document.getElementById(Capteur_sel).value != " ") {
            if (confirm(MsgConfirm) == true) {
                var xhr = GetXmlHttpObject();
                xhr.open("GET", "Etat_Pmnet.cgx?commande=PMN_COMPENSE" + Capteur_sel, false);
                xhr.send(null);
            }
        }
    } else alert(MsgSelectCapteur);
}
function Init_PMNET() {
    noBack();
    PMNET_Control_Zero();
}
function PMNET_Control_Zero() {
    var xhr = GetXmlHttpObject();
    xhr.open("GET", "Etat_Pmnet.cgx", false);
    xhr.send(null);
    var dataRecue = xhr.responseXML;
    var Etat_Zero = dataRecue.getElementsByTagName("PMNET_Etat_Zero");
    if (Etat_Zero[0].getAttribute("Val") == "PAS_FAIT") {
        alert(MsgAlerteZero);
    }
}
