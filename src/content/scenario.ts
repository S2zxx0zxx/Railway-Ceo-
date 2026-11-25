export const config={
 version:1, cash:300000, debt:1400000, arrears:180000, equipment:1000000,
 materials:['flour','sugar','oil','packaging'] as const,
 // Ingredient grams per packet; packaging in pieces. Simplified recipe fixture, not a food specification.
 bom:{flour:75,sugar:25,oil:15,packaging:1},
 // prices in paise per gram/piece
 prices:{flour:3,sugar:4,oil:12,packaging:70},
 leadMinutes:180, shelfMinutes:43200, finishedShelfMinutes:129600,
 repairCost:12000, repairMinutes:120, initialPrice:900, capacity:750,
 wagePerDay:800, dailyInterestBps:3, offlineCapMinutes:1440,
 audit:['Financial records','Machinery','Inventory','Employees','Buyers','Utilities and compliance'],
 machineNames:['Mixer','Former','Oven','Cooling conveyor','Wrapper','Quality station','Power supply','Water supply'],
 initialConditions:[62,48,22,71,35,75,65,80],
 difficulties:['Beginner','Realistic','Hardcore'] as const
} as const;
export type Material=typeof config.materials[number];
export type Difficulty=typeof config.difficulties[number];
