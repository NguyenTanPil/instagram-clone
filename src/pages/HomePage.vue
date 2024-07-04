<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-7">
        <template v-if="!isLoadingPosts && posts.length > 0">
          <q-card
            v-for="post in posts"
            :key="post.id"
            class="card-post q-mb-md"
            flat
            bordered
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">John Doe</q-item-label>
                <q-item-label caption>{{ post.location }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img :src="post.imageUrl" />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ niceDate(post.date) }}
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!isLoadingPosts && posts.length === 0">
          <h5 class="text-center text-grey">No posts yet!</h5>
        </template>
        <template v-else>
          <div class="q-pa-md">
            <q-card flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" animation="fade" size="40px" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-skeleton height="200px" square animation="fade" />

              <q-card-section>
                <q-skeleton
                  type="text"
                  class="text-subtitle2"
                  animation="fade"
                />
                <q-skeleton
                  type="text"
                  width="50%"
                  class="text-subtitle2"
                  animation="fade"
                />
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
      <div class="col-5 large-screen-only">
        <div class="fixed">
          <q-item>
            <q-item-section avatar>
              <q-avatar size="48px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">john_doe</q-item-label>
              <q-item-label caption>John Doe</q-item-label>
            </q-item-section>
          </q-item>

          <div>
            <h6 class="text-grey q-my-xs q-mt-md text-subtitle2">
              Suggests For You
            </h6>
            <q-list>
              <q-item class="q-mb-sm" v-ripple>
                <q-item-section avatar>
                  <q-avatar size="md">
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Brunhilde</q-item-label>
                  <q-item-label caption lines="1">bpanswick4@.com</q-item-label>
                </q-item-section>

                <q-item-section class="text-primary q-ml-xl" side
                  >Follow</q-item-section
                >
              </q-item>
              <q-item class="q-mb-sm" v-ripple>
                <q-item-section avatar>
                  <q-avatar size="md">
                    <img src="https://cdn.quasar.dev/img/avatar6.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Winfield</q-item-label>
                  <q-item-label caption lines="1"
                    >wstapforth5@.com</q-item-label
                  >
                </q-item-section>

                <q-item-section class="text-primary q-ml-xl" side
                  >Follow</q-item-section
                >
              </q-item>

              <q-item class="q-mb-sm" v-ripple>
                <q-item-section avatar>
                  <q-avatar size="md">
                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>John</q-item-label>
                  <q-item-label caption lines="1">johnx22@.com</q-item-label>
                </q-item-section>

                <q-item-section class="text-primary q-ml-xl" side
                  >Follow</q-item-section
                >
              </q-item>

              <q-item class="q-mb-sm" v-ripple>
                <q-item-section avatar>
                  <q-avatar size="md">
                    <img
                      src="https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Peter</q-item-label>
                  <q-item-label caption lines="1">peterhax@.com</q-item-label>
                </q-item-section>

                <q-item-section class="text-primary q-ml-xl" side
                  >Follow</q-item-section
                >
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, watchEffect } from "vue";
import { date, useQuasar } from "quasar";
import { usePosts } from "src/stores/posts";
import { storeToRefs } from "pinia";

defineOptions({
  name: "HomePage",
});

const $q = useQuasar();
const postsStore = usePosts();
const { posts, isGetPostsError, isLoadingPosts } = storeToRefs(postsStore);
const { getPosts } = postsStore;

const niceDate = (value) => {
  return date.formatDate(value, "MMM D h:mmA");
};

watchEffect(isGetPostsError, () => {
  if (isGetPostsError) {
    $q.dialog({
      title: "Error",
      message: "Can not find you location.",
    });
  }
});

onBeforeMount(() => {
  getPosts();
});
</script>

<style lang="scss">
.card-post {
  .q-img {
    min-height: 200px;
  }
}
</style>
