const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let domainPath = str1[1];

export const Persues_House_Score = 
   domainPath === "persues-house" ?
[
    {
    Question: "Number of Prior Treatment Placements",
    values : [0,1,1,1],
    addValues: true,
    multiselect: false
    },
   {
    Question: "Number of Prior RTF Placements",
    values : [0,1,1,1],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Number of Prior Foster Homes",
    values : [0,1,1,1],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Total Prior Unsuccessful Treatment Placements",
    values : [0,1,1,1],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Suicidality",
    values : [0,1,1,1,1],
    addValues: false,
    multiselect: true
   },
   {
    Question: "Number of Previous Inpatient Hospitalizations",
    values : [0,1,1,1],
    addValues: true,
    multiselect: false
   },
   {
    Question: "History of Abuse",
    values : [1,0],
    addValues: true,
    multiselect: false
   },
   {
    Question: "History of Neglect",
    values : [0,1,0],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Family Involvement",
    values : [0,1,1,1],
    addValues: true,
    multiselect: true
   },
   {
    Question: "Adopted",
    values : [1,0],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Deceased Cargegiver",
    values : [1,0],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Family Suicide History",
    values : [0,0,1,1,1], 
    addValues: false,
    multiselect: true
   },
   {
    Question: "Incarcerated Caregiver",
    values : [1,0,0],
    addValues: true,
    multiselect: false
   },
   {
    Question: "Additional Traumatic Experiences",
    values : [1,1,1,0], 
    addValues: true,
    multiselect: true
   }
   ]
   : []