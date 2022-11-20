import { Vector2 } from "@/core/Vector2";
import { Image } from "@/core/nodes/Image";
import { Node2D } from "@/core/nodes/Node2D";


export class Sprite2D extends Node2D {
	private _image = new Image();
	public get image(): Image { return this._image; }
	public set image(v: Image) { this._image = v }

	constructor(name?: string) {
		super(name);
	}

	setPath(src: string) {
		this.image.src = src;
	}
}
