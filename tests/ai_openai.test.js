/* OpenAI-compatible provider (PPIO) in server/ai.js, against a local mock of the PPIO API.
   Checks request shape (model, json_schema, image_url, input_audio + stream) and response parsing.
   No network, no cost. Run: node tests/ai_openai.test.js */
"use strict";
const assert = require("assert");
const http = require("http");
const os = require("os"), fs = require("fs"), path = require("path");

const seen = [];
const mock = http.createServer((req, res) => {
  let b = "";
  req.on("data", c => b += c);
  req.on("end", () => {
    const body = JSON.parse(b || "{}");
    seen.push({ url: req.url, auth: req.headers.authorization, body });
    if (body.stream) {
      res.writeHead(200, { "Content-Type": "text/event-stream" });
      for (const part of ["Hello ", "from ", "the meeting."])
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: part } }] })}\n\n`);
      res.end("data: [DONE]\n\n");
      return;
    }
    const sys = body.messages[0].content;
    let out;
    if (/business card/.test(sys)) out = { name: "Sample Person", name_ar: "", title: "Director", company: "Sample Co", email: "s@example.com",
                                          phone: "+971 2 000 0000", mobile: "", website: "example.com", address: "Abu Dhabi", notes: "" };
    else if (/follow-up email/.test(sys)) out = { subject: "Thanks", body: "Dear Sam,\n\n[Your name]" };
    else out = { title: "Grid review", summary: "We reviewed the grid.", key_points: ["Point"], next_steps: [{ text: "Send deck", owner: "me", due: "Friday" }] };
    // reasoning models sometimes wrap JSON in think tags / code fences: the parser must cope
    const content = "<think>planning</think>\n```json\n" + JSON.stringify(out) + "\n```";
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ choices: [{ message: { content }, finish_reason: "stop" }] }));
  });
});

mock.listen(0, "127.0.0.1", async () => {
  const base = `http://127.0.0.1:${mock.address().port}/v1`;
  Object.assign(process.env, { POWER_API_DATA: fs.mkdtempSync(path.join(os.tmpdir(), "navgcc-oai-")),
    PPIO_API_KEY: "test-key", AI_BASE_URL: base, ASR_BASE_URL: base, ANTHROPIC_API_KEY: "", ASR_API_KEY: "", POWER_API_AI: "" });
  const AI = require("../server/ai.js");
  let n = 0;
  try {
    const st = AI.status();
    assert.deepStrictEqual([st.notes, st.card, st.email, st.transcribe, st.provider, st.asr_format], [true, true, true, true, "openai", "wav"]);
    assert.strictEqual(st.model, "deepseek/deepseek-v4.1-flash"); n++;

    const note = await AI.notes({ transcript: "We reviewed the grid. I will send the deck Friday.", people: ["Sam"], date: "2026-11-01" });
    assert.strictEqual(note.title, "Grid review");
    assert.strictEqual(note.next_steps[0].due, "Friday");
    const r1 = seen.pop();
    assert.strictEqual(r1.url, "/v1/chat/completions");
    assert.strictEqual(r1.auth, "Bearer test-key");
    assert.strictEqual(r1.body.model, "deepseek/deepseek-v4.1-flash");
    assert.strictEqual(r1.body.response_format.type, "json_schema");
    assert.ok(r1.body.response_format.json_schema.schema.properties.next_steps); n++;

    const em = await AI.email({ note, to: { name: "Sam" }, from: "Jeremy" });
    assert.strictEqual(em.subject, "Thanks"); seen.pop(); n++;

    const card = await AI.card({ image: Buffer.from("fakejpeg").toString("base64"), media_type: "image/jpeg" });
    assert.strictEqual(card.company, "Sample Co");
    const r2 = seen.pop();
    const img = r2.body.messages[1].content.find(c => c.type === "image_url");
    assert.ok(img.image_url.url.startsWith("data:image/jpeg;base64,")); n++;

    const tr = await AI.transcribe(Buffer.from("RIFFfakewav"), "audio/wav");
    assert.strictEqual(tr.text, "Hello from the meeting.");
    const r3 = seen.pop();
    assert.strictEqual(r3.body.model, "qwen/qwen3.5-omni-flash");
    assert.strictEqual(r3.body.stream, true);
    const au = r3.body.messages[1].content.find(c => c.type === "input_audio");
    assert.strictEqual(au.input_audio.format, "wav"); n++;

    console.log(`ai_openai: ${n}/5 passed`);
  } catch (e) { console.error(e); process.exitCode = 1; }
  mock.close();
});
