<script setup lang="ts">

</script>

<template>
	<div class="boot-content winxp-boot" />
</template>

<style scoped>
/* Minimal XP boot screen styles only - removed all other OS styles */

.winxp-boot {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000000 url('../../assets/windows-xp-startup-screen.gif') center 35% / contain no-repeat;
	color: #ffffff;
}

.boot-content {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 60px;
}

/* XP logo DOM fallback (hidden because the GIF contains the authoritative visual) */
.xp-logo {
	display: none;
}

/* Loading blocks at bottom center */
.xp-loading {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 30px;
}

.xp-bar {
	display: flex;
	gap: 10px;
}

.xp-block {
	width: 60px;
	height: 20px;
	background: #0066cc;
	border-radius: 3px;
	animation: xpSlide 1.5s infinite ease-in-out;
}

.xp-block:nth-child(1) {
	animation-delay: 0s;
}
.xp-block:nth-child(2) {
	animation-delay: 0.3s;
}
.xp-block:nth-child(3) {
	animation-delay: 0.6s;
}

@keyframes xpSlide {
	0%,
	100% {
		transform: translateX(0);
		opacity: 0.5;
	}
	50% {
		transform: translateX(20px);
		opacity: 1;
	}
}
</style>
