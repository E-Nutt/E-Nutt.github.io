console.clear();
var nameGrid = document.querySelector(".name-title")

/* -----------------------------------endless name---------------------------- */

var boxWidth = 40,
    totalWidth = boxWidth * 10,
    no1 = document.querySelectorAll("#name01 .nickname"),
    no2 = document.querySelectorAll("#name01 .nickname"),
    dirToRight = "+=" + totalWidth,
    mod = gsap.utils.wrap(0, totalWidth)



function marquee (which, time, direction){
    gsap.set(which, {
        x:function(i){
            return i * boxWidth;
        }
    });
    var action = gsap.timeline()
        .to(which, {
            x: direction,
            modifier: {
                x : x => mod(parseFloat(x)) + "px"
            },
            duration : time , ease: "none",
            repeat : -1
        })
    return action;
}
gsap.set(".wrapper", {x: -500})
gsap.set([".greet", "#enut"], {autoAlpha:1})

let mm = gsap.matchMedia();
    
/* ------------------------for desktop ----------------------------------------*/
mm.add("(min-width:600px)", () => {
    var tl = gsap.timeline({repeat: 15, yoyo:true, repeatDelay:0.7})
    .from(".greet", {y : -180, stagger:1, ease :"back"})
    .to(".greet", {y : 180, stagger:1},1)

    
    var nameTitle = gsap.timeline({paused: true})
        .add(marquee([no1], 10, dirToRight))
        
    
    /* .fromTo("#enut", {scale:0},{scale:1},0)
    .to("#raf", {scale:0,},0) */

    nameGrid.addEventListener("mouseenter", () => nameTitle.play())
    nameGrid.addEventListener("mouseleave", () => nameTitle.pause())
})


/* ------------------------for mobile ----------------------------------------*/
mm.add("(max-width:600px)", () => {
    var tl = gsap.timeline({repeat: 15, yoyo:true, repeatDelay:0.7, autoAlpha:1})
    .from(".greet", {y : -100, stagger:1, ease :"back"})
    .to(".greet", {y : 100, stagger:1},1)
}) 




