<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed } from 'vue';

interface Segment {
  _id: string;
  text: string;
}

interface Suggestion {
  _id: string;
  text: string;
  before: string;
  match: string;
  after: string;
}

const props = defineProps<{
  search: string;
  segments: Segment[];
  show: boolean;
  maxSuggestions?: number;
  contextRadius?: number;
}>();
const emit = defineEmits<{
  (e: 'select', value: string): void;
}>();

const MAX_SUGGESTIONS = props.maxSuggestions ?? 5;
const CONTEXT_RADIUS = props.contextRadius ?? 20;

function extractSuggestion(seg: Segment, keyword: string): Suggestion | null {
  const textLower = seg.text.toLowerCase();
  const idx = textLower.indexOf(keyword);
  if (idx === -1) return null;

  const start = Math.max(0, idx - CONTEXT_RADIUS);
  const end = Math.min(seg.text.length, idx + keyword.length + CONTEXT_RADIUS);
  const snippet = seg.text.substring(start, end);

  const snippetLower = snippet.toLowerCase();
  const matchIdx = snippetLower.indexOf(keyword);
  return {
    _id: seg._id,
    text: seg.text,
    before: snippet.slice(0, matchIdx),
    match: snippet.slice(matchIdx, matchIdx + keyword.length),
    after: snippet.slice(matchIdx + keyword.length),
  };
}

const suggestions = computed<Suggestion[]>(() => {
  if (!props.search) return [];
  const keyword = props.search.toLowerCase();
  return props.segments
    .map((seg) => extractSuggestion(seg, keyword))
    .filter((s): s is Suggestion => !!s)
    .slice(0, MAX_SUGGESTIONS);
});

function handleSelect(suggestion: string) {
  emit('select', suggestion);
}
</script>

<template>
  <nav
    v-if="show && suggestions.length"
    class="absolute left-0 top-full z-50 min-w-full bg-white rounded shadow mt-1"
    aria-label="Sugestões de segmentos"
  >
    <ul v-if="suggestions.length" class="divide-y" role="listbox">
      <li
        v-for="s in suggestions"
        :key="s._id"
        class="py-2 px-4 cursor-pointer hover:bg-orange-100 flex items-center gap-2"
        role="option"
        :aria-selected="false"
        tabindex="0"
        @mousedown.prevent="handleSelect(s.text)"
      >
        <Search class="text-zinc-500" :size="22" aria-hidden="true" />
        <span>
          {{ s.before }}<strong>{{ s.match }}</strong
          >{{ s.after }}
        </span>
      </li>
    </ul>
  </nav>
</template>
