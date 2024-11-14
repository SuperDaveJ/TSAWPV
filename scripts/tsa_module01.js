//// JavaScript Document
//
var verNumber = 2; // 1: for LMS; 2: CD.
var blnAudio;	//default to Audio ON
//var intVersion;
var nLesson = 4;	//TSA Module 1
arrLessonStatus = new Array(nLesson);

var strPagesViewed;
var blnLastPage = false;
var strCourseStatus = "";
var closing = true;

// following are functions
function PageQuery(q) {
	if(q.length > 1) this.q = q.substring(1, q.length);
	else this.q = null;
	this.keyValuePairs = new Array();
	if(q) {
		for(var i=0; i < this.q.split("&").length; i++) {
			this.keyValuePairs[i] = this.q.split("&")[i];
		}
	}

	this.getKeyValuePairs = function() { return this.keyValuePairs; }

	this.getValue = function(s) {
		for(var j=0; j < this.keyValuePairs.length; j++) {
			if(this.keyValuePairs[j].split("=")[0] == s)
				return this.keyValuePairs[j].split("=")[1];
		}
		return false;
	}

	this.getParameters = function() {
		var a = new Array(this.getLength());
		for(var j=0; j < this.keyValuePairs.length; j++) {
			a[j] = this.keyValuePairs[j].split("=")[0];
		}
		return a;
	}

	this.getLength = function() { return this.keyValuePairs.length; } 
}

function getQueryValue(key){
	var page = new PageQuery(window.location.search); 
	return unescape(page.getValue(key)); 
}

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

function goBack(pgURL) {
	//This function is NOT used for this course.
	closing = false;
	var strTemp = getElementStyle('Next','visibility','visibility')
	if ( strTemp == "visible" ) {
		if ( blnLastPage ) {
			updateDatabase()
		} else {
			updateSuspendData()
		}
	}
	window.location = pgURL //+ "?ver=" + verNumber
}

function goNext(pgURL) {
	closing = false;
	if (verNumber != 2) {
		if ( blnLastPage ) {
			updateDatabase()
		} else {
			updateSuspendData()
		}
	}
	window.location = pgURL
}

function refresh() {
	closing = false;
	window.location.reload();
}

function toMenu(blnCloseWin) {
	closing = false;
	if (verNumber != 2) {
		if ( blnLastPage ) {
			updateDatabase()
		} else {
			updateSuspendData()
		}
	}
	window.location = "../neo_m01_mainmenu.htm"
}

function initializePage() {
	closing = true;
	if (verNumber != 2) getSuspendData();
}

function initializeCourse() {
	if (verNumber != 2 ) {
		loadPage();
		if (intLMS > 0) {
			if (typeof(startDate) == "undefined") startDate = new Date().getTime()
			setCookie("startTime", startDate);
	
			var strTemp = doLMSGetValue( "cmi.suspend_data" ); // get suspend data
			if (strTemp == "" || typeof(strTemp) == "undefined") { //first time/no data, set up the data
				//*** suspend_data stores lesson completion status. 0 = not started, 1 = incomplete, 2 = completed.
				strTemp = "0,0,0,0,0,"; 
				doLMSSetValue( "cmi.suspend_data", strTemp );
				doLMSCommit();
			} else {
				strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
				getSuspendData();
			}
		}
	}
}

function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (verNumber != 2) {
		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0
		//if (getPage()!="mainmenu") updateDatabase();
		updateDatabase();
		unloadPage();
	}
	window.close();
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
	arrTemp = new Array();
	arrTemp = window.location.href.split("/");
	strTemp = arrTemp[arrTemp.length-2];
	return parseInt(strTemp.substr(strTemp.length-1,1));
}

function isPageViewed(pageFile) {
	//This function is NOT used for this course.
	//If the Lesson is completed, page must be viewd
	var iLes = getLesson();
	if (arrLessonStatus[iLes-1] >= 2) return true
	if (typeof(strPagesViewed) == "undefined") return false
	if (strPagesViewed.indexOf(pageFile) >= 0) return true
	else return false
}

function getSuspendData() {
	if (verNumber != 2 ) {
		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
			arrLessonStatus = strTemp.split(",");
		}
	}
}

function updateSuspendData() {
	if (verNumber != 2 ) {
		var iLes = getLesson();
		if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 1
		var strTemp = arrLessonStatus.join();
		doLMSSetValue("cmi.suspend_data", strTemp);
		doLMSCommit();
	}
}

function updateDatabase() {
	if (verNumber != 2 ) {
		var pageLocation = "";
		getSuspendData();
		var iLes = getLesson();
		var strCourseStatus = doLMSGetValue( "cmi.core.lesson_status" );
		if (blnLastPage && (strCourseStatus != "completed") ) {
			if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 2
			var nCompleted = 0;
			for (var i=0; i<nLesson; i++) {
				if (arrLessonStatus[i] == 2) nCompleted += 1
			}
			if (nCompleted == nLesson)
				doLMSSetValue("cmi.core.lesson_status", "completed")
			else
				doLMSSetValue("cmi.core.lesson_status", "incomplete")
			pageLocation = "neo_m01_mainmenu.htm"
		} else {
			var strTemp = getPage();
			if (strTemp.indexOf("mainmenu") > 0) {
				//on mainmenu
				pageLocation = "neo_m01_mainmenu.htm"
			} else {
				//not on mainmenu
				pageLocation = "lesson" + iLes + "/" + getPage() + ".htm";
				if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 1
			}
		}
		doLMSSetValue("cmi.core.lesson_location", pageLocation);
		doLMSCommit();
		updateSuspendData();
	}
}

function setCookie(name, value, expire){
	//add a path to make a cookie available cross file folders
	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString())) + "; path=/"
}
//
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
//
function deleteCookie (name) { 
	var exp = new Date();  
	exp.setTime (exp.getTime() - 10);  
	var cookieValue = getCookie (name);  
	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
}
//
//this fuction is for page popup
function transTerm(termNum) {
var intH = self.screenTop + 50
var intW = self.screenLeft + 120
var theURL = getPage()+"pop.htm?popterm=" + termNum
window.open(theURL,"","left="+intW+",top="+intH+",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

//this fuction is for self-check feedback
function showFeedback(feedbackItem) {
	var intH = self.screenTop + 50
	var intW = self.screenLeft + 120
	var theURL = "../508Drill_feedback.htm?popterm=" + feedbackItem
	window.open(theURL,"","left="+intW+",top="+intH+",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

//this fuction is for drill exercise feedback.  Single file in the root directory is used for all.
function showDrillFeedback(termNum) {
var intH = self.screenTop + 50
var intW = self.screenLeft + 120
var theURL = "../neoDrill_feedback.htm?popterm=" + termNum
window.open(theURL,"","left="+intW+",top="+intH+",width=399,height=230,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}
