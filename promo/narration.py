"""Narration for the NavGCC promo (instruction/phase5_promotion.md).

One clip per sentence/phrase, each placed at a planned moment on the timeline so the
voice lands on the matching visual. Word timings from the voice service give the subtitles.
Run: python promo/narration.py   → promo/build/vo_*.mp3 + promo/build/vo.json"""
import asyncio, json, os, subprocess
import edge_tts

VOICE = "en-US-AndrewNeural"          # "warm, confident, authentic" — no ad-read tone
RATE = "-5%"                          # a touch slower than default: comfortable pacing
GAP = 0.3                             # minimum breath between clips

# (id, planned start in seconds, text) — script text from the brief, split at natural pauses
SEGMENTS = [
    ("a1", 0.9,  "Doing business in the Gulf starts with understanding its network."),
    ("a2", 5.2,  "Who's connected to whom — and where do you begin?"),
    ("b1", 11.2, "NavGCC helps you explore the people, companies, and institutions across the GCC."),
    ("b2", 19.6, "See how they connect, and understand the business landscape around you."),
    ("c1", 31.0, "Start with the people you already know."),
    ("c2", 33.9, "Select them on the map,"),
    ("c3", 37.7, "add LinkedIn profile links,"),
    ("c4", 41.9, "or import contacts through a CSV file."),
    ("c5", 46.4, "See where your network connects with the wider Gulf."),
    ("d1", 51.0, "Choose a person or organization you want to reach."),
    ("d2", 56.6, "Explore possible paths through your network,"),
    ("d3", 60.2, "identify whom to approach,"),
    ("d4", 62.4, "and find where your next business conversation could begin."),
    ("e1", 71.0, "Understand the landscape."),
    ("e2", 72.8, "Find your place."),
    ("e3", 74.4, "Discover your path."),
    ("e4", 76.6, "Explore NavGCC, and let's connect."),
]
OUT = os.path.join(os.path.dirname(__file__), "build")


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", path]).decode().strip())


async def clip(sid, text):
    words, audio = [], bytearray()
    comm = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    async for ch in comm.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"w": ch["text"], "t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
    path = os.path.join(OUT, f"vo_{sid}.mp3")
    open(path, "wb").write(audio)
    return path, words


async def main():
    os.makedirs(OUT, exist_ok=True)
    res, prev_end = [], 0.0
    for sid, planned, text in SEGMENTS:
        path, words = await clip(sid, text)
        d = dur(path)
        start = max(planned, prev_end + GAP)
        # the voice service pads a little silence at the end; speech ends at the last word
        speech_end = (words[-1]["t"] + words[-1]["d"]) if words else d
        res.append({"id": sid, "text": text, "file": path, "start": round(start, 3), "duration": d,
                    "speech": round(speech_end, 3), "words": words})
        prev_end = start + speech_end
        print(f"{sid}: start {start:6.2f}  speech {speech_end:5.2f}s  ends {prev_end:6.2f}"
              + ("   (moved later)" if start > planned + 0.01 else ""))
    json.dump(res, open(os.path.join(OUT, "vo.json"), "w"), indent=1)

asyncio.run(main())
