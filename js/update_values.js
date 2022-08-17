const core = require('@actions/core');
const github = require('@actions/github');
var fs = require('fs');

async function run() {
  try {
    V = fs.readFileSync("jsons/values.json");
    V = JSON.parse(V);
    V.push({});
    VIdx = V.length - 1;
    for (let k in F) {
      await gV(k);
    }
    
    V[VIdx]['now'] = NOW();

    if (VIdx == 100) {
      V.shift();
    }
    

    fs.writeFile("jsons/values.json", JSON.stringify(V), function(e) {
      if (e) {
          console.log(e);
      }
    });
  }
  catch (e) {
    core.setFailed(e.message);
  }
}

run();
