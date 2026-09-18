import MediaRegion from '@media/MediaRegion';
import EditableText from '@media/EditableText';

export default function TrustStrip() {
  return (
    <MediaRegion name="home.truststrip" className="bg-slate-2 border-t border-line-dark px-6 py-[1.4rem]" style={{}} >
      <div data-nav-theme="dark" className="max-w-[1180px] mx-auto flex items-center gap-[1.2rem] flex-wrap text-white-soft text-[0.86rem]">
        <strong className="text-white font-semibold">
          <EditableText id="home.truststrip.headline" as="span">Working alongside Edo State Government and industry partners since 2015</EditableText>
        </strong>
        <div className="flex gap-2 flex-wrap">
          <span className="tag-pill"><EditableText id="home.truststrip.tag1" as="span">Edo State Government</EditableText></span>
          <span className="tag-pill"><EditableText id="home.truststrip.tag2" as="span">Oil &amp; Gas</EditableText></span>
          <span className="tag-pill"><EditableText id="home.truststrip.tag3" as="span">Construction</EditableText></span>
          <span className="tag-pill"><EditableText id="home.truststrip.tag4" as="span">Real Estate</EditableText></span>
          <span className="tag-pill"><EditableText id="home.truststrip.tag5" as="span">Water Resources</EditableText></span>
        </div>
      </div>
    </MediaRegion>
  );
}
