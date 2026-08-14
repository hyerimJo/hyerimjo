$(document).ready(function(){
	//aos
	AOS.init({
		duration: 1200,
		once:true,
	});
    
    // img to svg
	document.querySelectorAll('img.svg').forEach(function (img) {
		var imgID = img.id;
		var imgClass = img.className;
		var imgURL = img.src;

		fetch(imgURL).then(function (response) {
			return response.text();
		}).then(function (text) {

			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(text, "text/xml");

			// Get the SVG tag, ignore the rest
			var svg = xmlDoc.getElementsByTagName('svg')[0];

			// Add replaced image's ID to the new SVG
			if (typeof imgID !== 'undefined') {
				svg.setAttribute('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if (typeof imgClass !== 'undefined') {
				svg.setAttribute('class', imgClass + ' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			svg.removeAttribute('xmlns:a');

			// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
			if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
				svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
			}

			// Replace image with new SVG
			img.parentNode.replaceChild(svg, img);

		});
	});
	
    //topbtn
	$("#top-btn").on("click",function() {
		$("html,body").stop().animate({
			scrollTop: 0
		})
	});

    var tabTitle = $(".side-nav ul li");
    var listBox = $(".content__wrap");

    $(window).on("scroll", function(){
        var scrollTop = $(document).scrollTop();

        listBox.each(function(index){
            var listBoxTop = $(this).offset().top;
            if(scrollTop >= listBoxTop - 100) {
                tabTitle.removeClass("is-active");
                tabTitle.eq(index).addClass("is-active");
            }
        })
    });

})