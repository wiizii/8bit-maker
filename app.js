const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const keyboard = {
	a: 'C3',
	s: 'D3',
	d: 'E3',
	f: 'F3',
	j: 'G3',
	k: 'A3',
	l: 'B3',
	';': 'C4',
};

const FREQUENCY_FOR_KEY = {
	C3: 130.8128,
	D3: 146.8324,
	E3: 164.8138,
	F3: 174.6141,
	G3: 195.9977,
	A3: 220.0,
	B3: 246.9417,
	C4: 261.6256,
};

let state = {
	volume: 0.5,
};

const makeNoteSound = (f) => {
	const oscillator = audioCtx.createOscillator(),
		gainNode = audioCtx.createGain();

	oscillator.connect(gainNode);
	oscillator.type = 'square';
	oscillator.frequency.value = f;

	gainNode.connect(audioCtx.destination);
	gainNode.gain.value = state.volume;
	gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 2);

	oscillator.start();
};

const volumeController = document.querySelector('.volume-controller__input');
volumeController.addEventListener('input', (e) => {
	const { target } = e;
	state.volume = parseFloat(target.value);
});

const NOTE_STATE = new Array(8);
for (let i = 0; i < 8; i++) {
	NOTE_STATE[i] = new Array(16);
	for (let j = 0; j < 16; j++) NOTE_STATE[i][j] = false;
}

const PANNEL = document.querySelector('.pannel');

const NOTE_LIST = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

for (let i = 0; i < NOTE_LIST.length; i++) {
	const NOTE_CONTAINER = document.createElement('div');
	NOTE_CONTAINER.classList.add('note-container');
	const NOTE = document.createElement('div');
	NOTE.classList.add('note');
	NOTE.textContent = NOTE_LIST[i];
	NOTE_CONTAINER.appendChild(NOTE);
	for (let j = 0; j < 16; j++) {
		const NOTE_BTN = document.createElement('div');
		NOTE_BTN.classList.add('note-btn');
		NOTE_CONTAINER.appendChild(NOTE_BTN);
		NOTE_BTN.addEventListener('click', () => {
			if (NOTE_STATE[i][j]) {
				NOTE_STATE[i][j] = false;
				NOTE_BTN.classList.remove('clicked');
			} else {
				NOTE_STATE[i][j] = true;
				NOTE_BTN.classList.add('clicked');
			}
		});
	}
	PANNEL.appendChild(NOTE_CONTAINER);
}

const START_BTN = document.querySelector('#start');
const STOP_BTN = document.querySelector('#stop');
let INTERVAL_ID;

START_BTN.addEventListener('click', () => {
	let time = 0;
	INTERVAL_ID = setInterval(() => {
		for (let i = 0; i < NOTE_LIST.length; i++) {
			if (NOTE_STATE[i][time]) {
				let note = NOTE_LIST[i];
				let frequency = FREQUENCY_FOR_KEY[note];
				makeNoteSound(frequency);
			}
		}
		time = (time + 1) % 16;
	}, 300);
});

STOP_BTN.addEventListener('click', () => {
	window.clearInterval(INTERVAL_ID);
});
