import { get } from "@vercel/blob";
import { publishedCatalog, seedCatalog } from "./published-catalog";

export async function readCatalog(storage = { get }) {
  try {
    const state = await storage.get("monitor/state.json", { access: "private", useCache: false });
    return state ? publishedCatalog(await new Response(state.stream).json()) : seedCatalog;
  } catch {
    console.error("Aircraft catalogue unavailable; serving bundled programme records");
    return seedCatalog;
  }
}
