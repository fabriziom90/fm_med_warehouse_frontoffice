<script setup></script>
<template lang="">
  <div id="sidebar">
    <div class="top-sidebar">
      <img src="/logo.png" alt="" />
      <h2 class="fs-5 mt-3">MediStock</h2>
    </div>
    <div class="middle-sidebar">
      <ul class="list-unstyled">
        <li>
          <router-link
            ><i class="fas fa-door-closed me-2"></i>Stanze</router-link
          >
        </li>
        <li>
          <a href="#"><i class="fa-solid fa-stethoscope me-2"></i>Prodotti</a>
        </li>
        <li>
          <a href="#"><i class="fa-solid fa-pills me-2"></i>Medicinali</a>
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
@use "../styles/_partials/_variables.scss" as *;
#sidebar {
  width: 200px;
  height: 100vh;
  background-color: $mainColor;
  color: #fff;
}

.top-sidebar {
  display: flex;
  align-items: center;
  height: 90px;
  border-bottom: 1px solid #fff;
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
      background-color: #fff;

      a {
        color: $mainColor;
      }
    }

    a {
      font-family: "Great Vibes", sans-serif;
      color: #fff;
      font-size: 25px;
      text-decoration: none;
    }
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
