<h1>NewgroundsHTMLAudio</h1>
The Newgrounds audio player in HTML/CSS/Javascript by Dave Pagurek

<h2>Usage</h2>
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