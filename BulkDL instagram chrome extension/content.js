var isSelectionEnabled = false;
var selectedItems = { "p": {}, "l": [] };
var defaultBulkStyle = ".bulk-downloader {position: fixed; bottom: 0px; right: 0px; background: #fff; border: 1px solid #E6E6E6; border-right: 0; border-bottom: 0; border-radius: 5px 0 0 0; padding: 10px; } .bulk-downloader button {border: none; background: rgba(0, 0, 0, .1); color: #404040; padding: 8px 10px; margin-bottom: 10px; border-radius: 3px; font-weight: 600; transition: transform 200ms cubic-bezier(0, 0, 0, 1); cursor: pointer; } .bulk-downloader button:hover {background: rgba(0, 0, 0, .15); } .bulk-downloader button:active {background: #3897F0; color: #fff; transform: scale(.9); opacity: .5; transition: 0ms ease; } .bulk-downloader button.blue {background: #3897F0; color: #fff; } .bulk-downloader button:last-child {margin-bottom: 0; } .bulk-downloader button:focus {outline: 0; } #selectioncounter{font-weight: 600; color:#404040; display: flex; align-items: center; margin-bottom:8px; } #selectioncounter.zero{opacity: .5; } .v1Nh3 {transition: 200ms cubic-bezier(0, 0, 0, 1) } .bulkselectable .bulkselected {box-shadow: 0 0 0 3px #fff, 0 0 0 5px #3897F0; border-radius: 10px; overflow: hidden; transform: scale(.95); } .bulkselectable .v1Nh3:active {opacity: .3; transform: scale(.9); transition: 0ms ease; } .bulkselectable .v1Nh3 * {pointer-events: none !important; } .bulkselectable .v1Nh3::after {content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 100; cursor: pointer }";
$(document).ready(function() {
	$("body").append("<style id='bulkstyle'></style>");
	$("#bulkstyle").text(defaultBulkStyle);
	$("body").append("<div class='bulk-downloader'><div id='selectioncounter' class='zero'>0 items selected.</div><button id='clearselection'>Clear selection</button><button id='selectionswitch'>Enable selection</button><button id='save'>Save images</button></div>");

	$("#selectionswitch").click(function(e) {
		if (isSelectionEnabled) {
			isSelectionEnabled = false;
			$(this).text("Enable selection").removeClass("blue");
			$("body").removeClass("bulkselectable");
		} else {
			isSelectionEnabled = true;
			$(this).text("Disable selection").addClass("blue");
			$("body").addClass("bulkselectable");
		}
	});

	$("body").on("click", ".v1Nh3", function(e) {
		if (isSelectionEnabled) {
			if ($(e.target).hasClass("bulkselected")) {
				$(e.target).removeClass("bulkselected");
				var a = $(e.target).children("a").attr("href");
				selectedItems.l.remove(a);
			} else {
				$(e.target).addClass("bulkselected");
				var a = $(e.target).children("a").attr("href");
				var p = $(e.target).offset().top;
				selectedItems.l.push(a);
				selectedItems.p[a] = p;
			}
			updateCounter();
		}
		console.log(selectedItems);
	});

	$("#save").click(function(e) {
		isSelectionEnabled = false;
		$("#selectionswitch").text("Enable selection").removeClass("blue");
		$("body").removeClass("bulkselectable");
		var links = [];
		var time = 0;

		$.each(selectedItems.l, function(i, val) {
			time += 1000;
			setTimeout(function() {
				$(document).scrollTop(selectedItems.p[val]);
				setTimeout(function() { $("a[href='" + val + "']")[0].click() }, 50);
				setTimeout(function() {
					$("._97aPb .KL4Bh img").each(function(i, el) {
						var l = $(el).attr("srcset");
						l = l.split(',');
						l = l[l.length - 1]
						console.log(l);
						l = l.split(' ')[0];
						downloadResource(l, Math.floor(Math.random() * 1000000000))
					});
					$("._97aPb video").each(function(i, el) {
						var l = $(el).attr("src");
						downloadResource(l, Math.floor(Math.random() * 1000000000))
					});
					$(".ckWGn")[0].click();
				}, 500);
			}, time);
		});
	});

	$("#clearselection").click(function() {
		selectedItems = { "p": {}, "l": [] };
		$(".bulkselected").removeClass("bulkselected");
		updateCounter();
	});
});

$(document).scroll(function(e) {
	$(".v1Nh3").each(function(i, el) {
		var a = $(el).children("a").attr("href");
		if (jQuery.inArray(a, selectedItems.l) !== -1) {
			$(el).addClass("bulkselected");
		};
	});
});

Array.prototype.remove = function() {
	var what, a = arguments,
		L = a.length,
		ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) != -1) {
			this.splice(ax, 1);
		}
	}
	return this;
}

new MutationObserver(function(mutations) {
	selectedItems = { "p": {}, "l": [] };
	updateCounter();
}).observe(
	document.querySelector('title'), { subtree: true, characterData: true, childList: true }
);

function updateCounter(){
	$("#selectioncounter").text(selectedItems.l.length + " items selected.");
	if (selectedItems.l.length == 0) $("#selectioncounter").addClass("zero"); else $("#selectioncounter").removeClass("zero");
}

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
