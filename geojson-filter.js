import * as fs from 'fs';
import { Command } from 'commander';
import geojsonArea from '@mapbox/geojson-area';
import beautify from 'json-beautify';
import jp from 'jsonpath'


const program = new Command();

program.name('geojson-filter').description('Filters features in GeoJson files by total area etc')
program
    .option('-m, --min-area <min_area>', 'Minimum area required (in square kilometers)')
    .argument('<inputfile>', '.geo.json file to filter')
    .argument('<outputfile>', 'where to write the filter file to')
    .action((inputFile, outputFile, options) => {
        try {
            const inputText = fs.readFileSync(inputFile, {encoding: 'utf-8'})
            const geojsonData = JSON.parse(inputText)
            console.log("Filtering with options", beautify(options))
            jp.apply(geojsonData, '$..features', function(features) {
                let newFeatures = [];
                for (let feature of features) {
                    if (!feature.type == 'Feature') {
                        newFeatures.append(feature)
                        continue
                    }
                    const name = feature.properties.name_en;
                    const geometry = feature.geometry;
                    const area = geojsonArea.geometry(geometry);
                    
                    if (options.minArea != undefined) {
                        if (area >= options.minArea * 1000000) {
                            console.log(`Feature ${name} has area ${area} - big enough`)
                            newFeatures.push(feature)
                        } else {
                            console.log(`Feature ${name} has area ${area} - too small`)
                        } 
                    } else {
                        newFeatures.push(feature)
                    }
                }
                return newFeatures;
            })
            const outputText = beautify(geojsonData, null, 2, 160)
            fs.writeFileSync(outputFile, outputText)
        } catch(err) {
            console.error(err);
        }
    })

program.parse();