import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import type { CookingMethod, Food } from "../lib/types";
import { COOKING, cookingMeta } from "../lib/types";
import { portionToPer100, round } from "../lib/utils";

function CookBadge({ food }: { food: Food }) {
  const cook = cookingMeta(food.cooking);
  if (!cook) return null;
  return (
    <span className="cook-badge">
      {cook.icon} {cook.label}
    </span>
  );
}

export function FoodsPage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [cookFilter, setCookFilter] = useState<CookingMethod | "all">("all");
  const [creating, setCreating] = useState(false);

  const custom = store.data.foods;
  const results = useMemo(
    () => store.searchFoods(query, cookFilter),
    [store, query, cookFilter],
  );

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
                  <div className="food-name">
                    {f.name} {f.brand && <span className="pill">{f.brand}</span>} <CookBadge food={f} />
                  </div>
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
        <div className="chips">
          <button
            className={cookFilter === "all" ? "chip active" : "chip"}
            onClick={() => setCookFilter("all")}
          >
            Todos
          </button>
          {COOKING.map((c) => (
            <button
              key={c.id}
              className={cookFilter === c.id ? "chip active" : "chip"}
              onClick={() => setCookFilter(c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 4 }}>
          {results.length === 0 && <div className="empty">Sin resultados con ese filtro.</div>}
          {results.map((f) => (
            <div className="food-item" key={f.id}>
              <div className="food-main">
                <div className="food-name">
                  {f.name} {f.brand && <span className="pill">{f.brand}</span>} <CookBadge food={f} />{" "}
                  {f.custom && !f.brand && <span className="pill">Propio</span>}
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
  const [brand, setBrand] = useState("");
  const [portion, setPortion] = useState("100");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [cooking, setCooking] = useState<CookingMethod>("natural");

  const portionG = parseFloat(portion) || 0;
  const valid = name.trim() && calories !== "" && portionG > 0;

  const save = () => {
    const food: Omit<Food, "id" | "custom"> = {
      name: name.trim(),
      brand: brand.trim() || undefined,
      cooking,
      calories: portionToPer100(parseFloat(calories) || 0, portionG),
      protein: portionToPer100(parseFloat(protein) || 0, portionG),
      carbs: portionToPer100(parseFloat(carbs) || 0, portionG),
      fat: portionToPer100(parseFloat(fat) || 0, portionG),
      gramsPerUnit: portionG,
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
          Indica el <strong>tamaño de la porción</strong> y sus valores. La app los
          guarda por 100 g automáticamente.
        </p>
        <div className="field">
          <label>Nombre</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label>Marca (opcional)</label>
          <input className="input" placeholder="ej. La Serenísima" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div className="field">
          <label>Cocción</label>
          <select className="select" value={cooking} onChange={(e) => setCooking(e.target.value as CookingMethod)}>
            {COOKING.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Tamaño de la porción (g)</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min="1"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
          />
        </div>
        <p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 8px" }}>
          Valores para {portionG > 0 ? `${portionG} g` : "la porción"}:
        </p>
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
