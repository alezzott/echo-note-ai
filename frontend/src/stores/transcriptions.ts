import { defineStore } from "pinia";

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

export const useTranscriptionStore = defineStore("transcription", {
  state: () => ({
    transcriptions: [] as Transcription[],
  }),
  actions: {
    setTranscriptions(data: Transcription[]) {
      this.transcriptions = data;
    },
    clearTranscriptions() {
      this.transcriptions = [];
    },
  },
});