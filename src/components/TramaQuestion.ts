const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let domainPath = str1[1];

export const Persues_House_Score = 
   domainPath === "persues-house" ?
[
  {
 Question: "Number of Prior Treatment Placements",
 values : [0,1,1,1],
 addValues: true
  },
   {
    Question: "Number of Prior RTF Placements",
    values : [0,1,1,1],
    addValues: true
   },
   {
    Question: "Number of Prior Foster Homes",
    values : [0,1,1,1],
    addValues: true
   },
   {
    Question: "Total Prior Unsuccessful Treatment Placements",
    values : [0,1,1,1],
    addValues: true
   },
   {
    Question: "Suicidality",
    values : [0,1,1,1,1],
    addValues: false
   },
   {
    Question: "Number of Previous Inpatient Hospitalizations",
    values : [0,1,1,1],
    addValues: true
   },
   {
    Question: "History of Abuse",
    values : [1,0],
    addValues: true
   },
   {
    Question: "History of Neglect",
    values : [1,0,0],
    addValues: true
   },
   {
    Question: "Family Involvement",
    values : [0,1,1,1],
    addValues: true
   },
   {
    Question: "Adopted",
    values : [1,0],
    addValues: true
   },
   {
    Question: "Deceased Cargegiver",
    values : [1,0],
    addValues: true
   },
   {
    Question: "Family Suicide History",
    values : [0,1,1,1,1],
    addValues: false
   },
   {
    Question: "Incarcerated Caregiver",
    values : [1,0,0],
    addValues: true
   },
   {
    Question: "Additional Traumatic Experiences",
    values : [0,0,0,1],
    addValues: true
   }
   ]
   : []