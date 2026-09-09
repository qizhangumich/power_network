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
  {id:"moi_bh",    n:"Ministry of Interior",          s:"gov", t:1, p:82, short:"MoI"},
  {id:"moic_bh",   n:"Ministry of Industry & Commerce", s:"gov", t:1, p:74, short:"MoIC"},
  {id:"mtt_bh",    n:"Ministry of Transportation & Telecommunications", s:"gov", t:1, p:70, short:"MTT"},
  {id:"moo_bh",    n:"Ministry of Oil & Environment",  s:"energy", t:1, p:76, short:"MoO"},
  {id:"moh_bh",    n:"Ministry of Housing & Urban Planning", s:"gov", t:1, p:66, short:"MoH"},
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

  // ===== ADDED SEP 2026 — KEY MINISTRIES PREVIOUSLY MISSING FROM THE MAP =====
  {id:"rashid_moi_bh", n:"Lt. Gen. Sheikh Rashid bin Abdullah Al Khalifa", t:0, p:84, s:"gov", roles:[
    ["moi_bh","Minister of Interior","political","v"]],
    note:"Minister of Interior since 2004 — one of Bahrain's longest-serving ministers."},
  {id:"fakhro_moic", n:"H.E. Abdulla bin Adel Fakhro", t:1, p:70, s:"gov", roles:[
    ["moic_bh","Minister of Industry & Commerce","political","v"]],
    note:"In office since November 2022; from the Fakhro business family (McDonald's Bahrain franchise, GAC Bahrain)."},
  {id:"abdullah_mtt", n:"H.E. Dr. Shaikh Abdullah bin Ahmed Al Khalifa", t:1, p:70, s:"gov", roles:[
    ["mtt_bh","Minister of Transportation & Telecommunications","political","v"]]},
  {id:"daina_oil", n:"H.E. Dr. Mohamed bin Mubarak bin Daina", t:1, p:74, s:"energy", roles:[
    ["moo_bh","Minister of Oil & Environment","political","v"]],
    note:"Also holds the title Special Envoy for Climate Affairs; Bahrain's lead voice at COP and other climate forums."},
  {id:"alromaihi_housing", n:"H.E. Aminah bint Ahmad Al Romaihi", t:1, p:64, s:"realestate", roles:[
    ["moh_bh","Minister of Housing & Urban Planning","political","v"]]},
  {id:"naji_mohamed_issa", n:"Naji Mohamed Issa Belgasem", t:2, p:62, s:"finance", roles:[
    ["abc","Chairman","board","v"]]},
  {id:"abdulaziz_fahad_alhudaibh", n:"Abdulaziz Fahad Alhudaibh", t:2, p:62, s:"finance", roles:[
    ["abc","Deputy Chairman","board","v"]]},
  {id:"amer_mohamed_karkar", n:"Amer Mohamed Karkar", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"mohamed_hassadi", n:"Mohamed Hassadi", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"edrees_ahmad", n:"Edrees Ahmad", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"khalil_ibrahim_nooruddin", n:"Khalil Ibrahim Nooruddin", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"dr_marouane_el", n:"Dr. Marouane El Abassi", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"dr_ibrahim_eldanfour", n:"Dr. Ibrahim Eldanfour", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"manaf_abdulaziz_al", n:"Manaf Abdulaziz Al Hajiri", t:2, p:52, s:"finance", roles:[
    ["abc","Board Member","board","v"]]},
  {id:"brendon_hopkins", n:"Brendon Hopkins", t:2, p:58, s:"finance", roles:[
    ["abc","Acting Group Chief Executive Officer","executive","ns"]]},
  {id:"hala_ali_husain", n:"Hala Ali Husain Yateem", t:2, p:62, s:"finance", roles:[
    ["nbb","Chairwoman","board","v"]]},
  {id:"yusuf_abdulla_yusuf", n:"Yusuf Abdulla Yusuf Alireza", t:2, p:62, s:"finance", roles:[
    ["nbb","Vice Chairman","board","v"]]},
  {id:"rashed_bin_salman", n:"Rashed Bin Salman Mohamed Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"rishi_kapoor", n:"Rishi Kapoor", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"vincent_van_den", n:"Vincent Van Den Boogert", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"dr_paul_david", n:"Dr. Paul David Pester", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"isa_hasan_maseeh", n:"Isa Hasan Maseeh", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"mohamed_farouk_almoayyed", n:"Mohamed Farouk Almoayyed", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"ahmed_fawzi_kanoo", n:"Ahmed Fawzi Kanoo", t:2, p:52, s:"finance", roles:[
    ["nbb","Board Member","board","v"]]},
  {id:"abdulmohsen_rashed_alrashed", n:"Abdulmohsen Rashed Alrashed", t:2, p:62, s:"finance", roles:[
    ["gfh","Chairman","board","v"]]},
  {id:"ghazi_faisal_ebrahim", n:"Ghazi Faisal Ebrahim Alhajeri", t:2, p:62, s:"finance", roles:[
    ["gfh","Vice Chairman","board","v"]]},
  {id:"ali_murad", n:"Ali Murad", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"abdulla_jehad_alzain", n:"Abdulla Jehad AlZain", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"darwish_abdulla_alketbi", n:"Darwish Abdulla AlKetbi", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"abdulaziz_abdulhamid_albassa", n:"Abdulaziz Abdulhamid AlBassam", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"salah_sharif", n:"Salah Sharif", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief Operating Officer","executive","v"]]},
  {id:"bhaskar_mehta", n:"Bhaskar Mehta", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief Risk Officer and Acting CFO","executive","ns"]]},
  {id:"khalid_al_rumaihi", n:"Khalid Al Rumaihi", t:2, p:62, s:"materials", roles:[
    ["alba","Chairman","board","v"]]},
  {id:"shaikh_isa_bin", n:"Shaikh Isa bin Khalid Al Khalifa", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"tim_murray", n:"Tim Murray", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"roselyne_renel", n:"Roselyne Renel", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"omar_syed", n:"Omar Syed", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"ahmed_al_shaikh", n:"Ahmed Al Shaikh", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"khaled_al_rowais", n:"Khaled Al Rowais", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"rasha_sabkar", n:"Rasha Sabkar", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"hala_abdul_hameed", n:"Hala Abdul Hameed Mufeez", t:2, p:52, s:"materials", roles:[
    ["alba","Board Member","board","v"]]},
  {id:"mark_horncastle", n:"Mark Horncastle", t:2, p:60, s:"finance", roles:[
    ["investcorp","General Counsel (Managing Director)","executive","v"]]},
  {id:"abbas_rizvi", n:"Abbas Rizvi", t:2, p:58, s:"finance", roles:[
    ["investcorp","Group Chief Financial Officer","executive","v"]]},
  {id:"dave_tayeh", n:"Dave Tayeh", t:2, p:58, s:"finance", roles:[
    ["investcorp","Leader - Private Equity","executive","v"]]},
  {id:"herb_myers", n:"Herb Myers", t:2, p:58, s:"finance", roles:[
    ["investcorp","Co-leader - Real Assets","executive","v"]]},
  {id:"mike_o_brien", n:"Mike O'Brien", t:2, p:58, s:"finance", roles:[
    ["investcorp","Co-leader - Real Assets","executive","v"]]},
  {id:"jeremy_ghose", n:"Jeremy Ghose", t:2, p:58, s:"finance", roles:[
    ["investcorp","Leader - Credit","executive","v"]]},
  {id:"yusef_al_yusef", n:"Yusef Al-Yusef", t:2, p:58, s:"finance", roles:[
    ["investcorp","Leader - Global Distribution Platform","executive","v"]]},
  {id:"shaikh_abdulla_bin", n:"Shaikh Abdulla bin Khalifa Al Khalifa", t:2, p:62, s:"comm", roles:[
    ["beyon","Chairman","board","v"],
    ["mumtalakat","Chief Executive Officer","executive","v"]]},
  {id:"shaikh_ali_bin", n:"Shaikh Ali bin Khalifa Al Khalifa", t:2, p:62, s:"comm", roles:[
    ["beyon","Deputy Chairman","board","v"]]},
  {id:"maha_khaled_abdulrahman", n:"Maha Khaled Abdulrahman", t:2, p:52, s:"comm", roles:[
    ["beyon","Independent Non-Executive Director","board","v"]]},
  {id:"fatema_ghazi_alarayedh", n:"Fatema Ghazi Alarayedh", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"brig_gen_waleed", n:"Brig. Gen. Waleed Bin Hindi", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"abdulla_abdulrazaq_bukhowa", n:"Abdulla Abdulrazaq Bukhowa", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"abdulla_ahmed_kamal", n:"Abdulla Ahmed Kamal", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"ahmad_mazhar", n:"Ahmad Mazhar", t:2, p:58, s:"comm", roles:[
    ["beyon","Director","board","v"],
    ["mumtalakat","Executive Director - International Investments","executive","v"]]},
  {id:"sambamurthy_natarajan", n:"Sambamurthy Natarajan", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"saleh_romeih", n:"Saleh Romeih", t:2, p:52, s:"comm", roles:[
    ["beyon","Director","board","v"]]},
  {id:"reem_altajer", n:"Reem Altajer", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Financial Officer","executive","v"]]},
  {id:"maitham_abdulla", n:"Maitham Abdulla", t:2, p:60, s:"comm", roles:[
    ["beyon","CEO - Batelco by Beyon","executive","v"]]},
  {id:"shaikh_mohamed_bin", n:"Shaikh Mohamed bin Khalifa Al Khalifa", t:2, p:60, s:"comm", roles:[
    ["beyon","CEO - Beyon Digital Growth","executive","v"]]},
  {id:"shaikh_bader_bin", n:"Shaikh Bader bin Rashid Al Khalifa", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Communications & Sustainability Officer","executive","v"]]},
  {id:"faisal_al_jalahma", n:"Faisal Al Jalahma", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Human Resources Officer","executive","v"]]},
  {id:"jehan_hasan", n:"Jehan Hasan", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Strategy Officer","executive","v"]]},
  {id:"miguel_angel_fuentes", n:"Miguel-Angel Fuentes", t:2, p:58, s:"comm", roles:[
    ["beyon","General Counsel","executive","v"]]},
  {id:"rashed_mohamed", n:"Rashed Mohamed", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Technology Officer","executive","v"]]},
  {id:"buddhadeb_samanta", n:"Buddhadeb Samanta", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief of Internal Audit","executive","v"]]},
  {id:"shaikh_mohamed_bin_b", n:"Shaikh Mohamed bin Isa Al Khalifa", t:2, p:52, s:"sovereign", roles:[
    ["mumtalakat","Board Member","board","v"]]},
  {id:"hamad_bin_faisal", n:"Hamad bin Faisal Al Malki", t:2, p:52, s:"sovereign", roles:[
    ["mumtalakat","Board Member (Minister of Cabinet Affairs)","board","v"]]},
  {id:"dr_samer_aljishi", n:"Dr. Samer Aljishi", t:2, p:52, s:"sovereign", roles:[
    ["mumtalakat","Board Member","board","v"]]},
  {id:"elham_hasan", n:"Elham Hasan", t:2, p:52, s:"sovereign", roles:[
    ["mumtalakat","Board Member","board","v"]]},
  {id:"khalid_hussain_taqi", n:"Khalid Hussain Taqi", t:2, p:62, s:"sovereign", roles:[
    ["mumtalakat","Managing Director - Local Investments","executive","v"],
    ["gulfair","Chairman","board","v"]]},
  {id:"suha_karzoon", n:"Suha Karzoon", t:2, p:60, s:"sovereign", roles:[
    ["mumtalakat","Managing Director - Finance & Technology","executive","v"]]},
  {id:"marwa_al_saad", n:"Marwa Al Saad", t:2, p:60, s:"sovereign", roles:[
    ["mumtalakat","Managing Director - Human Capital","executive","v"]]},
  {id:"husain_alqaseer", n:"Husain AlQaseer", t:2, p:58, s:"sovereign", roles:[
    ["mumtalakat","Executive Director - Local Investments","executive","v"]]},
  {id:"noor_sharafi", n:"Noor Sharafi", t:2, p:58, s:"sovereign", roles:[
    ["mumtalakat","General Counsel","executive","v"]]},
  {id:"shaikh_fahad_bin", n:"Shaikh Fahad bin Abdulrahman Al Khalifa", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"sara_ahmed_buhiji", n:"Sara Ahmed Buhiji", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"faisal_ali_al", n:"Faisal Ali Al Jalahma", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"alaa_abdulkhaleq_saeed", n:"Alaa Abdulkhaleq Saeed", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"sael_al_waary", n:"Sael Al Waary", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"julia_simpson", n:"Julia Simpson", t:2, p:52, s:"industry", roles:[
    ["gulfair","Board Member","board","v"]]},
  {id:"captain_qasim_albastaki", n:"Captain Qasim AlBastaki", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief Operating Officer","executive","v"]]},
  {id:"mazin_saleh", n:"Mazin Saleh", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief Technical Officer","executive","v"]]},
  {id:"ahmed_naeemi", n:"Ahmed Naeemi", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief Information Officer","executive","v"]]},
  {id:"mohamed_matar", n:"Mohamed Matar", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief People Officer","executive","v"]]},
  {id:"hasan_al_sharaf", n:"Hasan Al Sharaf", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief Financial Officer","executive","v"]]},
  {id:"fahad_almudhahka", n:"Fahad Almudhahka", t:2, p:58, s:"industry", roles:[
    ["gulfair","Chief Corporate Affairs Officer","executive","v"]]},
  {id:"jenan_alaskari", n:"Jenan Alaskari", t:2, p:58, s:"industry", roles:[
    ["gulfair","Senior Vice President - Corporate Communications","executive","v"]]},
  {id:"buthaina_traif", n:"Buthaina Traif", t:2, p:58, s:"industry", roles:[
    ["gulfair","Senior Vice President - Network Strategy & Partnerships","executive","v"]]},
  {id:"renato_juric", n:"Renato Juric", t:2, p:60, s:"consumer_stap", roles:[
    ["bmmi","Chief Executive Officer","executive","v"]]},
  {id:"basel_al_madani", n:"Basel Al Madani", t:2, p:60, s:"consumer_stap", roles:[
    ["bmmi","Deputy Chief Executive Officer","executive","v"]]},
  {id:"masooma_alturkamani", n:"Masooma AlTurkamani", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Head of People","executive","v"]]},
  {id:"vinicius_almeida", n:"Vinicius Almeida", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Head of Supply Chain","executive","v"]]},
  {id:"santosh_kumar", n:"Santosh Kumar", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Head of Finance","executive","v"]]},
  {id:"tariq_jaleel_alsaffar", n:"Tariq Jaleel AlSaffar", t:2, p:62, s:"finance", roles:[
    ["lst_bbk","Chairperson","board","v"]]},
  {id:"aref_haider_rahimi", n:"Aref Haider Rahimi", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"ghaneya_mohsen_alderazi", n:"Ghaneya Mohsen AlDerazi", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"munther_abdulaziz_al", n:"Munther Abdulaziz Al Kooheji", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"mohamed_abdulhakeem_abdulmal", n:"Mohamed Abdulhakeem Abdulmalek", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"khaled_mohamed_alasfour", n:"Khaled Mohamed AlAsfour", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"ghanem_ebrahim_al", n:"Ghanem Ebrahim Al Fodhala", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"nada_waleed_almojil", n:"Nada Waleed AlMojil", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"sara_khalil_nooruddin", n:"Sara Khalil Nooruddin", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"yaser_alsharifi", n:"Yaser Alsharifi", t:2, p:60, s:"finance", roles:[
    ["lst_bbk","Group Chief Executive Officer","executive","v"]]},
  {id:"hassaan_burshaid", n:"Hassaan Burshaid", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Operating Officer","executive","v"]]},
  {id:"mohammed_abdulla_isa", n:"Mohammed Abdulla Isa", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Financial Officer","executive","v"]]},
  {id:"nadeem_al_kooheji", n:"Nadeem Al Kooheji", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Wholesale Banking Officer","executive","v"]]},
  {id:"mohamed_al_rayes", n:"Mohamed Al Rayes", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Treasury and Investments Officer","executive","v"]]},
  {id:"salman_al_hasan", n:"Salman Al Hasan", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief International Banking Officer","executive","v"]]},
  {id:"ahmed_taqi", n:"Ahmed Taqi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Retail Banking Officer","executive","v"]]},
  {id:"aqeel_ghaith", n:"Aqeel Ghaith", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Private Banking Officer","executive","v"]]},
  {id:"sarah_jamal", n:"Sarah Jamal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Human Resources Officer","executive","v"]]},
  {id:"simone_carminati", n:"Simone Carminati", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Corporate and Business Development Officer","executive","v"]]},
  {id:"mohamed_alaali", n:"Mohamed Alaali", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Strategy and Transformation Officer","executive","v"]]},
  {id:"vidhu_mittal", n:"Vidhu Mittal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Information Officer","executive","v"]]},
  {id:"nadeen_al_shirawi", n:"Nadeen Al Shirawi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Compliance Officer and MLRO","executive","v"]]},
  {id:"ebrahim_mashal", n:"Ebrahim Mashal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Risk Officer","executive","v"]]},
  {id:"khaled_al_naser", n:"Khaled Al Naser", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Internal Audit","executive","v"]]},
  {id:"ahmed_a_qudoos", n:"Ahmed A. Qudoos", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Corporate Secretariat","executive","v"]]},
  {id:"salah_al_jassas", n:"Salah Al Jassas", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Remedial Officer","executive","v"]]},
  {id:"layla_radhi", n:"Layla Radhi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Credit Assessment Officer","executive","v"]]},
  {id:"iris_edwards", n:"Iris Edwards", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Legal Counsel","executive","v"]]},
  {id:"nasser_bin_hamad", n:"Nasser bin Hamad Al Khalifa", t:2, p:62, s:"energy", roles:[
    ["bapco","Chairman of the Board of Directors","board","v"]]},
  {id:"salman_bin_khalifa", n:"Salman bin Khalifa Al Khalifa", t:2, p:62, s:"energy", roles:[
    ["bapco","Deputy Chairman","board","v"]]},
  {id:"mohamed_bin_mubarak", n:"Mohamed bin Mubarak Bin Daina", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"khalid_amro_al", n:"Khalid Amro Al Rumaihi", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"faisal_mohamed_al", n:"Faisal Mohamed Al Mahroos", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"robert_warren_dudley", n:"Robert Warren Dudley", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"mark_thomas", n:"Mark Thomas", t:2, p:60, s:"energy", roles:[
    ["bapco","Board Member and Chief Executive Officer","executive","v"]]},
  {id:"anthony_hayward", n:"Anthony Hayward", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"hadyah_mohammed_fathalla", n:"Hadyah Mohammed Fathalla", t:2, p:52, s:"energy", roles:[
    ["bapco","Board Member","board","v"]]},
  {id:"abdul_hussain_bin", n:"Abdul-Hussain Bin Ali Mirza", t:2, p:52, s:"energy", roles:[
    ["bapco","Advisor to the Board","board","v"]]},
  {id:"naji_belgasem", n:"Naji Belgasem", t:2, p:62, s:"finance", roles:[
    ["abc","Chairman, Non-Executive Director, Non Independent","board","v"]]},
  {id:"abdulaziz_alhudaib", n:"Abdulaziz Alhudaib", t:2, p:62, s:"finance", roles:[
    ["abc","Deputy Chairman, Non-Executive Director, Non Independent","board","v"]]},
  {id:"amer_karkar", n:"Amer Karkar", t:2, p:52, s:"finance", roles:[
    ["abc","Director, Non-Executive Director, Non Independent","board","v"]]},
  {id:"manaf_alhajeri", n:"Manaf Alhajeri", t:2, p:52, s:"finance", roles:[
    ["abc","Director, Non-Executive Director, Independent","board","v"]]},
  {id:"abdelkhalig_shaib", n:"Abdelkhalig Shaib", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Legal & Corporate Affairs Officer","executive","v"]]},
  {id:"noor_jamal_alhakam", n:"Noor Jamal AlHakam", t:2, p:58, s:"finance", roles:[
    ["abc","Assistant to Board Secretary","executive","v"]]},
  {id:"paul_henry_jennings", n:"Paul Henry Jennings", t:2, p:60, s:"finance", roles:[
    ["abc","Group Chief Executive Officer","executive","v"]]},
  {id:"gabriel_basbous", n:"Gabriel Basbous", t:2, p:58, s:"finance", roles:[
    ["abc","Board Audit Committee Secretary","executive","v"]]},
  {id:"maadian_botha", n:"Maadian Botha", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Compliance Officer","executive","v"]]},
  {id:"fatema_yusuf", n:"Fatema Yusuf", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Communications and Marketing","executive","v"]]},
  {id:"ameera_almoosa", n:"Ameera AlMoosa", t:2, p:58, s:"finance", roles:[
    ["abc","Digital Communication Coordinator","executive","v"]]},
  {id:"fatima_abdulhakeem_albastaki", n:"Fatima Abdulhakeem AlBastaki", t:2, p:58, s:"finance", roles:[
    ["abc","Deputy Manager - Digital Communications","executive","v"]]},
  {id:"nael_nasr", n:"Nael Nasr", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Integration Management Office","executive","v"]]},
  {id:"sridhar_aiyangar", n:"Sridhar Aiyangar", t:2, p:58, s:"finance", roles:[
    ["abc","Group Head, Balance Sheet & Liquidity Management","executive","v"]]},
  {id:"suresh_padmanabhan", n:"Suresh Padmanabhan", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Group Finance","executive","v"]]},
  {id:"jalila_sayed_adnan", n:"Jalila Sayed Adnan Majed", t:2, p:58, s:"finance", roles:[
    ["abc","AVP, Internal Reporting","executive","v"]]},
  {id:"jayakumar_muthumani", n:"Jayakumar Muthumani", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Group MIS","executive","v"]]},
  {id:"shafeeque_ansari", n:"Shafeeque Ansari", t:2, p:58, s:"finance", roles:[
    ["abc","AVP, Regulatory Reporting","executive","v"]]},
  {id:"m_n_ramkumar", n:"M.N. Ramkumar", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Accountant","executive","v"]]},
  {id:"manoj_rajan_padinzhara", n:"Manoj Rajan Padinzhara", t:2, p:58, s:"finance", roles:[
    ["abc","AVP / Financial Analysis & Reporting","executive","v"]]},
  {id:"ranjith_kumar", n:"Ranjith Kumar", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Group Taxation and Special Projects","executive","v"]]},
  {id:"hardik_chauhan", n:"Hardik Chauhan", t:2, p:58, s:"finance", roles:[
    ["abc","AVP, Capital Planning & Portfolio Analytics","executive","v"]]},
  {id:"nicolas_hurtrez", n:"Nicolas Hurtrez", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Group Strategy","executive","v"]]},
  {id:"wasif_naeem", n:"Wasif Naeem", t:2, p:58, s:"finance", roles:[
    ["abc","AVP, Structural Liquidity Planning & Analytics","executive","v"]]},
  {id:"sunil_natarjan", n:"Sunil Natarjan", t:2, p:58, s:"finance", roles:[
    ["abc","AVP, Capital Planning & Portfolio Analytics","executive","v"]]},
  {id:"ahmed_al_ansari", n:"Ahmed Al Ansari", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Strategic KPI's","executive","v"]]},
  {id:"ismail_mokthar", n:"Ismail Mokthar", t:2, p:58, s:"finance", roles:[
    ["abc","SVP, Group Chief Operating Officer","executive","v"]]},
  {id:"paul_baker", n:"Paul Baker", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Operations","executive","v"]]},
  {id:"rogerio_farias", n:"Rogerio Farias", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Information Security Officer","executive","v"]]},
  {id:"nelson_villate", n:"Nelson Villate", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of IT","executive","v"]]},
  {id:"ehab_al_maskati", n:"Ehab Al Maskati", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Human Resources Officer","executive","v"]]},
  {id:"patrick_abi_habib", n:"Patrick Abi Habib", t:2, p:58, s:"finance", roles:[
    ["abc","Chief Credit & Risk Officer","executive","v"]]},
  {id:"tomy_james", n:"Tomy James", t:2, p:46, s:"finance", roles:[
    ["abc","VP - Credit Risk Management","executive","v"]]},
  {id:"giyas_gokkent", n:"Giyas Gokkent", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Economist","executive","v"]]},
  {id:"muhammad_atif_baig", n:"Muhammad Atif Baig", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Credit Officer","executive","v"]]},
  {id:"kevin_o_rourke", n:"Kevin O Rourke", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Risk","executive","v"]]},
  {id:"hussain_abbas_ali", n:"Hussain Abbas Ali AlJurdabi", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Policy Procedures Portfolio Review & Credit Support","executive","v"]]},
  {id:"anthony_maina_williams", n:"Anthony Maina Williams", t:2, p:46, s:"finance", roles:[
    ["abc","VP Risk Governance & Analytics - Risk Management","executive","v"]]},
  {id:"faisal_abdulnaser_mohamed", n:"Faisal Abdulnaser Mohamed", t:2, p:46, s:"finance", roles:[
    ["abc","Head of IFRS9 & ECL Reporting - Risk Management","executive","v"]]},
  {id:"david_cole", n:"David Cole", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Remedial Loans Unit - Head Office Credit","executive","v"]]},
  {id:"christopher_wilmot", n:"Christopher Wilmot", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Treasury and Financial Markets Officer","executive","v"]]},
  {id:"mazen_ladki", n:"Mazen Ladki", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Corporate Treasury and Proprietary Investments","executive","v"]]},
  {id:"karim_el_sherif", n:"Karim El Sherif", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Asset Management","executive","v"]]},
  {id:"abdulla_abdulaziz_alahmed", n:"Abdulla Abdulaziz Alahmed", t:2, p:46, s:"finance", roles:[
    ["abc","Acting Head of Financial Markets Sales","executive","v"]]},
  {id:"tariq_amin", n:"Tariq Amin", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Syndications, Capital Markets","executive","v"]]},
  {id:"nadia_zubairi", n:"Nadia Zubairi", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Debt Capital Markets","executive","v"]]},
  {id:"ali_asaad", n:"Ali Asaad", t:2, p:58, s:"finance", roles:[
    ["abc","Chief Operating Officer, GTFM","executive","v"]]},
  {id:"fouad_salameh", n:"Fouad Salameh", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Financial Institutions","executive","v"]]},
  {id:"hammad_hasan", n:"Hammad Hasan", t:2, p:58, s:"finance", roles:[
    ["abc","Acting Group Chief Wholesale Banking Officer & Group Head of Islamic Banking","executive","v"]]},
  {id:"jeremy_dixon", n:"Jeremy Dixon", t:2, p:46, s:"finance", roles:[
    ["abc","Group Head of Specialized Finance","executive","v"]]},
  {id:"khalid_durra", n:"Khalid Durra", t:2, p:58, s:"finance", roles:[
    ["abc","Group Head Corporates","executive","v"]]},
  {id:"zoltan_geza_hevesy", n:"Zoltan Geza Hevesy", t:2, p:46, s:"finance", roles:[
    ["abc","VP, Head of WB Portfolio Management","executive","v"]]},
  {id:"nawaf_abdulla_saif", n:"Nawaf Abdulla Saif", t:2, p:46, s:"finance", roles:[
    ["abc","VP, Head of WB Performance Management","executive","v"]]},
  {id:"assad_riyany", n:"Assad Riyany", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Libyan Business","executive","v"]]},
  {id:"mohamed_almaraj", n:"Mohamed Almaraj", t:2, p:58, s:"finance", roles:[
    ["abc","Group Chief Retail & Digital Banking Officer","executive","v"]]},
  {id:"ammar_yousif_raheemi", n:"Ammar Yousif Raheemi", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Finance, ila Bank Bahrain","executive","v"]]},
  {id:"nada_tarada", n:"Nada Tarada", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Business and Customer, ila Bank Bahrain","executive","v"]]},
  {id:"cian_bracken", n:"Cian Bracken", t:2, p:58, s:"finance", roles:[
    ["abc","Chief Operating Officer, ila Bank Bahrain","executive","v"]]},
  {id:"alaa_al_hamad", n:"Alaa Al Hamad", t:2, p:58, s:"finance", roles:[
    ["abc","Chief Compliance & Regulatory Affairs, ila Bank Bahrain","executive","v"]]},
  {id:"luma_alshaikh", n:"Luma AlShaikh", t:2, p:46, s:"finance", roles:[
    ["abc","Head of Legal - ila Bank","executive","v"]]},
  {id:"hamad_rashed_hilal", n:"Hamad Rashed Hilal Isa", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_abraaj","Chairman","board","v"]]},
  {id:"abdulla_rashed_hilal", n:"Abdulla Rashed Hilal Isa", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_abraaj","Vice Chairman","board","v"]]},
  {id:"ali_rashed_hilal", n:"Ali Rashed Hilal Isa", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_abraaj","Executive Director","board","v"]]},
  {id:"moayed_tawfeeq_almoayed", n:"Moayed Tawfeeq Almoayed", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_abraaj","Director","board","v"]]},
  {id:"faisal_rashed_hilal", n:"Faisal Rashed Hilal Isa", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_abraaj","Director","board","v"]]},
  {id:"wissam_fareed_haddad", n:"Wissam Fareed Haddad", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_abraaj","Director","board","v"]]},
  {id:"khaled_mohamed_mattar", n:"Khaled Mohamed Mattar", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_abraaj","Director","board","v"]]},
  {id:"muhammad_ramzan", n:"Muhammad Ramzan", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_abraaj","CFO","executive","v"]]},
  {id:"ali_ibrahim_ali", n:"Ali Ibrahim Ali Ali Emara", t:2, p:46, s:"consumer_disc", roles:[
    ["lst_abraaj","Group General Manager","executive","v"]]},
  {id:"yasmine_mahmood_dib", n:"Yasmine Mahmood Dib", t:2, p:46, s:"consumer_disc", roles:[
    ["lst_abraaj","Head of Marketing","executive","v"]]},
  {id:"hashmeya_ali_alsaba", n:"Hashmeya Ali Alsaba", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_abraaj","Legal, Compliance & Board Secretary","executive","v"]]},
  {id:"geraldine_sablan_liamco", n:"Geraldine Sablan Liamco", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_abraaj","Administrative Manager/Coordinator","executive","v"]]},
  {id:"khaled_omar_mohamed", n:"Khaled Omar Mohamed AlRomaihi", t:2, p:62, s:"materials", roles:[
    ["alba","Chairman","board","v"]]},
  {id:"shaikh_isa_bin_b", n:"Shaikh Isa Bin Khalid Abdulla Al Khalifa", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"khalid_salem_m", n:"Khalid Salem M Al Rowais", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"ahmad_abdulaziz_a", n:"Ahmad Abdulaziz A Al Shaikh", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"bruce_cox", n:"Bruce Cox", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"armando_martinez", n:"Armando Martinez", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"riccardo_picca", n:"Riccardo Picca", t:2, p:52, s:"materials", roles:[
    ["alba","Director","board","v"]]},
  {id:"amin_sultan", n:"Amin Sultan", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Power Officer","executive","v"]]},
  {id:"waleed_tamimi", n:"Waleed Tamimi", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Supply Officer","executive","v"]]},
  {id:"abdulla_habib_ahmed", n:"Abdulla Habib Ahmed Ali", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Operations Officer","executive","v"]]},
  {id:"ricardo_fontes_santana", n:"Ricardo Fontes Santana", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Financial Officer","executive","v"]]},
  {id:"hisham_al_kooheji", n:"Hisham Al Kooheji", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Marketing Officer","executive","v"]]},
  {id:"sohaila_abdul_rahman", n:"Sohaila Abdul Rahman", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Legal and Governance Officer","executive","v"]]},
  {id:"fahad_danish", n:"Fahad Danish", t:2, p:58, s:"materials", roles:[
    ["alba","Chief Human Resources Officer","executive","v"]]},
  {id:"eline_hilal", n:"Eline Hilal", t:2, p:58, s:"materials", roles:[
    ["alba","Director of Investor Relations & Insurance","executive","v"]]},
  {id:"faisal_khalid_kanoo", n:"Faisal Khalid Kanoo", t:2, p:52, s:"industry", roles:[
    ["lst_apmtb","Executive Director","board","v"]]},
  {id:"soren_sjostrand_jakobsen", n:"Soren Sjostrand Jakobsen", t:2, p:52, s:"industry", roles:[
    ["lst_apmtb","Executive Director","board","v"]]},
  {id:"jonathan_goldner", n:"Jonathan Goldner", t:2, p:52, s:"industry", roles:[
    ["lst_apmtb","Executive Director","board","v"]]},
  {id:"kevin_donegan", n:"Kevin Donegan", t:2, p:58, s:"industry", roles:[
    ["lst_apmtb","Non- Executive Director","executive","v"]]},
  {id:"tala_abdulrahman_fakhro", n:"Tala Abdulrahman Fakhro", t:2, p:52, s:"industry", roles:[
    ["lst_apmtb","Independent Director","board","v"]]},
  {id:"rakan_abdulrahman_alotaishan", n:"Rakan Abdulrahman AlOtaishan", t:2, p:52, s:"industry", roles:[
    ["lst_apmtb","Independent Director","board","v"]]},
  {id:"matthew_luckhurst", n:"Matthew Luckhurst", t:2, p:60, s:"industry", roles:[
    ["lst_apmtb","Chief Executive Offier","executive","v"]]},
  {id:"farooq_zaheer_zuberi", n:"Farooq Zaheer Zuberi", t:2, p:58, s:"industry", roles:[
    ["lst_apmtb","Chief Financial Officer","executive","v"]]},
  {id:"sanjay_ranjit_singh", n:"Sanjay Ranjit Singh", t:2, p:46, s:"industry", roles:[
    ["lst_apmtb","Head of HSE","executive","v"]]},
  {id:"aryavansh_shukla", n:"Aryavansh Shukla", t:2, p:58, s:"industry", roles:[
    ["lst_apmtb","Chief Commercial Officer","executive","v"]]},
  {id:"kamal_alhraishat", n:"Kamal Alhraishat", t:2, p:58, s:"industry", roles:[
    ["lst_apmtb","Chief Operations Officer","executive","v"]]},
  {id:"ahmed_gamal", n:"Ahmed Gamal", t:2, p:46, s:"industry", roles:[
    ["lst_apmtb","Head of Asset Maintenance","executive","v"]]},
  {id:"rahim_ali_abbas", n:"Rahim Ali Abbas", t:2, p:46, s:"industry", roles:[
    ["lst_apmtb","Head of People Function","executive","v"]]},
  {id:"mansour_shams_alkhoori", n:"Mansour Shams Alkhoori", t:2, p:62, s:"finance", roles:[
    ["lst_arig","Chairman","board","v"]]},
  {id:"h_e_saeed", n:"H.E Saeed Mohamed Al Shehhi", t:2, p:62, s:"finance", roles:[
    ["lst_arig","Vice Chairman","board","v"]]},
  {id:"mohamed_ahmed_alkarbi", n:"Mohamed Ahmed Alkarbi", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"ashraf_mukhtar_musbah", n:"Ashraf Mukhtar Musbah", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"ahmed_omar_alkarbi", n:"Ahmed Omar Alkarbi", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"younis_jamal_alsayed", n:"Younis Jamal Alsayed", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"fetooh_abdulaziz_alzayani", n:"Fetooh Abdulaziz Alzayani", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"abdulla_nooruddin_abdulla", n:"Abdulla Nooruddin Abdulla", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"abdulla_saeed_eid", n:"Abdulla Saeed Eid Al Ghefli", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member","board","v"]]},
  {id:"general_pension_and", n:"General Pension and Social Security Authority", t:2, p:52, s:"finance", roles:[
    ["lst_arig","Board Member - Represented by Mr. Abdulla Saeed Alghafeli","board","v"]]},
  {id:"tindivanam_somu_devanand", n:"Tindivanam Somu Devanand", t:2, p:46, s:"finance", roles:[
    ["lst_arig","Other Staff in Key Function - Head of Investment","executive","v"]]},
  {id:"safdar_jaffer", n:"Safdar Jaffer", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Principal & Consulting Actuary - External Firm","executive","v"]]},
  {id:"mohamed_asad_irshad", n:"Mohamed Asad Irshad", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"siddharth_mehra", n:"Siddharth Mehra", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"syed_mustafa_hasan", n:"Syed Mustafa Hasan Rizwi", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"abhay_seth", n:"Abhay Seth", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"waleed_cheema", n:"Waleed Cheema", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"ali_nasar_qurashi", n:"Ali Nasar Qurashi", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"yassin_alhamwi", n:"Yassin Alhamwi", t:2, p:58, s:"finance", roles:[
    ["lst_arig","Actuary - External Firm","executive","v"]]},
  {id:"nabeel_khalid_kanoo", n:"Nabeel Khalid Kanoo", t:2, p:62, s:"industry", roles:[
    ["lst_basrec","Deputy Chairman","board","v"]]},
  {id:"yusuf_abdulla_alireza", n:"Yusuf Abdulla Alireza", t:2, p:58, s:"industry", roles:[
    ["lst_basrec","Board Director","executive","v"]]},
  {id:"mona_mubark_kanoo", n:"Mona Mubark Kanoo", t:2, p:58, s:"industry", roles:[
    ["lst_basrec","Board Director","executive","v"]]},
  {id:"talal_fawzi_kanoo", n:"Talal Fawzi Kanoo", t:2, p:58, s:"industry", roles:[
    ["lst_basrec","Board Director","executive","v"]]},
  {id:"zaid_khalid_abdulrahman", n:"Zaid Khalid Abdulrahman", t:2, p:62, s:"industry", roles:[
    ["lst_basrec","Board Director","executive","v"],
    ["lst_bisb","Chairman","board","v"],
    ["nbb","Director","board","v"]]},
  {id:"ali_abdulaziz_abdalmalk", n:"Ali Abdulaziz Abdalmalk", t:2, p:58, s:"industry", roles:[
    ["lst_basrec","Board Director","executive","v"]]},
  {id:"narjis_haider_mohamed", n:"Narjis Haider Mohamed", t:2, p:60, s:"industry", roles:[
    ["lst_basrec","Acting Chief Executive Officer","executive","v"]]},
  {id:"mahmood_abduljalil", n:"Mahmood AbdulJalil", t:2, p:46, s:"industry", roles:[
    ["lst_basrec","Senior Manager","executive","v"]]},
  {id:"aref_haider_ali", n:"Aref Haider Ali Ismaeel Rahimi", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"],
    ["lst_bnh","Director","board","v"]]},
  {id:"khaled_mohammed_abdullah", n:"Khaled Mohammed Abdullah Alasfour", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"munther_a_aziz", n:"Munther A.Aziz Al Kooheji", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"major_general_ghanem", n:"Major General, Ghanem Ebrahim Al Fodhala", t:2, p:52, s:"finance", roles:[
    ["lst_bbk","Board Member","board","v"]]},
  {id:"yaser_abduljalil_ali", n:"Yaser Abduljalil Ali Al Sharifi", t:2, p:60, s:"finance", roles:[
    ["lst_bbk","Group Chief Executive","executive","v"]]},
  {id:"mohammed_abdulla_isa_b", n:"Mohammed Abdulla Isa Ghuloom", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Financial Officer","executive","v"]]},
  {id:"hassaan_mohammed_khalifa", n:"Hassaan Mohammed Khalifa Burshaid", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Operating Officer","executive","v"]]},
  {id:"nadeem_a_aziz", n:"Nadeem A.Aziz Mahmood Al Kooheji", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Wholesale Banking Officer","executive","v"]]},
  {id:"ahmed_abdulqader_saleh", n:"Ahmed Abdulqader Saleh Taqi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Retail Banking Officer","executive","v"]]},
  {id:"mohamed_ahmed_noor", n:"Mohamed Ahmed Noor AlRayes", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Treasury & Investments Officer","executive","v"]]},
  {id:"salah_ahmed_mohammed", n:"Salah Ahmed Mohammed Al Jassas", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Remedial Officer","executive","v"]]},
  {id:"sarah_abdulaziz_jamal", n:"Sarah AbdulAziz Jamal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Human Resources Officer","executive","v"]]},
  {id:"nadeen_nabeel_al", n:"Nadeen Nabeel Al Shirawi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Compliance Officer & MLRO","executive","v"]]},
  {id:"raafat_tarek_rached", n:"Raafat Tarek Rached Kaddoura", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Executive Senior Manager -Corporate Communication","executive","v"]]},
  {id:"ahmed_a_qudoos_b", n:"Ahmed A.Qudoos Ahmed Agha Baba", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Corporate Secretariat","executive","v"]]},
  {id:"abeer_ebrahim_khalil", n:"Abeer Ebrahim Khalil Swar", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Senior Assistant Head of Group Corporate Secretariat","executive","v"]]},
  {id:"jawad_mohamed_mandakar", n:"Jawad Mohamed Mandakar", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Executive Senior Manager - Financial Planning and Control","executive","v"]]},
  {id:"zainab_isa_ali", n:"Zainab Isa Ali Husain Buhassan", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Manager - Financial Planning and Control","executive","v"]]},
  {id:"mahmood_taher_ali", n:"Mahmood Taher Ali Mohamed Taheri", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Assistant General Manager - Financial Accounting and Reporting","executive","v"]]},
  {id:"mohamed_abdulnabi_hajeeh", n:"Mohamed Abdulnabi Hajeeh", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Head of Marketing","executive","v"]]},
  {id:"srinivas_ganti", n:"Srinivas Ganti", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Head of Enterprise Risk","executive","v"]]},
  {id:"ebrahim_yousef_hamed", n:"Ebrahim Yousef Hamed Yousef Mashal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Group Chief Risk Officer","executive","v"]]},
  {id:"noor_mohammed_ebrahim", n:"Noor Mohammed Ebrahim", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Senior Manager - Financial Planning & Control","executive","v"]]},
  {id:"reema_hameed_hussain", n:"Reema Hameed Hussain", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Senior Manager - Financial Planning & Control","executive","v"]]},
  {id:"husain_abdulmajeed_maseeh", n:"Husain Abdulmajeed Maseeh Bahrooz Toorani", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Assistant General Manager - Treasury","executive","v"]]},
  {id:"mona_mustafa_ali", n:"Mona Mustafa Ali Al Sayed", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Assistant General Manager - Operations","executive","v"]]},
  {id:"saud_ebrahim_ali", n:"Saud Ebrahim Ali Mohamed Abdulla", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Section Head - Financial Crime & Deputy MLRO","executive","v"]]},
  {id:"fathi_abbas_mansoor", n:"Fathi Abbas Mansoor Yusuf AlTeraifi", t:2, p:46, s:"finance", roles:[
    ["lst_bbk","Assistant General Manager - Information Security","executive","v"]]},
  {id:"ali_ahmed_ali", n:"Ali Ahmed Ali Kamal", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Manager - Payroll, Benefits & HR Services","executive","v"]]},
  {id:"mohamed_kadhem_ahmed", n:"Mohamed Kadhem Ahmed Al Aali", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Strategy & Sustainability Officer","executive","v"]]},
  {id:"layla_hasan_radhi", n:"Layla Hasan Radhi", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Credit Assessment Officer","executive","v"]]},
  {id:"aqeel_mohammed_ghaith", n:"Aqeel Mohammed Ghaith", t:2, p:58, s:"finance", roles:[
    ["lst_bbk","Chief Private Banking Officer","executive","v"]]},
  {id:"najla_mohammed_alshirawi", n:"Najla Mohammed Alshirawi", t:2, p:62, s:"finance", roles:[
    ["lst_bcfc","Chairperson","board","v"]]},
  {id:"yaser_abduljalil_alsharifi", n:"Yaser Abduljalil AlSharifi", t:2, p:62, s:"finance", roles:[
    ["lst_bcfc","Vice Chairman","board","v"]]},
  {id:"shaik_salman_bin", n:"Shaik Salman Bin Isa Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"areej_abdulla_abdulghaffar", n:"Areej Abdulla Abdulghaffar", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"mahmood_taher_taheri", n:"Mahmood Taher Taheri", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"abdulaziz_abdulla_al", n:"Abdulaziz Abdulla Al Ahmed", t:2, p:60, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"],
    ["nbb","Chief Executive-Strategic Accounts","executive","v"],
    ["nbb","Chief Excutive - Strategic Accounts","executive","v"]]},
  {id:"sami_mohamed_zainal", n:"Sami Mohamed Zainal", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"hasan_bader_kaiksow", n:"Hasan Bader Kaiksow", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"yusuf_abdulrahman_fakhro", n:"Yusuf Abdulrahman Fakhro", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"ameen_murad_ali", n:"Ameen Murad Ali Murad", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director","board","v"]]},
  {id:"yahya_ebrahim_nooruddin", n:"Yahya Ebrahim Nooruddin", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Director - TISCO","executive","v"]]},
  {id:"mohamed_jehad_bukamal", n:"Mohamed Jehad Bukamal", t:2, p:60, s:"finance", roles:[
    ["lst_bcfc","Deputy CEO","executive","v"]]},
  {id:"sayed_ali_hashem", n:"Sayed Ali Hashem Khalaf", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Group Chief Financial Officer","executive","v"]]},
  {id:"fatima_hashim_salman", n:"Fatima Hashim Salman", t:2, p:46, s:"finance", roles:[
    ["lst_bcfc","Acting Head of Internal Audit","executive","v"]]},
  {id:"ali_ebrahim_al", n:"Ali Ebrahim Al-Marzooq", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Technology Officer","executive","v"]]},
  {id:"huda_faisal_janahi", n:"Huda Faisal Janahi", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Risk Officer and Acting Head of Compliance","executive","v"]]},
  {id:"hanan_ahmed_alali", n:"Hanan Ahmed AlAli", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief People & Culture Officer","executive","v"]]},
  {id:"kubra_aghayar", n:"Kubra Aghayar", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Commercial & SME Officer","executive","v"]]},
  {id:"maryam_abdulrahman_hussain", n:"Maryam Abdulrahman Hussain", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Legal Officer","executive","v"]]},
  {id:"tareq_abdulaziz_fathalla", n:"Tareq Abdulaziz Fathalla", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Remedial Officer","executive","v"]]},
  {id:"mohamed_alalawi", n:"Mohamed Alalawi", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Chief Compliance, Governance and MLRO Officer","executive","v"]]},
  {id:"sayed_jalal_jafaar", n:"Sayed Jalal Jafaar Hashim", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Group Corporate Secretary","executive","v"]]},
  {id:"abdelmohsen_ahmed_kassem", n:"Abdelmohsen Ahmed Kassem", t:2, p:60, s:"finance", roles:[
    ["lst_bcfc","Group Automotive CEO","executive","v"]]},
  {id:"mohamed_yusuf_shehabi", n:"Mohamed Yusuf Shehabi", t:2, p:46, s:"finance", roles:[
    ["lst_bcfc","General Manager - TISCO","executive","v"]]},
  {id:"fadi_jamal_mohamed", n:"Fadi Jamal Mohamed", t:2, p:46, s:"finance", roles:[
    ["lst_bcfc","General Manager - TRESCO","executive","v"]]},
  {id:"abbas_yousif_yahya", n:"Abbas Yousif Yahya", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director Accounts","board","v"]]},
  {id:"tareq_abdulaziz_shaaban", n:"Tareq Abdulaziz Shaaban", t:2, p:46, s:"finance", roles:[
    ["lst_bcfc","Senior Manager - Financial Reporting","executive","v"]]},
  {id:"salem_mohamed_s", n:"Salem Mohamed S. Al Tehmazi", t:2, p:58, s:"finance", roles:[
    ["lst_bcfc","Manager - Legal Department","executive","v"]]},
  {id:"mohamed_mahmood_al", n:"Mohamed Mahmood Al Haddad", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Director Marketing & Public Relations","board","v"]]},
  {id:"ahmed_majed_alhashili", n:"Ahmed Majed Alhashili", t:2, p:46, s:"finance", roles:[
    ["lst_bcfc","Senior Manager - Strategic Planning","executive","v"]]},
  {id:"shaikh_osama_bahar", n:"Shaikh Osama Bahar", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Sharia Supervisory Board","board","v"]]},
  {id:"shaikh_naji_alarabi", n:"Shaikh Naji Alarabi", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Sharia Supervisory Board","board","v"]]},
  {id:"shaikh_waleed_almahmood", n:"Shaikh Waleed AlMahmood", t:2, p:52, s:"finance", roles:[
    ["lst_bcfc","Sharia Supervisory Board","board","v"]]},
  {id:"shaikh_abdulla_khalifa", n:"Shaikh Abdulla Khalifa Salman Alkhalifa", t:2, p:62, s:"comm", roles:[
    ["beyon","Chairman","board","v"]]},
  {id:"shaikh_ali_khalifa", n:"Shaikh Ali Khalifa Alkhalifa", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Director","executive","v"]]},
  {id:"ahmed_mazhar", n:"Ahmed Mazhar", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Director","executive","v"]]},
  {id:"saleh_romieh", n:"Saleh Romieh", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Director","executive","v"]]},
  {id:"waleed_abdulrahman_saleh", n:"Waleed Abdulrahman Saleh M. Binhindi", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Director","executive","v"]]},
  {id:"sambamurthy_natrajan", n:"Sambamurthy Natrajan", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Director","executive","v"]]},
  {id:"andrew_kvaalseth", n:"Andrew Kvaalseth", t:2, p:60, s:"comm", roles:[
    ["beyon","Chief Executive Officer","executive","v"]]},
  {id:"shaikh_mohamed_khalifa", n:"Shaikh Mohamed Khalifa Al Khalifa", t:2, p:60, s:"comm", roles:[
    ["beyon","CEO Beyon Digital Growth","executive","v"]]},
  {id:"shaikh_bader_rashed", n:"Shaikh Bader Rashed Alkhalifa", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Communications & Sustainability Officer","executive","v"]]},
  {id:"miguel_angel_fuentes_b", n:"Miguel Angel Fuentes Torre", t:2, p:58, s:"comm", roles:[
    ["beyon","General Counsel","executive","v"]]},
  {id:"faisal_fakhroo", n:"Faisal Fakhroo", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Financial Officer Digital Growth","executive","v"]]},
  {id:"rashed_mohamed_rashed", n:"Rashed Mohamed Rashed", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Technology Officer","executive","v"]]},
  {id:"haitham_al_balooshi", n:"Haitham Al Balooshi", t:2, p:58, s:"comm", roles:[
    ["beyon","Chief Financial Officer - Batelco Key Person","executive","v"]]},
  {id:"manal_al_sarraf", n:"Manal Al Sarraf", t:2, p:58, s:"comm", roles:[
    ["beyon","Director of Compliance","executive","v"]]},
  {id:"nicolas_di_vara", n:"Nicolas Di Vara", t:2, p:52, s:"comm", roles:[
    ["beyon","Director Beyon Strategy","board","v"]]},
  {id:"mohamed_ziyard_mohamed", n:"Mohamed Ziyard Mohamed Amjad", t:2, p:52, s:"comm", roles:[
    ["beyon","Director Financial Control","board","v"]]},
  {id:"nabeel_murad", n:"Nabeel Murad", t:2, p:52, s:"comm", roles:[
    ["beyon","Director Financial Control","board","v"]]},
  {id:"noor_anwar_ahmed", n:"Noor Anwar Ahmed Bu Kamal", t:2, p:58, s:"comm", roles:[
    ["beyon","Director Corporate Governance & Board Secretary","executive","v"]]},
  {id:"sara_alansari", n:"Sara Alansari", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Secretary Specialist","executive","v"]]},
  {id:"amira_turani", n:"Amira Turani", t:2, p:58, s:"comm", roles:[
    ["beyon","Board Secretary Specialist","executive","v"]]},
  {id:"marina_lovrek", n:"Marina Lovrek", t:2, p:46, s:"comm", roles:[
    ["beyon","Head of Creative & Branding","executive","v"]]},
  {id:"kaj_gradevik", n:"Kaj Gradevik", t:2, p:46, s:"comm", roles:[
    ["beyon","Interim Head of M&A","executive","v"]]},
  {id:"marwan_khaled_tabbara", n:"Marwan Khaled Tabbara", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"]]},
  {id:"mohamed_abdulla_nooruddin", n:"Mohamed Abdulla Nooruddin", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"]]},
  {id:"khalid_abdulaziz_al", n:"Khalid Abdulaziz Al Jasim", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"]]},
  {id:"naser_alhamad", n:"Naser Alhamad", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"]]},
  {id:"mohamed_bucheeri", n:"Mohamed Bucheeri", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"]]},
  {id:"rana_abdulaziz_qambar", n:"Rana Abdulaziz Qambar", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"],
    ["nbb","Group Chief Compliance Officer","executive","v"]]},
  {id:"ali_ehsan", n:"Ali Ehsan", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"],
    ["nbb","Group Chief Risk Officer","executive","v"]]},
  {id:"husain_almohri", n:"Husain Almohri", t:2, p:60, s:"finance", roles:[
    ["lst_bisb","Board Member","board","v"],
    ["nbb","Group Chief Executive - Markets & Clients solutions","executive","v"]]},
  {id:"shaikh_abdullatif_mahmood", n:"Shaikh Abdullatif Mahmood Al-Mahmood", t:2, p:62, s:"finance", roles:[
    ["lst_bisb","Shari'a Supervisory Chairman","board","v"]]},
  {id:"shaikh_nidham_yaqoobi", n:"Shaikh Nidham Yaqoobi", t:2, p:62, s:"finance", roles:[
    ["lst_bisb","Shari'a Supervisory Vice Chairman","board","v"]]},
  {id:"shaikh_adnan_abdulla", n:"Shaikh Adnan Abdulla Al-Qattan", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Sharia Board Member","board","v"]]},
  {id:"shaikh_mohammed_jaffar", n:"Shaikh Mohammed Jaffar Al-Juffairi", t:2, p:52, s:"finance", roles:[
    ["lst_bisb","Sharia Board Member","board","v"]]},
  {id:"fatema_moosa_shubbar", n:"Fatema Moosa Shubbar Alalawi", t:2, p:60, s:"finance", roles:[
    ["lst_bisb","Chief Executive Officer","executive","v"]]},
  {id:"salman_mahmood_mubarak", n:"Salman Mahmood Mubarak Sayyar", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Internal Audit Officer","executive","v"]]},
  {id:"faisal_hamed_al", n:"Faisal Hamed Al Abdulla", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Retail Banking Officer","executive","v"]]},
  {id:"ameer_a_ghani", n:"Ameer A.Ghani Dairi", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Financial and Strategy Officer","executive","v"]]},
  {id:"ajay_kumar_jha", n:"Ajay Kumar Jha", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Risk Officer - Risk Management Department","executive","v"]]},
  {id:"nada_ishaq_a", n:"Nada Ishaq A. Kareem", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Board Secretary","executive","v"]]},
  {id:"craig_abel_d", n:"Craig Abel D'Souza", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Group Head of Finance Transformation","executive","v"],
    ["nbb","Group Head of Finance Operations","executive","v"]]},
  {id:"zeyad_yousif_abdul", n:"Zeyad Yousif Abdul Latif Deen", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Senior Manager - Compliance","executive","v"]]},
  {id:"jawad_abdulhadi_humaidan", n:"Jawad Abdulhadi Humaidan", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","BisB - Head Of Financial Institution & Transaction Banking Unit","executive","v"]]},
  {id:"hamad_hussain_al", n:"Hamad Hussain Al Qattan", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Deputy Money Laundering Reporting Officer","executive","v"]]},
  {id:"andrew_mario_stefan", n:"Andrew Mario Stefan Corera", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Applications Officer","executive","v"],
    ["nbb","BisB- Chief Applications Officer","executive","v"]]},
  {id:"ammar_almuharraqi", n:"Ammar AlMuharraqi", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","BisB - Head of IT, Operations and Support Audits","executive","v"]]},
  {id:"salah_yaseen_ahmed", n:"Salah Yaseen Ahmed", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of BisB Legal and Governance","executive","v"]]},
  {id:"sara_ahmed_alammadi", n:"Sara Ahmed Alammadi", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of Marketing & Corporate Communication","executive","v"]]},
  {id:"shaikha_shekar", n:"Shaikha Shekar", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of AFC and MLRO","executive","v"]]},
  {id:"reem_a_rahman", n:"Reem A. Rahman Mohamed", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of Financial & Regulatory Reporting","executive","v"]]},
  {id:"amal_saif_ahmed", n:"Amal Saif Ahmed Ali", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","BisB - Head of Islamic Operations","executive","v"]]},
  {id:"muhammad_zohaib_hafeez", n:"Muhammad Zohaib Hafeez", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of Regulatory Compliance - Compliance Department","executive","v"]]},
  {id:"hamad_farooq_al", n:"Hamad Farooq Al-Shaikh", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Head of Shari'a Coordination & Implementation","executive","v"]]},
  {id:"afnan_ahmed_noor", n:"Afnan Ahmed Noor Saleh", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Of Human Resource","executive","v"]]},
  {id:"hussain_ebrahim_al", n:"Hussain Ebrahim Al Banna", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of Treasury","executive","v"]]},
  {id:"sohail_kabir", n:"Sohail Kabir", t:2, p:46, s:"finance", roles:[
    ["lst_bisb","Head of Corporate Treasury","executive","v"],
    ["nbb","BISB - Head of Corporate Treasury","executive","v"]]},
  {id:"shehzad_hakim_ali", n:"Shehzad Hakim Ali Hassan", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Risk MIS & Analytics","executive","v"]]},
  {id:"ahmed_majeed_askar", n:"Ahmed Majeed Askar", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Chief Credit and Remedial Officer","executive","v"]]},
  {id:"yusuf_adel_alnoaimi", n:"Yusuf Adel Alnoaimi", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Sharia Coordination & Implementation Assistant","executive","v"]]},
  {id:"asma_hasan_al", n:"Asma Hasan Al Arayyedh", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Manager - Legal Affairs","executive","v"]]},
  {id:"arwa_hashim_al", n:"Arwa Hashim Al Sharaf", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","Regulatory Affairs Manager - Compliance","executive","v"]]},
  {id:"yusuf_abdulla_yusuf_b", n:"Yusuf Abdulla Yusuf Akbar Alireza", t:2, p:62, s:"finance", roles:[
    ["nbb","Deputy Chairman","board","v"]]},
  {id:"shaikh_rashid_salman", n:"Shaikh Rashid Salman Mohamed Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"]]},
  {id:"paul_david_pester", n:"Paul David Pester", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"],
    ["nbb","Director","board","v"]]},
  {id:"mohamed_farooq_yusuf", n:"Mohamed Farooq Yusuf Almoayyed", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"]]},
  {id:"alaa_abulkhaleq_saeed", n:"Alaa Abulkhaleq Saeed", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"]]},
  {id:"yogesh_kale", n:"Yogesh Kale", t:2, p:60, s:"finance", roles:[
    ["nbb","CEO UAE","executive","v"],
    ["nbb","CEO -UAE","executive","v"]]},
  {id:"mansour_al_saghayer", n:"Mansour Al Saghayer", t:2, p:60, s:"finance", roles:[
    ["nbb","CEO KSA","executive","v"]]},
  {id:"gaby_alhakim", n:"Gaby AlHakim", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Legal Officer & Corporate Secretary","executive","v"]]},
  {id:"mohsin_rahim", n:"Mohsin Rahim", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Financial Officer","executive","v"],
    ["nbb","Group Chief Financial Officer","executive","v"]]},
  {id:"kumaill_alnoaimi", n:"Kumaill Alnoaimi", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Capital Market Sales & Distribution","executive","v"],
    ["nbb","Group Head of Capital Market Sales & Distribution","executive","v"]]},
  {id:"haytham_seyadi", n:"Haytham Seyadi", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Property, Administration and Business Continuity","executive","v"],
    ["nbb","Group Head of Property, Administration and Business Continuity","executive","v"]]},
  {id:"ali_akbar_assiri", n:"Ali Akbar Assiri", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of MIS & Financial Reporting","executive","v"],
    ["nbb","Head of MIS & Financial Reporting","executive","v"]]},
  {id:"zainab_yusuf_almadhi", n:"Zainab Yusuf Almadhi", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Credit & Treasury Audit","executive","v"],
    ["nbb","Head of Credit & Trasury Audit","executive","v"]]},
  {id:"ameer_alderazi", n:"Ameer Alderazi", t:2, p:58, s:"finance", roles:[
    ["nbb","Head of Data Analytics","executive","v"],
    ["nbb","Group Head- Finance Data Analytics","executive","v"]]},
  {id:"zuhair_mahmood_yusuf", n:"Zuhair Mahmood Yusuf", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Head - Treasury Operations","executive","v"],
    ["nbb","Group Head - Treasury Operations","executive","v"]]},
  {id:"saud_qanati", n:"Saud Qanati", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Commercial Banking","executive","v"],
    ["nbb","Head of Commercial Banking","executive","v"]]},
  {id:"mohamed_fouad_kamal", n:"Mohamed Fouad Kamal", t:2, p:58, s:"finance", roles:[
    ["nbb","Head of Corporate & Public Sector","executive","v"],
    ["nbb","Head of Corporate & Public Sector","executive","v"]]},
  {id:"afnan_bastaki", n:"Afnan Bastaki", t:2, p:58, s:"finance", roles:[
    ["nbb","Executive Secretary - GCEO Office","executive","v"],
    ["nbb","Executive Secretary- GCEO Office","executive","v"]]},
  {id:"mohamed_jasim_al", n:"Mohamed Jasim Al Haiki", t:2, p:58, s:"finance", roles:[
    ["lst_bisb","NBB Group Head- Investor Relations & Insurance","executive","v"],
    ["nbb","Group Head - Insurance & Investor Relations","executive","v"]]},
  {id:"ali_ahmed_abdulkarim", n:"Ali Ahmed Abdulkarim", t:2, p:60, s:"finance", roles:[
    ["nbb","Group Chief Executive- Corporate and Commercial Banking","executive","v"],
    ["nbb","Group Chief Executive - Corporate & Commercial Banking","executive","v"]]},
  {id:"jasim_alabbasi", n:"Jasim Alabbasi", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Head Financial Crime & MLRO","executive","v"],
    ["nbb","Group Head Financial Crime & MLRO","executive","v"]]},
  {id:"luay_yaqoob_seyadi", n:"Luay Yaqoob Seyadi", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Central Operations","executive","v"],
    ["nbb","Group Head of Central Operations","executive","v"]]},
  {id:"zied_ali_mohammed", n:"Zied Ali Mohammed Jalali", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Corporate Finance","executive","v"],
    ["nbb","Group Head of Corporate Finance","executive","v"]]},
  {id:"philip_luyun", n:"Philip Luyun", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Head Data & Analytics","executive","v"],
    ["nbb","Group Head Data & Analytics","executive","v"]]},
  {id:"razi_amin", n:"Razi Amin", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Technology Officer","executive","v"],
    ["nbb","Group Chief Technology Officer","executive","v"]]},
  {id:"hisham_abu_alfateh", n:"Hisham Abu Alfateh", t:2, p:58, s:"finance", roles:[
    ["nbb","Chief Corporate Communications Officer","executive","v"],
    ["nbb","Chief Corporate Communications Officer","executive","v"]]},
  {id:"ali_hussain_a", n:"Ali Hussain A.Wahab", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Banking Audit","executive","v"],
    ["nbb","Head of Banking Audit","executive","v"]]},
  {id:"fatema_khaled_murad", n:"Fatema Khaled Murad", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Retail Products","executive","v"],
    ["nbb","Head of Retail Products","executive","v"]]},
  {id:"abdulla_adel_ebrahim", n:"Abdulla Adel Ebrahim Alsherooqi", t:2, p:58, s:"finance", roles:[
    ["nbb","Assistant Board Secretary and Legal Counsel","executive","v"],
    ["nbb","Assistant Board Secretary and Legal Counsel","executive","v"]]},
  {id:"khalid_minwir_al", n:"Khalid Minwir Al Shammari", t:2, p:58, s:"finance", roles:[
    ["nbb","Legal Counsel and Board Secretary","executive","v"],
    ["nbb","Legal Counsel and Board Secretary","executive","v"]]},
  {id:"reem_nabeel_aldoy", n:"Reem Nabeel Aldoy", t:2, p:46, s:"finance", roles:[
    ["nbb","In-Business Risk & Control Senior Manager","executive","v"],
    ["nbb","Group First Line Risk, and Control Senior Manager","executive","v"]]},
  {id:"zaina_mohamed_al", n:"Zaina Mohamed Al Zayani", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief of Strategy & Sustainability","executive","v"],
    ["nbb","Group Chief of Strategy & Sustainability","executive","v"]]},
  {id:"hend_mohamed_mahmood", n:"Hend Mohamed Mahmood", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Human Resources Officer","executive","v"],
    ["nbb","Group Chief Human Resources Officer","executive","v"]]},
  {id:"ali_abdulhasan_almajed", n:"Ali Abdulhasan Almajed", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Information Security Officer","executive","v"],
    ["nbb","Group Chief Information Security Officer","executive","v"]]},
  {id:"omar_saad_aladhami", n:"Omar Saad AlAdhami", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Retail Digital Banking","executive","v"],
    ["nbb","Head of Retail Digital Banking","executive","v"]]},
  {id:"husain_majeed_askar", n:"Husain Majeed Askar Husain", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Capital Markets Trading","executive","v"],
    ["nbb","Head of Capital Markets Trading","executive","v"]]},
  {id:"subah_a_latif", n:"Subah A.Latif Al Zayani", t:2, p:60, s:"finance", roles:[
    ["nbb","Chief Executive, Retail Banking","executive","v"],
    ["nbb","Chief Executive, Retail Banking","executive","v"]]},
  {id:"rashid_abdulrehman_din", n:"Rashid Abdulrehman Din", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Head - Infrastructure Delivery","executive","v"],
    ["nbb","Group Head - Infrastructure Delivery","executive","v"]]},
  {id:"ali_al_moulani", n:"Ali Al-Moulani", t:2, p:58, s:"finance", roles:[
    ["nbb","Head of Treasury & ALM","executive","v"],
    ["nbb","Group Head Treasury & Asset Liability Management","executive","v"]]},
  {id:"ali_fareed_alshehab", n:"Ali Fareed Alshehab", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of HR Operations","executive","v"],
    ["nbb","Head of HR Operations","executive","v"]]},
  {id:"maram_buallay", n:"Maram Buallay", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Talent Acquisition, Performance Management & Business Partnerships","executive","v"],
    ["nbb","Head of Talent Acquisition, Performance Management & Business Partnerships","executive","v"]]},
  {id:"abdul_nasir_m", n:"Abdul Nasir M Rafique", t:2, p:58, s:"finance", roles:[
    ["nbb","Head of In Business Risk, Control & Governance","executive","v"],
    ["nbb","Group Head- First Line Risk, Control & Governance","executive","v"]]},
  {id:"aqeel_habib_hussain", n:"Aqeel Habib Hussain", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Enterprise Architecture","executive","v"],
    ["nbb","Head of Enterprise Architecture","executive","v"]]},
  {id:"p_gowri_shankar", n:"P.Gowri Shankar", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Core Solutions","executive","v"],
    ["nbb","Head of Core Solutions","executive","v"]]},
  {id:"ali_hasan_muslem", n:"Ali Hasan Muslem", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Liquidity & Market Risk","executive","v"],
    ["nbb","Group Head of Liquidity & Market Risk","executive","v"]]},
  {id:"jaafar_alansari", n:"Jaafar AlAnsari", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Retail Banking Branches","executive","v"],
    ["nbb","Head of Retail Banking Branches","executive","v"]]},
  {id:"osama_hasan_ali", n:"Osama Hasan Ali Zainaldeen", t:2, p:46, s:"finance", roles:[
    ["nbb","Senior Manager - Group Business Support","executive","v"],
    ["nbb","Senior Manager - Group Business Support","executive","v"]]},
  {id:"shadi_riad_barakat", n:"Shadi Riad Barakat", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Card Business","executive","v"]]},
  {id:"ali_mohamed_ghuloom", n:"Ali Mohamed Ghuloom", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Technology & Enterprise Architecture","executive","v"],
    ["nbb","Group Head of Technology & Enterprise Architecture","executive","v"]]},
  {id:"fatema_mohamed_ahmed", n:"Fatema Mohamed Ahmed", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Quality Assurance & Data Analytics","executive","v"],
    ["nbb","Head of Quality Assurance & Data Analytics","executive","v"]]},
  {id:"nabeel_mustafa", n:"Nabeel Mustafa", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Operating Officer","executive","v"],
    ["nbb","Group Chief Operating Officer","executive","v"]]},
  {id:"sadeq_jaafar_kadhem", n:"Sadeq Jaafar Kadhem Dakail", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Regulatory & Overseas Branches Audit","executive","v"],
    ["nbb","Head Of Regulatory & Overseas Branches Audit","executive","v"]]},
  {id:"ahmed_faisal_almaskati", n:"Ahmed Faisal Almaskati", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Retail Products and Projects","executive","v"]]},
  {id:"murad_a_murad", n:"Murad A. Murad", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"emad_jawad_bu", n:"Emad Jawad Bu Khamsin", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"muna_sayed_ali", n:"Muna Sayed Ali Ebrahim Husain AlHashemi", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"mohamed_ebrahim_mohamed", n:"Mohamed Ebrahim Mohamed Ali Zainal", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"bijan_khosrowshahi", n:"Bijan Khosrowshahi", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"mohamed_ahmed_noor_b", n:"Mohamed Ahmed Noor Abdulqader Alrayed", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"farid_joseph_saber", n:"Farid Joseph Saber", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"abdulrahman_ali_saif", n:"Abdulrahman Ali Saif", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"alaa_mohamed_aly", n:"Alaa Mohamed Aly ElZoheiry", t:2, p:52, s:"finance", roles:[
    ["lst_bkic","Director","board","v"]]},
  {id:"abdulla_salah_saleh", n:"Abdulla Salah Saleh Sultan Yusuf", t:2, p:60, s:"finance", roles:[
    ["lst_bkic","Chief Executive Officer","executive","v"]]},
  {id:"abdulla_a_a", n:"Abdulla A A Rahim", t:2, p:58, s:"finance", roles:[
    ["lst_bkic","Board Secretary","executive","v"]]},
  {id:"govindarajan_murali", n:"Govindarajan Murali", t:2, p:46, s:"finance", roles:[
    ["lst_bkic","Senior Manager - IT","executive","v"]]},
  {id:"amhed_abdulrahman_bucheeri", n:"Amhed Abdulrahman Bucheeri", t:2, p:46, s:"finance", roles:[
    ["lst_bkic","Senior Manager - Investment","executive","v"]]},
  {id:"abdulla_hassan_buhindi", n:"Abdulla Hassan Buhindi", t:2, p:62, s:"consumer_stap", roles:[
    ["bmmi","Chairman","board","v"],
    ["lst_dutyf","Chairman","board","v"]]},
  {id:"mohammed_farooq_almoayyed", n:"Mohammed Farooq Almoayyed", t:2, p:62, s:"consumer_stap", roles:[
    ["bmmi","Vice-Chairman","board","v"]]},
  {id:"suhail_mohamed_hajee", n:"Suhail Mohamed Hajee", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"ahmed_hussain_yateem", n:"Ahmed Hussain Yateem", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"ahmed_ebrahim_yaqoob", n:"Ahmed Ebrahim Yaqoob Al Saad", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"yusuf_abdulrahman_fakhroo", n:"Yusuf Abdulrahman Fakhroo", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"ali_shawki_fakhroo", n:"Ali Shawki Fakhroo", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"abbas_radhi", n:"Abbas Radhi", t:2, p:52, s:"consumer_stap", roles:[
    ["bmmi","Director","board","v"]]},
  {id:"ayachi_jomaa", n:"Ayachi Jomaa", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Head of Alosra & FPU","executive","v"]]},
  {id:"sami_haji", n:"Sami Haji", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Senior Manager of Facilities Management","executive","v"]]},
  {id:"ali_al_jabal", n:"Ali Al Jabal", t:2, p:46, s:"consumer_stap", roles:[
    ["bmmi","Senior Manager of Information Technology","executive","v"]]},
  {id:"may_almousawi", n:"May Almousawi", t:2, p:58, s:"consumer_stap", roles:[
    ["bmmi","Corporate Communications & CSR Manager / Board Secretary","executive","v"]]},
  {id:"ghassan_qassim_fakhroo", n:"Ghassan Qassim Fakhroo", t:2, p:62, s:"finance", roles:[
    ["lst_bnh","Vice Chairman","board","v"]]},
  {id:"jehad_yusuf_abdulla", n:"Jehad Yusuf Abdulla Amin", t:2, p:52, s:"finance", roles:[
    ["lst_bnh","Director","board","v"]]},
  {id:"ayad_saad_k", n:"Ayad Saad K Al Gosaibi", t:2, p:52, s:"finance", roles:[
    ["lst_bnh","Director","board","v"]]},
  {id:"sami_mohd_sharif", n:"Sami Mohd Sharif Zainal", t:2, p:52, s:"finance", roles:[
    ["lst_bnh","Director","board","v"]]},
  {id:"hala_farooq_yusuf", n:"Hala Farooq Yusuf Almoayyed", t:2, p:52, s:"finance", roles:[
    ["lst_bnh","Director","board","v"],
    ["lst_solid","Board Member","board","v"]]},
  {id:"hazem_alshaikh_mubarak", n:"Hazem Alshaikh Mubarak", t:2, p:52, s:"finance", roles:[
    ["lst_bnh","Director","board","v"]]},
  {id:"raed_abdulla_mohammed", n:"Raed Abdulla Mohammed Fakhri", t:2, p:60, s:"finance", roles:[
    ["lst_bnh","Group CEO","executive","v"]]},
  {id:"basel_ghali", n:"Basel Ghali", t:2, p:58, s:"finance", roles:[
    ["lst_bnh","Chief Financial Officer","executive","v"]]},
  {id:"ahmed_alaseeri", n:"Ahmed Alaseeri", t:2, p:58, s:"finance", roles:[
    ["lst_bnh","Chief Investment Officer - Direct Investments","executive","v"]]},
  {id:"dr_esam_a", n:"Dr. Esam A. Fakhro", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_cineco","Chairman","board","v"]]},
  {id:"abdulla_esam_abdulla", n:"Abdulla Esam Abdulla Fakhro", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_cineco","Vice-Chairman","board","v"]]},
  {id:"khaled_mohamed_j", n:"Khaled Mohamed J. Alhammadi", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_cineco","Director","board","v"]]},
  {id:"faisal_mohamed_yusuf", n:"Faisal Mohamed Yusuf A.R. Engineer", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_cineco","Director","board","v"]]},
  {id:"yusuf_fareed_yusuf", n:"Yusuf Fareed Yusuf AlMoayyed", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_cineco","Director","board","v"]]},
  {id:"yusuf_nabeel_yusuf", n:"Yusuf Nabeel Yusuf Ameen", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_cineco","Director","board","v"]]},
  {id:"ahmed_ebrahim_s", n:"Ahmed Ebrahim S. Ebrahim", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_cineco","Director","board","v"]]},
  {id:"fadel_mahmoud_mustafa", n:"Fadel Mahmoud Mustafa Abdulla", t:2, p:60, s:"consumer_disc", roles:[
    ["lst_cineco","Deputy CEO","executive","v"]]},
  {id:"karima_farhad_hussain", n:"Karima Farhad Hussain Ridha", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_cineco","Chief Administrative Officer","executive","v"]]},
  {id:"nihal_ranjit_manahunga", n:"Nihal Ranjit Manahunga", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_cineco","Chief Accountant","executive","v"]]},
  {id:"jehad_yusuf_amin", n:"Jehad Yusuf Amin", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_dutyf","Vice Chairman","board","v"]]},
  {id:"h_h_sh", n:"H.H Sh. Khalid Bin Ali Bin Khalifa Al Khalifa", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"shaikh_mohamed_bin_b_b", n:"Shaikh Mohamed Bin Ali Bin Mohamed Al Khalifa", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"mohamed_nabeel_al", n:"Mohamed Nabeel Al Zain", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"mohammed_a_rahman", n:"Mohammed A.Rahman Al Khan", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"ghassan_ebrahim_al", n:"Ghassan Ebrahim Al Sabbagh", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"jalal_mohammed_jalal", n:"Jalal Mohammed Jalal", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"mohammed_farouk_yousif", n:"Mohammed Farouk Yousif Almoayyed", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"mohammed_jassim_mohammed", n:"Mohammed Jassim Mohammed Al Shaikh", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"amal_sayed_moustafa", n:"Amal Sayed Moustafa Mehles", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_dutyf","Director","board","v"]]},
  {id:"bassam_jassim_al", n:"Bassam Jassim Al Wardi", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_dutyf","Consultant to the Board of Directors","executive","v"]]},
  {id:"abdul_rauf_muhammad", n:"Abdul Rauf Muhammad", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_dutyf","Chief Financial Officer","executive","v"]]},
  {id:"nezar_yousif_kamal", n:"Nezar Yousif Kamal", t:2, p:46, s:"consumer_disc", roles:[
    ["lst_dutyf","General Manager","executive","v"]]},
  {id:"sadeq_ismaeel_abdulaziz", n:"Sadeq Ismaeel Abdulaziz", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_dutyf","Board Secretary and CG Officer","executive","v"]]},
  {id:"nabeel_nooruddin_abdulla", n:"Nabeel Nooruddin Abdulla Nooruddin", t:2, p:62, s:"finance", roles:[
    ["lst_esterad","Chairman","board","v"]]},
  {id:"zayed_al_amin", n:"Zayed Al Amin", t:2, p:62, s:"finance", roles:[
    ["lst_esterad","Deputy Chairman","board","v"]]},
  {id:"fahad_abdulla_yateem", n:"Fahad Abdulla Yateem", t:2, p:52, s:"finance", roles:[
    ["lst_esterad","Director","board","v"]]},
  {id:"razi_al_merbati", n:"Razi Al Merbati", t:2, p:52, s:"finance", roles:[
    ["lst_esterad","Director","board","v"]]},
  {id:"ali_isa_ahmed", n:"Ali Isa Ahmed Abdulrahim Abdulla", t:2, p:52, s:"finance", roles:[
    ["lst_esterad","Director","board","v"]]},
  {id:"faris_al_kooheji", n:"Faris Al Kooheji", t:2, p:52, s:"finance", roles:[
    ["lst_esterad","Director","board","v"]]},
  {id:"mazen_ibrahim_abdulkarim", n:"Mazen Ibrahim Abdulkarim", t:2, p:52, s:"finance", roles:[
    ["lst_esterad","Director","board","v"]]},
  {id:"ahmed_abdulrahman", n:"Ahmed Abdulrahman", t:2, p:60, s:"finance", roles:[
    ["lst_esterad","Chief Executive Officer","executive","v"]]},
  {id:"nasir_maqsood", n:"Nasir Maqsood", t:2, p:58, s:"finance", roles:[
    ["lst_esterad","Chief Financial Officer","executive","v"]]},
  {id:"tareq_abdulmalek", n:"Tareq Abdulmalek", t:2, p:46, s:"finance", roles:[
    ["lst_esterad","Head of Finance, Operations & Administration","executive","v"]]},
  {id:"sameera_albulushi", n:"Sameera AlBulushi", t:2, p:58, s:"finance", roles:[
    ["lst_esterad","Board Secretary","executive","v"]]},
  {id:"abdul_latif_khalid", n:"Abdul Latif Khalid Al-Aujan", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_family","Chairman","board","v"]]},
  {id:"ahmed_janahi", n:"Ahmed Janahi", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_family","Vice Chairman","board","v"],
    ["lst_ghg","Group CEO","executive","v"]]},
  {id:"bashar_mohammed_ali", n:"Bashar Mohammed Ali Al Hassan", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_family","Director","board","v"]]},
  {id:"farooq_mohamed_h", n:"Farooq Mohamed H. Alkhaja", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_family","Director","board","v"]]},
  {id:"sharif_mohamed_sharif", n:"Sharif Mohamed Sharif Ahmadi", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_family","Director","board","v"]]},
  {id:"reem_alrayes", n:"Reem Alrayes", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_family","Director","board","v"],
    ["lst_ghg","Legal Counsel, Compliance and Board Secretary","executive","v"]]},
  {id:"mohamed_algharbi", n:"Mohamed Algharbi", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_family","Director","board","v"],
    ["lst_ghg","Chief Financial Officer","executive","v"]]},
  {id:"abdul_haseeb", n:"Abdul Haseeb", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_family","Financial Controller, Compliance and Board Secretary","executive","v"]]},
  {id:"ghazi_faisal_alhajeri", n:"Ghazi Faisal Alhajeri", t:2, p:62, s:"finance", roles:[
    ["gfh","Vice Chairman","board","v"]]},
  {id:"rashid_nasser_al", n:"Rashid Nasser Al Kaabi", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"fawaz_talal_al", n:"Fawaz Talal Al Tamimi", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"darwish_abdulla_darwish", n:"Darwish Abdulla Darwish Ahmed Alketbi", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"abdulaziz_albassam", n:"Abdulaziz AlBassam", t:2, p:52, s:"finance", roles:[
    ["gfh","Board Member","board","v"]]},
  {id:"george_nicholas_judd", n:"George Nicholas Judd", t:2, p:60, s:"finance", roles:[
    ["gfh","CEO London Office","executive","v"]]},
  {id:"rajeev_gogia", n:"Rajeev Gogia", t:2, p:58, s:"finance", roles:[
    ["gfh","Group Chief Financial Officer","executive","v"]]},
  {id:"luay_hasan_hussain", n:"Luay Hasan Hussain Ahmadi", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director Global Haed of Institution","executive","v"]]},
  {id:"nael_mustafa", n:"Nael Mustafa", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director","executive","v"]]},
  {id:"karim_mohamed_ali", n:"Karim Mohamed Ali Ziwar", t:2, p:58, s:"finance", roles:[
    ["gfh","Manager Director","executive","v"]]},
  {id:"shaikha_minwa_bint", n:"Shaikha Minwa Bint Ali Bin Khalifa Al khalifa", t:2, p:52, s:"finance", roles:[
    ["gfh","Independent Director","board","v"]]},
  {id:"abdulla_jehad_abdulla", n:"Abdulla Jehad Abdulla Al Zain", t:2, p:52, s:"finance", roles:[
    ["gfh","Independent Director","board","v"]]},
  {id:"mohamed_alhusaini", n:"Mohamed Alhusaini", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"khurshid_alam", n:"Khurshid Alam", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"ameen_murad", n:"Ameen Murad", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"azam_haq", n:"Azam Haq", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"sahar_khunji", n:"Sahar Khunji", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"mohamed_zainal", n:"Mohamed Zainal", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"zeyad_alhaj", n:"Zeyad Alhaj", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"sahar_qanati", n:"Sahar Qanati", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ameen_ameeri", n:"Ameen Ameeri", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"muhammad_sameer_azam", n:"Muhammad Sameer Azam", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"samana_abdulkarim", n:"Samana AbdulKarim", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"kapil_kothari", n:"Kapil Kothari", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"hayk_aramyan", n:"Hayk Aramyan", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"salman_matar", n:"Salman Matar", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"nader_moustafa_fouad", n:"Nader Moustafa Fouad", t:2, p:58, s:"finance", roles:[
    ["gfh","Director- Placement & Relationship","executive","v"]]},
  {id:"niraj_varia", n:"Niraj Varia", t:2, p:52, s:"finance", roles:[
    ["gfh","Director IT Audit","board","v"]]},
  {id:"hazem_hebaishi", n:"Hazem Hebaishi", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"mohammad_yahya_ahmad", n:"Mohammad Yahya Ahmad", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"khalid_waheed_abdulrahman", n:"Khalid Waheed Abdulrahman", t:2, p:58, s:"finance", roles:[
    ["gfh","Director - Chief Information Security Officer","executive","v"]]},
  {id:"mohamed_jaafar_akbar", n:"Mohamed Jaafar Akbar Ali", t:2, p:58, s:"finance", roles:[
    ["gfh","Sr. Director","executive","v"]]},
  {id:"saleh_khan", n:"Saleh Khan", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director","executive","v"]]},
  {id:"aala_faisal_al", n:"Aala Faisal Al Saleh", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Executive Director","executive","v"]]},
  {id:"ahmed_abdullatif", n:"Ahmed Abdullatif", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"yousif_al_ansari", n:"Yousif Al Ansari", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"thamer_ghaith", n:"Thamer Ghaith", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"mohamed_alshehabi", n:"Mohamed Alshehabi", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"mohamed_al_mualla", n:"Mohamed Al Mualla", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"hussein_allie", n:"Hussein Allie", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"ashraf_emam", n:"Ashraf Emam", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"amani_abdulla_alaradi", n:"Amani Abdulla AlAradi", t:2, p:60, s:"finance", roles:[
    ["gfh","CEO Office Manager","executive","v"]]},
  {id:"ayat_hafadh", n:"Ayat Hafadh", t:2, p:60, s:"finance", roles:[
    ["gfh","CEO Office Manager","executive","v"]]},
  {id:"hesham_alrayes", n:"Hesham Alrayes", t:2, p:60, s:"finance", roles:[
    ["gfh","Chief Executive Officer and Board Member","executive","v"]]},
  {id:"hammad_younis", n:"Hammad Younis", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief Investment Management","executive","v"]]},
  {id:"ali_abdulla_almutawa", n:"Ali Abdulla Almutawa", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief Information Security Officer","executive","v"]]},
  {id:"bahaa_al_marzooq", n:"Bahaa Al Marzooq", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief Internal Audit","executive","v"]]},
  {id:"pietro_giuseppe_lorenzo", n:"Pietro Giuseppe Lorenzo Bruno de Libero", t:2, p:58, s:"finance", roles:[
    ["gfh","Board Secretary and Chief Legal Officer","executive","v"]]},
  {id:"ayman_zaidan", n:"Ayman Zaidan", t:2, p:58, s:"finance", roles:[
    ["gfh","Group Chief - Treasury & Financial Institutions","executive","v"]]},
  {id:"ali_alshamma", n:"Ali Alshamma", t:2, p:58, s:"finance", roles:[
    ["gfh","CFO Treasury & Capital Market","executive","v"]]},
  {id:"husain_abbas", n:"Husain Abbas", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Executive Director","executive","v"]]},
  {id:"salma_nader_dahwa", n:"Salma Nader Dahwa", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Executive Director","executive","v"]]},
  {id:"h_e_sheikh", n:"H.E. Sheikh Abdullah S M Al-Manea", t:2, p:62, s:"finance", roles:[
    ["gfh","Chairman of Sharia Supervisory Board","board","v"]]},
  {id:"nidham_mohamed_saleh", n:"Nidham Mohamed Saleh Yaqoubi", t:2, p:52, s:"finance", roles:[
    ["gfh","Sharia Supervisory Board Member","board","v"]]},
  {id:"fareed_mohamed_hadi", n:"Fareed Mohamed Hadi AlAbbasi", t:2, p:52, s:"finance", roles:[
    ["gfh","Sharia Supervisory Board Member","board","v"]]},
  {id:"dr_abdulaziz_khalifa", n:"Dr.AbdulAziz Khalifa Al-Qassar", t:2, p:52, s:"finance", roles:[
    ["gfh","Sharia Supervisory Board Member","board","v"]]},
  {id:"maryam_jowhary", n:"Maryam Jowhary", t:2, p:58, s:"finance", roles:[
    ["gfh","Executive Director - Compliance and AML","executive","v"]]},
  {id:"hamza_salem", n:"Hamza Salem", t:2, p:58, s:"finance", roles:[
    ["gfh","Executive Director- Legal","executive","v"]]},
  {id:"fatema_kamal", n:"Fatema Kamal", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director","executive","v"]]},
  {id:"talal_nabeel_al", n:"Talal Nabeel Al Mahroos", t:2, p:58, s:"finance", roles:[
    ["gfh","Chief of Development Infrastructure Investments","executive","v"]]},
  {id:"bashar_ali_al", n:"Bashar Ali Al Shaikh", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"nasr_bayoumi", n:"Nasr Bayoumi", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"khaled_basri", n:"Khaled Basri", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director","executive","v"]]},
  {id:"ahmed_jamsheer", n:"Ahmed Jamsheer", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"mazin_al_ghareeb", n:"Mazin Al Ghareeb", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"farhan_khan", n:"Farhan Khan", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"naser_abdulhameed_al", n:"Naser Abdulhameed Al Naser", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"abdulrahman_saif", n:"Abdulrahman Saif", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"noor_burdestani", n:"Noor Burdestani", t:2, p:58, s:"finance", roles:[
    ["gfh","Executive Secretary","executive","v"]]},
  {id:"hesham_al_qassab", n:"Hesham Al Qassab", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Executive Director","executive","v"]]},
  {id:"mohamed_abdulsalam", n:"Mohamed AbdulSalam", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Sharia","executive","v"]]},
  {id:"khaled_abdulla_al", n:"Khaled Abdulla Al Awadhi", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Internal Control","executive","v"]]},
  {id:"mohamed_khonji", n:"Mohamed Khonji", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Executive Director","executive","v"]]},
  {id:"muneera_isa", n:"Muneera Isa", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Human Resources Management","executive","v"]]},
  {id:"mohamed_abdulmalik", n:"Mohamed AbdulMalik", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Placement managment","executive","v"]]},
  {id:"nupur_daga", n:"Nupur Daga", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Administration & Finance","executive","v"]]},
  {id:"harri_ashford", n:"Harri Ashford", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Compliance - GFH Partners","executive","v"]]},
  {id:"hamad_khaled_alhammad", n:"Hamad Khaled AlHammad", t:2, p:46, s:"finance", roles:[
    ["gfh","Head of Compliance - GFH Capital Kuwait","executive","v"]]},
  {id:"mohamed_altamimi", n:"Mohamed Altamimi", t:2, p:60, s:"finance", roles:[
    ["gfh","Managing Director","executive","v"]]},
  {id:"isa_yusuf_hatem", n:"Isa Yusuf Hatem Sultan", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ali_zeitoun", n:"Ali Zeitoun", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ahmed_yousif_mohamed", n:"Ahmed Yousif Mohamed", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"yastil_kunnie", n:"Yastil Kunnie", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"eman_mohamed", n:"Eman Mohamed", t:2, p:52, s:"finance", roles:[
    ["gfh","Executive Director","board","v"]]},
  {id:"anand_krishnan", n:"Anand Krishnan", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"hardik_gor", n:"Hardik Gor", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"zain_al_mulla", n:"Zain Al Mulla", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"fuad_alalem", n:"Fuad Alalem", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"aleksandr_vasilev", n:"Aleksandr Vasilev", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"mohamed_alwazzan", n:"Mohamed Alwazzan", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"robert_everson", n:"Robert Everson", t:2, p:58, s:"finance", roles:[
    ["gfh","Director - Real Estate","executive","v"]]},
  {id:"khaled_abdulmajeed_abdulkari", n:"Khaled Abdulmajeed Abdulkarim", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"ruqaya_hameed_neama", n:"Ruqaya Hameed Neama", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"ashish_agrawal", n:"Ashish Agrawal", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"hesham_hadi_h", n:"Hesham Hadi H. Hasan", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"issam_kerriou", n:"Issam Kerriou", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"shaima_jaffar_radhi", n:"Shaima Jaffar Radhi", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"talal_hashem", n:"Talal Hashem", t:2, p:58, s:"finance", roles:[
    ["gfh","Senior Director","executive","v"]]},
  {id:"imran_khalid_rafiq", n:"Imran Khalid Rafiq", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"anant_kumar", n:"Anant Kumar", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"dhruv_gupta", n:"Dhruv Gupta", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"jayesh_shesmal_malvi", n:"Jayesh Shesmal Malvi", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"huggins_kayira", n:"Huggins Kayira", t:2, p:58, s:"finance", roles:[
    ["gfh","Deputy Manager IT Audit","executive","v"]]},
  {id:"farah_baqer", n:"Farah Baqer", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"sheireen_ebrahim_seroori", n:"Sheireen Ebrahim Seroori", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"hanan_abdulhameed_ahmed", n:"Hanan Abdulhameed Ahmed", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"marwa_aloraibi", n:"Marwa AlOraibi", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"khaled_fuad_zainal", n:"Khaled Fuad Zainal", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ahmed_abdulqasim", n:"Ahmed Abdulqasim", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"agzayle_saleh_al", n:"Agzayle Saleh Al Jowaied", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ammar_mohammed_bureshaid", n:"Ammar Mohammed Bureshaid", t:2, p:52, s:"finance", roles:[
    ["gfh","Director","board","v"]]},
  {id:"ali_abudrees", n:"Ali Abudrees", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager","executive","v"]]},
  {id:"bassam_ghassan_beidas", n:"Bassam Ghassan Beidas", t:2, p:46, s:"finance", roles:[
    ["gfh","Senior Manager - ALM","executive","v"]]},
  {id:"latifa_salah_abdulla", n:"Latifa Salah Abdulla Ghali", t:2, p:58, s:"finance", roles:[
    ["gfh","Officer - Sharia and Corporate Secretary","executive","v"]]},
  {id:"fatima_mohamed_salem", n:"Fatima Mohamed Salem", t:2, p:58, s:"finance", roles:[
    ["gfh","Coordinator","executive","v"]]},
  {id:"sara_redha_ghuloom", n:"Sara Redha Ghuloom Ali", t:2, p:58, s:"finance", roles:[
    ["gfh","Officer - Board Secretary & Corporate Governance","executive","v"]]},
  {id:"lamya_darwish", n:"Lamya Darwish", t:2, p:58, s:"finance", roles:[
    ["gfh","Coordinator","executive","v"]]},
  {id:"hala_almoayyed", n:"Hala Almoayyed", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_ghg","Vice Chairman","board","v"]]},
  {id:"mohammed_jassim_buzizi", n:"Mohammed Jassim Buzizi", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"adel_husain_mahdi", n:"Adel Husain Mahdi Al Maskati", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"jasim_hasan_yusuf", n:"Jasim Hasan Yusuf Abdulaal", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"suha_saeed_ali", n:"Suha Saeed Ali Karzoon", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"mohamed_sharif_ahmadi", n:"Mohamed Sharif Ahmadi", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"zain_al_amer", n:"Zain Al Amer", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"fahad_kanoo", n:"Fahad Kanoo", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"andrew_john_day", n:"Andrew John Day", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"husain_al_shehab", n:"Husain Al Shehab", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_ghg","Director","board","v"]]},
  {id:"feras_ali_abdulla", n:"Feras Ali Abdulla Almari", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","Manager - Finance & Reporting","executive","v"]]},
  {id:"amit_puri", n:"Amit Puri", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","Director of Human Resources and Development","executive","v"]]},
  {id:"shuvendu_bakshi", n:"Shuvendu Bakshi", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","Director of Projects","executive","v"]]},
  {id:"amit_kumar", n:"Amit Kumar", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","Director of Finance (GBI)","executive","v"]]},
  {id:"maria_victorina_urbano", n:"Maria Victorina Urbano Guarin", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","PA to CFO","executive","v"]]},
  {id:"somaya_hasan_ali", n:"Somaya Hasan Ali", t:2, p:60, s:"consumer_disc", roles:[
    ["lst_ghg","PA to CEO","executive","v"]]},
  {id:"majd_hamamouchi", n:"Majd Hamamouchi", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_ghg","Director - Acquisition & Business Development","executive","v"]]},
  {id:"charbel_hanna", n:"Charbel Hanna", t:2, p:46, s:"consumer_disc", roles:[
    ["lst_ghg","Area General Manager","executive","v"]]},
  {id:"yaqoub_bander", n:"Yaqoub Bander", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member- Independent Director","board","v"]]},
  {id:"hazem_el_bakry", n:"Hazem El Bakry", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member - Executive Director","board","v"]]},
  {id:"ahmed_al_bassam", n:"Ahmed Al Bassam", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member- Independent Director","board","v"]]},
  {id:"abdulaziz_fahad_dakheel", n:"Abdulaziz Fahad Dakheel", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member - Executive Director","board","v"]]},
  {id:"abdulla_mohamed_alabduljader", n:"Abdulla Mohamed Alabduljader", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member- Independent Director","board","v"]]},
  {id:"hussain_abdulhameed_al", n:"Hussain Abdulhameed Al Shehab", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member- Independent Director","board","v"]]},
  {id:"mohammed_abdulwahab_almatook", n:"Mohammed Abdulwahab Almatook", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Board Member- Independent Director","board","v"]]},
  {id:"sheikh_dr_hamad", n:"Sheikh Dr. Hamad Al-Mazrouei", t:2, p:62, s:"finance", roles:[
    ["lst_inovest","Sharia Supervisory Board - Chairman","board","v"]]},
  {id:"shaikh_dr_abdulrahman", n:"Shaikh Dr. Abdulrahman Al-Baloul", t:2, p:62, s:"finance", roles:[
    ["lst_inovest","Sharia Supervisory Board - Vice Chairman","board","v"]]},
  {id:"shaikh_dr_mohamad", n:"Shaikh Dr. Mohamad AlShurafa", t:2, p:52, s:"finance", roles:[
    ["lst_inovest","Sharia Supervisory Board - Member","board","v"]]},
  {id:"abdulqawi_radman", n:"Abdulqawi Radman", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Chief Investment Officer","executive","v"]]},
  {id:"khalil_jaafar_hasan", n:"Khalil Jaafar Hasan", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Director-Investment","executive","v"]]},
  {id:"lamya_bineid", n:"Lamya Bineid", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Director - Humen Resources","executive","v"]]},
  {id:"ali_abdulnabi_haji", n:"Ali Abdulnabi Haji", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Director - Risk Management","executive","v"]]},
  {id:"yusuf_ebrahim_khalil", n:"Yusuf Ebrahim Khalil Maraghi", t:2, p:46, s:"finance", roles:[
    ["lst_inovest","Head of HR and Finance","executive","v"]]},
  {id:"riyadh_mahmood_mulla", n:"Riyadh Mahmood Mulla", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Board Secretary and Shareholder Affairs","executive","v"]]},
  {id:"ahmed_mahmood_khameeri", n:"Ahmed Mahmood Khameeri", t:2, p:46, s:"finance", roles:[
    ["lst_inovest","Head of Compliance Department","executive","v"]]},
  {id:"hamad_abdulla_zainalabedeen", n:"Hamad Abdulla Zainalabedeen", t:2, p:46, s:"finance", roles:[
    ["lst_inovest","Head of Internal Audit","executive","v"]]},
  {id:"dalal_yousif_al", n:"Dalal Yousif Al Qahtani", t:2, p:58, s:"finance", roles:[
    ["lst_inovest","Executive Secretary","executive","v"]]},
  {id:"prince_amr_mohamed", n:"Prince Amr Mohamed AlFaisal Aal-Saud", t:2, p:62, s:"finance", roles:[
    ["lst_ithmr","Chairman","board","v"]]},
  {id:"tunko_dato_ya", n:"Tunko Dato Ya'acob Bin Tunku Abdulla", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Board Member","board","v"]]},
  {id:"juma_hasan_abull", n:"Juma Hasan Abull", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Board Member","board","v"]]},
  {id:"amani_khaled_mohammad", n:"Amani Khaled Mohammad Bouresli", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Board Member","board","v"]]},
  {id:"sheikh_mohamed_el", n:"Sheikh Mohamed El Khereiji", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Board Member","board","v"]]},
  {id:"elham_ebrahim_abdulla", n:"Elham Ebrahim Abdulla Hasan", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Board Member","board","v"]]},
  {id:"sheikh_abdullah_sulaiman", n:"Sheikh Abdullah Sulaiman Al Manee a", t:2, p:62, s:"finance", roles:[
    ["lst_ithmr","Chairman - Sharia Supervisory Board","board","v"]]},
  {id:"sheikh_dr_nedham", n:"Sheikh Dr. Nedham Yaqouby", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Member - Sharia Supervisory Board","board","v"]]},
  {id:"sheikh_dr_osama", n:"Sheikh Dr. Osama Mohamed Saad Bahar", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Member - Sharia Supervisory Board","board","v"]]},
  {id:"sheikh_mohsin_al", n:"Sheikh Mohsin Al Asfoor", t:2, p:52, s:"finance", roles:[
    ["lst_ithmr","Member - Sharia Supervisory Board","board","v"]]},
  {id:"mohamed_ahmed_bucheeri", n:"Mohamed Ahmed Bucheeri", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager - Asset Management","executive","v"]]},
  {id:"einas_mohamed_raheemi", n:"Einas Mohamed Raheemi", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Ex. Sr. Manager - Head of Enterprise Support Services & Sustainability","executive","v"]]},
  {id:"khalil_ebrahim_ali", n:"Khalil Ebrahim Ali Alasfoor", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Head of Risk Management Department","executive","v"]]},
  {id:"saqib_mustafa_mahmood", n:"Saqib Mustafa Mahmood", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Chief Financial Officer","executive","v"]]},
  {id:"maysan_faisal_salih", n:"Maysan Faisal Salih Almaskati", t:2, p:60, s:"finance", roles:[
    ["lst_ithmr","Chief Executive Officer","executive","v"]]},
  {id:"hani_ali_ghayath", n:"Hani Ali Ghayath", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Head of IT","executive","v"]]},
  {id:"nayef_naser_yusuf", n:"Nayef Naser Yusuf Mohamed AlNaser", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Executive Senior Manager","executive","v"]]},
  {id:"husain_ahmed_husain", n:"Husain Ahmed Husain Haider", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager","executive","v"]]},
  {id:"khalid_ahmed_al", n:"Khalid Ahmed Al-Abbasi", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Manager - Financial Control Ithmaar Holding B.S.C.","executive","v"]]},
  {id:"sreejith_kp", n:"Sreejith KP", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager - Financial Control","executive","v"]]},
  {id:"bushra_ahmed_baqer", n:"Bushra Ahmed Baqer", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager - Risk Management","executive","v"]]},
  {id:"mohamed_jamal_aish", n:"Mohamed Jamal Aish", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager - Compliance & AML","executive","v"]]},
  {id:"mohamed_malalla_mohamed", n:"Mohamed Malalla Mohamed Ali Hasan", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Senior Manager","executive","v"]]},
  {id:"ramla_a_redha", n:"Ramla A.Redha Hussain Ali", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Manager - Credit Administration","executive","v"]]},
  {id:"nada_albastaki", n:"Nada Albastaki", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Manager - Credit Risk and Governance","executive","v"]]},
  {id:"mohammed_ali_mohammed", n:"Mohammed Ali Mohammed Safar", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Assistant General Manager, Business Group","executive","v"]]},
  {id:"murtaza_saiffdeen", n:"Murtaza SaiffDeen", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Account Director (Gulf Marcom Marketing Co.WLL)","executive","v"]]},
  {id:"fatema_abdulla_mufeez", n:"Fatema Abdulla Mufeez", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Head of Legal, Compliance & AML and Corporate Secretary","executive","v"]]},
  {id:"amr_al_shaher", n:"Amr Al Shaher", t:2, p:46, s:"finance", roles:[
    ["lst_ithmr","Head of Corporate Banking","executive","v"]]},
  {id:"noora_abdulkarim_murad", n:"Noora Abdulkarim Murad", t:2, p:58, s:"finance", roles:[
    ["lst_ithmr","Manager - Financial Control","executive","v"]]},
  {id:"yusuf_abdulla_taqi", n:"Yusuf Abdulla Taqi", t:2, p:62, s:"finance", roles:[
    ["lst_khaleeji","Chairman","board","v"]]},
  {id:"razi_abdulghaffar_almurbati", n:"Razi Abdulghaffar Almurbati", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"sh_ahmed_bin", n:"SH. Ahmed Bin Isa Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"riyadh_eid_al", n:"Riyadh Eid Al Yaqoob", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"ali_murad_ali", n:"Ali Murad Ali Murad", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"mazen_ebrahim_abdulkarim", n:"Mazen Ebrahim Abdulkarim", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"h_e_ayman", n:"H.E. Ayman Tawfiq Almoayed", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"dawood_mohammad_alghoul", n:"Dawood Mohammad AlGhoul", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Director","board","v"]]},
  {id:"sattam_sulaiman_algosaibi", n:"Sattam Sulaiman Algosaibi", t:2, p:60, s:"finance", roles:[
    ["lst_khaleeji","CEO","executive","v"]]},
  {id:"amena_samir_saffy", n:"Amena Samir Saffy", t:2, p:60, s:"finance", roles:[
    ["lst_khaleeji","CEO office Manager","executive","v"]]},
  {id:"abdulkarim_mohamed_al", n:"Abdulkarim Mohamed Al Zakari", t:2, p:58, s:"finance", roles:[
    ["lst_khaleeji","Chief Financial Officer","executive","v"]]},
  {id:"amit_yashpal", n:"Amit Yashpal", t:2, p:58, s:"finance", roles:[
    ["lst_khaleeji","Chief Risk Officer","executive","v"]]},
  {id:"muna_ghuloom_hussain", n:"Muna Ghuloom Hussain Abdulla", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Credit Management","executive","v"]]},
  {id:"osama_ali_nasr", n:"Osama Ali Nasr", t:2, p:58, s:"finance", roles:[
    ["lst_khaleeji","Chief Technology Officer","executive","v"]]},
  {id:"nawaf_abdulsalam_yousif", n:"Nawaf Abdulsalam Yousif Al-Hosani", t:2, p:58, s:"finance", roles:[
    ["lst_khaleeji","Manager- Sharia'a Department","executive","v"]]},
  {id:"fatima_ahmed_al", n:"Fatima Ahmed Al Binali", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of HR","executive","v"]]},
  {id:"kaltham_ghuloom_ismail", n:"Kaltham Ghuloom Ismail", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Internal Control Unit","executive","v"]]},
  {id:"fajer_sami_albusmait", n:"Fajer Sami AlBusmait", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Compliance","executive","v"]]},
  {id:"ameera_ahmed_al", n:"Ameera Ahmed Al Abbasi", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Retail Banking","executive","v"]]},
  {id:"roomi_siddiqui", n:"Roomi Siddiqui", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Treasury","executive","v"]]},
  {id:"mohamed_ebrahim_al", n:"Mohamed Ebrahim Al Hashimi", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Operations","executive","v"]]},
  {id:"ahmed_mohamed_burashid", n:"Ahmed Mohamed Burashid", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Corporate Banking, Investment","executive","v"]]},
  {id:"maitham_abdulhameed_abbas", n:"Maitham Abdulhameed Abbas", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Business Development","executive","v"]]},
  {id:"mohamed_abbas_radhi", n:"Mohamed Abbas Radhi", t:2, p:46, s:"finance", roles:[
    ["lst_khaleeji","Head of Anti-Finacial Crime","executive","v"]]},
  {id:"nezam_mohammed_saleh", n:"Nezam Mohammed Saleh Yaquby", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Sharia'a Superisory Board Member","board","v"]]},
  {id:"dr_fareed_mohammed", n:"Dr.Fareed Mohammed Abdulqader Hadi", t:2, p:52, s:"finance", roles:[
    ["lst_khaleeji","Sharia'a Superisory Board Member","board","v"]]},
  {id:"dr_fareed_yakub", n:"Dr.Fareed Yakub Yousif Al Muftah", t:2, p:62, s:"finance", roles:[
    ["lst_khaleeji","Sharia'a Superisory Chairman","board","v"]]},
  {id:"abdulla_ahmed_nass", n:"Abdulla Ahmed Nass", t:2, p:62, s:"industry", roles:[
    ["lst_nass","Chairman","board","v"]]},
  {id:"sameer_abdulla_nass", n:"Sameer Abdulla Nass", t:2, p:62, s:"industry", roles:[
    ["lst_nass","Deputy Chairman &Managing Director","executive","v"]]},
  {id:"ghazi_abdulla_nass", n:"Ghazi Abdulla Nass", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"adel_abdulla_nass", n:"Adel Abdulla Nass", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"ahmed_abdulla_nass", n:"Ahmed Abdulla Nass", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"fawzi_abdulla_nass", n:"Fawzi Abdulla Nass", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"hisham_al_saie", n:"Hisham Al Saie", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"mustafa_al_sayed", n:"Mustafa Al Sayed", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"sami_abdulla_nass", n:"Sami Abdulla Nass", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"saleh_salim_al", n:"Saleh Salim Al Nashwan", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"jamal_a_al", n:"Jamal A Al Hazeem", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"abdulla_nooruddin_abdullanoo", n:"Abdulla Nooruddin Abdullanooruddin", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Director","board","v"]]},
  {id:"eyad_yusuf_sater", n:"Eyad Yusuf Sater", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Independent Director","board","v"]]},
  {id:"khalid_mohamad_mattar", n:"Khalid Mohamad Mattar", t:2, p:52, s:"industry", roles:[
    ["lst_nass","Independent Director","board","v"]]},
  {id:"mazen_mohamed_ahmed", n:"Mazen Mohamed Ahmed Matar", t:2, p:60, s:"industry", roles:[
    ["lst_nass","Chief Executive Officer","executive","v"]]},
  {id:"bassam_sami_awdi", n:"Bassam Sami Awdi", t:2, p:58, s:"industry", roles:[
    ["lst_nass","Chief Financial Officer","executive","v"]]},
  {id:"bashar_a_nass", n:"Bashar A Nass", t:2, p:46, s:"industry", roles:[
    ["lst_nass","General Manager","executive","v"]]},
  {id:"jon_mottram", n:"Jon Mottram", t:2, p:46, s:"industry", roles:[
    ["lst_nass","General Manager","executive","v"]]},
  {id:"yusuf_ahmed_isa", n:"Yusuf Ahmed Isa Nass", t:2, p:46, s:"industry", roles:[
    ["lst_nass","General Manager","executive","v"]]},
  {id:"nigel_barrie_hector", n:"Nigel Barrie Hector", t:2, p:46, s:"industry", roles:[
    ["lst_nass","General Manager","executive","v"]]},
  {id:"sunil_nair", n:"Sunil Nair", t:2, p:46, s:"industry", roles:[
    ["lst_nass","General Manager","executive","v"]]},
  {id:"sean_hickinson", n:"Sean Hickinson", t:2, p:46, s:"industry", roles:[
    ["lst_nass","Regional General Manager","executive","v"]]},
  {id:"hala_ali_yateem", n:"Hala Ali Yateem", t:2, p:62, s:"finance", roles:[
    ["nbb","Chairperson","board","v"]]},
  {id:"yusuf_abdulla_yusuf_b_b", n:"Yusuf Abdulla Yusuf Akber Alireza", t:2, p:62, s:"finance", roles:[
    ["nbb","Deputy Chairperson","board","v"]]},
  {id:"shaikh_rashid_bin", n:"Shaikh Rashid Bin Salman Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"]]},
  {id:"mohamed_farooq_yusuf_b", n:"Mohamed Farooq Yusuf Almoayed", t:2, p:52, s:"finance", roles:[
    ["nbb","Director","board","v"]]},
  {id:"gaby_el_hakim", n:"Gaby El Hakim", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Legal Officer & Corporate Secretary","executive","v"]]},
  {id:"mansour_abdulaziz_al", n:"Mansour Abdulaziz Al Saghayer", t:2, p:60, s:"finance", roles:[
    ["nbb","CEO - KSA","executive","v"]]},
  {id:"fatema_moosa_alalawi", n:"Fatema Moosa Alalawi", t:2, p:60, s:"finance", roles:[
    ["nbb","BISB - Chief Executive Officer","executive","v"]]},
  {id:"ameer_a_ghani_b", n:"Ameer A.Ghani Shaban", t:2, p:58, s:"finance", roles:[
    ["nbb","BISB- Chief Financial & Strategy Officer","executive","v"]]},
  {id:"shehab_fadhel", n:"Shehab Fadhel", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Regulatory Affairs","executive","v"]]},
  {id:"husain_hameed_baker", n:"Husain Hameed Baker", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Compliance Governance & Risk Conduct","executive","v"]]},
  {id:"esra_nezar_shakeeb", n:"Esra Nezar Shakeeb", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of AML & Sanctions","executive","v"]]},
  {id:"nada_abduljalil_almuhafda", n:"Nada Abduljalil Almuhafda", t:2, p:46, s:"finance", roles:[
    ["nbb","Head of Financial Reporting","executive","v"]]},
  {id:"mohammed_ebrahim_mahri", n:"Mohammed Ebrahim Mahri", t:2, p:58, s:"finance", roles:[
    ["nbb","Group Chief Credit Officer","executive","v"]]},
  {id:"shehzad_hakim", n:"Shehzad Hakim", t:2, p:46, s:"finance", roles:[
    ["nbb","Group Head of Risk MIS & Analytics","executive","v"]]},
  {id:"husain_ebrahim_albanna", n:"Husain Ebrahim Albanna", t:2, p:46, s:"finance", roles:[
    ["nbb","BISB-Head of Treasury","executive","v"]]},
  {id:"asma_alarayyedh", n:"Asma AlArayyedh", t:2, p:58, s:"finance", roles:[
    ["nbb","Manager- Legal Affairs","executive","v"]]},
  {id:"zeyad_yousif_deen", n:"Zeyad Yousif Deen", t:2, p:46, s:"finance", roles:[
    ["nbb","Senior Manager Compliance","executive","v"]]},
  {id:"maryam_radhi_ahmed", n:"Maryam Radhi Ahmed", t:2, p:58, s:"finance", roles:[
    ["nbb","Executive Assistant- GCEO Office","executive","v"]]},
  {id:"faisal_ahmed_al", n:"Faisal Ahmed Al Zayani", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_nhotel","Chairman","board","v"]]},
  {id:"adel_n_hamadah", n:"Adel N Hamadah", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_nhotel","Vice Chairman & Managing Director","executive","v"]]},
  {id:"abdulaziz_abdulla_alisa", n:"Abdulaziz Abdulla Alisa", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_nhotel","Chairman - Executive Committee","board","v"]]},
  {id:"abdul_rahman_ali", n:"Abdul Rahman Ali Morshed", t:2, p:62, s:"consumer_disc", roles:[
    ["lst_nhotel","Chairman- Audit & Corporate Governance Committee","board","v"]]},
  {id:"mishari_zaid_al", n:"Mishari Zaid Al Khalid", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_nhotel","Director","board","v"]]},
  {id:"ghazi_q_al", n:"Ghazi Q. Al-Nisf", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_nhotel","Director","board","v"]]},
  {id:"abdullah_al_nasrallah", n:"Abdullah Al-Nasrallah", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_nhotel","Director","board","v"]]},
  {id:"abdulla_jasim_ebrahim", n:"Abdulla Jasim Ebrahim Alahmed", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_nhotel","Director","board","v"]]},
  {id:"shehab_ahmed_mohamed", n:"Shehab Ahmed Mohamed Ali", t:2, p:52, s:"consumer_disc", roles:[
    ["lst_nhotel","Director","board","v"]]},
  {id:"zaher_mohammad_sulaiman", n:"Zaher Mohammad Sulaiman AlAjjawi", t:2, p:60, s:"consumer_disc", roles:[
    ["lst_nhotel","CEO","executive","v"]]},
  {id:"petr_dubsky", n:"Petr Dubsky", t:2, p:46, s:"consumer_disc", roles:[
    ["lst_nhotel","General Manager - Hotel","executive","v"]]},
  {id:"robin_thomas_thomas", n:"Robin Thomas Thomas", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_nhotel","Group Chief Accountant","executive","v"]]},
  {id:"mohammad_imran_saeed", n:"Mohammad Imran Saeed", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_nhotel","Manager- Financial Affairs","executive","v"]]},
  {id:"fatema_jaafar_ahmed", n:"Fatema Jaafar Ahmed Madan Talaq", t:2, p:58, s:"consumer_disc", roles:[
    ["lst_nhotel","Executive Secretary","executive","v"]]},
  {id:"h_e_shaikh", n:"H.E. Shaikh Khalid bin Mustahail Al Mashani", t:2, p:62, s:"finance", roles:[
    ["lst_salam","Chairman","board","v"]]},
  {id:"matar_mohamed_al", n:"Matar Mohamed Al Blooshi", t:2, p:62, s:"finance", roles:[
    ["lst_salam","Vice Chairman","board","v"]]},
  {id:"salman_saleh_al", n:"Salman Saleh Al Mahmeed", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"salim_abdullah_al", n:"Salim Abdullah Al Awadi", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"alhur_mohammed_alsuwaidi", n:"AlHur Mohammed AlSuwaidi", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"khalid_salim_mousa", n:"Khalid Salim Mousa Mubarak Al Halyan", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"zayed_ali_rashid", n:"Zayed Ali Rashid Al Amin", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"hisham_saleh_al", n:"Hisham Saleh Al Saie", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"ahmed_habib_ahmed", n:"Ahmed Habib Ahmed Kassim", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"],
    ["lst_seef","Director","board","v"]]},
  {id:"tareq_al_aujaili", n:"Tareq Al Aujaili", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Board Member","board","v"]]},
  {id:"shaikh_adnan_al", n:"Shaikh Adnan Al Qattan", t:2, p:62, s:"finance", roles:[
    ["lst_salam","Shari'a Chairman","board","v"]]},
  {id:"dr_fareed_yaqoub", n:"Dr Fareed Yaqoub Al Meftah", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Shari'a Board Member","board","v"]]},
  {id:"dr_nizam_mohammed", n:"Dr Nizam Mohammed Yaquby", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Shari'a Board Member","board","v"]]},
  {id:"dr_osama_mohamed", n:"Dr. Osama Mohamed Bahar", t:2, p:52, s:"finance", roles:[
    ["lst_salam","Shari'a Board Member","board","v"]]},
  {id:"rafik_nayed", n:"Rafik Nayed", t:2, p:60, s:"finance", roles:[
    ["lst_salam","Chief Executive Officer","executive","v"]]},
  {id:"anwar_murad", n:"Anwar Murad", t:2, p:60, s:"finance", roles:[
    ["lst_salam","Deputy CEO","executive","v"]]},
  {id:"dr_mohammed_burhan", n:"Dr. Mohammed Burhan Arbuna", t:2, p:46, s:"finance", roles:[
    ["lst_salam","EVP, Head of Sharia","executive","v"]]},
  {id:"yusuf_abdulla_mohamed", n:"Yusuf Abdulla Mohamed Alkhan", t:2, p:46, s:"finance", roles:[
    ["lst_salam","EVP-IT Intrgration","executive","v"]]},
  {id:"mohammed_hasan_janahi", n:"Mohammed Hasan Janahi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Executive Vice President, Retail Banking","executive","v"]]},
  {id:"hasan_mohamed_alkaabi", n:"Hasan Mohamed AlKaabi", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Deputy Head of Compliance","executive","v"]]},
  {id:"ahmed_abdulla_saif", n:"Ahmed Abdulla Saif", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Strategy & Planning","executive","v"]]},
  {id:"eihab_abd_alatif", n:"Eihab Abd Alatif Osman Ahmed", t:2, p:62, s:"finance", roles:[
    ["lst_salam","Group Chief Legal Officer, Corporate Secretary and Advisor to Chairman","executive","v"]]},
  {id:"ali_yousif_al", n:"Ali Yousif Al Khaja", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Compliance & MLRO","executive","v"]]},
  {id:"rashed_khaled_al", n:"Rashed Khaled Al Khan", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Wealth Management","executive","v"]]},
  {id:"yusuf_ahmed_ebrahim", n:"Yusuf Ahmed Ebrahim Hasan", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Group Chief Financial Officer","executive","v"]]},
  {id:"haitham_alhaddad", n:"Haitham AlHaddad", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Digital Channels","executive","v"]]},
  {id:"hamed_yousef_mashal", n:"Hamed Yousef Mashal", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Real Estate and Investments","executive","v"]]},
  {id:"hussain_ali_abdulhaq", n:"Hussain Ali Abdulhaq", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Treasury & Financial Market","executive","v"]]},
  {id:"qasim_haji_mohamed", n:"Qasim Haji Mohamed Taqawi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","General Counsel","executive","v"]]},
  {id:"abdulkarim_turki", n:"AbdulKarim Turki", t:2, p:58, s:"finance", roles:[
    ["lst_salam","COO","executive","v"]]},
  {id:"don_hemantha_wijesinghe", n:"Don Hemantha Wijesinghe", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Chief Technology Officer","executive","v"]]},
  {id:"muna_al_balooshi", n:"Muna Al Balooshi", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of HR & Administration","executive","v"]]},
  {id:"ali_qassim", n:"Ali Qassim", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Private Banking","executive","v"]]},
  {id:"mohammed_buhijji", n:"Mohammed Buhijji", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Retail","executive","v"]]},
  {id:"sameh_mohamed_fadhel", n:"Sameh Mohamed Fadhel Ahmed Mahmandar", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Finance","executive","v"]]},
  {id:"mahmood_abdulredha_qannati", n:"Mahmood Abdulredha Qannati", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Marketing & Communications","executive","v"]]},
  {id:"ahmed_murad", n:"Ahmed Murad", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Head of Corporate Banking","executive","v"]]},
  {id:"krishnan_hariharan", n:"Krishnan Hariharan", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Chief Risk Officer","executive","v"]]},
  {id:"zuhair_maki_abdulla", n:"Zuhair Maki Abdulla", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Manager - Risk MIS","executive","v"]]},
  {id:"majed_merza_abdulhusain", n:"Majed Merza Abdulhusain", t:2, p:58, s:"finance", roles:[
    ["lst_salam","AVP- Risk MIS","executive","v"]]},
  {id:"ousama_beshara_elya", n:"Ousama Beshara Elya Nusseir", t:2, p:58, s:"finance", roles:[
    ["lst_salam","COO Private Banking","executive","v"]]},
  {id:"ayman_matter_al", n:"Ayman Matter Al Mahari", t:2, p:46, s:"finance", roles:[
    ["lst_salam","SVP-Treasury & Capital Markets","executive","v"]]},
  {id:"ahmed_abdulshaheed_salman", n:"Ahmed Abdulshaheed Salman Bin Jamal", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Senior Manager-Marketing & Communication","executive","v"]]},
  {id:"omran_ebrahim_abbas", n:"Omran Ebrahim Abbas AlBalooshi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","AVP - Shari'a Compliance","executive","v"]]},
  {id:"abdulla_almedfaa", n:"Abdulla Almedfaa", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Senior Manager- Strategy and Planning","executive","v"]]},
  {id:"fatima_mandi", n:"Fatima Mandi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Manager-Finance","executive","v"]]},
  {id:"maryam_ahmed_albahar", n:"Maryam Ahmed Albahar", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Manager- Finance","executive","v"]]},
  {id:"yusuf_abdulla_hamza", n:"Yusuf Abdulla Hamza Janahi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Manager- Marketing & Communications","executive","v"]]},
  {id:"mariam_al_hashimi", n:"Mariam Al Hashimi", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Manager - Finance","executive","v"]]},
  {id:"seema_kooheji", n:"Seema Kooheji", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Senior Manager- Board Secertary Office","executive","v"]]},
  {id:"mahmood_abdulla", n:"Mahmood Abdulla", t:2, p:58, s:"finance", roles:[
    ["lst_salam","AVP - Strategy & Planning","executive","v"]]},
  {id:"abdulrahman_abdulla_khalil", n:"Abdulrahman Abdulla Khalil", t:2, p:46, s:"finance", roles:[
    ["lst_salam","Senior Manager","executive","v"]]},
  {id:"sadeq_mohamed_ali", n:"Sadeq Mohamed Ali Shaikh Hasan", t:2, p:46, s:"finance", roles:[
    ["lst_salam","EVP - Head Of Intl Banking","executive","v"]]},
  {id:"sanjeev_srinivasan", n:"Sanjeev Srinivasan", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Vice President - Finance","executive","v"]]},
  {id:"ahmed_buqais", n:"Ahmed Buqais", t:2, p:58, s:"finance", roles:[
    ["lst_salam","Vice President","executive","v"]]},
  {id:"praburajan_chandrasekaran", n:"Praburajan Chandrasekaran", t:2, p:46, s:"finance", roles:[
    ["lst_salam","VP - Finance","executive","v"]]},
  {id:"ankit_nalin_saraf", n:"Ankit Nalin Saraf", t:2, p:46, s:"finance", roles:[
    ["lst_salam","VP - Finance","executive","v"]]},
  {id:"muhammad_urooj_riaz", n:"Muhammad Urooj Riaz", t:2, p:46, s:"finance", roles:[
    ["lst_salam","VP - Finance","executive","v"]]},
  {id:"essa_mohamed_yusuf", n:"Essa Mohamed Yusuf Najibi", t:2, p:62, s:"realestate", roles:[
    ["lst_seef","Chairman","board","v"]]},
  {id:"mohamed_ebrahim_mohamed_b", n:"Mohamed Ebrahim Mohamed Al Bastaki", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"sattam_suleiman_abdulmohsen", n:"Sattam Suleiman Abdulmohsen Al Gosaibi", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"majed_abdulla_mohamed", n:"Majed Abdulla Mohamed Al Khan", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"zayed_ali_rashed", n:"Zayed Ali Rashed Alamin", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"anwar_mohamed_ali", n:"Anwar Mohamed Ali Murad", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"sahar_rashed_al", n:"Sahar Rashed Al Mannai", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"ahmed_fouad_almutawa", n:"Ahmed Fouad Almutawa", t:2, p:52, s:"realestate", roles:[
    ["lst_seef","Director","board","v"]]},
  {id:"ahmed_yusuf_abdulla", n:"Ahmed Yusuf Abdulla Yusuf", t:2, p:60, s:"realestate", roles:[
    ["lst_seef","Chief Executive Officer","executive","v"]]},
  {id:"yusuf_ahmed_mustafa", n:"Yusuf Ahmed Mustafa", t:2, p:58, s:"realestate", roles:[
    ["lst_seef","Chief Technical Officer","executive","v"]]},
  {id:"mohamed_ahmed_mohamed", n:"Mohamed Ahmed Mohamed Baqi Mohamed", t:2, p:58, s:"realestate", roles:[
    ["lst_seef","Chief Financial Officer","executive","v"]]},
  {id:"duaij_al_rumaihi", n:"Duaij Al Rumaihi", t:2, p:58, s:"realestate", roles:[
    ["lst_seef","Chief Commercial Officer","executive","v"]]},
  {id:"fahad_abdulaziz_al", n:"Fahad Abdulaziz Al Abbasi", t:2, p:46, s:"realestate", roles:[
    ["lst_seef","Senior Manager - Internal Audit","executive","v"]]},
  {id:"feras_ahmed", n:"Feras Ahmed", t:2, p:60, s:"industry", roles:[
    ["lst_silah","CEO","executive","v"]]},
  {id:"bimalendu_shanker", n:"Bimalendu Shanker", t:2, p:58, s:"industry", roles:[
    ["lst_silah","CFO","executive","v"]]},
  {id:"abdulrahman_benshams", n:"Abdulrahman Benshams", t:2, p:58, s:"industry", roles:[
    ["lst_silah","COO","executive","v"]]},
  {id:"isa_ishaq", n:"Isa Ishaq", t:2, p:58, s:"industry", roles:[
    ["lst_silah","Director of Operations","executive","v"]]},
  {id:"noor_bubshait", n:"Noor Bubshait", t:2, p:58, s:"industry", roles:[
    ["lst_silah","Director of Business Development and Marketing","executive","v"]]},
  {id:"hussain_al_fardan", n:"Hussain Al Fardan", t:2, p:58, s:"industry", roles:[
    ["lst_silah","Director of Operations","executive","v"]]},
  {id:"dheya_al_shakar", n:"Dheya Al Shakar", t:2, p:58, s:"industry", roles:[
    ["lst_silah","Director of Human Resources","executive","v"]]},
  {id:"ashraf_adnan_nureddin", n:"Ashraf Adnan Nureddin Bseisu", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"tariq_abdulhafidh_al", n:"Tariq Abdulhafidh Al Aujaili", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"anwar_mohamed_murad", n:"Anwar Mohamed Murad", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"nawaf_faisal_al", n:"Nawaf Faisal Al Hamar", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"ahmed_habib_kassim", n:"Ahmed Habib Kassim", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"fawaz_fuad_ebrahim", n:"Fawaz Fuad Ebrahim Kanoo", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Board Member","board","v"]]},
  {id:"jawad_mohammed", n:"Jawad Mohammed", t:2, p:60, s:"finance", roles:[
    ["lst_solid","Chief Executive Officer","executive","v"]]},
  {id:"ebrahim_alawadhi", n:"Ebrahim Alawadhi", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Secretary to the Board of Directors","executive","v"]]},
  {id:"enas_asiri", n:"Enas Asiri", t:2, p:60, s:"finance", roles:[
    ["lst_solid","Deputy Chief Executive Officer - Life & Medical","executive","v"]]},
  {id:"amer_janahi", n:"Amer Janahi", t:2, p:60, s:"finance", roles:[
    ["lst_solid","Deputy Chief Executive Officer - Corporate Support","executive","v"]]},
  {id:"jai_prakash", n:"Jai Prakash", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Business Development Officer","executive","v"]]},
  {id:"sanjeev_aggarwal", n:"Sanjeev Aggarwal", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Financial Officer","executive","v"]]},
  {id:"hussain_sabt", n:"Hussain Sabt", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Innovation & Strategy Officer","executive","v"]]},
  {id:"ali_shaban", n:"Ali Shaban", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Motor Insurance Officer","executive","v"]]},
  {id:"yasmeen_ameeri", n:"Yasmeen Ameeri", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief General Insurance Officer","executive","v"]]},
  {id:"rashid_turk", n:"Rashid Turk", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Medical Operations Officer Solidarity Bahrain B.S.C","executive","v"]]},
  {id:"eman_alghannami", n:"Eman Alghannami", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Medical Underwriting Officer","executive","v"]]},
  {id:"omar_alaseeri", n:"Omar Alaseeri", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Chief Life Insurance Officer","executive","v"]]},
  {id:"shaikh_dr_osama", n:"Shaikh Dr. Osama Bahar", t:2, p:62, s:"finance", roles:[
    ["lst_solid","Shari'a Chairman","board","v"]]},
  {id:"shaikh_abdul_nasser", n:"Shaikh Abdul Nasser Al Mahmood", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Shari'a Board Member","board","v"]]},
  {id:"shaikh_mohsin_a", n:"Shaikh Mohsin A. Hussain Al Asfoor", t:2, p:52, s:"finance", roles:[
    ["lst_solid","Shari'a Board Member","board","v"]]},
  {id:"layla_mukhtar", n:"Layla Mukhtar", t:2, p:46, s:"finance", roles:[
    ["lst_solid","Head of Internal Audit","executive","v"]]},
  {id:"abdulla_albasteki", n:"Abdulla AlBasteki", t:2, p:46, s:"finance", roles:[
    ["lst_solid","Head of Compliance, Legal & MLRO","executive","v"]]},
  {id:"ali_khalil", n:"Ali Khalil", t:2, p:46, s:"finance", roles:[
    ["lst_solid","Senior Manager - Finance","executive","v"]]},
  {id:"safa_isa", n:"Safa Isa", t:2, p:46, s:"finance", roles:[
    ["lst_solid","Compliance Senior Manager & DMLRO","executive","v"]]},
  {id:"muna_almarzooq", n:"Muna Almarzooq", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Deputy Manager - Corporate Communications","executive","v"]]},
  {id:"husain_moosa", n:"Husain Moosa", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Deputy Manager - Investments","executive","v"]]},
  {id:"jasim_alrowaiei", n:"Jasim Alrowaiei", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Manager - Risk Management","executive","v"]]},
  {id:"reem_aldoseri", n:"Reem Aldoseri", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Coordinator - Corporate Governance and Board Secretariat","executive","v"]]},
  {id:"zohair_ayyad", n:"Zohair Ayyad", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Deputy Manager - Finance","executive","v"]]},
  {id:"mohsin_ali", n:"Mohsin Ali", t:2, p:46, s:"finance", roles:[
    ["lst_solid","VP - Finance","executive","v"]]},
  {id:"hassan_ahmed", n:"Hassan Ahmed", t:2, p:58, s:"finance", roles:[
    ["lst_solid","Deputy Manager - Finance","executive","v"]]},
  {id:"ebrahim_zainal", n:"Ebrahim Zainal", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_trafco","Chairman","board","v"]]},
  {id:"yousuf_alsaleh", n:"Yousuf Alsaleh", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_trafco","Vice-Chairman","board","v"]]},
  {id:"jehad_yousuf_amin", n:"Jehad Yousuf Amin", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"sami_mohammed_jalal", n:"Sami Mohammed Jalal", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"abdulredha_aldailami", n:"Abdulredha Aldailami", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"ebrahim_salahuddin_ahmed", n:"Ebrahim Salahuddin Ahmed", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"fuad_ebrahim_kanoo", n:"Fuad Ebrahim Kanoo", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"sofyan_khalid_almoayed", n:"Sofyan Khalid Almoayed", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"abdulla_esam_fakhro", n:"Abdulla Esam Fakhro", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"faisal_mohammed_engineer", n:"Faisal Mohammed Engineer", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_trafco","Director","board","v"]]},
  {id:"azzam_mohammed_amin", n:"Azzam Mohammed Amin Moutragi", t:2, p:60, s:"consumer_stap", roles:[
    ["lst_trafco","Group Chief Executive Officer","executive","v"]]},
  {id:"fatima_asghar_bushihri", n:"Fatima Asghar Bushihri", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_trafco","Board Secretary & Compliance & Corporate Governance Officer","executive","v"]]},
  {id:"ashwaq_abdulla_sahel", n:"Ashwaq Abdulla Sahel", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_trafco","Executive Secretary","executive","v"]]},
  {id:"shaikh_adana_naser", n:"Shaikh Adana Naser Sabah Al Sabah", t:2, p:62, s:"finance", roles:[
    ["lst_ugh","Chairman","board","v"]]},
  {id:"masaud_m_j", n:"Masaud M.J. Hayat", t:2, p:62, s:"finance", roles:[
    ["lst_ugh","Vice Chairman","board","v"]]},
  {id:"he_abdelkarim_alawi", n:"HE. Abdelkarim Alawi Saleh Kabariti", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"samer_mohammad_imad", n:"Samer Mohammad Imad Abbouchi", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"moustapha_samir_chami", n:"Moustapha Samir Chami", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"mohammed_haroon", n:"Mohammed Haroon", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"mubarak_m_al", n:"Mubarak M. Al Maskati", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"sadoun_a_h", n:"Sadoun A H Ali", t:2, p:52, s:"finance", roles:[
    ["lst_ugh","Director","board","v"]]},
  {id:"hussain_lalani", n:"Hussain Lalani", t:2, p:60, s:"finance", roles:[
    ["lst_ugh","CEO","executive","v"]]},
  {id:"nirmal_parik", n:"Nirmal Parik", t:2, p:58, s:"finance", roles:[
    ["lst_ugh","Chief Financial Officer & Head of Investments","executive","v"]]},
  {id:"hesham_sulaiman_hasan", n:"Hesham Sulaiman Hasan", t:2, p:58, s:"finance", roles:[
    ["lst_ugh","Chief Compliance Officer, MLRO & Corporate Secretary","executive","v"]]},
  {id:"wadeea_majeed_hasan", n:"Wadeea Majeed Hasan Abdulla Sultan", t:2, p:46, s:"finance", roles:[
    ["lst_ugh","Head of Human Resources & Administration","executive","v"]]},
  {id:"osamah_othman_al", n:"Osamah Othman Al Furaih", t:2, p:62, s:"comm", roles:[
    ["lst_zainbh","Vice Chairman","board","v"]]},
  {id:"bader_nasser_alkharafi", n:"Bader Nasser Alkharafi", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Board Member","board","v"]]},
  {id:"yousef_alabdulrazzaq", n:"Yousef Alabdulrazzaq", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Board Member","board","v"]]},
  {id:"shaikh_rashid_bin_b", n:"Shaikh Rashid bin Abdulrahman Al Khalifa", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Board Member","board","v"]]},
  {id:"ali_hasan_ali", n:"Ali Hasan Ali Al Khaja", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Board Member","board","v"]]},
  {id:"nasser_al_harthy", n:"Nasser Al Harthy", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Board Member","board","v"]]},
  {id:"mohammed_abdulla_zainalabedi", n:"Mohammed Abdulla Zainalabedin", t:2, p:60, s:"comm", roles:[
    ["lst_zainbh","Managing Director","executive","v"]]},
  {id:"rana_a_aziz", n:"Rana A.Aziz Ghuloom Mohamed Abdulla Almajed", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Human Resources Officer","executive","v"]]},
  {id:"shereen_khaled_saeed", n:"Shereen Khaled Saeed Abdulla Al Aliwat", t:2, p:46, s:"comm", roles:[
    ["lst_zainbh","Senior Manager, Treasury","executive","v"]]},
  {id:"nayef_abdulaziz_alalawi", n:"Nayef Abdulaziz Alalawi", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Senior Director, B2B and Government Sales","executive","v"]]},
  {id:"safwan_zain", n:"Safwan Zain", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Senior Director, B2B Product, Solutions and ICT- B2B and Wholesale","executive","v"]]},
  {id:"hussain_alaswad", n:"Hussain Alaswad", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Director Digital, Data and Analytics","board","v"]]},
  {id:"amar_abdulrahman_buali", n:"Amar Abdulrahman Buali", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Director- Access Network , IP , Cyber Security and Facilities Management","executive","v"]]},
  {id:"mohammed_habib_marhoon", n:"Mohammed Habib Marhoon", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Director, Consumer Products & Services","executive","v"]]},
  {id:"nadia_jabur", n:"Nadia Jabur", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Director, Legal & Compliance","executive","v"]]},
  {id:"ibrahim_shibli_ibrahim", n:"Ibrahim Shibli Ibrahim Dababneh", t:2, p:52, s:"comm", roles:[
    ["lst_zainbh","Director Financial Planning and Business Assurance","board","v"]]},
  {id:"ali_darwish_ghuloom", n:"Ali Darwish Ghuloom", t:2, p:46, s:"comm", roles:[
    ["lst_zainbh","Senior Manager, Research and Strategy","executive","v"]]},
  {id:"ashvin_verghese", n:"Ashvin Verghese", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Director, Financial Operations","executive","v"]]},
  {id:"iyadh_borgi", n:"Iyadh Borgi", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Financial Officer","executive","v"]]},
  {id:"ali_ahmed_mustafa", n:"Ali Ahmed Mustafa", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief B2B &Wholesales Officer","executive","v"]]},
  {id:"shaikh_abdulla_khaled", n:"Shaikh Abdulla Khaled Alkhalifa", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Communications& Investor Relations Officer","executive","v"]]},
  {id:"ammar_al_ketbi", n:"Ammar Al Ketbi", t:2, p:60, s:"comm", roles:[
    ["lst_zainbh","Acting Chief Executive Officer","executive","v"]]},
  {id:"abdulla_yusuf_salmeen", n:"Abdulla Yusuf Salmeen", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Customer Care Officer","executive","v"]]},
  {id:"mohamed_abdulazizi_alalawi", n:"Mohamed Abdulazizi Alalawi", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Strategy & Data Analytics Officer","executive","v"]]},
  {id:"ali_isa_jasim", n:"Ali Isa Jasim Alyaham", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Technology Officer","executive","v"]]},
  {id:"nadeya_ahmed_aqeel", n:"Nadeya Ahmed Aqeel Mohamed Al Awadhi", t:2, p:58, s:"comm", roles:[
    ["lst_zainbh","Chief Legal, Regulatory & Compliance Officer","executive","v"]]},
  {id:"shaikh_abdulla_saleh", n:"Shaikh Abdulla Saleh Kamel", t:2, p:62, s:"finance", roles:[
    ["lst_barka","Chairman","board","v"]]},
  {id:"mohamed_ebrahim_alshroogi", n:"Mohamed Ebrahim Alshroogi", t:2, p:62, s:"finance", roles:[
    ["lst_barka","Vice Chairman","board","v"]]},
  {id:"musa_abdelaziz_shehadeh", n:"Musa AbdelAziz Shehadeh", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"masood_ahmed_albastaki", n:"Masood Ahmed AlBastaki", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"dalia_hazem_khorshid", n:"Dalia Hazem Khorshid", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"naser_mohamed_al", n:"Naser Mohamed Al Nuwais", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"fahd_ibrahim_almufarrij", n:"Fahd Ibrahim AlMufarrij", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"ziad_ahmed_bahaaeldin", n:"Ziad Ahmed Bahaaeldin", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board Member","board","v"]]},
  {id:"abdulelah_sabbahi", n:"AbdulElah Sabbahi", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board member","board","v"]]},
  {id:"saud_saleh_alsaleh", n:"Saud Saleh Alsaleh", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board member","board","v"]]},
  {id:"dr_khalid_abdulla", n:"Dr. Khalid Abdulla Mohamed Ateeq", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board member","board","v"]]},
  {id:"tawfig_shaikh_mohamed", n:"Tawfig Shaikh Mohamed Mufti", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Board member","board","v"]]},
  {id:"houssem_ben_haj", n:"Houssem Ben Haj Amor", t:2, p:60, s:"finance", roles:[
    ["lst_barka","Group Chief Executive Officer and Board Member","executive","v"]]},
  {id:"wajeeha_husain_ramadhan", n:"Wajeeha Husain Ramadhan Awadh", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Chief Digital Officeer","executive","v"]]},
  {id:"azhar_aziz_dogar", n:"Azhar Aziz Dogar", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Chief Risk Officer","executive","v"]]},
  {id:"mohsin_ghulam_dashti", n:"Mohsin Ghulam Dashti", t:2, p:46, s:"finance", roles:[
    ["lst_barka","Head of Operations & Support Department","executive","v"]]},
  {id:"suhail_tohami_abdulmutaleb", n:"Suhail Tohami AbdulMutaleb Tohami", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Senior Vice President - Head of Treasury and Investment","executive","v"]]},
  {id:"abdulmalek_shehadeh_ibrahim", n:"Abdulmalek Shehadeh Ibrahim Mezher", t:2, p:46, s:"finance", roles:[
    ["lst_barka","SVP Head of Compliance, Governance & Board Affairs","executive","v"]]},
  {id:"el_tigani_el", n:"El Tigani El Tayeb Mohammed", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Vice President Sharia Officer, Secretary of the Unified Sharia Board","board","v"]]},
  {id:"ahmed_mahmood_abdulghaffar", n:"Ahmed Mahmood AbdulGhaffar", t:2, p:58, s:"finance", roles:[
    ["lst_barka","First Vice President -Investors Relations","executive","v"]]},
  {id:"adel_ateyah_hasan", n:"Adel Ateyah Hasan Basha", t:2, p:58, s:"finance", roles:[
    ["lst_barka","First Vice President -Legal","executive","v"]]},
  {id:"aliasgar_shabbirhusein_manda", n:"AliAsgar ShabbirHusein Mandasorwala", t:2, p:58, s:"finance", roles:[
    ["lst_barka","First Vice President -Head of Finance","executive","v"]]},
  {id:"mohamed_mustapha_khemira", n:"Mohamed Mustapha Khemira", t:2, p:58, s:"finance", roles:[
    ["lst_barka","First Vice President- Head of Strategic Planning","executive","v"]]},
  {id:"mohammed_alalawi", n:"Mohammed AlAlawi", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Senior Vice President- Internal Audit","executive","v"]]},
  {id:"abdulla_talal_alqannas", n:"Abdulla Talal Alqannas", t:2, p:46, s:"finance", roles:[
    ["lst_barka","VP - Finance","executive","v"]]},
  {id:"ali_adel_husain", n:"Ali Adel Husain", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Deputy Manager","executive","v"]]},
  {id:"ali_abbas_almualem", n:"Ali Abbas AlMualem", t:2, p:58, s:"finance", roles:[
    ["lst_barka","Manager - Finance Department","executive","v"]]},
  {id:"yousif_h_khalawi", n:"Yousif H. Khalawi", t:2, p:52, s:"finance", roles:[
    ["lst_barka","Sharia Supervisory member, Compliance and Government","board","v"]]},
  {id:"mohamed_abdulaziz_mohamed", n:"Mohamed Abdulaziz Mohamed Jamsheer", t:2, p:58, s:"finance", roles:[
    ["lst_barka","First Vice President- Acting Head of IT","executive","v"]]},
  {id:"basim_mohamed_ahmed", n:"Basim Mohamed Ahmed Al Saie", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_bfm","Chairman","board","v"]]},
  {id:"salah_m_m", n:"Salah M M A Alkulaib", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_bfm","Vice-Chairman","board","v"]]},
  {id:"ayman_abdulhameed_zainal", n:"Ayman Abdulhameed Zainal Mohamed Zainal", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_bfm","Board Member","board","v"]]},
  {id:"ahmed_mazhar_ui", n:"Ahmed Mazhar UI Haq", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_bfm","Board Member","board","v"]]},
  {id:"mohamed_sadiq_al", n:"Mohamed Sadiq Al Rahma", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_bfm","Board Member","board","v"]]},
  {id:"ali_shawki_ali", n:"Ali Shawki Ali Fakhroo", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_bfm","Board Member","board","v"]]},
  {id:"raghdan_saleh_qasim", n:"Raghdan Saleh Qasim Abdulrasool", t:2, p:52, s:"consumer_stap", roles:[
    ["lst_bfm","Board Member","board","v"]]},
  {id:"ahmed_jasim_ali", n:"Ahmed Jasim Ali Isa Baqer", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_bfm","Administation Affairs Executive Manager / Board Secretary","executive","v"]]},
  {id:"wayne_henry_craig", n:"Wayne Henry Craig", t:2, p:60, s:"consumer_stap", roles:[
    ["lst_bfm","Chief Executive Officer","executive","v"]]},
  {id:"ayman_ahmed_dawood", n:"Ayman Ahmed Dawood Karim", t:2, p:46, s:"consumer_stap", roles:[
    ["lst_bfm","Finance Senior Manager","executive","v"]]},
  {id:"khalifa_hassan_khalifa", n:"Khalifa Hassan Khalifa Al Jalahma", t:2, p:62, s:"industry", roles:[
    ["lst_cpark","Chairman","board","v"]]},
  {id:"areej_abdulla_abdulghaffar_b", n:"Areej Abdulla Abdulghaffar Abdulla", t:2, p:62, s:"industry", roles:[
    ["lst_cpark","Vice Chairman","board","v"]]},
  {id:"fahad_abdulrahman_mohammed", n:"Fahad Abdulrahman Mohammed AlSaad", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"badriah_bader_jassim", n:"Badriah Bader Jassim Alyacoub", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"marwa_khalid_ebrahim", n:"Marwa Khalid Ebrahim Alsabbagh", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"hasan_bader_ahmed", n:"Hasan Bader Ahmed Kaiksow", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"salah_yousuf_salahuddin", n:"Salah Yousuf Salahuddin Ebrahim", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"mohamed_rasheed_mohamed", n:"Mohamed Rasheed Mohamed Almaraj", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"naser_khaled_a", n:"Naser Khaled A.Rahman Alraee", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"sarah_abduljabbar_mohammed", n:"Sarah Abduljabbar Mohammed Alabbasi", t:2, p:52, s:"industry", roles:[
    ["lst_cpark","Director","board","v"]]},
  {id:"tariq_ali_husain", n:"Tariq Ali Husain Aljowder", t:2, p:60, s:"industry", roles:[
    ["lst_cpark","Chief Executive Officer","executive","v"]]},
  {id:"hasan_ali_abdulnabi", n:"Hasan Ali Abdulnabi Isa AlShalaa", t:2, p:58, s:"industry", roles:[
    ["lst_cpark","Finance Director","executive","v"]]},
  {id:"abdulla_isa_amralla", n:"Abdulla Isa Amralla Qudrat", t:2, p:58, s:"industry", roles:[
    ["lst_cpark","Senior Director -Business Development & Operations","executive","v"]]},
  {id:"ehsan_ali_mohamed", n:"Ehsan Ali Mohamed Abdulla AlKooheji", t:2, p:58, s:"industry", roles:[
    ["lst_cpark","IT Director","executive","v"]]},
  {id:"rahma_ali_shaker", n:"Rahma Ali Shaker Husain Altawash", t:2, p:58, s:"industry", roles:[
    ["lst_cpark","Manager- Board Secretary/ Corporate Governance","executive","v"]]},
  {id:"dr_nedham_mohamed", n:"Dr. Nedham Mohamed Yaqoobi", t:2, p:62, s:"realestate", roles:[
    ["lst_ebrit","Chairman of Shari a Supervisory Board","board","v"]]},
  {id:"dr_abdulaziz_alqassar", n:"Dr. Abdulaziz AlQassar", t:2, p:62, s:"realestate", roles:[
    ["lst_ebrit","Vice Chairman of Shari a Supervisory Board","board","v"]]},
  {id:"wajdi_yousif_ebrahim", n:"Wajdi Yousif Ebrahim Aljallad", t:2, p:52, s:"realestate", roles:[
    ["lst_ebrit","Board Member of Issuer and Trustee","board","v"]]},
  {id:"nandakumar_narasimhan", n:"Nandakumar Narasimhan", t:2, p:52, s:"realestate", roles:[
    ["lst_ebrit","Board Member of Issuer and Trustee","board","v"]]},
  {id:"muhammad_saeed_butt", n:"Muhammad Saeed Butt", t:2, p:52, s:"realestate", roles:[
    ["lst_ebrit","Board Member of issuer and AGM financial controller of Investment Manager","board","v"]]},
  {id:"guruparan_kumarasamy", n:"Guruparan Kumarasamy", t:2, p:52, s:"realestate", roles:[
    ["lst_ebrit","Board Member of Trustee","board","v"]]},
  {id:"peter_j_griffiths", n:"Peter J Griffiths", t:2, p:52, s:"realestate", roles:[
    ["lst_ebrit","Board Member of Trustee","board","v"]]},
  {id:"yogesh_raghavendra", n:"Yogesh Raghavendra", t:2, p:58, s:"realestate", roles:[
    ["lst_ebrit","Director of Trustee","executive","v"]]},
  {id:"ahmad_karim_tayara", n:"Ahmad Karim Tayara", t:2, p:58, s:"realestate", roles:[
    ["lst_ebrit","Chief Business Officer","executive","v"]]},
  {id:"fatima_habib_al", n:"Fatima Habib Al Ansari", t:2, p:46, s:"realestate", roles:[
    ["lst_ebrit","Senior Manager","executive","v"]]},
  {id:"abrar_ali_alabdulqader", n:"Abrar Ali Alabdulqader", t:2, p:58, s:"realestate", roles:[
    ["lst_ebrit","Manager - Shariaa Compliance Review","executive","v"]]},
  {id:"mark_gravener", n:"Mark Gravener", t:2, p:46, s:"realestate", roles:[
    ["lst_ebrit","Head of Property & Facility Management","executive","v"]]},
  {id:"mustafa_yaqoob", n:"Mustafa Yaqoob", t:2, p:58, s:"realestate", roles:[
    ["lst_ebrit","Coordinator - House Me Broker W.L.L","executive","v"]]},
  {id:"esam_abdul_hameed", n:"Esam Abdul Hameed Zainal", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_poltry","Chairman","board","v"]]},
  {id:"abdulla_jasim_al", n:"Abdulla Jasim Al Ahmed", t:2, p:62, s:"consumer_stap", roles:[
    ["lst_poltry","Vice Chairman","board","v"]]},
  {id:"abdulredha_mohamed_al", n:"Abdulredha Mohamed Al Daylami", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"talal_mohamed_almanai", n:"Talal Mohamed Almanai", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"shaikh_rashid_khalifa", n:"Shaikh Rashid Khalifa Al Khalifa", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"rana_fouad_al", n:"Rana Fouad Al Mutawa", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"ali_shawki_fakhro", n:"Ali Shawki Fakhro", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"abdulhameed_mohamed_dawani", n:"Abdulhameed Mohamed Dawani", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"basel_yusuf_al", n:"Basel Yusuf Al Saleh", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Director","executive","v"]]},
  {id:"abdul_hadi_mirza", n:"Abdul Hadi Mirza Jaafar", t:2, p:60, s:"consumer_stap", roles:[
    ["lst_poltry","CEO","executive","v"]]},
  {id:"aatef_al_saleh", n:"Aatef Al Saleh", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","COO","executive","v"]]},
  {id:"alya_saeed_al", n:"Alya Saeed Al Khayat", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Board Secretary- Compliance Officer","executive","v"]]},
  {id:"ali_marhoon_ali", n:"Ali Marhoon Ali Marhoon Jasim", t:2, p:58, s:"consumer_stap", roles:[
    ["lst_poltry","Finance Director","executive","v"]]},
  {id:"hassan_khalifa_al", n:"Hassan Khalifa Al Jalahma", t:2, p:62, s:"finance", roles:[
    ["cbb","Chairman","board","v"]]},
  {id:"khalid_ebrahim_humaidan", n:"Khalid Ebrahim Humaidan", t:2, p:52, s:"finance", roles:[
    ["cbb","Board Member","board","v"]]},
  {id:"yousef_abdullah_humood", n:"Yousef Abdullah Humood", t:2, p:52, s:"finance", roles:[
    ["cbb","Board Member","board","v"]]},
  {id:"shaikha_mai_bint", n:"Shaikha Mai Bint Mohammed Al Khalifa", t:2, p:52, s:"finance", roles:[
    ["cbb","Board Member","board","v"]]},
  {id:"ahmed_mohamed_buhejji", n:"Ahmed Mohamed Buhejji", t:2, p:52, s:"finance", roles:[
    ["cbb","Board Member","board","v"]]},
  {id:"amaal_ahmed_al", n:"Amaal Ahmed Al Abbasi", t:2, p:52, s:"finance", roles:[
    ["cbb","Board Member","board","v"]]},
];

const OWNERSHIP = [
  ["cabinet_bh","bhgov","governs under"],
  ["mofin_bh","cabinet_bh"],["mofa_bh","cabinet_bh"],
  ["moi_bh","cabinet_bh"],["moic_bh","cabinet_bh"],["mtt_bh","cabinet_bh"],["moo_bh","cabinet_bh"],["moh_bh","cabinet_bh"],
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
