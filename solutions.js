/**
 * ========================================================
 * РЕШЕНИЯ ЗАДАЧ ИЗ УРОКА ПО ООП В JS
 * Для преподавателя и самопроверки учеников
 * ========================================================
 */

// --------------------------------------------------------
// БЛОК 1: Базовые классы и this
// --------------------------------------------------------

// Задача 1.1: «Тамагочи из 90-х»
class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.hunger = 50;
        this.happiness = 50;
    }

    feed() {
        this.hunger = Math.max(0, this.hunger - 20);
        this.happiness = Math.min(100, this.happiness + 5);
        console.log(`${this.name} поел вкусной пиццы! 🍕 (Голод: ${this.hunger}, Счастье: ${this.happiness})`);
    }

    play() {
        this.happiness = Math.min(100, this.happiness + 20);
        this.hunger = Math.min(100, this.hunger + 10);
        console.log(`${this.name} весело поиграл с мячиком! 🎾 (Счастье: ${this.happiness}, Голод: ${this.hunger})`);
    }

    status() {
        console.log(`--- Статус питомца ${this.name} ---`);
        console.log(`Голод: ${this.hunger}/100 | Счастье: ${this.happiness}/100`);
    }
}

// Задача 1.2: «Кофемашина для сонного программиста»
class CoffeeMachine {
    constructor(water = 200, beans = 50) {
        this.water = water;
        this.beans = beans;
    }

    makeEspresso() {
        const requiredWater = 50;
        const requiredBeans = 15;

        if (this.water < requiredWater || this.beans < requiredBeans) {
            console.log("⚠️ Не хватает ресурсов для эспрессо! Долейте воды или засыпьте зёрен.");
            return;
        }

        this.water -= requiredWater;
        this.beans -= requiredBeans;
        console.log("☕ Ваш бодрящий эспрессо готов! (Осталось воды: " + this.water + "мл, зёрен: " + this.beans + "г)");
    }

    addWater(amount) {
        this.water += amount;
        console.log(`💧 Добавлено ${amount} мл воды. Всего: ${this.water} мл.`);
    }

    addBeans(amount) {
        this.beans += amount;
        console.log(`🫘 Добавлено ${amount} г зёрен. Всего: ${this.beans} г.`);
    }
}

// Задача 1.3: «Бойцовский клуб в консоли»
class Fighter {
    constructor(name, hp, power) {
        this.name = name;
        this.hp = hp;
        this.power = power;
    }

    strike(enemy) {
        if (this.hp <= 0) {
            console.log(`${this.name} уже без сознания и не может драться!`);
            return;
        }

        enemy.hp -= this.power;
        console.log(`💥 ${this.name} нанес удар ${enemy.name} на ${this.power} урона!`);

        if (enemy.hp <= 0) {
            enemy.hp = 0;
            console.log(`🏆 ${enemy.name} отправлен в глубокий нокаут! Победил ${this.name}!`);
        } else {
            console.log(`У ${enemy.name} осталось ${enemy.hp} HP.`);
        }
    }
}

// --------------------------------------------------------
// БЛОК 2: Инкапсуляция и Сеттеры/Геттеры
// --------------------------------------------------------

// Задача 2.1: «Банкомат: никаких минусов и чит-кодов»
class BankCard {
    #pin;
    #balance;

    constructor(cardHolder, initialPin, startBalance = 0) {
        this.cardHolder = cardHolder;
        this.#pin = String(initialPin);
        this.#balance = Math.max(0, startBalance);
    }

    checkBalance(enteredPin) {
        if (String(enteredPin) !== this.#pin) {
            return "❌ Неверный пин-код!";
        }
        return `Баланс карты [${this.cardHolder}]: ${this.#balance} ₽`;
    }

    withdraw(enteredPin, amount) {
        if (String(enteredPin) !== this.#pin) {
            return "❌ Отказ: неверный пин-код!";
        }
        if (amount <= 0) {
            return "❌ Некорректная сумма снятия!";
        }
        if (amount > this.#balance) {
            return `❌ Недостаточно средств! Баланс: ${this.#balance} ₽, запрос: ${amount} ₽`;
        }

        this.#balance -= amount;
        return `✅ Успешно снято ${amount} ₽. Новый остаток: ${this.#balance} ₽`;
    }

    deposit(amount) {
        if (amount <= 0) return "❌ Сумма пополнения должна быть больше 0";
        this.#balance += amount;
        return `✅ Пополнено на ${amount} ₽. Баланс: ${this.#balance} ₽`;
    }

    changePin(oldPin, newPin) {
        if (String(oldPin) !== this.#pin) {
            return "❌ Старый пин-код неверен!";
        }
        this.#pin = String(newPin);
        return "✅ Пин-код успешно обновлен!";
    }
}

// Задача 2.2: «Спидометр спорткара»
class Speedometer {
    #speed = 0;

    constructor(model, maxSpeed = 250) {
        this.model = model;
        this.maxSpeed = maxSpeed;
    }

    get speed() {
        return `${this.#speed} км/ч`;
    }

    set speed(val) {
        if (val < 0) {
            this.#speed = 0;
            console.log(`🚗 [${this.model}] Машина полностью остановилась (0 км/ч).`);
        } else if (val > this.maxSpeed) {
            this.#speed = this.maxSpeed;
            console.log(`⚠️ [${this.model}] Внимание! Превышен предел двигателя. Скорость ограничена до ${this.maxSpeed} км/ч.`);
        } else {
            this.#speed = val;
            console.log(`🏎️ [${this.model}] Скорость установлена: ${this.#speed} км/ч.`);
        }
    }
}

// --------------------------------------------------------
// БЛОК 3: Наследование и Полиморфизм
// --------------------------------------------------------

// Задача 3.1: «Курьерская служба»
class DeliveryService {
    constructor(name, baseRate) {
        this.name = name;
        this.baseRate = baseRate;
    }

    deliver(distanceKm) {
        const cost = distanceKm * this.baseRate;
        return `[${this.name}] Доставка на ${distanceKm} км: ${cost} ₽`;
    }
}

class FootCourier extends DeliveryService {
    constructor(name, baseRate = 30) {
        super(name, baseRate);
        this.speed = 5; // км/ч
    }

    deliver(distanceKm) {
        const cost = distanceKm * this.baseRate;
        const hours = (distanceKm / this.speed).toFixed(1);
        return `🚶 Пеший курьер ${this.name}: доставка ${distanceKm} км займёт ~${hours} ч. Стоимость: ${cost} ₽.`;
    }
}

class DroneCourier extends DeliveryService {
    constructor(name, baseRate = 80) {
        super(name, baseRate);
        this.speed = 60; // км/ч
        this.batteryFee = 200;
    }

    deliver(distanceKm) {
        const cost = distanceKm * this.baseRate + this.batteryFee;
        const minutes = Math.round((distanceKm / this.speed) * 60);
        return `🛸 Дрон-доставка [${this.name}]: прилетит через ${minutes} мин! Стоимость: ${cost} ₽ (вкл. сбор за батарею).`;
    }
}

// Задача 3.2: «Шоу талантов RPG»
class Adventurer {
    constructor(name) {
        this.name = name;
    }

    perform() {
        return `🎭 ${this.name} скромно кланяется зрителям в таверне.`;
    }
}

class WarriorAdventurer extends Adventurer {
    perform() {
        return `🪓 Воин ${this.name} крутит боевую секиру и одним ударом раскалывает дубовую бочку!`;
    }
}

class WarlockAdventurer extends Adventurer {
    perform() {
        return `🔮 Чернокнижник ${this.name} вызывает фиолетовое пламя и жонглирует искрами скверны!`;
    }
}

class BardAdventurer extends Adventurer {
    perform() {
        return `🪕 Бард ${this.name} бьёт по струнам лютни и поёт балладу о драконах! Вся таверна подпевает!`;
    }
}

// Демонстрация полиморфизма:
console.log("=== ДЕМОНСТРАЦИЯ ПОЛИМОРФИЗМА ===");
const talentShow = [
    new Adventurer("Случайный путник"),
    new WarriorAdventurer("Конан"),
    new WarlockAdventurer("Гул'дан"),
    new BardAdventurer("Лютик")
];

for (const talent of talentShow) {
    console.log(talent.perform());
}
