import { Vector2 } from '@/core/Vector2';
import { Node } from '@/core/nodes/Node';
import { Block } from '@/scenes/nodes/Block';
import { Node2D } from '@/core/nodes/Node2D';
import { GridMap } from '@/core/GridMap';
import { LayersList, touches, canvas, screenSize, camera, layers } from '@/global';
import { Player } from '@/scenes/nodes/Player';
import { Joystick } from '@/core/Joystick';
import type { Camera } from '@/core/Camera';

// import '@/scenes/t';
// import '@/modules/main';


export class MainScene extends Node2D {
	public gridMap = new GridMap({
		tile: new Vector2(50, 50),
		size: screenSize.buf()
	});

	public joystick = new Joystick();


	private systemInfoDrawObject = {
		textFPS: '',
		textScreenSize: '',

		padding: new Vector2(10, 10),
		time: 0,

		update(dt: number) {
			if(this.time > 100) {
				this.textFPS = `FPS: ${(1000/dt).toFixed(2)}`;
				this.textScreenSize = `Screen size: ${screenSize.x}, ${screenSize.y}`;

				this.time = 0;
			};

			this.time += dt;
		},

		draw(ctx: CanvasRenderingContext2D) {
			ctx.save();
			ctx.beginPath();

			ctx.font = `18px arkhip, Arial`;
			ctx.textBaseline = 'top';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textFPS, this.padding.x, this.padding.y);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textFPS, this.padding.x, this.padding.y);


			ctx.textAlign = 'end';
			ctx.textBaseline = 'bottom';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textScreenSize, screenSize.x - 10, screenSize.y - 10);

			ctx.restore();
		}
	};


	constructor() {
		super();

		camera.on('rescale', scale => this.gridMap.scale.set(scale));

		const player = this.addChild(new Player(), 'Player');

		const updateOnResize = (size: Vector2) => {
			this.joystick.pos.set(canvas.size.buf().sub(this.joystick.radius).sub(5 * canvas.vw, 5 * canvas.vh));
			this.joystick.syncPos();

			this.gridMap.size.set(size);
		};

		updateOnResize(screenSize);
		canvas['@resize'].on(updateOnResize);


		player.joystick = this.joystick;



		console.log(`Initialize scene "${this.name}"`);
	}

	//========== Init ==========//
	protected _init(): void {
		console.log(this.gridMap);
		
		console.log(`Scene: ${this.name}\nScreen size: ${screenSize.x}, ${screenSize.y}`);
	}

	//========== Update ==========//
	protected _process(dt: number): void {
		this.joystick.update(touches);

		const player = this.getNode<Player>('Player')!;

		camera.position.moveTime(
			player.position.buf()
			.sub(camera.size.buf().div(2).div(camera.scale))
			.add(player.size.buf().div(2))
		, 10);
		

		camera.process(dt, touches);


		this.systemInfoDrawObject.update(dt);
	}

	protected _render(layers: LayersList, camera: Camera): void {
		layers.main.clearRect(0, 0, screenSize.x, screenSize.y);

		layers.main.save();
		layers.main.beginPath();

		const center = this.position.buf().sub(camera.position).inc(camera.scale);

		let a = 30 * camera.scale.x;
		layers.main.strokeStyle = '#ffff00';
		layers.main.moveTo(center.x, center.y-a);
		layers.main.lineTo(center.x, center.y+a);
		layers.main.moveTo(center.x-a, center.y);
		layers.main.lineTo(center.x+a, center.y);
		layers.main.stroke();
		layers.main.restore();

		this.gridMap.draw(layers.main, camera.position.buf().inc(camera.scale));


		this.joystick.draw(layers.main);


		this.systemInfoDrawObject.draw(layers.main);
	}

	//========== Exit ==========//
	protected _exit(): void {
		console.log(this.name, 'exit');
	}
}
