import { Vector2 } from '@/ver/ver/ver';
import { Event, EventEmitter } from '@/core/Event';
import { Node } from '@/core/nodes/Node';
import { Node2D } from '@/core/nodes/Node2D';

import {
	touches, layers, screenSize,
	globalGridMap, motionByTouch
} from '@/modules/global_ns';


export class MainScene extends Node {
	// private static SUBNODES: typeof Node[] = [
	// 	Node2D
	// ];


	constructor(name?: string) {
		super(name);

		this.addChild(new Node2D(), 'Node2D');
		let node = this.getNode('Node2D');
		if(node) this.removeChild(node);

		// const systemInfoDrawObject = G.systemInfoDrawObject = {
		// 	textFPS: '',
		// 	textScreenSize: '',
	 //
		// 	padding: vec2(10, 10),
		// 	time: 0,
		// 	
		// 	update(dt) {
		// 		if(this.time > 100) {
		// 			this.textFPS = `FPS: ${(1000/dt).toFixed(2)}`;
		// 			this.textScreenSize = `Screen size: ${screenSize.x}, ${screenSize.y}`;
	 //
		// 			this.time = 0;
		// 		};
	 //
		// 		this.time += dt;
		// 	},
	 //
		// 	draw(ctx) {
		// 		ctx.save();
		// 		ctx.beginPath();
	 //
		// 		ctx.font = `18px arkhip, Arial`;
		// 		ctx.textBaseline = 'top';
	 //
		// 		ctx.strokeStyle = '#111111';
		// 		ctx.strokeText(this.textFPS, this.padding.x, this.padding.y);
		// 		ctx.fillStyle = '#eeeeee';
		// 		ctx.fillText(this.textFPS, this.padding.x, this.padding.y);
	 //
	 //
		// 		ctx.textAlign = 'end';
		// 		ctx.textBaseline = 'bottom';
	 //
		// 		ctx.strokeStyle = '#111111';
		// 		ctx.strokeText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);
		// 		ctx.fillStyle = '#eeeeee';
		// 		ctx.fillText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);
	 //
		// 		ctx.restore();
		// 	}
		// };

		console.log(`Initialize scene "${this.name}"`);
	}

	//========== Init ==========//
	protected _init(): void {
		console.log(`Scene: ${this.name}\nScreen size: ${screenSize.x}, ${screenSize.y}`);
	}


	//========== Update ==========//
	protected _process(dt: number): void {
		motionByTouch.update(dt, touches, layers.main.camera);

		layers.main.ctx.clearRect(0, 0, screenSize.x, screenSize.y);

		globalGridMap.draw(layers.main.ctx, layers.main.camera);


		// systemInfoDrawObject.update(dt);
		// systemInfoDrawObject.draw(layers.main.ctx);
	}

	//========== Exit ==========//
	protected _exit() {
		console.log(this.name, 'exit');
	}
}
