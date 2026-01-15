<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	percentage: number;
	username: string;
	message: string;
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}>();

const username = computed(() => (props.username || 'user'));
</script>

<template>
	<div class="boot-root">
		<div class="boot-inner">
			<!-- Windows Logo -->
			<div class="win-logo">
				<div class="win10-logo">
					<div class="pane pane-1" />
					<div class="pane pane-2" />
					<div class="pane pane-3" />
					<div class="pane pane-4" />
				</div>
			</div>

			<!-- Spinner -->
			<div class="spinner">
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
			</div>

			<!-- Caption -->
			<h4 class="caption">
				Fixing {{ username }}'s havoc. please wait...
			</h4>
		</div>
	</div>
</template>

<style scoped>
.boot-root {
	width: 100vw;
	height: 100vh;
	background-color: #0078d7;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: 'Segoe UI', system-ui, sans-serif;
	color: #ffffff;
}

.boot-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	transform: translateY(-20px);
}

/* Logo */
.win-logo {
	margin-bottom: 32px;
}

.win10-logo {
	position: relative;
	width: 180px;
	height: 108px;
	transform: perspective(800px) rotateY(-28deg);
}

.pane {
	position: absolute;
	background: #ffffff;
}

.pane-1 {
	left: 0;
	top: 0;
	width: 85px;
	height: 50px;
}

.pane-2 {
	left: 0;
	top: 58px;
	width: 85px;
	height: 50px;
}

.pane-3 {
	left: 93px;
	top: 0;
	width: 85px;
	height: 50px;
}

.pane-4 {
	left: 93px;
	top: 58px;
	width: 85px;
	height: 50px;
}

/* Spinner */
.spinner {
	position: relative;
	width: 60px;
	height: 60px;
}

.spinner div {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	animation:
		r 5s infinite cubic-bezier(0.15, 0.55, 0.85, 0.45),
		o 5s infinite step-end;
}

.spinner div::after {
	content: '';
	display: block;
	width: 5px;
	height: 5px;
	background-color: currentColor;
	border-radius: 100%;
	translate: 0 27.5px;
}

.spinner div:nth-child(1) {
	animation-delay: 0s;
}

.spinner div:nth-child(2) {
	animation-delay: 0.2s;
}

.spinner div:nth-child(3) {
	animation-delay: 0.4s;
}

.spinner div:nth-child(4) {
	animation-delay: 0.6s;
}

.spinner div:nth-child(5) {
	animation-delay: 0.8s;
}

.spinner div:nth-child(6) {
	animation-delay: 1s;
}

@keyframes r {
	0% {
		transform: rotate(-90deg);
	}

	35% {
		transform: rotate(270deg);
	}

	70% {
		transform: rotate(630deg);
	}

	100% {
		transform: rotate(630deg);
	}
}

@keyframes o {
	0% {
		opacity: 1;
	}

	70% {
		opacity: 0;
	}
}

/* Caption */
.caption {
	font-size: 24px;
	font-weight: 500;
	text-align: center;
	letter-spacing: 0.2px;
	opacity: 0.95;
}
</style>
