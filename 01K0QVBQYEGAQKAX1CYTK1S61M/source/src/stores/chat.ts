import type { ChatMessage } from '@/types/chat';

import { ref, watch } from 'vue';

import { chatAnimationDuration, chatShowDuration, maxMessages } from '@/stores/config';

export const chatMessageQueue = ref<ChatMessage[]>([]);

// Add message with automatic removal (using injected settings)
export async function addMessage(message: ChatMessage) {
	// Set initial animation state
	message.animationState = 'entering';

	// Remove oldest message if we're at max capacity (using dynamic maxMessages)
	if (chatMessageQueue.value.length >= maxMessages.value) {
		const oldestMessage = chatMessageQueue.value[0];
		oldestMessage.animationState = 'leaving';

		// Wait for leave animation (using dynamic chatAnimationDuration)
		await new Promise(resolve => setTimeout(resolve, chatAnimationDuration.value * 1000));
		chatMessageQueue.value.shift();
	}

	// Add new message at the end
	chatMessageQueue.value.push(message);

	// Wait for enter animation (using dynamic chatAnimationDuration)
	await new Promise(resolve => setTimeout(resolve, chatAnimationDuration.value * 1000));

	// Set active state
	const msgIndex = chatMessageQueue.value.findIndex(m => m.id === message.id);
	if (msgIndex !== -1) {
		chatMessageQueue.value[msgIndex].animationState = 'active';
	}

	// Schedule removal (using dynamic chatShowDuration)
	setTimeout(async () => {
		const index = chatMessageQueue.value.findIndex(m => m.id === message.id);
		if (index !== -1) {
			// Set leaving state
			chatMessageQueue.value[index].animationState = 'leaving';

			// Wait for leave animation (using dynamic chatAnimationDuration)
			await new Promise(resolve => setTimeout(resolve, chatAnimationDuration.value * 1000));

			// Remove message
			chatMessageQueue.value = chatMessageQueue.value.filter(m => m.id !== message.id);
		}
	}, chatShowDuration.value * 1000);
}

// Clean existing messages when duration changes
watch(chatShowDuration, (newDuration) => {
	// Remove all messages that are older than the new duration
	const now = Date.now();
	chatMessageQueue.value = chatMessageQueue.value.filter((message) => {
		const messageAge = (now - message.updated_at.getTime()) / 1000;
		return messageAge < newDuration;
	});
});
