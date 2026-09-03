"""One-command update: CSV edits -> validated data -> news re-match -> pushed live.

  python tools/update.py ["commit message"]

Runs import_csv (validates + regenerates network_data.js), match_news, then
commits and pushes everything. The Alicloud server pulls within 5 minutes.
Add --fetch to also pull fresh news first (needs internet access to Google News).
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"

def run(args, **kw):
    print(f"\n>> {' '.join(str(a) for a in args)}")
    r = subprocess.run(args, cwd=ROOT, **kw)
    if r.returncode != 0:
        sys.exit(r.returncode)

def main():
    argv = [a for a in sys.argv[1:]]
    fetch = "--fetch" in argv
    argv = [a for a in argv if a != "--fetch"]
    msg = argv[0] if argv else "data update"

    run([sys.executable, TOOLS / "import_csv.py"])
    if fetch:
        run([sys.executable, TOOLS / "fetch_news.py"])
    run([sys.executable, TOOLS / "match_news.py"])
    run(["git", "add", "-A"])
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT)
    if diff.returncode == 0:
        print("\nNothing changed — nothing to push.")
        return
    run(["git", "commit", "-m", msg + "\n\nCo-Authored-By: Claude Fable 5 <noreply@anthropic.com>"])
    run(["git", "push"])
    print("\nPushed. Live on the server within ~5 minutes.")

if __name__ == "__main__":
    main()
