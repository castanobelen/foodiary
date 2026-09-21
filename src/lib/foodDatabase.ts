import type { Food } from "./types";

// Base de datos de alimentos incluida (valores aproximados por 100 g).
// Muchos alimentos aparecen clasificados por cocción, porque los macros por
// 100 g cambian bastante entre crudo y cocido (el cocido pierde/gana agua).
// El usuario puede añadir los suyos, que se guardan aparte en localStorage.
export const FOOD_DATABASE: Food[] = [
  // ── Proteínas ──────────────────────────────────────────────
  { id: "db-pollo-crudo", name: "Pechuga de pollo", cooking: "crudo", calories: 120, protein: 22.5, carbs: 0, fat: 2.6 },
  { id: "db-pollo-plancha", name: "Pechuga de pollo", cooking: "plancha", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "db-pavo-crudo", name: "Pechuga de pavo", cooking: "crudo", calories: 105, protein: 24, carbs: 0, fat: 1 },
  { id: "db-pavo-plancha", name: "Pechuga de pavo", cooking: "plancha", calories: 135, protein: 29, carbs: 0, fat: 1 },
  { id: "db-ternera-crudo", name: "Ternera magra", cooking: "crudo", calories: 155, protein: 21, carbs: 0, fat: 7 },
  { id: "db-ternera-plancha", name: "Ternera magra", cooking: "plancha", calories: 205, protein: 28, carbs: 0, fat: 10 },
  { id: "db-cerdo-crudo", name: "Lomo de cerdo", cooking: "crudo", calories: 143, protein: 21, carbs: 0, fat: 6 },
  { id: "db-cerdo-plancha", name: "Lomo de cerdo", cooking: "plancha", calories: 195, protein: 27, carbs: 0, fat: 9 },
  { id: "db-salmon-crudo", name: "Salmón", cooking: "crudo", calories: 185, protein: 20, carbs: 0, fat: 12 },
  { id: "db-salmon-plancha", name: "Salmón", cooking: "plancha", calories: 230, protein: 25, carbs: 0, fat: 14 },
  { id: "db-salmon-horno", name: "Salmón", cooking: "horno", calories: 220, protein: 24, carbs: 0, fat: 13 },
  { id: "db-merluza-crudo", name: "Merluza", cooking: "crudo", calories: 72, protein: 16, carbs: 0, fat: 0.9 },
  { id: "db-merluza-plancha", name: "Merluza", cooking: "plancha", calories: 90, protein: 18, carbs: 0, fat: 2 },
  { id: "db-atun-lata", name: "Atún en lata (al natural)", cooking: "natural", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "db-gambas-crudo", name: "Gambas", cooking: "crudo", calories: 85, protein: 20, carbs: 0.2, fat: 0.3 },
  { id: "db-gambas-cocido", name: "Gambas", cooking: "cocido", calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { id: "db-huevo-crudo", name: "Huevo", cooking: "crudo", calories: 143, protein: 13, carbs: 1.1, fat: 9.5, gramsPerUnit: 55 },
  { id: "db-huevo-cocido", name: "Huevo cocido", cooking: "cocido", calories: 155, protein: 13, carbs: 1.1, fat: 11, gramsPerUnit: 55 },
  { id: "db-huevo-frito", name: "Huevo frito", cooking: "frito", calories: 196, protein: 14, carbs: 0.8, fat: 15, gramsPerUnit: 60 },
  { id: "db-clara", name: "Clara de huevo", cooking: "natural", calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },

  // ── Lácteos ────────────────────────────────────────────────
  { id: "db-leche-semi", name: "Leche semidesnatada", cooking: "natural", calories: 46, protein: 3.3, carbs: 4.8, fat: 1.6 },
  { id: "db-yogur-natural", name: "Yogur natural", cooking: "natural", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { id: "db-yogur-griego", name: "Yogur griego", cooking: "natural", calories: 97, protein: 9, carbs: 3.6, fat: 5 },
  { id: "db-queso-fresco", name: "Queso fresco batido 0%", cooking: "natural", calories: 47, protein: 8, carbs: 4, fat: 0.2 },
  { id: "db-queso-curado", name: "Queso curado", cooking: "natural", calories: 402, protein: 25, carbs: 1.4, fat: 33 },
  { id: "db-requeson", name: "Requesón / cottage", cooking: "natural", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },

  // ── Cereales y féculas ─────────────────────────────────────
  { id: "db-arroz-blanco-crudo", name: "Arroz blanco", cooking: "crudo", calories: 360, protein: 7, carbs: 79, fat: 0.6 },
  { id: "db-arroz-blanco-cocido", name: "Arroz blanco", cooking: "cocido", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: "db-arroz-integral-crudo", name: "Arroz integral", cooking: "crudo", calories: 362, protein: 7.5, carbs: 76, fat: 2.7 },
  { id: "db-arroz-integral-cocido", name: "Arroz integral", cooking: "cocido", calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { id: "db-pasta-cruda", name: "Pasta", cooking: "crudo", calories: 371, protein: 13, carbs: 75, fat: 1.5 },
  { id: "db-pasta-cocida", name: "Pasta", cooking: "cocido", calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { id: "db-avena", name: "Copos de avena (secos)", cooking: "natural", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { id: "db-pan-blanco", name: "Pan blanco", cooking: "horno", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { id: "db-pan-integral", name: "Pan integral", cooking: "horno", calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  { id: "db-patata-cruda", name: "Patata", cooking: "crudo", calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  { id: "db-patata-cocida", name: "Patata", cooking: "cocido", calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { id: "db-patata-horno", name: "Patata", cooking: "horno", calories: 93, protein: 2.5, carbs: 21, fat: 0.1 },
  { id: "db-patata-frita", name: "Patatas fritas", cooking: "frito", calories: 312, protein: 3.4, carbs: 41, fat: 15 },
  { id: "db-quinoa-cruda", name: "Quinoa", cooking: "crudo", calories: 368, protein: 14, carbs: 64, fat: 6 },
  { id: "db-quinoa-cocida", name: "Quinoa", cooking: "cocido", calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { id: "db-lentejas-crudas", name: "Lentejas", cooking: "crudo", calories: 352, protein: 25, carbs: 60, fat: 1 },
  { id: "db-lentejas-cocidas", name: "Lentejas", cooking: "cocido", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "db-garbanzos-crudos", name: "Garbanzos", cooking: "crudo", calories: 364, protein: 19, carbs: 61, fat: 6 },
  { id: "db-garbanzos-cocidos", name: "Garbanzos", cooking: "cocido", calories: 164, protein: 9, carbs: 27, fat: 2.6 },

  // ── Verduras ───────────────────────────────────────────────
  { id: "db-brocoli-crudo", name: "Brócoli", cooking: "crudo", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: "db-brocoli-vapor", name: "Brócoli", cooking: "vapor", calories: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  { id: "db-espinacas-crudas", name: "Espinacas", cooking: "crudo", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: "db-espinacas-cocidas", name: "Espinacas", cooking: "cocido", calories: 23, protein: 3, carbs: 3.8, fat: 0.4 },
  { id: "db-tomate", name: "Tomate", cooking: "crudo", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: "db-lechuga", name: "Lechuga", cooking: "crudo", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  { id: "db-zanahoria-cruda", name: "Zanahoria", cooking: "crudo", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { id: "db-zanahoria-cocida", name: "Zanahoria", cooking: "cocido", calories: 35, protein: 0.8, carbs: 8, fat: 0.2 },
  { id: "db-pimiento", name: "Pimiento", cooking: "crudo", calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  { id: "db-calabacin-crudo", name: "Calabacín", cooking: "crudo", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  { id: "db-calabacin-plancha", name: "Calabacín", cooking: "plancha", calories: 20, protein: 1.4, carbs: 3.5, fat: 0.4 },
  { id: "db-cebolla", name: "Cebolla", cooking: "crudo", calories: 40, protein: 1.1, carbs: 9, fat: 0.1 },

  // ── Frutas ─────────────────────────────────────────────────
  { id: "db-platano", name: "Plátano", cooking: "natural", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, gramsPerUnit: 120 },
  { id: "db-manzana", name: "Manzana", cooking: "natural", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, gramsPerUnit: 180 },
  { id: "db-naranja", name: "Naranja", cooking: "natural", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, gramsPerUnit: 130 },
  { id: "db-fresa", name: "Fresas", cooking: "natural", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { id: "db-arandanos", name: "Arándanos", cooking: "natural", calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { id: "db-aguacate", name: "Aguacate", cooking: "natural", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { id: "db-uvas", name: "Uvas", cooking: "natural", calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },

  // ── Grasas y frutos secos ──────────────────────────────────
  { id: "db-aceite-oliva", name: "Aceite de oliva", cooking: "natural", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { id: "db-almendras", name: "Almendras", cooking: "natural", calories: 579, protein: 21, carbs: 22, fat: 50 },
  { id: "db-nueces", name: "Nueces", cooking: "natural", calories: 654, protein: 15, carbs: 14, fat: 65 },
  { id: "db-cacahuete", name: "Crema de cacahuete", cooking: "natural", calories: 588, protein: 25, carbs: 20, fat: 50 },
  { id: "db-mantequilla", name: "Mantequilla", cooking: "natural", calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },

  // ── Otros habituales ───────────────────────────────────────
  { id: "db-chocolate-negro", name: "Chocolate negro 85%", cooking: "natural", calories: 599, protein: 8, carbs: 30, fat: 46 },
  { id: "db-miel", name: "Miel", cooking: "natural", calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  { id: "db-azucar", name: "Azúcar", cooking: "natural", calories: 387, protein: 0, carbs: 100, fat: 0 },
  { id: "db-proteina-whey", name: "Proteína whey (polvo)", cooking: "natural", calories: 400, protein: 80, carbs: 8, fat: 6 },
  { id: "db-cafe", name: "Café solo", cooking: "natural", calories: 2, protein: 0.1, carbs: 0, fat: 0 },
  { id: "db-cerveza", name: "Cerveza", cooking: "natural", calories: 43, protein: 0.5, carbs: 3.6, fat: 0 },
];
