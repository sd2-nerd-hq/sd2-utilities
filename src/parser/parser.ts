export class Parser{

  static parse(code:string):DeckData{
      let base64data = Buffer.from(code, "base64");
      let binaryData = "";

      base64data.forEach((x)=>{
        binaryData = binaryData.concat(x.toString(2).padStart(8,"0"));
      })
      return Parser.getHeader(binaryData);
  }
  private static getHeader(binData:string):DeckData{

      let pop = (count:number) => {
           let ret = parseInt(binData.slice(0, count), 2);
          binData = binData.slice(count);
        return ret;
      }
      let header:number[] = [];
      for(let i=0;i<5;i++){
        let count = pop(5);
        header.push(pop(count));
      } 
  
      let countLen = pop(5);
      let phaseLen = pop(5);
      let xpLen = pop(5);
      let unitLen = pop(5);
      let cardsCount = header[3];
      let units: Unit[] = [];
  
      for(let i=0;i<cardsCount;i++){
        let count = pop(countLen);
        let phase = pop(phaseLen);
        let xp = pop(xpLen);
        let id = pop(unitLen)-1;
        let transportid = pop(unitLen)-1;
        

        let unit:Unit = {count: count, phase: phase, xp: xp, id: id, transportid: transportid}
        units.push(unit);
      }

      let result:DeckData = {division: header[2], cardCount: header[3], income: header[4], units: units};
  
      return result;
  }

  
}

declare type DeckData = {
income: number;
division: number;
cardCount: number;
units: Unit[];
}

declare type Unit = {
id: number;
transportid: number;
xp: number;
phase: number;
count: number;
}