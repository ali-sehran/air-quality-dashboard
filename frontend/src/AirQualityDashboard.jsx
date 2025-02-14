import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

function AirQualityDashboard() {
  const [chartData, setChartData] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [unitsMapping, setUnitsMapping] = useState({});
  const [pointer, setPointer] = useState({ x: -100, y: -100 });

  const formatParameter = (param) => {
    const subscriptDigits = {
      "0": "₀",
      "1": "₁",
      "2": "₂",
      "3": "₃",
      "4": "₄",
      "5": "₅",
      "6": "₆",
      "7": "₇",
      "8": "₈",
      "9": "₉"
    };
    return param.replace(/\d/g, (digit) => subscriptDigits[digit] || digit);
  };

  useEffect(() => {
    fetch("https://air-quality-datastream.onrender.com/api/airquality") 
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapping = {};
          data.forEach((item) => {
            if (!mapping[item.parameter]) {
              mapping[item.parameter] = item.unit;
            }
          });
          setUnitsMapping(mapping);

          const distinctParameters = Array.from(new Set(data.map(item => item.parameter)));
          setParameters(distinctParameters);

          const aggregated = {};
          data.forEach(({ date, parameter, value }) => {
            const dateKey = date.split("T")[0];
            if (!aggregated[dateKey]) {
              aggregated[dateKey] = { date: dateKey };
            }
            aggregated[dateKey][parameter] = value;
          });
          const aggregatedArray = Object.values(aggregated).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setChartData(aggregatedArray);
        } else {
          console.error("No air quality data found.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#444",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff"
          }}
        >
          <p style={{ margin: 0 }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0 }}>
              {formatParameter(entry.dataKey)}: {entry.value}{" "}
              {unitsMapping[entry.dataKey] || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (e) => {
    setPointer({ x: e.clientX, y: e.clientY });
  };

  if (chartData.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#ccc",
          backgroundColor: "#2d2d2d",
          minHeight: "100vh"
        }}
      >
        Loading air quality data...
      </div>
    );
  }

  const COLORS = ["#FF5733", "#33FFCE", "#FF33F6", "#33A1FF", "#FFBD33", "#75FF33"];

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        padding: "20px",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#2d2d2d",
        minHeight: "100vh",
        color: "#ccc",
        overflow: "hidden"
      }}
    >
      {}
      <div
        style={{
          position: "fixed",
          top: pointer.y,
          left: pointer.x,
          transform: "translate(-50%, -50%)",
          width: "2000px",         
          height: "2000px",        
          background: "radial-gradient(circle, rgba(211,211,211,0.2) 0%, rgba(105,105,105,0) 100%)",
          borderRadius: "50%",
          pointerEvents: "none",
          transition: "top 0.2s ease-out, left 0.2s ease-out, opacity 0.5s",
          opacity: 0.8,
          zIndex: 1,
          filter: "blur(60px)"     
        }}
      ></div>

      <h1 style={{ color: "#fff", zIndex: 2, position: "relative" }}>🌍 Air Quality Trends</h1>
      <h2 style={{ color: "#bbb", marginBottom: "30px", zIndex: 2, position: "relative" }}>
        Location: Köln, Germany
      </h2>
      <ResponsiveContainer width="90%" height={500} style={{ zIndex: 2, position: "relative" }}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#ccc" }} />
          {parameters.map((parameter, index) => (
            <Line
              key={parameter}
              type="monotone"
              dataKey={parameter}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={4} 
              name={formatParameter(parameter)}
              dot={false}
              isAnimationActive={true}
              animationBegin={1500}    
              animationDuration={2500} 
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: "20px",
          color: "#aaa",
          zIndex: 3
        }}
      >
        Made by Ali Sehran
      </div>
    </div>
  );
}

export default AirQualityDashboard;
