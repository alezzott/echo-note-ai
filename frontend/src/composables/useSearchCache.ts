import { ref } from 'vue';
import type { Transcription } from './useFetchTranscriptions';

export function useSearchCache() {
  const cache = ref(new Map<string, Transcription[]>());

  function get(term: string): Transcription[] | undefined {
    return cache.value.get(term);
  }

  function set(term: string, items: Transcription[]): void {
    cache.value.set(term, items);
  }

  function clear() {
    cache.value.clear();
  }

  return {
    get,
    set,
    clear,
  };
}
