import { ref } from "vue";

export function useLoading() {
  const loading = ref(false);

  function start() {
    loading.value = true;
  }

  function stop() {
    loading.value = false;
  }

  return {
    loading,
    start,
    stop,
  };
}