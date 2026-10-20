import { a } from './a';
import { b } from './b';
import { c } from './c';
import { d } from './d';
import { e } from './e';
import { f } from './f';
import { g } from './g';
import { h } from './h';
export type { Variant } from './types';

/** All variants, in the order they appear on the index page. */
export const variants = [a, b, c, d, e, f, g, h];

/** Variants with pages to build. */
export const builtVariants = variants.filter(v => v.status === 'ready');
