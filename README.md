# mandalica
## **Audio-Reactive Mandala Visualizer**
Mandalica is a p5.js script that generates an ever-evolving, audio-reactive mandala. The script leverages microphone input, FFT analysis, and MIDI integration to create a visual experience where details and style can be dynamically controlled.
![mandala_git_gif1](https://github.com/user-attachments/assets/78146cd2-34ae-4b77-983b-debe260f112f)
You can find a full video demonstration [here](https://youtu.be/O_Std7CS_SE?si=Wob5zYrDjDJRSgMG)
## **Features**
### **Dynamic Audio-Reactive Visuals**
Uses microphone input and FFT analysis to generate a cyclic drawing path that changes in real time based on audio data. Audio parameters modulate stroke thickness, brightness, and deviation from a base circular path to create intricate patterns.

### **Symmetry & Mirroring**
The cyclic path is replicated and mirrored around the canvas center with adjustable symmetry, resulting in kaleidoscopic visuals.

### **Customizable Parameters**
Six on-screen sliders allow you to adjust:

**Fade:** Controls the fade overlay.

**Color Sweep:** Adjusts a cyclic color offset that modulates the RGB values.

**Draw Speed:** Alters the speed at which the cyclic path is drawn.

**Base Radius:** Sets the size of the base circle.

**Deviation:** Determines how much the audio input modulates the path’s radius.

**Symmetry:** Changes the number of symmetric copies drawn.

![mandala_git_gif2](https://github.com/user-attachments/assets/c3733b11-2aed-41c2-b4f4-00ef955e05dc)

## **MIDI Integration**
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
![mandala_git_gif3](https://github.com/user-attachments/assets/ee781161-89c0-448b-a912-5ff4960b50cc)

![vid demo image](https://github.com/user-attachments/assets/93c7c1fa-a30f-44ef-a3b6-24087248d96e)

You can find a full video demonstration [here](https://youtu.be/O_Std7CS_SE?si=Wob5zYrDjDJRSgMG)

**Note:** *_This patch was originally mapped for functionality with the Teenage Engineering OP-XY, but is simple enough to employ on a wide variety of MIDI controllers._*

**License**

_This project is open source and available under the MIT License._
