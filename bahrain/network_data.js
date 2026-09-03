/* ================================================================
   BAHRAIN POWER NETWORK — DATASET (V1 backbone)
   "v" established public fact · "ns" needs source check.
   ================================================================ */

const SECTORS = {
  // ---- GICS 11 ----
  energy:       {name:"Energy",                 color:"#f2703e"},
  materials:    {name:"Materials",              color:"#b08968"},
  industry:     {name:"Industrials",            color:"#c98a5e"},
  consumer_disc:{name:"Consumer Discretionary", color:"#ef7fb1"},
  consumer_stap:{name:"Consumer Staples",       color:"#9ccc65"},
  health:       {name:"Health Care",            color:"#35b8a4"},
  finance:      {name:"Financials",             color:"#3ecf8e"},
  tech:         {name:"Information Technology", color:"#a06ef5"},
  comm:         {name:"Communication Services", color:"#7e57c2"},
  utilities:    {name:"Utilities",              color:"#f5a623"},
  realestate:   {name:"Real Estate",            color:"#58c4dd"},
  // ---- government-side sectors (a power map needs these) ----
  gov:          {name:"Government & Political", color:"#5b8def"},
  sovereign:    {name:"Sovereign Capital",      color:"#e8b64c"},
  education:    {name:"Education & Research",   color:"#8bc34a"},
  conglomerate: {name:"Family Conglomerates",   color:"#b0a08a"},
};

const INSTITUTIONS = [
  {id:"bhgov",     n:"Royal Court of Bahrain (Al Khalifa)", s:"gov", t:0, p:100, short:"Royal Court"},
  {id:"cabinet_bh", n:"Cabinet of Bahrain",           s:"gov", t:0, p:90, short:"Cabinet"},
  {id:"mofin_bh",  n:"Ministry of Finance & National Economy", s:"gov", t:1, p:82, short:"MoF"},
  {id:"mofa_bh",   n:"Ministry of Foreign Affairs",   s:"gov", t:1, p:78, short:"MoFA"},
  {id:"cbb",       n:"Central Bank of Bahrain",       s:"finance", t:1, p:80, short:"CBB"},
  {id:"edb",       n:"Bahrain Economic Development Board", s:"gov", t:1, p:76, short:"EDB"},
  {id:"mumtalakat", n:"Mumtalakat (sovereign fund)",  s:"sovereign", t:1, p:84, short:"Mumtalakat"},
  {id:"bapco",     n:"Bapco Energies",                s:"energy", t:1, p:78, short:"Bapco"},
  {id:"alba",      n:"Aluminium Bahrain (Alba)",      s:"materials", t:1, p:72, short:"Alba"},
  {id:"beyon",     n:"Beyon (Batelco Group)",         s:"comm", t:1, p:70, short:"Beyon"},
  {id:"gulfair",   n:"Gulf Air Group",                s:"industry", t:1, p:70, short:"Gulf Air"},
  {id:"investcorp", n:"Investcorp",                   s:"finance", t:1, p:76, short:"Investcorp"},
  {id:"gfh",       n:"GFH Financial Group",           s:"finance", t:2, p:64, short:"GFH"},
  {id:"abc",       n:"Bank ABC",                      s:"finance", t:2, p:64, short:"Bank ABC"},
  {id:"nbb",       n:"National Bank of Bahrain",      s:"finance", t:2, p:64, short:"NBB"},
  {id:"bic",       n:"Bahrain International Circuit (F1)", s:"consumer_disc", t:2, p:64, short:"BIC"},
  {id:"bfb",       n:"Bahrain FinTech Bay",           s:"tech", t:2, p:56, short:"FinTech Bay"},
  {id:"bmmi",      n:"BMMI Group",                    s:"consumer_stap", t:2, p:58, short:"BMMI"},
  {id:"amh",       n:"American Mission Hospital",     s:"health", t:2, p:56, short:"AMH"},
  {id:"ewa_bh",    n:"Electricity & Water Authority", s:"utilities", t:1, p:66, short:"EWA"},
  {id:"edamah",    n:"Edamah (Bahrain Real Estate)",  s:"realestate", t:2, p:60, short:"Edamah"},
  {id:"kanoo",     n:"Yusuf bin Ahmed Kanoo Group",   s:"conglomerate", t:3, p:64, short:"Kanoo"},
  {id:"alzayani",  n:"Al Zayani Investments",         s:"conglomerate", t:3, p:60, short:"Al Zayani"},
  {id:"fakhro",    n:"Fakhro Group",                  s:"conglomerate", t:3, p:56, short:"Fakhro"},
];

const PEOPLE = [
  {id:"kinghamad", n:"King Hamad bin Isa Al Khalifa", t:0, p:100, s:"gov", roles:[
    ["bhgov","King of Bahrain","political","v"]]},
  {id:"salman_cp", n:"Crown Prince Salman bin Hamad Al Khalifa", t:0, p:96, s:"gov", roles:[
    ["bhgov","Crown Prince","political","v"],
    ["cabinet_bh","Prime Minister","political","v"],
    ["mumtalakat","Chairman","board","ns"]],
    note:"Runs the government and the economic reform program; the operational center of the state."},
  {id:"nasser_bh", n:"Sheikh Nasser bin Hamad Al Khalifa", t:0, p:78, s:"energy", roles:[
    ["bhgov","National Security Adviser (royal portfolios)","political","ns"],
    ["bapco","Chairman","board","ns"]]},
  {id:"khalid_bh", n:"Sheikh Khalid bin Hamad Al Khalifa", t:0, p:70, s:"consumer_disc", roles:[
    ["bhgov","First Deputy President, Supreme Council for Youth & Sports","government","ns"]]},
  {id:"salman_khalifa_fin", n:"Sheikh Salman bin Khalifa Al Khalifa", t:1, p:82, s:"finance", roles:[
    ["mofin_bh","Minister of Finance & National Economy","political","v"]]},
  {id:"zayani_fm", n:"Dr. Abdullatif bin Rashid Al Zayani", t:1, p:78, s:"gov", roles:[
    ["mofa_bh","Minister of Foreign Affairs","political","v"]]},
  {id:"humaidan", n:"Khalid Humaidan", t:1, p:76, s:"finance", roles:[
    ["cbb","Governor","executive","v"]]},
  {id:"noor", n:"Noor bint Ali Alkhulaif", t:1, p:74, s:"gov", roles:[
    ["cabinet_bh","Minister of Sustainable Development","political","v"],
    ["edb","Chief Executive","executive","v"]]},
  {id:"alardhi", n:"Mohammed Alardhi", t:1, p:76, s:"finance", roles:[
    ["investcorp","Executive Chairman","executive","v"]],
    note:"Omani ex-air force chief running the Gulf's best-known alternative asset manager from Bahrain."},
  {id:"baqali", n:"Ali Al Baqali", t:2, p:64, s:"materials", roles:[
    ["alba","CEO","executive","v"]]},
  {id:"salman_isa_bic", n:"Sheikh Salman bin Isa Al Khalifa", t:2, p:62, s:"consumer_disc", roles:[
    ["bic","CEO","executive","ns"]]},
  {id:"fawzi_kanoo", n:"Fawzi Ahmed Kanoo", t:2, p:60, s:"conglomerate", roles:[
    ["kanoo","Deputy Chairman","board","ns"]]},
];

const OWNERSHIP = [
  ["cabinet_bh","bhgov","governs under"],
  ["mofin_bh","cabinet_bh"],["mofa_bh","cabinet_bh"],
  ["cbb","bhgov"],["edb","bhgov"],
  ["mumtalakat","bhgov","sovereign fund"],
  ["bapco","bhgov","state energy holding","ns"],
  ["alba","mumtalakat","majority","ns"],
  ["beyon","mumtalakat","anchor shareholder","ns"],
  ["gulfair","bhgov","state owner"],
  ["nbb","mumtalakat","anchor shareholder","ns"],
  ["bic","bhgov"],
  ["bfb","edb","backed by","ns"],
  ["ewa_bh","bhgov"],
  ["edamah","mumtalakat"],
];

const FAMILY = [
  ["kinghamad","salman_cp","father–son"],
  ["kinghamad","nasser_bh","father–son"],
  ["kinghamad","khalid_bh","father–son"],
  ["salman_cp","nasser_bh","half-brothers"],
];

const AKA = {
  kinghamad:["King Hamad"],
  salman_cp:["Salman bin Hamad","Crown Prince Salman"],
  mumtalakat:["Mumtalakat"],
  investcorp:["Investcorp"],
  beyon:["Batelco"],
};
