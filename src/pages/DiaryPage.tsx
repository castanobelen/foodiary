import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { MEALS, type DiaryEntry, type MealType } from "../lib/types";
import { round, sumMacros, todayISO } from "../lib/utils";
import { CalorieRing } from "../components/CalorieRing";
import { MacroBar } from "../components/MacroBar";
import { DateNav } from "../components/DateNav";
import { AddFoodModal } from "../components/AddFoodModal";

export function DiaryPage() {
  const store = useStore();
  const [date, setDate] = useState(todayISO());
  const [adding, setAdding] = useState<MealType | null>(null);
  const [editing, setEditing] = useState<DiaryEntry | null>(null);

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
                    <div
                      className="food-main"
                      style={{ cursor: "pointer" }}
                      role="button"
                      tabIndex={0}
                      onClick={() => setEditing(e)}
                      onKeyDown={(ev) => ev.key === "Enter" && setEditing(e)}
                    >
                      <div className="food-name">{e.foodName}</div>
                      <div className="food-sub">
                        {e.grams} g · P {e.protein} · C {e.carbs} · G {e.fat}
                      </div>
                    </div>
                    <div className="row" style={{ gap: 2 }}>
                      <span style={{ fontWeight: 600 }}>{e.calories}</span>
                      <span className="muted" style={{ fontSize: "0.75rem" }}>
                        kcal
                      </span>
                      <button
                        className="btn-icon"
                        aria-label="Editar cantidad"
                        onClick={() => setEditing(e)}
                      >
                        ✏️
                      </button>
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

      {editing && (
        <EditEntryModal entry={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function EditEntryModal({ entry, onClose }: { entry: DiaryEntry; onClose: () => void }) {
  const store = useStore();
  const [grams, setGrams] = useState(String(entry.grams));

  const g = parseFloat(grams) || 0;
  const factor = entry.grams > 0 ? g / entry.grams : 0;
  const preview = {
    calories: Math.round(entry.calories * factor),
    protein: round(entry.protein * factor, 1),
    carbs: round(entry.carbs * factor, 1),
    fat: round(entry.fat * factor, 1),
  };

  const save = () => {
    store.updateDiaryEntry(entry.id, g);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(ev) => ev.stopPropagation()}>
        <div className="modal-header">
          <h3>{entry.foodName}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="field">
          <label>Cantidad (gramos)</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min="0"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            autoFocus
          />
          <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {[50, 100, 150, 200].map((q) => (
              <button key={q} className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setGrams(String(q))}>
                {q} g
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: "var(--bg)", boxShadow: "none" }}>
          <div className="row-between">
            <div className="stat">
              <div className="stat-value">{preview.calories}</div>
              <div className="stat-label">kcal</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--protein)" }}>{preview.protein}</div>
              <div className="stat-label">Proteína</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--carbs)" }}>{preview.carbs}</div>
              <div className="stat-label">Carbos</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--fat)" }}>{preview.fat}</div>
              <div className="stat-label">Grasas</div>
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 8 }}>
          <button
            className="btn-danger"
            style={{ flex: 1 }}
            onClick={() => {
              store.removeDiaryEntry(entry.id);
              onClose();
            }}
          >
            Eliminar
          </button>
          <button className="btn" style={{ flex: 1 }} disabled={g <= 0} onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
