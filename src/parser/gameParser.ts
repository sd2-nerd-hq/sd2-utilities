//import { start } from 'node:repl';
import { misc } from 'sd2-data';
import { DeckData, DeckParser } from './deckParser'


export class GameParser {
    static parseRaw(gameData:Buffer):RawGameData{
        //figure out junk length:
        //const junk = gameData.toString().split("{\"game\":")[0].length
        const junk = gameData.indexOf("{\"game\":")
        //ok... so in theory noone will name themselves "ingamePlayerId... so lets regex that line out and find the end of the line on it."
        const regex = /("ingamePlayerId":\d+})star/g
        const d = gameData.slice((junk)).toString()
        const matches = regex.exec(d)
        let data = "Something Went Wrong"
        if(matches)
            data = d.split(matches[1])[0].trimStart() + matches[1]
        console.log(data)
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
        ret.map_raw = String(startData.game.Map)
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
        for(const key of Object.keys(startData)){
            if(key.startsWith("player")){
                const p  = new RawPlayer()
                const pl = startData[key]
                p.mapPos = key
                p.aiLevel = Number(pl.PlayerIALevel)
                p.id = Number(pl.PlayerUserId)
                p.isObserver = Boolean(pl.PlayerOberver)
                p.elo = Number(pl.PlayerElo)
                p.level = Number(pl.PlayerLevel)
                p.name = String(pl.PlayerName)
                p.alliance = Number(pl.PlayerAlliance)
                if(pl.PlayerDeckContent)
                    p.deck = DeckParser.parse(pl.PlayerDeckContent)
                p.scoreLimit = Number(pl.PlayerScoreLimit)
                p.incomeRate = Number(pl.PlayerIncomeRate)
                ret.players.push(p)
            }
        }
        return ret;
    }
}

//mod list/support is not supported atm.
//Server tag not implemented
export class RawGameData {
    gameMode = -1
    isNetworkMode = false
    maxPlayers = 0
    playerCount = 0
    allowObservers = false
    observerDelay = -1
    seed = -1
    isPrivate = true
    serverName = ""
    withHost = true
    serverProtocol = ""
    version = -1
    aiCount = 0
    tickRate = 10
    uniqueSessionId = ''
    gameType = -1
    map_raw = ""
    initMoney = 0
    timeLimit = 0
    scoreLimit = 0
    victoryCondition = 0
    incomeRate = 0
    players:RawPlayer[] = [];
    ingamePlayerId = 0
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
    result = { duration: 0, victory: 0, score: 0 }
  }

  export class RawPlayer {
    id = 0
    aiLevel = -1
    isObserver = false
    alliance = 0
    elo = 0
    level = -1
    name = "err"
    deck?:DeckData
    scoreLimit = 0
    incomeRate = 0
    mapPos = "player_null"
  }