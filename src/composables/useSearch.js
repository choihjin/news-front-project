import { ref } from 'vue';

const headerSearchText = ref('');

export function useSearch() {
  const updateSearchText = (text) => {
    headerSearchText.value = text;
  };

  return {
    headerSearchText,
    updateSearchText,
  };
} 