<script setup>
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";
import { VueCal } from "vue-cal";
import { router } from "../../router/index.js";
import "vue-cal/style";

import ModalAddTask from "./ModalAddTask.vue";
import ModalNoteTask from "./ModalNoteTask.vue";
import AlertTasks from "../../components/AlertTasks.vue";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const $toast = useToast();

const tasks = ref([]);
const isModalOpen = ref(false);
const selectedEvent = ref(null);
const showModalNote = ref(false);

const backgroundColors = {
  "Contatto medico": "backgroundBlue",
  "Appuntamento medico": "backgroundGreen",
  "Contatto Resp. Privacy": "backgroundYellow",
  "Contatto Fornitore": "backgroundBrown",
  "Contatto Commercialista": "backgroundGold",
  "Contatto Marco Rocco": "backgroundRed",
  "Contatto Chiara Farci": "backgroundPurple",
  Altro: "backgroundOrange",
};

onMounted(() => {
  getTasks();
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  showModalNote.value = false;
  selectedEvent.value = null;
};

const getTasks = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        tasks.value = resp.data.tasks.map((task) => {
          const s = new Date(task.start);
          const e = new Date(task.end);

          if (isNaN(s) || isNaN(e)) return null;

          return {
            id: task._id,
            title: task.title,
            start: s, // Date object
            end: e, // Date object
            content: task.note || "",
            done: !!task.done,
            allDay: false,
          };
        });
      });
  } catch (err) {
    console.log(err);
  }
};

const reloadTasks = () => {
  getTasks();
};

const onEventClick = ({ event, e }) => {
  selectedEvent.value = event;
  showModalNote.value = true;
};

const deleteEvent = (id) => {
  api
    .delete(`${configStore.apiBaseUrl}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      if (resp.data.result) {
        $toast.success(resp.data.message, {
          position: "top-right",
          duration: 3000,
        });
        getTasks();
      } else {
        $toast.error(resp.data.message, {
          position: "top-right",
          duration: 3000,
        });
      }
    });
};

const doneEvent = (id) => {
  api
    .patch(
      `${configStore.apiBaseUrl}/tasks/${id}/done-task`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((resp) => {
      if (resp.data.result) {
        $toast.success(resp.data.message, {
          position: "top-right",
          duration: 3000,
        });
        getTasks();
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
  <div class="m-3">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="fs-1">Task</h2>
            <button class="btn btn-main" @click="openModal()">
              Aggiungi Task
            </button>
          </div>
          <div class="col-12">
            <AlertTasks :tasks="tasks" />
          </div>
          <div class="col-12">
            <vue-cal
              view="week"
              :views="['week', 'month']"
              :editable-events="{
                drag: false,
                resize: false,
                delete: true,
                create: false,
              }"
              locale="it"
              :events="tasks"
              :time="true"
              :time-cell-height="100"
              :time-from="7 * 60"
              :time-to="21 * 60"
              @event-click="onEventClick"
            >
              <template #event="props">
                <div
                  class="custom-event"
                  :class="
                    props.event.done
                      ? 'backgroundBlack'
                      : backgroundColors[props.event.title]
                  "
                >
                  <span class="p-2">{{ props.event.title }}</span>
                  <!-- Bottone di cancellazione dentro all’evento -->
                  <button
                    class="w-100 btn-done"
                    :class="props.event.done ? 'disabled' : ''"
                    @click.stop="doneEvent(props.event.id)"
                    :disabled="props.event.done"
                  >
                    Svolto
                  </button>
                  <button
                    class="delete-btn"
                    @click.stop="deleteEvent(props.event.id)"
                  >
                    ✕
                  </button>
                </div>
              </template>
            </vue-cal>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalNoteTask
    v-if="showModalNote"
    :selectedEvent="selectedEvent"
    @close="closeModal"
    @reloadTasks="reloadTasks"
  />
  <ModalAddTask
    v-if="isModalOpen"
    @close="closeModal"
    @reloadTasks="reloadTasks"
  />
</template>
<style lang="scss">
@import "../../styles/generals.scss";
@import "../../styles/_partials/_variables";

.vuecal__views-bar {
  background-color: $mainColor;
}

.vuecal__header {
  .vuecal__title-bar {
    background-color: $hoverMain;
  }
}

.vuecal--default-theme {
  height: 800px;
}

.vuecal--default-theme .vuecal__event-details {
  font-size: 16px;
}

.vuecal--default-theme .vuecal__event-time {
  font-size: 16px;
}

.vuecal--default-theme .vuecal__event-details {
  padding: 0px;
}

.custom-event {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  border-radius: 50%;
  background-color: red;
  border: none;
  padding: 4px;
  color: #fff;
  font-size: 12px;
}

.btn-done {
  background-color: $mainColor;
  color: #fff;
  border: 0px;
  &.disabled {
    background-color: #737273;
    &:hover {
      background-color: #737273;
    }
  }
}

.btn-done:hover {
  background-color: #895bb4;
}

.backgroundBlue {
  background-color: blue;
}

.backgroundRed {
  background-color: red;
}

.backgroundYellow {
  background-color: #ffc400;
}

.backgroundGreen {
  background-color: green;
}

.backgroundPurple {
  background-color: purple;
}

.backgroundBrown {
  background-color: brown;
}

.backgroundGold {
  background-color: goldenrod;
}

.backgroundOrange {
  background-color: orange;
}

.backgroundBlack {
  background-color: black;
}
</style>
