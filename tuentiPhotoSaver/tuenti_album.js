var route=paramData.route;
var longtimeout=paramData.longtimeout;
var albumBody=document.getElementById('albumBody');
var currenthref=window.location.href;

if(albumBody == null) alert("Error: No se encuentra en la pagina de albumes");
else
{
var scrolled = false;
var lastScrolled=0;
var cont=0;

//Gets a date in Tuenti verbose format and returns it in YYYY-MM-DD_HHMM format

var nombreMeses = { //Global month-number association table (In spanish)
	    "enero" : "01",
	    "febrero" : "02",
	    "marzo" : "03",
	    "abril" : "04",
	    "mayo" : "05",
	    "junio" : "06",
	    "julio" : "07",
	    "agosto" : "08",
	    "septiembre" : "09",
	    "octubre" : "10",
	    "noviembre" : "11",
	    "diciembre" : "12"
	};
	
function compactDate(verboseDate)
{
	var vd=verboseDate.trim();
	vd=vd.replace(",","");vd=vd.replace(",","");
    var tab = vd.split(" ");
	var day=tab[0];
	var month=tab[2];
	var year=tab[3];
	var time=tab[6];
	
	month=nombreMeses[month];
	
	if(day.length<2) day="0"+day;
	
	var time=time.replace(":","");
	
	return year+"-"+month+"-"+day+"_"+time;
}
//Downloads a photo, contained in link[current]
function downloadPhoto(links,current)
{
		if(current<links.length)
		{
			links[current].click();
			fetchPhoto(links,current,0,0);
		}
		else{
			//Download finished!
			window.location.href = currenthref;
			window.scroll(0, 0);
			albumBody.innerHTML="<li><h1><br>¡Descarga exitosa!</h1></li>";
		}
}
var errorCont=0;
//Tries to get a photo link (Waits till its open)
function fetchPhoto(links,current,cont,retry)
{
	//Used to retry fetching the img at random amounts of time (Tuenti doesnt like fixed amounts for some people it seems)
	function rand(min,max,interval)
	{
		if (typeof(interval)==='undefined') interval = 1;
		var r = Math.floor(Math.random()*(max-min+interval)/interval);
		return r*interval+min;
	}

	var image=document.getElementById('photo_image');
	if(image == null) {
		//If we are waiting for the image to load, we wait 2'5s. If we are waiting for it to close, we only wait 1s
		if(cont!=5&&(retry!=-1||cont<3)) {
			setTimeout(function(){fetchPhoto(links,current,cont+1,retry)},rand(500,600,20));
		}
		else{
			if(retry==0){
				//Image not loaded in 2'5s? Its not gonna load: close it and reopen
				document.getElementsByClassName('icon i-cross i-m i-default-medium i-hover-hard h-right lbx-close i-op-hard i-white')[0].click();
				setTimeout(function(){fetchPhoto(links,current,0,-1)},rand(500,600,20));
			}
			else{
				//Open the image
				links[current].click();
				setTimeout(function(){fetchPhoto(links,current,0,retry+1)},rand(500,600,20));
			}
		}
	}
	else
	{
		//Get the photo date
		var dateData=document.getElementsByClassName('h-date h-stext');
		var verboseDate=dateData[0].innerHTML;
		var compactedDate=""+errorCont; //If some error happens, the date will be printed like this.
		try{
			compactedDate=compactDate(verboseDate); //Turn to compact
		}
		catch(err){
			alert('Error parseando la fecha: Asegurate de tener el idioma de Tuenti en Castellano. Si ya lo tienes y esta es la primera vez que pasa, ignora este mensaje. La foto actual tendra de nombre '+errorCont+'.jpg. Para ignorar todos los siguientes errores, pulsa en "Impedir que la pagina cree cuadros de dialogo adicionales"');
			errorCont++;
		}
		
		//Downloads the photo
		chrome.runtime.sendMessage({"link": image.src , "name":compactedDate,"route":route}, function(response) {});
		image.parentNode.removeChild(image); //Deletes the photo from the screen

		downloadPhoto(links,current+1);
	}
}

//When all photos are loaded, starts downloading them
function onFullScrollDown(initialChild)
{
	var allPhotos=albumBody.children;
	var links=[];
	for(i = initialChild; i < allPhotos.length ; i++)
	{
		if(allPhotos[i].getElementsByClassName("thumb")[0] !== undefined) {
			links[i]=allPhotos[i].getElementsByClassName("thumb")[0];
		}
	}

	if(i==allPhotos.length) {
		
		albumBody.innerHTML=""; //Frees memory while download takes place

		//Download photos
		downloadPhoto(links,0);
	}
}

//Scrolls down to the absolute bottom of the page, loading all photos in the proccess
function scrollDown()
{
	window.scroll(0, 5000000);
	if(document.body.scrollTop>lastScrolled) {
		cont=0;
		lastScrolled=document.body.scrollTop;
		scrollDown();
	}	
	else{
		cont++;
		if(longtimeout&&cont <150) setTimeout(function(){scrollDown()},200);
		else if(cont<25) setTimeout(function(){scrollDown()},200);
		else {
			cont=0;
			onFullScrollDown(0);
		}
	}
}

scrollDown();
}