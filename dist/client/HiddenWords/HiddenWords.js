const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React, trace, elProps, stateProps, wrapFn} = Elemento
const {importModule, importHandlers} = Elemento
const WordList = await import('../files/words2.js').then(...importHandlers('Words'))

// MainPage.js
const MainPage_GridItemsItem = React.memo(function MainPage_GridItemsItem(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, TextElement} = Elemento.components
    const {If} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const RowHtml = _state.useObject(parentPathWith('RowHtml'))
    const canDragItem = undefined
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(TextElement, elProps(pathTo('RowText')).allowHtml(true).styles(elProps(pathTo('RowText.Styles')).fontSize('40').lineHeight('0.9em').letterSpacing('0.4em').fontFamily('monospace').outlineOffset('5px').borderRadius('5px').outlineWidth('2px').outlineStyle(If($index == 0, 'solid', '')).outlineColor('orange').props).content(RowHtml($item, $index == 0)).props),
    )
})


const MainPage_ItemSet2Item = React.memo(function MainPage_ItemSet2Item(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, Icon} = Elemento.components
    const {And, Not, ListContains} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const RotateUp = _state.useObject(parentPathWith('RotateUp'))
    const RoundInPlay = _state.useObject(parentPathWith('RoundInPlay'))
    const FixedColumns = _state.useObject(parentPathWith('FixedColumns'))
    const Up_action = React.useCallback(wrapFn(pathTo('Up'), 'action', () => {
        RotateUp($item)
    }), [RotateUp, $item])
    const canDragItem = undefined
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(Icon, elProps(pathTo('Up')).iconName('expand_less').action(Up_action).show(And(RoundInPlay, Not(ListContains(FixedColumns, $index)))).styles(elProps(pathTo('Up.Styles')).padding('0').fontSize('38').color('black').border('1px solid gray').props).props),
        React.createElement(Icon, elProps(pathTo('Fixed')).iconName('check').show(And(RoundInPlay, ListContains(FixedColumns, $index))).styles(elProps(pathTo('Fixed.Styles')).padding('0').fontSize('38').color('green').props).props),
    )
})


function MainPage(props) {
    const pathTo = name => props.path + '.' + name
    const {Page, Data, Calculation, Timer, TextElement, Dialog, Button, Block, ItemSet} = Elemento.components
    const {And, Not, Or, If, Log, Record, Range, Len, Split, Select, RandomFrom, ForEach, Random, ItemAt, Eq, Join, First, WithoutItems, FlatList, Shuffle, RandomListFrom, ListContains, Ceiling} = Elemento.globalFunctions
    const {Reset, Set, Update} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const app = _state.useObject('HiddenWords')
    const {SendMessage, CurrentUrl} = app
    const Status = _state.setObject(pathTo('Status'), new Data.State(stateProps(pathTo('Status')).value('Ready').props))
    const Score = _state.setObject(pathTo('Score'), new Data.State(stateProps(pathTo('Score')).value(0).props))
    const RoundSkipped = _state.setObject(pathTo('RoundSkipped'), new Data.State(stateProps(pathTo('RoundSkipped')).value(false).props))
    const IsRoundFailed = _state.setObject(pathTo('IsRoundFailed'), new Calculation.State(stateProps(pathTo('IsRoundFailed')).value(false).props))
    const GameRunning = _state.setObject(pathTo('GameRunning'), new Calculation.State(stateProps(pathTo('GameRunning')).value(Or(Status == 'Playing', Status == 'Paused')).props))
    const EndGame = _state.setObject(pathTo('EndGame'), React.useCallback(wrapFn(pathTo('EndGame'), 'calculation', () => {
        Set(Status, 'Ending')
    }), [Status]))
    const GameTimer_endAction = React.useCallback(wrapFn(pathTo('GameTimer'), 'endAction', async ($timer) => {
        await EndGame()
    }), [EndGame])
    const GameTimer = _state.setObject(pathTo('GameTimer'), new Timer.State(stateProps(pathTo('GameTimer')).period(180).interval(1).endAction(GameTimer_endAction).props))
    const PauseGame = _state.setObject(pathTo('PauseGame'), React.useCallback(wrapFn(pathTo('PauseGame'), 'calculation', async () => {
        Set(Status, 'Paused')
        await GameTimer.Stop()
    }), [Status, GameTimer]))
    const ContinueGame = _state.setObject(pathTo('ContinueGame'), React.useCallback(wrapFn(pathTo('ContinueGame'), 'calculation', async () => {
        Set(Status, 'Playing')
        await GameTimer.Start()
    }), [Status, GameTimer]))
    const StopGame = _state.setObject(pathTo('StopGame'), React.useCallback(wrapFn(pathTo('StopGame'), 'calculation', async () => {
        await GameTimer.Stop()
        await EndGame()
    }), [GameTimer, EndGame]))
    const SendScore = _state.setObject(pathTo('SendScore'), React.useCallback(wrapFn(pathTo('SendScore'), 'calculation', async (score) => {
        Log('Sending score', score)
        await SendMessage('parent', Record('score', score, 'url', (await CurrentUrl()).text))
    }), []))
    const WrapGame = _state.setObject(pathTo('WrapGame'), React.useCallback(wrapFn(pathTo('WrapGame'), 'calculation', async () => {
        await SendScore(Score)
        Set(Status, 'Ended')
    }), [SendScore, Score, Status]))
    const WhenGameEnding_whenTrueAction = React.useCallback(wrapFn(pathTo('WhenGameEnding'), 'whenTrueAction', async () => {
        await WrapGame()
    }), [WrapGame])
    const WhenGameEnding = _state.setObject(pathTo('WhenGameEnding'), new Calculation.State(stateProps(pathTo('WhenGameEnding')).value(Status == 'Ending').whenTrueAction(WhenGameEnding_whenTrueAction).props))
    const Word = _state.setObject(pathTo('Word'), new Data.State(stateProps(pathTo('Word')).props))
    const Columns = _state.setObject(pathTo('Columns'), new Data.State(stateProps(pathTo('Columns')).value([]).props))
    const ColumnOffsets = _state.setObject(pathTo('ColumnOffsets'), new Data.State(stateProps(pathTo('ColumnOffsets')).value([]).props))
    const FixedColumns = _state.setObject(pathTo('FixedColumns'), new Data.State(stateProps(pathTo('FixedColumns')).value([]).props))
    const ColumnIndexes = _state.setObject(pathTo('ColumnIndexes'), new Calculation.State(stateProps(pathTo('ColumnIndexes')).value(Range(0, Len(Word) -1)).props))
    const AllLetters = _state.setObject(pathTo('AllLetters'), new Calculation.State(stateProps(pathTo('AllLetters')).value(Split('abcdefghijklmnopqrstuvwxyz')).props))
    const CandidateWords = _state.setObject(pathTo('CandidateWords'), new Calculation.State(stateProps(pathTo('CandidateWords')).value(Select(WordList(), ($item, $index) => And(Len($item) >= 5, Len($item) <= 7))).props))
    const Letters = _state.setObject(pathTo('Letters'), new Calculation.State(stateProps(pathTo('Letters')).value(Split(Word)).props))
    const NumRows = _state.setObject(pathTo('NumRows'), new Calculation.State(stateProps(pathTo('NumRows')).value(4).props))
    const FinishRound = _state.setObject(pathTo('FinishRound'), React.useCallback(wrapFn(pathTo('FinishRound'), 'calculation', () => {
        Set(ColumnOffsets, ForEach(Columns, ($item, $index) => 0))
    }), [ColumnOffsets, Columns]))
    const ColumnLetter = _state.setObject(pathTo('ColumnLetter'), React.useCallback(wrapFn(pathTo('ColumnLetter'), 'calculation', (rowIndex, colIndex) => {
        let column = ItemAt(Columns, colIndex)
        let rowOffset = ItemAt(ColumnOffsets, colIndex)
        let row = (rowIndex + rowOffset) % NumRows
        return ItemAt(column, row)
    }), [Columns, ColumnOffsets, NumRows]))
    const LetterRow = _state.setObject(pathTo('LetterRow'), React.useCallback(wrapFn(pathTo('LetterRow'), 'calculation', (rowIndex) => {
        return ForEach(Columns, ($item, $index) => ColumnLetter(rowIndex, $index))
    }), [Columns, ColumnLetter]))
    const LetterRows = _state.setObject(pathTo('LetterRows'), new Calculation.State(stateProps(pathTo('LetterRows')).value(ForEach(Range(0, NumRows - 1), ($item, $index) => LetterRow($item))).props))
    const Points = _state.setObject(pathTo('Points'), React.useCallback(wrapFn(pathTo('Points'), 'calculation', () => {
        let lettersGuessed = Len(Word) - Len(FixedColumns)
        return lettersGuessed * 3
    }), [Word, FixedColumns]))
    const RoundCorrect = _state.setObject(pathTo('RoundCorrect'), React.useCallback(wrapFn(pathTo('RoundCorrect'), 'calculation', () => {
        return Eq(Join(First(LetterRows)), Word)
    }), [LetterRows, Word]))
    const IsRoundWon = _state.setObject(pathTo('IsRoundWon'), new Calculation.State(stateProps(pathTo('IsRoundWon')).value(And(GameRunning, Not(RoundSkipped), RoundCorrect())).props))
    const IsRoundComplete = _state.setObject(pathTo('IsRoundComplete'), new Calculation.State(stateProps(pathTo('IsRoundComplete')).value(Or(IsRoundWon, IsRoundFailed, RoundSkipped, Not(GameRunning))).props))
    const RoundInPlay = _state.setObject(pathTo('RoundInPlay'), new Calculation.State(stateProps(pathTo('RoundInPlay')).value(Not(IsRoundComplete)).props))
    const EndRound = _state.setObject(pathTo('EndRound'), React.useCallback(wrapFn(pathTo('EndRound'), 'calculation', async () => {
        await If(IsRoundWon, () => Set(Score, Score + Points()))
        await FinishRound()
    }), [IsRoundWon, Score, Points, FinishRound]))
    const WhenRoundComplete_whenTrueAction = React.useCallback(wrapFn(pathTo('WhenRoundComplete'), 'whenTrueAction', async () => {
        await EndRound()
    }), [EndRound])
    const WhenRoundComplete = _state.setObject(pathTo('WhenRoundComplete'), new Calculation.State(stateProps(pathTo('WhenRoundComplete')).value(IsRoundComplete).whenTrueAction(WhenRoundComplete_whenTrueAction).props))
    const RotateUp = _state.setObject(pathTo('RotateUp'), React.useCallback(wrapFn(pathTo('RotateUp'), 'calculation', (column) => {
        let offset = ItemAt(ColumnOffsets, column)
        let newOffset = (offset + 1) % NumRows
        return Update(ColumnOffsets, {[column]: newOffset})
    }), [ColumnOffsets, NumRows]))
    const RotateDown = _state.setObject(pathTo('RotateDown'), React.useCallback(wrapFn(pathTo('RotateDown'), 'calculation', (column) => {
        let offset = ItemAt(ColumnOffsets, column)
        let newOffset = If(offset > 0, () => offset - 1, () => NumRows - 1)
        return Update(ColumnOffsets, {[column]: newOffset})
    }), [ColumnOffsets, NumRows]))
    const GiveClue = _state.setObject(pathTo('GiveClue'), React.useCallback(wrapFn(pathTo('GiveClue'), 'calculation', () => {
        let unfixedCols = WithoutItems(ColumnIndexes, FixedColumns)
        let newFixedCol = RandomFrom(unfixedCols)
        Set(FixedColumns, FlatList(FixedColumns, newFixedCol))
        return Update(ColumnOffsets, {[newFixedCol]: 0})
    }), [ColumnIndexes, FixedColumns, ColumnOffsets]))
    const ColumnLetters = _state.setObject(pathTo('ColumnLetters'), React.useCallback(wrapFn(pathTo('ColumnLetters'), 'calculation', (correctLetter) => {
        return FlatList(correctLetter, Shuffle(RandomListFrom(WithoutItems(AllLetters, correctLetter), NumRows - 1)))
    }), [AllLetters, NumRows]))
    const SetupNewRound = _state.setObject(pathTo('SetupNewRound'), React.useCallback(wrapFn(pathTo('SetupNewRound'), 'calculation', () => {
        let word = RandomFrom(CandidateWords)
        let letters = Split(word)
        let cols = ForEach(letters, ($item, $index) => ColumnLetters($item))
        let firstOffset = 0
        Set(Word, word)
        Set(Columns, cols)
        Set(ColumnOffsets, ForEach(letters, ($item, $index) => Random(NumRows)))
        Reset(FixedColumns)
    }), [CandidateWords, ColumnLetters, Word, Columns, ColumnOffsets, NumRows, FixedColumns]))
    const StartNewRound = _state.setObject(pathTo('StartNewRound'), React.useCallback(wrapFn(pathTo('StartNewRound'), 'calculation', async () => {
        Reset(RoundSkipped)
        await SetupNewRound()
    }), [RoundSkipped, SetupNewRound]))
    const StartNewGame = _state.setObject(pathTo('StartNewGame'), React.useCallback(wrapFn(pathTo('StartNewGame'), 'calculation', async () => {
        Reset(Score)
        Reset(GameTimer)
        Set(Status, 'Playing')
        await StartNewRound()
        await GameTimer.Start()
    }), [Score, GameTimer, Status, StartNewRound]))
    const RowHtml = _state.setObject(pathTo('RowHtml'), React.useCallback(wrapFn(pathTo('RowHtml'), 'calculation', (letters, useHtml) => {
        let letterItems = ForEach(letters, ($item, $index) => If(useHtml && ListContains(FixedColumns, $index), () => `<span style='color: green'>${$item}</span>`, $item))
        return Join(letterItems)
    }), [FixedColumns]))
    const Instructions = _state.setObject(pathTo('Instructions'), new Dialog.State(stateProps(pathTo('Instructions')).initiallyOpen(false).props))
    const StatsLayout = _state.setObject(pathTo('StatsLayout'), new Block.State(stateProps(pathTo('StatsLayout')).props))
    const ReadyPanel = _state.setObject(pathTo('ReadyPanel'), new Block.State(stateProps(pathTo('ReadyPanel')).props))
    const PlayPanel = _state.setObject(pathTo('PlayPanel'), new Block.State(stateProps(pathTo('PlayPanel')).props))
    const LetterGrid = _state.setObject(pathTo('LetterGrid'), new Block.State(stateProps(pathTo('LetterGrid')).props))
    const GridItems = _state.setObject(pathTo('GridItems'), new ItemSet.State(stateProps(pathTo('GridItems')).items(LetterRows).selectable('none').props))
    const UpRotators = _state.setObject(pathTo('UpRotators'), new Block.State(stateProps(pathTo('UpRotators')).props))
    const ItemSet2 = _state.setObject(pathTo('ItemSet2'), new ItemSet.State(stateProps(pathTo('ItemSet2')).items(ColumnIndexes).props))
    const EndedPanel = _state.setObject(pathTo('EndedPanel'), new Block.State(stateProps(pathTo('EndedPanel')).props))
    const RoundControls = _state.setObject(pathTo('RoundControls'), new Block.State(stateProps(pathTo('RoundControls')).props))
    const PausePanel = _state.setObject(pathTo('PausePanel'), new Block.State(stateProps(pathTo('PausePanel')).props))
    const GameControls = _state.setObject(pathTo('GameControls'), new Block.State(stateProps(pathTo('GameControls')).props))
    const StartGame2_action = React.useCallback(wrapFn(pathTo('StartGame2'), 'action', async () => {
        await StartNewGame()
        await Instructions.Close()
    }), [StartNewGame, Instructions])
    const GiveMeAClue_action = React.useCallback(wrapFn(pathTo('GiveMeAClue'), 'action', () => {
        GiveClue()
    }), [GiveClue])
    const NewRound_action = React.useCallback(wrapFn(pathTo('NewRound'), 'action', async () => {
        await StartNewRound()
    }), [StartNewRound])
    const SkipRound_action = React.useCallback(wrapFn(pathTo('SkipRound'), 'action', () => {
        Set(RoundSkipped, true)
    }), [RoundSkipped])
    const StartGame_action = React.useCallback(wrapFn(pathTo('StartGame'), 'action', async () => {
        await StartNewGame()
    }), [StartNewGame])
    const StopGame_action = React.useCallback(wrapFn(pathTo('StopGame'), 'action', async () => {
        await StopGame()
    }), [])
    const PauseGame_action = React.useCallback(wrapFn(pathTo('PauseGame'), 'action', async () => {
        await PauseGame()
    }), [])
    const ContinueGame_action = React.useCallback(wrapFn(pathTo('ContinueGame'), 'action', async () => {
        await ContinueGame()
    }), [])
    const Instructions_action = React.useCallback(wrapFn(pathTo('Instructions'), 'action', async () => {
        await Instructions.Show()
    }), [])
    Elemento.elementoDebug(() => eval(Elemento.useDebugExpr()))

    return React.createElement(Page, elProps(props.path).styles(elProps(pathTo('MainPage.Styles')).gap('4px').props).props,
        React.createElement(Data, elProps(pathTo('Status')).display(false).props),
        React.createElement(Data, elProps(pathTo('Score')).display(false).props),
        React.createElement(Data, elProps(pathTo('RoundSkipped')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundWon')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundFailed')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('WhenRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('RoundInPlay')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('GameRunning')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('WhenGameEnding')).props),
        React.createElement(Timer, elProps(pathTo('GameTimer')).show(false).props),
        React.createElement(Data, elProps(pathTo('Word')).display(false).props),
        React.createElement(Data, elProps(pathTo('Columns')).display(false).props),
        React.createElement(Data, elProps(pathTo('ColumnOffsets')).display(false).props),
        React.createElement(Data, elProps(pathTo('FixedColumns')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('ColumnIndexes')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('AllLetters')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('CandidateWords')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('Letters')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('NumRows')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('LetterRows')).show(false).props),
        React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('Chelsea Market').fontSize('28').color('#039a03').props).content('Hidden Words').props),
        React.createElement(Dialog, elProps(pathTo('Instructions')).layout('vertical').showCloseButton(true).styles(elProps(pathTo('Instructions.Styles')).padding('2em').props).props,
            React.createElement(TextElement, elProps(pathTo('InstructionsText')).allowHtml(true).content(`You have to find a word hidden in a grid of letters.


Click the arrow buttons to move the letters around each column so that the word appears in the top row. 

<b>Note</b> - there will often be other words you can make from the random letters in the grid, but there is just one that will get you the points.


To make it easier, you can click Give Me A Clue to fix some of the letters in the word, but you will earn fewer points.  Or click Skip Word to move on if you're stuck.


Click Next Word after each word to get another one.


<b>Tips</b>
<ul>
  <li>Words may be plural</li>
  <li>Longer words score more points</li>
</ul>

You have 3 minutes to find as many words as you can.`).props),
            React.createElement(Button, elProps(pathTo('StartGame2')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame2_action).props),
    ),
        React.createElement(Block, elProps(pathTo('StatsLayout')).layout('horizontal wrapped').styles(elProps(pathTo('StatsLayout.Styles')).fontSize('24').props).props,
            React.createElement(TextElement, elProps(pathTo('ScoreDisplay')).show(Or(GameRunning, Status == 'Ended')).styles(elProps(pathTo('ScoreDisplay.Styles')).fontSize('inherit').color('blue').marginRight('100').props).content(Score + ' points').props),
            React.createElement(TextElement, elProps(pathTo('TimeDisplay')).show(GameRunning).styles(elProps(pathTo('TimeDisplay.Styles')).fontSize('inherit').color('green').props).content(Ceiling(GameTimer. remainingTime) + 's left').props),
            React.createElement(TextElement, elProps(pathTo('GameOver')).show(Status == 'Ended').styles(elProps(pathTo('GameOver.Styles')).fontSize('inherit').color('white').backgroundColor('green').padding('0 0.5em').borderRadius('8px').props).content('Game Over').props),
    ),
        React.createElement(Block, elProps(pathTo('ReadyPanel')).layout('vertical').show(Status == 'Ready').styles(elProps(pathTo('ReadyPanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#039a03').fontFamily('Chelsea Market').fontSize('28').props).content('Welcome!').props),
            React.createElement(TextElement, elProps(pathTo('ReadyText')).styles(elProps(pathTo('ReadyText.Styles')).fontSize('20').props).content(`Find words hidden in a grid of letters

Click Instructions for full details

Or Start Game to dive straight in!`).props),
    ),
        React.createElement(Block, elProps(pathTo('PlayPanel')).layout('vertical').show(Or(Status == 'Playing', Status == 'Ended')).styles(elProps(pathTo('PlayPanel.Styles')).width('100%').padding('0').position('relative').props).props,
            React.createElement(Block, elProps(pathTo('LetterGrid')).layout('vertical').props,
            React.createElement(ItemSet, elProps(pathTo('GridItems')).itemContentComponent(MainPage_GridItemsItem).props),
            React.createElement(Block, elProps(pathTo('UpRotators')).layout('horizontal').styles(elProps(pathTo('UpRotators.Styles')).gap('0').props).props,
            React.createElement(ItemSet, elProps(pathTo('ItemSet2')).itemContentComponent(MainPage_ItemSet2Item).props),
    ),
    ),
            React.createElement(TextElement, elProps(pathTo('RoundInPlayText')).show(RoundInPlay).content(Points() + ' points for this word').props),
            React.createElement(TextElement, elProps(pathTo('RoundWon')).show(IsRoundWon).content('Correct! ' + Points() + ' points added').props),
            React.createElement(TextElement, elProps(pathTo('RoundFailed')).show(IsRoundFailed).content('Sorry - no points').props),
            React.createElement(TextElement, elProps(pathTo('RoundSkipped')).show(RoundSkipped).content('Skipped').props),
            React.createElement(Block, elProps(pathTo('EndedPanel')).layout('vertical').show(Status == 'Ended').styles(elProps(pathTo('EndedPanel.Styles')).position('absolute').top('140').left('150').translate('-50% -50%').backgroundColor('lightblue').borderRadius('10').border('2px solid blue').minWidth('18em').padding('1em').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('Chelsea Market').fontSize('28').color('#039a03').props).content('Congratulations!').props),
            React.createElement(TextElement, elProps(pathTo('Score')).content('You have scored ' + Score + ' points!').props),
            React.createElement(TextElement, elProps(pathTo('Whatnext')).content('Click Start Game to play again').props),
    ),
            React.createElement(Block, elProps(pathTo('RoundControls')).layout('horizontal').props,
            React.createElement(Button, elProps(pathTo('GiveMeAClue')).content('Give Me A Clue').appearance('outline').show(Not(IsRoundComplete)).enabled(Len(FixedColumns) < Len(Word) - 2).action(GiveMeAClue_action).props),
            React.createElement(Button, elProps(pathTo('NewRound')).content('Next word').appearance('filled').show(Status == 'Playing' && IsRoundComplete).action(NewRound_action).props),
            React.createElement(Button, elProps(pathTo('SkipRound')).content('Skip Word').appearance('outline').show(Status == 'Playing' && Not(IsRoundComplete)).action(SkipRound_action).props),
    ),
    ),
        React.createElement(Block, elProps(pathTo('PausePanel')).layout('vertical').show(Status == 'Paused').styles(elProps(pathTo('PausePanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Paused...').props),
            React.createElement(TextElement, elProps(pathTo('PauseText')).styles(elProps(pathTo('PauseText.Styles')).fontSize('20').props).content('Click Continue Game to carry on').props),
    ),
        React.createElement(Block, elProps(pathTo('GameControls')).layout('horizontal').styles(elProps(pathTo('GameControls.Styles')).paddingTop('20px').marginTop('4px').props).props,
            React.createElement(Button, elProps(pathTo('StartGame')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame_action).props),
            React.createElement(Button, elProps(pathTo('StopGame')).content('Stop').appearance('outline').show(GameRunning).action(StopGame_action).props),
            React.createElement(Button, elProps(pathTo('PauseGame')).content('Pause').appearance('outline').show(Status == 'Playing').action(PauseGame_action).props),
            React.createElement(Button, elProps(pathTo('ContinueGame')).content('Resume').appearance('outline').show(Status == 'Paused').action(ContinueGame_action).props),
            React.createElement(Button, elProps(pathTo('Instructions')).content('Help').appearance('outline').action(Instructions_action).props),
    ),
    )
}

// appMain.js
export default function HiddenWords(props) {
    const pathTo = name => 'HiddenWords' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('HiddenWords', new App.State({pages, appContext}))

    return React.createElement(App, {...elProps('HiddenWords').maxWidth(500).fonts(['Chelsea Market']).props},)
}
