function printDivider(divider: string): string {
    return `\n${divider.repeat(60)}` ;
}

console.log(printDivider("-"));

// # プリミティブ型
// string, number, boolean, symbol, bigint, null, undefined
// 相互に代入不可
const a: string = 'this is string';
const b: number = 3
const c: boolean = false

// # リテラル型
// 文字列、数値、真偽値のリテラル型がある
// リテラル型はプリミティブ型の部分型である（'foo'型はstring型に代入可能）
const a1: 'foo' = 'foo';
const b1: 0 = 0;
const c1: true = true;

// # リテラル型と型推論
const a3 = 'foo'; // aは'foo'型を持つ
let a4 = 'foo'; // aはstring型を持つ

// # オブジェクト型
interface MyObj {
    foo: string;
    bar: number;
}
const a5: MyObj = {
    foo: 'foo',
    bar: 3,
}

// 部分型も可能
interface MyObj2 {
    foo: string;
}
const b2: MyObj2 = a5;

// # 配列型
const foo: number[] = [0, 1, 2, 3];
foo.push(4);
console.log(foo);

// # 関数型
const f: (foo: string) => number = func;
function func(arg: string): number {
    return Number(arg);
}
console.log(f('4193'));
