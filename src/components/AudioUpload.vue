<template>
  <div>
  <span>
        {{ currentTime }}/{{ getDuration }}
    </span>
  <div class ="waveform">
    <div id="wave" style="width: 500px;"></div>
        <br>
        <div id= "wave-timeline"></div>
        <br>
        <span>
            <p>Volume    <input type="range" min="1" max="100" v-model="volume" @input="setVolume"></p>
         </span>
    </div>
    <br>
    <br>
    <button v-on:click="play">Play</button>
<button v-on:click="wavesurfer.pause()">Pause</button>
<button v-on:click="wavesurfer.stop()">Stop</button>
<br>
  </div>
    
</template>

<script>
  import WaveSurfer from "wavesurfer.js";
  import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js'

    function formatTimeCallback(seconds, pxPerSec) {
        seconds = Number(seconds);
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        // fill up seconds with zeroes
        var secondsStr = Math.round(seconds).toString();
        if (pxPerSec >= 25 * 10) {
            secondsStr = seconds.toFixed(2);
        } else if (pxPerSec >= 25 * 1) {
            secondsStr = seconds.toFixed(1);
        }

        if (minutes > 0) {
            if (seconds < 10) {
                secondsStr = '0' + secondsStr;
            }
            return `${minutes}:${secondsStr}`;
        }
        return secondsStr;
}

/**
 * Use timeInterval to set the period between notches, in seconds,
 * adding notches as the number of pixels per second increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param: pxPerSec
 */
function timeInterval(pxPerSec) {
    var retval = 1;
    if (pxPerSec >= 25 * 100) {
        retval = 0.01;
    } else if (pxPerSec >= 25 * 40) {
        retval = 0.025;
    } else if (pxPerSec >= 25 * 10) {
        retval = 0.1;
    } else if (pxPerSec >= 25 * 4) {
        retval = 0.25;
    } else if (pxPerSec >= 25) {
        retval = 1;
    } else if (pxPerSec * 5 >= 25) {
        retval = 5;
    } else if (pxPerSec * 15 >= 25) {
        retval = 15;
    } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
}

/**
 * Return the cadence of notches that get labels in the primary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function primaryLabelInterval(pxPerSec) {
    var retval = 1;
    if (pxPerSec >= 25 * 100) {
        retval = 10;
    } else if (pxPerSec >= 25 * 40) {
        retval = 4;
    } else if (pxPerSec >= 25 * 10) {
        retval = 10;
    } else if (pxPerSec >= 25 * 4) {
        retval = 4;
    } else if (pxPerSec >= 25) {
        retval = 1;
    } else if (pxPerSec * 5 >= 25) {
        retval = 5;
    } else if (pxPerSec * 15 >= 25) {
        retval = 15;
    } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
}

/**
 * Return the cadence of notches to get labels in the secondary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Secondary labels are drawn after primary labels, so if
 * you want to have labels every 10 seconds and another color labels
 * every 60 seconds, the 60 second labels should be the secondaries.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function secondaryLabelInterval(pxPerSec) {
    // draw one every 10s as an example
    return Math.floor(10 / timeInterval(pxPerSec));
}
  export default {
    name: "wavesurfer",
    props : {
        value : String,
    },
    data (){
        return {
            currentTime: 0.00,
            volume: 100,
            wavesurfer: null,
        }
    },
    mounted(){
        this.createWave(this.value);
      
    },
    watch: {
        value : function(value){
            this.wavesurfer.destroy();
            this.createWave(value);
        }
    },
    methods : {
        createWave (value) {
            //var TimelinePlugin = window.WaveSurfer.timeline;

            this.wavesurfer = WaveSurfer.create({
                container: "#wave",
                waveColor: 'tomato',
                progressColor: '',
                normalize : true,
                barwidth: 2,
                plugins: [
                   TimelinePlugin.create({
                        container: "#wave-timeline",
                        // primaryColor: 'blue',
                        // secondaryColor: '#fff',
                        // primaryFontColor: 'blue',
                        // secondaryFontColor: '#fff'
                        formatTimeCallback: formatTimeCallback,
                        timeInterval: timeInterval,
                        primaryLabelInterval: primaryLabelInterval,
                        secondaryLabelInterval: secondaryLabelInterval,
                        cursorWidth: 2,
                        removeMediaElementOnDestroy: true,
                    })
                ],
            });
            this.wavesurfer.load(value);
            this.wavesurfer.on("ready", function() {
                //this.wavesurfer.play();
            });
                
            
            },
            timeDisplay(time){
                // Hours, minutes and seconds
                let hrs = Math.floor(time / 3600);
                let mins = Math.floor((time % 3600) / 60);
                let secs = Math.floor(time % 60);
                // Output like "1:01" or "4:03:59" or "123:03:59"
                let output = '';
                if (hrs > 0) {
                    output += '' + hrs + ':' + (mins < 10 ? '0' : '');
                }
                output += '' + mins + ':' + (secs < 10 ? '0' : '');
                output += '' + secs;
                return output;
            },
            setVolume(){
                let floatValue = this.volume/100
                this.wavesurfer.setVolume(Number.parseFloat(floatValue.toFixed(2)))
            },
            play() {
                this.timeInterval = setInterval(() => {
                    this.currentTime = this.timeDisplay(this.wavesurfer.getCurrentTime())
                }, 1000);
                this.wavesurfer.play();
            },

        },
        computed : {
            getDuration: function() {
                if(this.wavesurfer){
                    
                    return this.timeDisplay(this.wavesurfer.getDuration());
                }
                else{
                    return null
                }
            },
    },
            

  };
</script>
<style>
.waveform{
    display: table; 
    margin-left: auto; 
    margin-right: auto;
}
</style>