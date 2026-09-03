"""Build all GCC region pages from the root index.html.

  python tools/build_regions.py

The root page (Abu Dhabi) is the single source of the engine/design. This
script stamps each region's branding and a folded region menu, writing
<region>/index.html for every entry in REGIONS. Run after any change to the
root page — tools/update.py does it automatically.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# dir "" = the root (Abu Dhabi) page itself
REGIONS = [
    {"dir":"",         "label":"Abu Dhabi",    "brand":"ABU DHABI POWER NETWORK",
     "en":"Abu Dhabi Power Network — Network Intelligence", "zh":"阿布扎比权力网络 — 关系情报"},
    {"dir":"dubai",    "label":"Dubai",        "brand":"DUBAI POWER NETWORK",
     "en":"Dubai Power Network — Network Intelligence",     "zh":"迪拜权力网络 — 关系情报"},
    {"dir":"northern", "label":"N. Emirates",  "brand":"NORTHERN EMIRATES POWER NETWORK",
     "en":"Northern Emirates Power Network — Network Intelligence", "zh":"北部酋长国权力网络 — 关系情报"},
    {"dir":"saudi",    "label":"Saudi Arabia", "brand":"SAUDI ARABIA POWER NETWORK",
     "en":"Saudi Arabia Power Network — Network Intelligence", "zh":"沙特阿拉伯权力网络 — 关系情报"},
    {"dir":"qatar",    "label":"Qatar",        "brand":"QATAR POWER NETWORK",
     "en":"Qatar Power Network — Network Intelligence",     "zh":"卡塔尔权力网络 — 关系情报"},
    {"dir":"bahrain",  "label":"Bahrain",      "brand":"BAHRAIN POWER NETWORK",
     "en":"Bahrain Power Network — Network Intelligence",   "zh":"巴林权力网络 — 关系情报"},
    {"dir":"oman",     "label":"Oman",         "brand":"OMAN POWER NETWORK",
     "en":"Oman Power Network — Network Intelligence",      "zh":"阿曼权力网络 — 关系情报"},
    {"dir":"kuwait",   "label":"Kuwait",       "brand":"KUWAIT POWER NETWORK",
     "en":"Kuwait Power Network — Network Intelligence",    "zh":"科威特权力网络 — 关系情报"},
]
AD = REGIONS[0]
NAV_RE = re.compile(r'<!--REGIONNAV-->|<details id="regions">.*?</details>|<div id="regions">.*?</div>', re.S)

def nav_for(current):
    prefix = "../" if current["dir"] else ""
    links = []
    for r in REGIONS:
        href = "./" if r["dir"] == current["dir"] else prefix + (r["dir"] + "/" if r["dir"] else "")
        cls = ' class="on"' if r["dir"] == current["dir"] else ""
        links.append(f'<a{cls} href="{href}">{r["label"]}</a>')
    return (f'<details id="regions"><summary>{current["label"]}</summary>'
            f'<nav>{"".join(links)}</nav></details>')

def main():
    base = (ROOT / "index.html").read_text(encoding="utf-8")
    # normalize root nav (placeholder or a previously stamped menu)
    root_html = NAV_RE.sub(nav_for(AD), base, count=1)
    (ROOT / "index.html").write_text(root_html, encoding="utf-8")
    (ROOT / "abu_dhabi_power_hub.html").write_text(root_html, encoding="utf-8")

    built = ["(root)"]
    for r in REGIONS[1:]:
        d = ROOT / r["dir"]
        if not (d / "network_data.js").exists():
            continue                      # region page ships only once its dataset exists
        html = root_html.replace(AD["brand"], r["brand"]) \
                        .replace(AD["en"], r["en"]) \
                        .replace(AD["zh"], r["zh"])
        html = NAV_RE.sub(nav_for(r), html, count=1)
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(html, encoding="utf-8")
        built.append(r["dir"])
    print("region pages built:", ", ".join(built))

if __name__ == "__main__":
    main()
