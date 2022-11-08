import { Child } from "../../ver/ver/ver";


export class Node extends Child {
	public readonly name: string;

	public get TYPE_NODE(): string { return this.constructor.name; }

	protected _isLoaded: boolean = false;
	protected _isInited: boolean = false;
	protected _isExited: boolean = false;
	protected _isReady: boolean = false;

	public get isLoaded(): boolean { return this._isLoaded; }
	public get isInited(): boolean { return this._isInited; }
	public get isExited(): boolean { return this._isExited; }
	public get isReady(): boolean { return this._isReady; }

	constructor(name: string) {
		super();

		this.name = name;
	}


	protected _oninit(): void {}
	protected _onexit(): void {}

	protected async _onload(): Promise<any> { return await Promise.resolve(); }

	protected _onready(): void {};
	protected _onupdate(dt: number): void {};
	protected _onrender(): void {}


	public init(): void {
		if(this._isInited) return;

		this._oninit();
		this._isInited = true;

		this.emit('init');
	}

	public exit(): void {
		if(this._isExited) return;

		this._onexit();
		this._isExited = true;

		this.emit('exit');
	}

	public async load(): Promise<any> {
		if(this._isLoaded) return Promise.resolve<string>('loaded-2');

		const promise = this._onload();

		await promise;
		this._isLoaded = true;

		this.emit('load');

		return promise;
	}

	public ready(): void {
		if(!this._isLoaded || this._isReady) return;

		this._onready();
		this._isReady = true;

		this.emit('ready');
	}

	public update(dt: number): void {
		if(!this._isInited || !this._isReady) return;

		this._onupdate(dt);
		this.emit('update', dt);
	}

	public render(): void {
		this._onrender();
		this.emit('render');
	}
}
