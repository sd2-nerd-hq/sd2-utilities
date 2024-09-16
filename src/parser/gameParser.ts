//import { start } from 'node:repl';
import {DeckData, DeckParser} from './deckParser'
import {misc} from 'sd2-data'


export class GameParser {
    static parseRaw(input: Buffer | ArrayBuffer): RawGameData | null {

        if(input instanceof ArrayBuffer){
            input = Buffer.from(input);
        }

        const gameData = input as Buffer;

        try {

            //figure out junk length:
            //const junk = gameData.toString().split("{\"game\":")[0].length
            const junk = gameData.indexOf("{\"game\":")

            //ok... so in theory noone will name themselves "ingamePlayerId... so lets regex that line out and find the end of the line on it."
            let regex = /("ingamePlayerId":\d+})star/g
            const d = gameData.slice((junk)).toString()
            let matches = regex.exec(d);

            //some (old?) replays miss the ingamePlayerId
            if (!matches) {
                regex = /("PlayerIncomeRate":"\d"}})/g
                matches = regex.exec(d);
            }

            if (!matches) {
                return null;
            }

            const data = d.split(matches[1])[0].trimStart() + matches[1]

            const startData = JSON.parse(data);
            const endData = JSON.parse('{"result":' + gameData.toString().split(`{"result":`)[1]);

            startData.result = endData.result;
            //clean and make return
            const ret = new RawGameData();

            ret.gameMode = Number(startData.game.GameMode)
            ret.isNetworkMode = Boolean(startData.game.IsNetworkMode)
            ret.maxPlayers = Number(startData.game.NbMaxPlayer)
            ret.playerCount = Number(startData.game.NbPlayersAndIA)
            ret.allowObservers = Boolean(startData.game.AllowObservers)
            ret.observerDelay = Number(startData.ObserverDelay)
            ret.seed = Number(startData.game.Seed)
            ret.isPrivate = Boolean(startData.game.Private)
            ret.serverName = String(startData.game.ServerName)
            ret.withHost = Boolean(startData.game.WithHost)
            ret.serverProtocol = String(startData.game.ServerProtocol)
            ret.version = Number(startData.game.Version)
            ret.aiCount = Number(startData.game.NbIA)
            ret.tickRate = Number(startData.game.TickRate)
            ret.uniqueSessionId = String(startData.game.UniqueSessionId)
            ret.gameType = Number(startData.game.GameType)
            ret.mapRaw = String(startData.game.Map)
            ret.mapName = GameParser.getMapName(ret.mapRaw);
            ret.initMoney = Number(startData.game.InitMoney)
            ret.timeLimit = Number(startData.game.TimeLimit)
            ret.scoreLimit = Number(startData.game.ScoreLimit)
            ret.victoryCondition = Number(startData.game.VictoryCond)
            ret.incomeRate = Number(startData.game.IncomeRate)
            ret.ingamePlayerId = Number(startData.ingamePlayerId)
            ret.result = {
                duration: Number(startData.result.Duration),
                victory: Number(startData.result.Victory),
                score: Number(startData.result.Score)
            }



            //build players and append them
            for (const key of Object.keys(startData)) {
                if (key.startsWith("player")) {
                    const p = new RawPlayer()
                    const pl = startData[key]
                    p.mapPos = key
                    p.aiLevel = Number(pl.PlayerIALevel)
                    p.id = Number(pl.PlayerUserId)
                    p.isObserver = Boolean(pl.PlayerOberver)
                    p.elo = Number(pl.PlayerElo)
                    p.level = Number(pl.PlayerLevel)
                    p.name = String(pl.PlayerName)

                    //check if there's an AI player and names it according to its diffuculty
                    //propably not the most optimal way to check for Ai, maybe AICount?
                    if (p.name === "" && p.aiLevel < 5) {
                        p.name = "AI " + misc.aiLevel[p.aiLevel];
                    }

                    p.alliance = Number(pl.PlayerAlliance)
                    if (pl.PlayerDeckContent)
                        p.deck = DeckParser.parse(pl.PlayerDeckContent)
                    p.scoreLimit = Number(pl.PlayerScoreLimit)
                    p.incomeRate = Number(pl.PlayerIncomeRate)




                    ret.players.push(p)
                }



                const gameResult = ret.result.victory > 3 ? ret.ingamePlayerId >= ret.players.length / 2 : ret.ingamePlayerId < ret.players.length / 2;

                for (const p of ret.players) {
                    p.winner = gameResult ? p.alliance === 1 : p.alliance === 0;
                }

            }

            ret.validForUpload = GameParser.isValidReplay(ret);
            return ret;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    static getMapName(mapRaw: string): string {

        let map = '';

        if (!mapRaw.includes('_')) {
            return mapRaw;
        }

        const arr = mapRaw.split('_');

        if (arr.length < 3) {
            return mapRaw;
        }

        map = arr[2];
        let counter = 3;
        while (counter < arr.length && isNaN(parseInt(arr[counter][0]))) {

            if (arr[counter] === 'LD') {
                break;
            }

            map += arr[counter];
            counter++;
        }

        const exception = misc.mapExceptions[map];

        map = exception ? exception : map;

        map = map.replace(/([A-Z])/g, ' $1').trim();


        const match = mapRaw.match(/([0-9])vs([0-9])/) ?? mapRaw.match(/([0-9])v([0-9])/);

        if (match !== null && match[0] !== '1vs1' && match[0] !== '1v1') {


            let mapType = match[0].replace('vs', 'v');

            mapType = mapType === '0v1' ? '10v10' : mapType;

            map += ' ' + mapType;

            const firstChar = map[0].toUpperCase();

            map = firstChar + map.slice(1);

        }

        return map;
    }

    static isValidReplay(g: RawGameData): string[] | null {
        const isValid = [];

        if (g.aiCount > 0) isValid.push("aiCount");
        if (g.gameMode != 1) isValid.push("gameMode");
        if (g.incomeRate != 3 && g.players.length == 2) isValid.push("incomeRate"); //don't accept other for 1v1s
        if (g.scoreLimit != 2000) isValid.push("scoreLimit");
        if (g.playerCount === 1) isValid.push("playerCount");

        return isValid.length > 0 ? isValid : null;
    }

}

//mod list/support is not supported atm.
//Server tag not implemented
export class RawGameData {
    gameMode = -1;
    isNetworkMode = false;
    validForUpload: string[] | null = null;
    maxPlayers = 0;
    playerCount = 0;
    allowObservers = false;
    observerDelay = -1;
    seed = -1;
    isPrivate = true;
    serverName = "";
    withHost = true;
    serverProtocol = "";
    version = -1;
    aiCount = 0;
    tickRate = 10;
    uniqueSessionId = '';
    gameType = -1;
    mapRaw = "";
    mapName = "";
    initMoney = 0;
    timeLimit = 0;
    scoreLimit = 0;
    victoryCondition = 0;
    incomeRate = 0;
    players: RawPlayer[] = [];
    ingamePlayerId = 0;
    //TimeLeft
    //GameState
    //NeedPassword
    //NbIA
    //ModList
    //ModTagList
    //ServerTag
    //CombatRule
    //WarmupCountdown
    //DeploymentTimeMax
    //DebriefingTimeMax
    //LoadingTimeMax
    //Min#Players
    //MaxTeamSize
    //PhaseADUration
    //PhaseBDuration
    //MapSelection
    //MapRotationType
    //CoopVsAO
    //InverseSpawnPoints
    //DivisionTagFilter
    //AutoFillAI
    //DeltaTimeCheckAutoFillAI
    result = {duration: 0, victory: 0, score: 0}
}

export class RawPlayer {
    id = 0;
    aiLevel = -1;
    isObserver = false;
    alliance = 0;
    elo = 0;
    level = -1;
    name = "err";
    deck?: DeckData;
    scoreLimit = 0;
    incomeRate = 0;
    mapPos = "player_null";
    winner: boolean = false;
}