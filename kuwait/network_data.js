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
  {id:"moo_kw",    n:"Ministry of Oil",              s:"energy", t:1, p:80, short:"MoO"},
  {id:"moci_kw",   n:"Ministry of Commerce & Industry", s:"gov", t:1, p:72, short:"MoCI"},
  {id:"moinfo_kw", n:"Ministry of Information & Culture", s:"gov", t:1, p:64, short:"MoInfo"},
  {id:"mopw_kw",   n:"Ministry of Public Works",      s:"gov", t:1, p:66, short:"MoPW"},
  {id:"kwmun",     n:"Kuwait Municipality",           s:"gov", t:1, p:64, short:"Kuwait Municipality"},
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
  {id:"lst_abk", n:"Al Ahli Bank of Kuwait", s:"finance", t:2, p:50, short:"ABK"},
  {id:"lst_kib", n:"Kuwait International Bank", s:"finance", t:2, p:50, short:"KIB"},
  {id:"lst_burg", n:"Burgan Bank", s:"finance", t:2, p:50, short:"Burgan Bank"},
  {id:"lst_boubyan", n:"Boubyan Bank", s:"finance", t:2, p:50, short:"Boubyan Bank"},
  {id:"lst_ifa", n:"International Financial Advisors Holding", s:"finance", t:2, p:50, short:"IFA"},
  {id:"lst_ninv", n:"National Investments Co", s:"finance", t:2, p:50, short:"NINV"},
  {id:"lst_kproj", n:"Kuwait Projects Holding", s:"finance", t:2, p:50, short:"KPROJ"},
  {id:"lst_arzan", n:"Arzan Financial Group for Financing and Investment", s:"finance", t:2, p:50, short:"ARZAN"},
  {id:"lst_aayan", n:"Aayan Leasing and Investment", s:"finance", t:2, p:50, short:"AAYAN"},
  {id:"lst_kre", n:"Kuwait Real Estate Co KSC", s:"realestate", t:2, p:50, short:"KRE"},
  {id:"lst_urc", n:"United Real Estate K.S.C", s:"realestate", t:2, p:50, short:"URC"},
  {id:"lst_sre", n:"Salhia Real Estate", s:"realestate", t:2, p:50, short:"Salhia Real Estate"},
  {id:"lst_altijaria", n:"The Commercial Real Estate Co K.S.C", s:"realestate", t:2, p:50, short:"ALTIJARIA"},
  {id:"lst_nind", n:"National Industries Group Holding", s:"finance", t:2, p:50, short:"NIND"},
  {id:"lst_cable", n:"Gulf Cables and Electrical Industries Group Co. K.S.C.P", s:"industry", t:2, p:50, short:"CABLE"},
  {id:"lst_ship", n:"Heavy Engineering Industries and Shipbuilding", s:"industry", t:2, p:50, short:"SHIP"},
  {id:"lst_bpcc", n:"Boubyan Petrochemical Co KSCP", s:"materials", t:2, p:50, short:"BPCC"},
  {id:"lst_zain", n:"Mobile Telecommunications Company", s:"comm", t:2, p:50, short:"ZAIN"},
  {id:"lst_humansoft", n:"Human Soft Holding", s:"industry", t:2, p:50, short:"Human Soft Holding"},
  {id:"lst_ifahr", n:"IFA Hotels and Resorts", s:"consumer_disc", t:2, p:50, short:"IFAHR"},
  {id:"lst_cgc", n:"Combined Group Contracting KSCP", s:"industry", t:2, p:50, short:"CGC"},
  {id:"lst_oulafuel", n:"Oula Fuel Marketing", s:"consumer_disc", t:2, p:50, short:"Oula Fuel Marketing"},
  {id:"lst_gfh", n:"GFH Bank B.S.C.", s:"finance", t:2, p:50, short:"GFH Bank B.S.C."},
  {id:"lst_warbabank", n:"Warba Bank", s:"finance", t:2, p:50, short:"Warba Bank"},
  {id:"lst_stc", n:"Kuwait Telecommunications Company", s:"comm", t:2, p:50, short:"STC"},
  {id:"lst_integrated", n:"Integrated Holding Co KSC", s:"industry", t:2, p:50, short:"INTEGRATED"},
  {id:"lst_beyout", n:"Beyout Holding Company K.P.S.C", s:"finance", t:2, p:50, short:"BEYOUT"},
  {id:"lst_alftaqa", n:"Action Energy Company K.S.C.P", s:"energy", t:2, p:50, short:"ALFTAQA"},
  {id:"lst_trolley", n:"Trolley General Trading Company K.S.C.P", s:"consumer_disc", t:2, p:50, short:"TROLLEY"},
  {id:"lst_cbk", n:"Commercial Bank of Kuwait", s:"finance", t:2, p:50, short:"CBK"},
  {id:"lst_facil", n:"Commercial Facilities Co S.A.K", s:"finance", t:2, p:50, short:"FACIL"},
  {id:"lst_coast", n:"Coast Investment and Development", s:"finance", t:2, p:50, short:"COAST"},
  {id:"lst_sech", n:"The Securities House K.S.C", s:"finance", t:2, p:50, short:"SECH"},
  {id:"lst_markaz", n:"Kuwait Financial Centre", s:"finance", t:2, p:50, short:"MARKAZ"},
  {id:"lst_kmefic", n:"Kuwait and Middle East Financial Investment", s:"finance", t:2, p:50, short:"KMEFIC"},
  {id:"lst_alola", n:"First Investment", s:"finance", t:2, p:50, short:"First Investment"},
  {id:"lst_gih", n:"Gulf Investment House", s:"finance", t:2, p:50, short:"GIH"},
  {id:"lst_bayaninv", n:"Bayan Investment Holding Co.", s:"finance", t:2, p:50, short:"BAYANINV"},
  {id:"lst_osoul", n:"Osoul Investment", s:"finance", t:2, p:50, short:"Osoul Investment"},
  {id:"lst_kfic", n:"KFIC Invest K.S.C.P", s:"finance", t:2, p:50, short:"KFIC Invest K.S.C.P"},
  {id:"lst_kamco", n:"KAMCO Investment", s:"finance", t:2, p:50, short:"KAMCO Investment"},
  {id:"lst_nih", n:"National International Holding K.S.C", s:"finance", t:2, p:50, short:"NIH"},
  {id:"lst_unicap", n:"Unicap Investment and Finance", s:"finance", t:2, p:50, short:"UNICAP"},
  {id:"lst_madar", n:"Al Madar Kuwait Holding Co.", s:"finance", t:2, p:50, short:"MADAR"},
  {id:"lst_aldeera", n:"Al Deera Holding", s:"finance", t:2, p:50, short:"Al Deera Holding"},
  {id:"lst_alsafat", n:"Al Safat Investment Company K.S.C.C", s:"finance", t:2, p:50, short:"ALSAFAT"},
  {id:"lst_ekttitab", n:"Ekttitab Holding", s:"finance", t:2, p:50, short:"Ekttitab Holding"},
  {id:"lst_sokouk", n:"Sokouk Holding", s:"realestate", t:2, p:50, short:"Sokouk Holding"},
  {id:"lst_noor", n:"Noor Financial Investment Co", s:"finance", t:2, p:50, short:"NOOR"},
  {id:"lst_taminv", n:"Tamdeen Investment Co KPSC", s:"finance", t:2, p:50, short:"TAMINV"},
  {id:"lst_emirates", n:"Kuwait Emirates Holding Company K.S.C.P", s:"finance", t:2, p:50, short:"EMIRATES"},
  {id:"lst_asiya", n:"Asiya Capital Investments Co", s:"finance", t:2, p:50, short:"ASIYA"},
  {id:"lst_rasiyat", n:"Rasiyat Holding Company K.P.S.C.", s:"finance", t:2, p:50, short:"RASIYAT"},
  {id:"lst_alimtiaz", n:"Al Imtiaz Group Holding Company K.S.C.P", s:"finance", t:2, p:50, short:"ALIMTIAZ"},
  {id:"lst_kins", n:"Kuwait Insurance Co S.A.K", s:"finance", t:2, p:50, short:"KINS"},
  {id:"lst_gins", n:"Gulf Insurance Group", s:"finance", t:2, p:50, short:"Gulf Insurance Group"},
  {id:"lst_ains", n:"Al Ahleia Insurance Co S.A.K.P.", s:"finance", t:2, p:50, short:"AINS"},
  {id:"lst_winsre", n:"Warba Insurance and Reinsurance Company K.S.C.P", s:"finance", t:2, p:50, short:"WINSRE"},
  {id:"lst_kuwaitre", n:"Kuwait Reinsurance Co K.S.P.C", s:"finance", t:2, p:50, short:"KUWAITRE"},
  {id:"lst_fti", n:"First Takaful Insurance", s:"finance", t:2, p:50, short:"FTI"},
  {id:"lst_wethaq", n:"Wethaq Takaful Insurance", s:"finance", t:2, p:50, short:"WETHAQ"},
  {id:"lst_nre", n:"National Real Estate Co K.S.C", s:"realestate", t:2, p:50, short:"NRE"},
  {id:"lst_tam", n:"Tamdeen Real Estate Co KSC", s:"realestate", t:2, p:50, short:"TAM"},
  {id:"lst_areec", n:"Ajial Real Estate Entertainment", s:"realestate", t:2, p:50, short:"AREEC"},
  {id:"lst_arabrec", n:"Al Arabiya Real Estate Co KSC", s:"realestate", t:2, p:50, short:"ARABREC"},
  {id:"lst_alenma", n:"Al Enma'a Real Estate Co. K.S.C.P", s:"realestate", t:2, p:50, short:"ALENMA"},
  {id:"lst_injazzat", n:"Injazzat Real Estate Development", s:"realestate", t:2, p:50, short:"INJAZZAT"},
  {id:"lst_sanam", n:"Sanam Group Holding Company K.P.S.C", s:"realestate", t:2, p:50, short:"SANAM"},
  {id:"lst_aayanre", n:"Aayan Real Estate Co KSCP", s:"realestate", t:2, p:50, short:"AAYANRE"},
  {id:"lst_aqar", n:"Aqar Real Estate Investments", s:"realestate", t:2, p:50, short:"AQAR"},
  {id:"lst_mazaya", n:"Al Mazaya Holding", s:"realestate", t:2, p:50, short:"Al Mazaya Holding"},
  {id:"lst_tijara", n:"Tijara and Real Estate Investment", s:"realestate", t:2, p:50, short:"TIJARA"},
  {id:"lst_argan", n:"Alargan International Real Estate", s:"realestate", t:2, p:50, short:"ARGAN"},
  {id:"lst_munshaat", n:"Munshaat Real Estate Projects", s:"realestate", t:2, p:50, short:"MUNSHAAT"},
  {id:"lst_kbt", n:"Kuwait Business Town Real Estate", s:"realestate", t:2, p:50, short:"KBT"},
  {id:"lst_manazel", n:"Manazel Holding", s:"finance", t:2, p:50, short:"Manazel Holding"},
  {id:"lst_mena", n:"Mena Real Estate", s:"realestate", t:2, p:50, short:"Mena Real Estate"},
  {id:"lst_marakez", n:"Marakez Real Estate Development Company K.P.S.C", s:"realestate", t:2, p:50, short:"MARAKEZ"},
  {id:"lst_kcem", n:"Kuwait Cement K.P.S.C.", s:"materials", t:2, p:50, short:"KCEM"},
  {id:"lst_pcem", n:"Kuwait Portland Cement", s:"materials", t:2, p:50, short:"PCEM"},
  {id:"lst_shuaiba", n:"Shuaiba Industrial Co. K.S.P.C", s:"materials", t:2, p:50, short:"SHUAIBA"},
  {id:"lst_mrc", n:"Metal and Recycling", s:"materials", t:2, p:50, short:"Metal and Recycling"},
  {id:"lst_kfouc", n:"Kuwait Foundry", s:"materials", t:2, p:50, short:"Kuwait Foundry"},
  {id:"lst_acico", n:"Acico Industries", s:"materials", t:2, p:50, short:"Acico Industries"},
  {id:"lst_alkout", n:"Al Kout Industrial Projects", s:"materials", t:2, p:50, short:"ALKOUT"},
  {id:"lst_equipment", n:"Equipment Holding", s:"industry", t:2, p:50, short:"Equipment Holding"},
  {id:"lst_ncci", n:"National Consumer Holding Co", s:"finance", t:2, p:50, short:"NCCI"},
  {id:"lst_warbacap", n:"Warba Capital Holding Co", s:"finance", t:2, p:50, short:"WARBACAP"},
  {id:"lst_kcin", n:"Kuwait National Cinema", s:"consumer_disc", t:2, p:50, short:"KCIN"},
  {id:"lst_khot", n:"Kuwait Hotels Co KSCP", s:"consumer_disc", t:2, p:50, short:"KHOT"},
  {id:"lst_senergy", n:"Senergy Holding Co", s:"energy", t:2, p:50, short:"Senergy Holding Co"},
  {id:"lst_ipg", n:"Independent Petroleum Group KSCP", s:"energy", t:2, p:50, short:"IPG"},
  {id:"lst_cleaning", n:"National Cleaning Co KSCP", s:"industry", t:2, p:50, short:"CLEANING"},
  {id:"lst_asc", n:"Automated Systems Co KPSC", s:"tech", t:2, p:50, short:"ASC"},
  {id:"lst_napesco", n:"National Petroleum Services", s:"energy", t:2, p:50, short:"NAPESCO"},
  {id:"lst_kcpc", n:"Kuwait Company for Process Plant Construction and Contracting", s:"industry", t:2, p:50, short:"KCPC"},
  {id:"lst_phc", n:"Privatization Holding", s:"finance", t:2, p:50, short:"PHC"},
  {id:"lst_energyh", n:"The Energy House Holding", s:"energy", t:2, p:50, short:"ENERGYH"},
  {id:"lst_gfc", n:"Gulf Franchising Holding", s:"finance", t:2, p:50, short:"GFC"},
  {id:"lst_tahssilat", n:"Credit Rating and Collection", s:"finance", t:2, p:50, short:"TAHSSILAT"},
  {id:"lst_abar", n:"Burgan Company for Well Drilling, Trading and Maintenance", s:"energy", t:2, p:50, short:"ABAR"},
  {id:"lst_papco", n:"Palms Agro Production", s:"consumer_stap", t:2, p:50, short:"PAPCO"},
  {id:"lst_osos", n:"Osos Holding Group Co", s:"realestate", t:2, p:50, short:"OSOS"},
  {id:"lst_upac", n:"United Projects Co for Aviation Services", s:"industry", t:2, p:50, short:"UPAC"},
  {id:"lst_mashaer", n:"Mashaer Holding", s:"realestate", t:2, p:50, short:"Mashaer Holding"},
  {id:"lst_digitus", n:"Digitus Group for Digital Infrastructure Data Centers & Communications KSCP", s:"comm", t:2, p:50, short:"DIGITUS"},
  {id:"lst_mubarrad", n:"Mubarrad Holding Company", s:"industry", t:2, p:50, short:"MUBARRAD"},
  {id:"lst_muntazahat", n:"Kuwait Resorts", s:"consumer_disc", t:2, p:50, short:"Kuwait Resorts"},
  {id:"lst_atc", n:"Advanced Technology", s:"health", t:2, p:50, short:"Advanced Technology"},
  {id:"lst_soor", n:"Soor Fuel Marketing", s:"consumer_disc", t:2, p:50, short:"Soor Fuel Marketing"},
  {id:"lst_futurekid", n:"Future Kid Entertainment and Real Estate", s:"consumer_disc", t:2, p:50, short:"FUTUREKID"},
  {id:"lst_cattl", n:"Livestock Transport and Trading Co KSC", s:"consumer_stap", t:2, p:50, short:"CATTL"},
  {id:"lst_qic", n:"Umm Al Qaiwain General Investment Co PSC", s:"finance", t:2, p:50, short:"QIC"},
  {id:"lst_valmore", n:"Valmore Holding", s:"finance", t:2, p:50, short:"Valmore Holding"},
  {id:"lst_bkikwt", n:"Bahrain Kuwaiti Insurance Co B.S.C.", s:"finance", t:2, p:50, short:"BKIKWT"},
  {id:"lst_inovest", n:"Inovest BSC", s:"finance", t:2, p:50, short:"Inovest BSC"},
  {id:"lst_almanar", n:"Al Manar Financing and Leasing Co KSCP", s:"finance", t:2, p:50, short:"ALMANAR"},
  {id:"lst_jtc", n:"JTC Logistics Transportation & Stevedoring Company K.S.C.P", s:"industry", t:2, p:50, short:"JTC"},
  {id:"lst_spec", n:"Specialities Group Holding", s:"industry", t:2, p:50, short:"SPEC"},
  {id:"lst_masaken", n:"Al Masaken International Real Estate Development", s:"realestate", t:2, p:50, short:"MASAKEN"},
  {id:"lst_dalqanre", n:"Dalqan Real Estate Co K.S.C", s:"realestate", t:2, p:50, short:"DALQANRE"},
  {id:"lst_midan", n:"Al Maidan Clinic for Oral Health Services Co KSC", s:"health", t:2, p:50, short:"MIDAN"},
  {id:"lst_thuraya", n:"Dar Al Thuraya Real Estate", s:"realestate", t:2, p:50, short:"THURAYA"},
  {id:"lst_amar", n:"Amar for Finance and Leasing", s:"finance", t:2, p:50, short:"AMAR"},
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
  {id:"yahya_fm", n:"H.E. Sheikh Jarrah Jaber Al-Ahmad Al-Sabah", t:1, p:76, s:"gov", roles:[
    ["mofa_kw","Minister of Foreign Affairs","political","v"]],
    note:"Appointed in the 1 February 2026 Amiri Decree cabinet reshuffle, succeeding Abdullah Ali Al-Yahya; son of the late Emir Jaber III."},
  {id:"noora_fin", n:"Dr. Yaqoub Al-Sayyid Yusuf Al-Rifai", t:1, p:74, s:"finance", roles:[
    ["mof_kw","Minister of Finance","political","v"]],
    note:"Appointed in the 1 February 2026 Amiri Decree cabinet reshuffle, succeeding Noora Al-Fassam."},
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

  // ===== ADDED SEP 2026 — KEY MINISTRIES PREVIOUSLY MISSING FROM THE MAP =====
  {id:"alroumi_oil", n:"Tareq Al-Roumi", t:1, p:76, s:"energy", roles:[
    ["moo_kw","Minister of Oil","political","v"],
    ["kpc","Chairman of the Board","board","v"]],
    note:"Appointed Minister of Oil on 29 October 2024; the portfolio carries the ex officio KPC board chairmanship."},
  {id:"boodai_moci_kw", n:"Osama Khaled Boodai", t:1, p:70, s:"gov", roles:[
    ["moci_kw","Minister of Commerce & Industry","political","v"]],
    note:"Appointed in the 1 February 2026 Amiri Decree cabinet reshuffle."},
  {id:"buftain_info", n:"Abdullah Sabeeh Buftain", t:1, p:62, s:"gov", roles:[
    ["moinfo_kw","Minister of Information & Culture","political","v"]],
    note:"Appointed in the 1 February 2026 Amiri Decree cabinet reshuffle."},
  {id:"almashaan_pw", n:"Noura Mohammed Al-Mashaan", t:1, p:64, s:"gov", roles:[
    ["mopw_kw","Minister of Public Works","political","v"]]},
  {id:"alasfour_mun", n:"Manal Mohammed Al-Asfour", t:2, p:58, s:"gov", roles:[
    ["kwmun","Director-General","executive","v"]],
    note:"Appointed Director-General of Kuwait Municipality with the rank of Undersecretary by Amiri decree, December 2025."},
  {id:"hamad_mohamed_al", n:"Hamad Mohamed Al-Bahar", t:2, p:62, s:"finance", roles:[
    ["nbk","Chairman","board","v"]]},
  {id:"isam_jasem_al", n:"Isam Jasem Al-Sager", t:2, p:62, s:"finance", roles:[
    ["nbk","Vice-Chairman & Group CEO","board","v"]]},
  {id:"yacoub_yousef_al", n:"Yacoub Yousef Al-Fulaij", t:2, p:52, s:"finance", roles:[
    ["nbk","Board Member","board","v"]]},
  {id:"muthana_mohamed_al", n:"Muthana Mohamed Al-Hamad", t:2, p:52, s:"finance", roles:[
    ["nbk","Board Member","board","v"]]},
  {id:"haitham_sulaiman_al", n:"Haitham Sulaiman Al-Khaled", t:2, p:52, s:"finance", roles:[
    ["nbk","Board Member","board","v"]]},
  {id:"emad_mohamed_al", n:"Emad Mohamed Al-Bahar", t:2, p:52, s:"finance", roles:[
    ["nbk","Board Member","board","v"]]},
  {id:"huda_mohammad_al", n:"Huda Mohammad Al-Refaei", t:2, p:52, s:"finance", roles:[
    ["nbk","Board Member","board","v"]]},
  {id:"abdulwahab_ahmad_al", n:"Abdulwahab Ahmad Al-Bader", t:2, p:52, s:"finance", roles:[
    ["nbk","Independent Board Member","board","v"]]},
  {id:"farouq_ali_akbar", n:"Farouq Ali Akbar Bastaki", t:2, p:52, s:"finance", roles:[
    ["nbk","Independent Board Member","board","v"]]},
  {id:"anas_khaled_alsaleh", n:"Anas Khaled AlSaleh", t:2, p:52, s:"finance", roles:[
    ["nbk","Independent Board Member","board","v"]]},
  {id:"shaikha_k_al", n:"Shaikha K. Al-Bahar", t:2, p:58, s:"finance", roles:[
    ["nbk","Deputy Group Chief Executive Officer","executive","v"]]},
  {id:"salah_y_al", n:"Salah Y. Al-Fulaij", t:2, p:60, s:"finance", roles:[
    ["nbk","CEO - Kuwait","executive","v"]]},
  {id:"faisal_abdulatif_al", n:"Faisal Abdulatif Al-Hamad", t:2, p:60, s:"finance", roles:[
    ["nbk","CEO - NBK Wealth Group","executive","v"]]},
  {id:"sujit_ronghe", n:"Sujit Ronghe", t:2, p:58, s:"finance", roles:[
    ["nbk","Group Chief Financial Officer","executive","v"]]},
  {id:"mohammed_al_othman", n:"Mohammed Al-Othman", t:2, p:60, s:"finance", roles:[
    ["nbk","CEO - Consumer & Digital Banking","executive","v"]]},
  {id:"mohammad_yousef_al", n:"Mohammad Yousef Al-Kharafi", t:2, p:58, s:"finance", roles:[
    ["nbk","Group Chief Operating Officer","executive","v"]]},
  {id:"hamad_abdulmohsen_al", n:"Hamad Abdulmohsen Al-Marzouq", t:2, p:62, s:"finance", roles:[
    ["kfh","Chairman","board","v"]]},
  {id:"abdulaziz_yacoub_al", n:"Abdulaziz Yacoub Al-Nafisi", t:2, p:62, s:"finance", roles:[
    ["kfh","Vice Chairman","board","v"]]},
  {id:"khalid_salem_al", n:"Khalid Salem Al-Nisf", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member","board","v"]]},
  {id:"muad_saoud_al", n:"Muad Saoud Al-Osaimi", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member","board","v"]]},
  {id:"fahad_ali_al", n:"Fahad Ali Al-Ghanim", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member","board","v"]]},
  {id:"mohammad_naser_al", n:"Mohammad Naser Al-Fouzan", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member","board","v"]]},
  {id:"sheikh_salem_abdulaziz", n:"Sheikh Salem Abdulaziz Al-Saud Al-Sabah", t:2, p:52, s:"finance", roles:[
    ["kfh","Independent Board Member","board","v"]]},
  {id:"rasheed_mohamed_almaraj", n:"Rasheed Mohamed Almaraj", t:2, p:52, s:"finance", roles:[
    ["kfh","Independent Board Member","board","v"]]},
  {id:"hanan_fares_al", n:"Hanan Fares Al-Fares", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member (KIA Representative)","board","v"]]},
  {id:"naser_abdullateef_al", n:"Naser Abdullateef Al-Rodhan", t:2, p:52, s:"finance", roles:[
    ["kfh","Board Member (KIA Representative)","board","v"]]},
  {id:"haitham_abdulaziz_al", n:"Haitham Abdulaziz Al-Terkait", t:2, p:60, s:"finance", roles:[
    ["kfh","Deputy Group CEO, Technology & Operations","executive","v"]]},
  {id:"abdulkarim_abdullah_alsamdan", n:"Abdulkarim Abdullah AlSamdan", t:2, p:58, s:"finance", roles:[
    ["kfh","Group Chief Financial Officer","executive","v"]]},
  {id:"nour_nael_al", n:"Nour Nael Al-Jassim", t:2, p:62, s:"comm", roles:[
    ["zain","Chairperson","board","v"]]},
  {id:"mishari_asi_al", n:"Mishari Asi Al-Hajri", t:2, p:52, s:"comm", roles:[
    ["zain","Board Member","board","ns"]]},
  {id:"abdulrahman_mohammad_al", n:"Abdulrahman Mohammad Al-Asfour", t:2, p:52, s:"comm", roles:[
    ["zain","Board Member","board","ns"]]},
  {id:"dr_saad_ahmed", n:"Dr. Saad Ahmed Al-Nahedh", t:2, p:52, s:"comm", roles:[
    ["zain","Board Member","board","ns"]]},
  {id:"ossama_michel_matta", n:"Ossama Michel Matta", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Financial Officer","executive","v"]]},
  {id:"henadi_al_saleh", n:"Henadi Al-Saleh", t:2, p:60, s:"industry", roles:[
    ["agility","CEO & Board Member","executive","v"]]},
  {id:"faisal_jamil_sultan", n:"Faisal Jamil Sultan Al-Essa", t:2, p:52, s:"industry", roles:[
    ["agility","Board Member","board","v"]]},
  {id:"essa_al_saleh", n:"Essa Al-Saleh", t:2, p:52, s:"industry", roles:[
    ["agility","Board Member","board","v"]]},
  {id:"ehab_aziz", n:"Ehab Aziz", t:2, p:58, s:"industry", roles:[
    ["agility","Chief Financial Officer","executive","v"]]},
  {id:"hassan_el_houry", n:"Hassan El-Houry", t:2, p:60, s:"industry", roles:[
    ["agility","Group CEO, Menzies Aviation","executive","v"]]},
  {id:"bader_abdullah_al", n:"Bader Abdullah Al-Kandari", t:2, p:62, s:"finance", roles:[
    ["boursa","Vice Chairman","board","v"]]},
  {id:"talal_jassim_al", n:"Talal Jassim Al-Bahar", t:2, p:52, s:"finance", roles:[
    ["boursa","Board Member","board","v"]]},
  {id:"khaled_waleed_al", n:"Khaled Waleed Al-Falah", t:2, p:52, s:"finance", roles:[
    ["boursa","Board Member","board","v"]]},
  {id:"yousef_faisal_al", n:"Yousef Faisal Al-Mannai", t:2, p:52, s:"finance", roles:[
    ["boursa","Board Member","board","v"]]},
  {id:"jassem_hassan_zainal", n:"Jassem Hassan Zainal", t:2, p:52, s:"finance", roles:[
    ["boursa","Board Member","board","v"]]},
  {id:"raed_jawad_bukhamseen", n:"Raed Jawad Bukhamseen", t:2, p:52, s:"finance", roles:[
    ["boursa","Board Member","board","v"]]},
  {id:"dalal_jafaar_behbehani", n:"Dalal Jafaar Behbehani", t:2, p:52, s:"finance", roles:[
    ["boursa","Independent Board Member","board","v"]]},
  {id:"mohammad_saud_al", n:"Mohammad Saud Al-Osaimi", t:2, p:58, s:"finance", roles:[
    ["boursa","Chief Executive Officer","executive","v"]]},
  {id:"naim_azad_din", n:"Naim Azad Din", t:2, p:58, s:"finance", roles:[
    ["boursa","Chief Financial Officer","executive","v"]]},
  {id:"shaikh_khaled_ahmad", n:"Shaikh Khaled Ahmad Al-Sabah", t:2, p:60, s:"energy", roles:[
    ["kpc","Managing Director - International Marketing","executive","v"]]},
  {id:"hesham_ahmad_al", n:"Hesham Ahmad Al-Refae", t:2, p:60, s:"energy", roles:[
    ["kpc","Managing Director - Human Resources and Corporate Services","executive","v"]]},
  {id:"bader_ebrahim_al", n:"Bader Ebrahim Al-Attar", t:2, p:60, s:"energy", roles:[
    ["kpc","Managing Director - Planning & Finance","executive","v"]]},
  {id:"shaikh_saoud_salem", n:"Shaikh Saoud Salem Al-Sabah", t:2, p:52, s:"energy", roles:[
    ["kpc","Board Member","board","v"]]},
  {id:"aseel_suleiman_al", n:"Aseel Suleiman Al-Munifi", t:2, p:52, s:"energy", roles:[
    ["kpc","Board Member","board","v"]]},
  {id:"wafa_ahmed_al", n:"Wafa Ahmed Al-Qatami", t:2, p:52, s:"energy", roles:[
    ["kpc","Board Member","board","v"]]},
  {id:"yousef_abdullah_al", n:"Yousef Abdullah Al-Yateem", t:2, p:52, s:"energy", roles:[
    ["kpc","Board Member","board","v"]]},
  {id:"yousef_khaled_al", n:"Yousef Khaled Al-Qabandi", t:2, p:52, s:"energy", roles:[
    ["kpc","Board Member","board","v"]]},
  {id:"ameena_rajab_saleh", n:"Ameena Rajab Saleh", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - Gas & Environment","executive","v"]]},
  {id:"khaled_al_mulla", n:"Khaled Al-Mulla", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - Exploration & Drilling","executive","v"]]},
  {id:"hamad_rashid_al", n:"Hamad Rashid Al-Zuwayer", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - North & West Kuwait","executive","v"]]},
  {id:"mohammad_khalifa_al", n:"Mohammad Khalifa Al-AbdulJaleel", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - Planning & Innovation","executive","v"]]},
  {id:"waleed_khaled_al", n:"Waleed Khaled Al-Rubaian", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - Admin & Finance","executive","v"]]},
  {id:"fuad_mohammad_al", n:"Fuad Mohammad Al-Shaikh", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - South & East Kuwait","executive","v"]]},
  {id:"musaed_sulaiman_al", n:"Musaed Sulaiman Al-Rasheed", t:2, p:60, s:"energy", roles:[
    ["koc","Deputy CEO - Commercial & Projects Engineering","executive","v"]]},
  {id:"khaled_ali_al", n:"Khaled Ali Al-Khayyat", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Planning & Finance","executive","v"]]},
  {id:"ghanim_naser_al", n:"Ghanim Naser Al-Otaibi", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Projects","executive","v"]]},
  {id:"shujaa_salem_al", n:"Shujaa Salem Al-Ajmi", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Mina Al-Ahmadi Refinery","executive","v"]]},
  {id:"abdullah_shaker_al", n:"Abdullah Shaker Al-Otaibi", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Mina Abdullah Refinery","executive","v"]]},
  {id:"bandar_mahdi_al", n:"Bandar Mahdi Al-Qahtani", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Admin & Commercial","executive","v"]]},
  {id:"khuloud_saad_al", n:"Khuloud Saad Al-Mutairi", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Support Services","executive","v"]]},
  {id:"fahad_saad_al", n:"Fahad Saad Al-Mutairi", t:2, p:60, s:"energy", roles:[
    ["knpc","Deputy CEO - Al-Zour Operations","executive","v"]]},
  {id:"sheikh_hamad_sabah", n:"Sheikh Hamad Sabah Al Ahmad Al Sabah", t:2, p:62, s:"sovereign", roles:[
    ["kipco","Chairman","board","v"]]},
  {id:"sheikh_abdullah_naser", n:"Sheikh Abdullah Naser Sabah Al Ahmad Al Sabah", t:2, p:62, s:"sovereign", roles:[
    ["kipco","Vice Chairman","board","v"]]},
  {id:"sheikha_bibi_naser", n:"Sheikha Bibi Naser Sabah Al Ahmad Al Sabah", t:2, p:52, s:"sovereign", roles:[
    ["kipco","Non-Executive Board Member","board","v"]]},
  {id:"abdullah_yacoub_bishara", n:"Abdullah Yacoub Bishara", t:2, p:52, s:"sovereign", roles:[
    ["kipco","Independent Board Member","board","v"]]},
  {id:"samer_khanachet", n:"Samer Khanachet", t:2, p:60, s:"sovereign", roles:[
    ["kipco","Deputy Group Chief Executive Officer","executive","v"]]},
  {id:"sheikh_sabah_mohammad", n:"Sheikh Sabah Mohammad Abdulaziz Al Sabah", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Group Chief Investment Officer","executive","v"]]},
  {id:"moustapha_samir_chami", n:"Moustapha Samir Chami", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Group Chief Financial Officer","executive","v"]]},
  {id:"khaled_abdul_jabbar", n:"Khaled Abdul Jabbar Al Sharrad", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Group Chief HR & Admin Officer and Board Secretary","executive","v"]]},
  {id:"samer_abbouchi", n:"Samer Abbouchi", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Deputy Group Chief Investment Officer","executive","v"]]},
  {id:"adel_jasem_al", n:"Adel Jasem Al Waqayan", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Group Treasurer","executive","v"]]},
  {id:"mohammad_abdullah_al", n:"Mohammad Abdullah Al Hubail", t:2, p:58, s:"sovereign", roles:[
    ["kipco","Deputy Group Chief of HR & Admin","executive","v"]]},
  {id:"eman_mohammad_al", n:"Eman Mohammad Al Awadhi", t:2, p:46, s:"sovereign", roles:[
    ["kipco","Group SVP - Corporate Communications & Investor Relations","executive","v"]]},
  {id:"riyad_mohammed_hanbali", n:"Riyad Mohammed Hanbali", t:2, p:46, s:"sovereign", roles:[
    ["kipco","Group VP - Internal Audit","executive","v"]]},
  {id:"mohammad_al_marshed", n:"Mohammad Al-Marshed", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Technology Officer","executive","v"]]},
  {id:"kamil_hilali", n:"Kamil Hilali", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Strategy Officer","executive","v"]]},
  {id:"mohammad_abdal", n:"Mohammad Abdal", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Corporate Affairs & Communications Officer","executive","v"]]},
  {id:"nawal_h_bourisli", n:"Nawal H. Bourisli", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Purpose & HR Officer","executive","v"]]},
  {id:"malek_hammoud", n:"Malek Hammoud", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Investment & Digital Transformation Officer","executive","v"]]},
  {id:"firas_oggar", n:"Firas Oggar", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Legal Officer","executive","v"]]},
  {id:"dr_andrew_arowojolu", n:"Dr. Andrew Arowojolu", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Regulatory Officer","executive","v"]]},
  {id:"jennifer_suleiman", n:"Jennifer Suleiman", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Sustainability Officer","executive","v"]]},
  {id:"abdul_ghaffar_setareh", n:"Abdul Ghaffar Setareh", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Risk Officer","executive","v"]]},
  {id:"javier_garcia_cuadrado", n:"Javier Garcia Cuadrado", t:2, p:58, s:"comm", roles:[
    ["zain","Group Chief Internal Auditor","executive","v"]]},
  {id:"ahmad_mohammad_al", n:"Ahmad Mohammad Al Bahar", t:2, p:62, s:"finance", roles:[
    ["gulfbank","Chairman of the Board of Directors","board","v"]]},
  {id:"ali_morad_yusuf", n:"Ali Morad Yusuf Behbehani", t:2, p:62, s:"finance", roles:[
    ["gulfbank","Deputy Chairman of the Board of Directors","board","v"]]},
  {id:"omar_hamad_youssef", n:"Omar Hamad Youssef Al-Essa", t:2, p:62, s:"finance", roles:[
    ["gulfbank","Deputy Chairman of the Board","board","v"]]},
  {id:"abdullah_sayer_bader", n:"Abdullah Sayer Bader AlSayer", t:2, p:62, s:"finance", roles:[
    ["gulfbank","Deputy Chairman of the Board","board","v"]]},
  {id:"dr_fawaz_mohammad", n:"Dr. Fawaz Mohammad Alawadhi", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Board Member","board","v"]]},
  {id:"muath_saleh_alrayes", n:"Muath Saleh AlRayes", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Board Member","board","v"]]},
  {id:"dalal_hisham_alrayes", n:"Dalal Hisham AlRayes", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Board Member","board","v"]]},
  {id:"dr_abdulrahman_mohammad", n:"Dr. AbdulRahman Mohammad Al-Taweel", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Independent Board Member","board","v"]]},
  {id:"talal_ali_nasser", n:"Talal Ali Nasser Al-Sayegh", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Independent Board Member","board","v"]]},
  {id:"majed_essa_al", n:"Majed Essa Al-Ajeel", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Independent Board Member","board","v"]]},
  {id:"eid_naser_alshehri", n:"Eid Naser AlShehri", t:2, p:52, s:"finance", roles:[
    ["gulfbank","Independent Board Member","board","v"]]},
  {id:"sami_mahfouz", n:"Sami Mahfouz", t:2, p:60, s:"finance", roles:[
    ["gulfbank","Acting Chief Executive Officer","executive","v"]]},
  {id:"faisal_aladsani", n:"Faisal AlAdsani", t:2, p:60, s:"finance", roles:[
    ["gulfbank","Deputy Chief Executive Officer","executive","v"]]},
  {id:"david_challinor", n:"David Challinor", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Chief Financial Officer","executive","v"]]},
  {id:"soly_mathew", n:"Soly Mathew", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Acting Chief Risk Officer","executive","v"]]},
  {id:"ali_alfaras", n:"Ali AlFaras", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Chief Internal Auditor","executive","v"]]},
  {id:"faisal_algharabally", n:"Faisal AlGharabally", t:2, p:46, s:"finance", roles:[
    ["gulfbank","General Manager Corporate and International Banking","executive","v"]]},
  {id:"lamia_karam", n:"Lamia Karam", t:2, p:46, s:"finance", roles:[
    ["gulfbank","General Manager Treasury","executive","v"]]},
  {id:"mona_mansour", n:"Mona Mansour", t:2, p:46, s:"finance", roles:[
    ["gulfbank","General Manager Customer Service Delivery","executive","v"]]},
  {id:"dari_albader", n:"Dari AlBader", t:2, p:46, s:"finance", roles:[
    ["gulfbank","General Manager Corporate Affairs","executive","v"]]},
  {id:"hamed_altamimi", n:"Hamed AlTamimi", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Chief Human Resources Officer","executive","v"]]},
  {id:"meshal_alwazzan", n:"Meshal AlWazzan", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Chief Strategy Officer","executive","v"]]},
  {id:"tarek_ragab", n:"Tarek Ragab", t:2, p:46, s:"finance", roles:[
    ["gulfbank","Acting General Manager Consumer Banking","executive","v"]]},
  {id:"najla_aleisa", n:"Najla Aleisa", t:2, p:58, s:"finance", roles:[
    ["gulfbank","Chief Marketing Officer","executive","v"]]},
  {id:"marwan_marzouk_boodai", n:"Marwan Marzouk Boodai", t:2, p:62, s:"industry", roles:[
    ["jazeera","Chairman","board","v"]]},
  {id:"mohamed_al_mousa", n:"Mohamed Al-Mousa", t:2, p:62, s:"industry", roles:[
    ["jazeera","Vice Chairman","board","v"]]},
  {id:"marzouk_jassim_boodai", n:"Marzouk Jassim Boodai", t:2, p:52, s:"industry", roles:[
    ["jazeera","Board Member","board","v"]]},
  {id:"hany_shawky", n:"Hany Shawky", t:2, p:52, s:"industry", roles:[
    ["jazeera","Board Member","board","v"]]},
  {id:"dermot_mannion", n:"Dermot Mannion", t:2, p:52, s:"industry", roles:[
    ["jazeera","Board Member","board","v"]]},
  {id:"mishaal_al_usaimi", n:"Mishaal Al-Usaimi", t:2, p:52, s:"industry", roles:[
    ["jazeera","Board Member","board","v"]]},
  {id:"seham_alhusaini", n:"Seham AlHusaini", t:2, p:52, s:"industry", roles:[
    ["jazeera","Independent Board Member","board","v"]]},
  {id:"bertrand_grabowski", n:"Bertrand Grabowski", t:2, p:52, s:"industry", roles:[
    ["jazeera","Independent Board Member","board","v"]]},
  {id:"ahmad_abdalla", n:"Ahmad Abdalla", t:2, p:58, s:"industry", roles:[
    ["jazeera","Chief Operating Officer and Board Member","executive","v"]]},
  {id:"mohammed_a_alshaya", n:"Mohammed A. Alshaya", t:2, p:62, s:"realestate", roles:[
    ["mabanee","Chairman of the Board of Directors","board","v"]]},
  {id:"mohammed_a_latif", n:"Mohammed A. Latif Alshaya", t:2, p:62, s:"realestate", roles:[
    ["mabanee","Vice-Chairman","board","v"]]},
  {id:"humood_abdullah_alshaya", n:"Humood Abdullah Alshaya", t:2, p:52, s:"realestate", roles:[
    ["mabanee","Board Member","board","v"]]},
  {id:"ayman_a_latif", n:"Ayman A. Latif Alshaya", t:2, p:52, s:"realestate", roles:[
    ["mabanee","Board Member","board","v"]]},
  {id:"azzam_a_al", n:"Azzam A. Al Fulaij", t:2, p:52, s:"realestate", roles:[
    ["mabanee","Board Member","board","v"]]},
  {id:"mohammed_rashid_al", n:"Mohammed Rashid Al-Mutairi", t:2, p:52, s:"realestate", roles:[
    ["mabanee","Board Member","board","v"]]},
  {id:"khalifah_abdullah_alajeel", n:"Khalifah Abdullah Alajeel", t:2, p:52, s:"realestate", roles:[
    ["mabanee","Board Member","board","v"]]},
  {id:"tareq_abdulwahab_aladsani", n:"Tareq Abdulwahab AlAdsani", t:2, p:60, s:"realestate", roles:[
    ["mabanee","Deputy Chief Executive Officer","executive","v"]]},
  {id:"saud_abdulmohsin_al", n:"Saud Abdulmohsin Al Zabin", t:2, p:58, s:"realestate", roles:[
    ["mabanee","Chief Administrative Officer","executive","v"]]},
  {id:"waleed_khaled_al_b", n:"Waleed Khaled Al Fahad", t:2, p:58, s:"realestate", roles:[
    ["mabanee","Chief Operating Officer","executive","v"]]},
  {id:"sulaiman_mohammed_alrubaie", n:"Sulaiman Mohammed Alrubaie", t:2, p:58, s:"realestate", roles:[
    ["mabanee","Chief Investment Officer","executive","v"]]},
  {id:"abhishek_rastogi", n:"Abhishek Rastogi", t:2, p:58, s:"realestate", roles:[
    ["mabanee","Chief Financial Officer","executive","v"]]},
  {id:"muntaser_jassim_mohammed", n:"Muntaser Jassim Mohammed Al-Wazzan", t:2, p:62, s:"consumer_stap", roles:[
    ["mezzan","Chairman","board","v"]]},
  {id:"sulaiman_khaled_jassim", n:"Sulaiman Khaled Jassim Al-Wazzan", t:2, p:62, s:"consumer_stap", roles:[
    ["mezzan","Vice Chairman","board","v"]]},
  {id:"mohammed_ahmad_al", n:"Mohammed Ahmad Al-Sayed Omar", t:2, p:52, s:"consumer_stap", roles:[
    ["mezzan","Independent Director","board","v"]]},
  {id:"thamer_ahmad_abdullah", n:"Thamer Ahmad Abdullah Al-Saleh", t:2, p:52, s:"consumer_stap", roles:[
    ["mezzan","Independent Director","board","v"]]},
  {id:"ali_abdulrahman_jassim", n:"Ali Abdulrahman Jassim Al-Wazzan", t:2, p:52, s:"consumer_stap", roles:[
    ["mezzan","Board Member","board","v"]]},
  {id:"khaled_taher_jassim", n:"Khaled Taher Jassim Al-Wazzan", t:2, p:52, s:"consumer_stap", roles:[
    ["mezzan","Board Member","board","v"]]},
  {id:"mohammed_khaled_jassim", n:"Mohammed Khaled Jassim Al-Wazzan", t:2, p:52, s:"consumer_stap", roles:[
    ["mezzan","Board Member","board","v"]]},
  {id:"amr_farghal", n:"Amr Farghal", t:2, p:60, s:"consumer_stap", roles:[
    ["mezzan","Group Chief Executive Officer","executive","v"]]},
  {id:"omar_samoud", n:"Omar Samoud", t:2, p:58, s:"consumer_stap", roles:[
    ["mezzan","Group Chief Financial Officer","executive","v"]]},
  {id:"jassim_mohammed_jassim", n:"Jassim Mohammed Jassim Al Wazzan", t:2, p:60, s:"consumer_stap", roles:[
    ["mezzan","Deputy CEO for Food and FMCG","executive","v"]]},
  {id:"dr_rashed_reyadh", n:"Dr. Rashed Reyadh Khazaal", t:2, p:60, s:"consumer_stap", roles:[
    ["mezzan","Chief Executive Officer Healthcare","executive","v"]]},
  {id:"timothy_drury", n:"Timothy Drury", t:2, p:58, s:"consumer_stap", roles:[
    ["mezzan","Chief Supply Chain Officer","executive","v"]]},
  {id:"h_e_abdulaziz", n:"H.E. Abdulaziz AlMarzooq", t:2, p:62, s:"sovereign", roles:[
    ["kia","State Minister for Economic Affairs and Investment and Chairman of the Board","board","v"]]},
  {id:"h_e_tareq", n:"H.E. Tareq Al-Roumi", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member (Minister of Oil)","board","v"]]},
  {id:"h_e_basel", n:"H.E. Basel Al-Haroon", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member (Governor of the Central Bank of Kuwait)","board","v"]]},
  {id:"aseel_al_munifi", n:"Aseel Al-Munifi", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member (Undersecretary of the Ministry of Finance)","board","v"]]},
  {id:"h_e_sheikh", n:"H.E. Sheikh Dr. Meshaal Jaber Al-Ahmad Al-Sabah", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member","board","v"]]},
  {id:"sheikh_saoud_salem", n:"Sheikh Saoud Salem Abdulaziz Al-Sabah", t:2, p:60, s:"sovereign", roles:[
    ["kia","Board Member and Managing Director","board","v"]]},
  {id:"mahmoud_al_marzouq", n:"Mahmoud Al-Marzouq", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member","board","v"]]},
  {id:"danah_al_mulla", n:"Danah Al-Mulla", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member","board","v"]]},
  {id:"salah_al_fouzan", n:"Salah Al-Fouzan", t:2, p:52, s:"sovereign", roles:[
    ["kia","Board Member","board","v"]]},
  {id:"abdulmohsen_almukhaizeem", n:"Abdulmohsen Almukhaizeem", t:2, p:60, s:"sovereign", roles:[
    ["kia","President and CEO Kuwait Investment Office London","executive","v"]]},
  {id:"abdulaziz_alhudaib", n:"Abdulaziz Alhudaib", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Executive Director Planning & Senior Management Support","executive","v"]]},
  {id:"rana_almuzaini", n:"Rana Almuzaini", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Executive Director Operations & Administration","executive","v"]]},
  {id:"hadeel_boukhadour", n:"Hadeel Boukhadour", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Executive Director Alternative Investments","executive","v"]]},
  {id:"huda_almousa", n:"Huda Almousa", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Executive Director General Reserve","executive","v"]]},
  {id:"sarah_al_sane", n:"Sarah Al-Sane", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Executive Director Marketable Securities","executive","v"]]},
  {id:"abdulrazaq_al_buaijan", n:"Abdulrazaq Al-Buaijan", t:2, p:58, s:"sovereign", roles:[
    ["kia","Chief Representative Kuwait Investment Office Shanghai","executive","v"]]},
  {id:"omar_alamiri", n:"Omar Alamiri", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting President Debt Settlement Office","executive","v"]]},
  {id:"yousif_al_roumi", n:"Yousif Al-Roumi", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Director Board of Directors Office","executive","v"]]},
  {id:"waleed_alansari", n:"Waleed Alansari", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Director Legal Affairs","executive","v"]]},
  {id:"eiman_hasan", n:"Eiman Hasan", t:2, p:58, s:"sovereign", roles:[
    ["kia","Acting Director Internal Audit Office","executive","v"]]},
];

const OWNERSHIP = [
  ["cabinet_kw","kwgov","governs under"],
  ["mof_kw","cabinet_kw"],["mofa_kw","cabinet_kw"],
  ["moo_kw","cabinet_kw"],["moci_kw","cabinet_kw"],["moinfo_kw","cabinet_kw"],["mopw_kw","cabinet_kw"],["kwmun","cabinet_kw"],
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
  ["lst_abk","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kib","boursa","listed on Boursa Kuwait","ns"],
  ["lst_burg","boursa","listed on Boursa Kuwait","ns"],
  ["lst_boubyan","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ifa","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ninv","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kproj","boursa","listed on Boursa Kuwait","ns"],
  ["lst_arzan","boursa","listed on Boursa Kuwait","ns"],
  ["lst_aayan","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_urc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_sre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_altijaria","boursa","listed on Boursa Kuwait","ns"],
  ["lst_nind","boursa","listed on Boursa Kuwait","ns"],
  ["lst_cable","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ship","boursa","listed on Boursa Kuwait","ns"],
  ["lst_bpcc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_zain","boursa","listed on Boursa Kuwait","ns"],
  ["lst_humansoft","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ifahr","boursa","listed on Boursa Kuwait","ns"],
  ["lst_cgc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_oulafuel","boursa","listed on Boursa Kuwait","ns"],
  ["lst_gfh","boursa","listed on Boursa Kuwait","ns"],
  ["lst_warbabank","boursa","listed on Boursa Kuwait","ns"],
  ["lst_stc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_integrated","boursa","listed on Boursa Kuwait","ns"],
  ["lst_beyout","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alftaqa","boursa","listed on Boursa Kuwait","ns"],
  ["lst_trolley","boursa","listed on Boursa Kuwait","ns"],
  ["lst_cbk","boursa","listed on Boursa Kuwait","ns"],
  ["lst_facil","boursa","listed on Boursa Kuwait","ns"],
  ["lst_coast","boursa","listed on Boursa Kuwait","ns"],
  ["lst_sech","boursa","listed on Boursa Kuwait","ns"],
  ["lst_markaz","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kmefic","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alola","boursa","listed on Boursa Kuwait","ns"],
  ["lst_gih","boursa","listed on Boursa Kuwait","ns"],
  ["lst_bayaninv","boursa","listed on Boursa Kuwait","ns"],
  ["lst_osoul","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kfic","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kamco","boursa","listed on Boursa Kuwait","ns"],
  ["lst_nih","boursa","listed on Boursa Kuwait","ns"],
  ["lst_unicap","boursa","listed on Boursa Kuwait","ns"],
  ["lst_madar","boursa","listed on Boursa Kuwait","ns"],
  ["lst_aldeera","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alsafat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ekttitab","boursa","listed on Boursa Kuwait","ns"],
  ["lst_sokouk","boursa","listed on Boursa Kuwait","ns"],
  ["lst_noor","boursa","listed on Boursa Kuwait","ns"],
  ["lst_taminv","boursa","listed on Boursa Kuwait","ns"],
  ["lst_emirates","boursa","listed on Boursa Kuwait","ns"],
  ["lst_asiya","boursa","listed on Boursa Kuwait","ns"],
  ["lst_rasiyat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alimtiaz","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kins","boursa","listed on Boursa Kuwait","ns"],
  ["lst_gins","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ains","boursa","listed on Boursa Kuwait","ns"],
  ["lst_winsre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kuwaitre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_fti","boursa","listed on Boursa Kuwait","ns"],
  ["lst_wethaq","boursa","listed on Boursa Kuwait","ns"],
  ["lst_nre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_tam","boursa","listed on Boursa Kuwait","ns"],
  ["lst_areec","boursa","listed on Boursa Kuwait","ns"],
  ["lst_arabrec","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alenma","boursa","listed on Boursa Kuwait","ns"],
  ["lst_injazzat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_sanam","boursa","listed on Boursa Kuwait","ns"],
  ["lst_aayanre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_aqar","boursa","listed on Boursa Kuwait","ns"],
  ["lst_mazaya","boursa","listed on Boursa Kuwait","ns"],
  ["lst_tijara","boursa","listed on Boursa Kuwait","ns"],
  ["lst_argan","boursa","listed on Boursa Kuwait","ns"],
  ["lst_munshaat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kbt","boursa","listed on Boursa Kuwait","ns"],
  ["lst_manazel","boursa","listed on Boursa Kuwait","ns"],
  ["lst_mena","boursa","listed on Boursa Kuwait","ns"],
  ["lst_marakez","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kcem","boursa","listed on Boursa Kuwait","ns"],
  ["lst_pcem","boursa","listed on Boursa Kuwait","ns"],
  ["lst_shuaiba","boursa","listed on Boursa Kuwait","ns"],
  ["lst_mrc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kfouc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_acico","boursa","listed on Boursa Kuwait","ns"],
  ["lst_alkout","boursa","listed on Boursa Kuwait","ns"],
  ["lst_equipment","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ncci","boursa","listed on Boursa Kuwait","ns"],
  ["lst_warbacap","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kcin","boursa","listed on Boursa Kuwait","ns"],
  ["lst_khot","boursa","listed on Boursa Kuwait","ns"],
  ["lst_senergy","boursa","listed on Boursa Kuwait","ns"],
  ["lst_ipg","boursa","listed on Boursa Kuwait","ns"],
  ["lst_cleaning","boursa","listed on Boursa Kuwait","ns"],
  ["lst_asc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_napesco","boursa","listed on Boursa Kuwait","ns"],
  ["lst_kcpc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_phc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_energyh","boursa","listed on Boursa Kuwait","ns"],
  ["lst_gfc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_tahssilat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_abar","boursa","listed on Boursa Kuwait","ns"],
  ["lst_papco","boursa","listed on Boursa Kuwait","ns"],
  ["lst_osos","boursa","listed on Boursa Kuwait","ns"],
  ["lst_upac","boursa","listed on Boursa Kuwait","ns"],
  ["lst_mashaer","boursa","listed on Boursa Kuwait","ns"],
  ["lst_digitus","boursa","listed on Boursa Kuwait","ns"],
  ["lst_mubarrad","boursa","listed on Boursa Kuwait","ns"],
  ["lst_muntazahat","boursa","listed on Boursa Kuwait","ns"],
  ["lst_atc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_soor","boursa","listed on Boursa Kuwait","ns"],
  ["lst_futurekid","boursa","listed on Boursa Kuwait","ns"],
  ["lst_cattl","boursa","listed on Boursa Kuwait","ns"],
  ["lst_qic","boursa","listed on Boursa Kuwait","ns"],
  ["lst_valmore","boursa","listed on Boursa Kuwait","ns"],
  ["lst_bkikwt","boursa","listed on Boursa Kuwait","ns"],
  ["lst_inovest","boursa","listed on Boursa Kuwait","ns"],
  ["lst_almanar","boursa","listed on Boursa Kuwait","ns"],
  ["lst_jtc","boursa","listed on Boursa Kuwait","ns"],
  ["lst_spec","boursa","listed on Boursa Kuwait","ns"],
  ["lst_masaken","boursa","listed on Boursa Kuwait","ns"],
  ["lst_dalqanre","boursa","listed on Boursa Kuwait","ns"],
  ["lst_midan","boursa","listed on Boursa Kuwait","ns"],
  ["lst_thuraya","boursa","listed on Boursa Kuwait","ns"],
  ["lst_amar","boursa","listed on Boursa Kuwait","ns"],
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
