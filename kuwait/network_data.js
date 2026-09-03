/* ================================================================
   KUWAIT POWER NETWORK — DATASET (V1 backbone)
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
  {id:"zain",      n:"Zain Group",                   s:"comm", t:1, p:74, short:"Zain"},
  {id:"agility",   n:"Agility / Agility Global",     s:"industry", t:1, p:72, short:"Agility"},
  {id:"kuwaitairways", n:"Kuwait Airways",           s:"industry", t:2, p:62, short:"Kuwait Airways"},
  {id:"jazeera",   n:"Jazeera Airways",              s:"industry", t:2, p:60, short:"Jazeera Airways"},
  {id:"equate",    n:"EQUATE Petrochemicals",        s:"materials", t:2, p:66, short:"EQUATE"},
  {id:"mezzan",    n:"Mezzan Holding",               s:"consumer_stap", t:2, p:60, short:"Mezzan"},
  {id:"daralshifa", n:"Dar Al Shifa Hospital",       s:"health", t:2, p:56, short:"Dar Al Shifa"},
  {id:"knet",      n:"KNET (payments network)",      s:"tech", t:2, p:60, short:"KNET"},
  {id:"shamalazzour", n:"Shamal Az-Zour Al-Oula (IWPP)", s:"utilities", t:2, p:58, short:"Az-Zour"},
  {id:"mabanee",   n:"Mabanee (The Avenues)",        s:"realestate", t:2, p:64, short:"Mabanee"},
  {id:"alshaya",   n:"Alshaya Group",                s:"consumer_disc", t:3, p:72, short:"Alshaya"},
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
  {id:"fahad_yousef", n:"Sheikh Fahad Yousef Al-Sabah", t:0, p:82, s:"gov", roles:[
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
  {id:"bader_kharafi", n:"Bader Nasser Al-Kharafi", t:1, p:78, s:"comm", roles:[
    ["zain","Vice Chairman & Group CEO","executive","v"],
    ["kharafi","Family principal","board","ns"]],
    note:"Bridges the Kharafi family empire and Kuwait's most international listed company."},
  {id:"tarek_sultan", n:"Tarek Sultan", t:1, p:74, s:"industry", roles:[
    ["agility","Vice Chairman (Agility) · Chairman, Agility Global","executive","v"]]},
  {id:"mohammed_alshaya", n:"Mohammed Alshaya", t:2, p:74, s:"conglomerate", roles:[
    ["alshaya","Executive Chairman","board","v"]],
    note:"Franchise king of the Middle East — Starbucks to H&M across the region."},
  {id:"omar_alghanim", n:"Omar Kutayba Alghanim", t:2, p:68, s:"conglomerate", roles:[
    ["alghanim","Chairman (family)","board","ns"]]},
  {id:"boodai", n:"Marwan Boodai", t:2, p:64, s:"industry", roles:[
    ["jazeera","Chairman","board","v"]]},
  {id:"alshamlan_kfh", n:"Khaled Yousef Alshamlan", t:2, p:72, s:"finance", roles:[
    ["kfh","Group Chief Executive Officer","executive","v"]]},
  {id:"aleidan_koc", n:"Ahmad Jaber Al-Eidan", t:2, p:68, s:"energy", roles:[
    ["koc","Chief Executive Officer","executive","v"]]},
  {id:"alkhateeb_knpc", n:"Wadha Ahmed Al-Khateeb", t:2, p:66, s:"energy", roles:[
    ["knpc","Chief Executive Officer","executive","v"]]},
  {id:"aldousari_equate", n:"Nasser Mohamad Al-Dousari", t:2, p:62, s:"materials", roles:[
    ["equate","Chief Executive Officer","executive","v"]]},
  {id:"dana_alsabah_kipco", n:"Sheikha Dana Naser Al-Sabah", t:1, p:66, s:"sovereign", roles:[
    ["kipco","Group Chief Executive Officer","executive","v"]]},
  {id:"alsharian_mabanee", n:"Waleed Khaled Alsharian", t:2, p:62, s:"realestate", roles:[
    ["mabanee","Chief Executive Officer","executive","v"]]},
  {id:"alhaimer_kufpec", n:"Mohammad Salem Al-Haimer", t:2, p:60, s:"energy", roles:[
    ["kufpec","Chief Executive Officer","executive","v"]]},
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
  ["equate","kpc","PIC joint venture","ns"],
  ["knet","cbk","bank consortium under CBK oversight","ns"],
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
  dana_alsabah_kipco:["Dana Al Sabah"],
  alkhateeb_knpc:["Wadha Al-Khateeb"],
};
