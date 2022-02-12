export class Canvas {
	#canvas: HTMLCanvasElement;
	#context: CanvasRenderingContext2D;
	#lastFrameTime: number;
	#keys: Record<string, boolean> = {};
	running: boolean = false;
	setup: () => void;
	draw: (deltaTime: number) => void;
	keyPressed: (e: KeyboardEvent) => void;

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
		this.#context = canvas.getContext('2d');
		document.onkeydown = this.#keydown.bind(this);
		document.onkeyup = this.#keyup.bind(this);
	}

	fill(color: string) {
		this.#context.fillStyle = color;
	}

	rect(x: number, y: number, width: number, height: number) {
		this.#context.fillRect(x - width, y - height, width * 2, height * 2);
	}

	background(color: string) {
		this.fill(color);
		this.rect(0, 0, this.#canvas.width, this.#canvas.height);
	}

	isKeyDown(code: string): boolean {
		return this.#keys[code] ?? false;
	}

	start() {
		if (this.running) return;
		this.running = true;
		this.setup();
		this.#loop();
		this.#lastFrameTime = performance.now();
	}

	resizeCanvas(width: number, height: number) {
		this.#canvas.width = width;
		this.#canvas.height = height;
	}

	#loop() {
		let currentTime = performance.now();
		let deltaTime = currentTime - this.#lastFrameTime;
		this.#lastFrameTime = currentTime;
		if (this.running) {
			requestAnimationFrame(this.#loop.bind(this));
		}
		this.draw(deltaTime);
	}

	#keydown(e: KeyboardEvent) {
		this.#keys[e.code] = true;
		if (this.running) this.keyPressed(e);
	}
	#keyup(e: KeyboardEvent) {
		this.#keys[e.code] = false;
	}
}
