import { Parser } from './parser';
import { expect } from 'chai';

describe('Deck Paser',()=>{
    it('Test Parse 97ya Deck Code',()=>{
        const deck97ya = "DCTrzRBiEJiBUoACi14ACD8oACpj5jSqEoACqh4rTAn4ACIngACgn4ACgjbcKJtQgqoRpxyhyAAChroAELD4AEAbZxyIJYrSgR6OCEnIACIbRxyIZBjSJj5jSA/grSkNYACCxIACIRpx0DDoACA5orSIbIrSQfgACCqwACCrgACobZxzAbZxwA=="
        const data = Parser.parse(deck97ya);
        expect(data).to.exist;
        expect(data.division).to.equal(431);
        expect(data.cardCount).to.equal(34);
        expect(data.income).to.equal(1);
    })
})