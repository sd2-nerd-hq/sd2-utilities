import { DeckParser } from './deckParser';
import { expect } from 'chai';

describe('Deck Paser', () => {
    it('Test Parse 97ya Deck Code', () => {
        const deck97ya = "DCTrzRBiEJiBUoACi14ACD8oACpj5jSqEoACqh4rTAn4ACIngACgn4ACgjbcKJtQgqoRpxyhyAAChroAELD4AEAbZxyIJYrSgR6OCEnIACIbRxyIZBjSJj5jSA/grSkNYACCxIACIRpx0DDoACA5orSIbIrSQfgACCqwACCrgACobZxzAbZxwA=="
        const data = DeckParser.parse(deck97ya);
        expect(data.raw).to.exist;
        expect(data.raw.division).to.equal(431);
        expect(data.raw.cardCount).to.equal(34);
        expect(data.raw.income).to.equal(1);
    }),
        it('Test Parse Pig People Deck Code', () => {
            const deck97ya = "DCToy+CEITFEpQAKCKwAFCKwAFDYAAEJWAAECPQAESLwAFCJwAGDbwAFqTQAGm5gAEAvSDlAuwAFC6wAFJUAAGC6QAGDrwAFDNwAECHiDkQ6KHVQ6KHVCEQAEKHwAECYSDpFQy2YJNi2UJ9Z4FQ0yDmQ0yDlSOQAAA=="
            const data = DeckParser.parse(deck97ya);
            expect(data.raw).to.exist;
            expect(data.raw.division).to.equal(419);
            expect(data.raw.cardCount).to.equal(30);
            expect(data.raw.income).to.equal(0);
        })
})