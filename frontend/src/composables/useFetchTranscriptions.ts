import { ref } from 'vue';
import { useTranscriptionStore } from '../stores/transcriptions';
import { useUserStore } from '../stores/user';
import { getTranscriptions } from '../api/get-user-transcriptions';
import { toast } from 'vue-sonner';
import { usePagination } from './usePagination';
import { debounce } from '@/lib/shared/debounce';
import { useSearchCache } from './useSearchCache';

export type Segment = {
  start: number;
  end: number;
  text: string;
  _id: string;
};

export type Transcription = {
  _id: string;
  userId: string;
  filename: string;
  transcript: string;
  segments: Segment[];
  language: string;
  createdAt: string;
};

export interface FetchOptions {
  reset?: boolean;
  search?: string;
}

export function useFetchTranscriptions() {
  const transcriptionStore = useTranscriptionStore();
  const userStore = useUserStore();
  const loading = ref(false);
  const error = ref('');
  const cache = useSearchCache();

  const { page, limit, hasMore, reset, next } = usePagination();

  const debouncedFetch = debounce(async (options: FetchOptions) => {
    const { reset: shouldReset = false, search = '' } = options;

    if (shouldReset) reset();
    loading.value = true;
    error.value = '';

    const cached = search ? cache.get(search) : undefined;
    if (cached) {
      transcriptionStore.setTranscriptions(cached);
      hasMore.value = cached.length === limit.value;
      loading.value = false;
      return;
    }

    try {
      const result = await getTranscriptions({
        userId: userStore.user?.uid ?? '',
        token: userStore.token ?? '',
        page: page.value,
        limit: limit.value,
        sortBy: 'createdAt',
        order: 'asc',
        search,
      });

      const items: Transcription[] = Array.isArray(result)
        ? result
        : (result.items ?? []);

      if (search) cache.set(search, items);
      if (shouldReset) {
        transcriptionStore.setTranscriptions(items);
      } else {
        transcriptionStore.setTranscriptions([
          ...transcriptionStore.transcriptions,
          ...items,
        ]);
      }

      next(items.length);
    } catch (e) {
      toast.error('Erro ao buscar transcrições.');
    } finally {
      loading.value = false;
    }
  });

  async function fetchTranscriptions(
    options: FetchOptions = {},
  ): Promise<void> {
    if (!userStore.user || !userStore.token) return;
    debouncedFetch(options);
  }

  return {
    loading,
    error,
    page,
    limit,
    hasMore,
    fetchTranscriptions,
    clearCache: cache.clear,
  };
}
