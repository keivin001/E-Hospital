import React from "react";

export default function AudioVisualizer({ isActive = true }) {
  return (
    <div className="audio-visualizer-bars" title={isActive ? "Microphone active" : "Microphone muted"}>
      <div className="audio-bar" style={{ animationPlayState: isActive ? "running" : "paused", height: isActive ? undefined : "4px", background: isActive ? "#10b981" : "#ef4444" }}></div>
      <div className="audio-bar" style={{ animationPlayState: isActive ? "running" : "paused", height: isActive ? undefined : "4px", background: isActive ? "#10b981" : "#ef4444" }}></div>
      <div className="audio-bar" style={{ animationPlayState: isActive ? "running" : "paused", height: isActive ? undefined : "4px", background: isActive ? "#10b981" : "#ef4444" }}></div>
      <div className="audio-bar" style={{ animationPlayState: isActive ? "running" : "paused", height: isActive ? undefined : "4px", background: isActive ? "#10b981" : "#ef4444" }}></div>
      <div className="audio-bar" style={{ animationPlayState: isActive ? "running" : "paused", height: isActive ? undefined : "4px", background: isActive ? "#10b981" : "#ef4444" }}></div>
    </div>
  );
}
