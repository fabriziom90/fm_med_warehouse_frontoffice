<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const openDropdown = ref(null);

const logout = () => {
  localStorage.removeItem("token");

  router.push("/");
};

// Stato per controllare l'apertura dei dropdown
const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name;
};
</script>
<template lang="">
  <div id="sidebar">
    <router-link to="/admin" class="text-decoration-none">
      <div class="top-sidebar">
        <img src="/logo.png" alt="" />
        <h2 class="fs-5 mt-3 text-white">MediStock</h2>
      </div>
    </router-link>
    <div class="middle-sidebar">
      <ul class="list-unstyled">
        <li
          :class="
            route.path.includes('rooms') ||
            route.path.includes('products') ||
            route.path.includes('drugs')
              ? 'active'
              : ''
          "
        >
          <a
            href="#"
            class="d-flex justify-content-between align-items-center"
            @click.prevent="toggleDropdown('warehouse')"
          >
            <span><i class="fa-solid fa-boxes-stacked me-2"></i>Magazzino</span>
            <i
              class="fa-solid"
              :class="
                openDropdown === 'warehouse'
                  ? 'fa-chevron-up'
                  : 'fa-chevron-down'
              "
            ></i>
          </a>
          <ul
            v-if="openDropdown === 'warehouse'"
            class="list-unstyled ps-3 mt-2"
          >
            <li>
              <router-link to="/admin/rooms"
                ><i class="fas fa-door-closed me-2"></i>Stanze</router-link
              >
            </li>
            <li>
              <router-link to="/admin/products"
                ><i class="fa-solid fa-stethoscope me-2"></i
                >Prodotti</router-link
              >
            </li>
            <li>
              <router-link to="/admin/drugs"
                ><i class="fa-solid fa-pills me-2"></i>Medicinali</router-link
              >
            </li>
          </ul>
        </li>

        <!-- 🧑‍⚕️ Dropdown Personale Medico -->
        <li
          :class="
            route.path.includes('doctors') || route.path.includes('patients')
              ? 'active'
              : ''
          "
        >
          <a
            href="#"
            class="d-flex justify-content-between align-items-center"
            @click.prevent="toggleDropdown('staff')"
          >
            <span
              ><i class="fa-solid fa-user-doctor me-2"></i>Personale
              medico</span
            >
            <i
              class="fa-solid"
              :class="
                openDropdown === 'staff' ? 'fa-chevron-up' : 'fa-chevron-down'
              "
            ></i>
          </a>
          <ul v-if="openDropdown === 'staff'" class="list-unstyled ps-3 mt-2">
            <li>
              <router-link to="/admin/doctors">
                <i class="fa-solid fa-user-doctor me-2"></i>Dottori
              </router-link>
            </li>
            <li>
              <router-link to="/admin/patients">
                <i class="fa-solid fa-hospital-user me-2"></i>Pazienti
              </router-link>
            </li>
          </ul>
        </li>
        <li
          :class="route.path.includes('medical_appointments') ? 'active' : ''"
        >
          <router-link to="/admin/medical_appointments/create">
            <i class="fa-solid fa-calendar-check me-2"></i>Crea appuntamento
          </router-link>
        </li>
        <li :class="route.path.includes('time_entries') ? 'active' : ''">
          <router-link to="/admin/time_entries">
            <i class="fa-solid fa-clock me-2"></i>Orari svolti
          </router-link>
        </li>
        <li :class="route.path.includes('tasks') ? 'active' : ''">
          <router-link to="/admin/tasks">
            <i class="fa-solid fa-list-check me-2"></i>Task
          </router-link>
        </li>
      </ul>
    </div>
    <div class="bottom-sidebar">
      <button @click="logout"><i class="fas fa-user me-2"></i>Logout</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/generals.scss";
@use "../styles/_partials//_mixins.scss" as *;
@use "../styles/_partials/_variables.scss" as *;

#sidebar {
  width: 230px;
  height: 100vh;
  background-color: $mainColor;
  color: #fff;
  border-right: 1px solid $mainColor;
}

.top-sidebar {
  display: flex;
  align-items: center;
  height: 90px;
  border-bottom: 1px solid #fff;

  .text-decoration-none {
    text-decoration: none;
  }

  img {
    width: 75px;
  }
}

.middle-sidebar {
  height: calc(100vh - 160px);

  li {
    padding: 20px 10px 20px 20px;
    transition: 0.3s;
    &:hover {
      @include sidebarItems;
    }

    a {
      font-family: "Great Vibes", sans-serif;
      color: #fff;
      font-size: 25px;
      text-decoration: none;
    }
  }

  li.active {
    @include sidebarItems;

    // &:hover {
    //   background-color: $mainColor;
    //   a {
    //     color: #fff;
    //   }
    // }
  }
}

.bottom-sidebar {
  height: 70px;

  button {
    height: 100%;
    width: 100%;
    background-color: #fff;
    border: 1px solid $mainColor;
    color: $mainColor;
    transition: 0.3s;
    &:hover {
      background-color: $mainColor;
      color: #fff;
      border-top: 1px solid #fff;
    }
  }
}
</style>
