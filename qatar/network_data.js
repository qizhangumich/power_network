/* ================================================================
   QATAR POWER NETWORK — DATASET (V1 backbone)
   Same schema as the Abu Dhabi map. Tiers: 0 ruling core · 1 state &
   sovereign capital · 2 operators · 3 private & international.
   verification: "v" established public fact · "ns" needs source check.
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
  // — State core
  {id:"qgov",       n:"State of Qatar (Amiri Diwan)", s:"gov", t:0, p:100, short:"Amiri Diwan"},
  {id:"cabinet",    n:"Council of Ministers",         s:"gov", t:0, p:92,  short:"Cabinet"},
  {id:"shura",      n:"Shura Council",                s:"gov", t:1, p:70,  short:"Shura Council"},
  {id:"mofin",      n:"Ministry of Finance",          s:"gov", t:1, p:86,  short:"MoF"},
  {id:"mofa_q",     n:"Ministry of Foreign Affairs",  s:"gov", t:1, p:88,  short:"MoFA"},
  {id:"moi_q",      n:"Ministry of Interior",         s:"gov", t:1, p:86,  short:"MoI"},
  {id:"mod_q",      n:"Ministry of Defence",          s:"gov", t:1, p:84,  short:"MoD"},
  {id:"moci",      n:"Ministry of Commerce & Industry", s:"gov", t:1, p:78, short:"MoCI"},
  {id:"mocit",     n:"Ministry of Communications & IT", s:"gov", t:1, p:74, short:"MCIT"},
  {id:"moph",      n:"Ministry of Public Health",     s:"gov", t:1, p:78,  short:"MoPH"},
  {id:"qcb",       n:"Qatar Central Bank",            s:"finance", t:1, p:86, short:"QCB"},
  {id:"qfc",       n:"Qatar Financial Centre",        s:"finance", t:1, p:76, short:"QFC"},
  {id:"qfz",       n:"Qatar Free Zones Authority",    s:"gov", t:1, p:72,  short:"QFZ"},
  // — Sovereign capital
  {id:"qia",       n:"Qatar Investment Authority",    s:"sovereign", t:1, p:97, short:"QIA"},
  {id:"qatariddiar", n:"Qatari Diar",                 s:"realestate", t:2, p:78, short:"Qatari Diar"},
  {id:"hassad",    n:"Hassad Food",                   s:"consumer_stap", t:2, p:62, short:"Hassad"},
  {id:"katarahosp", n:"Katara Hospitality",           s:"consumer_disc", t:2, p:62, short:"Katara Hospitality"},
  // — Energy & utilities
  {id:"qatarenergy", n:"QatarEnergy",                 s:"energy", t:1, p:97, short:"QatarEnergy"},
  {id:"qelng",     n:"QatarEnergy LNG",               s:"energy", t:2, p:82, short:"QatarEnergy LNG"},
  {id:"nakilat",   n:"Nakilat (Qatar Gas Transport)", s:"energy", t:2, p:72, short:"Nakilat"},
  {id:"industriesqatar", n:"Industries Qatar",        s:"materials", t:2, p:74, short:"Industries Qatar"},
  {id:"qafco",     n:"Qatar Fertiliser Company",      s:"materials", t:2, p:66, short:"QAFCO"},
  {id:"qapco",     n:"Qatar Petrochemical Company",   s:"materials", t:2, p:62, short:"QAPCO"},
  {id:"qatalum",   n:"Qatar Aluminium (Qatalum)",     s:"materials", t:2, p:62, short:"Qatalum"},
  {id:"qewc",      n:"Qatar Electricity & Water Co",  s:"utilities", t:1, p:76, short:"QEWC"},
  {id:"nebras",    n:"Nebras Power",                  s:"utilities", t:2, p:64, short:"Nebras"},
  {id:"kahramaa",  n:"Kahramaa (General Electricity & Water)", s:"utilities", t:2, p:70, short:"Kahramaa"},
  // — Finance
  {id:"qnb",       n:"QNB Group",                     s:"finance", t:1, p:90, short:"QNB"},
  {id:"qib",       n:"Qatar Islamic Bank",            s:"finance", t:1, p:78, short:"QIB"},
  {id:"cbq",       n:"Commercial Bank of Qatar",      s:"finance", t:2, p:70, short:"Commercial Bank"},
  {id:"masraf",    n:"Masraf Al Rayan",               s:"finance", t:2, p:70, short:"Masraf Al Rayan"},
  {id:"dohabank",  n:"Doha Bank",                     s:"finance", t:2, p:64, short:"Doha Bank"},
  {id:"qse",       n:"Qatar Stock Exchange",          s:"finance", t:2, p:70, short:"QSE"},
  // — Telecom / media
  {id:"ooredoo",   n:"Ooredoo Group",                 s:"comm", t:1, p:80, short:"Ooredoo"},
  {id:"vodafoneqatar", n:"Vodafone Qatar",            s:"comm", t:2, p:60, short:"Vodafone Qatar"},
  {id:"aljazeera", n:"Al Jazeera Media Network",      s:"comm", t:1, p:86, short:"Al Jazeera"},
  {id:"bein",      n:"beIN Media Group",              s:"comm", t:1, p:78, short:"beIN"},
  // — Culture, sport
  {id:"qm",        n:"Qatar Museums",                 s:"gov", t:1, p:76, short:"Qatar Museums"},
  {id:"qoc",       n:"Qatar Olympic Committee",       s:"gov", t:1, p:72, short:"QOC"},
  {id:"qsi",       n:"Qatar Sports Investments",      s:"comm", t:1, p:76, short:"QSI"},
  {id:"psg",       n:"Paris Saint-Germain",           s:"comm", t:2, p:72, short:"PSG"},
  {id:"scdl",      n:"SC Delivery & Legacy (World Cup legacy)", s:"gov", t:2, p:64, short:"SC Legacy"},
  {id:"qta",       n:"Qatar Tourism",                 s:"gov", t:2, p:62, short:"Qatar Tourism"},
  // — Education & research
  {id:"qf",        n:"Qatar Foundation",              s:"education", t:1, p:90, short:"Qatar Foundation"},
  {id:"hbku",      n:"Hamad Bin Khalifa University",  s:"education", t:2, p:66, short:"HBKU"},
  {id:"qu",        n:"Qatar University",              s:"education", t:2, p:66, short:"Qatar University"},
  // — Health
  {id:"hmc",       n:"Hamad Medical Corporation",     s:"health", t:1, p:76, short:"HMC"},
  {id:"sidra",     n:"Sidra Medicine",                s:"health", t:2, p:66, short:"Sidra"},
  // — Real estate & urban
  {id:"msheireb",  n:"Msheireb Properties",           s:"realestate", t:2, p:66, short:"Msheireb"},
  {id:"barwa",     n:"Barwa Real Estate",             s:"realestate", t:2, p:64, short:"Barwa"},
  {id:"udc",       n:"United Development Company",    s:"realestate", t:2, p:62, short:"UDC"},
  // — Transport
  {id:"qatarairways", n:"Qatar Airways",              s:"industry", t:1, p:88, short:"Qatar Airways"},
  {id:"hia",       n:"Hamad International Airport (MATAR)", s:"industry", t:2, p:74, short:"HIA"},
  {id:"mwani",     n:"Mwani Qatar (Ports)",           s:"industry", t:2, p:64, short:"Mwani"},
  {id:"qatarrail", n:"Qatar Rail",                    s:"industry", t:2, p:62, short:"Qatar Rail"},
  {id:"milaha",    n:"Milaha (Qatar Navigation)",     s:"industry", t:2, p:64, short:"Milaha"},
  // — Defense
  {id:"barzan",    n:"Barzan Holdings",               s:"industry", t:2, p:66, short:"Barzan"},
  // — Agrifood
  {id:"baladna",   n:"Baladna",                       s:"consumer_stap", t:2, p:64, short:"Baladna"},
  // — Family conglomerates (private)
  {id:"alfaisal",  n:"Al Faisal Holding",             s:"conglomerate", t:3, p:70, short:"Al Faisal"},
  {id:"aamal",     n:"Aamal Company",                 s:"conglomerate", t:3, p:62, short:"Aamal"},
  {id:"pih",       n:"Power International Holding",   s:"conglomerate", t:3, p:68, short:"PIH"},
  {id:"mannaicorp", n:"Mannai Corporation",           s:"conglomerate", t:3, p:60, short:"Mannai"},
  {id:"alfardan",  n:"Alfardan Group",                s:"conglomerate", t:3, p:62, short:"Alfardan"},
  {id:"almana",    n:"Al Mana Group",                 s:"conglomerate", t:3, p:60, short:"Al Mana"},
  {id:"jaidah",    n:"Jaidah Group",                  s:"conglomerate", t:3, p:56, short:"Jaidah"},
  // — International energy partners (North Field / LNG)
  {id:"exxonmobil", n:"ExxonMobil",                   s:"energy", t:3, p:70, short:"ExxonMobil"},
  {id:"shell",     n:"Shell",                         s:"energy", t:3, p:70, short:"Shell"},
  {id:"totalenergies", n:"TotalEnergies",             s:"energy", t:3, p:72, short:"TotalEnergies"},
  {id:"conocophillips", n:"ConocoPhillips",           s:"energy", t:3, p:66, short:"ConocoPhillips"},
  {id:"eni",       n:"Eni",                           s:"energy", t:3, p:64, short:"Eni"},
  {id:"sinopec",   n:"Sinopec",                       s:"energy", t:3, p:60, short:"Sinopec"},
  {id:"cnpc",      n:"CNPC",                          s:"energy", t:3, p:58, short:"CNPC"},
  {id:"lst_eres", n:"Ezdan Holding Group Q.P.S.C.", s:"realestate", t:2, p:50, short:"ERES"},
  {id:"lst_mark", n:"Al Rayan Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"MARK"},
  {id:"lst_igrd", n:"Estithmar Holding Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"IGRD"},
  {id:"lst_dubk", n:"Dukhan Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"Dukhan Bank Q.P.S.C."},
  {id:"lst_qiik", n:"Qatar International Islamic Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"QIIK"},
  {id:"lst_mphc", n:"Mesaieed Petrochemical Holding Company Q.P.S.C.", s:"materials", t:2, p:50, short:"MPHC"},
  {id:"lst_qfls", n:"Qatar Fuel Company Q.P.S.C. (WOQOD)", s:"energy", t:2, p:50, short:"QFLS"},
  {id:"lst_abqk", n:"Ahli Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"Ahli Bank Q.P.S.C."},
  {id:"lst_qamc", n:"Qatar Aluminium Manufacturing Company Q.P.S.C.", s:"materials", t:2, p:50, short:"QAMC"},
  {id:"lst_qati", n:"Qatar Insurance Company Q.S.P.C.", s:"finance", t:2, p:50, short:"QATI"},
  {id:"lst_zhcd", n:"Zad Holding Company Q.P.S.C.", s:"consumer_stap", t:2, p:50, short:"ZHCD"},
  {id:"lst_giss", n:"Gulf International Services Q.P.S.C.", s:"energy", t:2, p:50, short:"GISS"},
  {id:"lst_qfbq", n:"Lesha Bank LLC", s:"finance", t:2, p:50, short:"Lesha Bank LLC"},
  {id:"lst_mers", n:"Al Meera Consumer Goods Company Q.P.S.C.", s:"consumer_stap", t:2, p:50, short:"MERS"},
  {id:"lst_qgri", n:"Qatar General Insurance & Reinsurance Company Q.P.S.C.", s:"finance", t:2, p:50, short:"QGRI"},
  {id:"lst_meza", n:"MEEZA QSTP-LLC", s:"tech", t:2, p:50, short:"MEEZA QSTP-LLC"},
  {id:"lst_qigd", n:"Qatari Investors Group Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"QIGD"},
  {id:"lst_qncd", n:"Qatar National Cement Company Q.P.S.C.", s:"materials", t:2, p:50, short:"QNCD"},
  {id:"lst_mcgs", n:"Medicare Group Q.P.S.C.", s:"health", t:2, p:50, short:"MCGS"},
  {id:"lst_dohi", n:"Doha Insurance Group Q.P.S.C.", s:"finance", t:2, p:50, short:"DOHI"},
  {id:"lst_gwcs", n:"Gulf Warehousing Company Q.P.S.C.", s:"industry", t:2, p:50, short:"GWCS"},
  {id:"lst_qisi", n:"Qatar Islamic Insurance Group Q.P.S.C.", s:"finance", t:2, p:50, short:"QISI"},
  {id:"lst_bema", n:"Damaan Islamic Insurance Company (Beema) Q.P.S.C.", s:"finance", t:2, p:50, short:"BEMA"},
  {id:"lst_qimd", n:"Qatar Industrial Manufacturing Company Q.P.S.C.", s:"materials", t:2, p:50, short:"QIMD"},
  {id:"lst_siis", n:"Salam International Investment Limited Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"SIIS"},
  {id:"lst_akhi", n:"Al Khaleej Takaful Insurance Company Q.P.S.C.", s:"finance", t:2, p:50, short:"AKHI"},
  {id:"lst_qlmi", n:"QLM Life & Medical Insurance Company Q.P.S.C.", s:"finance", t:2, p:50, short:"QLMI"},
  {id:"lst_mfms", n:"Mosanada Facility Management Services Q.P.S.C.", s:"industry", t:2, p:50, short:"MFMS"},
  {id:"lst_mrds", n:"Mazaya Real Estate Development Q.P.S.C.", s:"realestate", t:2, p:50, short:"MRDS"},
  {id:"lst_mhar", n:"Al Mahhar Holding Company Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"MHAR"},
  {id:"lst_nlcs", n:"Alijarah Holding Q.P.S.C.", s:"finance", t:2, p:50, short:"NLCS"},
  {id:"lst_mkdm", n:"Mekdam Holding Group Q.P.S.C.", s:"industry", t:2, p:50, short:"MKDM"},
  {id:"lst_dbis", n:"Dlala Brokerage and Investment Holding Company Q.P.S.C.", s:"finance", t:2, p:50, short:"DBIS"},
  {id:"lst_wdam", n:"Widam Food Company Q.P.S.C.", s:"consumer_stap", t:2, p:50, short:"WDAM"},
  {id:"lst_tqes", n:"Qatar Electronic Systems Company (Techno Q) Q.P.S.C.", s:"tech", t:2, p:50, short:"TQES"},
  {id:"lst_qcfs", n:"Qatar Cinema and Film Distribution Co. Q.P.S.C.", s:"consumer_disc", t:2, p:50, short:"QCFS"},
  {id:"lst_qgmd", n:"Qatari German Company for Medical Devices Q.P.S.C.", s:"health", t:2, p:50, short:"QGMD"},
  {id:"lst_ihgs", n:"INMA Holding Company Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"IHGS"},
  {id:"lst_falh", n:"Al Faleh Educational Holding Company Q.P.S.C.", s:"consumer_disc", t:2, p:50, short:"FALH"},
  {id:"lst_qois", n:"Qatar Oman Investment Company Q.S.C.", s:"finance", t:2, p:50, short:"QOIS"},
];

const PEOPLE = [
  // ===== TIER 0 — RULING CORE (Al Thani) =====
  {id:"tamim", n:"H.H. Sheikh Tamim bin Hamad Al Thani", t:0, p:100, s:"gov", roles:[
    ["qgov","Emir of the State of Qatar","political","v"]],
    note:"Apex of the network. Ultimate authority over Qatar's energy wealth, sovereign capital and foreign policy."},
  {id:"hamad_bk", n:"H.H. Sheikh Hamad bin Khalifa Al Thani", t:0, p:88, s:"gov", roles:[
    ["qgov","Father Emir (Emir 1995–2013)","political","v"]],
    note:"Architect of modern Qatar: LNG expansion, Al Jazeera, QIA and Qatar Foundation all date to his reign."},
  {id:"moza", n:"H.H. Sheikha Moza bint Nasser", t:0, p:92, s:"education", roles:[
    ["qf","Chairperson","board","v"]],
    note:"Co-founder and chair of Qatar Foundation; the education, science and social-development pillar of the state."},
  {id:"abdullah_dep", n:"H.H. Sheikh Abdullah bin Hamad Al Thani", t:0, p:90, s:"gov", roles:[
    ["qgov","Deputy Emir","political","v"]]},
  {id:"mbar", n:"H.E. Sheikh Mohammed bin Abdulrahman Al Thani", t:0, p:96, s:"gov", roles:[
    ["cabinet","Prime Minister","political","v"],
    ["mofa_q","Minister of Foreign Affairs","political","v"],
    ["qia","Chairman","board","v"]],
    note:"'MBAR' — combines head of government, chief diplomat and chairmanship of the sovereign wealth fund."},
  {id:"jassim_bh", n:"H.H. Sheikh Jassim bin Hamad bin Khalifa Al Thani", t:0, p:84, s:"finance", roles:[
    ["qib","Chairman","board","v"]],
    note:"The Emir's brother; chairs Qatar Islamic Bank."},
  {id:"joaan", n:"H.H. Sheikh Joaan bin Hamad Al Thani", t:0, p:80, s:"gov", roles:[
    ["qoc","President","board","v"]]},
  {id:"mayassa", n:"H.E. Sheikha Al-Mayassa bint Hamad Al Thani", t:0, p:84, s:"gov", roles:[
    ["qm","Chairperson","board","v"]],
    note:"The Emir's sister; one of the most influential figures in the global art market."},
  {id:"hind", n:"H.E. Sheikha Hind bint Hamad Al Thani", t:0, p:84, s:"education", roles:[
    ["qf","Vice Chairperson & CEO","executive","v"]]},
  {id:"khalifa_moi", n:"H.E. Sheikh Khalifa bin Hamad bin Khalifa Al Thani", t:0, p:85, s:"gov", roles:[
    ["moi_q","Minister of Interior","political","v"]]},
  {id:"bandar_qcb", n:"H.E. Sheikh Bandar bin Mohammed bin Saoud Al Thani", t:0, p:84, s:"finance", roles:[
    ["qcb","Governor","executive","v"]]},
  {id:"mohammed_bhq", n:"H.E. Sheikh Mohammed bin Hamad bin Qassim Al Thani", t:0, p:78, s:"gov", roles:[
    ["moci","Minister of Commerce & Industry","political","v"]]},
  {id:"hamad_bt_aj", n:"H.E. Sheikh Hamad bin Thamer Al Thani", t:0, p:82, s:"comm", roles:[
    ["aljazeera","Chairman","board","v"]]},
  {id:"faisal_bt", n:"H.E. Sheikh Faisal bin Thani Al Thani", t:0, p:78, s:"comm", roles:[
    ["ooredoo","Chairman","board","v"],
    ["qia","Chief Investment Officer, Africa & Asia-Pacific","executive","ns"]]},
  {id:"meshal_amb", n:"H.E. Sheikh Meshal bin Hamad Al Thani", t:0, p:78, s:"gov", roles:[
    ["mofa_q","Ambassador to the United States","political","v"]]},
  {id:"saoud_diwan", n:"H.E. Sheikh Saoud bin Abdulrahman Al Thani", t:0, p:78, s:"gov", roles:[
    ["qgov","Chief of the Amiri Diwan","political","ns"]]},
  {id:"faisal_bq", n:"H.E. Sheikh Faisal bin Qassim Al Thani", t:1, p:80, s:"conglomerate", roles:[
    ["alfaisal","Chairman","board","v"],
    ["aamal","Chairman","board","v"]],
    note:"Qatar's leading private-sector billionaire; hotels, industry, healthcare and services."},
  {id:"abdulla_cbq", n:"H.E. Sheikh Abdulla bin Ali bin Jabor Al Thani", t:1, p:68, s:"finance", roles:[
    ["cbq","Chairman","board","ns"]]},
  {id:"fahad_doha", n:"H.E. Sheikh Fahad bin Mohammad bin Jabor Al Thani", t:1, p:66, s:"finance", roles:[
    ["dohabank","Chairman","board","ns"]]},

  // ===== TIER 1 — STATE & CAPITAL OPERATORS =====
  {id:"alkaabi", n:"H.E. Saad Sherida Al-Kaabi", t:1, p:94, s:"energy", roles:[
    ["cabinet","Minister of State for Energy Affairs","political","v"],
    ["qatarenergy","President & CEO","executive","v"],
    ["qatarairways","Chairman","board","v"],
    ["industriesqatar","Chairman","board","ns"],
    ["qewc","Chairman","board","ns"]],
    note:"Runs the hydrocarbon engine — the single most consequential operator in Qatar's economy."},
  {id:"alkuwari_fin", n:"H.E. Ali bin Ahmed Al Kuwari", t:1, p:86, s:"finance", roles:[
    ["mofin","Minister of Finance","political","v"],
    ["qnb","Chairman","board","v"],
    ["masraf","Chairman","board","ns"]]},
  {id:"attiyah", n:"H.E. Khalid bin Mohamed Al Attiyah", t:1, p:82, s:"gov", roles:[
    ["cabinet","Deputy Prime Minister","political","v"],
    ["mod_q","Minister of State for Defence Affairs","political","ns"]]},
  {id:"khulaifi", n:"H.E. Dr. Mohammed Al-Khulaifi", t:1, p:76, s:"gov", roles:[
    ["mofa_q","Minister of State (chief mediator)","political","ns"]],
    note:"Qatar's lead negotiator in its signature mediation diplomacy."},
  {id:"almannai", n:"H.E. Mohammed bin Ali Al Mannai", t:1, p:74, s:"tech", roles:[
    ["mocit","Minister of Communications & IT","political","v"]]},
  {id:"hanan", n:"H.E. Dr. Hanan Mohamed Al Kuwari", t:1, p:80, s:"health", roles:[
    ["moph","Minister of Public Health","political","v"],
    ["hmc","Managing Director","executive","v"]]},
  {id:"lolwah", n:"H.E. Lolwah Al-Khater", t:1, p:74, s:"gov", roles:[
    ["cabinet","Minister of Social Development & Family","political","v"]]},
  {id:"buthaina", n:"H.E. Buthaina Al Nuaimi", t:1, p:72, s:"education", roles:[
    ["cabinet","Minister of Education & Higher Education","political","ns"]]},
  {id:"alsayed", n:"H.E. Ahmad Al-Sayed", t:1, p:80, s:"gov", roles:[
    ["cabinet","Minister of State","political","v"],
    ["qfz","Chairman","government","v"]],
    note:"Former QIA CEO; runs the free-zone platform courting global tech and logistics."},
  {id:"sowaidi", n:"Mohammed Saif Al Sowaidi", t:1, p:86, s:"sovereign", roles:[
    ["qia","Chief Executive Officer","executive","ns"]]},
  {id:"khelaifi", n:"Nasser Al-Khelaifi", t:1, p:86, s:"comm", roles:[
    ["qsi","Chairman","board","v"],
    ["bein","Chairman","board","v"],
    ["psg","President","executive","v"]],
    note:"The global face of Qatari sport and sports media — PSG, beIN, European club football politics."},
  {id:"thawadi", n:"Hassan Al Thawadi", t:1, p:76, s:"gov", roles:[
    ["scdl","Secretary-General","executive","v"]],
    note:"Delivered the 2022 World Cup; the legacy body carries the network built around it."},

  // ===== TIER 2 — OPERATING EXECUTIVES =====
  {id:"qnb_ceo", n:"Abdulla Mubarak Al-Khalifa", t:2, p:74, s:"finance", roles:[["qnb","Group CEO","executive","v"]]},
  {id:"hamad_alkhater", n:"Hamad Ali Al-Khater", t:2, p:80, s:"industry", roles:[["qatarairways","Group CEO","executive","v"]],
    note:"Group CEO since 7 Dec 2025 (from HIA COO; ex-QatarEnergy), replacing Badr Al-Meer."},
  {id:"fakhroo", n:"Aziz Aluthman Fakhroo", t:2, p:74, s:"comm", roles:[["ooredoo","Managing Director & Group CEO","executive","v"]]},
  {id:"sulaiti", n:"Abdullah Al-Sulaiti", t:2, p:68, s:"energy", roles:[["nakilat","CEO","executive","v"]]},
  {id:"jaida_qfc", n:"Yousuf Mohamed Al-Jaida", t:2, p:70, s:"finance", roles:[["qfc","CEO","executive","ns"]]},
  {id:"moutaz", n:"Moutaz Al-Khayyat", t:2, p:72, s:"conglomerate", roles:[
    ["pih","Chairman","board","v"],
    ["baladna","Chairman","board","v"]],
    note:"Construction-to-dairy empire; Baladna was Qatar's blockade-era food-security symbol."},
  {id:"alfardan_h", n:"Hussain Ibrahim Alfardan", t:2, p:70, s:"conglomerate", roles:[
    ["alfardan","Chairman","board","v"]],
    note:"Pearl-trading dynasty turned banking, luxury retail, property and hospitality group."},

  // ===== ADDED SEP 2026 — CURRENT CHAIRS / CEOs FOR PREVIOUSLY UNSTAFFED INSTITUTIONS =====
  {id:"mohannadi_lng", n:"Eng. Ahmed Hilal Al Mohannadi", t:2, p:74, s:"energy", roles:[
    ["qelng","Chief Executive Officer","executive","v"]],
    note:"Took over QatarEnergy LNG from 1 January 2026, succeeding Sheikh Khalid bin Khalifa Al Thani; overseeing the North Field expansion to 142 mtpa."},
  {id:"hamad_talal_diar", n:"H.E. Sheikh Hamad bin Talal Al Thani", t:1, p:70, s:"realestate", roles:[
    ["qatariddiar","Chief Executive Officer","executive","v"]],
    note:"Rose through Qatari Diar's international development arm before taking the CEO seat in December 2025."},
  {id:"ghanim_shura", n:"H.E. Hassan bin Abdullah Al Ghanim", t:1, p:72, s:"gov", roles:[
    ["shura","Speaker","political","v"]]},
  {id:"alansari_qse", n:"Abdullah Mohammed Al-Ansari", t:2, p:68, s:"finance", roles:[
    ["qse","Chief Executive Officer","executive","v"]],
    note:"Former QIA Qatar Funds director; became QSE CEO in March 2025."},
  {id:"altheyab_km", n:"Eng. Abdulla bin Ali Al-Theyab", t:2, p:70, s:"utilities", roles:[
    ["kahramaa","President","executive","v"]],
    note:"Appointed by Amiri Decision in December 2024."},
  {id:"khalid_qafco", n:"Sheikh Khalid bin Abdulla Al-Thani", t:1, p:68, s:"materials", roles:[
    ["qafco","Vice-Chairman & Managing Director","executive","v"]]},
  {id:"alsadah_barzan", n:"Mohammad bin Bader Al Sadah", t:2, p:68, s:"industry", roles:[
    ["barzan","Group CEO","executive","v"]],
    note:"Succeeded Abdullah Hassan Al-Khater; drives Qatar's defense-industrial localization push."},
  {id:"hasnah_hbku", n:"Dr. Ahmad M. Hasnah", t:2, p:64, s:"education", roles:[
    ["hbku","President","executive","v"]]},
  {id:"almana_sidra", n:"Mohammed Khalid Al Mana", t:2, p:62, s:"health", roles:[
    ["sidra","Acting Chief Executive Officer","executive","v"]]},
  {id:"alkuwari_msheireb", n:"Eng. Ali Al Kuwari", t:2, p:68, s:"realestate", roles:[
    ["msheireb","Chief Executive Officer","executive","v"]],
    note:"Named Global/GCC Real Estate CEO of the Year in 2026 for Msheireb's integrated downtown-Doha development."},
  {id:"alansari_qu", n:"Dr. Omar Mohammed Abdullah Al-Ansari", t:2, p:64, s:"education", roles:[
    ["qu","President","executive","v"]]},
  {id:"altayeb_barwa", n:"Ahmed Mohamed Al-Tayeb", t:2, p:64, s:"realestate", roles:[
    ["barwa","Chief Executive Officer","executive","v"]],
    note:"Previously CEO of the Investment Sector at Qatari Diar before taking Barwa's top job."},
];

const OWNERSHIP = [
  ["cabinet","qgov","governs under"],
  ["shura","qgov"],
  ["mofin","cabinet"],["mofa_q","cabinet"],["moi_q","cabinet"],["mod_q","cabinet"],
  ["moci","cabinet"],["mocit","cabinet"],["moph","cabinet"],
  ["qcb","qgov"],
  ["qfc","qgov"],
  ["qfz","cabinet"],
  ["qia","qgov"],
  ["qatariddiar","qia"],["hassad","qia"],["katarahosp","qia"],["qse","qia"],
  ["qnb","qia","50% shareholder"],
  ["qatarairways","qia","state owner"],
  ["hia","qatarairways","operated by (MATAR)"],
  ["qatarenergy","qgov","state owner"],
  ["qelng","qatarenergy"],
  ["nakilat","qatarenergy","affiliated / JV fleet","ns"],
  ["industriesqatar","qatarenergy","majority"],
  ["qafco","industriesqatar"],["qapco","industriesqatar"],["qatalum","industriesqatar","50% (with Hydro)","ns"],
  ["qewc","qatarenergy","strategic stake","ns"],
  ["nebras","qewc","majority"],
  ["kahramaa","qgov"],
  ["ooredoo","qia","state anchor shareholder","ns"],
  ["vodafoneqatar","qf","anchor shareholder","ns"],
  ["aljazeera","qgov","state-funded"],
  ["bein","qgov","state-linked","ns"],
  ["qm","qgov"],["qoc","qgov"],["qta","qgov"],
  ["qsi","qgov","state-linked sports fund","ns"],
  ["psg","qsi","owner"],
  ["scdl","qgov"],
  ["qf","qgov","state-chartered foundation","ns"],
  ["hbku","qf"],["sidra","qf"],["msheireb","qf"],
  ["qu","qgov"],
  ["hmc","moph"],
  ["mwani","qgov"],["qatarrail","qgov"],
  ["milaha","qgov","state stakes","ns"],
  ["barwa","qatariddiar","major shareholder","ns"],
  ["barzan","mod_q","defense investment arm"],
  ["baladna","pih","founded by PIH owners","ns"],
  ["aamal","alfaisal"],
  // — International North Field / LNG partners
  ["exxonmobil","qatarenergy","LNG partner"],
  ["shell","qatarenergy","LNG partner"],
  ["totalenergies","qatarenergy","North Field partner"],
  ["conocophillips","qatarenergy","North Field partner"],
  ["eni","qatarenergy","North Field partner"],
  ["sinopec","qatarenergy","North Field East stake"],
  ["cnpc","qatarenergy","North Field East stake"],
  ["lst_eres","qse","listed on QSE","ns"],
  ["lst_mark","qse","listed on QSE","ns"],
  ["lst_igrd","qse","listed on QSE","ns"],
  ["lst_dubk","qse","listed on QSE","ns"],
  ["lst_qiik","qse","listed on QSE","ns"],
  ["lst_mphc","qse","listed on QSE","ns"],
  ["lst_qfls","qse","listed on QSE","ns"],
  ["lst_abqk","qse","listed on QSE","ns"],
  ["lst_qamc","qse","listed on QSE","ns"],
  ["lst_qati","qse","listed on QSE","ns"],
  ["lst_zhcd","qse","listed on QSE","ns"],
  ["lst_giss","qse","listed on QSE","ns"],
  ["lst_qfbq","qse","listed on QSE","ns"],
  ["lst_mers","qse","listed on QSE","ns"],
  ["lst_qgri","qse","listed on QSE","ns"],
  ["lst_meza","qse","listed on QSE","ns"],
  ["lst_qigd","qse","listed on QSE","ns"],
  ["lst_qncd","qse","listed on QSE","ns"],
  ["lst_mcgs","qse","listed on QSE","ns"],
  ["lst_dohi","qse","listed on QSE","ns"],
  ["lst_gwcs","qse","listed on QSE","ns"],
  ["lst_qisi","qse","listed on QSE","ns"],
  ["lst_bema","qse","listed on QSE","ns"],
  ["lst_qimd","qse","listed on QSE","ns"],
  ["lst_siis","qse","listed on QSE","ns"],
  ["lst_akhi","qse","listed on QSE","ns"],
  ["lst_qlmi","qse","listed on QSE","ns"],
  ["lst_mfms","qse","listed on QSE","ns"],
  ["lst_mrds","qse","listed on QSE","ns"],
  ["lst_mhar","qse","listed on QSE","ns"],
  ["lst_nlcs","qse","listed on QSE","ns"],
  ["lst_mkdm","qse","listed on QSE","ns"],
  ["lst_dbis","qse","listed on QSE","ns"],
  ["lst_wdam","qse","listed on QSE","ns"],
  ["lst_tqes","qse","listed on QSE","ns"],
  ["lst_qcfs","qse","listed on QSE","ns"],
  ["lst_qgmd","qse","listed on QSE","ns"],
  ["lst_ihgs","qse","listed on QSE","ns"],
  ["lst_falh","qse","listed on QSE","ns"],
  ["lst_qois","qse","listed on QSE","ns"],
];

const FAMILY = [
  ["hamad_bk","tamim","father–son"],
  ["hamad_bk","moza","spouses"],
  ["moza","tamim","mother–son"],
  ["moza","jassim_bh","mother–son"],
  ["moza","joaan","mother–son"],
  ["moza","mayassa","mother–daughter"],
  ["moza","hind","mother–daughter"],
  ["tamim","jassim_bh","brothers"],
  ["tamim","joaan","brothers"],
  ["tamim","khalifa_moi","brothers"],
  ["tamim","mayassa","siblings"],
  ["tamim","hind","siblings"],
  ["tamim","abdullah_dep","brothers (half)"],
  ["tamim","mbar","kin (Al Thani)"],
];

const AKA = {
  tamim:["Tamim bin Hamad","Emir Tamim","Emir of Qatar"],
  hamad_bk:["Hamad bin Khalifa","Father Emir"],
  moza:["Sheikha Moza","Moza bint Nasser"],
  mbar:["Mohammed bin Abdulrahman","Sheikh Mohammed bin Abdulrahman","MBAR"],
  alkaabi:["Saad Al-Kaabi","Saad Al Kaabi","Al-Kaabi"],
  khelaifi:["Nasser Al-Khelaifi","Al-Khelaifi","Nasser Al Khelaifi"],
  alkuwari_fin:["Ali Al Kuwari","Ali Al-Kuwari"],
  qia:["Qatar Investment Authority"],
  qatarenergy:["Qatar Energy","Qatar Petroleum"],
  qnb:["Qatar National Bank"],
  qf:["Qatar Foundation","Education City"],
  aljazeera:["Al Jazeera","Al-Jazeera"],
  qatarairways:["Qatar Airways"],
  qelng:["Qatargas"],
  industriesqatar:["Industries Qatar","IQ"],
  mohannadi_lng:["Ahmed Al Mohannadi","Ahmed Hilal Al Mohannadi"],
  hamad_talal_diar:["Hamad bin Talal Al Thani","Sheikh Hamad bin Talal"],
  ghanim_shura:["Hassan Al Ghanim","Hassan bin Abdullah Al-Ghanim"],
  alkuwari_msheireb:["Ali Al Kuwari (Msheireb)","Ali Al Kuwairi"],
  altheyab_km:["Abdulla Al-Theyab","Abdullah bin Ali Al Theyab"],
  qafco:["Qatar Fertiliser Company","Qatar Fertilizer Company"],
  kahramaa:["Qatar General Electricity & Water Corporation","QGEWC"],
  qse:["Qatar Stock Exchange","QE"],
  hbku:["Hamad Bin Khalifa University"],
  msheireb:["Msheireb Properties","Msheireb Downtown Doha"],
};
