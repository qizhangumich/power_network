"""Derive qatar/index.html from the root index.html.

  python tools/build_qatar_page.py

Same engine, Qatar branding, region switcher pointing back. Run after any
change to the root page (tools/update.py does this automatically).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def main():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = html.replace("ABU DHABI POWER NETWORK", "QATAR POWER NETWORK")
    html = html.replace("Abu Dhabi Power Network — Network Intelligence",
                        "Qatar Power Network — Network Intelligence")
    html = html.replace("阿布扎比权力网络 — 关系情报", "卡塔尔权力网络 — 关系情报")
    # swap the region switcher: Qatar becomes the active pill
    html = re.sub(r'<div id="regions">.*?</div>',
                  '<div id="regions"><a href="../">Abu Dhabi</a><a href="./" class="on">Qatar</a></div>',
                  html, count=1, flags=re.S)
    (ROOT / "qatar").mkdir(exist_ok=True)
    (ROOT / "qatar" / "index.html").write_text(html, encoding="utf-8")
    print("qatar/index.html rebuilt from index.html")

if __name__ == "__main__":
    main()
