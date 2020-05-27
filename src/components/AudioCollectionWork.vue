<template>
<div class = "audioWork">
 <b-form-radio-group
        v-model="selected"
        :options="options"
        value-field="item"
        text-field="name"
        disabled-field="notEnabled"
        ></b-form-radio-group>
        <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
        
        <b-form-file 
                v-model="audioContent"
                v-if="selected == 'upload'"
                :state="Boolean(audioContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept="audio/*"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ audioContent ? audioContent.name : '' }}</div>
        <!--<av-waveform v-if="audioUrl!=''" :audio-src = "audioUrl"></av-waveform>
        <av-waveform v-if="trimmedAudioUrl!=''" :audio-src = "trimmedAudioUrl"></av-waveform>-->
</div>
</template>
<script>
export default {
    name : 'AudioWork',
    data(){
        return {
            options: [
                {item : 'upload', name : '음성 업로드'},
                {item : 'record', name : '음성 녹음' }
            ],
            selected: 'upload',
            audioCount: 0,
        }
    },
    methods : {

    }
}
</script>