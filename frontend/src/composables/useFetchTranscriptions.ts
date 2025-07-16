import { ref } from 'vue';
import { useTranscriptionStore } from '../stores/transcriptions';
import { useUserStore } from '../stores/user';
import { getTranscriptions } from '../api/get-user-transcriptions';
import { toast } from 'vue-sonner';

type Segment = {
  start: number;
  end: number;
  text: string;
  _id: string;
};

type Transcription = {
  _id: string;
  userId: string;
  filename: string;
  transcript: string;
  segments: Segment[];
  language: string;
  createdAt: string;
};

interface FetchOptions {
  reset?: boolean;
}

export function useFetchTranscriptions() {
  const transcriptionStore = useTranscriptionStore();
  const userStore = useUserStore();

  const loading = ref(false);
  const error = ref('');
  const page = ref(1);
  const limit = ref(5);
  const hasMore = ref(true);

  /**
   * Busca transcrições do backend e atualiza o store.
   * @param options { reset?: boolean }
   */
  async function fetchTranscriptions(options: FetchOptions = {}) {
    if (!userStore.user || !userStore.token) return;

    const { reset = false } = options;

    loading.value = true;
    error.value = '';

    try {
      const result = await getTranscriptions({
        userId: userStore.user.uid,
        token: userStore.token,
        page: page.value,
        limit: limit.value,
        sortBy: 'createdAt',
        order: 'asc',
      });

      const items: Transcription[] = Array.isArray(result)
        ? (result as Transcription[])
        : ((result.items ?? []) as Transcription[]);

      if (reset) {
        transcriptionStore.setTranscriptions(items);
      } else {
        transcriptionStore.setTranscriptions([
          ...transcriptionStore.transcriptions,
          ...items,
        ]);
      }

      hasMore.value = items.length === limit.value;
      if (hasMore.value) page.value += 1;
    } catch (e) {
      toast.error('Erro ao buscar transcrições.');
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    page,
    limit,
    hasMore,
    fetchTranscriptions,
  };
}
