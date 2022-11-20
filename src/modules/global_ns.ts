import { vec2, Vector2, CanvasLayer, CameraImitationCanvas } from '../ver/ver/ver';
import { TouchesController } from '../ver/touches-controller/touches-controller';
import { GridMap, MotionByTouch, GameLoop } from './system_ns';


//========== global variables ==========//
export const canvas: CanvasLayer = document.querySelector<CanvasLayer>('.canvas')!;

export const touches = new TouchesController(canvas);


export const layers: { [id: string]: CameraImitationCanvas } = {};

for(let id in canvas.layers) {	
	layers[id] = new CameraImitationCanvas(canvas.layers[id].getContext('2d'));
};


export const screenSize = vec2().set(canvas.size);


canvas.em.on('resize', () => {
	screenSize.set(canvas.size);

	globalGridMap.size.set(screenSize);
});


//========== global objects ==========//
export const motionByTouch = new MotionByTouch();
export const globalGridMap = new GridMap({ size: screenSize, coordinates: true });



canvas.addEventListener('dblclick', () => canvas.requestFullscreen());


const G: object = { canvas, touches, layers, screenSize, motionByTouch, globalGridMap };
export default G;
