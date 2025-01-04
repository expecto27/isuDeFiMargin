<template>
    <div id="app">
      <nav>
        <img src="./../assets/logo.png" alt="Logo" class="logo" />
        <router-link class="item link" to="/main">Main</router-link>
        <router-link class="item link" to="/swap">TokenSwap</router-link>
      </nav>
    </div>
  </template>
  
  <script>
      export default {
          name: "NavBar",
          data() {
              return {
  
              };
          }
      };
  </script>
  
  <style>
    .logo {
      height: 40px; /* Высота логотипа */
      margin-right: 15px; /* Отступ справа от логотипа */
    }
    .item {
      margin-right: 15px;
    }
    .h1{
        align-items:center;
    }
  </style>