/* ================================================================
   OMAN POWER NETWORK — DATASET (V1 backbone)
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
  {id:"omgov",     n:"Royal Court of Oman (Al Said)", s:"gov", t:0, p:100, short:"Royal Court"},
  {id:"com_om",    n:"Council of Ministers",          s:"gov", t:0, p:88,  short:"Cabinet"},
  {id:"mof_om",    n:"Ministry of Finance",           s:"gov", t:1, p:82,  short:"MoF"},
  {id:"mofa_om",   n:"Foreign Ministry",              s:"gov", t:1, p:80,  short:"MoFA"},
  {id:"moci_om",   n:"Ministry of Commerce, Industry & Investment Promotion", s:"gov", t:1, p:74, short:"MoCIIP"},
  {id:"cbo",       n:"Central Bank of Oman",          s:"finance", t:1, p:76, short:"CBO"},
  {id:"oia",       n:"Oman Investment Authority",     s:"sovereign", t:1, p:90, short:"OIA"},
  {id:"oq",        n:"OQ Group",                      s:"energy", t:1, p:82, short:"OQ"},
  {id:"pdo",       n:"Petroleum Development Oman",    s:"energy", t:1, p:78, short:"PDO"},
  {id:"omanlng",   n:"Oman LNG",                      s:"energy", t:2, p:70, short:"Oman LNG"},
  {id:"omantel",   n:"Omantel",                       s:"telecom", t:2, p:70, short:"Omantel"},
  {id:"bankmuscat", n:"Bank Muscat",                  s:"finance", t:1, p:74, short:"Bank Muscat"},
  {id:"sohar_bank", n:"Sohar International",          s:"finance", t:2, p:62, short:"Sohar Intl"},
  {id:"asyad",     n:"Asyad Group (logistics)",       s:"transport", t:1, p:72, short:"Asyad"},
  {id:"opaz",      n:"OPAZ (Special Economic Zones & Free Zones)", s:"gov", t:1, p:68, short:"OPAZ"},
  {id:"duqm",      n:"Duqm Special Economic Zone",    s:"industry", t:2, p:66, short:"Duqm SEZ"},
  {id:"soharport", n:"Sohar Port & Freezone",         s:"transport", t:2, p:66, short:"Sohar Port"},
  {id:"omanair",   n:"Oman Air",                      s:"transport", t:2, p:64, short:"Oman Air"},
  {id:"omran",     n:"OMRAN Group (tourism development)", s:"culture", t:2, p:62, short:"OMRAN"},
  {id:"ominvest",  n:"Ominvest",                      s:"finance", t:2, p:60, short:"Ominvest"},
  {id:"bahwan",    n:"Suhail Bahwan Group",           s:"conglomerate", t:3, p:68, short:"Suhail Bahwan"},
  {id:"zubair",    n:"The Zubair Corporation",        s:"conglomerate", t:3, p:64, short:"Zubair"},
  {id:"khimji",    n:"Khimji Ramdas",                 s:"conglomerate", t:3, p:58, short:"Khimji Ramdas"},
];

const PEOPLE = [
  {id:"haitham", n:"H.M. Sultan Haitham bin Tariq Al Said", t:0, p:100, s:"gov", roles:[
    ["omgov","Sultan of Oman","political","v"]],
    note:"Also holds the PM, defence, finance and central-bank chairmanships in the Omani system."},
  {id:"theyazin", n:"H.H. Sayyid Theyazin bin Haitham Al Said", t:0, p:80, s:"gov", roles:[
    ["omgov","Crown Prince","political","v"],
    ["com_om","Minister of Culture, Sports & Youth","political","v"]]},
  {id:"shihab", n:"H.H. Sayyid Shihab bin Tariq Al Said", t:0, p:84, s:"defense", roles:[
    ["com_om","Deputy Prime Minister for Defence Affairs","political","v"]]},
  {id:"fahd", n:"H.H. Sayyid Fahd bin Mahmoud Al Said", t:0, p:76, s:"gov", roles:[
    ["com_om","Deputy Prime Minister for Cabinet Affairs","political","ns"]]},
  {id:"badr_fm", n:"Sayyid Badr bin Hamad Albusaidi", t:1, p:80, s:"gov", roles:[
    ["mofa_om","Foreign Minister","political","v"]],
    note:"The face of Oman's quiet-mediator diplomacy."},
  {id:"habsi", n:"Sultan bin Salim Al Habsi", t:1, p:80, s:"finance", roles:[
    ["mof_om","Minister of Finance","political","v"]]},
  {id:"yousef_om", n:"Qais bin Mohammed Al Yousef", t:1, p:70, s:"gov", roles:[
    ["moci_om","Minister of Commerce, Industry & Investment Promotion","political","v"]]},
  {id:"murshidi", n:"Abdulsalam Al Murshidi", t:1, p:82, s:"sovereign", roles:[
    ["oia","President","executive","v"]],
    note:"Controls the consolidated sovereign portfolio — OQ, Asyad, Omantel and most state companies sit under OIA."},
  {id:"mamari_oq", n:"Ashraf Hamed Al Mamari", t:2, p:66, s:"energy", roles:[
    ["oq","Group CEO","executive","ns"]]},
  {id:"alkindi_asyad", n:"Dr. Ahmed Al Bulushi", t:2, p:58, s:"transport", roles:[
    ["asyad","Group CEO (acting)","executive","ns"]]},
  {id:"suhail_bahwan", n:"Suhail Bahwan", t:2, p:70, s:"conglomerate", roles:[
    ["bahwan","Founder & Chairman","board","v"]]},
  {id:"mohammed_zubair", n:"Mohammed Al Zubair", t:2, p:62, s:"conglomerate", roles:[
    ["zubair","Chairman (family)","board","ns"]]},
];

const OWNERSHIP = [
  ["com_om","omgov","governs under"],
  ["mof_om","com_om"],["mofa_om","com_om"],["moci_om","com_om"],
  ["cbo","omgov"],
  ["oia","omgov","sovereign fund"],
  ["oq","oia"],["asyad","oia"],["omantel","oia","majority"],["omran","oia"],
  ["omanair","oia","state owner","ns"],
  ["pdo","omgov","60% state","ns"],
  ["omanlng","oq","majority stake","ns"],
  ["opaz","com_om"],["duqm","opaz"],["soharport","opaz","oversight","ns"],
  ["bankmuscat","oia","anchor state stakes","ns"],
];

const FAMILY = [
  ["haitham","theyazin","father–son"],
  ["haitham","shihab","brothers"],
  ["haitham","fahd","kin (Al Said)"],
];

const AKA = {
  haitham:["Sultan Haitham"],
  badr_fm:["Badr Albusaidi","Badr al-Busaidi"],
  oia:["Oman Investment Authority"],
  oq:["OQ"],
  pdo:["Petroleum Development Oman"],
};
