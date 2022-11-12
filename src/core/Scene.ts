import { Child } from "../ver/ver/ver";
import { Node } from "./nodes/Node";


export interface IScene extends Child {
	readonly name: string;
}


export class Scene extends Node {
	constructor(name: string) {
		super(name);
	}
}
