"""Build all GCC region pages from map_template.html.

  python tools/build_regions.py

map_template.html is the single source of the engine/design (an Abu Dhabi-
branded page). This script stamps each region's branding and a folded region
menu, writing <region>/index.html for every entry in REGIONS — Abu Dhabi now
lives at abudhabi/ like the others (its data files are copied from the root,
where import_csv.py / match_news.py generate them). The root index.html is the
hand-editable GCC landing page (clickable map); this script only refreshes the
per-region stats stamped into it. Run after any change to the template or the
landing page — tools/update.py does it automatically.
"""
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import load_nodes

TEMPLATE = ROOT / "map_template.html"

REGIONS = [
    {"dir":"abudhabi", "label":"Abu Dhabi",    "brand":"ABU DHABI POWER NETWORK",
     "en":"Abu Dhabi Power Network — NavGCC", "zh":"阿布扎比权力网络 — NavGCC"},
    {"dir":"dubai",    "label":"Dubai",        "brand":"DUBAI POWER NETWORK",
     "en":"Dubai Power Network — NavGCC",     "zh":"迪拜权力网络 — NavGCC"},
    {"dir":"northern", "label":"Northern Emirates", "brand":"NORTHERN EMIRATES POWER NETWORK",
     "en":"Northern Emirates Power Network — NavGCC", "zh":"北部酋长国权力网络 — NavGCC"},
    {"dir":"saudi",    "label":"Saudi Arabia", "brand":"SAUDI ARABIA POWER NETWORK",
     "en":"Saudi Arabia Power Network — NavGCC", "zh":"沙特阿拉伯权力网络 — NavGCC"},
    {"dir":"qatar",    "label":"Qatar",        "brand":"QATAR POWER NETWORK",
     "en":"Qatar Power Network — NavGCC",     "zh":"卡塔尔权力网络 — NavGCC"},
    {"dir":"bahrain",  "label":"Bahrain",      "brand":"BAHRAIN POWER NETWORK",
     "en":"Bahrain Power Network — NavGCC",   "zh":"巴林权力网络 — NavGCC"},
    {"dir":"oman",     "label":"Oman",         "brand":"OMAN POWER NETWORK",
     "en":"Oman Power Network — NavGCC",      "zh":"阿曼权力网络 — NavGCC"},
    {"dir":"kuwait",   "label":"Kuwait",       "brand":"KUWAIT POWER NETWORK",
     "en":"Kuwait Power Network — NavGCC",    "zh":"科威特权力网络 — NavGCC"},
]
AD = REGIONS[0]
NAV_RE = re.compile(r'<!--REGIONNAV-->|<details id="regions">.*?</details>|<div id="regions">.*?</div>', re.S)

REDIRECT = ('<!doctype html><meta charset="utf-8">'
            '<meta http-equiv="refresh" content="0; url=abudhabi/">'
            '<title>Abu Dhabi Power Network</title>'
            '<a href="abudhabi/">Abu Dhabi Power Network has moved &rarr;</a>')

def nav_for(current):
    links = ['<a href="../">GCC ⌂</a>']
    for r in REGIONS:
        href = "./" if r["dir"] == current["dir"] else "../" + r["dir"] + "/"
        cls = ' class="on"' if r["dir"] == current["dir"] else ""
        links.append(f'<a{cls} href="{href}">{r["label"]}</a>')
    return (f'<details id="regions"><summary>{current["label"]}</summary>'
            f'<nav>{"".join(links)}</nav></details>')

def stamp_landing():
    """Refresh the per-region people/institution counts in the landing page."""
    landing = ROOT / "index.html"
    if not landing.exists():
        return
    html = landing.read_text(encoding="utf-8")
    if 'data-stat="' not in html:
        return
    for r in REGIONS:
        data = ROOT / ("network_data.js" if r["dir"] == "abudhabi" else f'{r["dir"]}/network_data.js')
        if not data.exists():
            continue
        nodes = load_nodes(data)
        p = sum(1 for n in nodes if n["kind"] == "person")
        i = sum(1 for n in nodes if n["kind"] == "inst")
        html = re.sub(f'(data-stat="{r["dir"]}:p"[^>]*>)[^<]*', rf'\g<1>{p}', html)
        html = re.sub(f'(data-stat="{r["dir"]}:i"[^>]*>)[^<]*', rf'\g<1>{i}', html)
    landing.write_text(html, encoding="utf-8")
    print("landing stats refreshed")

def main():
    base = TEMPLATE.read_text(encoding="utf-8")
    built = []
    for r in REGIONS:
        d = ROOT / r["dir"]
        d.mkdir(exist_ok=True)
        if r["dir"] == "abudhabi":
            # AD data is generated at the root by import_csv.py / match_news.py
            for f in ("network_data.js", "news_data.js", "my_network.js"):
                src = ROOT / f
                if src.exists():
                    shutil.copy2(src, d / f)
        elif not (d / "network_data.js").exists():
            continue                      # region page ships only once its dataset exists
        html = base.replace(AD["brand"], r["brand"]) \
                   .replace(AD["en"], r["en"]) \
                   .replace(AD["zh"], r["zh"])
        html = NAV_RE.sub(nav_for(r), html, count=1)
        (d / "index.html").write_text(html, encoding="utf-8")
        built.append(r["dir"])
    (ROOT / "abu_dhabi_power_hub.html").write_text(REDIRECT, encoding="utf-8")
    stamp_landing()
    print("region pages built:", ", ".join(built))

if __name__ == "__main__":
    main()
