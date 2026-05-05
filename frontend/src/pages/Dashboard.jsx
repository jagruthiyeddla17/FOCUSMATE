import Navbar from "../components/Navbar";
import { Line } from "react-chartjs-2";
import { API } from "../api";
import { useEffect, useState } from "react";
import { CategoryScale, LinearScale, PointElement, LineElement, Chart } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function Dashboard() {
  const [data,setData]=useState(null);

  async function load(){
    const id = 1; // user id from token decode ideally
    const res = await API.get(`/summary/daily/${id}`);
    setData(res.data.daily);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Your Focus Timeline</h2>

        {!data ? <p>Loading…</p> : (
          <Line
            data={{
              labels: Object.keys(data),
              datasets: [{
                label: "Focus %",
                data: Object.values(data).map(x=>x.percentage),
                borderWidth: 3
              }]
            }}
          />
        )}
      </div>
    </>
  );
}
