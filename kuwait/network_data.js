/* ================================================================
   KUWAIT POWER NETWORK — DATASET (V1 backbone)
   "v" established public fact · "ns" needs source check.
   ================================================================ */

const SECTORS = {
  gov:        {name:"Government & Political",      color:"#5b8def"},
  sovereign:  {name:"Sovereign Capital",           color:"#e8b64c"},
  energy:     {name:"Oil, Gas & Energy",           color:"#f2703e"},
  utilities:  {name:"Power, Water & Utilities",    color:"#f5a623"},
  finance:    {name:"Banking & Finance",           color:"#3ecf8e"},
  tech:       {name:"AI, Tech & Space",            color:"#a06ef5"},
  telecom:    {name:"Telecom",                     color:"#7e57c2"},
  defense:    {name:"Defense & Security",          color:"#e0645c"},
  industry:   {name:"Industry & Manufacturing",    color:"#c98a5e"},
  realestate: {name:"Real Estate & Urban Dev",     color:"#58c4dd"},
  transport:  {name:"Transport, Ports & Aviation", color:"#4f9de0"},
  health:     {name:"Healthcare",                  color:"#35b8a4"},
  education:  {name:"Education & Research",        color:"#8bc34a"},
  culture:    {name:"Culture, Tourism & Sport",    color:"#ef7fb1"},
  media:      {name:"Media",                       color:"#e57bd8"},
  agrifood:   {name:"Agri-food & Retail",          color:"#9ccc65"},
  environment:{name:"Environment & Waste",         color:"#66bb6a"},
  conglomerate:{name:"Family Conglomerates",       color:"#b0a08a"},
  professional:{name:"Professional Services",      color:"#90a4ae"},
};

const INSTITUTIONS = [
  {id:"kwgov",     n:"Amiri Diwan of Kuwait (Al Sabah)", s:"gov", t:0, p:100, short:"Amiri Diwan"},
  {id:"cabinet_kw", n:"Council of Ministers",        s:"gov", t:0, p:86, short:"Cabinet"},
  {id:"mof_kw",    n:"Ministry of Finance",          s:"gov", t:1, p:80, short:"MoF"},
  {id:"mofa_kw",   n:"Ministry of Foreign Affairs",  s:"gov", t:1, p:78, short:"MoFA"},
  {id:"cbk",       n:"Central Bank of Kuwait",       s:"finance", t:1, p:78, short:"CBK"},
  {id:"kia",       n:"Kuwait Investment Authority",  s:"sovereign", t:1, p:92, short:"KIA"},
  {id:"kpc",       n:"Kuwait Petroleum Corporation", s:"energy", t:1, p:88, short:"KPC"},
  {id:"koc",       n:"Kuwait Oil Company",           s:"energy", t:2, p:74, short:"KOC"},
  {id:"knpc",      n:"KNPC (refining)",              s:"energy", t:2, p:68, short:"KNPC"},
  {id:"kufpec",    n:"KUFPEC (international E&P)",   s:"energy", t:2, p:62, short:"KUFPEC"},
  {id:"nbk",       n:"National Bank of Kuwait",      s:"finance", t:1, p:80, short:"NBK"},
  {id:"kfh",       n:"Kuwait Finance House",         s:"finance", t:1, p:78, short:"KFH"},
  {id:"gulfbank",  n:"Gulf Bank",                    s:"finance", t:2, p:60, short:"Gulf Bank"},
  {id:"boursa",    n:"Boursa Kuwait",                s:"finance", t:2, p:62, short:"Boursa"},
  {id:"zain",      n:"Zain Group",                   s:"telecom", t:1, p:74, short:"Zain"},
  {id:"agility",   n:"Agility / Agility Global",     s:"transport", t:1, p:72, short:"Agility"},
  {id:"kuwaitairways", n:"Kuwait Airways",           s:"transport", t:2, p:62, short:"Kuwait Airways"},
  {id:"jazeera",   n:"Jazeera Airways",              s:"transport", t:2, p:60, short:"Jazeera Airways"},
  {id:"alshaya",   n:"Alshaya Group",                s:"conglomerate", t:3, p:72, short:"Alshaya"},
  {id:"alghanim",  n:"Alghanim Industries",          s:"conglomerate", t:3, p:68, short:"Alghanim"},
  {id:"kharafi",   n:"M.A. Kharafi & Sons",          s:"conglomerate", t:3, p:66, short:"Al Kharafi"},
  {id:"alsayer",   n:"Al Sayer Group",               s:"conglomerate", t:3, p:58, short:"Al Sayer"},
  {id:"kipco",     n:"KIPCO",                        s:"sovereign", t:2, p:66, short:"KIPCO"},
];

const PEOPLE = [
  {id:"meshal", n:"H.H. Sheikh Meshal Al-Ahmad Al-Jaber Al-Sabah", t:0, p:100, s:"gov", roles:[
    ["kwgov","Emir of Kuwait","political","v"]]},
  {id:"sabah_khaled", n:"H.H. Sheikh Sabah Al-Khaled Al-Sabah", t:0, p:88, s:"gov", roles:[
    ["kwgov","Crown Prince","political","v"]]},
  {id:"pm_kw", n:"H.H. Sheikh Ahmad Abdullah Al-Ahmad Al-Sabah", t:0, p:86, s:"gov", roles:[
    ["cabinet_kw","Prime Minister","political","v"]]},
  {id:"fahad_yousef", n:"Sheikh Fahad Yousef Al-Sabah", t:0, p:82, s:"defense", roles:[
    ["cabinet_kw","First Deputy PM · Minister of Defence & Interior","political","ns"]]},
  {id:"yahya_fm", n:"Abdullah Ali Al-Yahya", t:1, p:74, s:"gov", roles:[
    ["mofa_kw","Minister of Foreign Affairs","political","ns"]]},
  {id:"noora_fin", n:"Noora Al-Fassam", t:1, p:74, s:"finance", roles:[
    ["mof_kw","Minister of Finance & Minister of State for Economic Affairs","political","ns"]]},
  {id:"haroon", n:"Basel Al-Haroon", t:1, p:74, s:"finance", roles:[
    ["cbk","Governor","executive","ns"]]},
  {id:"ghenaiman", n:"Ghanem Al-Ghenaiman", t:1, p:78, s:"sovereign", roles:[
    ["kia","Managing Director","executive","ns"]],
    note:"KIA is the world's oldest sovereign fund — and one of its most secretive."},
  {id:"nawaf_kpc", n:"Sheikh Nawaf Al-Saud Al-Sabah", t:1, p:82, s:"energy", roles:[
    ["kpc","Deputy Chairman & CEO","executive","v"]]},
  {id:"sager", n:"Isam Al-Sager", t:2, p:74, s:"finance", roles:[
    ["nbk","Group Vice Chairman & CEO","executive","v"]]},
  {id:"bader_kharafi", n:"Bader Nasser Al-Kharafi", t:1, p:78, s:"telecom", roles:[
    ["zain","Vice Chairman & Group CEO","executive","v"],
    ["kharafi","Family principal","board","ns"]],
    note:"Bridges the Kharafi family empire and Kuwait's most international listed company."},
  {id:"tarek_sultan", n:"Tarek Sultan", t:1, p:74, s:"transport", roles:[
    ["agility","Vice Chairman (Agility) · Chairman, Agility Global","executive","v"]]},
  {id:"mohammed_alshaya", n:"Mohammed Alshaya", t:2, p:74, s:"conglomerate", roles:[
    ["alshaya","Executive Chairman","board","v"]],
    note:"Franchise king of the Middle East — Starbucks to H&M across the region."},
  {id:"omar_alghanim", n:"Omar Kutayba Alghanim", t:2, p:68, s:"conglomerate", roles:[
    ["alghanim","Chairman (family)","board","ns"]]},
  {id:"boodai", n:"Marwan Boodai", t:2, p:64, s:"transport", roles:[
    ["jazeera","Chairman","board","v"]]},
];

const OWNERSHIP = [
  ["cabinet_kw","kwgov","governs under"],
  ["mof_kw","cabinet_kw"],["mofa_kw","cabinet_kw"],
  ["cbk","kwgov"],
  ["kia","kwgov","sovereign fund"],
  ["kpc","kwgov","state oil holding"],
  ["koc","kpc"],["knpc","kpc"],["kufpec","kpc"],
  ["kuwaitairways","kwgov","state owner"],
  ["boursa","kwgov","state stakes","ns"],
  ["kfh","kia","anchor state stakes","ns"],
  ["zain","kia","anchor state stake","ns"],
  ["kipco","kwgov","Al Sabah family-linked","ns"],
];

const FAMILY = [
  ["meshal","sabah_khaled","kin (Al Sabah)"],
  ["meshal","pm_kw","kin (Al Sabah)"],
];

const AKA = {
  meshal:["Meshal Al-Ahmad","Emir Meshal"],
  kia:["Kuwait Investment Authority"],
  kpc:["Kuwait Petroleum"],
  nbk:["National Bank of Kuwait"],
  kfh:["Kuwait Finance House"],
  bader_kharafi:["Bader Al-Kharafi"],
  alshaya:["Alshaya"],
};
