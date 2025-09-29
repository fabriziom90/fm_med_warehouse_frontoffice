<script setup>
import api from "../../services/api";
import { ref } from "vue";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";

const token = localStorage.getItem("token");
const $toast = useToast();
const configStore = useConfigStore();

const emit = defineEmits(["close, reloadTasks"]);

const props = defineProps({
  selectedEvent: Object,
});

const isEdit = ref(false);
const form = ref({
  id: "",
  title: "",
  date: "",
  timeFrom: "",
  timeTo: "",
  note: "",
  done: "",
});

const onEdit = () => {
  if (!isEdit.value) {
    isEdit.value = !isEdit.value;
    form.value.id = props.selectedEvent.id;
    form.value.title = props.selectedEvent.title;
    form.value.note = props.selectedEvent.content;
    // build date from props
    const start = props.selectedEvent.start;
    const end = props.selectedEvent.end;

    // format YYYY-MM-DD
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    form.value.date = `${year}-${month}-${day}`;

    // format HH:MM
    const hoursFrom = String(start.getHours()).padStart(2, "0");
    const minutesFrom = String(start.getMinutes()).padStart(2, "0");
    form.value.timeFrom = `${hoursFrom}:${minutesFrom}`;

    const hoursTo = String(end.getHours()).padStart(2, "0");
    const minutesTo = String(end.getMinutes()).padStart(2, "0");
    form.value.timeTo = `${hoursTo}:${minutesTo}`;

    form.value.done = props.selectedEvent.done;
  } else {
    isEdit.value = !isEdit.value;

    const data = {
      title: form.value.title,
      start: new Date(`${form.value.date}T${form.value.timeFrom}:00.000`),
      end: new Date(`${form.value.date}T${form.value.timeTo}:00.000`),
      note: form.value.note,
      done: form.value.done,
    };

    api
      .put(`${configStore.apiBaseUrl}/tasks/${form.value.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
          emit("close");
          emit("reloadTasks");
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  }
};
</script>
<template lang="">
  <div class="dialog-overlay">
    <div class="dialog">
      <div class="d-flex justify-content-between align-items-center">
        <h3>{{ selectedEvent.title }}</h3>
        <button class="btn btn-warning" @click="onEdit">
          <i class="fas fa-edit"></i>
        </button>
      </div>
      <div v-if="!isEdit">
        <p>
          <strong>Inizio:</strong>
          {{ selectedEvent.start.toLocaleString() }}
        </p>
        <p>
          <strong>Fine:</strong>
          {{ selectedEvent.end.toLocaleString() }}
        </p>
        <p>
          <strong>Note:</strong>
          {{ selectedEvent.note || "Nessuna nota" }}
        </p>
        <p>
          <strong>Svolto: </strong>
          <span :class="selectedEvent.done ? 'text-success' : 'text-danger'"
            >{{ selectedEvent.done ? "Sì" : "No" }}
          </span>
        </p>
      </div>
      <div v-else>
        <div class="m-2">
          <label class="form-label">Data</label>
          <input
            type="date"
            class="form-control"
            placeholder="Data del task"
            v-model="form.date"
            name="date"
            id="date"
          />
        </div>
        <div class="d-flex m-2">
          <div class="w-50 me-1">
            <label class="form-label">Inizio</label>
            <input
              type="time"
              class="form-control"
              placeholder="Inizio task"
              v-model="form.timeFrom"
              name="timeStart"
              id="timeStart"
            />
          </div>
          <div class="w-50">
            <label class="form-label">Fine</label>
            <input
              type="time"
              class="form-control"
              placeholder="Fine task"
              v-model="form.timeTo"
              name="timeEnd"
              id="timeEnd"
            />
          </div>
        </div>
        <div class="m-2">
          <label class="form-label">Note</label>
          <textarea
            class="form-control"
            v-model="form.note"
            name="content"
            id="content"
            placeholder="Note"
          ></textarea>
        </div>
        <div class="m-2">
          <label class="form-label">Svolto</label>
          <select class="form-select" v-model="form.done">
            <option value="false">No</option>
            <option value="true">Sì</option>
          </select>
        </div>
      </div>
      <button @click="$emit('close')" class="btn-main">Chiudi</button>
    </div>
  </div>
</template>
<style lang="scss">
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .dialog {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}
</style>
