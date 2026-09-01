import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, getText, setText } from './textStore';
import { useMediaEditor } from './MediaEditorContext';

// Drop-in wrapper for a run of copy. Renders the stored text (or the JSX
// children as the fallback). In the dev editor's edit mode the element becomes
// contentEditable; blur / Enter commits to the text store. Use only for
// plain-text elements — headlines, paragraphs, simple button labels.
export default function EditableText({ id, as: Tag = 'span', children, className, style, ...rest }) {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const editor = useMediaEditor(); // null outside dev

  const fallback =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
        ? children.filter((c) => typeof c === 'string').join('')
        : '';
  const text = getText(id, fallback);

  if (!editor?.editing) {
    return (
      <Tag className={className} style={style} {...rest}>
        {text}
      </Tag>
    );
  }

  const onKeyDown = (e) => {
    e.stopPropagation(); // keep the editor's global Ctrl+Shift+E / Esc from firing
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.currentTarget.textContent = text;
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      className={className}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={onKeyDown}
      onBlur={(e) => setText(id, e.currentTarget.innerText)}
      style={{
        outline: '1px dashed rgba(221,152,104,0.7)',
        outlineOffset: 3,
        borderRadius: 2,
        cursor: 'text',
        ...style,
      }}
      {...rest}
    >
      {text}
    </Tag>
  );
}
