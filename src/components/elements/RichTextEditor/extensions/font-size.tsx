import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		fontSize: {
			setFontSize: (fontSize: string) => ReturnType;
			unsetFontSize: () => ReturnType;
		};
	}
}

export const FontSize = Extension.create({
	name: 'fontSize',

	addOptions() {
		return {
			types: ['textStyle'],
		};
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontSize: {
						default: null,
						parseHTML: (element) =>
							element.style.fontSize.replace(/['"]+/g, ''),
						renderHTML: (attributes) => {
							if (!attributes.fontSize) {
								return {};
							}
							return {
								style: `font-size: ${attributes.fontSize}`,
							};
						},
					},
				},
			},
		];
	},

	addCommands() {
		return {
			setFontSize:
				(fontSize) =>
				({ chain }) => {
					return chain().setMark('textStyle', { fontSize }).run();
				},
			unsetFontSize:
				() =>
				({ chain }) => {
					return (
						chain()
							.setMark('textStyle', { fontSize: null })
							// Remove o atributo fontSize se estiver vazio
							.command(({ tr }) => {
								tr.steps.forEach((step) => {
									if (step.toJSON().stepType === 'replace') {
										const mark = tr.storedMarks?.find(
											(m) => m.type.name === 'textStyle'
										);
										if (mark && !mark.attrs.fontSize) {
											tr.removeStoredMark(mark.type);
										}
									}
								});
								return true;
							})
							.run()
					);
				},
		};
	},
});
