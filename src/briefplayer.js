(function(window, _undefined) {

"use strict";

var briefPlayer = null;

function BriefPlayer() {

    var self = this;
    var trackCount = 0;
    var domContentLoaded, didContentLoad = false;
    var noSolution = false;

    this.currentTrack = null;

    this.config = {
        autoPlay: false,
        autoLoad: false
    };

    // Holds the css selector strings
    this.css = {
        container: 'bp_container',
        interface: 'bp_interface',
        controls: 'bp_controls',
        noSolution: 'bp_no_solution',
        play: 'bp_play',
        pause: 'bp_pause',
        position: 'bp_position',
        duration: 'bp_duration',
        progressBar: 'bp_progress_bar',
        loadedBar: 'bp_loaded_bar',
        playedBar: 'bp_played_bar'
    };

    // Holds the css selectors
    this.cssSelector = {};

    this.events = {
        ontimeout: function () {
            self.noSolution = true;
            self.updateInterface();
        },

        onload: function (success) {
            if (success === false) {
                self.noSolution = true;
                self.updateInterface();
                self.destruct();
            }
        },

        play: function () {
            self.updateButtons(true);
        },

        stop: function () {
            self.updateButtons(false);
        },

        pause: function () {
            self.updateButtons(false);
        },

        resume: function () {
            self.updateButtons(true);   
        },

        finish: function () {
            setTimeout(function () {
                // Updating the UI is delayed so the playedBar can reach the end and then get reset back to 0
                self.updateButtons(false);
                self.updateInterface();
            }, 1000);
        },

        whileloading: function () {
            self.updateInterface();
        },

        whileplaying: function () {
            self.updateInterface();
        }
    };

    this.createSound = function (trackURL) {
        if (trackURL === null) {
            return;
        }

        if (this.currentTrack) {
            this.destruct();
        }

        this.currentTrack = soundManager.createSound({
                id: 'BriefPlayer-' + trackCount++,
                url: trackURL,
                autoPlay: this.config.autoPlay,
                onload: this.events.onload,
                onplay: this.events.play,
                onstop: this.events.stop,
                onpause: this.events.pause,
                onresume: this.events.resume,
                onfinish: this.events.finish,
                whileloading: this.events.whileloading,
                whileplaying: this.events.whileplaying
        });

        if (this.config.autoLoad) {
            // There appears to be a bug when setting autoLoad in soundManager.createSound(), the load() method is getting called twice, so we're calling load here.
            this.currentTrack.load();
        }
    };

    this.play = function () {
        this.currentTrack.play();
    };

    this.pause = function () {
        this.currentTrack.pause();
    };

    this.resume = function () {
        this.currentTrack.resume();
    };

    this.destruct = function () {
        this.currentTrack.destruct();
        this.currentTrack = null;
    };

    /**
    * Update Interface
    */

    this.updateInterface = function () {
        if (this.noSolution) {
            this.cssSelector.interface.style.display = 'none';
            this.cssSelector.noSolution.style.display = 'block';
            return;
        }

        this.setProgresssBarWidth();

        if (this.cssSelector.position) {
            this.cssSelector.position.innerHTML = this.convertMiliseconds(this.position());
        }

        if (this.cssSelector.duration && this.duration() > 0) {
            this.cssSelector.duration.innerHTML = this.convertMiliseconds(this.duration());
        }

        if (this.cssSelector.loadedBar) {
            this.cssSelector.loadedBar.style.width = this.loaded() + '%';
        }

        if (this.cssSelector.playedBar) {
            var played = this.position() / this.duration() * 100 | 0;
            if (isNaN(played)) {
                played = 0;
            }
            this.cssSelector.playedBar.style.width = played + '%';
        }
    };

    this.updateButtons = function (playing) {
        if (playing === undefined) {
            playing = this.currentTrack.paused;
        }
        
        if (this.cssSelector.play && this.cssSelector.pause) {
            if (playing) {
                this.cssSelector.play.style.display = 'none';
                this.cssSelector.pause.style.display = 'block';
            } else {
                this.cssSelector.play.style.display = 'block';
                this.cssSelector.pause.style.display = 'none';
            }
        }
    };

    /**
    * The progress bar's width is the space that is remaining after subtracting the container's width minus the control's, position's and duration's width multiplied by two.
    * The progress bar's width gets changed once when Brief Player is loaded and also when the window is resized.
    */
    this.setProgresssBarWidth = function () {
        if (this.cssSelector.progressBar === null) {
            return;
        }
        var width = getElementWidth(self.cssSelector.container) - (getElementWidth(this.cssSelector.controls) + getElementWidth(this.cssSelector.position) + getElementWidth(this.cssSelector.duration) * 2);
        this.cssSelector.progressBar.style.width = width + 'px'; 
    };

    /**
    * Events & DOM
    */

    /**
    * Seeks to a position based on where the click takes place in the progress bar.
    *
    * @param {object} event The DOM event interface from when the progress bar is clicked.
    */
    this.seek = function (event) {
        if (this.currentTrack === null) {
            return;
        }

        var seekToPosition = event.layerX / this.cssSelector.progressBar.clientWidth * this.duration() | 0;
        if (this.currentTrack.playState === 0) {
            this.play();
        }
        
        this.currentTrack.setPosition(seekToPosition);
    };

    /**
    * Helpers
    */

    /**
    * Returns the total bytes loaded by dividing the current tracks bytesLoaded and bytesTotal then multiplying by 100.
    *
    * @return {number} The current tracks total bytes loaded.
    */
    this.loaded = function () {
        if (this.currentTrack) {
            if (this.currentTrack.readyState === 1) {
                var loaded = this.currentTrack.bytesLoaded / this.currentTrack.bytesTotal * 100 | 0;
                if (isNaN(loaded)) {
                    loaded = 0;
                }
                return loaded;
            } else if (this.currentTrack.readyState === 3) {
                return 100;
            } else {
                return 0;
            }
        }

        return 0;
    };

    /**
    * Returns the current location of the "play head" within the sound, specified in milliseconds.
    *
    * @return {number} The current location of the "play head" within the sound, specified in milliseconds.
    */
    this.position = function () {
        if (this.currentTrack) {
            return this.currentTrack.position;
        }

        return 0;
    };

    /** 
    * Returns the content length of the current track, specified in milliseconds.
    *
    * @return {number} The content length of the current track, specified in milliseconds.
    */
    this.duration = function () {
        if (this.currentTrack) {
            if (this.currentTrack.readyState === 1) {
                return this.currentTrack.durationEstimate;
            } else if (this.currentTrack.readyState === 3) {
                return this.currentTrack.duration;
            } else {
                return 0;
            }
        }

        return 0;
    };

    /**
    * Converts milliseconds to a formatted time string.
    *
    * @param {number} ms Number of milliseconds to convert to hours, minutes and seconds
    * @return {string} A formatted time string in hours, minutes and seconds. eg 3:33:33
    */
    this.convertMiliseconds = function (ms) {
        var totalSeconds = ms / 1000;
        var seconds = totalSeconds % 60 | 0;
        var minutes = totalSeconds / 60 % 60 | 0;
        var hours = totalSeconds / 3600 % 24 | 0;
    
        return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    };

    /**
    * Returns the supplied elements client width.
    *
    * @param {domelement} element The DOM element that you need to find the width of
    * @return {number} The supplied DOM element's width
    */
    function getElementWidth (element) {
        if (element === null || element.clientWidth === null) {
            return 0;
        }

        return element.clientWidth;
    };

    /**
    * Populates the cssSelector object with DOM elements from supplied css selectors.
    *
    * @param {object} css The css selectors that will be populated into the cssSelector object
    */
    this._cssSelector = function (css) {
        Object.keys(css).forEach(function (key) {
            self.cssSelector[key] = document.getElementById(css[key]);
        });

        if (this.cssSelector.play) {
            this.cssSelector.play.addEventListener('click', function (event) {
                self.play();
            }, false);
        }

        if (this.cssSelector.pause) {
            this.cssSelector.pause.addEventListener('click', function (event) {
                self.pause();
            }, false);
        }

        if (this.cssSelector.progressBar) {
            this.cssSelector.progressBar.addEventListener('click', function (event) {
                self.seek(event);
            }, false);
        }
    };

    /**
    * Sets up UI once DOM content has been loaded.
    */
    domContentLoaded = function () {
        if (didContentLoad) {
            return false;
        }

        didContentLoad = true;

        self._cssSelector(self.css);
        self.updateInterface();
        self.updateButtons(false);

        window.addEventListener('resize', function (event) {
            self.setProgresssBarWidth();
        }, false);
        document.removeEventListener('DOMContentLoaded', domContentLoaded, false);
    };

    document.addEventListener('DOMContentLoaded', domContentLoaded, false);
}

if (window.briefPlayer === undefined) {
    briefPlayer = new BriefPlayer();
}

window.briefPlayer = briefPlayer;

}(window));
