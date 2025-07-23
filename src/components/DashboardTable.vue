<script setup>
const props = defineProps({
  items: Array,
  type: String,
  danger: String,
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
</script>
<template lang="">
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Quantità</th>
          <th>Scadenza</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td>
            {{ type === "Prodotti" ? item.product.name : item.drug.name }}
          </td>
          <td :class="danger === 'qnt' ? 'text-danger' : ''">
            {{ item.quantity }}
          </td>
          <td :class="danger === 'exp' ? 'text-danger' : ''">
            {{ formatDate(item.expirationDate) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang=""></style>
