<script setup></script>
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
            this.$route.matched.some((route) => route.path.includes('/rooms'))
              ? 'active'
              : ''
          "
        >
          <router-link to="/admin/rooms"
            ><i class="fas fa-door-closed me-2"></i>Stanze</router-link
          >
        </li>
        <li
          :class="
            this.$route.matched.some((route) =>
              route.path.includes('/products')
            )
              ? 'active'
              : ''
          "
        >
          <router-link to="/admin/products"
            ><i class="fa-solid fa-stethoscope me-2"></i>Prodotti</router-link
          >
        </li>
        <li
          :class="
            this.$route.matched.some((route) => route.path.includes('/drugs'))
              ? 'active'
              : ''
          "
        >
          <router-link to="/admin/drugs"
            ><i class="fa-solid fa-pills me-2"></i>Medicinali</router-link
          >
        </li>
      </ul>
    </div>
    <div class="bottom-sidebar">
      <button><i class="fas fa-user me-2"></i>Logout</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/generals.scss";
@use "../styles/_partials//_mixins.scss" as *;
@use "../styles/_partials/_variables.scss" as *;

#sidebar {
  width: 200px;
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
    padding: 20px 0px 20px 20px;
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
