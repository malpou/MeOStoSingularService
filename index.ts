import * as dotenv from "dotenv";
import fetch from "node-fetch";
import * as parser from "xml2json";
import { ClassRequest } from "./classRequest";
dotenv.config();

const classes: number[] = [1, 2];
const nodeIds: number[][] = [
  [2538, 2549, 2550, 2551, 2542, 2545], // H21
  [2537, 2547, 2548, 2541, 2546, 2544], // D21
];

// Testing 
const controls: any[][] = [
  ["finish", 50, 150, 100],
  ["finish", 50, 150, 100],
];

//DM Mellem
/*const controls: any[][] = [
  ["finish", 197, 158, 143, 145, 174],
  ["finish", 197, 158, 143, 160, 174],
];*/

//DM Sprint
/*const controls: any[][] = [
  ["finish", 76, 48, 64],
  ["finish", 76, 48, 64],
];*/

let nextDiff: string;

classes.forEach((currentClass, classIndex) => {
  controls[classIndex].forEach((control, controlIndex) => {
    const classUpdate = new ClassRequest(
      currentClass,
      control,
      nodeIds[classIndex][controlIndex]
    );
    classUpdate.request();
  });
});

fetch("http://localhost:2009/meos?difference=zero")
  .then((res) => res.text())
  .then((str) => JSON.parse(parser.toJson(str)))
  .then((json) => (nextDiff = json.MOPComplete.nextdifference))
  .catch((e) => console.log("Connection error! Restart script ASAP! (init diff)\t" + e));

setInterval(() => {
  fetch(`http://localhost:2009/meos?difference=${nextDiff}`)
    .then((res) => res.text())
    .then((str) => JSON.parse(parser.toJson(str)))
    .then((json) => {
      const classesDiff: number[] = [];
      const { MOPDiff } = json;
      nextDiff = MOPDiff.nextdifference;
      if (MOPDiff.hasOwnProperty("cmp")) {
        if (Array.isArray(MOPDiff.cmp)) {
          MOPDiff.cmp.forEach((difference) => {
            const classId = +difference.base.cls;
            if (classes.includes(classId)) classesDiff.push(classId);
          });
        } else classesDiff.push(+MOPDiff.cmp.base.cls);
      }

      classesDiff.forEach((currentClass) => {
        const classIndex = classes.indexOf(currentClass);
        controls[classIndex].forEach((control, controlIndex) => {
          const classUpdate = new ClassRequest(
            currentClass,
            control,
            nodeIds[classIndex][controlIndex]
          );
          classUpdate.request();
        });
      });
    })
    .catch((e) => console.log("Connection error! Restart script ASAP! (loop)\t" + e));
}, 1000);
