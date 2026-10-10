"""Recolor maps from the candidates' palette (DawnBringer 16) to the Didit brand. D-035, D-037.

Two proposals for the designer to compare on the selection page:
  brand5    only the five character colors of visual-identity.md §7.1 (شب، جنگل، برگ، جوانه، طلا), Game Boy style
  extended  brand ramps (green, neutral) plus gold, keeps more of each character's identity
"""

DB16_NAMES = {
    "#140C1C": "black", "#442434": "dark purple", "#30346D": "dark blue", "#4E4A4E": "dark gray",
    "#854C30": "brown", "#346524": "dark green", "#D04648": "red", "#757161": "olive gray",
    "#597DCE": "blue", "#D27D2C": "orange", "#8595A1": "light gray", "#6DAA2C": "green",
    "#D2AA99": "skin", "#6DC2CA": "cyan", "#DAD45E": "yellow", "#DEEED6": "white",
}

INK, FOREST, LEAF, SPROUT, GOLD = "#061720", "#346856", "#85C06C", "#DFF8CF", "#F2B33D"

BRAND5 = {
    "#140C1C": INK, "#442434": FOREST, "#30346D": FOREST, "#4E4A4E": FOREST,
    "#854C30": FOREST, "#346524": FOREST, "#757161": FOREST,
    "#D04648": GOLD, "#D27D2C": GOLD, "#DAD45E": GOLD,
    "#597DCE": LEAF, "#6DAA2C": LEAF, "#6DC2CA": LEAF,
    "#8595A1": SPROUT, "#D2AA99": SPROUT, "#DEEED6": SPROUT,
}

EXTENDED = {
    "#140C1C": INK,
    "#442434": "#102A2D",   # green 900
    "#30346D": "#223038",   # neutral 800
    "#4E4A4E": "#3C4A52",   # neutral 700
    "#757161": "#58656D",   # neutral 600
    "#597DCE": "#758188",   # neutral 500
    "#8595A1": "#95A0A7",   # neutral 400
    "#6DC2CA": "#B9C3C9",   # neutral 300
    "#346524": FOREST,      # green 700
    "#6DAA2C": LEAF,        # green 400
    "#854C30": "#8A5A00",   # medal text
    "#D04648": "#D99A2B",   # gold, one step darker (proposal)
    "#D27D2C": GOLD,
    "#DAD45E": "#F7D27E",   # gold, one step lighter (proposal)
    "#D2AA99": "#BBE2A8",   # green 200
    "#DEEED6": SPROUT,
}

MAPS = {"brand5": BRAND5, "extended": EXTENDED}
