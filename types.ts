type RunnerResult = {
  RUNNER: string;
  CLUB: string;
  PLACE: string;
  RESULT: string;
}
type Time = {
  hours: number;
  minutes: number;
  seconds: number;
}
type MEOSresult = {
  name: any;
  org: any;
  place: any;
  rt: any;
}

type BodyTemplate = {
  model: {
    fields: {
      defaultValue: string;
      id: string;
      title: string;
      type: string;
    }[];
  };
  payload: {
    JSON: any;
  };
};