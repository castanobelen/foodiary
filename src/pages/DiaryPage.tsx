import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { MEALS, type MealType } from "../lib/types";
import { sumMacros, todayISO } from "../lib/utils";
import { CalorieRing } from "../components/CalorieRing";
import { MacroBar } from "../components/MacroBar";
import { DateNav } from "../components/DateNav";
import { AddFoodModal } from "../components/AddFoodModal";

export function DiaryPage() {
  const store = useStore();
  const [date, setDate] = useState(todayISO());
  const [adding, setAdding] = useState<MealType | null>(null);

  const entries = useMemo(() => store.entriesForDate(date), [store, date]);
  const totals = sumMacros(entries);
  const t = store.data.targets;

  return (
    <div>
      <DateNav date={date} onChange={setDate} />

      <div className="card">
        <div className="summary-ring">
          <CalorieRing consumed={Math.round(totals.calories)} target={t.calories} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <MacroBar label="Proteína" value={totals.protein} target={t.protein} color="var(--protein)" />
            <MacroBar label="Carbos" value={totals.carbs} target={t.carbs} color="var(--carbs)" />
            <MacroBar label="Grasas" value={totals.fat} target={t.fat} color="var(--fat)" />
          </div>
        </div>
        <div className="row-between" style={{ marginTop: 14, fontSize: "0.85rem" }}>
          <span className="muted">
            Consumidas <strong>{Math.round(totals.calories)}</strong> de {t.calories} kcal
          </span>
        </div>
      </div>

      {MEALS.map((meal) => {
        const mealEntries = entries.filter((e) => e.meal === meal.id);
        const mealCals = Math.round(sumMacros(mealEntries).calories);
        return (
          <div className="card" key={meal.id}>
            <div className="row-between">
              <h2 style={{ margin: 0 }}>
                {meal.icon} {meal.label}
              </h2>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                {mealCals} kcal
              </span>
            </div>

            {mealEntries.length === 0 ? (
              <div className="empty" style={{ padding: "12px 0" }}>
                Nada registrado
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                {mealEntries.map((e) => (
                  <div className="food-item" key={e.id}>
                    <div className="food-main">
                      <div className="food-name">{e.foodName}</div>
                      <div className="food-sub">
                        {e.grams} g · P {e.protein} · C {e.carbs} · G {e.fat}
                      </div>
                    </div>
                    <div className="row" style={{ gap: 4 }}>
                      <span style={{ fontWeight: 600 }}>{e.calories}</span>
                      <span className="muted" style={{ fontSize: "0.75rem" }}>
                        kcal
                      </span>
                      <button
                        className="btn-icon"
                        aria-label="Eliminar"
                        onClick={() => store.removeDiaryEntry(e.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn-ghost"
              style={{ width: "100%", marginTop: 12 }}
              onClick={() => setAdding(meal.id)}
            >
              + Añadir alimento
            </button>
          </div>
        );
      })}

      {adding && (
        <AddFoodModal date={date} initialMeal={adding} onClose={() => setAdding(null)} />
      )}
    </div>
  );
}
