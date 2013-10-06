function VideoPlayer(_autoPlay) {
  var player = document.getElementById("player");
  var playBtn =document.getElementById("play");
  var currentTime = document.getElementById("currentTime");
  var totalTime = document.getElementById("totalTime");
  var seekBg = document.getElementById("seek");
  var seekHolder = document.getElementById("seekHolder");
  var seekLoaded = document.getElementById("loaded");
  var seekFill = document.getElementById("seekFill");
  var seekDrag = document.getElementById("seekDrag");
  var muteBtn = document.getElementById("mute");
  var volumeIcon = document.getElementById("volumeIcon");
  var volumeOverlay = document.getElementById("volumeOverlay");
  var volumeFill = document.getElementById("volumeFill");
  var volumePercent = document.getElementById("volumePercent");
  var timeLabel = document.getElementById("timeLabel");
  var fullscreenBtn = document.getElementById("fullscreen");
  var fullscreenIcon = document.getElementById("fullscreenIcon");
  var oldVolume = 1;
  var context;
  var analyser;
  var source;
  var animationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
  
  this.volume = 1;
  this.loop = false;
  this.autoPlay = _autoPlay;
  this.video = document.getElementById("video");
  this.playing = false;
  this.width = 590;
  this.height = 290;
  this.fullscreen = false;
  
  this.play = function() {
    playBtn.innerHTML="<i class='icon-pause'></i>";
    this.playing=true;
    this.video.play();
  };
  
  this.pause = function() {
    playBtn.innerHTML="<i class='icon-play'></i>";
    this.playing=false;
    this.video.pause();
  };
  
  var togglePlay = function(event) {
    if (event) event.preventDefault();
    if (this.video.paused) {
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
    this.video.addEventListener("timeupdate", updateTime, false);
    document.removeEventListener("mousemove", seek, false);
    document.removeEventListener("mouseup", changeTime, false);
    event.preventDefault();
    var mousePos = getMousePos(event, seekBg);
    this.seekTo((mousePos.x/seekBg.offsetWidth)*this.video.duration);
    return false;
  }.bind(this);
  
  var startSeek = function(event) {
    event.preventDefault();
    this.video.removeEventListener("timeupdate", updateTime, false);
    document.addEventListener("mousemove", seek, false);
    document.addEventListener("mouseup", changeTime, false);
    return false;
  }.bind(this);
  
  var seek = function(event) {
    event.preventDefault();
    var mousePos = getMousePos(event, seekBg);
    var dragTime = (mousePos.x/seekBg.offsetWidth)*this.video.duration;
    timeLabel.innerHTML = formatTime(dragTime);
    if (Math.round((1-(dragTime/this.video.duration))*(seekBg.offsetWidth))+3<timeLabel.offsetWidth/2) {
      timeLabel.style.left = (seekHolder.offsetWidth-timeLabel.offsetWidth) + "px";
    } else if (Math.round(((dragTime/this.video.duration))*(seekBg.offsetWidth)+3)<timeLabel.offsetWidth/2) {
      timeLabel.style.left="0px";
    } else {
      timeLabel.style.left = Math.round(((dragTime/this.video.duration))*(seekBg.offsetWidth)+3-timeLabel.offsetWidth/2) + "px";
    }
    seekFill.style.width = Math.round((dragTime/this.video.duration)*(seekBg.offsetWidth-2))+"px";
    seekDrag.style.left = Math.round((dragTime/this.video.duration)*(seekBg.offsetWidth-2))+"px";
    return false;
  }.bind(this);
  
  var updateTime = function(event) {
    currentTime.innerHTML = formatTime(this.video.currentTime);
    timeLabel.innerHTML = currentTime.innerHTML;
    if (Math.round((1-(this.video.currentTime/this.video.duration))*(seekBg.offsetWidth))+3<timeLabel.offsetWidth/2) {
      timeLabel.style.left = (seekHolder.offsetWidth-timeLabel.offsetWidth) + "px";
    } else if (Math.round(((this.video.currentTime/this.video.duration))*(seekBg.offsetWidth)+3)<timeLabel.offsetWidth/2) {
      timeLabel.style.left="0px";
    } else {
      timeLabel.style.left = Math.round(((this.video.currentTime/this.video.duration))*(seekBg.offsetWidth)+3-timeLabel.offsetWidth/2) + "px";
    }
    seekFill.style.width = Math.round((this.video.currentTime/this.video.duration)*(seekBg.offsetWidth-2))+"px";
    seekDrag.style.left = Math.round((this.video.currentTime/this.video.duration)*(seekBg.offsetWidth-2))+"px";
  }.bind(this);
  
  this.turnOffLoop = function() {
    this.loop = false;
    this.video.loop=false;
  };
  
  this.turnOnLoop = function() {
    this.loop = true;
    this.video.loop=true;
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
    this.video.currentTime=time;
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
    this.video.volume = volume;
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
  
  this.startFullscreen = function() {
    if (player.requestFullScreen) {
      player.requestFullScreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.webkitRequestFullScreen) {
      player.webkitRequestFullScreen();
    }
    this.fullscreen = true;
    fullscreenIcon.className = "icon-resize-small";
  };
  
  this.stopFullscreen = function() {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    this.fullscreen = false;
    fullscreenIcon.className = "icon-fullscreen";
  };
  
  var toggleFull = function(event) {
    event.preventDefault();
    if (!this.fullscreen) {
      this.startFullscreen();
    } else {
      this.stopFullscreen();
    }
    return false;
  }.bind(this);
  
  var progress = function(event) {
    var i=this.video.buffered.length-1;
    if (i<0) return false;
    seekLoaded.style.width = Math.round((this.video.buffered.end(i)/this.video.duration)*(seekBg.offsetWidth-2))+"px";
  }.bind(this);
  
  var init = function() {
    totalTime.innerHTML = formatTime(this.video.duration);
    
    if (this.autoPlay) {
      this.play();
    }
    playBtn.addEventListener("click", togglePlay, false);
    seekBg.addEventListener("mousedown", startSeek, false);
    seekFill.addEventListener("mousedown", startSeek, false);
    seekDrag.addEventListener("mousedown", startSeek, false);
    seekLoaded.addEventListener("mousedown", startSeek, false);
    muteBtn.addEventListener("mousedown", startDragVolume, false);
    muteBtn.addEventListener("click", changeVolumeSlider, false);
    fullscreenBtn.addEventListener("click", toggleFull, false);
    this.video.addEventListener("timeupdate", updateTime, false);
    this.video.addEventListener("ended", this.resetSong, false);
    this.video.addEventListener("volumechange", updateVolume, false);
  }.bind(this);
  
  this.video.addEventListener("progress", progress, false);
  this.video.addEventListener("canplay", init, false);
  if (this.loop) {
    this.turnOnLoop();
  } else {
    this.turnOffLoop();
  }
}

var a = new VideoPlayer(false, false);

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