import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Real geographic coordinates for monitored communities in Dindigul / Tamil Nadu
const VILLAGES = [
  {
    id: "kalli",
    name: "Kallimandayam",
    lat: 10.5124,
    lng: 77.7265,
    risk: "High Risk",
    riskLevel: "High",
    cases: 12,
    color: "#ef4444",
    pulseColor: "rgba(239, 68, 68, 0.4)",
    radius: 2600,
    desc: "Turbidity spike & 12 acute diarrhea cases under containment",
    turbidity: "18.4 NTU (High)"
  },
  {
    id: "ottan",
    name: "Ottanchathiram",
    lat: 10.4900,
    lng: 77.7800,
    risk: "Moderate Risk",
    riskLevel: "Moderate",
    cases: 7,
    color: "#f59e0b",
    pulseColor: "rgba(245, 158, 11, 0.4)",
    radius: 1800,
    desc: "Reservoir contamination warning; gastrointestinal reports",
    turbidity: "14.1 NTU (Elevated)"
  },
  {
    id: "poosari",
    name: "Poosaripatti",
    lat: 10.5400,
    lng: 77.8200,
    risk: "Low Risk",
    riskLevel: "Low",
    cases: 3,
    color: "#10b981",
    pulseColor: "rgba(16, 185, 129, 0.35)",
    radius: 1000,
    desc: "Sporadic fever cases; testing camp conducted",
    turbidity: "4.2 NTU (Safe)"
  },
  {
    id: "soolakkarai",
    name: "Soolakkarai",
    lat: 10.5050,
    lng: 77.6800,
    risk: "Normal",
    riskLevel: "Normal",
    cases: 1,
    color: "#64748b",
    pulseColor: "rgba(100, 116, 139, 0.2)",
    radius: 700,
    desc: "Routine epidemiological surveillance baseline",
    turbidity: "3.8 NTU (Safe)"
  },
  {
    id: "vellala",
    name: "Vellalapatti",
    lat: 10.4500,
    lng: 77.7100,
    risk: "Normal",
    riskLevel: "Normal",
    cases: 1,
    color: "#64748b",
    pulseColor: "rgba(100, 116, 139, 0.2)",
    radius: 700,
    desc: "Monitored for potential mosquito breeding following rains",
    turbidity: "3.5 NTU (Safe)"
  },
  {
    id: "senganur",
    name: "Senganur",
    lat: 10.4800,
    lng: 77.8400,
    risk: "Normal",
    riskLevel: "Normal",
    cases: 0,
    color: "#64748b",
    pulseColor: "rgba(100, 116, 139, 0.2)",
    radius: 500,
    desc: "Safe baseline metrics; 0 active cases",
    turbidity: "2.9 NTU (Safe)"
  }
];

// Pre-generated cosmic background stars
const GLOBE_STARS = Array.from({ length: 90 }, (_, i) => ({
  x: ((i * 137.5) % 100) / 100,
  y: ((i * 269.3) % 100) / 100,
  size: (i % 3) * 0.6 + 0.8,
  seed: i * 1.7
}));

// Real high-accuracy world continent polygon coastlines
const WORLD_CONTINENTS = [
  // 1. Indian Subcontinent & South Asia (Epicenter Region)
  {
    name: "India & South Asia",
    pts: [
      [8.08, 77.55], [8.7, 78.1], [10.3, 79.8], [11.5, 79.8], [13.1, 80.3],
      [15.9, 80.6], [17.7, 83.3], [20.3, 86.7], [21.7, 87.5], [22.4, 89.6],
      [22.8, 91.2], [21.2, 92.2], [24.0, 91.8], [26.2, 92.5], [27.8, 95.8],
      [28.2, 96.6], [28.0, 93.5], [27.0, 88.5], [28.5, 84.0], [30.5, 80.5],
      [34.5, 76.5], [36.0, 74.0], [34.0, 72.0], [31.5, 71.0], [28.0, 68.5],
      [24.5, 67.5], [23.5, 68.5], [22.5, 69.5], [20.8, 70.4], [21.0, 72.0],
      [20.5, 72.8], [18.9, 72.8], [15.5, 73.8], [12.9, 74.8], [9.9, 76.2],
      [8.08, 77.55]
    ]
  },
  // 2. Sri Lanka
  {
    name: "Sri Lanka",
    pts: [
      [5.9, 80.5], [6.9, 79.8], [8.6, 79.8], [9.8, 80.2], [9.3, 80.8],
      [8.6, 81.2], [7.7, 81.7], [6.9, 81.8], [5.9, 80.5]
    ]
  },
  // 3. Arabian Peninsula
  {
    name: "Arabian Peninsula",
    pts: [
      [12.6, 44.0], [14.0, 48.3], [16.5, 53.8], [19.0, 57.8], [22.4, 59.8],
      [24.2, 57.0], [26.1, 56.3], [24.5, 54.5], [24.0, 51.5], [26.0, 50.0],
      [27.8, 49.0], [30.0, 48.0], [30.0, 44.0], [32.0, 36.0], [29.5, 35.0],
      [28.0, 34.5], [25.0, 37.0], [21.5, 39.2], [17.0, 42.5], [13.0, 43.0],
      [12.6, 44.0]
    ]
  },
  // 4. Africa
  {
    name: "Africa",
    pts: [
      [37.2, 9.8], [36.8, 11.0], [33.5, 12.0], [31.5, 19.0], [32.0, 24.0],
      [31.2, 32.3], [27.0, 34.0], [22.0, 36.8], [15.5, 39.5], [12.0, 43.5],
      [11.8, 51.2], [8.0, 50.0], [2.0, 45.5], [-2.0, 40.8], [-6.0, 39.2],
      [-11.0, 40.5], [-15.0, 40.5], [-19.0, 36.0], [-25.0, 33.0], [-28.0, 32.5],
      [-33.0, 27.5], [-34.8, 20.0], [-34.0, 18.4], [-29.0, 16.8], [-22.5, 14.4],
      [-16.0, 11.8], [-9.0, 13.0], [-5.0, 12.0], [0.0, 9.3], [4.5, 8.5],
      [4.3, 6.0], [5.0, 0.5], [5.3, -4.0], [4.4, -7.5], [6.2, -10.5],
      [9.0, -13.2], [11.8, -15.5], [14.8, -17.0], [21.0, -17.0], [26.0, -14.5],
      [30.5, -9.8], [35.8, -5.8], [35.8, 0.0], [37.2, 9.8]
    ]
  },
  // 5. Madagascar
  {
    name: "Madagascar",
    pts: [
      [-12.0, 49.3], [-15.5, 50.5], [-20.0, 48.6], [-25.2, 47.0], [-25.5, 45.2],
      [-22.0, 43.3], [-16.0, 44.5], [-13.0, 48.5], [-12.0, 49.3]
    ]
  },
  // 6. Europe
  {
    name: "Europe",
    pts: [
      [36.0, -5.5], [36.8, -2.0], [39.0, 0.0], [42.0, 3.2], [43.5, 7.5],
      [44.0, 12.5], [41.0, 15.0], [38.0, 16.0], [40.0, 18.5], [44.5, 14.5],
      [45.5, 13.5], [44.0, 20.0], [40.0, 20.0], [37.8, 21.8], [36.5, 23.0],
      [38.0, 24.0], [40.5, 26.0], [41.2, 29.0], [44.0, 29.0], [46.5, 31.0],
      [45.0, 36.5], [42.0, 41.5], [41.0, 48.0], [46.0, 49.0], [50.0, 40.0],
      [55.0, 38.0], [57.0, 30.0], [59.0, 26.0], [54.5, 19.0], [54.0, 11.5],
      [51.0, 2.5], [48.5, -4.7], [46.0, -1.2], [43.5, -1.8], [43.5, -9.0],
      [37.0, -9.0], [36.0, -5.5]
    ]
  },
  // 7. United Kingdom & Ireland
  {
    name: "British Isles",
    pts: [
      [50.0, -5.2], [50.8, -1.5], [51.5, 1.4], [53.0, 0.5], [55.5, -1.5],
      [58.5, -3.5], [58.5, -5.0], [56.0, -5.5], [54.5, -3.5], [53.0, -4.5],
      [51.5, -4.0], [50.0, -5.2]
    ]
  },
  // 8. Scandinavia
  {
    name: "Scandinavia",
    pts: [
      [55.5, 13.0], [56.0, 16.5], [59.0, 18.5], [63.5, 20.0], [65.5, 22.0],
      [69.0, 26.0], [71.0, 28.0], [70.5, 21.0], [67.0, 14.0], [62.5, 5.0],
      [58.0, 7.0], [58.0, 11.5], [55.5, 13.0]
    ]
  },
  // 9. East Asia, China, Central Asia, Russia
  {
    name: "East Asia & Siberia",
    pts: [
      [76.0, 110.0], [73.0, 130.0], [70.0, 160.0], [66.0, 170.0], [65.0, 178.0],
      [60.0, 165.0], [52.0, 156.0], [52.0, 141.0], [45.0, 136.0], [42.0, 130.0],
      [38.0, 126.0], [34.5, 126.0], [37.0, 129.5], [40.0, 124.0], [38.5, 118.0],
      [32.0, 121.5], [28.0, 121.5], [23.5, 117.0], [22.0, 113.5], [21.0, 108.5],
      [16.0, 108.5], [10.5, 107.5], [8.5, 104.5], [12.0, 100.0], [17.0, 96.5],
      [20.0, 93.0], [24.0, 97.0], [30.0, 100.0], [35.0, 100.0], [42.0, 95.0],
      [48.0, 90.0], [52.0, 85.0], [56.0, 70.0], [62.0, 60.0], [68.0, 50.0],
      [71.0, 52.0], [73.0, 72.0], [76.0, 110.0]
    ]
  },
  // 10. Japan
  {
    name: "Japan",
    pts: [
      [31.0, 130.5], [33.5, 133.5], [35.5, 136.0], [35.5, 140.5], [40.5, 140.0],
      [43.5, 145.0], [45.0, 142.0], [41.0, 140.0], [37.0, 137.0], [34.0, 131.0],
      [31.0, 130.5]
    ]
  },
  // 11. Southeast Asia & Indonesia
  {
    name: "Indochina & Malaysia",
    pts: [
      [20.0, 102.0], [16.0, 108.0], [10.5, 107.5], [8.5, 104.5], [1.3, 103.8],
      [4.0, 101.0], [6.0, 100.0], [12.0, 99.0], [16.0, 98.0], [20.0, 102.0]
    ]
  },
  {
    name: "Sumatra & Java",
    pts: [
      [5.5, 95.5], [2.0, 99.0], [-3.0, 102.5], [-5.8, 106.0], [-6.2, 107.0],
      [-7.5, 111.0], [-8.5, 114.5], [-7.0, 113.0], [-6.0, 106.0], [-4.0, 105.0],
      [0.0, 100.0], [4.0, 97.0], [5.5, 95.5]
    ]
  },
  {
    name: "Borneo & Celebes",
    pts: [
      [4.0, 114.0], [6.5, 117.0], [4.0, 118.5], [-1.0, 117.0], [-3.5, 116.0],
      [-3.5, 111.0], [1.0, 109.5], [4.0, 114.0]
    ]
  },
  // 12. Australia
  {
    name: "Australia",
    pts: [
      [-11.0, 142.5], [-15.0, 145.5], [-20.0, 148.5], [-27.5, 153.5], [-34.0, 151.2],
      [-38.0, 147.0], [-38.0, 140.0], [-35.0, 136.0], [-32.0, 132.5], [-32.0, 125.0],
      [-35.0, 117.0], [-32.0, 115.5], [-25.0, 113.5], [-20.0, 116.0], [-16.5, 123.0],
      [-14.0, 126.0], [-12.5, 131.0], [-12.0, 136.5], [-15.5, 136.5], [-17.0, 139.5],
      [-11.0, 142.5]
    ]
  },
  // 13. North America
  {
    name: "North America",
    pts: [
      [71.0, -156.0], [70.0, -135.0], [69.0, -100.0], [60.0, -65.0], [50.0, -56.0],
      [44.0, -66.0], [40.0, -74.0], [30.0, -81.0], [25.0, -80.5], [29.0, -89.0],
      [28.0, -97.0], [22.0, -97.5], [16.0, -93.0], [15.0, -88.0], [8.5, -83.5],
      [8.5, -79.5], [14.0, -91.0], [20.0, -105.0], [23.0, -110.0], [32.0, -117.0],
      [38.0, -123.0], [48.0, -125.0], [54.0, -133.0], [59.0, -140.0], [60.0, -150.0],
      [55.0, -163.0], [64.0, -166.0], [71.0, -156.0]
    ]
  },
  // 14. South America
  {
    name: "South America",
    pts: [
      [11.5, -72.0], [10.5, -62.0], [5.0, -52.0], [-1.0, -48.0], [-5.0, -35.0],
      [-13.0, -38.5], [-22.5, -41.0], [-30.0, -50.0], [-35.0, -55.0], [-42.0, -63.0],
      [-52.0, -68.0], [-55.0, -68.0], [-50.0, -74.0], [-40.0, -73.0], [-30.0, -71.5],
      [-18.0, -70.5], [-12.0, -77.0], [-5.0, -81.0], [2.0, -78.0], [8.0, -77.0],
      [11.5, -72.0]
    ]
  }
];

// 3D Telemetry and Contagion Surveillance Arcs
const TELEMETRY_ARCS = [
  { from: [10.51, 77.72], to: [28.61, 77.20], label: "National CDC (Delhi)", color: "#38bdf8" },
  { from: [10.51, 77.72], to: [19.07, 72.87], label: "West Zone Hub (Mumbai)", color: "#10b981" },
  { from: [10.51, 77.72], to: [22.57, 88.36], label: "East Zone Hub (Kolkata)", color: "#f59e0b" },
  { from: [10.51, 77.72], to: [1.35, 103.82], label: "WHO SEARO Node (Singapore)", color: "#c084fc" }
];

export default function DiseaseRiskMap() {
  const [viewMode, setViewMode] = useState("street"); // "street", "satellite", "globe"
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globeSpinning, setGlobeSpinning] = useState(true);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  const globeCanvasRef = useRef(null);
  const globeAnimRef = useRef(null);
  const globeRotationRef = useRef({ yaw: -77 * (Math.PI / 180), pitch: 10 * (Math.PI / 180) });
  const globeDragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 });
  const globeScaleRef = useRef(1);

  // Initialize or update Leaflet Real Map
  useEffect(() => {
    if (viewMode === "globe") return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // High-performance Leaflet initialization
      const map = L.map(mapContainerRef.current, {
        center: [10.505, 77.760],
        zoom: 12,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        fadeAnimation: false,
        zoomAnimation: true,
        markerZoomAnimation: true
      });

      mapInstanceRef.current = map;

      // Ensure dragging, touch, keyboard, and scroll interactions are active
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.keyboard.enable();

      // Add zoom control to top-left
      L.control.zoom({ position: "topleft" }).addTo(map);

      // Add Risk Zones (Circles & Polygons) with interactive: false so dragging passes through
      VILLAGES.forEach((v) => {
        // Draw hotspot risk area circle (interactive: false is crucial so dragging passes through)
        if (v.riskLevel === "High" || v.riskLevel === "Moderate") {
          L.circle([v.lat, v.lng], {
            color: v.color,
            fillColor: v.color,
            fillOpacity: 0.18,
            weight: 2,
            dashArray: "4, 4",
            radius: v.radius,
            interactive: false
          }).addTo(map);
        }

        // Custom pulsing HTML marker icon
        const iconHtml = `
          <div class="leaflet-pulse-marker" style="width: 24px; height: 24px;">
            <div class="leaflet-label-pill">${v.name}</div>
            <div class="leaflet-pulse-core" style="background-color: ${v.color};"></div>
            ${
              v.riskLevel === "High" || v.riskLevel === "Moderate"
                ? `<div class="leaflet-pulse-wave" style="background-color: ${v.pulseColor}; border: 1px solid ${v.color};"></div>`
                : ""
            }
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map);

        // Rich telemetry popup
        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 180px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 13px; color: #0f172a;">${v.name}</strong>
              <span style="background: ${v.color}; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">
                ${v.risk}
              </span>
            </div>
            <div style="color: #64748b; margin-bottom: 6px;">${v.desc}</div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; display: flex; flex-direction: column; gap: 3px;">
              <div>Active Cases: <strong style="color: #0f172a;">${v.cases}</strong></div>
              <div>Water Turbidity: <strong style="color: #d97706;">${v.turbidity}</strong></div>
              <div style="color: #94a3b8; font-size: 10px;">Coordinates: ${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => setSelectedVillage(v));
      });
    }

    const map = mapInstanceRef.current;

    // Switch Tile Layer with 100% free tiles (Zero API keys, zero watermarks)
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
    let attribution = '&copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ';

    if (viewMode === "satellite") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = '&copy; Esri World Imagery, DigitalGlobe, Earthstar Geographics';
    } else if (viewMode === "osm") {
      tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
      keepBuffer: 8,
      updateInterval: 50
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [viewMode, isFullscreen]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3D Globe Canvas Interactive Renderer
  useEffect(() => {
    if (viewMode !== "globe") {
      if (globeAnimRef.current) cancelAnimationFrame(globeAnimRef.current);
      return;
    }

    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let isRunning = true;

    // Resize canvas
    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    handleResize();

    // Render 3D Globe Frame
    const renderGlobe = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.72 * globeScaleRef.current;

      ctx.clearRect(0, 0, width, height);

      // Auto-rotation if enabled
      if (globeSpinning && !globeDragRef.current.isDragging) {
        globeRotationRef.current.yaw += 0.003;
      }

      const yaw = globeRotationRef.current.yaw;
      const pitch = globeRotationRef.current.pitch;

      // 1. Cosmic Starfield with Gentle Twinkle
      const nowSec = Date.now() * 0.002;
      GLOBE_STARS.forEach((star) => {
        const alpha = 0.2 + 0.65 * (0.5 + 0.5 * Math.sin(nowSec + star.seed));
        ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Deep Space Nebula Backdrop Glow
      const spaceGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.75,
        centerX,
        centerY,
        radius * 1.55
      );
      spaceGrad.addColorStop(0, "rgba(30, 58, 138, 0.3)");
      spaceGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.09)");
      spaceGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spaceGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // 3. Multi-Layer Outer Atmospheric Corona Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.95,
        centerX,
        centerY,
        radius * 1.25
      );
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.45)");
      glowGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.2)");
      glowGrad.addColorStop(0.8, "rgba(99, 102, 241, 0.08)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 4. Globe Oceanic Sphere Body
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.38,
        centerY - radius * 0.38,
        radius * 0.05,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, "#1d4ed8");
      sphereGrad.addColorStop(0.35, "#0f2f75");
      sphereGrad.addColorStop(0.75, "#081536");
      sphereGrad.addColorStop(1, "#020617");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 5. 3D Spherical Projection Function with Altitude Support
      const project = (latDeg, lngDeg, altRatio = 0) => {
        const phi = (90 - latDeg) * (Math.PI / 180);
        const theta = (lngDeg + 180) * (Math.PI / 180) + yaw;
        const rEff = radius * (1 + altRatio);

        // Spherical to Cartesian
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        // Pitch tilt rotation around X-axis
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = y * cosP - z * sinP;
        const z2 = y * sinP + z * cosP;

        return {
          screenX: centerX + x * rEff,
          screenY: centerY - y2 * rEff,
          z: z2,
          visible: z2 > -0.05
        };
      };

      // Clip inside globe sphere for surface features
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // 6. Latitude & Longitude Graticule Grid
      // Parallels (Latitude lines)
      for (let lat = -70; lat <= 70; lat += 20) {
        const isEquator = lat === 0;
        ctx.strokeStyle = isEquator ? "rgba(56, 189, 248, 0.32)" : "rgba(56, 189, 248, 0.12)";
        ctx.lineWidth = (isEquator ? 1.4 : 0.8) * dpr;
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 8) {
          const p = project(lat, lng, 0);
          if (p.z > -0.05) {
            if (!started) {
              ctx.moveTo(p.screenX, p.screenY);
              started = true;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Meridians (Longitude lines)
      for (let lng = -180; lng < 180; lng += 30) {
        const isPrime = lng === 0;
        ctx.strokeStyle = isPrime ? "rgba(56, 189, 248, 0.3)" : "rgba(56, 189, 248, 0.12)";
        ctx.lineWidth = (isPrime ? 1.4 : 0.8) * dpr;
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 8) {
          const p = project(lat, lng, 0);
          if (p.z > -0.05) {
            if (!started) {
              ctx.moveTo(p.screenX, p.screenY);
              started = true;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 7. Realistic World Continents & Landmass Polygons
      WORLD_CONTINENTS.forEach((cont) => {
        const pts = cont.pts.map(([lat, lng]) => project(lat, lng, 0));
        const visiblePts = pts.filter((p) => p.z > -0.05);
        if (visiblePts.length === 0) return;

        // Continent Landmass Bioluminescent Fill
        if (visiblePts.length > pts.length * 0.3) {
          ctx.beginPath();
          let started = false;
          pts.forEach((p) => {
            if (p.z > -0.1) {
              if (!started) {
                ctx.moveTo(p.screenX, p.screenY);
                started = true;
              } else {
                ctx.lineTo(p.screenX, p.screenY);
              }
            } else {
              started = false;
            }
          });
          ctx.fillStyle = "rgba(16, 185, 129, 0.28)";
          ctx.fill();
        }

        // Glowing Coastline Contour
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const p1 = pts[i];
          const p2 = pts[(i + 1) % pts.length];
          if (p1.z > -0.08 && p2.z > -0.08) {
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
          }
        }
        ctx.shadowColor = "rgba(52, 211, 153, 0.85)";
        ctx.shadowBlur = 4 * dpr;
        ctx.strokeStyle = "rgba(52, 211, 153, 0.8)";
        ctx.lineWidth = 1.3 * dpr;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 8. Monitored Epicenter Region Halo (Dindigul / Tamil Nadu)
      const tnPoint = project(10.51, 77.72, 0);
      if (tnPoint.z > 0) {
        const tnHalo = ctx.createRadialGradient(
          tnPoint.screenX,
          tnPoint.screenY,
          0,
          tnPoint.screenX,
          tnPoint.screenY,
          42 * dpr
        );
        tnHalo.addColorStop(0, "rgba(239, 68, 68, 0.45)");
        tnHalo.addColorStop(0.5, "rgba(245, 158, 11, 0.2)");
        tnHalo.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = tnHalo;
        ctx.beginPath();
        ctx.arc(tnPoint.screenX, tnPoint.screenY, 42 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 9. Spherical Shadow Terminator (Night-Side Shading)
      const termGrad = ctx.createRadialGradient(
        centerX + radius * 0.45,
        centerY + radius * 0.45,
        radius * 0.15,
        centerX,
        centerY,
        radius
      );
      termGrad.addColorStop(0, "rgba(2, 6, 23, 0.65)");
      termGrad.addColorStop(0.65, "rgba(2, 6, 23, 0.25)");
      termGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = termGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // 10. Specular Light Sheen Highlight
      const lightGrad = ctx.createRadialGradient(
        centerX - radius * 0.45,
        centerY - radius * 0.45,
        0,
        centerX - radius * 0.45,
        centerY - radius * 0.45,
        radius * 1.15
      );
      lightGrad.addColorStop(0, "rgba(255, 255, 255, 0.24)");
      lightGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
      lightGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore clip so 3D orbital arcs and pins render cleanly

      // 11. 3D Telemetry and Contagion Surveillance Arcs
      TELEMETRY_ARCS.forEach((arc, arcIdx) => {
        const [fromLat, fromLng] = arc.from;
        const [toLat, toLng] = arc.to;
        const steps = 28;
        const arcPts = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const lat = fromLat + (toLat - fromLat) * t;
          const lng = fromLng + (toLng - fromLng) * t;
          const altRatio = Math.sin(t * Math.PI) * 0.18;
          arcPts.push(project(lat, lng, altRatio));
        }

        const visiblePts = arcPts.filter((p) => p.z > -0.05);
        if (visiblePts.length > 4) {
          // Curved Geodesic Arc Path
          ctx.beginPath();
          let started = false;
          arcPts.forEach((p) => {
            if (p.z > -0.05) {
              if (!started) {
                ctx.moveTo(p.screenX, p.screenY);
                started = true;
              } else {
                ctx.lineTo(p.screenX, p.screenY);
              }
            } else {
              started = false;
            }
          });
          ctx.save();
          ctx.setLineDash([4 * dpr, 4 * dpr]);
          ctx.strokeStyle = arc.color + "aa";
          ctx.lineWidth = 1.6 * dpr;
          ctx.shadowColor = arc.color;
          ctx.shadowBlur = 4 * dpr;
          ctx.stroke();
          ctx.restore();

          // Traveling Photon Comet
          const progress = ((Date.now() * 0.00035) + arcIdx * 0.25) % 1;
          const interpLat = fromLat + (toLat - fromLat) * progress;
          const interpLng = fromLng + (toLng - fromLng) * progress;
          const interpAlt = Math.sin(progress * Math.PI) * 0.18;
          const cometPt = project(interpLat, interpLng, interpAlt);

          if (cometPt.z > -0.05) {
            ctx.beginPath();
            ctx.arc(cometPt.screenX, cometPt.screenY, 3.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = arc.color;
            ctx.shadowBlur = 8 * dpr;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Destination Health Node Pin
          const destPt = project(toLat, toLng, 0);
          if (destPt.z > 0.05) {
            ctx.beginPath();
            ctx.arc(destPt.screenX, destPt.screenY, 3.2 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = arc.color;
            ctx.fill();

            ctx.font = `600 ${8 * dpr}px 'Plus Jakarta Sans', sans-serif`;
            ctx.fillStyle = "rgba(226, 232, 240, 0.9)";
            ctx.shadowColor = "rgba(0,0,0,0.9)";
            ctx.shadowBlur = 3 * dpr;
            ctx.fillText(arc.label, destPt.screenX + 6 * dpr, destPt.screenY + 3 * dpr);
            ctx.shadowBlur = 0;
          }
        }
      });

      // 12. Monitored Community Surveillance Hotspots in 3D
      VILLAGES.forEach((v) => {
        const pt = project(v.lat, v.lng, 0);
        if (pt.z > 0) {
          // Radar pulse ring for active high/moderate zones
          if (v.riskLevel === "High" || v.riskLevel === "Moderate") {
            const pulseRadius = (16 + Math.sin(Date.now() * 0.005) * 8) * dpr;
            ctx.beginPath();
            ctx.arc(pt.screenX, pt.screenY, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = v.pulseColor;
            ctx.fill();
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 1.5 * dpr;
            ctx.stroke();
          }

          // Pin marker core
          ctx.beginPath();
          ctx.arc(pt.screenX, pt.screenY, 5 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = v.color;
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2 * dpr;
          ctx.stroke();

          // 3D Tag Label with Translucent Backdrop
          ctx.font = `bold ${8.5 * dpr}px 'Plus Jakarta Sans', sans-serif`;
          const textW = ctx.measureText(v.name).width;
          const lx = pt.screenX + 8 * dpr;
          const ly = pt.screenY - 7 * dpr;

          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
          ctx.lineWidth = 0.8 * dpr;
          ctx.beginPath();
          ctx.rect(lx - 4 * dpr, ly - 9 * dpr, textW + 8 * dpr, 13 * dpr);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.fillText(v.name, lx, ly);
        }
      });

      // 13. Epicenter Laser Beacon Pillar into Orbit (Dindigul)
      const epiGround = project(10.5124, 77.7265, 0);
      const epiSky = project(10.5124, 77.7265, 0.28);

      if (epiGround.z > 0.05) {
        // Laser Beam
        const beamGrad = ctx.createLinearGradient(
          epiGround.screenX,
          epiGround.screenY,
          epiSky.screenX,
          epiSky.screenY
        );
        beamGrad.addColorStop(0, "rgba(239, 68, 68, 0.9)");
        beamGrad.addColorStop(0.5, "rgba(244, 63, 94, 0.45)");
        beamGrad.addColorStop(1, "rgba(244, 63, 94, 0)");

        ctx.beginPath();
        ctx.moveTo(epiGround.screenX, epiGround.screenY);
        ctx.lineTo(epiSky.screenX, epiSky.screenY);
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 2.5 * dpr;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 8 * dpr;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Multi-ring radar ripple
        const tPulse = (Date.now() * 0.003) % 1;
        for (let r = 0; r < 3; r++) {
          const ringProgress = (tPulse + r / 3) % 1;
          const ringR = (8 + ringProgress * 24) * dpr;
          const alpha = (1 - ringProgress) * 0.7;
          ctx.beginPath();
          ctx.arc(epiGround.screenX, epiGround.screenY, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        }

        // Epicenter Badge Label
        ctx.font = `bold ${9 * dpr}px 'Plus Jakarta Sans', sans-serif`;
        const labelText = "⚠️ Epicenter: Dindigul";
        const textWidth = ctx.measureText(labelText).width;
        const bx = epiGround.screenX + 12 * dpr;
        const by = epiGround.screenY - 18 * dpr;

        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.rect(bx - 4 * dpr, by - 10 * dpr, textWidth + 8 * dpr, 14 * dpr);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fecaca";
        ctx.fillText(labelText, bx, by);
      }

      // 14. Orbiting Health Surveillance Satellite
      const satAngle = Date.now() * 0.0006;
      const satLat = Math.sin(satAngle * 1.5) * 50;
      const satLng = (((satAngle * 180) / Math.PI) % 360) - 180;
      const satAlt = 0.22;
      const satPt = project(satLat, satLng, satAlt);
      const groundPt = project(satLat, satLng, 0);

      if (satPt.z > -0.05) {
        // Scanning radar cone to ground
        if (groundPt.z > -0.05) {
          ctx.beginPath();
          ctx.moveTo(satPt.screenX, satPt.screenY);
          ctx.lineTo(groundPt.screenX - 12 * dpr, groundPt.screenY);
          ctx.lineTo(groundPt.screenX + 12 * dpr, groundPt.screenY);
          ctx.closePath();
          const coneGrad = ctx.createLinearGradient(
            satPt.screenX,
            satPt.screenY,
            groundPt.screenX,
            groundPt.screenY
          );
          coneGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
          coneGrad.addColorStop(1, "rgba(56, 189, 248, 0.03)");
          ctx.fillStyle = coneGrad;
          ctx.fill();
        }

        // Satellite Central Core
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 6 * dpr;
        ctx.beginPath();
        ctx.rect(satPt.screenX - 3.5 * dpr, satPt.screenY - 3.5 * dpr, 7 * dpr, 7 * dpr);
        ctx.fill();

        // Solar Panel Wings
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(satPt.screenX - 10 * dpr, satPt.screenY - 2.5 * dpr, 6 * dpr, 5 * dpr);
        ctx.fillRect(satPt.screenX + 4 * dpr, satPt.screenY - 2.5 * dpr, 6 * dpr, 5 * dpr);

        // Satellite Label
        ctx.font = `600 ${7.5 * dpr}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = "#7dd3fc";
        ctx.shadowBlur = 2 * dpr;
        ctx.fillText("🛰️ SAT-HEURISTIC-1", satPt.screenX + 10 * dpr, satPt.screenY - 4 * dpr);
        ctx.shadowBlur = 0;
      }

      globeAnimRef.current = requestAnimationFrame(renderGlobe);
    };

    renderGlobe();

    return () => {
      isRunning = false;
      if (globeAnimRef.current) cancelAnimationFrame(globeAnimRef.current);
    };
  }, [viewMode, globeSpinning]);

  // Mouse drag handlers for 3D Globe
  const handleGlobeMouseDown = (e) => {
    globeDragRef.current.isDragging = true;
    globeDragRef.current.lastX = e.clientX;
    globeDragRef.current.lastY = e.clientY;
  };

  const handleGlobeMouseMove = (e) => {
    if (!globeDragRef.current.isDragging) return;
    const dx = e.clientX - globeDragRef.current.lastX;
    const dy = e.clientY - globeDragRef.current.lastY;

    globeRotationRef.current.yaw -= dx * 0.006;
    globeRotationRef.current.pitch = Math.max(
      -1.2,
      Math.min(1.2, globeRotationRef.current.pitch - dy * 0.006)
    );

    globeDragRef.current.lastX = e.clientX;
    globeDragRef.current.lastY = e.clientY;
  };

  const handleGlobeMouseUp = () => {
    globeDragRef.current.isDragging = false;
  };

  const handleGlobeWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    globeScaleRef.current = Math.max(0.65, Math.min(2.2, globeScaleRef.current * zoomFactor));
  };

  const focusOnTamilNadu = () => {
    globeRotationRef.current.yaw = -77.7 * (Math.PI / 180) - Math.PI / 2;
    globeRotationRef.current.pitch = 10.5 * (Math.PI / 180);
    globeScaleRef.current = 1.25;
  };

  // Directional Pan Controls
  const handlePan = (dx, dy) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panBy([dx, dy], { animate: true, duration: 0.3 });
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([10.505, 77.760], 12, { animate: true });
    }
  };

  return (
    <div className="dashboard-card" style={{ padding: "20px", position: "relative" }}>
      {/* Card Header & Title */}
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.2rem", color: "#1d68d8" }}>📍</span>
          <div>
            <div className="card-title">Disease Risk Map</div>
            <div className="card-subtitle">
              Real-time risk analysis based on health, environmental and community data
            </div>
          </div>
        </div>

        {/* View Mode Switcher: 4 Map Layer Controls */}
        <div className="map-mode-bar">
          <button
            type="button"
            className={`map-mode-btn ${viewMode === "street" ? "active" : ""}`}
            onClick={() => setViewMode("street")}
            title="Interactive Clinical Street Map (Esri)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            Street
          </button>
          <button
            type="button"
            className={`map-mode-btn ${viewMode === "osm" ? "active" : ""}`}
            onClick={() => setViewMode("osm")}
            title="OpenStreetMap Cartographic Data"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            OSM
          </button>
          <button
            type="button"
            className={`map-mode-btn ${viewMode === "satellite" ? "active" : ""}`}
            onClick={() => setViewMode("satellite")}
            title="High-Resolution Satellite Imagery"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
              <path d="M13 7 9 3 5 7l4 4" />
              <path d="m17 11 4 4-4 4-4-4" />
              <path d="m8 12 4 4 6-6-4-4Z" />
              <path d="m16 8 3-3" />
              <path d="M9 21a6 6 0 0 0-6-6" />
            </svg>
            Satellite
          </button>
          <button
            type="button"
            className={`map-mode-btn ${viewMode === "globe" ? "active" : ""}`}
            onClick={() => setViewMode("globe")}
            title="Interactive 3D Earth Globe Projection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            3D Globe
          </button>
        </div>
      </div>

      {/* Main Map or 3D Globe Viewport */}
      <div className="map-container" style={{ height: isFullscreen ? "660px" : "500px" }}>
        {/* On-Map Directional Navigation D-pad */}
        {viewMode !== "globe" && (
          <div className="map-dpad-controls" title="Map Navigation Arrows">
            <button
              type="button"
              className="map-dpad-btn"
              onClick={() => handlePan(0, -180)}
              title="Pan Up"
            >
              ▲
            </button>
            <div className="map-dpad-row">
              <button
                type="button"
                className="map-dpad-btn"
                onClick={() => handlePan(-180, 0)}
                title="Pan Left"
              >
                ◀
              </button>
              <button
                type="button"
                className="map-dpad-btn"
                onClick={handleRecenter}
                title="Recenter Map"
                style={{ fontSize: "0.75rem" }}
              >
                🎯
              </button>
              <button
                type="button"
                className="map-dpad-btn"
                onClick={() => handlePan(180, 0)}
                title="Pan Right"
              >
                ▶
              </button>
            </div>
            <button
              type="button"
              className="map-dpad-btn"
              onClick={() => handlePan(0, 180)}
              title="Pan Down"
            >
              ▼
            </button>
          </div>
        )}

        {/* Leaflet 2D Real Map Container */}
        <div
          ref={mapContainerRef}
          style={{
            width: "100%",
            height: "100%",
            display: viewMode === "globe" ? "none" : "block"
          }}
        />

        {/* 3D Earth Globe Viewport */}
        {viewMode === "globe" && (
          <div className="globe-viewport-container">
            <canvas
              ref={globeCanvasRef}
              className="globe-canvas"
              style={{ width: "100%", height: "100%" }}
              onMouseDown={handleGlobeMouseDown}
              onMouseMove={handleGlobeMouseMove}
              onMouseUp={handleGlobeMouseUp}
              onMouseLeave={handleGlobeMouseUp}
              onWheel={handleGlobeWheel}
            />

            {/* 3D Globe HUD & Controls */}
            <div className="globe-hud-overlay">
              <span>🌍 3D Spherical Coordinate Space</span>
              <button
                type="button"
                className="globe-hud-btn"
                onClick={focusOnTamilNadu}
                title="Rotate directly to monitored communities"
              >
                🎯 Focus Hotspot
              </button>
              <button
                type="button"
                className="globe-hud-btn"
                onClick={() => setGlobeSpinning(!globeSpinning)}
              >
                {globeSpinning ? "⏸ Pause Spin" : "▶ Auto Spin"}
              </button>
              <button
                type="button"
                className="globe-hud-btn"
                onClick={() => {
                  globeScaleRef.current = Math.min(2.2, globeScaleRef.current * 1.15);
                }}
              >
                + Zoom
              </button>
              <button
                type="button"
                className="globe-hud-btn"
                onClick={() => {
                  globeScaleRef.current = Math.max(0.65, globeScaleRef.current * 0.85);
                }}
              >
                - Zoom
              </button>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot dot-red"></span>
            <span>High Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-orange"></span>
            <span>Moderate Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-green"></span>
            <span>Low Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-gray"></span>
            <span>Normal</span>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          className="map-full-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Expanded View"
        >
          <span>{isFullscreen ? "↙" : "↗"}</span>
          <span>{isFullscreen ? "Collapse Map" : "View Full Map"}</span>
        </button>
      </div>

      {/* Selected Community Quick Telemetry */}
      {selectedVillage && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 16px",
            background: "#f8fafc",
            border: `1px solid ${selectedVillage.color}`,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
              📍 {selectedVillage.name} ({selectedVillage.risk})
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
              {selectedVillage.desc} • Turbidity: <strong>{selectedVillage.turbidity}</strong>
            </div>
          </div>
          <button
            onClick={() => setSelectedVillage(null)}
            style={{
              background: "transparent",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ✕ Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
