import { Canvas } from './canvas';
import './style.css';
import { distance_sq } from './utils';

const appCanvas = <HTMLCanvasElement>document.getElementById('app');
const start_dialog = document.getElementById('start');
const win_dialog = document.getElementById('win');
const lose_dialog = document.getElementById('lose');
const btn_start = document.getElementById('btn_start');

const width = 640;
const height = 480;
const player_y = height - 20;
const player_speed = 300;
const projectile_speed = 300;
const player_boost = 1.5;

type projectile = { x: number; y: number };

let enemies: { x: number; y: number }[] = [];
let enemies_distance = 0;
let enemies_direction = 1;
let hp_couner = 3;
let player_pos = width / 2;
let enemy_timer = null;

let player_projectile: projectile = null;
let enemy_projectiles: projectile[] = [];

let s = new Canvas(appCanvas);

function draw_enemy(s: Canvas, e: { x: number; y: number }) {
	if (!e) return;
	let { x, y } = e;

	s.fill('#bf616a');
	s.rect(x, y, 10, 10);
}

function update_enemies() {
	let delta_x = 0;
	let delta_y = 0;

	if (enemies_distance >= width - 555) {
		delta_y = 25;
		enemies_direction *= -1;
		enemies_distance = 0;
	} else {
		delta_x = 25;
		enemies_distance += 25;
	}

	enemies = enemies.map((e) => {
		if (Math.random() > 0.9) enemy_projectiles.push({ x: e.x, y: e.y });
		return { x: e.x + delta_x * enemies_direction, y: e.y + delta_y };
	});
}

s.setup = () => {
	s.resizeCanvas(width, height);
	for (let i = 1; i <= 20; i++)
		for (let j = 1; j <= 3; j++) enemies.push({ x: i * 25, y: j * 25 });
};

s.keyPressed = (e) => {
	if (e.code == 'Space') {
		if (!player_projectile) {
			player_projectile = { x: player_pos, y: player_y };
		}
	}
};

s.draw = (deltaTime) => {
	if (enemies.length <= 0) win();
	s.background('#2e3440');
	let dt = deltaTime / 1000;
	s.fill('#eceff4');
	s.rect(player_pos, player_y, 10, 10);

	for (let i = enemy_projectiles.length - 1; i >= 0; i--)
		if (enemy_projectiles[i].y > height + 5) enemy_projectiles.splice(i, 1);

	s.fill('#d08770');
	for (let i = enemy_projectiles.length - 1; i >= 0; i--) {
		enemy_projectiles[i].y += projectile_speed * dt;
		const p = enemy_projectiles[i];
		if (distance_sq(player_pos, player_y, p.x, p.y) < 15 ** 2) {
			enemy_projectiles.splice(i, 1);
			hp_couner--;
			if (hp_couner < 1) lose();
			continue;
		}
		s.rect(p.x, p.y, 5, 5);
	}
	enemies.forEach((e) => {
		if (distance_sq(e.x, e.y, player_pos, player_y) < 20 ** 2) lose();
		if (player_y <= e.y) lose();
		draw_enemy(s, e);
	});
	for (let i = 0; i < hp_couner; i++) {
		s.fill('#b48ead');
		s.rect(20 * (i + 1), 20, 7, 7);
	}

	if (s.isKeyDown('ArrowLeft') || s.isKeyDown('KeyA')) {
		player_pos -= player_speed * dt;
		if (player_pos < 10) player_pos = 10;
	}
	if (s.isKeyDown('ArrowRight') || s.isKeyDown('KeyD')) {
		player_pos += player_speed * dt;
		if (player_pos > width - 10) player_pos = width - 10;
	}

	if (player_projectile) {
		player_projectile.y -= projectile_speed * player_boost * dt;
		s.fill('#a3be8c');
		s.rect(player_projectile.x, player_projectile.y, 5, 5);
		for (let i = 0; i < enemies.length; i++) {
			const e = enemies[i];
			if (
				distance_sq(
					e.x,
					e.y,
					player_projectile.x,
					player_projectile.y
				) <
				15 ** 2
			) {
				enemies.splice(i, 1);
				player_projectile = null;
				break;
			}
		}

		if (player_projectile?.y < -5) player_projectile = null;
	}
};

function start() {
	s.start();
	if (enemy_timer) clearInterval(enemy_timer);
	enemy_timer = setInterval(update_enemies, 1000);
	appCanvas.className = '';
}

function stop() {
	s.running = false;
	clearInterval(enemy_timer);
	enemy_timer = null;
	appCanvas.className = 'hidden';
}

btn_start.onclick = () => {
	start_dialog.className = 'hidden';
	start();
};

function win() {
	win_dialog.className = '';
	stop();
}
function lose() {
	lose_dialog.className = '';
	stop();
}
