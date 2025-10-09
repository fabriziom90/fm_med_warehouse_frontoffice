<script setup>
import { ref, onMounted, inject, computed } from "vue";
import api from "../services/api";
import { useConfigStore } from "../stores/configStore";
import { useToast } from "vue-toast-notification";
import { DataTable } from "datatables.net-vue3";

const columns = [
  {
    title: "Paziente",
    data: "patient",
    render: (data) => {
      if (!data) return "-";
      return `${data.name ?? ""} ${data.surname ?? ""}`.trim();
    },
  },
  {
    title: "Data",
    data: "date",
    render: (data) => {
      const dateObj = new Date(data);
      return dateObj.toLocaleDateString();
    },
  },
  { title: "Fattura", data: "invoiceNumber" },
  {
    title: "Totale",
    data: "total",
    render: (data) => {
      return data + "€";
    },
  },
  { title: "Service", data: "service" },
  {
    title: "Valore prestazione",
    data: "serviceValue",
    render: (data) => {
      return data + "€";
    },
  },
  { title: "% al medico", data: "percentageToDoctor" },
  {
    title: "Somma assegnata",
    data: "assignedAmount",
    render: (data) => {
      return data + "€";
    },
  },
  {
    title: "Strumenti",
    orderable: false,
    data: null,
    render: function (data, type, row) {
      return `
        <a href="#" data-show-id="${row._id}" class="btn btn-primary btn-sm me-1">
          <i class="fas fa-eye"></i>
        </a>
        <a href="#" data-edit-id="${row._id}" class="btn btn-warning btn-sm me-1">
          <i class="fas fa-edit"></i>
        </a>
        <button class="btn btn-danger btn-sm" data-id="${row._id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
    },
  },
];

const defaultOptions = inject("datatableOptions");
defaultOptions.paging = false;
defaultOptions.columns = columns;
defaultOptions.orderable = true;
defaultOptions.rowCallback = function (row, data) {
  const deleteBtn = row.querySelector("button.btn-danger");
  const editBtn = row.querySelector("a.btn-warning");
  const showBtn = row.querySelector("a.btn-primary");

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      selectedMedicalAppointment.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editMedicalAppointment", params: { id: data._id } });
    };
  }
  if (showBtn) {
    showBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "showMedicalAppointment", params: { id: data._id } });
    };
  }
};

const $toast = useToast();
const configStore = useConfigStore();
const token = localStorage.getItem("token");

const medicalAppointments = ref([]);
const selectedMedicalAppointment = ref(null);
const isModalOpen = ref(false);
const selectedMonth = ref("");
const total = ref(0);
const servicesTotal = ref(0);
const sumTotal = ref(0);
const withHoldingTax = ref(0);

const props = defineProps({
  doctorId: String,
});

onMounted(() => {
  getMedicalAppointments();
});

const getMedicalAppointments = () => {
  api
    .get(
      `${configStore.apiBaseUrl}/medical_appointments/doctor/${props.doctorId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((resp) => {
      medicalAppointments.value = resp.data.medicalAppointments;
    });
};

function closeModal() {
  isModalOpen.value = false;
}

const availableMonths = computed(() => {
  const monthsSet = new Map(); // Map per conservare valore + label
  const monthNames = [
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

  medicalAppointments.value.forEach((appointment) => {
    const date = new Date(appointment.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${String(month + 1).padStart(2, "0")}/${year}`;
    const label = `${monthNames[month]} ${year}`;
    monthsSet.set(key, label);
  });

  return Array.from(monthsSet, ([value, label]) => ({ value, label }));
});

const filteredAppointments = computed(() => {
  if (!selectedMonth.value) return medicalAppointments.value;
  const [month, year] = selectedMonth.value.split("/");
  return medicalAppointments.value.filter((a) => {
    const date = new Date(a.date);
    return (
      date.getMonth() + 1 === parseInt(month) &&
      date.getFullYear() === parseInt(year)
    );
  });
});

const totals = computed(() => {
  return filteredAppointments.value.reduce(
    (acc, curr) => {
      acc.total += curr.total || 0;
      acc.serviceValue += curr.serviceValue || 0;
      acc.assignedAmount += curr.assignedAmount || 0;
      return acc;
    },
    { total: 0, serviceValue: 0, assignedAmount: 0 }
  );
});

const netToPay = computed(() => {
  const total = totals.value.assignedAmount || 0;
  return total - withHoldingTax.value;
});
</script>
<template lang="">
  <div class="container">
    <div class="row">
      <div class="col-12" v-if="props.doctorId">
        <h2 class="m-0">Elenco prestazioni medico</h2>
        <div class="filter-month-position">
          <label class="form-label">Filtra per mese:</label>
          <select
            name="month"
            id="month"
            class="form-select"
            v-model="selectedMonth"
          >
            <option value="">Seleziona mese per il filtraggio</option>
            <option
              :value="m.value"
              :key="m.value"
              v-for="m in availableMonths"
            >
              {{ m.label }}
            </option>
          </select>
        </div>
        <div class="summary my-4" v-if="selectedMonth != ''">
          <table>
            <thead class="bg-main text-white">
              <tr>
                <th>Paziente</th>
                <th>Data</th>
                <th>Fattura</th>
                <th>Totale</th>
                <th>Prestazione</th>
                <th>Valore<br />Prestazione</th>
                <th>% assegnata <br />al medico</th>
                <th>Somma <br />assegnata</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="appointment in filteredAppointments"
                :key="appointment._id"
              >
                <td>
                  {{ appointment.patient.name }}
                  {{ appointment.patient.surname }}
                </td>
                <td>
                  {{ new Date(appointment.date).toLocaleDateString("it-IT") }}
                </td>
                <td>
                  {{ appointment.invoiceNumber }}
                </td>
                <td>{{ appointment.total }}€</td>
                <td>
                  {{ appointment.service }}
                </td>
                <td>{{ appointment.serviceValue }}€</td>
                <td>
                  {{ appointment.percentageToDoctor }}
                </td>
                <td>{{ appointment.assignedAmount }}€</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="3">Totale</th>
                <th>{{ totals.total }}€</th>
                <th>Totale servizio</th>
                <th>{{ totals.serviceValue }}€</th>
                <th>Totale somma</th>
                <th>{{ totals.assignedAmount }}€</th>
              </tr>
              <tr>
                <td colspan="7"></td>
                <td>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ritenuta d'acconto in €"
                    class="form-control"
                    v-model="withHoldingTax"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="7">Netto a pagare</th>
                <th>{{ netToPay }}€</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <hr />
        <DataTable
          class="display table table-striped mt-3"
          :options="defaultOptions"
          :data="filteredAppointments"
          v-if="filteredAppointments.length > 0"
        >
        </DataTable>
        <div v-else-if="filteredAppointments.length === 0" class="mt-4">
          <h2>Non sono stati ancora inseriti pazienti</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
th,
td {
  padding: 10px;
}

.summary {
  table {
    width: 100%;
  }
}

.filter-month-position {
  //   position: relative;
  //   top: 65px;
  //   margin-top: -40px;
  select {
    width: 400px;
  }
}
</style>
