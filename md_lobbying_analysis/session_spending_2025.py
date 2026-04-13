"""
Calculate total lobbying event spending during 2025 regular session
and ENT/EEE share of that spending
"""

import pandas as pd
from datetime import datetime

# Load data - update filename to match yours
events_2425 = pd.read_csv("Lobbying Event Reports - event_reports_nov2024-oct2025.csv")

# Standardize column names
events_2425.columns = events_2425.columns.str.lower().str.replace(' ', '_').str.replace('/', '_')

# Parse dates
events_2425['event_date_parsed'] = pd.to_datetime(events_2425['event_date'], format='%m/%d/%y')

# 2025 Regular Session: January 8 - April 7, 2025
session_start = datetime(2025, 1, 8)
session_end = datetime(2025, 4, 7)

# Filter to session only
session_events = events_2425[
    (events_2425['event_date_parsed'] >= session_start) & 
    (events_2425['event_date_parsed'] <= session_end)
]

# Total spending during session
total_session_spending = session_events['total_cost'].sum()
total_session_events = len(session_events)

# ENT/EEE spending during session
energy_cmte_pattern = r"Environment and Transportation|Education.*Energy.*Environment"
ent_eee_session = session_events[
    session_events['groups_invited'].str.contains(energy_cmte_pattern, case=False, na=False)
]
ent_eee_spending = ent_eee_session['total_cost'].sum()
ent_eee_events = len(ent_eee_session)

# Calculate share
ent_eee_share = (ent_eee_spending / total_session_spending) * 100

# Print results
print("=" * 60)
print("2025 REGULAR SESSION LOBBYING EVENT SPENDING")
print("Session dates: January 8 - April 7, 2025")
print("=" * 60)

print(f"\nTOTAL SESSION SPENDING")
print(f"  Events: {total_session_events}")
print(f"  Total:  ${total_session_spending:,.2f}")

print(f"\nENT & EEE COMMITTEE EVENTS")
print(f"  Events: {ent_eee_events}")
print(f"  Total:  ${ent_eee_spending:,.2f}")

print(f"\nSHARE OF SESSION SPENDING")
print(f"  ENT/EEE share: {ent_eee_share:.1f}%")
print(f"  Other committees/GA: {100 - ent_eee_share:.1f}%")

print("\n" + "=" * 60)
