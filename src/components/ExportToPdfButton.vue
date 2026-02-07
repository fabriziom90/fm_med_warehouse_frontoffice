<script setup>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const props = defineProps({
  title: {
    type: String,
    default: "Export"
  },
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  filename: {
    type: String,
    default: "export.pdf"
  }
});

const exportPdf = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(props.title, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [props.columns],
    body: props.rows
  });

  doc.save(props.filename);
};
</script>

<template>
  <button class="btn-main" @click="exportPdf">
    Esporta PDF
  </button>
</template>
<style lang="scss" scoped>
    @use '../styles/generals.scss' as *;

    .btn-main{
        padding: 10px 20px !important;
    }
</style>
