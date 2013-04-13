var H5P = H5P || {};

/**
 * Constructor.
 * 
 * @param {object} params Options for this library.
 * @param {string} contentPath The path to our content folder.
 * @returns {undefined}
 */
H5P.Audio = function (params, contentPath) {
  for (var i = 0; i < params.files.length; i++) {
    var file = params.files[i];
    file.path = contentPath + file.path;
  }
  
  this.params = params;
};

/**
 * Wipe out the content of the wrapper and put our HTML in it.
 * 
 * @param {jQuery} $wrapper Our poor container.
 * @returns {undefined}
 */
H5P.Audio.prototype.attach = function ($wrapper) {
  // Check if browser supports video.
  var audio = document.createElement('audio');
  if (audio.canPlayType === undefined) {
    // Try flash
    this.attachFlash($wrapper);
    return;
  }
  
  // Add supported source files.
  for (var i = 0; i < this.params.files.length; i++) {
    var file = this.params.files[i];
    
    if (audio.canPlayType(file.mime)) {
      var source = document.createElement('source');
      source.src = file.path;
      source.type = file.mime;
      audio.appendChild(source);
    }
  }
  
  if (!audio.children) {
    $wrapper.text('No supported audio files found.');
    return;
  }
  
  audio.controls = this.params.controls === undefined ? true : this.params.controls;
  audio.autoplay = this.params.autoplay === undefined ? false : this.params.autoplay;
  
  if (this.params.fitToWrapper === undefined || this.params.fitToWrapper) {
    audio.style.width = '100%';
    audio.style.height = '100%';
  }
  
  $wrapper.html(audio);
};

/**
 * Attaches a flash video player to the wrapper.
 * 
 * @param {jQuery} $wrapper Our dear container.
 * @returns {undefined}
 */
H5P.Audio.prototype.attachFlash = function ($wrapper) {
  for (var i = 0; i < this.params.files.length; i++) {
    var file = this.params.files[i];
    if (file.mime === 'audio/mpeg' || file.mime === 'audio/mp3') {
      var audioSource = file.path;
      break;
    }
  }
  
  if (audioSource === undefined) {
    $wrapper.text('No supported audio files found.');
  }
  
  var options = {
    buffering: true,
    clip: {
      url: window.location.protocol + '//' + window.location.host + audioSource,
      autoPlay: this.params.autoplay === undefined ? false : this.params.autoplay,
      autoBuffering: true,
      scaling: 'fit'
    },
    plugins: {}
  };
  
  if (this.params.controls === undefined || this.params.controls) {
    options.plugins.controls = {
      url: 'http://releases.flowplayer.org/swf/flowplayer.controls-tube-3.2.15.swf',
      autoHide: false
    };
  }
  
  this.flowplayer = flowplayer($wrapper[0], {
    src: "http://releases.flowplayer.org/swf/flowplayer-3.2.16.swf",
    wmode: "opaque"
  }, options);
};