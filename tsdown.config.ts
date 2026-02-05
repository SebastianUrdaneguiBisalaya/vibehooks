import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	dts: {
    sourcemap: false,
  },
	entry: 'src/index.ts',
  exports: {
    all: false
  },
	platform: 'browser',
  sourcemap: false,
	unbundle: false,
});
