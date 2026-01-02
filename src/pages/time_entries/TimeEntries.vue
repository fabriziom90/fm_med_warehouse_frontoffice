<script setup>
import api from "../../services/api";
import { ref, onMounted, computed, watch } from "vue";
import { useToast } from "vue-toast-notification";
import { useConfigStore } from "../../stores/configStore";
import Modal from "./Modal.vue";

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const $toast = useToast();
const timeEntries = ref([]);
const showModal = ref(false);
const selectedTimeEntry = ref(null);
const filterMonth = ref(new Date().getMonth() + 1); // formato YYYY-MM
const filterYear = ref(new Date().getFullYear());
const currentPage = ref(1);
const perPage = 10;

const months = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const years = [];
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= currentYear - 5; y--) {
  // ultimi 5 anni
  years.push(y);
}

const form = ref({
  date: "",
  start: "",
  end: "",
  notes: "",
});

onMounted(() => {
  getTimeEntries();
});

const getTotalHours = computed(() => {
  let totalMinutes = 0;

  filteredEntries.value.forEach((entry) => {
    totalMinutes += entry.durationMinutes;
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
});

const filteredEntries = computed(() => {
  return timeEntries.value.filter((entry) => {
    const d = new Date(entry.date);
    return (
      d.getMonth() + 1 === Number(filterMonth.value) &&
      d.getFullYear() === Number(filterYear.value)
    );
  });
});

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredEntries.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredEntries.value.length / perPage)
);

const getTimeEntries = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/time_entries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        timeEntries.value = resp.data.entries;
      });
  } catch (error) {
    $toast.error("Errore nel recuper delle voci di orari svolti");
  }
};

const saveTimeEntry = async () => {
  try {
    await api
      .post(`${configStore.apiBaseUrl}/time_entries`, form.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        $toast.success(resp.data.message, {
          position: "top-right",
          duration: 1500,
        });
      });

    form.value = {
      date: "",
      start: "",
      end: "",
      notes: "",
    };

    getTimeEntries();
  } catch (error) {
    $toast.error("Errore nel salvataggio dell'orario svolto");
  }
};

const handleSubmit = () => {
  saveTimeEntry();
};

const openModal = (id) => {
  showModal.value = true;
  selectedTimeEntry.value = id;
};

const onHandleConfirmDelete = async () => {
  try {
    await api
      .delete(
        `${configStore.apiBaseUrl}/time_entries/delete/${selectedTimeEntry.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        $toast.success(resp.data.message, {
          position: "top-right",
          duration: 1500,
        });
        showModal.value = false;
        getTimeEntries();
      });
  } catch (error) {
    $toast.error("Errore nella cancellazione dell'orario svolto");
  }
};
</script>
<template>
  <div>
    <div class="m-3">
      <h2>Orari svolti</h2>

      <form @submit.prevent="handleSubmit" class="bg-main p-4 my-4">
        <div class="row gy-3">
          <div class="col-12 col-md-4">
            <input type="date" class="form-control" v-model="form.date" />
          </div>
          <div class="col-12 col-md-4">
            <input type="time" class="form-control" v-model="form.start" />
          </div>
          <div class="col-12 col-md-4">
            <input
              type="time"
              class="form-control"
              placeholder="Inserisci data di scadenza"
              v-model="form.end"
            />
          </div>
          <div class="col-12">
            <textarea
              class="form-control"
              placeholder="Inserisci note"
              v-model="form.notes"
            ></textarea>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-white">Salva</button>
          </div>
        </div>
      </form>
      <div class="row mb-3">
        <div class="col-md-3">
          <label class="form-label">Mese</label>
          <select
            class="form-control"
            v-model="filterMonth"
            @change="getTimeEntries"
          >
            <option
              v-for="(m, index) in months"
              :key="index"
              :value="index + 1"
            >
              {{ m }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Anno</label>
          <select
            class="form-control"
            v-model="filterYear"
            @change="getTimeEntries"
          >
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div v-if="paginatedEntries.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Inizio</th>
              <th>Fine</th>
              <th>Durata</th>
              <th>Note</th>
              <th>Strumenti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in paginatedEntries" :key="entry._id">
              <td>{{ new Date(entry.date).toLocaleDateString() }}</td>
              <td>
                {{
                  new Date(entry.start).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </td>

              <td>
                {{
                  new Date(entry.end).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </td>
              <td>{{ entry.durationMinutes }}</td>
              <td>{{ entry.note }}</td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="openModal(entry._id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot id="footerTable">
            <tr>
              <th colspan="3">Totale ore:</th>
              <th colspan="3">{{ getTotalHours }}</th>
            </tr>
          </tfoot>
        </table>
        <nav v-if="totalPages > 1" class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--">‹</button>
            </li>

            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="currentPage = page">
                {{ page }}
              </button>
            </li>

            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button class="page-link" @click="currentPage++">›</button>
            </li>
          </ul>
        </nav>
      </div>

      <div v-else>
        <h2>Nessun orario ancora inserito</h2>
      </div>
    </div>
    <Modal
      v-if="showModal"
      @close="showModal = false"
      @handleConfirmDelete="onHandleConfirmDelete"
    />
  </div>
</template>
<style lang="scss">
@use "../../styles/generals.scss";
@use "../../styles/_partials/variables" as *;
.table > tfoot#footerTable > tr > th {
  background-color: $mainColor !important;
  color: white !important;
}
</style>
