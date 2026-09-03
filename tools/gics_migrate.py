"""One-time migration: ad-hoc sectors -> GICS 11 + government-side sectors.

  python tools/gics_migrate.py

Rewrites the SECTORS block and every node's s:"..." in all region
network_data.js files. Mapping follows GICS: transport/defense companies/
professional services/waste -> Industrials; telecom+media+entertainment/sport ->
Communication Services; chemicals & metals -> Materials; tourism/leisure ->
Consumer Discretionary; agri-food -> Consumer Staples. Government authorities
stay in Government & Political. Idempotent.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [ROOT / "network_data.js"] + [ROOT / r / "network_data.js"
         for r in ("dubai", "northern", "saudi", "qatar", "bahrain", "oman", "kuwait")]

NEW_SECTORS = """const SECTORS = {
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
};"""

DEFAULT = {
    "gov":"gov", "sovereign":"sovereign", "energy":"energy", "utilities":"utilities",
    "finance":"finance", "tech":"tech", "telecom":"comm", "media":"comm",
    "defense":"industry", "industry":"industry", "realestate":"realestate",
    "transport":"industry", "health":"health", "education":"education",
    "culture":"consumer_disc", "agrifood":"consumer_stap", "environment":"industry",
    "conglomerate":"conglomerate", "professional":"industry",
    # already-migrated keys pass through
    "materials":"materials", "comm":"comm", "consumer_disc":"consumer_disc",
    "consumer_stap":"consumer_stap",
}

# per-node overrides where the default map is wrong (GICS or state-authority logic)
EXCEPTIONS = {
    # state authorities & officials stay Government
    "tawazun":"gov","rta":"gov","itc":"gov","mattar_tayer":"gov","qm":"gov","mayassa":"gov",
    "qoc":"gov","joaan":"gov","scdl":"gov","thawadi":"gov","qta":"gov","adafsa":"gov",
    "ahmed_mazrouei":"gov","ead":"gov","razan":"gov","shaikha_dhaheri":"gov",
    "attiyah":"gov","kbs":"gov","fahad_yousef":"gov","shihab":"gov",
    "alalshikh":"gov","khateeb":"gov","mot_sa":"gov","moind":"gov","gea":"gov",
    # Materials (chemicals, metals, building products)
    "ega":"materials","emsteel":"materials","borouge":"materials","fertiglobe":"materials",
    "saeed_remeithi":"materials","binkalban":"materials","hazeem":"materials","ahmed_elhoshy":"materials",
    "industriesqatar":"materials","qafco":"materials","qapco":"materials","qatalum":"materials",
    "sabic":"materials","maaden":"materials","fageeh":"materials","wilt":"materials",
    "rakceramics":"materials","massaad":"materials","alba":"materials","baqali":"materials",
    # Communication Services (entertainment, sport, publishing)
    "cfg":"comm","psg":"comm","flash":"comm","lickrish":"comm","qsi":"comm","khelaifi":"comm",
    "bodour":"comm","sba":"comm",
    # advanced-tech figures
    "faisal_bannai":"tech",
}

def migrate(path):
    text = path.read_text(encoding="utf-8")
    text, n = re.subn(r"const SECTORS = \{.*?\n\};", NEW_SECTORS, text, count=1, flags=re.S)
    # drop any old post-block sector additions
    text = re.sub(r'\nSECTORS\.\w+\s*=\s*\{[^}]*\};', "", text)

    def fix(m):
        nid, rest = m.group(1), m.group(0)
        old = re.search(r's:"(\w+)"', rest).group(1)
        new = EXCEPTIONS.get(nid, DEFAULT.get(old, old))
        return re.sub(r's:"\w+"', f's:"{new}"', rest, count=1)

    text = re.sub(r'\{id:"([^"]+)"[^\n]*?s:"\w+"[^\n]*', fix, text)
    path.write_text(text, encoding="utf-8")
    print(f"  {path.relative_to(ROOT)}: SECTORS {'replaced' if n else 'ALREADY?'}")

def main():
    for f in FILES:
        if f.exists():
            migrate(f)

if __name__ == "__main__":
    main()
