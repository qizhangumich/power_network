/* ================================================================
   ABU DHABI POWER NETWORK — V2 DATASET
   Layers (tier): 0 = Ruling Core · 1 = Sovereign Capital & State · 2 = Operators & Sector Leaders
   verification: "v" = well-established public fact · "ns" = needs official source check
   Edit this block to grow the map; everything below it is the engine.
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
};

/* ---------------- INSTITUTIONS ----------------
   {id, n:name, s:sector, t:tier, p:power(0-100), short?} */
const INSTITUTIONS = [
  // — Government core
  {id:"adgov",      n:"Abu Dhabi Government (Ruler's Court)", s:"gov", t:0, p:100, short:"AD Govt"},
  {id:"prescourt",  n:"UAE Presidential Court",               s:"gov", t:0, p:95,  short:"Pres. Court"},
  {id:"fedgov",     n:"UAE Cabinet / Federal Government",     s:"gov", t:0, p:92,  short:"UAE Cabinet"},
  {id:"execcouncil",n:"Abu Dhabi Executive Council",          s:"gov", t:0, p:96,  short:"Exec Council"},
  {id:"scfea",      n:"Supreme Council for Financial & Economic Affairs", s:"gov", t:0, p:95, short:"SCFEA"},
  {id:"eaa",        n:"Executive Affairs Authority",          s:"gov", t:1, p:82,  short:"EAA"},
  {id:"dof",        n:"Department of Finance",                s:"gov", t:1, p:88,  short:"DoF"},
  {id:"added",      n:"Department of Economic Development",   s:"gov", t:1, p:85,  short:"ADDED"},
  {id:"doe",        n:"Department of Energy",                 s:"gov", t:1, p:82,  short:"DoE"},
  {id:"doh",        n:"Department of Health",                 s:"gov", t:1, p:82,  short:"DoH"},
  {id:"dmt",        n:"Department of Municipalities & Transport", s:"gov", t:1, p:83, short:"DMT"},
  {id:"dge",        n:"Department of Government Enablement",  s:"gov", t:1, p:78,  short:"DGE"},
  {id:"adek",       n:"Department of Education & Knowledge",  s:"gov", t:1, p:78,  short:"ADEK"},
  {id:"dct",        n:"Department of Culture & Tourism",      s:"gov", t:1, p:80,  short:"DCT"},
  {id:"dcd",        n:"Department of Community Development",  s:"gov", t:1, p:72,  short:"DCD"},
  {id:"ead",        n:"Environment Agency – Abu Dhabi",       s:"environment", t:1, p:76, short:"EAD"},
  {id:"adafsa",     n:"Abu Dhabi Agriculture & Food Safety Authority", s:"agrifood", t:2, p:66, short:"ADAFSA"},
  {id:"adio",       n:"Abu Dhabi Investment Office",          s:"gov", t:1, p:76,  short:"ADIO"},
  {id:"admo",       n:"Abu Dhabi Media Office",               s:"media", t:1, p:72, short:"AD Media Office"},
  {id:"mofa",       n:"UAE Ministry of Foreign Affairs",      s:"gov", t:1, p:84,  short:"MoFA"},
  {id:"cbuae",      n:"Central Bank of the UAE",              s:"finance", t:1, p:86, short:"CBUAE"},
  {id:"sca",        n:"Securities & Commodities Authority",   s:"finance", t:2, p:70, short:"SCA"},
  {id:"spaceagency",n:"UAE Space Agency",                     s:"tech", t:2, p:70,  short:"Space Agency"},
  {id:"tawazun",    n:"Tawazun Council",                      s:"defense", t:1, p:76, short:"Tawazun"},
  {id:"atrc",       n:"Advanced Technology Research Council", s:"tech", t:1, p:76,  short:"ATRC"},
  // — Sovereign capital
  {id:"adia",       n:"Abu Dhabi Investment Authority",       s:"sovereign", t:1, p:97, short:"ADIA"},
  {id:"mubadala",   n:"Mubadala Investment Company",          s:"sovereign", t:1, p:96, short:"Mubadala"},
  {id:"adq",        n:"ADQ",                                  s:"sovereign", t:1, p:94, short:"ADQ"},
  {id:"ihc",        n:"International Holding Company",        s:"sovereign", t:1, p:92, short:"IHC"},
  {id:"royalgroup", n:"Royal Group",                          s:"sovereign", t:1, p:88, short:"Royal Group"},
  {id:"chimera",    n:"Chimera Investments",                  s:"sovereign", t:2, p:78, short:"Chimera"},
  {id:"lunate",     n:"Lunate",                               s:"sovereign", t:2, p:76, short:"Lunate"},
  {id:"mgx",        n:"MGX",                                  s:"sovereign", t:1, p:84, short:"MGX"},
  {id:"twopointzero",n:"2PointZero",                          s:"sovereign", t:2, p:74, short:"2PointZero"},
  {id:"alphadhabi", n:"Alpha Dhabi Holding",                  s:"sovereign", t:2, p:80, short:"Alpha Dhabi"},
  {id:"multiply",   n:"Multiply Group",                       s:"sovereign", t:2, p:72, short:"Multiply"},
  {id:"eia",        n:"Emirates Investment Authority",        s:"sovereign", t:1, p:80, short:"EIA"},
  {id:"hub71",      n:"Hub71",                                s:"tech", t:2, p:68, short:"Hub71"},
  // — Energy & utilities
  {id:"adnoc",      n:"ADNOC Group",                          s:"energy", t:1, p:97, short:"ADNOC"},
  {id:"xrg",        n:"XRG (ADNOC international investment)", s:"energy", t:2, p:80, short:"XRG"},
  {id:"adnocgas",   n:"ADNOC Gas",                            s:"energy", t:2, p:78, short:"ADNOC Gas"},
  {id:"adnocdrill", n:"ADNOC Drilling",                       s:"energy", t:2, p:72, short:"ADNOC Drilling"},
  {id:"adnocls",    n:"ADNOC Logistics & Services",           s:"energy", t:2, p:70, short:"ADNOC L&S"},
  {id:"adnocdist",  n:"ADNOC Distribution",                   s:"energy", t:2, p:72, short:"ADNOC Dist."},
  {id:"borouge",    n:"Borouge",                              s:"industry", t:2, p:74, short:"Borouge"},
  {id:"fertiglobe", n:"Fertiglobe",                           s:"industry", t:2, p:68, short:"Fertiglobe"},
  {id:"masdar",     n:"Masdar",                               s:"utilities", t:1, p:82, short:"Masdar"},
  {id:"taqa",       n:"TAQA Group",                           s:"utilities", t:1, p:86, short:"TAQA"},
  {id:"ewec",       n:"Emirates Water & Electricity Company", s:"utilities", t:2, p:78, short:"EWEC"},
  {id:"enec",       n:"Emirates Nuclear Energy Company (Barakah)", s:"utilities", t:1, p:80, short:"ENEC"},
  // — Finance
  {id:"fab",        n:"First Abu Dhabi Bank",                 s:"finance", t:1, p:88, short:"FAB"},
  {id:"adcb",       n:"Abu Dhabi Commercial Bank",            s:"finance", t:1, p:82, short:"ADCB"},
  {id:"adib",       n:"Abu Dhabi Islamic Bank",               s:"finance", t:2, p:76, short:"ADIB"},
  {id:"wio",        n:"Wio Bank",                             s:"finance", t:2, p:62, short:"Wio"},
  {id:"adx",        n:"Abu Dhabi Securities Exchange",        s:"finance", t:2, p:72, short:"ADX"},
  {id:"adgm",       n:"Abu Dhabi Global Market",              s:"finance", t:1, p:84, short:"ADGM"},
  // — Tech / AI / Space / Telecom
  {id:"g42",        n:"G42",                                  s:"tech", t:1, p:90, short:"G42"},
  {id:"core42",     n:"Core42",                               s:"tech", t:2, p:72, short:"Core42"},
  {id:"presight",   n:"Presight AI",                          s:"tech", t:2, p:70, short:"Presight"},
  {id:"space42",    n:"Space42",                              s:"tech", t:2, p:74, short:"Space42"},
  {id:"khazna",     n:"Khazna Data Centers",                  s:"tech", t:2, p:70, short:"Khazna"},
  {id:"mbzuai",     n:"Mohamed bin Zayed University of AI",   s:"education", t:2, p:72, short:"MBZUAI"},
  {id:"e_and",      n:"e& (Etisalat Group)",                  s:"telecom", t:1, p:84, short:"e&"},
  {id:"tii",        n:"Technology Innovation Institute",      s:"tech", t:2, p:66, short:"TII"},
  // — Defense
  {id:"edge_grp",   n:"EDGE Group",                           s:"defense", t:1, p:84, short:"EDGE"},
  {id:"calidus",    n:"Calidus Holding",                      s:"defense", t:2, p:60, short:"Calidus"},
  // — Health
  {id:"purehealth", n:"PureHealth",                           s:"health", t:1, p:80, short:"PureHealth"},
  {id:"seha",       n:"SEHA (AD Health Services)",            s:"health", t:2, p:66, short:"SEHA"},
  {id:"daman",      n:"Daman (National Health Insurance)",    s:"health", t:2, p:62, short:"Daman"},
  {id:"m42",        n:"M42",                                  s:"health", t:2, p:74, short:"M42"},
  {id:"ccad",       n:"Cleveland Clinic Abu Dhabi",           s:"health", t:2, p:64, short:"CCAD"},
  {id:"burjeel",    n:"Burjeel Holdings",                     s:"health", t:2, p:68, short:"Burjeel"},
  // — Real estate & urban
  {id:"aldar",      n:"Aldar Properties",                     s:"realestate", t:1, p:82, short:"Aldar"},
  {id:"modon",      n:"Modon Holding",                        s:"realestate", t:2, p:74, short:"Modon"},
  {id:"adnh",       n:"Abu Dhabi National Hotels",            s:"realestate", t:2, p:60, short:"ADNH"},
  // — Transport
  {id:"adports",    n:"AD Ports Group",                       s:"transport", t:1, p:82, short:"AD Ports"},
  {id:"etihad",     n:"Etihad Airways",                       s:"transport", t:1, p:80, short:"Etihad"},
  {id:"adairports", n:"Abu Dhabi Airports",                   s:"transport", t:2, p:72, short:"AD Airports"},
  {id:"etihadrail", n:"Etihad Rail",                          s:"transport", t:2, p:74, short:"Etihad Rail"},
  {id:"itc",        n:"Integrated Transport Centre",          s:"transport", t:2, p:62, short:"ITC"},
  // — Industry & agrifood
  {id:"ega",        n:"Emirates Global Aluminium",            s:"industry", t:1, p:78, short:"EGA"},
  {id:"emsteel",    n:"EMSTEEL (Emirates Steel Arkan)",       s:"industry", t:2, p:70, short:"EMSTEEL"},
  {id:"strata",     n:"Strata Manufacturing",                 s:"industry", t:2, p:62, short:"Strata"},
  {id:"nmdc",       n:"NMDC Group",                           s:"industry", t:2, p:68, short:"NMDC"},
  {id:"agthia",     n:"Agthia Group",                         s:"agrifood", t:2, p:66, short:"Agthia"},
  {id:"silal",      n:"Silal",                                s:"agrifood", t:2, p:60, short:"Silal"},
  {id:"aldahra",    n:"Al Dahra Holding",                     s:"agrifood", t:2, p:62, short:"Al Dahra"},
  {id:"lulu",       n:"LuLu Group International",             s:"agrifood", t:2, p:72, short:"LuLu"},
  // — Culture, tourism, sport, media
  {id:"miral",      n:"Miral (Yas Island / destinations)",    s:"culture", t:2, p:76, short:"Miral"},
  {id:"adnec",      n:"ADNEC Group",                          s:"culture", t:2, p:70, short:"ADNEC"},
  {id:"louvre",     n:"Louvre Abu Dhabi",                     s:"culture", t:2, p:62, short:"Louvre AD"},
  {id:"flash",      n:"Flash Entertainment",                  s:"culture", t:2, p:58, short:"Flash"},
  {id:"cfg",        n:"City Football Group / Manchester City",s:"culture", t:2, p:72, short:"CFG"},
  {id:"imi",        n:"International Media Investments",      s:"media", t:2, p:72, short:"IMI"},
  {id:"skynewsarabia", n:"Sky News Arabia",                   s:"media", t:2, p:60, short:"Sky News Arabia"},
  {id:"thenational",n:"The National",                         s:"media", t:2, p:58, short:"The National"},
  // — Education
  {id:"khalifa_u",  n:"Khalifa University",                   s:"education", t:2, p:68, short:"Khalifa Uni"},
  {id:"nyuad",      n:"NYU Abu Dhabi",                        s:"education", t:2, p:66, short:"NYUAD"},
  {id:"sorbonne",   n:"Sorbonne University Abu Dhabi",        s:"education", t:2, p:58, short:"Sorbonne AD"},
  {id:"zayed_u",    n:"Zayed University",                     s:"education", t:2, p:60, short:"Zayed Uni"},
  {id:"uaeu",       n:"United Arab Emirates University",      s:"education", t:2, p:64, short:"UAEU"},
  // — Environment / waste
  {id:"tadweer",    n:"Tadweer Group",                        s:"environment", t:2, p:64, short:"Tadweer"},
  // — Family conglomerates
  {id:"alnowais",   n:"Al Nowais Investments",                s:"conglomerate", t:2, p:62, short:"Al Nowais Inv."},
  {id:"almasaood",  n:"Al Masaood Group",                     s:"conglomerate", t:2, p:62, short:"Al Masaood"},
  {id:"alfahim",    n:"Al Fahim Group",                       s:"conglomerate", t:2, p:60, short:"Al Fahim"},
  {id:"binhamoodah",n:"Bin Hamoodah Group",                   s:"conglomerate", t:2, p:56, short:"Bin Hamoodah"},
  {id:"dasholding", n:"Das Holding",                          s:"conglomerate", t:2, p:58, short:"Das Holding"},
  {id:"aljaber",    n:"Al Jaber Group",                       s:"conglomerate", t:2, p:60, short:"Al Jaber"},
  {id:"nationalholding", n:"National Holding",                s:"conglomerate", t:2, p:62, short:"National Holding"},
];

/* ---------------- PEOPLE ----------------
   {id, n:name, t:tier, p:power, s:primary sector,
    roles:[[instId, title, type(political|government|board|executive|ownership), verif]], note?} */
const PEOPLE = [
  // ===== TIER 0 — RULING CORE =====
  {id:"mbz", n:"H.H. Sheikh Mohamed bin Zayed Al Nahyan", t:0, p:100, s:"gov", roles:[
    ["adgov","President of the UAE · Ruler of Abu Dhabi","political","v"],
    ["scfea","Chairman","political","v"],
    ["mubadala","Chairman","board","v"]],
    note:"Apex of the network. Ultimate authority over Abu Dhabi's sovereign capital and strategic direction."},
  {id:"khaled", n:"H.H. Sheikh Khaled bin Mohamed bin Zayed Al Nahyan", t:0, p:98, s:"gov", roles:[
    ["adgov","Crown Prince of Abu Dhabi","political","v"],
    ["execcouncil","Chairman","political","v"]],
    note:"Son of MBZ. Runs the day-to-day machinery of Abu Dhabi government via the Executive Council."},
  {id:"tahnoun", n:"H.H. Sheikh Tahnoon bin Zayed Al Nahyan", t:0, p:99, s:"sovereign", roles:[
    ["adgov","Deputy Ruler of Abu Dhabi","political","v"],
    ["fedgov","UAE National Security Advisor","political","v"],
    ["adia","Chairman","board","v"],
    ["adq","Chairman","board","v"],
    ["fab","Chairman","board","v"],
    ["ihc","Chairman","board","v"],
    ["royalgroup","Chairman","board","v"],
    ["g42","Chairman","board","v"],
    ["mgx","Chairman","board","v"]],
    note:"The single most connected node in Abu Dhabi business: security portfolio plus chairmanship of both giant SWFs and the IHC/G42/Royal Group commercial empire."},
  {id:"mansour", n:"H.H. Sheikh Mansour bin Zayed Al Nahyan", t:0, p:97, s:"gov", roles:[
    ["fedgov","Vice President · Deputy Prime Minister","political","v"],
    ["prescourt","Minister of the Presidential Court","political","v"],
    ["cbuae","Chairman of the Board","board","v"],
    ["eia","Chairman","board","v"],
    ["cfg","Owner","ownership","v"],
    ["imi","Owner","ownership","v"]],
    note:"Controls the Presidential Court, federal financial levers, and the highest-profile sports/media holdings."},
  {id:"hazza", n:"H.H. Sheikh Hazza bin Zayed Al Nahyan", t:0, p:90, s:"gov", roles:[
    ["adgov","Deputy Ruler of Abu Dhabi","political","v"]]},
  {id:"abdullah_bz", n:"H.H. Sheikh Abdullah bin Zayed Al Nahyan", t:0, p:92, s:"gov", roles:[
    ["fedgov","Deputy Prime Minister","political","v"],
    ["mofa","Minister of Foreign Affairs","political","v"]]},
  {id:"saif_bz", n:"H.H. Sheikh Saif bin Zayed Al Nahyan", t:0, p:91, s:"gov", roles:[
    ["fedgov","Deputy Prime Minister · Minister of Interior","political","v"]]},
  {id:"hamdan_bz", n:"H.H. Sheikh Hamdan bin Zayed Al Nahyan", t:0, p:88, s:"gov", roles:[
    ["adgov","Ruler's Representative, Al Dhafra Region","political","v"],
    ["ead","Chairman","board","v"]]},
  {id:"hamed_bz", n:"H.H. Sheikh Hamed bin Zayed Al Nahyan", t:0, p:93, s:"sovereign", roles:[
    ["adia","Managing Director","executive","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"theyab", n:"H.H. Sheikh Theyab bin Mohamed bin Zayed Al Nahyan", t:0, p:91, s:"gov", roles:[
    ["prescourt","Deputy Chairman (Development & Fallen Heroes' Affairs)","political","v"],
    ["etihadrail","Chairman","board","v"]]},
  {id:"nahyan_bm", n:"H.H. Sheikh Nahyan bin Mubarak Al Nahyan", t:0, p:80, s:"gov", roles:[
    ["fedgov","Minister of Tolerance & Coexistence","political","v"]]},
  {id:"shakhbout_bn", n:"H.H. Sheikh Shakhbout bin Nahyan Al Nahyan", t:0, p:74, s:"gov", roles:[
    ["fedgov","Minister of State","political","v"]]},

  // ===== TIER 1 — STATE & CAPITAL OPERATORS =====
  {id:"khaldoon", n:"Khaldoon Khalifa Al Mubarak", t:1, p:96, s:"sovereign", roles:[
    ["mubadala","Managing Director & Group CEO","executive","v"],
    ["eaa","Chairman","government","v"],
    ["adcb","Chairman","board","v"],
    ["enec","Chairman","board","v"],
    ["cfg","Chairman","board","v"]],
    note:"MBZ's key business emissary; bridges sovereign capital, banking, nuclear energy and global sport."},
  {id:"sultan_jaber", n:"Dr. Sultan Ahmed Al Jaber", t:1, p:96, s:"energy", roles:[
    ["fedgov","Minister of Industry & Advanced Technology","political","v"],
    ["adnoc","Managing Director & Group CEO","executive","v"],
    ["masdar","Chairman","board","v"],
    ["xrg","Executive Chairman","board","v"],
    ["mbzuai","Chairman, Board of Trustees","board","ns"]],
    note:"Runs the hydrocarbon engine and its clean-energy / AI diversification arms; COP28 President."},
  {id:"jassem_zaabi", n:"Jassem Mohamed Bu Ataba Al Zaabi", t:1, p:95, s:"gov", roles:[
    ["dof","Chairman","government","v"],
    ["e_and","Chairman","board","v"],
    ["execcouncil","Member","political","v"]],
    note:"Controls the emirate's treasury and chairs the telecom giant."},
  {id:"ahmed_jasim_zaabi", n:"Ahmed Jasim Al Zaabi", t:1, p:90, s:"finance", roles:[
    ["added","Chairman","government","v"],
    ["adgm","Chairman","government","v"],
    ["execcouncil","Member","political","v"]],
    note:"Gatekeeper for economic policy and the financial free zone."},
  {id:"alsuwaidi_adq", n:"Mohamed Hassan Alsuwaidi", t:1, p:92, s:"sovereign", roles:[
    ["fedgov","UAE Minister of Investment","political","v"],
    ["adq","Managing Director & CEO","executive","v"],
    ["taqa","Chairman","board","v"]]},
  {id:"syed_basar", n:"Syed Basar Shueb", t:1, p:85, s:"sovereign", roles:[
    ["ihc","CEO","executive","v"]],
    note:"Operates Tahnoon's listed conglomerate (IHC), one of the largest listed companies in the Middle East."},
  {id:"faisal_bannai", n:"Faisal Al Bannai", t:1, p:88, s:"defense", roles:[
    ["prescourt","Adviser for Strategic Research & Advanced Technology Affairs","political","v"],
    ["atrc","Secretary-General","government","v"],
    ["edge_grp","Chairman","board","ns"]],
    note:"Architect of the UAE's sovereign tech & Falcon AI model push; founded EDGE."},
  {id:"peng_xiao", n:"Peng Xiao", t:1, p:88, s:"tech", roles:[
    ["g42","Group CEO","executive","v"],
    ["mgx","Board Member","board","v"]],
    note:"Runs the G42 AI constellation; the operator of the Tahnoon tech ecosystem."},
  {id:"yousef_otaiba", n:"Yousef Al Otaiba", t:1, p:87, s:"gov", roles:[
    ["mofa","UAE Ambassador to the United States · Minister of State","political","v"]],
    note:"The external face of Abu Dhabi in Washington; sits at the diplomacy–investment intersection."},
  {id:"anwar_gargash", n:"Dr. Anwar Gargash", t:1, p:82, s:"gov", roles:[
    ["prescourt","Diplomatic Adviser to the President","political","v"]]},
  {id:"shorafa", n:"Mohamed Ali Al Shorafa", t:1, p:87, s:"gov", roles:[
    ["dmt","Chairman","government","v"],
    ["etihad","Chairman, Etihad Aviation Group","board","v"],
    ["sca","Chairman","government","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"mansoori_doh", n:"Mansoor Ibrahim Al Mansoori", t:1, p:85, s:"health", roles:[
    ["doh","Chairman","government","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"sara_musallam", n:"Sara Awadh Musallam", t:1, p:84, s:"education", roles:[
    ["adek","Chairman","government","v"],
    ["fedgov","Minister of State for Early Education","political","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"awaidha_marar", n:"Awaidha Murshed Al Marar", t:1, p:84, s:"utilities", roles:[
    ["doe","Chairman","government","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"kuttab", n:"Ahmed Tamim Hisham Al Kuttab", t:1, p:82, s:"gov", roles:[
    ["dge","Chairman","government","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"falah_ahbabi", n:"Falah Mohammed Al Ahbabi", t:1, p:85, s:"transport", roles:[
    ["adports","Chairman","board","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"mohamed_km", n:"Mohamed Khalifa Al Mubarak", t:1, p:88, s:"culture", roles:[
    ["dct","Chairman","government","v"],
    ["aldar","Chairman","board","v"],
    ["miral","Chairman","board","v"],
    ["execcouncil","Member","political","v"]],
    note:"Brother of Khaldoon; controls the culture–tourism–real-estate triangle."},
  {id:"mugheer_khaili", n:"Dr. Mugheer Khamis Al Khaili", t:1, p:80, s:"gov", roles:[
    ["dcd","Chairman","government","v"],
    ["execcouncil","Member","political","v"]]},
  {id:"saif_ghobash", n:"Saif Saeed Ghobash", t:1, p:80, s:"gov", roles:[
    ["execcouncil","Secretary-General","government","ns"]]},
  {id:"ahmed_mazrouei", n:"Dr. Ahmed Mubarak Al Mazrouei", t:1, p:78, s:"agrifood", roles:[
    ["adafsa","Chairman","government","ns"],
    ["execcouncil","Member","political","v"]]},
  {id:"suhail_mazrouei", n:"Suhail Al Mazrouei", t:1, p:84, s:"energy", roles:[
    ["fedgov","Minister of Energy & Infrastructure","political","v"]]},
  {id:"sarah_amiri", n:"Sarah Al Amiri", t:1, p:82, s:"education", roles:[
    ["fedgov","Minister of Education","political","v"],
    ["spaceagency","Chair","government","v"]]},
  {id:"balama", n:"Khaled Mohamed Balama", t:1, p:83, s:"finance", roles:[
    ["cbuae","Governor","executive","v"]]},
  {id:"noura_kaabi", n:"Noura Al Kaabi", t:1, p:78, s:"gov", roles:[
    ["mofa","Minister of State","political","v"]]},
  {id:"hussain_nowais", n:"Hussain Jasim Al Nowais", t:1, p:80, s:"conglomerate", roles:[
    ["emsteel","Chairman","board","v"],
    ["alnowais","Chairman","board","v"]]},
  {id:"razan", n:"Razan Khalifa Al Mubarak", t:1, p:78, s:"environment", roles:[
    ["ead","Managing Director","executive","v"]],
    note:"Sister of Khaldoon and Mohamed Khalifa Al Mubarak; also President of IUCN."},
  {id:"tareq_hosani", n:"Tareq Abdul Raheem Al Hosani", t:1, p:76, s:"defense", roles:[
    ["tawazun","Secretary-General","government","v"]]},
  {id:"ghannam", n:"Ghannam Butti Al Mazrouei", t:1, p:74, s:"finance", roles:[
    ["adx","Chairman","board","ns"]]},
  {id:"zaki", n:"Zaki Anwar Nusseibeh", t:1, p:72, s:"education", roles:[
    ["prescourt","Cultural Adviser to the President","political","v"],
    ["uaeu","Chancellor","executive","v"]]},

  // ===== TIER 2 — OPERATING EXECUTIVES & SECTOR LEADERS =====
  // Finance
  {id:"hana", n:"Hana Al Rostamani", t:2, p:82, s:"finance", roles:[["fab","Group CEO","executive","v"]]},
  {id:"alaa", n:"Ala'a Eraiqat", t:2, p:78, s:"finance", roles:[["adcb","Group CEO","executive","v"]]},
  {id:"abdelbary", n:"Mohamed Abdelbary", t:2, p:72, s:"finance", roles:[["adib","Group CEO","executive","ns"]]},
  {id:"jayesh", n:"Jayesh Patel", t:2, p:68, s:"finance", roles:[["wio","CEO","executive","v"]]},
  {id:"adx_ceo", n:"Abdulla Salem Alnuaimi", t:2, p:64, s:"finance", roles:[["adx","Group CEO","executive","ns"]]},
  // Sovereign capital operators
  {id:"waleed", n:"Waleed Al Mokarrab Al Muhairi", t:2, p:82, s:"sovereign", roles:[["mubadala","Deputy Group CEO","executive","v"]]},
  {id:"homaid", n:"Homaid Al Shimmari", t:2, p:76, s:"sovereign", roles:[["mubadala","Deputy Group CEO, Corporate & Human Capital","executive","v"]]},
  {id:"badr_olama", n:"Badr Al-Olama", t:2, p:78, s:"gov", roles:[["adio","Director-General","government","v"]]},
  {id:"ahmed_yahia", n:"Ahmed Yahia Al Idrissi", t:2, p:78, s:"sovereign", roles:[["mgx","CEO","executive","v"]]},
  {id:"khalifa_suwaidi", n:"Khalifa Sultan Al Suwaidi", t:2, p:76, s:"sovereign", roles:[
    ["adq","Chief Investment Officer","executive","v"],
    ["agthia","Chairman","board","v"],
    ["lunate","Managing Partner","executive","ns"]]},
  {id:"samia", n:"Samia Bouazza", t:2, p:70, s:"sovereign", roles:[["multiply","Group CEO","executive","v"]]},
  {id:"alwan", n:"Ahmad Ali Alwan", t:2, p:64, s:"tech", roles:[["hub71","CEO","executive","v"]]},
  // Energy & utilities
  {id:"jasim_thabet", n:"Jasim Husain Thabet", t:2, p:84, s:"utilities", roles:[["taqa","Group CEO & Managing Director","executive","v"]]},
  {id:"alshamsi_ewec", n:"Ahmed Ali Alshamsi", t:2, p:78, s:"utilities", roles:[["ewec","CEO","executive","ns"]]},
  {id:"ramahi", n:"Mohamed Jameel Al Ramahi", t:2, p:80, s:"utilities", roles:[["masdar","CEO","executive","v"]]},
  {id:"hammadi_enec", n:"Mohamed Ibrahim Al Hammadi", t:2, p:79, s:"utilities", roles:[["enec","Managing Director & CEO","executive","v"]]},
  {id:"musabbeh", n:"Musabbeh Al Kaabi", t:2, p:78, s:"energy", roles:[["adnoc","Executive Director, Low Carbon Solutions & International Growth","executive","v"]]},
  {id:"abdulmunim", n:"Abdulmunim Saif Al Kindy", t:2, p:70, s:"energy", roles:[["adnoc","Executive Director, Upstream","executive","ns"]]},
  {id:"fatema", n:"Fatema Al Nuaimi", t:2, p:74, s:"energy", roles:[["adnocgas","CEO","executive","ns"]]},
  {id:"seiari", n:"Abdulrahman Al Seiari", t:2, p:70, s:"energy", roles:[["adnocdrill","CEO","executive","ns"]]},
  {id:"masabi", n:"Capt. Abdulkareem Al Masabi", t:2, p:70, s:"energy", roles:[["adnocls","CEO","executive","ns"]]},
  {id:"lamki", n:"Bader Saeed Al Lamki", t:2, p:70, s:"energy", roles:[["adnocdist","CEO","executive","v"]]},
  {id:"hazeem", n:"Hazeem Sultan Al Suwaidi", t:2, p:70, s:"industry", roles:[["borouge","CEO","executive","v"]]},
  // Tech / AI / space / telecom
  {id:"talal_kaissi", n:"Talal Al Kaissi", t:2, p:70, s:"tech", roles:[["core42","CEO (acting)","executive","ns"]]},
  {id:"thomas", n:"Thomas Pramotedham", t:2, p:68, s:"tech", roles:[["presight","CEO","executive","v"]]},
  {id:"karim", n:"Karim Michel Sabbagh", t:2, p:72, s:"tech", roles:[["space42","Managing Director","executive","v"]]},
  {id:"alnaqbi", n:"Hassan Alnaqbi", t:2, p:70, s:"tech", roles:[["khazna","CEO","executive","v"]]},
  {id:"najwa", n:"Dr. Najwa Aaraj", t:2, p:68, s:"tech", roles:[["tii","CEO","executive","v"]]},
  {id:"eric_xing", n:"Prof. Eric Xing", t:2, p:70, s:"education", roles:[["mbzuai","President","executive","v"]]},
  {id:"hatem", n:"Hatem Dowidar", t:2, p:80, s:"telecom", roles:[["e_and","Group CEO","executive","v"]]},
  // Defense
  {id:"hamad_marar", n:"Hamad Al Marar", t:2, p:78, s:"defense", roles:[["edge_grp","Managing Director & CEO","executive","v"]]},
  // Health
  {id:"shaista", n:"Shaista Asif", t:2, p:74, s:"health", roles:[["purehealth","Group CEO","executive","v"]]},
  {id:"hasan_nowais", n:"Hasan Jasem Al Nowais", t:2, p:72, s:"health", roles:[["m42","Managing Director & Group CEO","executive","v"]]},
  {id:"shamsheer", n:"Dr. Shamsheer Vayalil", t:2, p:74, s:"health", roles:[["burjeel","Founder & Chairman","board","v"]]},
  // Real estate & urban
  {id:"talal_dhiyebi", n:"Talal Al Dhiyebi", t:2, p:78, s:"realestate", roles:[["aldar","Group CEO","executive","v"]]},
  {id:"bill_oregan", n:"Bill O'Regan", t:2, p:70, s:"realestate", roles:[["modon","Group CEO","executive","v"]]},
  // Transport
  {id:"shamisi_ports", n:"Capt. Mohamed Juma Al Shamisi", t:2, p:80, s:"transport", roles:[["adports","Managing Director & Group CEO","executive","v"]]},
  {id:"neves", n:"Antonoaldo Neves", t:2, p:74, s:"transport", roles:[["etihad","CEO","executive","v"]]},
  {id:"elena", n:"Elena Sorlini", t:2, p:70, s:"transport", roles:[["adairports","Managing Director & CEO","executive","v"]]},
  {id:"shadi", n:"Shadi Malak", t:2, p:72, s:"transport", roles:[["etihadrail","CEO","executive","v"]]},
  // Industry & agrifood
  {id:"saeed_remeithi", n:"Saeed Ghumran Al Remeithi", t:2, p:68, s:"industry", roles:[["emsteel","Group CEO","executive","v"]]},
  {id:"binkalban", n:"Abdulnasser bin Kalban", t:2, p:72, s:"industry", roles:[["ega","CEO","executive","v"]]},
  {id:"ismail_abdulla", n:"Ismail Ali Abdulla", t:2, p:64, s:"industry", roles:[["strata","CEO","executive","ns"]]},
  {id:"zaghloul", n:"Yasser Zaghloul", t:2, p:68, s:"industry", roles:[["nmdc","Group CEO","executive","v"]]},
  {id:"alan_smith", n:"Alan Smith", t:2, p:62, s:"agrifood", roles:[["agthia","Group CEO","executive","ns"]]},
  {id:"yusuffali", n:"Yusuff Ali M.A.", t:2, p:78, s:"agrifood", roles:[["lulu","Chairman & Managing Director","board","v"]],
    note:"Abu Dhabi-based retail magnate; one of the most influential expatriate business figures in the Gulf."},
  // Culture / media / environment
  {id:"miral_zaabi", n:"Mohamed Abdalla Al Zaabi", t:2, p:72, s:"culture", roles:[["miral","Group CEO","executive","v"]]},
  {id:"humaid_dhaheri", n:"Humaid Matar Al Dhaheri", t:2, p:68, s:"culture", roles:[["adnec","Managing Director & Group CEO","executive","v"]]},
  {id:"lickrish", n:"John Lickrish", t:2, p:62, s:"culture", roles:[["flash","CEO","executive","v"]]},
  {id:"rani", n:"Rani Raad", t:2, p:68, s:"media", roles:[["imi","CEO","executive","v"]]},
  {id:"shaikha_dhaheri", n:"Dr. Shaikha Salem Al Dhaheri", t:2, p:74, s:"environment", roles:[["ead","Secretary-General","executive","v"]]},
  {id:"ali_tadweer", n:"Ali Al Dhaheri", t:2, p:64, s:"environment", roles:[["tadweer","Managing Director & CEO","executive","ns"]]},
  // Family conglomerates
  {id:"mohamed_butti", n:"Sheikh Mohamed bin Butti Al Hamed", t:2, p:66, s:"conglomerate", roles:[["dasholding","Chairman","board","ns"]]},
  {id:"obaid_aljaber", n:"Obaid Khaleefa Al Jaber", t:2, p:62, s:"conglomerate", roles:[["aljaber","Chairman","board","ns"]]},
];

/* ---------------- OWNERSHIP / CONTROL EDGES ----------------
   [childId, parentId, label, verif] */
const OWNERSHIP = [
  ["execcouncil","adgov","governs under"],
  ["scfea","adgov","reports to"],
  ["eaa","adgov","reports to"],
  ["dof","execcouncil"],["added","execcouncil"],["doe","execcouncil"],["doh","execcouncil"],
  ["dmt","execcouncil"],["dge","execcouncil"],["adek","execcouncil"],["dct","execcouncil"],
  ["dcd","execcouncil"],["ead","execcouncil"],["adafsa","execcouncil"],
  ["adio","added","reports to","ns"],
  ["admo","adgov"],
  ["itc","dmt"],
  ["mofa","fedgov"],["cbuae","fedgov"],["sca","fedgov"],["spaceagency","fedgov"],
  ["eia","fedgov"],
  ["tawazun","adgov"],["atrc","adgov"],["tii","atrc"],
  ["adia","adgov"],["mubadala","adgov"],["adq","adgov"],
  ["adnoc","scfea","state owner"],
  ["xrg","adnoc"],["adnocgas","adnoc"],["adnocdrill","adnoc"],["adnocls","adnoc"],
  ["adnocdist","adnoc"],["borouge","adnoc"],["fertiglobe","adnoc"],
  ["masdar","adnoc","co-shareholder"],["masdar","taqa","co-shareholder"],["masdar","mubadala","co-shareholder"],
  ["taqa","adq","majority"],["ewec","adq"],["enec","adgov","state owner","ns"],
  ["fab","mubadala","anchor shareholder"],["adcb","mubadala","majority"],
  ["wio","adq","lead shareholder"],["adx","adq"],
  ["adgm","adgov"],
  ["ihc","royalgroup","affiliated","ns"],
  ["chimera","royalgroup"],["lunate","chimera"],
  ["twopointzero","ihc"],["alphadhabi","ihc"],["multiply","ihc"],
  ["aldar","alphadhabi","major shareholder"],["aldar","mubadala","major shareholder"],
  ["modon","adq","anchor shareholder","ns"],
  ["nmdc","alphadhabi","major shareholder"],
  ["g42","royalgroup","affiliated","ns"],
  ["core42","g42"],["presight","g42"],["khazna","g42"],
  ["space42","g42","co-shareholder"],["space42","mubadala","co-shareholder"],
  ["mgx","mubadala","founding partner"],["mgx","g42","founding partner"],
  ["e_and","eia","majority (federal)"],
  ["edge_grp","adgov","state owner"],
  ["purehealth","ihc","major shareholder"],["purehealth","adq","major shareholder"],
  ["seha","purehealth"],["daman","purehealth"],
  ["m42","mubadala","JV partner"],["m42","g42","JV partner"],["ccad","m42"],
  ["adports","adq","majority"],["etihad","adq"],["adairports","adq"],
  ["etihadrail","adgov","state owner","ns"],
  ["ega","mubadala","50% shareholder"],
  ["emsteel","adq","majority (SENAAT)"],["strata","mubadala"],
  ["agthia","adq","majority"],["silal","adq"],["aldahra","adq","strategic stake","ns"],
  ["tadweer","adq"],
  ["hub71","mubadala","founded by"],
  ["miral","adgov","state owner"],["adnec","adq"],["louvre","dct"],
  ["skynewsarabia","imi"],["thenational","imi"],
];

/* ---------------- FAMILY / PERSONAL TIES ----------------
   [personA, personB, label] */
const FAMILY = [
  ["mbz","tahnoun","brothers"],
  ["mbz","mansour","brothers"],
  ["mbz","hazza","brothers"],
  ["mbz","abdullah_bz","brothers"],
  ["mbz","saif_bz","brothers"],
  ["mbz","hamdan_bz","brothers"],
  ["mbz","hamed_bz","brothers"],
  ["mbz","khaled","father–son"],
  ["mbz","theyab","father–son"],
  ["khaled","theyab","brothers"],
  ["khaldoon","mohamed_km","brothers"],
  ["khaldoon","razan","siblings"],
  ["mohamed_km","razan","siblings"],
  ["hussain_nowais","hasan_nowais","family (Al Nowais)"],
];


/* ================================================================
   L3 — PRIVATE & INTERNATIONAL PARTNERS  (added V2.1)
   tier 3 = outer ring. Same structures as above; edit freely.
   ================================================================ */

SECTORS.professional = {name:"Professional Services", color:"#90a4ae"};

const INSTITUTIONS_L3 = [
  // — International tech
  {id:"microsoft",  n:"Microsoft",                    s:"tech", t:3, p:80, short:"Microsoft"},
  {id:"openai",     n:"OpenAI",                       s:"tech", t:3, p:74, short:"OpenAI"},
  {id:"nvidia",     n:"NVIDIA",                       s:"tech", t:3, p:74, short:"NVIDIA"},
  {id:"cerebras",   n:"Cerebras Systems",             s:"tech", t:3, p:60, short:"Cerebras"},
  {id:"huawei",     n:"Huawei UAE",                   s:"tech", t:3, p:56, short:"Huawei"},
  // — International energy majors (ADNOC concession / JV partners)
  {id:"totalenergies", n:"TotalEnergies",             s:"energy", t:3, p:72, short:"TotalEnergies"},
  {id:"bp",         n:"bp",                           s:"energy", t:3, p:70, short:"bp"},
  {id:"shell",      n:"Shell",                        s:"energy", t:3, p:70, short:"Shell"},
  {id:"exxonmobil", n:"ExxonMobil",                   s:"energy", t:3, p:70, short:"ExxonMobil"},
  {id:"eni",        n:"Eni",                          s:"energy", t:3, p:64, short:"Eni"},
  {id:"omv",        n:"OMV",                          s:"energy", t:3, p:62, short:"OMV"},
  {id:"oxy",        n:"Occidental Petroleum",         s:"energy", t:3, p:60, short:"Occidental"},
  {id:"inpex",      n:"INPEX (JODCO)",                s:"energy", t:3, p:56, short:"INPEX"},
  {id:"cnpc",       n:"CNPC",                         s:"energy", t:3, p:58, short:"CNPC"},
  {id:"kepco",      n:"KEPCO",                        s:"utilities", t:3, p:58, short:"KEPCO"},
  // — International finance & advisory
  {id:"blackrock",  n:"BlackRock",                    s:"finance", t:3, p:76, short:"BlackRock"},
  {id:"goldman",    n:"Goldman Sachs",                s:"finance", t:3, p:66, short:"Goldman Sachs"},
  {id:"moelis",     n:"Moelis & Company",             s:"finance", t:3, p:62, short:"Moelis"},
  {id:"rothschildco", n:"Rothschild & Co",            s:"finance", t:3, p:60, short:"Rothschild & Co"},
  // — Local private / listed (non-sovereign)
  {id:"waha",       n:"Waha Capital",                 s:"finance", t:3, p:62, short:"Waha Capital"},
  {id:"adnic",      n:"Abu Dhabi National Insurance Company", s:"finance", t:3, p:54, short:"ADNIC"},
  {id:"trojan",     n:"Trojan Holding",               s:"industry", t:3, p:60, short:"Trojan"},
  {id:"alisons",    n:"Ali & Sons Holding",           s:"conglomerate", t:3, p:58, short:"Ali & Sons"},
  {id:"rotana",     n:"Rotana Hotels",                s:"culture", t:3, p:62, short:"Rotana"},
  // — Professional gatekeepers (consulting, audit, law)
  {id:"mckinsey",   n:"McKinsey & Company",           s:"professional", t:3, p:64, short:"McKinsey"},
  {id:"bcg",        n:"Boston Consulting Group",      s:"professional", t:3, p:60, short:"BCG"},
  {id:"pwc",        n:"PwC Middle East",              s:"professional", t:3, p:58, short:"PwC"},
  {id:"ey",         n:"EY MENA",                      s:"professional", t:3, p:56, short:"EY"},
  {id:"kpmg",       n:"KPMG Lower Gulf",              s:"professional", t:3, p:54, short:"KPMG"},
  {id:"deloitte",   n:"Deloitte Middle East",         s:"professional", t:3, p:56, short:"Deloitte"},
  {id:"accenture",  n:"Accenture Middle East",        s:"professional", t:3, p:56, short:"Accenture"},
  {id:"altamimi",   n:"Al Tamimi & Company",          s:"professional", t:3, p:58, short:"Al Tamimi"},
  {id:"cliffordchance", n:"Clifford Chance",          s:"professional", t:3, p:52, short:"Clifford Chance"},
  // — International defense
  {id:"raytheon_em", n:"Raytheon Emirates",           s:"defense", t:3, p:58, short:"Raytheon Emirates"},
];
INSTITUTIONS.push(...INSTITUTIONS_L3);

/* NOTE: global HQ executives (Sam Altman, Jensen Huang, Larry Fink, energy-major
   CEOs, Brad Smith, …) were deliberately REMOVED — the map focuses on the local
   emirate network. The L3 companies stay as anchor nodes; the people who serve
   them locally come from your LinkedIn overlay (tools/import_linkedin.py) and can
   be promoted into PEOPLE here once their local role is verified (country manager,
   UAE managing partner, Gulf CEO, …). */
const PEOPLE_L3 = [
  {id:"essam_tamimi", n:"Essam Al Tamimi", t:3, p:60, s:"professional", roles:[
    ["altamimi","Founder & Senior Partner","executive","v"]]},
  // Local private-sector figures (tier 2 — they operate inside the emirate)
  {id:"nasser_nowais", n:"Nasser Al Nowais", t:2, p:64, s:"conglomerate", roles:[
    ["rotana","Co-founder & Chairman","board","ns"]]},
  {id:"amr_menhali", n:"Amr Al Menhali", t:2, p:60, s:"finance", roles:[
    ["waha","CEO","executive","ns"]]},
  {id:"hamad_ameri", n:"Eng. Hamad Al Ameri", t:2, p:58, s:"industry", roles:[
    ["trojan","CEO","executive","ns"]]},
  {id:"ahmed_elhoshy", n:"Ahmed El-Hoshy", t:2, p:64, s:"industry", roles:[
    ["fertiglobe","CEO","executive","v"]]},
];
PEOPLE.push(...PEOPLE_L3);

// extra role on an existing person
PEOPLE.find(p => p.id === "waleed").roles.push(["waha","Chairman","board","ns"]);

OWNERSHIP.push(
  // tech
  ["g42","microsoft","strategic investor (US$1.5B)"],
  ["openai","g42","Stargate UAE partnership"],
  ["openai","mgx","investor & Stargate partner"],
  ["g42","nvidia","AI compute partnership"],
  ["cerebras","g42","anchor customer & investor"],
  ["huawei","e_and","technology partner","ns"],
  // energy
  ["totalenergies","adnoc","concession partner"],
  ["bp","adnoc","concession partner · Arcius Energy JV (XRG)"],
  ["shell","adnoc","concession partner"],
  ["exxonmobil","adnoc","Upper Zakum partner"],
  ["eni","adnoc","concession partner"],
  ["oxy","adnoc","concession partner"],
  ["inpex","adnoc","concession partner"],
  ["cnpc","adnoc","concession partner"],
  ["omv","borouge","Borouge Group co-shareholder"],
  ["kepco","enec","Barakah JV partner"],
  // finance & advisory
  ["blackrock","mgx","AI Infrastructure Partnership (AIP)"],
  ["nvidia","mgx","AI Infrastructure Partnership (AIP)"],
  ["goldman","adgm","regional office (ADGM)","ns"],
  ["moelis","adgm","regional office (ADGM)","ns"],
  ["rothschildco","adgm","regional office (ADGM)","ns"],
  // professional gatekeepers — generic advisory footprint, verify per-engagement
  ["mckinsey","added","government & SOE advisory ecosystem","ns"],
  ["bcg","added","government & SOE advisory ecosystem","ns"],
  ["pwc","added","audit & advisory ecosystem","ns"],
  ["ey","added","audit & advisory ecosystem","ns"],
  ["kpmg","added","audit & advisory ecosystem","ns"],
  ["deloitte","added","audit & advisory ecosystem","ns"],
  ["accenture","dge","digital government delivery","ns"],
  ["altamimi","adgm","ADGM & Abu Dhabi practice","ns"],
  ["cliffordchance","adgm","ADGM office","ns"],
  // local private
  ["waha","mubadala","strategic shareholder","ns"],
  ["adnic","mubadala","major shareholder","ns"],
  ["trojan","alphadhabi","subsidiary"],
  ["rotana","alnowais","co-founded (Al Nowais)","ns"],
  ["raytheon_em","tawazun","defense partnerships","ns"],
);

FAMILY.push(["hussain_nowais","nasser_nowais","family (Al Nowais)"]);

/* ---------------- ALIASES (for news matching & search) ----------------
   id → alternative names. tools/match_news.py reads this block too. */
const AKA = {
  mbz:["Mohamed bin Zayed","Mohammed bin Zayed","MBZ"],
  khaled:["Khaled bin Mohamed bin Zayed","Khaled bin Mohamed"],
  tahnoun:["Tahnoun bin Zayed","Tahnoon bin Zayed","Sheikh Tahnoon","Sheikh Tahnoun"],
  mansour:["Mansour bin Zayed"],
  abdullah_bz:["Abdullah bin Zayed"],
  sultan_jaber:["Sultan Al Jaber"],
  khaldoon:["Khaldoon Al Mubarak"],
  mohamed_km:["Mohamed Khalifa Al Mubarak"],
  jassem_zaabi:["Jassem Al Zaabi"],
  alsuwaidi_adq:["Mohamed Al Suwaidi","Mohamed Hassan Al Suwaidi"],
  adnoc:["Abu Dhabi National Oil Company"],
  e_and:["Etisalat"],
  adq:["Abu Dhabi Developmental Holding"],
  ihc:["International Holding Co"],
  adia:["Abu Dhabi Investment Authority"],
  ega:["Emirates Global Aluminium"],
  enec:["Emirates Nuclear Energy"],
};
