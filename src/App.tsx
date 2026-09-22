import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { DiaryPage } from "./pages/DiaryPage";
import { WeightPage } from "./pages/WeightPage";
import { FoodsPage } from "./pages/FoodsPage";
import { SettingsPage } from "./pages/SettingsPage";

const TABS = [
  { to: "/diario", label: "Diario", icon: "📖" },
  { to: "/peso", label: "Peso", icon: "⚖️" },
  { to: "/alimentos", label: "Alimentos", icon: "🥑" },
  { to: "/ajustes", label: "Ajustes", icon: "⚙️" },
];

export default function App() {
  return (
    <>
      <main className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/diario" replace />} />
          <Route path="/diario" element={<DiaryPage />} />
          <Route path="/peso" element={<WeightPage />} />
          <Route path="/alimentos" element={<FoodsPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/diario" replace />} />
        </Routes>
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
