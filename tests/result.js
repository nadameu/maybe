'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const pure_ts_1 = require('pure-ts');
const R = require('ramda');
const __1 = require('..');
const reSigla = /^Sigla:\s*(\S+)\s*$/;
const query = selector => liftNullable(node => node.querySelector(selector));
const fromNullable = value => (value == null ? pure_ts_1.Nothing : pure_ts_1.Just(value));
const getFormulario = R.pipe(
	query('form[name="formulario"]'),
	pure_ts_1.either.note('Formulário não encontrado!')
);
const liftNullable = f => (...args) => fromNullable(f(...args));
const nextSibling = liftNullable(node => node.nextSibling);
const textContent = liftNullable(node => node.textContent);
const isFalsy = x => Boolean(x);
const tap = f => a => {
	f(a);
	return a;
};
const getDominio = R.pipe(
	query('[name="local"]:checked'),
	pure_ts_1.either.note('Não foi selecionado local!'),
	pure_ts_1.either.bind(
		R.pipe(
			nextSibling,
			pure_ts_1.maybe.bind(textContent),
			pure_ts_1.maybe.map(
				R.pipe(
					R.trim,
					R.toLower
				)
			),
			pure_ts_1.maybe.filter(isFalsy),
			pure_ts_1.either.note('Local selecionado não possui texto!')
		)
	)
);
const template = document.createElement('template');
template.innerHTML = ' [ <a href="" target="_blank">Abrir na Intra</a> ]';
const content = template.content;
const link = content.querySelector('a');
const makeReducer = dominio => node =>
	__1.take(node).andApply(
		textContent,
		pure_ts_1.maybe.bind(
			R.compose(
				fromNullable,
				reSigla.exec
			)
		),
		pure_ts_1.maybe.maybe(0)(x => {
			link.href = 'https://intra.trf4.jus.br/membros/' + x[1].toLowerCase() + dominio + '-jus-br';
			const fragment = document.importNode(content, true);
			__1
				.takeUnsafe(node)
				.andSafelyApply(x => x.parentNode, x => x.insertBefore(fragment, node.nextSibling));
			return 1;
		})
	);
const main = doc =>
	R.applyTo(getFormulario(doc))(
		R.applyTo(getDominio(doc))(
			pure_ts_1.lift2(pure_ts_1.applyEither)(dominio => formulario => {
				const reducer = makeReducer(dominio);
				let qtd = __1
					.take(
						R.unfold(
							node => (node === null ? false : [node, node.nextSibling]),
							formulario.nextSibling
						)
					)
					.andApply(
						R.chain(node =>
							node instanceof Element && node.matches('table')
								? __1
										.take(node)
										.andApply(
											query('td:nth-child(2)'),
											pure_ts_1.maybe.map(x => x.childNodes),
											pure_ts_1.maybe.map(xs => Array.from(xs)),
											pure_ts_1.maybe.fromMaybe([])
										)
								: [node]
						),
						R.map(reducer),
						R.sum
					);
				const s = qtd > 1 ? 's' : '';
				return qtd + ' ' + ('link' + s) + ' ' + ('criado' + s);
			})
		)
	);
R.applyTo(main(document))(
	pure_ts_1.either.either(e => {
		console.error('Erro:', e);
	})(x => {
		console.log('Resultado:', x);
	})
);
