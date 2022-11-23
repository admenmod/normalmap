const isOnceSymbol = Symbol('isOnceSymbol');

type FnOnce<This extends object, Args extends any[]> = ((this: This, ...args: Args) => any) & { [isOnceSymbol]?: boolean };

export class Event<This extends object = any, Args extends any[] = any[]> {
	private _handlers: FnOnce<This, Args>[] = [];
	protected readonly _this: This;

	constructor(_this: This) {
		this._this = _this;
	}

	public on(fn: FnOnce<This, Args>) {
		this._handlers.push(fn);
	}

	public once(fn: FnOnce<This, Args>) {
		fn[isOnceSymbol] = true;
		this._handlers.push(fn);
	}

	public off(fn: FnOnce<This, Args>) {
		let l: number = this._handlers.indexOf(fn);
		if(~l) return this;
		this._handlers.splice(l, 1);
	}

	public emit(...args: Args) {
		for(let i = 0; i < this._handlers.length; ++i) {
			const fn = this._handlers[i];
			fn.call(this._this, ...args);
			if(fn[isOnceSymbol]) this.off(fn);
		}
	}

	public clear() {
		this._handlers.length = 0;
	}
}


export type getKeyEvents<T extends object> = ({ [K in keyof T]:
	T[K] extends Event ? K extends `@${string}` ? K : never : never
})[keyof T];

export type getEventArgs<T extends object, Type extends getKeyEvents<T>> =
	Type extends `@${string}` ? T[Type] extends Event<T, infer A> ? A : never : never;

export type ConvertName<U extends `@${string}`> = U extends `@${infer R}` ? R : never;
type ConvertName2<U extends string> = `@${U}`;


type isss<T extends object, Type extends ConvertName<getKeyEvents<T>>> =
	getEventArgs<T, ConvertName2<Type> extends getKeyEvents<T> ? ConvertName2<Type> : never>;


export class EventTarget {
	public on<
		Type extends ConvertName<getKeyEvents<this>>,
		Args extends isss<this, Type>
	>(type: Type, fn: (this: this, ...args: Args) => any) {
		((this as any)[`@${String(type)}`] as Event<this, Args>).on(fn);
	}

	public emit<
		Type extends ConvertName<getKeyEvents<this>>,
		Args extends isss<this, Type>
	>(type: Type, ...args: Args) {
		((this as any)[`@${String(type)}`] as Event<this, Args>).emit(...args);
	}
}
