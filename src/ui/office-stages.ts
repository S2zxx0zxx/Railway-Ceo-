export const officeStages=[
 {id:1,name:'Distressed office',subtitle:'Take control and restore operations',asset:'offices/stage-1.svg'},
 {id:2,name:'Restored office',subtitle:'Reinvest operating profits',asset:'offices/stage-2.svg'},
 {id:3,name:'Regional headquarters',subtitle:'Grow distribution and reputation',asset:'offices/stage-3.svg'},
 {id:4,name:'National headquarters',subtitle:'Scale an established company',asset:'offices/stage-4.svg'},
 {id:5,name:'Global headquarters',subtitle:'Build a debt-free enterprise',asset:'offices/stage-5.svg'}
] as const;
export function officeForStage(value:number){return officeStages.find(s=>s.id===value)??officeStages[0]}
