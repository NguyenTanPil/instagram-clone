<template>
  <q-page class="small-constrain q-pa-md">
    <div class="camera-frame q-pa-md">
      <img
        class="full-width"
        src="https://cdn.quasar.dev/img/parallax2.jpg"
        alt=""
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn round color="grey-10" size="lg" icon="eva-camera" />
    </div>

    <div class="row justify-center q-ma-md">
      <q-input
        v-model="post.caption"
        dense
        label="Caption"
        class="col col-sm-6"
      />
    </div>
    <div class="row justify-center q-ma-md">
      <q-input
        v-model="post.location"
        dense
        label="Location"
        class="col col-sm-6"
      >
        <q-btn dense flat round icon="eva-navigation-2-outline" />
      </q-input>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-btn color="primary" label="Post Image" rounded />
    </div>
  </q-page>
</template>

<script setup>
import { uid } from "quasar";
import { reactive } from "vue";

defineOptions({
  name: "CameraPage",
});

const post = reactive({
  id: uid(),
  caption: "",
  location: "",
  photo: null,
  date: Date.now(),
});
</script>

<style lang="scss">
.camera-frame {
  border: 2px solid $grey-10;
  border-radius: 10px;
}
</style>
