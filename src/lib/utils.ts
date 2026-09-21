import type { DiaryEntry, Food, Targets } from "./types";

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const today = todayISO();
  if (iso === today) return "Hoy";
  if (iso === addDays(today, -1)) return "Ayer";
  if (iso === addDays(today, 1)) return "Mañana";
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function round(n: number, decimals = 0): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

// Calcula los macros de una cantidad en gramos a partir de un alimento (valores por 100 g)
export function macrosForGrams(food: Food, grams: number) {
  const factor = grams / 100;
  return {
    calories: round(food.calories * factor),
    protein: round(food.protein * factor, 1),
    carbs: round(food.carbs * factor, 1),
    fat: round(food.fat * factor, 1),
  };
}

export function sumMacros(entries: DiaryEntry[]) {
  return entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

// Kcal aportadas por cada macro (para el desglose visual)
export function macroCalories(protein: number, carbs: number, fat: number) {
  return {
    protein: protein * 4,
    carbs: carbs * 4,
    fat: fat * 9,
  };
}

// Objetivos de macros por defecto a partir de calorías (40/30/30 aprox.)
export function defaultTargets(calories = 2000): Targets {
  return {
    calories,
    protein: round((calories * 0.3) / 4),
    carbs: round((calories * 0.4) / 4),
    fat: round((calories * 0.3) / 9),
  };
}
