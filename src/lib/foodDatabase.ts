import type { Food } from "./types";

// Base de datos de alimentos incluida (valores aproximados por 100 g).
// El usuario puede añadir los suyos, que se guardan aparte en localStorage.
export const FOOD_DATABASE: Food[] = [
  // Proteínas
  { id: "db-pollo", name: "Pechuga de pollo", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "db-pavo", name: "Pechuga de pavo", calories: 135, protein: 29, carbs: 0, fat: 1 },
  { id: "db-ternera", name: "Ternera magra", calories: 187, protein: 26, carbs: 0, fat: 9 },
  { id: "db-cerdo-lomo", name: "Lomo de cerdo", calories: 143, protein: 26, carbs: 0, fat: 4 },
  { id: "db-salmon", name: "Salmón", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "db-atun-lata", name: "Atún en lata (al natural)", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "db-merluza", name: "Merluza", calories: 90, protein: 18, carbs: 0, fat: 2 },
  { id: "db-huevo", name: "Huevo", calories: 155, protein: 13, carbs: 1.1, fat: 11, gramsPerUnit: 55 },
  { id: "db-clara", name: "Clara de huevo", calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { id: "db-gambas", name: "Gambas", calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },

  // Lácteos
  { id: "db-leche-semi", name: "Leche semidesnatada", calories: 46, protein: 3.3, carbs: 4.8, fat: 1.6 },
  { id: "db-yogur-natural", name: "Yogur natural", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { id: "db-yogur-griego", name: "Yogur griego", calories: 97, protein: 9, carbs: 3.6, fat: 5 },
  { id: "db-queso-fresco", name: "Queso fresco batido 0%", calories: 47, protein: 8, carbs: 4, fat: 0.2 },
  { id: "db-queso-curado", name: "Queso curado", calories: 402, protein: 25, carbs: 1.4, fat: 33 },
  { id: "db-requeson", name: "Requesón / cottage", calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },

  // Cereales y féculas
  { id: "db-arroz-blanco", name: "Arroz blanco (cocido)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: "db-arroz-integral", name: "Arroz integral (cocido)", calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { id: "db-pasta", name: "Pasta cocida", calories: 158, protein: 5.8, carbs: 31, fat: 0.9 },
  { id: "db-pan-blanco", name: "Pan blanco", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { id: "db-pan-integral", name: "Pan integral", calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  { id: "db-avena", name: "Copos de avena", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { id: "db-patata", name: "Patata cocida", calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { id: "db-quinoa", name: "Quinoa (cocida)", calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { id: "db-lentejas", name: "Lentejas (cocidas)", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: "db-garbanzos", name: "Garbanzos (cocidos)", calories: 164, protein: 9, carbs: 27, fat: 2.6 },

  // Verduras
  { id: "db-brocoli", name: "Brócoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: "db-espinacas", name: "Espinacas", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: "db-tomate", name: "Tomate", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: "db-lechuga", name: "Lechuga", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  { id: "db-zanahoria", name: "Zanahoria", calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { id: "db-pimiento", name: "Pimiento", calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  { id: "db-calabacin", name: "Calabacín", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
  { id: "db-cebolla", name: "Cebolla", calories: 40, protein: 1.1, carbs: 9, fat: 0.1 },

  // Frutas
  { id: "db-platano", name: "Plátano", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, gramsPerUnit: 120 },
  { id: "db-manzana", name: "Manzana", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, gramsPerUnit: 180 },
  { id: "db-naranja", name: "Naranja", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, gramsPerUnit: 130 },
  { id: "db-fresa", name: "Fresas", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { id: "db-arandanos", name: "Arándanos", calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { id: "db-aguacate", name: "Aguacate", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { id: "db-uvas", name: "Uvas", calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },

  // Grasas y frutos secos
  { id: "db-aceite-oliva", name: "Aceite de oliva", calories: 884, protein: 0, carbs: 0, fat: 100 },
  { id: "db-almendras", name: "Almendras", calories: 579, protein: 21, carbs: 22, fat: 50 },
  { id: "db-nueces", name: "Nueces", calories: 654, protein: 15, carbs: 14, fat: 65 },
  { id: "db-cacahuete", name: "Crema de cacahuete", calories: 588, protein: 25, carbs: 20, fat: 50 },
  { id: "db-mantequilla", name: "Mantequilla", calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },

  // Otros habituales
  { id: "db-chocolate-negro", name: "Chocolate negro 85%", calories: 599, protein: 8, carbs: 30, fat: 46 },
  { id: "db-miel", name: "Miel", calories: 304, protein: 0.3, carbs: 82, fat: 0 },
  { id: "db-azucar", name: "Azúcar", calories: 387, protein: 0, carbs: 100, fat: 0 },
  { id: "db-proteina-whey", name: "Proteína whey (polvo)", calories: 400, protein: 80, carbs: 8, fat: 6 },
  { id: "db-cafe", name: "Café solo", calories: 2, protein: 0.1, carbs: 0, fat: 0 },
  { id: "db-cerveza", name: "Cerveza", calories: 43, protein: 0.5, carbs: 3.6, fat: 0 },
];
