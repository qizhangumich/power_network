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
