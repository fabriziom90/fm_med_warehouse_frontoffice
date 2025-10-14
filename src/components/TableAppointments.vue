<script setup>
import { ref, onMounted, inject, computed } from "vue";
import api from "../services/api";
import { useConfigStore } from "../stores/configStore";
import { useToast } from "vue-toast-notification";
import { DataTable } from "datatables.net-vue3";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { router } from "../router";
import Modal from "../pages/medical_appointments/Modal.vue";

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
  doctor: Object,
});

onMounted(() => {
  getMedicalAppointments();
});

const getMedicalAppointments = () => {
  api
    .get(
      `${configStore.apiBaseUrl}/medical_appointments/doctor/${props.doctor._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((resp) => {
      medicalAppointments.value = resp.data.medicalAppointments;
    });
};

const generateTotals = () => {
  return filteredAppointments.value.reduce(
    (acc, curr) => {
      acc.total += curr.total || 0;
      acc.serviceValue += curr.serviceValue || 0;
      acc.assignedAmount += curr.assignedAmount || 0;
      return acc;
    },
    { total: 0, serviceValue: 0, assignedAmount: 0 }
  );
};

const generatePdf = () => {
  if (!filteredAppointments.value || filteredAppointments.value.length === 0) {
    $toast.error("Nessun dato da esportare per il mese selezionato.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });
  const title = `Riepilogo prestazioni Dott./Dott.ssa ${props.doctor.name} ${
    props.doctor.surname
  } - ${selectedMonth.value || ""}`;
  doc.setFontSize(18);
  doc.text(title, 40, 40);

  // intestazione colonne - usare dataKey per oggetti in body
  const columnsForPdf = [
    { header: "Paziente", dataKey: "patient" },
    { header: "Data", dataKey: "date" },
    { header: "Fattura", dataKey: "invoiceNumber" },
    { header: "Totale", dataKey: "total" },
    { header: "Prestazione", dataKey: "service" },
    { header: "Valore prestazione", dataKey: "serviceValue" },
    { header: "% al medico", dataKey: "percentageToDoctor" },
    { header: "Somma assegnata", dataKey: "assignedAmount" },
  ];

  // costruisco il body: array di oggetti
  const body = filteredAppointments.value.map((appointment) => {
    const formatMoney = (v) =>
      (Number(v) || 0).toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €";

    return {
      patient: `${appointment.patient?.name ?? ""} ${
        appointment.patient?.surname ?? ""
      }`.trim(),
      date: appointment.date
        ? new Date(appointment.date).toLocaleDateString("it-IT")
        : "",
      invoiceNumber: appointment.invoiceNumber ?? "",
      total: Number(appointment.total) ? formatMoney(appointment.total) : "",
      service: appointment.service ?? "",
      serviceValue: Number(appointment.serviceValue)
        ? formatMoney(appointment.serviceValue)
        : "",
      percentageToDoctor:
        appointment.percentageToDoctor !== undefined &&
        appointment.percentageToDoctor !== null
          ? `${Number(appointment.percentageToDoctor).toFixed(2)} %`
          : "",
      assignedAmount: Number(appointment.assignedAmount)
        ? formatMoney(appointment.assignedAmount)
        : "",
    };
  });

  // riga TOTALI (fa parte della tabella)
  const formatMoney = (v) =>
    (Number(v) || 0).toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  body.push({
    patient: "TOTALI",
    date: "",
    invoiceNumber: "",
    total: formatMoney(totals.value.total),
    service: "",
    serviceValue: formatMoney(totals.value.serviceValue),
    percentageToDoctor: "",
    assignedAmount: formatMoney(totals.value.assignedAmount),
    _summary: true,
  });

  // riga Ritenuta d'acconto
  body.push({
    patient: `Ritenuta d'acconto (${Number(withHoldingTax.value || 0).toFixed(
      2
    )})`,
    date: "",
    invoiceNumber: "",
    total: "",
    service: "",
    serviceValue: "",
    percentageToDoctor: "",
    assignedAmount: formatMoney(withHoldingTax.value),
    _summary: true,
  });

  // riga NETTO A PAGARE
  body.push({
    patient: "Netto a pagare",
    date: "",
    invoiceNumber: "",
    total: "",
    service: "",
    serviceValue: "",
    percentageToDoctor: "",
    assignedAmount: formatMoney(netToPay.value),
    _summary: true,
  });

  // genera la tabella PDF con stile personalizzato per le righe summary
  autoTable(doc, {
    head: [columnsForPdf.map((c) => c.header)],
    // use columns/dataKeys through columns option so cells map correctly
    columns: columnsForPdf,
    body: body,
    startY: 60,
    styles: {
      fontSize: 12,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [30, 120, 190],
      textColor: 255,
      fontStyle: "bold",
    },
    didParseCell: function (data) {
      // data.row.raw è l'oggetto originale della riga
      if (data.row && data.row.raw && data.row.raw._summary) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [245, 245, 245]; // grigio chiaro
      }
      // se la cella è della colonna "Paziente" e contiene TOTALI, centriamo il testo
      if (
        data.row &&
        data.row.raw &&
        data.row.raw._summary &&
        data.column.dataKey === "patient"
      ) {
        data.cell.styles.halign = "left";
      }
    },
    // imposta margini per sicurezza
    margin: { left: 40, right: 40, top: 40, bottom: 40 },
    // se la tabella è lunga, jspdf-autotable la spezzetta automaticamente
  });

  const filename = `riepilogo_${props.doctor.name}_${props.doctor.surname}_${(
    selectedMonth.value || "mese"
  ).replace("/", "-")}.pdf`;
  doc.save(filename);
};

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
  return generateTotals();
});

const netToPay = computed(() => {
  const total = totals.value.assignedAmount || 0;
  return total - withHoldingTax.value;
});

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/medical_appointments/delete/${selectedMedicalAppointment.value._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(async (resp) => {
      const { result, message } = resp.data;
      if (result) {
        $toast.success(message, {
          position: "top-right",
          duration: 3000,
        });
        closeModal();
        await getMedicalAppointments();
      } else {
        $toast.error(message, {
          position: "top-right",
          duration: 3000,
        });
      }
    });
};

function closeModal() {
  isModalOpen.value = false;
}
</script>
<template lang="">
  <div class="container">
    <div class="row">
      <div class="col-12" v-if="props.doctor">
        <h2 class="m-0">Elenco prestazioni medico</h2>
        <div class="header-filtered-table">
          <div>
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
          <div>
            <button
              class="btn-main"
              v-if="selectedMonth !== ''"
              @click="generatePdf"
            >
              Genera PDF
            </button>
          </div>
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
                    placeholder="Ritenuta d'acconto in
  €"
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
  <Modal
    v-if="isModalOpen"
    @close="closeModal"
    @handleConfirmDelete="confirmDelete"
  />
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

.header-filtered-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  select {
    width: 400px;
  }
}
</style>
