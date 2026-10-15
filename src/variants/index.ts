import { a } from './a';
import { b } from './b';
import { c } from './c';
export type { Variant } from './types';

/** All variants, in the order they appear on the index page. */
export const variants = [a, b, c];

/** Variants with pages to build. */
export const builtVariants = variants.filter(v => v.status === 'ready');
