# 🚀 Real‑Time Air Quality Dashboard 🌍

Welcome to the **Real‑Time Air Quality Dashboard** project! This project is built to fetch and display live air quality data in a beautiful, interactive dashboard. Whether you're an environmental enthusiast or just curious about how DevOps best practices come together in a real-world project, this is for you—all running for free on Render! 🎉
🔗 **Live Demo:** [https://air-quality-dashboard.onrender.com/](https://air-quality-dashboard.onrender.com/)  

---

## ✨ Features  

- **Live Data Ingestion:**  
  The dashboard pulls real-time air quality data (AQI, pollutants, etc.) from public APIs like [OpenAQ](https://docs.openaq.org/).  
- **Flask Backend (API):**  
  A lightweight **Python/Flask** API that processes and serves air quality data at `/api/airquality`.  
- **Interactive React Frontend:**  
  A modern **React-based** dashboard displaying data with charts and visual elements.  
- **Free Hosting on Render:**  
  - **Backend:** Hosted as a Flask API on **Render**.  
  - **Frontend:** Hosted as a static site on **Render**.  

---

## 🛠️ Architecture Overview  

1. **Data Ingestion & Processing:**  
   - A Python script fetches air quality data from OpenAQ and prepares it for display.  
2. **Backend API:**  
   - A **Flask-based REST API** provides real-time data at `/api/airquality`.  
3. **Frontend UI:**  
   - A **React app** fetches data from the backend and visualizes it interactively.  
4. **Deployment:**  
   - Both the **Flask API** and **React app** are deployed on **Render's free tier**.  

---
