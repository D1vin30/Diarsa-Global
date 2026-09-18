import config from '../data/textConfig.json';

// Dumb. Read-only. Ships to production exactly as written here.
//
// Renders the saved text for `id`, or the JSX children as the fallback when
// nothing's been edited yet — a no-op visual change until someone actually
// edits it in the local tool. No contentEditable, no server call: the
// interactive version only exists outside this repo (see @media/EditableText
// in web/vite.config.js).
export default function EditableText({ id, as: Tag = 'span', children, className, style, ...rest }) {
  const saved = config.entries?.[id]?.text;
  const text = typeof saved === 'string' && saved.trim() ? saved : children;
  return (
    <Tag className={className} style={style} {...rest}>
      {text}
    </Tag>
  );
}
