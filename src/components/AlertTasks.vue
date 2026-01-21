<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  tasks: Array,
});

const today = new Date();
const todayStr = today.toISOString().split("T")[0]; // "2025-09-28"
const todaysTasks = computed(() => {
  return props.tasks.filter((task) => {
    if (task.done === false) {
      const taskDate = new Date(task.start).toISOString().split("T")[0];
      return todayStr >= taskDate;
    }
  });
});

const renderTime = (date) => {
  const timeStart = new Date(date.start).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeEnd = new Date(date.end).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return timeStart + "-" + timeEnd;
};

const renderTypeAlert = (date) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "2025-09-28"
  const dateStr = date.toISOString().split("T")[0];

  if (todayStr === dateStr) return "alert-warning";

  return "alert-danger";
};
</script>
<template lang="">
  <div v-if="todaysTasks.length">
    <div>Hai {{ todaysTasks.length }} da compiere oggi</div>
    <div v-for="task in todaysTasks" :key="task.id">
      <div class="alert" :class="renderTypeAlert(task.start)">
        <span
          v-if="
            new Date().toISOString().split('T')[0] >
            task.start.toISOString().split('T')[0]
          "
        >
          Il task {{ task.title }} del giorno
          {{ task.start.toLocaleDateString("it-IT") }} non è stato completato.
          Verifica se l'hai svolto e cambia il suo stato.
        </span>
        <span v-else>
          {{ task.title }} alle ore
          {{ renderTime(task) }}
        </span>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
