import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import type { Targets } from "../lib/types";
import {
  ACTIVITY_OPTIONS,
  computePlan,
  type ActivityLevel,
  type Sex,
} from "../lib/nutrition";

export function GoalCalculator({ onApplied }: { onApplied?: (t: Targets) => void }) {
  const store = useStore();
  const { profile, weights } = store.data;
  const lastWeight = weights.length ? weights[weights.length - 1].weight : 0;

  const [sex, setSex] = useState<Sex>(profile.sex ?? "female");
  const [age, setAge] = useState(profile.age ? String(profile.age) : "");
  const [height, setHeight] = useState(profile.heightCm ? String(profile.heightCm) : "");
  const [current, setCurrent] = useState(
    lastWeight ? String(lastWeight) : profile.startWeight ? String(profile.startWeight) : "",
  );
  const [goal, setGoal] = useState(profile.goalWeight ? String(profile.goalWeight) : "");
  const [activity, setActivity] = useState<ActivityLevel>(profile.activity ?? "moderate");
  const [weeks, setWeeks] = useState("12");

  const ageN = parseFloat(age) || 0;
  const heightN = parseFloat(height) || 0;
  const currentN = parseFloat(current) || 0;
  const goalN = parseFloat(goal) || 0;
  const weeksN = parseFloat(weeks) || 0;

  const valid = ageN > 0 && heightN > 0 && currentN > 0 && goalN > 0 && weeksN > 0;

  const plan = useMemo(() => {
    if (!valid) return null;
    return computePlan({
      sex,
      age: ageN,
      heightCm: heightN,
      currentWeight: currentN,
      goalWeight: goalN,
      activity,
      weeks: weeksN,
    });
  }, [valid, sex, ageN, heightN, currentN, goalN, activity, weeksN]);

  const apply = () => {
    if (!plan) return;
    store.setTargets(plan.macros);
    store.setProfile({
      ...profile,
      sex,
      age: ageN,
      heightCm: heightN,
      activity,
      startWeight: profile.startWeight || currentN,
      goalWeight: goalN,
    });
    onApplied?.(plan.macros);
  };

  const goalLabel =
    plan?.goal === "perder"
      ? "Perder peso"
      : plan?.goal === "ganar"
        ? "Ganar peso"
        : "Mantenimiento";

  return (
    <div className="card">
      <h2>🎯 Calcular objetivos</h2>
      <p className="muted" style={{ marginTop: 0, fontSize: "0.85rem" }}>
        Estima tus calorías y macros a partir de tu objetivo de peso y plazo.
      </p>

      <div className="field">
        <label>Sexo</label>
        <div className="segmented">
          <button className={sex === "female" ? "active" : ""} onClick={() => setSex("female")}>
            Mujer
          </button>
          <button className={sex === "male" ? "active" : ""} onClick={() => setSex("male")}>
            Hombre
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>Edad (años)</label>
          <input className="input" type="number" inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="field">
          <label>Altura (cm)</label>
          <input className="input" type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div className="field">
          <label>Peso actual (kg)</label>
          <input className="input" type="number" inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="field">
          <label>Peso objetivo (kg)</label>
          <input className="input" type="number" inputMode="decimal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Nivel de actividad</label>
        <select className="select" value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
          {ACTIVITY_OPTIONS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label} — {a.hint}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Plazo (semanas)</label>
        <input className="input" type="number" inputMode="decimal" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
      </div>

      {!plan ? (
        <div className="empty">Completa los datos para ver tu plan.</div>
      ) : (
        <>
          <div className="card" style={{ background: "var(--bg)", boxShadow: "none", marginBottom: 12 }}>
            <div className="row-between" style={{ marginBottom: 10 }}>
              <span className="pill">{goalLabel}</span>
              <span className="muted" style={{ fontSize: "0.8rem" }}>
                {plan.dailyDelta === 0
                  ? "mantenimiento"
                  : `${plan.dailyDelta > 0 ? "+" : ""}${plan.dailyDelta} kcal/día vs. gasto`}
              </span>
            </div>

            <div className="row-between" style={{ marginBottom: 14 }}>
              <div className="stat">
                <div className="stat-value">{plan.targetCalories}</div>
                <div className="stat-label">kcal / día</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: "var(--protein)" }}>{plan.macros.protein}g</div>
                <div className="stat-label">Proteína</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: "var(--carbs)" }}>{plan.macros.carbs}g</div>
                <div className="stat-label">Carbos</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: "var(--fat)" }}>{plan.macros.fat}g</div>
                <div className="stat-label">Grasas</div>
              </div>
            </div>

            <div className="row-between" style={{ fontSize: "0.8rem" }} >
              <span className="muted">Metabolismo basal: <strong>{plan.bmr}</strong> kcal</span>
              <span className="muted">Gasto diario: <strong>{plan.tdee}</strong> kcal</span>
            </div>
            {plan.goal !== "mantener" && (
              <div className="muted" style={{ fontSize: "0.8rem", marginTop: 6 }}>
                Ritmo: <strong>{Math.abs(plan.weeklyRateKg)} kg/semana</strong> ·{" "}
                {plan.goal === "perder" ? "-" : "+"}
                {Math.abs(plan.totalChangeKg)} kg en {weeksN} semanas
              </div>
            )}
          </div>

          {plan.warnings.map((w, i) => (
            <p
              key={i}
              style={{
                fontSize: "0.82rem",
                background: "#fef3c7",
                color: "#92400e",
                padding: "8px 12px",
                borderRadius: 10,
                margin: "0 0 10px",
              }}
            >
              ⚠️ {w}
            </p>
          ))}

          <button className="btn" style={{ width: "100%" }} onClick={apply}>
            Aplicar como mis objetivos
          </button>
        </>
      )}
    </div>
  );
}
