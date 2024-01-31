@echo off
set PATH=%PATH%;%~dp0\node_modules\.bin
rem worldmap.geo.json Map was exported from https://geojson-maps.ash.ms/
rem Select "High Resolution", then choose all Regions, then click Build Custom GeoJSON"
rem geoproject -r d3-geo-projection "d3.geoHyperelliptical()" worldmap.geo.json > worldmap-hyperelliptical.geo.json
rem geo2svg worldmap-hyperelliptical.geo.json -o worldmap-hyperelliptical.svg -w 2048 -h 1200 --stroke "blue" --fill "black"

rem Map data sourced from Natural Earth, at 10m resolution:
rem https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/
rem https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-lakes/
download --extract --out naturalearthdata https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_land.zip
download --extract --out naturalearthdata https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_lakes.zip
call shp2json naturalearthdata\ne_10m_land.shp -o ne_10m_land.geo.json
call shp2json naturalearthdata\ne_10m_lakes.shp -o ne_10m_lakes.geo.json
call node geojson-filter.js --min-area=5000 ne_10m_lakes.geo.json ne_10m_lakes-5000km2.geo.json
call geoproject -r d3-geo-projection "d3.geoHyperelliptical()" ne_10m_land.geo.json > ne_10m_land-hyperelliptical.geo.json
call geoproject -r d3-geo-projection "d3.geoHyperelliptical()" ne_10m_lakes-5000km2.geo.json > ne_10m_lakes-5000km2-hyperelliptical.geo.json
call geo2svg ne_10m_land-hyperelliptical.geo.json -o ne_10m_land-hyperelliptical.svg -w 2048 -h 1200 --stroke "none" --fill "black"
call geo2svg ne_10m_lakes-5000km2-hyperelliptical.geo.json -o ne_10m_lakes-5000km2-hyperelliptical.svg -w 2048 -h 1200 --stroke "none" --fill "blue"
