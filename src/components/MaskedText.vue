<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    text: String
})
  
const isVisible = ref(false);

const masked = computed(() => {
  if (!props.text) return '••••••';
  return '•'.repeat(Math.max(props.text.length, 6));
});


const toggle = () => {
    isVisible.value = !isVisible.value;
}
  

</script>
<template>
  <span class="masked-text">
    <span class="text">
      {{ isVisible ? text : masked }}
    </span>
    <button
      class="eye"
      type="button"
      @click="toggle"
      aria-label="Mostra / nascondi"
    >
        <i class="fas fa-eye-slash" v-if="isVisible"></i>
        <i class="fas fa-eye" v-if="!isVisible"></i>
    </button>
  </span>
</template>
<style scoped>
.masked-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.eye {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>
