export class Result {
  public runTime: Time;
  public result: RunnerResult;
  static bestTime: Time;

  public constructor(result: any) {
    const { name, org, place, rt } = result;
    this.runTime = this.calcTime(rt);
    if (place == 1) Result.bestTime = this.runTime
    this.result = {
      RUNNER: name.$t,
      CLUB: org.$t,
      PLACE: place,
      RESULT: place != 1 ? `+${this.stringTime(this.calcDifference(Result.bestTime, this.runTime))}` : this.stringTime(this.calcTime(rt))
    }
  }

  private calcTime(runTime: number): Time {
    runTime /= 10;
    return {
      hours: Math.floor(runTime / 3600),
      minutes: Math.floor((runTime % 3600) / 60),
      seconds: Math.floor((runTime % 3600) % 60)
    };
    
  }

  private stringTime(time: Time): string {
    const { hours, minutes, seconds } = time;
    let timeString: string;
    if (hours != 0) {
      timeString = `${hours}:${this.addZero(minutes)}:${this.addZero(seconds)}`;
    } else if (minutes != 0) {
      if (seconds < 0) {
        timeString = `${minutes - 1}:${this.addZero(seconds)}`;
      } else {
        timeString = `${minutes}:${this.addZero(seconds)}`;
      }
    } else {
      timeString = seconds.toString();
    }
    return timeString;
  }

  private calcDifference(winTime: Time, runTime: Time): Time {
    const diff = this.calcSeconds(runTime) - this.calcSeconds(winTime);
    return this.calcTime(diff * 10);
  }

  private calcSeconds(time: Time): number {
    const { hours, minutes, seconds } = time;
    return hours * 60 * 60 + minutes * 60 + seconds;
  }

  private addZero(num: number): string {
    return num <= 9 ? `0${num}` : num.toString();
  }
}


