import { GameLoop } from './modules/system_ns';
import { MainScene } from './scenes/MainScene';
import G, { touches } from './modules/global_ns';


export class App {
	public static init(): void {
		const gameLoop = new GameLoop();
		G.gameLoop = gameLoop;


		const mainScene = new MainScene('MainScene');

		gameLoop.on('update', (dt: number) => {
			mainScene.process(dt);
			touches.nullify();
		});

		gameLoop.start();

		mainScene.load().then(() => {
			mainScene.init();
			mainScene.ready();
		});
	}
}
