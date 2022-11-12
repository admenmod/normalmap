import { Vector2 } from "@/core/Vector2";
import { Node } from "@/core/nodes/Node";


export class Node2D extends Node {
	public readonly position: Vector2;

	constructor(name?: string) {
		super(name);

		this.position = new Vector2();
	}
}
