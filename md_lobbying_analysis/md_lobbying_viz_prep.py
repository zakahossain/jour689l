"""
Maryland Lobbying Event Analysis
AIM: To generate isualization-ready CSVs from Ethics Commission data

SOURCE FILES:
- event_reports_nov2025-oct2026_-_event_reports_nov2025-oct2026.csv
- Lobbying_Event_Reports_-_event_reports_nov2024-oct2025.csv
"""

import pandas as pd

# =============================================================================
# LOAD DATA
# =============================================================================

# Update these paths if your files are named differently or in a different folder
events_2526 = pd.read_csv("event_reports_nov2025-oct2026 - event_reports_nov2025-oct2026.csv")
events_2425 = pd.read_csv("Lobbying Event Reports - event_reports_nov2024-oct2025.csv")

# Standardize column names (lowercase, underscores)
events_2526.columns = events_2526.columns.str.lower().str.replace(' ', '_').str.replace('/', '_')
events_2425.columns = events_2425.columns.str.lower().str.replace(' ', '_').str.replace('/', '_')

print(f"Loaded {len(events_2526)} events from 2025-26")
print(f"Loaded {len(events_2425)} events from 2024-25")

# =============================================================================
# HELPER FUNCTION: CATEGORIZE ENERGY EMPLOYERS
# =============================================================================

def categorize_energy(name):
    """Classify employers as Traditional Utility, Renewable Energy, or Other"""
    utilities = ['BGE', 'Baltimore Gas and Electric', 'Pepco', 'Washington Gas', 
                 'Constellation', 'Choptank Electric', 'Chesapeake Utilities']
    renewables = ['Solar', 'Renewable', 'MAREC', 'CHESSA', 'Wind', 
                  'Advanced Energy', 'Chaberton']
    
    name_lower = name.lower()
    for u in utilities:
        if u.lower() in name_lower:
            return 'Traditional Utility'
    for r in renewables:
        if r.lower() in name_lower:
            return 'Renewable Energy'
    return 'Other Interest'

# =============================================================================
# OUTPUT 1: ENERGY COMMITTEE SPENDING BY EMPLOYER
# Events where ENT or EEE committees were invited
# =============================================================================

# Filter to events targeting ENT or EEE
energy_cmte_pattern = r"Environment and Transportation|Education.*Energy.*Environment"

ent_eee_2526 = events_2526[
    events_2526['groups_invited'].str.contains(energy_cmte_pattern, case=False, na=False)
].copy()

# Group by employer
energy_cmte_by_employer = ent_eee_2526.groupby('employer').agg(
    total_spent=('total_cost', 'sum'),
    num_events=('total_cost', 'count')
).sort_values('total_spent', ascending=False).reset_index()

# Add category
energy_cmte_by_employer['category'] = energy_cmte_by_employer['employer'].apply(categorize_energy)

energy_cmte_by_employer.to_csv('output_energy_committee_spending.csv', index=False)
print(f"\n✓ Created: output_energy_committee_spending.csv ({len(energy_cmte_by_employer)} rows)")

# =============================================================================
# OUTPUT 2: UTILITIES YEAR-OVER-YEAR COMPARISON
# =============================================================================

utility_names = [
    'Baltimore Gas and Electric Company', 
    'Pepco Holdings, LLC.', 
    'Washington Gas', 
    'Constellation',
    'Choptank Electric Cooperative, Inc.',
    'Chesapeake Utilities Corporation'
]

# 2025-2026
utilities_2526 = events_2526[events_2526['employer'].isin(utility_names)].groupby('employer').agg(
    total_spent=('total_cost', 'sum'),
    num_events=('total_cost', 'count')
).reset_index()
utilities_2526['period'] = '2025-2026'

# 2024-2025
utilities_2425 = events_2425[events_2425['employer'].isin(utility_names)].groupby('employer').agg(
    total_spent=('total_cost', 'sum'),
    num_events=('total_cost', 'count')
).reset_index()
utilities_2425['period'] = '2024-2025'

# Combine
utilities_combined = pd.concat([utilities_2526, utilities_2425])

# Short names for charts
utilities_combined['employer_short'] = utilities_combined['employer'].replace({
    'Baltimore Gas and Electric Company': 'BGE',
    'Pepco Holdings, LLC.': 'Pepco',
    'Washington Gas': 'Washington Gas',
    'Constellation': 'Constellation',
    'Choptank Electric Cooperative, Inc.': 'Choptank Electric',
    'Chesapeake Utilities Corporation': 'Chesapeake Utilities'
})

utilities_combined.to_csv('output_utilities_comparison.csv', index=False)
print(f"✓ Created: output_utilities_comparison.csv ({len(utilities_combined)} rows)")

# =============================================================================
# OUTPUT 3: TRADITIONAL VS RENEWABLE SECTOR TOTALS
# =============================================================================

traditional_utilities = [
    'Baltimore Gas and Electric Company', 'Pepco Holdings, LLC.', 
    'Washington Gas', 'Constellation', 'Choptank Electric Cooperative, Inc.',
    'Chesapeake Utilities Corporation', 'Constellation Energy Generation, LLC'
]

renewable_energy = [
    'Mid-Atlantic Renewable Energy Coalition Action (MAREC Action)',
    'Chesapeake Solar & Storage Association (CHESSA)',
    'Coalition for Community Solar Access, Inc.',
    'Chaberton Energy', 'Advanced Energy United'
]

# Calculate totals for each sector/period
traditional_2526 = events_2526[events_2526['employer'].isin(traditional_utilities)]['total_cost'].sum()
traditional_2425 = events_2425[events_2425['employer'].isin(traditional_utilities)]['total_cost'].sum()
renewable_2526 = events_2526[events_2526['employer'].isin(renewable_energy)]['total_cost'].sum()
renewable_2425 = events_2425[events_2425['employer'].isin(renewable_energy)]['total_cost'].sum()

energy_sector = pd.DataFrame({
    'sector': ['Traditional Utilities', 'Traditional Utilities', 'Renewable Energy', 'Renewable Energy'],
    'period': ['2024-2025', '2025-2026', '2024-2025', '2025-2026'],
    'total_spent': [traditional_2425, traditional_2526, renewable_2425, renewable_2526]
})

energy_sector.to_csv('output_energy_sector_comparison.csv', index=False)
print(f"✓ Created: output_energy_sector_comparison.csv ({len(energy_sector)} rows)")

# =============================================================================
# OUTPUT 4: TIMELINE OF ENERGY EVENTS
# =============================================================================

energy_keywords = r"BGE|Pepco|Washington Gas|Constellation|Choptank|CHESSA|Solar|MAREC|Advanced Energy|Chaberton|Renewable"

energy_timeline = events_2526[
    (events_2526['employer'].str.contains(energy_keywords, case=False, na=False)) |
    (events_2526['sponsors'].str.contains(energy_keywords, case=False, na=False))
][['event_date', 'employer', 'total_cost', 'groups_invited']].copy()

energy_timeline['category'] = energy_timeline['employer'].apply(categorize_energy)
energy_timeline = energy_timeline.sort_values('event_date')

energy_timeline.to_csv('output_energy_events_timeline.csv', index=False)
print(f"✓ Created: output_energy_events_timeline.csv ({len(energy_timeline)} rows)")

# =============================================================================
# OUTPUT 5: TOP 15 OVERALL SPENDERS
# =============================================================================

top_15 = events_2526.groupby('employer').agg(
    total_spent=('total_cost', 'sum'),
    num_events=('total_cost', 'count')
).sort_values('total_spent', ascending=False).head(15).reset_index()

top_15.to_csv('output_top_15_spenders.csv', index=False)
print(f"✓ Created: output_top_15_spenders.csv ({len(top_15)} rows)")

# =============================================================================
# OUTPUT 6: COMMITTEE TARGETING COMPARISON
# =============================================================================

committees = {
    'General Assembly': r'General Assembly',
    'House ENT': r'Environment and Transportation',
    'Senate EEE': r'Education.*Energy.*Environment|Education, Energy',
    'House Econ Matters': r'House Economic Matters',
    'Senate Finance': r'Senate Finance',
    'House Appropriations': r'House Appropriations',
    'Senate Budget & Tax': r'Senate Budget and Taxation'
}

cmte_data = []
for period, df in [('2024-2025', events_2425), ('2025-2026', events_2526)]:
    for name, pattern in committees.items():
        matches = df[df['groups_invited'].str.contains(pattern, case=False, na=False)]
        cmte_data.append({
            'committee': name,
            'period': period,
            'total_spent': matches['total_cost'].sum(),
            'num_events': len(matches)
        })

cmte_df = pd.DataFrame(cmte_data)
cmte_df.to_csv('output_committee_targeting.csv', index=False)
print(f"✓ Created: output_committee_targeting.csv ({len(cmte_df)} rows)")

# =============================================================================
# OUTPUT 7: ENERGY COMMITTEE EVENT DETAILS
# =============================================================================

energy_events_detail = ent_eee_2526[['event_date', 'employer', 'organization_firm', 'total_cost', 'groups_invited']].copy()
energy_events_detail = energy_events_detail.sort_values('total_cost', ascending=False)
energy_events_detail['category'] = energy_events_detail['employer'].apply(categorize_energy)

# Label which committee was targeted
def label_committee(groups):
    has_ent = 'Environment and Transportation' in str(groups)
    has_eee = 'Education' in str(groups) and 'Energy' in str(groups)
    if has_ent and has_eee:
        return 'Both'
    elif has_ent:
        return 'House ENT'
    else:
        return 'Senate EEE'

energy_events_detail['target_committee'] = energy_events_detail['groups_invited'].apply(label_committee)

energy_events_detail.to_csv('output_energy_committee_details.csv', index=False)
print(f"✓ Created: output_energy_committee_details.csv ({len(energy_events_detail)} rows)")

# =============================================================================
# OUTPUT 8: LOBBYING FIRMS FOR ENERGY CLIENTS
# =============================================================================

energy_firms = ent_eee_2526.groupby('organization_firm').agg(
    total_spent=('total_cost', 'sum'),
    num_events=('total_cost', 'count'),
    clients=('employer', lambda x: ', '.join(x.unique()))
).sort_values('total_spent', ascending=False).reset_index()

energy_firms.to_csv('output_energy_lobbying_firms.csv', index=False)
print(f"✓ Created: output_energy_lobbying_firms.csv ({len(energy_firms)} rows)")

# =============================================================================
# DONE
# =============================================================================

print("\n" + "="*60)
print("COMPLETE: 8 output files created")
print("="*60)
print("""
OUTPUT FILES:
1. output_energy_committee_spending.csv    → Bar chart: who lobbied ENT/EEE
2. output_utilities_comparison.csv         → Grouped bar: utilities YoY
3. output_energy_sector_comparison.csv     → Stacked bar: traditional vs renewable
4. output_energy_events_timeline.csv       → Timeline: when events happened
5. output_top_15_spenders.csv              → Bar chart: overall top spenders
6. output_committee_targeting.csv          → Grouped bar: committee comparison
7. output_energy_committee_details.csv     → Table: full event list
8. output_energy_lobbying_firms.csv        → Bar chart: lobbying firms
""")
