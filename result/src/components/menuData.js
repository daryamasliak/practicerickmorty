export const menu = [
  {
    title: "Characters",
    children: [
      {
        title: "Main crew",
        children: [
          {title:"...", action:"load-character", payload:1},
          {title:"...", action:"load-character", payload:2},
          {title:"...", action:"load-character", payload:3},
          {title:"...", action:"load-character", payload:4},
          {title:"...", action:"load-character", payload:5}
        ]
      },
      {
        title:"By status",
        children:[
            {title:"Alive", action:"filter-status", payload:"alive"},
            {title:"Dead", action:"filter-status", payload:"dead"},
            {title:"Unknown", action:"filter-status", payload:"unknown"}
        ]
      },
      {
        title:"By species",
        children:[
            {title:"Human", action:"filter-species", payload:"human"},
            {
                title:"Aliens and smth similar",
                children:[
                    {title:"Humanoid", action:"filter-species", payload:"humanoid"},
                    {title:"Alien", action:"filter-species", payload:"alien"},
                    {
                        title:"Subspecies",
                        children:[
                            {title:"Cronenbergs", action:"filter-species", payload:"cronenberg"},
                            {title:"Alien Parasites", action:"filter-species",payload:"mythological"},
                            {title:"Snakes", action:"filter-species", payload:"animal"}
                        ]
                    }
                ]
            },
            {title:"Robots and cyborgs", action:"filter-species", payload:"robot"},
            {title:"Poopybutthole species", action:"filter-species", payload:"poopybutthole"}
        ]
      },
      {
        title:"By gender",
        children:[
            {title:"Female", action:"filter-gender", payload:"female"},
            {title:"Male", action:"filter-gender", payload:"male"},
            {title:"Genderless", action:"filter-gender", payload:"genderless"},
            {title:"Unknown", action:"filter-gender", payload:"unknown"},
        ]
      }
    ]
  },


  {
    title:"Multiverse and locations",
    children:[
        {
            title:"Famous planets",
            children:[
                { title: "...", action: "load-location", payload: 1 },
                { title: "...", action: "load-location", payload: 5 },
                { title: "...", action: "load-location", payload: 7 },
                { title: "...", action: "load-location", payload: 11 }
            ]
        },
        {
            title:"Dimensions",
            children:[
                { title: "Dimension C-137", action: "filter-dimension", payload: "Dimension C-137" },
                { title: "Replacement Dimension", action: "filter-dimension", payload: "Replacement Dimension" },
                { title: "Dimension 35-C", action: "filter-dimension", payload: "Dimension 35-C" },
                { title: "Cronenberg Dimension", action: "filter-dimension", payload: "Cronenberg Dimension" }
            ]
        },
        {
            title:"Space stations",
            children:[
                { title: "Citadel of Ricks", action: "load-location", payload: 3 },
                { title: "Nuptia 4 Space Station", action: "load-location", payload: 13 }
            ]
        }
    ]
  },



  {
    title:"Episodes",
    children:[
        {
            title:"By seasons",
            children:[
                {
                    title:"Season 1",
                    children:[
                        { title: "All Season 1", action: "load-season", payload: "S01" },
                        { title: "Ep. 1", action: "load-episode", payload: 1 },
                        { title: "Ep. 2", action: "load-episode", payload: 2 },
                        { title: "Ep. 3", action: "load-episode", payload: 3 },
                        { title: "Ep. 4", action: "load-episode", payload: 4 },
                        { title: "Ep. 5", action: "load-episode", payload: 5 }
                    ]
                },
                {
                    title: "Season 2",
                    children: [
                    { title: "All Season 2", action: "load-season", payload: "S02" },
                    { title: "Ep. 1: A Rickle in Time", action: "load-episode", payload: 12 },
                    { title: "Ep. 2: Mortynight Run", action: "load-episode", payload: 13 },
                    { title: "Ep. 3: Auto Erotic Assimilation", action: "load-episode", payload: 14 },
                    { title: "Ep. 4: Total Rickall", action: "load-episode", payload: 15 },
                    { title: "Ep. 5: Get Schwifty", action: "load-episode", payload: 16 }
                    ]
                },
                {
                    title: "Season 3",
                    children: [
                    { title: "All Season 3", action: "load-season", payload: "S03" },
                    { title: "Ep. 1: The Rickshank Rickdemption", action: "load-episode", payload: 22 },
                    { title: "Ep. 2: Rickmancing the Stone", action: "load-episode", payload: 23 },
                    { title: "Ep. 3: Pickle Rick", action: "load-episode", payload: 24 },
                    { title: "Ep. 4: Vindicators 3", action: "load-episode", payload: 25 },
                    { title: "Ep. 5: The Whirly Dirly Conspiracy", action: "load-episode", payload: 26 }
                    ]
                },
                {
                    title:"All seasons",
                    action:"load-all-seasons",
                    payload:"all"
                }
            ]
        }
    ]
  }
]