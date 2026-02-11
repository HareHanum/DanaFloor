import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "FLOOR D.a.N.A - ייעוץ והדרכות אירוח";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          backgroundImage:
            "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        }}
      >
        {/* Decorative accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#f69a62",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#f69a62",
              letterSpacing: "-2px",
            }}
          >
            FLOOR{" "}
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            D.a.N.A
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              color: "#ffffff",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            ייעוץ והדרכות אירוח למסעדות
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            שירות, מכירה ואירוח שעובדים באמת בשטח
          </span>
        </div>

        {/* Author */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
              direction: "rtl",
            }}
          >
            דנה שימרוני
          </span>
          <span
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: "#f69a62",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            floor-dana.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
