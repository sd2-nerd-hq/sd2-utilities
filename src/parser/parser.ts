export class Parser{

  static parse(code:string):DeckData{
      const base64data = Buffer.from(code, "base64");
      let binaryData = "";

      base64data.forEach((x)=>{
        binaryData = binaryData.concat(x.toString(2).padStart(8,"0"));
      })
      return Parser.getHeader(binaryData);
  }
  private static getHeader(binData:string):DeckData{

      const pop = (count:number) => {
           const ret = parseInt(binData.slice(0, count), 2);
          binData = binData.slice(count);
        return ret;
      }
      const header:number[] = [];
      for(let i=0;i<5;i++){
        const count = pop(5);
        header.push(pop(count));
      } 
  
      const countLen = pop(5);
      const phaseLen = pop(5);
      const xpLen = pop(5);
      const unitLen = pop(5);
      const cardsCount = header[3];
      const units: Unit[] = [];
  
      for(let i=0;i<cardsCount;i++){
        const count = pop(countLen);
        const phase = pop(phaseLen);
        const xp = pop(xpLen);
        const id = pop(unitLen)-1;
        const transportid = pop(unitLen)-1;
        

        const unit:Unit = {count: count, phase: phase, xp: xp, id: id, transportid: transportid}
        units.push(unit);
      }

      const result:DeckData = {division: header[2], cardCount: header[3], income: header[4], units: units};
  
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