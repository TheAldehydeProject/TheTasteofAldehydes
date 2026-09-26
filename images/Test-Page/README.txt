The test page's tree (works/test-page.html).

tree.jpg          The owner's photograph, as they sent it (2026-09-26).
tree-cloud.bin    The photograph made into three dimensions: one speck for
                  every 1.6 pixels, each with where it stands and its colour.
tree-cloud.json   How many specks there are, where the photograph was taken
                  from, and where each label comes out of the tree.

The two tree-cloud files are MADE from tree.jpg by tools/tree-cloud.mjs
(`npm install`, then `node tools/tree-cloud.mjs`). Change the tracing or the
depths in that script and run it again; don't edit them by hand.
