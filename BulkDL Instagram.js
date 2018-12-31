// ==UserScript==
// @name         BulkDL Instagram
// @version      1.0
// @description  A userscript to bulk download images and videos on Instagram.
// @author       LilianTdn
// @license      MIT
// @match        https://www.instagram.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @homepageURL  https://github.com/BeardDesign1/BulkDL/
// @updateURL    https://raw.githubusercontent.com/BeardDesign1/BulkDL/master/BulkDL%20Instagram.js
// ==/UserScript==

var isSelectionEnabled = false;
var defaultBulkStyle = ".bulk-downloader{position: fixed; bottom:0px; right:0px; background:#fff; border:1px solid #E6E6E6; border-right:0; border-bottom:0; border-radius:5px 0 0 0; padding:10px; } .bulk-downloader button{border:none; background:rgba(0,0,0,.1); color:#404040; padding:8px 10px; margin-bottom:10px; border-radius:3px; font-weight:600; transition:transform 200ms cubic-bezier(0,0,0,1); cursor:pointer; } .bulk-downloader button:hover{background:rgba(0,0,0,.15); } .bulk-downloader button:active{background:#3897F0; color:#fff; transform:scale(.9); opacity:.5; transition:0ms ease; } .bulk-downloader button.blue{background:#3897F0; color:#fff; } .bulk-downloader button:last-child{margin-bottom: 0; } .bulk-downloader button:focus {outline:0;} .v1Nh3 {transition: 200ms cubic-bezier(0, 0, 0, 1) } .bulkselectable .bulkselected {box-shadow:0 0 0 3px #fff, 0 0 0 5px #3897F0; border-radius: 10px; overflow: hidden; transform:scale(.95); } .bulkselectable .v1Nh3:active {opacity: .3; transform: scale(.9); transition: 0ms ease; } .bulkselectable .v1Nh3 * {pointer-events: none !important; } .bulkselectable .v1Nh3::after {content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 100; cursor: pointer }";
$( document ).ready(function(){
	$("body").append("<style id='bulkstyle'></style>");
	$("#bulkstyle").text(defaultBulkStyle);
	$("body").append("<div class='bulk-downloader'><button id='selectionswitch'>Enable selection</button><button id='save'>Save images</button></div>");

	$("body").on("click","#selectionswitch",function(e){
		if(isSelectionEnabled){
			isSelectionEnabled = false;
			$(this).text("Enable selection").removeClass("blue");
			$("body").removeClass("bulkselectable");
		} else {
			isSelectionEnabled = true;
			$(this).text("Disable selection").addClass("blue");
			$("body").addClass("bulkselectable");
		}
	});

	$("body").on("click",".v1Nh3", function(e){
		if (isSelectionEnabled){
			if ($(e.target).hasClass("bulkselected")){
				$(e.target).removeClass("bulkselected");
			} else {
				$(e.target).addClass("bulkselected");
			}
		}
	});

	$("body").on("click","#save",function(e){
		isSelectionEnabled = false;
		$("#selectionswitch").text("Enable selection").removeClass("blue");
		$("body").removeClass("bulkselectable");
		var links = [];
		var time = 0;

		$(".bulkselected").each(function(i,el){
			time += 1000;
			setTimeout(function(){
				$(el).children("a")[0].click();
					setTimeout(function(){
					$("._97aPb .KL4Bh img").each(function(i,el){
						var l = $(el).attr("srcset");
						l = l.split(',');
						l = l[l.length - 1]
						console.log(l);
						l = l.split('1080w')[0];
						downloadResource(l, Math.floor(Math.random() * 1000000000))
					});
					$("._97aPb video").each(function(i,el){
						var l = $(el).attr("src");
						downloadResource(l, Math.floor(Math.random() * 1000000000))
					});
					$(".ckWGn")[0].click();
				}, 500);
			}, time);
		});
	});
});

function forceDownload(blob, filename) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = blob;
  a.click();
}

function downloadResource(url, filename) {
  if (!filename) filename = url.split('\\').pop().split('/').pop();
  fetch(url, {
      headers: new Headers({
        'Origin': location.origin
      }),
      mode: 'cors'
    })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}
