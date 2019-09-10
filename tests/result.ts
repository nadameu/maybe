import {
	applyEither,
	either,
	Just,
	lift2,
	Maybe,
	maybe,
	Nothing,
	array,
	fold,
	foldableArray,
	monoidAdditive,
} from 'pure-ts';
import { take, takeUnsafe } from '..';
import { pipe } from '@typed/functions';

const reSigla = /^Sigla:\s*(\S+)\s*$/;

const query = <T extends Element>(selector: string) =>
	liftNullable((node: ParentNode) => node.querySelector<T>(selector));

const fromNullable = <a>(value: a | null | undefined): Maybe<a> =>
	value == null ? Nothing : Just(value);

const getFormulario = pipe(
	query<HTMLFormElement>('form[name="formulario"]'),
	either.note('Formulário não encontrado!')
);

const liftNullable = <args extends unknown[], b>(f: (...args: args) => b | null | undefined) => (
	...args: args
): Maybe<b> => fromNullable(f(...args));

const nextSibling = liftNullable((node: Node) => node.nextSibling);
const textContent = liftNullable((node: Node) => node.textContent);
const isFalsy = <a>(x: a): boolean => Boolean(x);

const tap = <a>(f: (_: a) => void) => (a: a): a => {
	f(a);
	return a;
};

const getDominio = pipe(
	query('[name="local"]:checked'),
	either.note('Não foi selecionado local!'),
	either.bind(
		pipe(
			nextSibling,
			maybe.bind(textContent),
			maybe.map(
				pipe(
					x => x.trim(),
					x => x.toLowerCase()
				)
			),
			maybe.filter(isFalsy),
			either.note('Local selecionado não possui texto!')
		)
	)
);

const template = document.createElement('template');
template.innerHTML = ' [ <a href="" target="_blank">Abrir na Intra</a> ]';
const content = template.content;
const link = content.querySelector('a')!;

const makeReducer = (dominio: string) => (node: Node) =>
	take(node).andApply(
		textContent,
		maybe.bind(x => fromNullable(reSigla.exec(x))),
		maybe.maybe(0)(x => {
			link.href = 'https://intra.trf4.jus.br/membros/' + x[1].toLowerCase() + dominio + '-jus-br';
			const fragment = document.importNode(content, true);
			takeUnsafe(node).andSafelyApply(
				x => x.parentNode,
				x => x.insertBefore(fragment, node.nextSibling)
			);
			return 1;
		})
	);
const compose = <b, c>(f: (_: b) => c) => <a>(g: (_: a) => b) => (x: a) => f(g(x));
const thrush = <a>(a: a) => <b>(f: (_: a) => b): b => f(a);

const main = (doc: HTMLDocument) =>
	thrush(getFormulario(doc))(
		thrush(getDominio(doc))(
			lift2(applyEither)(dominio => formulario => {
				const reducer = makeReducer(dominio);
				let list = [] as Node[];
				for (let node = formulario.nextSibling; node !== null; node = node.nextSibling) {
					list.push(node);
				}
				let qtd = take(list).andApply(
					array.bind(node =>
						node instanceof Element && node.matches('table')
							? take(node).andApply(
									query('td:nth-child(2)'),
									maybe.map(x => x.childNodes),
									maybe.map(xs => Array.from(xs)),
									maybe.fromMaybe([] as ChildNode[])
							  )
							: [node]
					),
					array.map(reducer),
					fold(foldableArray)(monoidAdditive)
				);
				const s = qtd > 1 ? 's' : '';
				return qtd + ' ' + ('link' + s) + ' ' + ('criado' + s);
			})
		)
	);

thrush(main(document))(
	either.either(e => {
		console.error('Erro:', e);
	})(x => {
		console.log('Resultado:', x);
	})
);
