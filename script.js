
$(document).ready( function() {

	var $searchInput = $("#search-input");
	var $listElem = $(".list");	

	//dynamic response from typing into search box
	$("#search-input").keyup( function(event) {
		// console.log(String.fromCharCode(event.which));
		var searchURL = "https://en.wikipedia.org/w/api.php";
		var searchObj = {
			"origin": "*",
			"action": "query",
			"format": "json",
			"prop": "extracts",
			"generator": "search",
			"exsentences": "3",
			"exlimit": "max",
			"exintro": 1,
			"explaintext": 1,
			"gsrsearch": $searchInput.val(),
			"gsrnamespace": "0",
			"gsrlimit": "10"
		}
		
		$.getJSON(searchURL ,searchObj).done( function(wikiObj) {
			
			var box_check = $("#checkbox").prop("checked");
			dynamicResults(wikiObj, box_check);
		});

	});
	
	//response of clicked search button
	$("#submit-button").click( function(event) {
		event.preventDefault();
		
		// return text if nothing is typed
		if ($searchInput.val().trim() === "") {
			$searchInput.val("")
			$searchInput.blur();
			return $listElem.text("Need input...");			
		}
		
		var searchURL = "https://en.wikipedia.org/w/api.php";
		var searchObj = {
			"origin": "*",
			"action": "query",
			"format": "json",
			"prop": "extracts",
			"generator": "search",
			"exsentences": "3",
			"exlimit": "max",
			"exintro": 1,
			"explaintext": 1,
			"gsrsearch": $searchInput.val(),
			"gsrnamespace": "0",
			"gsrlimit": "10"
		}
		
		$.getJSON(searchURL ,searchObj).done( function(wikiObj) {
			displayResults(wikiObj);
		});
		
		$searchInput.val("")
		$searchInput.blur();
		
	});
	
	//response of clicked random button
	$("#random-button").click( function(event) {
		event.preventDefault();
		$("body > *").addClass("animated");
		$("body > *").addClass("zoomOut");
		setTimeout( function() { 
			$(location).attr("href", "https://en.wikipedia.org/wiki/Special:Random");			
		},350);
		
	});

	//response of clicked clear button
	$("#clear-button").click( function(event) {
		event.preventDefault();
		
		// animation to fade out list elements
		$(".list div").addClass("fadeOutLeft");

		// deleted text in list element after animation
		setTimeout( function() { 
			$listElem.text("");
			$listElem.removeClass("listClass");
		}, 1000);
		
	});
	
	
	function displayResults(wikiObj) {			
			if (wikiObj.query === undefined) {
				return $listElem.text(" (╯°□°)╯︵ ┻━┻ ... No results for search!");
			}
		
			var pages = wikiObj.query.pages;
			var pageIDs = Object.keys(pages);
			var wikiURL = "https://en.wikipedia.org/wiki/";
			
			$listElem.text("");

			for (var i of pageIDs) {
				var title = truncateString(pages[i].title, 50);
				var extract = truncateString(pages[i].extract, 140);
				
				var $titleElem = $("<div></div>").addClass("title").text(title);
				$titleElem.addClass("animated");
				$titleElem.addClass("fadeInRight");
				
				var $descriptElem = $("<div></div>").addClass("descript").text(extract);
				$descriptElem.addClass("animated");
				$descriptElem.addClass("fadeInLeft");
				
				var $linkElem1 = $("<a></a>").attr("href", wikiURL + title);
				var $divElem = $("<div></div>").attr("class", "linkClass");
				
				$divElem.append($titleElem[0]).append($descriptElem[0]);
				$linkElem1.append($divElem);
				$listElem.append($linkElem1[0]);
				
				if (!$listElem.hasClass("listClass")) {
					$listElem.addClass("listClass");
					$listElem.addClass("fadeIn");
				}
				
			}	
	}
		
	function dynamicResults(wikiObj,box_check) {
		// if (box_check === true) {

			var $dropdown = $(".dropdown");
			var $ul = $("<ul></ul>").addClass("dropdown-menu");
			
			// delete dropdown menu
			$("ul").remove();
			
			// check if there are no results, display message
			if ($searchInput.val() === "") {
					$("ul").remove();
				return;
			} else if (wikiObj.query === undefined) {
					var $li = $("<div></div>").addClass("lbl").text("No results...");
					$ul.append($li);
					$dropdown.append($ul);
				return ;
			} else {}
		
			var pages = wikiObj.query.pages;
			var pageIDs = Object.keys(pages);
			var wikiURL = "https://en.wikipedia.org/wiki/";
			
			$listElem.text("");
			
			var titleClass = "title";
			var titleLen = 50;
			if (box_check === false) {
				titleClass = "titleDrop";
				titleLen = 20;
			}
			
			for (var i of pageIDs) {
				var title = truncateString(pages[i].title, titleLen);
				var extract = truncateString(pages[i].extract, 140);
				
				var $titleElem = $("<div></div>").addClass(titleClass).text(title);
				$titleElem.addClass("animated");
				$titleElem.addClass("fadeInRight");
				
				var $descriptElem = $("<div></div>").addClass("descript").text(extract);
				$descriptElem.addClass("animated");
				$descriptElem.addClass("fadeInLeft");
				
				var $linkElem1 = $("<a></a>").attr("href", wikiURL + pages[i].title);
				var $linkElem2 = $("<a></a>").attr("href", wikiURL + pages[i].title);
				
				$linkElem1.append($titleElem[0]);
				$linkElem2.append($descriptElem[0]);
				
				if (box_check === true) {
					$listElem.append($linkElem1[0], $linkElem2[0]);
					if (!$listElem.hasClass("listClass")) {
						$listElem.addClass("listClass");
						$listElem.addClass("fadeIn");
					}
					
				} else {
					$titleElem.removeClass("animated");
					$titleElem.removeClass("fadeInRight");
					var $linkElem3 = $("<a></a>").attr("href", wikiURL + pages[i].title);
					$linkElem3.append($titleElem[0]);
					$ul.append($linkElem3);					
				}
				
			}
			
			if (box_check !== true) {
				$dropdown.append($ul);
			}
			
		// }
		
	}
	
	function truncateString(str, num) {
		// Clear out that junk in your trunk
		
		if (str.length <= num ) {
			return str; 
		} else if (num <= 3) {
			str = str.slice(0,num) + "...";
		} else {
			str = str.slice(0,num-3) + "...";
		}
		
		return str;
	}
				
	function randomColor() {
		var x=Math.round(0xffffff * Math.random()).toString(16);
		var y=(6-x.length);
		var z= "000000";
		var z1 = z.substring(0,y);
		var color= "#" + z1 + x;

		return color;
	}

	
// 			if ($searchInput.value !== "") {
// 			$.ajax({
// 				url: 'https://en.wikipedia.org/w/api.php',
// 				data: {
// 						action: 'query',
// 						list: 'search',
// 						format: 'json',
// 						srsearch: $searchInput.value
// 				},
// 				dataType: 'jsonp',
				
// 				success: showResults()
				
				
// 			}).done( function ( json ) {
// 					alert(json.query.search[0].title);
// 			} );

// 		}
	
	
	
});
