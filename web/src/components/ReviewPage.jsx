import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../motion';

const inputClass =
  'w-full bg-slate-2 border border-line-dark rounded-[6px] px-4 py-3 text-white text-[0.92rem] placeholder:text-white-soft focus:outline-none focus:border-accent-tint transition-colors duration-150';

export default function ReviewPage() {
  const sent = new URLSearchParams(window.location.search).get('sent') === 'true';
  const [fileNames, setFileNames] = useState([]);

  const handleFiles = (e) => {
    setFileNames(Array.from(e.target.files || []).map((f) => f.name));
  };

  return (
    <section className="section-shell bg-slate text-white pt-[9rem]" data-nav-theme="dark">
      <div className="section-inner max-w-[720px]">
        <motion.div
          className="section-head max-w-[62ch]"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.span className="font-sans font-semibold text-[0.9rem] text-accent-tint mb-[0.8rem] block" variants={fadeUp}>
            Site Review
          </motion.span>
          <motion.h1 className="text-white text-[clamp(2rem,4.2vw,2.8rem)] mb-[1rem]" variants={fadeUp}>
            Everything left before we ship
          </motion.h1>
          <motion.p className="lede text-white-soft mb-2" variants={fadeUp}>
            Two files below cover everything: the PDF explains what's needed and why, the Word
            document has the same questions with blank space to type your answers under each one.
          </motion.p>
        </motion.div>

        {sent ? (
          <motion.div
            className="bg-slate-2 border border-line-dark rounded-[10px] p-10 text-center"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <p className="text-white text-[1.15rem] font-semibold mb-2">Received.</p>
            <p className="text-white-soft text-[0.92rem]">
              Thanks &mdash; that's been sent through. Come back to this page any time to send more
              (extra photos, a revised answer, anything else).
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-4 mb-10"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={stagger}
            >
              <motion.a
                href="/review/diarsa-review-questions.pdf"
                target="_blank"
                rel="noreferrer"
                variants={fadeUp}
                className="flex items-center gap-3 bg-slate-2 border border-line-dark rounded-[8px] px-5 py-4 no-underline hover:border-accent-tint transition-colors duration-150"
              >
                <span className="w-9 h-9 rounded-full bg-slate-3 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dd9868" strokeWidth="1.6" className="w-4 h-4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </span>
                <span>
                  <span className="block text-white text-[0.92rem] font-semibold">Read the questions</span>
                  <span className="block text-white-soft text-[0.78rem]">PDF &middot; reference</span>
                </span>
              </motion.a>
              <motion.a
                href="/review/diarsa-review-template.docx"
                download="Diarsa Review Template.docx"
                variants={fadeUp}
                className="flex items-center gap-3 bg-slate-2 border border-line-dark rounded-[8px] px-5 py-4 no-underline hover:border-accent-tint transition-colors duration-150"
              >
                <span className="w-9 h-9 rounded-full bg-slate-3 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dd9868" strokeWidth="1.6" className="w-4 h-4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 15l1.5 4L12 15l1.5 4L15 15" />
                  </svg>
                </span>
                <span>
                  <span className="block text-white text-[0.92rem] font-semibold">Fill in your answers</span>
                  <span className="block text-white-soft text-[0.78rem]">Word template &middot; download</span>
                </span>
              </motion.a>
            </motion.div>

            <motion.div
              className="bg-slate-2 border border-line-dark rounded-[10px] p-7"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
            >
              <h3 className="text-white text-[1.05rem] font-semibold mb-1">Send it back</h3>
              <p className="text-white-soft text-[0.85rem] mb-5">
                Upload the completed Word document, plus any photos or other files. Add a note below if
                you want &mdash; things you don't like, want changed, or want added.
              </p>
              <form
                action="https://formsubmit.co/osadebedivine@gmail.com"
                method="POST"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="_subject" value="Diarsa site review — response" />
                <input type="hidden" name="_next" value={`${window.location.origin}/review?sent=true`} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="grid grid-cols-2 max-[520px]:grid-cols-1 gap-4">
                  <input className={inputClass} type="text" name="name" placeholder="Your name" required />
                  <input className={inputClass} type="email" name="email" placeholder="Your email" required />
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-white-soft text-[0.82rem]">Files (completed Word doc, photos, anything else)</span>
                  <input
                    className={`${inputClass} file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-accent file:text-white file:text-[0.8rem] file:font-semibold file:cursor-pointer cursor-pointer`}
                    type="file"
                    name="attachments"
                    multiple
                    onChange={handleFiles}
                  />
                  {fileNames.length > 0 && (
                    <span className="text-white-soft text-[0.78rem]">{fileNames.join(', ')}</span>
                  )}
                </label>

                <textarea
                  className={`${inputClass} min-h-[140px] resize-y`}
                  name="notes"
                  placeholder="Anything else — things you don't like, want changed, or want added"
                />

                <button type="submit" className="btn btn-accent self-start">
                  Send
                </button>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
