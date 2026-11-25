export const config={
 version:1, cash:300000, debt:1400000, arrears:180000, equipment:1000000,
 materials:['flour','sugar','oil','packaging'] as const,
 // Ingredient grams per packet; packaging in pieces. Simplified recipe fixture, not a food specification.
 bom:{flour:75,sugar:25,oil:15,packaging:1},
 // prices in paise per gram/piece
 prices:{flour:3,sugar:4,oil:12,packaging:70},
 leadMinutes:180, shelfMinutes:43200, finishedShelfMinutes:129600,
 suppliers:[
 {id:'standard',name:'United Industrial Supply',pricePercent:100,quality:90,leadMinutes:180,reliability:100},
 {id:'economy',name:'Economy Agro Supply',pricePercent:88,quality:76,leadMinutes:240,reliability:82},
 {id:'premium',name:'Prime Ingredient Supply',pricePercent:115,quality:98,leadMinutes:120,reliability:97}
 ] as const,
 rawCapacityPerItem:2000000,finishedCapacity:50000,
 repairCost:12000, repairMinutes:120, initialPrice:900, capacity:750,
 wagePerDay:800, dailyInterestBps:3, offlineCapMinutes:1440,
 finance:{depreciationDays:1825,taxPeriodDays:30,taxBps:2500,loanLimitRupees:1800000,loanMaxRupees:200000,loanMinReputation:20,loanTermDays:180},
 audit:['Financial records','Machinery','Inventory','Employees','Buyers','Utilities and compliance'],
 machineNames:['Mixer','Former','Oven','Cooling conveyor','Wrapper','Quality station','Power supply','Water supply'],
 initialConditions:[62,48,22,71,35,75,65,80],
 difficulties:['Beginner','Realistic','Hardcore'] as const
} as const;
export type Material=typeof config.materials[number];
export type Difficulty=typeof config.difficulties[number];

export type SupplierId=typeof config.suppliers[number]['id'];
