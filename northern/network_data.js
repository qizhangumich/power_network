/* ================================================================
   NORTHERN EMIRATES POWER NETWORK — Sharjah · RAK · Fujairah · Ajman · UAQ
   V1 backbone. "v" established public fact · "ns" needs source check.
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
  {id:"shjgov",   n:"Government of Sharjah",         s:"gov", t:0, p:100, short:"Sharjah Gov"},
  {id:"rakgov",   n:"Government of Ras Al Khaimah",  s:"gov", t:0, p:92,  short:"RAK Gov"},
  {id:"fujgov",   n:"Government of Fujairah",        s:"gov", t:0, p:84,  short:"Fujairah Gov"},
  {id:"ajmgov",   n:"Government of Ajman",           s:"gov", t:0, p:80,  short:"Ajman Gov"},
  {id:"uaqgov",   n:"Government of Umm Al Quwain",   s:"gov", t:0, p:76,  short:"UAQ Gov"},
  {id:"shurooq",  n:"Shurooq (Sharjah Investment & Development)", s:"sovereign", t:1, p:74, short:"Shurooq"},
  {id:"beeah",    n:"BEEAH Group",                   s:"environment", t:1, p:72, short:"BEEAH"},
  {id:"airarabia", n:"Air Arabia",                   s:"transport", t:1, p:76, short:"Air Arabia"},
  {id:"crescent", n:"Crescent Enterprises",          s:"conglomerate", t:1, p:76, short:"Crescent Ent."},
  {id:"crescentpet", n:"Crescent Petroleum",         s:"energy", t:1, p:76, short:"Crescent Petroleum"},
  {id:"danagas",  n:"Dana Gas",                      s:"energy", t:2, p:66, short:"Dana Gas"},
  {id:"gulftainer", n:"Gulftainer",                  s:"transport", t:2, p:62, short:"Gulftainer"},
  {id:"arada",    n:"Arada",                         s:"realestate", t:2, p:66, short:"Arada"},
  {id:"aus",      n:"American University of Sharjah", s:"education", t:2, p:64, short:"AUS"},
  {id:"sba",      n:"Sharjah Book Authority",        s:"culture", t:2, p:62, short:"Book Authority"},
  {id:"rakceramics", n:"RAK Ceramics",               s:"industry", t:1, p:70, short:"RAK Ceramics"},
  {id:"rakez",    n:"RAKEZ (RAK Economic Zone)",     s:"gov", t:2, p:66, short:"RAKEZ"},
  {id:"marjan",   n:"Marjan (Al Marjan Island)",     s:"realestate", t:2, p:66, short:"Marjan"},
  {id:"wynnmarjan", n:"Wynn Al Marjan Island",       s:"culture", t:2, p:68, short:"Wynn Al Marjan"},
  {id:"rakbank",  n:"RAKBANK",                       s:"finance", t:2, p:62, short:"RAKBANK"},
  {id:"fujport",  n:"Port of Fujairah",              s:"transport", t:1, p:70, short:"Port of Fujairah"},
  {id:"fujoilzone", n:"Fujairah Oil Industry Zone",  s:"energy", t:2, p:64, short:"Fujairah Oil Zone"},
  {id:"ajmanbank", n:"Ajman Bank",                   s:"finance", t:2, p:56, short:"Ajman Bank"},
];

const PEOPLE = [
  {id:"sultan_qasimi", n:"H.H. Sheikh Dr. Sultan bin Muhammad Al Qasimi", t:0, p:100, s:"gov", roles:[
    ["shjgov","Ruler of Sharjah","political","v"],
    ["aus","Founder & President","board","v"]],
    note:"Ruler since 1972 — the intellectual of the UAE ruling houses; culture and education define Sharjah's model."},
  {id:"sultan_ahmed_q", n:"H.H. Sheikh Sultan bin Ahmed Al Qasimi", t:0, p:84, s:"gov", roles:[
    ["shjgov","Deputy Ruler of Sharjah","political","v"],
    ["arada","Co-founder & Chairman","board","ns"]]},
  {id:"bodour", n:"H.H. Sheikha Bodour Al Qasimi", t:0, p:82, s:"culture", roles:[
    ["sba","Chairperson","board","v"],
    ["shurooq","Chairperson","board","ns"]],
    note:"The Ruler's daughter; publishing, investment and development portfolios."},
  {id:"saud_saqr", n:"H.H. Sheikh Saud bin Saqr Al Qasimi", t:0, p:92, s:"gov", roles:[
    ["rakgov","Ruler of Ras Al Khaimah","political","v"]],
    note:"Turned RAK into a tourism/industry story — capped by the Wynn casino-resort bet."},
  {id:"mohammed_saud_rak", n:"H.H. Sheikh Mohammed bin Saud Al Qasimi", t:0, p:78, s:"gov", roles:[
    ["rakgov","Crown Prince of RAK","political","v"]]},
  {id:"hamad_sharqi", n:"H.H. Sheikh Hamad bin Mohammed Al Sharqi", t:0, p:84, s:"gov", roles:[
    ["fujgov","Ruler of Fujairah","political","v"]]},
  {id:"mohammed_sharqi", n:"H.H. Sheikh Mohammed bin Hamad Al Sharqi", t:0, p:74, s:"gov", roles:[
    ["fujgov","Crown Prince of Fujairah","political","v"]]},
  {id:"humaid_nuaimi", n:"H.H. Sheikh Humaid bin Rashid Al Nuaimi", t:0, p:80, s:"gov", roles:[
    ["ajmgov","Ruler of Ajman","political","v"]]},
  {id:"ammar_nuaimi", n:"H.H. Sheikh Ammar bin Humaid Al Nuaimi", t:0, p:72, s:"gov", roles:[
    ["ajmgov","Crown Prince of Ajman","political","v"]]},
  {id:"saud_mualla", n:"H.H. Sheikh Saud bin Rashid Al Mualla", t:0, p:76, s:"gov", roles:[
    ["uaqgov","Ruler of Umm Al Quwain","political","v"]]},
  {id:"badr_jafar", n:"Badr Jafar", t:1, p:80, s:"conglomerate", roles:[
    ["crescent","CEO","executive","v"],
    ["gulftainer","Chairman","board","ns"]],
    note:"Sharjah's most globally connected businessman; philanthropy and business diplomacy portfolios."},
  {id:"majid_jafar", n:"Majid Jafar", t:1, p:78, s:"energy", roles:[
    ["crescentpet","CEO","executive","v"],
    ["danagas","Board (Crescent-linked)","board","ns"]]},
  {id:"adel_ali", n:"Adel Al Ali", t:2, p:76, s:"transport", roles:[
    ["airarabia","Group CEO","executive","v"]]},
  {id:"huraimel", n:"Khaled Al Huraimel", t:2, p:70, s:"environment", roles:[
    ["beeah","Group CEO","executive","v"]]},
  {id:"massaad", n:"Abdallah Massaad", t:2, p:66, s:"industry", roles:[
    ["rakceramics","Group CEO","executive","v"]]},
  {id:"jallad", n:"Ramy Jallad", t:2, p:60, s:"gov", roles:[
    ["rakez","Group CEO","executive","ns"]]},
  {id:"qaseer", n:"Ahmed Obaid Al Qaseer", t:2, p:60, s:"sovereign", roles:[
    ["shurooq","CEO","executive","ns"]]},
  {id:"mousa_murad", n:"Capt. Mousa Murad", t:2, p:62, s:"transport", roles:[
    ["fujport","General Manager","executive","ns"]]},
];

const OWNERSHIP = [
  ["shurooq","shjgov"],["beeah","shjgov","co-founded","ns"],["sba","shjgov"],
  ["airarabia","shjgov","Sharjah-anchored (listed)","ns"],
  ["arada","shjgov","ruling-family co-founded","ns"],
  ["aus","shjgov"],
  ["crescentpet","crescent","sister company (Jafar family)"],
  ["danagas","crescentpet","founded by / major shareholder","ns"],
  ["gulftainer","crescent"],
  ["rakceramics","rakgov","RAK government stake","ns"],
  ["rakez","rakgov"],["marjan","rakgov"],["rakbank","rakgov","majority","ns"],
  ["wynnmarjan","marjan","JV (Wynn Resorts + Marjan)"],
  ["fujport","fujgov"],["fujoilzone","fujgov"],
  ["ajmanbank","ajmgov","ruling-family stake","ns"],
];

const FAMILY = [
  ["sultan_qasimi","bodour","father–daughter"],
  ["sultan_qasimi","sultan_ahmed_q","kin (Al Qasimi)"],
  ["saud_saqr","mohammed_saud_rak","father–son"],
  ["hamad_sharqi","mohammed_sharqi","father–son"],
  ["humaid_nuaimi","ammar_nuaimi","father–son"],
  ["badr_jafar","majid_jafar","brothers"],
];

const AKA = {
  sultan_qasimi:["Sultan Al Qasimi","Sultan bin Muhammad"],
  saud_saqr:["Saud bin Saqr"],
  badr_jafar:["Badr Jafar"],
  majid_jafar:["Majid Jafar"],
  beeah:["Bee'ah"],
  airarabia:["Air Arabia"],
  wynnmarjan:["Wynn Al Marjan","Wynn Resorts"],
};
