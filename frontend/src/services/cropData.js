// Curated crop reference data (nutrition + safe crop protection / management).
// Nutrition values reflect raw, edible portions per 100g (USDA FoodData Central
// reference values, rounded for display). Only the crops the AI model detects
// are included; anything else falls back to "unavailable".
//
// NOTE: Protection/management content is general, educational guidance. It is
// NOT chemical-application advice. Always follow local regulations and the
// product label, and consult an agronomist for specific field conditions.

export const CROP_DATA = {
  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    nutrition: {
      energy: '18 kcal',
      water: '94.5 g',
      protein: '0.9 g',
      carbs: '3.9 g',
      fiber: '1.2 g',
      sugars: '2.6 g',
      fat: '0.2 g',
      vitaminC: '14 mg',
      vitaminA: '42 µg',
      potassium: '237 mg',
      folate: '15 µg',
    },
    protection: [
      'Practice crop rotation and avoid planting tomatoes in the same bed for consecutive seasons.',
      'Remove and destroy infected plant debris at the end of the season.',
      'Space plants for good airflow and water at the base to keep foliage dry.',
      'Use certified disease-free seeds and seedlings from reputable sources.',
    ],
    management: [
      'Scout fields weekly and remove diseased leaves promptly.',
      'Choose resistant varieties suited to local conditions.',
      'Use drip irrigation and mulch to reduce soil splash onto leaves.',
      'Fertilize based on soil test results; avoid excess nitrogen late in the season.',
    ],
  },
  potato: {
    name: 'Potato',
    emoji: '🥔',
    nutrition: {
      energy: '77 kcal',
      water: '79 g',
      protein: '2 g',
      carbs: '17.5 g',
      fiber: '2.2 g',
      sugars: '0.8 g',
      fat: '0.1 g',
      vitaminC: '19.7 mg',
      potassium: '421 mg',
      vitaminB6: '0.3 mg',
    },
    protection: [
      'Use certified, disease-free seed potatoes.',
      'Rotate crops and avoid potato-family crops in the same field repeatedly.',
      'Hill soil around plants and maintain good drainage.',
      'Remove volunteer plants that can carry disease between seasons.',
    ],
    management: [
      'Store tubers in cool, dry, dark conditions to prevent rot and sprouting.',
      'Do not store damaged or diseased tubers with healthy ones.',
      'Keep foliage dry by irrigating at the soil line.',
      'Destroy infected foliage and tubers to reduce inoculum.',
    ],
  },
  apple: {
    name: 'Apple',
    emoji: '🍎',
    nutrition: {
      energy: '52 kcal',
      water: '85.6 g',
      protein: '0.3 g',
      carbs: '13.8 g',
      fiber: '2.4 g',
      sugars: '10.4 g',
      fat: '0.2 g',
      vitaminC: '4.6 mg',
      potassium: '107 mg',
    },
    protection: [
      'Remove fallen fruit and infected leaves to break the disease cycle.',
      'Prune to open the canopy and improve airflow and sunlight.',
      'Select disease-resistant apple varieties where available.',
      'Maintain good orchard sanitation and remove mummified fruit.',
    ],
    management: [
      'Monitor weather conditions and scout orchards regularly.',
      'Apply protective treatments during periods of high disease pressure per label guidance.',
      'Maintain a balanced nutrient program based on leaf and soil analysis.',
      'Harvest and store fruit carefully to minimize bruising and rot.',
    ],
  },
  corn: {
    name: 'Corn',
    emoji: '🌽',
    nutrition: {
      energy: '86 kcal',
      water: '76 g',
      protein: '3.3 g',
      carbs: '19 g',
      fiber: '2 g',
      sugars: '3.2 g',
      fat: '1.4 g',
      vitaminC: '6.8 mg',
      potassium: '270 mg',
      magnesium: '37 mg',
    },
    protection: [
      'Plant disease-resistant hybrid varieties.',
      'Practice crop rotation with non-cereal crops.',
      'Manage crop residue through tillage or removal to reduce overwintering fungi.',
      'Maintain balanced fertility to avoid stress.',
    ],
    management: [
      'Scout at key growth stages and report severe symptoms to an agronomist.',
      'Irrigate during dry periods to reduce stress-related susceptibility.',
      'Avoid handling plants when wet to prevent disease spread.',
      'Harvest at the correct maturity and dry grain properly before storage.',
    ],
  },
  grape: {
    name: 'Grape',
    emoji: '🍇',
    nutrition: {
      energy: '69 kcal',
      water: '81 g',
      protein: '0.7 g',
      carbs: '18.1 g',
      fiber: '0.9 g',
      sugars: '15.5 g',
      fat: '0.2 g',
      vitaminC: '3.2 mg',
      potassium: '191 mg',
      vitaminK: '14.6 µg',
    },
    protection: [
      'Prune vines to improve airflow and reduce canopy humidity.',
      'Remove infected leaves, shoots and clusters promptly.',
      'Keep the vine canopy open to light and air.',
      'Disinfect pruning tools between vines to limit disease spread.',
    ],
    management: [
      'Monitor weather and scout for early symptoms weekly.',
      'Apply treatments during critical development periods per label guidance.',
      'Balance watering to avoid water stress while keeping foliage dry.',
      'Manage weeds and maintain a healthy soil environment.',
    ],
  },
  citrus: {
    name: 'Citrus',
    emoji: '🍋',
    nutrition: {
      energy: '47 kcal',
      water: '88 g',
      protein: '1 g',
      carbs: '11.8 g',
      fiber: '2.4 g',
      sugars: '9.4 g',
      fat: '0.1 g',
      vitaminC: '53 mg',
      potassium: '157 mg',
      folate: '17 µg',
    },
    protection: [
      'Use certified pest- and disease-free nursery stock.',
      'Control psyllid populations, which transmit serious bacterial diseases.',
      'Remove and destroy infected trees to prevent spread.',
      'Maintain strict orchard hygiene and quarantine new plants.',
    ],
    management: [
      'Inspect trees frequently, especially new growth.',
      'Coordinate psyllid control with neighboring growers.',
      'Apply protective treatments per local pest advisories and label guidance.',
      'Report suspected high-risk diseases to agricultural authorities.',
    ],
  },
  strawberry: {
    name: 'Strawberry',
    emoji: '🍓',
    nutrition: {
      energy: '32 kcal',
      water: '91 g',
      protein: '0.7 g',
      carbs: '7.7 g',
      fiber: '2 g',
      sugars: '4.9 g',
      fat: '0.3 g',
      vitaminC: '58.8 mg',
      potassium: '153 mg',
      folate: '24 µg',
    },
    protection: [
      'Use certified, disease-free runner plants.',
      'Keep fruit off the soil with straw or plastic mulch.',
      'Rotate plantings and avoid reused beds prone to soil-borne disease.',
      'Ensure good airflow and avoid overhead irrigation late in the day.',
    ],
    management: [
      'Remove infected fruit and leaves regularly.',
      'Keep picking areas clean and tools disinfected.',
      'Replace beds with healthy stock as needed.',
      'Harvest in the morning when fruit is dry.',
    ],
  },
  'bell pepper': {
    name: 'Bell Pepper',
    emoji: '🫑',
    nutrition: {
      energy: '31 kcal',
      water: '92 g',
      protein: '1 g',
      carbs: '6 g',
      fiber: '2.1 g',
      sugars: '4.2 g',
      fat: '0.3 g',
      vitaminC: '80.4 mg',
      vitaminA: '157 µg',
      potassium: '175 mg',
    },
    protection: [
      'Use disease-free seeds and transplants.',
      'Rotate crops to reduce bacterial and fungal build-up in soil.',
      'Avoid working in the field when foliage is wet.',
      'Space plants well and stake them to improve airflow.',
    ],
    management: [
      'Scout for leaf spots and fruit lesions regularly.',
      'Remove and discard infected plants promptly.',
      'Disinfect tools and hands between plants.',
      'Water at the base and keep leaves dry.',
    ],
  },
}

const NUTRITION_KEYS = [
  { key: 'energy', label: 'Energy' },
  { key: 'water', label: 'Water' },
  { key: 'protein', label: 'Protein' },
  { key: 'carbs', label: 'Carbohydrates' },
  { key: 'fiber', label: 'Dietary Fiber' },
  { key: 'sugars', label: 'Sugars' },
  { key: 'fat', label: 'Total Fat' },
]

const MICRO_KEYS = [
  { key: 'vitaminA', label: 'Vitamin A' },
  { key: 'vitaminC', label: 'Vitamin C' },
  { key: 'vitaminB6', label: 'Vitamin B6' },
  { key: 'vitaminK', label: 'Vitamin K' },
  { key: 'folate', label: 'Folate' },
  { key: 'potassium', label: 'Potassium' },
  { key: 'magnesium', label: 'Magnesium' },
]

export function getCropInfo(plantName) {
  const key = (plantName || '').toLowerCase().trim()
  return CROP_DATA[key] || null
}

export { NUTRITION_KEYS, MICRO_KEYS }
