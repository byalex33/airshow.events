import { cache } from "react";
import { connection } from "next/server";
import { readCatalog } from "./catalog-storage";
import { seedCatalog } from "./published-catalog";

// Deduplicate layout, metadata and page reads within one request. Never prerender
// the catalogue: harvested programmes and newly discovered routes must appear live.
export const getCatalog = cache(async () => {
  await connection();
  return process.env.BLOB_READ_WRITE_TOKEN ? readCatalog() : seedCatalog;
});
