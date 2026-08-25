"""Shared helpers: parse nodes + aliases out of network_data.js.

network_data.js stays the single source of truth. This module extracts, per node:
id, name, short name, kind (person/institution) and any AKA aliases, so the
automation scripts (match_news.py, import_linkedin.py) never need a second copy
of the data.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "network_data.js"

HONORIFICS = re.compile(r"^(H\.H\. |Sheikh |Sheikha |Dr\. |Prof\. |Capt\. |Eng\. )+")

def load_nodes():
    """Return list of dicts: {id, name, short, kind, aliases:[...]}."""
    text = DATA_JS.read_text(encoding="utf-8")

    # AKA block: id → extra aliases
    aka = {}
    m = re.search(r"const AKA\s*=\s*\{(.*?)\n\};", text, re.S)
    if m:
        for em in re.finditer(r"(\w+)\s*:\s*\[([^\]]*)\]", m.group(1)):
            aka[em.group(1)] = re.findall(r'"([^"]+)"', em.group(2))

    # People entries appear after "const PEOPLE" — everything with roles:[ is a person
    nodes = []
    for em in re.finditer(r'\{id:"([^"]+)",\s*n:"([^"]+)"(?:[^\n]*?short:"([^"]+)")?', text):
        nid, name, short = em.group(1), em.group(2), em.group(3)
        # crude but reliable kind detection: institutions carry s:"..." + t: on the same line
        line = text[em.start(): text.find("\n", em.start())]
        kind = "inst" if re.search(r's:"\w+",\s*t:\d', line) else "person"
        aliases = set([name])
        if short:
            aliases.add(short)
        if kind == "person":
            stripped = HONORIFICS.sub("", name)
            if stripped != name:
                aliases.add(stripped)
        for a in aka.get(nid, []):
            aliases.add(a)
        nodes.append({"id": nid, "name": name, "short": short or name,
                      "kind": kind, "aliases": sorted(aliases)})
    # de-duplicate (institutions can match the person regex too); keep first
    seen, out = set(), []
    for n in nodes:
        if n["id"] in seen:
            continue
        seen.add(n["id"])
        out.append(n)
    return out


def js_string(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'
