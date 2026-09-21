"use client";
import { createContext, useContext, type ReactNode } from "react";
import { aircraft, appearances } from "@/lib/content";
import type { Catalog } from "@/lib/published-catalog";

const CatalogContext = createContext<Catalog>({ aircraft, appearances });
export const useCatalog = () => useContext(CatalogContext);
export function CatalogProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}
