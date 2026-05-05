import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API } from "../api";

export default function FocusMonitor() {
  const [label,setLabel]=useState("");
  const [score,setScore]=useState("");
  const [reason,setReason]=useState("");

  useEffect(()=>{
    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
      video.srcObject = stream;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    async function sendFrame(){
      const v = document.getElementById("video");
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      ctx.drawImage(v,0,0);

      const b64 = canvas.toDataURL("image/jpeg").split(",")[1];

      try{
        const res = await API.post("/predict",{ image_b64: b64 });
        setLabel(res.data.label);
        setScore(res.data.score);
        setReason(res.data.reason);
      }catch(err){
        console.log("Error sending frame");
      }
    }

    const interval = setInterval(sendFrame,1000);
    return ()=>clearInterval(interval);
  },[]);

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Focus Monitoring</h2>
        <video id="video" autoPlay muted className="cam-stream"></video>

        <div className="result-box">
          <p><b>Status:</b> {label}</p>
          <p><b>Score:</b> {score}</p>
          <p><b>Reason:</b> {reason}</p>
        </div>
      </div>
    </>
  );
}
