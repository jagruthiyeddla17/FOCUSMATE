import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 15000
});

// Attach token helper
export function setAuthToken(token){
  if(token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
}
