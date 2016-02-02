var albumBody=document.getElementById('albumBody');
var currenthref=window.location.href;

if(albumBody == null) alert("Error: No se encuentra en la pagina de albumes");
else
{
var scrolled = false;
var lastScrolled=0;
var cont=0;

//Downloads a photo, contained in link[current]
function downloadPhoto(links,current)
{
		if(current<links.length)
		{
			links[current].click();
			fetchPhoto(links,current,0);
		}
		else{
			//Download finished!
			window.location.href = currenthref;
			window.scroll(0, 0);
			albumBody.innerHTML="<li><h1><br>¡Descarga exitosa!</h1></li>";
		}
}

//Tries to get a photo link (Waits till its open)
function fetchPhoto(links,current,cont)
{
	var image=document.getElementById('photo_image');
	if(image == null) {
		if(cont!=5) setTimeout(function(){fetchPhoto(links,current,cont+1)},500);
		else{
			links[current].click();
			setTimeout(function(){fetchPhoto(links,current,0)},500);
		}
	}
	else
	{
		//Downloads the photo
		chrome.runtime.sendMessage({"link": image.src , "cont":current,"route":route}, function(response) {});
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
		if(allPhotos[i].getElementsByClassName("thumb")[0].href === undefined){
			alert(i);
			alert(allPhotos[i].innerHTML);
			setTimeout(function(){onFullScrollDown(i)},500);
			break;
		}
		else links[i]=allPhotos[i].getElementsByClassName("thumb")[0];
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
		if(cont<20) setTimeout(function(){scrollDown()},200);

		else {
			onFullScrollDown(0);
		}
	}
}

scrollDown();
}