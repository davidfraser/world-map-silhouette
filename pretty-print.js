import * as fs from 'fs';
import { Command } from 'commander';
import beautify from 'json-beautify';


const program = new Command();

program.name('pretty-print').description('Pretty-prints GeoJson files')
program
    .argument('<inputfile>', '.geo.json file to pretty-print')
    .argument('<outputfile>', 'where to write the pretty-printed file to')
    .action((inputFile, outputFile) => {
        try {
            const inputText = fs.readFileSync(inputFile, {encoding: 'utf-8'});
            const inputData = JSON.parse(inputText);
            const outputText = beautify(inputData, null, 2, 160);
            fs.writeFileSync(outputFile, outputText)
        } catch(err) {
            console.error(err);
        }
    })

program.parse();