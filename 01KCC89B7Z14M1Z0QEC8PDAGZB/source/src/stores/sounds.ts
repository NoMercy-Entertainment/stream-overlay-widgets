import win2000Off from '../assets/melogoff.mp3';
import win10 from '../assets/vista.mp3';

import win10Off from '../assets/vistashutdown.mp3';

import win31Off from '../assets/wfw311.mp3';
import win31 from '../assets/win31.mp3';

import win95 from '../assets/win95.mp3';
import win98 from '../assets/win98.mp3';

import win98Off from '../assets/win98logoff.mp3';
import win2000 from '../assets/win2000.mp3';

import winXp from '../assets/winxp.mp3';
import winXpOff from '../assets/winxpshutdown.mp3';

const sounds = {
	win31: {
		on: win31,
		off: win31Off,
	},
	win95: {
		on: win95,
		off: win31,
	},
	win98: {
		on: win98,
		off: win98Off,
	},
	win2000: {
		on: win2000,
		off: win2000Off,
	},
	winXp: {
		on: winXp,
		off: winXpOff,
	},
	win10: {
		on: win10,
		off: win10Off,
	},
};

export default sounds;
