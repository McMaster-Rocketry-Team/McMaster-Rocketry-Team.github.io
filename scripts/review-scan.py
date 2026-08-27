#!/usr/bin/env python3
"""List ReviewMode blocks — mirrors ReviewMode.astro scan logic exactly."""
import json
import re
import sys
import urllib.request

from bs4 import BeautifulSoup, NavigableString, Tag

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4321"
ROUTES = [
    "/",
    "/join",
    "/rockets",
    "/rockets/marauder-i",
    "/rockets/marauder-ii",
    "/rockets/luminis",
    "/rockets/luminis-v2",
    "/rockets/nimbus",
    "/rockets/osiris",
    "/subteams",
    "/subteams/airframe",
    "/subteams/avionics",
    "/subteams/propulsion",
    "/subteams/recovery",
    "/subteams/payload",
    "/subteams/composites",
    "/subteams/operations",
    "/payloads",
    "/payloads/magpie",
    "/payloads/sparrow",
    "/outreach",
    "/sponsors",
    "/members",
    "/404",
]
INLINE = {"A", "B", "I", "EM", "STRONG", "SPAN", "BR", "SUP", "SUB", "U"}
PROSE = {"P", "H1", "H2", "H3", "H4", "H5", "LI", "FIGCAPTION", "BLOCKQUOTE", "DT", "DD"}
WRAPPER = {"DIV", "SPAN", "B", "I"}


def text_of(el: Tag) -> str:
    return re.sub(r"\s+", " ", el.get_text() or "").strip()


def clone_without_links(el: Tag) -> Tag:
    c = BeautifulSoup(str(el), "html.parser").find(el.name)
    for a in c.find_all(["a", "button"]):
        a.decompose()
    return c


def scan(html: str):
    soup = BeautifulSoup(html, "html.parser")
    root = soup.find("main", id="main")
    if not root:
        return set(), []
    raw = root.get("data-rv-locked", "[]")
    try:
        locked = set(json.loads(raw))
    except json.JSONDecodeError:
        locked = set()

    candidates: list[Tag] = []
    for el in root.find_all(True):
        if el.name.upper() in PROSE:
            candidates.append(el)
        elif el.name.upper() in WRAPPER:
            children = [c for c in el.children if isinstance(c, Tag)]
            if children and all(c.name.upper() in INLINE for c in children):
                clone = clone_without_links(el)
                if len(text_of(clone)) >= 2:
                    candidates.append(el)

    flagged = []
    for el in candidates:
        if el.find_parent("button") or el.find(id="rv-panel"):
            continue
        if el.find_parent(attrs={"aria-hidden": "true"}):
            continue
        classes = el.get("class") or []
        if "tag" in classes or "amount" in classes:
            continue
        if len(text_of(el)) < 2:
            continue
        flagged.append(el)

    deduped = []
    for el in flagged:
        if any(other is not el and el in other.descendants for other in flagged):
            continue
        deduped.append(el)

    blocks = [
        {"tag": el.name.lower(), "text": text_of(el)[:140]}
        for el in deduped
    ]
    return locked, blocks


def fetch(path: str) -> str:
    with urllib.request.urlopen(BASE + path, timeout=15) as r:
        return r.read().decode("utf-8", "replace")


def all_indices(n: int) -> list[int]:
    return list(range(n))


if __name__ == "__main__":
    only_open = "--open" in sys.argv
    for path in ROUTES:
        try:
            html = fetch(path)
            locked, blocks = scan(html)
        except Exception as e:
            print(f"\n## {path} — ERROR: {e}")
            continue
        open_i = [i for i in range(len(blocks)) if i not in locked]
        print(f"\n## {path} — {len(blocks)} blocks, {len(open_i)} open, {len(locked)} locked")
        if not only_open:
            print(f"  ALL_INDICES={all_indices(len(blocks))}")
        for i in open_i:
            b = blocks[i]
            print(f"  [{i}] <{b['tag']}> {b['text']}")
