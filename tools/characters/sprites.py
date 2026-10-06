"""Didit pixel characters — draft v0.1.

Every character shares one 32x32 body template (rows 19-31) so items fit all of them.
Characters differ in head (rows 0-18), colors and an optional back layer (tail, shell, wings).

Palette keys:
  .  transparent      k  outline (ink; forest on dark backgrounds)
  e  eye (always ink) s  sprout     l  leaf     f  forest     g  gold
  B  character main   b  character secondary
"""

INK, LEAF, SPROUT, FOREST, GOLD = "#061720", "#85C06C", "#DFF8CF", "#346856", "#F2B33D"

BODY = [  # rows 19..31
    "...........kBBBBBBBBk...........",
    ".........kkkBBbbbbBBkkk.........",
    "........kBBkBbbbbbbBkBBk........",
    "........kBBkBbbbbbbBkBBk........",
    ".........kkkBbbbbbbBkkk.........",
    "...........kBbbbbbbBk...........",
    "...........kBBbbbbBBk...........",
    "...........kBBBBBBBBk...........",
    "...........kkBkkkkBkk...........",
    "............kBk..kBk............",
    "............kkk..kkk............",
    "..........ffffffffffff..........",
    "................................",
]

# rows 0..18; eyes are 'e' at rows 12-13 so blinking can find them
HEAD_BASE = [
    "................................",  # 0
    "................................",  # 1
    "................................",  # 2
    "................................",  # 3
    "................................",  # 4
    "................................",  # 5
    "................................",  # 6
    "..........kkkkkkkkkkkk..........",  # 7
    ".........kBBBBBBBBBBBBk.........",  # 8
    "........kBBBBBBBBBBBBBBk........",  # 9
    "........kBBBBBBBBBBBBBBk........",  # 10
    "........kBBBBBBBBBBBBBBk........",  # 11
    "........kBBseBBBBBBseBBk........",  # 12
    "........kBBeeBBBBBBeeBBk........",  # 13
    "........kBgBBBBBBBBBBgBk........",  # 14  cheeks
    "........kBBBBBeBBeBBBBBk........",  # 15  smile
    "........kBBBBBBeeBBBBBBk........",  # 16
    ".........kBBBBBBBBBBBBk.........",  # 17
    "..........kkkkkkkkkkkk..........",  # 18
]


def head(overrides):
    rows = [list(r) for r in HEAD_BASE]
    for y, row in overrides.items():
        for x, c in enumerate(row):
            if c != " ":
                rows[y][x] = c
    return ["".join(r) for r in rows]


# character definitions -------------------------------------------------------
# overrides: row -> 32-char string, spaces keep the base pixel
CHARACTERS = {
    "cat": {
        "name": "گربه", "unlock": 1, "B": FOREST, "b": SPROUT,
        "head": {
            3: ".........k............k.........",
            4: ".........kk..........kk.........",
            5: ".........kbk........kbk.........",
            6: ".........kbbk......kbbk.........",
            7: ".........k            k.........",
        },
    },
    "rabbit": {
        "name": "خرگوش", "unlock": 1, "B": SPROUT, "b": LEAF,
        "head": {
            0: "...........k........k...........",
            1: "..........kbk......kbk..........",
            2: "..........kbk......kbk..........",
            3: "..........kbk......kbk..........",
            4: "..........kbk......kbk..........",
            5: "..........kbk......kbk..........",
            6: "..........kbk......kbk..........",
        },
    },
    "turtle": {
        "name": "لاک‌پشت", "unlock": 3, "B": LEAF, "b": GOLD,
        "head": {},
        "back": {  # shell rim around the body
            19: ".........kffffffffffffk.........",
            20: "........kffffffffffffffk........",
            21: ".......kffffffffffffffffk.......",
            22: ".......kfssffffffffffssfk.......",
            23: ".......kffffffffffffffffk.......",
            24: "........kffffffffffffffk........",
            25: ".........kffffffffffffk.........",
            26: "..........kkkkkkkkkkkk..........",
        },
        "belly": {  # plastron seams
            22: "             ffffff             ",
            24: "             ffffff             ",
        },
    },
    "fox": {
        "name": "روباه", "unlock": 5, "B": GOLD, "b": SPROUT,
        "head": {
            2: "........k..............k........",
            3: "........kk............kk........",
            4: "........kbk..........kbk........",
            5: "........kbbk........kbbk........",
            6: "........kbbbk......kbbbk........",
            7: "........k              k........",
            14: "        kssBBBkkkkBBBssk        ",
            15: "        kssssssksssssssk        ",
            16: "        kssssssssssssssk        ",
            17: "         kssssssssssssk         ",
        },
        "back": {  # bushy tail on the right
            20: "......................kkk.......",
            21: ".....................kgggk......",
            22: ".....................kgggk......",
            23: "....................kgggssk.....",
            24: "....................kggsssk.....",
            25: ".....................kksssk.....",
            26: ".......................kkk......",
        },
    },
    "cheetah": {
        "name": "یوز ایرانی", "unlock": 8, "B": GOLD, "b": SPROUT,
        "head": {
            5: "..........kk........kk..........",
            6: ".........kbbk......kbbk.........",
            9: "        kBeBBBBBBBBBBeBk        ",
            10: "        kBBBBeBBBBeBBBBk        ",
            14: "        kBBBeBBBBBBeBBBk        ",
            15: "        kBBBeBeBBeBeBBBk        ",
        },
        "belly": {  # spots on the sides
            21: "         e                      ",
            22: "                      e         ",
            24: "            e      e            ",
        },
    },
    "dragon": {
        "name": "اژدهای کوچک", "unlock": 10, "B": LEAF, "b": SPROUT,
        "head": {
            3: "..........g..........g..........",
            4: "..........kg........gk..........",
            5: "...........kg......gk...........",
            6: "...........kgk.kk.kgk...........",
            7: "              kffk              ",
        },
        "back": {  # wings
            18: ".....kk..................kk.....",
            19: "....kfk..................kfk....",
            20: "....kffk................kffk....",
            21: "....kfffk..............kfffk....",
            22: ".....kfffk............kfffk.....",
            23: "......kkkk............kkkk......",
        },
    },
}


# items share the body template, so each one fits every character --------------
ITEMS = {
    "glasses": {"name": "عینک", "unlock": 2, "rows": {
        11: "          eeee    eeee          ",
        12: "          e  eeeeee  e          ",
        13: "          eeee    eeee          ",
    }},
    "scarf": {"name": "شال‌گردن", "unlock": 4, "rows": {
        18: "         kgsgsgsgsgsgsk         ",
        19: "          kgsgsgsgsgsk          ",
        20: "                 kgk            ",
        21: "                 ksk            ",
        22: "                 kkk            ",
    }},
    "headband": {"name": "هدبند ورزشی", "unlock": 6, "rows": {
        9:  "        kggggggggggggggk        ",
        10: "        kssssssssssssssk        ",
    }},
}


def compose(char, item=None):
    """Return 32 rows of palette keys for a character and frame."""
    c = CHARACTERS[char]
    canvas = [["."] * 32 for _ in range(32)]

    def paint(rows, y0, skip_dot=True):
        for i, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch in ". " and skip_dot:
                    continue
                canvas[y0 + i][x] = ch

    back = c.get("back", {})
    for y, row in back.items():
        paint([row], y)
    paint(BODY, 19)
    for y, row in c.get("belly", {}).items():
        for x, ch in enumerate(row):
            if ch != " ":
                canvas[y][x] = ch
    paint(head(c.get("head", {})), 0)
    if item:
        for y, row in ITEMS[item]["rows"].items():
            for x, ch in enumerate(row):
                if ch != " ":
                    canvas[y][x] = ch
    return canvas


def shift_up_body(canvas, dy):
    """Move everything above the legs (rows 0..26) by dy rows (positive = down)."""
    out = [row[:] for row in canvas]
    top = [row[:] for row in canvas[:27]]
    for y in range(27):
        out[y] = ["."] * 32
    for y in range(27):
        ny = y + dy
        if 0 <= ny < 31:
            for x, ch in enumerate(top[y]):
                if ch != ".":
                    out[ny][x] = ch
    return out


def blink(canvas, char):
    B = "B"
    out = [row[:] for row in canvas]
    for y in range(32):
        for x in range(32):
            if out[y][x] in "es" and y in (11, 12, 13, 14) and 10 <= x <= 21:
                pass
    # eyes live at rows 12-13 (maybe shifted by one when breathing)
    for y in range(32):
        row = out[y]
        for x in range(32):
            if row[x] == "s" and x in (11, 19) and y in (12, 13):
                row[x] = B
                row[x + 1] = B
                out[y + 1][x] = "e"
                out[y + 1][x + 1] = "e"
    return out


def frames(char, anim, item=None):
    base = compose(char, item)
    if anim == "idle":
        down = shift_up_body(base, 1)
        return [base, base, down, down, base, blink(base, char)]
    if anim == "celebrate":
        up1, up3 = shift_up_body(base, -1), shift_up_body(base, -3)
        f = [shift_up_body(base, 1), up3, up3, up1, base]
        sparkle = [(5, 6), (26, 8), (4, 14), (27, 15)]
        for fr in f[1:3]:
            for x, y in sparkle:
                fr[y][x] = "g"
        return f
    if anim == "sleepy":
        closed = blink(base, char)
        down = shift_up_body(closed, 1)
        f = [closed, closed, down, down]
        z = [(24, 5), (25, 5), (25, 4), (24, 3), (25, 3)]
        for i, fr in enumerate(f):
            if i >= 2:
                for x, y in z:
                    fr[y - (i - 2)][x] = "g"
        return f
    raise ValueError(anim)


def color_of(key, char, dark=False):
    c = CHARACTERS[char]
    return {
        "k": FOREST if dark else INK, "e": INK, "s": SPROUT, "l": LEAF,
        "f": FOREST, "g": GOLD, "B": c["B"], "b": c["b"],
    }.get(key)
