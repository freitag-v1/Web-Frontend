<template>
  <div><div id="wave" style="width: 500px; margin: auto;"></div>
        <div id = "currentTime">{{  currentTime }}</div>
        <div id = "remainingTime">{{ remainingTime }}</div>
        <div id = "totalTime">{{ totalTime }}</div>
        <div id= "wave-timeline" style="margin: auto;"></div>
    <button v-on:click="wavesurfer.play()">Play</button>
<button v-on:click="wavesurfer.pause()">Pause</button>
<button v-on:click="wavesurfer.stop()">Stop</button>
<br>
  </div>
    
</template>

<script>
  import WaveSurfer from "wavesurfer.js";
  import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline.js'

    var formatTime = function (time) {
        return [
            Math.floor((time % 3600) / 60), // minutes
            ('00' + Math.floor(time % 60)).slice(-2) // seconds
        ].join(':');
    };
  export default {
    name: "Player",
    props : {
        value : String,
    },
    data (){
        return {
            currentTime: 0.00,
            totalTime: 0.00,
            remainingTime: 0.00,
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
                waveColor: 'violet',
                progressColor: 'purple',
                normalize : true,
                barwidth: 2,
                plugins: [
                   TimelinePlugin.create({
                        container: "#wave-timeline",
                        primaryColor: 'blue',
                        secondaryColor: '#fff',
                        primaryFontColor: 'blue',
                        secondaryFontColor: '#fff'
                    })
                ],
            });
            this.wavesurfer.load(value);
            this.wavesurfer.on("ready", function() {
                //this.wavesurfer.play();
            });
            this.wavesurfer.on('audioprocess', function () {
                if(wavesurfer.isPlaying()){
                    this.totalTime = wavesurfer.getDuration();
                    this.currentTime = wavesurfer.getCurrentTime();
                    this.remainingTime = this.totalTime - this.currentTime;
                }
            })
                
            
        }
    },

  };
</script>