<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

// OpenLayers core
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import ImageLayer from 'ol/layer/Image'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import ImageWMS from 'ol/source/ImageWMS'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat } from 'ol/proj'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import { Icon, Style } from 'ol/style'
import type { StyleFunction } from 'ol/style/Style'
import Overlay from 'ol/Overlay'
import type { FeatureLike } from 'ol/Feature'
import Point from 'ol/geom/Point'
import type MapBrowserEvent from 'ol/MapBrowserEvent'
import { defaults as defaultControls } from 'ol/control'

// -----------------------------------------------------------------------------
// DOM refs
// -----------------------------------------------------------------------------
const mapElement = ref<HTMLDivElement | null>(null)
const popupElement = ref<HTMLDivElement | null>(null)

// filter state (top-right checkbox)
const wheelchairOnly = ref(false)

// OpenLayers objects
let map: Map | null = null
let toiletsLayer: VectorLayer<VectorSource> | null = null
let toiletsSource: VectorSource | null = null
let popupOverlay: Overlay | null = null

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

// toilet icon (src/assets/toilet-icon.png)
const toiletIconStyle = new Style({
	image: new Icon({
		src: new URL('../assets/toilet-icon.png', import.meta.url).href,
		anchor: [0.5, 1],
		scale: 0.06,
	}),
})

// “hidden” style for features that should be filtered out
const hiddenStyle = new Style({})

// style function that respects the wheelchair filter
const styleFunction: StyleFunction = (feature: FeatureLike) => {
	if (wheelchairOnly.value) {
		const wheelchair = feature.get('wheelchair')
		if (wheelchair !== 'yes') {
			return hiddenStyle
		}
	}
	return toiletIconStyle
}

// -----------------------------------------------------------------------------
// Map setup
// -----------------------------------------------------------------------------

onMounted(() => {
	const baseLayer = new TileLayer({
		source: new OSM(),
	})

	// WMS layer: aynı GeoServer layer'ını imaj olarak gösteriyoruz
	const toiletsWmsLayer = new ImageLayer({
		source: new ImageWMS({
			url: '/geoserver/ptf/wms',
			params: {
				LAYERS: 'ptf:toilets_kiel',
				FORMAT: 'image/png',
				TRANSPARENT: 'true',
			},
			ratio: 1,
		}),
		opacity: 0.4,
	})

	toiletsSource = new VectorSource({
		format: new GeoJSON(),
		url: (extent) =>
			`/geoserver/ptf/ows?service=WFS&version=1.1.0&request=GetFeature&` +
			`typename=ptf:toilets_kiel&` +
			`outputFormat=application/json&` +
			`srsName=EPSG:3857&` +
			`bbox=${extent.join(',')},EPSG:3857`,
		strategy: bboxStrategy,
	})

	toiletsLayer = new VectorLayer({
		source: toiletsSource,
		style: styleFunction,
	})

	// popup overlay
	popupOverlay = new Overlay({
		element: popupElement.value as HTMLElement,
		offset: [0, -15],
		autoPan: true,
	})

	map = new Map({
		target: mapElement.value as HTMLDivElement,
		layers: [baseLayer, toiletsWmsLayer, toiletsLayer],
		overlays: popupOverlay ? [popupOverlay] : [],
		controls: defaultControls({
			zoom: false,
			rotate: false,
			attribution: true,
		}),
		view: new View({
			center: fromLonLat([10.1228, 54.3233]), // Kiel
			zoom: 13,
		}),
	})

	map.on('singleclick', handleMapClick)
})

onBeforeUnmount(() => {
	if (map) {
		map.un('singleclick', handleMapClick)
		map.setTarget(undefined)
		map = null
	}
})

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

function handleMapClick(evt: MapBrowserEvent): void {
	if (!map || !popupOverlay) return

	let found: FeatureLike | undefined

	map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
		if (layer === toiletsLayer) {
			found = feature
		}
	})

	const popupEl = popupElement.value
	if (!popupEl) return

	if (!found) {
		popupOverlay.setPosition(undefined)
		popupEl.style.display = 'none'
		return
	}

	const geom = found.getGeometry() as Point
	const coord = geom.getCoordinates()

	// Temel alanlar
	const name = (found.get('name') as string | null) || 'Public toilet'
	const wheelchair = (found.get('wheelchair') as string | null) || 'unknown'

	// Ücret / fiyat
	const fee = found.get('fee') as string | null
	const charge = found.get('charge') as string | null

	let priceDisplay = 'Unknown'
	if (charge && charge.trim().length > 0) {
		priceDisplay = charge
	} else if (fee === 'yes') {
		priceDisplay = 'Paid'
	} else if (fee === 'no') {
		priceDisplay = 'Free'
	}

	// Access (public vs customers vs unknown)
	const access = found.get('access') as string | null
	let accessDisplay = 'Unknown'
	if (access === 'yes' || access === 'public') {
		accessDisplay = 'Public'
	} else if (access === 'customers') {
		accessDisplay = 'Customers only'
	} else if (access && access.length > 0) {
		accessDisplay = access
	}

	// Opening hours
	const openingHours = found.get('opening_hours') as string | null
	const openingDisplay =
		openingHours && openingHours.length > 0
			? openingHours
			: 'Not specified'

	// Gender bilgisi (unisex / male / female)
	const male = found.get('male') as string | null
	const female = found.get('female') as string | null
	const unisex = found.get('unisex') as string | null

	let genderDisplay = 'Unknown'
	if (unisex === 'yes') {
		genderDisplay = 'Unisex'
	} else if (male === 'yes' && female === 'yes') {
		genderDisplay = 'Male & Female'
	} else if (male === 'yes' && female !== 'yes') {
		genderDisplay = 'Male'
	} else if (female === 'yes' && male !== 'yes') {
		genderDisplay = 'Female'
	}

	// Changing table (bebek alt değiştirme)
	const changingTable = found.get('changing_table') as string | null
	let changingDisplay = 'Unknown'
	if (changingTable === 'yes') {
		changingDisplay = 'Yes'
	} else if (changingTable === 'no') {
		changingDisplay = 'No'
	}

	popupEl.innerHTML = `
		<div class="popup-title">${name}</div>
		<div class="popup-row">
			<span class="popup-label">Access:</span> ${accessDisplay}
		</div>
		<div class="popup-row">
			<span class="popup-label">Wheelchair:</span> ${wheelchair}
		</div>
		<div class="popup-row">
			<span class="popup-label">Price:</span> ${priceDisplay}
		</div>
		<div class="popup-row">
			<span class="popup-label">Opening hours:</span> ${openingDisplay}
		</div>
		<div class="popup-row">
			<span class="popup-label">Gender:</span> ${genderDisplay}
		</div>
		<div class="popup-row">
			<span class="popup-label">Changing table:</span> ${changingDisplay}
		</div>
	`
	popupEl.style.display = 'block'
	popupOverlay.setPosition(coord)
}

// when checkbox changes, refresh style
function onWheelchairToggle() {
	if (!toiletsLayer) return
	toiletsLayer.setStyle(styleFunction)
}

// -----------------------------------------------------------------------------
// Custom floating buttons (Google Maps style)
// -----------------------------------------------------------------------------

function zoomIn() {
	if (!map) return
	const view = map.getView()
	view.setZoom((view.getZoom() ?? 13) + 1)
}

function zoomOut() {
	if (!map) return
	const view = map.getView()
	view.setZoom((view.getZoom() ?? 13) - 1)
}

function recenter() {
	if (!map) return
	const view = map.getView()
	view.setCenter(fromLonLat([10.1228, 54.3233]))
	view.setZoom(13)
}
</script>

<template>
	<div class="map-wrapper">
		<!-- top-right filter panel -->
		<div class="controls">
			<label class="filter-checkbox">
				<input
					type="checkbox"
					v-model="wheelchairOnly"
					@change="onWheelchairToggle"
				/>
				Wheelchair accessible only
			</label>
		</div>

		<!-- sağ altta floating action buttons -->
		<div class="map-actions" aria-label="Map controls">
			<button
				type="button"
				class="map-action-btn"
				@click="zoomIn"
				aria-label="Zoom in"
			>
				+
			</button>
			<button
				type="button"
				class="map-action-btn"
				@click="zoomOut"
				aria-label="Zoom out"
			>
				−
			</button>
			<button
				type="button"
				class="map-action-btn"
				@click="recenter"
				aria-label="Recenter map to Kiel"
			>
				⌖
			</button>
		</div>

		<!-- map -->
		<div ref="mapElement" class="map" />

		<!-- popup -->
		<div ref="popupElement" class="ol-popup" />
	</div>
</template>

<style scoped>
.map-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
}

/* Harita alanı */
.map {
	width: 100%;
	height: 100%;
}

/* Sağ üst filtre paneli */
.controls {
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.7);
	color: #f5f5f5;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 13px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.filter-checkbox {
	display: flex;
	align-items: center;
	gap: 6px;
}

.filter-checkbox input {
	cursor: pointer;
}

/* Sağ altta Google Maps tarzı floating butonlar */
.map-actions {
	position: absolute;
	right: 12px;
	bottom: 12px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 1000;
}

.map-action-btn {
	width: 3rem; /* ~48px */
	height: 3rem;
	border-radius: 50%;
	border: none;
	background: rgba(0, 0, 0, 0.85);
	color: #ffffff;
	font-size: 1.4rem;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.map-action-btn:focus-visible {
	outline: 3px solid #4caf50;
	outline-offset: 2px;
}

.map-action-btn:hover {
	background: rgba(0, 0, 0, 0.95);
}

/* Popup görünümü */
.ol-popup {
	position: absolute;
	background: #ffffff;
	color: #222;
	padding: 8px 10px;
	border-radius: 6px;
	border: 1px solid rgba(0, 0, 0, 0.25);
	min-width: 180px;
	font-size: 12px;
	line-height: 1.4;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	transform: translate(-50%, -100%);
	pointer-events: none;
	display: none;
}

.popup-title {
	font-weight: 600;
	margin-bottom: 4px;
}

.popup-row {
	margin-bottom: 2px;
}

.popup-label {
	font-weight: 500;
	margin-right: 4px;
}
</style>
