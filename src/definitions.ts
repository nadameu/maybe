export type Maybe<a> = Just<a> | Nothing;

export interface Just<a> {
	readonly isJust: true;
	readonly isNothing: false;
	readonly value: a;
}
export function Just<a>(value: a): Just<a> {
	return { isJust: true, isNothing: false, value };
}

export interface Nothing {
	readonly isJust: false;
	readonly isNothing: true;
}
export const Nothing: Nothing = { isJust: false, isNothing: true };
