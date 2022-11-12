import { EventEmitter } from "@/ver/ver/ver";
import { NodePath } from "@/core/NodePath";


export class Node extends EventEmitter {
	public static readonly MAX_NESTING: number = 10000;

	public get TYPE_NODE(): string { return this.constructor.name; }


	private _name: string = this.TYPE_NODE;
	private _owner: Node | null = null;

	private _parent_node: Node | null = null;
	private _child_nodes: Node[] = [];


	private _isLoaded: boolean = false;
	private _isInited: boolean = false;
	private _isExited: boolean = false;
	private _isReady: boolean = false;


	constructor(name?: string) {
		super();

		// if(name) this.name = name;
	}

	public set name(v: string) { this._name = v; }
	public get name(): string { return this._name; }

	public get owner(): Node | null { return this._owner; }
	public set owner(v: Node | null) { this._owner = v; }


	public get isLoaded(): boolean { return this._isLoaded; }
	public get isInited(): boolean { return this._isInited; }
	public get isExited(): boolean { return this._isExited; }
	public get isReady(): boolean { return this._isReady; }


	protected _enter_tree(): void {}
	protected _exit_tree(): void {}


	protected _init(): void {}
	protected _exit(): void {}

	protected async _load(): Promise<any> { return await Promise.resolve(); }

	protected _ready(): void {};
	protected _process(dt: number): void {};
	protected _render(): void {}


	public init(): void {
		if(this._isInited) return;

		this._init();
		this._isInited = true;

		this.emit('init');
	}

	public exit(): void {
		if(this._isExited) return;

		this._exit();
		this._isExited = true;

		this.emit('exit');
	}

	public async load(): Promise<any> {
		if(this._isLoaded) return Promise.resolve<string>('loaded-2');

		const promise = this._load();

		await promise;
		this._isLoaded = true;

		this.emit('load');

		return promise;
	}

	public ready(): void {
		if(!this._isLoaded || this._isReady) return;

		this._ready();
		this._isReady = true;

		this.emit('ready');
	}

	public process(dt: number): void {
		if(!this._isInited || !this._isReady) return;

		this._process(dt);
		this.emit('update', dt);
	}

	public render(): void {
		this._render();
		this.emit('render');
	}


	public isInsideTree(): boolean { return Boolean(this._parent_node); }


	public getPath(): string {
		let path = '';
		let p: Node | null = this;

		for(let i = 0; p && i < Node.MAX_NESTING; ++i) {
			path += p.name;
			p = p.getParent();
		}

		return path;
	}


	public getParent(): Node | null { return this._parent_node; }
	public getCheinParents<T = Node>(): T[] {
		let arr: T[] = [];
		let p = this;


		for(let i = 0; p = p.getParent() && i < Node.MAX_NESTING; ++i) {
			if(p) arr.push(p);
		}

		return arr;
	}


	// public getNode(path: string): Node {
	// 	const nodepath = NodePath.from(path);
 //
	// 	for(const id in this._child_nodes) {
	// 		if(id === nodepath.getName()) return true;
	// 	}
 //
	// 	return false;
	// }


	public hasChild(name: string): boolean {
		return false;
	}

	public hasNode(node: Node): boolean {
		for(let i = 0; i < this._child_nodes.length; ++i) {
			if(this._child_nodes[i] === node) return true;
		}

		return false;
	}


	public addChild(node: Node, name: string): this {
		if(this.hasChild(name)) throw new Error(`node with the same name "${name}" already exists`);
		if(node._parent_node) throw new Error(`this node has already been added to the tree along the path "${node.getPath()}"`);

		this._parent_node = this;
		this._child_nodes.push(node);

		return this;
	}


	public removeChild(node: Node): this {
		return this;
	}
}
