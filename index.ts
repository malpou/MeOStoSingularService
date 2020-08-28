import * as dotenv from "dotenv";
import fetch from "node-fetch";
import * as parser from "xml2json";
import { ClassRequest } from "./classRequest";
dotenv.config();

const classes: number[] = [1, 2];
const nodeIds: number[][] = [
  [2536, 2544, 2545, 2546],
  [2538, 2549, 2550, 2551],
];
const controls: any[][] = [
  ["finish", 50, 150, 100],
  ["finish", 50, 150, 100],
];

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
  .catch(() => console.log("Connection error! Restart script ASAP!"));

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
    .catch(() => console.log("Connection error! Restart script ASAP!"));
}, 1000);
