export function codeShell(
	code: string | ((...args: any) => any) = '',
	env: object = Object.create(null),
	p: {
		insulate?: boolean;
		source?: string
	} = {}
): () => void {
	if(p.insulate ?? true) {
		env = new Proxy(env, {
			has: () => true,
			get: (target, key, receiver) => key === Symbol.unscopables ? void 0 : Reflect.get(target, key, receiver)
		});
	};

	if(typeof code !== 'string') code = code.toString().replace(/^function.+?\{(.*)\}$/s, '$1');
	return function() { eval(`with(env) {${code}}; //# sourceURL=${p.source || 'code'}`); };
};
