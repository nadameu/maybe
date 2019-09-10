import { Just, Maybe, Nothing } from './definitions';

export const maybe = <a, b>(Nothing: b, Just: (value: a) => b): ((fa: Maybe<a>) => b) => fa =>
	fa.isNothing ? Nothing : Just(fa.value);

export const bind: <a, b>(f: (_: a) => Maybe<b>) => (fa: Maybe<a>) => Maybe<b> = f =>
	maybe(Nothing, f);

export const map: <a, b>(f: (_: a) => b) => (fa: Maybe<a>) => Maybe<b> = f => bind(x => Just(f(x)));

export const fromNullable: <a>(a: a | null | undefined) => Maybe<a> = a =>
	a == null ? Nothing : Just(a);

export const mapNullable: <a, b>(
	f: (_: a) => b | null | undefined
) => (fa: Maybe<a>) => Maybe<b> = f => bind(x => fromNullable(f(x)));

export const apply: <a, b>(ff: Maybe<(_: a) => b>) => (fa: Maybe<a>) => Maybe<b> = ff => fa =>
	bind<(_: any) => unknown, any>(f => map(f)(fa))(ff);

export const pure: <a>(a: a) => Maybe<a> = Just;

export const empty = <a = never>(): Maybe<a> => Nothing;

export const alt: <a>(fx: Maybe<a>) => (fy: Maybe<a>) => Maybe<a> = fx => fy =>
	fx.isNothing ? fy : fx;

export const fromMaybe: <a>(a: a) => (fa: Maybe<a>) => a = a => maybe(a, x => x);

export const maybeBool: {
	<a, b extends a>(p: (x: a) => x is b): (_: a) => Maybe<b>;
	<a>(p: (_: a) => boolean): (_: a) => Maybe<a>;
} = (p => x => (p(x) ? Just(x) : Nothing)) as <a>(p: (_: a) => boolean) => (_: a) => Maybe<a>;

export const filter: {
	<a, b extends a>(p: (x: a) => x is b): (fa: Maybe<a>) => Maybe<b>;
	<a>(p: (_: a) => boolean): (fa: Maybe<a>) => Maybe<a>;
} = (p => bind(maybeBool(p))) as <a>(p: (_: a) => boolean) => (fa: Maybe<a>) => Maybe<a>;

export const toIterable: <a>(fa: Maybe<a>) => Iterable<a> = fa => ({
	*[Symbol.iterator]() {
		if (fa.isJust) yield fa.value;
	},
});

export const catchError: <a>(f: () => Maybe<a>) => (fa: Maybe<a>) => Maybe<a> = f => fa =>
	fa.isNothing ? f() : fa;

export const lift2 = <a, b, c>(fa: Maybe<a>, fb: Maybe<b>, f: (a: a, b: b) => c): Maybe<c> =>
	fa.isJust && fb.isJust ? Just(f(fa.value, fb.value)) : Nothing;

interface Monoid<b> {
	append: (_: b) => (_: b) => b;
	mempty: () => b;
}

export const foldMap: <b>(monoid: Monoid<b>) => <a>(f: (_: a) => b) => (fa: Maybe<a>) => b = ({
	mempty,
}) => f => fa => (fa.isNothing ? mempty() : f(fa.value));
export const fold: <a>(monoid: Monoid<a>) => (fa: Maybe<a>) => a = monoid =>
	foldMap(monoid)(x => x);

interface Types<a> {
	Maybe: Maybe<a>;
}
type Type<f, a> = f extends keyof Types<never> ? Types<a>[f] : never;
interface Functor<f> {
	map: <a, b>(f: (_: a) => b) => (fa: Type<f, a>) => Type<f, b>;
}
interface Apply<f> extends Functor<f> {
	apply: <a, b>(ff: Type<f, (_: a) => b>) => (fa: Type<f, a>) => Type<f, b>;
}
interface Applicative<f> extends Apply<f> {
	pure: <a>(a: a) => Type<f, a>;
}

export const traverse: <f>(
	applicative: Applicative<f>
) => <a, b>(f: (_: a) => Type<f, b>) => (fa: Maybe<a>) => Type<f, Maybe<b>> = ({
	map,
	pure,
}) => f => fa => (fa.isNothing ? pure(Nothing) : map(Just)(f(fa.value)));
export const sequence: <f>(
	applicative: Applicative<f>
) => <a>(fa: Maybe<Type<f, a>>) => Type<f, Maybe<a>> = applicative => traverse(applicative)(x => x);

export const applicative = { apply, map, pure } as Applicative<'Maybe'>;

export { bind as chain, bind as flatMap, pure as of, apply as ap };
