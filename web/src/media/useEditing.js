// Dumb. Read-only. Ships to production exactly as written here.
//
// Always false — there is no editor in production, so nothing should ever
// treat the page as "being edited". The interactive version (outside this
// repo, see @media/useEditing in web/vite.config.js) returns the local
// editor's live `editing` state instead.
export default function useEditing() {
  return false;
}
