import { ref } from 'vue';

export function usePagination(initialPage = 1, initialLimit = 5) {
  const page = ref(initialPage);
  const limit = ref(initialLimit);
  const hasMore = ref(true);

  function reset() {
    page.value = initialPage;
    hasMore.value = true;
  }

  function next(itemsLength: number) {
    hasMore.value = itemsLength === limit.value;
    if (hasMore.value) page.value += 1;
  }

  return {
    page,
    limit,
    hasMore,
    reset,
    next,
  };
}
