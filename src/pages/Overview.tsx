import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Overview.css";
import Chart from "chart.js/auto";

const Overview: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const chartRefs = useRef<{ [key: string]: Chart } | null>(null);

  const [stats, setStats] = useState({
    totalVillages: 0,
    totalUrban: 0,
    totalPopulation: 0,
    totalArea: 0,
  });

  const [chartsData, setChartsData] = useState({
    columnChart: { labels: [], data: [], barColors: [], borderColors: [] },
    ageDistribution: { labels: [], data: [], colors: [] },
    genderRatios: { labels: [], data: [], colors: [] },
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!chartRefs.current) chartRefs.current = {};

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `{
              getTotalVillages
              getTotalUrban
              getTotalPopulation
              getTotalArea
              getAllVillages
              getAllVillagesPopulation
              getAgeDistribution
              getGenderRatios
              getAllLocations
            }`,
          }),
        });

        const result = await response.json();
        const data = result.data;

        setStats({
          totalVillages: data.getTotalVillages,
          totalUrban: data.getTotalUrban,
          totalPopulation: data.getTotalPopulation,
          totalArea: data.getTotalArea,
        });

        setChartsData({
          columnChart: {
            labels: data.getAllVillages,
            data: data.getAllVillagesPopulation,
            barColors: ["#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66", "#3c5b66"],
            borderColors: ["#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2", "#49b1b2"],
          },
          ageDistribution: {
            labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
            data: data.getAgeDistribution,
            colors: ["#a74c65", "#2f71a3", "#a58c4d", "#3c8489", "#684eaf"],
          },
          genderRatios: {
            labels: ["Male", "Female"],
            data: data.getGenderRatios,
            colors: ["#2f71a3", "#a74c65"],
          },
        });

        setLocations(data.getAllLocations);
      } catch (error) {
        console.error("Error fetching data from GraphQL", error);
      }
    };

    fetchData();

    if (!mapInstance.current) {
      const map = L.map(mapRef.current).setView([31.528315, 34.481299], 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstance.current = map;
    }

    setTimeout(() => {
      mapInstance.current?.invalidateSize();
    }, 200);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
      Object.values(chartRefs.current!).forEach((chart) => chart.destroy());
    };
  }, []);

  useEffect(() => {
    if (locations.length && mapInstance.current) {
      locations.forEach(([lat, lng]: [number, number], index: number) => {
        L.marker([lat, lng]).addTo(mapInstance.current!).bindPopup(chartsData.columnChart.labels[index]);
      });
    }

    if (chartRefs.current) {
      Object.values(chartRefs.current).forEach((chart) => chart.destroy());
    }

    const pieCtxLeft = document.getElementById("pieChartLeft") as HTMLCanvasElement | null;
    const pieCtxRight = document.getElementById("pieChartRight") as HTMLCanvasElement | null;
    const columnCtx = document.getElementById("colomnChart") as HTMLCanvasElement | null;

    if (pieCtxLeft) {
      chartRefs.current!["pieLeft"] = new Chart(pieCtxLeft.getContext("2d")!, {
        type: "pie",
        data: {
          labels: chartsData.ageDistribution.labels,
          datasets: [
            {
              backgroundColor: chartsData.ageDistribution.colors,
              data: chartsData.ageDistribution.data,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Age Distribution",
            },
          },
        },
      });
    }

    if (pieCtxRight) {
      chartRefs.current!["pieRight"] = new Chart(pieCtxRight.getContext("2d")!, {
        type: "pie",
        data: {
          labels: chartsData.genderRatios.labels,
          datasets: [
            {
              backgroundColor: chartsData.genderRatios.colors,
              data: chartsData.genderRatios.data,
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
      chartRefs.current!["column"] = new Chart(columnCtx.getContext("2d")!, {
        type: "bar",
        data: {
          labels: chartsData.columnChart.labels,
          datasets: [
            {
              label: "Population",
              backgroundColor: chartsData.columnChart.barColors,
              borderColor: chartsData.columnChart.borderColors,
              borderWidth: 1,
              data: chartsData.columnChart.data,
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
  }, [locations, chartsData]);

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
            <h4 className="stats-card-number">{stats.totalVillages}</h4>
          </div>
          <div className="stats-card">
            <h4 className="stats-card-text">Total Number of Urban Areas</h4>
            <h4 className="stats-card-number">{stats.totalUrban}</h4>
          </div>
          <div className="stats-card">
            <h4 className="stats-card-text">Total Population Size</h4>
            <h4 className="stats-card-number">{stats.totalPopulation}</h4>
          </div>
          <div className="stats-card stats-right-card">
            <h4 className="stats-card-text">Avarage Land Area</h4>
            <h4 className="stats-card-number">{stats.totalArea}</h4>
            <p className="stats-card-number sq-km">sq km</p>
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