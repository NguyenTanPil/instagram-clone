<template>
  <q-page class="small-constrain q-pa-md">
    <div class="camera-frame q-pa-md">
      <video v-show="!imageCaptured" class="full-width" autoplay ref="video" />

      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        round
        color="grey-10"
        size="lg"
        icon="eva-camera"
        v-if="hasCameraSupport"
        @click="captureImage"
      />

      <q-file
        outlined
        v-model="imageUploaded"
        :disable="postCreating"
        label="Choose an image"
        accept="image/*"
        @input="captureImageFallback"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
    </div>

    <div class="row justify-center q-ma-md">
      <q-input
        dense
        :disable="postCreating"
        v-model="post.caption"
        label="Caption"
        class="col col-sm-6"
      />
    </div>
    <div class="row justify-center q-ma-md">
      <q-input
        dense
        :disable="postCreating"
        v-model="post.location"
        :loading="locationLoading"
        label="Location"
        class="col col-sm-6"
      >
        <q-btn
          dense
          flat
          round
          icon="eva-navigation-2-outline"
          v-if="!locationLoading && locationSupported"
          @click="getLocation"
        />
      </q-input>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-btn
        color="primary"
        label="Post Image"
        rounded
        :loading="postCreating"
        :disabled="!post.caption || !post.photo"
        @click="addPost"
      />
    </div>
  </q-page>
  <template> </template>
</template>

<script setup>
import { uid } from "quasar";
import { ref } from "vue";
import { onMounted } from "vue";
import { reactive } from "vue";
import "md-gum-polyfill";
import { onUnmounted } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { computed } from "vue";
import {
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";
import { storage } from "app/firebase";
import { doc, setDoc } from "firebase/firestore";
import db from "../../firebase";

defineOptions({
  name: "CameraPage",
});

const $q = useQuasar();
const router = useRouter();

const video = ref(null);
const canvas = ref(null);
const imageUploaded = ref([]);
const imageCaptured = ref(false);
const hasCameraSupport = ref(true);
const locationLoading = ref(false);
const postCreating = ref(false);

const post = reactive({
  id: uid(),
  caption: "",
  location: "",
  photo: null,
  date: Date.now(),
});

const locationSupported = computed(() => {
  if ("geolocation" in navigator) {
    return true;
  }

  return false;
});

const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  let byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  let ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  let ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  let blob = new Blob([ab], { type: mimeString });
  return blob;
};

const initialCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      video.value.srcObject = stream;
    })
    .catch(() => {
      hasCameraSupport.value = false;
    });
};

const disabledCamera = () => {
  video.value.srcObject.getVideoTracks().forEach((track) => {
    track.stop();
  });
};

const captureImage = () => {
  canvas.value.height = video.value.getBoundingClientRect().height;
  canvas.value.width = video.value.getBoundingClientRect().width;
  const context = canvas.value.getContext("2d");
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  imageCaptured.value = true;
  post.photo = dataURItoBlob(canvas.value.toDataURL());
  disabledCamera();
};

const captureImageFallback = (file) => {
  post.photo = file.target.files[0];
  const context = canvas.value.getContext("2d");

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      canvas.value.width = img.width;
      canvas.value.height = img.height;
      context.drawImage(img, 0, 0);
      imageCaptured.value = true;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file.target.files[0]);
};

const locationSuccess = (result) => {
  post.location = result.data.city;

  if (result.data.countryName) {
    post.location += `, ${result.data.countryName}`;
  }
  locationLoading.value = false;
};

const locationFailure = () => {
  $q.dialog({
    title: "Error",
    message: "Can not find you location. Please try again",
  }).onOk(() => {
    locationLoading.value = false;
  });
};

const getCityAndCountry = (position) => {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`;

  axios
    .get(url)
    .then((response) => {
      locationSuccess(response);
    })
    .catch(() => {
      locationFailure();
    });
};

const getLocation = () => {
  locationLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      getCityAndCountry(position);
    },
    (error) => {
      $q.dialog({
        title: "Error",
        message: `${error.message}. Please turn on location`,
      });
    },
    { timeout: 7000 }
  );
};

const showNotifyCreatedSuccess = () => {
  $q.notify({
    message: "Post Created",
    color: "primary",
    actions: [
      {
        label: "Dismiss",
        color: "white",
      },
    ],
  });
};

const createNewPostAfterUpdateImage = async (data) => {
  await setDoc(doc(db, "posts", data.id), data);
  showNotifyCreatedSuccess();
  router.push("/");
  postCreating.value = false;
};

const addPost = () => {
  const data = {
    id: post.id,
    caption: post.caption,
    location: post.location,
    date: post.date,
  };

  postCreating.value = true;
  const storageRef = storeRef(storage, `images/posts/${post.photo.name}`);
  const uploadTask = uploadBytesResumable(storageRef, post.photo);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    () => {
      postCreating.value = false;
      $q.dialog({
        title: "Error",
        message: "Can not create a new post",
      });
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        data.imageUrl = downloadURL;
        createNewPostAfterUpdateImage(data);
      });
    }
  );
};

onMounted(() => {
  initialCamera();
});

onUnmounted(() => {
  if (hasCameraSupport.value) {
    disabledCamera();
  }
});
</script>

<style lang="scss">
.camera-frame {
  border: 2px solid $grey-10;
  border-radius: 10px;
  max-height: 320px;

  canvas {
    max-height: 284px;
    object-fit: cover;
  }
}
</style>
