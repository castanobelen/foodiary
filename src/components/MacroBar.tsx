interface Props {
  label: string;
  value: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, value, target, color, unit = "g" }: Props) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  return (
    <div style={{ flex: 1 }}>
      <div className="row-between" style={{ marginBottom: 4 }}>
        <span className="macro-chip">
          <span className="dot" style={{ background: color }} />
          {label}
        </span>
        <span style={{ fontSize: "0.8rem" }} className="muted">
          {Math.round(value)}/{Math.round(target)}
          {unit}
        </span>
      </div>
      <div className="progress">
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
