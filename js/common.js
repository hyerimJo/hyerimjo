$(document).ready(function(){
	//aos
	AOS.init({
		duration: 1200,
		once:true,
	});

	//header
    $("html, body").on("mousewheel DOMMouseScroll", function(e){
		const delta = e.originalEvent.deltaY;
		const detail = e.originalEvent.detail;

		if(delta < 0 || detail < 0){
			$("header").removeClass("down");
		}else{ 
			$("header").addClass("down");
		}
	})

	$("header .header_inner nav #gnb").clone().appendTo("#allmenu .allgnb");

    $("header .header_inner #menubtn").on("click",function(){
        $("#allmenu").addClass("on");
    })

    $("#allmenu .close").on("click",function(){
        $("#allmenu").removeClass("on");
    })

	//animation 반응형
    $(window).on('load resize', function() {
        const width = $(window).width();
        if (width > 1024) {
			//images animation
            const images = $("main .visual .item-box .img-box figure");
        
            const lerp = (a, b, n) => (1 - n) * a + n * b;
            const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
            
            const getMousePosition = e => {
                let posX = e.clientX;
                let posY = e.clientY;
        
                return {
                x: posX,
                y: posY
                };
            };
            
            let mousePos = { x: $(window).width() / 2, y: $(window).height() / 2 };
            $(window).on("mousemove", function(e) {
                mousePos = getMousePosition(e);
            });
        
            // text animation
            gsap.fromTo('main .visual .item-box .img-box figure', {
                ease: 'power3.inOut',
            }, {
                stagger: 0.1,
                duration: 2.5,
            });
        
            images.each(function() {
                let values = { x: 0, y: 0 };
                const xStart = gsap.utils.random(16, 64);
                const yStart = gsap.utils.random(-16, 64);
        
                const render = () => {
                values.x = lerp(
                    values.x,
                    map(mousePos.x, 0, $(window).width(), -xStart, xStart),
                    0.07
                );
        
                values.y = lerp(
                    values.y,
                    map(mousePos.y, 0, $(window).height(), -yStart, yStart),
                    0.07
                );
        
                $(this).css({
                    transform: `translate(${values.x}px, ${values.y}px)`
                });
        
                requestAnimationFrame(render);
                };
                render();
            });
			

			// text seperate
			$(".split").each(function(i) {
				const txt = $(this).text().replace(/./g, "<span>$&</span>").replace(/\s/g, "<span class='space'>&nbsp;</span>");
			
				$(this).html(txt);
			
				const span = $(this).find("span");
				for (let j = 0; j < span.length; j++) {
					// 랜덤으로 animation-delay 값 설정
					const randomDelay = Math.random() * 500; // 최대 500ms까지 랜덤으로 설정
					$(this).find("span").eq(j).css("animation-delay", randomDelay + "ms");
				}
			});
        }else{
            var ctnBox = $("main .portfolio .ctnBox");
            ctnBox.find('.item-box').first().remove();  // 첫 번째 슬라이드 제거
            ctnBox.find('.item-box').last().remove(); 
            $("main .portfolio .ctnBox").on("init", function(){
            }).slick({
                slidesToShow: 2,
                arrows:false,
                dots: true,
                autoplay:true,
                autoplaySpeed:7000,
                speed : 1000,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            })
        }
    })
    
	//content
	gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function(){

            const containers = document.querySelectorAll('main .portfolio');

            containers.forEach(container => {
                const ctnWrap = container.querySelector('.ctnWrap');
                const ctnBox = container.querySelector('.ctnBox');
                const items = ctnBox.querySelectorAll('.itemBox');
                const numColumns = parseInt(ctnBox.getAttribute('data-columns')); // 열 개수 가져오기

                const offset = 100; // 고정 오프셋 값

                // 아이템들의 초기 위치 설정
                items.forEach((item, index) => {
                    item.style.transform = `translate(0, ${index * offset}px)`; 
                });

                const ctnBoxHeight = ctnBox.offsetHeight;

                ScrollTrigger.create({
                    trigger: container,
                    start: 'top 50px', 
                    pin: true, 
                    pinSpacing: true, 
                    anticipatePin: 1, 
                    end: `+=${ctnBoxHeight}`, 
                    onEnter: () => {
                        ctnWrap.classList.add('active'); 

                        setTimeout(() => {
                            items.forEach((item, index) => {
                                const col = index % numColumns; 
                                const row = Math.floor(index / numColumns);
                                const spacingX = item.offsetWidth; 
                                const spacingY = item.offsetHeight;

                                const posX = (col - (numColumns - 1) / 2) * spacingX; 
                                const posY = row * spacingY; 

                                gsap.to(item, {
                                    x: posX,
                                    y: posY,
                                    ease: "power2.out", 
                                    duration: 1
                                });
                            });
                        }, 800);
                    },
                    onLeaveBack: () => {
                        ctnWrap.classList.remove('active'); 

                        items.forEach((item, index) => {
                            const posY = index * offset; 
                            gsap.to(item, {
                                x: 0,
                                y: posY, 
                                ease: "power2.in",
                            });
                        });
                    }
                });
            });
        },
        all: function () {
        }
    })   

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
});