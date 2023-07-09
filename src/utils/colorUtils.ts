import * as availableColors from "@mui/material/colors";

const mainColorNames = Object.keys(availableColors).slice(1); // except black / white
const colors = [300, 400, 500, 600, 700, 800, 900];
const accentColors = [200, 400, 700];

const getRandomElem = (arr: Array<any>): any => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export function getRandomColor(): string {
    const colorShade = getRandomElem(mainColorNames);
    const isAccent: boolean = Math.random() < 0.5;

    if (isAccent) {
        // @ts-ignore
        return availableColors[colorShade][getRandomElem(accentColors)];
    }
    // @ts-ignore
    return availableColors[colorShade][getRandomElem(colors)];
}
