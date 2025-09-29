<script setup>
import api from "../../services/api.js";
import { useConfigStore } from "../../stores/configStore.js";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";

const emit = defineEmits(["close, reloadTasks"]);

const props = defineProps({
  showModal: Boolean,
});

const token = localStorage.getItem("token");
const $toast = useToast();
const configStore = useConfigStore();

const associativeTasks = [
  { id: 1, name: "Contatto medico" },
  { id: 2, name: "Appuntamento medico" },
  { id: 3, name: "Contatto Resp. Privacy" },
  { id: 4, name: "Contatto Fornitore" },
  { id: 5, name: "Contatto Commercialista" },
  { id: 6, name: "Contatto Marco Rocco" },
  { id: 7, name: "Contatto Chiara Farci" },
  { id: 8, name: "Altro" },
];

const form = ref({
  title: "",
  date: "",
  timeFrom: "",
  timeTo: "",
  note: "",
});

const addTask = () => {
  const { title, date, timeFrom, timeTo, note } = form.value;
  const selectedTask = associativeTasks.find((item) => {
    return item.id == title;
  });

  const data = {
    title: selectedTask ? selectedTask.name : title,
    start: new Date(`${date}T${timeFrom}:00.000`),
    end: new Date(`${date}T${timeTo}:00.000`),
    note,
    done: false,
  };

  api
    .post(`${configStore.apiBaseUrl}/tasks`, data, {
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
};
</script>
<template lang="">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <form @submit.prevent="addTask()">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">Aggiungi task</div>
                <div class="col-12">
                  <label class="form-label">Titolo task</label>
                  <select
                    class="form-select"
                    name="title"
                    v-model="form.title"
                    required
                  >
                    <option value="">-Seleziona titolo del task-</option>
                    <option value="1">Contatto medico</option>
                    <option value="2">Appuntamento medico</option>
                    <option value="3">Contatto Resp. Privacy</option>
                    <option value="4">Contatto Fornitore</option>
                    <option value="5">Contatto Commercialista</option>
                    <option value="6">Contatto Marco Rocco</option>
                    <option value="7">Contatto Chiara Farci</option>
                    <option value="8">Altro</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Data</label>
                  <input
                    type="date"
                    class="form-control"
                    placeholder="Data task"
                    name="date"
                    id="date"
                    v-model="form.date"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">Orario Da</label>
                  <input
                    type="time"
                    class="form-control"
                    placeholder="Orario task"
                    name="time-from"
                    id="time-from"
                    v-model="form.timeFrom"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">Orario a</label>
                  <input
                    type="time"
                    class="form-control"
                    placeholder="Orario task"
                    name="timeTo"
                    id="timeTo"
                    v-model="form.timeTo"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Note</label>
                  <textarea
                    class="form-control"
                    placeholder="Note"
                    name="note"
                    id="note"
                    v-model="form.note"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-main btn-shape me-2" type="submit">
                Salva task
              </button>

              <button
                class="btn btn-transparent btn-shape"
                @click="$emit('close')"
              >
                Chiudi modale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss";
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
