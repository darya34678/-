// ============ ГЛАВНАЯ МЫСЛЬ ============
const thoughts = [
  "Спорт — это не про медали, а про характер. Тот, кто не сдался, уже победил!",
  "Настоящий чемпион — это тот, кто встаёт на один раз больше, чем падает.",
  "Даже самый сильный богатырь нуждается в друге, который поверит в него.",
  "Земное притяжение тянет вниз, но дух спортсмена рвётся вверх!",
  "Победа начинается в голове. Сначала поверь — потом победи.",
  "Тренируйся так, будто никто не смотрит. Выиграй так, чтобы все запомнили.",
  "Сила не в том, чтобы никогда не падать, а в том, чтобы каждый раз вставать."
];

const thoughtEl = document.getElementById('thoughtText');
const originalThought = thoughtEl.innerText;

function randomThought() {
  const t = thoughts[Math.floor(Math.random() * thoughts.length)];
  thoughtEl.style.opacity = '0';
  setTimeout(() => {
    thoughtEl.innerText = t;
    thoughtEl.style.opacity = '1';
  }, 200);
}

function resetThought() {
  thoughtEl.innerText = originalThought;
}

// ============ ВКЛАДКИ ============
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + idx).classList.add('active');
  });
});

// ============ ВИКТОРИНА ============
const questions = [
  { q: "Кто из героев серии — бывший артист цирка?", opts: ["Копатыч", "Кар-Карыч", "Лосяш", "Бараш"], correct: 1 },
  { q: "Какой вид спорта является центральным в серии?", opts: ["Плавание", "Бег и атлетика", "Шахматы", "Балет"], correct: 1 },
  { q: "Что символизирует название серии «Земное притяжение»?", opts: ["Гравитацию на планете", "Силу воли, которая преодолевает трудности", "Падение на землю", "Погоду"], correct: 1 },
  { q: "Кто помогает Копатычу поверить в себя?", opts: ["Никто", "Кар-Карыч", "Совунья", "Ёжик"], correct: 1 },
  { q: "Какая главная тема серии?", opts: ["Деньги", "Дружба и упорство", "Путешествия", "Кулинария"], correct: 1 }
];

let currentQ = 0;

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('quizQuestion').innerText = q.q;
  const optsDiv = document.getElementById('quizOptions');
  optsDiv.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(i, btn);
    optsDiv.appendChild(btn);
  });
  document.getElementById('quizResult').innerText = '';
}

function checkAnswer(i, btn) {
  const q = questions[currentQ];
  const all = document.querySelectorAll('.quiz-opt');
  all.forEach(b => b.disabled = true);
  if (i === q.correct) {
    btn.classList.add('correct');
    document.getElementById('quizResult').innerText = '✅ Правильно! Молодец!';
  } else {
    btn.classList.add('wrong');
    all[q.correct].classList.add('correct');
    document.getElementById('quizResult').innerText = '❌ Не совсем... Правильный ответ выделен.';
  }
}

function nextQuestion() {
  currentQ = (currentQ + 1) % questions.length;
  renderQuestion();
}

renderQuestion();

// ============ ИГРА "ПОЙМАЙ МЯЧ" ============
let score = 0, timeLeft = 30, gameInterval, timeInterval, gameActive = false;

function startGame() {
  if (gameActive) return;
  gameActive = true;
  score = 0;
  timeLeft = 30;
  document.getElementById('gameScore').innerText = 0;
  document.getElementById('gameTime').innerText = 30;
  const area = document.getElementById('gameArea');
  area.innerHTML = '';
  clearInterval(gameInterval);
  clearInterval(timeInterval);

  spawnBall();
  gameInterval = setInterval(spawnBall, 700);
  timeInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('gameTime').innerText = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function spawnBall() {
  const area = document.getElementById('gameArea');
  const ball = document.createElement('div');
  ball.className = 'game-ball';
  const colors = [
    'radial-gradient(circle at 30% 30%, #ff6b35, #c0392b)',
    'radial-gradient(circle at 30% 30%, #ffd700, #ff8f00)',
    'radial-gradient(circle at 30% 30%, #e74c3c, #8e1a1a)',
    'radial-gradient(circle at 30% 30%, #9b59b6, #4a148c)',
    'radial-gradient(circle at 30% 30%, #3498db, #1e5f8c)'
  ];
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  const maxX = area.offsetWidth - 55;
  const maxY = area.offsetHeight - 55;
  ball.style.left = Math.random() * maxX + 'px';
  ball.style.top = Math.random() * maxY + 'px';
  ball.onclick = (e) => {
    e.stopPropagation();
    score++;
    document.getElementById('gameScore').innerText = score;
    ball.style.transform = 'scale(0)';
    setTimeout(() => ball.remove(), 150);
  };
  area.appendChild(ball);
  setTimeout(() => {
    if (ball.parentNode) ball.remove();
  }, 1400);
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  const area = document.getElementById('gameArea');
  let message = 'Попробуй ещё раз!';
  if (score >= 20) message = '🏆 Ты настоящий чемпион!';
  else if (score >= 12) message = '🥈 Отличный результат!';
  else if (score >= 6) message = '🥉 Неплохо!';
  area.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:1.5em;font-weight:bold;color:#2c3e50;flex-direction:column;text-align:center;padding:20px;">🎯 Игра окончена!<br>Твой счёт: <span style="color:#e74c3c;font-size:1.5em;">' + score + '</span><br><span style="font-size:0.8em;margin-top:10px;color:#555;">' + message + '</span></div>';
}

// ============ КОЛЕСО ФОРТУНЫ ============
const wheelData = {
  0: {
    category: "💪 Челлендж дня",
    texts: [
      "Сделай 20 приседаний прямо сейчас! Копатыч верит в тебя! 🌾",
      "Пробеги вокруг дома/квартиры 3 раза. Земное притяжение не помеха!",
      "Постой в планке 30 секунд. Кар-Карыч будет считать! ⏱️",
      "Сделай 15 отжиманий. Каждый раз — шаг к победе!",
      "Выпей стакан воды и сделай 10 наклонов. Здоровье — это спорт!"
    ],
    author: "— Испытание от Копатыча"
  },
  1: {
    category: "🎭 Совет Кар-Карыча",
    texts: [
      "«Кар-кар! В моём цирке я падал тысячу раз. Но аплодисменты слышал только после того, как вставал!»",
      "«Знаешь, дружок, настоящий артист — это не тот, кто не ошибается, а тот, кто превращает ошибку в трюк!»",
      "«Я видел чемпионов. Знаешь, что их отличает? Они не боятся выглядеть смешно, когда учатся!»",
      "«В моём возрасте я понял одно: жизнь — это цирк, а ты — главный артист. Так играй!»",
      "«Кар! Помни: даже ворона может летать высоко, если перестанет сравнивать себя с орлом.»"
    ],
    author: "— Кар-Карыч, бывший артист цирка"
  },
  2: {
    category: "🌾 Совет Копатыча",
    texts: [
      "«Эх, дружок! Я на огороде каждый день грядки копаю. И знаешь — ни одна грядка не выкопала себя сама!»",
      "«Сила не в том, чтобы сразу всё получалось. Сила — это когда встаёшь и идёшь копать дальше!»",
      "«Медведь я или нет, а без разминки ни за что не берусь. Береги спину, она у тебя одна!»",
      "«Знаешь, почему я люблю спорт? Потому что после него картошка сама себя не выкопает — зато с силами!»",
      "«Не торопись. Я морковку тоже не за день выращиваю. Терпение — вот настоящий спорт!»"
    ],
    author: "— Копатыч, медведь-огородник"
  },
  3: {
    category: "🏆 Спортивный факт",
    texts: [
      "Сердце спортсмена за день перекачивает около 7000 литров крови! ❤️",
      "Улыбка во время тренировки снижает восприятие боли на 10%! 😊",
      "Мозг спортсмена принимает решение за 0.2 секунды — быстрее моргания! 🧠",
      "После тренировки мозг вырабатывает столько же эндорфинов, сколько при влюблённости! 💕",
      "Даже 10 минут ходьбы в день снижают риск болезней на 20%! 🚶"
    ],
    author: "— Из спортивной энциклопедии"
  },
  4: {
    category: "😂 Спортивная шутка",
    texts: [
      "Копатыч решил заняться бегом. Через неделю он пробежал... до холодильника. И это уже победа! 🏃‍♂️🍕",
      "Кар-Карыч: «Я в цирке летал!» Копатыч: «А я на грядках летаю — от комаров!» 😂",
      "Почему Копатыч не играет в теннис? Потому что мяч всегда улетает в его огород! 🎾🥕",
      "Кар-Карыч делает зарядку. Соседи думают, что он опять цирк устраивает! 🤸‍♂️",
      "Копатыч: «Я сегодня 100 раз отжался!» Кар-Карыч: «От чего?» Копатыч: «От дивана...» 😅"
    ],
    author: "— Из дневника Смешариков"
  },
  5: {
    category: "🎯 Мини-задание",
    texts: [
      "Закрой глаза и сделай 5 глубоких вдохов. Почувствуй, как тело наполняется силой! 🌬️",
      "Найди в комнате 3 предмета синего цвета и дотронься до каждого. Тренировка внимания! 👀",
      "Сделай «крабью походку» 10 шагов вперёд и 10 назад. Весело и полезно! 🦀",
      "Постой на одной ноге 20 секунд. Потом на другой. Кар-Карыч так в цирке стоял!",
      "Изобрази чемпиона, который только что выиграл. Почувствуй эту победу! 🏆"
    ],
    author: "— Тренировочное задание"
  },
  6: {
    category: "⭐ Мотивация",
    texts: [
      "Ты сильнее, чем думаешь. Быстрее, чем веришь. И ближе к цели, чем кажется! ⭐",
      "Каждый великий спортсмен когда-то был новичком. Твой путь только начинается! 🌟",
      "Не сравнивай себя с другими. Сравнивай себя с собой вчерашним. И ты увидишь прогресс! 📈",
      "Боль временна. Гордость — навсегда. Двигайся вперёд! 🔥",
      "Твоё тело может всё. Это разум нужно убедить. Убеждай! 💪"
    ],
    author: "— Мотивация дня"
  },
  7: {
    category: "🔥 Твоя суперсила",
    texts: [
      "Твоя суперсила сегодня — УПОРСТВО. Как Копатыч, копай свою цель каждый день! 🌾",
      "Твоя суперсила сегодня — МУДРОСТЬ. Как Кар-Карыч, думай прежде чем действовать! 🎭",
      "Твоя суперсила сегодня — ЭНЕРГИЯ. Заряжай всех вокруг своим настроением! ⚡",
      "Твоя суперсила сегодня — ВНИМАНИЕ. Замечай детали, которые другие пропускают! 👁️",
      "Твоя суперсила сегодня — ДОБРОТА. Помоги кому-нибудь — и станешь сильнее! ❤️"
    ],
    author: "— Раскрытие потенциала"
  }
};

let currentRotation = 0;
let isSpinning = false;

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  const wheel = document.getElementById('wheel');
  const btn = document.getElementById('spinBtn');
  const resultDiv = document.getElementById('wheelResult');

  btn.disabled = true;
  btn.innerText = '🌀 КРУТИТСЯ...';

  const segment = Math.floor(Math.random() * 8);
  const segmentAngle = 45;
  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const targetAngle = extraSpins * 360 + (360 - segment * segmentAngle - segmentAngle / 2);

  currentRotation += targetAngle;
  wheel.style.transform = 'rotate(' + currentRotation + 'deg)';

  setTimeout(() => {
    const data = wheelData[segment];
    const text = data.texts[Math.floor(Math.random() * data.texts.length)];

    resultDiv.innerHTML = '<div class="result-card"><div class="result-category">' + data.category + '</div><div class="result-text">' + text + '</div><div class="result-author">' + data.author + '</div></div>';

    createConfetti();

    btn.disabled = false;
    btn.innerText = '🎰 КРУТИТЬ ЕЩЁ РАЗ';
    isSpinning = false;
  }, 4100);
}

function createConfetti() {
  const colors = ['#9b59b6', '#ffd700', '#e74c3c', '#3498db', '#2ecc71', '#ff6b35', '#e056fd'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      confetti.style.width = (5 + Math.random() * 10) + 'px';
      confetti.style.height = (5 + Math.random() * 10) + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
}
// ============ ИНТЕРАКТИВНЫЕ СЦЕНЫ ============
const scenes = [
  {
    title: "🏃 Копатыч на разминке",
    desc: "Каждое утро Копатыч начинает с зарядки. Даже медведи знают: движение — это жизнь! Сегодня он делает 100 приседаний перед огородом.",
    render: function() {
      return '<div class="scene-exercise"><svg class="exercise-bear" viewBox="0 0 100 100"><circle cx="50" cy="60" r="35" fill="#8B4513"/><circle cx="30" cy="35" r="12" fill="#8B4513"/><circle cx="70" cy="35" r="12" fill="#8B4513"/><circle cx="30" cy="35" r="6" fill="#D2B48C"/><circle cx="70" cy="35" r="6" fill="#D2B48C"/><circle cx="40" cy="55" r="4" fill="#000"/><circle cx="60" cy="55" r="4" fill="#000"/><ellipse cx="50" cy="70" rx="12" ry="8" fill="#D2B48C"/><circle cx="50" cy="68" r="3" fill="#000"/></svg><div class="exercise-sweat">💧</div></div><div class="exercise-counter">Повтор: <span id="repCount">0</span></div><div class="exercise-motivation">💪 Давай, Копатыч!</div>';
    }
  },
  {
    title: "🎙️ Кар-Карыч комментирует",
    desc: "Кар-Карыч — главный спортивный комментатор долины. Его фразы запоминаются надолго: «Кар-кар! Это было великолепно!»",
    render: function() {
      return '<div class="commentator-stage"><div class="microphone">🎤</div><div class="sound-waves">📢</div><svg class="commentator-bird" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="70" r="45" fill="#4A148C"/><polygon points="100,65 120,70 100,75" fill="#FF8F00"/><circle cx="45" cy="55" r="8" fill="#fff"/><circle cx="45" cy="55" r="4" fill="#000"/><path d="M 30 40 Q 20 25 40 20" stroke="#4A148C" stroke-width="5" fill="none"/><path d="M 45 35 Q 40 20 55 18" stroke="#4A148C" stroke-width="5" fill="none"/></svg><div class="speech-bubble" id="speechBubble">Кар-кар! Какой матч!</div></div>';
    }
  },
  {
    title: "⚡ Решающий момент",
    desc: "Финальная секунда! Оба героя напряжены до предела. Мяч в воздухе... Кто победит? Этот момент запомнится надолго!",
    render: function() {
      return '<div class="final-stage"><div class="final-timer" id="finalTimer">00:03</div><div class="final-energy">⚡</div><div class="final-players"><div class="final-player kopatyh"></div><div class="final-player karkarych"></div></div><div class="final-ball"></div></div>';
    }
  },
  {
    title: "🏆 Заслуженная награда",
    desc: "Победа! После всех тренировок и усилий Копатыч получает золотую медаль. Кар-Карыч аплодирует стоя. Это настоящий триумф!",
    render: function() {
      return '<div class="victory-stage" id="victoryStage"><div class="victory-medal">🏅</div><div class="victory-text">ПОБЕДА!</div></div>';
    }
  }
];

let currentScene = null;
let sceneIntervals = [];

function openScene(index) {
  currentScene = index;
  const modal = document.getElementById('sceneModal');
  const stage = document.getElementById('sceneStage');
  const title = document.getElementById('sceneTitle');
  const desc = document.getElementById('sceneDesc');
  
  modal.classList.add('active');
  title.innerText = scenes[index].title;
  desc.innerText = scenes[index].desc;
  stage.innerHTML = scenes[index].render();
  
  if (index === 0) startExerciseScene();
  else if (index === 1) startCommentatorScene();
  else if (index === 2) startFinalScene();
  else if (index === 3) startVictoryScene();
}

function closeScene() {
  const modal = document.getElementById('sceneModal');
  modal.classList.remove('active');
  sceneIntervals.forEach(clearInterval);
  sceneIntervals = [];
  currentScene = null;
}

function startExerciseScene() {
  let reps = 0;
  const counter = document.getElementById('repCount');
  const interval = setInterval(function() {
    reps++;
    if (counter) counter.innerText = reps;
    if (reps >= 100) {
      clearInterval(interval);
      if (counter) counter.innerText = '100 ✅';
    }
  }, 100);
  sceneIntervals.push(interval);
}

function startCommentatorScene() {
  const phrases = [
    "Кар-кар! Какой матч!",
    "Невероятный бросок!",
    "Копатыч, давай!",
    "Это было великолепно!",
    "Кар! Чемпионский дух!",
    "Вот это сила!",
    "Браво, браво!"
  ];
  let phraseIndex = 0;
  const bubble = document.getElementById('speechBubble');
  const interval = setInterval(function() {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    if (bubble) {
      bubble.style.animation = 'none';
      setTimeout(function() {
        bubble.innerText = phrases[phraseIndex];
        bubble.style.animation = 'speechAppear 0.5s, speechFloat 3s infinite';
      }, 10);
    }
  }, 2500);
  sceneIntervals.push(interval);
}

function startFinalScene() {
  let timeLeft = 3;
  const timer = document.getElementById('finalTimer');
  const interval = setInterval(function() {
    timeLeft--;
    if (timer) {
      if (timeLeft > 0) {
        timer.innerText = '00:0' + timeLeft;
      } else {
        timer.innerText = 'ФИНИШ!';
        timer.style.color = '#2ecc71';
        clearInterval(interval);
      }
    }
  }, 1000);
  sceneIntervals.push(interval);
}

function startVictoryScene() {
  const stage = document.getElementById('victoryStage');
  const colors = ['#FFD700', '#FF6B35', '#E74C3C', '#9B59B6', '#3498DB', '#2ECC71'];
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'victory-confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
    confetti.style.width = (5 + Math.random() * 10) + 'px';
    confetti.style.height = (5 + Math.random() * 10) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    stage.appendChild(confetti);
  }
  
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('div');
    star.className = 'victory-stars';
    star.innerText = '⭐';
    star.style.left = Math.random() * 90 + 5 + '%';
    star.style.top = Math.random() * 90 + 5 + '%';
    star.style.animationDelay = Math.random() * 1.5 + 's';
    stage.appendChild(star);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && currentScene !== null) {
    closeScene();
  }
});