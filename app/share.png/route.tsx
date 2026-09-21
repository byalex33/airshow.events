import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const photo = await readFile(join(process.cwd(), "public/images/red-arrows.jpg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#fafafa", color: "#202020", padding: 48 }}>
      <div style={{ display: "flex", flexDirection: "column", width: 550, paddingRight: 32, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 25, fontWeight: 700 }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#0b1d2a" />
            <path d="m16 5 2 8 9 7v2l-9-3v6l3 2-5-1-5 1 3-2v-6l-9 3v-2l9-7z" fill="#ff7047" />
          </svg>
          Airshow Events
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 17, letterSpacing: 3, color: "#707070", marginBottom: 24 }}>UK AIRSHOWS / DISCOVER YOUR SEASON</div>
          <div style={{ fontSize: 80, lineHeight: 1.02, letterSpacing: -4, fontWeight: 700 }}>A good day</div>
          <div style={{ fontSize: 80, lineHeight: 1.02, letterSpacing: -4, fontWeight: 700 }}>to look up.</div>
          <div style={{ fontSize: 24, lineHeight: 1.4, color: "#606060", marginTop: 26 }}>Selected UK airshows with official sources. Coverage is growing.</div>
        </div>
        <div style={{ display: "flex", fontSize: 18, color: "#707070" }}>airshow.events / Check organisers for updates</div>
      </div>
      <div style={{ display: "flex", position: "relative", flex: 1, borderRadius: 18, overflow: "hidden", background: "#ccd8e4" }}>
        <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} alt="" width="554" height="534" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 22px 20px", color: "white", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", fontSize: 16 }}>RAF Red Arrows / William Warby</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
