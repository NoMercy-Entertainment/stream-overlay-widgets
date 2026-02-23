<script setup lang="ts">
import type { ChatMessage } from '@/types/chat';
import { onMounted, onUnmounted } from 'vue';
import { useWidgetSocket } from '@/hooks/useWidgetSocket';
import { addMessage, chatMessageQueue } from '@/stores/chat';
import {
	defaultColor,
	features,
	maxMessages,
	widgetId,
} from '@/stores/config';
import { createMessageNode, tooLight } from '@/utils';
import MessageNode from './MessageNode.vue';
import simmer from '@/assets/juggle.svg';

const socket = useWidgetSocket(widgetId);

function handleTwitchChatMessage(chatMessage: ChatMessage) {
	console.log('Received decorated ChatMessage:', chatMessage);

	chatMessage.animationState = 'entering';

	chatMessage.message_node = createMessageNode(chatMessage);

	addMessage(chatMessage);
}

function handleWidgetEvent(eventPayload: any) {
	console.log('Received widget event:', eventPayload);

	if (eventPayload.EventType === 'twitch.chat.message') {
		handleTwitchChatMessage(eventPayload.Data);
	}

	else if (eventPayload.EventType === 'twitch.chat.message_delete') {
		console.log('Message deleted:', eventPayload.Data);
	}
}

onMounted(() => {
	socket.on('WidgetEvent', handleWidgetEvent);
});

onUnmounted(() => {
	socket.off('WidgetEvent', handleWidgetEvent);
});

function handleBeforeLeave(el: HTMLElement) {
	el.style.position = 'absolute';
	el.style.width = `${el.offsetWidth}px`;
}

function handleLeave(el: HTMLElement, done: () => void) {
	el.style.transition = 'none';
	el.style.position = 'absolute';
	el.style.width = `${el.offsetWidth}px`;

	const animation = el.animate([
		{ transform: 'translateX(0)', opacity: 1 },
		{ transform: 'translateX(50px)', opacity: 0 },
	], {
		duration: 500,
		easing: 'ease-in-out',
	});

	animation.onfinish = () => {
		done();
		el.remove();
	};
}

function handleAfterLeave(el: HTMLElement) {
	el.style.position = '';
	el.style.width = '';
	el.style.display = ''; // Reset display property
}
</script>

<template>
	<div id="chat-box" ref="chatBox"
		class="w-available h-auto max-h-screen flex flex-col gap-3 pl-4 pt-2 pr-1 m-4 overflow-y-auto scrollbar-none"
	>
		<TransitionGroup name="list" tag="div" class="flex flex-col gap-3 will-change-auto"
			:before-leave="handleBeforeLeave" :leave="handleLeave" :after-leave="handleAfterLeave"
		>
			<div v-for="message in chatMessageQueue.slice(0, maxMessages)" :key="message.id"
				class="flex flex-col message-container mt-3" :class="[message.animationState]"
			>
				<div class="relative pt-3" :style="{
					'--color-300': `hsl(from ${message.color_hex || defaultColor} h calc(s * .30) l)`,
					'--color-500': `hsl(from ${message.color_hex || defaultColor} h calc(s * .50) l)`,
					'--color-700': `hsl(from ${message.color_hex || defaultColor} h s calc(l * .70))`,
				}"
				>
					<div class="shine-wrapper -mt-6 relative z-10 overflow-hidden banner-animate">
						<div class="relative flex flex-row bg-theme-700 rounded-lg gap-1 h-8 px-2 items-center pr-12"
							:class="{
								'text-white': !tooLight(message.color_hex || defaultColor, 140),
								'text-black': tooLight(message.color_hex || defaultColor, 140),
							}"
						>
							<template v-if="features.userBadges">
								<template v-for="badge in message.badges" :key="badge.id">
									<img :src="badge.urls[2]" alt="badge" class="size-5">
								</template>
							</template>
							<span class="font-bold text-lg self-start leading-none my-auto">
								{{ message.user.display_name }}
							</span>

							<span v-if="features.userPronouns && message.user.pronoun"
								class="text-sm font-semibold font-mono ml-0.5 translate-y-0.5 leading-none my-auto whitespace-nowrap"
							>
								({{ message.user.pronoun.subject }}/{{ message.user.pronoun.object }})
							</span>
						</div>
					</div>

					<div
						class="absolute size-14 -right-1 -top-5 rounded-full overflow-hidden bg-theme-700 z-20 avatar-animate border border-theme-700"
					>
						<img class="size-full object-cover" :src="message.user.profile_image_url" alt="profile picture">
					</div>
				</div>

				<div class="relative overflow-clip bg-neutral-900 flex p-3 rounded-lg -mt-3 -ml-4 mr-4 pt-5 message-bubble"
					:class="{
						'decoration-rainbow-eclipse flex-row': message.is_decorated && message.decoration_style === 'rainbow-eclipse',
						'decoration-simmer flex-col': message.is_decorated && message.decoration_style === 'simmer',
						'decoration-cosmic-abyss flex-row': message.is_decorated && message.decoration_style === 'cosmic-abyss',
					}">

					<video v-if="message.is_decorated && message.decoration_style === 'cosmic-abyss'" 
					class="absolute inset-0 z-0" autoplay muted loop playsinline
					src="https://d3aqoihi2n8ty8.cloudfront.net/power-ups/cosmic-abyss-tall.mp4"></video>

					<object v-if="message.is_decorated && message.decoration_style === 'simmer'" type="image/svg+xml" 
						:data="simmer" class="h-8 w-available mx-1 -mt-2" />

					<div
						class="message-content relative text-[1.1rem] leading-7 rounded-lg font-medium z-10 max-h-96 overflow-clip text-white w-full"
					>
						<MessageNode :node="message.message_node" />
					</div>
				</div>
			</div>
		</TransitionGroup>
	</div>
</template>

<style scoped>
.message-container {
	@apply opacity-100 transition-all duration-500 ease-in-out;
}

.banner-animate {
	@apply transform translate-x-[120%];
	transition: transform 0.5s ease-out;
}

.message-container.active .banner-animate {
	@apply translate-x-0;
}

.avatar-animate {
	@apply scale-0;
	transition: transform 0.3s ease-out;
	transition-delay: 0.3s;
}

.message-container.active .avatar-animate {
	@apply scale-100;
}

.message-bubble {
	@apply transform origin-top scale-y-0;
	transition: transform 0.4s ease-out;
	transition-delay: 0.6s;
}

.message-container.active .message-bubble {
	@apply scale-y-100;
}

.message-content {
	@apply opacity-0;
	transition: opacity 0.3s ease-out;
	transition-delay: 0.9s;
}

.message-container.active .message-content {
	@apply opacity-100;
}

.message-container {
	@apply translate-x-[120%];
}

.message-container.entering {
	@apply translate-x-[120%];
}

.message-container.active {
	@apply translate-x-0 h-min;
}

.message-container.leaving {
	@apply translate-x-[-120%];
}

.shine-wrapper::after {
	content: '';
	@apply absolute inset-0 w-full h-full pointer-events-none z-10;
	transform: translateX(100%);
	background: linear-gradient(
		65deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0) 35%,
		rgba(255, 255, 255, 0.2) 50%,
		rgba(128, 186, 232, 0) 65%,
		rgba(128, 186, 232, 0) 99%,
		rgba(125, 185, 232, 0) 100%
	);
}

.shine-wrapper div {
	background-image: linear-gradient(45deg, var(--color-300), var(--color-500) 23%, var(--color-700));
}

.message-container.active .shine-wrapper::after {
	animation: shine 12s forwards;
	animation-iteration-count: 1;
}

.message-container.leaving {
	@apply opacity-0 translate-x-[50px];
}

@keyframes shine {
	1% {
		transform: translateX(100%);
	}

	15%,
	100% {
		transform: translateX(-100%);
	}
}

.list-move {
	@apply transition-all duration-500 ease-in-out;
}

.message-container {
	@apply opacity-100 transition-all duration-500 ease-in-out z-[1];
}

.message-container.active {
	@apply translate-x-0 h-min z-[2];
}

.list-leave-active {
	@apply absolute;
}

.decoration-rainbow-eclipse {
	animation: rainbow-eclipse 3s linear infinite;
	&> div:last-child {
		background: rgb(23 23 23);
		padding: .75rem;
		margin: .25rem;
	}
}
.decoration-rainbow-eclipse:before {
    animation: rotate 4s linear infinite;
    background-image: conic-gradient(#b23ff8, #3cc890, #38a7ca, #b23ff8);
    background-position: 0 0;
    background-repeat: no-repeat;
    content: "";
    height: 2000px;
    width: 110%;
    position: absolute;
    transform-origin: center;
    top: -1000px;
    left: -15px;
}

.decoration-simmer {
	animation: simmer 2s ease-in-out infinite;
    background: linear-gradient(90deg, #3866dd, #ff4c5b);
	&> div:last-child {
		background: rgb(23 23 23);
		padding: .75rem;
		margin: 0 .25rem .25rem;
	}
}

.decoration-cosmic-abyss {
	animation: cosmic-abyss 3s ease-in-out infinite;
	&> div:last-child {
		background: rgb(23 23 23);
		padding: .75rem;
		margin: .25rem;
	}
}

@keyframes rainbow-eclipse {
	0% {
		background-size: 200% 200%;
		background-position: 0% 50%;
	}
	50% {
		background-size: 200% 200%;
		background-position: 100% 50%;
	}
	100% {
		background-size: 200% 200%;
		background-position: 0% 50%;
	}
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes simmer {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
