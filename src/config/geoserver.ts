// src/config/geoserver.ts
export const GEOSERVER_BASE_URL = '/geoserver';

export const GEOSERVER_WORKSPACE = 'ptf';
export const GEOSERVER_LAYER_NAME = 'toilets_kiel';

// WMS ve WFS endpoint'leri
export const GEOSERVER_WMS_URL = `${GEOSERVER_BASE_URL}/${GEOSERVER_WORKSPACE}/wms`;
export const GEOSERVER_WFS_URL = `${GEOSERVER_BASE_URL}/${GEOSERVER_WORKSPACE}/wfs`;
export const GEOSERVER_TYPENAME = `${GEOSERVER_WORKSPACE}:${GEOSERVER_LAYER_NAME}`;
