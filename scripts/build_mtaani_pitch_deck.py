#!/usr/bin/env python3
"""Build the Mtaani 7-slide investor pitch deck (PPTX)."""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

# --- Theme (Freesia-inspired) ---
NAVY = RGBColor(0x1B, 0x2A, 0x4A)
YELLOW = RGBColor(0xF5, 0xC5, 0x18)
ORANGE = RGBColor(0xF0, 0x8A, 0x24)
PEACH = RGBColor(0xFB, 0xE3, 0xB0)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
SOFT_ORANGE = RGBColor(0xFD, 0xD4, 0xA8)
SOFT_YELLOW = RGBColor(0xFE, 0xF0, 0xB8)

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

ROOT = Path(__file__).resolve().parents[1]
OUT_PATH = ROOT / "mtaani-pitch-deck.pptx"


def rgb_fill(shape, color: RGBColor) -> None:
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()


def set_run(run, text: str, size_pt: int, color: RGBColor, bold: bool = False) -> None:
    run.text = text
    run.font.size = Pt(size_pt)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = "Calibri"


def add_textbox(
    slide,
    left,
    top,
    width,
    height,
    text: str,
    *,
    size_pt: int = 18,
    color: RGBColor = NAVY,
    bold: bool = False,
    align=PP_ALIGN.LEFT,
) -> None:
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    # Support multi-line text
    lines = text.split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.clear()
        run = p.add_run()
        set_run(run, line, size_pt, color, bold)


def add_bullets(
    slide,
    left,
    top,
    width,
    height,
    bullets: list[str],
    *,
    size_pt: int = 18,
    color: RGBColor = NAVY,
) -> None:
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.level = 0
        p.space_after = Pt(10)
        p.clear()
        run = p.add_run()
        set_run(run, f"•  {item}", size_pt, color, bold=False)


def add_notes(slide, text: str) -> None:
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.clear()
    p = tf.paragraphs[0]
    run = p.add_run()
    run.text = text
    run.font.size = Pt(12)
    run.font.name = "Calibri"


def add_blob(slide, left, top, width, height, color: RGBColor) -> None:
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, width, height)
    rgb_fill(shape, color)


def add_corner_accents(slide) -> None:
    add_blob(slide, Inches(-0.6), Inches(-0.8), Inches(3.2), Inches(2.6), PEACH)
    add_blob(slide, Inches(11.2), Inches(-0.9), Inches(3.4), Inches(3.0), YELLOW)
    add_blob(slide, Inches(12.0), Inches(0.4), Inches(2.4), Inches(2.2), ORANGE)
    add_blob(slide, Inches(-0.8), Inches(5.8), Inches(2.8), Inches(2.4), SOFT_ORANGE)
    add_blob(slide, Inches(11.5), Inches(6.0), Inches(2.6), Inches(2.2), PEACH)


def add_headline(slide, text: str) -> None:
    add_textbox(
        slide,
        Inches(0.7),
        Inches(0.35),
        Inches(11.8),
        Inches(0.7),
        text,
        size_pt=32,
        color=NAVY,
        bold=True,
        align=PP_ALIGN.LEFT,
    )


def blank_slide(prs: Presentation):
    return prs.slides.add_slide(prs.slide_layouts[6])


def slide_title(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_blob(slide, Inches(4.2), Inches(1.6), Inches(5.0), Inches(4.2), PEACH)
    add_blob(slide, Inches(5.0), Inches(1.9), Inches(4.2), Inches(3.6), YELLOW)
    add_blob(slide, Inches(5.6), Inches(2.3), Inches(3.4), Inches(2.9), ORANGE)

    add_textbox(
        slide,
        Inches(1.5),
        Inches(2.55),
        Inches(10.3),
        Inches(1.0),
        "Mtaani",
        size_pt=60,
        color=NAVY,
        bold=True,
        align=PP_ALIGN.CENTER,
    )
    add_textbox(
        slide,
        Inches(1.5),
        Inches(3.55),
        Inches(10.3),
        Inches(0.55),
        "Connecting your mtaa, one order at a time",
        size_pt=22,
        color=NAVY,
        bold=False,
        align=PP_ALIGN.CENTER,
    )
    add_textbox(
        slide,
        Inches(1.5),
        Inches(4.2),
        Inches(10.3),
        Inches(0.45),
        "Pitch Deck",
        size_pt=18,
        color=NAVY,
        bold=True,
        align=PP_ALIGN.CENTER,
    )
    add_notes(
        slide,
        "Open with the name and the promise: Mtaani connects neighborhood businesses "
        "with nearby residents and delivers through local boda/nduthi riders. "
        "Keep it short — set the hyperlocal frame before the problem.",
    )


def _house_icon(slide, left, top, label: str) -> None:
    body = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, left + Inches(0.25), top + Inches(0.55), Inches(0.9), Inches(0.7)
    )
    rgb_fill(body, NAVY)
    roof = slide.shapes.add_shape(
        MSO_SHAPE.ISOSCELES_TRIANGLE, left + Inches(0.1), top + Inches(0.15), Inches(1.2), Inches(0.5)
    )
    rgb_fill(roof, ORANGE)
    door = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, left + Inches(0.55), top + Inches(0.85), Inches(0.3), Inches(0.4)
    )
    rgb_fill(door, YELLOW)
    add_textbox(
        slide,
        left - Inches(0.15),
        top + Inches(1.4),
        Inches(1.7),
        Inches(0.35),
        label,
        size_pt=12,
        color=NAVY,
        bold=True,
        align=PP_ALIGN.CENTER,
    )


def slide_problem(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "Your neighbors don’t know you exist.")
    add_bullets(
        slide,
        Inches(0.7),
        Inches(1.3),
        Inches(12.0),
        Inches(2.6),
        [
            "Local businesses and residents in the same mtaa are unaware of each other.",
            "Businesses lose sales from a captive nearby audience.",
            "Residents waste time and money sourcing everyday goods and services.",
        ],
        size_pt=18,
    )

    base_y = Inches(4.5)
    _house_icon(slide, Inches(2.5), base_y, "Shop A")
    _house_icon(slide, Inches(5.9), base_y, "Home")
    _house_icon(slide, Inches(9.3), base_y, "Shop B")

    for x in (Inches(4.3), Inches(7.7)):
        dash = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, x, base_y + Inches(0.85), Inches(0.9), Inches(0.08)
        )
        rgb_fill(dash, ORANGE)
        add_textbox(
            slide,
            x + Inches(0.15),
            base_y + Inches(0.4),
            Inches(0.6),
            Inches(0.35),
            "✕",
            size_pt=16,
            color=ORANGE,
            bold=True,
            align=PP_ALIGN.CENTER,
        )

    add_notes(
        slide,
        "The core problem is discovery, not demand. People already buy nearby — "
        "they just can’t see who’s open, what’s in stock, or how to order reliably. "
        "Emphasize wasted trips and missed sales within walking/boda distance.",
    )


def slide_solution(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "One platform, every mtaa.")
    add_bullets(
        slide,
        Inches(0.7),
        Inches(1.25),
        Inches(11.5),
        Inches(1.6),
        [
            "Local vendors list their catalogue of goods and services.",
            "Residents browse and order online.",
            "The nearest nduthi rider delivers.",
        ],
        size_pt=18,
    )

    steps = [
        ("1", "List", YELLOW),
        ("2", "Order", ORANGE),
        ("3", "Deliver", NAVY),
    ]
    start_x = Inches(1.8)
    y = Inches(3.6)
    gap = Inches(3.6)
    for i, (num, label, color) in enumerate(steps):
        cx = start_x + gap * i
        circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, cx, y, Inches(1.6), Inches(1.6))
        rgb_fill(circle, color)
        num_color = WHITE if color == NAVY else NAVY
        add_textbox(
            slide,
            cx,
            y + Inches(0.35),
            Inches(1.6),
            Inches(0.6),
            num,
            size_pt=28,
            color=num_color,
            bold=True,
            align=PP_ALIGN.CENTER,
        )
        add_textbox(
            slide,
            cx - Inches(0.2),
            y + Inches(1.75),
            Inches(2.0),
            Inches(0.4),
            label,
            size_pt=18,
            color=NAVY,
            bold=True,
            align=PP_ALIGN.CENTER,
        )
        if i < 2:
            arrow = slide.shapes.add_shape(
                MSO_SHAPE.RIGHT_ARROW,
                cx + Inches(1.9),
                y + Inches(0.55),
                Inches(1.2),
                Inches(0.5),
            )
            rgb_fill(arrow, PEACH)

    add_notes(
        slide,
        "Walk the three-step loop: vendors go live with a catalogue, neighbors order "
        "from their phone, and a nearby rider closes the last mile. Stress that supply, "
        "demand, and delivery all sit inside the same mtaa.",
    )


def _icon_circle(slide, left, top, color: RGBColor, letter: str, caption: str) -> None:
    c = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, Inches(1.4), Inches(1.4))
    rgb_fill(c, color)
    glyph_color = WHITE if color == NAVY else NAVY
    add_textbox(
        slide,
        left,
        top + Inches(0.35),
        Inches(1.4),
        Inches(0.7),
        letter,
        size_pt=28,
        color=glyph_color,
        bold=True,
        align=PP_ALIGN.CENTER,
    )
    add_textbox(
        slide,
        left - Inches(0.5),
        top + Inches(1.55),
        Inches(2.4),
        Inches(0.4),
        caption,
        size_pt=14,
        color=NAVY,
        bold=True,
        align=PP_ALIGN.CENTER,
    )


def slide_impact(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "Built for the mtaa economy.")
    add_bullets(
        slide,
        Inches(0.7),
        Inches(1.2),
        Inches(12.0),
        Inches(2.4),
        [
            "Businesses reach more customers and fulfill orders faster, more efficiently, and transparently.",
            "Residents access local goods and services quickly and transparently.",
            "Creates flexible income for nearby boda/nduthi riders and keeps spend circulating inside the mtaa.",
        ],
        size_pt=17,
    )

    strip = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.6), Inches(4.2), Inches(10.1), Inches(2.3)
    )
    rgb_fill(strip, PEACH)

    icons = [
        (Inches(2.4), YELLOW, "B", "Businesses"),
        (Inches(6.0), ORANGE, "R", "Residents"),
        (Inches(9.6), NAVY, "D", "Riders"),
    ]
    for left, color, letter, caption in icons:
        _icon_circle(slide, left, Inches(4.45), color, letter, caption)

    add_notes(
        slide,
        "Impact is three-sided: merchants grow sales with clearer fulfillment, "
        "residents save time with local access, and riders earn on short trips while "
        "money stays in the neighborhood — local economic circulation.",
    )


def slide_market(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "A massive, underserved opportunity.")

    layers = [
        ("TAM  ·  ~KES 1.2T+", "Urban everyday / local commerce opportunity", YELLOW, Inches(1.5), Inches(10.3)),
        (
            "SAM  ·  ~KES 180–250B",
            "Smartphone + mobile-money buyers in primary cities",
            ORANGE,
            Inches(2.5),
            Inches(8.3),
        ),
        (
            "SOM  ·  ~KES 3–8B",
            "3-year beachhead: selected Nairobi / Kisumu mtaas",
            NAVY,
            Inches(3.5),
            Inches(6.3),
        ),
    ]
    y = Inches(1.35)
    for title, subtitle, color, left, width in layers:
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, y, width, Inches(1.35))
        rgb_fill(shape, color)
        text_color = WHITE if color == NAVY else NAVY
        add_textbox(
            slide,
            left,
            y + Inches(0.25),
            width,
            Inches(0.45),
            title,
            size_pt=20,
            color=text_color,
            bold=True,
            align=PP_ALIGN.CENTER,
        )
        add_textbox(
            slide,
            left + Inches(0.3),
            y + Inches(0.7),
            width - Inches(0.6),
            Inches(0.45),
            subtitle,
            size_pt=13,
            color=text_color,
            bold=False,
            align=PP_ALIGN.CENTER,
        )
        y += Inches(1.55)

    add_textbox(
        slide,
        Inches(0.7),
        Inches(6.5),
        Inches(12.0),
        Inches(0.5),
        "Estimates derived from public anchors (KNBS/World Bank urban pop., CA/GSMA smartphones, CBK mobile money).",
        size_pt=11,
        color=NAVY,
        bold=False,
        align=PP_ALIGN.CENTER,
    )
    add_notes(
        slide,
        "TAM ≈ KES 1.2T+ framed as Kenya’s urban everyday/local commerce opportunity "
        "(~16–17M urban residents; informal + neighborhood retail is a large share of spend). "
        "SAM ≈ KES 180–250B: smartphone + mobile-money–enabled buyers in Nairobi, Mombasa, "
        "Kisumu, Nakuru, Eldoret for hyperlocal marketplace-relevant spend. "
        "SOM ≈ KES 3–8B over a 3-year beachhead in selected dense Nairobi/Kisumu mtaa estates "
        "at realistic take-rate × GMV. These are derived public-data estimates, not audited figures. "
        "Cite World Bank/KNBS urbanization (~30% urban), CA/GSMA smartphone trends, "
        "CBK mobile-money penetration, and KNBS informal-economy weight.",
    )


def _status_mark(slide, left, top, size, status: str) -> None:
    circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, size, size)
    if status == "yes":
        rgb_fill(circle, YELLOW)
        mark, mcolor = "✓", NAVY
    elif status == "partial":
        circle.fill.solid()
        circle.fill.fore_color.rgb = WHITE
        circle.line.color.rgb = ORANGE
        circle.line.width = Pt(2)
        mark, mcolor = "△", ORANGE
    else:
        circle.fill.solid()
        circle.fill.fore_color.rgb = WHITE
        circle.line.color.rgb = NAVY
        circle.line.width = Pt(1.5)
        mark, mcolor = "✕", NAVY
    add_textbox(
        slide,
        left,
        top + Inches(0.05),
        size,
        size,
        mark,
        size_pt=14,
        color=mcolor,
        bold=True,
        align=PP_ALIGN.CENTER,
    )


def slide_competitive(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "Why we’re different.")

    headers = ["Criterion", "Mtaani", "Jumia", "Glovo / Uber Eats", "Informal (WhatsApp / WoM)"]
    rows = [
        ("Hyperlocal focus", "yes", "no", "partial", "yes"),
        ("Delivery speed (nearby)", "yes", "no", "partial", "partial"),
        ("Cost to vendor", "yes", "no", "no", "yes"),
        ("Trust / transparency", "yes", "yes", "yes", "no"),
    ]
    row_colors = [SOFT_YELLOW, SOFT_ORANGE, SOFT_YELLOW, SOFT_ORANGE]

    table_left = Inches(0.55)
    table_top = Inches(1.25)
    col_widths = [Inches(3.3), Inches(2.15), Inches(2.15), Inches(2.55), Inches(2.7)]
    row_h = Inches(0.95)
    header_h = Inches(0.85)

    x = table_left
    for h, w in zip(headers, col_widths):
        cell = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, table_top, w, header_h)
        rgb_fill(cell, NAVY)
        add_textbox(
            slide,
            x + Inches(0.08),
            table_top + Inches(0.22),
            w - Inches(0.16),
            header_h - Inches(0.3),
            h,
            size_pt=12,
            color=WHITE,
            bold=True,
            align=PP_ALIGN.CENTER,
        )
        x += w

    for r_i, (criterion, *statuses) in enumerate(rows):
        y = table_top + header_h + row_h * r_i
        color = row_colors[r_i]
        x = table_left
        cell = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, col_widths[0], row_h)
        rgb_fill(cell, color)
        add_textbox(
            slide,
            x + Inches(0.2),
            y + Inches(0.28),
            col_widths[0] - Inches(0.3),
            Inches(0.5),
            criterion,
            size_pt=14,
            color=NAVY,
            bold=True,
            align=PP_ALIGN.LEFT,
        )
        x += col_widths[0]
        for s_i, status in enumerate(statuses):
            w = col_widths[s_i + 1]
            cell = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, row_h)
            rgb_fill(cell, color)
            c_left = x + (w - Inches(0.55)) / 2
            c_top = y + (row_h - Inches(0.55)) / 2
            _status_mark(slide, c_left, c_top, Inches(0.55), status)
            x += w

    add_notes(
        slide,
        "Position Mtaani as the only option that is hyperlocal by design, fast because "
        "riders are nearby, affordable for small vendors, and transparent versus WhatsApp "
        "chaos. Jumia is national logistics-heavy; Glovo/Uber Eats skew to restaurants and "
        "higher fees; informal channels lack trust and catalog clarity.",
    )


def slide_revenue(prs: Presentation) -> None:
    slide = blank_slide(prs)
    add_corner_accents(slide)
    add_headline(slide, "How we make money.")
    add_bullets(
        slide,
        Inches(0.7),
        Inches(1.25),
        Inches(6.5),
        Inches(2.8),
        [
            "Commission per transaction",
            "Delivery fee share",
            "Premium / featured listings for vendors",
            "Optional ads",
        ],
        size_pt=18,
    )

    segments = [
        ("Commission", "55%", YELLOW),
        ("Delivery share", "25%", ORANGE),
        ("Featured listings", "15%", NAVY),
        ("Ads", "5%", PEACH),
    ]
    ly = Inches(4.5)
    for name, pct, color in segments:
        sw = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.85), ly, Inches(0.32), Inches(0.32))
        rgb_fill(sw, color)
        add_textbox(
            slide,
            Inches(1.35),
            ly - Inches(0.02),
            Inches(5.5),
            Inches(0.35),
            f"{name} — {pct}",
            size_pt=14,
            color=NAVY,
            bold=False,
            align=PP_ALIGN.LEFT,
        )
        ly += Inches(0.42)

    chart_data = CategoryChartData()
    chart_data.categories = ["Commission", "Delivery share", "Featured listings", "Ads"]
    chart_data.add_series("Revenue", (55, 25, 15, 5))

    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.DOUGHNUT,
        Inches(7.4),
        Inches(1.4),
        Inches(5.2),
        Inches(5.0),
        chart_data,
    )
    chart = chart_frame.chart
    chart.has_legend = True
    chart.legend.include_in_layout = False
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM
    plot = chart.plots[0]
    plot.has_data_labels = True
    data_labels = plot.data_labels
    data_labels.show_percentage = True
    data_labels.show_value = False
    data_labels.show_category_name = False

    series = chart.series[0]
    for i, c in enumerate([YELLOW, ORANGE, NAVY, PEACH]):
        point = series.points[i]
        point.format.fill.solid()
        point.format.fill.fore_color.rgb = c

    add_notes(
        slide,
        "Lead with transaction commission as the core engine, then delivery fee share. "
        "Featured listings and ads are upside as density grows. The donut mix "
        "(55% / 25% / 15% / 5%) is an early-stage illustrative target, not a forecast.",
    )


def build() -> Path:
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H

    slide_title(prs)
    slide_problem(prs)
    slide_solution(prs)
    slide_impact(prs)
    slide_market(prs)
    slide_competitive(prs)
    slide_revenue(prs)

    prs.save(str(OUT_PATH))
    return OUT_PATH


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path}")
