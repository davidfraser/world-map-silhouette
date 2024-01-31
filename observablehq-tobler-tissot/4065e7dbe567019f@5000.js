import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./3df1b33bb2cfcd3c@475.js";
import define3 from "./1713dcdd0861b14d@1366.js";

function _1(md){return(
md`# Tobler’s hyperelliptical projection, parameterised, showing Tissot's indicatrix

This page shows a world map using Tobler's hyperelliptical project, allowing modification of the parameters provided in that projection.
It also displays Tissot's indicatrix at 15 degree intervals on that map.
(I could find other pages on the web showing Tobler's projection, including Tissot's indicatrix, but none that combined both adjusting the parameters and the indicatrix)

Further notes on the projection and the indicatrix are below...`
)}

function _2(width,d3,DOM,tobler,land,sphere,geoTissot,deg,projection,html)
{
  const w = width, height = width * 0.6;
 
  const svg = d3.select(DOM.svg(w, height));
  
  const map = svg.append("g")
    .attr("fill", "#ececec")
    .attr("stroke", "#dcdcdc")
  
  const plot = svg.append("g")
    .attr("transform", `translate(${w / 2}, ${height / 2}) scale(100, 100)`)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1 / 100);

  const indicatrixScale = 0.1;
  const dasharray = `${indicatrixScale * 5 / 100} ${indicatrixScale * 2 / 100}`;
  
  // Note:
  // Only use projections with straight parallels.
  // Axis rotation is not taken into account in this example..
  // Projection is defined above.
  /* const sinusoidalProjection = d3.geoSinusoidal()
    .translate([w - 80, 60])
    .scale(25);  */
  
  const path = d3.geoPath().projection(tobler.translate([w/2, height/2]).scale(200));
  

  map.append("path")
    .attr("id", "tissot-tobler-land")
    .attr("d", path(land))
    .attr("stroke", "none");
  
  map.append("path")
    .attr("d", path(sphere))
    .attr("fill", "none");
  
  
function drawIndicatrix(lon, lat, projection) {
  // background
  const xy = ([lon, lat]);
  const cxy = path.projection()([0, 0]);
  const gxy = path.projection()([lon, lat]);
  const mxy = ([(gxy[0]-cxy[0])/100, (gxy[1]-cxy[1])/100]);
  console.log(`xy ${xy} cxy ${cxy} gxy ${gxy} mxy ${mxy}`)
  const indicatrixOnMap = plot.append("g")
      .attr("transform", `translate(${mxy[0]}, ${mxy[1]})`);
  
  indicatrixOnMap
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", indicatrixScale)
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-dasharray", dasharray);

  // Indicatrix
  const tissot = geoTissot().projection(projection);
  const latClamped = Math.max(-90 + 1e-3, Math.min(90 - 1e-3, lat));
  const indicatrix = tissot({ type: "Point", coordinates: [lon, latClamped] })[0];
  
  if (!indicatrix) return svg.node();
  
  let { s, h, k, a, b, theta } = indicatrix;
  let rotation = Math.asin(s / (h * k)) * Math.sign(theta) * deg || 90;
  h *= indicatrixScale;
  k *= indicatrixScale;
  a *= indicatrixScale;
  b *= indicatrixScale;
  
  // if (lon === 0 || lat === 0) theta = Math.PI / 4;
  
  // parallel phi
  indicatrixOnMap
    .append("line")
    .attr("x1", -k)
    .attr("x2", k);
  
  // meridian lambda
  indicatrixOnMap
    .append("line")
    .attr("transform", `rotate(${rotation})`)
    .attr("x1", -h)
    .attr("x2", h);

  // indicatrix
  const ellipse = indicatrixOnMap.append("g")
    .attr("transform", `rotate(${theta * deg})`);
  
  ellipse
    .append("line")
    .attr("x1", -a)
    .attr("x2", a)
    .attr("stroke-dasharray", dasharray);
  
  ellipse
    .append("line")
    .attr("y1", -b)
    .attr("y2", b)
    .attr("stroke-dasharray", dasharray);
  
  ellipse
    .append("ellipse")
    .attr("rx", a)
    .attr("ry", b);
    
}

  for (let tLon = -180; tLon <= 180; tLon += 15) {
    for (let tLat = -75; tLat <= 75; tLat += 15) {
      drawIndicatrix(tLon, tLat, projection);
    }
  }
  

 return html`<figure>
    <figcaption>Tissot's indicatrix for a Tobler hyperelliptical projection</figcaption>
    ${svg.node()}
  </figure>`;
}


function _k(slider){return(
slider({
  min: 0.3, 
  max: 8, 
  step: 0.1, 
  value: 2.5, 
  title: "k", 
  description: `exponent`
})
)}

function _gamma(slider){return(
slider({
  min: 0, 
  max: 10, 
  step: 0.1, 
  value: 1.183136, 
  title: "gamma", 
  description: `factor controlling the aspect ratio`
})
)}

function _alpha(slider){return(
slider({
  min: 0, 
  max: 1, 
  step: 0.01, 
  value: 0, 
  title: "alpha", 
  description: `weight of the cylindrical projection averaged with the hyperellipse`
})
)}

function _6(md){return(
md`## Tobler's hyperelliptical projection, without Tissot's Indicatrix`
)}

function _TOBLER(map,tobler){return(
map(tobler)
)}

function _8(tex,md){return(
md`## Tobler's hyperelliptical projection (1973)

Waldo R. Tobler’s hyperelliptical projection is available from [d3-geo-projection](https://github.com/d3/d3-geo-projection#geoHyperelliptical) v2.4.0.
This projection is based on hyperellipses (aka Lamé curves), governed by the equation:

${tex`x^k+y^k = 1`}.

Three parameters control its shape. In all instances, it is an equal-area projection.

Reference: Waldo R. Tobler, “The hyperelliptical and other new pseudocylindrical equal area map projections,” _Journal of Geophysical Research_, 78 (11): 1753–1759, 1973.`
)}

function _9(md){return(
md`-----
_Technical zone_`
)}

function _tobler(d3,alpha,k,gamma){return(
d3.geoHyperelliptical()
    .alpha(alpha)
    .k(k)
    .gamma(gamma)
    .clipAngle(0) // you can make this 0 or 90
    .angle(0)
)}

function _11(md){return(
md`## Tissot's indicatrix

When thinking about [Tissot's indicatrix](https://en.wikipedia.org/wiki/Tissot%27s_indicatrix), probably most people imagine it as a tool to visualize spatial change in distortion, illustrated by more or less elliptical shapes placed across a map. In most instances, however, these visualizations [don't show true indicatrices](https://observablehq.com/@d3/tissots-indicatrix), but projected circles placed around a reference point at a given radius, that give an intuitive representation of areal and shape distortion on a map. So what are *true Tissot's indicatrices* then?

[Nicolas Auguste Tissot](https://en.wikipedia.org/wiki/Nicolas_Auguste_Tissot) published his classic analysis on the distortion on maps in 1859 and 1881. The basic idea is that the intersection of any two lines on the Earth is represented on the flat map with an intersection at the same or a different angle. He proved that at almost every point on the Earth, there's a right angle intersection of two lines in *some* direction which are also shown at right angles on the map. All the other intersections at that point will not intersect at the same angle on the map, unless the map is conformal, at least at that point.`
)}

function _12(md,tex){return(
md`Tissot showed this relationship graphically with a special *ellipse of distortion* called an *indicatrix* by computing partial derivatives at specific points. An infinitely small circle on the Earth projects as an infinitely small, but perfect, ellipse on any map projection. If the projection is conformal, the ellipse is a circle, an ellipse of zero eccentricity. Otherwise, the ellipse has a major axis ${tex`a`} and minor axis ${tex`b`} which are directly related to the *maximum angular deformation* ${tex`\omega`} and to the *areal scale distortion* ${tex`s`}.`
)}

function _13(md){return(
md`To start our investigation we create a set of control points, that we can pass to the \`geoTissot\` generator function. It's a regular grid of points over the canvas area, reprojected to longitude and latitude and formatted as a GeoJSON object.`
)}

function _geojson(d3,h,resolution,w,projection)
{
  let grid = [];
  for (let y of d3.range(0, h + resolution, resolution)) {
    for (let x of d3.range(0, w + resolution, resolution)) {
      grid.push(projection.invert([x, y]));
    }
  }
  return { type: "MultiPoint", coordinates: grid };
}


function _15(md){return(
md`The next step is to initialize the generator function and specify the [D3 projection](https://github.com/d3/d3-geo#projections) for which we want to create the *indicatrices*:`
)}

function _tissot(geoTissot,projection){return(
geoTissot().projection(projection)
)}

function _17(md){return(
md`Finally we pass the grid of control points to the indicatrix generator. It accepts any GeoJSON object and computes indicatrices for every coordinate pair of the input geometry.`
)}

function _data(tissot,geojson){return(
tissot(geojson)
)}

function _19(md,tex){return(
md`The return value is an array of *indicatrices* with the following properties:

\`coordinates\` - longitude and latitude of the indicatrix  
\`h\` - scale factor along the meridian ${tex`h`}  
\`k\` - scale factor along the parallel ${tex`k`}  
\`w\` - maximum angular distortion ${tex`\omega`}  
\`s\` - areal scale distortion ${tex`s`}  
\`a\` - length of semi-major axis ${tex`a`}  
\`b\` - length of semi-minor axis ${tex`b`}  
\`theta\` - indicatrix rotation in radians


`
)}

function _projection(tobler,w,h){return(
tobler // d3.geoAlbers()
  .scale(640 * w / 640)
  .translate([w / 2, h / 2])
)}

function _21(md){return(
md`Based on:

<small>
*Torban Jansen, *[Tissot's indicatrix](https://observablehq.com/@toja/tissots-indicatrix)*, last edited: 2021-01-18, retrieved: 2024-01-30.*<br/>
*Philippe Rivière, *[Tobler hyperelliptical projection](https://observablehq.com/@fil/toblers-hyperelliptical-projection)*, last edited: 2020-11-05, retrieved: 2024-01-30.*<br/>
</small>

References:  

<small>
*John P. Snyder, *[Map projections - A working manual](https://pubs.er.usgs.gov/publication/pp1395)*, Washington 1987, pp. 20-26, 98-103.*<br/>
*Jason Davies:* [Tissot’s Indicatrix](https://www.jasondavies.com/maps/tissot/)*, retrieved: 24/05/2019.*<br/>
*Stackoverflow:* [How to create an accurate Tissot Indicatrix?](https://gis.stackexchange.com/questions/5068/how-to-create-an-accurate-tissot-indicatrix/)*, retrieved: 22/05/2019.*<br/>
</small>`
)}

function _22(md){return(
md`---
## Implementation`
)}

function _geoTissot(d3)
{
  
  // transpose 2x2 matrix
  function transpose(mat) {
    return [mat[0], mat[2], mat[1], mat[3]]
  }
  
  // dot product of two 2x2 matrices
  function dot(a, b) {
    return [
      a[0] * b[0] + a[1] * b[2],
      a[0] * b[1] + a[1] * b[3],
      a[2] * b[0] + a[3] * b[2],
      a[2] * b[1] + a[3] * b[3]
    ]
  }

  const delta = Math.pow(10, -5.2),
        rad = Math.PI / 180,
        fn = function() {};
      
  return function() {
    
    let projection = null;

    function tissot(geojson) {
      let xy,
          stream = projection.stream({
            point: function(lambda, phi) { xy = [lambda, phi] },
            lineStart: fn,
            lineEnd: fn,
            polygonStart: fn,
            polygonEnd: fn
          }),
          sf = projection.scale() * rad,  // scale factor 
          indicatrices = [];

      return d3.geoStream(geojson, {
        point: function(lambda, phi) {
          const cosPhi = Math.cos(phi * rad);
          // skip poles (division by zero)
          if (1e-6 < cosPhi) {
            let p = (xy = null, stream.point(lambda, phi), xy);
            if (!!xy) {
              let dLambda = lambda > 0 ? lambda - delta : lambda + delta,
                  dL = (xy = null, stream.point(dLambda, phi), xy);          
              if (!!xy) {
                let dPhi = phi > 0 ? phi - delta : phi + delta,
                    dP = (xy = null, stream.point(lambda, dPhi), xy);
                if (!!xy) {
                  let M = (lambda - dLambda) * sf,
                      m = (phi - dPhi) * sf,
                      
                      // derivates
                      dxdL = (p[0] - dL[0]) / M,
                      dydL = (p[1] - dL[1]) / M,
                      dxdP = (p[0] - dP[0]) / m,
                      dydP = (p[1] - dP[1]) / m,
                      
                      // indicatrix
                      h = Math.sqrt(dxdP * dxdP + dydP * dydP),
                      k = Math.sqrt(dxdL * dxdL + dydL * dydL) / cosPhi,
                      s = -(dydP * dxdL - dxdP * dydL) / cosPhi,
                      A = Math.sqrt(Math.max(0, h * h + k * k + s * 2)),
                      B = Math.sqrt(Math.max(0, h * h + k * k - s * 2)),
                      a = Math.abs((A + B) / 2),
                      b = Math.abs((A - B) / 2),
                      w = Math.asin(Math.max(-1, Math.min(1, B / A))) * 2,
                      
                      // indicatrix rotation
                      mat = dot([dxdL, dxdP, dydL, dydP], [1 / cosPhi, 0, 0, 1]),
                      z = dot(mat, transpose(mat)),
                      theta = Math.atan2(z[2] + z[1], z[0] - z[3]) / 2;
                  
                  indicatrices.push({
                    coordinates: [lambda, phi], h, k, s, w, a, b, theta
                  });
                }
              }
            }
          }
        }
      }),
      indicatrices;
    }
    
    tissot.projection = function(p) {
      return arguments.length ? (projection = p, tissot) : projection;
    }

    return tissot;
  } 
}


function _24(md){return(
md`---
## Appendix`
)}

function _w(width){return(
Math.min(640, width)
)}

function _h(w){return(
Math.floor(w / 4 * 2)
)}

function _resolution(){return(
5
)}

function _magma(chroma){return(
chroma.scale(["#fcfdbf", "#b73779", "#000004"]).domain([0, 0.05]).mode('lch')
)}

function _BrBG(chroma){return(
chroma.scale(["#543005", "#f5f5f5", "#003c30"]).domain([-0.04, 0,  0.03])
)}

function _addlabel(){return(
function addlabel(context, label) {
  context.save();
  context.translate(...label.xy);
  context.rotate(label.angle + (Math.cos(label.angle) < 0 ? Math.PI : 0));
  context.textAlign = "center";
  context.fillStyle = "#555";
  context.font = "8px sans-serif";
  context.fillText(label.text, 0, 5);
  context.restore();
}
)}

function _position(View){return(
new View([-96.5, 38.5])
)}

function _pick($0,projection){return(
function pick(event) {
  $0.value = projection.invert([event.layerX, event.layerY]);
}
)}

function _drag(versor,d3){return(
function drag(projection) {
  let v0, q0, r0;
  
  function dragstarted() {
    v0 = versor.cartesian(projection.invert(d3.mouse(this)));
    q0 = versor(r0 = projection.rotate());
  }
  
  function dragged() {
    const v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
    const q1 = versor.multiply(q0, versor.delta(v0, v1));
    projection.rotate(versor.rotation(q1));
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged);
}
)}

function _rad(){return(
Math.PI / 180
)}

function _deg(){return(
180 / Math.PI
)}

function _sphere(){return(
{ type: "Sphere" }
)}

function _graticule(d3){return(
d3.geoGraticule10()
)}

function _countries(topojson,world){return(
topojson.mesh(world, world.objects.countries, (a, b) => a !== b)
)}

function _land(topojson,world){return(
topojson.feature(world, world.objects.land)
)}

function _40(md){return(
md`---`
)}

function _world(){return(
fetch("https://unpkg.com/world-atlas@1/world/110m.json")
  .then(response => response.json())
)}

function _d3(require){return(
require("d3@5", "d3-geo-projection")
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _versor(require){return(
require("versor@0.0.3")
)}

function _chroma(require){return(
require("chroma-js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["width","d3","DOM","tobler","land","sphere","geoTissot","deg","projection","html"], _2);
  main.variable(observer("viewof k")).define("viewof k", ["slider"], _k);
  main.variable(observer("k")).define("k", ["Generators", "viewof k"], (G, _) => G.input(_));
  main.variable(observer("viewof gamma")).define("viewof gamma", ["slider"], _gamma);
  main.variable(observer("gamma")).define("gamma", ["Generators", "viewof gamma"], (G, _) => G.input(_));
  main.variable(observer("viewof alpha")).define("viewof alpha", ["slider"], _alpha);
  main.variable(observer("alpha")).define("alpha", ["Generators", "viewof alpha"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("TOBLER")).define("TOBLER", ["map","tobler"], _TOBLER);
  main.variable(observer()).define(["tex","md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("tobler")).define("tobler", ["d3","alpha","k","gamma"], _tobler);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md","tex"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("geojson")).define("geojson", ["d3","h","resolution","w","projection"], _geojson);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("tissot")).define("tissot", ["geoTissot","projection"], _tissot);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("data")).define("data", ["tissot","geojson"], _data);
  main.variable(observer()).define(["md","tex"], _19);
  main.variable(observer("projection")).define("projection", ["tobler","w","h"], _projection);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("geoTissot")).define("geoTissot", ["d3"], _geoTissot);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("w")).define("w", ["width"], _w);
  main.variable(observer("h")).define("h", ["w"], _h);
  main.variable(observer("resolution")).define("resolution", _resolution);
  main.variable(observer("magma")).define("magma", ["chroma"], _magma);
  main.variable(observer("BrBG")).define("BrBG", ["chroma"], _BrBG);
  main.variable(observer("addlabel")).define("addlabel", _addlabel);
  main.variable(observer("viewof position")).define("viewof position", ["View"], _position);
  main.variable(observer("position")).define("position", ["Generators", "viewof position"], (G, _) => G.input(_));
  main.variable(observer("pick")).define("pick", ["viewof position","projection"], _pick);
  main.variable(observer("drag")).define("drag", ["versor","d3"], _drag);
  main.variable(observer("rad")).define("rad", _rad);
  main.variable(observer("deg")).define("deg", _deg);
  main.variable(observer("sphere")).define("sphere", _sphere);
  main.variable(observer("graticule")).define("graticule", ["d3"], _graticule);
  main.variable(observer("countries")).define("countries", ["topojson","world"], _countries);
  main.variable(observer("land")).define("land", ["topojson","world"], _land);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("world")).define("world", _world);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("versor")).define("versor", ["require"], _versor);
  main.variable(observer("chroma")).define("chroma", ["require"], _chroma);
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  const child2 = runtime.module(define2);
  main.import("View", child2);
  const child3 = runtime.module(define3);
  main.import("map", child3);
  return main;
}
