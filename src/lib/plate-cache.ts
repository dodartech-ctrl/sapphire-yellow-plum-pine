import type { Plate } from "@/lib/store";

export type CachedIteration = {
  id: string;
  url: string;
  upload?: string;
  templateId: string;
  idea: string;
  seed?: number;
  summary?: string;
  fallback?: boolean;
  look?: string;
  light?: string;
  ratio?: string;
  gateScore?: number;
  gateStatus?: "verified" | "review" | "flagged";
  studio?: string;
  createdAt: number;
};

type CachedPlateBundle = {
  plate: Plate | null;
  history: string[];
  iterations: CachedIteration[];
  upload: string | null;
  savedAt: number;
};

const DB_NAME = "oriel-zukeviz-cache";
const STORE_NAME = "plates";
const CACHE_KEY = "active-studio-plates";

function openPlateDb(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) return Promise.resolve(null);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (db: IDBDatabase | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(db);
    };
    const timer = window.setTimeout(() => finish(null), 1500);
    try {
      const req = window.indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => finish(req.result);
      req.onerror = () => finish(null);
      req.onblocked = () => finish(null);
    } catch {
      finish(null);
    }
  });
}

export async function savePlateBundleToIdb(bundle: CachedPlateBundle): Promise<void> {
  const db = await openPlateDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(
        {
          plate: bundle.plate,
          history: bundle.history.slice(0, 12),
          iterations: bundle.iterations.slice(0, 12),
          upload: bundle.upload,
          savedAt: Date.now(),
        },
        CACHE_KEY,
      );
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadPlateBundleFromIdb(): Promise<CachedPlateBundle | null> {
  const db = await openPlateDb();
  if (!db) return null;
  return new Promise<CachedPlateBundle | null>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CACHE_KEY);
      req.onsuccess = () => {
        const val = req.result as CachedPlateBundle | undefined;
        resolve(val && typeof val === "object" ? val : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function isPersistableCompactUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== "string") return false;
  // Static assets, http(s) URLs, or compact data URLs under 90KB can safely live in localStorage
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) return true;
  if (url.startsWith("data:image/")) return url.length <= 90_000;
  return false;
}
