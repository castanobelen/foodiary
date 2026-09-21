import { addDays, formatDateLabel } from "../lib/utils";

interface Props {
  date: string;
  onChange: (date: string) => void;
}

export function DateNav({ date, onChange }: Props) {
  return (
    <div className="datenav">
      <button
        className="btn-icon"
        aria-label="Día anterior"
        onClick={() => onChange(addDays(date, -1))}
      >
        ‹
      </button>
      <label style={{ position: "relative", cursor: "pointer" }}>
        <strong>{formatDateLabel(date)}</strong>
        <input
          type="date"
          value={date}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            width: "100%",
            cursor: "pointer",
          }}
        />
      </label>
      <button
        className="btn-icon"
        aria-label="Día siguiente"
        onClick={() => onChange(addDays(date, 1))}
      >
        ›
      </button>
    </div>
  );
}
