// Musical Mandala with RGB Colors, Fading, Sliders, and MIDI Integration
// ---------------------------------------------------------
// Conditions:
// 1. Real-time audio reactive visuals (mic input & FFT)
// 2. FFT analysis drives a cyclic path (perfect circle when no audio)
// 3. Audio modulates the cycle’s radius to deviate from a circle
// 4. Higher volume yields thicker strokes and (now) higher brightness
// 5. Three frequency bands (bass, mid, treble) determine the RGB channels
// 6. The drawn path is symmetrically replicated (rotated & mirrored) for a mandala effect
// 7. Five sliders allow interactive control of parameters
// 8. MIDI integration assigns four controller dials to these sliders plus one for color sweep
// ---------------------------------------------------------

let mic, fft;
let micConnected = false;
let pg; // Off-screen graphics buffer

// Parameters for the cyclic path:
let angle = 0;
let angleIncrement = 0.005;   // Default speed of rotation
let baseRadius = 300;         // Default base radius (circle when no audio)
let deviationMax = 100;       // Default max deviation from base radius due to audio
let symmetry = 6;             // Default number of symmetric copies

// Additional parameter: Color Sweep – a cyclic offset applied to the RGB output.
let colorSweep = 0;           // Ranges from 0 to TWO_PI

// Variables to store the previous point for continuous drawing:
let prevX, prevY;

// Slider variables:
let sliderAngleIncrement, sliderBaseRadius, sliderDeviationMax, sliderSymmetry, sliderColorSweep;

// MIDI integration variables:
let midiAccess; // Will hold the MIDI access object

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create off-screen graphics buffer for drawing and fading:
  pg = createGraphics(width, height);
  pg.background(0);
  
  // Create mic input and FFT analyzer:
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);
  // (Mic is not started until user interaction.)
  
  // Create sliders:
  sliderColorSweep = createSlider(0, TWO_PI, 0, 0.01);
  sliderColorSweep.position(10, height - 100);
  sliderColorSweep.style('width', '200px');
  
  sliderAngleIncrement = createSlider(0, 0.02, 0.005, 0.001);
  sliderAngleIncrement.position(10, height - 80);
  sliderAngleIncrement.style('width', '200px');
  
  sliderBaseRadius = createSlider(100, 600, 300, 10);
  sliderBaseRadius.position(10, height - 60);
  sliderBaseRadius.style('width', '200px');
  
  sliderDeviationMax = createSlider(0, 300, 100, 10);
  sliderDeviationMax.position(10, height - 40);
  sliderDeviationMax.style('width', '200px');
  
  sliderSymmetry = createSlider(1, 12, 6, 1);
  sliderSymmetry.position(10, height - 20);
  sliderSymmetry.style('width', '200px');
  
  // Request MIDI Access:
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported in this browser.");
  }
}

function draw() {
  // Update parameters from sliders:
  angleIncrement = sliderAngleIncrement.value();
  baseRadius = sliderBaseRadius.value();
  deviationMax = sliderDeviationMax.value();
  symmetry = sliderSymmetry.value();
  colorSweep = sliderColorSweep.value();
  
  // Fade the graphics buffer slowly without washing out color:
  pg.blendMode(MULTIPLY);
  pg.noStroke();
  pg.fill(200, 200, 200, 2); // Use a very low alpha for long sustain fade
  pg.rect(0, 0, width, height);
  pg.blendMode(BLEND);
  
  // If mic isn't activated, show message on main canvas:
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
  
  // Get energy values from three frequency bands (range 0–255)
  let bassEnergy = fft.getEnergy("bass");
  let midEnergy = fft.getEnergy("mid");
  let trebleEnergy = fft.getEnergy("treble");
  
  // Adjust brightness so that higher volume gives higher brightness.
  // Map volume: when low, brightnessAdj is 0.5; when high, brightnessAdj is 1.
  let brightnessAdj = map(vol, 0, 0.05, 0.5, 1);
  
  // Apply the color sweep offset to each channel.
  // We'll use sine functions shifted by 120° to generate variation.
  let rVal = constrain(bassEnergy * brightnessAdj + 127 * sin(colorSweep), 0, 255);
  let gVal = constrain(midEnergy * brightnessAdj + 127 * sin(colorSweep + TWO_PI/3), 0, 255);
  let bVal = constrain(trebleEnergy * brightnessAdj + 127 * sin(colorSweep + 2*TWO_PI/3), 0, 255);
  
  // Map volume to stroke weight and dot size:
  let strokeW = map(vol, 0, 0.05, 1, 10);
  let dotSize = map(vol, 0, 0.05, 2, 10);
  
  // --- Compute the Current Point on the Path ---
  let centerX = width / 2;
  let centerY = height / 2;
  // Compute deviation: without audio (vol ~ 0), deviation is 0; with audio, deviation increases.
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
      // Mirror horizontally to enhance the effect:
      pg.scale(-1, 1);
      pg.line(prevX - centerX, prevY - centerY, x - centerX, y - centerY);
      pg.pop();
    }
  }
  
  // Update previous point for continuous drawing.
  prevX = x;
  prevY = y;
  
  // Optionally, draw a small ellipse (pen tip) at the current point on the buffer.
  pg.noStroke();
  pg.fill(rVal, gVal, bVal);
  pg.ellipse(x, y, dotSize, dotSize);
  
  // Increment angle to progress along the cyclic path.
  angle += angleIncrement;
  
  // Display the graphics buffer on the main canvas.
  image(pg, 0, 0);
  
  // Draw slider labels:
  fill(255);
  textSize(12);
  text("Speed: " + nf(sliderAngleIncrement.value(), 1, 3), sliderAngleIncrement.x + sliderAngleIncrement.width + 10, sliderAngleIncrement.y + 10);
  text("Base Radius: " + sliderBaseRadius.value(), sliderBaseRadius.x + sliderBaseRadius.width + 10, sliderBaseRadius.y + 10);
  text("Deviation Max: " + sliderDeviationMax.value(), sliderDeviationMax.x + sliderDeviationMax.width + 10, sliderDeviationMax.y + 10);
  text("Symmetry: " + sliderSymmetry.value(), sliderSymmetry.x + sliderSymmetry.width + 10, sliderSymmetry.y + 10);
  text("Color Sweep: " + nf(sliderColorSweep.value(), 1, 2), sliderColorSweep.x + sliderColorSweep.width + 10, sliderColorSweep.y + 10);
}

// MIDI integration functions:
function onMIDISuccess(midi) {
  midiAccess = midi;
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = onMIDIMessage;
  }
  console.log("MIDI ready!");
}

function onMIDIFailure() {
  console.log("Failed to get MIDI access");
}

function onMIDIMessage(event) {
  let data = event.data;
  let type = data[0] & 0xF0; // Control Change messages have status 0xB0 (176) to 0xBF
  if (type === 176) { // Control Change
    let controller = data[1];
    let value = data[2]; // Range 0-127
    // Map MIDI controllers to sliders:
    if (controller === 1) { // Angle Increment
      sliderAngleIncrement.value(map(value, 0, 127, 0, 0.02));
    } else if (controller === 2) { // Base Radius
      sliderBaseRadius.value(map(value, 0, 127, 100, 600));
    } else if (controller === 3) { // Deviation Max
      sliderDeviationMax.value(map(value, 0, 127, 0, 300));
    } else if (controller === 4) { // Symmetry
      sliderSymmetry.value(floor(map(value, 0, 127, 1, 12)));
    } else if (controller === 5) { // Color Sweep
      sliderColorSweep.value(map(value, 0, 127, 0, TWO_PI));
    }
  }
}

// Request MIDI access:
function initMIDI() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log("Web MIDI API not supported in this browser.");
  }
}

function mousePressed() {
  // On mouse press, resume the AudioContext (if needed) and start the mic.
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
  if (!micConnected) {
    mic.start(() => {
      micConnected = true;
      pg.background(0); // Clear the graphics buffer when starting.
    });
    // Initialize MIDI access once the user interacts:
    initMIDI();
  }
}
