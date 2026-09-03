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

    # sync with the Actions bot FIRST, then regenerate on top — avoids
    # rebase conflicts on generated files (news_data.js etc.)
    run(["git", "pull", "--rebase", "--autostash"])
    run([sys.executable, TOOLS / "import_csv.py"])
    if fetch:
        run([sys.executable, TOOLS / "fetch_news.py"])
    run([sys.executable, TOOLS / "match_news.py"])
    run([sys.executable, TOOLS / "report.py"])
    run(["git", "add", "-A"])
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT)
    if diff.returncode == 0:
        print("\nNothing changed — nothing to push.")
        return
    run(["git", "commit", "-m", msg + "\n\nCo-Authored-By: Claude Fable 5 <noreply@anthropic.com>"])
    run(["git", "pull", "--rebase"])   # the Actions bot may have pushed meanwhile
    run(["git", "push"])
    deploy()

SERVER = "root@47.121.211.166"
SERVER_PATH = "/var/www/power_network"

def deploy():
    """Direct deploy over SSH via git bundle — reliable even when the server
    can't reach GitHub. Best-effort: a failure here just means the server's
    5-minute cron pull takes over."""
    import tempfile, os
    bundle = os.path.join(tempfile.gettempdir(), "pn.bundle")
    try:
        subprocess.run(["git", "bundle", "create", bundle, "main"], cwd=ROOT, check=True)
        subprocess.run(["scp", "-o", "BatchMode=yes", bundle, SERVER + ":/tmp/pn.bundle"], check=True)
        subprocess.run(["ssh", "-o", "BatchMode=yes", SERVER,
                        f"cd {SERVER_PATH} && git pull --ff-only /tmp/pn.bundle main && rm -f /tmp/pn.bundle"],
                       check=True)
        print("\nDeployed directly to the server — live now.")
    except Exception as e:
        print(f"\nDirect deploy skipped ({e}); the server's cron pull will catch up.")

if __name__ == "__main__":
    main()
