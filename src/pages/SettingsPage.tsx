import { useRef, useState } from "react";
import { useStore } from "../lib/store";
import type { Targets } from "../lib/types";
import { defaultTargets, macroCalories, round } from "../lib/utils";
import { GoalCalculator } from "../components/GoalCalculator";

export function SettingsPage() {
  const store = useStore();
  const { targets, profile } = store.data;

  const [cal, setCal] = useState(String(targets.calories));
  const [prot, setProt] = useState(String(targets.protein));
  const [carb, setCarb] = useState(String(targets.carbs));
  const [fat, setFat] = useState(String(targets.fat));

  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(String(profile.heightCm || ""));
  const [goal, setGoal] = useState(String(profile.goalWeight || ""));

  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const macroKcal = macroCalories(
    parseFloat(prot) || 0,
    parseFloat(carb) || 0,
    parseFloat(fat) || 0,
  );
  const macroSum = Math.round(macroKcal.protein + macroKcal.carbs + macroKcal.fat);

  const saveTargets = () => {
    const t: Targets = {
      calories: parseFloat(cal) || 0,
      protein: parseFloat(prot) || 0,
      carbs: parseFloat(carb) || 0,
      fat: parseFloat(fat) || 0,
    };
    store.setTargets(t);
    flash("Objetivos guardados ✓");
  };

  const applyPreset = (calories: number) => {
    const t = defaultTargets(calories);
    setCal(String(t.calories));
    setProt(String(t.protein));
    setCarb(String(t.carbs));
    setFat(String(t.fat));
  };

  const saveProfile = () => {
    store.setProfile({
      name: name.trim(),
      heightCm: parseFloat(height) || 0,
      startWeight: profile.startWeight,
      goalWeight: parseFloat(goal) || 0,
    });
    flash("Perfil guardado ✓");
  };

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  const doExport = () => {
    const blob = new Blob([store.exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foodiary-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = store.importJSON(String(reader.result));
      flash(ok ? "Datos importados ✓" : "Archivo no válido ✗");
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="page-title">⚙️ Ajustes</h1>

      {msg && (
        <div className="card" style={{ background: "var(--green-soft)", color: "var(--green-dark)", fontWeight: 600 }}>
          {msg}
        </div>
      )}

      <GoalCalculator
        onApplied={(t) => {
          setCal(String(t.calories));
          setProt(String(t.protein));
          setCarb(String(t.carbs));
          setFat(String(t.fat));
          flash("Objetivos calculados y aplicados ✓");
        }}
      />

      <div className="card">
        <h2>Objetivos diarios</h2>
        <div className="field">
          <label>Calorías (kcal)</label>
          <input className="input" type="number" inputMode="decimal" value={cal} onChange={(e) => setCal(e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Proteína (g)</label>
            <input className="input" type="number" inputMode="decimal" value={prot} onChange={(e) => setProt(e.target.value)} />
          </div>
          <div className="field">
            <label>Carbohidratos (g)</label>
            <input className="input" type="number" inputMode="decimal" value={carb} onChange={(e) => setCarb(e.target.value)} />
          </div>
          <div className="field">
            <label>Grasas (g)</label>
            <input className="input" type="number" inputMode="decimal" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
          <div className="field">
            <label>Macros = kcal</label>
            <input
              className="input"
              value={`${macroSum} kcal`}
              readOnly
              style={{
                background: "var(--bg)",
                color:
                  Math.abs(macroSum - (parseFloat(cal) || 0)) > 60
                    ? "var(--fat)"
                    : "var(--green)",
              }}
            />
          </div>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", marginTop: 0 }}>
          Sugerencia rápida (reparto 40/30/30):
        </p>
        <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {[1600, 1800, 2000, 2200, 2500].map((c) => (
            <button key={c} className="btn-ghost" style={{ padding: "6px 12px" }} onClick={() => applyPreset(c)}>
              {c}
            </button>
          ))}
        </div>
        <button className="btn" style={{ width: "100%" }} onClick={saveTargets}>
          Guardar objetivos
        </button>
      </div>

      <div className="card">
        <h2>Perfil</h2>
        <div className="field">
          <label>Nombre</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label>Altura (cm)</label>
            <input className="input" type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="field">
            <label>Peso objetivo (kg)</label>
            <input className="input" type="number" inputMode="decimal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
        </div>
        {profile.heightCm > 0 && store.data.weights.length > 0 && (
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            IMC actual:{" "}
            <strong>
              {round(
                store.data.weights[store.data.weights.length - 1].weight /
                  Math.pow(profile.heightCm / 100, 2),
                1,
              )}
            </strong>
          </p>
        )}
        <button className="btn" style={{ width: "100%" }} onClick={saveProfile}>
          Guardar perfil
        </button>
      </div>

      <div className="card">
        <h2>Datos</h2>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: 0 }}>
          Todo se guarda solo en este navegador. Exporta una copia de seguridad
          o pásala a otro dispositivo.
        </p>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={doExport}>
            ⬇️ Exportar
          </button>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}>
            ⬆️ Importar
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) doImport(f);
            e.target.value = "";
          }}
        />
        <button
          className="btn-danger"
          style={{ width: "100%", marginTop: 12 }}
          onClick={() => {
            if (confirm("¿Borrar TODOS los datos? Esta acción no se puede deshacer.")) {
              store.resetAll();
              flash("Datos borrados");
            }
          }}
        >
          Borrar todos los datos
        </button>
      </div>

      <p className="muted" style={{ textAlign: "center", fontSize: "0.8rem" }}>
        FooDiary · datos 100% locales · sin cuentas ni servidores
      </p>
    </div>
  );
}
