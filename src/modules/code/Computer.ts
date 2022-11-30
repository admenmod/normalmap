import { EventEmitter } from "@/core/Event";


class File {
	public data: string;

	constructor(data: string) {
		this.data = data;
	}

	public read(): string { return this.data; }
}


export class Computer extends EventEmitter {
	public files: { [K: string]: File } = {};

	constructor(firmware: string) {
		super();

		this.files['main'] = new File(firmware);
	}

	public run() {
		const code = this.files['main'].read();
		codeShell(code, { console }, 'main').call({});
	}
}
