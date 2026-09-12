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
  {id:"momun_q",   n:"Ministry of Municipality",      s:"gov", t:1, p:70,  short:"MoMun"},
  {id:"mot_q",     n:"Ministry of Transport",         s:"gov", t:1, p:72,  short:"MoT"},
  {id:"moehe_q",   n:"Ministry of Education & Higher Education", s:"education", t:1, p:76, short:"MoEHE"},
  {id:"molsa_q",   n:"Ministry of Labour",            s:"gov", t:1, p:70,  short:"MoL"},
  {id:"moecc_q",   n:"Ministry of Environment & Climate Change", s:"gov", t:1, p:68, short:"MoECC"},
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
  {id:"lst_eres", n:"Ezdan Holding Group Q.P.S.C.", s:"realestate", t:2, p:60, short:"Ezdan"},
  {id:"lst_mark", n:"Al Rayan Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"MARK"},
  {id:"lst_igrd", n:"Estithmar Holding Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"IGRD"},
  {id:"lst_dubk", n:"Dukhan Bank Q.P.S.C.", s:"finance", t:2, p:64, short:"Dukhan Bank"},
  {id:"lst_qiik", n:"Qatar International Islamic Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"QIIK"},
  {id:"lst_mphc", n:"Mesaieed Petrochemical Holding Company Q.P.S.C.", s:"materials", t:2, p:50, short:"MPHC"},
  {id:"lst_qfls", n:"Qatar Fuel Company Q.P.S.C. (WOQOD)", s:"energy", t:2, p:64, short:"WOQOD"},
  {id:"lst_abqk", n:"Ahli Bank Q.P.S.C.", s:"finance", t:2, p:50, short:"Ahli Bank Q.P.S.C."},
  {id:"lst_qamc", n:"Qatar Aluminium Manufacturing Company Q.P.S.C.", s:"materials", t:2, p:50, short:"QAMC"},
  {id:"lst_qati", n:"Qatar Insurance Company Q.S.P.C.", s:"finance", t:2, p:50, short:"QATI"},
  {id:"lst_zhcd", n:"Zad Holding Company Q.P.S.C.", s:"consumer_stap", t:2, p:50, short:"ZHCD"},
  {id:"lst_giss", n:"Gulf International Services Q.P.S.C.", s:"energy", t:2, p:50, short:"GISS"},
  {id:"lst_qfbq", n:"Lesha Bank LLC (formerly Qatar First Bank)", s:"finance", t:2, p:60, short:"Lesha Bank"},
  {id:"lst_mers", n:"Al Meera Consumer Goods Company Q.P.S.C.", s:"consumer_stap", t:2, p:50, short:"MERS"},
  {id:"lst_qgri", n:"Qatar General Insurance & Reinsurance Company Q.P.S.C.", s:"finance", t:2, p:50, short:"QGRI"},
  {id:"lst_meza", n:"MEEZA QSTP-LLC", s:"tech", t:2, p:50, short:"MEEZA QSTP-LLC"},
  {id:"lst_qigd", n:"Qatari Investors Group Q.P.S.C.", s:"conglomerate", t:2, p:50, short:"QIGD"},
  {id:"lst_qncd", n:"Qatar National Cement Company Q.P.S.C.", s:"materials", t:2, p:50, short:"QNCD"},
  {id:"lst_mcgs", n:"Medicare Group Q.P.S.C.", s:"health", t:2, p:50, short:"MCGS"},
  {id:"lst_dohi", n:"Doha Insurance Group Q.P.S.C.", s:"finance", t:2, p:50, short:"DOHI"},
  {id:"lst_gwcs", n:"Gulf Warehousing Company Q.P.S.C. (GWC)", s:"industry", t:2, p:58, short:"GWCS"},
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
    ["lst_qfbq","Chairman","board","v"],
    ["qia","Chief Investment Officer, Africa & Asia-Pacific (until 2025)","executive","v","former:until 2025"],
    ["qia","Member of the Board","board","v"]]},
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
    ["masraf","Chairman","board","ns"],
    ["qia","Member of the Board","board","v"]]},
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
  {id:"lolwah", n:"H.E. Lolwah Al-Khater", t:1, p:74, s:"education", roles:[
    ["moehe_q","Minister of Education & Higher Education","political","v"]],
    note:"Moved from the Foreign Ministry / government spokesperson role to Education & Higher Education in the 12 Nov 2024 cabinet reshuffle."},
  {id:"buthaina", n:"H.E. Buthaina Al Nuaimi", t:1, p:72, s:"gov", roles:[
    ["cabinet","Minister of Social Development & Family","political","v"]],
    note:"Moved from Education & Higher Education to Social Development & Family in the 12 Nov 2024 cabinet reshuffle."},
  {id:"alsayed", n:"H.E. Ahmad Al-Sayed", t:1, p:80, s:"gov", roles:[
    ["cabinet","Minister of State","political","v"],
    ["qfz","Chairman","government","v"]],
    note:"Former QIA CEO; runs the free-zone platform courting global tech and logistics."},
  {id:"sowaidi", n:"Mohammed Saif Al Sowaidi", t:1, p:86, s:"sovereign", roles:[
    ["qia","Chief Executive Officer","executive","v"],
    ["katarahosp","Chairman","board","v"]]},
  {id:"khelaifi", n:"Nasser Al-Khelaifi", t:1, p:86, s:"comm", roles:[
    ["qsi","Chairman","board","v"],
    ["bein","Chairman","board","v"],
    ["psg","President","executive","v"],
    ["qia","Member of the Board","board","v"]],
    note:"The global face of Qatari sport and sports media — PSG, beIN, European club football politics."},
  {id:"thawadi", n:"Hassan Al Thawadi", t:1, p:76, s:"gov", roles:[
    ["scdl","Secretary-General","executive","v"],
    ["qia","Member of the Board","board","v"]],
    note:"Delivered the 2022 World Cup; the legacy body carries the network built around it."},

  // ===== TIER 2 — OPERATING EXECUTIVES =====
  {id:"qnb_ceo", n:"Abdulla Mubarak Al-Khalifa", t:2, p:74, s:"finance", roles:[["qnb","Group CEO","executive","v"]]},
  {id:"hamad_alkhater", n:"Hamad Ali Al-Khater", t:2, p:80, s:"industry", roles:[["qatarairways","Group CEO","executive","v"]],
    note:"Group CEO since 7 Dec 2025 (from HIA COO; ex-QatarEnergy), replacing Badr Al-Meer."},
  {id:"badr_almeer", n:"Badr Mohammed Al-Meer", t:2, p:56, s:"industry", roles:[
    ["qatarairways","Group CEO (Nov 2023–Dec 2025)","executive","v","former:until Dec 2025"]],
    note:"Group CEO Nov 2023–Dec 2025; previously COO of Hamad International Airport. Succeeded by Hamad Ali Al-Khater."},
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

  // ===== ADDED SEP 2026 — KEY MINISTRIES PREVIOUSLY MISSING FROM THE MAP =====
  {id:"alattiya_mun", n:"H.E. Abdullah bin Hamad bin Abdullah Al Attiya", t:1, p:68, s:"gov", roles:[
    ["momun_q","Minister of Municipality","political","v"]],
    note:"Appointed January 2024."},
  {id:"mohammed_transport", n:"H.E. Sheikh Mohammed bin Abdulla bin Mohammed Al Thani", t:1, p:70, s:"gov", roles:[
    ["mot_q","Minister of Transport","political","v"]],
    note:"Appointed November 2024."},
  {id:"almarri_labour", n:"H.E. Dr. Ali bin Samikh Al Marri", t:1, p:68, s:"gov", roles:[
    ["molsa_q","Minister of Labour","political","v"]],
    note:"Re-appointed Minister of Labour by Amiri order in March 2023; formerly headed Qatar's National Human Rights Committee."},
  {id:"alsubaie_env", n:"H.E. Dr. Abdullah bin Abdulaziz bin Turki Al Subaie", t:1, p:66, s:"gov", roles:[
    ["moecc_q","Minister of Environment & Climate Change","political","v"]],
    note:"Appointed 8 January 2024."},
  {id:"ali_ahmed_al", n:"Ali Ahmed Al Kuwari", t:2, p:62, s:"finance", roles:[
    ["qnb","Chairman","board","v"]]},
  {id:"sheikh_fahad_bin", n:"Sheikh Fahad bin Faisal bin Thani Al Thani", t:2, p:62, s:"finance", roles:[
    ["qnb","Vice Chairman","board","v"]]},
  {id:"sheikh_hamad_bin", n:"Sheikh Hamad bin Jabor bin Jassim Al Thani", t:2, p:52, s:"finance", roles:[
    ["qnb","Board Member","board","v"]]},
  {id:"sheikha_hanadi_bint", n:"Sheikha Hanadi bint Nasser Bin Khalid Al Thani", t:2, p:52, s:"finance", roles:[
    ["qnb","Board Member","board","v"]]},
  {id:"bader_abdulla_darwish", n:"Bader Abdulla Darwish Fakhroo", t:2, p:52, s:"finance", roles:[
    ["qnb","Board Member","board","v"]]},
  {id:"dr_abdulrahman_mohammed", n:"Dr. Abdulrahman Mohammed Jolo", t:2, p:52, s:"finance", roles:[
    ["mofin","Assistant Undersecretary for Financial Policies Affairs","executive","v"],
    ["qnb","Board Member","board","v"],
    ["katarahosp","Board Member","board","v"]]},
  {id:"ramzi_mari", n:"Ramzi Mari", t:2, p:58, s:"finance", roles:[
    ["qnb","Group Chief Financial Officer","executive","v"]]},
  {id:"fatima_abdulla_al", n:"Fatima Abdulla Al-Suwaidi", t:2, p:58, s:"finance", roles:[
    ["qnb","Group Chief Risk Officer","executive","ns"]]},
  {id:"sheikh_jassim_bin", n:"Sheikh Jassim Bin Hamad Bin Jassim Bin Jaber Al Thani", t:2, p:62, s:"finance", roles:[
    ["qib","Chairman","board","v"]]},
  {id:"abdullatif_bin_abdullah", n:"Abdullatif Bin Abdullah Al Mahmoud", t:2, p:62, s:"finance", roles:[
    ["qib","Vice Chairman","board","v"]]},
  {id:"mohamed_bin_issa", n:"Mohamed Bin Issa Al Mohannadi", t:2, p:62, s:"finance", roles:[
    ["qib","Vice Chairman","board","v"]]},
  {id:"mansour_m_abdul", n:"Mansour M. Abdul Fattah Al Musleh", t:2, p:52, s:"finance", roles:[
    ["qib","Board Member","board","v"]]},
  {id:"abdulla_bin_saeed", n:"Abdulla Bin Saeed Al Eidah", t:2, p:52, s:"finance", roles:[
    ["qib","Board Member","board","v"]]},
  {id:"sraiya_nasser_rashid", n:"Sraiya Nasser Rashid Sraiya Al-Kaabi", t:2, p:52, s:"finance", roles:[
    ["qib","Board Member","board","v"]]},
  {id:"khalid_mohamed_al", n:"Khalid Mohamed Al-Emadi", t:2, p:52, s:"finance", roles:[
    ["qib","Board Member","board","v"]]},
  {id:"sheikh_jassim_faisal", n:"Sheikh Jassim Faisal Qassim Thani Al Thani", t:2, p:52, s:"finance", roles:[
    ["qib","Board Member","board","v"]]},
  {id:"nasser_abdullah_saad", n:"Nasser Abdullah Saad Al Mahmoud Al-Shareef", t:2, p:52, s:"finance", roles:[
    ["qib","Independent Board Member","board","v"]]},
  {id:"maitha_mubarak_rashid", n:"Maitha Mubarak Rashid Al Jabr Al-Naemi", t:2, p:52, s:"finance", roles:[
    ["qib","Independent Board Member","board","v"]]},
  {id:"saad_sherida_al", n:"Saad Sherida Al-Kaabi", t:2, p:62, s:"materials", roles:[
    ["industriesqatar","Chairman and Managing Director","board","v"]]},
  {id:"abdulaziz_mohammed_al", n:"Abdulaziz Mohammed Al-Mannai", t:2, p:62, s:"materials", roles:[
    ["industriesqatar","Vice Chairman","board","v"]]},
  {id:"dr_mohammed_yousef", n:"Dr. Mohammed Yousef Al-Mulla", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"sheikh_khalid_bin", n:"Sheikh Khalid Bin Abdullah Al-Thani", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"abdulrahman_ali_al", n:"Abdulrahman Ali Al-Abdulla", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"abdulla_ahmad_al", n:"Abdulla Ahmad Al-Hussaini", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"ahmed_helal_al", n:"Ahmed Helal Al-Mohannadi", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"ahmed_bin_ali", n:"Ahmed Bin Ali Al-Hammadi", t:2, p:52, s:"materials", roles:[
    ["industriesqatar","Board Member","board","v"]]},
  {id:"nasser_marafih", n:"Nasser Marafih", t:2, p:62, s:"comm", roles:[
    ["ooredoo","Vice Chairman","board","v"]]},
  {id:"ali_shareef_al", n:"Ali Shareef Al Emadi", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","ns"]]},
  {id:"mohammed_bin_issa", n:"Mohammed Bin Issa Al Mohannadi", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","ns"]]},
  {id:"nasser_rashid_al", n:"Nasser Rashid Al-Humaidi", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","v"]]},
  {id:"ali_bin_ghanim", n:"Ali Bin Ghanim Bin Ali Abdullah Al-Thani", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","ns"]]},
  {id:"abdulla_ahmad_al_b", n:"Abdulla Ahmad Al Zaman", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Financial Officer","executive","v"]]},
  {id:"sheikh_mohamed_bin", n:"Sheikh Mohamed Bin Hamad Bin Qassim Al Thani", t:2, p:62, s:"finance", roles:[
    ["masraf","Chairman","board","v"]]},
  {id:"sheikh_hamad_bin_b", n:"Sheikh Hamad Bin Faisal Bin Thani Al Thani", t:2, p:62, s:"finance", roles:[
    ["masraf","Vice Chairman","board","v"]]},
  {id:"ahmed_ali_hassan", n:"Ahmed Ali Hassan Al Hammadi", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"khamis_mubarak_al", n:"Khamis Mubarak Al Kuwari", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"sheikh_ali_bin", n:"Sheikh Ali bin Jassim Bin Mohamed Al Thani", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"sheikh_nasser_bin", n:"Sheikh Nasser bin Hamad bin Nasser Al Thani", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"mohammed_al_saadi", n:"Mohammed Al Saadi", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"dr_abdulrahman_mohammed_b", n:"Dr. Abdulrahman Mohammed Al-Khayarin", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"mohamed_jaber_al", n:"Mohamed Jaber Al Sulaiti", t:2, p:52, s:"finance", roles:[
    ["masraf","Board Member","board","v"]]},
  {id:"fahad_al_khalifa", n:"Fahad Al Khalifa", t:2, p:58, s:"finance", roles:[
    ["masraf","Group Chief Executive Officer","executive","v"]]},
  {id:"shahnawaz_niazi", n:"Shahnawaz Niazi", t:2, p:58, s:"finance", roles:[
    ["masraf","Group Chief Financial Officer","executive","v"]]},
  {id:"abdulaziz_jassim_al", n:"Abdulaziz Jassim Al-Muftah", t:2, p:62, s:"energy", roles:[
    ["nakilat","Chairman","board","v"]]},
  {id:"ahmad_saif_al", n:"Ahmad Saif Al-Sulaiti", t:2, p:62, s:"energy", roles:[
    ["nakilat","Vice Chairman","board","v"]]},
  {id:"sheikh_hamad_mohamed", n:"Sheikh Hamad Mohamed Al-Thani", t:2, p:52, s:"energy", roles:[
    ["nakilat","Board Member","board","v"]]},
  {id:"abdulrahman_essa_al", n:"Abdulrahman Essa Al-Mannai", t:2, p:52, s:"energy", roles:[
    ["nakilat","Board Member","board","v"]]},
  {id:"khalid_said_al", n:"Khalid Said Al-Rumaihi", t:2, p:52, s:"energy", roles:[
    ["nakilat","Board Member","board","v"]]},
  {id:"bader_mubarak_al", n:"Bader Mubarak Al-Khalifa", t:2, p:52, s:"energy", roles:[
    ["nakilat","Board Member","board","v"]]},
  {id:"omar_mohammed_al", n:"Omar Mohammed Al-Homaid", t:2, p:52, s:"energy", roles:[
    ["nakilat","Board Member","board","v"]]},
  {id:"hani_abuaker", n:"Hani Abuaker", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Financial Officer","executive","v"]]},
  {id:"samir_bailouni", n:"Samir Bailouni", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Operating Officer (Fleet)","executive","v"]]},
  {id:"khalid_mohammed_al", n:"Khalid Mohammed Al-Hitmi", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Subsurface Development and Exploration","executive","v"]]},
  {id:"jassim_mohd_al", n:"Jassim Mohd Al-Marzouqi", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Commercial and Business Development","executive","v"]]},
  {id:"mohamed_salem_al", n:"Mohamed Salem Al-Marri", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Projects Engineering and Procurement Services","executive","v"]]},
  {id:"abdulrahman_ahmad_al", n:"Abdulrahman Ahmad Al-Shaibi", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Finance and Planning","executive","v"]]},
  {id:"ahmad_saeed_al", n:"Ahmad Saeed Al-Amoodi", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Surface Development and Sustainability","executive","v"]]},
  {id:"nabeel_mohammed_al", n:"Nabeel Mohammed Al-Buenain", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - HSE and Business Services","executive","v"]]},
  {id:"mohammed_essa_al", n:"Mohammed Essa Al-Mannai", t:2, p:58, s:"energy", roles:[
    ["qatarenergy","General Counsel and Board Secretary","executive","v"]]},
  {id:"ali_nasser_telfat", n:"Ali Nasser Telfat", t:2, p:60, s:"energy", roles:[
    ["qatarenergy","Corporate Manager - CEO Office","executive","v"]]},
  {id:"homoud_fahad_al", n:"Homoud Fahad Al-Qahtani", t:2, p:46, s:"energy", roles:[
    ["qatarenergy","Executive VP - Industrial Cities","executive","ns"]]},
  {id:"kevin_zhu", n:"Kevin Zhu", t:2, p:58, s:"sovereign", roles:[
    ["qia","Acting Chief of Investment Strategy","executive","v"]]},
  {id:"rashid_saad_al", n:"Rashid Saad Al-Mohannadi", t:2, p:58, s:"sovereign", roles:[
    ["qia","Executive Director of Human Capital","executive","v"]]},
  {id:"abdulla_ali_al", n:"Abdulla Ali Al-Kuwari", t:2, p:46, s:"sovereign", roles:[
    ["qia","Head of Industrials","executive","v"]]},
  {id:"abdulla_ali_al_b", n:"Abdulla Ali Al-Marri", t:2, p:46, s:"sovereign", roles:[
    ["qia","Head of QIA Advisory (Asia Pacific)","executive","v"]]},
  {id:"abdulla_ali", n:"Abdulla Ali", t:2, p:58, s:"industry", roles:[
    ["qatarairways","Chief Operating Officer","executive","v"]]},
  {id:"calum_laming", n:"Calum Laming", t:2, p:58, s:"industry", roles:[
    ["qatarairways","Chief Customer Officer","executive","v"]]},
  {id:"abdulrahman_m_al", n:"Abdulrahman M. Al-Suwaidi", t:2, p:60, s:"materials", roles:[
    ["industriesqatar","Board Director; MD & CEO of QAFCO","executive","v"]]},
  {id:"ahmed_abdulqader_al", n:"Ahmed Abdulqader Al-Ahmed", t:2, p:60, s:"materials", roles:[
    ["industriesqatar","Board Director; CEO of QAFAC","executive","v"]]},
  {id:"faisal_al_malki", n:"Faisal Al Malki", t:2, p:58, s:"realestate", roles:[
    ["msheireb","Chief Operating Officer","executive","v"]]},
  {id:"dr_hafiz_ali", n:"Dr. Hafiz Ali Abdulla", t:2, p:58, s:"realestate", roles:[
    ["msheireb","Senior Director of Corporate Communication","executive","v"]]},
  {id:"ali_hilal_al", n:"Ali Hilal Al Kuwari", t:2, p:60, s:"consumer_stap", roles:[
    ["hassad","Chief Executive Officer","executive","v"]]},
  {id:"mohamed_al_mohannadi", n:"Mohamed Al-Mohannadi", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Chief Operating Officer","executive","v"]]},
  {id:"jose_angel_iralde", n:"Jose Angel Iralde", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Chief Strategy Officer","executive","v"]]},
  {id:"fahad_ahmed_al", n:"Fahad Ahmed Al-khalaqi", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Chief Financial Officer","executive","v"]]},
  {id:"mubarak_rashid_al", n:"Mubarak Rashid Al-Sahuti", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Chief Communication & Commercial Affairs Officer","executive","v"]]},
  {id:"khalifa_al_kuwari", n:"Khalifa Al-Kuwari", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Director - Shared Services Affairs","executive","v"]]},
  {id:"imran_sami", n:"Imran Sami", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","General Counsel","executive","v"]]},
  {id:"amer_morgan", n:"Amer Morgan", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Chief Internal Auditor","executive","v"]]},
  {id:"mohamed_al_kubaisi", n:"Mohamed Al-Kubaisi", t:2, p:46, s:"consumer_stap", roles:[
    ["hassad","General Manager - Aswaq","executive","v"]]},
  {id:"naser_arikat", n:"Naser Arikat", t:2, p:58, s:"consumer_stap", roles:[
    ["hassad","Director of Agriculture","executive","v"]]},
  {id:"mohammed_khalifa_al", n:"Mohammed Khalifa Al-Jalahma", t:2, p:62, s:"consumer_stap", roles:[
    ["hassad","Chairman","board","v"]]},
  {id:"hassan_sultan_al", n:"Hassan Sultan Al-Ghanim", t:2, p:62, s:"consumer_stap", roles:[
    ["hassad","Vice Chairman","board","v"]]},
  {id:"fahad_mohmmed_al", n:"Fahad Mohmmed Al-Qahtani", t:2, p:52, s:"consumer_stap", roles:[
    ["hassad","Board Member","board","v"]]},
  {id:"jassim_mohammed_al", n:"Jassim Mohammed Al Ansari", t:2, p:52, s:"consumer_stap", roles:[
    ["hassad","Board Member","board","v"]]},
  {id:"fatma_hamad_al", n:"Fatma Hamad Al-Misnad", t:2, p:52, s:"consumer_stap", roles:[
    ["hassad","Board Member","board","v"]]},
  {id:"fahad_ali_al", n:"Fahad Ali Al-Kuwari", t:2, p:52, s:"consumer_stap", roles:[
    ["hassad","Board Member","board","v"]]},
  {id:"sheikh_abdulla_bin", n:"Sheikh Abdulla Bin Ali Bin Jabor Al Thani", t:2, p:62, s:"finance", roles:[
    ["cbq","Chairman","board","v"]]},
  {id:"omar_hussain_ibrahim", n:"Omar Hussain Ibrahim Alfardan", t:2, p:62, s:"finance", roles:[
    ["cbq","Vice-Chairman and Managing Director","board","v"]]},
  {id:"sheikh_falah_hamad", n:"Sheikh Falah Hamad Jassim Al Thani", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"sheikh_jabor_bin", n:"Sheikh Jabor Bin Abdulla Bin Ali Al Thani", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"hussain_omar_alfardan", n:"Hussain Omar Alfardan", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"mohamad_ismail_mandani", n:"Mohamad Ismail Mandani Al Emadi", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"salem_khalaf_al", n:"Salem Khalaf Al Mannai", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"ibrahim_jassim_al", n:"Ibrahim Jassim Al-Othman Fakhro", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"saleh_majed_al", n:"Saleh Majed Al Khulaifi", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"mohammed_yaser_al", n:"Mohammed Yaser Al Mosallam", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"mohammed_ahmad_al", n:"Mohammed Ahmad Al Mulla", t:2, p:52, s:"finance", roles:[
    ["cbq","Board Member","board","v"]]},
  {id:"stephen_moss", n:"Stephen Moss", t:2, p:60, s:"finance", roles:[
    ["cbq","Group Chief Executive Officer","executive","v"]]},
  {id:"omran_y_m", n:"Omran Y M H Al Sherawi", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM Treasury and Investments","executive","v"]]},
  {id:"fahad_badar", n:"Fahad Badar", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Wholesale and International Banking Officer","executive","v"]]},
  {id:"shahnawaz_rashid", n:"Shahnawaz Rashid", t:2, p:46, s:"finance", roles:[
    ["cbq","EGM and Head of Retail Banking","executive","v"]]},
  {id:"rana_a_a", n:"Rana A A Salatt", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Internal Audit Officer","executive","v"]]},
  {id:"ghinwa_baradhi", n:"Ghinwa Baradhi", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Operating Officer","executive","v"]]},
  {id:"ayman_gharib", n:"Ayman Gharib", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Legal Officer","executive","v"]]},
  {id:"eiman_m_al", n:"Eiman M Al-Naemi", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Communications and Marketing Officer","executive","v"]]},
  {id:"noman_ali", n:"Noman Ali", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM Chief Financial Officer and Chief Sustainability Officer","executive","v"]]},
  {id:"nasser_alharmi", n:"Nasser AlHarmi", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Human Resources Officer","executive","v"]]},
  {id:"abdulla_ahmed_a", n:"Abdulla Ahmed A A Al-Fadli", t:2, p:58, s:"finance", roles:[
    ["cbq","EGM and Chief Compliance Officer","executive","v"]]},
  {id:"muzaffer_gokhan_songul", n:"Muzaffer Gokhan Songul", t:2, p:58, s:"finance", roles:[
    ["cbq","Acting EGM and Chief Risk Officer","executive","v"]]},
  {id:"h_e_sheikh", n:"H.E. Sheikh Jassim bin Hamad bin Jassim bin Jaber Al-Thani", t:2, p:62, s:"industry", roles:[
    ["milaha","Chairman","board","v"]]},
  {id:"h_e_sheikh_b", n:"H.E. Sheikh Khalid bin Khalifa bin Jassim Fahad Al-Thani", t:2, p:62, s:"industry", roles:[
    ["milaha","Vice Chairman","board","v"]]},
  {id:"h_e_sheikh_b_b", n:"H.E. Sheikh Abdulrahman bin Saud Al Thani", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"h_e_sheikh_b_b_b", n:"H.E. Sheikh Suhaim bin Khaled bin Hamad Al-Thani", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b", n:"H.E. Sheikh Hamad bin Mohammed Khalid Al-Thani", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"saad_mohammad_saad", n:"Saad Mohammad Saad Al-Romaihi", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"adel_ali_bin", n:"Adel Ali Bin Ali", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"hamad_bin_mohammad", n:"Hamad bin Mohammad Al-Mana", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"dr_mazen_jassim", n:"Dr. Mazen Jassim Jaidah", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"hitmi_ali_khalifa", n:"Hitmi Ali Khalifa Al Hitmi", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"mohammed_ebrahim_al", n:"Mohammed Ebrahim Al-Sulaiti", t:2, p:52, s:"industry", roles:[
    ["milaha","Board Member","board","v"]]},
  {id:"fahad_saad_al", n:"Fahad Saad Al-Qahtani", t:2, p:60, s:"industry", roles:[
    ["milaha","Group Chief Executive Officer","executive","v"]]},
  {id:"akram_bashir_iswaiki", n:"Akram Bashir Iswaiki", t:2, p:58, s:"industry", roles:[
    ["milaha","Executive Vice President Finance & Investments","executive","v"]]},
  {id:"hamad_saeed_al", n:"Hamad Saeed Al Hajri", t:2, p:58, s:"industry", roles:[
    ["milaha","Executive Vice President Support Services","executive","v"]]},
  {id:"ibrahim_abdulla_al", n:"Ibrahim Abdulla Al-Derbasti", t:2, p:58, s:"industry", roles:[
    ["milaha","Executive Vice President Offshore & Marine","executive","v"]]},
  {id:"ali_mohamed_al", n:"Ali Mohamed Al-Kuwari", t:2, p:58, s:"industry", roles:[
    ["milaha","Executive Vice President Marine & Technical Services","executive","v"]]},
  {id:"kris_brusselmans", n:"Kris Brusselmans", t:2, p:58, s:"industry", roles:[
    ["milaha","Executive Vice President Maritime & Logistics","executive","v"]]},
  {id:"hammad_ahmad_usmani", n:"Hammad Ahmad Usmani", t:2, p:58, s:"industry", roles:[
    ["milaha","Acting Chief Internal Auditor","executive","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b", n:"H.E. Sheikh Ahmed bin Khalid bin Ahmed bin Sultan Al-Thani", t:2, p:58, s:"finance", roles:[
    ["qcb","Deputy Governor","executive","ns"]]},
  {id:"sheikh_mohammed_bin", n:"Sheikh Mohammed Bin Faisal Al Thani", t:2, p:62, s:"conglomerate", roles:[
    ["aamal","Vice Chairman and Managing Director","board","v"]]},
  {id:"sheikh_jabor_bin_b", n:"Sheikh Jabor Bin Abdulrahman Bin Mohammed Al Thani", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Non-Independent Board Member","board","v"]]},
  {id:"sheikh_abdullah_hamad", n:"Sheikh Abdullah Hamad Al Thani", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Non-Independent Board Member","board","v"]]},
  {id:"sheikha_al_jazi", n:"Sheikha Al Jazi Bint Faisal Al Thani", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Non-Independent Board Member","board","v"]]},
  {id:"yousif_bin_rashid", n:"Yousif Bin Rashid Al Khater", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Non-Independent Board Member","board","v"]]},
  {id:"ali_bin_hussain", n:"Ali Bin Hussain Bin Ali Al Sadah", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Independent Board Member","board","v"]]},
  {id:"sheikh_ali_abdulrahman", n:"Sheikh Ali Abdulrahman Al Thani", t:2, p:52, s:"conglomerate", roles:[
    ["aamal","Independent Board Member","board","v"]]},
  {id:"rashid_bin_ali", n:"Rashid Bin Ali Al Mansoori", t:2, p:60, s:"conglomerate", roles:[
    ["aamal","Chief Executive Officer","executive","v"]]},
  {id:"sheikh_tamim_bin", n:"Sheikh Tamim bin Faisal Al Thani", t:2, p:60, s:"conglomerate", roles:[
    ["aamal","Deputy Chief Executive Officer","executive","v"]]},
  {id:"sherif_shehata", n:"Sherif Shehata", t:2, p:58, s:"conglomerate", roles:[
    ["aamal","Executive Director - Trade Sector","executive","v"]]},
  {id:"ahmed_fathy_elsewedy", n:"Ahmed Fathy Elsewedy", t:2, p:60, s:"conglomerate", roles:[
    ["aamal","Executive Vice President of Senyar Industries Qatar Holding and Managing Director of El Sewedy Cables and Doha Cables","executive","v"]]},
  {id:"murat_kayman", n:"Murat Kayman", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of City Center Doha","executive","v"]]},
  {id:"essam_faragalla", n:"Essam Faragalla", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of Ebn Sina Medical and Ebn Sina Pharmacy","executive","v"]]},
  {id:"rob_frijns", n:"Rob Frijns", t:2, p:60, s:"conglomerate", roles:[
    ["aamal","Managing Director of FRIJNS Steel Construction Middle East","executive","v"]]},
  {id:"ahmad_al_sarahna", n:"Ahmad Al Sarahna", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of Aamal Trading & Distribution","executive","v"]]},
  {id:"khaled_al_nuaimat", n:"Khaled Al Nuaimat", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of Aamal Readymix and Aamal Cement Industries","executive","v"]]},
  {id:"basil_awwad", n:"Basil Awwad", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of Advanced Pipes and Casts Company","executive","v"]]},
  {id:"gokhan_ozkan", n:"Gokhan Ozkan", t:2, p:46, s:"conglomerate", roles:[
    ["aamal","General Manager of Aamal Medical","executive","v"]]},
  {id:"ramez_al_khayyat", n:"Ramez Al-Khayyat", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","President","board","v"]]},
  {id:"hamad_bin_abdullah", n:"Hamad Bin Abdullah Bin Khalid Al-Attiya", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Board Member","board","v"]]},
  {id:"abdulaziz_mahmoud_al", n:"Abdulaziz Mahmoud Al-Zeyara", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Board Member","board","v"]]},
  {id:"mazen_alsbeti", n:"Mazen Alsbeti", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Board Member","board","v"]]},
  {id:"sheikh_suhaim_bin", n:"Sheikh Suhaim Bin AbdulAziz Al Thani", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Independent Board Member","board","v"]]},
  {id:"nasser_hassan_al", n:"Nasser Hassan Al Ansari", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Independent Board Member","board","v"]]},
  {id:"aidan_tynan", n:"Aidan Tynan", t:2, p:52, s:"consumer_stap", roles:[
    ["baladna","Independent Board Member","board","v"]]},
  {id:"marek_warzywoda", n:"Marek Warzywoda", t:2, p:60, s:"consumer_stap", roles:[
    ["baladna","Group Chief Executive Officer","executive","v"]]},
  {id:"paul_kenny", n:"Paul Kenny", t:2, p:60, s:"consumer_stap", roles:[
    ["baladna","Chief Executive Officer (Qatar)","executive","v"]]},
  {id:"saifullah_khan", n:"Saifullah Khan", t:2, p:58, s:"consumer_stap", roles:[
    ["baladna","Group Chief Financial Officer","executive","v"]]},
  {id:"julian_marcolini", n:"Julian Marcolini", t:2, p:58, s:"consumer_stap", roles:[
    ["baladna","Chief Operations Officer","executive","v"]]},
  {id:"h_e_abdulla", n:"H.E. Abdulla Bin Nasser Al Misnad", t:2, p:62, s:"comm", roles:[
    ["vodafoneqatar","Chairman of the Board of Directors","board","v"]]},
  {id:"h_e_akbar", n:"H.E. Akbar Al Baker", t:2, p:62, s:"comm", roles:[
    ["vodafoneqatar","Vice-Chairman of the Board of Directors","board","v"]]},
  {id:"rashid_fahad_al", n:"Rashid Fahad Al-Naimi", t:2, p:60, s:"comm", roles:[
    ["vodafoneqatar","Board Member and Managing Director","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b", n:"H.E. Sheikh Saoud Abdul Rahman Hassan Al-Thani", t:2, p:52, s:"comm", roles:[
    ["vodafoneqatar","Board Member","board","v"]]},
  {id:"sheikh_mubarak_thani", n:"Sheikh Mubarak Thani A M Al-Thani", t:2, p:52, s:"comm", roles:[
    ["vodafoneqatar","Board Member","board","v"]]},
  {id:"nasser_abdulla_al", n:"Nasser Abdulla Al Misnad", t:2, p:52, s:"comm", roles:[
    ["vodafoneqatar","Board Member","board","v"]]},
  {id:"alnowar_al_khulaifi", n:"Alnowar Al-Khulaifi", t:2, p:52, s:"comm", roles:[
    ["vodafoneqatar","Board Member","board","v"]]},
  {id:"sheikh_hamad_abdulla", n:"Sheikh Hamad Abdulla Jassim Al-Thani", t:2, p:60, s:"comm", roles:[
    ["vodafoneqatar","Chief Executive Officer","executive","v"]]},
  {id:"abdulla_ali_a", n:"Abdulla Ali A A Al-Misnad", t:2, p:58, s:"comm", roles:[
    ["vodafoneqatar","Chief Administrative Officer","executive","v"]]},
  {id:"baran_yurdagul", n:"Baran Yurdagul", t:2, p:58, s:"comm", roles:[
    ["vodafoneqatar","Chief Operating Officer","executive","v"]]},
  {id:"ramy_boctor", n:"Ramy Boctor", t:2, p:58, s:"comm", roles:[
    ["vodafoneqatar","Chief Technology Officer","executive","v"]]},
  {id:"masroor_anjum", n:"Masroor Anjum", t:2, p:58, s:"comm", roles:[
    ["vodafoneqatar","Chief Financial Officer","executive","v"]]},
  {id:"saleh_abdulla_al", n:"Saleh Abdulla Al-Raisi", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Commercial & Business Development Officer","executive","v"]]},
  {id:"rashid_h_al", n:"Rashid H Al-Marri", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Administration Officer","executive","v"]]},
  {id:"hamish_bullen", n:"Hamish Bullen", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Shipyard Management Officer","executive","v"]]},
  {id:"william_richardson", n:"William Richardson", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief SHEQ Officer","executive","v"]]},
  {id:"dr_thorsten_ploss", n:"Dr. Thorsten Ploss", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Corporate Planning & Risk Officer","executive","v"]]},
  {id:"essa_mohammed_al", n:"Essa Mohammed Al-Mannai", t:2, p:58, s:"energy", roles:[
    ["nakilat","General Counsel","executive","v"]]},
  {id:"karim_ali", n:"Karim Ali", t:2, p:58, s:"energy", roles:[
    ["nakilat","Chief Internal Auditor","executive","v"]]},
  {id:"josephus_goris", n:"Josephus Goris", t:2, p:60, s:"energy", roles:[
    ["nakilat","Chief Executive Officer - Qatar Shipyard Technology Solutions","executive","v"]]},
  {id:"derek_parsons", n:"Derek Parsons", t:2, p:60, s:"energy", roles:[
    ["nakilat","Acting Managing Director - Qatar Fabrication Company","executive","v"]]},
  {id:"mohamed_taher_aguir", n:"Mohamed Taher Aguir", t:2, p:60, s:"energy", roles:[
    ["nakilat","Managing Director - Nakilat SvitzerWijsmuller","executive","v"]]},
  {id:"robert_walker", n:"Robert Walker", t:2, p:58, s:"energy", roles:[
    ["nakilat","Nakilat Agency Manager","executive","v"]]},
  {id:"saud_bin_nasser", n:"Saud Bin Nasser Al Thani", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","v"]]},
  {id:"yousef_al_obaidly", n:"Yousef Al-Obaidly", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","v"]]},
  {id:"essa_bin_hilal", n:"Essa Bin Hilal Al Kuwari", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","v"]]},
  {id:"mohammed_bin_nasser", n:"Mohammed Bin Nasser Al-Hajri", t:2, p:52, s:"comm", roles:[
    ["ooredoo","Board Member","board","v"]]},
  {id:"nasser_bin_hamad", n:"Nasser Bin Hamad Bin Nasser Al-Thani", t:2, p:60, s:"comm", roles:[
    ["ooredoo","Group Regional Chief Executive Officer - Middle East","executive","v"]]},
  {id:"ahmad_abulaziz_al", n:"Ahmad Abulaziz Al Neama", t:2, p:60, s:"comm", roles:[
    ["ooredoo","Group Regional Chief Executive Officer - North Africa and Asia","executive","v"]]},
  {id:"hamad_yahya_al", n:"Hamad Yahya Al Nuaimi", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Board Affairs Officer","executive","v"]]},
  {id:"fatima_sultan_al", n:"Fatima Sultan Al Kuwari", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Human Resources and Sustainability Officer","executive","v"]]},
  {id:"saim_yaksan", n:"Saim Yaksan", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Procurement Officer","executive","v"]]},
  {id:"rene_werner", n:"Rene Werner", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Commercial Officer","executive","v"]]},
  {id:"sara_al_asmakh", n:"Sara Al Asmakh", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Audit Executive","executive","v"]]},
  {id:"hilal_mohammed_al", n:"Hilal Mohammed Al-Khulaifi", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Legal Regulatory and Governance Officer","executive","v"]]},
  {id:"efthymios_tsokanis", n:"Efthymios Tsokanis", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Technology and Information Officer","executive","v"]]},
  {id:"thomas_chevanne", n:"Thomas Chevanne", t:2, p:58, s:"comm", roles:[
    ["ooredoo","Group Chief Strategy and M&A Officer","executive","v"]]},
  {id:"khalid_bin_thani", n:"Khalid bin Thani bin Abdullah Al Thani", t:2, p:62, s:"finance", roles:[
    ["lst_qiik","Chairman","board","v"]]},
  {id:"abdullah_thani_a", n:"Abdullah Thani A. T. Al-Thani", t:2, p:62, s:"finance", roles:[
    ["lst_qiik","Vice Chairman & Managing Director","executive","v"]]},
  {id:"turki_khalid_al", n:"Turki Khalid Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"ezzat_mohd_r", n:"Ezzat Mohd R Al-Rasheed", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Independent Board Member","board","v"]]},
  {id:"shaheen_jassim_h", n:"Shaheen Jassim H Al-Sulaiti", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Independent Board Member","board","v"]]},
  {id:"mubarak_abdullah_mohammed", n:"Mubarak Abdullah Mohammed Al-Sulaiti", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Independent Board Member","board","v"]]},
  {id:"ayedh_dabsan_e", n:"Ayedh Dabsan E A Al-Qahtani", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"rashid_nasser_al", n:"Rashid Nasser Al-Kaabi", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"jaafar_ali_al", n:"Jaafar Ali Al-Sarraf", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"abdulla_khalid_thani", n:"Abdulla Khalid Thani Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"thani_abdullah_thani", n:"Thani Abdullah Thani A. Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_qiik","Board Member","board","v"]]},
  {id:"mohammad_bin_hamad", n:"Mohammad Bin Hamad Bin Jassim Bin Jaber Al Thani", t:2, p:62, s:"industry", roles:[
    ["lst_gwcs","Chairman","board","v"]]},
  {id:"fahad_bin_hamad", n:"Fahad Bin Hamad Bin Jassim Bin Jaber Al Thani", t:2, p:62, s:"industry", roles:[
    ["lst_gwcs","Vice Chairman","board","v"]]},
  {id:"abdulla_bin_fahad", n:"Abdulla Bin Fahad Bin Jassim Bin Jaber Al Thani", t:2, p:60, s:"industry", roles:[
    ["lst_gwcs","Group Managing Director & Board Member","executive","v"]]},
  {id:"ahmad_mubarak_al", n:"Ahmad Mubarak Al Ali Al Maadid", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"mohammed_hassan_rafee", n:"Mohammed Hassan Rafee Al Emadi", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"hanadi_anwar_eissa", n:"Hanadi Anwar Eissa Al Saleh", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"sultan_yousif_khater", n:"Sultan Yousif Khater Al Sulaiti", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"mohammed_abdulmonim_al", n:"Mohammed Abdulmonim Al Sayed", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"abdulaziz_mohammed_jaber", n:"Abdulaziz Mohammed Jaber Al Sulaiti", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Member","board","v"]]},
  {id:"hamad_saad_al", n:"Hamad Saad Al Saad", t:2, p:52, s:"industry", roles:[
    ["lst_gwcs","Board Advisor","board","v"]]},
  {id:"suad_abutalib", n:"Suad Abutalib", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Board Secretary","executive","v"]]},
  {id:"matthew_allen_kearns", n:"Matthew Allen Kearns", t:2, p:60, s:"industry", roles:[
    ["lst_gwcs","Group Chief Executive Officer","executive","v"]]},
  {id:"hicham_abdulkadir_nedjari", n:"Hicham Abdulkadir Nedjari", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Financial Officer","executive","v"]]},
  {id:"asem_ahmad_abdelkarim", n:"Asem Ahmad Abdelkarim Alnaser", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Audit, Risk and Compliance Officer","executive","v"]]},
  {id:"nasser_mohammed_al", n:"Nasser Mohammed Al Hajri", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Shared Services Officer","executive","v"]]},
  {id:"syed_maaz", n:"Syed Maaz", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Commercial Officer","executive","v"]]},
  {id:"leena_waleed_nayef", n:"Leena Waleed Nayef Shehadeh", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Marketing and Revenue Officer","executive","v"]]},
  {id:"rajeswar_govindan", n:"Rajeswar Govindan", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Chief Strategy Officer","executive","v"]]},
  {id:"montasser_alfol", n:"Montasser Alfol", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","General Counsel","executive","v"]]},
  {id:"nawaf_mohammad_al", n:"Nawaf Mohammad Al Emadi", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Executive Vice President - Government Relations","executive","v"]]},
  {id:"madhu_vallur", n:"Madhu Vallur", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Executive Vice President - Energy Services","executive","v"]]},
  {id:"setrak_khatchikian", n:"Setrak Khatchikian", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Executive Vice President - GCC Transportation","executive","v"]]},
  {id:"pradeep_kumar", n:"Pradeep Kumar", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Senior Vice President - Shipping Services","executive","v"]]},
  {id:"linto_chalakkal", n:"Linto Chalakkal", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Senior Vice President - Supply Chain, Product & Technology","executive","v"]]},
  {id:"mohamed_nabil", n:"Mohamed Nabil", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Senior Vice President - Contract Logistics","executive","v"]]},
  {id:"oussama_abba", n:"Oussama Abba", t:2, p:58, s:"industry", roles:[
    ["lst_gwcs","Senior Vice President - KSA and Bahrain","executive","v"]]},
  {id:"mohammed_salem_alyan", n:"Mohammed Salem Alyan Al-Marri", t:2, p:62, s:"materials", roles:[
    ["lst_mphc","Chairman","board","v"]]},
  {id:"jassim_mohammed_hussain", n:"Jassim Mohammed Hussain Al-Marzouqi", t:2, p:62, s:"materials", roles:[
    ["lst_mphc","Vice Chairman","board","v"]]},
  {id:"thani_bin_thamer", n:"Thani bin Thamer bin Mohammed Al-Thani", t:2, p:52, s:"materials", roles:[
    ["lst_mphc","Board Member","board","v"]]},
  {id:"khalid_sultan_al", n:"Khalid Sultan Al-Kuwari", t:2, p:52, s:"materials", roles:[
    ["lst_mphc","Board Member","board","v"]]},
  {id:"mohammed_essa_abdulrahman", n:"Mohammed Essa Abdulrahman Al-Mannai", t:2, p:52, s:"materials", roles:[
    ["lst_mphc","Board Member","board","v"]]},
  {id:"khalid_bin_khalifa", n:"Khalid Bin Khalifa Bin Jassem Al Thani", t:2, p:62, s:"materials", roles:[
    ["lst_qncd","Chairman of the Board","board","v"]]},
  {id:"nasser_sultan_al", n:"Nasser Sultan Al Humaidi", t:2, p:62, s:"materials", roles:[
    ["lst_qncd","Deputy Chairman & Director","board","v"]]},
  {id:"khalifa_essa_a", n:"Khalifa Essa A Al-Khulaifi", t:2, p:52, s:"materials", roles:[
    ["lst_qncd","Board Member","board","v"]]},
  {id:"tamim_bin_fahad", n:"Tamim Bin Fahad Al-Thani", t:2, p:52, s:"materials", roles:[
    ["lst_qncd","Board Member","board","v"]]},
  {id:"khaled_sultan_k", n:"Khaled Sultan K Kh Al-Rabban", t:2, p:60, s:"materials", roles:[
    ["lst_qncd","Managing Director","executive","v"]]},
  {id:"abdulrahman_abdullah_al", n:"Abdulrahman Abdullah Al-Ansari", t:2, p:52, s:"materials", roles:[
    ["lst_qncd","Board Member","board","v"]]},
  {id:"jaber_abdulla_al", n:"Jaber Abdulla Al-Ansari", t:2, p:52, s:"materials", roles:[
    ["lst_qncd","Board Member","board","v"]]},
  {id:"abdulrahman_hamad_al", n:"Abdulrahman Hamad Al-Mana", t:2, p:52, s:"materials", roles:[
    ["lst_qncd","Board Member","board","v"]]},
  {id:"essa_mohammed_ali", n:"Essa Mohammed Ali A M Kaldari", t:2, p:60, s:"materials", roles:[
    ["lst_qncd","Chief Executive Officer","executive","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b", n:"H.E. Sheikh Abdulla Bin Fahad Bin Jassim Al-Thani", t:2, p:62, s:"finance", roles:[
    ["lst_dubk","Chairman","board","v"]]},
  {id:"mr_abdulaziz_mohammed", n:"Mr. Abdulaziz Mohammed Hamad Al-Mana", t:2, p:62, s:"finance", roles:[
    ["lst_dubk","Vice Chairman","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Mohammed Bin Hamad Bin Jassim Al-Thani", t:2, p:60, s:"finance", roles:[
    ["lst_dubk","Executive Board Member – Managing Director","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Thani Bin Hamad Bin Khalifa Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Jassim Bin Fahad Bin Jassim Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Khalid Bin Hassan Bin Khalid Al-Thani", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"dr_ahmad_mohammed", n:"Dr. Ahmad Mohammed Yousef Al-Mana", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"mr_ahmad_abdulrazzaq", n:"Mr. Ahmad Abdulrazzaq Ahmad Al-Hashmi", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"mr_ali_rashid", n:"Mr. Ali Rashid Salem Rashid Al-Marri", t:2, p:52, s:"finance", roles:[
    ["lst_dubk","Board Member","board","v"]]},
  {id:"ahmed_i_hashem", n:"Ahmed I. Hashem", t:2, p:60, s:"finance", roles:[
    ["lst_dubk","Acting Group Chief Executive Officer","executive","v"]]},
  {id:"ahmed_abdulaziz_al", n:"Ahmed Abdulaziz Al-Emadi", t:2, p:46, s:"finance", roles:[
    ["lst_dubk","General Manager – Head of Wholesale Banking","executive","v"]]},
  {id:"chaouki_daher", n:"Chaouki Daher", t:2, p:46, s:"finance", roles:[
    ["lst_dubk","General Manager – Head of Private Banking & Wealth Management","executive","v"]]},
  {id:"abdulaziz_al_neama", n:"Abdulaziz Al-Neama", t:2, p:46, s:"finance", roles:[
    ["lst_dubk","General Manager – Head of Retail Banking","executive","v"]]},
  {id:"bashar_jallad", n:"Bashar Jallad", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Treasurer & Chief Investment Officer","executive","v"]]},
  {id:"sheikh_fahad_bin_b", n:"Sheikh Fahad Bin Hamad Al-Thani", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Business Development Officer","executive","v"]]},
  {id:"osama_abu_baker", n:"Osama Abu Baker", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Financial Officer","executive","v"]]},
  {id:"abdullah_al_malki", n:"Abdullah Al-Malki", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief HR & Administration Officer","executive","v"]]},
  {id:"abeer_noaman_al", n:"Abeer Noaman Al-Emadi", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief of Banking Operations","executive","v"]]},
  {id:"nile_rabbani_awan", n:"Nile Rabbani Awan", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Risk Officer","executive","v"]]},
  {id:"farrukh_zaman", n:"Farrukh Zaman", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Credit Officer","executive","v"]]},
  {id:"thamer_abdalla", n:"Thamer Abdalla", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Compliance Officer","executive","v"]]},
  {id:"talal_ahmed_al", n:"Talal Ahmed Al-Khaja", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Marketing & Communications Officer","executive","v"]]},
  {id:"noora_abdulrahman_al", n:"Noora Abdulrahman Al-Kuwari", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Internal Audit Officer","executive","v"]]},
  {id:"imad_hameed_el", n:"Imad Hameed El Chemaly", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Legal Officer","executive","v"]]},
  {id:"faisal_kriez", n:"Faisal Kriez", t:2, p:58, s:"finance", roles:[
    ["lst_dubk","Chief Technology Officer","executive","v"]]},
  {id:"mr_ahmad_saif", n:"Mr. Ahmad Saif Al-Sulaiti", t:2, p:62, s:"energy", roles:[
    ["lst_qfls","Chairman","board","v"]]},
  {id:"mr_homoud_fahad", n:"Mr. Homoud Fahad Homoud Sultan Al-Qahtani", t:2, p:62, s:"energy", roles:[
    ["lst_qfls","Vice Chairman","board","v"]]},
  {id:"mr_saad_rashid", n:"Mr. Saad Rashid Al-Muhannadi", t:2, p:60, s:"energy", roles:[
    ["lst_qfls","Managing Director – Board Member","board","v"],
    ["lst_qfls","Managing Director and Chief Executive Officer","executive","v"]]},
  {id:"sheikh_saoud_khalid", n:"Sheikh Saoud Khalid Hamad Al-Thani", t:2, p:52, s:"energy", roles:[
    ["lst_qfls","Board Member","board","v"]]},
  {id:"sheikh_ali_bin_b", n:"Sheikh Ali Bin Hamad Bin Abdul Rahman Al-Thani", t:2, p:52, s:"energy", roles:[
    ["lst_qfls","Board Member","board","v"]]},
  {id:"mr_nasser_sultan", n:"Mr. Nasser Sultan Nasser Al-Hemaidi", t:2, p:52, s:"energy", roles:[
    ["lst_qfls","Board Member","board","v"]]},
  {id:"mr_abdul_rahman", n:"Mr. Abdul Rahman Saad Zaid Al-Shathri", t:2, p:52, s:"energy", roles:[
    ["lst_qfls","Board Member","board","v"]]},
  {id:"mr_faisal_al", n:"Mr. Faisal Al-Hammadi", t:2, p:52, s:"energy", roles:[
    ["lst_qfls","Board Member","board","v"]]},
  {id:"mr_annas_ibrahim", n:"Mr. Annas Ibrahim Eid", t:2, p:58, s:"energy", roles:[
    ["lst_qfls","Chief Operations Officer","executive","v"]]},
  {id:"mr_saeed_rashid", n:"Mr. Saeed Rashid Al-Kaabi", t:2, p:58, s:"energy", roles:[
    ["lst_qfls","Chief Administration Officer","executive","v"]]},
  {id:"mr_pradeep_kumar", n:"Mr. Pradeep Kumar", t:2, p:58, s:"energy", roles:[
    ["lst_qfls","Chief Financial Officer","executive","v"]]},
  {id:"mr_mubarak_ali", n:"Mr. Mubarak Ali Al-Bariki", t:2, p:58, s:"energy", roles:[
    ["lst_qfls","Chief Technical Officer","executive","v"]]},
  {id:"mr_sultan_jassim", n:"Mr. Sultan Jassim Al-Maadeed", t:2, p:58, s:"energy", roles:[
    ["lst_qfls","Chief Commercial Officer","executive","v"]]},
  {id:"sheikh_thani_bin", n:"Sheikh Thani bin Abdullah bin Thani Al Thani", t:2, p:62, s:"realestate", roles:[
    ["lst_eres","Chairman","board","v"]]},
  {id:"sheikh_khalifa_bin", n:"Sheikh Khalifa bin Thani bin Abdullah Al Thani", t:2, p:62, s:"realestate", roles:[
    ["lst_eres","Vice Chairman","board","v"]]},
  {id:"sheikh_mohammed_bin_b", n:"Sheikh Mohammed bin Thani bin Abdullah Al Thani", t:2, p:52, s:"realestate", roles:[
    ["lst_eres","Board Member","board","v"]]},
  {id:"sheikh_abdullah_bin", n:"Sheikh Abdullah bin Thani bin Abdullah Al Thani", t:2, p:52, s:"realestate", roles:[
    ["lst_eres","Board Member","board","v"]]},
  {id:"mr_ayed_dabsan", n:"Mr. Ayed Dabsan Al-Qahtani", t:2, p:52, s:"realestate", roles:[
    ["lst_eres","Independent Board Member","board","v"]]},
  {id:"mr_amr_shafik", n:"Mr. Amr Shafik Mostafa Omar Ajoura", t:2, p:52, s:"realestate", roles:[
    ["lst_eres","Independent Board Member","board","v"]]},
  {id:"mr_osama_ibrahim", n:"Mr. Osama Ibrahim Mohamed Farag", t:2, p:52, s:"realestate", roles:[
    ["lst_eres","Independent Board Member","board","v"]]},
  {id:"mr_hani_dabash", n:"Mr. Hani Dabash", t:2, p:60, s:"realestate", roles:[
    ["lst_eres","Deputy Group Chief Executive Officer","executive","v"]]},
  {id:"mr_tamer_fouad", n:"Mr. Tamer Fouad Mahmoud Abdul Rahim", t:2, p:58, s:"realestate", roles:[
    ["lst_eres","Group Chief Finance & Supporting Services Officer","executive","v"]]},
  {id:"mr_adel_masoud", n:"Mr. Adel Masoud Kamel", t:2, p:58, s:"realestate", roles:[
    ["lst_eres","Chief Legal & Compliance Officer","executive","v"]]},
  {id:"mr_taha_ahmed", n:"Mr. Taha Ahmed Mahmoud Morsy", t:2, p:58, s:"realestate", roles:[
    ["lst_eres","Investor Relations Manager","executive","v"]]},
  {id:"mr_ahmed_ajlan", n:"Mr. Ahmed Ajlan", t:2, p:58, s:"realestate", roles:[
    ["lst_eres","Risk Management Manager","executive","v"]]},
  {id:"dr_saud_bin", n:"Dr. Saud bin Abdullah Al Attiyah", t:2, p:58, s:"gov", roles:[
    ["mofin","Deputy Undersecretary for Economic Affairs","executive","v"]]},
  {id:"abdulrahman_fouad_al", n:"Abdulrahman Fouad Al Mudhahka", t:2, p:58, s:"gov", roles:[
    ["mofin","Assistant Undersecretary for Public Treasury Affairs","executive","v"]]},
  {id:"h_e_mohammed", n:"H.E. Mohammed Yousef Al Mana", t:2, p:62, s:"finance", roles:[
    ["lst_qfbq","Vice Chairman","board","v"]]},
  {id:"h_e_hamad", n:"H.E. Hamad Ali Al Mannai", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"h_e_meshaal", n:"H.E. Meshaal Mohamed Al Mahmoud", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"mohammed_ali_al", n:"Mohammed Ali Al Sulaiti", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"nasser_ali_al", n:"Nasser Ali Al Hajri", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"eisa_mohamad_al", n:"Eisa Mohamad Al Mohannadi", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"abdulrahman_irfan_totonji", n:"Abdulrahman Irfan Totonji", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"nasser_abdullah_al", n:"Nasser Abdullah Al Misnad", t:2, p:52, s:"finance", roles:[
    ["lst_qfbq","Board Member","board","v"]]},
  {id:"glenn_johnstone", n:"Glenn Johnstone", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Chief Investment Officer","executive","v"]]},
  {id:"thanwa_al_naimi", n:"Thanwa Al Naimi", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Chief Private Wealth Officer","executive","v"]]},
  {id:"muhammad_tauseef_malik", n:"Muhammad Tauseef Malik", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Chief Financial Officer","executive","v"]]},
  {id:"salman_mustafa_siddiqui", n:"Salman Mustafa Siddiqui", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Chief Risk Officer","executive","v"]]},
  {id:"rita_el_helou", n:"Rita El Helou", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Chief Legal Officer & Board Secretary","executive","v"]]},
  {id:"mohammed_mohammed", n:"Mohammed Mohammed", t:2, p:58, s:"finance", roles:[
    ["lst_qfbq","Group Deputy Chief Operating Officer","executive","v"]]},
  {id:"mohamad_mahmoud_abu", n:"Mohamad Mahmoud Abu Khalaf", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Treasury","executive","v"]]},
  {id:"jubin_jose", n:"Jubin Jose", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Public Equities and Fixed Income","executive","v"]]},
  {id:"alexandre_bernassau", n:"Alexandre Bernassau", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Real Estate Investments","executive","v"]]},
  {id:"toufic_fawaz", n:"Toufic Fawaz", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Investment Banking Advisory","executive","v"]]},
  {id:"prem_anandh_kasilingam", n:"Prem Anandh Kasilingam", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Operations","executive","v"]]},
  {id:"mohamed_thahir", n:"Mohamed Thahir", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Middle Office","executive","v"]]},
  {id:"ahmed_abou_elela", n:"Ahmed Abou Elela", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Corporate Services","executive","v"]]},
  {id:"benjamin_gaskin", n:"Benjamin Gaskin", t:2, p:46, s:"finance", roles:[
    ["lst_qfbq","Head of Technology","executive","v"]]},
  {id:"mohammed_ismail_al", n:"Mohammed Ismail Al Emadi", t:2, p:60, s:"finance", roles:[
    ["lst_qfbq","Group Chief Executive Officer","executive","v"]],
    note:"Group CEO of Lesha Bank since Jul 2023 (ex-Group Chief Business Officer, Al Rayan Bank); Chairman of Oryx Corniche Developments and Lesha Aviation Capital. Possibly the same person as CBQ board member Mohamad Ismail Mandani Al Emadi (unconfirmed)."},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Bandar bin Mohammed bin Saud Al-Thani", t:2, p:62, s:"sovereign", roles:[
    ["qia","Chairman","board","v"]]},
  {id:"h_e_sheikh_b_b_b_b_b_b_b_b_b_b_b_b_b", n:"H.E. Sheikh Mohammed bin Hamad bin Khalifa Al Thani", t:2, p:62, s:"sovereign", roles:[
    ["qia","Vice Chairman","board","v"]]},
  {id:"h_e_mr", n:"H.E. Mr. Saad bin Sherida Al-Kaabi", t:2, p:52, s:"sovereign", roles:[
    ["qia","Member of the Board","board","v"]]},
  {id:"mansoor_bin_ebrahim", n:"Mansoor bin Ebrahim Al-Mahmoud", t:2, p:60, s:"sovereign", roles:[
    ["qia","Chief Executive Officer (2018-2024)","executive","v","former:until Jan 2025"]]},
  {id:"h_e_saad", n:"H.E. Saad bin Ali Al Kharji", t:2, p:62, s:"consumer_disc", roles:[
    ["katarahosp","Deputy Chairman","board","v"]]},
  {id:"sheikh_ali_alwaleed", n:"Sheikh Ali Alwaleed Al-Thani", t:2, p:52, s:"consumer_disc", roles:[
    ["katarahosp","Board Member","board","v"]]},
  {id:"mohammed_abdulrazzaq_al", n:"Mohammed Abdulrazzaq Al-Hashmi", t:2, p:52, s:"consumer_disc", roles:[
    ["katarahosp","Board Member","board","v"]]},
  {id:"h_e_rachid", n:"H.E. Rachid Mohamed Rachid", t:2, p:52, s:"consumer_disc", roles:[
    ["katarahosp","Board Member","board","v"]]},
  {id:"navid_chamdia", n:"Navid Chamdia", t:2, p:52, s:"consumer_disc", roles:[
    ["katarahosp","Board Member","board","v"]]},
  {id:"sheikh_nasser_bin_b", n:"Sheikh Nasser bin Faisal Al Thani", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Director General","executive","v"]]},
  {id:"mounir_daymi", n:"Mounir Daymi", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Executive Director of Digital","executive","v"]]},
  {id:"abdulaziz_aqeel", n:"Abdulaziz Aqeel", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Executive Director of HR & Corporate Services","executive","v"]]},
  {id:"ramzan_alnoimi", n:"Ramzan Alnoimi", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Executive Director of Global Brand","executive","v"]]},
  {id:"ahmad_al_fahad", n:"Ahmad Al Fahad", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Executive Director of Technology & Network Operations Division","executive","v"]]},
  {id:"hamad_al_dosari", n:"Hamad Al-Dosari", t:2, p:58, s:"comm", roles:[
    ["aljazeera","Executive Director of Finance and Procurement","executive","v"]]},
  {id:"asef_hamidi", n:"Asef Hamidi", t:2, p:60, s:"comm", roles:[
    ["aljazeera","Managing Director of Al Jazeera Arabic","executive","v"]]},
  {id:"issa_ali", n:"Issa Ali", t:2, p:60, s:"comm", roles:[
    ["aljazeera","Managing Director of Al Jazeera English","executive","v"]]},
  {id:"ahmed_mahfouz", n:"Ahmed Mahfouz", t:2, p:60, s:"comm", roles:[
    ["aljazeera","Managing Director of Al Jazeera Documentary","executive","v"]]},
  {id:"dima_khatib", n:"Dima Khatib", t:2, p:60, s:"comm", roles:[
    ["aljazeera","Managing Director of Digital Projects","executive","v"]]},
];

const OWNERSHIP = [
  ["cabinet","qgov","governs under"],
  ["shura","qgov"],
  ["mofin","cabinet"],["mofa_q","cabinet"],["moi_q","cabinet"],["mod_q","cabinet"],
  ["moci","cabinet"],["mocit","cabinet"],["moph","cabinet"],
  ["momun_q","cabinet"],["mot_q","cabinet"],["moehe_q","cabinet"],["molsa_q","cabinet"],["moecc_q","cabinet"],
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
