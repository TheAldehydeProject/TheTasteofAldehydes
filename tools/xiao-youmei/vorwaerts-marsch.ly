% ============================================================
% XIAO YOUMEI (蕭友梅, 1884–1940) — "Vorwärts Marsch im Schneesturm",
% Op. 23, for piano: a march in B flat with a Trio in E flat, "Marsch
% D.C. al Fine". Transcribed for Qimu & Musicians, 2026-10-01, by hand,
% bar by bar, from the photographs of the composer's own manuscript the
% owner sent — "this is the only chinese one i found, which you can work
% with" — the composer died in 1940 and the music is in the public
% domain. Read by tools/qimu-pieces.py, as the Mutopia scores are.
%
% WHAT IS CERTAIN AND WHAT IS NOT. The march (its introduction, the two
% repeated strains and both endings) and the Trio's first sixteen bars
% are clear in the photographs and written as they stand. The Trio's
% last eight bars, at the foot of the page, are the faintest: what is
% written there is the closest reading of them, kept to what the
% manuscript shows and to the harmony around it. Dynamics, slurs and
% the composer's crescendo and diminuendo marks are left out: the
% site's staves carry none. The repeats are written out in the order
% they are played, ending on the Fine after the D.C.
% ============================================================
\version "2.24.0"
\header {
  title = "Vorwärts Marsch im Schneesturm"
  opus = "Op. 23"
  composer = "Xiao Youmei (1884–1940)"
}

introR = { \partial 4 bes'8. bes'16 |
  bes'4 bes'8 f' bes' f' bes' d'' |
  <f' f''>2 d''8 f'' d'' bes' |
  f'8. f'16 f'4 f'8. f'16 f'8 f' | }
introL = { \partial 4 r4 |
  <bes, bes>2 <bes, bes>4 <bes, bes>4 |
  <f, f>2 <bes, bes>4 <bes, bes>4 |
  <f, f>2 <f, f>4 <f, f>4 | }

stA_R = {
  bes'4.. f'16 bes'4 d''4 |
  <f' f''>4.. d''16 <f' c''>4 <f' bes'>4 |
  f'2 <es' f'>8 <es' f'> <es' g'> <es' a'> |
  <d' f' bes'>2 <bes' d''>8 <a' c''> <g' bes'> <a' c''> |
  <bes' d''>4. <d'' f''>8 <d'' f''> <c'' es''> <c'' es''> <bes' d''> |
  <f' c''>4. <f' bes'>8 <es' a'> f' g' a' |
  bes'4 c''8. d''16 c''4 f''8. es''16 |
  d''4 es''8. d''16 c''8. bes'16 c''8. d''16 | }
stA_L = {
  <bes, d f bes>4 <bes, d f bes>8. <bes, d f bes>16 <bes, d f bes>4 <bes, d f bes> |
  <bes, d f bes>4 <bes, d f bes>8. <bes, d f bes>16 <bes, f>4 <bes, d f bes> |
  <f, a, c f>4 <f, a, c f>8. <f, a, c f>16 <f, a, c f>4. <f, a, c f>8 |
  <bes, d f bes>4 <bes, d f bes>8. <bes, d f bes>16 <bes, d f bes>4 <bes, d f bes> |
  <bes, d f bes>4. <bes, d f bes>8 <bes, d f bes>4 <bes, d f bes> |
  <a, c f a>4. <bes, d f bes>8 <f, a, c f>4 <f, a, c f> |
  <bes, d f bes>4 <es g> <c es g> <a, c f a> |
  <bes, d f bes>4 <bes, d f bes> <f, a, c f> <f, a, c f> | }

stB_R = {
  c''4 f'8 g' <f' a'> <g' bes'> <a' c''> <bes' d''> |
  <f' es''>4. <f' d''>8 <es' c''>2 |
  bes'8 c'' d'' es'' <f' f''>4. <g' g''>8 |
  <f' d'' f''>8 <f' c'' es''> <f' bes' d''> <es' c''> <d' f' bes'>4. bes'8 |
  <g' es''>4. <f' d''>8 <es' c''>4. <es' c''>8 |
  <f' f''>4. <f' es''>8 <f' d''>4. <f' c''>8 |
  \tuplet 3/2 { bes'8 a' bes' } \tuplet 3/2 { c'' bes' c'' } \tuplet 3/2 { d'' c'' d'' } \tuplet 3/2 { es'' d'' f'' } |
  << { f''4 \tuplet 3/2 { f''8 g'' f'' } d''4 \tuplet 3/2 { d''8 es'' d'' } } \\ { f'4 f' f' f' } >> |
  << { c''4 \tuplet 3/2 { c''8 d'' c'' } bes'4 r4 } \\ { es'4 es' d' s4 } >> |
  f'8. f'16 bes'8 a' g' f' bes'4 |
  <f' c''>8. <f' d''>16 <f' c''>4 <f' f''>8. <f' es''>16 <f' d''>4 |
  <bes' d''>8 <c'' es''> <d'' f''> <es'' g''> <d'' f''>4 <c'' es''>8 <bes' d''> |
  <a' c''>8. <g' c''>16 <a' c''>4 <c' f'>4 <f' f''>4 |
  <f' es''>8 <f' d''> <f' c''> <f' d''> <g' es''> <f' c''> <f' bes'>4 |
  <f' a' f''>4 <f' a' es''>4 <bes' d''>2 | }
stB_L = {
  r2 <c' es'>8 <bes d'> <a c'> <g bes> |
  <a, c f>4. <bes, d f>8 <es, a, c f>2 |
  <d bes>4 <d bes>8 <c a> <bes, d bes>4. <bes, d bes>8 |
  <f, f>4 <f, f>4 <bes, f bes>4. r8 |
  <es bes d'>4. r8 <c es g c'>4. r8 |
  <a, c f a>4. r8 <bes, d f bes>4. r8 |
  <d f bes>4 <f a> <d f bes> <c es a> |
  <bes, d f bes>4 <bes, d f bes> <bes, d f bes> <bes, d f bes> |
  <f, f>4 <f, f> <bes, bes> r4 |
  <a, c f>4 <bes, d f> <c es a> <bes, d bes> |
  <f a>4 <f a> <c a> <bes, bes> |
  <bes, f bes>4 <bes, f bes> <bes, f bes> <a, a>8 <bes, bes> |
  <f, f>4 <f, f> <f a> <c f a c'> |
  <f a>8 <f bes> <f a> <f bes> <c c'>4 <d f bes> |
  <f, f>4 <f, f> <bes, f d'>2 | }

turnR = { <es' c''>16 <d' bes'> <c' a'> <d' bes'> <f' d''>8. <es' c''>16 <d' bes'>4 }
turnL = { <f, f>4 <f, f> <bes, bes> }
fineR = { \turnR r4 \bar "|." }
fineL = { \turnL r4 }

trioUpR = { \tuplet 3/2 { bes'8 c'' d'' } }
trioUpL = { r4 }
trioA_R = {
  <es' es''>2. \tuplet 3/2 { es''8 d'' c'' } |
  bes'2. \tuplet 3/2 { c''8 g' c'' } |
  bes'2. \tuplet 3/2 { a'8 g' f' } |
  es'2. g'4 |
  es'8 es' f' g' as'4. c''8 |
  bes'8 as' g'4 <f' f''>4. <es' d''>8 |
  <f' d''>8 <es' c''> <d' bes'> <c' as'> <bes g'> <bes bes'> <c' as'> <c' f'> |
  <bes es'>4 <bes d'> <bes es'> }
trioA_L = {
  <es g bes>4 <es g bes>8. <es g bes>16 <d f bes>4 <es g bes> |
  <bes, d f bes>4 <bes, d f bes>8. <bes, d f bes>16 <bes, d f bes>4 <es g bes> |
  <bes, d f bes>4 <bes, d f bes>8. <bes, d f bes>16 <bes, d f bes>4 <bes, d f bes> |
  <es g>4 <es g>8. <es g>16 <es g>4 <es g> |
  <d f>4 es8 <d bes> <c es as>2 |
  <d f bes>4 <es g bes> <bes, d bes>2 |
  <bes, bes>4 <bes, bes> <es g> <as, f> |
  <bes, g>4 <bes, f> <es g> }
trioUpAgainR = { \tuplet 3/2 { bes8 bes bes } }
trioUpAgainL = { \tuplet 3/2 { <bes, bes>8 <bes, bes> <bes, bes> } }
trioB_R = {
  es'8. f'16 g'8. as'16 <f' bes'>4 \tuplet 3/2 { bes'8 bes' bes' } |
  <es' es''>8. <f' f''>16 <g' g''>8. <as' as''>16 <g' g''>4 \tuplet 3/2 { <f' f''>8 <g' g''> <as' as''> } |
  <bes' bes''>4 <c'' c'''>8 <bes' bes''> <as' as''> <g' g''> \tuplet 3/2 { <as' as''>8 <g' g''> <f' f''> } |
  <es' es''>4 bes'8 es'' <g' f''>4 \tuplet 3/2 { <g' as''>8 <g' g''> <g' f''> } |
  << { g''4 \tuplet 3/2 { g''8 f'' es'' } f''4 \tuplet 3/2 { bes'8 c'' d'' } } \\ { g'4 es' f' s4 } >> |
  <es' es''>4 <es' es''>8. <es' es'' g''>16 <as' f''>8 <bes' g''> <as' as''>4 |
  << { as''4 \tuplet 3/2 { as''8 f'' es'' } as''4 g''8 f'' } \\ { as'4 g' bes' bes' } >> |
  <g' es''>4 <g' es''>8. <g' es''>16 <g' es''>4 r4 |
  <d'' f''>8 <bes' d''> <a' es''> <f' c''> <f' bes'>8. g'16 <f' bes'>4 |
  <g' es''>8 <g' g''> <c'' f''>4 <a' f''>8 <a' f''> <bes' as''> <a' g''> |
  <g' g''>2 <d'' f''>8 <c'' es''> <a' c''> <c'' es''> |
  <f' d'' f''>4. <g' es'' g''>8 <c'' a''> <es' bes' g''> <bes' a''> <es'' bes''> |
  <d'' bes''>8 <g' bes' g''> <bes' f''>4 <d'' f''>8 <bes' d''> <c'' es''> <g' es'' g''> |
  <d'' f''>8. <d'' f''>16 <f' bes'>8 <g' bes'> bes'4 <es' c''>8. <es' d''>16 |
  <g' es''>2 <es' bes' f''>8 <es' d''> <g' es''> <bes' g''> |
  <bes' f''>8 <a' f''> <a' d''> <c'' es''> <c' es' bes'>2 | }
trioB_L = {
  <es g bes>4 <es g bes> <bes, d bes> \tuplet 3/2 { <bes, bes>8 <bes, bes> <bes, bes> } |
  <es g>4 <es g> <es bes> <as, c f> |
  <bes, d f bes>4 <bes, d f bes> <d g bes> <f, c f> |
  <es g>4 <es g> <bes, es bes> <a, c es> |
  <es, bes, es>4 <es, bes, es> <bes, f bes> <bes, f bes> |
  <g, es g>4 <g, es g>8. <g, es g bes>16 <f, f>4 <c es c'> |
  <c es c'>4 <g, es bes>8. <bes, es bes>16 <d f d'>4 <es g bes> |
  <es bes>4 <es bes>8. <es bes>16 <es bes>4 r4 |
  <bes, bes>4 <f c'> <bes d'>8. <bes d'>16 <bes, bes d'>4 |
  <es bes>4 <f a>8. <f a>16 <f c'>4 <c bes> |
  <es bes>2 <bes, f bes>4 <bes, f bes> |
  <bes, f bes>8. <bes, f bes>16 <es bes>4 <a, es a> <a, es a> |
  <bes, f bes>4 <es g bes> <bes, f bes> <bes, f bes> |
  <bes, f bes>8. <bes, f bes>16 <es g c'>4 <bes, d f bes> <es g bes> |
  <es bes>2 <es bes>4 <es bes> |
  <f a c'>4 <f a c' es'> <bes, d f bes>2 | }

right = {
  \clef treble \key bes \major \time 4/4 \tempo 4 = 112
  \introR \stA_R \stA_R \stB_R \fineR
  \stB_R \turnR \bar "||" \key es \major \trioUpR
  \trioA_R \trioUpR \trioA_R \trioUpAgainR
  \trioB_R \trioB_R \bar "||" \key bes \major
  \partial 4 bes'8. bes'16 |
  bes'4 bes'8 f' bes' f' bes' d'' |
  <f' f''>2 d''8 f'' d'' bes' |
  f'8. f'16 f'4 f'8. f'16 f'8 f' |
  \stA_R \stB_R \fineR
}
left = {
  \clef bass \key bes \major \time 4/4
  \introL \stA_L \stA_L \stB_L \fineL
  \stB_L \turnL \key es \major \trioUpL
  \trioA_L \trioUpL \trioA_L \trioUpAgainL
  \trioB_L \trioB_L \key bes \major
  \partial 4 r4 |
  <bes, bes>2 <bes, bes>4 <bes, bes>4 |
  <f, f>2 <bes, bes>4 <bes, bes>4 |
  <f, f>2 <f, f>4 <f, f>4 |
  \stA_L \stB_L \fineL
}
\score {
  \new PianoStaff <<
    \new Staff = "upper" \right
    \new Staff = "lower" \left
  >>
  \layout { }
}
