INDUSTRIAL FIRE MVP — ML HANDOFF
================================

Problem Statement:
26162 - AI-Based Detection and Classification of Industrial Fires
and Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data


DATASET
=======

File:
industrial_fire_predictions.csv

Rows:
31,422

Columns:
26

Region:
Northern Zone

FIRMS period:
2024-01-01 to 2024-03-31


ML MODEL
========

Algorithm:
XGBoost Multiclass Classifier

Model file:
industrial_fire_model.joblib

Classes:
1. Agricultural Burn
2. Industrial Candidate
3. Other Thermal Anomaly
4. Vegetation Fire

Model features:
16 raw features

FIRMS thermal features:
- bright_ti4
- bright_ti5
- frp
- scan
- track

FIRMS metadata:
- confidence
- daynight

Persistence:
- detection_count
- days_detected
- persistent_3plus
- highly_persistent_10plus

Power context:
- distance_to_power_km
- power_within_5km

Sentinel-2:
- ndvi
- ndbi
- ndwi


OUTPUT / GIS FIELDS
===================

Use:
latitude
longitude

for plotting thermal anomaly locations on the GIS map.

Main classification field:
predicted_class

Confidence field:
model_confidence

Class probability fields:
- prob_agricultural_burn
- prob_industrial_candidate
- prob_other_thermal_anomaly
- prob_vegetation_fire


PERSISTENCE
===========

persistent_3plus = 1
means the anomaly was detected on >= 3 distinct days.

highly_persistent_10plus = 1
means the anomaly was detected on >= 10 distinct days.


OFFSHORE
========

FIRMS type 3 was handled as a separate rule-based category
"Offshore" and was excluded from the 4-class ML training dataset.

Therefore, the prediction CSV contains the 4 ML classes only.


SATELLITE
=========

Satellite source:
Sentinel-2 Surface Reflectance Harmonized

Period:
2024-01-01 to 2024-03-31

Features:
- NDVI
- NDBI
- NDWI

These are contextual satellite-derived features from a
Jan-Mar 2024 composite.


MODEL VALIDATION
================

Leakage-aware XGBoost + Sentinel-2:

Accuracy:
approximately 91.19%

Macro F1:
approximately 72.13%

IMPORTANT:
These are weak/proxy-label validation results.
They are NOT independently verified real-world accuracy.


MVP USAGE
=========

For the Monday MVP, the website/dashboard should use:

industrial_fire_predictions.csv

The frontend can use:
latitude + longitude → GIS marker

predicted_class → classification/category

model_confidence → confidence displayed to user

days_detected / persistent_3plus / highly_persistent_10plus
→ persistence information

frp, NDVI, NDBI, NDWI, distance_to_power_km
→ event details/context


MODEL FILE NOTE
===============

industrial_fire_model.joblib contains:
- trained XGBoost pipeline
- preprocessing
- label encoder
- feature definitions
- model metadata

The model file itself does not depend on the creator's
Google Drive path.

For the Monday MVP, live model inference is not required.
The prediction CSV is the primary frontend/GIS input.