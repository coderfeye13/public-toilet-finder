<template>
  <footer class="footer">
    <p class="footer__text">
      Data source:
      <a
        href="https://www.openstreetmap.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        OpenStreetMap contributors
      </a>
    </p>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  padding: 0.5rem 0;
  border-top: 1px solid #ddd;
  margin-top: auto;
}

.footer__text {
  margin: 0;
  font-size: 0.85rem;
  color: #333;
}

.footer__text a {
  color: #0078ff;
  text-decoration: none;
}

.footer__text a:hover {
  text-decoration: underline;
}
</style>
