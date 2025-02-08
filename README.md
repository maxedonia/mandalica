# mandalica
## **Audio-Reactive Mandala Visualizer**
This repository contains a p5.js script that generates an ever-evolving, audio-reactive mandala. The script leverages microphone input, FFT analysis, and MIDI integration to create a mesmerizing visual experience where every detail can be dynamically controlled.

## **Features**
### **Dynamic Audio-Reactive Visuals**
Uses microphone input and FFT analysis to generate a cyclic drawing path that changes in real time based on audio data. Audio parameters modulate stroke thickness, brightness, and deviation from a base circular path to create intricate patterns.

### **Symmetry & Mirroring**
The cyclic path is replicated and mirrored around the canvas center with adjustable symmetry, resulting in kaleidoscopic visuals.

### **Customizable Parameters**
Six on-screen sliders allow you to adjust:

**Fade:** Controls the fade overlay. (Inverted behavior: sliding left clears the canvas instantly, while sliding right provides full sustain.)
**Color Sweep:** Adjusts a cyclic color offset that modulates the RGB values.
**Draw Speed:** Alters the speed at which the cyclic path is drawn.
**Base Radius:** Sets the size of the base circle.
**Deviation:** Determines how much the audio input modulates the path’s radius.
**Symmetry:** Changes the number of symmetric copies drawn.

### **MIDI Integration**
Fully MIDI-enabled for live performance and control:

### **Parameter Mapping:**
**Fade:** CC1

**Color Sweep:** CC2

**Draw Speed:** CC3

**Base Radius:** CC4

**Impact:** CC5

**Symmetry:** CC6

*Additional MIDI triggers (and corresponding keyboard shortcuts) allow for:*

**Toggle Fade:** (via **F** or MIDI **CC value < 124**)

**Reset Mandala:** (via **R** or MIDI **CC7** trigger)

**Randomize Sliders:** (via** Z** or MIDI **CC8** trigger)


### **Additional Keyboard Shortcuts**
S: Toggle slider visibility.

## **Installation**
Clone the repository:

    git clone https://github.com/maxedonia/mandalica.git
    cd your-repo-name

Open the index.html file in your browser.
**(Ensure your browser supports the Web Audio API and, for full functionality, the Web MIDI API.)**

## **Usage**
### **Activate the Microphone:**
Click anywhere on the canvas to start the microphone input.

### **Adjust the Visuals:**
Use the on-screen sliders to modify parameters such as fade, color sweep, draw speed, base radius, impact, and symmetry.

### **Control via MIDI:**
Connect your MIDI controller to use the mapped controls for both the sliders and toggle functions.

*This patch was originally mapped for functionality with the Teenage Engineering OP-XY, but is simple enough to employ on a wide variety of MIDI controllers.*

License
This project is open source and available under the MIT License.
