<template>
  <header class="header">
    <h1 class="header__title">Public Toilet Finder</h1>
    <p class="header__subtitle">
      Find public toilets in Kiel using OpenStreetMap data
    </p>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.header__title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.header__subtitle {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}
</style>
