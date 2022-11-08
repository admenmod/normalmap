import { Child, Vector2 } from "../../ver/ver/ver";
import { Node } from "./Node";


export class Node2D extends Node {
	public readonly position: Vector2;

	constructor(name: string) {
		super(name);

		this.position = new Vector2();
	}
}
