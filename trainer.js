// ==========================================
// ИНТЕРАКТИВНЫЙ ТРЕНАЖЁР ПО ООП В JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initModule1();
  initModule2();
  initModule3();
  initModule4();
  initModule5();
});

// ------------------------------------------
// Логирование в UI-консоли
// ------------------------------------------
function log(containerId, message, type = "info") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;

  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<span class="log-time">[${time}]</span> <span>${message}</span>`;

  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

function clearLog(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}

// ------------------------------------------
// Табы
// ------------------------------------------
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const activePane = document.getElementById(target);
      if (activePane) activePane.classList.add("active");
    });
  });
}

// ==========================================
// МОДУЛЬ 1: Конструктор и this
// ==========================================
class DemoHero {
  constructor(name, role, weapon) {
    this.name = name;
    this.role = role;
    this.weapon = weapon;
    this.hp = 100;
    this.energy = 50;
  }

  attack() {
    if (this.energy < 15) {
      return { success: false, msg: `У ${this.name} не хватает энергии (нужно 15, есть ${this.energy})! Нужно поспать.` };
    }
    this.energy -= 15;
    const dmg = Math.floor(Math.random() * 20) + 15;
    return { success: true, msg: `${this.name} наносит удар предметом "${this.weapon}"! Нанесено ${dmg} урона. (Осталось энергии: ${this.energy})` };
  }

  rest() {
    this.energy = Math.min(100, this.energy + 30);
    this.hp = Math.min(100, this.hp + 10);
    return { success: true, msg: `${this.name} отдохнул у костра. HP: ${this.hp}, Энергия: ${this.energy}` };
  }

  takeDamage(dmg) {
    this.hp = Math.max(0, this.hp - dmg);
    return { success: true, msg: `${this.name} получил ${dmg} урона! Текущее HP: ${this.hp}` };
  }
}

let currentHero = null;

function initModule1() {
  const nameInput = document.getElementById("m1-name");
  const roleInput = document.getElementById("m1-role");
  const weaponInput = document.getElementById("m1-weapon");
  const codePreview = document.getElementById("m1-code-preview");
  const createBtn = document.getElementById("m1-create-btn");
  const cardContainer = document.getElementById("m1-card-container");

  function updateCodePreview() {
    const n = nameInput.value || "Герой";
    const r = roleInput.value;
    const w = weaponInput.value || "Кулаки";
    codePreview.innerHTML = `
<span class="highlight-kw">class</span> <span class="highlight-fn">Hero</span> {
  <span class="highlight-fn">constructor</span>(name, role, weapon) {
    <span class="highlight-kw">this</span>.name = name;
    <span class="highlight-kw">this</span>.role = role;
    <span class="highlight-kw">this</span>.weapon = weapon;
    <span class="highlight-kw">this</span>.hp = <span class="highlight-num">100</span>;
    <span class="highlight-kw">this</span>.energy = <span class="highlight-num">50</span>;
  }
}

<span class="highlight-comment">// Создаём объект с помощью оператора new:</span>
<span class="highlight-kw">const</span> myHero = <span class="highlight-kw">new</span> <span class="highlight-fn">Hero</span>(<span class="highlight-str">"${n}"</span>, <span class="highlight-str">"${r}"</span>, <span class="highlight-str">"${w}"</span>);
`;
  }

  [nameInput, roleInput, weaponInput].forEach(inp => {
    inp.addEventListener("input", updateCodePreview);
    inp.addEventListener("change", updateCodePreview);
  });
  updateCodePreview();

  createBtn.addEventListener("click", () => {
    const name = nameInput.value.trim() || "Артас";
    const role = roleInput.value;
    const weapon = weaponInput.value.trim() || "Фростморн";

    currentHero = new DemoHero(name, role, weapon);
    log("m1-log", `✨ Экземпляр создан! new Hero("${name}", "${role}", "${weapon}")`, "success");
    renderHeroCard();
  });

  function renderHeroCard() {
    if (!currentHero) return;

    cardContainer.innerHTML = `
      <div class="instance-card">
        <div class="instance-title">
          <span>${currentHero.name} <small style="color: var(--text-muted); font-size: 0.8rem">(${currentHero.role})</small></span>
          <span class="badge badge-blue">Оружие: ${currentHero.weapon}</span>
        </div>

        <div class="stat-bar-container">
          <div class="stat-bar-label"><span>Здоровье (this.hp)</span> <span>${currentHero.hp}/100</span></div>
          <div class="stat-bar"><div class="stat-fill stat-hp" style="width: ${currentHero.hp}%"></div></div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-bar-label"><span>Энергия (this.energy)</span> <span>${currentHero.energy}/100</span></div>
          <div class="stat-bar"><div class="stat-fill stat-energy" style="width: ${currentHero.energy}%"></div></div>
        </div>

        <div class="btn-group" style="margin-top: 1rem">
          <button class="btn" id="m1-act-attack">⚔️ this.attack()</button>
          <button class="btn btn-secondary" id="m1-act-rest">⛺ this.rest()</button>
          <button class="btn btn-danger" id="m1-act-dmg">💥 Получить урон (-20 HP)</button>
        </div>
      </div>
    `;

    document.getElementById("m1-act-attack").onclick = () => {
      const res = currentHero.attack();
      log("m1-log", res.msg, res.success ? "info" : "warn");
      renderHeroCard();
    };

    document.getElementById("m1-act-rest").onclick = () => {
      const res = currentHero.rest();
      log("m1-log", res.msg, "success");
      renderHeroCard();
    };

    document.getElementById("m1-act-dmg").onclick = () => {
      const res = currentHero.takeDamage(20);
      log("m1-log", res.msg, "error");
      renderHeroCard();
    };
  }
}

// ==========================================
// МОДУЛЬ 2: Инкапсуляция и get / set
// ==========================================
class InsecureAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance; // Открытое свойство!
  }
  deposit(amt) { this.balance += amt; }
  withdraw(amt) { this.balance -= amt; }
}

class SecureAccount {
  #balance = 0; // Приватное поле

  constructor(owner, initialBalance) {
    this.owner = owner;
    if (initialBalance > 0) this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  set balance(value) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Баланс может быть только числом!");
    }
    if (value < 0) {
      throw new Error("Отказ! Баланс не может стать отрицательным!");
    }
    if (value > 1000000) {
      throw new Error("Отказ! Подозрение в отмывании денег (лимит 1 000 000 ₽)!");
    }
    this.#balance = value;
  }

  deposit(amt) {
    if (amt <= 0) throw new Error("Сумма пополнения должна быть > 0");
    this.balance = this.#balance + amt; // использует сеттер
  }

  withdraw(amt) {
    if (amt <= 0) throw new Error("Сумма снятия должна быть > 0");
    if (amt > this.#balance) throw new Error("Недостаточно средств на счете!");
    this.balance = this.#balance - amt; // использует сеттер
  }
}

function initModule2() {
  let isSecureMode = false;
  let insecureAcc = new InsecureAccount("Иван", 5000);
  let secureAcc = new SecureAccount("Иван (Защищён)", 5000);

  const modeToggle = document.getElementById("m2-mode-toggle");
  const balanceDisplay = document.getElementById("m2-balance-display");
  const statusBadge = document.getElementById("m2-status-badge");
  const codeBox = document.getElementById("m2-code-box");

  function updateM2UI() {
    if (isSecureMode) {
      statusBadge.textContent = "🛡️ РЕЖИМ С ИНКАПСУЛЯЦИЕЙ (#balance, get, set)";
      statusBadge.className = "badge badge-green";
      balanceDisplay.textContent = `${secureAcc.balance} ₽`;
      codeBox.innerHTML = `
<span class="highlight-kw">class</span> <span class="highlight-fn">SecureAccount</span> {
  <span class="highlight-num">#balance</span> = <span class="highlight-num">0</span>; <span class="highlight-comment">// 🔒 Приватное поле с #</span>

  <span class="highlight-kw">get</span> <span class="highlight-fn">balance</span>() { <span class="highlight-kw">return</span> <span class="highlight-kw">this</span>.<span class="highlight-num">#balance</span>; }

  <span class="highlight-kw">set</span> <span class="highlight-fn">balance</span>(val) {
    <span class="highlight-kw">if</span> (val &lt; <span class="highlight-num">0</span>) <span class="highlight-kw">throw</span> <span class="highlight-kw">new</span> Error(<span class="highlight-str">"Отрицательный баланс запрещен!"</span>);
    <span class="highlight-kw">this</span>.<span class="highlight-num">#balance</span> = val;
  }
}`;
    } else {
      statusBadge.textContent = "⚠️ РЕЖИМ БЕЗ ИНКАПСУЛЯЦИИ (открытый .balance)";
      statusBadge.className = "badge badge-amber";
      balanceDisplay.textContent = `${insecureAcc.balance} ₽`;
      codeBox.innerHTML = `
<span class="highlight-kw">class</span> <span class="highlight-fn">InsecureAccount</span> {
  <span class="highlight-fn">constructor</span>(owner, balance) {
    <span class="highlight-kw">this</span>.owner = owner;
    <span class="highlight-kw">this</span>.balance = balance; <span class="highlight-comment">// ❌ Открыто! Любой может перезаписать</span>
  }
}`;
    }
  }

  modeToggle.addEventListener("change", () => {
    isSecureMode = modeToggle.checked;
    log("m2-log", `Режим переключен: ${isSecureMode ? "Инкапсуляция включена" : "Без инкапсуляции"}`, "info");
    updateM2UI();
  });

  updateM2UI();

  // Кнопки
  document.getElementById("m2-btn-deposit").onclick = () => {
    try {
      if (isSecureMode) secureAcc.deposit(1000);
      else insecureAcc.deposit(1000);
      log("m2-log", "Пополнено +1000 ₽ через .deposit()", "success");
    } catch (e) {
      log("m2-log", e.message, "error");
    }
    updateM2UI();
  };

  document.getElementById("m2-btn-withdraw").onclick = () => {
    try {
      if (isSecureMode) secureAcc.withdraw(500);
      else insecureAcc.withdraw(500);
      log("m2-log", "Снято -500 ₽ через .withdraw()", "info");
    } catch (e) {
      log("m2-log", e.message, "error");
    }
    updateM2UI();
  };

  // Попытка взлома 1: Отрицательный баланс
  document.getElementById("m2-hack-negative").onclick = () => {
    if (!isSecureMode) {
      insecureAcc.balance = -999999;
      log("m2-log", "🚨 ВЗЛОМ УДАЛСЯ! account.balance = -999999 ₽. Данные испорчены!", "error");
    } else {
      try {
        secureAcc.balance = -999999;
      } catch (e) {
        log("m2-log", `🛡️ АТАКА ОТБИТА сеттером: "${e.message}"`, "success");
      }
    }
    updateM2UI();
  };

  // Попытка взлома 2: Приватное поле напрямую
  document.getElementById("m2-hack-private").onclick = () => {
    if (!isSecureMode) {
      insecureAcc.balance = "Украдено всё!";
      log("m2-log", "🚨 В баланс записана строка! Теперь там каша.", "error");
    } else {
      log("m2-log", "🛡️ Попытка выполнить: secureAcc.#balance = 0", "warn");
      log("m2-log", "❌ SyntaxError: Private field '#balance' must be declared in an enclosing class! JS не позволяет трогать поле снаружи!", "success");
    }
    updateM2UI();
  };

  // Сброс
  document.getElementById("m2-reset-btn").onclick = () => {
    insecureAcc = new InsecureAccount("Иван", 5000);
    secureAcc = new SecureAccount("Иван (Защищён)", 5000);
    clearLog("m2-log");
    log("m2-log", "Счета сброшены до начальных 5000 ₽", "info");
    updateM2UI();
  };
}

// ==========================================
// МОДУЛЬ 3: Наследование (extends & super)
// ==========================================
class BaseHero {
  constructor(name, hp) {
    this.name = name;
    this.hp = hp;
  }
  shout() {
    return `${this.name} кричит: "За гильдию!" 📣`;
  }
}

class WarriorChild extends BaseHero {
  constructor(name, hp, shield) {
    super(name, hp); // Вызов родительского конструктора
    this.shield = shield;
  }
  shieldBash() {
    return `🛡️ ${this.name} наносит удар щитом прочностью ${this.shield}! Враг оглушён.`;
  }
}

class MageChild extends BaseHero {
  constructor(name, hp, mana) {
    super(name, hp);
    this.mana = mana;
  }
  fireball() {
    if (this.mana < 25) return `❌ У ${this.name} не хватает маны на Фаербол!`;
    this.mana -= 25;
    return `🔥 ${this.name} кастует огромный Фаербол! Маны осталось: ${this.mana}`;
  }
}

function initModule3() {
  const warrior = new WarriorChild("Конан", 250, 80);
  const mage = new MageChild("Гендальф", 120, 100);

  document.getElementById("m3-w-shout").onclick = () => {
    log("m3-log", warrior.shout() + " (Метод унаследован от BaseHero!)", "info");
  };

  document.getElementById("m3-w-bash").onclick = () => {
    log("m3-log", warrior.shieldBash() + " (Собственный метод WarriorChild)", "success");
  };

  document.getElementById("m3-m-shout").onclick = () => {
    log("m3-log", mage.shout() + " (Тот же родительский метод BaseHero!)", "info");
  };

  document.getElementById("m3-m-fire").onclick = () => {
    log("m3-log", mage.fireball() + " (Собственный метод MageChild)", "warn");
  };
}

// ==========================================
// МОДУЛЬ 4: Арена Полиморфизма
// ==========================================
class PolyUnit {
  constructor(name, role, icon) {
    this.name = name;
    this.role = role;
    this.icon = icon;
  }
  // Базовый метод, который каждый переопределит
  takeTurn(boss) {
    return { dmg: 10, msg: `${this.name} делает базовое действие.` };
  }
}

class PolyKnight extends PolyUnit {
  constructor(name) { super(name, "Рыцарь", "🛡️"); }
  takeTurn(boss) {
    const dmg = 45;
    boss.hp = Math.max(0, boss.hp - dmg);
    return { dmg, msg: `⚔️ ${this.name} рубит мечом в уязвимое место! (-${dmg} HP)` };
  }
}

class PolyMage extends PolyUnit {
  constructor(name) { super(name, "Маг", "🔮"); }
  takeTurn(boss) {
    const dmg = 70;
    boss.hp = Math.max(0, boss.hp - dmg);
    return { dmg, msg: `⚡ ${this.name} вызывает цепную молнию с небес! (-${dmg} HP)` };
  }
}

class PolyPriest extends PolyUnit {
  constructor(name) { super(name, "Жрец", "✨"); }
  takeTurn(boss) {
    const dmg = 20;
    boss.hp = Math.max(0, boss.hp - dmg);
    return { dmg, msg: `🕊️ ${this.name} накладывает священную кару (-${dmg} HP) и исцеляет боевой дух отряда!` };
  }
}

class PolyRogue extends PolyUnit {
  constructor(name) { super(name, "Разбойник", "🗡️"); }
  takeTurn(boss) {
    const dmg = 55;
    boss.hp = Math.max(0, boss.hp - dmg);
    return { dmg, msg: `🎯 ${this.name} атакует из невидимости двумя кинжалами! (-${dmg} HP)` };
  }
}

function initModule4() {
  const boss = {
    name: "Древний Красный Дракон",
    hp: 400,
    maxHp: 400
  };

  let squad = [
    new PolyKnight("Сэр Ланселот"),
    new PolyMage("Мерлин"),
    new PolyPriest("Отец Григорий"),
    new PolyRogue("Тень")
  ];

  const squadListEl = document.getElementById("m4-squad-list");
  const bossHpEl = document.getElementById("m4-boss-hp");
  const bossBarEl = document.getElementById("m4-boss-bar");
  const bossCardEl = document.getElementById("m4-boss-card");

  function renderSquad() {
    squadListEl.innerHTML = "";
    squad.forEach((unit, idx) => {
      const card = document.createElement("div");
      card.className = "combatant";
      card.style.width = "180px";
      card.innerHTML = `
        <div class="combatant-avatar">${unit.icon}</div>
        <div style="font-weight: bold">${unit.name}</div>
        <div style="font-size: 0.8rem; color: var(--accent)">${unit.role}</div>
        <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.2rem 0.5rem; margin-top: 0.5rem;" onclick="removeSquadMember(${idx})">Удалить</button>
      `;
      squadListEl.appendChild(card);
    });
  }

  window.removeSquadMember = (idx) => {
    squad.splice(idx, 1);
    renderSquad();
  };

  window.addSquadMember = (type) => {
    if (squad.length >= 6) {
      alert("Максимум 6 героев в отряде!");
      return;
    }
    const names = ["Алекс", "Эйвор", "Джайна", "Робин", "Тирион", "Валли"];
    const randomName = names[Math.floor(Math.random() * names.length)] + " " + (squad.length + 1);

    if (type === "knight") squad.push(new PolyKnight(randomName));
    if (type === "mage") squad.push(new PolyMage(randomName));
    if (type === "priest") squad.push(new PolyPriest(randomName));
    if (type === "rogue") squad.push(new PolyRogue(randomName));

    renderSquad();
  };

  function updateBossUI() {
    bossHpEl.textContent = `${boss.hp} / ${boss.maxHp}`;
    const pct = Math.max(0, (boss.hp / boss.maxHp) * 100);
    bossBarEl.style.width = `${pct}%`;
  }

  renderSquad();
  updateBossUI();

  // Полиморфная атака
  document.getElementById("m4-turn-btn").onclick = () => {
    if (boss.hp <= 0) {
      log("m4-log", "🎉 Дракон уже повержен! Нажмите 'Возродить Дракона' для нового раунда.", "success");
      return;
    }
    if (squad.length === 0) {
      log("m4-log", "Отряд пуст! Добавьте бойцов кнопками ниже.", "warn");
      return;
    }

    log("m4-log", "--- НАЧАЛО ХОДА: for (let unit of squad) { unit.takeTurn(boss) } ---", "info");

    bossCardEl.classList.add("damaged");
    setTimeout(() => bossCardEl.classList.remove("damaged"), 300);

    // ПОЛИМОРФИЗМ В ДЕЙСТВИИ:
    squad.forEach(unit => {
      if (boss.hp <= 0) return;
      const res = unit.takeTurn(boss);
      log("m4-log", res.msg, "warn");
    });

    updateBossUI();

    if (boss.hp <= 0) {
      log("m4-log", "🏆 ПОБЕДА! Древний дракон рухнул на землю под полиморфным натиском отряда!", "success");
    }
  };

  document.getElementById("m4-reset-boss").onclick = () => {
    boss.hp = boss.maxHp;
    updateBossUI();
    clearLog("m4-log");
    log("m4-log", "Дракон возродился с 400 HP!", "info");
  };
}

// ==========================================
// МОДУЛЬ 5: Интерактивный Код-Тренажёр
// ==========================================
const codeTasks = [
  {
    id: 1,
    title: "1. Класс Cat с конструктором и методом",
    desc: "Создайте класс <code>Cat</code>. Конструктор должен принимать <code>name</code> и записывать в <code>this.name</code>, а также задавать <code>this.hungry = true</code>. Добавьте метод <code>feed()</code>, который делает <code>this.hungry = false</code> и возвращает строку <code>this.name + ' поел!'</code>.",
    initialCode: `class Cat {
  // Напишите конструктор и метод feed:
  
}`,
    test: (code) => {
      const fn = new Function(`${code}; return Cat;`);
      const CatClass = fn();
      const murzik = new CatClass("Мурзик");
      if (murzik.name !== "Мурзик") throw new Error("this.name не равен переданному имени!");
      if (murzik.hungry !== true) throw new Error("Поле this.hungry изначально должно быть true!");
      const feedRes = murzik.feed();
      if (murzik.hungry !== false) throw new Error("После вызова .feed() свойство hungry должно стать false!");
      if (!feedRes || !feedRes.includes("Мурзик")) throw new Error("Метод feed() должен возвращать строку с именем кота!");
      return "Класс Cat работает идеально! Мурзик накормлен.";
    }
  },
  {
    id: 2,
    title: "2. Приватное поле #pin и геттер",
    desc: "Создайте класс <code>SafeBox</code>. Конструктор принимает <code>pinCode</code> и сохраняет его в <b>приватное поле</b> <code>#pin</code>. Добавьте метод <code>checkPin(code)</code>, который возвращает <code>true</code> при совпадении и <code>false</code> иначе.",
    initialCode: `class SafeBox {
  // Объявите приватное поле #pin:
  
  constructor(pinCode) {
    
  }

  checkPin(code) {
    
  }
}`,
    test: (code) => {
      if (!code.includes("#pin")) throw new Error("В коде должно использоваться приватное поле #pin с решёткой!");
      const fn = new Function(`${code}; return SafeBox;`);
      const SafeClass = fn();
      const safe = new SafeClass("1234");
      if (safe.pin !== undefined) throw new Error("Поле pin не должно быть открытым публичным свойством!");
      if (!safe.checkPin("1234")) throw new Error("checkPin('1234') должен вернуть true!");
      if (safe.checkPin("0000")) throw new Error("checkPin с неверным кодом должен вернуть false!");
      return "Сейф надёжно защищён приватным полем #pin!";
    }
  },
  {
    id: 3,
    title: "3. Наследование с extends и super()",
    desc: "Дан базовый класс <code>Animal</code>. Создайте дочерний класс <code>Dog extends Animal</code>. В конструктор передаются <code>name</code> и <code>breed</code> (порода). Обязательно вызовите <code>super(name)</code> и запишите <code>this.breed = breed</code>. Добавьте метод <code>bark()</code>, возвращающий строку <code>'Гав!'</code>.",
    initialCode: `class Animal {
  constructor(name) {
    this.name = name;
  }
}

// Напишите класс Dog extends Animal:
class Dog extends Animal {

}`,
    test: (code) => {
      if (!code.includes("super")) throw new Error("В конструкторе класса Dog обязательно должен быть вызов super(...)!");
      const fn = new Function(`${code}; return Dog;`);
      const DogClass = fn();
      const bobby = new DogClass("Бобик", "Хаски");
      if (bobby.name !== "Бобик") throw new Error("Имя не передалось в родительский класс Animal через super!");
      if (bobby.breed !== "Хаски") throw new Error("Свойство this.breed не установлено!");
      if (bobby.bark() !== "Гав!") throw new Error("Метод bark() должен возвращать 'Гав!'");
      return "Наследование Dog extends Animal настроено без ошибок!";
    }
  },
  {
    id: 4,
    title: "4. Сеттер с защитой диапазона",
    desc: "Создайте класс <code>VolumeControl</code> с приватным полем <code>#level = 50</code>. Реализуйте геттер <code>get level()</code> и сеттер <code>set level(val)</code>. Если передано число < 0, устанавливайте 0; если > 100, устанавливайте 100.",
    initialCode: `class VolumeControl {
  #level = 50;

  get level() {
    return this.#level;
  }

  set level(val) {
    // Ваша валидация:
    
  }
}`,
    test: (code) => {
      const fn = new Function(`${code}; return VolumeControl;`);
      const VC = fn();
      const vol = new VC();
      if (vol.level !== 50) throw new Error("Начальная громкость должна быть 50!");
      vol.level = 75;
      if (vol.level !== 75) throw new Error("Установка нормального значения (75) не сработала!");
      vol.level = -20;
      if (vol.level !== 0) throw new Error("Отрицательное значение должно ограничиваться нулем!");
      vol.level = 999;
      if (vol.level !== 100) throw new Error("Значение больше 100 должно ограничиваться числом 100!");
      return "Геттер и сеттер работают безупречно! Уши пользователя спасены.";
    }
  },
  {
    id: 5,
    title: "5. Полиморфизм: переопределение метода",
    desc: "Создайте класс <code>Warrior</code> с методом <code>attack()</code> (возвращает <code>'Удар мечом'</code>) и класс <code>Wizard</code> с методом <code>attack()</code> (возвращает <code>'Магический шар'</code>).",
    initialCode: `class Warrior {
  attack() {
    return "Удар мечом";
  }
}

class Wizard {
  // Напишите метод attack:
  
}`,
    test: (code) => {
      const fn = new Function(`${code}; return { Warrior, Wizard };`);
      const { Warrior, Wizard } = fn();
      const w1 = new Warrior();
      const w2 = new Wizard();
      if (typeof w1.attack !== "function" || typeof w2.attack !== "function") {
        throw new Error("У обоих классов должен быть метод attack!");
      }
      if (w1.attack() !== "Удар мечом") throw new Error("Воин должен возвращать 'Удар мечом'!");
      if (w2.attack() !== "Магический шар") throw new Error("Маг должен возвращать 'Магический шар'!");
      return "Полиморфизм работает! Оба класса отвечают на attack() по-своему.";
    }
  }
];

function initModule5() {
  let currentTaskIdx = 0;
  const solvedTasks = new Set();

  const taskSelector = document.getElementById("m5-task-selector");
  const taskTitle = document.getElementById("m5-task-title");
  const taskDesc = document.getElementById("m5-task-desc");
  const codeEditor = document.getElementById("m5-editor");
  const runBtn = document.getElementById("m5-run-btn");
  const resultBox = document.getElementById("m5-result-box");
  const progressText = document.getElementById("header-progress-text");

  function renderTaskButtons() {
    taskSelector.innerHTML = "";
    codeTasks.forEach((task, idx) => {
      const btn = document.createElement("button");
      btn.className = `task-btn ${idx === currentTaskIdx ? "active" : ""} ${solvedTasks.has(task.id) ? "solved" : ""}`;
      btn.textContent = `Задача ${task.id}`;
      btn.onclick = () => {
        currentTaskIdx = idx;
        loadTask(idx);
        renderTaskButtons();
      };
      taskSelector.appendChild(btn);
    });

    // Обновляем общий прогресс
    const pct = Math.round((solvedTasks.size / codeTasks.length) * 100);
    if (progressText) progressText.textContent = `Пройдено: ${solvedTasks.size}/${codeTasks.length} (${pct}%)`;
  }

  function loadTask(idx) {
    const task = codeTasks[idx];
    taskTitle.textContent = task.title;
    taskDesc.innerHTML = task.desc;
    codeEditor.value = task.initialCode;
    resultBox.innerHTML = '<span style="color: var(--text-muted)">Нажмите "Проверить решение" для тестирования вашего кода...</span>';
  }

  runBtn.onclick = () => {
    const task = codeTasks[currentTaskIdx];
    const userCode = codeEditor.value;

    try {
      const message = task.test(userCode);
      resultBox.innerHTML = `<span style="color: var(--success); font-weight: bold">✅ ТЕСТЫ ПРОЙДЕНЫ!</span><br>${message}`;
      solvedTasks.add(task.id);
      renderTaskButtons();
    } catch (err) {
      resultBox.innerHTML = `<span style="color: var(--danger); font-weight: bold">❌ ОШИБКА В РЕШЕНИИ:</span><br>${err.message}`;
    }
  };

  renderTaskButtons();
  loadTask(0);
}
