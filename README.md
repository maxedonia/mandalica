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

Six on-screen sliders allow you to adjust patch output.

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

**Toggle Fade:** (via **F** or MIDI **CC1** value < 3)

**Reset Mandala:** (via **R** or MIDI **CC7** value > 64)

**Randomize Sliders:** (via **Z** or MIDI **CC8** value > 64)


### **Additional Keyboard Shortcuts**
S: Toggle slider visibility.

## **Installation**
Clone the repository:
   
        git clone https://github.com/maxedonia/mandalica.git
        cd your-repo-name

**Running the Mandalica Patch Locally:**

This project needs to be served over HTTP rather than just opening the HTML file directly in your browser. Below are two methods to serve your project using Git Bash (or any terminal).

### Option 1: Using Node.js and `http-server`

1. **Install Node.js:**  
   If you haven’t already, install Node.js from [nodejs.org](https://nodejs.org/).

2. **Install `http-server` Globally:**  
   Open Git Bash and run:
  
        npm install -g http-server

3. Open the index.html file in your browser in your open port address

        https://127.0.0.1:8000 or similar

**(Ensure your browser supports the Web Audio API and, for full functionality, the Web MIDI API.)**

### Option 2: Using Python's Built-In HTTP Server
If you have Python installed, you can serve your project as follows:

**For Python 3**:
Navigate to Your Project Directory:
     
        cd /path/to/your/project
        
Start the Server in Python 3:

        python -m http.server 8000

Start the Server in Python 2:

        python -m SimpleHTTPServer 8000
        
**Access Port:**
Open your web browser and go to:

        http://127.0.0.1:8000

        
## **Usage**
### **Activate the Microphone:**
Click anywhere on the canvas to start the microphone input.

### **Adjust the Visuals:**
Use the on-screen sliders to modify parameters such as fade, color sweep, draw speed, base radius, impact, and symmetry.

### **Control via MIDI:**
Connect your MIDI controller to use the mapped controls for both the sliders and toggle functions.
![mandala_git_gif3](https://github.com/user-attachments/assets/ee781161-89c0-448b-a912-5ff4960b50cc)

You can find a full video demonstration [here](https://youtu.be/O_Std7CS_SE?si=Wob5zYrDjDJRSgMG)

![vid demo image](https://github.com/user-attachments/assets/93c7c1fa-a30f-44ef-a3b6-24087248d96e)


**Note:** *_This patch was originally mapped for functionality with the Teenage Engineering OP-XY, but remains simple enough to employ on a wide variety of MIDI controllers._*

**License**

_This project is open source and available under the MIT License._
