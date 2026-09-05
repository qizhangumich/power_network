/* ================================================================
   OMAN POWER NETWORK — DATASET (V1 backbone)
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
  {id:"omgov",     n:"Royal Court of Oman (Al Said)", s:"gov", t:0, p:100, short:"Royal Court"},
  {id:"com_om",    n:"Council of Ministers",          s:"gov", t:0, p:88,  short:"Cabinet"},
  {id:"mof_om",    n:"Ministry of Finance",           s:"gov", t:1, p:82,  short:"MoF"},
  {id:"mofa_om",   n:"Foreign Ministry",              s:"gov", t:1, p:80,  short:"MoFA"},
  {id:"moci_om",   n:"Ministry of Trade, Industry & Investment Promotion", s:"gov", t:1, p:74, short:"MoTIIP"},
  {id:"cbo",       n:"Central Bank of Oman",          s:"finance", t:1, p:76, short:"CBO"},
  {id:"moem_om",   n:"Ministry of Energy & Minerals", s:"energy", t:1, p:78, short:"MoEM"},
  {id:"moin_om",   n:"Ministry of Interior",          s:"gov", t:1, p:78, short:"MoI"},
  {id:"mtcit_om",  n:"Ministry of Transport, Communications & IT", s:"tech", t:1, p:72, short:"MTCIT"},
  {id:"moh_om",    n:"Ministry of Health",            s:"health", t:1, p:74, short:"MoH"},
  {id:"moht_om",   n:"Ministry of Heritage & Tourism", s:"gov", t:1, p:66, short:"MoHT"},
  {id:"oia",       n:"Oman Investment Authority",     s:"sovereign", t:1, p:90, short:"OIA"},
  {id:"oq",        n:"OQ Group",                      s:"energy", t:1, p:82, short:"OQ"},
  {id:"pdo",       n:"Petroleum Development Oman",    s:"energy", t:1, p:78, short:"PDO"},
  {id:"omanlng",   n:"Oman LNG",                      s:"energy", t:2, p:70, short:"Oman LNG"},
  {id:"omantel",   n:"Omantel",                       s:"comm", t:2, p:70, short:"Omantel"},
  {id:"bankmuscat", n:"Bank Muscat",                  s:"finance", t:1, p:74, short:"Bank Muscat"},
  {id:"sohar_bank", n:"Sohar International",          s:"finance", t:2, p:62, short:"Sohar Intl"},
  {id:"asyad",     n:"Asyad Group (logistics)",       s:"industry", t:1, p:72, short:"Asyad"},
  {id:"opaz",      n:"OPAZ (Special Economic Zones & Free Zones)", s:"gov", t:1, p:68, short:"OPAZ"},
  {id:"duqm",      n:"Duqm Special Economic Zone",    s:"industry", t:2, p:66, short:"Duqm SEZ"},
  {id:"soharport", n:"Sohar Port & Freezone",         s:"industry", t:2, p:66, short:"Sohar Port"},
  {id:"omanair",   n:"Oman Air",                      s:"industry", t:2, p:64, short:"Oman Air"},
  {id:"omran",     n:"OMRAN Group (tourism development)", s:"consumer_disc", t:2, p:62, short:"OMRAN"},
  {id:"ominvest",  n:"Ominvest",                      s:"finance", t:2, p:60, short:"Ominvest"},
  {id:"msx",       n:"Muscat Stock Exchange",         s:"finance", t:2, p:64, short:"MSX"},
  {id:"soharalum", n:"Sohar Aluminium",               s:"materials", t:2, p:62, short:"Sohar Aluminium"},
  {id:"omanflour", n:"Oman Flour Mills (Atyab)",      s:"consumer_stap", t:2, p:56, short:"Oman Flour Mills"},
  {id:"royalhosp", n:"The Royal Hospital (Muscat)",   s:"health", t:2, p:60, short:"Royal Hospital"},
  {id:"ithca",     n:"ITHCA Group (ICT investments)", s:"tech", t:2, p:60, short:"ITHCA"},
  {id:"nama",      n:"Nama Group (electricity holding)", s:"utilities", t:1, p:66, short:"Nama"},
  {id:"almouj",    n:"Al Mouj Muscat",                s:"realestate", t:2, p:58, short:"Al Mouj"},
  {id:"bahwan",    n:"Suhail Bahwan Group",           s:"conglomerate", t:3, p:68, short:"Suhail Bahwan"},
  {id:"zubair",    n:"The Zubair Corporation",        s:"conglomerate", t:3, p:64, short:"Zubair"},
  {id:"khimji",    n:"Khimji Ramdas",                 s:"conglomerate", t:3, p:58, short:"Khimji Ramdas"},
  {id:"lst_ajss", n:"Al Jazeira Services Company SAOG", s:"industry", t:2, p:50, short:"AJSS"},
  {id:"lst_amat", n:"Al Madina Takaful SAOG", s:"finance", t:2, p:50, short:"AMAT"},
  {id:"lst_aofs", n:"Al Omaniya Financial Services SAOG", s:"finance", t:2, p:50, short:"AOFS"},
  {id:"lst_bwpc", n:"Barka Water and Power Company SAOG", s:"utilities", t:2, p:50, short:"BWPC"},
  {id:"lst_batp", n:"Al Batinah Power Company SAOG", s:"utilities", t:2, p:50, short:"BATP"},
  {id:"lst_bkdb", n:"Bank Dhofar SAOG", s:"finance", t:2, p:50, short:"Bank Dhofar SAOG"},
  {id:"lst_bknz", n:"Bank Nizwa SAOG", s:"finance", t:2, p:50, short:"Bank Nizwa SAOG"},
  {id:"lst_atmi", n:"Al Jazeera Steel Products Company SAOG", s:"materials", t:2, p:50, short:"ATMI"},
  {id:"lst_didi", n:"Dhofar International Development & Investment SAOG", s:"finance", t:2, p:50, short:"DIDI"},
  {id:"lst_gfic", n:"Global Financial Investments Holding SAOG", s:"finance", t:2, p:50, short:"GFIC"},
  {id:"lst_ufci", n:"United Finance Company SAOG", s:"finance", t:2, p:50, short:"UFCI"},
  {id:"lst_voes", n:"Voltamp Energy SAOG", s:"industry", t:2, p:50, short:"Voltamp Energy SAOG"},
  {id:"lst_suwp", n:"Al Suwadi Power Company SAOG", s:"utilities", t:2, p:50, short:"SUWP"},
  {id:"lst_sspw", n:"Sembcorp Salalah Power & Water Company SAOG", s:"utilities", t:2, p:50, short:"SSPW"},
  {id:"lst_spfi", n:"A'Saffa Foods SAOG", s:"consumer_stap", t:2, p:50, short:"A'Saffa Foods SAOG"},
  {id:"lst_smnp", n:"SMN Power Holding SAOG", s:"utilities", t:2, p:50, short:"SMNP"},
  {id:"lst_rnss", n:"Renaissance Services SAOG", s:"industry", t:2, p:50, short:"RNSS"},
  {id:"lst_phpc", n:"Phoenix Power Company SAOG", s:"utilities", t:2, p:50, short:"PHPC"},
  {id:"lst_mspw", n:"Musandam Power Company SAOG", s:"utilities", t:2, p:50, short:"MSPW"},
  {id:"lst_gmpi", n:"Gulf Mushroom Products Co. SAOG", s:"consumer_stap", t:2, p:50, short:"GMPI"},
  {id:"lst_nbob", n:"National Bank of Oman SAOG", s:"finance", t:2, p:50, short:"NBOB"},
  {id:"lst_ocai", n:"Oman Cables Industry SAOG", s:"industry", t:2, p:50, short:"OCAI"},
  {id:"lst_oeio", n:"Oman & Emirates Investment Holding Company SAOG", s:"finance", t:2, p:50, short:"OEIO"},
  {id:"lst_ones", n:"Oman National Engineering & Investment Company SAOG", s:"industry", t:2, p:50, short:"ONES"},
  {id:"lst_ooms", n:"Oman Oil Marketing Company SAOG", s:"energy", t:2, p:50, short:"OOMS"},
  {id:"lst_ouic", n:"Oman United Insurance Company SAOG", s:"finance", t:2, p:50, short:"OUIC"},
  {id:"lst_aaic", n:"Al Anwar Investments SAOG", s:"finance", t:2, p:50, short:"AAIC"},
  {id:"lst_mhas", n:"Al Maha Petroleum Products Marketing Company SAOG", s:"energy", t:2, p:50, short:"MHAS"},
  {id:"lst_ocoi", n:"Oman Cement Company SAOG", s:"materials", t:2, p:50, short:"OCOI"},
  {id:"lst_ords", n:"Omani Qatari Telecommunications Company SAOG (Ooredoo)", s:"comm", t:2, p:50, short:"ORDS"},
  {id:"lst_sihc", n:"A'Sharqiya Investment Holding Co. SAOG", s:"finance", t:2, p:50, short:"SIHC"},
  {id:"lst_brde", n:"Barka Desalination Company SAOG", s:"utilities", t:2, p:50, short:"BRDE"},
  {id:"lst_abrj", n:"Abraj Energy Services SAOG", s:"energy", t:2, p:50, short:"ABRJ"},
  {id:"lst_oqgn", n:"OQ Gas Networks SAOG", s:"utilities", t:2, p:50, short:"OQ Gas Networks SAOG"},
  {id:"lst_oqep", n:"OQ Exploration and Production SAOG", s:"energy", t:2, p:50, short:"OQEP"},
  {id:"lst_oqbi", n:"OQ Base Industries (SFZ) SAOG", s:"materials", t:2, p:50, short:"OQBI"},
  {id:"lst_cmii", n:"Construction Materials Industries SAOG", s:"materials", t:2, p:50, short:"CMII"},
  {id:"lst_aact", n:"Al Anwar Ceramic Tiles Company SAOG", s:"materials", t:2, p:50, short:"AACT"},
  {id:"lst_abob", n:"Ahli Bank SAOG", s:"finance", t:2, p:50, short:"Ahli Bank SAOG"},
  {id:"lst_afai", n:"Al Fajar Al Alamia Company SAOG", s:"industry", t:2, p:50, short:"AFAI"},
  {id:"lst_afic", n:"Arabia Falcon Insurance SAOG", s:"finance", t:2, p:50, short:"AFIC"},
  {id:"lst_dtcs", n:"Dhofar Tourism Company SAOG", s:"consumer_disc", t:2, p:50, short:"DTCS"},
  {id:"lst_ghos", n:"Gulf Hotels (Oman) Company Limited SAOG", s:"consumer_disc", t:2, p:50, short:"GHOS"},
  {id:"lst_hmci", n:"Hotels Management Company International SAOG", s:"consumer_disc", t:2, p:50, short:"HMCI"},
  {id:"lst_mcti", n:"Muscat Insurance Company SAOG", s:"finance", t:2, p:50, short:"MCTI"},
  {id:"lst_nbii", n:"National Biscuit Industries Limited SAOG", s:"consumer_stap", t:2, p:50, short:"NBII"},
  {id:"lst_nred", n:"National Real Estate Development and Investments Company SAOG", s:"realestate", t:2, p:50, short:"NRED"},
  {id:"lst_occi", n:"Oman Chromite Company SAOG", s:"materials", t:2, p:50, short:"OCCI"},
  {id:"lst_sahs", n:"Sahara Hospitality Company SAOG", s:"consumer_disc", t:2, p:50, short:"SAHS"},
  {id:"lst_amii", n:"Al Madina Investment Holding Co. SAOG", s:"finance", t:2, p:50, short:"AMII"},
  {id:"lst_bacs", n:"Majan College (University College) SAOG", s:"industry", t:2, p:50, short:"BACS"},
  {id:"lst_dbci", n:"Dhofar Beverage and Food Stuff Company SAOG", s:"consumer_stap", t:2, p:50, short:"DBCI"},
  {id:"lst_dfin", n:"Dhofar Food & Investment SAOG", s:"consumer_stap", t:2, p:50, short:"DFIN"},
  {id:"lst_dgen", n:"Dhofar Generating Company SAOG", s:"utilities", t:2, p:50, short:"DGEN"},
  {id:"lst_dics", n:"Dhofar Insurance Company SAOG", s:"finance", t:2, p:50, short:"DICS"},
  {id:"lst_gecs", n:"Galfar Engineering & Contracting SAOG", s:"industry", t:2, p:50, short:"GECS"},
  {id:"lst_gici", n:"Gulf International Chemicals SAOG", s:"materials", t:2, p:50, short:"GICI"},
  {id:"lst_ubar", n:"Ubar Hotels & Resorts SAOG", s:"consumer_disc", t:2, p:50, short:"UBAR"},
  {id:"lst_tfci", n:"Taageer Finance Company SAOG", s:"finance", t:2, p:50, short:"TFCI"},
  {id:"lst_taoi", n:"Takaful Oman Insurance SAOG", s:"finance", t:2, p:50, short:"TAOI"},
  {id:"lst_spsi", n:"Salalah Port Services Company SAOG", s:"industry", t:2, p:50, short:"SPSI"},
  {id:"lst_shrq", n:"Sharqiyah Desalination Company SAOG", s:"utilities", t:2, p:50, short:"SHRQ"},
  {id:"lst_shps", n:"Sohar Power Company SAOG", s:"utilities", t:2, p:50, short:"SHPS"},
  {id:"lst_sfmi", n:"Salalah Mills Company SAOG", s:"consumer_stap", t:2, p:50, short:"SFMI"},
  {id:"lst_mcde", n:"Muscat City Desalination Company SAOG", s:"utilities", t:2, p:50, short:"MCDE"},
  {id:"lst_mgmc", n:"Muscat Gases Company SAOG", s:"materials", t:2, p:50, short:"MGMC"},
  {id:"lst_mtmi", n:"Muscat Thread Mills SAOG", s:"materials", t:2, p:50, short:"MTMI"},
  {id:"lst_ndti", n:"The National Detergent Company SAOG", s:"materials", t:2, p:50, short:"NDTI"},
  {id:"lst_liva", n:"Liva Group SAOG", s:"finance", t:2, p:50, short:"Liva Group SAOG"},
  {id:"lst_oeti", n:"Oman Education & Training Investment Company SAOG", s:"industry", t:2, p:50, short:"OETI"},
  {id:"lst_opci", n:"Omani Packaging Company SAOG", s:"materials", t:2, p:50, short:"OPCI"},
  {id:"lst_oqic", n:"Oman Qatar Insurance Company SAOG", s:"finance", t:2, p:50, short:"OQIC"},
  {id:"lst_orci", n:"Oman Refreshment Company SAOG", s:"consumer_stap", t:2, p:50, short:"ORCI"},
  {id:"lst_somp", n:"Shell Oman Marketing Company SAOG (Preferred)", s:"energy", t:2, p:50, short:"SOMP"},
  {id:"lst_nfci", n:"National Finance Company SAOG", s:"finance", t:2, p:50, short:"NFCI"},
  {id:"lst_amci", n:"Al Maha Ceramics SAOG", s:"materials", t:2, p:50, short:"AMCI"},
  {id:"lst_mfci", n:"Muscat Finance SAOG", s:"finance", t:2, p:50, short:"Muscat Finance SAOG"},
  {id:"lst_ngci", n:"National Gas Company SAOG", s:"energy", t:2, p:50, short:"NGCI"},
  {id:"lst_ochl", n:"Oman Chlorine SAOG", s:"materials", t:2, p:50, short:"Oman Chlorine SAOG"},
  {id:"lst_oab", n:"Oman Arab Bank SAOG", s:"finance", t:2, p:50, short:"Oman Arab Bank SAOG"},
  {id:"lst_oric", n:"Oman Reinsurance Company SAOG", s:"finance", t:2, p:50, short:"ORIC"},
  {id:"lst_omif", n:"Oman India Fertiliser Company SAOG", s:"materials", t:2, p:50, short:"OMIF"},
];

const PEOPLE = [
  {id:"haitham", n:"H.M. Sultan Haitham bin Tariq Al Said", t:0, p:100, s:"gov", roles:[
    ["omgov","Sultan of Oman","political","v"]],
    note:"Also holds the PM, defence, finance and central-bank chairmanships in the Omani system."},
  {id:"theyazin", n:"H.H. Sayyid Theyazin bin Haitham Al Said", t:0, p:80, s:"gov", roles:[
    ["omgov","Crown Prince","political","v"],
    ["com_om","Minister of Culture, Sports & Youth","political","v"]]},
  {id:"shihab", n:"H.H. Sayyid Shihab bin Tariq Al Said", t:0, p:84, s:"gov", roles:[
    ["com_om","Deputy Prime Minister for Defence Affairs","political","v"]]},
  {id:"fahd", n:"H.H. Sayyid Fahd bin Mahmoud Al Said", t:0, p:76, s:"gov", roles:[
    ["com_om","Deputy Prime Minister for Cabinet Affairs","political","ns"]]},
  {id:"badr_fm", n:"Sayyid Badr bin Hamad Albusaidi", t:1, p:80, s:"gov", roles:[
    ["mofa_om","Foreign Minister","political","v"]],
    note:"The face of Oman's quiet-mediator diplomacy."},
  {id:"habsi", n:"Sultan bin Salim Al Habsi", t:1, p:80, s:"finance", roles:[
    ["mof_om","Minister of Finance","political","v"]]},
  {id:"yousef_om", n:"Anwar bin Hilal bin Hamdoun Al Jabri", t:1, p:70, s:"gov", roles:[
    ["moci_om","Minister of Trade, Industry & Investment Promotion","political","v"]],
    note:"Appointed under Royal Decree 17/2026 (13 Jan 2026), succeeding Qais bin Mohammed Al Yousef as minister."},
  {id:"qais_opaz", n:"Qais bin Mohammed Al Yousef", t:1, p:64, s:"gov", roles:[
    ["opaz","Chairman","board","v"]],
    note:"Lost the Trade/Industry ministry portfolio in the January 2026 reshuffle but retained the OPAZ board chairmanship."},
  {id:"murshidi", n:"Abdulsalam Al Murshidi", t:1, p:82, s:"sovereign", roles:[
    ["oia","President","executive","v"]],
    note:"Controls the consolidated sovereign portfolio — OQ, Asyad, Omantel and most state companies sit under OIA."},
  {id:"mamari_oq", n:"Ashraf Hamed Al Mamari", t:2, p:66, s:"energy", roles:[
    ["oq","Group CEO","executive","ns"]]},
  {id:"alkindi_asyad", n:"Dr. Ahmed Al Bulushi", t:2, p:58, s:"industry", roles:[
    ["asyad","Group CEO (acting)","executive","ns"]]},
  {id:"suhail_bahwan", n:"Suhail Bahwan", t:2, p:70, s:"conglomerate", roles:[
    ["bahwan","Founder & Chairman","board","v"]]},
  {id:"mohammed_zubair", n:"Mohammed Al Zubair", t:2, p:62, s:"conglomerate", roles:[
    ["zubair","Chairman (family)","board","ns"]]},
  {id:"alhadhrami_pdo", n:"Dr. Aflah Al Hadhrami", t:1, p:74, s:"energy", roles:[
    ["pdo","Managing Director","executive","v"]]},
  {id:"almusalmi_cbo", n:"Ahmed bin Jaafar bin Salim Al Musalmi", t:1, p:76, s:"finance", roles:[
    ["cbo","Governor","executive","v"]]},
  {id:"alhashar_bankmuscat", n:"Sheikh Waleed Khamis Al Hashar", t:2, p:70, s:"finance", roles:[
    ["bankmuscat","Chief Executive Officer","executive","v"]]},
  {id:"baitfadhil_omantel", n:"Aladdin Abdullah Hassan Baitfadhil", t:2, p:66, s:"comm", roles:[
    ["omantel","Chief Executive Officer","executive","v"]]},
  {id:"naamany_omanlng", n:"Hamed Al Naamany", t:2, p:64, s:"energy", roles:[
    ["omanlng","Chief Executive Officer","executive","v"]]},
  {id:"almahrizi_nama", n:"Ahmed Al Mahrizi", t:2, p:62, s:"utilities", roles:[
    ["nama","Group Chief Executive Officer","executive","v"]]},

  // ===== ADDED SEP 2026 — KEY MINISTRIES PREVIOUSLY MISSING FROM THE MAP =====
  {id:"alaufi_energy", n:"Eng. Salim bin Nasser bin Said Al Aufi", t:1, p:78, s:"energy", roles:[
    ["moem_om","Minister of Energy & Minerals","political","v"]],
    note:"Appointed 16 June 2022; retained in the January 2026 Royal Decree 17/2026 cabinet restructuring."},
  {id:"albusaidi_interior", n:"Sayyid Hamoud bin Faisal bin Said Al Busaidi", t:1, p:76, s:"gov", roles:[
    ["moin_om","Minister of Interior","political","v"]],
    note:"Appointed under Royal Decree 17/2026 (13 Jan 2026)."},
  {id:"almaawali_mtcit", n:"Eng. Said bin Hamoud bin Said Al Maawali", t:1, p:70, s:"tech", roles:[
    ["mtcit_om","Minister of Transport, Communications & IT","political","v"]]},
  {id:"alsabti_health", n:"Dr. Hilal bin Ali bin Hilal Al Sabti", t:1, p:70, s:"health", roles:[
    ["moh_om","Minister of Health","political","v"]],
    note:"Retained under Royal Decree 17/2026 (13 Jan 2026)."},
  {id:"albusaidi_tourism", n:"Sayyid Ibrahim bin Said bin Ibrahim Al Busaidi", t:1, p:64, s:"gov", roles:[
    ["moht_om","Minister of Heritage & Tourism","political","v"]],
    note:"Appointed under Royal Decree 17/2026 (13 Jan 2026), succeeding Salem bin Mohammed Al Mahrouqi."},
  {id:"sheikh_khalid_bin", n:"Sheikh Khalid bin Mustahail Al Mashani", t:2, p:62, s:"finance", roles:[
    ["bankmuscat","Chairman","board","v"]]},
  {id:"sheikh_ahmed_bin", n:"Sheikh Ahmed bin Hamed Al Sadi", t:2, p:62, s:"finance", roles:[
    ["bankmuscat","Deputy Chairman","board","v"]]},
  {id:"dr_faisal_bin", n:"Dr. Faisal bin Abdullah Al Farsi", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"sheikh_said_bin", n:"Sheikh Said bin Mohammed Alharthy", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"sheikh_dr_saud", n:"Sheikh Dr. Saud bin Mustahail Al Mashani", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"khalid_nasser_al", n:"Khalid Nasser Al Shamsi", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"dr_saif_bin", n:"Dr. Saif bin Salim Al Harthi", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"saud_bin_nasser", n:"Saud bin Nasser Al Shukaili", t:2, p:52, s:"finance", roles:[
    ["bankmuscat","Director","board","v"]]},
  {id:"ahmed_faqir_al", n:"Ahmed Faqir Al Bulushi", t:2, p:60, s:"finance", roles:[
    ["bankmuscat","Deputy CEO - Banking","executive","v"]]},
  {id:"sheikha_yousuf_al", n:"Sheikha Yousuf Al Farsi", t:2, p:60, s:"finance", roles:[
    ["bankmuscat","Deputy CEO - Operations","executive","v"]]},
  {id:"ganesh_thangavel", n:"Ganesh Thangavel", t:2, p:60, s:"finance", roles:[
    ["bankmuscat","Deputy CEO - Finance & Investment Banking","executive","v"]]},
  {id:"antonio_gamez_munoz", n:"Antonio Gamez Munoz", t:2, p:58, s:"finance", roles:[
    ["bankmuscat","Chief Risk Officer","executive","v"]]},
  {id:"qais_al_zakwani", n:"Qais Al-Zakwani", t:2, p:62, s:"comm", roles:[
    ["omantel","Chairman","board","v"]]},
  {id:"eng_atif_al", n:"Eng. Atif Al Siyabi", t:2, p:62, s:"comm", roles:[
    ["omantel","Deputy Chairman","board","v"]]},
  {id:"aiman_al_hosni", n:"Aiman Al-Hosni", t:2, p:52, s:"comm", roles:[
    ["omantel","Board Member","board","v"]]},
  {id:"bassam_al_jamali", n:"Bassam Al-Jamali", t:2, p:52, s:"comm", roles:[
    ["omantel","Board Member","board","v"]]},
  {id:"dr_faisal_al", n:"Dr. Faisal Al-Farsi", t:2, p:52, s:"comm", roles:[
    ["omantel","Board Member","board","v"]]},
  {id:"khalid_talib_al", n:"Khalid Talib Al Hasani", t:2, p:52, s:"comm", roles:[
    ["omantel","Board Member","board","v"]]},
  {id:"eng_samy_ahmed", n:"Eng. Samy Ahmed Al Ghassany", t:2, p:58, s:"comm", roles:[
    ["omantel","Chief Commercial & Operating Officer","executive","v"]]},
  {id:"ghassan_khamis_al", n:"Ghassan Khamis Al Hashar", t:2, p:58, s:"comm", roles:[
    ["omantel","Chief Financial Officer","executive","v"]]},
  {id:"dr_ghalib_al", n:"Dr. Ghalib Al Hosni", t:2, p:58, s:"comm", roles:[
    ["omantel","Chief People Officer","executive","v"]]},
  {id:"rashad_muhammad_al", n:"Rashad Muhammad Al Zubair", t:2, p:62, s:"finance", roles:[
    ["ominvest","Chairman","board","ns"]]},
  {id:"sheikh_khalid_abdullah", n:"Sheikh Khalid Abdullah Al Khalili", t:2, p:62, s:"finance", roles:[
    ["ominvest","Deputy Chairman","board","ns"]]},
  {id:"najat_ali_al", n:"Najat Ali Al Lawati", t:2, p:52, s:"finance", roles:[
    ["ominvest","Director","board","ns"]]},
  {id:"khaula_hamood_al", n:"Khaula Hamood Al Harthi", t:2, p:52, s:"finance", roles:[
    ["ominvest","Director","board","ns"]]},
  {id:"abdulaziz_mohammed_al", n:"Abdulaziz Mohammed Al-Balushi", t:2, p:58, s:"finance", roles:[
    ["ominvest","Group Chief Executive Officer","executive","v"]]},
  {id:"badar_bin_awadh", n:"Badar bin Awadh Al Shanfari", t:2, p:58, s:"finance", roles:[
    ["ominvest","Chief Operating Officer","executive","v"]]},
  {id:"said_mohamed_al", n:"Said Mohamed Al-Aufi", t:2, p:62, s:"finance", roles:[
    ["sohar_bank","Chairman","board","v"]]},
  {id:"tareq_mohamed_al", n:"Tareq Mohamed Al Mugheiry", t:2, p:62, s:"finance", roles:[
    ["sohar_bank","Deputy Chairman","board","v"]]},
  {id:"salim_mohamed_al", n:"Salim Mohamed Al Mashaikhi", t:2, p:52, s:"finance", roles:[
    ["sohar_bank","Director","board","v"]]},
  {id:"said_ahmed_safrar", n:"Said Ahmed Safrar", t:2, p:52, s:"finance", roles:[
    ["sohar_bank","Director","board","v"]]},
  {id:"sheikh_aimen_ahmed", n:"Sheikh Aimen Ahmed Al Hosni", t:2, p:52, s:"finance", roles:[
    ["sohar_bank","Director","board","v"]]},
  {id:"ghusen_hilal_al", n:"Ghusen Hilal Al Abri", t:2, p:52, s:"finance", roles:[
    ["sohar_bank","Director","board","v"]]},
  {id:"ahmed_dawood_al", n:"Ahmed Dawood Al Busaidi", t:2, p:52, s:"finance", roles:[
    ["sohar_bank","Director","board","v"]]},
  {id:"abdulwahid_mohamed_al", n:"Abdulwahid Mohamed Al Murshidi", t:2, p:58, s:"finance", roles:[
    ["sohar_bank","Chief Executive Officer","executive","v"]]},
  {id:"craig_barrington_bell", n:"Craig Barrington Bell", t:2, p:58, s:"finance", roles:[
    ["sohar_bank","Chief Financial Officer","executive","v"]]},
  {id:"hamood_abdullah_al", n:"Hamood Abdullah Al Sawai", t:2, p:58, s:"finance", roles:[
    ["sohar_bank","Chief Operating Officer","executive","v"]]},
  {id:"amal_suhail_bahwan", n:"Amal Suhail Bahwan", t:2, p:62, s:"finance", roles:[
    ["lst_nbob","Chairperson","board","v"]]},
  {id:"sheikh_abdullah_ali", n:"Sheikh Abdullah Ali Al Thani", t:2, p:62, s:"finance", roles:[
    ["lst_nbob","Deputy Chairman","board","v"]]},
  {id:"dr_hisham_ba", n:"Dr. Hisham Ba Omar", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"al_sayyid_shabib", n:"Al Sayyid Shabib Al Busaidi", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"fahad_badar", n:"Fahad Badar", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"stephen_moss", n:"Stephen Moss", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"shaikh_faisal_al", n:"Shaikh Faisal Al Rawas", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"nabil_al_mahrouqi", n:"Nabil Al Mahrouqi", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"brigadier_jamal_al", n:"Brigadier Jamal Al Tai", t:2, p:52, s:"finance", roles:[
    ["lst_nbob","Director","board","v"]]},
  {id:"abdullah_zahran_al", n:"Abdullah Zahran Al Hinai", t:2, p:58, s:"finance", roles:[
    ["lst_nbob","Chief Executive Officer","executive","v"]]},
  {id:"srinivasaraghava_giridhar", n:"Srinivasaraghava Giridhar", t:2, p:58, s:"finance", roles:[
    ["lst_nbob","Chief Financial Officer","executive","v"]]},
  {id:"mulham_basheer_al", n:"Mulham Basheer Al Jarf", t:2, p:62, s:"energy", roles:[
    ["oq","Chairman","board","v"],
    ["oia","Deputy President for Investments","executive","v"]]},
  {id:"hussain_ghalib_al", n:"Hussain Ghalib Al Yafai", t:2, p:52, s:"energy", roles:[
    ["oq","Board Member","board","v"]]},
  {id:"mattar_salim_al", n:"Mattar Salim Al Badi", t:2, p:52, s:"energy", roles:[
    ["oq","Board Member","board","v"]]},
  {id:"li_lei", n:"Li Lei", t:2, p:52, s:"energy", roles:[
    ["oq","Board Member","board","v"]]},
  {id:"dr_sultan_said", n:"Dr. Sultan Said Al Shidhani", t:2, p:52, s:"energy", roles:[
    ["oq","Board Member","board","v"]]},
  {id:"thuraiya_ahmed_al", n:"Thuraiya Ahmed Al Balushi", t:2, p:58, s:"energy", roles:[
    ["oq","Board Member","board","v"],
    ["oia","Acting Chief - Economic Diversification Investments","executive","v"]]},
  {id:"abdulrahman_ahmed_al", n:"Abdulrahman Ahmed Al Harthi", t:2, p:58, s:"energy", roles:[
    ["oq","Chief Assurance Officer","executive","v"]]},
  {id:"abdulwahhab_abdullah_al", n:"Abdulwahhab Abdullah Al Hinai", t:2, p:58, s:"energy", roles:[
    ["oq","General Counsel","executive","v"]]},
  {id:"sabrina_al_bakri", n:"Sabrina Al Bakri", t:2, p:58, s:"energy", roles:[
    ["oq","Chief Financial Officer","executive","v"]]},
  {id:"ali_mohamed_al", n:"Ali Mohamed Al Lawati", t:2, p:58, s:"energy", roles:[
    ["oq","Chief People & Technology Officer","executive","v"]]},
  {id:"azzan_al_abdullatif", n:"Azzan Al Abdullatif", t:2, p:58, s:"energy", roles:[
    ["oq","Chief Growth Officer","executive","v"]]},
  {id:"muneer_bin_ali", n:"Muneer bin Ali Al Muneeri", t:2, p:58, s:"sovereign", roles:[
    ["oia","Deputy President for Operations","executive","v"]]},
  {id:"dr_saud_al", n:"Dr. Saud Al Habsi", t:2, p:52, s:"sovereign", roles:[
    ["oia","Board Member (Minister of Agriculture Fisheries & Water Resources)","board","v"]]},
  {id:"abdullah_al_harthi", n:"Abdullah Al Harthi", t:2, p:52, s:"sovereign", roles:[
    ["oia","Board Member (Undersecretary Ministry of Finance)","board","v"]]},
  {id:"kwa_chong_seng", n:"Kwa Chong Seng", t:2, p:52, s:"sovereign", roles:[
    ["oia","International Board Member","board","v"]]},
  {id:"hussein_ali_al", n:"Hussein Ali Al Rashdi", t:2, p:58, s:"sovereign", roles:[
    ["oia","Acting Director - Corporate Planning & Performance","executive","v"],
    ["asyad","Board Member","board","v"]]},
  {id:"issa_janjan_al", n:"Issa Janjan Al Balushi", t:2, p:58, s:"sovereign", roles:[
    ["oia","Manager - Economic Diversification Investments","executive","v"],
    ["asyad","Board Member","board","v"]]},
  {id:"dr_musallam_mahad", n:"Dr. Musallam Mahad Qatan", t:2, p:62, s:"industry", roles:[
    ["asyad","Chairman","board","v"]]},
  {id:"saif_said_al", n:"Saif Said Al Hamhami", t:2, p:62, s:"industry", roles:[
    ["asyad","Deputy Chairman (CEO Abraj Energy Services)","board","v"]]},
  {id:"dr_ismail_ahmed", n:"Dr. Ismail Ahmed Al Balushi", t:2, p:52, s:"industry", roles:[
    ["asyad","Board Member","board","v"]]},
  {id:"flemming_dalgaard", n:"Flemming Dalgaard", t:2, p:52, s:"industry", roles:[
    ["asyad","Board Member","board","v"]]},
  {id:"muhsin_al_rustom", n:"Muhsin Al Rustom", t:2, p:58, s:"industry", roles:[
    ["asyad","Group Chief Finance Officer","executive","v"]]},
  {id:"abdulmalik_al_balushi", n:"Abdulmalik Al Balushi", t:2, p:58, s:"industry", roles:[
    ["asyad","Group Chief People Officer","executive","v"]]},
  {id:"ghaith_al_darmaki", n:"Ghaith Al Darmaki", t:2, p:58, s:"industry", roles:[
    ["asyad","Group Chief Technology Officer","executive","v"]]},
  {id:"ibrahim_al_nadhairi", n:"Ibrahim Al Nadhairi", t:2, p:60, s:"industry", roles:[
    ["asyad","CEO - Asyad Shipping","executive","v"]]},
  {id:"leyan_al_mawali", n:"Leyan Al Mawali", t:2, p:58, s:"industry", roles:[
    ["asyad","Group Chief Legal Officer","executive","v"]]},
  {id:"ziyad_al_harbi", n:"Ziyad Al Harbi", t:2, p:58, s:"industry", roles:[
    ["asyad","Senior Vice President - Strategy and Planning","executive","v"]]},
  {id:"selim_ismail", n:"Selim Ismail", t:2, p:46, s:"industry", roles:[
    ["asyad","SVP & Group Head of M&A and Portfolio Development","executive","v"]]},
  {id:"scott_smiley", n:"Scott Smiley", t:2, p:58, s:"industry", roles:[
    ["asyad","Chief Commercial Officer","executive","v"]]},
  {id:"juma_al_uraimi", n:"Juma Al Uraimi", t:2, p:46, s:"industry", roles:[
    ["asyad","SVP & Group Head of Business Development","executive","v"]]},
  {id:"mohsin_al_hadhrami", n:"Mohsin Al Hadhrami", t:2, p:62, s:"energy", roles:[
    ["pdo","Chairman (Undersecretary Ministry of Energy and Minerals)","board","v"]]},
  {id:"isam_al_zadjali", n:"Isam Al Zadjali", t:2, p:52, s:"energy", roles:[
    ["pdo","Board Representative - Energy Development Oman","board","v"]]},
  {id:"mazin_al_lamki", n:"Mazin Al Lamki", t:2, p:52, s:"energy", roles:[
    ["pdo","Board Member (CEO Energy Development Oman)","board","v"]]},
  {id:"sultan_al_mamari", n:"Sultan Al Mamari", t:2, p:52, s:"energy", roles:[
    ["pdo","Board Member (CFO Energy Development Oman)","board","v"]]},
  {id:"azhar_bin_ahmed", n:"Azhar bin Ahmed Al Kindi", t:2, p:52, s:"energy", roles:[
    ["pdo","Board Member (COO Energy Development Oman)","board","v"]]},
  {id:"ali_al_janabi", n:"Ali Al-Janabi", t:2, p:62, s:"energy", roles:[
    ["pdo","Board Member (Shell Country Chairman in Oman)","board","v"]]},
  {id:"fares_al_khazen", n:"Fares Al-Khazen", t:2, p:52, s:"energy", roles:[
    ["pdo","Board Member (TotalEnergies Director)","board","v"]]},
  {id:"sami_baqi", n:"Sami Baqi", t:2, p:58, s:"energy", roles:[
    ["pdo","Executive Director Technical","executive","v"]]},
  {id:"farid_al_harthy", n:"Farid Al Harthy", t:2, p:58, s:"energy", roles:[
    ["pdo","Executive Director Business Support","executive","v"]]},
  {id:"antonio_armando", n:"Antonio Armando", t:2, p:58, s:"energy", roles:[
    ["pdo","Executive Director Finance","executive","v"]]},
  {id:"salman_al_maimani", n:"Salman Al Maimani", t:2, p:58, s:"energy", roles:[
    ["pdo","HSE Director","executive","v"]]},
  {id:"eng_saeed_bin", n:"Eng. Saeed bin Hamoud Al Maawali", t:2, p:62, s:"industry", roles:[
    ["omanair","Executive Chairman","board","ns"]]},
  {id:"stephen_kavanagh", n:"Stephen Kavanagh", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"christopher_mueller", n:"Christopher Mueller", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"antonio_de_menezes", n:"Antonio De Menezes", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"ahmed_tufail_al", n:"Ahmed Tufail Al Rahman", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"abdul_rahman_bin", n:"Abdul Rahman bin Harith Al Busaidi", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"haitham_bin_muhammad", n:"Haitham bin Muhammad Al Ghassani", t:2, p:52, s:"industry", roles:[
    ["omanair","Board Member","board","ns"]]},
  {id:"con_korfiatis", n:"Con Korfiatis", t:2, p:60, s:"industry", roles:[
    ["omanair","Chief Executive Officer","executive","ns"]]},
  {id:"hamood_al_alawi", n:"Hamood Al Alawi", t:2, p:60, s:"industry", roles:[
    ["omanair","Deputy Chief Executive Officer","executive","ns"]]},
  {id:"paul_starrs", n:"Paul Starrs", t:2, p:58, s:"industry", roles:[
    ["omanair","Chief Commercial Officer","executive","ns"]]},
];

const OWNERSHIP = [
  ["com_om","omgov","governs under"],
  ["mof_om","com_om"],["mofa_om","com_om"],["moci_om","com_om"],
  ["moem_om","com_om"],["moin_om","com_om"],["mtcit_om","com_om"],["moh_om","com_om"],["moht_om","com_om"],
  ["cbo","omgov"],
  ["oia","omgov","sovereign fund"],
  ["oq","oia"],["asyad","oia"],["omantel","oia","majority"],["omran","oia"],
  ["omanair","oia","state owner","ns"],
  ["pdo","omgov","60% state","ns"],
  ["omanlng","oq","majority stake","ns"],
  ["opaz","com_om"],["duqm","opaz"],["soharport","opaz","oversight","ns"],
  ["bankmuscat","oia","anchor state stakes","ns"],
  ["soharalum","oq","co-shareholder","ns"],
  ["omanflour","oia","state stake","ns"],
  ["royalhosp","com_om","Ministry of Health hospital","ns"],
  ["ithca","oia"],
  ["msx","oia","transferred to OIA","ns"],
  ["nama","oia","transferred to","ns"],
  ["almouj","omran","JV development","ns"],
  ["lst_ajss","msx","listed on MSX","ns"],
  ["lst_amat","msx","listed on MSX","ns"],
  ["lst_aofs","msx","listed on MSX","ns"],
  ["lst_bwpc","msx","listed on MSX","ns"],
  ["lst_batp","msx","listed on MSX","ns"],
  ["lst_bkdb","msx","listed on MSX","ns"],
  ["lst_bknz","msx","listed on MSX","ns"],
  ["lst_atmi","msx","listed on MSX","ns"],
  ["lst_didi","msx","listed on MSX","ns"],
  ["lst_gfic","msx","listed on MSX","ns"],
  ["lst_ufci","msx","listed on MSX","ns"],
  ["lst_voes","msx","listed on MSX","ns"],
  ["lst_suwp","msx","listed on MSX","ns"],
  ["lst_sspw","msx","listed on MSX","ns"],
  ["lst_spfi","msx","listed on MSX","ns"],
  ["lst_smnp","msx","listed on MSX","ns"],
  ["lst_rnss","msx","listed on MSX","ns"],
  ["lst_phpc","msx","listed on MSX","ns"],
  ["lst_mspw","msx","listed on MSX","ns"],
  ["lst_gmpi","msx","listed on MSX","ns"],
  ["lst_nbob","msx","listed on MSX","ns"],
  ["lst_ocai","msx","listed on MSX","ns"],
  ["lst_oeio","msx","listed on MSX","ns"],
  ["lst_ones","msx","listed on MSX","ns"],
  ["lst_ooms","msx","listed on MSX","ns"],
  ["lst_ouic","msx","listed on MSX","ns"],
  ["lst_aaic","msx","listed on MSX","ns"],
  ["lst_mhas","msx","listed on MSX","ns"],
  ["lst_ocoi","msx","listed on MSX","ns"],
  ["lst_ords","msx","listed on MSX","ns"],
  ["lst_sihc","msx","listed on MSX","ns"],
  ["lst_brde","msx","listed on MSX","ns"],
  ["lst_abrj","msx","listed on MSX","ns"],
  ["lst_oqgn","msx","listed on MSX","ns"],
  ["lst_oqep","msx","listed on MSX","ns"],
  ["lst_oqbi","msx","listed on MSX","ns"],
  ["lst_cmii","msx","listed on MSX","ns"],
  ["lst_aact","msx","listed on MSX","ns"],
  ["lst_abob","msx","listed on MSX","ns"],
  ["lst_afai","msx","listed on MSX","ns"],
  ["lst_afic","msx","listed on MSX","ns"],
  ["lst_dtcs","msx","listed on MSX","ns"],
  ["lst_ghos","msx","listed on MSX","ns"],
  ["lst_hmci","msx","listed on MSX","ns"],
  ["lst_mcti","msx","listed on MSX","ns"],
  ["lst_nbii","msx","listed on MSX","ns"],
  ["lst_nred","msx","listed on MSX","ns"],
  ["lst_occi","msx","listed on MSX","ns"],
  ["lst_sahs","msx","listed on MSX","ns"],
  ["lst_amii","msx","listed on MSX","ns"],
  ["lst_bacs","msx","listed on MSX","ns"],
  ["lst_dbci","msx","listed on MSX","ns"],
  ["lst_dfin","msx","listed on MSX","ns"],
  ["lst_dgen","msx","listed on MSX","ns"],
  ["lst_dics","msx","listed on MSX","ns"],
  ["lst_gecs","msx","listed on MSX","ns"],
  ["lst_gici","msx","listed on MSX","ns"],
  ["lst_ubar","msx","listed on MSX","ns"],
  ["lst_tfci","msx","listed on MSX","ns"],
  ["lst_taoi","msx","listed on MSX","ns"],
  ["lst_spsi","msx","listed on MSX","ns"],
  ["lst_shrq","msx","listed on MSX","ns"],
  ["lst_shps","msx","listed on MSX","ns"],
  ["lst_sfmi","msx","listed on MSX","ns"],
  ["lst_mcde","msx","listed on MSX","ns"],
  ["lst_mgmc","msx","listed on MSX","ns"],
  ["lst_mtmi","msx","listed on MSX","ns"],
  ["lst_ndti","msx","listed on MSX","ns"],
  ["lst_liva","msx","listed on MSX","ns"],
  ["lst_oeti","msx","listed on MSX","ns"],
  ["lst_opci","msx","listed on MSX","ns"],
  ["lst_oqic","msx","listed on MSX","ns"],
  ["lst_orci","msx","listed on MSX","ns"],
  ["lst_somp","msx","listed on MSX","ns"],
  ["lst_nfci","msx","listed on MSX","ns"],
  ["lst_amci","msx","listed on MSX","ns"],
  ["lst_mfci","msx","listed on MSX","ns"],
  ["lst_ngci","msx","listed on MSX","ns"],
  ["lst_ochl","msx","listed on MSX","ns"],
  ["lst_oab","msx","listed on MSX","ns"],
  ["lst_oric","msx","listed on MSX","ns"],
  ["lst_omif","msx","listed on MSX","ns"],
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
  alhadhrami_pdo:["Aflah Al Hadhrami"],
  almusalmi_cbo:["Ahmed Al Musalmi"],
};
