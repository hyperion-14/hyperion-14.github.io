// Waits for the DOM to be fully loaded before initializing cloud layers
document.addEventListener('DOMContentLoaded', function() {

    // Configuration for the background cloud layer (behind text/plane)
    const backgroundCloudConfig = {
        containerSelector: '.animation-wrapper', // Targets the div with z-index: -1
        initialNumClouds: 4,                     // Fewer clouds
        cloudImageUrl: 'assets/img/cloud.png',   // Ensure this image exists
        minCloudScale: 0.2,                      // Generally smaller scale
        maxCloudScale: 1.2,
        minLayerOpacity: 0.1,                    // More transparent
        maxLayerOpacity: 0.35,
        minSpeed: 20,                            // Slower speed
        maxSpeed: 80,
        verticalPadding: 0.05,                   // Slightly more padding maybe
        initialDelay: 5000                       // Start 5 seconds after page load
        // Other parameters will use defaults from createCloudLayer function
    };

    // Configuration for the foreground cloud layer (in front of text/plane)
    const foregroundCloudConfig = {
        containerSelector: '#cloud-overlay',      // Targets the div with z-index: 10
        initialNumClouds: 6,                      // More clouds
        cloudImageUrl: 'assets/img/cloud.png',    // Ensure this image exists
        minCloudScale: 0.3,                       // Use previous settings
        maxCloudScale: 1.7,
        minLayerOpacity: 0.25,                    // Less transparent
        maxLayerOpacity: 0.6,
        minSpeed: 60,                             // Faster speed
        maxSpeed: 180,
        verticalPadding: 0.03,                    // Use previous settings
        initialDelay: 9000                        // Start 9 seconds after page load
         // Other parameters will use defaults from createCloudLayer function
    };

    // Check if the createCloudLayer function is defined before calling it
    if (typeof createCloudLayer === 'function') {
        // Initialize the background layer
        createCloudLayer(backgroundCloudConfig);

        // Initialize the foreground layer
        createCloudLayer(foregroundCloudConfig);
    } else {
        console.error("createCloudLayer function is not defined. Make sure cloud-animation.js is loaded correctly before cloud-init.js.");
    }

});
