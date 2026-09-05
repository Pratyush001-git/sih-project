# SIH SH26162 — Simple Website Architecture & Complete User Flow

## 1. Purpose of this document

This document is the **frontend + website architecture specification** for the SIH SH26162 project:

> **AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA FIRMS, OpenStreetMap, and Satellite Data**

The website should be:

- Simple
- Professional
- Clean
- Easy to understand
- Responsive on laptop and mobile
- Fast to load
- Secure
- Suitable for an SIH demo
- Easy to connect to the ML model later

### Important scope decision

**Do not build the ML model, model training, API layer, or model internals from this document.**

The ML/model team is working separately.

The website only needs a **small model-integration placeholder/interface** so that the trained model can be connected later.

The website is the **decision-support and visualization layer**, not the intelligence engine.

The source documents describe the dashboard as the final decision-support layer and recommend an interactive map, filters, hotspot details, historical graphs, and satellite context.  
fileciteturn2file0L177-L192

---

# 2. What the website should do

In very simple terms:

```text
User opens website
        ↓
Selects a region / date range
        ↓
Sees thermal hotspots on a map
        ↓
Applies filters
        ↓
Clicks one hotspot
        ↓
Sees hotspot information
        ↓
Sees nearby industrial/geographic context
        ↓
Sees historical/persistence information
        ↓
Sees satellite/environmental context
        ↓
Sees classification result
        ↓
Sees priority/risk level
        ↓
Can investigate / save / export the result
```

The core project logic from the source documents is:

```text
Hotspot
   ↓
Context
   ↓
History
   ↓
Classification
   ↓
Prioritization
```

fileciteturn3file4L647-L661

---

# 3. Target users

Keep the first version focused.

## User Type 1 — Monitoring Officer

Wants to:

- See suspicious hotspots
- Find persistent locations
- Check industrial proximity
- Inspect individual hotspots
- Prioritize locations for investigation

## User Type 2 — Researcher / Analyst

Wants to:

- Filter data
- Compare hotspots
- View historical activity
- Inspect satellite context
- Understand why a location received a priority level

## User Type 3 — SIH Judge / Demo User

Wants to understand the project in **20–30 seconds**.

Therefore, the home/dashboard page must immediately show:

- What the system monitors
- Where hotspots are
- Which locations need attention
- How the system reaches its result

---

# 4. Website pages

Keep the website small.

Recommended pages:

```text
1. Home / Dashboard
2. Hotspot Explorer
3. Hotspot Details
4. History
5. About the System
6. FAQ
7. Privacy / Security
```

Do NOT create unnecessary pages.

---

# 5. Navigation

## Desktop navigation

```text
---------------------------------------------------------
LOGO / PROJECT NAME

Dashboard | Explore Hotspots | About | FAQ

                         Help / User
---------------------------------------------------------
```

## Mobile navigation

Use a simple hamburger menu:

```text
┌───────────────────────────┐
│ ☰   SH26162 Monitor       │
└───────────────────────────┘
```

Menu:

```text
Dashboard
Explore Hotspots
About
FAQ
Privacy
```

Do not create a complicated mega-menu.

---

# 6. Home / Dashboard page

This is the most important page.

The user should understand the website without reading a large amount of text.

## Page structure

```text
HEADER
  ↓
SHORT PROJECT INTRO
  ↓
SUMMARY CARDS
  ↓
MAIN MAP
  ↓
FILTERS
  ↓
PRIORITY HOTSPOTS
  ↓
RECENT ACTIVITY
  ↓
SHORT EXPLANATION
  ↓
FAQ PREVIEW
  ↓
FOOTER
```

---

# 7. Dashboard header

Use a simple header.

### Example

```text
Industrial Thermal Monitoring

Satellite-assisted monitoring of thermal anomalies
and potentially persistent industrial sources.

[Explore Hotspots]
```

Avoid:

- Huge animations
- Video backgrounds
- Glowing effects
- Excessive gradients
- 3D graphics
- Automatic carousels

The website should feel like a **real monitoring tool**, not a gaming website.

---

# 8. Summary cards

Show 4 simple cards.

```text
┌────────────────┐
│ Active Hotspots│
│      128       │
└────────────────┘

┌────────────────┐
│ Persistent     │
│ Sources        │
│       24       │
└────────────────┘

┌────────────────┐
│ Industrial     │
│ Candidates     │
│       18       │
└────────────────┘

┌────────────────┐
│ High Priority  │
│       7        │
└────────────────┘
```

These categories come directly from the recommended dashboard structure.  
fileciteturn1file0L54-L71

### Mobile

Cards should become:

```text
[ Active Hotspots ]

[ Persistent Sources ]

[ Industrial Candidates ]

[ High Priority ]
```

Do not force four cards into one row on a phone.

---

# 9. Main map

The map is the main visual component.

Recommended technology from the source documents:

- Streamlit
- Folium
- Plotly

fileciteturn1file0L54-L60

If implementing as a conventional web frontend instead of Streamlit, use an equivalent lightweight interactive map library.

## Map should show

### Layer 1 — Thermal hotspots

Each hotspot is a clickable point.

### Layer 2 — Industrial context

Show:

- Industrial areas
- Factories
- Power plants
- Relevant facilities

### Layer 3 — Roads

Optional toggle.

### Layer 4 — Residential context

Optional toggle.

### Layer 5 — Priority

Allow users to visually distinguish:

```text
Low
Medium
High
Critical
```

These priority levels are project-defined outputs, not universal danger categories.  
fileciteturn1file0L27-L50

---

# 10. Map controls

Keep map controls simple.

```text
[ + ]
[ - ]

Layers
□ Hotspots
□ Industrial Areas
□ Roads
□ Residential Areas
□ Priority
```

Additional:

```text
[ Reset View ]
[ Locate Study Area ]
```

Do not add unnecessary map buttons.

---

# 11. Hotspot filters

Place filters above or beside the map.

## Filters

### Region

```text
Region:
[ Delhi NCR ▼ ]
```

### Date

```text
From: [ date ]
To:   [ date ]
```

### Priority

```text
Priority:
☐ Low
☐ Medium
☐ High
☐ Critical
```

### Classification

```text
Classification:
☐ Industrial Fire
☐ Industrial Thermal Source
☐ Agricultural/Vegetation Fire
☐ Forest Fire
☐ Other Thermal Anomaly
☐ Unknown
```

These are based on the project classification categories described in the source material.  
fileciteturn2file0L1595-L1608

### Persistence

```text
Persistence:
[ Any ▼ ]
```

Possible simple choices:

```text
Any
Low
Medium
High
```

### Industrial proximity

```text
Near industrial area:
☐ Yes
☐ No
```

---

# 12. Search

Provide one simple search box:

```text
Search hotspot ID, location, or area
[__________________________] [Search]
```

Do not build complicated natural-language search for the MVP.

---

# 13. Hotspot selection flow

When the user clicks a hotspot:

```text
Map
 ↓
Click hotspot
 ↓
Small popup
 ↓
[View Details]
 ↓
Hotspot Details page/panel
```

### Popup

Example:

```text
Hotspot #H1024

Priority: HIGH
Classification: Industrial Thermal Source
Persistence: 30%

[View Details]
```

Keep popup small.

---

# 14. Hotspot Details page

This page explains **why the selected hotspot matters**.

## Layout

Desktop:

```text
---------------------------------------------------------
HOTSPOT #H1024

[Back to Map]

┌───────────────────────┐
│ Classification        │
│ Industrial Thermal    │
│ Source                │
└───────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐
│ Confidence │ │ Persistence│ │ Priority   │
│    91%     │ │    30%     │ │    HIGH    │
└────────────┘ └────────────┘ └────────────┘

MAP

Thermal Information
Geographic Context
Historical Activity
Satellite Context
Evidence / Explanation
---------------------------------------------------------
```

The source dashboard example includes classification, confidence, FRP, persistence, nearest industrial feature, and risk/priority.  
fileciteturn2file1L1909-L1944

---

# 15. Hotspot basic information

Show:

```text
Hotspot ID
Latitude
Longitude
Observation Date
Observation Time
Satellite
Instrument
Day/Night
```

These fields are part of the project's FIRMS data plan.  
fileciteturn2file0L288-L313

Do not show every raw dataset field by default.

Use:

```text
[Show technical details]
```

for advanced users.

---

# 16. Thermal information

Show simple values:

```text
FRP
Brightness Temperature
Detection Confidence
```

Add small help icons:

```text
FRP       [?]
Confidence [?]
```

When clicked:

```text
FRP represents the estimated rate of radiative
energy release. It should not be interpreted as
exact fire size or exact danger.
```

The project documents specifically warn that FRP is a thermal-intensity feature and not exact fire size or danger.  
fileciteturn2file1L1286-L1294

---

# 17. Geographic context

Show:

```text
Nearest industrial feature
143 m

Nearest road
80 m

Nearest residential area
900 m

Industrial features nearby
7
```

These are the type of spatial features specified in the project.  
fileciteturn2file1L1358-L1394

### Important wording

Do NOT write:

> "Factory caused the fire."

Instead write:

> "Industrial facility detected nearby."

A nearby industrial facility does not prove causality.  
fileciteturn3file4L675-L691

---

# 18. Persistence section

Show:

```text
Persistence

30%

27 detection days
out of
90 observation days
```

Also show a simple timeline:

```text
Jan 01 ──●────●──────●──●──── Jan 30
          ↑    ↑      ↑  ↑
       detections
```

The project defines persistence as a project-specific metric based on repeated detection days over observation days.  
fileciteturn2file1L1543-L1565

---

# 19. Historical activity

Use a simple line/bar chart.

Show:

- Detection timeline
- FRP trend
- Number of detections
- Persistence

These are explicitly recommended for the historical dashboard view.  
fileciteturn1file0L107-L118

### Chart rule

Do not make charts visually complicated.

Prefer:

```text
Title
↓
Simple chart
↓
One sentence explanation
```

Example:

> "Repeated detections indicate that this location has shown thermal activity on multiple observation days."

---

# 20. Satellite context

Show the satellite/environmental view around the hotspot.

Possible information:

```text
Satellite image

NDVI
NDBI
NDWI

Land/environment description
```

The project uses Sentinel-2 as environmental/spectral context rather than the primary hotspot detector.  
fileciteturn2file0L1422-L1501

### Cloud handling

If the satellite image is unusable:

```text
Satellite image unavailable

Reason:
Cloudy / insufficient valid pixels

The system did not estimate missing values.
```

The source explicitly says not to invent satellite values and to flag or replace unusable observations where possible.  
fileciteturn3file1L302-L313

---

# 21. Classification section

This is where the separate ML model will eventually connect.

## Website responsibility

The website should only receive something conceptually like:

```text
classification:
"Industrial Thermal Source"

confidence:
91%
```

The website does NOT train the model.

The website does NOT contain model-training code.

The website does NOT explain Random Forest/XGBoost implementation details.

### Temporary placeholder

Until the model is integrated:

```text
Classification

Industrial Thermal Source

Model result will appear here.
```

---

# 22. Model integration boundary

Keep a simple interface between the website and the separate model system.

Conceptually:

```text
WEBSITE
   |
   | hotspot/features
   ↓
MODEL MODULE
   |
   | classification + confidence
   ↓
WEBSITE
```

Expected website-side result:

```text
{
    "classification": "...",
    "confidence": "...",
    "status": "available"
}
```

This is only a conceptual interface.

**Do not implement an API architecture from this document.**

The actual model team can decide how the integration works.

---

# 23. Priority / Risk section

The project separates classification from prioritization.

### Classification asks:

> What is this likely to be?

### Priority asks:

> Which location should be investigated first?

fileciteturn1file1L336-L350

Show:

```text
Priority

HIGH

Priority score: 87

Why?
✓ Strong thermal signal
✓ Repeated detections
✓ Close to industrial area
✓ Residential context nearby
```

### Important disclaimer

Use:

> "Priority score is a project-defined prioritization score. It is not a probability of danger."

The source documents explicitly require this distinction.  
fileciteturn1file1L306-L317

---

# 24. Evidence / "Why this result?"

This is an important feature.

Instead of showing only:

```text
HIGH
```

show:

```text
Why is this location prioritized?

Thermal activity       HIGH
Persistence             HIGH
Industrial proximity    HIGH
Residential proximity  MEDIUM
Detection confidence   HIGH
```

This makes the system easier to trust and explain.

The source documents recommend exposing model confidence, evidence/features, persistence, risk components, and uncertainty.  
fileciteturn3file4L724-L734

---

# 25. Uncertainty

Every result should be capable of showing:

```text
Evidence quality: Good
```

or:

```text
Evidence quality: Limited
```

Possible reasons:

```text
OSM information incomplete
Satellite image cloudy
Historical observations limited
Classification unavailable
```

Do not hide uncertainty.

OSM is explicitly treated as incomplete geographic context rather than ground truth.  
fileciteturn3file4L695-L705

---

# 26. "Investigate" action

Add one clear button:

```text
[ Mark for Investigation ]
```

After clicking:

```text
✓ Hotspot added to investigation list
```

Optional:

```text
[ Remove from Investigation ]
```

For the MVP, this can be local/browser state or a simple temporary list.

Do not build a complicated case-management system.

---

# 27. Investigation list

A simple page/panel:

```text
Investigation List

H1024   HIGH
H1041   HIGH
H1102   CRITICAL

[View]
[Remove]
```

This is useful for the monitoring workflow.

---

# 28. Export

Optional but useful.

Buttons:

```text
[ Export CSV ]
[ Print Report ]
```

A simple report can contain:

```text
Hotspot ID
Location
Date
Classification
Confidence
Persistence
Priority
Nearby industrial context
Evidence
```

Do not generate a huge technical report by default.

---

# 29. About page

Keep it short.

## Section 1 — Problem

Explain:

> Satellites can detect unusual thermal activity, but a thermal anomaly does not automatically mean an industrial fire.

This distinction is central to the project.  
fileciteturn2file1L1030-L1055

## Section 2 — How it works

```text
FIRMS
  ↓
Thermal Hotspot
  ↓
Geographic Context
  ↓
Historical Persistence
  ↓
Satellite Context
  ↓
Classification
  ↓
Prioritization
```

## Section 3 — Data sources

```text
NASA FIRMS
OpenStreetMap
Sentinel-2
Landsat where useful
```

## Section 4 — Important limitation

> This is a satellite-assisted decision-support and prioritization system. It does not replace ground verification, fire departments, official emergency systems, or human investigation.

fileciteturn3file5L1121-L1132

---

# 30. FAQ page

The website must contain an FAQ.

## FAQ 1 — Is every hotspot a fire?

**Answer:**

No. A thermal anomaly can have multiple causes, including fire, agricultural burning, industrial furnaces, gas flares, sun-heated surfaces, industrial activity, or sensor-related anomalies.

fileciteturn2file2L2049-L2062

---

## FAQ 2 — Is every detected fire an industrial fire?

**Answer:**

No. FIRMS provides satellite-derived thermal/active-fire observations. The system uses additional geographic, historical and satellite context before producing a classification.

fileciteturn2file2L2097-L2124

---

## FAQ 3 — Why do you use OpenStreetMap?

**Answer:**

OSM provides geographic context such as industrial facilities, industrial areas, roads and residential areas near a hotspot.

fileciteturn2file2L2296-L2319

---

## FAQ 4 — What is persistence?

**Answer:**

Persistence measures how repeatedly a similar geographic location produces thermal detections over time.

fileciteturn2file2L2587-L2607

---

## FAQ 5 — Does high persistence prove an industrial source?

**Answer:**

No. Repeated activity can indicate a persistent source, but it does not by itself prove the source is industrial.

---

## FAQ 6 — Is the priority score a probability?

**Answer:**

No. It is a project-defined prioritization score used to rank locations for further investigation.

fileciteturn1file1L306-L317

---

## FAQ 7 — What if OSM does not show a factory?

**Answer:**

The system does not assume the factory does not exist. OSM can be incomplete, so the website should preserve uncertainty and use other available evidence.

fileciteturn3file4L695-L705

---

## FAQ 8 — What happens when satellite imagery is cloudy?

**Answer:**

The system should flag the imagery as unusable or unavailable and use another valid observation where possible. It should never invent a satellite value.

fileciteturn3file4L738-L750

---

## FAQ 9 — Can the system detect every industrial fire?

**Answer:**

No. Satellite revisit timing, spatial resolution, cloud conditions, detection thresholds, missing geographic information and model errors can affect detection.

fileciteturn1file1L420-L446

---

## FAQ 10 — Is this an emergency response system?

**Answer:**

No. It is a decision-support and prioritization system. Results should be verified by appropriate human or official processes.

---

## FAQ 11 — Why is the website showing uncertainty?

**Answer:**

Because no single dataset is perfect. OSM can be incomplete, satellite observations can have limitations, and classifications can be wrong. Showing uncertainty prevents overconfident conclusions.

---

## FAQ 12 — Can this scale to India?

**Answer:**

Yes, the project is designed to start with a focused region such as Delhi NCR and then expand through region-based processing to more regions and eventually India.

fileciteturn3file8L1528-L1551

---

# 31. Responsive design

The website must be designed **mobile-first**.

## Desktop

Recommended layout:

```text
---------------------------------------------------------
HEADER
---------------------------------------------------------
FILTERS
---------------------------------------------------------
SUMMARY CARDS
---------------------------------------------------------
             MAP
---------------------------------------------------------
HOTSPOTS TABLE
---------------------------------------------------------
CHARTS / DETAILS
---------------------------------------------------------
FOOTER
---------------------------------------------------------
```

## Mobile

Everything becomes one column:

```text
HEADER

FILTERS

SUMMARY CARD
SUMMARY CARD
SUMMARY CARD
SUMMARY CARD

MAP

HOTSPOT LIST

SELECTED HOTSPOT

HISTORY

SATELLITE

FAQ

FOOTER
```

---

# 32. Mobile map behavior

Maps are difficult on small screens.

Therefore:

- Map should have a fixed usable height.
- Filters should be collapsible.
- Layer controls should be compact.
- Hotspot details should open below the map or as a full-screen panel.
- Avoid tiny buttons.
- Touch targets should be comfortable.
- Do not depend on hover interactions.

---

# 33. Mobile tables

Do not show a huge table on mobile.

Instead use cards:

```text
H1024
HIGH
Industrial Thermal Source
Persistence: 30%
Industrial distance: 143 m

[View]
```

On desktop, the same information can become a table.

---

# 34. Visual design

## Design direction

Use:

- White or very light background
- Dark text
- One restrained accent color
- Simple cards
- Thin borders
- Small shadows
- Consistent spacing
- Clear typography

## Avoid

- Neon colors
- Excessive gradients
- Glassmorphism everywhere
- Huge hero sections
- Excessive rounded corners
- Animated backgrounds
- Parallax
- 3D elements
- Flashing alerts
- Excessive icons
- Too many colors

### Overall feeling

The website should look like:

> **A professional GIS monitoring dashboard**

not:

> **A flashy AI startup landing page**

---

# 35. Color meaning

Use color mainly for status.

Example:

```text
Normal       → neutral
Low          → light status color
Medium       → warning color
High         → stronger warning color
Critical     → strong danger color
```

Do not use color alone.

Also include text:

```text
HIGH
```

not only a colored dot.

This improves accessibility.

---

# 36. Typography

Use one main font family.

Recommended hierarchy:

```text
H1 → 30–36px
H2 → 22–28px
H3 → 18–20px
Body → 15–17px
Small → 13–14px
```

On mobile:

```text
H1 → ~26–30px
H2 → ~20–24px
Body → ~15–16px
```

Keep line length readable.

---

# 37. Image strategy

The website may contain:

- Satellite previews
- Project illustrations
- Logos
- Small UI icons

Do not load unnecessarily large images.

### Rules

1. Use WebP where supported.
2. Use responsive image sizes.
3. Lazy-load images below the fold.
4. Do not use 4K images for small cards.
5. Provide width and height to reduce layout shifting.
6. Use compressed thumbnails for satellite previews.
7. Keep original satellite data separate from web thumbnails.

---

# 38. Image compression commands

If using ImageMagick:

```bash
magick input.png -strip -resize 1600x1600\> -quality 80 output.webp
```

For JPEG:

```bash
magick input.jpg -strip -resize 1600x1600\> -quality 78 output.jpg
```

If using `cwebp`:

```bash
cwebp -q 80 input.jpg -o output.webp
```

For PNG:

```bash
cwebp -lossless input.png -o output.webp
```

### Important

Do not compress the original scientific/satellite dataset itself just to make the website smaller.

Create:

```text
Original scientific data
        ↓
Web preview / thumbnail
        ↓
Website
```

---

# 39. Satellite image optimization

For satellite previews:

```text
Original raster
      ↓
Crop around hotspot
      ↓
Resize
      ↓
Compress
      ↓
WebP preview
      ↓
Website
```

The website should never download an unnecessarily huge raster just to display a small preview.

---

# 40. Loading states

Every slow operation needs a visible state.

Example:

```text
Loading hotspots...
```

Map:

```text
Loading map data...
```

Hotspot details:

```text
Loading hotspot details...
```

Satellite:

```text
Loading satellite context...
```

Model result:

```text
Classification is being loaded...
```

---

# 41. Error states

Errors should be understandable.

Bad:

```text
500 Internal Server Error
```

Better:

```text
Unable to load hotspot information.

Please try again.

[Retry]
```

For missing data:

```text
Satellite context is currently unavailable
for this location.
```

For incomplete data:

```text
Some geographic information is unavailable.
The result may have limited evidence.
```

---

# 42. Empty states

If filters return nothing:

```text
No hotspots found.

Try:
- Expanding the date range
- Removing a filter
- Selecting another priority
```

Do not leave a blank screen.

---

# 43. Security requirements

Security should be included from the beginning.

## 43.1 HTTPS

The deployed website must use HTTPS.

Never deploy the production dashboard over plain HTTP.

---

## 43.2 Secrets

Never put secrets inside frontend code.

Do NOT write:

```text
SECRET_KEY = "abc123"
```

inside the website source.

Use environment variables or secure deployment secrets.

Example:

```text
ENVIRONMENT
├── DATA_SOURCE_CONFIG
├── SESSION_SECRET
└── OTHER_PRIVATE_CONFIG
```

Do not expose secrets to the browser.

---

# 44. Input validation

All user-controlled inputs must be validated.

Examples:

### Date

Accept only valid dates.

### Coordinates

Check:

```text
latitude  ∈ [-90, 90]
longitude ∈ [-180, 180]
```

### Search

Limit:

- Length
- Allowed characters
- Request frequency

### IDs

Do not directly trust IDs received from the browser.

---

# 45. XSS protection

Never directly inject user input into HTML.

Avoid unsafe rendering of:

```text
search query
location name
hotspot notes
uploaded text
```

Escape displayed text.

Use the framework's safe rendering mechanisms.

---

# 46. SQL / database safety

If a database is introduced later:

- Use parameterized queries.
- Never concatenate user input into SQL.
- Use least-privilege database users.
- Do not expose the database directly to the browser.

For the MVP, simple files can be sufficient where practical. The project documentation notes that Parquet can be a compact and efficient option for structured tabular data, while PostGIS can be introduced later as scale and spatial-query needs grow.  
fileciteturn1file2L496-L511

---

# 47. Authentication

For a public demo:

```text
Public dashboard
```

may be enough.

For a restricted monitoring deployment:

```text
Login
 ↓
Dashboard
```

Use:

- Secure password hashing
- Secure session handling
- Session expiration
- Logout
- Rate limiting
- Role-based access if required

Do not build a complex authentication system unless the deployment actually requires it.

---

# 48. Authorization

If login is added:

### Viewer

Can:

- View dashboard
- Search
- Filter
- View hotspots

### Analyst

Can:

- Viewer permissions
- Mark for investigation
- Export data

### Admin

Can:

- Manage users
- Manage system configuration

Keep roles simple.

---

# 49. Rate limiting

Protect expensive actions.

Potentially limit:

```text
Search requests
Export requests
Heavy map queries
Repeated refreshes
```

The goal is to prevent accidental or malicious overload.

---

# 50. Data privacy

The website should avoid collecting unnecessary personal information.

For the MVP:

- Do not require a user account unless necessary.
- Do not collect location from the user's device unless required.
- Do not collect unnecessary analytics.
- Do not store unnecessary personal information.

---

# 51. Logging

Log technical events, not unnecessary personal information.

Useful logs:

```text
Application started
Data loaded
Hotspot query completed
Satellite image unavailable
Model result unavailable
Error occurred
```

Do not log:

```text
Passwords
Secrets
Authentication tokens
Private credentials
```

---

# 52. Security headers

Where supported by the deployment stack, configure:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Do not blindly copy a restrictive Content Security Policy without testing the map, charts, fonts and other required resources.

---

# 53. Dependency security

Keep dependencies updated.

Before deployment:

```bash
npm audit
```

or the equivalent security check for the chosen stack.

Also remove unused packages.

The website should not contain unnecessary libraries.

---

# 54. Performance requirements

Target:

- Fast first load
- Small JavaScript bundle
- Compressed images
- Lazy loading
- Minimal animations
- Efficient map rendering
- Cached static assets

Do not load every hotspot detail on initial page load.

Use:

```text
Dashboard
   ↓
Load summary
   ↓
Load map
   ↓
User selects hotspot
   ↓
Load detailed information
```

---

# 55. Data loading strategy

Use simple separation:

```text
Raw Data
   ↓
Processed Data
   ↓
Website-ready Data
   ↓
Frontend
```

Website-ready data should contain only what the UI needs.

Example:

```text
hotspot_id
latitude
longitude
date
priority
classification
confidence
persistence
frp
nearest_industry
```

Do not send unnecessary raw fields to the browser.

---

# 56. Suggested frontend data structure

Conceptually:

```json
{
  "hotspot_id": "H1024",
  "location": {
    "latitude": 28.61,
    "longitude": 77.32
  },
  "observation": {
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "frp": 48,
    "brightness_temperature": 340,
    "confidence": 91
  },
  "context": {
    "nearest_industry_m": 143,
    "nearest_road_m": 80,
    "nearest_residential_m": 900,
    "industrial_feature_count": 7
  },
  "history": {
    "detection_days": 27,
    "observation_days": 90,
    "persistence": 30
  },
  "classification": {
    "label": "Industrial Thermal Source",
    "confidence": 91
  },
  "priority": {
    "level": "HIGH",
    "score": 87
  },
  "evidence": {
    "thermal": "HIGH",
    "persistence": "HIGH",
    "industrial_proximity": "HIGH",
    "residential_proximity": "MEDIUM"
  }
}
```

This is a **website data contract example**, not an API specification.

---

# 57. Recommended component structure

Keep the frontend modular.

```text
components/
│
├── Header
├── Navigation
├── SummaryCards
├── FilterPanel
├── HotspotMap
├── HotspotPopup
├── HotspotTable
├── HotspotCard
├── HotspotDetails
├── ThermalSummary
├── GeographicContext
├── PersistenceChart
├── SatellitePreview
├── ClassificationCard
├── PriorityCard
├── EvidencePanel
├── FAQ
├── Footer
└── LoadingState
```

This makes later model integration easier.

---

# 58. Main application flow

```text
START
  ↓
Load website
  ↓
Load basic dashboard data
  ↓
Show summary cards
  ↓
Show map
  ↓
User changes filters?
  ├── YES → update visible hotspots
  └── NO
  ↓
User clicks hotspot?
  ├── NO → continue browsing
  └── YES
       ↓
  Show hotspot details
       ↓
  Show context
       ↓
  Show history
       ↓
  Show satellite preview
       ↓
  Show classification if available
       ↓
  Show priority
       ↓
  Show evidence
       ↓
  User marks for investigation?
       ├── YES → save locally / system storage
       └── NO
```

---

# 59. First-time user flow

A new user should follow:

```text
Home
 ↓
"What does this system do?"
 ↓
See hotspots
 ↓
Click hotspot
 ↓
Understand context
 ↓
Understand persistence
 ↓
Understand classification
 ↓
Understand priority
```

No tutorial popup should be required.

The interface itself should be understandable.

---

# 60. Judge demo flow

Use this exact demo sequence:

```text
1. Open Dashboard
2. Show summary cards
3. Show map
4. Click a hotspot
5. Show geographic context
6. Show historical detections
7. Show persistence
8. Show satellite context
9. Show classification
10. Show priority
11. Show evidence
12. Explain uncertainty
```

This matches the project's documented demo sequence.  
fileciteturn1file4L931-L946

---

# 61. Recommended homepage text

Keep the explanation short:

> **Detect. Understand. Prioritize.**
>
> Satellite observations can reveal unusual thermal activity, but a hotspot does not automatically identify its source. This system combines thermal observations with geographic context, historical persistence and satellite-derived environmental information to help identify locations that may require further investigation.

---

# 62. Footer

Keep it simple.

```text
---------------------------------------------------------
SH26162

Satellite-assisted industrial thermal monitoring

Dashboard | About | FAQ | Privacy

Data sources:
NASA FIRMS | OpenStreetMap | Satellite imagery

This system is for decision support and prioritization.
It does not replace official verification or emergency systems.

© 2026 Project Team
---------------------------------------------------------
```

---

# 63. Accessibility

Minimum requirements:

- Keyboard navigation
- Visible focus states
- Good text contrast
- Alt text for meaningful images
- Buttons with readable labels
- Do not rely only on color
- Form labels must be visible
- Charts should have text summaries
- Map information should have an alternative list/card view

Example:

Do not show only:

```text
🔴
```

Show:

```text
HIGH PRIORITY
```

---

# 64. Browser support

Test at minimum on:

```text
Chrome
Edge
Firefox
Safari
```

And:

```text
Windows laptop
Mac laptop
Android phone
iPhone
```

---

# 65. Testing checklist

## Functional

- [ ] Dashboard loads
- [ ] Map loads
- [ ] Hotspots appear
- [ ] Filters work
- [ ] Search works
- [ ] Hotspot popup works
- [ ] Details open
- [ ] Historical chart works
- [ ] Satellite preview works
- [ ] Classification placeholder works
- [ ] Priority appears
- [ ] FAQ works
- [ ] Export works if enabled

## Mobile

- [ ] Navigation works
- [ ] Map is usable
- [ ] Cards stack correctly
- [ ] Text is readable
- [ ] Buttons are easy to tap
- [ ] No horizontal scrolling
- [ ] Charts fit screen
- [ ] Tables become cards

## Security

- [ ] HTTPS
- [ ] No secrets in frontend
- [ ] Input validation
- [ ] Safe text rendering
- [ ] Secure authentication if used
- [ ] Rate limiting where required
- [ ] Security headers
- [ ] Dependencies checked
- [ ] Error messages do not expose internals

## Performance

- [ ] Images compressed
- [ ] WebP used where appropriate
- [ ] Lazy loading
- [ ] No unnecessary large assets
- [ ] Map data loaded efficiently
- [ ] Detail data loaded on demand

---

# 66. What NOT to build in this website version

Do not add:

```text
❌ ML training interface
❌ Dataset training page
❌ Hyperparameter controls
❌ Model experimentation page
❌ API management dashboard
❌ Complex admin panel
❌ Real-time command center animations
❌ 3D globe
❌ Animated satellite orbit
❌ Full-screen video background
❌ Excessive charts
❌ Complex social login
❌ Unnecessary user profiles
```

The website should demonstrate the **usable result**, not the entire research pipeline.

---

# 67. MVP feature list

## Must have

```text
✓ Dashboard
✓ Summary cards
✓ Interactive map
✓ Hotspot filters
✓ Search
✓ Hotspot details
✓ Thermal information
✓ OSM/geographic context
✓ Persistence
✓ Historical chart
✓ Satellite preview
✓ Classification placeholder
✓ Priority/risk display
✓ Evidence explanation
✓ FAQ
✓ Responsive design
✓ Security basics
✓ Image compression
```

## Nice to have

```text
○ Investigation list
○ CSV export
○ Print report
○ Saved filters
○ Advanced history
```

## Later

```text
○ Automated alerts
○ User roles
○ Advanced analytics
○ Large-scale India view
○ PostGIS-backed spatial search
○ Advanced reporting
```

The project documents similarly separate an MVP from advanced additions such as automated ingestion, PostGIS, alerts and near-real-time monitoring.  
fileciteturn1file8L1396-L1443

---

# 68. Simple architecture diagram

```text
                 DATA / MODEL TEAM
                       │
                       │
             Website-ready results
                       │
                       ▼
┌─────────────────────────────────────────┐
│               WEBSITE                   │
│                                         │
│  Dashboard                              │
│     │                                   │
│     ├── Summary Cards                   │
│     │                                   │
│     ├── Filters                         │
│     │                                   │
│     ├── Interactive Map                 │
│     │       │                           │
│     │       └── Hotspot Selection       │
│     │                 │                 │
│     │                 ▼                 │
│     ├── Hotspot Details                 │
│     │       ├── Thermal Data            │
│     │       ├── Geographic Context      │
│     │       ├── Persistence             │
│     │       ├── History                 │
│     │       ├── Satellite Context       │
│     │       ├── Classification          │
│     │       ├── Priority                │
│     │       └── Evidence                │
│     │                                   │
│     ├── About                           │
│     ├── FAQ                             │
│     └── Privacy                         │
└─────────────────────────────────────────┘
```

---

# 69. Final implementation philosophy

The website should follow this rule:

> **Simple enough to understand in 20 seconds, detailed enough to investigate a hotspot in 2 minutes.**

The underlying project is technically complex, involving thermal observations, geographic context, satellite information, persistence, classification and prioritization. The website should hide unnecessary complexity while still allowing the user to inspect the evidence.

The project source describes the dashboard as the layer that makes model output understandable to users.  
fileciteturn1file2L515-L525

---

# 70. Final one-screen user story

A judge should be able to do this without assistance:

```text
OPEN WEBSITE
     ↓
SEE HIGH-LEVEL COUNTS
     ↓
SEE HOTSPOTS ON MAP
     ↓
CLICK HIGH-PRIORITY HOTSPOT
     ↓
SEE:
  • What was detected
  • Where it is
  • What is nearby
  • Whether it repeats
  • What the satellite context shows
  • What the classification says
  • How confident the classification is
  • Why it was prioritized
  • What uncertainty exists
     ↓
DECIDE:
"Yes, this is a location worth investigating."
```

---

# 71. Golden rules for whoever builds the website

1. **Do not make it flashy.**
2. **Do not make the homepage look like a marketing website.**
3. **Map first, information second, decoration last.**
4. **Use short text.**
5. **Show evidence, not just conclusions.**
6. **Show uncertainty instead of pretending the result is perfect.**
7. **Never claim that a nearby factory caused a hotspot.**
8. **Never call the priority score a probability.**
9. **Never invent missing satellite information.**
10. **Do not expose secrets in frontend code.**
11. **Validate user inputs.**
12. **Compress web images.**
13. **Keep the site fast.**
14. **Make every important feature usable on mobile.**
15. **Keep the ML integration separate.**
16. **Keep APIs out of the website specification unless the integration team later requires them.**
17. **The website is a decision-support interface, not an emergency-response system.**
18. **Every major screen should work with keyboard and touch.**
19. **Use clear loading, empty and error states.**
20. **Prefer a clean professional dashboard over visual effects.**

---

# 72. Final architecture summary

```text
USER
 ↓
DASHBOARD
 ↓
FILTER / SEARCH
 ↓
MAP
 ↓
SELECT HOTSPOT
 ↓
HOTSPOT DETAILS
 ↓
┌───────────────────────────────┐
│ Thermal Information           │
│ Geographic Context            │
│ Persistence                   │
│ Historical Activity           │
│ Satellite Context             │
│ Classification                │
│ Confidence                    │
│ Priority                      │
│ Evidence                      │
│ Uncertainty                   │
└───────────────────────────────┘
 ↓
INVESTIGATION / EXPORT
```

The website should remain a **clean, responsive, secure GIS monitoring dashboard** with a simple boundary around the separately trained model.

The core project idea remains:

```text
Thermal Anomaly
      ↓
Geographic Context
      ↓
Historical Persistence
      ↓
Classification
      ↓
Prioritization
      ↓
Human Investigation
```

That is the story the website should communicate.
