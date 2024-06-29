<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          flat
          dense
          icon="eva-camera-outline"
          size="18px"
          to="/camera"
          class="large-screen-only q-mr-sm"
        />
        <q-separator vertical spaced class="large-screen-only" />
        <q-toolbar-title class="text-grand-hotel"> Instagram </q-toolbar-title>
        <q-separator vertical spaced class="large-screen-only" />
        <q-btn
          flat
          dense
          icon="eva-home-outline"
          size="18px"
          to="/home"
          class="large-screen-only"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white small-screen-only" bordered>
      <q-tabs
        align="center"
        class="text-grey-10"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "MainLayout",
});
</script>

<style lang="scss">
.q-toolbar {
  @media (min-width: 1023.99px) {
    height: 78px;
  }
}

.q-footer {
  .q-tab__icon {
    font-size: 30px;
  }
}

.q-toolbar__title {
  font-size: 30px;

  @media (max-width: 599.99px) {
    text-align: center;
  }
}
</style>
