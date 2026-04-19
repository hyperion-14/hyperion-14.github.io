// Waits for the DOM to be fully loaded before initializing cloud layers
document.addEventListener('DOMContentLoaded', function() {

    // Cloud layer configs
    const cloudLayerConfigs = [
        {
            containerSelector: '.animation-wrapper',
            minCloudScale: 0.18,
            maxCloudScale: 1.35,
            minLayerOpacity: 0.08,
            maxLayerOpacity: 0.38,
            minSpeed: 10,
            maxSpeed: 70,
            verticalPadding: 0.07,
            initialDelay: 1200,
            minBobbingMag: 6,
            maxBobbingMag: 28,
            minBobbingSpeedFactor: 0.5,
            maxBobbingSpeedFactor: 1.5,
            cloudCreationInterval: 400
        },
        {
            containerSelector: '#cloud-middle',
            minCloudScale: 0.22,
            maxCloudScale: 1.55,
            minLayerOpacity: 0.13,
            maxLayerOpacity: 0.5,
            minSpeed: 25,
            maxSpeed: 110,
            verticalPadding: 0.05,
            initialDelay: 3500,
            minBobbingMag: 10,
            maxBobbingMag: 32,
            minBobbingSpeedFactor: 0.6,
            maxBobbingSpeedFactor: 1.7,
            cloudCreationInterval: 600
        },
        {
            containerSelector: '#cloud-overlay',
            minCloudScale: 0.28,
            maxCloudScale: 1.8,
            minLayerOpacity: 0.18,
            maxLayerOpacity: 0.65,
            minSpeed: 40,
            maxSpeed: 160,
            verticalPadding: 0.03,
            initialDelay: 7000,
            minBobbingMag: 12,
            maxBobbingMag: 36,
            minBobbingSpeedFactor: 0.7,
            maxBobbingSpeedFactor: 2.0,
            cloudCreationInterval: 800
        }
    ];


    // Dynamically set total clouds based on screen width
    let totalClouds;
    const w = window.innerWidth;
    if (w < 500) {
        totalClouds = 5;
    } else if (w < 800) {
        totalClouds = 8;
    } else if (w < 1200) {
        totalClouds = 12;
    } else {
        totalClouds = 18;
    }
    const cloudImageUrl = 'assets/img/cloud.png';

    if (typeof createCloudLayer === 'function') {
        // Create a map to track how many clouds per layer
        const cloudsPerLayer = [0, 0, 0];
        // Randomly assign each cloud to a layer
        for (let i = 0; i < totalClouds; i++) {
            const layerIdx = Math.floor(Math.random() * cloudLayerConfigs.length);
            cloudsPerLayer[layerIdx]++;
        }
        // Initialize each layer with its assigned number of clouds
        cloudLayerConfigs.forEach((cfg, idx) => {
            createCloudLayer({
                ...cfg,
                initialNumClouds: cloudsPerLayer[idx],
                cloudImageUrl
            });
        });
    } else {
        console.error("createCloudLayer function is not defined. Make sure cloud-animation.js is loaded correctly before cloud-init.js.");
    }

});
