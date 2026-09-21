import { useEffect, useMemo, useRef, useState } from "react";
import type { CookingMethod, Food, MealType } from "../lib/types";
import { COOKING, cookingMeta, MEALS } from "../lib/types";
import { useStore } from "../lib/store";
import { searchBranded } from "../lib/openFoodFacts";
import { macrosForGrams, portionToPer100, round } from "../lib/utils";

interface Props {
  date: string;
  initialMeal: MealType;
  onClose: () => void;
}

export function AddFoodModal({ date, initialMeal, onClose }: Props) {
  const store = useStore();
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"local" | "online">("local");
  const [cookFilter, setCookFilter] = useState<CookingMethod | "all">("all");
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState("100");
  const [creating, setCreating] = useState(false);

  const [onlineResults, setOnlineResults] = useState<Food[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);

  const results = useMemo(
    () => store.searchFoods(query, cookFilter),
    [store, query, cookFilter],
  );

  // Búsqueda online (Open Food Facts) con debounce y cancelación
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (source !== "online") return;
    const q = query.trim();
    if (q.length < 2) {
      setOnlineResults([]);
      setOnlineError(null);
      setOnlineLoading(false);
      return;
    }
    setOnlineLoading(true);
    setOnlineError(null);
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    const t = setTimeout(() => {
      searchBranded(q, ctrl.signal)
        .then((r) => {
          setOnlineResults(r);
          setOnlineLoading(false);
        })
        .catch((err) => {
          if (ctrl.signal.aborted) return;
          setOnlineError(
            "No se pudo buscar online. Revisa tu conexión o usa la base de la app / crea el alimento.",
          );
          setOnlineLoading(false);
          void err;
        });
    }, 450);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [source, query]);

  if (creating) {
    return (
      <ModalShell title="Nuevo alimento" onClose={() => setCreating(false)}>
        <CreateFoodForm
          onCancel={() => setCreating(false)}
          onCreated={(food) => {
            setSelected(food);
            setGrams(String(food.gramsPerUnit ?? 100));
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
      <ModalShell title={selected.brand ? `${selected.name} · ${selected.brand}` : selected.name} onClose={onClose}>
        <div className="row-between" style={{ marginBottom: 12 }}>
          <button className="btn-ghost" onClick={() => setSelected(null)}>
            ‹ Cambiar alimento
          </button>
          {cookingMeta(selected.cooking) && (
            <span className="cook-badge">
              {cookingMeta(selected.cooking)!.icon} {cookingMeta(selected.cooking)!.label}
            </span>
          )}
        </div>

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

  const pickFood = (f: Food, imported = false) => {
    if (imported) store.importFood(f);
    setSelected(f);
    setGrams(String(f.gramsPerUnit ?? 100));
  };

  return (
    <ModalShell title="Añadir alimento" onClose={onClose}>
      <div className="segmented" style={{ marginBottom: 12 }}>
        <button className={source === "local" ? "active" : ""} onClick={() => setSource("local")}>
          📚 Base de la app
        </button>
        <button className={source === "online" ? "active" : ""} onClick={() => setSource("online")}>
          🌐 Marcas (online)
        </button>
      </div>

      <input
        className="input"
        placeholder={source === "online" ? "Buscar marca o producto… (ej. Leche Protein Serenísima)" : "Buscar alimento…"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {source === "local" ? (
        <>
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

          <button className="btn-ghost" style={{ width: "100%", margin: "4px 0 12px" }} onClick={() => setCreating(true)}>
            + Crear alimento propio
          </button>

          <div>
            {results.length === 0 && <div className="empty">Sin resultados. Prueba a crear el alimento.</div>}
            {results.map((f) => (
              <FoodResult key={f.id} food={f} onPick={() => pickFood(f)} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 12 }}>
          {onlineLoading && <div className="empty">Buscando en Open Food Facts…</div>}
          {onlineError && (
            <p style={{ fontSize: "0.85rem", background: "#fef3c7", color: "#92400e", padding: "10px 12px", borderRadius: 10 }}>
              ⚠️ {onlineError}
            </p>
          )}
          {!onlineLoading && !onlineError && query.trim().length < 2 && (
            <div className="empty">Escribe una marca o producto para buscar en la base abierta de Open Food Facts.</div>
          )}
          {!onlineLoading && !onlineError && query.trim().length >= 2 && onlineResults.length === 0 && (
            <div className="empty">Sin resultados online. Prueba otro término o crea el alimento.</div>
          )}
          {onlineResults.map((f) => (
            <FoodResult key={f.id} food={f} online onPick={() => pickFood(f, true)} />
          ))}
        </div>
      )}
    </ModalShell>
  );
}

function FoodResult({
  food,
  online,
  onPick,
}: {
  food: Food;
  online?: boolean;
  onPick: () => void;
}) {
  const cook = cookingMeta(food.cooking);
  return (
    <button
      className="food-item"
      style={{ width: "100%", background: "transparent", border: "none", textAlign: "left" }}
      onClick={onPick}
    >
      <div className="food-main">
        <div className="food-name">
          {food.name}{" "}
          {food.brand && <span className="pill">{food.brand}</span>}{" "}
          {cook && !online && (
            <span className="cook-badge">
              {cook.icon} {cook.label}
            </span>
          )}{" "}
          {online && <span className="cook-badge">🌐 online</span>}
        </div>
        <div className="food-sub">
          {round(food.calories)} kcal · P {food.protein} · C {food.carbs} · G {food.fat} (por 100 g)
        </div>
      </div>
      <span style={{ color: "var(--green)", fontSize: "1.3rem" }}>＋</span>
    </button>
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
  const [brand, setBrand] = useState("");
  const [portion, setPortion] = useState("100");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [cooking, setCooking] = useState<CookingMethod>("natural");

  const portionG = parseFloat(portion) || 0;
  const valid = name.trim() && calories !== "" && portionG > 0;

  return (
    <>
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
              brand: brand.trim() || undefined,
              cooking,
              calories: portionToPer100(parseFloat(calories) || 0, portionG),
              protein: portionToPer100(parseFloat(protein) || 0, portionG),
              carbs: portionToPer100(parseFloat(carbs) || 0, portionG),
              fat: portionToPer100(parseFloat(fat) || 0, portionG),
              gramsPerUnit: portionG,
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
