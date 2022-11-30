import { Vector2 } from "@/core/Vector2";
import { BaseCore } from "@/modules/BaseCore";


const main_file = `
console.log('slla');
`;


const basecore = new BaseCore({
	firmware: main_file
});


console.log(basecore);


basecore.init();
