# 🧭 Public Toilet Finder – Kiel

## 📸 Application Preview

![Public Toilet Finder - Kiel](./screenshots/app-preview.png)


> **A Web Mapping Application using Vue 3, Vite, OpenLayers & GeoServer (WFS)**

This project is a web-based map application that displays public toilets in the city of Kiel. The toilet locations are extracted from OpenStreetMap (OSM), published via GeoServer as a WFS layer, and rendered on an interactive map using OpenLayers.

**Users can:**

- View all public toilet locations in Kiel
- Click a toilet to see detailed attributes
- Filter toilets that are wheelchair-accessible
- Use custom floating map controls (Zoom In, Zoom Out, Recenter)
- Navigate a responsive and highly accessible interface

_This application was developed as part of the Geographical Web Development course at HAW Kiel._

---

## 🚀 Demo (Local Preview)

After building the project, you can preview the production build locally:

```bash
npm run preview
```


The application will be available at:  
**http://localhost:4173**

---

## 📌 Features

### 🗺️ Interactive Map

- Built with **OpenLayers**
- Custom zoom controls (Google Maps style)
- Centered on **Kiel, Germany**

### 🚻 Public Toilet Data from OSM

- Served through **GeoServer WFS**
- Efficient `bbox` loading strategy
- **Popup** shows toilet attributes:
  - `name`
  - `amenity`
  - `wheelchair` accessibility

### ♿ Accessibility Filter

- Filter toilets with `wheelchair = "yes"`
- Other features are hidden dynamically.

### 💬 Popup Overlay

- A clean, responsive overlay shows toilet details when clicking on features.

### ⭐ Modern Web Standards

- **Lighthouse scores:**
  - Performance: **100**
  - Accessibility: **100**
  - Best Practices: **96**
  - SEO: **91**

---

## 📂 Project Structure

```text
public-toilet-finder/
│
├── src/
│   ├── assets/
│   │   └── toilet-icon.png
│   ├── components/
│   │   └── MapView.vue
│   ├── App.vue
│   └── main.ts
│
├── public/
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🛠️ Technologies Used

| Category               | Technology              |
| :--------------------- | :---------------------- |
| **Frontend Framework** | Vue 3 (Composition API) |
| **Build Tool**         | Vite                    |
| **Mapping Library**    | OpenLayers              |
| **GIS Backend**        | GeoServer WFS           |
| **Data Format**        | GeoJSON                 |
| **Styling**            | Custom CSS              |
| **Language**           | TypeScript              |

---

## 🌐 GeoServer Configuration

To replicate the backend setup:

1.  **Workspace:** `ptf`
2.  **Data Store:** Upload the OSM-derived toilet dataset.
3.  **Layer Name:** `ptf:toilets_kiel`
4.  **Enable WFS:**
    - Version: `1.1.0`
    - Output format: `application/json`
    - SRS: `EPSG:3857`

**WFS Endpoint Used by the App:**

```http
/geoserver/ptf/ows?
service=WFS&
version=1.1.0&
request=GetFeature&
typename=ptf:toilets_kiel&
outputFormat=application/json&
srsName=EPSG:3857&
bbox={extent},EPSG:3857
```

---

## 🧩 Installation & Development

### 1\. Clone Repository

```bash
git clone <your-repo-url>
cd public-toilet-finder
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Start Development Server

```bash
npm run dev
```

Runs at: **http://localhost:5173**

---

## 🏗️ Production Build

To build the app for production:

```bash
npm run build
```

To preview the build:

```bash
npm run preview
```

Preview runs at: **http://localhost:4173**

---

## 📊 Lighthouse Results (Production)

| Metric         |   Score    |
| :------------- | :--------: |
| Performance    | 🟢 **100** |
| Accessibility  | 🟢 **100** |
| Best Practices | 🟢 **96**  |
| SEO            | 🟢 **91**  |

_A full HTML Lighthouse report is included in the project export._

### Highlights

- Optimized JS bundle from Vite
- Very fast FCP & LCP
- Zero blocking JS
- High contrast accessible controls
- Keyboard-friendly interface

---

## ♿ Accessibility Features

- ✅ Keyboard navigation supported
- ✅ Buttons include ARIA labels
- ✅ Color contrast meets WCAG standards
- ✅ Popup readable with assistive technology
- ✅ Mobile-friendly responsive layout

---

## 🧪 Manual Testing

### Browsers Tested

- Chrome
- Firefox

### Verifications

- Popup content loads correctly.
- Zoom controls work seamlessly with mouse & keyboard.
- Wheelchair filter updates icons instantly.
- No console errors in production build.

### Mobile Test

- UI tested in Chrome DevTools responsive mode.
- Buttons and popup scale correctly on smaller screens.

---

## 🔮 Future Improvements

- [ ] Add attributes such as cost, opening hours, indoor/outdoor
- [ ] Support routing to nearest toilet
- [ ] Add search functionality
- [ ] Use clustering for better map readability
- [ ] Allow users to add toilet suggestions (WFS-T)

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgments

- OpenStreetMap Contributors
- GeoServer
- OpenLayers
- FH Kiel GIS/Web Mapping module

<!-- end list -->
