import { ImageResponse } from "next/og";

export const alt = "EGHT Studios — Premium Streetwear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#D97706",
          }}
        >
          EGHT Studios
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 140,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -6,
            }}
          >
            <span>PREMIUM</span>
            <span>STREETWEAR</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#A0A0A0",
              maxWidth: 900,
            }}
          >
            Structural integrity over decoration.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
