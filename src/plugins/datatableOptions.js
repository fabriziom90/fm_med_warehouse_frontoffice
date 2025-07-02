const datatableDefaults = {
  language: {
    decimal: "",
    emptyTable: "Nessun dato disponibile nella tabella",
    info: "Visualizzazione da _START_ a _END_ di _TOTAL_ elementi",
    infoEmpty: "Visualizzazione di 0 su 0 elementi",
    infoFiltered: "(filtrati da _MAX_ elementi totali)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "Mostra _MENU_ elementi",
    loadingRecords: "Caricamento...",
    processing: "Elaborazione...",
    search: "Cerca:",
    zeroRecords: "Nessun elemento corrispondente trovato",
    paginate: {
      first: "Primo",
      last: "Ultimo",
      next: "Successivo",
      previous: "Precedente",
    },
    aria: {
      sortAscending: ": attiva per ordinare la colonna in ordine crescente",
      sortDescending: ": attiva per ordinare la colonna in ordine decrescente",
    },
  },
  lengthChange: false,
};

export default {
  install(app) {
    app.provide("datatableOptions", datatableDefaults);
  }
};