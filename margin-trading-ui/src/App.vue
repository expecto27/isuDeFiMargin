<template>
  <div id="app">
    <header>
      <h1>Margin Trading App</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/deposit">Deposit</router-link>
        <router-link to="/borrow">Borrow</router-link>
        <router-link to="/trade">Trade</router-link>
        <router-link to="/liquidation">Liquidation</router-link>
        <router-link to="/account">Account</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  text-align: center;
}

header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

nav {
  margin: 20px 0;
}

nav a {
  color: #61dafb;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  font-weight: bold;
}

main {
  padding: 20px;
}
</style>
