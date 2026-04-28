# Maryland Lobbying Dinners — Data Analysis

**Reporter:** Zaka Hossain, Capital News Service  
**Class:** JOUR689L, Philip Merrill College of Journalism, University of Maryland  
**Story:** CNS investigation into lobbyist-funded dinners and receptions for Maryland General Assembly members

---

## Scope

This repository covers **dinner and reception event data only** — disclosures lobbyists file with the Maryland State Ethics Commission when they host a meal or reception for a qualified legislative group. Lobbying compensation data (firm revenue, lobbyist salaries, client fees) is handled separately by Quinn Muller.

---

## Data Sources

| File | Period | Notes |
|---|---|---|
| `Lobbying Event Reports - event_reports_nov2024-oct2025.csv` | Nov 2024 – Oct 2025 | Complete reporting year |
| `event_reports_nov2025-oct2026 - event_reports_nov2025-oct2026_updated_04272026.csv` | Nov 2025 – Oct 2026 | Retrieved April 27, 2026. Final events still within 14-day filing window. Always use this file, not the undated version in the same folder. |

**Source:** Maryland State Ethics Commission  
**Session windows used:** Week of Jan. 6 – week of Apr. 11, 2025 | Week of Jan. 12 – week of Apr. 17, 2026

---

## How to Run

1. Open `md_lobbying_factcheck.Rmd` in RStudio
2. Click **Knit** (or `Cmd + Shift + K`)

That's it. All outputs are written to `rstudio_output/`.

**Required R packages:**

```r
install.packages(c("tidyverse", "janitor", "lubridate", "scales", "knitr"))
```

---

## Fact-Checks

The RMD verifies each of the following story claims against the raw data. Run the file to see results.

- **FC-1:** Cornerstone Government Affairs hosted a dinner at Lewnes' on April 8, 2026 for House Appropriations and Senate Budget and Taxation committee members. The bill came to $9,275.11.
- **FC-2:** Closed-door dinners and private receptions for committees and the General Assembly happened nearly every two days during the 2026 legislative session.
- **FC-3:** Spending on lobbyist-funded gatherings rose to $2.3 million for the year ending October 2025.
- **FC-3b:** Partial-year comparison for the 2025–2026 reporting period (data through April 27, 2026).
- **FC-4:** Utility companies reported spending $60,638 in total on committee and General Assembly events during the 2026 legislative session.
- **FC-5:** BGE, Pepco, Washington Gas, Choptank Electric and Constellation reported spending $55,142 on House ENT and Senate EEE committee events during the 2026 session — nearly a third of the $172,878 total spent on those two committees.

---

## Visualization Outputs

All files saved to `rstudio_output/`. Import directly into Datawrapper or Flourish.

| File | Chart type | Tool |
|---|---|---|
| `output_top_spenders_ent_eee.csv` | Top 15 spenders on ENT/EEE, 2026 session | Datawrapper horizontal bar |
| `output_utility_comparison.csv` | Utility spending: 2025 session vs. 2026 session | Datawrapper grouped bar |
| `output_ent_eee_sector_breakdown.csv` | ENT/EEE spending by sector (utility/renewable/other) | Datawrapper donut |
| `output_ent_eee_timeline_2026.csv` | All ENT/EEE events during 2026 session | Flourish scatter timeline |
| `output_session_events_by_date.csv` | Event frequency across 2026 session | Datawrapper bar |

---

## Known Data Issues

- **Bad date record:** League of Women Voters of Howard County has event date `01/10/02`, which parses as January 10, 2002 — a likely two-digit year typo. The record ($524) is excluded from all session and reporting-year filters and does not materially affect any totals. The load-data chunk flags it on every knit.
- **Cornerstone April 8 dinner:** The $9,275.11 figure was obtained from a physical receipt. Check FC-1 output to confirm whether the filing has appeared in the dataset.
- **14-day filing window:** Event reports are due within 14 days of the event. The 2025–26 file was retrieved April 27, which is 14 days after Sine Die (April 13), so it captures all events through the end of session.
- **Multi-committee events:** When one event invites multiple committees, the full cost is attributed to each. Committee-level totals can overlap.

---

*Analysis by Zaka Hossain, Capital News Service. Last updated April 28, 2026.*
