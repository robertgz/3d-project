<template>
  <div ref="threeElement" id="threeElementID" >

    <!-- <StatsComponent       
      v-bind:panel="0"
    ></StatsComponent> -->

    <SceneComponent />
    <HelpersComponent />
    <MouseClickComponent />
    <MouseDragComponent />
    <OrbitControlsComponent/>
    <TransformControlsComponent/>
  </div>
</template>

<script>
import * as THREE from 'three';
import { mapGetters, mapMutations, mapActions } from 'vuex';

import StatsComponent from './StatsComponent.vue';

import SceneComponent from './SceneComponent.vue';
import HelpersComponent from './HelpersComponent.js';
import MouseClickComponent from './MouseClickComponent.js';
import MouseDragComponent from './MouseDragComponent.js';
import OrbitControlsComponent from './OrbitControlsComponent.js';
import TransformControlsComponent from './TransformControlsComponent.js';


export default {

  components: {
    StatsComponent,
    SceneComponent,
    HelpersComponent,
    MouseClickComponent,
    MouseDragComponent,
    OrbitControlsComponent,
    TransformControlsComponent,
  },

  methods: {  },

}
</script>

<style scoped>
#threeElementID {
  z-index: 2;
}
</style>
