import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, CheckboxControl } from '@wordpress/components';
import { createElement, Fragment } from '@wordpress/element';

registerBlockType('modern-toc/auto', {
  title: 'Modern Auto TOC',
  icon: 'list-view',
  category: 'widgets',
  attributes: {
    levels: { type: 'string', default: '2,3,4' },
    offset: { type: 'number', default: 96 },
    collapsed_mobile: { type: 'boolean', default: true },
    accent: { type: 'string', default: '' },
  },
  edit({ attributes, setAttributes }: any) {
    const { levels, offset, collapsed_mobile, accent } = attributes;
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="TOC Settings">
            <TextControl label="Heading levels (e.g., 2,3,4)" value={levels} onChange={(v)=>setAttributes({levels:v})} />
            <TextControl label="Sticky offset (px)" value={String(offset)} onChange={(v)=>setAttributes({offset: parseInt(v||'96',10)})} />
            <CheckboxControl label="Start collapsed on mobile" checked={collapsed_mobile} onChange={(v)=>setAttributes({collapsed_mobile:v})} />
            <TextControl label="Accent color (CSS value)" value={accent} onChange={(v)=>setAttributes({accent:v})} />
          </PanelBody>
        </InspectorControls>
        <div>
          <div style={{opacity:0.7,fontSize:'12px',marginBottom:'8px'}}>Table of Contents (Preview)</div>
          <nav className="toc" aria-label="Table of contents" style={{background:'var(--toc-bg)', padding:'12px', borderRadius:'12px'}}>
            <h2 className="text-sm font-semibold uppercase mb-3">Table of Contents</h2>
            <ol className="space-y-1">
              <li><a className="block px-2 py-1" href="#">1. Example section</a>
                <ol className="mt-1 ml-4 border-l pl-3 space-y-1">
                  <li><a className="block px-2 py-1 text-sm opacity-90" href="#">1.1 Child</a></li>
                </ol>
              </li>
            </ol>
          </nav>
        </div>
      </Fragment>
    );
  },
  save() {
    return null; // Server-side render
  }
});

