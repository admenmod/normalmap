import { vec2, Vector2 } from '../core/Vector2';
import { CanvasLayer } from '../core/CanvasLayer';
import { CameraImitationCanvas } from '../core/CameraImitationCanvas';
import { TouchesController } from '../core/TouchesController';
import { GridMap } from '../core/GridMap';
import { MotionByTouch } from '../core/MotionByTouch';


//========== global variables ==========//
export const canvas: CanvasLayer = document.querySelector<CanvasLayer>('.canvas')!;

export const touches = new TouchesController(canvas);


export const layers: { [id: string]: CameraImitationCanvas } = {};

for(let id in canvas.layers) {	
	layers[id] = new CameraImitationCanvas(canvas.layers[id].getContext('2d')!);
};


export const screenSize = vec2().set(canvas.size);


canvas['@resize'].on(() => {
	screenSize.set(canvas.size);

	globalGridMap.size.set(screenSize);
});


//========== global objects ==========//
export const motionByTouch = new MotionByTouch();
export const globalGridMap = new GridMap({ size: screenSize, coordinates: true });



canvas.addEventListener('dblclick', () => canvas.requestFullscreen());


const G: any = { canvas, touches, layers, screenSize, motionByTouch, globalGridMap };
export default G;
