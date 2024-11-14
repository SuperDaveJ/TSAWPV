// JavaScript Document

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

function MM_setTextOfLayer(objName,x,newText) { //v4.01
  if ((obj=MM_findObj(objName))!=null) with (obj)
    if (document.layers) {document.write(unescape(newText)); document.close();}
    else innerHTML = unescape(newText);
}
function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
function MM_goToURL() { //v3.0
  var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}

function MM_controlShockwave(objStr,x,cmdName,frameNum) { //v3.0
  var obj=MM_findObj(objStr);
  if (obj) eval('obj.'+cmdName+'('+((cmdName=='GotoFrame')?frameNum:'')+')');
}

//=========== Audio Control Functions ===================
var audioOn;
var timerID = null;
var pgReplay = false;
var noInteraction = true;
var blnShowNextPointer = false;

function showBullets(bulletN) {
	eval("MM_showHideLayers('" + bulletN + "', '', 'show')");
}

function showNext() {
	document.getElementById("Next").style.visibility = "visible";
	document.getElementById("prompt").style.visibility = "visible";
	if (blnShowNextPointer) {
		document.getElementById("nextPointer").style.visibility = "visible";
	}
}

function closePop(delayTime) {
/* This functionality is removed by Vienna's request
	if (winPop && !winPop.closed) {
		setTimeout("winPop.close()", delayTime);
		//the following line should not be here. but it won't work without it.
		winPop.close();
	}
*/
}

function aPlay() {
	//if it's already on do nothing
	if (audioOn != 1) {
		MM_controlShockwave('swfFile','','Play');	
		startTimer();
		document.getElementById("pause2").style.visibility = "hidden";
		document.getElementById("pause1").style.visibility = "visible";
	}
}

function aPause() {
	MM_controlShockwave('swfFile','','StopPlay');
	stopTimer()
	document.getElementById("pause1").style.visibility = "hidden";
	document.getElementById("pause2").style.visibility = "visible";
}

function aStop() {
	MM_controlShockwave('swfFile','','StopPlay');
	MM_controlShockwave('swfFile','','Rewind');
	stopTimer()
}

function aReplay() {
	//Client wants to start from the beginning for some pages.  It's easier to reload the page
	if (pgReplay) {
		closing = false;
		window.location.reload();
	} else {
		if (audioOn = 1) stopTimer();
		MM_controlShockwave('swfFile','','Rewind');
		MM_controlShockwave('swfFile','','Play');	
		startTimer();
		document.getElementById("pause2").style.visibility = "hidden";
		document.getElementById("pause1").style.visibility = "visible";
	}
}

function checkAudioPlaying() {
	if (swfFile.IsPlaying() ) {
		timerID = setTimeout("checkAudioPlaying()", 1000);
	} else {
		stopTimer();
		if (autoRun) goNext()
		else if (noInteraction) showNext()
	}
}

function startTimer() {
	document.getElementById("play1").style.visibility = "hidden";
	document.getElementById("play2").style.visibility = "visible";
	audioOn = 1;
	checkAudioPlaying();
}

function stopTimer() {
	clearTimeout(timerID);
	timerID = null;
	audioOn = 0;
	document.getElementById("play2").style.visibility = "hidden";
	document.getElementById("play1").style.visibility = "visible";
}

function MM_controlShockwave(objStr,x,cmdName,frameNum) { //v3.0
  var obj=MM_findObj(objStr);
  if (obj) eval('obj.'+cmdName+'('+((cmdName=='GotoFrame')?frameNum:'')+')');
}

//=========== End of Audio Control Functions ===================

//this fuction is for page popup
var winPop;
function showPopup(termNum) {
	//close the previous popup window if it's open
/* This functionality is removed by Vienna's request
	if (winPop && !winPop.closed) {
	 	winPop.close();
	}
*/
	//*** for IE 7: parseInt(navigator.appVersion) = 4
	var winW, winH;
	if (parseInt(navigator.appVersion)>3) {
	 if (navigator.appName=="Netscape") {
	  winW = window.innerWidth;
	  winH = window.innerHeight;
	 }
	 if (navigator.appName.indexOf("Microsoft")!=-1) {
	  winW = document.body.offsetWidth;
	  winH = document.body.offsetHeight;
	 }
	}
	winH = 600;
	var popW = 610;
	var popH = 354;
	var intTop = window.screenTop + (winH - popH)/2;
	var intLeft = window.screenLeft + (winW - popW)/2;
	
	var theURL = getPage()+"pop.htm?popterm=" + termNum
	winPop = window.open(theURL,"","left="+intLeft+",top="+intTop+",width="+popW+",height="+popH+",resizable=yes,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function openGlossary() {
	//This condition block of code is added after course is completed.
	if (openGlossary.arguments.length > 0) {
		path = "";
	} else {
		path = "../";
	}
	window.open(path + "tsa_glossary.htm", "Glossary", "left=100, top=100, width=625, height=500, resizable=yes, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}
5
function openResources() {
	//This condition block of code is added after course is completed.
	if (openResources.arguments.length > 0) {
		path = "";
	} else {
		path = "../";
	}
	window.open(path + "tsa_resources.htm", "Resources", "left=100, top=100, width=625, height=500, resizable=yes, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function openHelp() {
	//This condition block of code is added after course is completed.
	if (openHelp.arguments.length > 0) {
		path = "";
	} else {
		path = "../";
	}
	window.open(path + "tsa_help.htm", "Help", "left=100, top=100, width=625, height=500, resizable=yes, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function openSitemap() {
	//This condition block of code is added after course is completed.
	if (openSitemap.arguments.length > 0) {
		path = "";
	} else {
		path = "../";
	}
	window.open(path + "tsa_sitemap.htm", "Sitemap", "left=100, top=100, width=625, height=500, resizable=yes, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

// following are query functions
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
