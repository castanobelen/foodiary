import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import type { Food } from "../lib/types";
import { round } from "../lib/utils";

export function FoodsPage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const custom = store.data.foods;
  const results = useMemo(() => store.searchFoods(query), [store, query]);

  return (
    <div>
      <h1 className="page-title">🥑 Alimentos</h1>

      <div className="card">
        <div className="row-between">
          <h2 style={{ margin: 0 }}>Mis alimentos</h2>
          <button className="btn" style={{ padding: "8px 12px" }} onClick={() => setCreating(true)}>
            + Nuevo
          </button>
        </div>
        {custom.length === 0 ? (
          <div className="empty">
            Aún no has creado alimentos propios. Créalos para reutilizarlos en el diario.
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            {custom.map((f) => (
              <div className="food-item" key={f.id}>
                <div className="food-main">
                  <div className="food-name">{f.name}</div>
                  <div className="food-sub">
                    {round(f.calories)} kcal · P {f.protein} · C {f.carbs} · G {f.fat} (100 g)
                  </div>
                </div>
                <button
                  className="btn-icon"
                  aria-label="Eliminar"
                  onClick={() => store.deleteCustomFood(f.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Base de datos ({store.allFoods.length})</h2>
        <input
          className="input"
          placeholder="Buscar alimento…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          {results.map((f) => (
            <div className="food-item" key={f.id}>
              <div className="food-main">
                <div className="food-name">
                  {f.name} {f.custom && <span className="pill">Propio</span>}
                </div>
                <div className="food-sub">
                  {round(f.calories)} kcal · P {f.protein} · C {f.carbs} · G {f.fat} (100 g)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {creating && (
        <CreateFoodModal onClose={() => setCreating(false)} />
      )}
    </div>
  );
}

function CreateFoodModal({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const valid = name.trim() && calories !== "";

  const save = () => {
    const food: Omit<Food, "id" | "custom"> = {
      name: name.trim(),
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
    };
    store.addCustomFood(food);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nuevo alimento</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <p className="muted" style={{ marginTop: 0, fontSize: "0.85rem" }}>
          Valores <strong>por 100 g</strong>.
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
        <button className="btn" style={{ width: "100%" }} disabled={!valid} onClick={save}>
          Guardar alimento
        </button>
      </div>
    </div>
  );
}
