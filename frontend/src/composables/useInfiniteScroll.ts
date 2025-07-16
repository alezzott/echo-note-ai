import { onMounted, onBeforeUnmount } from 'vue';

export function useInfiniteScroll(
  callback: () => void,
  options?: { offset?: number; enabled?: () => boolean },
) {
  const offset = options?.offset ?? 200;

  function handleScroll() {
    const isNearBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - offset;
    const isEnabled = options?.enabled ? options.enabled() : true;

    if (isNearBottom && isEnabled) {
      callback();
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
}
