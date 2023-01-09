import { Vector2 } from '@/core/Vector2';
import { Node } from '@/core/nodes/Node';
import { Block } from '@/scenes/nodes/Block';
import { Node2D } from '@/core/nodes/Node2D';
import { GridMap } from '@/core/GridMap';
import { LayersList, touches, canvas, screenSize } from '@/global';
import { Touch } from '@/core/TouchesController';

// import '@/scenes/t';
// import '@/modules/main';


export class MainScene extends Node2D {
	public gridMap = new GridMap({
		tile: new Vector2(50, 50),
		size: screenSize.buf()
	});

	constructor() {
		super();

		let block = this.addChild(new Block(), 'Block');

		block.position.set(10, 10);
		block.size.set(200, 200);


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
	public touch1: Touch | null = null;
	public touch2: Touch | null = null;

	public fixpos = new Vector2();
	public fixscale = this.scale.buf();
	public fixposition = this.position.buf();
	public fixcenter = new Vector2();

	protected _process(dt: number): void {
		// motionByTouch.update(dt, touches, layers.main.camera);


		// this.position.set(this.fixpos.buf().add(this.touch1.dx, this.touch1.dy));


		if(this.touch1?.isSame(Vector2.ZERO) || this.touch2?.isSame(Vector2.ZERO)) return console.log('error');


		if(this.touch1 = touches.findTouch(t => t.id === 0) || this.touch1) {
			// if(this.touch1.isPress()) this.fixpos.set(this.position);

			if(this.touch2 = touches.findTouch(t => t.id === 1) || this.touch2) {
				let pos = this.touch1.buf().sub(this.touch2).abs();
				const center = this.touch1.buf().add(this.touch2).div(2);

				if(this.touch2.isPress()) {
					this.fixpos = this.touch1.buf().sub(this.touch2).abs();
					this.fixscale.set(this.scale);
					this.fixposition.set(this.position);
					this.fixcenter.set(center);
				}

				// console.log(this.fixpos.module, pos.module);
				this.scale.set(this.fixscale.buf().inc((pos.module / this.fixpos.module)));
				this.position.set(center.buf().sub(this.fixcenter));


				if(this.touch2.isUp()) this.touch1 = this.touch2 = null;
			}

			if(this.touch1?.isUp()) this.touch1 = this.touch2 = null;
		};
	}

	protected _render(layers: LayersList): void {
		layers.main.clearRect(0, 0, screenSize.x, screenSize.y);

		layers.main.save();
		layers.main.beginPath();

		let a = 30;
		layers.main.strokeStyle = '#ffff00';
		layers.main.moveTo(this.position.x, this.position.y-a);
		layers.main.lineTo(this.position.x, this.position.y+a);
		layers.main.moveTo(this.position.x-a, this.position.y);
		layers.main.lineTo(this.position.x+a, this.position.y);
		layers.main.stroke();
		layers.main.restore();

		// this.gridMap.draw(layers.main);
	}

	//========== Exit ==========//
	protected _exit(): void {
		console.log(this.name, 'exit');
	}
}
