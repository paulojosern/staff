import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import './style.css';
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Italic,
	List,
	ListOrdered,
	Redo2,
	Undo2,
} from 'lucide-react';
import TextStyle from '@tiptap/extension-text-style';
import { FontSize } from './extensions/font-size';
type RichTextEditorProps = {
	content?: string;
	onChange: (content: string) => void;
	placeholder?: string;
	primary: string;
	secondary: string;
};

export const RichTextEditor = ({
	content = '',
	onChange,
	placeholder = 'Escreva algo incrível...',
	primary,
	secondary,
}: RichTextEditorProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Image,
			TextStyle,
			Color,
			FontSize,
			Link.configure({
				openOnClick: false,
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Placeholder.configure({
				placeholder,
			}),
			Highlight.configure({ multicolor: true }),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) {
		return null;
	}

	const presetColors = [primary, secondary];

	// const addImage = () => {
	// 	const url = window.prompt('Enter the URL of the image:');
	// 	if (url) {
	// 		editor.chain().focus().setImage({ src: url }).run();
	// 	}
	// };

	const setLink = () => {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		if (url === null) {
			return;
		}

		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	return (
		<div className="editor-container">
			<div className="menu-bar">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'is-active' : ''}
				>
					<Bold size={16} />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'is-active' : ''}
				>
					<Italic size={16} />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={editor.isActive('strike') ? 'is-active' : ''}
				>
					-A-
				</button>
				<button
					onClick={() => {
						const currentSize =
							editor.getAttributes('textStyle').fontSize || '16px';
						const newSize = parseInt(currentSize) - 2 + 'px';
						editor.chain().focus().setFontSize(newSize).run();
					}}
					className="px-2 py-1 text-sm bg-gray-100 rounded"
					title="Diminuir tamanho da fonte"
				>
					A-
				</button>
				<span className="text-sm mx-1 pt-1">
					{editor?.getAttributes('textStyle').fontSize || '16px'}
				</span>
				<button
					onClick={() => {
						const currentSize =
							editor.getAttributes('textStyle').fontSize || '16px';
						const newSize = parseInt(currentSize) + 2 + 'px';
						editor.chain().focus().setFontSize(newSize).run();
					}}
					className="px-2 py-1 text-sm bg-gray-100 rounded"
					title="Aumentar tamanho da fonte"
				>
					A+
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={
						editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
					}
				>
					<Heading1 size={18} />
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={
						editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
					}
				>
					<Heading2 size={18} />
				</button>

				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={
						editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
					}
				>
					<Heading3 size={18} />
				</button>
				<button
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
					className={
						editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
					}
				>
					<Heading4 size={18} />
				</button>

				<button
					onClick={() => editor.chain().focus().setTextAlign('left').run()}
					className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
				>
					<AlignLeft size={18} />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					className={
						editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''
					}
				>
					<AlignCenter size={18} />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
				>
					<AlignRight size={18} />
				</button>
				<button
					onClick={() => editor.chain().focus().setTextAlign('justify').run()}
					className={
						editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''
					}
				>
					<AlignJustify size={18} />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive('bulletList') ? 'is-active' : ''}
				>
					<List size={20} />
				</button>
				<button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive('orderedList') ? 'is-active' : ''}
				>
					<ListOrdered size={20} />
				</button>

				{presetColors.map((color) => (
					<button
						key={color}
						onClick={() => {
							// setCurrentColor(color)
							editor.chain().focus().setColor(color).run();
						}}
						className="w-6 h-6 rounded border mt-0.5"
						style={{ backgroundColor: color }}
						title={color}
					/>
				))}
				<button
					onClick={() => editor.chain().focus().unsetColor().run()}
					className="w-6 h-6 rounded border mt-0.5 "
					style={{ backgroundColor: '#111' }}
				></button>
				<button onClick={setLink}>Link</button>
				<button
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
				>
					<Undo2 size={16} />
				</button>
				<button
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
				>
					<Redo2 size={16} />
				</button>
			</div>
			<EditorContent editor={editor} className="editor-content" />
		</div>
	);
};
