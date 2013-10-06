<h1>NewgroundsHTMLAudio</h1>
The Newgrounds audio player in HTML/CSS/Javascript by Dave Pagurek

<h2>Versions</h2>
The <strong>visualizer</strong> version includes some basic visualizations and a basic API to add more visualizations.

The <strong>small</strong> version is made for embeds, stretches to fit its container's width using CSS, and is reprogrammed to be more modular since it doesn't need any video capabilities.

The <strong>video</strong> version is a basic prototype that adapts the visualizer version for use with a `<video>` tag, including basic fullscreen support.

<h2>Usage for Visualizer Version</h2>
Create a new AudioPlayer with the following params:
```javascript
new AudioPlayer(autoplay:Boolean, loop:Boolean, visualizerFunction:Function);
```

The visualizerFunction takes two parameters:
```javascript
function (soundData:Uint8Array, stage:CanvasRenderingContext2D) {}
```

The soundData array has the volumes for each frequency of the spectrum.
The stage context is a reference to the visualizer canvas's 2d context, ready to be drawn onto.

When making a visualizer, you can access the following properties of the AudioPlayer variable you made:
- `width:Number`
- `height:Number`
- `playing:Boolean`