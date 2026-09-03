/* ================================================================
   BAHRAIN POWER NETWORK — DATASET (V1 backbone)
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
  {id:"bhgov",     n:"Royal Court of Bahrain (Al Khalifa)", s:"gov", t:0, p:100, short:"Royal Court"},
  {id:"cabinet_bh", n:"Cabinet of Bahrain",           s:"gov", t:0, p:90, short:"Cabinet"},
  {id:"mofin_bh",  n:"Ministry of Finance & National Economy", s:"gov", t:1, p:82, short:"MoF"},
  {id:"mofa_bh",   n:"Ministry of Foreign Affairs",   s:"gov", t:1, p:78, short:"MoFA"},
  {id:"cbb",       n:"Central Bank of Bahrain",       s:"finance", t:1, p:80, short:"CBB"},
  {id:"edb",       n:"Bahrain Economic Development Board", s:"gov", t:1, p:76, short:"EDB"},
  {id:"mumtalakat", n:"Mumtalakat (sovereign fund)",  s:"sovereign", t:1, p:84, short:"Mumtalakat"},
  {id:"bapco",     n:"Bapco Energies",                s:"energy", t:1, p:78, short:"Bapco"},
  {id:"alba",      n:"Aluminium Bahrain (Alba)",      s:"materials", t:1, p:72, short:"Alba"},
  {id:"beyon",     n:"Beyon (Batelco Group)",         s:"comm", t:1, p:70, short:"Beyon"},
  {id:"gulfair",   n:"Gulf Air Group",                s:"industry", t:1, p:70, short:"Gulf Air"},
  {id:"investcorp", n:"Investcorp",                   s:"finance", t:1, p:76, short:"Investcorp"},
  {id:"gfh",       n:"GFH Financial Group",           s:"finance", t:2, p:64, short:"GFH"},
  {id:"abc",       n:"Bank ABC",                      s:"finance", t:2, p:64, short:"Bank ABC"},
  {id:"nbb",       n:"National Bank of Bahrain",      s:"finance", t:2, p:64, short:"NBB"},
  {id:"bic",       n:"Bahrain International Circuit (F1)", s:"consumer_disc", t:2, p:64, short:"BIC"},
  {id:"bfb",       n:"Bahrain FinTech Bay",           s:"tech", t:2, p:56, short:"FinTech Bay"},
  {id:"bhb",       n:"Bahrain Bourse",                s:"finance", t:2, p:64, short:"Bahrain Bourse"},
  {id:"bmmi",      n:"BMMI Group",                    s:"consumer_stap", t:2, p:58, short:"BMMI"},
  {id:"amh",       n:"American Mission Hospital",     s:"health", t:2, p:56, short:"AMH"},
  {id:"ewa_bh",    n:"Electricity & Water Authority", s:"utilities", t:1, p:66, short:"EWA"},
  {id:"edamah",    n:"Edamah (Bahrain Real Estate)",  s:"realestate", t:2, p:60, short:"Edamah"},
  {id:"kanoo",     n:"Yusuf bin Ahmed Kanoo Group",   s:"conglomerate", t:3, p:64, short:"Kanoo"},
  {id:"alzayani",  n:"Al Zayani Investments",         s:"conglomerate", t:3, p:60, short:"Al Zayani"},
  {id:"fakhro",    n:"Fakhro Group",                  s:"conglomerate", t:3, p:56, short:"Fakhro"},
  {id:"lst_kfh", n:"Kuwait Finance House K.S.C.P.", s:"finance", t:2, p:50, short:"KFH"},
  {id:"lst_albh", n:"Aluminium Bahrain B.S.C.", s:"materials", t:2, p:50, short:"ALBH"},
  {id:"lst_bbk", n:"Bank of Bahrain and Kuwait B.S.C.", s:"finance", t:2, p:50, short:"BBK"},
  {id:"lst_salam", n:"Al Salam Bank B.S.C.", s:"finance", t:2, p:50, short:"Al Salam Bank B.S.C."},
  {id:"lst_ugh", n:"United Gulf Holding Company B.S.C.", s:"finance", t:2, p:50, short:"UGH"},
  {id:"lst_ghg", n:"Gulf Hotels Group B.S.C.", s:"consumer_disc", t:2, p:50, short:"GHG"},
  {id:"lst_apmtb", n:"APM Terminals Bahrain B.S.C.", s:"industry", t:2, p:50, short:"APMTB"},
  {id:"lst_khaleeji", n:"Khaleeji Bank B.S.C.", s:"finance", t:2, p:50, short:"Khaleeji Bank B.S.C."},
  {id:"lst_bisb", n:"Bahrain Islamic Bank B.S.C.", s:"finance", t:2, p:50, short:"BISB"},
  {id:"lst_arig", n:"Arab Insurance Group B.S.C.", s:"finance", t:2, p:50, short:"ARIG"},
  {id:"lst_solid", n:"Solidarity Bahrain B.S.C.", s:"finance", t:2, p:50, short:"SOLID"},
  {id:"lst_bkic", n:"Bahrain Kuwait Insurance Company B.S.C.", s:"finance", t:2, p:50, short:"BKIC"},
  {id:"lst_bnh", n:"Bahrain National Holding Company B.S.C.", s:"finance", t:2, p:50, short:"BNH"},
  {id:"lst_seef", n:"Seef Properties B.S.C.", s:"realestate", t:2, p:50, short:"SEEF"},
  {id:"lst_dutyf", n:"Bahrain Duty Free Shop Complex B.S.C.", s:"consumer_disc", t:2, p:50, short:"DUTYF"},
  {id:"lst_bcfc", n:"Bahrain Commercial Facilities Company B.S.C.", s:"finance", t:2, p:50, short:"BCFC"},
  {id:"lst_zainbh", n:"Zain Bahrain B.S.C.", s:"comm", t:2, p:50, short:"Zain Bahrain B.S.C."},
  {id:"lst_inovest", n:"Inovest B.S.C.", s:"finance", t:2, p:50, short:"Inovest B.S.C."},
  {id:"lst_esterad", n:"Esterad Investment Company B.S.C.", s:"finance", t:2, p:50, short:"ESTERAD"},
  {id:"lst_nhotel", n:"National Hotels Company B.S.C.", s:"consumer_disc", t:2, p:50, short:"NHOTEL"},
  {id:"lst_ithmr", n:"Ithmaar Holding B.S.C.", s:"finance", t:2, p:50, short:"ITHMR"},
  {id:"lst_basrec", n:"The Bahrain Ship Repairing and Engineering Company B.S.C.", s:"industry", t:2, p:50, short:"BASREC"},
  {id:"lst_trafco", n:"Trafco Group B.S.C.", s:"consumer_stap", t:2, p:50, short:"Trafco Group B.S.C."},
  {id:"lst_cpark", n:"Bahrain Car Parks Company (Amakin) B.S.C.", s:"industry", t:2, p:50, short:"CPARK"},
  {id:"lst_cineco", n:"Bahrain Cinema Company B.S.C.", s:"consumer_disc", t:2, p:50, short:"CINECO"},
  {id:"lst_bfm", n:"Bahrain Flour Mills Company B.S.C.", s:"consumer_stap", t:2, p:50, short:"BFM"},
  {id:"lst_silah", n:"Silah Gulf B.S.C. Closed", s:"industry", t:2, p:50, short:"SILAH"},
  {id:"lst_ugic", n:"United Gulf Investment Corporation B.S.C.", s:"finance", t:2, p:50, short:"UGIC"},
  {id:"lst_poltry", n:"Delmon Poultry Company B.S.C.", s:"consumer_stap", t:2, p:50, short:"POLTRY"},
  {id:"lst_family", n:"Bahrain Family Leisure Company B.S.C.", s:"consumer_disc", t:2, p:50, short:"FAMILY"},
  {id:"lst_nass", n:"Nass Corporation B.S.C.", s:"industry", t:2, p:50, short:"NASS"},
  {id:"lst_ebrit", n:"Eskan Bank Realty Income Trust", s:"realestate", t:2, p:50, short:"EBRIT"},
  {id:"lst_abraaj", n:"Al Abraaj Restaurants Group B.S.C.", s:"consumer_disc", t:2, p:50, short:"ABRAAJ"},
  {id:"lst_barka", n:"Al Baraka Banking Group B.S.C.", s:"finance", t:2, p:50, short:"BARKA"},
];

const PEOPLE = [
  {id:"kinghamad", n:"King Hamad bin Isa Al Khalifa", t:0, p:100, s:"gov", roles:[
    ["bhgov","King of Bahrain","political","v"]]},
  {id:"salman_cp", n:"Crown Prince Salman bin Hamad Al Khalifa", t:0, p:96, s:"gov", roles:[
    ["bhgov","Crown Prince","political","v"],
    ["cabinet_bh","Prime Minister","political","v"],
    ["mumtalakat","Chairman","board","ns"]],
    note:"Runs the government and the economic reform program; the operational center of the state."},
  {id:"nasser_bh", n:"Sheikh Nasser bin Hamad Al Khalifa", t:0, p:78, s:"energy", roles:[
    ["bhgov","National Security Adviser (royal portfolios)","political","ns"],
    ["bapco","Chairman","board","ns"]]},
  {id:"khalid_bh", n:"Sheikh Khalid bin Hamad Al Khalifa", t:0, p:70, s:"consumer_disc", roles:[
    ["bhgov","First Deputy President, Supreme Council for Youth & Sports","government","ns"]]},
  {id:"salman_khalifa_fin", n:"Sheikh Salman bin Khalifa Al Khalifa", t:1, p:82, s:"finance", roles:[
    ["mofin_bh","Minister of Finance & National Economy","political","v"]]},
  {id:"zayani_fm", n:"Dr. Abdullatif bin Rashid Al Zayani", t:1, p:78, s:"gov", roles:[
    ["mofa_bh","Minister of Foreign Affairs","political","v"]]},
  {id:"humaidan", n:"Khalid Humaidan", t:1, p:76, s:"finance", roles:[
    ["cbb","Governor","executive","v"]]},
  {id:"noor", n:"Noor bint Ali Alkhulaif", t:1, p:74, s:"gov", roles:[
    ["cabinet_bh","Minister of Sustainable Development","political","v"],
    ["edb","Chief Executive","executive","v"]]},
  {id:"alardhi", n:"Mohammed Alardhi", t:1, p:76, s:"finance", roles:[
    ["investcorp","Executive Chairman","executive","v"]],
    note:"Omani ex-air force chief running the Gulf's best-known alternative asset manager from Bahrain."},
  {id:"baqali", n:"Ali Al Baqali", t:2, p:64, s:"materials", roles:[
    ["alba","CEO","executive","v"]]},
  {id:"salman_isa_bic", n:"Sheikh Salman bin Isa Al Khalifa", t:2, p:62, s:"consumer_disc", roles:[
    ["bic","CEO","executive","ns"]]},
  {id:"fawzi_kanoo", n:"Fawzi Ahmed Kanoo", t:2, p:60, s:"conglomerate", roles:[
    ["kanoo","Deputy Chairman","board","ns"]]},
  {id:"kvalseth", n:"Andrew Kvålseth", t:2, p:68, s:"comm", roles:[
    ["beyon","Chief Executive Officer","executive","v"]]},
  {id:"gauss_gulfair", n:"Martin Gauss", t:2, p:66, s:"industry", roles:[
    ["gulfair","Group Chief Executive Officer","executive","v"]]},
  {id:"kamal_ewa", n:"Eng. Kamal bin Ahmed Mohammed", t:1, p:74, s:"utilities", roles:[
    ["ewa_bh","President","executive","v"]]},
  {id:"alrayes_gfh", n:"Hisham Ahmed Al-Rayes", t:2, p:68, s:"finance", roles:[
    ["gfh","Group Chief Executive Officer","executive","v"]]},
  {id:"jennings_abc", n:"Paul Jennings", t:2, p:66, s:"finance", roles:[
    ["abc","Group Chief Executive Officer","executive","v"]]},
  {id:"usman_nbb", n:"Usman Ahmed", t:2, p:68, s:"finance", roles:[
    ["nbb","Group Chief Executive Officer","executive","v"]]},
  {id:"almajed_edamah", n:"Khaled Abdulrahman Al Majed", t:2, p:60, s:"realestate", roles:[
    ["edamah","Chief Executive Officer","executive","v"]]},
];

const OWNERSHIP = [
  ["cabinet_bh","bhgov","governs under"],
  ["mofin_bh","cabinet_bh"],["mofa_bh","cabinet_bh"],
  ["cbb","bhgov"],["edb","bhgov"],
  ["mumtalakat","bhgov","sovereign fund"],
  ["bapco","bhgov","state energy holding","ns"],
  ["alba","mumtalakat","majority","ns"],
  ["beyon","mumtalakat","anchor shareholder","ns"],
  ["gulfair","bhgov","state owner"],
  ["nbb","mumtalakat","anchor shareholder","ns"],
  ["bic","bhgov"],
  ["bfb","edb","backed by","ns"],
  ["ewa_bh","bhgov"],
  ["edamah","mumtalakat"],
  ["bhb","bhgov","state-owned exchange","ns"],
  ["lst_kfh","bhb","listed on Bahrain Bourse","ns"],
  ["lst_albh","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bbk","bhb","listed on Bahrain Bourse","ns"],
  ["lst_salam","bhb","listed on Bahrain Bourse","ns"],
  ["lst_ugh","bhb","listed on Bahrain Bourse","ns"],
  ["lst_ghg","bhb","listed on Bahrain Bourse","ns"],
  ["lst_apmtb","bhb","listed on Bahrain Bourse","ns"],
  ["lst_khaleeji","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bisb","bhb","listed on Bahrain Bourse","ns"],
  ["lst_arig","bhb","listed on Bahrain Bourse","ns"],
  ["lst_solid","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bkic","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bnh","bhb","listed on Bahrain Bourse","ns"],
  ["lst_seef","bhb","listed on Bahrain Bourse","ns"],
  ["lst_dutyf","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bcfc","bhb","listed on Bahrain Bourse","ns"],
  ["lst_zainbh","bhb","listed on Bahrain Bourse","ns"],
  ["lst_inovest","bhb","listed on Bahrain Bourse","ns"],
  ["lst_esterad","bhb","listed on Bahrain Bourse","ns"],
  ["lst_nhotel","bhb","listed on Bahrain Bourse","ns"],
  ["lst_ithmr","bhb","listed on Bahrain Bourse","ns"],
  ["lst_basrec","bhb","listed on Bahrain Bourse","ns"],
  ["lst_trafco","bhb","listed on Bahrain Bourse","ns"],
  ["lst_cpark","bhb","listed on Bahrain Bourse","ns"],
  ["lst_cineco","bhb","listed on Bahrain Bourse","ns"],
  ["lst_bfm","bhb","listed on Bahrain Bourse","ns"],
  ["lst_silah","bhb","listed on Bahrain Bourse","ns"],
  ["lst_ugic","bhb","listed on Bahrain Bourse","ns"],
  ["lst_poltry","bhb","listed on Bahrain Bourse","ns"],
  ["lst_family","bhb","listed on Bahrain Bourse","ns"],
  ["lst_nass","bhb","listed on Bahrain Bourse","ns"],
  ["lst_ebrit","bhb","listed on Bahrain Bourse","ns"],
  ["lst_abraaj","bhb","listed on Bahrain Bourse","ns"],
  ["lst_barka","bhb","listed on Bahrain Bourse","ns"],
];

const FAMILY = [
  ["kinghamad","salman_cp","father–son"],
  ["kinghamad","nasser_bh","father–son"],
  ["kinghamad","khalid_bh","father–son"],
  ["salman_cp","nasser_bh","half-brothers"],
];

const AKA = {
  kinghamad:["King Hamad"],
  salman_cp:["Salman bin Hamad","Crown Prince Salman"],
  mumtalakat:["Mumtalakat"],
  investcorp:["Investcorp"],
  beyon:["Batelco"],
  kvalseth:["Andrew Kvalseth"],
  kamal_ewa:["Kamal bin Ahmed"],
  jennings_abc:["Paul Jennings"],
};
