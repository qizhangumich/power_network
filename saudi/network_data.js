/* ================================================================
   SAUDI ARABIA POWER NETWORK — DATASET (V1 backbone)
   Tiers: 0 ruling core · 1 state & capital · 2 operators · 3 private/intl.
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
  {id:"royalcourt", n:"Royal Court (Al Saud)",       s:"gov", t:0, p:100, short:"Royal Court"},
  {id:"com",       n:"Council of Ministers",         s:"gov", t:0, p:92,  short:"Cabinet"},
  {id:"mof_sa",    n:"Ministry of Finance",          s:"gov", t:1, p:86,  short:"MoF"},
  {id:"mofa_sa",   n:"Ministry of Foreign Affairs",  s:"gov", t:1, p:86,  short:"MoFA"},
  {id:"mod_sa",    n:"Ministry of Defense",          s:"gov", t:1, p:88,  short:"MoD"},
  {id:"moenergy",  n:"Ministry of Energy",           s:"energy", t:1, p:90, short:"Min. Energy"},
  {id:"misa",      n:"Ministry of Investment",       s:"gov", t:1, p:82,  short:"MISA"},
  {id:"mcit_sa",   n:"Ministry of Communications & IT", s:"tech", t:1, p:78, short:"MCIT"},
  {id:"moc_sa",    n:"Ministry of Commerce",         s:"gov", t:1, p:74,  short:"Min. Commerce"},
  {id:"moind",     n:"Ministry of Industry & Mineral Resources", s:"gov", t:1, p:74, short:"Min. Industry"},
  {id:"mot_sa",    n:"Ministry of Tourism",          s:"gov", t:1, p:74, short:"Min. Tourism"},
  {id:"sama",      n:"Saudi Central Bank (SAMA)",    s:"finance", t:1, p:84, short:"SAMA"},
  {id:"sdaia",     n:"SDAIA (Data & AI Authority)",  s:"tech", t:1, p:74,  short:"SDAIA"},
  {id:"gea",       n:"General Entertainment Authority", s:"gov", t:1, p:74, short:"GEA"},
  {id:"pif",       n:"Public Investment Fund",       s:"sovereign", t:1, p:97, short:"PIF"},
  {id:"aramco",    n:"Saudi Aramco",                 s:"energy", t:1, p:96, short:"Aramco"},
  {id:"sabic",     n:"SABIC",                        s:"materials", t:1, p:80, short:"SABIC"},
  {id:"maaden",    n:"Ma'aden",                      s:"materials", t:2, p:76, short:"Ma'aden"},
  {id:"stc",       n:"stc Group",                    s:"comm", t:1, p:78, short:"stc"},
  {id:"sec",       n:"Saudi Electricity Company",    s:"utilities", t:2, p:70, short:"SEC"},
  {id:"acwa",      n:"ACWA Power",                   s:"utilities", t:1, p:78, short:"ACWA Power"},
  {id:"snb",       n:"Saudi National Bank",          s:"finance", t:1, p:78, short:"SNB"},
  {id:"alrajhi",   n:"Al Rajhi Bank",                s:"finance", t:1, p:78, short:"Al Rajhi"},
  {id:"sab",       n:"Saudi Awwal Bank",             s:"finance", t:2, p:66, short:"SAB"},
  {id:"tadawul",   n:"Saudi Exchange (Tadawul)",     s:"finance", t:2, p:70, short:"Tadawul"},
  {id:"neom",      n:"NEOM",                         s:"realestate", t:1, p:80, short:"NEOM"},
  {id:"redsea",    n:"Red Sea Global",               s:"realestate", t:2, p:70, short:"Red Sea Global"},
  {id:"qiddiya",   n:"Qiddiya",                      s:"consumer_disc", t:2, p:66, short:"Qiddiya"},
  {id:"diriyah",   n:"Diriyah Company",              s:"consumer_disc", t:2, p:70, short:"Diriyah"},
  {id:"roshn",     n:"ROSHN",                        s:"realestate", t:2, p:68, short:"ROSHN"},
  {id:"humain",    n:"HUMAIN (PIF AI company)",      s:"tech", t:2, p:72, short:"HUMAIN"},
  {id:"alat",      n:"Alat",                         s:"tech", t:2, p:70, short:"Alat"},
  {id:"saudia",    n:"Saudia",                       s:"industry", t:2, p:70, short:"Saudia"},
  {id:"riyadhair", n:"Riyadh Air",                   s:"industry", t:2, p:72, short:"Riyadh Air"},
  {id:"sami",      n:"SAMI (Saudi Arabian Military Industries)", s:"industry", t:2, p:70, short:"SAMI"},
  {id:"srmg",      n:"SRMG",                         s:"comm", t:2, p:64, short:"SRMG"},
  {id:"mbcgroup",  n:"MBC Group",                    s:"comm", t:2, p:68, short:"MBC"},
  {id:"almarai",   n:"Almarai",                      s:"consumer_stap", t:2, p:66, short:"Almarai"},
  {id:"habib",     n:"Dr. Sulaiman Al Habib Medical Group", s:"health", t:2, p:70, short:"Al Habib Medical"},
  {id:"kingdomholding", n:"Kingdom Holding",         s:"conglomerate", t:3, p:72, short:"Kingdom Holding"},
  {id:"olayan",    n:"Olayan Group",                 s:"conglomerate", t:3, p:70, short:"Olayan"},
  {id:"alfaisaliah", n:"Al Faisaliah Group",         s:"conglomerate", t:3, p:60, short:"Al Faisaliah"},
  {id:"ajlan",     n:"Ajlan & Bros",                 s:"conglomerate", t:3, p:62, short:"Ajlan & Bros"},
];

const PEOPLE = [
  {id:"kingsalman", n:"King Salman bin Abdulaziz Al Saud", t:0, p:94, s:"gov", roles:[
    ["royalcourt","King of Saudi Arabia · Custodian of the Two Holy Mosques","political","v"]]},
  {id:"mbs", n:"Crown Prince Mohammed bin Salman Al Saud", t:0, p:100, s:"gov", roles:[
    ["royalcourt","Crown Prince","political","v"],
    ["com","Prime Minister","political","v"],
    ["pif","Chairman","board","v"]],
    note:"'MBS' — runs the state, the sovereign fund and Vision 2030. Every giga-project chain ends here."},
  {id:"kbs", n:"Prince Khalid bin Salman Al Saud", t:0, p:88, s:"gov", roles:[
    ["mod_sa","Minister of Defense","political","v"]],
    note:"MBS's full brother."},
  {id:"abs", n:"Prince Abdulaziz bin Salman Al Saud", t:0, p:90, s:"energy", roles:[
    ["moenergy","Minister of Energy","political","v"]],
    note:"Half-brother of MBS; OPEC+ strategy runs through him."},
  {id:"faisal_farhan", n:"Prince Faisal bin Farhan Al Saud", t:0, p:86, s:"gov", roles:[
    ["mofa_sa","Minister of Foreign Affairs","political","v"]]},
  {id:"alwaleed", n:"Prince Alwaleed bin Talal Al Saud", t:0, p:78, s:"conglomerate", roles:[
    ["kingdomholding","Chairman","board","v"]]},
  {id:"rumayyan", n:"Yasir Al-Rumayyan", t:1, p:92, s:"sovereign", roles:[
    ["pif","Governor","executive","v"],
    ["aramco","Chairman","board","v"]],
    note:"MBS's chief capital allocator — PIF, Aramco board, Newcastle United, LIV Golf."},
  {id:"nasser_aramco", n:"Amin Nasser", t:1, p:88, s:"energy", roles:[
    ["aramco","President & CEO","executive","v"]]},
  {id:"jadaan", n:"Mohammed Al-Jadaan", t:1, p:86, s:"finance", roles:[
    ["mof_sa","Minister of Finance","political","v"]]},
  {id:"falih", n:"Khalid Al-Falih", t:1, p:84, s:"gov", roles:[
    ["misa","Minister of Investment","political","v"]]},
  {id:"alswaha", n:"Abdullah Alswaha", t:1, p:78, s:"tech", roles:[
    ["mcit_sa","Minister of Communications & IT","political","v"]]},
  {id:"khateeb", n:"Ahmed Al-Khateeb", t:1, p:76, s:"gov", roles:[
    ["mot_sa","Minister of Tourism","political","v"]]},
  {id:"alkhorayef", n:"Bandar Alkhorayef", t:1, p:74, s:"industry", roles:[
    ["moind","Minister of Industry & Mineral Resources","political","v"]]},
  {id:"qasabi", n:"Majid Al-Qasabi", t:1, p:76, s:"gov", roles:[
    ["moc_sa","Minister of Commerce","political","v"]]},
  {id:"alsayari", n:"Ayman Al-Sayari", t:1, p:78, s:"finance", roles:[
    ["sama","Governor","executive","v"]]},
  {id:"alalshikh", n:"Turki Alalshikh", t:1, p:82, s:"gov", roles:[
    ["gea","Chairman","government","v"]],
    note:"Entertainment, boxing and events czar; one of the most visible operators of the MBS era."},
  {id:"alghamdi_sdaia", n:"Abdullah Al-Ghamdi", t:2, p:70, s:"tech", roles:[
    ["sdaia","President","government","ns"]]},
  {id:"fageeh", n:"Abdulrahman Al-Fageeh", t:2, p:72, s:"materials", roles:[
    ["sabic","CEO","executive","ns"]]},
  {id:"wilt", n:"Bob Wilt", t:2, p:68, s:"materials", roles:[
    ["maaden","CEO","executive","ns"]]},
  {id:"alwetaid", n:"Olayan Alwetaid", t:2, p:70, s:"comm", roles:[
    ["stc","Group CEO","executive","ns"]]},
  {id:"abunayyan", n:"Mohammad Abunayyan", t:2, p:76, s:"utilities", roles:[
    ["acwa","Founder & Chairman","board","v"]]},
  {id:"tareq_amin", n:"Tareq Amin", t:2, p:72, s:"tech", roles:[
    ["humain","CEO","executive","ns"]]},
  {id:"amit_midha", n:"Amit Midha", t:2, p:64, s:"tech", roles:[
    ["alat","CEO","executive","ns"]]},
  {id:"tony_douglas", n:"Tony Douglas", t:2, p:70, s:"industry", roles:[
    ["riyadhair","CEO","executive","v"]]},
  {id:"pagano", n:"John Pagano", t:2, p:64, s:"realestate", roles:[
    ["redsea","Group CEO","executive","v"]]},
  {id:"inzerillo", n:"Jerry Inzerillo", t:2, p:66, s:"consumer_disc", roles:[
    ["diriyah","Group CEO","executive","v"]]},
  {id:"almudaifer", n:"Aiman Al-Mudaifer", t:2, p:68, s:"realestate", roles:[
    ["neom","CEO (acting)","executive","ns"]]},
  {id:"waleed_ibrahim", n:"Waleed Al Ibrahim", t:2, p:72, s:"comm", roles:[
    ["mbcgroup","Founder & Chairman","board","v"]]},
  {id:"lubna", n:"Lubna Olayan", t:2, p:76, s:"finance", roles:[
    ["olayan","Chair, Olayan Financing","board","v"],
    ["sab","Chair","board","ns"]]},
  {id:"alsadhan", n:"Tareq Al-Sadhan", t:2, p:72, s:"finance", roles:[
    ["snb","Group CEO","executive","v"]]},
  {id:"saeed_alghamdi", n:"Saeed Al-Ghamdi", t:2, p:72, s:"finance", roles:[
    ["snb","Chairman","board","ns"]]},
  {id:"almogbel", n:"Waleed Al-Mogbel", t:2, p:72, s:"finance", roles:[
    ["alrajhi","CEO & Managing Director","executive","v"]]},
  {id:"alghonon", n:"Khalid Al-Ghonon", t:2, p:66, s:"utilities", roles:[
    ["sec","CEO","executive","ns"]]},
  {id:"alhussan", n:"Khalid Al-Hussan", t:2, p:70, s:"finance", roles:[
    ["tadawul","Group CEO, Saudi Tadawul Group","executive","v"]]},
  {id:"alomar_saudia", n:"Ibrahim Al-Omar", t:2, p:68, s:"industry", roles:[
    ["saudia","Director General, Saudia Group","executive","v"]]},
  {id:"almuhid", n:"Thamer AlMuhid", t:2, p:68, s:"industry", roles:[
    ["sami","CEO","executive","v"]]},
  {id:"sulaiman_alhabib", n:"Sulaiman Al Habib", t:2, p:74, s:"health", roles:[
    ["habib","Founder & Chairman","board","v"]]},
  {id:"atallah", n:"Noman Atallah", t:2, p:64, s:"realestate", roles:[
    ["roshn","Group CEO","executive","ns"]]},
  {id:"aldawood", n:"Abdullah Aldawood", t:2, p:68, s:"consumer_disc", roles:[
    ["qiddiya","CEO & Managing Director","executive","v"]]},
  {id:"aljasser", n:"Fawaz Al-Jasser", t:2, p:64, s:"consumer_stap", roles:[
    ["almarai","CEO","executive","ns"]]},
  {id:"jomana", n:"Jomana Al-Rashid", t:2, p:68, s:"comm", roles:[
    ["srmg","CEO","executive","v"]]},
  {id:"alajlan", n:"Ajlan bin Abdulaziz Al Ajlan", t:2, p:68, s:"conglomerate", roles:[
    ["ajlan","Founder & Chairman","board","v"]]},
];

const OWNERSHIP = [
  ["com","royalcourt","governs under"],
  ["mof_sa","com"],["mofa_sa","com"],["mod_sa","com"],["moenergy","com"],["misa","com"],
  ["mcit_sa","com"],["moc_sa","com"],["moind","com"],["mot_sa","com"],
  ["sama","royalcourt"],["sdaia","royalcourt"],["gea","royalcourt"],
  ["pif","royalcourt","sovereign fund"],
  ["aramco","royalcourt","state majority"],
  ["sabic","aramco","70% shareholder"],
  ["maaden","pif","majority","ns"],
  ["stc","pif","majority"],
  ["sec","pif","majority","ns"],
  ["snb","pif","anchor shareholder"],
  ["tadawul","pif","majority","ns"],
  ["neom","pif"],["redsea","pif"],["qiddiya","pif"],["diriyah","pif"],["roshn","pif"],
  ["humain","pif"],["alat","pif"],
  ["saudia","pif","transferred to","ns"],
  ["riyadhair","pif"],
  ["sami","pif"],
  ["srmg","royalcourt","royal-linked","ns"],
  ["mbcgroup","royalcourt","state-controlled since 2018","ns"],
  ["almarai","pif","strategic stake","ns"],
  ["acwa","pif","44% shareholder","ns"],
];

const FAMILY = [
  ["kingsalman","mbs","father–son"],
  ["kingsalman","kbs","father–son"],
  ["kingsalman","abs","father–son"],
  ["mbs","kbs","brothers"],
  ["mbs","abs","half-brothers"],
];

const AKA = {
  mbs:["Mohammed bin Salman","MBS","Crown Prince Mohammed"],
  kbs:["Khalid bin Salman","KBS"],
  abs:["Abdulaziz bin Salman"],
  rumayyan:["Yasir Al Rumayyan","Al-Rumayyan"],
  nasser_aramco:["Amin Nasser","Amin H. Nasser"],
  pif:["Public Investment Fund"],
  aramco:["Saudi Aramco","Aramco"],
  alalshikh:["Turki Al-Sheikh","Turki Al Sheikh"],
  neom:["NEOM"],
  stc:["Saudi Telecom"],
  alsadhan:["Tareq Abdulrahman Al-Sadhan","Tareq Al Sadhan"],
  almogbel:["Waleed Abdullah Al-Mogbel","Waleed Al Mogbel"],
  alhussan:["Khalid Al Hussan","Khalid Abdullah Al-Hussan"],
  almuhid:["Thamer Al-Muhid","Thamer Al Muhid"],
  sulaiman_alhabib:["Dr. Sulaiman Al-Habib","Sulaiman bin Abdulaziz Al Habib"],
  jomana:["Jomana Alrashid","Jomana Al-Rashed"],
  alajlan:["Ajlan Al Ajlan","Ajlan Abdulaziz Alajlan"],
};
