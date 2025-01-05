import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; 
import "./Overview.css";
import Chart from "chart.js/auto";

const Overview: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const chartRefs = useRef<{ [key: string]: Chart } | null>(null); // Track chart instances

   // colomn chart data 
   const columnChartData = {
    labels: ["Jabalia", "Beit Lahia", "Quds", "Shejaiya", "Hebron", "Nablus", "Ramallah", "Beit Jala"],
    data: [50000, 35000, 20000, 43000, 250000, 150000, 100000, 20000],
    barColors: ["#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66"],
    borderColors: ["#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2"]
  };

  // Left pchart data (Age Distribution)
  const ageDistributionData = {
    labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
    data: [55, 90, 44, 24, 15],
    colors: ["#a74c65", "#2f71a3", "#a58c4d", "#3c8489", "#684eaf"]
  };

  // right pchart data (Gender Ratios)
  const genderRatiosData = {
    labels: ["Male", "Female"],
    data: [55, 40],
    colors: ["#2f71a3", "#a74c65"]
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (!chartRefs.current) chartRefs.current = {};

    // Initialize the map only once ///////////////////////////////////////////////////////////////////////////////////////////////////////
    if (!mapInstance.current) {
      const map = L.map(mapRef.current).setView([31.528315, 34.481299], 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const locations = [
        { lat: 31.528205, lng: 34.483131, popup: "Jabalia" },
        { lat: 31.549669, lng: 34.502813, popup: "Beit Lahia" },
        { lat: 31.776209, lng: 35.235622, popup: "Quds" },
        { lat: 31.500430, lng: 34.478241, popup: "Shejaiya" },
        { lat: 31.529621, lng: 35.097351, popup: "Hebron" },
        { lat: 32.221120, lng: 35.260770, popup: "Nablus" },
        { lat: 31.904931, lng: 35.204428, popup: "Ramallah" },
        { lat: 31.716214, lng: 35.187664, popup: "Beit Jala" },
      ];

      locations.forEach(({ lat, lng, popup }) => {
        L.marker([lat, lng]).addTo(map).bindPopup(popup);
      });

      mapInstance.current = map;
    }

    // if map did not rendering fully
    setTimeout(() => {
      mapInstance.current?.invalidateSize();
    }, 200);

        const pieCtxLeft = document.getElementById("pieChartLeft") as HTMLCanvasElement | null;
        const pieCtxRight = document.getElementById("pieChartRight") as HTMLCanvasElement | null;
        const columnCtx = document.getElementById("colomnChart") as HTMLCanvasElement | null;
    
        Object.values(chartRefs.current).forEach((chart) => chart.destroy());
    
        if (pieCtxLeft) {
          chartRefs.current["pieLeft"] = new Chart(pieCtxLeft.getContext("2d")!, {
            type: "pie",
    data: {
      labels: ageDistributionData.labels,
      datasets: [{
        backgroundColor: ageDistributionData.colors,
        data: ageDistributionData.data,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true, 
      plugins: {
      title: {
        display: true,
        text: "Age Distribution"
      },
    },
    },
          });
        }
    
        if (pieCtxRight) {
          chartRefs.current["pieRight"] = new Chart(pieCtxRight.getContext("2d")!, {
            type: "pie",
            data: {
              labels: genderRatiosData.labels,
              datasets: [
                {
                  backgroundColor: genderRatiosData.colors,
                  data: genderRatiosData.data,
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Gender Ratios",
                },
              },
            },
          });
        }
        
    
        if (columnCtx) {
          chartRefs.current["column"] = new Chart(columnCtx.getContext("2d")!, {
            type: "bar",
            data: {
              labels: columnChartData.labels,
              datasets: [
                {
                  label: "Population",
                  backgroundColor: columnChartData.barColors,
                  borderColor: columnChartData.borderColors,
                  borderWidth: 1,
                  data: columnChartData.data,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
                title: {
                  display: false,
                },
              },
            },
          });
        }
        

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
      // Clean up charts on unmount
      Object.values(chartRefs.current!).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <main className="main">
      <header className="header">
        <h2 className="title">Overview</h2>
      </header>
      <div className="container">
        <section className="map">
          <div id="map" ref={mapRef} className="styled-map"></div>
        </section>
        <section className="stats">
        <div className="stats-card">
                <h4 className="stats-card-text">Total Number of Villages</h4>
                <h4 className="stats-card-text stats-card-number">8</h4>
            </div>

            <div className="stats-card">
                <h4 className="stats-card-text">Total Number of Urban Areas</h4>
                <h4 className="stats-card-text stats-card-number">3</h4>
            </div>

            <div className="stats-card">
                <h4 className="stats-card-text">Total Population Size</h4>
                <h4 className="stats-card-text stats-card-number">660000</h4>
            </div>

            <div className="stats-card stats-right-card">
                <h4 className="stats-card-text">Avarage Land Area</h4>
                <h4 className="stats-card-text stats-card-number">11.88</h4>
                <p className="stats-card-text stats-card-number sq-km">sq km</p>
            </div>
        </section>
        <section className="pchart">
          <div className="pie-container">
            <canvas id="pieChartLeft"></canvas>
          </div>
          <div className="pie-container">
            <canvas id="pieChartRight"></canvas>
          </div>
        </section>
        <section className="cchart">
          <div className="cchart-container">
            <canvas id="colomnChart"></canvas>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Overview;
