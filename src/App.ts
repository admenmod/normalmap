import { TouchesController } from './core/TouchesController';
import { CanvasLayer } from './core/CanvasLayer';
import { MainLoop } from './core/MainLoop';
import { Viewport } from './core/nodes/Viewport';
import { MainScene } from './scenes/MainScene';


export class App {
	public static app = document.querySelector<HTMLDivElement>('#app');


	public static init(): void {
		if(!this.app) throw new Error('huy poymi chto sluchilos');

		const canvasLayer = new CanvasLayer();
		

		const touches = new TouchesController(canvasLayer);
		const mainLoop = new MainLoop();
		const viewport = new Viewport(canvasLayer);
		viewport.addChild(new MainScene());

		mainLoop.on('update', dt => {
			viewport.render();
			viewport.process(dt);
			touches.nullify();
		});

		mainLoop.start();

		viewport.ready().then(() => {
			viewport.init();
		});
	}
}
