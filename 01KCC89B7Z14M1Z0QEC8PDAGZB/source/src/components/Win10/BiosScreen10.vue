<script setup lang="ts">

</script>

<template>
	<div class="ami-bios-root">
		<div class="ami-bios-inner">
			<div class="ami-logo-row" aria-hidden>
				<!-- Inline SVG approximating the American Megatrends logo -->
				<svg class="ami-logo" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" role="img">
					<defs>
						<pattern id="striped" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(0)">
							<rect width="6" height="3" fill="#ff2b2b" />
						</pattern>
					</defs>
					<!-- stylized triangle with stripes -->
					<g transform="translate(0,4)">
						<polygon points="10,72 70,4 130,72" fill="url(#striped)" stroke="#9b0000" stroke-width="1" />
					</g>
					<!-- text -->
					<g transform="translate(150,28)">
						<text x="0" y="-2" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#ffffff">American</text>
						<text x="0" y="22" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#ffffff">Megatrends</text>
					</g>
				</svg>
			</div>

			<pre class="bios-text">
AMIBIOS (C) 2012 American Megatrends, Inc.

ASRock X570 Phantom Gaming X
BIOS Version: P3.00   Build Date: 04/07/2020

CPU: AMD Ryzen 9 3950X 16-Core Processor
      Speed: 3500MHz

Initializing USB Controllers .. Done.
USB Devices Found: 1 Keyboard, 1 Mouse, 1 Storage Device, 2 Hubs

Total Memory: 65536MB (DDR4-3200)

Detecting SATA Devices...
  SATA0: WDC WD5000LPLX-00ZNTT0 .................. OK
  SATA1: WDC WD40EFRX-68N32N0 .................... OK
  SATA2: WDC WD40EFRX-68N32N0 .................... OK
  SATA3: WDC WD30EFRX-68EUZN0 .................... OK
  SATA4: WDS200T3X0C-00SJG0 (NVMe) ............... OK
  SATA5: WD_BLACK SN850X 2000GB (NVMe) ........... OK
  SATA6: WDC WD2003FZEX-00SRLA0 .................. OK

Checking NVRAM... OK
Loading AMI Firmware Interface...

CPU Fan Error!
Press F1 to Run SETUP
Press F2 to Continue
</pre>
		</div>
	</div>
</template>

<style scoped>
/* Accurate AMI-style BIOS screen: black background, monospace white text */
.ami-bios-root {
	width: 100vw;
	height: 100vh;
	background: #000000;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.ami-bios-inner {
	width: 100%;
	padding: 22px 28px;
	box-sizing: border-box;
}
.ami-logo-row {
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 18px;
}
.ami-logo {
	width: 460px;
	height: auto;
}

.bios-text {
	font-size: 16px;
	line-height: 1.5;
	color: #ffffff;
	white-space: pre-wrap;
	margin: 0;
}

/* make the error lines a bit brighter and slightly larger */
.bios-text strong,
.bios-text .error {
	color: #ffffff;
	font-weight: 700;
}

/* small responsive tweak for very small screens */
@media (max-width: 520px) {
	.ami-logo {
		width: 280px;
	}
	.bios-text {
		font-size: 13px;
	}
}
</style>
