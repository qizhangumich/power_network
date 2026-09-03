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
