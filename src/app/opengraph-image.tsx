import { ImageResponse } from "next/og";

export const alt = "ITD CREATIVE OFFICE — UI Design / Frontend Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OGP画像。next/og の既定フォントは和文を持たないので、ここは欧文だけで組む。
 * 色は globals.css のトークンと同じ値を使う（この1ファイルだけ CSS を参照できないため直値）。
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 80,
          paddingBottom: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 5,
              color: "#71717a",
            }}
          >
            PORTFOLIO
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              color: "#09090b",
              letterSpacing: -1,
            }}
          >
            ITD CREATIVE OFFICE
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#52525b" }}>
            UI Design / Frontend Development
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#71717a" }}>
            Design systems · Next.js · TypeScript · Growth
          </div>
          <div
            style={{
              display: "flex",
              height: 12,
              width: "100%",
              borderRadius: 999,
              background: "linear-gradient(135deg, #2563eb, #7c4dee)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
