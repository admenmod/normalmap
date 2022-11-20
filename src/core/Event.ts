const isOnceSymbol = Symbol('isOnceSymbol');


type FnOnce<This extends object, Args extends any[]> = ((this: This, ...args: Args) => any) & { [isOnceSymbol]?: boolean };


export class Event<This extends object = object, Args extends any[] = any[]> {
	private _handlers: FnOnce<This, Args>[] = [];
	protected readonly _this: This;

	constructor(_this: This) {
		this._this = _this;
	}

	public on(fn: FnOnce<This, Args>): this {
		this._handlers.push(fn);
		return this;
	}

	public once(fn: FnOnce<This, Args>): this {
		fn[isOnceSymbol] = true;
		this._handlers.push(fn);
		return this;
	}

	public off(fn: FnOnce<This, Args>): this {
		let l: number = this._handlers.indexOf(fn);
		if(~l) return this;
		this._handlers.splice(l, 1);
		return this;
	}

	public emit(...args: Args): this {
		for(let i = 0; i < this._handlers.length; ++i) {
			const fn = this._handlers[i];
			fn.call(this._this, ...args);
			if(fn[isOnceSymbol]) this.off(fn);
		}
		return this;
	}

	public clear(): this {
		this._handlers.length = 0;
		return this;
	}
}


class MyEvent<This extends object = object> extends Event<This, [number, string]> {
	constructor(_this: This) {
		super(_this);
	}
}


class Aclass {
	public myEvent = new MyEvent(this);
}


let a = new Aclass();

a.myEvent;

a.myEvent.on(function() {
	this.myEvent;
});

a.myEvent.emit(3, 's');
