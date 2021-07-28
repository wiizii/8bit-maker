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

const NOTE_LIST = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

const NUMBER_OF_CELL = 32;

let mainController = {
	volume: 0.5,
};

const makeNoteSound = (f) => {
	const oscillator = audioCtx.createOscillator(),
		gainNode = audioCtx.createGain();

	oscillator.connect(gainNode);
	oscillator.type = 'square';
	oscillator.frequency.value = f;

	gainNode.connect(audioCtx.destination);
	gainNode.gain.value = mainController.volume;
	gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 2);

	oscillator.start();
};

const volumeController = document.querySelector('.volume-controller__input');
volumeController.addEventListener('input', (e) => {
	const { target } = e;
	mainController.volume = parseFloat(target.value);
});

const NOTE_STATE = new Array(NOTE_LIST.length);

for (let i = 0; i < NOTE_LIST.length; i++) {
	NOTE_STATE[i] = new Array(NUMBER_OF_CELL);
}

const pannel = document.querySelector('.pannel');

for (let i = 0; i < NOTE_LIST.length; i++) {
	const noteContainer = document.createElement('div');
	noteContainer.classList.add('note-container');
	const noteName = document.createElement('div');
	noteName.classList.add('note-name');
	noteName.textContent = NOTE_LIST[i];
	noteContainer.appendChild(noteName);
	for (let j = 0; j < NUMBER_OF_CELL; j++) {
		const noteCell = document.createElement('div');
		noteCell.classList.add('note-btn');
		noteContainer.appendChild(noteCell);
		NOTE_STATE[i][j] = {
			note: noteCell,
			state: false,
			onPlay: function () {
				this.note.classList.add('playing');
			},
		};
		noteCell.addEventListener('click', () => {
			if (NOTE_STATE[i][j].state) {
				NOTE_STATE[i][j].state = false;
				noteCell.classList.remove('clicked');
			} else {
				NOTE_STATE[i][j].state = true;
				noteCell.classList.add('clicked');
			}
		});
	}
	pannel.appendChild(noteContainer);
}

const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
let intervalId;

startBtn.addEventListener('click', () => {
	let time = 0;
	intervalId = setInterval(() => {
		for (let i = 0; i < NOTE_LIST.length; i++) {
			if (NOTE_STATE[i][time].state) {
				let note = NOTE_LIST[i];
				let frequency = FREQUENCY_FOR_KEY[note];
				makeNoteSound(frequency);
			}
		}
		time = (time + 1) % NUMBER_OF_CELL;
	}, 300);
});

stopBtn.addEventListener('click', () => {
	window.clearInterval(intervalId);
});
