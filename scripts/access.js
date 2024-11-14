// JavaScript Document

var opened='';
var AudioFile='';

function setAudioFile(filename) {
	AudioFile=filename;
	//alert(AudioFile);
}

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

function setupAudio() {
	if (blnAudio == "on") {
		document.getElementById("AudioHolder").style.visibility = "visible"
		document.getElementById("AudioOn").style.visibility = "visible"
	} else {
		document.getElementById("AudioHolder").style.visibility = "hidden"
		document.getElementById("AudioOff").style.visibility = "visible"
	}
}

function toggleAudio() {
	if (blnAudio == "on") {
		MM_controlShockwave('swfAudio','','StopPlay');
		document.getElementById("AudioOn").style.visibility = "hidden"
		document.getElementById("AudioOff").style.visibility = "visible"
		document.getElementById("AudioHolder").style.visibility = "hidden"
	} else {
		MM_controlShockwave('swfAudio','','Play');
		document.getElementById("AudioOn").style.visibility = "visible"
		document.getElementById("AudioOff").style.visibility = "hidden"
		document.getElementById("AudioHolder").style.visibility = "visible"
	}
	blnAudio =  (blnAudio == "on") ? "off": "on";
	if (verNumber == 2) {
		setCookie("neoAudio", blnAudio)
	}
}

function audioDo(doWhat,toWhat,audioOn){
   if(audioOn){
      var A = eval('document.'+toWhat);
      if (A != null){
         if (doWhat=='stop') A.stop();
         else{
            if (navigator.appName == 'Netscape') A.play();
            else{
               if (document.M == null){
                  document.M = false; var m;
                  for(m in A) if (m == "ActiveMovie"){
                     document.M = true; break;
                     }
                  }
               if (document.M) A.SelectionStart = 0;
               if (document.M) A.play();
            }
         }
      }
   }
}

function showResults(){
	//ccStatus is used for CC. However, because of the original design, when audio is on CC is off.
	var ccStatus
	if (verNumber > 2) {
		ccStatus = blnCCon
	} else {
		ccStatus = getCookie('GuideAudio')
	}
	
	if (ccStatus == 1) {
		MM_showHideLayers('CCoff','','hide')
		MM_showHideLayers('CCon','','show')
		document.getElementById('GlinkText').innerHTML="<a href='javascript:;' class='OptG' onClick='setGuide()'>Closed Captioning On</a><br>"; 
	} else {
		MM_showHideLayers('CCon','','hide')
		MM_showHideLayers('CCoff','','show')
		document.getElementById('GlinkText').innerHTML="<a href='javascript:;' class='OptG' onClick='setGuide()'>Closed Captioning Off</a><br>";
	}
}

function openHelp() {
	window.open("../help.htm", "Help", "left=100, top=100, width=600, height=400, resizable=no, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function openGlossary() {
	window.open("../glossary.htm", "Glossary", "left=100, top=100, width=600, height=400, resizable=no, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}
