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

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	return doc.createRange().createContextualFragment(html);
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

	const node: MessageNode = {
		type: element.tagName.toLowerCase(),
		id: `${messageId}-${element.tagName.toLowerCase()}-${index}`,
		classes: ['message-custom'],
		attribs: {},
		children: [],
	};

	Array.from(element.attributes).forEach((attr) => {
		if (node.attribs) {
			node.attribs[attr.name] = attr.value;
		}
	});

	element.childNodes.forEach((child, childIndex) => {
		if (child instanceof Element) {
			node.children?.push(elementToMessageNode(child, messageId, childIndex));
		}
		else if (child.nodeType === 3 && child.textContent?.trim()) {
			node.children?.push({
				type: 'p',
				id: `${messageId}-text-${index}-${childIndex}`,
				classes: ['message-text'],
				text: child.textContent,
			});
		}
	});

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

function buildTextNode(messageId: string, fragment: Fragment, index: number): MessageNode {
	return {
		type: 'p',
		id: `${messageId}-text-${index}`,
		classes: ['message-text'],
		text: fragment.text,
	};
}

function buildEmoteNode(messageId: string, fragment: Fragment, index: number): MessageNode {
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

function buildUrlNode(messageId: string, fragment: Fragment, index: number): MessageNode {
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

function buildOgPreviewNode(messageId: string, fragment: Fragment, index: number): MessageNode {
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
				nodes.children?.push(buildTextNode(message.id, fragment, index));
			}
			else if (fragment.type === 'emote') {
				nodes.children?.push(buildEmoteNode(message.id, fragment, index));
			}
			else if (fragment.type === 'url') {
				nodes.children?.push(buildUrlNode(message.id, fragment, index));
				// Collect OG preview node if html_preview exists
				if (fragment.html_preview) {
					ogPreviewNodes.push(buildOgPreviewNode(message.id, fragment, index));
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
