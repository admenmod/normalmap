import { Event, EventTarget } from "@/core/Event";
import { NodePath } from "@/core/NodePath";
import { getInstanceOf, isInstanceOf } from '@/core/types';


export class Node extends EventTarget {
	public '@init' = new Event<this, []>(this);
	public '@exit' = new Event<this, []>(this);
	public '@load' = new Event<this, []>(this);
	public '@ready' = new Event<this, []>(this);

	public '@process' = new Event<this, [number]>(this);
	public '@render' = new Event<this, [CanvasRenderingContext2D]>(this);


	public static readonly MAX_NESTING: number = 10000;

	public get NODE_TYPE(): string { return this.constructor.name; }


	private _name: string = this.NODE_TYPE;
	private _owner: Node | null = null;

	protected _parent_node: Node | null = null;
	protected _child_nodes: Node[] = [];


	private _isLoaded: boolean = false;
	private _isInited: boolean = false;
	private _isExited: boolean = false;
	private _isReady: boolean = false;


	constructor(name?: string) {
		super();
		if(name) this.name = name;
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
	protected _render(ctx: CanvasRenderingContext2D): void {}


	public init(): void {
		if(this._isInited) return;

		this._init();
		this._isInited = true;

		(this as Node).emit('init');
	}

	public exit(): void {
		if(this._isExited) return;

		this._exit();
		this._isExited = true;

		(this as Node).emit('exit');
	}

	public async load(): Promise<any> {
		if(this._isLoaded) return Promise.resolve<string>('loaded-2');

		const promise = this._load();

		await promise;
		this._isLoaded = true;

		(this as Node).emit('load');

		return promise;
	}

	public ready(): void {
		if(!this._isLoaded || this._isReady) return;

		this._ready();
		this._isReady = true;

		(this as Node).emit('ready');
	}

	public process(dt: number): void {
		if(!this._isInited || !this._isReady) return;

		this._process(dt);


		(this as Node).emit('process', dt);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this._render(ctx);
		(this as Node).emit('render', ctx);
	}



	public isInsideTree(): boolean { return Boolean(this._parent_node); }


	public getParent(): Node | null { return this._parent_node; }
	public getChainParents<T extends typeof Node = typeof Node>(Class: T): getInstanceOf<T>[] {
		let arr: getInstanceOf<T>[] = [];
		let p: Node | null = this;

		for(let i = 0; (p = p.getParent()) && i < Node.MAX_NESTING; ++i) {
			if(isInstanceOf(p, Class)) arr.push(p);
		}

		return arr;
	}


	public hasChild(name: string): boolean {
		for(let i = 0; i < this._child_nodes.length; i++) {
			if(this._child_nodes[i].name === name) return true;
		}

		return false;
	}

	public hasNode(node: Node): boolean {
		for(let i = 0; i < this._child_nodes.length; ++i) {
			if(this._child_nodes[i] === node) return true;
		}

		return false;
	}

	public getCountChildren(): number { return this._child_nodes.length; }
	public getChild<T extends Node = Node>(index: number): T {
		return this._child_nodes[index] as T;
	}

	public getNode(path: string): Node | null {
		const nodepath = NodePath.from(path);

		for(let i = 0; i < this._child_nodes.length; i++) {
			if(this._child_nodes[i].name === nodepath.getName(0)) return this._child_nodes[i];
		}

		return null;
	}

	public addChild(node: Node, name: string = node.name): this {
		if(this.hasChild(name)) throw new Error(`node with the same name "${name}" already exists`);
		if(node._parent_node) throw new Error(`this node has already been added to the tree along the path "${node.getPath()}"`);

		node._parent_node = this;
		node.name = name;
		this._child_nodes.push(node);

		return this;
	}

	public removeChild(node: Node): this {
		let l = this._child_nodes.indexOf(node);

		if(~l) console.error('this node is not a child');
		this._child_nodes.splice(l, 1);

		return this;
	}


	public getPath(): NodePath {
		let path = '';
		let p: Node | null = this;

		for(let i = 0; p && i < Node.MAX_NESTING; ++i) {
			path += '/'+p.name;
			p = p.getParent();
		}

		return new NodePath(path);
	}
}


let aaa = new Node();

aaa.emit('process', 8);

aaa.on('process', function(dt) {
	dt;
});
