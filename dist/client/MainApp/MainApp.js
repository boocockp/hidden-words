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
    const {Join, If} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const canDragItem = undefined
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(TextElement, elProps(pathTo('RowText')).styles(elProps(pathTo('RowText.Styles')).fontSize('40').lineHeight('0.9em').letterSpacing('0.4em').fontFamily('monospace').outlineOffset('5px').borderRadius('5px').outlineWidth('2px').outlineStyle(If($index == 0, 'solid', '')).outlineColor('orange').props).content(Join($item)).props),
    )
})


const MainPage_ItemSet2Item = React.memo(function MainPage_ItemSet2Item(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, Icon} = Elemento.components
    const _state = Elemento.useGetStore()
    const RotateUp = _state.useObject(parentPathWith('RotateUp'))
    const Up_action = React.useCallback(wrapFn(pathTo('Up'), 'action', async () => {
        await RotateUp($item)
    }), [RotateUp, $item])
    const canDragItem = undefined
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(Icon, elProps(pathTo('Up')).iconName('expand_less').action(Up_action).styles(elProps(pathTo('Up.Styles')).padding('0').fontSize('38').color('black').border('1px solid gray').props).props),
    )
})


const MainPage_ItemSet3Item = React.memo(function MainPage_ItemSet3Item(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, Icon} = Elemento.components
    const _state = Elemento.useGetStore()
    const RotateDown = _state.useObject(parentPathWith('RotateDown'))
    const Down_action = React.useCallback(wrapFn(pathTo('Down'), 'action', async () => {
        await RotateDown($item)
    }), [RotateDown, $item])
    const canDragItem = undefined
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(Icon, elProps(pathTo('Down')).iconName('expand_more').action(Down_action).styles(elProps(pathTo('Down.Styles')).color('black').fontSize('38').border('1px solid gray').padding('0').props).props),
    )
})


function MainPage(props) {
    const pathTo = name => props.path + '.' + name
    const {Page, Data, Calculation, Timer, TextElement, Dialog, Button, Block, ItemSet} = Elemento.components
    const {Split, Select, And, Len, ForEach, ItemAt, Range, Not, Eq, Join, First, Or, If, FlatList, Shuffle, RandomListFrom, WithoutItems, RandomFrom, Random, Log, Ceiling} = Elemento.globalFunctions
    const {Update, Set, Reset} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const Word = _state.setObject(pathTo('Word'), new Data.State(stateProps(pathTo('Word')).props))
    const Columns = _state.setObject(pathTo('Columns'), new Data.State(stateProps(pathTo('Columns')).value([]).props))
    const ColumnOffsets = _state.setObject(pathTo('ColumnOffsets'), new Data.State(stateProps(pathTo('ColumnOffsets')).value([]).props))
    const Status = _state.setObject(pathTo('Status'), new Data.State(stateProps(pathTo('Status')).value('Ready').props))
    const Score = _state.setObject(pathTo('Score'), new Data.State(stateProps(pathTo('Score')).value(0).props))
    const RoundSkipped = _state.setObject(pathTo('RoundSkipped'), new Data.State(stateProps(pathTo('RoundSkipped')).value(false).props))
    const AllLetters = _state.setObject(pathTo('AllLetters'), new Calculation.State(stateProps(pathTo('AllLetters')).value(Split('abcdefghijklmnopqrstuvwxyz')).props))
    const CandidateWords = _state.setObject(pathTo('CandidateWords'), new Calculation.State(stateProps(pathTo('CandidateWords')).value(Select(WordList(), ($item, $index) => And(Len($item) >= 5, Len($item) <= 7))).props))
    const Letters = _state.setObject(pathTo('Letters'), new Calculation.State(stateProps(pathTo('Letters')).value(Split(Word)).props))
    const NumRows = _state.setObject(pathTo('NumRows'), new Calculation.State(stateProps(pathTo('NumRows')).value(4).props))
    const LetterRow = _state.setObject(pathTo('LetterRow'), React.useCallback(wrapFn(pathTo('LetterRow'), 'calculation', (rowIndex) => {
        return ForEach(Columns, ($item, $index) => ItemAt($item, (rowIndex + ItemAt(ColumnOffsets, $index)) % NumRows))
    }), [Columns, ColumnOffsets, NumRows]))
    const LetterRows = _state.setObject(pathTo('LetterRows'), new Calculation.State(stateProps(pathTo('LetterRows')).value(ForEach(Range(0, NumRows - 1), ($item, $index) => LetterRow($item))).props))
    const IsRoundWon = _state.setObject(pathTo('IsRoundWon'), new Calculation.State(stateProps(pathTo('IsRoundWon')).value(And(Not(RoundSkipped), Eq(Join(First(LetterRows)), Word))).props))
    const IsRoundFailed = _state.setObject(pathTo('IsRoundFailed'), new Calculation.State(stateProps(pathTo('IsRoundFailed')).value(false).props))
    const GameRunning = _state.setObject(pathTo('GameRunning'), new Calculation.State(stateProps(pathTo('GameRunning')).value(Or(Status == 'Playing', Status == 'Paused')).props))
    const IsRoundComplete = _state.setObject(pathTo('IsRoundComplete'), new Calculation.State(stateProps(pathTo('IsRoundComplete')).value(Or(IsRoundWon, IsRoundFailed, RoundSkipped, Not(GameRunning))).props))
    const RoundInPlay = _state.setObject(pathTo('RoundInPlay'), new Calculation.State(stateProps(pathTo('RoundInPlay')).value(Not(IsRoundComplete)).props))
    const Points = _state.setObject(pathTo('Points'), React.useCallback(wrapFn(pathTo('Points'), 'calculation', () => {
        return Len(Word) * 3
    }), [Word]))
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
        Log(word, cols)
        return Reset()
    }), [CandidateWords, ColumnLetters, Word, Columns, ColumnOffsets, NumRows]))
    const StartNewRound = _state.setObject(pathTo('StartNewRound'), React.useCallback(wrapFn(pathTo('StartNewRound'), 'calculation', () => {
        Reset(RoundSkipped)
        return SetupNewRound()
    }), [RoundSkipped, SetupNewRound]))
    const EndRound = _state.setObject(pathTo('EndRound'), React.useCallback(wrapFn(pathTo('EndRound'), 'calculation', () => {
        If(IsRoundWon, () => Set(Score, Score + Points(false)))
        return Set(ColumnOffsets, ForEach(Columns, ($item, $index) => 0))
    }), [IsRoundWon, Score, Points, ColumnOffsets, Columns]))
    const WhenRoundComplete_whenTrueAction = React.useCallback(wrapFn(pathTo('WhenRoundComplete'), 'whenTrueAction', async () => {
        await EndRound()
    }), [EndRound])
    const WhenRoundComplete = _state.setObject(pathTo('WhenRoundComplete'), new Calculation.State(stateProps(pathTo('WhenRoundComplete')).value(IsRoundComplete).whenTrueAction(WhenRoundComplete_whenTrueAction).props))
    const EndGame = _state.setObject(pathTo('EndGame'), React.useCallback(wrapFn(pathTo('EndGame'), 'calculation', () => {
        Set(Status, 'Ended')
        return EndRound()
    }), [Status, EndRound]))
    const GameTimer_endAction = React.useCallback(wrapFn(pathTo('GameTimer'), 'endAction', async ($timer) => {
        await EndGame()
    }), [EndGame])
    const GameTimer = _state.setObject(pathTo('GameTimer'), new Timer.State(stateProps(pathTo('GameTimer')).period(180).interval(1).endAction(GameTimer_endAction).props))
    const StartNewGame = _state.setObject(pathTo('StartNewGame'), React.useCallback(wrapFn(pathTo('StartNewGame'), 'calculation', () => {
        Reset(Score)
        Reset(GameTimer)
        Set(Status, 'Playing')
        StartNewRound()
        return GameTimer.Start()
    }), [Score, GameTimer, Status, StartNewRound]))
    const PauseGame = _state.setObject(pathTo('PauseGame'), React.useCallback(wrapFn(pathTo('PauseGame'), 'calculation', () => {
        Set(Status, 'Paused')
        return GameTimer.Stop()
    }), [Status, GameTimer]))
    const ContinueGame = _state.setObject(pathTo('ContinueGame'), React.useCallback(wrapFn(pathTo('ContinueGame'), 'calculation', () => {
        Set(Status, 'Playing')
        return GameTimer.Start()
    }), [Status, GameTimer]))
    const Instructions = _state.setObject(pathTo('Instructions'), new Dialog.State(stateProps(pathTo('Instructions')).initiallyOpen(false).props))
    const StatsLayout = _state.setObject(pathTo('StatsLayout'), new Block.State(stateProps(pathTo('StatsLayout')).props))
    const ReadyPanel = _state.setObject(pathTo('ReadyPanel'), new Block.State(stateProps(pathTo('ReadyPanel')).props))
    const PlayPanel = _state.setObject(pathTo('PlayPanel'), new Block.State(stateProps(pathTo('PlayPanel')).props))
    const LetterGrid = _state.setObject(pathTo('LetterGrid'), new Block.State(stateProps(pathTo('LetterGrid')).props))
    const GridItems = _state.setObject(pathTo('GridItems'), new ItemSet.State(stateProps(pathTo('GridItems')).items(LetterRows).selectable('none').props))
    const UpRotators = _state.setObject(pathTo('UpRotators'), new Block.State(stateProps(pathTo('UpRotators')).props))
    const ItemSet2 = _state.setObject(pathTo('ItemSet2'), new ItemSet.State(stateProps(pathTo('ItemSet2')).items(Range(0, Len(Word) -1)).props))
    const DownRotators = _state.setObject(pathTo('DownRotators'), new Block.State(stateProps(pathTo('DownRotators')).props))
    const ItemSet3 = _state.setObject(pathTo('ItemSet3'), new ItemSet.State(stateProps(pathTo('ItemSet3')).items(Range(0, Len(Word) -1)).props))
    const PlayControls = _state.setObject(pathTo('PlayControls'), new Block.State(stateProps(pathTo('PlayControls')).props))
    const EndedPanel = _state.setObject(pathTo('EndedPanel'), new Block.State(stateProps(pathTo('EndedPanel')).props))
    const RoundControls = _state.setObject(pathTo('RoundControls'), new Block.State(stateProps(pathTo('RoundControls')).props))
    const PausePanel = _state.setObject(pathTo('PausePanel'), new Block.State(stateProps(pathTo('PausePanel')).props))
    const Spacer = _state.setObject(pathTo('Spacer'), new Block.State(stateProps(pathTo('Spacer')).props))
    const GameControls = _state.setObject(pathTo('GameControls'), new Block.State(stateProps(pathTo('GameControls')).props))
    const StartGame2_action = React.useCallback(wrapFn(pathTo('StartGame2'), 'action', async () => {
        await StartNewGame()
        await Instructions.Close()
    }), [StartNewGame, Instructions])
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
        await EndGame()
    }), [EndGame])
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

    return React.createElement(Page, elProps(props.path).props,
        React.createElement(Data, elProps(pathTo('Word')).display(false).props),
        React.createElement(Data, elProps(pathTo('Columns')).display(false).props),
        React.createElement(Data, elProps(pathTo('ColumnOffsets')).display(false).props),
        React.createElement(Data, elProps(pathTo('Status')).display(false).props),
        React.createElement(Data, elProps(pathTo('Score')).display(false).props),
        React.createElement(Data, elProps(pathTo('RoundSkipped')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('AllLetters')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('CandidateWords')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('Letters')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('NumRows')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('LetterRows')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundWon')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundFailed')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('WhenRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('RoundInPlay')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('GameRunning')).show(false).props),
        React.createElement(Timer, elProps(pathTo('GameTimer')).show(false).props),
        React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('Chelsea Market').fontSize('28').color('#039a03').props).content('Hidden Words').props),
        React.createElement(Dialog, elProps(pathTo('Instructions')).layout('vertical').showCloseButton(true).styles(elProps(pathTo('Instructions.Styles')).padding('2em').props).props,
            React.createElement(TextElement, elProps(pathTo('InstructionsText')).allowHtml(true).content(`You have to find a word hidden in a grid of letters.


Click the arrow buttons to move the letters around each column so that the word appears in the top row. 


There may by chance be other words you can make from the random letters in the grid, but there is just one that will get you the points.


If you're stuck you can skip a word.


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
        React.createElement(Block, elProps(pathTo('PlayPanel')).layout('vertical').show(Or(Status == 'Playing', Status == 'Ended')).styles(elProps(pathTo('PlayPanel.Styles')).width('100%').padding('0').props).props,
            React.createElement(Block, elProps(pathTo('LetterGrid')).layout('vertical').props,
            React.createElement(ItemSet, elProps(pathTo('GridItems')).itemContentComponent(MainPage_GridItemsItem).props),
            React.createElement(Block, elProps(pathTo('UpRotators')).layout('horizontal').styles(elProps(pathTo('UpRotators.Styles')).gap('0').props).props,
            React.createElement(ItemSet, elProps(pathTo('ItemSet2')).itemContentComponent(MainPage_ItemSet2Item).props),
    ),
            React.createElement(Block, elProps(pathTo('DownRotators')).layout('horizontal').show(false).styles(elProps(pathTo('DownRotators.Styles')).gap('0').props).props,
            React.createElement(ItemSet, elProps(pathTo('ItemSet3')).itemContentComponent(MainPage_ItemSet3Item).props),
    ),
    ),
            React.createElement(TextElement, elProps(pathTo('RoundWon')).show(IsRoundWon).content('Correct! ' + Points(false) + ' points added').props),
            React.createElement(TextElement, elProps(pathTo('RoundFailed')).show(IsRoundFailed).content('Sorry - ').props),
            React.createElement(TextElement, elProps(pathTo('RoundSkipped')).show(RoundSkipped).content('Skipped').props),
            React.createElement(Block, elProps(pathTo('PlayControls')).layout('horizontal wrapped').props,
            React.createElement(Button, elProps(pathTo('DoSomething')).content('Do Something').appearance('outline').enabled(Not(IsRoundComplete)).props),
            React.createElement(Button, elProps(pathTo('DoSomethingelse')).content('Do Something else').appearance('outline').enabled(Not(IsRoundComplete)).props),
    ),
            React.createElement(Block, elProps(pathTo('EndedPanel')).layout('vertical').show(Status == 'Ended').props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('Chelsea Market').fontSize('28').color('#039a03').props).content('Congratulations!').props),
            React.createElement(TextElement, elProps(pathTo('Score')).content('You have scored ' + Score + ' points!').props),
            React.createElement(TextElement, elProps(pathTo('Whatnext')).content('Click Start Game to have another go').props),
    ),
            React.createElement(Block, elProps(pathTo('RoundControls')).layout('horizontal').props,
            React.createElement(Button, elProps(pathTo('NewRound')).content('Next word').appearance('filled').show(Status == 'Playing' && IsRoundComplete).action(NewRound_action).props),
            React.createElement(Button, elProps(pathTo('SkipRound')).content('Skip this one').appearance('outline').show(Status == 'Playing' && Not(IsRoundComplete)).action(SkipRound_action).props),
    ),
    ),
        React.createElement(Block, elProps(pathTo('PausePanel')).layout('vertical').show(Status == 'Paused').styles(elProps(pathTo('PausePanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Paused...').props),
            React.createElement(TextElement, elProps(pathTo('PauseText')).styles(elProps(pathTo('PauseText.Styles')).fontSize('20').props).content('Click Continue Game to carry on').props),
    ),
        React.createElement(Block, elProps(pathTo('Spacer')).layout('vertical').styles(elProps(pathTo('Spacer.Styles')).borderBottom('2px solid lightgray').width('100%').props).props),
        React.createElement(Block, elProps(pathTo('GameControls')).layout('horizontal').styles(elProps(pathTo('GameControls.Styles')).paddingTop('20px').props).props,
            React.createElement(Button, elProps(pathTo('StartGame')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame_action).props),
            React.createElement(Button, elProps(pathTo('StopGame')).content('Stop Game').appearance('outline').show(GameRunning).action(StopGame_action).props),
            React.createElement(Button, elProps(pathTo('PauseGame')).content('Pause Game').appearance('outline').show(Status == 'Playing').action(PauseGame_action).props),
            React.createElement(Button, elProps(pathTo('ContinueGame')).content('Continue Game').appearance('outline').show(Status == 'Paused').action(ContinueGame_action).props),
            React.createElement(Button, elProps(pathTo('Instructions')).content('Instructions').appearance('outline').action(Instructions_action).props),
    ),
    )
}

// appMain.js
export default function MainApp(props) {
    const pathTo = name => 'MainApp' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('MainApp', new App.State({pages, appContext}))

    return React.createElement(App, {...elProps('MainApp').maxWidth(500).fonts(['Chelsea Market']).props},)
}
