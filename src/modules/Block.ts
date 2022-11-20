import { Node2D } from "@/core/nodes/Node2D";
import { Sprite2D } from "@/core/nodes/Sprite2D";


export class Block extends Node2D {
	constructor() {
		super();

		this.addChild(new Sprite2D(), 'Sprite2D');
	}
}
