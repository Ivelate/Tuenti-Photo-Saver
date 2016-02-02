document.addEventListener('DOMContentLoaded', function() //Only executes js when HTML is loaded
{
	
var inputText=document.getElementById('downloadfolder');
inputText.focus(); //Auto focus on text input
var downloadRoute=document.getElementById('rutasave');

//Updates destination route text
function updateDownloadRoute()
{
	var route=inputText.value.trim();
	if(route.slice(-1) != '\\' || route.slice(-1) != '/' ) route=route+'/';

	downloadRoute.innerHTML="/tuenti_photo_saver/"+route;
}

//Starts the download
function startDownloading()
{
	var route=inputText.value.trim();
	if(route.slice(-1) != '\\' || route.slice(-1) != '/' ) route=route+'/';
	
	//chrome.tabs.executeScript(null, {file: "tuenti_album.js"});
	chrome.tabs.executeScript(null, {
		code: 'var route = "tuenti_photo_saver/'+route+'";' //Injects the destination route
	}, function() {
		chrome.tabs.executeScript(null, {file: "tuenti_album.js"}); //Injects the download album script
		window.close(); //Closes the popup window
	});
}

//On click on the submit button, starts the download
document.getElementById('submitroute').onclick = startDownloading;

//Updates the destination route text on input in the textbox
inputText.oninput=function(){updateDownloadRoute();};

//On ENTER key press on popup, starts the download
inputText.onkeypress=function (e) {
    if (e.keyCode == 13) {
        startDownloading();
    }
};
});