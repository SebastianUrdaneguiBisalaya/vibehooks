import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	dts: true,
	entry: 'src/**/*.ts',
  exports: {
    all: true,
  },
	platform: 'browser',
	unbundle: true,
});
