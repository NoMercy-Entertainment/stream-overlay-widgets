<script lang="ts" setup>
import type { PropType } from 'vue';
import type { MessageNode, OGMetadata } from '@/types/chat';
import { features } from '@/stores/config';
import OGMetaPreview from './OGMetaPreview.vue';

const props = defineProps({
	node: {
		type: Object as PropType<MessageNode>,
		required: true,
	},
});

console.log('Rendering MessageNode:', props.node);
</script>

<template>
	<div v-if="node.type === 'rootNode'" :id="node.id" :class="node.classes"
		class="message gap-0.5 children:inline break-words"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</div>
	<span v-else-if="node.type === 'span'" :id="node.id" :class="node.classes" class="font-sans inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</span>
	<p v-else-if="node.type === 'p'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</p>
	<a v-else-if="node.type === 'a'" :id="node.id" :class="node.classes" class="cursor-pointer inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</a>
	<b v-else-if="node.type === 'b'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</b>
	<u v-else-if="node.type === 'u'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</u>
	<i v-else-if="node.type === 'i'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</i>
	<strong v-else-if="node.type === 'strong'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</strong>
	<small v-else-if="node.type === 'small'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</small>
	<div v-else-if="node.type === 'div'" :id="node.id" :class="node.classes" v-bind="node.attribs">
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</div>
	<img v-else-if="node.type === 'emote'" :id="node.id" :alt="node.attribs?.alt" :class="node.classes"
		class="h-7 w-auto mx-1 inline" v-bind="node.attribs"
	>
	<img v-else-if="node.type === 'emote-placeholder'" :id="node.id" :alt="node.attribs?.alt" :class="node.classes"
		class="h-7 w-auto mx-1 inline" v-bind="node.attribs"
	>
	<img v-else-if="node.type === 'img'" :id="node.id" :alt="node.attribs?.alt" :class="node.classes"
		class="w-full h-auto max-h-96 inline"
		v-bind="node.attribs"
	>
	<marquee v-else-if="node.type === 'marquee'" :id="node.id" :class="node.classes" v-bind="node.attribs">
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</marquee>
	<div v-else-if="node.type === 'og-preview'" :id="node.id" :class="node.classes">
		<OGMetaPreview v-if="features.ogPreviews" :metadata="node.attribs as OGMetadata" />
	</div>
	<div v-else-if="node.type === 'mention'" :id="node.id" :class="node.classes" class="inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</div>
	<h1 v-else-if="node.type === 'h1'" :id="node.id" :class="node.classes" class="text-4xl font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h1>
	<h2 v-else-if="node.type === 'h2'" :id="node.id" :class="node.classes" class="text-3xl font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h2>
	<h3 v-else-if="node.type === 'h3'" :id="node.id" :class="node.classes" class="text-2xl font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h3>
	<h4 v-else-if="node.type === 'h4'" :id="node.id" :class="node.classes" class="text-xl font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h4>
	<h5 v-else-if="node.type === 'h5'" :id="node.id" :class="node.classes" class="text-lg font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h5>
	<h6 v-else-if="node.type === 'h6'" :id="node.id" :class="node.classes" class="text-base font-bold inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</h6>
	<em v-else-if="node.type === 'em'" :id="node.id" :class="node.classes" class="italic inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</em>
	<s v-else-if="node.type === 's'" :id="node.id" :class="node.classes" class="line-through inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</s>
	<del v-else-if="node.type === 'del'" :id="node.id" :class="node.classes" class="line-through inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</del>
	<ins v-else-if="node.type === 'ins'" :id="node.id" :class="node.classes" class="underline inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</ins>
	<mark v-else-if="node.type === 'mark'" :id="node.id" :class="node.classes" class="bg-yellow-300 inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</mark>
	<code v-else-if="node.type === 'code'" :id="node.id" :class="node.classes" class="bg-gray-800 text-gray-100 px-1 py-0.5 rounded font-mono text-sm inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</code>
	<pre v-else-if="node.type === 'pre'" :id="node.id" :class="node.classes" class="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm block overflow-x-auto"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</pre>
	<blockquote v-else-if="node.type === 'blockquote'" :id="node.id" :class="node.classes" class="border-l-4 border-gray-400 pl-4 italic block my-2"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</blockquote>
	<ul v-else-if="node.type === 'ul'" :id="node.id" :class="node.classes" class="list-disc list-inside block my-2"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</ul>
	<ol v-else-if="node.type === 'ol'" :id="node.id" :class="node.classes" class="list-decimal list-inside block my-2"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
	</ol>
	<li v-else-if="node.type === 'li'" :id="node.id" :class="node.classes" class="block"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</li>
	<br v-else-if="node.type === 'br'" :id="node.id" :class="node.classes"
		v-bind="node.attribs"
	>
	<hr v-else-if="node.type === 'hr'" :id="node.id" :class="node.classes" class="border-t border-gray-400 my-2"
		v-bind="node.attribs"
	>
	<sub v-else-if="node.type === 'sub'" :id="node.id" :class="node.classes" class="align-sub text-xs inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</sub>
	<sup v-else-if="node.type === 'sup'" :id="node.id" :class="node.classes" class="align-super text-xs inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</sup>
	<abbr v-else-if="node.type === 'abbr'" :id="node.id" :class="node.classes" class="border-b border-dotted cursor-help inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</abbr>
	<cite v-else-if="node.type === 'cite'" :id="node.id" :class="node.classes" class="italic inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</cite>
	<q v-else-if="node.type === 'q'" :id="node.id" :class="node.classes" class="inline break-words before:content-['\201C'] after:content-['\201D']"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</q>
	<kbd v-else-if="node.type === 'kbd'" :id="node.id" :class="node.classes" class="bg-gray-200 border border-gray-400 rounded px-1 py-0.5 font-mono text-sm inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</kbd>
	<samp v-else-if="node.type === 'samp'" :id="node.id" :class="node.classes" class="font-mono text-sm inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</samp>
	<var v-else-if="node.type === 'var'" :id="node.id" :class="node.classes" class="italic font-mono inline break-words"
		v-bind="node.attribs"
	>
		<template v-for="child in node.children ?? []" :key="child.id">
			<MessageNode :node="child" />
		</template>
		{{ node.text }}
	</var>
	<span v-else :id="node.id" :class="`${node.classes} inline`" v-bind="node.attribs">
		{{ node.text }}
	</span>
</template>
