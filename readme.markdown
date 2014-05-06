# Brief Player
Brief Player is a simple JavaScript library allowing easy audio streaming using [SoundManager2](http://www.schillmania.com/projects/soundmanager2/).

## Requirements
Brief Player requires [SoundManager2](http://www.schillmania.com/projects/soundmanager2/) JavaScript library.

## Installation 
1. Copy the folder `briefplayer`.
2. Include SoundManager2 and Brief Player.

```
    <script src="soundmanager2-nodebug-jsmin.js"></script>
    <script src="briefplayer.min.js"></script>
```

3. Initialise SoundManager2 and Brief Player.

```
    <script type="text/javascript">
        soundManager.setup({
            url: 'URL to SoundManager2 flash files',
            flashVersion: 9,
            preferFlash: true,
            onready: function () {
                briefPlayer.createSound('URL to audio');
            },
            ontimeout: briefPlayer.events.ontimeout
        });
    </script>
```

4. To use the default theme include the following CSS file and HTML.

```
    <link href="briefplayer-default-theme.css" rel="stylesheet" media="all">
```

```
    <div id="bp_container" class="briefplayer cf">
        <div id="bp_interface">
            <div id="bp_controls">
                <a href="javascript:;" id="bp_play" title="Play"></a>
                <a href="javascript:;" id="bp_pause" title="Pause"></a>
            </div>
            <div id="bp_position" class="bp-time-holder">0:00:00</div>
            <div class="bp-progress-bar" id="bp_progress_bar">
                <div class="bp-bars">
                    <div id="bp_loaded_bar" class="bp-loaded-bar"></div>
                    <div id="bp_played_bar" class="bp-played-bar"></div>
                </div>
            </div>
            <div id="bp_duration" class="bp-time-holder">0:00:00</div>
        </div>
        <div id="bp_no_solution">
            <span>
                To play the episode you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
            </span>
        </div>
    </div>
```

## Demo
A live demo can be found on the [Brief Player site](http://briefplayer.com).

## Browser Support
Brief Player has been tested on:

- Safari 7
- Chrome 34
- FireFox 28
- Opera 20 (w/ Flash)
- Internet Explorer 10 & 11 (w/ Flash)

## License
Brief Player is distributed under the [MIT License](https://github.com/tomdiggle/briefplayer/blob/master/license).

## Changelog
Changelog can be viewed [here](https://github.com/tomdiggle/briefplayer/blob/master/Changelog.markdown).
