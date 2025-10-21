<template>
    <div>
        <img v-for="image in props.images" :src="image" @click="handleImageClick"/>
        <div :style="fullScreenImageStyle" v-show="fullScreenImageShow" @click="handleFullScreenImageClick">
            <img style="width: 90%; margin: auto;" :src="fullScreenImageSrc"/>
        </div>
    </div>
</template>

<script setup lang="jsx">
import {reactive, ref} from "vue";

const fullScreenImageSrc = ref('');
const fullScreenImageShow = ref(false);
const fullScreenImageStyle = reactive({
    'z-index': 9999,
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    margin: 'auto',
    'text-align': 'center',
    'line-height': '100vh',
    overflow: 'auto',
})

const props = defineProps({
    images: Array
})

console.log("images: ", props.images)

const handleImageClick = (e) => {
    console.log("click")
    console.log(e.target.src);
    fullScreenImageSrc.value = e.target.src;
    fullScreenImageShow.value = true;
    document.querySelector('body').classList.add('no-scroll');
}

const handleFullScreenImageClick = () => {
    fullScreenImageShow.value = false;
    fullScreenImageSrc.value = '';
    document.querySelector('body').classList.remove('no-scroll');
}
</script>

<style>
/**
 When a web page pop-up layer appears, disable background scrolling.
 */
.no-scroll {
  overflow: hidden;
}
</style>
