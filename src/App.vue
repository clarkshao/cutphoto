<template>
  <div id="app">
    <router-view :photoOptions="photoOptions" ></router-view>
    <input id="photo" type="file" accept="image/*" style="display: none;" @change="initImage"/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return {
      photoToCut: null
    }
  },
  methods: {
    initImage(){
      if(document.getElementById('photo').value){
        this.photoToCut = window.URL.createObjectURL(document.getElementById('photo').files[0])
        this.$router.push({ path: '/cut' })
      }
    },
    send(dataURL){
      window.open(dataURL)
    }
  },
  computed:{
    photoOptions (){
      return {
        photoToCut: this.photoToCut,
        ratio: 1.2,
        handler: this.send
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body{
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 0;
  }
</style>
