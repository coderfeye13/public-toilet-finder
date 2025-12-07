<script setup lang="ts">
import MapView from './components/MapView.vue'
</script>

<template>
	<div class="app">
		<header class="app-header">
			<h1>Public Toilet Finder</h1>
			<p class="app-tagline">
				Find public toilets in Kiel using OpenStreetMap data.
			</p>
		</header>

		<main
			id="main-content"
			class="app-main"
			role="main"
		>
			<section
				class="map-section"
				aria-label="Map of public toilets in Kiel"
			>
				<MapView />
			</section>
		</main>
	</div>
</template>

<style scoped>
.app {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: #121212;
	color: #f5f5f5;
}

/* Üst başlık */
.app-header {
	padding: 1.2rem 1rem 0.5rem;
}

.app-header h1 {
	font-size: 1.6rem;
	margin-bottom: 0.2rem;
}

.app-tagline {
	font-size: 0.95rem;
	color: #bbbbbb;
}

/* Harita alanı */
.app-main {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: stretch;
	padding: 0 1rem 1rem;
}

/* Harita, ekrandaki boşluğun tamamını doldursun
	 (header’ın yüksekliğini düşerek yaklaşık hesaplıyoruz) */
.map-section {
	width: 100%;
	max-width: 1200px;
	height: calc(100vh - 7rem);
}

/* Mobil için ufak ayar */
@media (max-width: 768px) {
	.app-main {
		padding: 0 0.5rem 0.75rem;
	}

	.map-section {
		height: calc(100vh - 8.5rem);
	}
}
</style>
