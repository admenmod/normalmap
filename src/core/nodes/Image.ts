import { Event } from "../Event";
import { Vector2 } from "../Vector2";

export class Image extends HTMLImageElement {
	public static LoadEvent = class LoadEvent extends Event<Image, [Vector2]> {};

	public load_event = new Image.LoadEvent(this);

	constructor() {
		super();
	}
}

