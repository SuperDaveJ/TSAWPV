// TSA LMS JavaScript functions

var inLMS;
var blnFirstTime = true;	
var strObjStatus = "";
var nLesson = 5;	//TSA. including quick tour which has an index of 0.
arrLessonStatus = new Array(nLesson);
var strPagesViewed;
var blnLastPage = false;
var strCourseStatus = "";
var closing = true;

function initializePage() {
	closing = true;
	inLMS = getQueryValue('inLMS');
	if (inLMS == "yes") getSuspendData()
	//Following line are not included in Nov. 25 delivery.
	//else document.getElementById("next").style.visibility = "visible";
}

function initializeCourse() {
	loadPage();
	//inLMS is set in loadPage() function in SCOFunctions.js file
	if (inLMS == "yes") {
		if (typeof(startDate) == "undefined") startDate = new Date().getTime()
		setCookie("startTime", startDate);

		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		if (strTemp == "" || typeof(strTemp) == "undefined") {
			blnFirstTime = true;
			strTemp = "0,0,0,0,0~";
			doLMSSetValue( "cmi.suspend_data", strTemp );
			doLMSCommit();
		} else {
			blnFirstTime = false;
			strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
			getSuspendData();
		}
	}
}

function goBack() {
	closing = false;
  	if (inLMS == "yes")  {	//LMS versions
		var strTemp = getElementStyle('next','visibility','visibility')
		if ( strTemp == "visible" ) {
			if ( blnLastPage ) {
				updateDatabase();
			} else {
				updateSuspendData();
			}
		}
  	}
	window.location = prvPage + "?inLMS=" + inLMS;
}

function goNext() {
	closing = false;
	if (inLMS == "yes") {
		if ( blnLastPage ) {
			updateDatabase();
		} else {
			updateSuspendData();
		}
	}
	window.location = nextPage + "?inLMS=" + inLMS;
}

function doJump(pgURL) {
	closing = false;
	inLMS = getQueryValue('inLMS')
	window.location = pgURL + "?inLMS=" + inLMS
}

function refresh() {
	closing = false;
	window.location.reload();
}

function goMenu(blnCloseWin) {
	closing = false;
	if (inLMS == "yes") {
		var strTemp = getElementStyle('next','visibility','visibility')
		if ( strTemp != "hidden" ) {
			if ( blnLastPage ) {
				updateDatabase()
			} else {
				updateSuspendData()
			}
		}
	}
	window.location.href = menuPage + "?inLMS=" + inLMS;
}

function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (confirm("Do you wish to exit the course?") == true) {
		if (inLMS == "yes") {
			startDate = getCookie("startTime");
			if (typeof(startDate) == "undefined") startDate = 0
			updateDatabase();
			unloadPage();
		}
		//If the course is run in the frame window.  It will not close.
		//We may need to load a blank page instead.
		window.close();
	}
}

function getPage() {
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = window.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
}

function getLesson() {
	var strTemp = getPage();
	return parseInt(strTemp.substr(1,1));	//2nd character of the page file name.
}

function setLessonStatus(iLes, lesStatus) {
	arrLessonStatus[iLes] = lesStatus;
	updateSuspendData();
}

function isPageViewed(pageFile) {
	//pageFile should not include the ".htm" extension.
	pageFile = pageFile.toLowerCase()
	var intTemp = pageFile.indexOf(".htm")
	if (intTemp != -1) pageFile = pageFile.substring(0,intTemp)
	var iLes = parseInt(pageFile.substr(1,1));
	if (iLes >= 0) {	//We may not need this condition if quick tour is not included.
		if (arrLessonStatus[iLes] >= 2) return true
	}
	if (typeof(strPagesViewed) == "undefined") return false
	if (strPagesViewed.indexOf(pageFile) >= 0) return true
	else return false
}

function updateSuspendData() {
   	if ((strPagesViewed == "") || (typeof(strPagesViewed) == "undefined")) {
		strPagesViewed = ""
	}
	var iLes = getLesson();
	if ( (strPagesViewed.indexOf(getPage()) == -1) && (arrLessonStatus[iLes] < 2) ) {
		strPagesViewed = strPagesViewed + "," + getPage();
	}
	if (arrLessonStatus[iLes] < 2) arrLessonStatus[iLes] = 1
	var strTemp = arrLessonStatus.join();
	strTemp = strTemp + "~" + strPagesViewed;
	doLMSSetValue("cmi.suspend_data", strTemp);
	doLMSCommit();
}

function getSuspendData() {
	//For TSA: suspend_data contains 2 pieces of information separated by "~".
	//First one is lesson status separated by "," for each lesson. 0=not started, 1=incomplete, 2=completed.
	//		There are 5 lessons. lesson 0 is quick tour
	//Second one is pages viewed separated by ",".
	var strTemp = doLMSGetValue( "cmi.suspend_data" );
	if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
		arrTemp = new Array();
		arrTemp = strTemp.split("~");
		var strTemp = arrTemp[0];
		for (i=0; i<nLesson; i++) {
			arrLessonStatus[i] = parseInt(strTemp.charAt(2*i));
		}
		strPagesViewed = arrTemp[1];
	}
}

function cleanSuspendData() {
	var re = /,,/g;
	var strTemp = strPagesViewed.toLowerCase();
	for (var i=0; i<nLesson; i++) {
		if (arrLessonStatus[i] >= 2) {
			//do clean up
			arrTemp = strTemp.split(",")
			for (var j=0; j<arrTemp.length; j++) {
				if ( parseInt(arrTemp[j].substr(1,1)) == i ) arrTemp[j] = ""
			}
			strTemp = arrTemp.join();
			while (strTemp.indexOf(",,") != -1) {
				str2 = strTemp.replace(re,",");
				strTemp = str2;
			}
		}
	}
	//after cleaned
	strPagesViewed = strTemp;
}

function updateDatabase() {
	var pageLocation = "";
	getSuspendData();
	var iLes = getLesson();
	var strCourseStatus = doLMSGetValue( "cmi.core.lesson_status" );
	if (blnLastPage && (strCourseStatus != "passed") ) {
		if (arrLessonStatus[iLes] < 2) arrLessonStatus[iLes] = 2
		cleanSuspendData();
		var nCompleted = 0;
		var nPassed = 0;
		for (var i=1; i<nLesson; i++) {
			if (arrLessonStatus[i] == 2) nCompleted += 1
			if (arrLessonStatus[i] == 3) nPassed += 1
		}
		if (nPassed > 0)
			doLMSSetValue("cmi.core.lesson_status", "passed")
		else if (nCompleted >= nLesson-1)
			//TSA requested to change completed to passed. Nov. 2008
			doLMSSetValue("cmi.core.lesson_status", "passed")
		else
			doLMSSetValue("cmi.core.lesson_status", "incomplete")
	} else {
			pageLocation = "lesson" + iLes + "/" + getPage() + ".htm";
			if (arrLessonStatus[iLes] < 2) arrLessonStatus[iLes] = 1
	}
	if (blnLastPage) pageLocation = "m01_mainmenu.htm"
	doLMSSetValue("cmi.core.lesson_location", pageLocation);
	doLMSCommit();
	updateSuspendData();
}

function setCookie(name, value, expire){
	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString()))
}

function getCookie(Name) {
	var Mysearch = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(Mysearch);
		if (offset != -1){
			offset += Mysearch.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

function deleteCookie (name) { 
	var exp = new Date();  
	exp.setTime (exp.getTime() - 10);  
	var cookieValue = getCookie (name);  
	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
}

//*********** additional functions ************************
function getElementStyle(elemID, IEStyleProp, CSSStyleProp) {
    var elem = document.getElementById(elemID);
    if (elem.currentStyle) {
        return elem.currentStyle[IEStyleProp];
    } else if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle(elem, "");
        return compStyle.getPropertyValue(CSSStyleProp);
    }
    return "";
}
