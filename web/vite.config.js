import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Each `@media/*` import always resolves to the plain, dumb component in
  // src/media/ below — that's what `npm run build` ships, always, no matter
  // what's on this machine.
  //
  // The interactive versions (drag-to-arrange button, "+ add image here",
  // editable text, on the real pages) only ever load when BOTH are true: you
  // ran `npm run dev:editor` (not the plain `npm run dev`), AND the separate
  // local tool is actually present on this machine (never part of this repo
  // — ~/Documents/diarsa-editor). Two easy switches: pick which script to
  // run, and whether that folder exists.
  const editorDir = 'C:/Users/admin/Documents/diarsa-editor/src/site';
  const useEditor = command === 'serve' && mode === 'editor' && existsSync(`${editorDir}/EditableSlot.jsx`);

  const swap = (name, plainFile) =>
    useEditor ? `${editorDir}/${name}.jsx` : fileURLToPath(new URL(`./src/media/${plainFile}`, import.meta.url));

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@media/Slot': swap('EditableSlot', 'Slot.jsx'),
        '@media/MediaRegion': swap('EditableMediaRegion', 'MediaRegion.jsx'),
        '@media/EditableText': swap('InteractiveText', 'EditableText.jsx'),
        '@media/FontLoader': swap('InteractiveFontLoader', 'FontLoader.jsx'),
        '@media/useEditing': swap('useInteractiveEditing', 'useEditing.js'),
      },
    },
  };
})
