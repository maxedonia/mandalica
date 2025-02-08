# mandalica
This p5.js script creates an ever-evolving, audio-reactive mandala that transforms in real time based on your microphone input and MIDI controls. The script processes audio with FFT to extract volume and frequency data, which in turn modulate a cyclic drawing path. This path is then symmetrically replicated and mirrored to produce a mesmerizing mandala effect.

**Key Features:**

**Dynamic Audio-Reactive Visuals:**
Uses microphone input and FFT analysis to modulate stroke thickness, brightness, and the deviation of a cyclic path—resulting in an ever-changing mandala pattern.

**Symmetry & Mirroring:**
The cyclic path is replicated around the canvas center, with adjustable symmetry that creates intricate, kaleidoscopic visuals.

**Customizable Parameters:**
Six UI sliders let you fine-tune the look and behavior of the mandala:

**Fade:** Controls the fading overlay. (Inverted behavior: sliding left gives no fade—clear instantly, while sliding right yields full sustain.)
**Color Sweep:** Adjusts a cyclic offset to modulate the RGB output.
**Draw Speed:** Alters how fast the cyclic path is drawn.
**Base Radius:** Sets the radius of the base circle.
**Deviation:** Determines how much the audio input modulates the path’s radius.
**Symmetry:** Changes the number of symmetric copies drawn.

**MIDI Integration:**
Fully MIDI-enabled for live performance:

**Parameter Mapping:** 
Each slider is assigned to a MIDI CC (Fade: CC1, Color Sweep: CC2, Draw Speed: CC3, Base Radius: CC4, Impact: CC5, Symmetry: CC6).
**Toggle Triggers:** 
Additional MIDI triggers (and keyboard shortcuts) let you toggle the fade effect, reset the mandala, or randomize all slider values on the fly.
**Interactive UI & Keyboard Shortcuts:**
In addition to MIDI control, the script provides an on-screen UI with toggle checkboxes and supports keyboard shortcuts (e.g., F for fade toggle, R/Z for reset/randomize) for seamless interaction.

_Perfect for live visual performances, interactive installations, or exploring creative audio-visual art, this mandala visualizer is a versatile tool for experimentation and artistic expression._
