function AudioPlayer(_autoPlay, _loop, _function) {
  var visualization = document.getElementById("visualization");
  var stage;
  var playBtn =document.getElementById("play");
  var currentTime = document.getElementById("currentTime");
  var totalTime = document.getElementById("totalTime");
  var seekBg = document.getElementById("seek");
  var seekHolder = document.getElementById("seekHolder");
  var seekFill = document.getElementById("seekFill");
  var seekDrag = document.getElementById("seekDrag");
  var muteBtn = document.getElementById("mute");
  var volumeIcon = document.getElementById("volumeIcon");
  var volumeOverlay = document.getElementById("volumeOverlay");
  var volumeFill = document.getElementById("volumeFill");
  var volumePercent = document.getElementById("volumePercent");
  var loopBtn = document.getElementById("loop");
  var loopIcon = document.getElementById("loopIcon");
  var timeLabel = document.getElementById("timeLabel");
  var oldVolume = 1;
  var context;
  var analyser;
  var source;
  var animationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
  
  this.volume = 1;
  this.loop = _loop;
  this.autoPlay = _autoPlay;
  this.song = new Audio("http://audio.ngfiles.com/551000/551191_Pressure.mp3");
  this.playing = false;
  this.width = 590;
  this.height = 290;
  this.visualizerFunction = _function;
  
  this.play = function() {
    playBtn.innerHTML="<i class='icon-pause'></i>";
    this.playing=true;
    this.song.play();
  };
  
  this.pause = function() {
    playBtn.innerHTML="<i class='icon-play'></i>";
    this.playing=false;
    this.song.pause();
  };
  
  var togglePlay = function(event) {
    if (event) event.preventDefault();
    if (this.song.paused) {
      this.play();
    } else {
      this.pause();
    }
  }.bind(this);
  
  var formatTime = function(i) {
    var minutes=Math.floor(i/60);
    var seconds=Math.floor(i%60);
    return ((minutes < 10) ? ("0" + minutes) : minutes) + ":" + ((seconds < 10) ? ("0" + seconds) : seconds);
  };
  
  var getMousePos = function(evt, element) {
    var rect = element.getBoundingClientRect();
    var root = document.documentElement;
    
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    
    return {x:mouseX, y:mouseY};
  }.bind(this);
  
  var changeTime = function(event) {
    event.preventDefault();
    this.song.addEventListener("timeupdate", updateTime, false);
    document.removeEventListener("mousemove", seek, false);
    document.removeEventListener("mouseup", changeTime, false);
    event.preventDefault();
    var mousePos = getMousePos(event, seekBg);
    this.seekTo((mousePos.x/seekBg.offsetWidth)*this.song.duration);
    return false;
  }.bind(this);
  
  var startSeek = function(event) {
    event.preventDefault();
    this.song.removeEventListener("timeupdate", updateTime, false);
    document.addEventListener("mousemove", seek, false);
    document.addEventListener("mouseup", changeTime, false);
    return false;
  }.bind(this);
  
  var seek = function(event) {
    event.preventDefault();
    var mousePos = getMousePos(event, seekBg);
    var dragTime = (mousePos.x/seekBg.offsetWidth)*this.song.duration;
    timeLabel.innerHTML = formatTime(dragTime);
    if (Math.round((1-(dragTime/this.song.duration))*(seekBg.offsetWidth))+3<timeLabel.offsetWidth/2) {
      timeLabel.style.left = (seekHolder.offsetWidth-timeLabel.offsetWidth) + "px";
    } else if (Math.round(((dragTime/this.song.duration))*(seekBg.offsetWidth)+3)<timeLabel.offsetWidth/2) {
      timeLabel.style.left="0px";
    } else {
      timeLabel.style.left = Math.round(((dragTime/this.song.duration))*(seekBg.offsetWidth)+3-timeLabel.offsetWidth/2) + "px";
    }
    seekFill.style.width = Math.round((dragTime/this.song.duration)*(seekBg.offsetWidth-2))+"px";
    seekDrag.style.left = Math.round((dragTime/this.song.duration)*(seekBg.offsetWidth-2))+"px";
    return false;
  }.bind(this);
  
  var updateTime = function(event) {
    currentTime.innerHTML = formatTime(this.song.currentTime);
    timeLabel.innerHTML = currentTime.innerHTML;
    if (Math.round((1-(this.song.currentTime/this.song.duration))*(seekBg.offsetWidth))+3<timeLabel.offsetWidth/2) {
      timeLabel.style.left = (seekHolder.offsetWidth-timeLabel.offsetWidth) + "px";
    } else if (Math.round(((this.song.currentTime/this.song.duration))*(seekBg.offsetWidth)+3)<timeLabel.offsetWidth/2) {
      timeLabel.style.left="0px";
    } else {
      timeLabel.style.left = Math.round(((this.song.currentTime/this.song.duration))*(seekBg.offsetWidth)+3-timeLabel.offsetWidth/2) + "px";
    }
    seekFill.style.width = Math.round((this.song.currentTime/this.song.duration)*(seekBg.offsetWidth-2))+"px";
    seekDrag.style.left = Math.round((this.song.currentTime/this.song.duration)*(seekBg.offsetWidth-2))+"px";
  }.bind(this);
  
  this.turnOffLoop = function() {
    this.loop = false;
    this.song.loop=false;
    loopIcon.className = "icon-ban-circle";
  };
  
  this.turnOnLoop = function() {
    this.loop = true;
    this.song.loop=true;
    loopIcon.className = "icon-refresh icon-flip-horizontal";
  };
  
  var toggleLoop = function(event) {
    if (event) event.preventDefault();
    if (this.loop) {
      this.turnOffLoop();
    } else {
      this.turnOnLoop();
    }
  }.bind(this);
  
  this.seekTo = function(time) {
    this.song.currentTime=time;
  };
  
  this.resetSong = function(event) {
    if ((event && !this.loop) || !event) {
      this.seekTo(0);
      this.pause();
    }
  }.bind(this);
  
  this.changeVolume = function(volume) {
    if (volume !== 0) oldVolume = volume;
    this.volume = volume;
    this.song.volume = volume;
  };
  
  this.mute = function() {
    oldVolume = this.volume;
    this.changeVolume(0);
  };
  
  this.unMute = function() {
    this.changeVolume(oldVolume);
  };
  
  var toggleMute = function(event) {
    if (this.volume===0) {
      this.unMute();
    } else {
      this.mute();
    }
  }.bind(this);
  
  var updateVolume = function(event) {
    volumePercent.innerHTML = Math.round(this.volume*100);
    volumeFill.style.height = Math.round(this.volume*70)+"px";
    if (this.volume===0) {
      volumeIcon.className = "icon-volume-off";
    } else if (Math.round(this.volume)===0) {
      volumeIcon.className = "icon-volume-down";
    } else {
      volumeIcon.className = "icon-volume-up";
    }
  }.bind(this);
  
  var startDragVolume = function(event) {
    event.preventDefault();
    muteBtn.removeEventListener("mousedown", startDragVolume, false);
    document.addEventListener("mousemove", changeVolumeSlider, false);
    document.addEventListener("mouseup", dropVolumeSlider, false);
    return false;
  }.bind(this);
  
  var dropVolumeSlider = function(event) {
    event.preventDefault();
    muteBtn.addEventListener("mousedown", startDragVolume, false);
    document.removeEventListener("mousemove", changeVolumeSlider, false);
    document.removeEventListener("mouseup", dropVolumeSlider, false);
    return false;
  }.bind(this);
  
  var changeVolumeSlider = function(event) {
    event.preventDefault();
    var mousePos = getMousePos(event, volumeOverlay);
    var newVolume = (volumeOverlay.offsetHeight-mousePos.y)/volumeOverlay.offsetHeight;
    if (newVolume>1) newVolume=1;
    if (newVolume<=0) {
      toggleMute();
    } else {
      this.changeVolume(newVolume);
    }
    return false;
  }.bind(this);
  
  var visualizeAudio = function (time) {
    animationFrame(visualizeAudio, visualization);
    
    if (this.playing) {
    
      var freqByteData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqByteData);
      
      if (this.visualizerFunction) {
        this.visualizerFunction(freqByteData, stage);
      }
    }
  }.bind(this);
  
  var init = function() {
    totalTime.innerHTML = formatTime(this.song.duration);
    visualization.width=this.width;
    visualization.height=this.height;
    
    if (visualization.getContext) {
      stage = visualization.getContext("2d");
    }
    
    var aContext = window.audioContext || window.webkitAudioContext;
    if (aContext) {
      context = new webkitAudioContext();
      analyser = context.createAnalyser();
      source = context.createMediaElementSource(this.song);
      source.connect(analyser);
      analyser.connect(context.destination);
      if (this.visualizerFunction && stage) {
        visualizeAudio();
      }
    } else {
      console.log("No Audio Context support.");
    }
    
    if (this.autoPlay) {
      this.play();
    }
    playBtn.addEventListener("click", togglePlay, false);
    seekBg.addEventListener("mousedown", startSeek, false);
    seekFill.addEventListener("mousedown", startSeek, false);
    seekDrag.addEventListener("mousedown", startSeek, false);
    loopBtn.addEventListener("click", toggleLoop, false);
    muteBtn.addEventListener("mousedown", startDragVolume, false);
    muteBtn.addEventListener("click", changeVolumeSlider, false);
    this.song.addEventListener("timeupdate", updateTime, false);
    this.song.addEventListener("ended", this.resetSong, false);
    this.song.addEventListener("volumechange", updateVolume, false);
  }.bind(this);
  
  
  this.song.addEventListener("canplaythrough", init, false);
  if (this.loop) {
    this.turnOnLoop();
  } else {
    this.turnOffLoop();
  }
}

//Visualizations
var time=0;

function bars (data, stage) {
  stage.fillStyle="rgba(0, 100, 73, 0.2)";
  stage.fillRect(0, 0, a.width, a.height);
  stage.fillStyle = "rgba(22, 160, 133, 1)";
  var numBars = 40;
  var skip = 2;
  var length = a.width/numBars;
  for (var i=0; i<numBars*skip; i+=skip) {
    var magnitude = Math.abs((data[i]/255)*(a.height*0.9));
    stage.fillRect((i/skip)*length, a.height-magnitude, length*0.8, magnitude);
  }
  time++;
  if (time==600) {
    a.visualizerFunction = radial;
    time=0;
  }
}

function radial(data, stage) {
  if (!window.rotation) window.rotation=0;
  stage.fillStyle="rgba(0, 100, 73, 0.2)";
  stage.fillRect(0, 0, a.width, a.height);
  stage.strokeStyle = "rgba(22, 160, 133, 1)";
  stage.lineWidth = 2;
  var numBars = 100;
  var angleInc = 360/numBars;
  var minRadius = 5;
  var maxRadius = 160;
  var lastX;
  var lastY;
  var firstX;
  var firstY;
  stage.beginPath();
  for (var i=0; i<numBars*2; i+=2) {
    var radius = minRadius + (data[i]/255 * (maxRadius - minRadius));
    var angle = (((i/2)*angleInc)*Math.PI)/180 + rotation;
    var x = a.width/2 + Math.sin(angle)*radius;
    var y = a.height/2 + Math.cos(angle)*radius;
    if (lastX && lastY) {
      stage.lineTo(x, y);
      firstX=x;
      firstY=y;
    }
    lastX=x;
    lastY=y;
  }
  stage.closePath();
  stage.stroke();
  rotation+=0.01;
  if (rotation>=Math.PI*4) rotation=0;
  time++;
  if (time==600) {
    a.visualizerFunction = bars;
    time=0;
  }
}

var a = new AudioPlayer(false, false, bars);

/*
HOW TO USE
----------------------
Create a new AudioPlayer with the following params:
new AudioPlayer(autoplay:Boolean, loop:Boolean, visualizerFunction:Function);

The visualizerFunction takes two parameters:
function (soundData:Uint8Array, stage:CanvasRenderingContext2D) {}

The soundData array has the volumes for each frequency of the spectrum.
The stage context is a reference to the visualizer canvas's 2d context, ready to be drawn onto.

When making a visualizer, you can access the following properties of the AudioPlayer variable you made:
- width:Number
- height:Number
- playing:Boolean
*/