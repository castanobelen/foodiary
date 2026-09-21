import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppData,
  CookingMethod,
  DiaryEntry,
  Food,
  MealType,
  Profile,
  Targets,
  WeightEntry,
} from "./types";
import { cookingMeta } from "./types";
import { FOOD_DATABASE } from "./foodDatabase";
import { defaultTargets, foodLabel, macrosForGrams, uid } from "./utils";

const STORAGE_KEY = "foodiary.data.v1";
const DATA_VERSION = 1;

// Normaliza texto para búsqueda: minúsculas y sin acentos
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    profile: { name: "", heightCm: 170, startWeight: 0, goalWeight: 0 },
    targets: defaultTargets(2000),
    foods: [],
    diary: [],
    weights: [],
  };
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...defaultData(), ...parsed, version: DATA_VERSION };
  } catch {
    return defaultData();
  }
}

interface Store {
  data: AppData;
  // alimentos (base + personalizados)
  allFoods: Food[];
  searchFoods: (q: string, cooking?: CookingMethod | "all") => Food[];
  addCustomFood: (food: Omit<Food, "id" | "custom">) => Food;
  importFood: (food: Food) => void; // guarda un producto externo (ej. online) con su id
  deleteCustomFood: (id: string) => void;
  // diario
  addDiaryEntry: (date: string, meal: MealType, food: Food, grams: number) => void;
  updateDiaryEntry: (id: string, grams: number) => void;
  removeDiaryEntry: (id: string) => void;
  entriesForDate: (date: string) => DiaryEntry[];
  // peso
  setWeight: (date: string, weight: number) => void;
  removeWeight: (date: string) => void;
  // ajustes
  setTargets: (t: Targets) => void;
  setProfile: (p: Profile) => void;
  // datos
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  resetAll: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // almacenamiento lleno o no disponible: se ignora en silencio
    }
  }, [data]);

  const store = useMemo<Store>(() => {
    const allFoods = [...data.foods, ...FOOD_DATABASE];

    return {
      data,
      allFoods,

      searchFoods(q: string, cooking: CookingMethod | "all" = "all") {
        const term = normalize(q);
        let list = allFoods;
        if (cooking !== "all") {
          list = list.filter((f) => f.cooking === cooking);
        }
        if (term) {
          list = list.filter((f) =>
            normalize(f.name + " " + (f.brand ?? "")).includes(term),
          );
        }
        return list.slice(0, 60);
      },

      addCustomFood(food) {
        const newFood: Food = { ...food, id: "user-" + uid(), custom: true };
        setData((d) => ({ ...d, foods: [newFood, ...d.foods] }));
        return newFood;
      },

      importFood(food) {
        setData((d) => {
          if (d.foods.some((f) => f.id === food.id)) return d;
          return { ...d, foods: [{ ...food, custom: true }, ...d.foods] };
        });
      },

      deleteCustomFood(id) {
        setData((d) => ({ ...d, foods: d.foods.filter((f) => f.id !== id) }));
      },

      addDiaryEntry(date, meal, food, grams) {
        const m = macrosForGrams(food, grams);
        const cook = cookingMeta(food.cooking);
        const label = foodLabel(food);
        const foodName =
          cook && food.cooking !== "natural"
            ? `${label} (${cook.label.toLowerCase()})`
            : label;
        const entry: DiaryEntry = {
          id: uid(),
          date,
          meal,
          foodId: food.id,
          foodName,
          grams,
          ...m,
        };
        setData((d) => ({ ...d, diary: [...d.diary, entry] }));
      },

      updateDiaryEntry(id, grams) {
        setData((d) => ({
          ...d,
          diary: d.diary.map((e) => {
            if (e.id !== id) return e;
            const food =
              allFoods.find((f) => f.id === e.foodId) ??
              ({
                calories: (e.calories / e.grams) * 100 || 0,
                protein: (e.protein / e.grams) * 100 || 0,
                carbs: (e.carbs / e.grams) * 100 || 0,
                fat: (e.fat / e.grams) * 100 || 0,
              } as Food);
            const m = macrosForGrams(food, grams);
            return { ...e, grams, ...m };
          }),
        }));
      },

      removeDiaryEntry(id) {
        setData((d) => ({ ...d, diary: d.diary.filter((e) => e.id !== id) }));
      },

      entriesForDate(date) {
        return data.diary.filter((e) => e.date === date);
      },

      setWeight(date, weight) {
        setData((d) => {
          const rest = d.weights.filter((w) => w.date !== date);
          const next: WeightEntry[] = [...rest, { date, weight }].sort((a, b) =>
            a.date < b.date ? -1 : 1,
          );
          return { ...d, weights: next };
        });
      },

      removeWeight(date) {
        setData((d) => ({ ...d, weights: d.weights.filter((w) => w.date !== date) }));
      },

      setTargets(t) {
        setData((d) => ({ ...d, targets: t }));
      },

      setProfile(p) {
        setData((d) => ({ ...d, profile: p }));
      },

      exportJSON() {
        return JSON.stringify(data, null, 2);
      },

      importJSON(json) {
        try {
          const parsed = JSON.parse(json) as AppData;
          if (!parsed || typeof parsed !== "object") return false;
          setData({ ...defaultData(), ...parsed, version: DATA_VERSION });
          return true;
        } catch {
          return false;
        }
      },

      resetAll() {
        setData(defaultData());
      },
    };
  }, [data]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}
