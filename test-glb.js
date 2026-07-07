const fs = require('fs');
const buffer = fs.readFileSync('public/round+cartoon+robot+3d+model.glb');
const magic = buffer.readUInt32LE(0);
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);

if (magic === 0x46546C67 && chunkType === 0x4E4F534A) {
  const jsonChunk = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonChunk);
  if (json.animations) {
      console.log("Animations:", json.animations.map((a, i) => `${i}: ${a.name}`));
  } else {
      console.log("Animations: None");
  }
  
  const nodes = json.nodes.map((n, i) => `${i}: ${n.name}`).filter(n => n.toLowerCase().includes('arm') || n.toLowerCase().includes('hand') || n.toLowerCase().includes('bone'));
  console.log("Found body parts (Arm/Hand/Bone):", nodes);
} else {
  console.log("Not a valid GLB");
}
