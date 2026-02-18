# E3: Contract Structure & Basic Types

## Чому це важливо?

Уяви, що ти будуєш будинок. Перш ніж класти цеглу, треба розуміти:
- **Які матеріали є** (цегла, бетон, дерево) — це типи даних
- **Де вони зберігаються** (склад, будмайданчик, вантажівка) — це data locations
- **Як структурувати креслення** — це структура файлу

Цей епізод — **фундамент для всього**, що ти робитимеш у Solidity. Без розуміння базових типів та місць зберігання даних ти не зможеш писати ефективні контракти.

---

## 1. Структура файлу контракту (з чого починається будь-який .sol файл)

### 1.1 SPDX License Identifier — що це і навіщо?

**Приклад:**
```solidity
// SPDX-License-Identifier: MIT
```

**Що це таке?**
Це машиночитаємий спосіб сказати "під якою ліцензією цей код". Компілятор додає цю інформацію в метадані контракту.

**Навіщо?**
- Etherscan та інші сервіси використовують це для верифікації
- Якщо код публічний → `MIT`, `Apache-2.0`, `GPL-3.0` тощо
- Якщо приватний → `UNLICENSED`

**Важливо:** це має бути ПЕРШИМ рядком у файлі (або одним з перших коментарів).

---

### 1.2 Pragma Directive — вказуємо версію компілятора

**Приклад:**
```solidity
pragma solidity ^0.8.28;
```

**Що це?**
Інструкція компілятору: "використовуй версію від 0.8.28 до 0.9.0 (не включно)".

**Навіщо каретка `^`?**
- `0.8.29` ✅ (bugfix update — сумісний)
- `0.9.0` ❌ (breaking change — несумісний)

**Важливий нюанс:** pragma є локальним для файлу. Якщо імпортуєш інший файл з іншим pragma — компілятор має підтримувати обидві версії.

---

### 1.3 Import Statements — як використовувати код з інших файлів

Як у JavaScript/TypeScript:

```solidity
// Весь файл
import "./OtherContract.sol";

// Тільки конкретні речі
import {Ownable, IERC20} from "./file.sol";

// З перейменуванням (alias)
import {IERC20 as Token} from "./interfaces/IERC20.sol";
```

**Навіщо?**
Модульність. Замість писати все в одному файлі, розбиваємо на логічні частини.

---

### 1.4 Contract Declaration — оголошення контракту

```solidity
contract TypesDemo {
  // тут живуть:
  // - state variables (стан)
  // - functions (логіка)
  // - events (події)
  // - modifiers (перевірки)
  // - errors (кастомні помилки)
  // - structs/enums (складні типи)
}
```

**Ментальна модель:**
Контракт ≈ клас в ООП, але з важливою різницею:
- **state variables** зберігаються назавжди на блокчейні (storage)
- **кожен виклик функції** = транзакція (коштує gas)

---

## 2. Типи даних: Value Types (прості типи)

**Value types** — це типи, які:
- мають фіксований розмір
- копіюються "по значенню" (коли передаєш змінну — створюється копія)
- НЕ потребують вказувати `storage`/`memory`/`calldata`

---

### 2.1 Integers (цілі числа) — uint та int

#### **uint (беззнаковий)**
- `uint` = `uint256` (за замовчуванням)
- діапазон: `0` до `2^256 - 1` (тобто дуже великі числа, ~10^77)
- використовується для: кількість токенів, балансів, ID, часових міток

#### **int (знаковий)**
- `int` = `int256`
- діапазон: `-2^255` до `2^255 - 1`
- використовується рідше (більшість речей у блокчейні — позитивні числа)

---

#### **Overflow/Underflow — що це і чому важливо?**

**До Solidity 0.8.0:**
```solidity
uint256 maxValue = type(uint256).max; // 2^256 - 1
maxValue + 1; // переповнення → ставало 0 (!)
```

Це призвело до багатьох хаків (наприклад, **BeautyChain hack 2018** — втрачено $1M).

**З Solidity 0.8.0+:**
```solidity
myUint + 1; // якщо overflow → транзакція revert-ається ❌
```

**Як вимкнути захист (коли ТИ впевнений):**
```solidity
unchecked {
  myUint += 1; // overflow не перевіряється (економія gas)
}
```

---

#### **Min/Max значення**

```solidity
type(uint256).max // 115792089237316195423570985008687907853269984665640564039457584007913129639935
type(int256).min  // -57896044618658097711785492504343953926634992332820282019728792003956564819968
type(int256).max  // 57896044618658097711785492504343953926634992332820282019728792003956564819967
```

---

### 2.2 Bool — булеве значення

```solidity
bool public isPaused; // true або false
```

**Оператори:**
- `!a` (НЕ)
- `a && b` (І)
- `a || b` (АБО)
- `a == b`, `a != b` (рівність)

**Приклад використання:**
```solidity
bool public isPaused;  // для pausable контрактів
bool public hasVoted;  // для voting систем
```

---

### 2.3 Address — Ethereum адреса (20 байт)

#### **address — базовий тип**
- 20 байт (160 біт)
- ідентифікатор акаунту або смарт-контракту
- приклад: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`

#### **address payable — може приймати ETH**

Може отримувати Ether через:
- `.transfer(amount)` (застарілий)
- `.send(amount)` (застарілий)
- `.call{value: amount}("")` (сучасний підхід)

**Корисні властивості:**
```solidity
myAddress.balance // баланс у wei
myAddress.code    // байткод контракту (якщо це контракт)
```

**Конвертація:**
```solidity
address payable recipient = payable(myAddress); // explicit
address regular = recipient; // implicit ✅
```

**Важливо:** якщо функція має приймати ETH — параметр має бути `address payable`.

---

## 3. String та Bytes — текст і бінарні дані

Це **reference types** (складні типи), і тут починається магія data locations.

---

### 3.1 String — текстові рядки (UTF-8)

**Що це:**
- UTF-8 текст змінної довжини
- НЕ можна звертатися по індексу напряму:
  ```solidity
  myString[0] // ❌ помилка компіляції
  ```

**Як працювати:**
```solidity
bytes(myString).length // довжина в байтах
bytes(myString)[0]     // перший байт
```

**Навіщо:**
Для тексту, імен, описів тощо.

**Gas нюанс:**
Зберігання `string` у storage **ДОРОГЕ**. Якщо можна обійтися `bytes32` — краще використати його.

---

### 3.2 Bytes — бінарні дані змінної довжини

**Що це:**
- довільні байти
- МОЖНА індексувати:
  ```solidity
  myBytes[0] // перший байт ✅
  ```

**Коли використовувати:**
- сирі дані (encoded transactions, signatures)
- коли розмір непередбачуваний
- коли треба зберігати не текст, а "набір байтів"

---

### 3.3 Bytes1 ... Bytes32 — фіксовані байти

**Що це:**
- `bytes1`, `bytes2`, ..., `bytes32` — фіксований розмір
- `bytes32` = 32 байти (256 біт)

**Чому bytes32 скрізь?**
- `keccak256(...)` повертає `bytes32`
- hash-значення, ID, криптографічні підписи — зазвичай 32 байти
- найефективніший для зберігання (не потребує dynamic storage)

**Приклад:**
```solidity
bytes32 public txHash; // хеш транзакції
bytes32 public userId = keccak256(abi.encodePacked("Alice"));
```

**Важлива різниця:**
```solidity
string memory s = "Hello";
bytes32 b = bytes32(bytes(s)); // просто перші 32 байти (НЕ хеш!)

// Для хешу:
bytes32 hash = keccak256(bytes(s)); // ось це хеш ✅
```

---

## 4. Data Locations — де зберігаються дані (критично важливо!)

Це те, що **"ламає мозок"** новачкам, але потім економить купу gas та багів.

**Аналогія з життя:**
- **storage** = твій склад (постійне зберігання, дороге)
- **memory** = робочий стіл (тимчасове, дешевше)
- **calldata** = вантажівка з доставкою (read-only, найдешевше)

---

### 4.1 Storage — постійні дані на блокчейні

**Що це:**
- дані зберігаються **назавжди** між викликами
- **state variables** завжди у storage

**Вартість:**
- запис у storage — **ДОРОГИЙ** (20,000 gas за нове значення)
- читання — дешевше (200-800 gas)

**Приклад:**
```solidity
uint256 public myNumber; // це в storage
string public myName;    // це теж
```

---

### 4.2 Memory — тимчасові дані під час виконання

**Що це:**
- існують тільки під час виконання функції
- після завершення виклику — очищаються

**Використання:**
```solidity
function setName(string memory _name) public {
  // _name існує тільки тут
  myName = _name; // копіюється в storage
}
```

---

### 4.3 Calldata — read-only вхідні дані

**Що це:**
- дані, які прийшли з транзакції
- тільки для `external` функцій
- **найдешевший** варіант (бо це просто "вхідний payload")

**Коли використовувати:**
```solidity
function processData(string calldata _data) external {
  // тільки читаємо _data, не змінюємо
  bytes32 hash = keccak256(bytes(_data));
}
```

**Важливо:** calldata НЕ можна модифікувати:
```solidity
_data = "new value"; // ❌ помилка компіляції
```

---

### 4.4 Assignment Rules — коли копія, коли reference

Це найскладніша частина. Розберемо по порядку:

#### **Правило 1: calldata/storage → memory = КОПІЯ**
```solidity
function example(string calldata _input) external {
  string memory copy = _input; // створюється КОПІЯ
  copy = "changed"; // _input НЕ змінюється
}
```

#### **Правило 2: storage → storage (local) = REFERENCE**
```solidity
function example() public {
  string storage ref = myString; // НЕ копія, а посилання!
  ref = "changed"; // myString ТЕЖ змінюється ✅
}
```

#### **Правило 3: memory → memory = може бути reference**
```solidity
function example() public pure {
  string memory a = "hello";
  string memory b = a; // може бути reference (залежить від оптимізацій)
}
```

**Важливо:**
- Якщо хочеш змінити оригінал (state variable) — використовуй **storage pointer**
- Якщо хочеш незалежну копію — використовуй **memory**
- Якщо тільки читаєш — використовуй **calldata** (найдешевше)

---

## 5. Контракт TypesDemo.sol — що саме демонструє

Наш контракт показує всі ці концепції в дії:

### **5.1 State variables (дефолтні значення)**
```solidity
uint256 public myUint;    // → 0
int256 public myInt;      // → 0
bool public myBool;       // → false
address public myAddress; // → 0x000...000
string public myString;   // → ""
bytes public myBytes;     // → 0x
bytes32 public myBytes32; // → 0x00..00
```

### **5.2 Uint demo**
- `setUint()` — запис у storage
- `incrementUint()` — overflow protection
- `getMaxUint()` — type max

### **5.3 Int demo**
- `setInt()` — негативні значення
- `getIntLimits()` — min/max

### **5.4 Bool demo**
- `toggleBool()` — простий приклад `!`

### **5.5 Address demo**
- `setAddress()`
- `getAddressBalance()` — демонстрація `.balance`
- `addressToUint()` / `uintToAddress()` — конвертації

### **5.6 String demo**
- `setString(string memory)` — копія з memory в storage
- `getStringLength(string calldata)` — показує: calldata зручно/дешево для external
- `compareMemoryVsCalldata(...)` — порівняння через keccak256

### **5.7 Bytes demo**
- `setBytes(bytes memory)` — storage write
- `getBytesLength()`
- `setBytes32(bytes32)`
- `getFirstByteFromBytes32()` — індексація
- `stringToBytes32()` — конвертація (не хеш!)

### **5.8 Data Location Demos**
- `storageReferenceDemo()` — як працює storage pointer
- `memoryCopyDemo()` — копія не змінює оригінал

---

## Як тестувати

### **1. Компіляція**
```bash
yarn compile
```

### **2. Запуск локальної мережі (ТЕРМІНАЛ 1)**

**Відкрий перший термінал і запусти:**
```bash
yarn start
# АБО (якщо не працює):
npx hardhat node
```

**Має з'явитися:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

⚠️ **НЕ ЗАКРИВАЙ цей термінал!** Мережа має працювати постійно.

---

### **3. Деплой контракту (ТЕРМІНАЛ 2)**

**Відкрий НОВИЙ термінал (залиш перший працювати) і виконай:**
```bash
yarn deploy:types
```

**Має з'явитися:**
```
TypesDemo deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployment saved to deployments/localhost/TypesDemo.json
```

---

### **4. Тестування через tasks (ТЕРМІНАЛ 2)**

**Всі команди нижче виконуй у другому терміналі (той, де робив деплой):**

#### **Uint:**
```bash
npx hardhat types:set-uint --value 42 --network localhost
npx hardhat types:increment --network localhost
npx hardhat types:max-uint --network localhost
```

**Int:**
```bash
npx hardhat types:set-int --value -100 --network localhost
npx hardhat types:int-limits --network localhost
```

**Bool:**
```bash
npx hardhat types:toggle-bool --network localhost
npx hardhat types:set-bool --value true --network localhost
```

**Address:**
```bash
npx hardhat types:set-address --addr 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 --network localhost
npx hardhat types:get-balance --network localhost
npx hardhat types:address-convert --value 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 --network localhost
```

**String:**
```bash
npx hardhat types:set-string --value "Hello Solidity" --network localhost
npx hardhat types:string-length --value "Test" --network localhost
npx hardhat types:compare-locations --str1 "abc" --str2 "abc" --network localhost
```

**Bytes:**
```bash
npx hardhat types:set-bytes --value 0x1234 --network localhost
npx hardhat types:set-bytes32 --value 0x1234567890123456789012345678901234567890123456789012345678901234 --network localhost
npx hardhat types:string-to-bytes32 --value "Hello" --network localhost
```

**Data Locations:**
```bash
npx hardhat types:storage-ref-demo --value "New Value" --network localhost
npx hardhat types:memory-copy-demo --network localhost
```

**Utilities:**
```bash
npx hardhat types:get-all --network localhost
npx hardhat types:reset-all --network localhost
```

---

## Важливі моменти для запам'ятовування

### 1. **Overflow protection — з 0.8.0+ автоматично**
```solidity
myUint += 1; // revert на overflow ✅
unchecked { myUint += 1; } // ручний режим (економія gas, але ризик)
```

### 2. **address vs address payable — різниця критична**
```solidity
function sendEther(address payable recipient) public payable {
  recipient.transfer(msg.value); // тільки для address payable
}
```

### 3. **calldata дешевший за memory**
```solidity
function processData(string calldata data) external { /* найдешевше */ }
function processData(string memory data) public { /* дорожче */ }
```

### 4. **bytes32 ефективніший за string**
```solidity
string public name = "Alice"; // дороге зберігання
bytes32 public nameHash = keccak256("Alice"); // дешевше + ефективніше
```

### 5. **Storage pointer vs memory copy**
```solidity
string storage ref = myString; // reference (змінює оригінал)
string memory copy = myString; // копія (не змінює оригінал)
```

---

## Що створено

**Контракт:** `contracts/TypesDemo.sol` — демонстрація всіх основних типів даних та data locations

**Інтеграція:**
- Constants: `TYPES_DEMO` в `constants/contracts.ts`
- Constructor args: entry в `constants/constructor-args.ts`
- Deploy script: `yarn deploy:types`
- Hardhat Tasks: `tasks/types-demo.ts`

---

## Міні-вправи для закріплення (спробуй сам!)

### **Вправа 1: setBytesFromString**
Додай функцію, яка зберігає string як bytes:
```solidity
function setBytesFromString(string calldata s) external {
  myBytes = bytes(s);
}
```

### **Вправа 2: firstChar**
Додай функцію для отримання першого символу строки:
```solidity
function firstChar(string calldata s) external pure returns (bytes1) {
  require(bytes(s).length > 0, "Empty string");
  return bytes(s)[0];
}
```

### **Вправа 3: unchecked demo**
Додай функцію для демонстрації unchecked:
```solidity
function uncheckedIncrement() public returns (uint256) {
  unchecked { myUint += 1; }
  return myUint;
}
```

Спробуй викликати з `myUint = type(uint256).max` і подивись, що станеться!

---

## Джерела

- [Solidity: Layout of Source Files](https://docs.soliditylang.org/en/latest/layout-of-source-files.html)
- [Solidity: Types](https://docs.soliditylang.org/en/latest/types.html)
- [Solidity: Contract Structure](https://docs.soliditylang.org/en/latest/structure-of-a-contract.html)
- [Solidity: Data Location](https://docs.soliditylang.org/en/latest/types.html#data-location)

---

## Підсумок (що ти маєш винести)

✅ **Розумію структуру .sol файлу** (SPDX → pragma → imports → contract)
✅ **Знаю базові типи** (uint/int/bool/address/string/bytes)
✅ **Розумію overflow protection** (0.8.0+ автоматично, unchecked для ручного режиму)
✅ **Розумію різницю address vs address payable** (для прийому ETH)
✅ **Розумію data locations** (storage = склад, memory = робочий стіл, calldata = доставка)
✅ **Знаю, коли копія, коли reference** (storage pointer vs memory copy)
✅ **Можу обрати правильний тип** (bytes32 для hash, string для тексту, calldata для read-only)

Це фундамент для всього, що далі. Наступні епізоди будуватимуться на цих знаннях!
