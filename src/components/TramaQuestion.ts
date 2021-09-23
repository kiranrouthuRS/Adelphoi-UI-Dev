const url = typeof window !== 'undefined' ? window.location.pathname : '';
  let str1 = url.split('/');
  let domainPath = str1[1];

export const Persues_House_Score = 
   domainPath === "perseus-house" ?
[
    {
    Question: "Number of Prior Treatment Placements",
    values : {"0": {id: 0},"1":{id:1},"2":{id: 1},"3":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
    },
   {
    Question: "Number of Prior RTF Placements",
    values : {"0": {id: 0},"1":{id:1},"2":{id: 1},"3":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Number of Prior Foster Homes",
    values : {"0": {id: 0},"1":{id:1},"2":{id: 1},"3":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Total Prior Unsuccessful Treatment Placements",
    values : {"0": {id: 0},"1":{id:1},"2":{id: 1},"3":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Suicidal Ideation/Attempt(s)",
    values : {"0": {id: 1},"1": {id: 0}},
    addValues: false,
    multiselect: false,
    related: ""
   },
   {
    Question: "Number of Previous Inpatient Hospitalizations",
    values : {"0": {id: 0},"1":{id:1},"2":{id: 1},"3":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "History of Abuse",
    values : {"0":{id:1},"1":{id: 0}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "History of Neglect",
    values : {"0":{id:0},"1":{id: 1},"2":{id: 0}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Family Involvement",
    values : {"0": {id: 1},"1":{id:1},"2":{id: 1},"3":{id: 0}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Adopted",
    values : {"0":{id: 1},"1":{id: 0}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Deceased Cargegiver",
    values : {"0":{id: 1},"1":{id: 0},"2":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Family Suicide History",
    values : {"0": {id: 1},"1":{id: 0}}, 
    addValues: false,
    multiselect: false,
    related: ""
   },
   {
    Question: "Incarcerated Caregiver",
    values : {"0":{id:1},"1":{id: 0},"2":{id: 1}},
    addValues: true,
    multiselect: false,
    related: ""
   },
   {
    Question: "Additional Traumatic Experiences",
    values : {"0": {id: 0},"1":{id: 0}}, 
    related: "Additional_Traumatic_Experiences_Defined", 
    addValues: false,
    multiselect: false
   },
   {
    Question: "Additional Traumatic Experiences Defined",
    values : {"0":{id: 1},"1":{id: 1},"2":{id: 1}}, 
    addValues: true,
    multiselect: true,
    related: ""
   }
   ]
   : []

   export const Persues_House_Score1 = 
   domainPath === "perseus-house" ?
            {
              "Number of Prior Treatment Placements": {
                              values  : [0,1,1,1],
                              addValues: true,
                              multiselect: false
                          },
              "Number of Prior RTF Placements": {
                              values : [0,1,1,1],
                              addValues: true,
                              multiselect: false
                          },
              "Number of Prior Foster Homes": {
                              values : [0,1,1,1],
                              addValues: true,
                              multiselect: false
                          },
              "Total Prior Unsuccessful Treatment Placements": {
                              values : [0,1,1,1],
                              addValues: true,
                              multiselect: false
                            },
              "Suicidality": {
                              values : [0,1,1,1,1],
                              addValues: false,
                              multiselect: true
                            },
              "Number of Previous Inpatient Hospitalizations": {
                              values : [0,1,1,1],
                              addValues: true,
                              multiselect: false
                            },
              "History of Abuse":{
                              values : [1,0],
                              addValues: true,
                              multiselect: false
                            },
              "History of Neglect": {
                              values : [0,1,0],
                              addValues: true,
                              multiselect: false
                            },
              "Family Involvement": {
                              values : [1,1,1,0],
                              addValues: true,
                              multiselect: false
                            },
              "Adopted": {
                              values : [1,0],
                              addValues: true,
                              multiselect: false
                            },
              "Deceased Cargegiver": {
                              values : [1,0,1],
                              addValues: true,
                              multiselect: false
                            },
              "Family Suicide History": {
                              values : [0,0,1,1,1], 
                              addValues: false,
                              multiselect: true
                            },
              "Incarcerated Caregiver": {
                              values : [1,0,1 ],
                              addValues: true,
                              multiselect: false
                            },
              "Additional Traumatic Experiences": {
                              values : [1,1,1,0], 
                              addValues: true,
                              multiselect: true
                            }
            }
   : []