import { useState, useCallback } from 'react';

const MAX_ROUNDS = 10;

function App() {
  const [screen, setScreen] = useState('welcome');
  const [gameMode, setGameMode] = useState('mixed');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [problemsInRound, setProblemsInRound] = useState(0);
  const [correctInRound, setCorrectInRound] = useState(0);
  const [gameState, setGameState] = useState({
    score: 0, streak: 0, bestStreak: 0, totalSolved: 0,
    level: 1, xp: 0, xpToNext: 100, stars: 0,
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [petMood, setPetMood] = useState('happy');

  const generateStory = (operator, num1, num2) => {
    const additionStories = [
      { text: 'Принцесса нашла в замке ' + num1 + ' волшебных кристаллов, а в саду ещё ' + num2 + '. Сколько кристаллов у принцессы?', emoji: '👸' },
      { text: 'В волшебном лесу выросло ' + num1 + ' золотых яблок, а потом ещё ' + num2 + '. Сколько всего яблок?', emoji: '🌳' },
      { text: 'Единорог собрал ' + num1 + ' радужных цветов, а бабочка подарила ещё ' + num2 + '. Сколько цветов у единорога?', emoji: '🦄' },
      { text: 'Фея наколдовала ' + num1 + ' звёздочек, а потом добавила ещё ' + num2 + '. Сколько звёзд на небе?', emoji: '🧚' },
      { text: 'Дракон нашёл ' + num1 + ' драгоценных камней в пещере и ещё ' + num2 + ' у реки. Сколько камней у дракона?', emoji: '🐉' },
      { text: 'В волшебной школе ' + num1 + ' учеников пришли утром и ещё ' + num2 + ' после обеда. Сколько учеников всего?', emoji: '🏫' },
      { text: 'Русалка собрала ' + num1 + ' жемчужин на дне моря и ещё ' + num2 + ' в коралловом рифе. Сколько жемчужин?', emoji: '🧜' },
      { text: 'Кот-волшебник испёк ' + num1 + ' пирожков с магией и ещё ' + num2 + ' с зельями. Сколько пирожков всего?', emoji: '🐱' },
    ];
    const subtractionStories = [
      { text: 'У рыцаря было ' + num1 + ' золотых монет. Он потратил ' + num2 + ' на доспехи. Сколько монет осталось?', emoji: '🤴' },
      { text: 'На волшебном дереве росло ' + num1 + ' яблок. Ветер унёс ' + num2 + '. Сколько яблок осталось?', emoji: '🌳' },
      { text: 'Принцесса собрала ' + num1 + ' цветов, но ' + num2 + ' завяли. Сколько цветов осталось свежими?', emoji: '👸' },
      { text: 'В сундуке было ' + num1 + ' сокровищ, пират забрал ' + num2 + '. Сколько сокровищ осталось?', emoji: '🏴‍☠️' },
      { text: 'Фея знала ' + num1 + ' заклинаний, но забыла ' + num2 + '. Сколько заклинаний она помнит?', emoji: '🧚' },
      { text: 'Дракон собрал ' + num1 + ' огненных камней, но ' + num2 + ' потухли. Сколько горящих камней?', emoji: '🐉' },
      { text: 'В волшебном аквариуме плавало ' + num1 + ' золотых рыбок, ' + num2 + ' уплыли. Сколько осталось?', emoji: '🐠' },
      { text: 'Эльф нашёл ' + num1 + ' волшебных грибов, но ' + num2 + ' оказались обычными. Сколько настоящих?', emoji: '🧝' },
    ];
    const multiplicationStories = [
      { text: 'На ' + num1 + ' полянках растёт по ' + num2 + ' волшебных цветка. Сколько цветов всего?', emoji: '🌿' },
      { text: num1 + ' фей собрали по ' + num2 + ' звёздочек каждая. Сколько звёзд собрали все феи?', emoji: '⭐' },
      { text: 'В ' + num1 + ' сундуках лежит по ' + num2 + ' золотых монет. Сколько монет всего?', emoji: '💰' },
      { text: num1 + ' единорогов съели по ' + num2 + ' радужных морковок. Сколько морковок съедено?', emoji: '🌈' },
      { text: 'На ' + num1 + ' ветках сидит по ' + num2 + ' волшебных птиц. Сколько птиц всего?', emoji: '🕊️' },
      { text: num1 + ' гномов нашли по ' + num2 + ' алмазов каждый. Сколько алмазов нашли гномы?', emoji: '💎' },
      { text: 'В ' + num1 + ' волшебных коробках по ' + num2 + ' шоколадных конфет. Сколько конфет всего?', emoji: '🎁' },
      { text: num1 + ' принцесс получили по ' + num2 + ' подарков. Сколько подарков раздали?', emoji: '🎀' },
    ];
    const divisionStories = [
      { text: num1 + ' волшебных печеньков нужно поровну разделить между ' + num2 + ' гномами. Сколько достанется каждому?', emoji: '🍪' },
      { text: 'Фея собрала ' + num1 + ' цветов и хочет сделать ' + num2 + ' одинаковых букетов. Сколько цветов в каждом?', emoji: '💐' },
      { text: num1 + ' золотых монет нужно разделить поровну между ' + num2 + ' пиратами. Сколько получит каждый?', emoji: '🏴‍☠️' },
      { text: 'В волшебном саду ' + num1 + ' яблок разложили поровну в ' + num2 + ' корзин. Сколько в каждой?', emoji: '🧺' },
      { text: num1 + ' звёздочек нужно раздать ' + num2 + ' феям поровну. Сколько получит каждая?', emoji: '🧚' },
      { text: 'Дракон нашёл ' + num1 + ' камней и разложил их в ' + num2 + ' мешочков поровну. Сколько в каждом?', emoji: '🐉' },
      { text: num1 + ' конфет раздали ' + num2 + ' детям-эльфам поровну. Сколько досталось каждому?', emoji: '🧝' },
      { text: 'Принцесса испекла ' + num1 + ' пирожков и разложила на ' + num2 + ' тарелок поровну. Сколько на каждой?', emoji: '👸' },
    ];
    let stories;
    if (operator === '+') stories = additionStories;
    else if (operator === '-') stories = subtractionStories;
    else if (operator === 'x') stories = multiplicationStories;
    else stories = divisionStories;
    return stories[Math.floor(Math.random() * stories.length)];
  };

  const generateProblem = useCallback((mode, diff) => {
    const ranges = { easy: { add: 20, mul: 5 }, medium: { add: 50, mul: 9 }, hard: { add: 100, mul: 9 } };
    const range = ranges[diff];
    let num1, num2, operator, answer;

    if (mode === 'addition') {
      num1 = Math.floor(Math.random() * range.add) + 1;
      num2 = Math.floor(Math.random() * range.add) + 1;
      operator = '+'; answer = num1 + num2;
    } else if (mode === 'subtraction') {
      num1 = Math.floor(Math.random() * range.add) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      operator = '-'; answer = num1 - num2;
    } else if (mode === 'multiplication') {
      num1 = Math.floor(Math.random() * range.mul) + 1;
      num2 = Math.floor(Math.random() * range.mul) + 1;
      operator = 'x'; answer = num1 * num2;
    } else if (mode === 'division') {
      num2 = Math.floor(Math.random() * (range.mul - 1)) + 2;
      answer = Math.floor(Math.random() * range.mul) + 1;
      num1 = num2 * answer; operator = '/';
    } else {
      const ops = ['+', '-', 'x', '/'];
      const op = ops[Math.floor(Math.random() * 4)];
      if (op === '+') { num1 = Math.floor(Math.random() * range.add) + 1; num2 = Math.floor(Math.random() * range.add) + 1; operator = '+'; answer = num1 + num2; }
      else if (op === '-') { num1 = Math.floor(Math.random() * range.add) + 1; num2 = Math.floor(Math.random() * num1) + 1; operator = '-'; answer = num1 - num2; }
      else if (op === 'x') { num1 = Math.floor(Math.random() * range.mul) + 1; num2 = Math.floor(Math.random() * range.mul) + 1; operator = 'x'; answer = num1 * num2; }
      else { num2 = Math.floor(Math.random() * (range.mul - 1)) + 2; answer = Math.floor(Math.random() * range.mul) + 1; num1 = num2 * answer; operator = '/'; }
    }

    const options = new Set();
    options.add(answer);
    while (options.size < 4) { const o = answer + Math.floor(Math.random() * 10) - 5; if (o >= 0 && o !== answer) options.add(o); }

    let story, storyEmoji;
    if (mode === 'adventure') { const s = generateStory(operator, num1, num2); story = s.text; storyEmoji = s.emoji; }

    return { num1, num2, operator, answer, options: Array.from(options).sort(() => Math.random() - 0.5), story, storyEmoji };
  }, []);

  const startGame = (mode) => {
    setGameMode(mode); setProblemsInRound(0); setCorrectInRound(0); setScreen('game');
    setCurrentProblem(generateProblem(mode, difficulty)); setSelectedAnswer(null); setIsCorrect(null); setPetMood('thinking');
  };

  const handleAnswer = (ans) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);
    const correct = ans === currentProblem.answer;
    setIsCorrect(correct);
    if (correct) {
      setPetMood('excited'); setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      const bonus = gameState.streak >= 3 ? 2 : 1;
      setGameState(p => {
        const ns = p.streak + 1; const nxp = p.xp + 10 * bonus;
        let nl = p.level, nxn = p.xpToNext, rx = nxp, st = p.stars;
        if (nxp >= p.xpToNext) { nl++; rx = nxp - p.xpToNext; nxn = Math.floor(p.xpToNext * 1.3); st++; setShowLevelUp(true); setTimeout(() => setShowLevelUp(false), 2000); }
        return { score: p.score + 10 * bonus, streak: ns, bestStreak: Math.max(p.bestStreak, ns), totalSolved: p.totalSolved + 1, level: nl, xp: rx, xpToNext: nxn, stars: st };
      });
      setCorrectInRound(p => p + 1);
    } else { setPetMood('sad'); setGameState(p => ({ ...p, streak: 0 })); }
    setProblemsInRound(p => p + 1);
    setTimeout(() => {
      if (problemsInRound + 1 >= MAX_ROUNDS) setScreen('result');
      else { setCurrentProblem(generateProblem(gameMode, difficulty)); setSelectedAnswer(null); setIsCorrect(null); setPetMood('thinking'); }
    }, 1500);
  };

  const getPetEmoji = () => ({ happy: '🦊', thinking: '🤔', excited: '🎉', sad: '💪' }[petMood] || '🦊');
  const getPetMessage = () => {
    if (isCorrect) return ['Молодец! 🌟', 'Супер! ✨', 'Отлично! 💫', 'Так держать! 🎯', 'Ты умница! 🏆'][Math.floor(Math.random() * 5)];
    if (isCorrect === false) return ['Не беда, попробуй ещё! 💪', 'Почти! 🌈', 'Не сдавайся! 🦋', 'Ты справишься! 🌸'][Math.floor(Math.random() * 4)];
    return ['Давай решим вместе! 📚', 'Подумай! 🧠', 'Ты можешь! 🌟', 'Я в тебя верю! 💖'][Math.floor(Math.random() * 4)];
  };
  const getOp = (op) => ({ '+': '+', '-': '−', 'x': '×', '/': '÷' }[op] || op);

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center animate-bounce-in max-w-md mx-auto">
          <div className="text-7xl sm:text-8xl mb-4 sm:mb-6 animate-float">🦊</div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">Математическое</h1>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg animate-rainbow">Приключение!</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">Привет! Я лисичка Алиса 🌟<br/>Давай вместе учить математику!</p>
          <button onClick={() => setScreen('menu')} className="bg-white text-purple-600 font-bold text-xl sm:text-2xl px-8 sm:px-12 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow w-full sm:w-auto">🚀 Начать!</button>
          <div className="mt-8 flex justify-center gap-4 text-4xl">
            <span className="animate-float" style={{animationDelay:'0s'}}>⭐</span>
            <span className="animate-float" style={{animationDelay:'0.5s'}}>🌈</span>
            <span className="animate-float" style={{animationDelay:'1s'}}>🦋</span>
            <span className="animate-float" style={{animationDelay:'1.5s'}}>🌸</span>
            <span className="animate-float" style={{animationDelay:'2s'}}>💎</span>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-400 to-pink-300 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">🦊</span>
              <div>
                <p className="text-white font-bold text-base sm:text-lg">Уровень {gameState.level}</p>
                <div className="w-28 sm:w-32 h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full progress-bar-fill" style={{width: (gameState.xp / gameState.xpToNext) * 100 + '%'}} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2"><span className="text-white font-bold text-sm sm:text-base">⭐ {gameState.stars}</span></div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2"><span className="text-white font-bold text-sm sm:text-base">🏆 {gameState.score}</span></div>
            </div>
          </div>
          <div className="text-center mb-6">
            <p className="text-white font-bold mb-2 text-base sm:text-lg">Сложность:</p>
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
              {['easy','medium','hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={'px-3 sm:px-5 py-2 rounded-full font-bold transition-all text-sm sm:text-base ' + (difficulty === d ? 'bg-white text-purple-600 shadow-lg scale-110' : 'bg-white/30 text-white hover:bg-white/50')}>
                  {d === 'easy' ? '🌱 Легко' : d === 'medium' ? '🌿 Средне' : '🌳 Сложно'}
                </button>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-4">Выбери задание:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button onClick={() => startGame('addition')} className="game-card bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-3xl shadow-xl text-left"><div className="text-4xl mb-2">➕</div><h3 className="text-xl font-bold text-white">Сложение</h3><p className="text-white/80 text-sm">Учимся складывать числа</p></button>
            <button onClick={() => startGame('subtraction')} className="game-card bg-gradient-to-br from-blue-400 to-indigo-500 p-6 rounded-3xl shadow-xl text-left"><div className="text-4xl mb-2">➖</div><h3 className="text-xl font-bold text-white">Вычитание</h3><p className="text-white/80 text-sm">Учимся вычитать числа</p></button>
            <button onClick={() => startGame('multiplication')} className="game-card bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-3xl shadow-xl text-left"><div className="text-4xl mb-2">✖️</div><h3 className="text-xl font-bold text-white">Умножение</h3><p className="text-white/80 text-sm">Таблица умножения</p></button>
            <button onClick={() => startGame('division')} className="game-card bg-gradient-to-br from-purple-400 to-violet-500 p-6 rounded-3xl shadow-xl text-left"><div className="text-4xl mb-2">➗</div><h3 className="text-xl font-bold text-white">Деление</h3><p className="text-white/80 text-sm">Учимся делить числа</p></button>
            <button onClick={() => startGame('mixed')} className="game-card bg-gradient-to-br from-pink-400 to-rose-500 p-6 rounded-3xl shadow-xl text-left"><div className="text-4xl mb-2">🎲</div><h3 className="text-xl font-bold text-white">Всё вместе</h3><p className="text-white/80 text-sm">Разные примеры вперемешку</p></button>
            <button onClick={() => startGame('adventure')} className="game-card bg-gradient-to-br from-yellow-400 to-amber-500 p-6 rounded-3xl shadow-xl text-left animate-pulse-glow"><div className="text-4xl mb-2">🏰</div><h3 className="text-xl font-bold text-white">Приключение!</h3><p className="text-white/80 text-sm">Задачи с волшебными историями ✨</p></button>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
            <h3 className="text-white font-bold text-lg mb-3 text-center">📊 Твои достижения</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-3xl font-bold text-white">{gameState.totalSolved}</p><p className="text-white/80 text-sm">Решено задач</p></div>
              <div><p className="text-3xl font-bold text-white">{gameState.bestStreak}</p><p className="text-white/80 text-sm">Лучшая серия 🔥</p></div>
              <div><p className="text-3xl font-bold text-white">{gameState.level}</p><p className="text-white/80 text-sm">Уровень</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const pct = Math.round((correctInRound / MAX_ROUNDS) * 100);
    const stars = correctInRound >= 9 ? 3 : correctInRound >= 7 ? 2 : correctInRound >= 5 ? 1 : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '💪' : '🌈'}</div>
          <h2 className="text-3xl font-bold text-purple-600 mb-2">{pct >= 80 ? 'Великолепно!' : pct >= 60 ? 'Отлично!' : pct >= 40 ? 'Хорошо!' : 'Продолжай стараться!'}</h2>
          <div className="flex justify-center gap-2 mb-4">{[1,2,3].map(i => <span key={i} className={'text-4xl ' + (i <= stars ? 'animate-star-spin' : 'opacity-30')}>⭐</span>)}</div>
          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-lg text-gray-700">Правильных ответов: <span className="font-bold text-purple-600">{correctInRound}</span> из <span className="font-bold">{MAX_ROUNDS}</span></p>
            <p className="text-lg text-gray-700">Точность: <span className="font-bold text-green-600">{pct}%</span></p>
            <p className="text-lg text-gray-700">Очки за раунд: <span className="font-bold text-orange-600">+{correctInRound * 10}</span></p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => startGame(gameMode)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">🔄 Играть ещё!</button>
            <button onClick={() => setScreen('menu')} className="bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-200 transition-all">🏠 В меню</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 p-3 sm:p-4 md:p-8 relative overflow-hidden">
      {showConfetti && <div className="fixed inset-0 pointer-events-none z-50">{Array.from({length:20}).map((_,i) => <div key={i} className="confetti-piece rounded-full" style={{left:Math.random()*100+'%',backgroundColor:['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd'][Math.floor(Math.random()*6)],animationDelay:Math.random()*0.5+'s',animationDuration:(2+Math.random()*2)+'s'}} />)}</div>}
      {showLevelUp && <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"><div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-3xl px-8 py-6 rounded-3xl shadow-2xl animate-bounce-in">🎉 Уровень {gameState.level}! 🎉</div></div>}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <button onClick={() => setScreen('menu')} className="bg-white/30 backdrop-blur-sm text-white font-bold px-3 sm:px-4 py-2 rounded-full hover:bg-white/50 transition-all text-sm sm:text-base">← Назад</button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/30 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1.5 sm:py-2"><span className="text-white font-bold text-xs sm:text-base">🔥 {gameState.streak}</span></div>
            <div className="bg-white/30 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1.5 sm:py-2"><span className="text-white font-bold text-xs sm:text-base">💎 {gameState.score}</span></div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-white/80 text-sm mb-1"><span>Задача {problemsInRound + 1} из {MAX_ROUNDS}</span><span>✅ {correctInRound} правильных</span></div>
          <div className="w-full h-4 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full progress-bar-fill" style={{width: (problemsInRound / MAX_ROUNDS) * 100 + '%'}} /></div>
        </div>
        <div className="text-center mb-3 sm:mb-4">
          <div className={'inline-block text-5xl sm:text-6xl ' + (isCorrect === false ? 'animate-shake' : 'animate-float')}>{getPetEmoji()}</div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 sm:px-8 py-3 sm:py-4 mt-2 inline-block shadow-xl max-w-full"><p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{getPetMessage()}</p></div>
        </div>
        {currentProblem && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-4 sm:mb-6 animate-slide-up">
            {currentProblem.story && <div className="mb-4 pb-4 border-b-2 border-purple-100"><div className="flex items-start gap-2 sm:gap-3"><span className="text-3xl sm:text-4xl flex-shrink-0 animate-float">{currentProblem.storyEmoji}</span><p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-medium">{currentProblem.story}</p></div></div>}
            <div className="text-center">
              <div className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-800 mb-2">{currentProblem.num1} {getOp(currentProblem.operator)} {currentProblem.num2}</div>
              <div className="text-xl sm:text-2xl md:text-3xl text-purple-400 font-bold">= ?</div>
            </div>
          </div>
        )}
        {currentProblem && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {currentProblem.options.map((option, index) => {
              let cls = 'bg-white hover:bg-purple-50 text-gray-800 border-2 border-purple-200';
              if (selectedAnswer !== null) {
                if (option === currentProblem.answer) cls = 'bg-green-400 text-white border-2 border-green-500 scale-110';
                else if (option === selectedAnswer && !isCorrect) cls = 'bg-red-400 text-white border-2 border-red-500 animate-shake';
                else cls = 'bg-gray-100 text-gray-400 border-2 border-gray-200';
              }
              return <button key={index} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null} className={'btn-answer ' + cls + ' font-bold text-2xl sm:text-3xl py-4 sm:py-6 rounded-2xl shadow-lg transition-all'}>{option}</button>;
            })}
          </div>
        )}
        {gameState.streak >= 3 && <div className="text-center mt-4"><span className="bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold px-4 py-2 rounded-full text-sm animate-pulse-glow">🔥 Серия {gameState.streak}! Двойные очки! 🔥</span></div>}
      </div>
    </div>
  );
}

export default App;