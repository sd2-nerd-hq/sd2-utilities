import { DeckParser } from './deckParser';
import { GameParser } from './gameParser';
import * as fs from 'fs'
import { expect } from 'chai';

describe('Game Paser',()=>{
    it('Test load AS vs VonPaulus_G2',()=>{
        const buffer = fs.readFileSync("test/AS_vs._VonPaulus_G2.rpl3");
        const data = GameParser.parseRaw(buffer);

        //json object
        const testObj = {
            game: {
              GameMode: '1',
              IsNetworkMode: '1',
              NbMaxPlayer: '2',
              NbPlayersAndIA: '2',
              AllowObservers: '1',
              ObserverDelay: '120',
              Seed: '233158952',
              Private: '1',
              ServerName: "Definitely not ÁS's Game",
              WithHost: '1',
              ServerProtocol: '1.0',
              TimeLeft: '4294967295',
              Version: '47028',
              GameState: '0',
              NeedPassword: '0',
              NbIA: '0',
              TickRate: '10',
              UniqueSessionId: '8e3bf97:a5498aae:f3b0599e:19d5f85d',
              ModList: '',
              ModTagList: '',
              ServerTag: '',
              GameType: '2',
              Map: '_2x2_Lacs_Sianno_LD_1v1',
              InitMoney: '750',
              TimeLimit: '0',
              ScoreLimit: '2000',
              VictoryCond: '2',
              CombatRule: '2',
              IncomeRate: '3',
              WarmupCountdown: '10',
              DeploiementTimeMax: '180',
              DebriefingTimeMax: '180',
              LoadingTimeMax: '1200',
              NbMinPlayer: '10',
              DeltaMaxTeamSize: '10',
              MaxTeamSize: '10',
              PhaseADuration: '-1',
              PhaseBDuration: '-1',
              MapSelection: '0',
              MapRotationType: '0',
              CoopVsAI: '0',
              InverseSpawnPoints: '0',
              DivisionTagFilter: 'DEFAULT',
              AutoFillAI: '0',
              DeltaTimeCheckAutoFillAI: '60'
            },
            player_1: {
              PlayerUserId: '1434658',
              PlayerIALevel: '-1',
              PlayerObserver: '0',
              PlayerAlliance: '0',
              PlayerReady: '0',
              PlayerElo: '1486.47295235',
              PlayerLevel: '14',
              PlayerName: 'Definitely not ÁS',
              PlayerTeamName: '',
              PlayerAvatar: 'VirtualData/SteamGamerPicture/76561198116286575',
              PlayerDeckContent: 'DCTsjSBiEJihbAAEUYELaEewACMTEaCsc8OCMc8OCkeIACMSsaDEUsaCEeAACsdMaCEf4ACkdEaCEU0aCMdMaC0NsQSMLsQSkZ4ACENULaESkLaMRkQSERUaCg6wACkZEaCsSsaCENMZqkMcX6UQkQSUQsQSxH4ACUOcaCEhoACkgIACqgYADBH4ACUNsQQ=',
              PlayerSkinIndexUsed: 'DNQwJH8=',
              PlayerIsAIAutoFilled: '0',
              PlayerScoreLimit: '2000',
              PlayerIncomeRate: '1'
            },
            player_3: {
              PlayerUserId: '1048751',
              PlayerIALevel: '-1',
              PlayerObserver: '0',
              PlayerAlliance: '1',
              PlayerReady: '1',
              PlayerElo: '1854.6270814',
              PlayerLevel: '36',
              PlayerName: 'RTK {S} | PauluS',
              PlayerTeamName: '',
              PlayerAvatar: 'VirtualData/SteamGamerPicture/76561197971998618',
              PlayerDeckContent: 'DCTAzRhBEJkGhyDsNDkHRaMIOq0YQdlowg6jHgAEWkCDqtDEHQaKAnkLki5FoYg6jIoAEGcgAKM5AAQY7AAiWKABQuwACRDSLlCHiDsDqgAQNgAAwa0ABUzgACKvoAEBZgAINEIuUaIGEoQiABFS8AChBKUdVCSDoNEkHWaLLSg0SWzJosCc',
              PlayerSkinIndexUsed: 'DLVgQA==',
              PlayerIsAIAutoFilled: '0',
              PlayerScoreLimit: '2000',
              PlayerIncomeRate: '1'
            },
            ingamePlayerId: 0,
            result: { Duration: '1133', Victory: '5', Score: '0' }
          }

          expect(data.result.duration).is.equal(Number(testObj.result.Duration))
          expect(data.result.score).is.equal(Number(testObj.result.Score))
          expect(data.result.victory).is.equal(Number(testObj.result.Victory))

          expect(data.scoreLimit).is.equal(Number(testObj.game.ScoreLimit))
          expect(data.timeLimit).is.equal(Number(testObj.game.TimeLimit))
          expect(data.incomeRate).is.equal(Number(testObj.game.IncomeRate))
          expect(data.gameMode).is.equal(Number(testObj.game.GameMode))
          expect(data.initMoney).is.equal(Number(testObj.game.InitMoney))
          expect(data.map_raw).is.equal(testObj.game.Map)

          expect(data.players[0].name).is.equal(testObj.player_1.PlayerName)
          expect(data.players[1].name).is.equal(testObj.player_3.PlayerName)

          expect(data.players[0].deck?.division).is.equal("4 Munte")
          expect(data.players[1].deck?.division).is.equal("1. Skijäger")


          


    })
})