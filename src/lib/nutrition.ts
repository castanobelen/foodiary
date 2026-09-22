import type { Targets } from "./types";
import { round } from "./utils";

export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export const ACTIVITY_OPTIONS: {
  id: ActivityLevel;
  label: string;
  factor: number;
  hint: string;
}[] = [
  { id: "sedentary", label: "Sedentario", factor: 1.2, hint: "Poco o nada de ejercicio" },
  { id: "light", label: "Ligero", factor: 1.375, hint: "Ejercicio ligero 1-3 días/sem" },
  { id: "moderate", label: "Moderado", factor: 1.55, hint: "Ejercicio moderado 3-5 días/sem" },
  { id: "active", label: "Activo", factor: 1.725, hint: "Ejercicio intenso 6-7 días/sem" },
  { id: "very_active", label: "Muy activo", factor: 1.9, hint: "Trabajo físico o 2 sesiones/día" },
];

// 1 kg de grasa corporal ≈ 7700 kcal
const KCAL_PER_KG = 7700;

// Suelo de seguridad de calorías por sexo (no bajar de aquí)
const CALORIE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

export interface PlanInput {
  sex: Sex;
  age: number;
  heightCm: number;
  currentWeight: number;
  goalWeight: number;
  activity: ActivityLevel;
  weeks: number;
}

export interface PlanResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  dailyDelta: number; // + superávit / - déficit respecto al TDEE
  weeklyRateKg: number; // ritmo de cambio de peso (kg/semana)
  totalChangeKg: number;
  macros: Targets;
  goal: "perder" | "ganar" | "mantener";
  warnings: string[];
  clamped: boolean; // true si se aplicó el suelo de calorías
}

// Ecuación de Mifflin-St Jeor
export function mifflinBMR(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function activityFactor(level: ActivityLevel): number {
  return ACTIVITY_OPTIONS.find((a) => a.id === level)?.factor ?? 1.2;
}

export function computePlan(input: PlanInput): PlanResult {
  const { sex, age, heightCm, currentWeight, goalWeight, activity } = input;
  const weeks = Math.max(input.weeks, 1);

  const bmr = mifflinBMR(sex, currentWeight, heightCm, age);
  const tdee = bmr * activityFactor(activity);

  const totalChangeKg = round(goalWeight - currentWeight, 1);
  const weeklyRateKg = round(totalChangeKg / weeks, 2);
  const dailyDeltaRaw = (totalChangeKg * KCAL_PER_KG) / (weeks * 7);

  let targetCalories = Math.round(tdee + dailyDeltaRaw);
  const warnings: string[] = [];
  let clamped = false;

  // Suelo de seguridad
  const floor = CALORIE_FLOOR[sex];
  if (targetCalories < floor) {
    targetCalories = floor;
    clamped = true;
    warnings.push(
      `Para no comer por debajo de un mínimo saludable, se han fijado ${floor} kcal. El objetivo tardará algo más de lo indicado.`,
    );
  }

  const goal: PlanResult["goal"] =
    totalChangeKg < -0.1 ? "perder" : totalChangeKg > 0.1 ? "ganar" : "mantener";

  // Aviso de ritmo agresivo (> ~1% del peso corporal por semana)
  const weeklyPct = Math.abs(weeklyRateKg) / currentWeight;
  if (weeklyPct > 0.01 && goal !== "mantener") {
    warnings.push(
      `El ritmo de ${Math.abs(weeklyRateKg)} kg/semana es exigente. Un ritmo sostenible suele ser 0,25-0,75 kg/semana; considera ampliar el plazo.`,
    );
  }

  const dailyDelta = Math.round(targetCalories - tdee);
  const macros = computeMacros(targetCalories, currentWeight, goal);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    dailyDelta,
    weeklyRateKg,
    totalChangeKg,
    macros,
    goal,
    warnings,
    clamped,
  };
}

// Reparto de macros: proteína por peso corporal, grasa 25% de las kcal, resto carbos
export function computeMacros(
  calories: number,
  currentWeight: number,
  goal: PlanResult["goal"],
): Targets {
  // más proteína en déficit para preservar músculo
  const proteinPerKg = goal === "perder" ? 2.0 : 1.8;
  let protein = Math.round(currentWeight * proteinPerKg);

  const fat = Math.round((calories * 0.25) / 9);

  let proteinCal = protein * 4;
  const fatCal = fat * 9;
  let carbsCal = calories - proteinCal - fatCal;

  // si no quedan carbos suficientes, recorta la proteína
  if (carbsCal < 0) {
    proteinCal = Math.max(calories - fatCal, 0);
    protein = Math.round(proteinCal / 4);
    carbsCal = 0;
  }

  const carbs = Math.round(carbsCal / 4);
  return { calories, protein, carbs, fat };
}
