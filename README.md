# Result Overlay Service

ROS is a node script that gets result from MeOS information server and put's them to data nodes on Singular.live to use the data in livestream overlays created on Singular.live

## Installation

How to get the script onto the computer

```bash
git clone 'url'
cd ResultOverlay
npm i
```

## Setup

Create an .env file with the variables
```env
# Login to Singular.live
MAIL=
PW=

# Script loop frequence (number)
REQFREQ=
```
Change the arrays at the top of the document to match the ones you want to use, these names & id's can be found on the MeOS information server
```ts
const classes: number[] = [1, 2];
const nodeIds: number[][] = [
  [2536, 2544, 2545, 2546],
  [2538, 2549, 2550, 2551],
];
const controls: any[][] = [
  ["finish", 50, 150, 100],
  ["finish", 50, 150, 100],
];
```

When this is done you can just start the script with
```bash
node .
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
