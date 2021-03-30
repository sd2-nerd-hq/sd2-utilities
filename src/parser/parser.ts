"use strict";
export class Parser {
    static parse(code:string) {
        let base64data = Buffer.from(code, "base64");
        let binaryData = "";
        base64data.forEach((x) => {
            binaryData = binaryData.concat(x.toString(2).padStart(8, "0"));
        });
        return Parser.getHeader(binaryData);
    }

    static getHeader(binData:string) {
        let pop = (count:number) => {
            let ret = parseInt(binData.slice(0, count), 2);
            binData = binData.slice(count);
            return ret;
        };
        let header = [];
        for (let i = 0; i < 5; i++) {
            let count = pop(5);
            header.push(pop(count));
        }
        let countLen = pop(5);
        let phaseLen = pop(5);
        let xpLen = pop(5);
        let unitLen = pop(5);
        let cardsCount = header[3];
        let units = [];
        for (let i = 0; i < cardsCount; i++) {
            let count = pop(countLen);
            let phase = pop(phaseLen);
            let xp = pop(xpLen);
            let id = pop(unitLen) - 1;
            let transportid = pop(unitLen) - 1;
            let unit = { count: count, phase: phase, xp: xp, id: id, transportid: transportid };
            units.push(unit);
        }
        let result = { division: header[2], cardCount: header[3], income: header[4], units: units };
        return result;
    }
}