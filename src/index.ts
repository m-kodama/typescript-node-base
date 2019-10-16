import { on } from "cluster";

function printDivider(divider: string): string {
    return `\n${divider.repeat(60)}` ;
}

console.log(printDivider("-"));

// * プリミティブ型
// string, number, boolean, symbol, bigint, null, undefined
// 相互に代入不可
const a: string = 'this is string';
const b: number = 3
const c: boolean = false

// * リテラル型
// 文字列、数値、真偽値のリテラル型がある
// リテラル型はプリミティブ型の部分型である（'foo'型はstring型に代入可能）
const a1: 'foo' = 'foo';
const b1: 0 = 0;
const c1: true = true;

// ** リテラル型と型推論
const a3 = 'foo'; // aは'foo'型を持つ
let a4 = 'foo'; // aはstring型を持つ

// * オブジェクト型
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

// * 配列型
const foo: number[] = [0, 1, 2, 3];
foo.push(4);
console.log(foo);

// * 関数型
const f: (foo: string) => number = func;
function func(arg: string): number {
    return Number(arg);
}
console.log(f('4193'));

// ** 可変長引数
const f2 = (foo: number, ...bar: number[]) => bar;
console.log(f2(1, 2, 3, 4, 5));

// * void型
// void型はundefinedを入れることができる
// 戻り値がない関数、returnのみで戻る関数はundefinedを返す 
const a6: void = undefined;

// * any型
// どんな値でも代入可能
// 使ったら負け
const a7: any = 13
const a8: string = a7;

// * クラスの型
class Foo {
    bar(): void {
        console.log('BAR!!');
    }
}
const obj: Foo = new Foo();

// オブジェクト型で代替可能
interface MyFoo {
    bar: () => void;
}
const obj2: MyFoo = obj;

// * ジェネリクス
interface Foo2<S, T> {
    foo: S;
    bar: T;
}
const obj3: Foo2<number, string> = {
    foo: 3,
    bar: 'bar',
}

// 型推論される
function identity<T>(value: T): T {
    return value;
}
const value = identity(3);
const str: string = value;  // valueは3（リテラル型）に型推論されるので代入不可

// * タプル型
// 実態は配列 => 配列のメソッドが使えてしまう
const foo2: [string, number] = ['foo', 5];
foo2.push('bar');
foo2.pop();
// オプショナルな要素を持つタプル型もある
// オプショナル型は必ずそうでない型よりも後ろに書く
type StringAndOptionalNumber = [string, number?];
const t1: StringAndOptionalNumber = ['foo'];
const t2: StringAndOptionalNumber = ['foo', 3];

// ** タプル型と可変長引数
// タプル型を関数の可変用引数の型を表すのに使うことができる
type Args = [string, number, boolean];
const func2 = (...args: Args) => args[1];
const v = func2('foo', 4, true);

// ** 関数呼び出しのspreadとタプル型
const func3 = (...args: string[]) => args[0];
const strings: string[] = ['foo', 'bar', 'bax'];
func3(...strings);

const func4 = (str: string, num: number, b: boolean) => args2[0] + args2[1];
const args2: [string, number, boolean] = ['foo', 3, false];
func4(...args2);

// ** タプル型と可変長引数とジェネリクス
// extends:= 部分型でなければならない 型引数Uはany[]型の部分型でなければならない
function bind<T, U extends any[], R>(
    func: (args1: T, ...rest: U) => R,
    value: T,
): ((...args: U) => R) {
    return (...args: U) => func(value, ...args);
}
const add = (x: number, y: number) => x + y;
const add1 = bind(add, 1);
console.log(add1(5));   // => 6

// * union型（合併型）
// 複数の型のどれかに当てはまるような型
let value2: string | number = 'foo'; // value2はstring型かnumber型が入る
value2 = 10;
value2 = 'fo';
value2 = true;

// ** union型の絞り込み
// オブジェクト型のunion型を作った時、そのままでは両方の型に存在するプロパティしか参照できない
interface Hoge {
    foo: string;
    bar: number;
}
interface Piyo {
    foo: number;
    baz: boolean;
}

function useHogePiyo(obj: Hoge | Piyo): void {
    if ('bar' in obj) {
        // barプロパティがあるのはHoge型なのでここではobjはHoge型と判定される
        const hoge: Hoge = obj;
    } else {
        // barプロパティがないのでここではobjはPiyo型と判定される
        const piyo: Piyo = obj;
    }
}

// ** typeofを用いた絞り込み
function func5(value: string | number): number {
    if (typeof value === 'string') {
        // valueはstring型
        return value.length;
    } else {
        // valueはnumber型
        return value;
    }
}

// ** nullチェック
function func6(value: string | null): number {
    if (value != null) {
        // valueはnullではないのでstring型に絞り込まれる
        return value.length;
    } else {
        return 0;
    }
}
// ↓の書き方もできる
function func6a(value: string | null): number {
    return value !== null && value.length || 0
}

// ** 代数的データ型っぽいパターン
// オブジェクトに対してもいい感じにunion型を使いたい時に推奨されるパターン
interface Some<T> {
    type: 'Some';
    value: T;
}
interface None {
    type: 'None';
}
type Option<T> = Some<T> | None;

function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
    switch (obj.type) {
        case 'Some':
            return {
                type: 'Some',
                value: f(obj.value),
            };
        case 'None':
            return {
                type: 'None',
            };
    }
}
const number4: Option<number> = {
    type: 'Some',
    value: 4,
}
console.log(map(number4, (value: number) => value * value ));

// ** union型オブジェクトのプロパティ
type HogePiyo = Hoge | Piyo;
function getFoo(obj: HogePiyo): string | number {
    // obj.foo は string | number 型
    return obj.foo;
}

// * never型
// 属する値が存在しない型
// 部分型関係の一番下にある型
// ? 型安心を得るために使えそう
const n: never = 0;
// never型の型を作る方法がないのでdeclareで宣言だけする
declare const n1: never;
const foo3: string = n;

// * intersection型（交差型）
// T であり U である型
interface Hoge1 {
    foo: string;
    bar: number;
}
interface Piyo1 {
    foo: string;
    baz: boolean;
}
const obj4: Hoge1 & Piyo1 = {
    foo: 'foo',
    bar: 1,
    baz: true,
};

// ** union型を持つ関数との関係

// ** オブジェクト型再訪
// 修飾子「?」=> 省略可能なプロパティ
interface MyObj3 {
    foo: string;
    bar?: number;
}
let obj5: MyObj3 = { foo: '2' };
let obj6: MyObj3 = { foo: '2', bar: 2 };

// ! 「?」を使うと、自動的に undefined との union型になるので、型チェックが必要になる

// 修飾子「readonly」=> 再代入禁止
interface MyObj4 {
    readonly foo: string;
}
const obj7: MyObj4 = { foo: 'hey'};
obj7.foo = 'hello';

// ** インデックスシグネチャ
interface Dictionary {
    [key: string]: number;
}
const obj8: Dictionary = {};
const num1: number = obj8.foo;
const num2: number = obj8.bar;

// ! foo も bar も undefined になるため危険がある

// ** 関数シグネチャ
interface Func7 {
    (arg: number): void;
}
const f1: Func7 = (arg: number) => { console.log(arg); };

// オーバーロードが実現できる
interface Func8 {
    foo: string;
    (arg: number): void;
    (arg: string): string;
}

// ** newシグネチャ
interface Ctor<T> {
    new(): T;
}
class Foo4 {
    public bar: number | undefined;
}
const f4: Ctor<Foo4> = Foo4;

// * asによるダウンキャスト
// 型安全ではないのでどうしても必要な時以外は使うべきではない
function rand(): string | number {
    if (Math.random() < 0.5) {
        return 'hello';
    } else {
        return 123;
    }
}
const value4 = rand();
const str1 = value as number;
console.log(str1 * 10);

// * readonlyな配列とタプル
const arr: readonly number[] = [1, 2, 3];
const tuple: readonly [string, number] = ['google', 12344519];

// * as const
const obj9 = {
    foo: "213",
    bar: [1, 2, 4]
} as const;

// * object型と{}型
// object型:= プリミティブ以外の値の型
// {}型:= 何もプロパティがないオブジェクト型 undefinedとnull以外はなんでも受け入れてしまうとても弱い型

// *+ weak type
// オプショナルなプロパティ（?修飾子つきで宣言されたプロパティ）しかない型にも同様の問題がある
interface Options {
    foo?: string;
    bar?: number;
}
const obj10 = { hoge: 3 };
const obj11: Options = obj10;
const obj12: Options = 5;

// * unknown型
// 最弱の型　neverの逆　全ての型を部分関数としてもつ
// 何もできないからany型と違い安全
const u1: unknown = 3:
const u2: unknown = null;
const u3: unknown = (foo: string) => true;

// * typeof型
let foo5 = 'str';
type FooType = typeof foo5; // FooTypeはstringになる
const str2: FooType = 'egg';

// * keyof
//keyof T:= Tのプロパティ名全ての型
interface MyObj5 {
    foo: string;
    bar: number;
}
 let key: keyof MyObj5;
 key = 'foo';
 key = 'bar';
 key = 'baz';

 // * プロパティアクセス型 T[K]
 interface MyObj6 {
     foo: string;
     bar: number;
 }
 // strの型はstringになる
 const str4: MyObj6['foo'] = '123'

// * Mapped Types
// { [P in K]: T}  p: 型変数, KとT: 何らかの型 Kはstringの部分型である必要がある
// 「K型の値として可能な各文字列Pに対して、型Tを持つプロパティPが存在するようなオブジェクトの型」

// * Conditinal Types
