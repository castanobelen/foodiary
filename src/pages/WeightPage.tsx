import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../lib/store";
import { round, todayISO } from "../lib/utils";

type Range = 30 | 90 | 365 | 0;

export function WeightPage() {
  const store = useStore();
  const { weights, profile } = store.data;
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(todayISO());
  const [range, setRange] = useState<Range>(90);

  const sorted = useMemo(
    () => [...weights].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [weights],
  );

  const chartData = useMemo(() => {
    let list = sorted;
    if (range !== 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - range);
      const cutoffISO = cutoff.toISOString().slice(0, 10);
      list = sorted.filter((w) => w.date >= cutoffISO);
    }
    return list.map((w) => ({
      date: w.date,
      label: new Date(w.date + "T00:00:00").toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }),
      weight: w.weight,
    }));
  }, [sorted, range]);

  const current = sorted.length ? sorted[sorted.length - 1].weight : null;
  const first = sorted.length ? sorted[0].weight : null;
  const change = current !== null && first !== null ? round(current - first, 1) : null;
  const goal = profile.goalWeight || 0;
  const toGoal = current !== null && goal ? round(current - goal, 1) : null;

  return (
    <div>
      <h1 className="page-title">⚖️ Peso</h1>

      <div className="card">
        <h2>Registrar peso</h2>
        <div className="grid-2">
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Fecha</label>
            <input
              className="input"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Peso (kg)</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="p. ej. 72.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn"
          style={{ width: "100%", marginTop: 12 }}
          disabled={!weight || parseFloat(weight) <= 0}
          onClick={() => {
            store.setWeight(date, parseFloat(weight));
            setWeight("");
          }}
        >
          Guardar peso
        </button>
      </div>

      {current !== null && (
        <div className="card">
          <div className="row-between">
            <div className="stat">
              <div className="stat-value">{current} kg</div>
              <div className="stat-label">Actual</div>
            </div>
            <div className="stat">
              <div
                className="stat-value"
                style={{ color: change && change > 0 ? "var(--fat)" : "var(--green)" }}
              >
                {change !== null ? (change > 0 ? "+" : "") + change : "—"} kg
              </div>
              <div className="stat-label">Desde el inicio</div>
            </div>
            {goal > 0 && (
              <div className="stat">
                <div className="stat-value">{toGoal !== null ? Math.abs(toGoal) : "—"} kg</div>
                <div className="stat-label">
                  {toGoal !== null && toGoal > 0 ? "para el objetivo" : "objetivo ✓"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="row-between" style={{ marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Evolución</h2>
        </div>
        <div className="segmented">
          {([30, 90, 365, 0] as Range[]).map((r) => (
            <button
              key={r}
              className={range === r ? "active" : ""}
              onClick={() => setRange(r)}
            >
              {r === 0 ? "Todo" : r === 365 ? "1 año" : `${r} d`}
            </button>
          ))}
        </div>

        {chartData.length < 2 ? (
          <div className="empty">
            Registra al menos dos pesos para ver el gráfico de evolución.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip
                formatter={(v: number) => [`${v} kg`, "Peso"]}
                labelStyle={{ color: "var(--text)" }}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }}
              />
              {goal > 0 && (
                <ReferenceLine
                  y={goal}
                  stroke="var(--green)"
                  strokeDasharray="4 4"
                  label={{ value: `Meta ${goal}`, fontSize: 10, fill: "var(--green)", position: "insideTopRight" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--green)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--green)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="card">
          <h2>Historial</h2>
          {[...sorted].reverse().map((w) => (
            <div className="food-item" key={w.date}>
              <div className="food-main">
                <div className="food-name">{w.weight} kg</div>
                <div className="food-sub">
                  {new Date(w.date + "T00:00:00").toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <button
                className="btn-icon"
                aria-label="Eliminar"
                onClick={() => store.removeWeight(w.date)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
