import { noop } from '../modulos/util';

test('[util] Noop function', () => {
    expect(noop()).toBe(undefined);
});
