/* ================================================================
   NORTHERN EMIRATES POWER NETWORK — Sharjah · RAK · Fujairah · Ajman · UAQ
   V1 backbone. "v" established public fact · "ns" needs source check.
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
  {id:"shjgov",   n:"Government of Sharjah",         s:"gov", t:0, p:100, short:"Sharjah Gov"},
  {id:"rakgov",   n:"Government of Ras Al Khaimah",  s:"gov", t:0, p:92,  short:"RAK Gov"},
  {id:"fujgov",   n:"Government of Fujairah",        s:"gov", t:0, p:84,  short:"Fujairah Gov"},
  {id:"ajmgov",   n:"Government of Ajman",           s:"gov", t:0, p:80,  short:"Ajman Gov"},
  {id:"uaqgov",   n:"Government of Umm Al Quwain",   s:"gov", t:0, p:76,  short:"UAQ Gov"},
  {id:"shurooq",  n:"Shurooq (Sharjah Investment & Development)", s:"sovereign", t:1, p:74, short:"Shurooq"},
  {id:"beeah",    n:"BEEAH Group",                   s:"industry", t:1, p:72, short:"BEEAH"},
  {id:"airarabia", n:"Air Arabia",                   s:"industry", t:1, p:76, short:"Air Arabia"},
  {id:"crescent", n:"Crescent Enterprises",          s:"conglomerate", t:1, p:76, short:"Crescent Ent."},
  {id:"crescentpet", n:"Crescent Petroleum",         s:"energy", t:1, p:76, short:"Crescent Petroleum"},
  {id:"danagas",  n:"Dana Gas",                      s:"energy", t:2, p:66, short:"Dana Gas"},
  {id:"gulftainer", n:"Gulftainer",                  s:"industry", t:2, p:62, short:"Gulftainer"},
  {id:"arada",    n:"Arada",                         s:"realestate", t:2, p:66, short:"Arada"},
  {id:"aus",      n:"American University of Sharjah", s:"education", t:2, p:64, short:"AUS"},
  {id:"sba",      n:"Sharjah Book Authority",        s:"comm", t:2, p:62, short:"Book Authority"},
  {id:"rakceramics", n:"RAK Ceramics",               s:"materials", t:1, p:70, short:"RAK Ceramics"},
  {id:"rakez",    n:"RAKEZ (RAK Economic Zone)",     s:"gov", t:2, p:66, short:"RAKEZ"},
  {id:"marjan",   n:"Marjan (Al Marjan Island)",     s:"realestate", t:2, p:66, short:"Marjan"},
  {id:"wynnmarjan", n:"Wynn Al Marjan Island",       s:"consumer_disc", t:2, p:68, short:"Wynn Al Marjan"},
  {id:"rakbank",  n:"RAKBANK",                       s:"finance", t:2, p:62, short:"RAKBANK"},
  {id:"fujport",  n:"Port of Fujairah",              s:"industry", t:1, p:70, short:"Port of Fujairah"},
  {id:"fujoilzone", n:"Fujairah Oil Industry Zone",  s:"energy", t:2, p:64, short:"Fujairah Oil Zone"},
  {id:"ajmanbank", n:"Ajman Bank",                   s:"finance", t:2, p:56, short:"Ajman Bank"},
  {id:"iffco",    n:"IFFCO Group",                   s:"consumer_stap", t:3, p:66, short:"IFFCO"},
  {id:"thumbay",  n:"Thumbay Group",                 s:"health", t:3, p:60, short:"Thumbay"},
  {id:"srtip",    n:"Sharjah Research Technology & Innovation Park", s:"tech", t:2, p:60, short:"SRTIP"},
  {id:"sewa",     n:"SEWA (Sharjah Electricity, Water & Gas)", s:"utilities", t:1, p:66, short:"SEWA"},
  {id:"shj_execco", n:"Sharjah Executive Council",     s:"gov", t:1, p:78, short:"Shj Exec Council"},
  {id:"rak_execco", n:"Ras Al Khaimah Executive Council", s:"gov", t:1, p:74, short:"RAK Exec Council"},
  {id:"shjpolice", n:"Sharjah Police (General Command)", s:"gov", t:1, p:72, short:"Sharjah Police"},
  {id:"scci",     n:"Sharjah Chamber of Commerce & Industry", s:"gov", t:2, p:66, short:"SCCI"},
  {id:"sedd",     n:"Sharjah Economic Development Department", s:"gov", t:1, p:70, short:"SEDD"},
];

const PEOPLE = [
  {id:"sultan_qasimi", n:"H.H. Sheikh Dr. Sultan bin Muhammad Al Qasimi", t:0, p:100, s:"gov", roles:[
    ["shjgov","Ruler of Sharjah","political","v"],
    ["aus","Founder & President","board","v"]],
    note:"Ruler since 1972 — the intellectual of the UAE ruling houses; culture and education define Sharjah's model."},
  {id:"sultan_ahmed_q", n:"H.H. Sheikh Sultan bin Ahmed Al Qasimi", t:0, p:84, s:"gov", roles:[
    ["shjgov","Deputy Ruler of Sharjah","political","v"],
    ["arada","Co-founder & Chairman","board","ns"]]},
  {id:"sultan_mbs_qasimi", n:"H.H. Sheikh Sultan bin Mohammed bin Sultan Al Qasimi", t:0, p:90, s:"gov", roles:[
    ["shjgov","Crown Prince & Deputy Ruler of Sharjah","political","v"],
    ["shj_execco","Chairman","political","v"]],
    note:"Grandson of the Ruler; runs day-to-day government execution across Sharjah's departments."},
  {id:"bodour", n:"H.H. Sheikha Bodour Al Qasimi", t:0, p:82, s:"comm", roles:[
    ["sba","Chairperson","board","v"],
    ["shurooq","Chairperson","board","ns"]],
    note:"The Ruler's daughter; publishing, investment and development portfolios."},
  {id:"saud_saqr", n:"H.H. Sheikh Saud bin Saqr Al Qasimi", t:0, p:92, s:"gov", roles:[
    ["rakgov","Ruler of Ras Al Khaimah","political","v"]],
    note:"Turned RAK into a tourism/industry story — capped by the Wynn casino-resort bet."},
  {id:"mohammed_saud_rak", n:"H.H. Sheikh Mohammed bin Saud Al Qasimi", t:0, p:78, s:"gov", roles:[
    ["rakgov","Crown Prince of RAK","political","v"],
    ["rak_execco","Chairman","political","v"]]},
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
  {id:"adel_ali", n:"Adel Al Ali", t:2, p:76, s:"industry", roles:[
    ["airarabia","Group CEO","executive","v"]]},
  {id:"huraimel", n:"Khaled Al Huraimel", t:2, p:70, s:"industry", roles:[
    ["beeah","Group CEO","executive","v"]]},
  {id:"massaad", n:"Abdallah Massaad", t:2, p:66, s:"materials", roles:[
    ["rakceramics","Group CEO","executive","v"]]},
  {id:"jallad", n:"Ramy Jallad", t:2, p:60, s:"gov", roles:[
    ["rakez","Group CEO","executive","ns"]]},
  {id:"qaseer", n:"Ahmed Obaid Al Qaseer", t:2, p:60, s:"sovereign", roles:[
    ["shurooq","CEO","executive","ns"]]},
  {id:"mousa_murad", n:"Capt. Mousa Murad", t:2, p:62, s:"industry", roles:[
    ["fujport","General Manager","executive","ns"]]},
  {id:"abdouli_marjan", n:"Arch. Abdulla Al Abdouli", t:2, p:66, s:"realestate", roles:[
    ["marjan","Group Chief Executive Officer","executive","v"]]},
  {id:"tappeiner_wynn", n:"Max Tappeiner", t:2, p:64, s:"consumer_disc", roles:[
    ["wynnmarjan","President","executive","v"]]},
  {id:"raheel_rakbank", n:"Raheel Ahmed", t:2, p:62, s:"finance", roles:[
    ["rakbank","Group CEO","executive","v"]]},
  {id:"alhamoudi_foiz", n:"Capt. Salem Al Hamoudi", t:2, p:60, s:"energy", roles:[
    ["fujoilzone","Director","executive","v"]]},
  {id:"alsuwaidi_sewa", n:"Saeed Sultan Al Suwaidi", t:2, p:64, s:"utilities", roles:[
    ["sewa","Chairman","board","v"]]},
  {id:"abdullah_mubarak_sp", n:"Lt. Gen. Abdullah Mubarak bin Amer", t:1, p:72, s:"gov", roles:[
    ["shjpolice","Commander-in-Chief","government","v"]]},
  {id:"alowais_scci", n:"Abdallah Sultan Al Owais", t:1, p:66, s:"gov", roles:[
    ["scci","Chairman","board","v"]]},
  {id:"almahmoud_sedd", n:"Hamad Ali Abdalla Al Mahmoud", t:1, p:68, s:"gov", roles:[
    ["sedd","Chairman","government","v"]]},
  {id:"neeraj_agrawal", n:"Neeraj Agrawal", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Executive Director","executive","v"],
    ["crescentpet","Chief Financial Officer","executive","v"]]},
  {id:"ravi_kumar", n:"Ravi Kumar", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Executive Director","executive","v"],
    ["crescentpet","Chief Corporate Officer","executive","v"]]},
  {id:"tushar_singhvi", n:"Tushar Singhvi", t:2, p:60, s:"conglomerate", roles:[
    ["crescent","Deputy CEO & Head of Investments","executive","v"]]},
  {id:"ghada_abdelkader", n:"Ghada Abdelkader", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Senior VP, CE-Invests","executive","v"]]},
  {id:"sudarshan_pareek", n:"Sudarshan Pareek", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Senior VP, CE-Ventures","executive","v"]]},
  {id:"rakhil_fernando", n:"Rakhil Fernando", t:2, p:46, s:"conglomerate", roles:[
    ["crescent","Head of CE-Creates","executive","v"]]},
  {id:"charlie_scott", n:"Charlie Scott", t:2, p:46, s:"conglomerate", roles:[
    ["crescent","Head of Communications","executive","v"]]},
  {id:"emma_dickie", n:"Emma Dickie", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Legal Director","executive","v"]]},
  {id:"marc_choufani", n:"Marc Choufani", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","CEO, Microbiome Health Centre","executive","v"]]},
  {id:"johan_surani", n:"Johan Surani", t:2, p:58, s:"conglomerate", roles:[
    ["crescent","Director, CE-Operates","executive","v"]]},
  {id:"razan_jafar", n:"Razan Jafar", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Director","executive","v"]]},
  {id:"abdulla_al_qadi", n:"Abdulla Al-Qadi", t:2, p:62, s:"energy", roles:[
    ["crescentpet","Country Chair, Iraq & MD, Diyala & Basra; Executive Director, Business Development","executive","v"]]},
  {id:"mohammad_e_makkawi", n:"Mohammad E. Makkawi", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Executive Director, Projects","executive","v"]]},
  {id:"drazen_petkovich", n:"Drazen Petkovich", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Executive Director, Legal","executive","v"]]},
  {id:"thomas_s_watts", n:"Thomas S. Watts", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Executive Director, Projects","executive","v"]]},
  {id:"narik_basmajian", n:"Narik Basmajian", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Executive Director, Projects & Commercial","executive","v"]]},
  {id:"nicholas_whiteley", n:"Nicholas Whiteley", t:2, p:58, s:"energy", roles:[
    ["crescentpet","Executive Director, Upstream","executive","v"]]},
  {id:"sheikh_abdullah_bin", n:"Sheikh Abdullah Bin Mohamed Al Thani", t:2, p:62, s:"industry", roles:[
    ["airarabia","Chairman","board","v"]]},
  {id:"sheikh_mohammed_bin", n:"Sheikh Mohammed Bin Abdullah Al Thani", t:2, p:52, s:"industry", roles:[
    ["airarabia","Board Member","board","v"]]},
  {id:"sheikh_khalid_bin", n:"Sheikh Khalid Bin Issam Al Qassimi", t:2, p:52, s:"industry", roles:[
    ["airarabia","Independent Director","board","v"]]},
  {id:"waleed_al_sayegh", n:"Waleed Al Sayegh", t:2, p:52, s:"industry", roles:[
    ["airarabia","Independent Member","board","v"]]},
  {id:"matar_al_blooshi", n:"Matar Al Blooshi", t:2, p:52, s:"industry", roles:[
    ["airarabia","Independent Member","board","v"]]},
  {id:"dr_ohoud_shehail", n:"Dr. Ohoud Shehail", t:2, p:52, s:"industry", roles:[
    ["airarabia","Independent Member","board","v"]]},
  {id:"mohamed_omran_alshamsi", n:"Mohamed Omran Alshamsi", t:2, p:62, s:"finance", roles:[
    ["rakbank","Chairman","board","v"]]},
  {id:"h_h_shaikha", n:"H.H. Shaikha Amneh Al Qasimi", t:2, p:62, s:"finance", roles:[
    ["rakbank","Vice Chair","board","v"]]},
  {id:"salem_ali_al", n:"Salem Ali Al Sharhan", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"stephen_monaghan", n:"Stephen Monaghan", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"jonathan_edward_morris", n:"Jonathan Edward Morris", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"abhijit_choudhury", n:"Abhijit Choudhury", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"debra_ward", n:"Debra Ward", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"mohammed_abdulrahman_aljalla", n:"Mohammed Abdulrahman Aljallaf", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"sheikh_abdulla_khalid", n:"Sheikh Abdulla Khalid Al Qassimi", t:2, p:52, s:"finance", roles:[
    ["rakbank","Board Member","board","v"]]},
  {id:"jaffer_nini", n:"Jaffer Nini", t:2, p:58, s:"finance", roles:[
    ["rakbank","Chief Financial Officer","executive","v"]]},
  {id:"mridul_baberwal", n:"Mridul Baberwal", t:2, p:58, s:"finance", roles:[
    ["rakbank","Deputy Chief Financial Officer","executive","v"]]},
  {id:"michael_power", n:"Michael Power", t:2, p:58, s:"finance", roles:[
    ["rakbank","Chief Operating Officer","executive","v"]]},
  {id:"saket_saith", n:"Saket Saith", t:2, p:58, s:"finance", roles:[
    ["rakbank","Chief Technology & Data Officer","executive","v"]]},
  {id:"nizar_luqman", n:"Nizar Luqman", t:2, p:58, s:"finance", roles:[
    ["rakbank","Group Chief Audit Officer","executive","v"]]},
  {id:"hh_sheikha_jawaher", n:"HH Sheikha Jawaher Bint Mohammed Al Qasimi", t:2, p:62, s:"industry", roles:[
    ["beeah","Chairperson of the Board of Directors","board","v"]]},
  {id:"obaid_saeed_al", n:"Obaid Saeed Al Tunaiji", t:2, p:62, s:"industry", roles:[
    ["beeah","Second Vice-Chairman","board","v"]]},
  {id:"khalifa_al_suwaidi", n:"Khalifa Al Suwaidi", t:2, p:52, s:"industry", roles:[
    ["beeah","Board Member","board","v"]]},
  {id:"sara_al_nuaimi", n:"Sara Al Nuaimi", t:2, p:52, s:"industry", roles:[
    ["beeah","Board Member","board","v"]]},
  {id:"fahad_shehail", n:"Fahad Shehail", t:2, p:60, s:"industry", roles:[
    ["beeah","CEO - Environment","executive","v"]]},
  {id:"zouheir_sabra", n:"Zouheir Sabra", t:2, p:60, s:"industry", roles:[
    ["beeah","CEO - Capital","executive","v"]]},
  {id:"nada_taryam", n:"Nada Taryam", t:2, p:60, s:"industry", roles:[
    ["beeah","CEO - Real Estate","executive","v"]]},
  {id:"hind_al_huwaidi", n:"Hind Al Huwaidi", t:2, p:60, s:"industry", roles:[
    ["beeah","Chief Executive Development Officer","executive","v"]]},
  {id:"firas_wahbeh", n:"Firas Wahbeh", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Brand Officer","executive","v"]]},
  {id:"rafael_sanjurjo_lopez", n:"Rafael Sanjurjo Lopez", t:2, p:58, s:"industry", roles:[
    ["beeah","CEO, Waste Collection & City Cleaning","executive","v"]]},
  {id:"daker_rabaya", n:"Daker Rabaya", t:2, p:58, s:"industry", roles:[
    ["beeah","CEO, Waste Processing & Recycling","executive","v"]]},
  {id:"mohamed_al_hosani", n:"Mohamed Al Hosani", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Sustainability Officer","executive","v"]]},
  {id:"fadi_sidani", n:"Fadi Sidani", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Governance Officer","executive","v"]]},
  {id:"shaun_johnson", n:"Shaun Johnson", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Legal Officer","executive","v"]]},
  {id:"usman_tareen", n:"Usman Tareen", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Financial Officer","executive","v"]]},
  {id:"azza_salem_al", n:"Azza Salem Al Qaseer", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Marketing Officer","executive","v"]]},
  {id:"nasir_al_shamsi", n:"Nasir Al Shamsi", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Transport Officer","executive","v"]]},
  {id:"mostafa_hassan", n:"Mostafa Hassan", t:2, p:58, s:"industry", roles:[
    ["beeah","Chief Audit Officer","executive","v"]]},
  {id:"hrh_prince_khaled", n:"HRH Prince Khaled bin Alwaleed bin Talal", t:2, p:62, s:"realestate", roles:[
    ["arada","Executive Vice Chairman","board","v"]]},
  {id:"ahmed_alkhoshaibi", n:"Ahmed Alkhoshaibi", t:2, p:60, s:"realestate", roles:[
    ["arada","Group Chief Executive Officer","executive","v"]]},
  {id:"shimmy_mathew", n:"Shimmy Mathew", t:2, p:58, s:"realestate", roles:[
    ["arada","Group Chief Financial Officer","executive","v"]]},
  {id:"michelle_hancic", n:"Michelle Hancic", t:2, p:58, s:"realestate", roles:[
    ["arada","Group Chief People Officer","executive","v"]]},
  {id:"frank_durrell", n:"Frank Durrell", t:2, p:58, s:"realestate", roles:[
    ["arada","Group Chief Marketing Officer","executive","v"]]},
  {id:"elie_mrad", n:"Elie Mrad", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Architectural Officer","executive","v"]]},
  {id:"amit_arora", n:"Amit Arora", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Operating Officer - Hospitality and Entertainment","executive","v"]]},
  {id:"edward_attwood", n:"Edward Attwood", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Communications Officer","executive","v"]]},
  {id:"sameer_kulkarni", n:"Sameer Kulkarni", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Community Officer","executive","v"]]},
  {id:"mayank_bhargava", n:"Mayank Bhargava", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Information Officer","executive","v"]]},
  {id:"farhan_kafil", n:"Farhan Kafil", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Commercial Officer","executive","v"]]},
  {id:"rana_mattar", n:"Rana Mattar", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Legal Officer","executive","v"]]},
  {id:"rosa_piro", n:"Rosa Piro", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Investment Officer","executive","v"]]},
  {id:"atul_goel", n:"Atul Goel", t:2, p:58, s:"realestate", roles:[
    ["arada","Chief Capital Officer","executive","v"]]},
  {id:"moustafa_fahour_oam", n:"Moustafa Fahour OAM", t:2, p:60, s:"realestate", roles:[
    ["arada","CEO and Managing Director, Arada Capital","executive","v"]]},
  {id:"feras_al_naimi", n:"Feras Al Naimi", t:2, p:60, s:"realestate", roles:[
    ["arada","Chief Executive Officer - Nexus","executive","v"]]},
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
  ["srtip","shjgov"],
  ["sewa","shjgov"],
  ["shj_execco","shjgov","executive arm of"],
  ["rak_execco","rakgov","executive arm of"],
  ["shjpolice","shj_execco","reports to"],
  ["sedd","shj_execco","reports to"],
  ["scci","shjgov"],
];

const FAMILY = [
  ["sultan_qasimi","bodour","father–daughter"],
  ["sultan_qasimi","sultan_ahmed_q","kin (Al Qasimi)"],
  ["sultan_qasimi","sultan_mbs_qasimi","grandfather–grandson"],
  ["saud_saqr","mohammed_saud_rak","father–son"],
  ["hamad_sharqi","mohammed_sharqi","father–son"],
  ["humaid_nuaimi","ammar_nuaimi","father–son"],
  ["badr_jafar","majid_jafar","brothers"],
];

const AKA = {
  sultan_qasimi:["Sultan Al Qasimi","Sultan bin Muhammad"],
  sultan_mbs_qasimi:["Sultan bin Mohammed bin Sultan","Crown Prince of Sharjah"],
  saud_saqr:["Saud bin Saqr"],
  shj_execco:["Sharjah Executive Council"],
  rak_execco:["RAK Executive Council","Ras Al Khaimah Executive Council"],
  scci:["Sharjah Chamber of Commerce and Industry"],
  sedd:["Sharjah Economic Development Department"],
  badr_jafar:["Badr Jafar"],
  majid_jafar:["Majid Jafar"],
  beeah:["Bee'ah"],
  airarabia:["Air Arabia"],
  wynnmarjan:["Wynn Al Marjan","Wynn Resorts"],
  marjan:["Marjan Group","Al Marjan Island"],
  rakbank:["RAKBANK"],
  sewa:["SEWA"],
  abdouli_marjan:["Abdulla Al Abdouli"],
  tappeiner_wynn:["Max Tappeiner"],
};
