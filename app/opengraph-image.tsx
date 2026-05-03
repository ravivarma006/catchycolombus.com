import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Catch Columbus — Your City Guide for Columbus, Ohio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "linear-gradient(135deg, #0D0D0D 0%, #020C1B 50%, #0F4C5C 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* decorative gold ring */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 380,
            height: 380,
            borderRadius: 9999,
            border: "1px solid rgba(245,168,0,0.25)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: 9999,
            border: "1px solid rgba(245,168,0,0.18)",
            display: "flex",
          }}
        />

        {/* Top: tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 3, backgroundColor: "#F5A800" }} />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#F5A800",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Columbus, Ohio
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "white",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Catch
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#F5A800",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Columbus.
          </div>
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 900,
              lineHeight: 1.3,
              marginTop: 8,
            }}
          >
            Events, services, coupons & things to do — across Columbus and its
            suburbs.
          </div>
        </div>

        {/* Bottom: URL + suburbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, color: "white" }}>
            catchcolumbus.com
          </div>
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Dublin · Westerville · Hilliard · Gahanna · Powell
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
