import { collection, getDocs, orderBy } from "firebase/firestore";
import { defineStore } from "pinia";
import { ref } from "vue";
import db from "../../firebase";

export const usePosts = defineStore("post", () => {
  const posts = ref([]);
  const isGetPostsError = ref(false);
  const isLoadingPosts = ref(false);

  const getPosts = async () => {
    isLoadingPosts.value = true;
    try {
      const querySnapshot = await getDocs(
        collection(db, "posts"),
        orderBy("date", "desc")
      );

      const postList = [];
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        postList.push(post);
      });

      posts.value = postList;
      isLoadingPosts.value = false;
    } catch {
      isGetPostsError.value = true;
      isLoadingPosts.value = false;
    }
  };

  return { posts, isGetPostsError, getPosts, isLoadingPosts };
});
