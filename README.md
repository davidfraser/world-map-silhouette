World Map
=========

This code is to generate a world map suitable for painting in large scale onto a wall.

The data is sourced in non-projected form from the high resolution data freely available at
https://www.naturalearthdata.com/downloads/10m-physical-vectors/

The projection used is [Tobler Hyperelliptical](https://en.wikipedia.org/wiki/Tobler_hyperelliptical_projection),
with the standard parameters (α=0, k=2.5, γ=1.183136).

It also contains an export of [an Observable HQ page](https://observablehq.com/@davidfrasergo/toblers-parameterised-with-tissots-indicatrix)
that displays Tissot's indicatrix on a world map using Tobler's projection, allowing interactive changing of parameters.
This is in `observablehq-tobler-tissot/`.

Setup
=====

You need node.js to run the code that generates the images for this project.
All the modules are specified as dependencies in `package.json`.
To install these, from this directory run

```
npm install
```

And then add the `node_modules/.bin` directory to your path. On Windows:

```
set PATH=%PATH%;%CD%\node_modules\.bin
```

Rendering from original source data
===================================

The image is a combination of land regions and lakes superimposed on top of them.

- https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/
- https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-lakes/

These instructions (also available in `render.cmd` for Windows) will do the following:
* Download the maps from naturalearthdata.com and extract them
* Convert them to the GeoJSON format
* TODO: Remove Antarctica
* Remove lakes smaller than 5000km² (this leaves only the largest 34 lakes)
* Projects land and lakes using the Tobler Hyperelliptical projection
* Renders in SVG format

```
download --extract --out naturalearthdata https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_land.zip
download --extract --out naturalearthdata https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_lakes.zip
shp2json naturalearthdata\ne_10m_land.shp -o ne_10m_land.geo.json
shp2json naturalearthdata\ne_10m_lakes.shp -o ne_10m_lakes.geo.json
node geojson-filter.js --min-area=5000 ne_10m_lakes.geo.json ne_10m_lakes-5000km2.geo.json
geoproject -r d3-geo-projection "d3.geoHyperelliptical()" ne_10m_land.geo.json > ne_10m_land-hyperelliptical.geo.json
geoproject -r d3-geo-projection "d3.geoHyperelliptical()" ne_10m_lakes-5000km2.geo.json > ne_10m_lakes-5000km2-hyperelliptical.geo.json
geo2svg ne_10m_land-hyperelliptical.geo.json -o ne_10m_land-hyperelliptical.svg -w 2048 -h 1200 --stroke "none" --fill "black"
geo2svg ne_10m_lakes-5000km2-hyperelliptical.geo.json -o ne_10m_lakes-5000km2-hyperelliptical.svg -w 2048 -h 1200 --stroke "none" --fill "blue"
```

Then we need to:
- Break apart the continents
- Delete Antarctica
- Superimpose the lakes on the land
- Scale to the right size ()
