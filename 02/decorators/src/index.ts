function LogMethod(): ClassDecorator {
  return (Constructor) => {
    const prototype = Constructor.prototype;
    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === "constructor") {
        console.log(`Конструктор класса ${Constructor.name} был вызван`);
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      if (typeof descriptor?.value !== "function") continue;

      const original = descriptor.value;

      Object.defineProperty(prototype, key, {
        ...descriptor,
        value: function (this: any, ...args: any[]) {
          const tag = `${Constructor.name}.${key}`;
          console.log(`Метод ${tag} был вызван`);
          console.time(tag);
          const result = original.apply(this, args);
          if (result instanceof Promise) {
            return result.finally(() => console.timeEnd(tag));
          }
          console.timeEnd(tag);
          return result;
        },
      });
    }
  };
}

@LogMethod()
class Foo {
  constructor(private readonly bar: string) {}

  method1() {
    console.log(this.bar);
  }

  async method2() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("I am method 2");
  }
}

const f = new Foo("bar");

f.method1();
f.method2();
