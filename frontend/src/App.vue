<template>
  <div class="app">
    <navbar/>
    <router-view />
  </div>
</template>

<script>
    import Navbar from './components/NavBar.vue';
    export default {
        name: 'App',
        components: {
            Navbar
        }
    }
</script>

<style>
  /* Основной фон приложения и шрифты */
  html {
    background-color: #2b2b2b; /* Темный фон */
    color: #dcdcdc; /* Светлый текст */
    font-family: 'JetBrains Mono', monospace; /* Шрифт, похожий на JetBrains */
    min-height: 100vh;
    padding: 20px;
  }

  .app {
    font-weight: bold;
    margin-top: 100px;
    font-size: 24px;
    margin-left: 20%; /* Отступ слева */
    margin-right: 20%; /* Отступ справа */
  }

  .center-content {
    text-align: center;
  }

  /* Стили для ссылок */
  .link {
    position: relative;
    color: #dcdcdc; /* Светлый текст для ссылок */
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
  }

  .link:hover {
    color: #8abeb7; /* Цвет при наведении (похож на синюю подсветку) */
    transition: all 500ms;
  }

  .link::after {
    position: absolute;
    content: '';
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 1px;
    background: #8abeb7; /* Цвет нижней линии */
  }

  .link::after {
    width: 0;
    transition: 0.3s;
    left: 50%;
    transform: translate(-50%);
  }

  .link:hover:after {
    width: 100%;
  }

  .links {
    display: flex;
    justify-content: space-between;
  }
</style>
