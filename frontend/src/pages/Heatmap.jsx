import Navbar from "../components/Navbar";
import { API } from "../api";
import { useEffect } from "react";
import h337 from "heatmap.js";

export default function Heatmap() {

  useEffect(()=>{
    async function load(){
      const id = 1;
      const res = await API.get(`/heatmap/${id}`);
      const points = res.data.points;

      const heatmap = h337.create({
        container: document.getElementById("heatArea"),
        radius: 40
      });

      const formatted = {
        max: 10,
        data: points.map(p=>({x:p.x, y:p.y, value:5}))
      };

      heatmap.setData(formatted);
    }
    load();
  },[]);

  return (
    <>
      <Navbar />
      <h2>Heatmap</h2>
      <div id="heatArea" className="heatmap-box"></div>
    </>
  );
}
