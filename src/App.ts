import { MainLoop } from './core/MainLoop';
import { MainScene } from './scenes/MainScene';
import G, { layers, touches } from './modules/global_ns';
import { Viewport } from './core/nodes/Viewport';


export class App {
	public static init(): void {
		const mainLoop = new MainLoop();

		const viewport = new Viewport();
		const mainScene = viewport.addChild(new MainScene());

		G.viewport = viewport;

		mainLoop.on('update', dt => {
			viewport.render(layers.main.ctx);
			viewport.process(dt);
			touches.nullify();
		});

		mainLoop.start();

		mainScene.ready().then(() => {
			mainScene.init();
		});
	}
}
