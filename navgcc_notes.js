/* NavGCC — AI meeting notes + business-card scanning (Phase 6).
   Loaded (defer) by every map page; uses the engine's globals (Personal, Acct, byId, nodes, esc, t, LANG, ...).

   Privacy follows My Network: notes (pm2_notes) and card images (pm2_cards) live in this browser and sync
   only to the user's own account when signed in. Audio is never stored — only the reviewed transcript.
   AI runs on the server when it is configured and the account is verified; otherwise everything still
   works in the browser: live dictation for notes, on-device text recognition (English + Arabic) for cards. */
(function () {
  "use strict";
  const MAP = window.__map;                     // the engine's handle (its internals are not global)
  if (!MAP) return;
  const {Personal, Acct, byId, nodes, S, esc, svgI, toast, renderProfile, currentRole, nm, select, centerOn,
         rebuildPersonal, renderMyPanel, leaveDemoQuietly, myPanel} = MAP;
  const K_NOTES = "pm2_notes", K_CARDS = "pm2_cards";
  const EN = {
    notes: "Meeting notes", addNote: "Add note", noNotes: "No meetings recorded yet.",
    record: "Record", upload: "Upload audio", type: "Type", start: "Start recording", stop: "Stop",
    recHint: "Speak after the meeting — your recording becomes structured notes. Audio is not kept.",
    liveLang: "Dictation language", noMic: "Microphone not available — allow access, or type your notes.",
    upHint: "Upload a recording (m4a, mp3, wav, webm — up to 25 MB).",
    typeHint: "Type or paste your notes.", transcript: "Transcript", transcribing: "Transcribing…",
    organize: "Organize notes", organizing: "Organizing…", aiOn: "AI", basic: "Basic (no AI on this server)",
    date: "Meeting date", title: "Title", people: "People & organizations", addPerson: "Add person or organization…",
    summary: "Summary", points: "Key points — one per line", steps: "Next steps", owner: "Owner", due: "Due",
    addStep: "Add step", save: "Save note", cancel: "Cancel", edit: "Edit", del: "Delete", delQ: "Delete this note?",
    email: "Draft follow-up email", subject: "Subject", copy: "Copy", copied: "Copied", openMail: "Open in email app",
    emailNote: "NavGCC never sends email. Review, then send it from your own email.",
    saved: "Note saved", needText: "Add a transcript or some notes first.", srcVoice: "voice", srcUpload: "recording", srcText: "typed",
    upNeedsServer: "Uploaded recordings need server transcription, which isn't set up here — record with dictation or type instead.",
    signInAI: "Sign in with a verified account to use AI; basic organizing works without it.",
    card: "Scan business card", cardHint: "Photograph a card or upload a picture — we read it and you review before adding.",
    takePhoto: "Take photo", choose: "Upload image", reading: "Reading the card…", readingOcr: "Reading on this device…",
    name: "Name", nameAr: "Name (Arabic)", jtitle: "Job title", company: "Company", emailF: "Email", phone: "Phone", mobile: "Mobile",
    website: "Website", address: "Address", dupTitle: "Possible match", dupNew: "Create a new contact", dupUpdate: "Update",
    dupMap: "This is", onMap: "on the map", addNet: "Add to my network", added: "Added to your network",
    cardImg: "Business card", ocrNote: "Read on this device — check the fields carefully.", aiNote: "Read by AI — check before saving.",
    noReader: "Couldn't read the card automatically — fill in the fields.",
  };
  const ZH = {
    notes: "会议记录", addNote: "添加记录", noNotes: "还没有会议记录。",
    record: "录音", upload: "上传音频", type: "输入", start: "开始录音", stop: "停止",
    recHint: "会后口述——录音会整理成结构化记录。音频不会保存。",
    liveLang: "听写语言", noMic: "无法使用麦克风——请允许访问，或直接输入。",
    upHint: "上传录音（m4a、mp3、wav、webm，最大 25 MB）。",
    typeHint: "输入或粘贴你的记录。", transcript: "文字稿", transcribing: "正在转写…",
    organize: "整理记录", organizing: "正在整理…", aiOn: "AI", basic: "基础整理（此服务器未配置 AI）",
    date: "会议日期", title: "标题", people: "人物与机构", addPerson: "添加人物或机构…",
    summary: "摘要", points: "要点——每行一条", steps: "后续行动", owner: "负责人", due: "截止",
    addStep: "添加行动", save: "保存记录", cancel: "取消", edit: "编辑", del: "删除", delQ: "删除这条记录？",
    email: "起草跟进邮件", subject: "主题", copy: "复制", copied: "已复制", openMail: "用邮件应用打开",
    emailNote: "NavGCC 不会代你发送邮件。请检查后用你自己的邮箱发送。",
    saved: "记录已保存", needText: "请先添加文字稿或记录。", srcVoice: "语音", srcUpload: "录音文件", srcText: "输入",
    upNeedsServer: "上传录音需要服务器转写，此处尚未配置——请用听写录音或直接输入。",
    signInAI: "登录并验证邮箱后可使用 AI；基础整理无需登录。",
    card: "扫描名片", cardHint: "拍摄或上传名片照片——识别后由你确认再添加。",
    takePhoto: "拍照", choose: "上传图片", reading: "正在识别名片…", readingOcr: "正在本机识别…",
    name: "姓名", nameAr: "姓名（阿拉伯文）", jtitle: "职位", company: "公司", emailF: "邮箱", phone: "电话", mobile: "手机",
    website: "网站", address: "地址", dupTitle: "可能重复", dupNew: "新建联系人", dupUpdate: "更新",
    dupMap: "就是", onMap: "（地图上）", addNet: "添加到我的人脉", added: "已添加到你的人脉",
    cardImg: "名片", ocrNote: "本机识别——请仔细核对。", aiNote: "AI 识别——保存前请核对。",
    noReader: "无法自动识别名片——请手动填写。",
  };
  const L = () => MAP.LANG === "zh" ? ZH : EN;
  const E = s => esc(s == null ? "" : String(s));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { toast("Storage is full — remove old card images or notes"); return false; } };
  const sync = () => { try { Acct.push(); } catch (e) {} };
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------------- server AI (optional) ---------------- */
  const token = () => { try { return localStorage.getItem("pm2_token"); } catch (e) { return null; } };
  let STATUS = null;
  async function aiStatus() {
    if (STATUS) return STATUS;
    try {
      const h = token() ? {Authorization: "Bearer " + token()} : {};
      STATUS = await (await fetch("/api/ai/status", {headers: h})).json();
    } catch (e) { STATUS = {notes: false, card: false, email: false, transcribe: false}; }
    STATUS.can = k => !!(STATUS[k] && STATUS.signedIn && STATUS.verified);
    return STATUS;
  }
  async function ai(p, body, mime) {
    const h = {Authorization: "Bearer " + token()};
    if (mime) h["Content-Type"] = mime; else h["Content-Type"] = "application/json";
    const r = await fetch("/api/ai/" + p, {method: "POST", headers: h, body: mime ? body : JSON.stringify(body)});
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || ("HTTP " + r.status));
    return j;
  }

  /* ---------------- notes store ---------------- */
  const notesAll = () => load(K_NOTES, {v: 1, list: []});
  function saveNote(n) {
    const d = notesAll(), i = d.list.findIndex(x => x.id === n.id);
    n.updated = Date.now();
    if (i >= 0) d.list[i] = n; else { n.created = n.updated; d.list.push(n); }
    if (store(K_NOTES, d)) sync();
  }
  function delNote(id) { const d = notesAll(); d.list = d.list.filter(x => x.id !== id); store(K_NOTES, d); sync(); }
  /* which notes belong to a map node or a contact (a contact matched to a map person shares notes) */
  function keysFor(n) {
    const k = new Set();
    if (n.kind === "person") {
      k.add("p:" + n.id);
      const ci = Personal.knownIndex(n.id);
      if (ci >= 0) { const c = (Personal.list().find(x => x.i === ci) || {}).c; if (c) k.add("c:" + c.i); }
    } else k.add("o:" + n.id);
    return k;
  }
  const noteKeys = note => (note.people || []).map(p => p.pid ? "p:" + p.pid : p.cid != null ? "c:" + p.cid : p.oid ? "o:" + p.oid : "");
  const notesFor = keys => notesAll().list.filter(nt => noteKeys(nt).some(k => keys.has(k)))
                                   .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.updated - a.updated);

  function noteCard(nt, open) {
    const T = L();
    let h = `<div class="nt-card${open ? " open" : ""}" data-nt="toggle" data-id="${E(nt.id)}"><div class="nt-top"><b>${E(nt.title || T.notes)}</b>`
          + `<span>${E(nt.date || "")}</span></div>`;
    if (!open) return h + (nt.summary ? `<div class="nt-sum">${E(nt.summary).slice(0, 180)}</div>` : "") + `</div>`;
    h += `<div class="nt-who">${(nt.people || []).map(p => `<i>${E(p.n)}</i>`).join("")}</div>`;
    if (nt.summary) h += `<div class="nt-sum">${E(nt.summary)}</div>`;
    if ((nt.points || []).length) h += `<ul class="nt-ul">${nt.points.map(p => `<li>${E(p)}</li>`).join("")}</ul>`;
    if ((nt.steps || []).length) h += `<div class="nt-lab">${T.steps}</div><ul class="nt-ul nt-steps">${nt.steps.map(s =>
      `<li>${E(s.text)}${s.owner ? ` <em>· ${E(s.owner)}</em>` : ""}${s.due ? ` <em>· ${E(s.due)}</em>` : ""}</li>`).join("")}</ul>`;
    h += `<div class="nt-acts"><button class="btn sm primary" type="button" data-nt="email" data-id="${E(nt.id)}">${svgI("mail")} ${T.email}</button>`
       + `<button class="btn sm" type="button" data-nt="edit" data-id="${E(nt.id)}">${T.edit}</button>`
       + `<button class="btn sm ghost" type="button" data-nt="del" data-id="${E(nt.id)}">${T.del}</button></div></div>`;
    return h;
  }
  let OPEN = null;
  function profileHtml(n) {
    const T = L(), list = notesFor(keysFor(n));
    let h = `<div class="sect">${T.notes}${list.length ? " (" + list.length + ")" : ""}</div>`
          + `<div class="nt-addrow"><button class="btn sm primary" type="button" data-nt="add" data-node="${E(n.id)}">${svgI("plus")} ${T.addNote}</button></div>`;
    if (!list.length) return h + `<p class="plab">${T.noNotes}</p>`;
    return h + list.slice(0, 20).map(nt => noteCard(nt, OPEN === nt.id)).join("");
  }
  function contactHtml(cid, x) {
    const T = L(), c = x.c, keys = new Set(["c:" + cid]);
    if (x.pid) keys.add("p:" + x.pid);
    const list = notesFor(keys), img = load(K_CARDS, {})[cid];
    const facts = [["emailF", c.em], ["phone", c.ph], ["mobile", c.mob], ["website", c.web], ["address", c.addr]].filter(f => f[1]);
    let h = "";
    if (facts.length || img) h += `<div class="nt-facts">${facts.map(([k, v]) => `<div><span>${T[k]}</span>${k === "emailF" ? `<a href="mailto:${E(v)}">${E(v)}</a>` : E(v)}</div>`).join("")}`
                               + (img ? `<img class="nt-cardimg" src="${img}" alt="${T.cardImg}">` : "") + `</div>`;
    h += `<span class="mp-lbl">${T.notes}${list.length ? " (" + list.length + ")" : ""}</span>`
       + list.slice(0, 6).map(nt => noteCard(nt, OPEN === nt.id)).join("")
       + `<div class="nt-addrow"><button class="btn sm" type="button" data-nt="add" data-cid="${cid}">${svgI("plus")} ${T.addNote}</button></div>`;
    return h;
  }
  function refresh() {
    try { if (MAP.PANEL_MODE === "profile" && S.selected) renderProfile(S.selected, true); } catch (e) {}
    try { if (myPanel.classList.contains("open")) renderMyPanel(true); } catch (e) {}
  }

  /* ---------------- modal ---------------- */
  let ov = null;
  function modal(html, wire) {
    close();
    ov = document.createElement("div");
    ov.className = "nt-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = `<div class="nt-box"><button class="close" type="button" data-ntx="close" aria-label="Close"></button>${html}</div>`;
    document.body.appendChild(ov);
    ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-ntx=close]")) close(); });
    wire && wire(ov.querySelector(".nt-box"));
  }
  function close() { if (REC) REC.stop(true); if (ov) { ov.remove(); ov = null; } }
  document.addEventListener("keydown", e => { if (e.key === "Escape" && ov) close(); });

  /* ---------------- recording (MediaRecorder + optional live dictation) ---------------- */
  let REC = null;
  function recorder(onText, onLevel) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let mr = null, stream = null, chunks = [], sr = null, finalText = "", alive = true, ctx = null, raf = 0;
    return {
      async start(lang) {
        stream = await navigator.mediaDevices.getUserMedia({audio: true});
        const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || "";
        mr = new MediaRecorder(stream, mime ? {mimeType: mime, audioBitsPerSecond: 32000} : {});
        mr.ondataavailable = e => e.data.size && chunks.push(e.data);
        mr.start(1000);
        try { ctx = new AudioContext(); const an = ctx.createAnalyser(); ctx.createMediaStreamSource(stream).connect(an);
              const buf = new Uint8Array(an.fftSize);
              const tick = () => { an.getByteTimeDomainData(buf); let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128)); onLevel(m / 128); raf = requestAnimationFrame(tick); }; tick();
        } catch (e) {}
        if (SR) {
          const go = () => {
            sr = new SR(); sr.lang = lang; sr.continuous = true; sr.interimResults = true;
            sr.onresult = e => {
              let interim = "";
              for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) finalText += e.results[i][0].transcript.trim() + " ";
                else interim += e.results[i][0].transcript;
              }
              onText(finalText + interim);
            };
            sr.onend = () => { if (alive) try { go(); } catch (e) {} };
            try { sr.start(); } catch (e) {}
          };
          go();
        }
        return {dictation: !!SR};
      },
      stop(discard) {
        alive = false;
        try { sr && sr.stop(); } catch (e) {}
        cancelAnimationFrame(raf); try { ctx && ctx.close(); } catch (e) {}
        return new Promise(res => {
          if (!mr || mr.state === "inactive") { stream && stream.getTracks().forEach(tk => tk.stop()); return res(null); }
          mr.onstop = () => { stream.getTracks().forEach(tk => tk.stop()); res(discard ? null : {blob: new Blob(chunks, {type: mr.mimeType || "audio/webm"}), text: finalText.trim()}); };
          mr.stop();
        });
      },
    };
  }

  /* ---------------- local (no-AI) organizer ---------------- */
  function basicOrganize(text, people) {
    const sents = text.replace(/\s+/g, " ").split(/(?<=[.!?。！？])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 3);
    const act = /\b(will|shall|going to|need to|needs to|to send|follow up|follow-up|send|share|schedule|arrange|introduce|call|meet|review|prepare|by (mon|tues|wednes|thurs|fri|satur|sun)day|next (week|month)|deadline)\b|会|将|需要|跟进|发送|安排/i;
    const MON = "january|february|march|april|may|june|july|august|september|october|november|december";
    const dueRe = new RegExp("\\b((mon|tues|wednes|thurs|fri|satur|sun)day|tomorrow|next (week|month|quarter)|this (week|month)|"
      + "(the )?end of (the )?(week|month|quarter|year|" + MON + ")|(" + MON + ") \\d{1,2}(st|nd|rd|th)?|\\d{1,2}(st|nd|rd|th)? (" + MON + "))\\b", "i");
    const steps = sents.filter(s => act.test(s)).slice(0, 8).map(s => {
      const d = s.match(dueRe), o = s.match(/^(I|we|[A-Z][a-z]+(?: [A-Z][a-z]+)?)\s+(will|shall|is going to|are going to|needs? to)\b/);
      return {text: s, owner: o ? (/^(I|we)$/i.test(o[1]) ? "me" : o[1]) : "", due: d ? d[0] : ""};
    });
    const who = (people || []).map(p => p.n).filter(Boolean);
    const title = who.length ? "Meeting with " + who.slice(0, 2).join(" & ") : (sents[0] || "").split(/\s+/).slice(0, 6).join(" ") + "…";
    return {title, summary: sents.slice(0, 2).join(" "),
            key_points: sents.filter(s => !steps.some(x => x.text === s)).slice(0, 6), next_steps: steps, basic: true};
  }

  /* ---------------- note editor ---------------- */
  function peopleFrom(src) {
    if (src.node) { const n = byId[src.node]; if (n) return [n.kind === "person" ? {pid: n.id, n: n.name} : {oid: n.id, n: n.name}]; }
    if (src.cid != null) { const c = Personal.contactById(+src.cid); if (c) return [{cid: c.i, n: c.n}]; }
    return [];
  }
  async function openEditor(note, initPeople) {
    const T = L(), st = await aiStatus();
    const N = note || {id: uid(), date: today(), title: "", people: initPeople || [], transcript: "", summary: "", points: [], steps: [], source: "text"};
    const mode = note ? "review" : "input";
    const langs = [["en-US", "English"], ["ar-AE", "العربية"], ["zh-CN", "中文"]];
    const chip = p => `<span class="nt-chip" data-k="${E(p.pid ? "p:" + p.pid : p.cid != null ? "c:" + p.cid : "o:" + p.oid)}">${E(p.n)}<button type="button" data-ntx="unchip" aria-label="Remove">×</button></span>`;
    modal(`<div class="eyebrow">${svgI("mic")} ${T.notes}</div>
      <div class="nt-in"${mode === "review" ? " hidden" : ""}>
        <div class="seg" role="tablist"><button type="button" class="on" data-ntx="tab" data-t="rec">${T.record}</button><button type="button" data-ntx="tab" data-t="up">${T.upload}</button><button type="button" data-ntx="tab" data-t="txt">${T.type}</button></div>
        <div class="nt-pane" data-p="rec"><p class="plab">${T.recHint}</p>
          <div class="nt-recrow"><button class="btn primary nt-recbtn" type="button" data-ntx="rec">${svgI("mic")} <span>${T.start}</span></button><span class="nt-time">0:00</span><span class="nt-lvl"><i></i></span>
          <label class="plab nt-lang">${T.liveLang} <select class="mp-input" data-ntx="lang">${langs.map(([v, l]) => `<option value="${v}"${(MAP.LANG === "zh" ? "zh-CN" : "en-US") === v ? " selected" : ""}>${l}</option>`).join("")}</select></label></div>
          <div class="nt-live"></div></div>
        <div class="nt-pane" data-p="up" hidden><p class="plab">${st.can("transcribe") ? T.upHint : T.upNeedsServer}</p>
          ${st.can("transcribe") ? `<label class="btn">${svgI("upload")} ${T.upload}<input type="file" accept="audio/*" data-ntx="file" hidden></label>` : ""}</div>
        <div class="nt-pane" data-p="txt" hidden><p class="plab">${T.typeHint}</p></div>
      </div>
      <div class="nt-msg" role="status"></div>
      <span class="mp-lbl">${T.transcript}</span><textarea class="mp-input nt-tr" rows="5">${E(N.transcript)}</textarea>
      <div class="actrow"><button class="btn sm" type="button" data-ntx="org">${svgI("sparkle")} ${T.organize}</button>
        <span class="plab nt-aimode">${st.can("notes") ? T.aiOn : (st.notes ? T.signInAI : T.basic)}</span></div>
      <div class="nt-grid"><label><span class="mp-lbl">${T.date}</span><input class="mp-input nt-date" type="date" value="${E(N.date)}"></label>
        <label><span class="mp-lbl">${T.title}</span><input class="mp-input nt-title" value="${E(N.title)}"></label></div>
      <span class="mp-lbl">${T.people}</span><div class="nt-chips">${N.people.map(chip).join("")}</div>
      <div class="nt-find"><input class="mp-input nt-q" placeholder="${T.addPerson}" autocomplete="off"><div class="nt-res"></div></div>
      <span class="mp-lbl">${T.summary}</span><textarea class="mp-input nt-sumin" rows="3">${E(N.summary)}</textarea>
      <span class="mp-lbl">${T.points}</span><textarea class="mp-input nt-pts" rows="4">${E((N.points || []).join("\n"))}</textarea>
      <span class="mp-lbl">${T.steps}</span><div class="nt-stepsin"></div>
      <button class="linkbtn" type="button" data-ntx="addstep">+ ${T.addStep}</button>
      <div class="actrow"><button class="btn primary" type="button" data-ntx="save">${T.save}</button><button class="btn ghost" type="button" data-ntx="close">${T.cancel}</button></div>`,
    box => {
      const $ = s => box.querySelector(s), msg = (m, err) => { const el = $(".nt-msg"); el.textContent = m || ""; el.className = "nt-msg" + (err ? " err" : ""); };
      let people = N.people.slice(), src = N.source;
      const stepRow = s => `<div class="nt-step"><input class="mp-input" data-f="text" value="${E(s.text)}"><input class="mp-input" data-f="owner" placeholder="${T.owner}" value="${E(s.owner)}"><input class="mp-input" data-f="due" placeholder="${T.due}" value="${E(s.due)}"><button type="button" data-ntx="rmstep" aria-label="Remove">×</button></div>`;
      const setSteps = arr => { $(".nt-stepsin").innerHTML = arr.map(stepRow).join(""); };
      setSteps(N.steps || []);
      box.addEventListener("click", async e => {
        const b = e.target.closest("[data-ntx]"); if (!b) return;
        const k = b.dataset.ntx;
        if (k === "tab") { box.querySelectorAll("[data-ntx=tab]").forEach(x => x.classList.toggle("on", x === b)); box.querySelectorAll(".nt-pane").forEach(p => p.hidden = p.dataset.p !== b.dataset.t); }
        if (k === "unchip") { const c = b.closest(".nt-chip"); people = people.filter(p => (p.pid ? "p:" + p.pid : p.cid != null ? "c:" + p.cid : "o:" + p.oid) !== c.dataset.k); c.remove(); }
        if (k === "addstep") $(".nt-stepsin").insertAdjacentHTML("beforeend", stepRow({text: "", owner: "", due: ""}));
        if (k === "rmstep") b.closest(".nt-step").remove();
        if (k === "pick") { const p = JSON.parse(b.dataset.p); if (!people.some(x => JSON.stringify(x) === JSON.stringify(p))) { people.push(p); $(".nt-chips").insertAdjacentHTML("beforeend", chip(p)); } $(".nt-q").value = ""; $(".nt-res").innerHTML = ""; }
        if (k === "rec") {
          if (!REC) {
            const btn = b; msg("");
            REC = recorder(txt => { $(".nt-live").textContent = txt; $(".nt-tr").value = txt; },
                           lv => { const i = $(".nt-lvl i"); if (i) i.style.width = Math.round(lv * 100) + "%"; });
            try {
              const r = await REC.start($("[data-ntx=lang]").value);
              btn.classList.add("on"); btn.querySelector("span").textContent = T.stop; src = "voice";
              const t0 = Date.now(); btn._t = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); const tm = $(".nt-time"); if (tm) tm.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }, 500);
              if (!r.dictation && !st.can("transcribe")) msg(T.upNeedsServer, true);
            } catch (err) { REC = null; msg(T.noMic, true); }
          } else {
            clearInterval(b._t); b.classList.remove("on"); b.querySelector("span").textContent = T.start;
            const out = await REC.stop(); REC = null;
            if (out && st.can("transcribe")) {
              msg(T.transcribing);
              try { const r = await ai("transcribe", out.blob, out.blob.type.split(";")[0] || "audio/webm"); $(".nt-tr").value = r.text || out.text; msg(""); }
              catch (err) { $(".nt-tr").value = out.text; msg(err.message, true); }
            } else if (out) $(".nt-tr").value = out.text || $(".nt-tr").value;
          }
        }
        if (k === "org") {
          const text = $(".nt-tr").value.trim();
          if (text.length < 10) return msg(T.needText, true);
          msg(T.organizing);
          let r;
          if (st.can("notes")) {
            try { r = await ai("notes", {transcript: text, date: $(".nt-date").value, people: people.filter(p => !p.oid).map(p => p.n), orgs: people.filter(p => p.oid).map(p => p.n)}); }
            catch (err) { msg(err.message + " — " + T.basic, true); r = basicOrganize(text, people); }
          } else r = basicOrganize(text, people);
          if (!$(".nt-title").value) $(".nt-title").value = r.title || "";
          $(".nt-sumin").value = r.summary || ""; $(".nt-pts").value = (r.key_points || []).join("\n"); setSteps(r.next_steps || []);
          if (!$(".nt-msg").classList.contains("err")) msg("");
          N.ai = !r.basic;
        }
        if (k === "save") {
          const text = $(".nt-tr").value.trim(), summary = $(".nt-sumin").value.trim();
          if (!text && !summary) return msg(T.needText, true);
          Object.assign(N, {date: $(".nt-date").value || today(), title: $(".nt-title").value.trim(), people, transcript: text, summary,
            points: $(".nt-pts").value.split("\n").map(s => s.trim()).filter(Boolean), source: src,
            steps: [...box.querySelectorAll(".nt-step")].map(r => ({text: r.querySelector("[data-f=text]").value.trim(), owner: r.querySelector("[data-f=owner]").value.trim(), due: r.querySelector("[data-f=due]").value.trim()})).filter(s => s.text)});
          saveNote(N); OPEN = N.id; close(); toast(T.saved); refresh();
        }
      });
      box.addEventListener("change", async e => {
        if (e.target.dataset.ntx !== "file" || !e.target.files[0]) return;
        const f = e.target.files[0]; src = "upload";
        if (f.size > 25 * 1024 * 1024) return msg("Max 25 MB", true);
        msg(T.transcribing);
        try { const r = await ai("transcribe", f, f.type || "audio/mpeg"); $(".nt-tr").value = r.text; msg(""); } catch (err) { msg(err.message, true); }
      });
      $(".nt-q").addEventListener("input", e => {
        const q = e.target.value.trim().toLowerCase();
        if (q.length < 2) { $(".nt-res").innerHTML = ""; return; }
        const hits = [];
        Personal.list().forEach(x => { if (x.c.n.toLowerCase().includes(q)) hits.push(x.pid ? {pid: x.pid, n: x.c.n} : {cid: x.c.i, n: x.c.n}); });
        nodes.forEach(n => { if (!n.layer && n.name.toLowerCase().includes(q) && !hits.some(h => h.pid === n.id))
          hits.push(n.kind === "person" ? {pid: n.id, n: n.name} : {oid: n.id, n: n.name}); });
        $(".nt-res").innerHTML = hits.slice(0, 6).map(p => `<button type="button" data-ntx="pick" data-p='${E(JSON.stringify(p))}'>${E(p.n)}${p.oid ? " · " + svgI("building") : ""}</button>`).join("");
      });
    });
  }

  /* ---------------- follow-up email ---------------- */
  async function openEmail(note) {
    const T = L(), st = await aiStatus();
    const first = (note.people || []).find(p => !p.oid) || {};
    let to = {name: first.n || ""}, addr = "";
    if (first.pid && byId[first.pid]) { const r = currentRole(byId[first.pid]); if (r) { to.title = r[1]; to.org = byId[r[0]] ? byId[r[0]].name : ""; } }
    const ci = first.pid ? Personal.knownIndex(first.pid) : -1;
    const c = first.cid != null ? Personal.contactById(first.cid) : (ci >= 0 ? (Personal.list().find(x => x.i === ci) || {}).c : null);
    if (c) { addr = c.em || ""; to.title = to.title || c.po; to.org = to.org || c.co; }
    const fallback = () => {
      const steps = (note.steps || []).map(s => "• " + s.text + (s.owner ? " (" + s.owner + (s.due ? ", " + s.due : "") + ")" : s.due ? " (" + s.due + ")" : "")).join("\n");
      return {subject: (note.title ? "Follow-up: " + note.title : "Following up on our meeting"),
              body: `Dear ${to.name || ""},\n\nThank you for your time${note.date ? " on " + note.date : ""}. ${note.summary || ""}\n\n${steps ? "As agreed:\n" + steps + "\n\n" : ""}I look forward to staying in touch.\n\nBest regards,\n[Your name]`};
    };
    modal(`<div class="eyebrow">${svgI("mail")} ${T.email}</div><div class="nt-msg" role="status">${st.can("email") ? T.organizing : ""}</div>
      <span class="mp-lbl">${T.subject}</span><input class="mp-input nt-subj">
      <textarea class="mp-input nt-body" rows="12"></textarea><p class="plab">${T.emailNote}</p>
      <div class="actrow"><button class="btn primary" type="button" data-ntx="copy">${T.copy}</button><a class="btn" data-ntx="mail" href="#">${svgI("mail")} ${T.openMail}</a></div>`,
    async box => {
      const $ = s => box.querySelector(s);
      let d = fallback();
      if (st.can("email")) {
        try { d = await ai("email", {note: {date: note.date, title: note.title, summary: note.summary, key_points: note.points, next_steps: note.steps}, to}); $(".nt-msg").textContent = ""; }
        catch (err) { $(".nt-msg").textContent = err.message; $(".nt-msg").className = "nt-msg err"; }
      }
      $(".nt-subj").value = d.subject; $(".nt-body").value = d.body;
      const mailto = () => `mailto:${encodeURIComponent(addr)}?subject=${encodeURIComponent($(".nt-subj").value)}&body=${encodeURIComponent($(".nt-body").value)}`;
      $("[data-ntx=mail]").href = mailto();
      box.addEventListener("input", () => { $("[data-ntx=mail]").href = mailto(); });
      $("[data-ntx=copy]").onclick = async e => { try { await navigator.clipboard.writeText($(".nt-subj").value + "\n\n" + $(".nt-body").value); e.target.textContent = T.copied; } catch (er) {} };
    });
  }

  /* ---------------- business cards ---------------- */
  function cardEntryHtml() {
    const T = L();
    return `<div class="li-card"><div class="opt"><b>${svgI("card")} ${T.card}</b><p>${T.cardHint}</p>`
      + `<div class="actrow" style="margin-top:6px"><label class="btn primary">${svgI("camera")} ${T.takePhoto}<input type="file" accept="image/*" capture="environment" data-ntc="file" hidden></label>`
      + `<label class="btn">${svgI("upload")} ${T.choose}<input type="file" accept="image/*" data-ntc="file" hidden></label></div></div></div>`;
  }
  function shrink(file, max, q) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas"); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
        res(cv.toDataURL("image/jpeg", q));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("not an image")); };
      img.src = url;
    });
  }
  let TESS = null;
  function tesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (TESS) return TESS;
    TESS = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
      s.onload = () => res(window.Tesseract); s.onerror = () => { TESS = null; rej(new Error("OCR unavailable")); };
      document.head.appendChild(s);
    });
    return TESS;
  }
  /* turn raw OCR text into fields (heuristics; the user reviews everything) */
  function parseCard(text) {
    /* OCR often puts the English and Arabic names on one line: split scripts into separate lines */
    const AR = /[؀-ۿ]/;
    const lines = [];
    text.replace(/[‎‏‪-‮]/g, "").split(/\n+/).forEach(raw => {
      const l = raw.replace(/[|•·]+/g, " ").replace(/\s+/g, " ").trim();
      if (l.length < 2) return;
      if (AR.test(l) && /[A-Za-z]{3}/.test(l) && !/\d{3}/.test(l)) {
        const lat = l.replace(/[؀-ۿ]+/g, " ").replace(/\s+/g, " ").trim(), ar = (l.match(/[؀-ۿ][؀-ۿ\s]*/g) || []).join(" ").trim();
        if (lat.length > 1) lines.push(lat); if (ar) lines.push(ar);
      } else lines.push(l);
    });
    const all = lines.join("\n"), f = {name: "", name_ar: "", title: "", company: "", email: "", phone: "", mobile: "", website: "", address: ""};
    const em = all.match(/[\w.+-]+@[\w-]+\.[\w.-]+/); if (em) f.email = em[0];
    const www = all.match(/(?:https?:\/\/)?www\.[\w-]+(?:\.[\w-]+)+/i);
    const dom = all.match(/(?<![@\w.])[\w-]+\.(?:com|ae|sa|qa|om|kw|bh|net|org|io|co)(?:\.[a-z]{2})?\b/i);   // a domain that is not part of an email
    if (www) f.website = www[0].replace(/^https?:\/\//i, "");
    else if (dom) f.website = dom[0];
    lines.forEach(l => {
      const digits = (l.match(/\d/g) || []).length;
      if (digits >= 8 && !/@/.test(l)) {
        const num = (l.match(/\+?[\d()\s-]{8,}/) || [""])[0].trim();
        if (/mob|cell|\bm\b|جوال|محمول|\+9715|^05/i.test(l) && !f.mobile) f.mobile = num;
        else if (!f.phone) f.phone = num; else if (!f.mobile) f.mobile = num;
      }
    });
    const TITLE = /\b(chief|ceo|cfo|coo|cto|director|manager|head|partner|officer|president|vice|vp|chairman|founder|analyst|engineer|advisor|adviser|consultant|associate|executive|lead|specialist|counsel|secretary)\b/i;
    const ORG = /\b(llc|l\.l\.c|ltd|limited|group|holding|holdings|bank|company|co\.|capital|investments?|pjsc|psc|authority|ministry|partners|fund|corporation|corp|inc|international|properties|energy|ventures|consulting|advisory)\b/i;
    const ADDR = /\b(p\.?\s?o\.?\s?box|street|st\.|road|tower|floor|building|bldg|office|suite|abu dhabi|dubai|sharjah|riyadh|jeddah|doha|manama|muscat|kuwait|uae|saudi|qatar|oman|bahrain)\b|ص\.?\s?ب/i;
    const plain = lines.filter(l => !/@|www\.|https?:/.test(l) && (l.match(/\d/g) || []).length < 6);
    const ar = plain.filter(l => /[؀-ۿ]/.test(l) && !ADDR.test(l));
    if (ar.length) f.name_ar = ar[0];
    const lat = plain.filter(l => !/[؀-ۿ]/.test(l));
    f.title = lat.find(l => TITLE.test(l)) || "";
    f.company = lat.find(l => ORG.test(l) && l !== f.title) || "";
    f.name = lat.find(l => l !== f.title && l !== f.company && !ADDR.test(l) && /^[A-Z][A-Za-z.'-]+(\s+[A-Z][A-Za-z.'-]+){1,4}$/.test(l)) || "";
    f.address = lines.filter(l => ADDR.test(l) && l !== f.company).slice(0, 2).join(", ");
    if (!f.company && f.email) { const d = f.email.split("@")[1].split(".")[0]; if (!/gmail|hotmail|outlook|yahoo|icloud/i.test(d)) f.company = d.charAt(0).toUpperCase() + d.slice(1); }
    return f;
  }
  function duplicates(f) {
    const tk = s => Personal.toks(s || "").sort().join(" "), nk = tk(f.n), out = [];
    Personal.list().forEach(x => {
      const c = x.c, same = (f.em && c.em && c.em.toLowerCase() === f.em.toLowerCase()) ||
        ((f.ph || f.mob) && [c.ph, c.mob].some(v => v && [f.ph, f.mob].some(w => w && v.replace(/\D/g, "").slice(-8) === w.replace(/\D/g, "").slice(-8)))) ||
        (nk && tk(c.n) === nk);
      if (same) out.push({type: "update", cid: c.i, n: c.n, sub: [c.po, c.co].filter(Boolean).join(" · ")});
    });
    if (nk) nodes.forEach(n => { if (n.kind === "person" && !n.layer && tk(n.name) === nk && !out.some(o => o.pid === n.id)) {
      const r = currentRole(n); out.push({type: "map", pid: n.id, n: n.name, sub: r ? r[1] + " · " + (byId[r[0]] ? byId[r[0]].short : "") : ""}); } });
    return out;
  }
  async function scanCard(file) {
    const T = L(), st = await aiStatus();
    let full, thumb;
    try { full = await shrink(file, 1600, 0.85); thumb = await shrink(file, 640, 0.72); } catch (e) { toast("Not an image"); return; }
    const F = [["n", "name"], ["nar", "nameAr"], ["po", "jtitle"], ["co", "company"], ["em", "emailF"], ["ph", "phone"], ["mob", "mobile"], ["web", "website"], ["addr", "address"]];
    modal(`<div class="eyebrow">${svgI("card")} ${T.card}</div><img class="nt-cardprev" src="${thumb}" alt="${T.cardImg}">
      <div class="nt-msg" role="status">${st.can("card") ? T.reading : T.readingOcr}</div>
      <div class="nt-cardf">${F.map(([k, l]) => `<label><span class="mp-lbl">${T[l]}</span><input class="mp-input" data-f="${k}"${k === "nar" ? ' dir="rtl"' : ""}></label>`).join("")}</div>
      <div class="nt-dups"></div>
      <div class="actrow"><button class="btn primary" type="button" data-ntx="addcard">${svgI("userplus")} ${T.addNet}</button><button class="btn ghost" type="button" data-ntx="close">${T.cancel}</button></div>`,
    async box => {
      const $ = s => box.querySelector(s), msg = (m, err) => { $(".nt-msg").textContent = m || ""; $(".nt-msg").className = "nt-msg" + (err ? " err" : ""); };
      const fill = r => { const map = {n: r.name, nar: r.name_ar, po: r.title, co: r.company, em: r.email, ph: r.phone, mob: r.mobile, web: r.website, addr: r.address};
                          F.forEach(([k]) => { const el = box.querySelector(`[data-f=${k}]`); if (el && !el.value) el.value = map[k] || ""; }); dups(); };
      const val = () => { const o = {}; F.forEach(([k]) => o[k] = box.querySelector(`[data-f=${k}]`).value.trim()); return o; };
      const dups = () => {
        const d = duplicates(val());
        $(".nt-dups").innerHTML = d.length ? `<span class="mp-lbl">${T.dupTitle}</span>` + d.map((x, i) =>
          `<label class="nt-dup"><input type="radio" name="dup" value="${i}"${i === 0 ? " checked" : ""}> ${x.type === "map" ? T.dupMap : T.dupUpdate} <b>${E(x.n)}</b> <span>${E(x.sub)}${x.type === "map" ? " " + T.onMap : ""}</span></label>`).join("")
          + `<label class="nt-dup"><input type="radio" name="dup" value="new"> ${T.dupNew}</label>` : "";
        $(".nt-dups")._d = d;
      };
      box.addEventListener("input", e => { if (e.target.dataset.f === "n" || e.target.dataset.f === "em") dups(); });
      $("[data-ntx=addcard]").onclick = () => {
        const f = val();
        if (!f.n) return msg(T.name + "?", true);
        const sel = box.querySelector("input[name=dup]:checked"), d = $(".nt-dups")._d || [];
        const choice = sel && sel.value !== "new" ? d[+sel.value] : null;
        const res = Personal.applyCard(Object.assign(f, {card: true}), choice ? (choice.type === "map" ? {type: "map", pid: choice.pid} : {type: "update", cid: choice.cid}) : {type: "new"});
        if (res.error) return msg(res.error, true);
        const cards = load(K_CARDS, {}); cards[res.cid] = thumb; store(K_CARDS, cards);
        sync(); close();
        try { leaveDemoQuietly(); } catch (e) {}
        rebuildPersonal(true);
        const n = res.pid && byId[res.pid] ? byId[res.pid] : (res.insts[0] && byId[res.insts[0]]);
        toast(T.added + (n ? " — " + nm(n) : ""));
        if (n) setTimeout(() => { try { select(n); centerOn(n); } catch (e) {} }, 300);
        refresh();
      };
      /* read the card: server AI when available, otherwise on this device */
      try {
        if (st.can("card")) {
          const r = await ai("card", {image: full.split(",")[1], media_type: "image/jpeg"});
          fill(r); msg(T.aiNote);
        } else {
          const Tz = await tesseract();
          const out = await Tz.recognize(full, "eng+ara", {logger: m => { if (m.status === "recognizing text") msg(T.readingOcr + " " + Math.round(m.progress * 100) + "%"); }});
          fill(parseCard(out.data.text || "")); msg(T.ocrNote);
        }
      } catch (err) { msg(T.noReader + " (" + err.message + ")", true); dups(); }
    });
  }

  /* ---------------- clicks (profile, contact cards, panel) ---------------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-nt]");
    if (!b || (ov && ov.contains(b))) return;
    if (b.dataset.nt === "toggle" && e.target.closest("button, a")) return;
    e.preventDefault(); e.stopPropagation();
    const id = b.dataset.id, nt = id && notesAll().list.find(x => x.id === id);
    switch (b.dataset.nt) {
      case "add": openEditor(null, peopleFrom({node: b.dataset.node, cid: b.dataset.cid})); break;
      case "toggle": OPEN = OPEN === id ? null : id; refresh(); break;
      case "edit": if (nt) openEditor(JSON.parse(JSON.stringify(nt))); break;
      case "email": if (nt) openEmail(nt); break;
      case "del": if (nt && confirm(L().delQ)) { delNote(id); refresh(); } break;
    }
  }, true);
  document.addEventListener("change", e => {
    if (e.target.dataset && e.target.dataset.ntc === "file" && e.target.files[0]) { scanCard(e.target.files[0]); e.target.value = ""; }
  }, true);

  /* ---------------- styles (engine tokens) ---------------- */
  const css = document.createElement("style");
  css.textContent = `
  .nt-ov{position:fixed;inset:0;z-index:90;background:rgba(2,6,16,.62);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px}
  .nt-box{position:relative;width:100%;max-width:560px;max-height:92vh;overflow:auto;background:var(--surface);border:1px solid var(--line-2);border-radius:18px;padding:20px 20px 16px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:6px}
  .nt-box .close{position:absolute;top:12px;right:12px}
  .nt-box .mp-lbl{margin-top:6px}
  .nt-box textarea.mp-input{min-height:78px;height:auto;resize:vertical;line-height:1.45;padding:8px 10px}
  .nt-box textarea.nt-tr{min-height:110px} .nt-box textarea.nt-body{min-height:230px}
  .nt-box input.mp-input{min-height:38px;padding:7px 10px}
  .nt-pane{display:flex;flex-direction:column;gap:8px;margin-top:8px}
  .nt-recrow{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .nt-recbtn.on{background:#FF7A7A;border-color:#FF7A7A;color:#0A1120}
  .nt-time{font:600 15px var(--display);font-variant-numeric:tabular-nums;color:var(--ink-dim)}
  .nt-lvl{width:90px;height:8px;border-radius:99px;background:var(--surface-2);overflow:hidden}.nt-lvl i{display:block;height:100%;width:0;background:var(--accent)}
  .nt-lang{display:flex;align-items:center;gap:6px;margin-left:auto}.nt-lang select{width:auto;min-height:32px;padding:4px 8px}
  .nt-live{font-size:13px;color:var(--ink-dim);min-height:18px}
  .nt-msg{font-size:12.5px;color:var(--ink-dim);min-height:16px}.nt-msg.err{color:#FFC1C1}
  .nt-grid{display:grid;grid-template-columns:150px 1fr;gap:8px}.nt-grid label{display:flex;flex-direction:column}
  .nt-chips{display:flex;flex-wrap:wrap;gap:6px}
  .nt-chip{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;border:1px solid var(--accent-br);background:var(--accent-soft);border-radius:99px;padding:2px 4px 2px 10px}
  .nt-chip button{border:0;background:none;color:var(--ink-dim);cursor:pointer;font-size:15px;line-height:1}
  .nt-find{position:relative}.nt-res{display:flex;flex-direction:column}
  .nt-res button{text-align:left;border:0;background:var(--surface-2);color:var(--ink);padding:7px 10px;font:inherit;font-size:13px;cursor:pointer;border-bottom:1px solid var(--line)}
  .nt-res button:hover{background:var(--accent-soft)}
  .nt-step{display:grid;grid-template-columns:1fr 110px 110px 26px;gap:6px;margin-bottom:6px}
  .nt-step button{border:0;background:none;color:var(--ink-faint);cursor:pointer;font-size:16px}
  .nt-addrow{margin:6px 0 8px}
  .nt-card{border:1px solid var(--line-2);border-radius:12px;padding:9px 11px;margin:6px 0;background:var(--bg-raise);cursor:pointer}
  .nt-card.open{cursor:default;border-color:var(--accent-br)}
  .nt-top{display:flex;justify-content:space-between;gap:8px;font-size:13px}.nt-top span{color:var(--ink-faint);white-space:nowrap}
  .nt-sum{font-size:12.5px;color:var(--ink-dim);margin-top:4px}
  .nt-who{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.nt-who i{font-style:normal;font-size:11.5px;color:#A3AEFF;background:var(--accent-soft);border-radius:99px;padding:1px 8px}
  .nt-ul{margin:6px 0 0 18px;font-size:12.5px;color:var(--ink)}.nt-ul li{margin:2px 0}.nt-steps em{font-style:normal;color:var(--ink-faint)}
  .nt-lab{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);margin-top:8px}
  .nt-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
  .nt-facts{display:flex;flex-direction:column;gap:3px;font-size:12.5px;margin:8px 0}.nt-facts span{color:var(--ink-faint);margin-right:8px;font-size:11.5px}
  .nt-cardimg{max-width:100%;border-radius:10px;border:1px solid var(--line-2);margin-top:6px}
  .nt-cardprev{max-height:190px;object-fit:contain;border-radius:12px;border:1px solid var(--line-2);background:#000}
  .nt-cardf{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px}.nt-cardf label{display:flex;flex-direction:column}
  .nt-dups{display:flex;flex-direction:column;gap:5px}
  .nt-dup{font-size:13px;display:flex;gap:6px;align-items:baseline}.nt-dup span{color:var(--ink-faint);font-size:12px}
  @media (max-width:560px){.nt-grid,.nt-cardf{grid-template-columns:1fr}.nt-step{grid-template-columns:1fr 1fr 26px}.nt-step input[data-f=text]{grid-column:1/-1}}
  `;
  document.head.appendChild(css);

  window.NavNotes = {profileHtml, contactHtml, cardEntryHtml, parseCard, basicOrganize, openEditor, scanCard, notesFor, keysFor};
})();
