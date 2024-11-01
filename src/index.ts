import * as extensionConfig from '../extension.json';

const roundCoil = async (numTurns = 2, internalDiameter = 100, trackSpacing = 4, trackWidth = 4, centerX = 0, centerY = 0) => {
	// Parameters to change
	// let d = 100; // Internal Radius (in Mils)
	// let s = 4; // Distance between tracks (in Mils)
	// let numTurns = 2; // Number of turns of the coil
	// let trackWidth = 4; // Width of the track (in Mils)
	// Optional parameters
	// let centerx = 0;
	// let centery = 0;
	// Do not change anything below unless you know what you are doing
	let l = 1000000; // Safety number, should be removed after some tests. Prevents creating an infinite size coil, limiting the number of segments
	let points = [];
	let i = 0;
	for (let turns = 0; turns <= numTurns && i < l; ) {
		let a = 0.1 * i++;
		points.push({
			x: centerX + (internalDiameter + trackSpacing * 0.5 * a) * Math.cos(a),
			y: centerY + (internalDiameter + trackSpacing * 0.5 * a) * Math.sin(a),
		});
		if (
			points.length >= 2 &&
			((points[points.length - 2].y <= centerY && points[points.length - 1].y > centerY) ||
				(points[points.length - 2].y < centerY && points[points.length - 1].y >= centerY))
		)
			turns++;
	}

	for (let i = 1; i < points.length; i++) {
		await eda.pcb_PrimitiveLine.create(
			'GND',
			EPCB_LayerId.TOP,
			points[i - 1].x,
			points[i - 1].y,
			points[i].x,
			points[i].y,
			trackWidth * 0.1,
			false,
		);
	}
};

// roundCoil().finally;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function activate(status?: 'onStartupFinished', arg?: string): void {}

export function about(): void {
	eda.sys_MessageBox.showInformationMessage(
		eda.sys_I18n.text(`PCB Coil Generation v${extensionConfig.version}`),

		eda.sys_I18n.text('About'),
	);
}

export function generate(runCommand = false): void {
	if (!runCommand) {
		eda.sys_IFrame.openIFrame('/iframe/index.html', 400, 380);
	} else {
		eda.sys_IFrame.closeIFrame();
	}
	// roundCoil().finally;
}
