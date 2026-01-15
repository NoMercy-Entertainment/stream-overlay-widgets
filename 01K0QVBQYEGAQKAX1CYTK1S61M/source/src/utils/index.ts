import type { ChatMessage, Fragment, MessageNode } from '@/types/chat';

// Color utility function from your ChatOverlay
export function tooLight(color: string, threshold = 140): boolean {
	// Convert color to RGB values
	const rgb = hexToRgb(color);
	if (!rgb)
		return false;

	// Calculate luminance
	const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
	return luminance > threshold;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	// Remove # if present
	hex = hex.replace('#', '');

	// Handle 3-digit hex
	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	}

	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
}

/**
 * Synchronize RGB animations in the document
 */
export function syncRgb() {
	document.getAnimations()
		.filter((a: any) => a.animationName === 'changeColor')
		.forEach((anim) => {
			anim.cancel();
			anim.play();
		});
}

// Marquee utility function
export function shouldMarquee(element: HTMLElement): void {
	const container = element.querySelector('[data-marquee="container"]') as HTMLElement;
	const scroller = element.querySelector('[data-marquee="scroller"]') as HTMLElement;

	if (!container || !scroller)
		return;

	const containerWidth = container.offsetWidth;
	const scrollerWidth = scroller.scrollWidth;

	if (scrollerWidth > containerWidth) {
		scroller.classList.add('marquee-scroll');
	}
	else {
		scroller.classList.remove('marquee-scroll');
	}
}

const httpRegex = /^https?:\/\/(?:www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-\w()@:%+.~#?&/=]*$/;

function parseHTML(html: string): DocumentFragment {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content;
}

function elementToMessageNode(element: Element, messageId: string, index: number): MessageNode {
	if (element.nodeType === 3) {
		return {
			type: 'p',
			id: `${messageId}-text-${index}`,
			classes: ['message-text'],
			text: element.textContent || '',
		};
	}

	const tagName = element.tagName.toLowerCase();
	const node: MessageNode = {
		type: tagName,
		id: `${messageId}-${tagName}-${index}`,
		classes: ['message-custom'],
		attribs: {},
		children: [],
	};

	Array.from(element.attributes).forEach((attr) => {
		if (node.attribs) {
			node.attribs[attr.name] = attr.value;
		}
	});

	// Check if element has only text content (no child elements)
	const hasOnlyText = Array.from(element.childNodes).every(child => child.nodeType === 3);

	if (hasOnlyText && element.textContent?.trim()) {
		// If the element only contains text, set it directly without wrapping in children
		node.text = element.textContent;
		node.children = []; // Clear children array
	}
	else {
		// Otherwise, process children recursively
		element.childNodes.forEach((child, childIndex) => {
			if (child instanceof Element) {
				node.children?.push(elementToMessageNode(child, messageId, childIndex));
			}
			else if (child.nodeType === 3 && child.textContent?.trim()) {
				node.children?.push({
					type: 'span',
					id: `${messageId}-text-${index}-${childIndex}`,
					classes: ['message-text'],
					text: child.textContent,
				});
			}
		});
	}

	return node;
}

function createLinkNode(messageId: string, url: string, index: number): MessageNode {
	return {
		type: 'a',
		id: `${messageId}-link-${index}`,
		classes: ['message-link'],
		text: url,
		attribs: {
			'href': url,
			'target': '_blank',
			'rel': 'noopener noreferrer',
			'data-og-fetch': 'true',
		},
		children: [],
	};
}

function createTextNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'p',
		id: `${messageId}-text-${index}`,
		classes: ['message-text'],
		text: fragment.text,
	};
}

function createMentionNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'mention',
		id: `${messageId}-mention-${index}`,
		classes: ['message-text ', 'mention'],
		text: fragment.text,
		attribs: {
			'style': `color: ${fragment.mention?.color_hex};`,
		},
	};
}

function createEmoteNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'emote',
		id: `${messageId}-emote-${index}`,
		classes: ['message-emote'],
		attribs: {
			src: fragment.emote?.urls['2'],
			alt: fragment.text,
		},
	};
}

function createUrlNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'a',
		id: `${messageId}-url-${index}`,
		classes: ['message-link'],
		text: fragment.text,
		attribs: {
			href: fragment.text,
			target: '_blank',
			rel: 'noopener noreferrer',
		},
	};
}

function createOgPreviewNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'og-preview',
		id: `${messageId}-og-preview-${index}`,
		classes: ['message-og-preview', 'w-full', 'empty:hidden'],
		attribs: {
			title: fragment.html_preview?.title,
			description: fragment.html_preview?.description,
			image: fragment.html_preview?.image_url,
			host: fragment.html_preview?.host,
		},
		children: [],
	};
}

/**
 * Creates a MessageNode tree from an array of fragments
 * Useful for parsing simple fragment arrays like [{ type: "html", text: "<h1>Hello</h1>" }]
 */
export function createMessageNodeFromFragments(fragments: Fragment[], id: string = 'msg'): MessageNode {
	const nodes: MessageNode = {
		type: 'rootNode',
		id,
		classes: ['message'],
		children: [],
	};

	const ogPreviewNodes: MessageNode[] = [];

	// First, combine HTML fragments with emotes/text into a single HTML string
	let combinedHTML = '';
	const nonHTMLFragments: Array<{ fragment: Fragment; index: number; position: number }> = [];

	fragments.forEach((fragment, index) => {
		console.log(`Fragment ${index}:`, fragment.type, fragment.text || '[emote]');
		if (fragment.type === 'html') {
			combinedHTML += fragment.text;
			console.log(`  After adding HTML: "${combinedHTML}"`);
		}
		else if (fragment.type === 'emote') {
			// Insert a placeholder for the emote using a span element (valid HTML)
			const placeholder = `<span data-emote-placeholder="${index}"></span>`;
			combinedHTML += placeholder;
			console.log(`  After adding emote placeholder: "${combinedHTML}"`);
			nonHTMLFragments.push({ fragment, index, position: combinedHTML.length });
		}
		else if (fragment.type === 'text') {
			// Escape text content to prevent HTML injection
			const escapedText = fragment.text
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			combinedHTML += escapedText;
			console.log(`  After adding text: "${combinedHTML}"`);
		}
		else if (fragment.type === 'url') {
			// Insert URL as a link
			combinedHTML += `<a href="${fragment.text}" target="_blank" rel="noopener noreferrer" data-og-fetch="true">${fragment.text}</a>`;
			console.log(`  After adding URL: "${combinedHTML}"`);
			// Collect OG preview node if html_preview exists
			if (fragment.html_preview) {
				ogPreviewNodes.push(createOgPreviewNode(id, fragment, index));
			}
		}
	});

	// Parse the combined HTML if we have any
	if (combinedHTML) {
		console.log('=== Fragment Processing Debug ===');
		console.log('Combined HTML:', combinedHTML);
		const htmlFragment = parseHTML(combinedHTML);
		console.log('Parsed fragment childNodes count:', htmlFragment.childNodes.length);

		// Debug each child node
		htmlFragment.childNodes.forEach((child, idx) => {
			console.log(`Child ${idx}:`, child.nodeName, child.nodeType, child);
			if (child instanceof Element) {
				console.log(`  - Element children:`, child.childNodes.length);
				child.childNodes.forEach((subChild, subIdx) => {
					console.log(`    - SubChild ${subIdx}:`, subChild.nodeName, subChild.nodeType);
				});
			}
		});

		let previousEmptyNode: MessageNode | null = null;

		htmlFragment.childNodes.forEach((child, childIndex) => {
			if (child instanceof Element) {
				const messageNode = elementToMessageNode(child, id, childIndex);
				console.log('Message node before replacement:', JSON.stringify(messageNode, null, 2));

				// Replace emote placeholders with actual emote nodes
				replaceEmotePlaceholders(messageNode, fragments);
				console.log('Message node after replacement:', JSON.stringify(messageNode, null, 2));

				// Check if this node should be merged into the previous empty node
				if (previousEmptyNode && previousEmptyNode.children && previousEmptyNode.children.length === 0 && !previousEmptyNode.text) {
					console.log('Merging into previous empty node');
					previousEmptyNode.children.push(messageNode);
					previousEmptyNode = null; // Reset after merging
				}
				else {
					// Check if this node is empty (no children and no text)
					if (messageNode.children && messageNode.children.length === 0 && !messageNode.text) {
						console.log('Found empty node, tracking for potential merge');
						previousEmptyNode = messageNode;
					}
					else {
						previousEmptyNode = null;
					}
					nodes.children?.push(messageNode);
				}
			}
			else if (child.nodeType === 3 && child.textContent?.trim()) {
				const textNode = {
					type: 'p',
					id: `${id}-text-${childIndex}`,
					classes: ['message-text'],
					text: child.textContent,
				};

				// If there's a previous empty node, add text to it
				if (previousEmptyNode && previousEmptyNode.children && previousEmptyNode.children.length === 0 && !previousEmptyNode.text) {
					console.log('Adding text to previous empty node');
					previousEmptyNode.text = child.textContent;
					previousEmptyNode = null;
				}
				else {
					nodes.children?.push(textNode);
					previousEmptyNode = null;
				}
			}
		});
	}
	else {
		// Fallback: process fragments individually if no HTML
		fragments.forEach((fragment, index) => {
			if (fragment.type === 'text') {
				nodes.children?.push(createTextNode(id, fragment, index));
			}
			else if (fragment.type === 'emote') {
				nodes.children?.push(createEmoteNode(id, fragment, index));
			}
			else if (fragment.type === 'url') {
				nodes.children?.push(createUrlNode(id, fragment, index));
				if (fragment.html_preview) {
					ogPreviewNodes.push(createOgPreviewNode(id, fragment, index));
				}
			}
		});
	}

	// Append all OG preview nodes at the end
	nodes.children?.push(...ogPreviewNodes);

	return nodes;
}

/**
 * Recursively replaces emote placeholder nodes with actual emote MessageNodes
 */
function replaceEmotePlaceholders(node: MessageNode, fragments: Fragment[]): void {
	if (!node.children || node.children.length === 0)
		return;

	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];

		// Check if this is an emote placeholder (span with data-emote-placeholder attribute)
		if (child.type === 'span' && child.attribs?.['data-emote-placeholder'] !== undefined) {
			const fragmentIndex = Number.parseInt(child.attribs['data-emote-placeholder'], 10);
			const fragment = fragments[fragmentIndex];

			if (fragment && fragment.type === 'emote') {
				// Replace with actual emote node
				node.children[i] = {
					type: 'emote',
					id: `${node.id || 'msg'}-emote-${fragmentIndex}`,
					classes: ['message-emote'],
					attribs: {
						src: fragment.emote?.urls['2'],
						alt: fragment.text,
					},
				};
			}
		}
		else {
			// Recursively process children
			replaceEmotePlaceholders(child, fragments);
		}
	}
}

export function createMessageNode(message: ChatMessage): MessageNode {
	const nodes: MessageNode = {
		type: 'rootNode',
		id: message.id,
		classes: ['message'],
		children: [],
	};

	const ogPreviewNodes: MessageNode[] = [];

	if (message.fragments && message.fragments.length > 0) {
		message.fragments.forEach((fragment, index) => {
			if (fragment.type === 'text') {
				nodes.children?.push(createTextNode(message.id, fragment, index));
			}
			else if (fragment.type === 'mention') {
				console.log('Creating mention node for fragment:', message);
				nodes.children?.push(createMentionNode(message.id, fragment, index));
			}
			else if (fragment.type === 'emote') {
				nodes.children?.push(createEmoteNode(message.id, fragment, index));
			}
			else if (fragment.type === 'url') {
				nodes.children?.push(createUrlNode(message.id, fragment, index));
				// Collect OG preview node if html_preview exists
				if (fragment.html_preview) {
					ogPreviewNodes.push(createOgPreviewNode(message.id, fragment, index));
				}
			}
			else if (fragment.type === 'html') {
				const htmlFragment = parseHTML(fragment.text);
				htmlFragment.childNodes.forEach((child, childIndex) => {
					if (child instanceof Element) {
						nodes.children?.push(elementToMessageNode(child, message.id, childIndex));
					}
					else if (child.nodeType === 3 && child.textContent?.trim()) {
						nodes.children?.push({
							type: 'p',
							id: `${message.id}-text-${index}-${childIndex}`,
							classes: ['message-text'],
							text: child.textContent,
						});
					}
				});
			}
		});
	}
	else {
		const fragment = parseHTML(message.message);
		let plainText = '';

		fragment.childNodes.forEach((node, index) => {
			if (node.nodeType === 3) {
				plainText += node.textContent;
			}
			else if (node instanceof Element) {
				if (plainText) {
					const textNodes = processTextWithLinks(message.id, plainText, index);
					nodes.children?.push(...textNodes);
					plainText = '';
				}
				nodes.children?.push(elementToMessageNode(node, message.id, index));
			}
		});

		if (plainText) {
			const textNodes = processTextWithLinks(message.id, plainText, 0);
			nodes.children?.push(...textNodes);
		}
	}

	// Append all OG preview nodes at the end
	nodes.children?.push(...ogPreviewNodes);

	return nodes;
}

function processTextWithLinks(messageId: string, text: string, index: number): MessageNode[] {
	const nodes: MessageNode[] = [];
	const words = text.split(' ');
	let currentText = '';

	words.forEach((word, wordIndex) => {
		if (httpRegex.test(word)) {
			if (currentText) {
				nodes.push({
					type: 'p',
					id: `${messageId}-text-${index}-${wordIndex}`,
					classes: ['message-text'],
					text: currentText.trim(),
				});
				currentText = '';
			}
			nodes.push(createLinkNode(messageId, word, wordIndex));
			currentText = ' ';
		}
		else {
			currentText += (currentText ? ' ' : '') + word;
		}
	});

	if (currentText.trim()) {
		nodes.push({
			type: 'p',
			id: `${messageId}-text-${index}-final`,
			classes: ['message-text'],
			text: currentText.trim(),
		});
	}

	return nodes;
}
