// --- Paper Plane Animation Script ---
document.addEventListener('DOMContentLoaded', function() {
    // Ensure GSAP TweenMax is loaded before running this
    if (typeof TweenMax === 'undefined') {
        console.error("GSAP TweenMax not loaded. Plane animation cannot start.");
        return;
    }

    var height = window.innerHeight;
    var width = window.innerWidth;
    var plane = document.getElementById("plane");

    if (!plane) {
        console.error("Plane element not found.");
        return;
    }

    function planeHover() {
        // Vertical movement tween (position & base rotation) - Unchanged
        TweenMax.to(plane, 3, {
            y: "-=290",
            rotation: "-=25",
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut
        });

        // Horizontal movement tween (position & base rotation) - Unchanged
        TweenMax.to(plane, 4, {
            x: "+=250",
            rotation: "+=25",
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut
        });

        // Y-Axis Scaling Tween for subtle 3D/bobbing effect - Unchanged
        TweenMax.to(plane, 1.5, {
            scaleY: 0.85,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut
        });

        // *** Restored: Regular Wobble Tween (Subtle, Fast Rotation Oscillation) ***
        TweenMax.to(plane, 0.7, { // Duration: Quick cycle (0.7s one way)
            rotation: "+=2.5",    // Add 5 degrees relative to current rotation
            repeat: -1,         // Repeat indefinitely
            yoyo: true,         // Oscillate back (to the original relative point)
            ease: Sine.easeInOut // Smooth wobble motion
        });
        // *** End Restored Wobble Tween ***
 
    }

    var tl = new TimelineMax({});
    // Set initial state & make visible - Unchanged
    tl.set(plane, { x: width + 150, y: height * 0.7, rotation: -35, scaleX: -1, scale: 0.5, opacity: 0.3, visibility: "visible" });
    // Entrance animation stages - Unchanged
    tl.to(plane, 5, { x: width * 0.01, y: height * 0.5, rotation: 15, scale: 1, opacity: 1, ease: Power2.easeInOut });
    tl.to(plane, 3, { x: width / 2 - 150, rotation: 5, scaleX: 1, scale: 0.8, ease: Power1.easeInOut });
    tl.to(plane, 1.2, { y: height / 2 + 20, rotation: 10, scale: 1, ease: Power1.easeInOut, onComplete: planeHover }, "-=0.3");

}); // End of DOMContentLoaded listener
