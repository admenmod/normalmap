type Definition = {
    vals: number[]
}

type ErrorBrand<Err extends string> = Readonly<{
  [k in Err]: void;
}>;

// Точка входа строителя. В отличие строителя значений,
// нам не нужно определение значений хранящее
// добавленные числа потому что бы будем хранить их в типе и проверять
// на стадии компиляции.
const makeAThing = () => {
    // Можно вызвать addNumber на следующем шаге строителя.
    // Инициализирует множество Nums пустым множеством.
    return {
        addNumber: addNumber<never>()
    }
}

type AddNumberBuilder<Nums extends number> = {
    // Когда пользовать вызывает addNumber(x: T), проверят что T уже не
    // присутствует в Nums. Если нет, выполнение продолжается
    // и T добавляется в Nums.
    addNumber: (
      x: T extends Nums ? ErrorBrand<'Число уже существует'> : T
    ) => AddNumberBuilder,

    // Завершает builder, возвращает функцию, которая проверяет что x
    // существует в Nums.
    done: () => <T extends number> (
      x: T extends Nums ? T : ErrorBrand<'Не корректное число'>
    ) => void
}

// Чтобы реализовать частично примененный строитель, функция addNumber
// возвращает функцию, которая возвращает AddNumberBuilder.
const addNumber = <Nums extends number> () => {
    return <T extends number> (
        x: T extends Nums ? ErrorBrand<'Число уже существует'> : T
    ): AddNumberBuilder<Nums | T> => {
        return {
            addNumber: addNumber<Nums, T>(),
            done: done()
        };
    }
}

// Эта функция возвращает функцию которая возвращает функцию валидации.
const done = <Nums extends number>() => {
    return () => {
        return <T extends number>(
            x: T extends Nums ? T : ErrorBrand<'Некорректное число'>
        ) => {
        }
    };
}

const myBuilder = makeAThing()
    .addNumber(7)
    .addNumber(5)
    .done();

myBuilder(5);
myBuilder(7);
myBuilder(8); // Аргумент типа 'number' не возможно присвоить параметру типа
              // 'Readonly<{ "Некорректное чисто": void; }>'.(2345)

const myOther = makeAThing()
    .addNumber(7)
    .addNumber(5)
    .addNumber(5) // Аргумент типа 'number' не возможно присвоить параметру типа
                  // 'Readonly<{ "Число уже существует": void; }>'.(2345)
    .done();

export default {}
