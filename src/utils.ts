export function distance_sq(x1: number, y1: number, x2: number, y2: number) {
	return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt(distance_sq(x1, y1, x2, y2));
}
