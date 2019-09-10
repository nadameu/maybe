import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
	input: 'tests/result.ts',
	output: {
		file: 'bundle.js',
		format: 'iife',
	},
	plugins: [resolve(), commonjs(), typescript()],
};
