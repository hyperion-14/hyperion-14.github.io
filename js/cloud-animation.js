// Wrap the entire logic in a function that takes a configuration object
function createCloudLayer(layerConfig) {
    'use strict'; // Enforce stricter parsing and error handling

    // --- Default Configuration (will be merged with layerConfig) ---
    // These defaults are used if not provided in the layerConfig object passed to createCloudLayer
    const defaultConfig = {
        // --- Container & Content ---
        containerSelector: 'body',          // CSS selector for the HTML element where clouds for this layer will be appended.
        initialNumClouds: 5,                // Number of clouds to create initially for this layer when it starts.
        cloudImageUrl: 'assets/img/cloud.png', // Path to the image file used for individual cloud layers.

        // --- Cloud Cluster Appearance ---
        minCloudScale: 0.3,                 // Minimum scale factor applied to the entire cloud cluster (relative to original image size).
        maxCloudScale: 1.7,                 // Maximum scale factor applied to the entire cloud cluster.
        minLayerOpacity: 0.3,              // Minimum base opacity for an individual image layer within a cloud cluster (oscillation is applied on top of this).
        maxLayerOpacity: 0.6,               // Maximum base opacity for an individual image layer.
        minLayersPerCloud: 8,               // Minimum number of image layers that form a single cloud cluster.
        maxLayersPerCloudBase: 15,           // Maximum base number of image layers (this value is scaled based on the cloud cluster's overall scaleFactor).

        // --- Movement & Positioning ---
        minSpeed: 60,                       // Slowest horizontal movement speed in pixels per second.
        maxSpeed: 200,                      // Fastest horizontal movement speed in pixels per second.
        verticalPosition: 'full',           // Determines initial vertical distribution ('full', 'topHalf', 'bottomHalf', 'centerThird'). Note: The 60% height limit is applied *after* this logic in `calculateYRange`.
        verticalPadding: 0.0,              // Percentage of screen height used as padding from top/bottom edges (within the allowed vertical zone).

        // --- Bobbing Animation (Vertical Oscillation) ---
        enableBobbing: true,                // Boolean, set to `true` to make entire cloud clusters bob up and down vertically.
        minBobbingMag: 8,                   // Minimum vertical distance (in pixels) a cloud cluster will bob from its base Y position.
        maxBobbingMag: 20,                  // Maximum vertical distance (in pixels) a cloud cluster will bob.
        minBobbingSpeedFactor: 0.7,         // Minimum speed multiplier for the bobbing oscillation (relative to time).
        maxBobbingSpeedFactor: 1.3,         // Maximum speed multiplier for the bobbing oscillation.

        // --- Layer Oscillation (Individual Layer Pulsing) ---
        enableLayerOscillation: true,       // Boolean, set to `true` to make individual cloud layers pulse in scale and opacity.
        minLayerOscSpeedFactor: 0.7,        // Minimum speed multiplier for the layer oscillation (scale/opacity pulsing).
        maxLayerOscSpeedFactor: 1.2,        // Maximum speed multiplier for the layer oscillation.
        layerScaleOscMagnitude: 0.15,       // How much the scale of an individual layer oscillates (as a percentage of its base scale). E.g., 0.1 means +/- 10%.
        layerOpacityOscMagnitude: 0.22,     // How much the opacity of an individual layer oscillates (as a percentage of its base opacity). E.g., 0.2 means +/- 20%.

        // --- Layer Positioning & Appearance within Cluster ---
        layerBaseSpread: 90,               // Maximum distance (in pixels, scaled by cluster size) that individual layers can spread out horizontally/vertically from the cloud cluster's center point.
        layerBaseScale: 0.8,                // Base scale multiplier applied to individual layers relative to the overall cluster scale.

        // --- Wrapping & Fading ---
        cloudWrapWidthBuffer: 300,          // Extra distance (in pixels) a cloud must travel off the left edge before it wraps around to the right side. Prevents visual pop-in.
        fadeInDuration: 2.0,                // Duration (in seconds) for a cloud to fade in when it wraps around the screen.

        // --- Initialization Timing ---
        cloudCreationInterval: 250,         // Time delay (in milliseconds) between creating each of the `initialNumClouds`.
        initialDelay: 5000                  // Time delay (in milliseconds) after the script initializes before it starts the `cloudCreationInterval` loop for this layer.
    };

    // --- Merge User Config with Defaults ---
    // Create the final config by overlaying layerConfig onto defaultConfig
    const config = { ...defaultConfig, ...layerConfig };

    // ... rest of the createCloudLayer function (state variables, helpers, core functions, init) ...
    // (The rest of the function remains the same as provided in the previous step)

    // --- State Variables (Scoped within this function instance) ---
    let layers = [];
    let cloudBases = [];
    let container = null;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let animationFrameId = null;
    let lastTimestamp = 0;
    let cloudCreationIntervalId = null;

    // --- Helper Functions ---
    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function calculateYRange() {
        const paddingPx = screenHeight * config.verticalPadding;
        const bobbingMax = config.enableBobbing ? config.maxBobbingMag : 0;
        const effectiveMinY = paddingPx + bobbingMax;
        const absoluteMaxYLimit = screenHeight * 0.5;
        let potentialMaxY;
        switch (config.verticalPosition) {
            case 'topHalf':
                 potentialMaxY = screenHeight * 0.5 - paddingPx - bobbingMax;
                 break;
            default:
                potentialMaxY = screenHeight - paddingPx - bobbingMax;
                break;
        }
        let maxY = Math.min(potentialMaxY, absoluteMaxYLimit);
        let minY = Math.min(effectiveMinY, maxY - 1);
        if (minY >= maxY) {
            minY = Math.max(0, absoluteMaxYLimit - 1);
            maxY = absoluteMaxYLimit;
        }
        return { minY, maxY };
    }

    // --- Core Functions ---
    function createCloud() {
        const cloudBase = document.createElement('div');
        cloudBase.className = 'cloudBase';
        const scaleFactor = randomRange(config.minCloudScale, config.maxCloudScale);
        const { minY, maxY } = calculateYRange();
        const baseY = (minY >= maxY) ? minY : randomRange(minY, maxY);
        const startX = screenWidth + randomRange(200, config.layerBaseSpread * scaleFactor * 1.5 + 800);

        cloudBase.dataset.x = startX;
        cloudBase.dataset.baseY = baseY;
        cloudBase.dataset.speed = randomRange(config.minSpeed, config.maxSpeed);
        cloudBase.dataset.scaleFactor = scaleFactor;
        if (config.enableBobbing) {
            cloudBase.dataset.bobbingMagnitude = randomRange(config.minBobbingMag, config.maxBobbingMag) * (scaleFactor * 0.5 + 0.5);
            cloudBase.dataset.bobbingSpeedFactor = randomRange(config.minBobbingSpeedFactor, config.maxBobbingSpeedFactor);
            cloudBase.dataset.bobbingOffset = Math.random() * Math.PI * 2;
        }
        cloudBase.style.transform = `translateX(${startX}px) translateY(${baseY}px)`;
        if (container) {
            container.appendChild(cloudBase);
        } else {
            console.error(`Cannot append cloud for ${config.containerSelector}, container not found.`);
            return;
        }
        const numLayers = Math.max(config.minLayersPerCloud, Math.round(randomRange(config.minLayersPerCloud, config.maxLayersPerCloudBase) * scaleFactor));
        const cloudSpecificLayers = [];
        for (let j = 0; j < numLayers; j++) {
            const layer = document.createElement('img');
            const baseOpacity = randomRange(config.minLayerOpacity, config.maxLayerOpacity);
            layer.className = 'cloudLayer';
            layer.src = config.cloudImageUrl;
            layer.loading = 'lazy';
            layer.addEventListener("error", () => {
                console.error("Error loading cloud image:", config.cloudImageUrl);
                layer.style.display = 'none';
            });
            const layerSpread = config.layerBaseSpread * scaleFactor;
            const layerData = {
                x: randomRange(-layerSpread / 1, layerSpread / 1),
                y: randomRange(-layerSpread / 3, layerSpread / 3),
                a: Math.random() * 360,
                rotationSpeed: randomRange(-2, 2),
                baseScale: Math.max(0.2, randomRange(0.6, 1.1) * scaleFactor * config.layerBaseScale),
                baseOpacity: baseOpacity
            };
            if (config.enableLayerOscillation) {
                layerData.oscSpeedFactor = randomRange(config.minLayerOscSpeedFactor, config.maxLayerOscSpeedFactor);
                layerData.oscOffset = Math.random() * Math.PI * 2;
            }
            layer.style.transform = `translateX(${layerData.x}px) translateY(${layerData.y}px) rotateZ(${layerData.a}deg) scale(${layerData.baseScale})`;
            layer.layerData = layerData;
            cloudBase.appendChild(layer);
            layers.push(layer);
            cloudSpecificLayers.push(layer);
        }
        cloudBase.cloudLayers = cloudSpecificLayers;
        cloudBases.push(cloudBase);
    }

    function update(timestamp) {
        if (!container) {
             if (animationFrameId) cancelAnimationFrame(animationFrameId);
             return;
        }
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
        const currentTime = timestamp / 1000;

        if (deltaTime > 0.5) {
            animationFrameId = requestAnimationFrame(update);
            return;
        }

        layers.forEach(layer => {
            if (!layer.layerData || !layer.parentElement) return;
            const data = layer.layerData;
            const cloudBase = layer.parentElement;
            data.a += data.rotationSpeed * deltaTime;
            let currentScale = data.baseScale;
            if (config.enableLayerOscillation && data.oscSpeedFactor) {
                const oscValueScale = Math.sin(currentTime * data.oscSpeedFactor + data.oscOffset);
                currentScale = data.baseScale * (1 + oscValueScale * config.layerScaleOscMagnitude);
                currentScale = Math.max(0.1, currentScale);
            }
            let targetOpacity = data.baseOpacity;
            if (config.enableLayerOscillation && data.oscSpeedFactor) {
                const oscValueOpacity = Math.sin(currentTime * data.oscSpeedFactor + data.oscOffset + Math.PI / 2);
                targetOpacity = data.baseOpacity * (1 + oscValueOpacity * config.layerOpacityOscMagnitude);
                targetOpacity = Math.max(0.05, Math.min(1.0, targetOpacity));
            }
            let appliedOpacity = targetOpacity;
            if (cloudBase.dataset.isFadingIn === 'true') {
                let progress = parseFloat(cloudBase.dataset.fadeInProgress || 0);
                const fadeDuration = config.fadeInDuration > 0 ? config.fadeInDuration : 1.0;
                progress += deltaTime / fadeDuration;
                progress = Math.min(1.0, progress);
                appliedOpacity = targetOpacity * progress;
                cloudBase.dataset.fadeInProgress = progress;
                if (progress >= 1.0) {
                    delete cloudBase.dataset.isFadingIn;
                    delete cloudBase.dataset.fadeInProgress;
                }
            }
            layer.style.opacity = appliedOpacity;
            layer.style.transform = `translateX(${data.x}px) translateY(${data.y}px) rotateZ(${data.a}deg) scale(${currentScale})`;
        });

        const { minY: currentMinY, maxY: currentMaxY } = calculateYRange();
        cloudBases.forEach(cloudBase => {
            if (!cloudBase.dataset.x) return;
            let currentX = parseFloat(cloudBase.dataset.x);
            currentX -= parseFloat(cloudBase.dataset.speed) * deltaTime;
            let currentY = parseFloat(cloudBase.dataset.baseY);
            if (config.enableBobbing && cloudBase.dataset.bobbingMagnitude) {
                const bobbingMagnitude = parseFloat(cloudBase.dataset.bobbingMagnitude);
                const bobbingSpeedFactor = parseFloat(cloudBase.dataset.bobbingSpeedFactor);
                const bobbingOffset = parseFloat(cloudBase.dataset.bobbingOffset);
                const yOffset = Math.sin(currentTime * bobbingSpeedFactor + bobbingOffset) * bobbingMagnitude;
                currentY = parseFloat(cloudBase.dataset.baseY) + yOffset;
                currentY = Math.max(currentMinY - bobbingMagnitude, Math.min(currentMaxY + bobbingMagnitude, currentY));
            }
            const wrapBuffer = config.cloudWrapWidthBuffer * parseFloat(cloudBase.dataset.scaleFactor || 1);
            if (currentX < -wrapBuffer) {
                currentX = screenWidth + randomRange(100, 300);
                cloudBase.dataset.baseY = (currentMinY >= currentMaxY) ? currentMinY : randomRange(currentMinY, currentMaxY);
                currentY = parseFloat(cloudBase.dataset.baseY);
                cloudBase.dataset.speed = randomRange(config.minSpeed, config.maxSpeed);
                if (config.enableBobbing) {
                    cloudBase.dataset.bobbingOffset = Math.random() * Math.PI * 2;
                }
                cloudBase.dataset.isFadingIn = 'true';
                cloudBase.dataset.fadeInProgress = 0;
                if (cloudBase.cloudLayers) {
                    cloudBase.cloudLayers.forEach(layer => {
                        if (layer.style) layer.style.opacity = 0;
                    });
                }
            }
            cloudBase.dataset.x = currentX;
            cloudBase.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`;
        });

        animationFrameId = requestAnimationFrame(update);
    }

    function handleResize() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
    }

    function init() {
        container = document.querySelector(config.containerSelector);
        if (!container) {
            console.error(`Cloud container "${config.containerSelector}" not found. Cannot initialize this layer.`);
            return;
        }
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        if (cloudCreationIntervalId) { clearInterval(cloudCreationIntervalId); cloudCreationIntervalId = null; }
        window.addEventListener('resize', handleResize);
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        console.log(`[${config.containerSelector}] Waiting ${config.initialDelay / 1000}s before starting cloud creation...`);
        setTimeout(() => {
            if (!document.querySelector(config.containerSelector)) {
                 console.error(`[${config.containerSelector}] Container disappeared before cloud creation could start.`);
                 return;
            }
             console.log(`[${config.containerSelector}] Initial delay finished. Creating ${config.initialNumClouds} clouds (1 every ${config.cloudCreationInterval}ms)...`);
            let cloudsCreated = 0;
            cloudCreationIntervalId = setInterval(() => {
                if (container && cloudsCreated < config.initialNumClouds) {
                     if (!document.querySelector(config.containerSelector)){
                         console.warn(`[${config.containerSelector}] Container missing during cloud creation loop. Stopping.`);
                         clearInterval(cloudCreationIntervalId);
                         return;
                     }
                    createCloud();
                    cloudsCreated++;
                    if (cloudsCreated === 1 && !animationFrameId) {
                        console.log(`[${config.containerSelector}] First cloud created, starting animation loop.`);
                        lastTimestamp = 0;
                        animationFrameId = requestAnimationFrame(update);
                     }
                } else {
                    clearInterval(cloudCreationIntervalId);
                    cloudCreationIntervalId = null;
                    if (cloudsCreated >= config.initialNumClouds) {
                        console.log(`[${config.containerSelector}] Finished creating initial ${config.initialNumClouds} clouds.`);
                    }
                }
            }, config.cloudCreationInterval);
        }, config.initialDelay);
    }
    init();
} // End of createCloudLayer function definition
