import { units, divisions, misc } from 'sd2-data';
export class DeckParser{

  static parseRaw(code:string):DeckDataRaw{
      const base64data = Buffer.from(code, "base64");
      let binaryData = "";

      base64data.forEach((x)=>{
        binaryData = binaryData.concat(x.toString(2).padStart(8,"0"));
      })
      const deck = DeckParser.getHeader(binaryData);
      deck.code = code;
      console.log(deck)
      return deck;
  }
  static makePretty(deck:DeckDataRaw):DeckData{
    const income = misc.incomeTypes[deck.income] || "ERROR("+deck.income+")"
    const div = divisions.divisionsById[deck.division] ? divisions.divisionsById[deck.division].name : "ERROR("+deck.division+")"
    const ret:DeckData = {
      raw: deck,
      income: income,
      division: div,
      units: []
    }
    for(const unit of deck.units){
      const u = units.unitsById[unit.id]?.name || "ERROR("+unit.id+")"
      let t = "None"
      if(unit.transportid != -1)
        t = units.unitsById[unit.transportid]?.name || "ERROR("+unit.xp+")"
      const punit:Unit = {
        xp:unit.xp,
        phase:unit.phase,
        count:unit.count,
        name:u,
        transport:t,
        raw:unit
      };
      ret.units.push(punit)
    }
    return ret;
  }

  static parse(code:string):DeckData{
    return DeckParser.makePretty(DeckParser.parseRaw(code));
  }

  private static getHeader(binData:string):DeckDataRaw{

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
      const units: UnitRaw[] = [];
  
      for(let i=0;i<cardsCount;i++){
        const count = pop(countLen);
        const phase = pop(phaseLen);
        const xp = pop(xpLen);
        const id = pop(unitLen)-1;
        const transportid = pop(unitLen)-1;
        

        const unit:UnitRaw = {count: count, phase: phase, xp: xp, id: id, transportid: transportid}
        units.push(unit);
      }

      const result:DeckDataRaw = {code:"", division: header[2], cardCount: header[3], income: header[4], units: units};
  
      return result;
  }

  
}

declare type DeckDataRaw = {
income: number;
division: number;
cardCount: number;
units: UnitRaw[];
code: string;
}

declare type UnitRaw = {
id: number;
transportid: number;
xp: number;
phase: number;
count: number;
}

export declare type DeckData = {
  income: string;
  division: string;
  units: Unit[];
  raw: DeckDataRaw;
}

declare type Unit = {
  xp:number;
  phase:number;
  count: number;
  name: string;
  transport: string;
  raw:UnitRaw;
}