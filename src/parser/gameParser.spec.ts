import {GameParser, RawGameData} from './gameParser';
import * as fs from 'fs'
import {expect} from 'chai';

describe('Game Parser', () => {
    it('Test parse oldest replay', () => {
        const buffer = fs.readFileSync("test/hellaOldReplay.rpl3");
        let data = GameParser.parseRaw(buffer);

        data = data as RawGameData;
        expect(data).not.null;
    }),
        it('Test parse old replay', () => {
            const buffer = fs.readFileSync("test/g0af_vs_Metalphase_G2.rpl3");
            let data = GameParser.parseRaw(buffer);

            data = data as RawGameData;
            expect(data).not.null;
        }),
        it('Test load players ReeF vs Iwon', () => {
            const buffer = fs.readFileSync("test/Reef_vs_Iwon.rpl3");
            let data = GameParser.parseRaw(buffer);

            expect(data).not.null;

            data = data as RawGameData;

            expect(data.players[0].name).is.equal('[Duke] IwonTheInternet');
            expect(data.players[1].name).is.equal('ReeF');

        }),
        it('Test load divs ReeF vs Iwon', () => {
            const buffer = fs.readFileSync("test/Reef_vs_Iwon.rpl3");
            let data = GameParser.parseRaw(buffer);

            expect(data).not.null;

            data = data as RawGameData;

            expect(data.players[0].deck?.division).is.equal('1. Lovas');
            expect(data.players[1].deck?.division).is.equal('Panssaridivisioona');
        }),
        it('Test load players Skumfuk vs Hard AI', () => {
            const buffer = fs.readFileSync("test/Conquest_Break_1v1.rpl3");
            const data = GameParser.parseRaw(buffer);

            expect(data!.players[0].name).is.equal('Skumfuk')
            expect(data!.players[1].name).is.equal('AI Hard')

        }),
        it('Test load factions + divs Skumfuk vs Hard AI', () => {
            const buffer = fs.readFileSync("test/Conquest_Break_1v1.rpl3");
            const data = GameParser.parseRaw(buffer);

            expect(data!.players[0].deck?.division).is.equal('14. Infanterie');
            expect(data!.players[1].deck?.division).is.equal('15th Infantry');

            expect(data!.players[0].deck?.faction).is.not.true;
            expect(data!.players[1].deck?.faction).is.true;
        }),
        it('Test stability when incorrect input', () => {
            const buffer = fs.readFileSync("test/emptyFile.rpl3");
            const data = GameParser.parseRaw(buffer);

            expect(data).is.null;
        }),
        it('Test load AS vs VonPaulus_G2', () => {
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
                result: {Duration: '1133', Victory: '5', Score: '0'}
            }

            console.log('MAAAAAAAAAP:', data!.mapName);

            expect(data!.result.duration).is.equal(Number(testObj.result.Duration))
            expect(data!.result.score).is.equal(Number(testObj.result.Score))
            expect(data!.result.victory).is.equal(Number(testObj.result.Victory))

            expect(data!.scoreLimit).is.equal(Number(testObj.game.ScoreLimit))
            expect(data!.timeLimit).is.equal(Number(testObj.game.TimeLimit))
            expect(data!.incomeRate).is.equal(Number(testObj.game.IncomeRate))
            expect(data!.gameMode).is.equal(Number(testObj.game.GameMode))
            expect(data!.initMoney).is.equal(Number(testObj.game.InitMoney))
            expect(data!.mapRaw).is.equal(testObj.game.Map)
            expect(data!.mapName).is.equal('Sianno')

            fs.writeFileSync("output.txt", JSON.stringify(data));
        }),

        it('print Data', () => {

            const buffer = fs.readFileSync("test/Reef_vs_Iwon.rpl3");
            let data = GameParser.parseRaw(buffer);

            expect(data).not.null;

            data = data as RawGameData;

            console.log(data);

        }),
        it('Test map names', () => {
            expect(GameParser.getMapName('_3x2_Tali_Ihantala_LD_1v1_CQC')).is.equal('Tali Ihantala');

            expect(GameParser.getMapName('_3x2_Slutsk_LD_3v3_CQC')).is.equal('Slutsk 3v3');

            expect(GameParser.getMapName('_3x3_MountRiver_1vs1')).is.equal('Mount River');

            expect(GameParser.getMapName('_2x3_Vertigo_1vs1_CONQ_DUEL')).is.equal('Vertigo');

            expect(GameParser.getMapName('_5x2_Loop_2vs2_CONQ_DUEL')).is.equal('Loop 2v2');

            expect(GameParser.getMapName('_4x3_geisa_10vs10_DEST')).is.equal('Geisa 10v10');

            expect(GameParser.getMapName('_2x3_zigzag_2vs2_DEST')).is.equal('Vertigo 2v2');

            expect(GameParser.getMapName('_3x3_IFleuve')).is.equal('Mount River');

            expect(GameParser.getMapName('_2x2_Plateau_Central_Orsha_E_LD_1v1')).is.equal('Orsha East');
        });
})
