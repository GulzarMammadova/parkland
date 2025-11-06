import React from "react";

export function LoadingOverlay() {
   const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  
  // Определяем "медленное" соединение
  const isSlowConnection = connection && ["slow-2g", "2g", "3g"].includes(connection.effectiveType);
    // Если соединение хорошее — не показываем overlay вообще
  if (!isSlowConnection) return null;
   <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(250,248,243,.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid #BDA776",
          borderTopColor: "transparent",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ marginTop: 20, color: "#3E4C3A", fontFamily: "Inter, sans-serif" }}>
        Loading... slow connection detected
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  return (
     <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "rgba(250,248,243,.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid #BDA776",
          borderTopColor: "transparent",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ marginTop: 20, color: "#3E4C3A", fontFamily: "Inter, sans-serif" }}>
        Loading... slow connection detected
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
