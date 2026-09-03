/* ================================================================
   DUBAI POWER NETWORK — DATASET (V1 backbone)
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
  {id:"dxbgov",    n:"Government of Dubai (Ruler's Court)", s:"gov", t:0, p:100, short:"Ruler's Court"},
  {id:"execco",    n:"Dubai Executive Council",       s:"gov", t:0, p:94, short:"Exec Council"},
  {id:"icd",       n:"Investment Corporation of Dubai", s:"sovereign", t:1, p:95, short:"ICD"},
  {id:"dubaiholding", n:"Dubai Holding",              s:"sovereign", t:1, p:90, short:"Dubai Holding"},
  {id:"difc",      n:"Dubai International Financial Centre", s:"finance", t:1, p:86, short:"DIFC"},
  {id:"vara",      n:"VARA (Virtual Assets Regulator)", s:"finance", t:2, p:70, short:"VARA"},
  {id:"det",       n:"Dept of Economy & Tourism",     s:"gov", t:1, p:82, short:"DET"},
  {id:"dof_dxb",   n:"Dubai Dept of Finance",         s:"gov", t:1, p:78, short:"DoF"},
  {id:"rta",       n:"Roads & Transport Authority",   s:"gov", t:1, p:76, short:"RTA"},
  {id:"dewa",      n:"Dubai Electricity & Water Authority", s:"utilities", t:1, p:82, short:"DEWA"},
  {id:"emirates",  n:"Emirates Group",                s:"industry", t:1, p:92, short:"Emirates"},
  {id:"flydubai",  n:"flydubai",                      s:"industry", t:2, p:72, short:"flydubai"},
  {id:"dxbairports", n:"Dubai Airports",              s:"industry", t:1, p:80, short:"Dubai Airports"},
  {id:"dpworld",   n:"DP World",                      s:"industry", t:1, p:90, short:"DP World"},
  {id:"enbd",      n:"Emirates NBD",                  s:"finance", t:1, p:84, short:"Emirates NBD"},
  {id:"dib",       n:"Dubai Islamic Bank",            s:"finance", t:2, p:76, short:"DIB"},
  {id:"mashreq",   n:"Mashreq Bank",                  s:"finance", t:2, p:74, short:"Mashreq"},
  {id:"dfm",       n:"Dubai Financial Market",        s:"finance", t:2, p:68, short:"DFM"},
  {id:"emaar",     n:"Emaar Properties",              s:"realestate", t:1, p:84, short:"Emaar"},
  {id:"nakheel",   n:"Nakheel (Dubai Holding)",       s:"realestate", t:2, p:72, short:"Nakheel"},
  {id:"damac",     n:"DAMAC Properties",              s:"realestate", t:2, p:74, short:"DAMAC"},
  {id:"tecom",     n:"TECOM Group",                   s:"realestate", t:2, p:68, short:"TECOM"},
  {id:"expocity",  n:"Expo City Dubai",               s:"realestate", t:2, p:70, short:"Expo City"},
  {id:"du",        n:"du (EITC)",                     s:"comm", t:2, p:72, short:"du"},
  {id:"dmcc",      n:"DMCC",                          s:"gov", t:2, p:70, short:"DMCC"},
  {id:"dubaichambers", n:"Dubai Chambers",            s:"gov", t:1, p:72, short:"Dubai Chambers"},
  {id:"noon",      n:"noon.com",                      s:"tech", t:2, p:66, short:"noon"},
  {id:"enoc",      n:"ENOC (Emirates National Oil Company)", s:"energy", t:1, p:74, short:"ENOC"},
  {id:"ega",       n:"Emirates Global Aluminium",     s:"materials", t:2, p:74, short:"EGA"},
  {id:"jumeirah",  n:"Jumeirah Group",                s:"consumer_disc", t:2, p:70, short:"Jumeirah"},
  {id:"spinneys",  n:"Spinneys",                      s:"consumer_stap", t:2, p:60, short:"Spinneys"},
  {id:"aster",     n:"Aster DM Healthcare",           s:"health", t:2, p:66, short:"Aster DM"},
  {id:"maf",       n:"Majid Al Futtaim Group",        s:"conglomerate", t:3, p:80, short:"Majid Al Futtaim"},
  {id:"alfuttaim", n:"Al-Futtaim Group",              s:"conglomerate", t:3, p:76, short:"Al-Futtaim"},
  {id:"alhabtoor", n:"Al Habtoor Group",              s:"conglomerate", t:3, p:72, short:"Al Habtoor"},
  {id:"alghurair", n:"Al Ghurair Group",              s:"conglomerate", t:3, p:70, short:"Al Ghurair"},
  {id:"alrostamani", n:"AW Rostamani Group",          s:"conglomerate", t:3, p:62, short:"AW Rostamani"},
  {id:"jumaalmajid", n:"Juma Al Majid Group",         s:"conglomerate", t:3, p:60, short:"Juma Al Majid"},
  {id:"lst_salik", n:"Salik Company P.J.S.C.", s:"industry", t:2, p:50, short:"SALIK"},
  {id:"lst_talabat", n:"Talabat Holding plc", s:"consumer_disc", t:2, p:50, short:"Talabat Holding plc"},
  {id:"lst_airarabia", n:"Air Arabia PJSC", s:"industry", t:2, p:50, short:"Air Arabia PJSC"},
  {id:"lst_parkin", n:"Parkin Company P.J.S.C.", s:"industry", t:2, p:50, short:"PARKIN"},
  {id:"lst_etihadenergy", n:"Etihad Energy Holding PJSC", s:"industry", t:2, p:50, short:"ETIHADENERGY"},
  {id:"lst_gfh", n:"GFH Bank B.S.C.", s:"finance", t:2, p:50, short:"GFH Bank B.S.C."},
  {id:"lst_alansari", n:"Al Ansari Financial Services PJSC", s:"finance", t:2, p:50, short:"ALANSARI"},
  {id:"lst_nind", n:"National Industries Group Holding K.P.S.C.", s:"conglomerate", t:2, p:50, short:"NIND"},
  {id:"lst_tabreed", n:"National Central Cooling Company PJSC", s:"utilities", t:2, p:50, short:"TABREED"},
  {id:"lst_alec", n:"ALEC Holdings PJSC", s:"industry", t:2, p:50, short:"ALEC Holdings PJSC"},
  {id:"lst_salambah", n:"Al Salam Bank B.S.C.", s:"finance", t:2, p:50, short:"Al Salam Bank B.S.C."},
  {id:"lst_mkhzn", n:"Makhazen", s:"industry", t:2, p:50, short:"Makhazen"},
  {id:"lst_ajmanbank", n:"Ajman Bank PJSC", s:"finance", t:2, p:50, short:"Ajman Bank PJSC"},
  {id:"lst_unioncoop", n:"Union Coop", s:"consumer_stap", t:2, p:50, short:"Union Coop"},
  {id:"lst_amanat", n:"Amanat Holdings PJSC", s:"health", t:2, p:50, short:"Amanat Holdings PJSC"},
  {id:"lst_deyaar", n:"Deyaar Development PJSC", s:"realestate", t:2, p:50, short:"DEYAAR"},
  {id:"lst_taaleem", n:"Taaleem Holdings PJSC", s:"consumer_disc", t:2, p:50, short:"TAALEEM"},
  {id:"lst_sukoon", n:"Sukoon Insurance PJSC", s:"finance", t:2, p:50, short:"SUKOON"},
  {id:"lst_armx", n:"Aramex PJSC", s:"industry", t:2, p:50, short:"Aramex PJSC"},
  {id:"lst_upp", n:"Union Properties PJSC", s:"realestate", t:2, p:50, short:"UPP"},
  {id:"lst_ifa", n:"International Financial Advisors Holding K.P.S.C.", s:"finance", t:2, p:50, short:"IFA"},
  {id:"lst_ncc", n:"National Cement Company", s:"materials", t:2, p:50, short:"NCC"},
  {id:"lst_amlak", n:"Amlak Finance PJSC", s:"finance", t:2, p:50, short:"Amlak Finance PJSC"},
  {id:"lst_salama", n:"Islamic Arab Insurance Co. (Salama) PJSC", s:"finance", t:2, p:50, short:"SALAMA"},
  {id:"lst_ngi", n:"National General Insurance Co. P.J.S.C.", s:"finance", t:2, p:50, short:"NGI"},
  {id:"lst_shuaa", n:"SHUAA Capital PSC", s:"finance", t:2, p:50, short:"SHUAA Capital PSC"},
  {id:"lst_alramz", n:"Al Ramz Corporation Investment and Development P.J.S.C.", s:"finance", t:2, p:50, short:"ALRAMZ"},
  {id:"lst_dsi", n:"Drake and Scull International P.J.S.C.", s:"industry", t:2, p:50, short:"DSI"},
  {id:"lst_nih", n:"National International Holding Company K.S.C.P.", s:"finance", t:2, p:50, short:"NIH"},
  {id:"lst_mazaya", n:"Al-Mazaya Holding Company K.S.C.", s:"realestate", t:2, p:50, short:"MAZAYA"},
  {id:"lst_bhmcapital", n:"BHM Capital Financial Services PSC", s:"finance", t:2, p:50, short:"BHMCAPITAL"},
  {id:"lst_ufc", n:"United Foods Company PSC", s:"consumer_stap", t:2, p:50, short:"UFC"},
  {id:"lst_sukoontakafl", n:"Sukoon Takaful PJSC", s:"finance", t:2, p:50, short:"Sukoon Takaful PJSC"},
  {id:"lst_ithmr", n:"Ithmaar Holding B.S.C.", s:"finance", t:2, p:50, short:"ITHMR"},
  {id:"lst_unikai", n:"Unikai Foods P.J.S.C.", s:"consumer_stap", t:2, p:50, short:"UNIKAI"},
  {id:"lst_naho", n:"Naeem Holding Company For Investments", s:"finance", t:2, p:50, short:"NAHO"},
  {id:"lst_alfirdous", n:"Al Firdous Holdings P.J.S.C.", s:"consumer_disc", t:2, p:50, short:"ALFIRDOUS"},
  {id:"lst_watania", n:"Watania International Holding PJSC", s:"finance", t:2, p:50, short:"WATANIA"},
  {id:"lst_ekttitab", n:"Ekttitab Holding Company K.S.C.", s:"finance", t:2, p:50, short:"EKTTITAB"},
  {id:"lst_alsalamsudan", n:"Al Salam Bank - Sudan", s:"finance", t:2, p:50, short:"ALSALAMSUDAN"},
  {id:"dxbmun",    n:"Dubai Municipality",             s:"gov", t:1, p:78, short:"Dubai Municipality"},
  {id:"dxbpolice", n:"Dubai Police",                   s:"gov", t:1, p:78, short:"Dubai Police"},
  {id:"digitaldubai", n:"Digital Dubai Authority",     s:"gov", t:1, p:70, short:"Digital Dubai"},
  {id:"dha",       n:"Dubai Health Authority",         s:"health", t:1, p:74, short:"DHA"},
  {id:"khda",      n:"Knowledge & Human Development Authority", s:"education", t:1, p:68, short:"KHDA"},
  {id:"dld",       n:"Dubai Land Department",          s:"gov", t:1, p:76, short:"DLD"},
  {id:"gdmo",      n:"Government of Dubai Media Office", s:"comm", t:1, p:72, short:"Media Office"},
  {id:"dfsa",      n:"Dubai Financial Services Authority", s:"finance", t:2, p:70, short:"DFSA"},
];

const PEOPLE = [
  {id:"mbr", n:"H.H. Sheikh Mohammed bin Rashid Al Maktoum", t:0, p:100, s:"gov", roles:[
    ["dxbgov","Ruler of Dubai · UAE Vice President & Prime Minister","political","v"]],
    note:"Apex of Dubai. The ICD/Dubai Holding commercial empire and the emirate's global brand are his project."},
  {id:"hamdan_cp", n:"H.H. Sheikh Hamdan bin Mohammed Al Maktoum", t:0, p:96, s:"gov", roles:[
    ["dxbgov","Crown Prince of Dubai","political","v"],
    ["execco","Chairman","political","v"],
    ["dxbgov","UAE Deputy PM & Minister of Defence","political","v"]],
    note:"'Fazza' — runs day-to-day Dubai and took the federal defence portfolio in 2024."},
  {id:"maktoum_dep", n:"H.H. Sheikh Maktoum bin Mohammed Al Maktoum", t:0, p:94, s:"finance", roles:[
    ["dxbgov","First Deputy Ruler of Dubai","political","v"],
    ["dxbgov","UAE Deputy PM & Minister of Finance","political","v"],
    ["difc","President","political","v"]],
    note:"Dubai's financial-markets czar: DIFC, the IPO program and federal finance."},
  {id:"ahmed_saeed", n:"H.H. Sheikh Ahmed bin Saeed Al Maktoum", t:0, p:92, s:"industry", roles:[
    ["emirates","Chairman & Chief Executive","executive","v"],
    ["enbd","Chairman","board","v"],
    ["dxbairports","Chairman","board","v"],
    ["flydubai","Chairman","board","v"]],
    note:"The aviation patriarch — Emirates, the airport system and the emirate's biggest bank."},
  {id:"ahmed_moh", n:"H.H. Sheikh Ahmed bin Mohammed Al Maktoum", t:0, p:84, s:"comm", roles:[
    ["dxbgov","Second Deputy Ruler of Dubai","political","v"],
    ["dxbgov","Chairman, Dubai Media Council","government","v"]]},
  {id:"shaibani", n:"Mohammed Ibrahim Al Shaibani", t:1, p:90, s:"sovereign", roles:[
    ["dxbgov","Director-General, Ruler's Court","government","v"],
    ["icd","Managing Director","executive","v"],
    ["nakheel","Chairman","board","ns"],
    ["dib","Chairman","board","v"]],
    note:"The Ruler's chief business fiduciary — controls the ICD holding that owns Emirates, ENBD and more."},
  {id:"altayer_dewa", n:"Saeed Mohammed Al Tayer", t:1, p:84, s:"utilities", roles:[
    ["dewa","Managing Director & CEO","executive","v"]]},
  {id:"mattar_tayer", n:"Mattar Al Tayer", t:1, p:78, s:"gov", roles:[
    ["rta","Chairman & Director-General","government","v"]]},
  {id:"essa_kazim", n:"Essa Kazim", t:1, p:82, s:"finance", roles:[
    ["difc","Governor","executive","v"],
    ["dfm","Chairman","board","ns"],
    ["dpworld","Chairman","board","v"]]},
  {id:"helal_marri", n:"Helal Saeed Almarri", t:1, p:78, s:"gov", roles:[
    ["det","Director-General","government","v"]]},
  {id:"reem_hashimy", n:"Reem Al Hashimy", t:1, p:82, s:"gov", roles:[
    ["dxbgov","UAE Minister of State for International Cooperation","political","v"],
    ["expocity","CEO","executive","v"]]},
  {id:"omar_olama", n:"Omar Sultan Al Olama", t:1, p:78, s:"tech", roles:[
    ["dxbgov","UAE Minister of State for AI, Digital Economy & Remote Work","political","v"]]},
  {id:"alabbar", n:"Mohamed Alabbar", t:1, p:88, s:"realestate", roles:[
    ["emaar","Founder & Managing Director","executive","v"],
    ["noon","Founder & Chairman","board","v"]],
    note:"Dubai's signature developer-entrepreneur: Burj Khalifa, Dubai Mall, noon."},
  {id:"sajwani", n:"Hussain Sajwani", t:2, p:80, s:"realestate", roles:[
    ["damac","Founder & Chairman","board","v"]]},
  {id:"tim_clark", n:"Sir Tim Clark", t:2, p:80, s:"industry", roles:[
    ["emirates","President, Emirates Airline","executive","v"]]},
  {id:"griffiths", n:"Paul Griffiths", t:2, p:74, s:"industry", roles:[
    ["dxbairports","CEO","executive","v"]]},
  {id:"ghaith", n:"Ghaith Al Ghaith", t:2, p:70, s:"industry", roles:[
    ["flydubai","CEO","executive","ns"]]},
  {id:"abdulaziz_ghurair", n:"Abdul Aziz Al Ghurair", t:1, p:82, s:"finance", roles:[
    ["mashreq","Chairman","board","v"],
    ["dubaichambers","Chairman","board","v"],
    ["alghurair","Chairman (family group)","board","ns"]]},
  {id:"khalaf_habtoor", n:"Khalaf Al Habtoor", t:2, p:76, s:"conglomerate", roles:[
    ["alhabtoor","Founder & Chairman","board","v"]]},
  {id:"amit_kaushal", n:"Amit Kaushal", t:2, p:72, s:"sovereign", roles:[
    ["dubaiholding","Group CEO","executive","ns"]]},
  {id:"ismail_maf", n:"Ahmed Galal Ismail", t:2, p:74, s:"conglomerate", roles:[
    ["maf","Group CEO","executive","v"]]},
  {id:"alali_maf_chair", n:"Fadel Abdulbaqi Al Ali", t:2, p:72, s:"conglomerate", roles:[
    ["maf","Chairman, Holding Board","board","v"]]},
  {id:"alsaleh_dof", n:"Abdulrahman Saleh Al Saleh", t:1, p:72, s:"gov", roles:[
    ["dof_dxb","Director-General","political","v"]]},
  {id:"omar_alfuttaim", n:"Omar Al Futtaim", t:2, p:76, s:"conglomerate", roles:[
    ["alfuttaim","Vice Chairman & CEO","executive","v"]]},
  {id:"chilwan_dib", n:"Dr. Adnan Chilwan", t:2, p:74, s:"finance", roles:[
    ["dib","Group CEO","executive","v"]]},
  {id:"alfalasi_enoc", n:"Saif Humaid Al Falasi", t:2, p:72, s:"energy", roles:[
    ["enoc","Group CEO","executive","v"]]},
  {id:"kalban_ega", n:"Abdulnasser Bin Kalban", t:2, p:70, s:"materials", roles:[
    ["ega","Chief Executive Officer","executive","v"]]},
  {id:"alshimmari_ega", n:"Homaid Al Shimmari", t:2, p:68, s:"materials", roles:[
    ["ega","Chairman","board","v"]]},
  {id:"alhassawi_du", n:"Fahad Al Hassawi", t:2, p:70, s:"comm", roles:[
    ["du","Group CEO","executive","v"]]},
  {id:"binsulayem_dmcc", n:"Ahmed Bin Sulayem", t:2, p:74, s:"gov", roles:[
    ["dmcc","Executive Chairman & CEO","executive","v"]]},
  {id:"meier_jumeirah", n:"Thomas B. Meier", t:2, p:66, s:"consumer_disc", roles:[
    ["jumeirah","Group CEO","executive","v"]]},
  {id:"white_vara", n:"Matthew White", t:2, p:62, s:"finance", roles:[
    ["vara","Chief Executive Officer","executive","v"]]},
  {id:"marwan_ghalita", n:"Marwan Ahmed bin Ghalita", t:1, p:76, s:"gov", roles:[
    ["dxbmun","Director-General","government","v"]],
    note:"Also Director-General of DLD until May 2025, when he moved to head Dubai Municipality."},
  {id:"abdullah_almarri_police", n:"Lt. Gen. Abdullah Khalifa Al Marri", t:1, p:78, s:"gov", roles:[
    ["dxbpolice","Commander-in-Chief","government","v"]]},
  {id:"hamad_almansoori_dda", n:"Hamad Obaid Al Mansoori", t:1, p:70, s:"gov", roles:[
    ["digitaldubai","Director-General","government","v"]]},
  {id:"alawi_alsheikhali", n:"Dr. Alawi Alsheikh-Ali", t:1, p:72, s:"health", roles:[
    ["dha","Director-General","government","v"]]},
  {id:"aisha_miran_khda", n:"Aisha Abdulla Miran", t:1, p:66, s:"education", roles:[
    ["khda","Director-General","government","v"]]},
  {id:"omar_bushehab_dld", n:"Omar Hamad Bu Shehab", t:1, p:74, s:"gov", roles:[
    ["dld","Director-General","government","v"]],
    note:"Also Chairman of the Board, Mohammed Bin Rashid Housing Establishment."},
  {id:"mona_almarri", n:"Mona Ghanem Al Marri", t:1, p:74, s:"comm", roles:[
    ["gdmo","Director-General","government","v"]]},
  {id:"mark_steward_dfsa", n:"Mark Steward", t:2, p:68, s:"finance", roles:[
    ["dfsa","Chief Executive","executive","v"]]},
  {id:"hesham_abdulla_al", n:"Hesham Abdulla Al Qassim", t:2, p:62, s:"finance", roles:[
    ["enbd","Vice Chairman & Managing Director","board","v"]]},
  {id:"mohamed_hadi_al", n:"Mohamed Hadi Al Hussaini", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"buti_obaid_buti", n:"Buti Obaid Buti Al Mulla", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"ali_humaid_al", n:"Ali Humaid Al Owais", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"salem_mohammed_obaidalla", n:"Salem Mohammed Obaidalla", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"huda_sayed_alhashimi", n:"Huda Sayed AlHashimi", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"jassim_mohammed_al", n:"Jassim Mohammed Al Ali", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"khalid_juma_al", n:"Khalid Juma Al Majid", t:2, p:52, s:"finance", roles:[
    ["enbd","Board Member","board","v"]]},
  {id:"shayne_nelson", n:"Shayne Nelson", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Chief Executive Officer","executive","v"]]},
  {id:"patrick_sullivan", n:"Patrick Sullivan", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Chief Financial Officer","executive","v"]]},
  {id:"ahmed_al_qassim", n:"Ahmed Al Qassim", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Head Wholesale Banking","executive","v"]]},
  {id:"marwan_hadi", n:"Marwan Hadi", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Head Retail Banking & Wealth Management","executive","v"]]},
  {id:"eman_abdulrazzaq", n:"Eman Abdulrazzaq", t:2, p:58, s:"finance", roles:[
    ["enbd","Group COO & Chief Human Resources Officer","executive","v"],
    ["emaar","Board Member","board","v"]]},
  {id:"manoj_chawla", n:"Manoj Chawla", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Chief Risk Officer","executive","v"]]},
  {id:"farid_almulla", n:"Farid AlMulla", t:2, p:60, s:"finance", roles:[
    ["enbd","CEO, Emirates Islamic","executive","v"]]},
  {id:"miguel_rio_tinto", n:"Miguel Rio-Tinto", t:2, p:58, s:"finance", roles:[
    ["enbd","Group Chief Digital & Information Officer","executive","v"]]},
  {id:"jamal_majed_bin", n:"Jamal Majed Bin Thaniah", t:2, p:62, s:"realestate", roles:[
    ["emaar","Chairman","board","ns"]]},
  {id:"ahmed_jamal_jawa", n:"Ahmed Jamal Jawa", t:2, p:62, s:"realestate", roles:[
    ["emaar","Vice Chairman","board","ns"]]},
  {id:"abdullah_ali_bin", n:"Abdullah Ali bin Zayed Al-Falasi", t:2, p:52, s:"realestate", roles:[
    ["emaar","Board Member","board","v"]]},
  {id:"ahmed_saeed_bin", n:"Ahmed Saeed bin Meshar", t:2, p:52, s:"realestate", roles:[
    ["emaar","Board Member","board","v"]]},
  {id:"matar_alhemeiri", n:"Matar AlHemeiri", t:2, p:52, s:"realestate", roles:[
    ["emaar","Board Member","board","v"]]},
  {id:"omar_karim", n:"Omar Karim", t:2, p:52, s:"realestate", roles:[
    ["emaar","Board Member","board","v"]]},
  {id:"amit_jain", n:"Amit Jain", t:2, p:58, s:"realestate", roles:[
    ["emaar","Group Chief Executive Officer","executive","v"]]},
  {id:"ahmad_thani_al", n:"Ahmad Thani Al Matrooshi", t:2, p:58, s:"realestate", roles:[
    ["emaar","Executive Director","executive","v"]]},
  {id:"pawan_chindalia", n:"Pawan Chindalia", t:2, p:58, s:"realestate", roles:[
    ["emaar","Group Chief Financial Officer","executive","ns"]]},
  {id:"maitha_al_dossari", n:"Maitha Al Dossari", t:2, p:58, s:"realestate", roles:[
    ["emaar","General Manager, Corporate Services","executive","ns"]]},
  {id:"yahya_saeed_lootah", n:"Yahya Saeed Lootah", t:2, p:62, s:"finance", roles:[
    ["dib","Vice Chairman","board","v"]]},
  {id:"hamad_mubarak_buamim", n:"Hamad Mubarak Buamim", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"abdulaziz_ahmed_almheiri", n:"Abdulaziz Ahmed Almheiri", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"hamad_abdulla_alshamsi", n:"Hamad Abdulla Alshamsi", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"abdulaziz_mohammed_almulla", n:"Abdulaziz Mohammed Almulla", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"hind_binkhirbash", n:"Hind Binkhirbash", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"bader_saeed_hareb", n:"Bader Saeed Hareb", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"javier_marin_romano", n:"Javier Marin Romano", t:2, p:52, s:"finance", roles:[
    ["dib","Board Member","board","v"]]},
  {id:"obaid_al_shamsi", n:"Obaid Al Shamsi", t:2, p:58, s:"finance", roles:[
    ["dib","Chief Operating Officer","executive","v"]]},
  {id:"john_macedo", n:"John Macedo", t:2, p:58, s:"finance", roles:[
    ["dib","Chief Financial Officer","executive","v"]]},
  {id:"chandra_mohan_ganapathy", n:"Chandra Mohan Ganapathy", t:2, p:58, s:"finance", roles:[
    ["dib","Group Chief Risk Officer","executive","v"]]},
  {id:"musabbah_al_qaizi", n:"Musabbah Al Qaizi", t:2, p:58, s:"finance", roles:[
    ["dib","Chief Digital Officer","executive","v"]]},
  {id:"naveed_ali", n:"Naveed Ali", t:2, p:58, s:"finance", roles:[
    ["dib","Chief of Corporate Banking","executive","v"]]},
  {id:"sultan_sulayem", n:"Sultan Ahmed bin Sulayem", t:1, p:70, s:"industry", roles:[
    ["dpworld","Group Chairman & CEO (2007–Feb 2026)","executive","v","former:until Feb 2026"]],
    note:"Led DP World's global expansion for nearly two decades; stepped down Feb 2026 — role split between Essa Kazim (Chairman) and Yuvraj Narayan (Group CEO)."},
  {id:"yuvraj_narayan", n:"Yuvraj Narayan", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief Executive Officer","executive","v"]]},
  {id:"deepak_parekh", n:"Deepak Parekh", t:2, p:52, s:"industry", roles:[
    ["dpworld","Senior Independent Non-Executive Director","board","v"]]},
  {id:"sultan_bin_saeed", n:"Sultan bin Saeed Al Mansoori", t:2, p:52, s:"industry", roles:[
    ["dpworld","Board Member","board","v"]]},
  {id:"mohamed_saif_al", n:"Mohamed Saif Al Suwaidi", t:2, p:52, s:"industry", roles:[
    ["dpworld","Board Member","board","v"]]},
  {id:"robert_woods", n:"Robert Woods", t:2, p:52, s:"industry", roles:[
    ["dpworld","Board Member","board","v"]]},
  {id:"phumzile_langeni", n:"Phumzile Langeni", t:2, p:52, s:"industry", roles:[
    ["dpworld","Board Member","board","v"]]},
  {id:"vijay_malhotra", n:"Vijay Malhotra", t:2, p:52, s:"industry", roles:[
    ["dpworld","Board Member","board","v"]]},
  {id:"anil_mohta", n:"Anil Mohta", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief Financial Officer","executive","v"]]},
  {id:"abdulla_al_hashmi", n:"Abdulla Al Hashmi", t:2, p:58, s:"industry", roles:[
    ["dpworld","Global COO, Parks & Economic Zones","executive","v"]]},
  {id:"tiemen_meester", n:"Tiemen Meester", t:2, p:58, s:"industry", roles:[
    ["dpworld","Global COO, Ports & Terminals","executive","v"]]},
  {id:"ahmad_yousef_al", n:"Ahmad Yousef Al-Hassan", t:2, p:60, s:"industry", roles:[
    ["dpworld","CEO & Managing Director, GCC","executive","v"]]},
  {id:"rado_antolovic", n:"Rado Antolovic", t:2, p:60, s:"industry", roles:[
    ["dpworld","CEO, Drydocks World","executive","v"]]},
  {id:"pradeep_desai", n:"Pradeep Desai", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief Technology Officer","executive","v"]]},
  {id:"adel_ahmad_al", n:"Adel Ahmad Al Redha", t:2, p:58, s:"industry", roles:[
    ["emirates","Deputy President & Chief Operations Officer","executive","v"]]},
  {id:"adnan_kazim", n:"Adnan Kazim", t:2, p:58, s:"industry", roles:[
    ["emirates","Deputy President & Chief Commercial Officer","executive","v"]]},
  {id:"ali_mubarak_al", n:"Ali Mubarak Al Soori", t:2, p:58, s:"industry", roles:[
    ["emirates","Chief Procurement and Facilities Officer","executive","v"]]},
  {id:"ahmed_safa", n:"Ahmed Safa", t:2, p:46, s:"industry", roles:[
    ["emirates","Head of Engineering and MRO","executive","v"]]},
  {id:"badr_abbas", n:"Badr Abbas", t:2, p:58, s:"industry", roles:[
    ["emirates","Divisional Senior Vice President Emirates SkyCargo","executive","v"]]},
  {id:"mark_burtonwood", n:"Mark Burtonwood", t:2, p:58, s:"industry", roles:[
    ["emirates","Divisional Senior Vice President Group Safety and Network Operations","executive","v"]]},
  {id:"mostafa_karam", n:"Mostafa Karam", t:2, p:58, s:"industry", roles:[
    ["emirates","Divisional Senior Vice President Customer Affairs and Service Audit","executive","v"]]},
  {id:"yousuf_mohammad_ali", n:"Yousuf Mohammad Ali", t:2, p:58, s:"industry", roles:[
    ["emirates","Divisional Senior Vice President Group Procurement and Logistics","executive","v"]]},
  {id:"david_broz", n:"David Broz", t:2, p:58, s:"industry", roles:[
    ["emirates","Senior Vice President Aeropolitical and Airline Industry Affairs","executive","v"]]},
  {id:"devarajan_srinivasan", n:"Devarajan Srinivasan", t:2, p:58, s:"industry", roles:[
    ["emirates","Senior Vice President Facilities and Asset Management","executive","v"]]},
  {id:"mahmood_al_khaja", n:"Mahmood Al Khaja", t:2, p:58, s:"industry", roles:[
    ["emirates","Senior Vice President Material Management and Repairs","executive","v"]]},
  {id:"will_lofberg", n:"Will Lofberg", t:2, p:58, s:"industry", roles:[
    ["emirates","Senior Vice President International and Government Affairs","executive","v"]]},
  {id:"shahreyar_nawabi", n:"Shahreyar Nawabi", t:2, p:60, s:"industry", roles:[
    ["emirates","Chief Executive Officer Emirates Flight Catering","executive","v"]]},
  {id:"mahmood_ameen", n:"Mahmood Ameen", t:2, p:58, s:"industry", roles:[
    ["emirates","Divisional Senior Vice President Engineering Projects and Aircraft Procurement","executive","v"]]},
  {id:"olivier_schwartz", n:"Olivier Schwartz", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief Legal Officer & General Counsel","executive","v"]]},
  {id:"smael_auam", n:"Smael Auam", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief People Officer","executive","v"]]},
  {id:"marwan_al_jassmi", n:"Marwan Al Jassmi", t:2, p:58, s:"industry", roles:[
    ["dpworld","Executive Vice President - People & Sustainability, DP World GCC","executive","v"]]},
  {id:"daniel_van_otterdijk", n:"Daniel Van Otterdijk", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Chief Communications & Government Relations Officer","executive","v"]]},
  {id:"faisal_arekat", n:"Faisal Arekat", t:2, p:58, s:"industry", roles:[
    ["dpworld","Group Company Secretary & Chief Governance Officer","executive","v"]]},
  {id:"saoud_alshaikh", n:"Saoud Alshaikh", t:2, p:46, s:"realestate", roles:[
    ["emaar","Group Head of Internal Audit","executive","v"]]},
  {id:"mohamed_al_matrooshi", n:"Mohamed Al Matrooshi", t:2, p:46, s:"realestate", roles:[
    ["emaar","Head of Emaar Malls & Entertainment","executive","v"]]},
  {id:"mohammed_al_sahlawi", n:"Mohammed Al Sahlawi", t:2, p:46, s:"realestate", roles:[
    ["emaar","Head of Finance, Emaar Malls Management","executive","v"]]},
  {id:"hakan_keskin", n:"Hakan Keskin", t:2, p:46, s:"realestate", roles:[
    ["emaar","Head of Hospitality, Emaar Hospitality Group","executive","v"]]},
  {id:"elie_dibo", n:"Elie Dibo", t:2, p:58, s:"realestate", roles:[
    ["emaar","Chief Financial Officer, Emaar Hospitality Group","executive","v"]]},
  {id:"ahmed_abdelaal", n:"Ahmed Abdelaal", t:2, p:60, s:"finance", roles:[
    ["mashreq","Group Chief Executive Officer","executive","v"]]},
  {id:"norman_tambach", n:"Norman Tambach", t:2, p:58, s:"finance", roles:[
    ["mashreq","Group Chief Financial Officer","executive","v"]]},
  {id:"anuratna_chadha", n:"Anuratna Chadha", t:2, p:58, s:"finance", roles:[
    ["mashreq","Group Chief Risk Officer","executive","v"]]},
  {id:"marouf_mohamed_shweikeh", n:"Marouf Mohamed Shweikeh", t:2, p:58, s:"finance", roles:[
    ["mashreq","Group General Counsel","executive","v"]]},
  {id:"mohamed_abdel_razek", n:"Mohamed Abdel Razek", t:2, p:46, s:"finance", roles:[
    ["mashreq","Group Head of Technology, Transformation & Information","executive","v"]]},
  {id:"vivek_batra", n:"Vivek Batra", t:2, p:46, s:"finance", roles:[
    ["mashreq","Global Head of Transaction Banking","executive","v"]]},
  {id:"jyothi_bathula", n:"Jyothi Bathula", t:2, p:60, s:"finance", roles:[
    ["mashreq","Global Head of Mashreq Global Network (MGN) & Managing Director of MGN India","executive","v"]]},
  {id:"ahmad_al_khallafi", n:"Ahmad Al Khallafi", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"]]},
  {id:"saeed_saif_al", n:"Saeed Saif Al Ghurair", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"]]},
  {id:"rashed_saif_ahmed", n:"Rashed Saif Ahmed Al Ghurair", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"]]},
  {id:"mariam_ghobash", n:"Mariam Ghobash", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"]]},
  {id:"john_iossifidis", n:"John Iossifidis", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"]]},
  {id:"iyad_malas", n:"Iyad Malas", t:2, p:52, s:"finance", roles:[
    ["mashreq","Director (Board of Directors)","board","v"],
    ["maf","Non-Executive Director","board","v"]]},
  {id:"saleem_alblooshi", n:"Saleem Alblooshi", t:2, p:58, s:"comm", roles:[
    ["du","Chief Technology Officer","executive","v"]]},
  {id:"kais_ben_hamida", n:"Kais Ben Hamida", t:2, p:58, s:"comm", roles:[
    ["du","Chief Financial Officer","executive","v"]]},
  {id:"jasim_alawadi", n:"Jasim AlAwadi", t:2, p:58, s:"comm", roles:[
    ["du","Chief ICT Officer","executive","v"]]},
  {id:"karim_benkirane", n:"Karim Benkirane", t:2, p:58, s:"comm", roles:[
    ["du","Chief Commercial Officer","executive","v"]]},
  {id:"hanan_ahmad", n:"Hanan Ahmad", t:2, p:58, s:"comm", roles:[
    ["du","Chief Regulatory & Shared Services Officer","executive","v"]]},
  {id:"diego_camberos", n:"Diego Camberos", t:2, p:58, s:"comm", roles:[
    ["du","Chief Customer & Channels Officer","executive","v"]]},
  {id:"dimitris_lioulias", n:"Dimitris Lioulias", t:2, p:58, s:"comm", roles:[
    ["du","Chief Strategy & AI Officer","executive","v"]]},
  {id:"amna_alakraf", n:"Amna AlAkraf", t:2, p:58, s:"comm", roles:[
    ["du","Chief Internal Audit","executive","v"]]},
  {id:"fatema_al_afeefi", n:"Fatema Al Afeefi", t:2, p:58, s:"comm", roles:[
    ["du","Chief People & Impact Officer","executive","v"]]},
  {id:"justin_shields", n:"Justin Shields", t:2, p:58, s:"comm", roles:[
    ["du","Chief Information Officer","executive","v"]]},
  {id:"malek_al_malek", n:"Malek Al Malek", t:2, p:62, s:"comm", roles:[
    ["du","Chairman (Independent Non-Executive)","board","v"],
    ["dubaiholding","Group CEO, Dubai Holding Asset Management","executive","v"]]},
  {id:"ahmad_julfar", n:"Ahmad Julfar", t:2, p:62, s:"comm", roles:[
    ["du","Vice Chairman (Non-Executive)","board","v"]]},
  {id:"abdulla_al_basti", n:"Abdulla Al Basti", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"abdulla_belhoul", n:"Abdulla Belhoul", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"wesam_lootah", n:"Wesam Lootah", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"khalifa_almheiri", n:"Khalifa AlMheiri", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"ziad_galadari", n:"Ziad Galadari", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Non-Executive)","board","v"]]},
  {id:"serkan_okandan", n:"Serkan Okandan", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"hassa_balouma", n:"Hassa Balouma", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"matar_alblooshi", n:"Matar AlBlooshi", t:2, p:52, s:"comm", roles:[
    ["du","Board Member (Independent Non-Executive)","board","v"]]},
  {id:"khawla_al_mehairi", n:"Khawla Al Mehairi", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Strategy and Government Communications","executive","v"]]},
  {id:"maryam_al_mutaiwei", n:"Maryam Al-Mutaiwei", t:2, p:58, s:"utilities", roles:[
    ["dewa","Vice President of Human Resources","executive","v"]]},
  {id:"amal_koshak", n:"Amal Koshak", t:2, p:58, s:"utilities", roles:[
    ["dewa","Vice President of Marketing and Corporate Communications","executive","v"]]},
  {id:"nasser_lootah", n:"Nasser Lootah", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Generation (Power & Water)","executive","v"]]},
  {id:"hussain_lootah", n:"Hussain Lootah", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Transmission (Power)","executive","v"]]},
  {id:"waleed_bin_salman", n:"Waleed Bin Salman", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Business Development and Excellence","executive","v"]]},
  {id:"ali_al_muwaijei", n:"Ali Al Muwaijei", t:2, p:58, s:"utilities", roles:[
    ["dewa","Vice President of Governance, Compliance and Agility","executive","v"]]},
  {id:"dr_yousef_al", n:"Dr Yousef Al Akraf", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Business Support and Human Resources","executive","v"]]},
  {id:"rashid_bin_humaidan", n:"Rashid Bin Humaidan", t:2, p:58, s:"utilities", roles:[
    ["dewa","Executive Vice President of Distribution Power","executive","ns"]]},
  {id:"ziad_chalhoub", n:"Ziad Chalhoub", t:2, p:58, s:"conglomerate", roles:[
    ["maf","Chief Financial Officer","executive","v"]]},
  {id:"amina_taher", n:"Amina Taher", t:2, p:58, s:"conglomerate", roles:[
    ["maf","Chief Brand and Communications Officer","executive","v"]]},
  {id:"hassan_basil_hassan", n:"Hassan Basil Hassan", t:2, p:58, s:"conglomerate", roles:[
    ["maf","Chief Legal Officer","executive","v"]]},
  {id:"saeed_almadani", n:"Saeed Almadani", t:2, p:58, s:"conglomerate", roles:[
    ["maf","Chief Audit, Risk & Compliance Officer","executive","v"]]},
  {id:"elham_al_qasim", n:"Elham Al Qasim", t:2, p:58, s:"conglomerate", roles:[
    ["maf","Chief Data & AI Officer","executive","v"]]},
  {id:"ahmed_el_shamy", n:"Ahmed El Shamy", t:2, p:60, s:"conglomerate", roles:[
    ["maf","Chief Executive Officer - Development","executive","v"]]},
  {id:"khalifa_bin_braik", n:"Khalifa Bin Braik", t:2, p:60, s:"conglomerate", roles:[
    ["maf","Chief Executive Officer - Asset Management","executive","v"]]},
  {id:"ignace_lahoud", n:"Ignace Lahoud", t:2, p:60, s:"conglomerate", roles:[
    ["maf","Chief Executive Officer - Entertainment & Lifestyle","executive","v"]]},
  {id:"hamed_kazim", n:"Hamed Kazim", t:2, p:52, s:"conglomerate", roles:[
    ["maf","Non-Executive Director","board","v"]]},
  {id:"zein_abdalla", n:"Zein Abdalla", t:2, p:52, s:"conglomerate", roles:[
    ["maf","Non-Executive Director","board","v"]]},
  {id:"robert_booth", n:"Robert Booth", t:2, p:52, s:"conglomerate", roles:[
    ["maf","Non-Executive Director","board","v"]]},
  {id:"khalid_al_malik", n:"Khalid Al Malik", t:2, p:60, s:"sovereign", roles:[
    ["dubaiholding","Managing Director, Dubai Holding; CEO, Dubai Holding Real Estate","executive","v"]]},
  {id:"aldrin_sequeira", n:"Aldrin Sequeira", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief Internal Audit Officer","executive","v"]]},
  {id:"edward_sunna", n:"Edward Sunna", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief Legal Officer","executive","v"]]},
  {id:"fatma_hussain", n:"Fatma Hussain", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief People Officer","executive","v"]]},
  {id:"huda_buhumaid", n:"Huda Buhumaid", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief Impact Officer","executive","v"]]},
  {id:"oliver_skagerlind", n:"Oliver Skagerlind", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief Technology Officer","executive","v"]]},
  {id:"sharjil_anwar", n:"Sharjil Anwar", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","Group Chief Financial Officer","executive","v"]]},
  {id:"fernando_eiroa", n:"Fernando Eiroa", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","CEO, Dubai Holding Entertainment","executive","v"]]},
  {id:"francis_giani", n:"Francis Giani", t:2, p:58, s:"sovereign", roles:[
    ["dubaiholding","CEO, Dubai Holding Community Management","executive","v"]]},
  {id:"alex_davies", n:"Alex Davies", t:2, p:60, s:"realestate", roles:[
    ["nakheel","Chief Executive Officer, Ejadah Asset Management","executive","v"]]},
  {id:"zuber_dehgamia", n:"Zuber Dehgamia", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Financial Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"mariam_juma", n:"Mariam Juma", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Operating Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"manoj_nair", n:"Manoj Nair", t:2, p:46, s:"realestate", roles:[
    ["nakheel","Head of Governance, Risk & Compliance, Dubai Holding Real Estate","executive","v"]]},
  {id:"mohammed_al_habbai", n:"Mohammed Al Habbai", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Real Estate Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"anuradha_harish", n:"Anuradha Harish", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Commercial Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"osama_abouelenain", n:"Osama Abouelenain", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Development Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"osama_sabboubeh", n:"Osama Sabboubeh", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Project Delivery Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"ian_simmonds", n:"Ian Simmonds", t:2, p:58, s:"realestate", roles:[
    ["nakheel","Chief Contract and Procurement Officer, Dubai Holding Real Estate","executive","v"]]},
  {id:"claudia_stephens", n:"Claudia Stephens", t:2, p:46, s:"realestate", roles:[
    ["nakheel","Head of Legal and Lead Construction Lawyer, Dubai Holding Real Estate","executive","v"]]},
  {id:"ahmad_abdulbaqi", n:"Ahmad Abdulbaqi", t:2, p:46, s:"realestate", roles:[
    ["nakheel","Head of Security, Dubai Holding Real Estate","executive","v"]]},
  {id:"ali_sajwani", n:"Ali Sajwani", t:2, p:60, s:"realestate", roles:[
    ["damac","Managing Director","executive","v"]]},
  {id:"amira_sajwani", n:"Amira Sajwani", t:2, p:60, s:"realestate", roles:[
    ["damac","Managing Director","executive","v"]]},
  {id:"abbas_sajwani", n:"Abbas Sajwani", t:2, p:52, s:"realestate", roles:[
    ["damac","Board Member","board","v"]]},
  {id:"sofyan_khatib", n:"Sofyan Khatib", t:2, p:58, s:"realestate", roles:[
    ["damac","Group Director","executive","v"]]},
  {id:"sandip_bhatt", n:"Sandip Bhatt", t:2, p:58, s:"realestate", roles:[
    ["damac","Chief Investment Officer","executive","v"]]},
  {id:"mp_john", n:"MP John", t:2, p:58, s:"realestate", roles:[
    ["damac","Chief Human Capital Officer","executive","v"]]},
  {id:"mohammed_tahaineh", n:"Mohammed Tahaineh", t:2, p:46, s:"realestate", roles:[
    ["damac","General Manager - Projects","executive","v"]]},
  {id:"francois_oberholzer", n:"Francois Oberholzer", t:2, p:58, s:"industry", roles:[
    ["flydubai","Chief Financial Officer","executive","v"]]},
  {id:"mick_hills", n:"Mick Hills", t:2, p:58, s:"industry", roles:[
    ["flydubai","Chief Operating Officer","executive","v"]]},
  {id:"khalid_alhumaidan", n:"Khalid Alhumaidan", t:2, p:58, s:"industry", roles:[
    ["flydubai","Senior Vice President of Compliance, Safety & Sustainability","executive","v"]]},
  {id:"daniel_kerrison", n:"Daniel Kerrison", t:2, p:58, s:"industry", roles:[
    ["flydubai","Senior Vice President of Inflight Operations","executive","v"]]},
  {id:"ahmad_bin_huzaim", n:"Ahmad Bin Huzaim", t:2, p:58, s:"industry", roles:[
    ["flydubai","Senior Vice President, Flight Operations","executive","v"]]},
  {id:"andrew_glover", n:"Andrew Glover", t:2, p:58, s:"industry", roles:[
    ["flydubai","Senior Vice President, Engineering and Maintenance","executive","v"]]},
  {id:"sudhir_sreedharan", n:"Sudhir Sreedharan", t:2, p:58, s:"industry", roles:[
    ["flydubai","Divisional Senior Vice President of Commercial Operations","executive","v"]]},
  {id:"abdulfattah_sharaf", n:"Abdulfattah Sharaf", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Higher Board)","board","v"]]},
  {id:"wayne_martin", n:"Wayne Martin", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Higher Board)","board","v"]]},
  {id:"arshad_ghafur", n:"Arshad Ghafur", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Higher Board)","board","v"]]},
  {id:"abdulla_j_m", n:"Abdulla J M Kalban", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Authority Board of Directors)","board","v"]]},
  {id:"salem_al_sharhan", n:"Salem Al Sharhan", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Authority Board of Directors)","board","v"]]},
  {id:"khalfan_belhoul", n:"Khalfan Belhoul", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Authority Board of Directors)","board","v"]]},
  {id:"abdullah_salim_al", n:"Abdullah Salim Al Turifi Al Shamsi", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Authority Board of Directors)","board","v"]]},
  {id:"ahmad_bin_hassan", n:"Ahmad Bin Hassan Al Shaikh", t:2, p:52, s:"finance", roles:[
    ["difc","Board Member (DIFC Authority Board of Directors)","board","v"]]},
  {id:"arif_amiri", n:"Arif Amiri", t:2, p:60, s:"finance", roles:[
    ["difc","Chief Executive Officer at DIFC Authority","executive","v"]]},
  {id:"alya_alzarouni", n:"Alya AlZarouni", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Operating Officer at DIFC Authority","executive","v"]]},
  {id:"amar_tahilani", n:"Amar Tahilani", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Development and Projects Officer at DIFC Investments Ltd.","executive","v"]]},
  {id:"jacques_visser", n:"Jacques Visser", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Legal Officer at DIFC Authority","executive","v"]]},
  {id:"saleh_al_akrabi", n:"Saleh Al Akrabi", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Real Estate Officer at DIFC Investments Ltd.","executive","v"]]},
  {id:"salmaan_jaffery", n:"Salmaan Jaffery", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Business Development Officer at DIFC Authority","executive","v"]]},
  {id:"yazan_mohamad_al", n:"Yazan Mohamad Al Nasser", t:2, p:58, s:"finance", roles:[
    ["difc","Chief Financial & Risk Officer at DIFC Authority","executive","v"]]},
  {id:"jaber_humaid_al", n:"Jaber Humaid Al Suwaidi", t:2, p:58, s:"finance", roles:[
    ["difc","Senior Vice President & Registrar of Real Property – Regulatory, DIFC Authority","executive","v"]]},
  {id:"khalid_mohamed_al", n:"Khalid Mohamed Al Zarouni", t:2, p:58, s:"finance", roles:[
    ["difc","Senior Vice President & Registrar of Companies – Regulatory, DIFC Authority","executive","v"]]},
  {id:"madeya_alktebi", n:"Madeya Alktebi", t:2, p:58, s:"finance", roles:[
    ["difc","Senior Vice President – Human Resources at DIFC Authority","executive","v"]]},
  {id:"mahmoud_nsouli", n:"Mahmoud Nsouli", t:2, p:58, s:"finance", roles:[
    ["difc","Senior Vice President - Marketing & Corporate Communications at DIFC Authority","executive","v"]]},
  {id:"mohammad_yousuf_al", n:"Mohammad Yousuf Al Najjar", t:2, p:58, s:"finance", roles:[
    ["difc","Senior Vice President - Development and Projects, Property Development, DIFC Investments Ltd.","executive","v"]]},
];

const OWNERSHIP = [
  ["execco","dxbgov","governs under"],
  ["icd","dxbgov","the Ruler's investment arm"],
  ["dubaiholding","dxbgov","the Ruler's private holding"],
  ["difc","dxbgov"],["vara","dxbgov"],["det","execco"],["dof_dxb","execco"],
  ["rta","dxbgov"],["dewa","dxbgov"],["dmcc","dxbgov"],["dubaichambers","dxbgov"],
  ["emirates","icd","state owner"],
  ["flydubai","dxbgov","state owner","ns"],
  ["dxbairports","dxbgov"],
  ["dpworld","dxbgov","majority (via Dubai World)","ns"],
  ["enbd","icd","majority"],
  ["dib","icd","anchor stake","ns"],
  ["dfm","dxbgov","majority (Borse Dubai)","ns"],
  ["emaar","dxbgov","state anchor stake (ICD)","ns"],
  ["nakheel","dubaiholding","merged into (2024)"],
  ["tecom","dubaiholding"],
  ["expocity","dxbgov"],
  ["du","dxbgov","state stakes (EIA/Mubadala/Dubai Holding)","ns"],
  ["noon","icd","co-investor","ns"],
  ["enoc","dxbgov","state owner"],
  ["ega","icd","50% (with Mubadala)"],
  ["jumeirah","dubaiholding"],
  ["lst_salik","dfm","listed on DFM","ns"],
  ["lst_talabat","dfm","listed on DFM","ns"],
  ["lst_airarabia","dfm","listed on DFM","ns"],
  ["lst_parkin","dfm","listed on DFM","ns"],
  ["lst_etihadenergy","dfm","listed on DFM","ns"],
  ["lst_gfh","dfm","listed on DFM","ns"],
  ["lst_alansari","dfm","listed on DFM","ns"],
  ["lst_nind","dfm","listed on DFM","ns"],
  ["lst_tabreed","dfm","listed on DFM","ns"],
  ["lst_alec","dfm","listed on DFM","ns"],
  ["lst_salambah","dfm","listed on DFM","ns"],
  ["lst_mkhzn","dfm","listed on DFM","ns"],
  ["lst_ajmanbank","dfm","listed on DFM","ns"],
  ["lst_unioncoop","dfm","listed on DFM","ns"],
  ["lst_amanat","dfm","listed on DFM","ns"],
  ["lst_deyaar","dfm","listed on DFM","ns"],
  ["lst_taaleem","dfm","listed on DFM","ns"],
  ["lst_sukoon","dfm","listed on DFM","ns"],
  ["lst_armx","dfm","listed on DFM","ns"],
  ["lst_upp","dfm","listed on DFM","ns"],
  ["lst_ifa","dfm","listed on DFM","ns"],
  ["lst_ncc","dfm","listed on DFM","ns"],
  ["lst_amlak","dfm","listed on DFM","ns"],
  ["lst_salama","dfm","listed on DFM","ns"],
  ["lst_ngi","dfm","listed on DFM","ns"],
  ["lst_shuaa","dfm","listed on DFM","ns"],
  ["lst_alramz","dfm","listed on DFM","ns"],
  ["lst_dsi","dfm","listed on DFM","ns"],
  ["lst_nih","dfm","listed on DFM","ns"],
  ["lst_mazaya","dfm","listed on DFM","ns"],
  ["lst_bhmcapital","dfm","listed on DFM","ns"],
  ["lst_ufc","dfm","listed on DFM","ns"],
  ["lst_sukoontakafl","dfm","listed on DFM","ns"],
  ["lst_ithmr","dfm","listed on DFM","ns"],
  ["lst_unikai","dfm","listed on DFM","ns"],
  ["lst_naho","dfm","listed on DFM","ns"],
  ["lst_alfirdous","dfm","listed on DFM","ns"],
  ["lst_watania","dfm","listed on DFM","ns"],
  ["lst_ekttitab","dfm","listed on DFM","ns"],
  ["lst_alsalamsudan","dfm","listed on DFM","ns"],
  ["dxbmun","execco"],
  ["dxbpolice","dxbgov"],
  ["digitaldubai","dxbgov"],
  ["dha","execco"],
  ["khda","execco"],
  ["dld","execco"],
  ["gdmo","dxbgov"],
  ["dfsa","difc","regulatory arm of"],
];

const FAMILY = [
  ["mbr","hamdan_cp","father–son"],
  ["mbr","maktoum_dep","father–son"],
  ["mbr","ahmed_moh","father–son"],
  ["hamdan_cp","maktoum_dep","brothers"],
  ["mbr","ahmed_saeed","uncle–nephew (Al Maktoum)"],
];

const AKA = {
  mbr:["Mohammed bin Rashid","Sheikh Mohammed","MBR"],
  hamdan_cp:["Hamdan bin Mohammed","Fazza"],
  maktoum_dep:["Maktoum bin Mohammed"],
  ahmed_saeed:["Ahmed bin Saeed"],
  alabbar:["Mohamed Alabbar","Mohammed Alabbar"],
  icd:["Investment Corporation of Dubai"],
  enbd:["Emirates NBD"],
  dpworld:["DP World"],
  sultan_sulayem:["Sultan bin Sulayem","bin Sulayem"],
  difc:["Dubai International Financial Centre"],
  dewa:["Dubai Electricity"],
  maf:["Majid Al Futtaim"],
  alfuttaim:["Al-Futtaim","Al Futtaim Group"],
  dib:["Dubai Islamic Bank"],
  ega:["EGA","Emirates Global Aluminium"],
  dmcc:["DMCC","Dubai Multi Commodities Centre"],
  du:["du","EITC"],
  vara:["VARA"],
  omar_alfuttaim:["Omar Al-Futtaim"],
  chilwan_dib:["Adnan Chilwan"],
  binsulayem_dmcc:["Ahmed bin Sulayem"],
  digitaldubai:["Dubai Digital Authority","DDA"],
  dxbpolice:["Dubai Police"],
  gdmo:["Government of Dubai Media Office","Dubai Media Office"],
  mona_almarri:["Mona Al Marri"],
  dld:["Dubai Land Department"],
  khda:["Knowledge and Human Development Authority"],
  dha:["Dubai Health Authority"],
  dfsa:["DFSA","Dubai Financial Services Authority"],
};
