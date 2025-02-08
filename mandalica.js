let mic, fft;
let micConnected = false;
let pg; // Off-screen graphics buffer

// Parameters for the cyclic path:
let angle = 0;
let angleIncrement = 0.005;   // How fast we move around the circle (default)
let baseRadius = 300;         // Radius of the base circle when no audio is present (default)
let deviationMax = 100;       // Maximum additional deviation in radius from audio (default)
let symmetry = 6;             // Number of rotated copies for the mandala effect (default)
let colorSweep = 0;           // Additional cyclic offset for the RGB output (default)

// Fade alpha for the off-screen buffer fade overlay:
let fadeAlpha = 2;            // Controls how quickly old strokes fade (0-20)

// Toggle for the fade effect:
let fadeEnabled = true;       // When false, no fade effect is applied
// (Removed the global mappedFade assignment)

// Variables for storing the previous point (to draw a continuous path)
let prevX, prevY;

// Slider variables:
let sliderColorSweep, sliderFadeAlpha, sliderAngleIncrement, sliderBaseRadius, sliderDeviationMax, sliderSymmetry;

// Fade Toggle UI elements:
let fadeToggleCheckbox;

// Variable to track slider visibility:
let showSliders = true;

// --- MIDI Toggle Latches ---
// These help ensure that a MIDI button press only toggles once per press.
let midiFadeToggleActive = false;
let midiResetToggleActive = false;
let midiRandomToggleActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create an off-screen graphics buffer for drawing & fading:
  pg = createGraphics(width, height);
  pg.background(0);
  
  // Create microphone input and FFT analyzer:
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);
  // (We do not start the mic until user interaction.)
  
  // Create sliders:
  // Slider for Fade Alpha (see mappedfade for behavior)
  sliderFadeAlpha = createSlider(0, 20, 2, 1);
  sliderFadeAlpha.position(10, height - 120);
  sliderFadeAlpha.style('width', '200px');
  
  // Slider for Color Sweep (range 0 to TWO_PI)
  sliderColorSweep = createSlider(0, TWO_PI, 0, 0.01);
  sliderColorSweep.position(10, height - 100);
  sliderColorSweep.style('width', '200px');
  
  // Slider for Angle Increment (range 0 to 0.02)
  sliderAngleIncrement = createSlider(0, 0.02, 0.005, 0.001);
  sliderAngleIncrement.position(10, height - 80);
  sliderAngleIncrement.style('width', '200px');
  
  // Slider for Base Radius (range 100 to 600)
  sliderBaseRadius = createSlider(100, 600, 300, 10);
  sliderBaseRadius.position(10, height - 60);
  sliderBaseRadius.style('width', '200px');
  
  // Slider for Deviation Max (range 0 to 300)
  sliderDeviationMax = createSlider(0, 300, 100, 10);
  sliderDeviationMax.position(10, height - 40);
  sliderDeviationMax.style('width', '200px');
  
  // Slider for Symmetry (range 1 to 12)
  sliderSymmetry = createSlider(1, 12, 6, 1);
  sliderSymmetry.position(10, height - 20);
  sliderSymmetry.style('width', '200px');

  // Create Fade Toggle Checkbox
  fadeToggleCheckbox = createCheckbox('Fade Toggle', fadeEnabled);
  fadeToggleCheckbox.position(10, height - 150);
  fadeToggleCheckbox.changed(() => {
    fadeEnabled = fadeToggleCheckbox.checked();
  });
  
  // Request MIDI access:
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported in this browser.");
  }
}

function draw() {
  // Update parameters from sliders:
  fadeAlpha = sliderFadeAlpha.value();
  colorSweep = sliderColorSweep.value();
  angleIncrement = sliderAngleIncrement.value();
  baseRadius = sliderBaseRadius.value();
  deviationMax = sliderDeviationMax.value();
  symmetry = sliderSymmetry.value();
  
  // Compute mappedFade by inverting the slider value.
  // When slider is 0 -> mappedFade is 20 (clear instantly), 
  // when slider is 20 -> mappedFade is 0 (full sustain)
  let mappedFade = map(sliderFadeAlpha.value(), 0, 20, 20, 0);
  
  // Fade the graphics buffer if fade effect is enabled:
  if (fadeEnabled) {
    if (mappedFade >= 20) {
      pg.background(0);
    } else {
      pg.blendMode(MULTIPLY);
      pg.noStroke();
      pg.fill(200, 200, 200, mappedFade);
      pg.rect(0, 0, width, height);
      pg.blendMode(BLEND);
    }
  }
  
  // If the microphone isn’t activated, display a message on the main canvas.
  if (!micConnected) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Click to activate microphone", width / 2, height / 2);
    image(pg, 0, 0);
    return;
  }
  
  // --- Audio Processing ---
  let vol = mic.getLevel();
  let spectrum = fft.analyze();

  // Get energy values from three frequency bands (range 0 to 255)
  let bassEnergy = fft.getEnergy("bass");
  let midEnergy = fft.getEnergy("mid");
  let trebleEnergy = fft.getEnergy("treble");

  // Adjust brightness so that higher volume gives higher brightness.
  let brightnessAdj = map(vol, 0, 0.05, 0.75, 1);
  
  // Calculate the RGB values based on frequency energies and add a cyclic offset (color sweep)
  let rVal = constrain(bassEnergy * brightnessAdj + 127 * sin(colorSweep), 0, 255);
  let gVal = constrain(midEnergy * brightnessAdj + 127 * sin(colorSweep + TWO_PI/3), 0, 255);
  let bVal = constrain(trebleEnergy * brightnessAdj + 127 * sin(colorSweep + 2*TWO_PI/3), 0, 255);

  // Map volume to stroke weight and dot size:
  let strokeW = map(vol, 0, 0.05, 2, 10);
  let dotSize = map(vol, 0, 0.05, 2, 10);

  // --- Compute the Current Point on the Path ---
  let centerX = width / 2;
  let centerY = height / 2;
  let deviation = map(vol, 0, 0.05, 0, deviationMax) * sin(4 * angle);
  let currentRadius = baseRadius + deviation;
  let x = centerX + currentRadius * cos(angle);
  let y = centerY + currentRadius * sin(angle);

  // --- Draw the Path with Mandala Symmetry on the Buffer ---
  if (prevX !== undefined) {
    for (let i = 0; i < symmetry; i++) {
      let rotation = i * TWO_PI / symmetry;
      pg.push();
      pg.translate(centerX, centerY);
      pg.rotate(rotation);
      pg.stroke(rVal, gVal, bVal);
      pg.strokeWeight(strokeW);
      pg.line(prevX - centerX, prevY - centerY, x - centerX, y - centerY);
      pg.scale(-1, 1);
      pg.line(prevX - centerX, prevY - centerY, x - centerX, y - centerY);
      pg.pop();
    }
  }

  // Update the previous point.
  prevX = x;
  prevY = y;

  // Optionally, draw a small ellipse at the current point (pen tip) on the buffer.
  pg.noStroke();
  pg.fill(rVal, gVal, bVal);
  pg.ellipse(x, y, dotSize, dotSize);

  // Increment the angle to progress along the cyclic path.
  angle += angleIncrement;
  
  // Display the graphics buffer on the main canvas.
  image(pg, 0, 0);
  
  // Show/hide sliders if needed:
  if (showSliders) {
    // Draw slider labels:
    fill(255);
    textSize(12);
    text("Color Sweep: " + nf(sliderColorSweep.value(), 1, 2), sliderColorSweep.x + sliderColorSweep.width + 10, sliderColorSweep.y + 10);
    text("Fade: " + sliderFadeAlpha.value(), sliderFadeAlpha.x + sliderFadeAlpha.width + 10, sliderFadeAlpha.y + 10);
    text("Speed: " + nf(sliderAngleIncrement.value(), 1, 3), sliderAngleIncrement.x + sliderAngleIncrement.width + 10, sliderAngleIncrement.y + 10);
    text("Radius: " + sliderBaseRadius.value(), sliderBaseRadius.x + sliderBaseRadius.width + 10, sliderBaseRadius.y + 10);
    text("Deviation: " + sliderDeviationMax.value(), sliderDeviationMax.x + sliderDeviationMax.width + 10, sliderDeviationMax.y + 10);
    text("Symmetry: " + sliderSymmetry.value(), sliderSymmetry.x + sliderSymmetry.width + 10, sliderSymmetry.y + 10);
  }
}

function onMIDISuccess(midi) {
  for (let input of midi.inputs.values()) {
    input.onmidimessage = onMIDIMessage;
  }
  console.log("MIDI ready!");
}

function onMIDIFailure() {
  console.log("Failed to get MIDI access");
}

function onMIDIMessage(event) {
  let data = event.data;
  let type = data[0] & 0xF0; // Control Change messages: 0xB0–0xBF
  if (type === 176) {
    let controller = data[1];
    let value = data[2]; // Value from 0 to 127

    // Existing mappings for sliders:
    if (controller === 2) { // CC2: Color Sweep
      sliderColorSweep.value(map(value, 0, 127, 0, TWO_PI));
    } else if (controller === 5) { // CC5: Deviation Max
      sliderDeviationMax.value(map(value, 0, 127, 0, 300));
    } else if (controller === 3) { // CC3: Angle Increment
      sliderAngleIncrement.value(map(value, 0, 127, 0, 0.02));
    } else if (controller === 4) { // CC4: Base Radius
      sliderBaseRadius.value(map(value, 0, 127, 100, 600));
    } else if (controller === 1) { // CC1: Fade Alpha
      sliderFadeAlpha.value(map(value, 0, 127, 0, 20));
    } else if (controller === 6) { // CC6: Symmetry
      sliderSymmetry.value(floor(map(value, 0, 127, 1, 12)));
      
    // --- New MIDI Triggers ---
    } else if (controller === 1) { // CC1: Toggle Fade Effect (same as pressing 'F')
      if (value < 124 && !midiFadeToggleActive) {
        fadeEnabled = !fadeEnabled;
        midiFadeToggleActive = true;
        console.log("MIDI fade toggled: " + fadeEnabled);
      } else if (value >= 124) {
        midiFadeToggleActive = false;
      }
    } else if (controller === 7) { // CC7: Reset Mandala (same as pressing 'Z')
      if (value > 64 && !midiResetToggleActive) {
        pg.background(0);
        prevX = undefined;
        prevY = undefined;
        midiResetToggleActive = true;
        console.log("MIDI reset triggered.");
      } else if (value <= 64) {
        midiResetToggleActive = false;
      }
    } else if (controller === 8) { // CC8: Randomize Sliders (same as pressing 'R')
      if (value > 64 && !midiRandomToggleActive) {
        randomizeSliders();
        midiRandomToggleActive = true;
        console.log("MIDI randomize triggered.");
      } else if (value <= 64) {
        midiRandomToggleActive = false;
      }
    }
  }
}

function initMIDI() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported in this browser.");
  }
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
  if (!micConnected) {
    mic.start(() => {
      micConnected = true;
      pg.background(0);  // Clear the buffer when starting.
    });
    initMIDI();
  }
}

function keyPressed() {
  // 'Z' resets the mandala.
  if (key === 'z' || key === 'Z') {
    pg.background(0);
    prevX = undefined;
    prevY = undefined;
    console.log("Mandala reset.");
  }
  // 'S' toggles slider visibility.
  if (key === 's' || key === 'S') {
    showSliders = !showSliders;
    if (showSliders) {
      sliderColorSweep.show();
      sliderFadeAlpha.show();
      sliderAngleIncrement.show();
      sliderBaseRadius.show();
      sliderDeviationMax.show();
      sliderSymmetry.show();
      fadeToggleCheckbox.show();
    } else {
      sliderColorSweep.hide();
      sliderFadeAlpha.hide();
      sliderAngleIncrement.hide();
      sliderBaseRadius.hide();
      sliderDeviationMax.hide();
      sliderSymmetry.hide();
      fadeToggleCheckbox.hide();
    }
    console.log("Slider visibility: " + showSliders);
  }
  // 'F' toggles the fade effect on/off.
  if (key === 'f' || key === 'F') {
    fadeEnabled = !fadeEnabled;
    fadeToggleCheckbox.checked(fadeEnabled);
    console.log("Fade effect toggled: " + fadeEnabled);
  }
  // 'R' randomizes slider values.
  if (key === 'r' || key === 'R') {
    randomizeSliders();
  }
}

function randomizeSliders() {
  // Randomize each slider within its range:
  sliderColorSweep.value(random(0, TWO_PI));
  sliderFadeAlpha.value(floor(random(0, 21))); // integer between 0 and 20
  sliderAngleIncrement.value(random(0, 0.02));
  sliderBaseRadius.value(round(random(100, 600) / 10) * 10);
  sliderDeviationMax.value(round(random(0, 300) / 10) * 10);
  sliderSymmetry.value(floor(random(1, 13)));
  console.log("Sliders randomized.");
}
