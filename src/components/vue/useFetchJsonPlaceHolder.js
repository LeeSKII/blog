import { ref } from "vue";
import axios from "axios";

export default function () {
  const data = ref(null);
  const error = ref(null);

  axios
    .get("https://jsonplaceholder.typicode.com/posts/2/comments")
    .then((response) => {
      data.value = response.data;
    })
    .catch((error) => {
      error.value = error.message;
    });
  return { data, error };
}
