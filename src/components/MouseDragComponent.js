import { mapGetters, mapActions, mapMutations } from 'vuex';
import * as THREE from 'three';
import coordinates from '../mixins/coordinates'; 
import rayCasting from '../mixins/rayCasting';
import objects from '../mixins/objects';

export default {
  // To access use prefix: this.$options
  dragGroup: null,
  plane: new THREE.Plane(),
  zVector: new THREE.Vector3(0, 0, 1),
  intersectionPoint: new THREE.Vector3(),
  offset: new THREE.Vector3(),

  data () {
    return {
      isMouseDown: false,
      isMouseOverObject: false,
      isDragging: false,
      orbitControlStatus: false,
      transformControlStatus: false,
      objectID: '',
    }
  },

  mixins: [ coordinates, rayCasting, objects ],

  computed: {
    ...mapGetters('select', {
      getSelected: 'getSelected',
    }),
    ...mapGetters('controls', {
      isOrbitControlActive: 'isOrbitControlActive',
      isTransformControlActive: 'isTransformControlActive',
    }),
    ...mapGetters('scene', {
      scene: 'getScene',
      camera: 'getCamera',
      controlsNode: 'getControlsNode',
      threeElement: 'getRendererElementParent',
    }),    
  },

  mounted: function () {
    this.$options.dragGroup = new THREE.Group();
    this.$options.dragGroup.name = 'dragGroup';
    this.controlsNode.add(this.$options.dragGroup);

    this.threeElement.addEventListener('mousedown', this.mouseDown, false);
    this.threeElement.addEventListener('mousemove', this.mouseMove, false);
    this.threeElement.addEventListener('mouseup', this.mouseUp, false);
  },

  beforeDestroy: function() {
    this.controlsNode.remove(this.$options.dragGroup);
    this.$options.dragGroup = null;

    if (this.threeElement()) {
      this.threeElement.removeEventListener('mousedown', this.mouseDown, false);
      this.threeElement.removeEventListener('mousemove', this.mouseMove, false);
      this.threeElement.removeEventListener('mouseup', this.mouseUp, false);
    }
  },

  methods: {
    mouseDown(event) {

      this.isMouseDown = true;
      let initialMouseLocation = this.computeXYScreenCoords( event.clientX, event.clientY, window );

      let clickedObject = this.getObjectUnderCoord( initialMouseLocation );

      if ( clickedObject ) {
        this.objectID = this.getObjectID( clickedObject );

        this.$options.intersectionPoint.copy(clickedObject.point);

        this.$options.plane.setFromNormalAndCoplanarPoint(
          this.$options.zVector,
          this.$options.intersectionPoint);

      } else {
        this.objectID = '';
      }

    },

    mouseMove(event) {
      if ( !this.isMouseDown || this.objectID === '' ) {
        return;
      }

      let screenCoord = this.computeXYScreenCoords( event.clientX, event.clientY, window );

      if ( !this.isDragging ) {
        // initialize the drag
        if ( !this.isObjectSelected( this.objectID ) ) {

          this.clearSelection();

          this.addToSelection({
            object: this.scene.getObjectById(this.objectID),
          });

        }

        this.$options.offset.subVectors(
          this.$options.dragGroup.position,
          this.$options.intersectionPoint);

        this.attachObjectsToParent( this.getSelected, this.$options.dragGroup );

        this.orbitControlStatus = this.isOrbitControlActive;
        this.setOrbitControlActiveStatus({ status: false });

        this.transformControlStatus = this.isTransformControlActive;
        this.setTransformControlActiveStatus({ status: false });

        this.isDragging = true;
      }

      let intersectionPlane = this.intersectPlane(
        screenCoord,
        this.$options.plane);

      this.$options.dragGroup.position.addVectors(
        intersectionPlane,
        this.$options.offset);

    },
    mouseUp(event) {
      if ( this.isDragging ) {
        this.attachObjectsToParent( this.getSelected, this.scene );
        this.updateObjects( this.getSelected );

        this.setOrbitControlActiveStatus({ status: this.orbitControlStatus });
        this.setTransformControlActiveStatus({ status: this.transformControlStatus });

        this.isDragging = false;
      }

      this.isMouseDown = false;
      this.$options.clickedObject = null;
    },

    ...mapMutations('select', {
      clearSelection: 'clearSelection',
      addToSelection: 'addToSelection',
    }),

    ...mapMutations('controls', {
      setOrbitControlActiveStatus: 'setOrbitControlActiveStatus',
      setTransformControlActiveStatus: 'setTransformControlActiveStatus',
    }),
  },

  render() {
    return;
  },

}