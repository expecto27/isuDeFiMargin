<template>
    <div id="app">
      <nav>
        <router-link class="item link" to="/main">Main</router-link>
        <router-link class="item link" to="/margin">Margin</router-link>
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
    .item {
      margin-right: 15px;
    }
    .h1{
        align-items:center;
    }
  </style>