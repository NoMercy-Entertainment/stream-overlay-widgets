/**
 * Utility functions for widget development
 */

/**
 * Check if a color is too light (for text contrast)
 */
export function tooLight(color: string, threshold = 140): boolean {
	// Convert color to RGB values
	const rgb = hexToRgb(color);
	if (!rgb)
		return false;

	// Calculate luminance
	const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
	return luminance > threshold;
}

/**
 * Convert a name to kebab-case
 */
export function toKebabCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

/**
 * Convert a name to PascalCase
 */
export function toPascalCase(str: string): string {
	return str
		.replace(/\s+/g, ' ')
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('');
}

/**
 * Generate CSS custom properties for color theming
 */
export function generateColorProperties(baseColor: string) {
	return {
		'--color-300': `hsl(from ${baseColor} h calc(s * .30) l)`,
		'--color-500': `hsl(from ${baseColor} h calc(s * .50) l)`,
		'--color-700': `hsl(from ${baseColor} h s calc(l * .70))`,
	};
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Determines whether the given element should have a marquee effect.
 *
 * Sets the `aniate-marquee` class on the child with `data-marquee='scroller'`.
 * @param {HTMLElement} el - The element to check.
 */
export function shouldMarquee(el: HTMLElement) {
	const scroller = el.querySelector<HTMLElement>('[data-marquee="scroller"]')!;
	scroller.style.removeProperty('--marquee-width');
	scroller.classList.remove('animate-marquee');

	const containerWidth = el.getBoundingClientRect()?.width ?? 0;
	const scrollerWidth = scroller.getBoundingClientRect()?.width ?? 0;

	if (containerWidth < scrollerWidth) {
		scroller.style.setProperty('--marquee-width', `${containerWidth}px`);
		scroller.classList.add('animate-marquee');
	}
	else {
		scroller.style.removeProperty('--marquee-width');
		scroller.classList.remove('animate-marquee');
	}
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
