type fn<a, b> = (_: a) => b;
type nilFn<a, b> = (_: a) => b | null | undefined;
interface Take<a> {
	andApply(): a;
	andApply<b>(f0: fn<a, b>): b;
	andApply<b, c>(f0: fn<a, b>, f1: fn<b, c>): c;
	andApply<b, c, d>(f0: fn<a, b>, f1: fn<b, c>, f2: fn<c, d>): d;
	andApply<b, c, d, e>(f0: fn<a, b>, f1: fn<b, c>, f2: fn<c, d>, f3: fn<d, e>): e;
	andApply<b, c, d, e, f>(f0: fn<a, b>, f1: fn<b, c>, f2: fn<c, d>, f3: fn<d, e>, f4: fn<e, f>): f;
	andApply<b, c, d, e, f, g>(
		f0: fn<a, b>,
		f1: fn<b, c>,
		f2: fn<c, d>,
		f3: fn<d, e>,
		f4: fn<e, f>,
		f5: fn<f, g>
	): g;
	andApply<b, c, d, e, f, g, h>(
		f0: fn<a, b>,
		f1: fn<b, c>,
		f2: fn<c, d>,
		f3: fn<d, e>,
		f4: fn<e, f>,
		f5: fn<f, g>,
		f6: fn<g, h>
	): h;
	andApply<b, c, d, e, f, g, h, i>(
		f0: fn<a, b>,
		f1: fn<b, c>,
		f2: fn<c, d>,
		f3: fn<d, e>,
		f4: fn<e, f>,
		f5: fn<f, g>,
		f6: fn<g, h>,
		f7: fn<h, i>
	): i;
	andApply<b, c, d, e, f, g, h, i, j>(
		f0: fn<a, b>,
		f1: fn<b, c>,
		f2: fn<c, d>,
		f3: fn<d, e>,
		f4: fn<e, f>,
		f5: fn<f, g>,
		f6: fn<g, h>,
		f7: fn<h, i>,
		f8: fn<i, j>
	): j;
	andApply<b, c, d, e, f, g, h, i, j, k>(
		f0: fn<a, b>,
		f1: fn<b, c>,
		f2: fn<c, d>,
		f3: fn<d, e>,
		f4: fn<e, f>,
		f5: fn<f, g>,
		f6: fn<g, h>,
		f7: fn<h, i>,
		f8: fn<i, j>,
		f9: fn<j, k>
	): k;
}
interface TakeUnsafe<a> {
	andSafelyApply(): a | null | undefined;
	andSafelyApply<b>(f0: nilFn<a, b>): b | null | undefined;
	andSafelyApply<b, c>(f0: nilFn<a, b>, f1: nilFn<b, c>): c | null | undefined;
	andSafelyApply<b, c, d>(f0: nilFn<a, b>, f1: nilFn<b, c>, f2: nilFn<c, d>): d | null | undefined;
	andSafelyApply<b, c, d, e>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>
	): e | null | undefined;
	andSafelyApply<b, c, d, e, f>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>
	): f | null | undefined;
	andSafelyApply<b, c, d, e, f, g>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>,
		f5: nilFn<f, g>
	): g | null | undefined;
	andSafelyApply<b, c, d, e, f, g, h>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>,
		f5: nilFn<f, g>,
		f6: nilFn<g, h>
	): h | null | undefined;
	andSafelyApply<b, c, d, e, f, g, h, i>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>,
		f5: nilFn<f, g>,
		f6: nilFn<g, h>,
		f7: nilFn<h, i>
	): i | null | undefined;
	andSafelyApply<b, c, d, e, f, g, h, i, j>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>,
		f5: nilFn<f, g>,
		f6: nilFn<g, h>,
		f7: nilFn<h, i>,
		f8: nilFn<i, j>
	): j | null | undefined;
	andSafelyApply<b, c, d, e, f, g, h, i, j, k>(
		f0: nilFn<a, b>,
		f1: nilFn<b, c>,
		f2: nilFn<c, d>,
		f3: nilFn<d, e>,
		f4: nilFn<e, f>,
		f5: nilFn<f, g>,
		f6: nilFn<g, h>,
		f7: nilFn<h, i>,
		f8: nilFn<i, j>,
		f9: nilFn<j, k>
	): k | null | undefined;
}

export const take: <a>(initialValue: a) => Take<a> = initialValue => ({
	andApply() {
		return Array.prototype.reduce.call(arguments, (acc, f) => f(acc), initialValue) as any;
	},
});

export const takeUnsafe: <a>(
	initialValue: a | null | undefined
) => TakeUnsafe<a> = initialValue => ({
	andSafelyApply() {
		return Array.prototype.reduce.call(
			arguments,
			(acc, f) => (acc == null ? acc : f(acc)),
			initialValue
		) as any;
	},
});
