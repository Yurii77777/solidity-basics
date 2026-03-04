# E4: Arrays, Structs, Mappings

## Чому це важливо?

У попередньому епізоді ми вивчили базові типи — числа, булеани, адреси. Але в реальних контрактах ти майже ніколи не працюєш з одним числом чи одною адресою. Тобі потрібно зберігати **списки**, **колекції** та **зв'язки між даними**.

**Аналогія з життя:**
- **Масив (array)** = список покупок — впорядкований перелік елементів
- **Структура (struct)** = анкета користувача — кілька полів, об'єднаних в один запис
- **Маппінг (mapping)** = телефонна книга — шукаєш по імені → отримуєш номер

**Де це використовується на фрілансі?**
- ERC-20 токени: `mapping(address => uint256)` для балансів, вкладений `mapping(address => mapping(address => uint256))` для allowances
- NFT: масиви токенів, маппінги власників
- Whitelist/Airdrop: масиви адрес, маппінги для швидкої перевірки
- DAO/Voting: структури для пропозицій, маппінги голосів
- Staking: структури для стейків, маппінги по користувачах

Це **найчастіші структури даних** у Solidity. Без них — жодного серйозного контракту не написати.

---

## 1. Arrays — масиви

### 1.1 Fixed-size Array (фіксований масив)

**Що це:**
Масив з наперед визначеним розміром. Після створення — розмір змінити не можна.

```solidity
uint256[5] public topScores; // рівно 5 елементів, завжди
```

**Чому фіксований?**
- Газ-ефективний: компілятор знає точний розмір → оптимальне розміщення у storage
- Безпечний: неможливо вийти за межі (компілятор перевіряє)
- Дешевший за динамічний при відомому розмірі

**Коли використовувати:**
- Топ-5 результатів, дні тижня, фіксована кількість слотів
- Коли розмір **точно відомий** і ніколи не зміниться

**Приклад з контракту:**
```solidity
function setScore(uint256 _index, uint256 _score) public {
    require(_index < 5, "Index out of bounds"); // захист від виходу за межі
    topScores[_index] = _score;
}

function getAllScores() public view returns (uint256[5] memory) {
    return topScores; // повертає копію всього масиву
}
```

**Gas нюанс:** читання одного елементу з фіксованого масиву ≈ 200 gas (один SLOAD).

---

### 1.2 Dynamic Array (динамічний масив)

**Що це:**
Масив, який може рости і зменшуватися. Розмір визначається під час виконання.

```solidity
uint256[] public numbers;   // порожній, але може рости
address[] public whitelist;  // список адрес
```

**Основні операції:**

```solidity
// Додати елемент в кінець
numbers.push(42);          // [42]
numbers.push(100);         // [42, 100]

// Довжина
numbers.length;            // 2

// Видалити останній елемент
numbers.pop();             // [42]

// Доступ по індексу
numbers[0];                // 42
```

**Видалення з середини — swap-and-pop:**

Це ламає мозок новачкам, але це **стандартний паттерн** у Solidity. Чому? Бо масиви у storage — це послідовні слоти, і "зсунути" елементи дуже дорого.

```solidity
// ❌ Неправильно: зсув елементів (O(n), ДУЖЕ дорого на gas)
function removeBad(uint256 _index) public {
    for (uint256 i = _index; i < numbers.length - 1; i++) {
        numbers[i] = numbers[i + 1]; // кожен крок = SSTORE ≈ 5,000 gas
    }
    numbers.pop();
}

// ✅ Правильно: swap-and-pop (O(1), дешево)
function removeNumberByIndex(uint256 _index) public {
    require(_index < numbers.length, "Index out of bounds");
    numbers[_index] = numbers[numbers.length - 1]; // замінюємо останнім
    numbers.pop();                                  // видаляємо останній
}
```

**Важливо:** swap-and-pop **не зберігає порядок**. Якщо порядок важливий — потрібен інший підхід (але в 95% випадків порядок не важливий).

**Gas нюанси:**
- `push()` ≈ 20,000 gas (запис у новий слот)
- `pop()` ≈ 5,000 gas (очистка слоту + зменшення довжини)
- Читання `numbers[i]` ≈ 200 gas

---

### 1.3 Whitelist Pattern — список адрес

Поширений паттерн для ICO, airdrops, доступу до функцій:

```solidity
address[] public whitelist;

function addToWhitelist(address _addr) public {
    whitelist.push(_addr);
}

function isWhitelisted(address _addr) public view returns (bool) {
    for (uint256 i = 0; i < whitelist.length; i++) {
        if (whitelist[i] == _addr) return true;
    }
    return false;
}
```

**Проблема з цим підходом:** `isWhitelisted` має складність O(n). При 10,000 адрес — це дуже дорого. У наступному розділі побачимо, як mapping вирішує цю проблему за O(1).

---

## 2. Structs — структури

### 2.1 Що таке struct?

**Struct** — це спосіб згрупувати кілька полів в один тип. Як об'єкт/клас в ООП, але без методів.

```solidity
struct User {
    string name;
    uint256 balance;
    bool isActive;
    uint256 createdAt;
}
```

**Навіщо?**
Без struct тобі довелося б тримати окремі масиви для кожного поля:
```solidity
// ❌ Без struct — хаос
string[] public userNames;
uint256[] public userBalances;
bool[] public userActiveStatus;

// ✅ Зі struct — один масив
User[] public users;
```

### 2.2 Створення struct

```solidity
// Спосіб 1: іменовані поля (рекомендований — зрозуміло, що де)
users.push(User({
    name: _name,
    balance: _balance,
    isActive: true,
    createdAt: block.timestamp
}));

// Спосіб 2: позиційний (коротше, але менш читабельний)
users.push(User(_name, _balance, true, block.timestamp));
```

### 2.3 Читання та модифікація struct

```solidity
// === ЧИТАННЯ ===

// Приймає _index — номер користувача в масиві users
// view — тільки читає дані, нічого не змінює (безкоштовно, без gas)
// returns (...) — перераховує 4 окремі значення, які функція поверне
function getUser(uint256 _index) public view returns (
    string memory name, uint256 balance, bool isActive, uint256 createdAt
) {
    // User storage user — це ПОСИЛАННЯ на оригінальний запис у блокчейні
    // Як ярлик на робочому столі — вказує на файл, але це не копія файлу
    // Якби написали User memory user — Solidity СКОПІЮВАЛА б усі 4 поля в пам'ять (дорожче)
    // А тут просто "тицяємо пальцем" на оригінал і читаємо з нього
    User storage user = users[_index];

    // Повертаємо 4 поля окремо — як tuple (набір значень)
    // Фронтенд отримає масив: ["Alice", 1000, true, 1717171717]
    return (user.name, user.balance, user.isActive, user.createdAt);
}

// === МОДИФІКАЦІЯ ===

function deactivateUser(uint256 _index) public {
    // Напряму змінюємо поле isActive в блокчейні
    // users[_index] вже вказує на storage — тому зміна одразу зберігається
    users[_index].isActive = false;
}
```

**Чому поля повертаються окремо, а не весь struct?**

У нашому контракті це **стилістичний вибір**, а не обмеження мови. Починаючи з Solidity 0.8.0, ABI encoder v2 увімкнений за замовчуванням, і struct можна повертати цілком одним рядком:

```solidity
// ✅ Теж працює в Solidity 0.8.x — результат для фронтенду той самий
function getUser(uint256 _index) public view returns (User memory) {
    return users[_index];
}
```

Обидва підходи робочі. Ми використовуємо варіант з окремими полями, бо він наочніший для навчання — одразу видно, які саме дані повертаються.

---

## 3. Mappings — маппінги

### 3.1 Що таке mapping?

**Mapping** — це хеш-таблиця (key-value store). Даєш ключ → отримуєш значення за O(1).

```solidity
mapping(address => uint256) public balances;
```

**Аналогія:** телефонна книга. Шукаєш по імені (ключ) → знаходиш номер (значення). Не потрібно перебирати всі записи.

### 3.2 Особливості mapping (КРИТИЧНО ВАЖЛИВО)

Mapping — це **не масив**. У нього є кілька фундаментальних обмежень:

1. **Не можна перебрати (iterate)**
   ```solidity
   // ❌ Неможливо
   for (uint256 i = 0; i < balances.length; i++) // помилка!
   ```
   Mapping не знає свого розміру і не зберігає список ключів.

2. **Не можна перевірити існування ключа**
   ```solidity
   balances[someAddress]; // повертає 0 (default)
   // 0 = "ніколи не записували" АБО "записали 0"
   ```
   Тому часто використовують окремий `mapping(address => bool) public hasProfile` для відстеження існування.

3. **Не можна видалити весь mapping**
   ```solidity
   delete balances; // ❌ помилка компіляції
   delete balances[addr]; // ✅ обнуляє конкретний ключ
   ```

4. **Ключі не зберігаються** — зберігається лише хеш ключа. Вилучити список ключів неможливо.

### 3.3 Як mapping зберігає дані

Mapping використовує `keccak256(key, slot)` для обчислення позиції у storage. Тому:
- Доступ завжди O(1) — один SLOAD
- Колізії практично неможливі (256-бітний хеш)
- Дані НЕ зберігаються послідовно (на відміну від масивів)

### 3.4 Простий mapping — баланси

```solidity
mapping(address => uint256) public balances;

function setBalance(address _addr, uint256 _amount) public {
    balances[_addr] = _amount;
}

function getBalance(address _addr) public view returns (uint256) {
    return balances[_addr]; // 0 якщо ніколи не записували
}

function addToBalance(address _addr, uint256 _amount) public {
    balances[_addr] += _amount; // безпечно з 0.8.0+
}
```

### 3.5 Mapping to Struct — профілі

Поширений паттерн: маппінг на структуру + булевий маппінг для існування.

```solidity
mapping(address => User) public userProfiles;
mapping(address => bool) public hasProfile;

function createProfile(string memory _name) public {
    require(!hasProfile[msg.sender], "Profile already exists");

    userProfiles[msg.sender] = User({
        name: _name,
        balance: 0,
        isActive: true,
        createdAt: block.timestamp
    });
    hasProfile[msg.sender] = true;
}
```

**Чому `hasProfile` окремо?**
Бо `userProfiles[addr]` завжди поверне struct з дефолтними значеннями (порожній string, 0, false, 0). Без `hasProfile` — неможливо відрізнити "не існує" від "існує з дефолтними значеннями".

---

## 4. Nested Mappings — вкладені маппінги

### 4.1 ERC-20 Allowance Pattern

Це **найважливіший паттерн** для розуміння nested mappings. Кожен ERC-20 токен його використовує.

**Задача:** дозволити іншому контракту/адресі витрачати твої токени від твого імені.

```solidity
// owner => spender => amount
mapping(address => mapping(address => uint256)) public allowances;

function setAllowance(address _spender, uint256 _amount) public {
    allowances[msg.sender][_spender] = _amount;
}

function getAllowance(address _owner, address _spender) public view returns (uint256) {
    return allowances[_owner][_spender];
}
```

**Як це працює в реальному ERC-20:**
1. Аліса викликає `approve(DEX_address, 1000)` → дозволяє DEX витратити 1000 токенів
2. DEX викликає `transferFrom(Alice, Bob, 500)` → переказує 500 токенів від Аліси Бобу
3. Allowance зменшується: `allowances[Alice][DEX] = 500`

### 4.2 Permission Pattern

Інший поширений паттерн — система дозволів:

```solidity
// user => permissionId => granted
mapping(address => mapping(uint256 => bool)) public permissions;

function setPermission(address _user, uint256 _permissionId, bool _granted) public {
    permissions[_user][_permissionId] = _granted;
}

function hasPermission(address _user, uint256 _permissionId) public view returns (bool) {
    return permissions[_user][_permissionId];
}
```

**Приклад використання:**
- `permissionId = 1` → може створювати контент
- `permissionId = 2` → може модерувати
- `permissionId = 3` → може знімати кошти

---

## 5. Events — події (логування змін стану)

### 5.1 Що таке event?

**Event** — це спосіб контракту "повідомити" зовнішній світ, що щось сталося. Events записуються в transaction logs (не у storage), тому вони **значно дешевші** за зберігання даних.

**Аналогія:** event — це як чек з магазину. Товар (state) вже в тебе вдома (storage), а чек (event) — це запис про операцію, який можна знайти пізніше.

```solidity
// Оголошення event
event UserCreated(uint256 indexed index, string name, uint256 balance);

// Виклик (emit) всередині функції
function createUser(string memory _name, uint256 _balance) public {
    users.push(User({ ... }));
    emit UserCreated(users.length - 1, _name, _balance);
}
```

### 5.2 Навіщо events?

1. **Фронтенд** — dApp слухає events через WebSocket і оновлює UI в реальному часі
2. **Індексація** — сервіси (The Graph, Alchemy) будують бази даних з events для швидкого пошуку
3. **Аудит** — повна історія змін контракту, навіть якщо state було перезаписано
4. **Дешевше за storage** — event log ≈ 375 gas за байт, а SSTORE ≈ 20,000 gas за 32 байти

### 5.3 Ключове слово `indexed`

Параметри з `indexed` можна **фільтрувати** при підписці на events:

```solidity
// До 3 indexed параметрів на event
event AllowanceSet(address indexed owner, address indexed spender, uint256 amount);
```

**З indexed:** фронтенд може підписатися: "покажи мені тільки events від адреси X"
**Без indexed:** доведеться отримувати ВСІ events і фільтрувати вручну

**Обмеження:** максимум 3 `indexed` параметри на event. Рядки та масиви з `indexed` зберігаються як `keccak256` хеш (оригінал втрачається).

### 5.4 Events у нашому контракті

Контракт DataStructures має events для всіх операцій зміни стану:

```solidity
event ScoreUpdated(uint256 indexed index, uint256 score);
event NumberAdded(uint256 number);
event NumberRemoved(uint256 indexed index);
event WhitelistAdded(address indexed addr);
event WhitelistRemoved(uint256 indexed index);
event UserCreated(uint256 indexed index, string name, uint256 balance);
event UserDeactivated(uint256 indexed index);
event BalanceUpdated(address indexed addr, uint256 newBalance);
event ProfileCreated(address indexed addr, string name);
event ProfileDeactivated(address indexed addr);
event AllowanceSet(address indexed owner, address indexed spender, uint256 amount);
event PermissionSet(address indexed user, uint256 indexed permissionId, bool granted);
```

**Важливо для фрілансу:** в ERC-20 стандарті events `Transfer` і `Approval` є **обов'язковими**. Без них токен не розпізнають ні Etherscan, ні MetaMask, ні DEX-и. Наш `AllowanceSet` — спрощена версія `Approval`.

---

## 6. Array vs Mapping — коли що?

Це одне з ключових рішень при проектуванні контракту:

**Використовуй Array коли:**
- Потрібно перебирати всі елементи (ітерація)
- Важливий порядок елементів
- Потрібна довжина колекції
- Невеликий розмір (десятки, не тисячі)

**Використовуй Mapping коли:**
- Потрібен швидкий пошук по ключу (O(1))
- Не потрібно перебирати всі елементи
- Великий розмір колекції
- Ключ — address, bytes32, uint256

**Комбінований паттерн (часто на фрілансі):**
```solidity
address[] public members;                    // для ітерації
mapping(address => bool) public isMember;    // для швидкої перевірки

function addMember(address _addr) public {
    require(!isMember[_addr], "Already a member");
    members.push(_addr);
    isMember[_addr] = true;
}
```

---

## 7. Контракт DataStructures.sol — що демонструє

### 7.1 Fixed Array
- `topScores` — фіксований масив на 5 елементів
- `setScore()` / `getScore()` — запис/читання по індексу
- `getAllScores()` — повернення всього масиву

### 7.2 Dynamic Array
- `numbers` — динамічний масив чисел
- `addNumber()` — push в масив
- `removeNumberByIndex()` — swap-and-pop видалення
- `getAllNumbers()` / `getNumbersLength()` — читання

### 7.3 Whitelist
- `whitelist` — масив адрес
- `addToWhitelist()` / `removeFromWhitelist()` — управління
- `isWhitelisted()` — перевірка (O(n) — для навчання)

### 7.4 Structs
- `User` — структура з 4 полями
- `createUser()` — створення з `block.timestamp`
- `getUser()` / `deactivateUser()` — читання та модифікація

### 7.5 Mappings
- `balances` — простий `address => uint256`
- `userProfiles` + `hasProfile` — mapping to struct з перевіркою існування
- `createProfile()` використовує `msg.sender` — прив'язка до відправника транзакції

### 7.6 Nested Mappings
- `allowances` — ERC-20 allowance pattern
- `permissions` — система дозволів

### 7.7 Events
- 12 events для всіх операцій зміни стану
- `indexed` параметри на ключових полях (address, index, permissionId)
- Паттерн `AllowanceSet` — спрощена версія ERC-20 `Approval`

---

## Як тестувати

### 1. Компіляція

```bash
yarn compile
```

### 2. Запуск локальної мережі (ТЕРМІНАЛ 1)

**Відкрий перший термінал і запусти:**
```bash
yarn start
```

**Має з'явитися:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

**НЕ ЗАКРИВАЙ цей термінал!** Мережа має працювати постійно.

---

### 3. Деплой контракту (ТЕРМІНАЛ 2)

**Відкрий НОВИЙ термінал (залиш перший працювати) і виконай:**
```bash
yarn deploy:data
```

**Має з'явитися:**
```
Deploying from: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Constructor args: (none)
DataStructures deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Saved to deployments/localhost.json
```

---

### 4. Тестування через tasks (ТЕРМІНАЛ 2)

**Всі команди нижче виконуй у другому терміналі.**

#### Fixed Array (topScores):
```bash
npx hardhat data:set-score --index 0 --value 100 --network localhost
npx hardhat data:set-score --index 4 --value 999 --network localhost
npx hardhat data:get-scores --network localhost
```

#### Dynamic Array (numbers):
```bash
npx hardhat data:add-number --value 42 --network localhost
npx hardhat data:add-number --value 100 --network localhost
npx hardhat data:add-number --value 7 --network localhost
npx hardhat data:get-numbers --network localhost
npx hardhat data:remove-number --index 0 --network localhost
npx hardhat data:get-numbers --network localhost
```

Після видалення зверни увагу: число з кінця (7) перемістилося на позицію 0 (swap-and-pop).

#### Whitelist:
```bash
npx hardhat data:add-whitelist --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
npx hardhat data:check-whitelist --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
npx hardhat data:get-whitelist --network localhost
```

#### Structs (users):
```bash
npx hardhat data:create-user --name "Alice" --balance 1000 --network localhost
npx hardhat data:create-user --name "Bob" --balance 500 --network localhost
npx hardhat data:get-user --index 0 --network localhost
npx hardhat data:deactivate-user --index 0 --network localhost
npx hardhat data:get-user --index 0 --network localhost
npx hardhat data:user-count --network localhost
```

#### Mappings (balances):
```bash
npx hardhat data:set-balance --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --amount 1000 --network localhost
npx hardhat data:get-balance --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
npx hardhat data:add-balance --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --amount 500 --network localhost
```

#### Profiles (mapping to struct):
```bash
npx hardhat data:create-profile --name "MyProfile" --network localhost
npx hardhat data:get-profile --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
npx hardhat data:deactivate-profile --network localhost
npx hardhat data:get-profile --addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --network localhost
```

#### Nested Mappings (allowances):
```bash
npx hardhat data:set-allowance --spender 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --amount 1000 --network localhost
npx hardhat data:get-allowance --owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --spender 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --network localhost
```

#### Nested Mappings (permissions):
```bash
npx hardhat data:set-permission --user 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --id 1 --granted true --network localhost
npx hardhat data:check-permission --user 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --id 1 --network localhost
```

#### Utility:
```bash
npx hardhat data:summary --network localhost
```

---

## Важливі моменти для запам'ятовування

### 1. Swap-and-pop — єдиний дешевий спосіб видалення з масиву
```solidity
numbers[_index] = numbers[numbers.length - 1];
numbers.pop();
// O(1) замість O(n), але НЕ зберігає порядок
```

### 2. Mapping завжди повертає дефолтне значення
```solidity
balances[unknownAddress]; // 0, не помилка
// Тому для перевірки існування — окремий mapping(address => bool)
```

### 3. Nested mapping = основа ERC-20
```solidity
mapping(address => mapping(address => uint256)) public allowances;
allowances[owner][spender] = amount;
// Кожен ERC-20 токен використовує саме цей паттерн
```

### 4. Array + Mapping = найпоширеніший комбо-паттерн
```solidity
address[] public members;              // ітерація
mapping(address => bool) public isMember; // O(1) перевірка
```

### 5. `msg.sender` у маппінгах — прив'язка до відправника
```solidity
userProfiles[msg.sender] = User({...}); // профіль прив'язаний до адреси
allowances[msg.sender][_spender] = _amount; // дозвіл від імені відправника
```

### 6. Events — кожна зміна стану має emit
```solidity
event UserCreated(uint256 indexed index, string name, uint256 balance);

function createUser(...) public {
    users.push(User({...}));
    emit UserCreated(users.length - 1, _name, _balance);
}
// indexed дозволяє фільтрувати events (до 3 на event)
```

---

## Міні-вправи для закріплення

### Вправа 1: Додай `updateUserBalance`
Функція, яка оновлює баланс користувача в масиві `users` по індексу:
```solidity
function updateUserBalance(uint256 _index, uint256 _newBalance) public {
    require(_index < users.length, "Index out of bounds");
    users[_index].balance = _newBalance;
}
```

### Вправа 2: Додай `decreaseAllowance`
Функція, яка зменшує allowance (з захистом від underflow):
```solidity
function decreaseAllowance(address _spender, uint256 _amount) public {
    require(allowances[msg.sender][_spender] >= _amount, "Insufficient allowance");
    allowances[msg.sender][_spender] -= _amount;
}
```

### Вправа 3: Порахуй активних користувачів
Функція, яка повертає кількість активних користувачів:
```solidity
function getActiveUserCount() public view returns (uint256 count) {
    for (uint256 i = 0; i < users.length; i++) {
        if (users[i].isActive) count++;
    }
}
```
Зверни увагу: ця функція має складність O(n). Для великих масивів краще тримати окремий лічильник.

---

## Підсумок (що ти маєш винести)

✅ **Знаю різницю між fixed і dynamic array** (фіксований дешевший, динамічний гнучкіший)
✅ **Вмію видаляти з масиву** через swap-and-pop (O(1), не зберігає порядок)
✅ **Розумію struct** — групування полів в один тип
✅ **Розумію mapping** — O(1) пошук, але без ітерації та без перевірки існування
✅ **Знаю паттерн "mapping + bool для існування"** (hasProfile)
✅ **Розумію nested mappings** — ERC-20 allowance pattern
✅ **Знаю коли array, коли mapping** — array для ітерації, mapping для пошуку
✅ **Знаю комбінований паттерн array + mapping** — для обох потреб
✅ **Розумію events** — дешеве логування змін стану, `indexed` для фільтрації, обов'язкові в ERC-20
