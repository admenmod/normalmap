import { Event } from "@/core/Event";
import { NodePath } from "@/core/NodePath";
import { Node2D } from "./Node2D";
import { getInstanceOf, isInstanceOf } from '@/core/types';


class NodeEvent<
	Args extends any[] = any[],
	Class extends typeof Node = typeof Node,
> extends Event<getInstanceOf<Class>, Args> {
	public readonly name: keyof getInstanceOf<Class>;
	public readonly _class: Class;

	constructor(name: keyof getInstanceOf<Class>, _class: Class, _this: getInstanceOf<Class>) {
		super(_this);

		this.name = name;
		this._class = _class;
	}

	public emit(...args: Args): this {
		super.emit(...args);

		const chein = this._this.getChainParents(this._class);
		for(let i = 0; i < chein.length; ++i) {
			(chein[i][this.name] as NodeEvent<Args, Class>).emit(...args);
		}

		return this;
	}
}


export class Node {
	public static InitEvent = class InitEvent extends NodeEvent<[], typeof Node> {};
	public static ExitEvent = class ExitEvent extends NodeEvent<[], typeof Node> {};
	public static LoadEvent = NodeEvent<Node, []>;
	public static ReadyEvent = NodeEvent<Node, []>;
	public static ProcessEvent = NodeEvent<Node, [number]>;
	public static RenderEvent = NodeEvent<Node, [CanvasRenderingContext2D]>;

	public init_event = new Node.InitEvent(this, 'init_event');
	public exit_event = new Node.ExitEvent(this, 'exit_event');
	public load_event = new Node.LoadEvent(this, 'load_event');
	public ready_event = new Node.ReadyEvent(this, 'ready_event');
	public process_event = new Node.ProcessEvent(this, 'process_event');
	public render_event = new Node.RenderEvent(this, 'render_event');


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

		this.init_event.emit();
	}

	public exit(): void {
		if(this._isExited) return;

		this._exit();
		this._isExited = true;

		this.exit_event.emit();
	}

	public async load(): Promise<any> {
		if(this._isLoaded) return Promise.resolve<string>('loaded-2');

		const promise = this._load();

		await promise;
		this._isLoaded = true;

		this.load_event.emit();

		return promise;
	}

	public ready(): void {
		if(!this._isLoaded || this._isReady) return;

		this._ready();
		this._isReady = true;

		this.ready_event.emit();
	}

	public process(dt: number): void {
		if(!this._isInited || !this._isReady) return;

		this._process(dt);
		this.process_event.emit(dt);
	}

	public render(ctx: CanvasRenderingContext2D): void {
		this._render(ctx);
		this.render_event.emit(ctx);
	}


	public isInsideTree(): boolean { return Boolean(this._parent_node); }


	public getParent(): Node | null { return this._parent_node; }
	public getChainParents<T extends typeof Node = typeof Node>(Class: T): getInstanceOf<T>[] {
		let arr: getInstanceOf<T>[] = [];
		let p: Node | null = this;

		for(let i = 0; (p = p.getParent()) && i < Node.MAX_NESTING; ++i) {
			if(isInstanceOf(Class, p)) arr.push(p);
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

	public getChild<T extends Node = Node>(index: number): T {
		return this._child_nodes[index] as T;
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
		return this;
	}


	public getPath(): string {
		let path = '';
		let p: Node | null = this;

		for(let i = 0; p && i < Node.MAX_NESTING; ++i) {
			path += p.name;
			p = p.getParent();
		}

		return path;
	}
}
