import { onMounted } from "vue";
import { useTranscriptionStore } from "../stores/transcriptions";
import { useUserStore } from "../stores/user";
import { getTranscriptions } from "../api/get-user-transcriptions";


type Transcription = {
	_id: string;
	userId: string;
	filename: string;
	transcript: string;
	segments: Segment[];
	language: string;
	createdAt: string;
};


type Segment = {
	start: number;
	end: number;
	text: string;
	_id: string;
};


export function useFetchTranscriptions() {
  const transcriptionStore = useTranscriptionStore();
  const userStore = useUserStore();

  onMounted(async () => {
     if (!userStore.user || !userStore.token) return; 

    const result = await getTranscriptions({
      userId: userStore.user.uid,
      token: userStore.token,
      page: 1,
      limit: 1000,
      sortBy: "createdAt",
      order: "asc",
    });
    transcriptionStore.setTranscriptions(
      Array.isArray(result)
        ? result as Transcription[]
        : (result.items ?? []) as Transcription[]
    );
  });
}