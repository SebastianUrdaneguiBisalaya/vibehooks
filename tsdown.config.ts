import { defineConfig } from 'tsdown';

export default defineConfig({
	clean: true,
	dts: true,
	entry: 'src/**/*.ts',
  exports: {
    all: true,
    customExports(pkg) {
      for (const [key, value] of Object.entries(pkg)) {
        if (typeof value === 'string' && value.endsWith('.js')) {
          const dts = value.replace(/\.js$/, '.d.ts');
          pkg[key] = {
            import: value,
            types: dts,
          };
        }
      }
      return pkg;
    },
  },
	platform: 'browser',
	unbundle: true,
});
