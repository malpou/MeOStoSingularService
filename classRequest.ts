import * as request from "request";
import * as parser from "xml2json";
import fetch from "node-fetch";
import { Result } from "./result";

export class ClassRequest {
  private classID: number;
  private control: number | string;
  private nodeId: number;
  private results: Array<Result>;

  public constructor(
    currentClass: number,
    control: number | string,
    nodeId: number
  ) {
    this.classID = currentClass;
    this.control = control;
    this.nodeId = nodeId;
    this.results = [];
  }

  public request() {
    fetch(
      `http://localhost:2009/meos?get=result&class=${this.classID}&to=${this.control}`
    )
      .then((res) => res.text())
      .then((str) => JSON.parse(parser.toJson(str)))
      .then((json) => {
        const { person } = json.MOPComplete.results;

        if (Array.isArray(person)) {
          person.forEach((element, index) => {
            if (element.hasOwnProperty("place")) {
              const result = new Result(element);
              this.results.push(result);
            }
          });
        } else {
          if (person.hasOwnProperty("place")) {
            const result = new Result(person);
            this.results.push(result);
          }
        }

        let newBody = this.bodytemplate();

        this.results.forEach((result) => {
          newBody.payload.JSON.content.push(result.result);
        });

        newBody.payload.JSON = JSON.stringify(newBody.payload.JSON);

        const options = {
          method: "put",
          url: `https://app.singular.live/apiv1/datanodes/${this.nodeId}/data`,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBody),
        };

        request(options, (error) => {
          if (error) throw new Error(error);
          console.log(
            `${this.classID} (${this.control}) result's got updated!`
          );
        }).auth(process.env.MAIL, process.env.PW);
      })
      .catch(() => console.log("Connection error! Restart script ASAP!"));
  }

  private bodytemplate(): BodyTemplate {
    return {
      model: {
        fields: [
          {
            defaultValue: "JSON Object",
            id: "JSON",
            title: "JSON",
            type: "text",
          },
        ],
      },
      payload: {
        JSON: {
          content: [],
        },
      },
    };
  }
}
