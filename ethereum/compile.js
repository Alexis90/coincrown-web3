const path = require('path');
const solc = require('solc'); // solidityComplier package
const fs = require('fs-extra');

// __dirname: current working directory
const buildPath = path.resolve(__dirname, 'build');
// remove the exisitng build folder if there is any
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  const contractName = contract.replace(':', '');
  fs.outputJSONSync(
    path.resolve(buildPath, contractName + '.json'),
    output[contract]
  );
}
