import type { Food } from "./types";

// Búsqueda de productos de marca en Open Food Facts (base de datos abierta).
// Devuelve alimentos ya normalizados a valores por 100 g.
// Requiere conexión; si la red está restringida, lanza un error que la UI captura.

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_es?: string;
  brands?: string;
  nutriments?: Record<string, number | string | undefined>;
}

const num = (v: number | string | undefined): number => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && isFinite(n) ? n : 0;
};

function mapProduct(p: OffProduct): Food | null {
  const name = (p.product_name_es || p.product_name || "").trim();
  if (!name) return null;
  const nu = p.nutriments ?? {};

  let kcal = num(nu["energy-kcal_100g"]);
  if (!kcal) {
    // fallback desde kJ si no hay kcal
    const kj = num(nu["energy_100g"]) || num(nu["energy-kj_100g"]);
    if (kj) kcal = Math.round(kj / 4.184);
  }
  const protein = num(nu["proteins_100g"]);
  const carbs = num(nu["carbohydrates_100g"]);
  const fat = num(nu["fat_100g"]);

  // descartar productos sin datos nutricionales útiles
  if (!kcal && !protein && !carbs && !fat) return null;

  const brand = (p.brands || "").split(",")[0]?.trim() || undefined;

  return {
    id: "off-" + (p.code || Math.random().toString(36).slice(2)),
    name,
    brand,
    cooking: "natural",
    calories: Math.round(kcal),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    custom: true,
  };
}

export async function searchBranded(
  query: string,
  signal?: AbortSignal,
): Promise<Food[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    "https://world.openfoodfacts.org/cgi/search.pl?" +
    new URLSearchParams({
      search_terms: q,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "25",
      fields: "code,product_name,product_name_es,brands,nutriments",
    }).toString();

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("No se pudo conectar con Open Food Facts");
  const data = (await res.json()) as { products?: OffProduct[] };

  const seen = new Set<string>();
  const out: Food[] = [];
  for (const p of data.products ?? []) {
    const f = mapProduct(p);
    if (f && !seen.has(f.id)) {
      seen.add(f.id);
      out.push(f);
    }
  }
  return out;
}
