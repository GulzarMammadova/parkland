// src/components/LoadingOverlay.jsx
import React from "react";

export function LoadingOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #FAF8F3, #E8E3D0)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          minWidth: 320,
          maxWidth: 420,
          padding: "32px 32px 28px",
          borderRadius: 28,
          background:
            "radial-gradient(circle at top, #ffffff, #f4efe0 52%, #e2d6be)",
          boxShadow:
            "0 18px 45px rgba(0,0,0,.16), 0 0 0 1px rgba(255,255,255,.6)",
          textAlign: "center",
          fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
          color: "#3E4C3A",
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background:
              "conic-gradient(from 180deg, #7ED957, #0E9F49, #BDA776, #7ED957)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 12px 25px rgba(0,0,0,.18)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#F9F6EE",
              display: "grid",
              placeItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: "#0E9F49",
                fontSize: 20,
              }}
            >
              PL
            </span>
          </div>
        </div>

        <h2
          style={{
            margin: "0 0 4px",
            fontFamily: '"Playfair Display", serif',
            fontSize: 24,
            color: "#285533",
          }}
        >
          ParkLand
        </h2>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8B927C",
          }}
        >
          Landscape Design Studio
        </p>

        <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.5 }}>
          Loading… Preparing your ParkLand experience
        </p>

        <div
          style={{
            position: "relative",
            height: 6,
            borderRadius: 999,
            background: "rgba(189,167,118,.25)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "left center",
              animation: "pl-loader-bar 1.4s ease-in-out infinite",
              background:
                "linear-gradient(90deg, #7ED957, #0E9F49, #BDA776, #E8E3D0)",
            }}
          />
        </div>

        <style>{`
          @keyframes pl-loader-bar {
            0% { transform: scaleX(0.15) translateX(-10%); opacity: .6; }
            50% { transform: scaleX(0.9) translateX(5%); opacity: 1; }
            100% { transform: scaleX(0.2) translateX(110%); opacity: .7; }
          }
        `}</style>
      </div>
    </div>
  );
}
