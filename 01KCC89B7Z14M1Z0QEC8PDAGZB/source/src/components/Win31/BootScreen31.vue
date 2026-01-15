<script setup lang="ts">

</script>

<template>
	<div class="boot-content win31-boot">
		<div class="win31-logo">
			<div class="win31-text">
				Microsoft
			</div>
			<div class="win31-windows">
				Windows
			</div>
			<div class="win31-version">
				Version 3.1
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Focused Windows 3.1 boot styles
   - Use the user-provided image as a centered, contained background
   - Black background fills the viewport; image scales with contain to preserve aspect
   - Hide DOM logo since the image is the authoritative visual
*/

.boot-content,
.win31-boot {
	position: fixed;
	inset: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #000; /* black background stretching the screen */
	/* image placed centrally and kept at natural aspect ratio; black borders show if aspect differs */
	background-image: url('../../assets/windows-31-startup-screen.png');
	background-repeat: no-repeat;
	background-position: center 45%;
	background-size: contain;
	color: #ffffff;
}

/* hide the DOM logo - the PNG is the authoritative visual */
.win31-logo {
	display: none;
}

/* keep text rendering crisp for small UI fonts */
* {
	-webkit-font-smoothing: none;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeSpeed;
}
</style>
