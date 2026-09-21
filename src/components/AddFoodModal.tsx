import { useMemo, useState } from "react";
import type { Food, MealType } from "../lib/types";
import { MEALS } from "../lib/types";
import { useStore } from "../lib/store";
import { macrosForGrams, round } from "../lib/utils";

interface Props {
  date: string;
  initialMeal: MealType;
  onClose: () => void;
}

export function AddFoodModal({ date, initialMeal, onClose }: Props) {
  const store = useStore();
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState("100");
  const [creating, setCreating] = useState(false);

  const results = useMemo(() => store.searchFoods(query), [store, query]);

  if (creating) {
    return (
      <ModalShell title="Nuevo alimento" onClose={() => setCreating(false)}>
        <CreateFoodForm
          onCancel={() => setCreating(false)}
          onCreated={(food) => {
            setSelected(food);
            setCreating(false);
          }}
        />
      </ModalShell>
    );
  }

  if (selected) {
    const g = parseFloat(grams) || 0;
    const m = macrosForGrams(selected, g);
    const perUnit = selected.gramsPerUnit;
    return (
      <ModalShell title={selected.name} onClose={onClose}>
        <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => setSelected(null)}>
          ‹ Cambiar alimento
        </button>

        <div className="field">
          <label>Comida</label>
          <div className="segmented">
            {MEALS.map((mm) => (
              <button
                key={mm.id}
                className={meal === mm.id ? "active" : ""}
                onClick={() => setMeal(mm.id)}
              >
                {mm.icon}
              </button>
            ))}
          </div>
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
            {perUnit && (
              <button className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setGrams(String(perUnit))}>
                1 ud ({perUnit} g)
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ background: "var(--bg)", boxShadow: "none" }}>
          <div className="row-between">
            <div className="stat">
              <div className="stat-value">{m.calories}</div>
              <div className="stat-label">kcal</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--protein)" }}>{m.protein}</div>
              <div className="stat-label">Proteína</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--carbs)" }}>{m.carbs}</div>
              <div className="stat-label">Carbos</div>
            </div>
            <div className="stat">
              <div className="stat-value" style={{ color: "var(--fat)" }}>{m.fat}</div>
              <div className="stat-label">Grasas</div>
            </div>
          </div>
        </div>

        <button
          className="btn"
          style={{ width: "100%", marginTop: 8 }}
          disabled={g <= 0}
          onClick={() => {
            store.addDiaryEntry(date, meal, selected, g);
            onClose();
          }}
        >
          Añadir al diario
        </button>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Añadir alimento" onClose={onClose}>
      <input
        className="input"
        placeholder="Buscar alimento…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button className="btn-ghost" style={{ width: "100%", margin: "12px 0" }} onClick={() => setCreating(true)}>
        + Crear alimento propio
      </button>

      <div>
        {results.length === 0 && <div className="empty">Sin resultados. Prueba a crear el alimento.</div>}
        {results.map((f) => (
          <button
            key={f.id}
            className="food-item"
            style={{ width: "100%", background: "transparent", border: "none", textAlign: "left" }}
            onClick={() => {
              setSelected(f);
              setGrams(String(f.gramsPerUnit ?? 100));
            }}
          >
            <div className="food-main">
              <div className="food-name">
                {f.name} {f.custom && <span className="pill">Propio</span>}
              </div>
              <div className="food-sub">
                {round(f.calories)} kcal · P {f.protein} · C {f.carbs} · G {f.fat} (por 100 g)
              </div>
            </div>
            <span style={{ color: "var(--green)", fontSize: "1.3rem" }}>＋</span>
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CreateFoodForm({
  onCreated,
  onCancel,
}: {
  onCreated: (f: Food) => void;
  onCancel: () => void;
}) {
  const store = useStore();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const valid = name.trim() && calories !== "";

  return (
    <>
      <p className="muted" style={{ marginTop: 0, fontSize: "0.85rem" }}>
        Introduce los valores <strong>por 100 g</strong> del alimento.
      </p>
      <div className="field">
        <label>Nombre</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div className="grid-2">
        <div className="field">
          <label>Calorías (kcal)</label>
          <input className="input" type="number" inputMode="decimal" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div className="field">
          <label>Proteína (g)</label>
          <input className="input" type="number" inputMode="decimal" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <div className="field">
          <label>Carbohidratos (g)</label>
          <input className="input" type="number" inputMode="decimal" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </div>
        <div className="field">
          <label>Grasas (g)</label>
          <input className="input" type="number" inputMode="decimal" value={fat} onChange={(e) => setFat(e.target.value)} />
        </div>
      </div>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="btn"
          style={{ flex: 1 }}
          disabled={!valid}
          onClick={() => {
            const food = store.addCustomFood({
              name: name.trim(),
              calories: parseFloat(calories) || 0,
              protein: parseFloat(protein) || 0,
              carbs: parseFloat(carbs) || 0,
              fat: parseFloat(fat) || 0,
            });
            onCreated(food);
          }}
        >
          Guardar y usar
        </button>
      </div>
    </>
  );
}
