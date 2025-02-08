// Musical Mandala using RGB colors (instead of HSB)
// Conditions implemented:
// 1. Real-time audio reactive visuals via mic input & FFT
// 2. FFT analysis drives a plotted cyclic path (perfect circle when no audio)
// 3. Audio input modulates the cycle’s radius to deviate from a circle
// 4. Higher volume yields thicker strokes and darker colors
// 5. Three frequency bands (bass, mid, treble) set the R, G, and B values
// 6. The drawn path is symmetrically replicated (rotated & mirrored) to create a mandala effect

let mic, fft;
let micConnected = false;

// Parameters for the cyclic (base circle) path:
let angle = 0;
let angleIncrement = 0.005;   // How fast we move around the circle
let baseRadius = 300;        // Radius of the base circle when no audio is present
let deviationMax = 100;      // Maximum additional deviation in radius from audio

// Mandala symmetry:
let symmetry = 6;            // Number of rotated copies for the mandala effect

// Variables for storing the previous point (to draw a continuous path)
let prevX, prevY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);  // Start with a black background

  // Create microphone input and FFT analyzer:
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  fft.setInput(mic);

  // (We do not start the mic until user interaction.)
}

function draw() {
  // Draw a translucent black rectangle to slowly fade old strokes
  noStroke();
  fill(0, 0, 0, 10);  // low alpha means long trails
  rect(0, 0, width, height);

  // If the microphone hasn’t been activated, display a message.
  if (!micConnected) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Click to activate microphone", width / 2, height / 2);
    return;
  }

  // Get the current volume level from the mic.
  let vol = mic.getLevel();
  let spectrum = fft.analyze();

  // Get the energy values from three frequency bands.
  // These values range from 0 to 255.
  let bassEnergy = fft.getEnergy("bass");     // low frequencies
  let midEnergy = fft.getEnergy("mid");         // mid frequencies
  let trebleEnergy = fft.getEnergy("treble");   // high frequencies

  // Use these energies as our color channels.
  // To make higher volume yield darker colors, we use a brightness adjustment factor.
  // When vol is low, brightnessAdj is 1 (full brightness); when vol is high, we lower it.
  let brightnessAdj = map(vol, 0, 0.05, 1, 0.5);
  let rVal = constrain(bassEnergy * brightnessAdj, 0, 255);
  let gVal = constrain(midEnergy * brightnessAdj, 0, 255);
  let bVal = constrain(trebleEnergy * brightnessAdj, 0, 255);

  // Map volume to stroke weight and dot size:
  let strokeW = map(vol, 0, 0.05, 1, 10);
  let dotSize = map(vol, 0, 0.05, 2, 10);

  // Compute a "deviation" value to modulate the radius.
  // With no audio (vol near 0) deviation = 0 and the path is a perfect circle.
  // With audio, deviation increases (and we add a sinusoidal modulation for variation).
  let deviation = map(vol, 0, 0.05, 0, deviationMax) * sin(4 * angle);
  let currentRadius = baseRadius + deviation;

  // Compute the current point on the circle (centered at the canvas center).
  let centerX = width / 2;
  let centerY = height / 2;
  let x = centerX + currentRadius * cos(angle);
  let y = centerY + currentRadius * sin(angle);

  // --- Draw the Path with Mandala Symmetry ---
  // If there is a previous point, draw a line from the previous point to the current one.
  if (prevX !== undefined) {
    for (let i = 0; i < symmetry; i++) {
      // Compute the rotation for each symmetric copy.
      let rotation = i * TWO_PI / symmetry;
      push();
      translate(centerX, centerY);
      rotate(rotation);
      stroke(rVal, gVal, bVal);
      strokeWeight(strokeW);
      line(prevX - centerX, prevY - centerY, x - centerX, y - centerY);
      // Mirror horizontally to enhance the mandala effect.
      scale(-1, 1);
      line(prevX - centerX, prevY - centerY, x - centerX, y - centerY);
      pop();
    }
  }

  // Update the previous point.
  prevX = x;
  prevY = y;

  // Optionally, draw a small ellipse at the current point to represent the pen tip.
  noStroke();
  fill(rVal, gVal, bVal);
  ellipse(x, y, dotSize, dotSize);

  // Increment the angle to progress along the cyclic path.
  angle += angleIncrement;
}

function mousePressed() {
  // On mouse press, resume the AudioContext (required by some browsers)
  // and start the microphone if it hasn't been started.
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
  if (!micConnected) {
    mic.start(() => {
      micConnected = true;
      background(0);  // Clear the canvas when starting
    });
  }
}
