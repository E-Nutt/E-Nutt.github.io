gsap.registerPlugin(TextPlugin, Observer, ScrollTrigger,CustomEase,EasePack, EaselPlugin);

/* -----------------------------------function helper---------------------------- */ 
   function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 100,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
		totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
		xPercent: (i, el) => {
			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
			return xPercents[i];
		}
	});
	gsap.set(items, {x: 0});
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
		vars = vars || {};
		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
		let newIndex = gsap.utils.wrap(0, length, index),
			time = times[newIndex];
		if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
			time += tl.duration() * (index > curIndex ? 1 : -1);
		}
		curIndex = newIndex;
		vars.overwrite = true;
		return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
	tl.progress(1, true).progress(0, true); // pre-render for performance
	if (config.reversed) {
	  tl.vars.onReverseComplete();
	  tl.reverse();
	}
	return tl;
}
/* ----------------------------- end function helper ---------------------------*/ 	
    
gsap.set([".greet"], {autoAlpha:1})

let mm = gsap.matchMedia();

/* ------------------------for desktop ----------------------------------------*/
mm.add("(min-width:600px)", () => {
/* greetings */
    var tl = gsap.timeline({repeat: 30, yoyo:true, repeatDelay:0.7})
    .from(".greet", {y : -180, stagger:1, ease :"back"})
    .to(".greet", {y : 180, stagger:1},1)
/* end of greetings */

/* name-title */
    var nameGrid = document.querySelector(".name-title")
    var nicknames = gsap.utils.toArray(".nickname");
    const loop = horizontalLoop(nicknames, {paused: true, repeat:-1, marginRight: 15})

    nameGrid.addEventListener("mouseenter", () => setDirection(-1))
    nameGrid.addEventListener("mouseleave", () => loop.pause())

    function setDirection(value){
        loop.direction = value
        gsap.to(loop, {timeScale:value, duration: 0.01, overwrite : true})
        loop.play()
    }
/*end of name-title */

/* slider-title */
    var circleSlider= gsap.utils.toArray(".circle-for-slider")
    var frontendSlider = document.getElementById("progressSlider")
    

    var arrowSlider = gsap.timeline({repeat: -1})
        .to(".circle-for-slider",{ borderLeft: "1rem solid #F42E3F",
        borderTop: "0.5rem solid transparent",
        borderBottom: "0.5rem solid transparent",
        stagger:0.5})


    let frontendSliderAnim = gsap.to(".is-me", {backgroundColor: "#F42E3F"}).pause()


    frontendSlider.addEventListener("input", function () {
    frontendSliderAnim.progress(this.value).pause();
    });

    
/* end of slider-title */

})
/* ------------------------ end for desktop ----------------------------------------*/


/* ------------------------for mobile ----------------------------------------*/
mm.add("(max-width:600px)", () => {
    var tl = gsap.timeline({repeat: 15, yoyo:true, repeatDelay:0.7, autoAlpha:1})
    .from(".greet", {y : -100, stagger:1, ease :"back"})
    .to(".greet", {y : 100, stagger:1},1)

/* name-title */
    var nicknames = gsap.utils.toArray(".nickname");
    const loop = horizontalLoop(nicknames, {repeat: -1,paddingRight: 7})
    gsap.to(loop, {timeScale:-1, duration: 0.01, overwrite : true})
    loop.play();
/* end of name-title */

/* frontendtrigger */
let frontendSliderAnim = gsap.timeline({paused:true}).to(".is-me", {backgroundColor:"#F42E3F", duration:0.5})
var triggerFrontend = document.querySelector("#trigger-frontend-mobile")
triggerFrontend.onpointerdown = beginAnimate
triggerFrontend.onpointerup = stopAnimate

function beginAnimate() {
    frontendSliderAnim.play();
    
  }
  
  function stopAnimate() {
  frontendSliderAnim.reverse()
  }
  
/* end of frontendtrigger */
}) 
/* ------------------------ end for mobile ----------------------------------------*/

