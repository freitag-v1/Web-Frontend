# web-frontend
방구석 수집가의 web frontend 코드입니다.       
방구석 수집가를 web 환경에서 작업을 의뢰하거나 작업을 진행할 때 필요한 소스코드입니다.        

## 프로젝트 setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
### 실행 후 에러 수정
실행 시 음성 파일을 재생을 위한 오픈소스 라이브러리인 WaveSurfer.js에서 발생하는 에러를 수정해야합니다.         
npm install 이후 생성된 node_modules/wavesurfer.js/src/plugin/timeline.js를 프로젝트 최상단에 있는 timeline.js로 변경하면 됩니다.                 

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
