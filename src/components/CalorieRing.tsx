interface Props {
  consumed: number;
  target: number;
}

export function CalorieRing({ consumed, target }: Props) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const remaining = Math.max(target - consumed, 0);
  const over = consumed > target;
  const color = over ? "var(--fat)" : "var(--green)";

  return (
    <div className="ring">
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--bg)"
          strokeWidth="12"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-value" style={{ color: over ? "var(--fat)" : undefined }}>
          {over ? "+" + (consumed - target) : remaining}
        </span>
        <span className="ring-label">{over ? "kcal de más" : "kcal restantes"}</span>
      </div>
    </div>
  );
}
