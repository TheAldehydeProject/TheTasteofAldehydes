% ============================================================
% QIMU & MUSICIANS — WHAT A LILYPOND SCORE SOUNDS, NOTE BY NOTE
% Run by tools/qimu-pieces.py, never by the site: LilyPond is handed this
% file as its settings (-dinclude-settings) while it reads one of the
% Mutopia Project's scores, and it writes down every note and rest it
% hears — when, in which voice and on which staff, its pitch as written
% (letter, alteration, octave) and its length — with each staff's clef
% and key and the score's bar number, metre and position in the bar as
% they change, into <score>.events beside it — and where its repeats begin
% and end, and its first and second endings, so they can be played in
% the order they are written to be.
% ============================================================
#(define qimu-out #f)
#(define (qimu-port)
   (if (not qimu-out)
       (set! qimu-out (open-file (string-append (ly:parser-output-name) ".events") "w")))
   qimu-out)
#(define (qimu-say . items)
   (let ((p (qimu-port)))
     (display (string-join (map (lambda (x) (if (string? x) x (format #f "~a" x))) items) "\t") p)
     (newline p)
     (force-output p)))
#(define (mom m)
   (format #f "~a/~a" (ly:moment-main-numerator m) (ly:moment-main-denominator m)))
#(define (gracey m) (not (zero? (ly:moment-grace-numerator m))))
#(define (addr x) (number->string (object-address x) 16))
#(define (rat r) (format #f "~a" r))
#(define (dur-str d)
   (format #f "~a ~a ~a" (ly:duration-log d) (ly:duration-dot-count d) (ly:duration-scale d)))
#(define (arts-of ev)
   ;; What is written on a note: its tie, a slur or a beam beginning or
   ;; ending on it (each a piece of music or, once heard, an event).
   (let ((a (ly:event-property ev 'articulations '())))
     (define (is x class name)
       (if (ly:music? x)
           (eq? (ly:music-property x 'name) name)
           (and (ly:stream-event? x) (memq class (ly:event-property x 'class '())) #t)))
     (define (dir x)
       (if (ly:music? x) (ly:music-property x 'span-direction) (ly:event-property x 'span-direction)))
     (string-join
      (map (lambda (x)
             (cond ((is x 'tie-event 'TieEvent) "tie")
                   ((is x 'slur-event 'SlurEvent) (if (eqv? (dir x) -1) "slur(" "slur)"))
                   ((is x 'beam-event 'BeamEvent) (if (eqv? (dir x) -1) "beam[" "beam]"))
                   (else "-")))
           a) ",")))
%% What LilyPond's past called things an old score may still use, and
%% convert-ly leaves: answered with nothing, or with what it meant.
#(define-public (override-auto-beam-setting . args) (make-music 'SequentialMusic 'elements '()))
#(define-public (revert-auto-beam-setting . args) (make-music 'SequentialMusic 'elements '()))
deprecatedcresc = #(make-music 'CrescendoEvent 'span-direction START)
deprecateddim = #(make-music 'DecrescendoEvent 'span-direction START)
deprecatedendcresc = #(make-music 'CrescendoEvent 'span-direction STOP)
deprecatedenddim = #(make-music 'DecrescendoEvent 'span-direction STOP)
#(define (qimu-voice context)
   (let ((staff (ly:context-find context 'Staff)))
     (define (where)
       (let* ((m (ly:context-current-moment context)))
         (list (mom m) (if (gracey m) "g" "-") (addr context) (ly:context-id context)
               (if staff (addr staff) "0"))))
     (make-engraver
      (listeners
       ((note-event engraver event)
        (let* ((p (ly:event-property event 'pitch))
               (dt (ly:event-property event 'drum-type))
               (d (ly:event-property event 'duration)))
          (apply qimu-say
                 (append (list "N") (where)
                         (list (if (ly:pitch? p)
                                   (format #f "~a ~a ~a" (ly:pitch-octave p) (ly:pitch-notename p) (ly:pitch-alteration p))
                                   (format #f "drum ~a" dt))
                               (dur-str d) (arts-of event))))))
       ((rest-event engraver event)
        (apply qimu-say (append (list "R") (where) (list "-" (dur-str (ly:event-property event 'duration)) ""))))
       ((skip-event engraver event) #f)
       ((tie-event engraver event)
        (apply qimu-say (append (list "T") (where))))
       ((slur-event engraver event)
        (apply qimu-say (append (list "S") (where) (list (ly:event-property event 'span-direction)))))
       ((beam-event engraver event)
        (apply qimu-say (append (list "B") (where) (list (ly:event-property event 'span-direction)))))))))
#(define (qimu-staff context)
   (let ((last ""))
     (make-engraver
      ((process-music engraver)
       (let* ((m (ly:context-current-moment context))
              (now (format #f "~a|~a|~a|~a"
                           (ly:context-property context 'clefGlyph "")
                           (ly:context-property context 'clefTransposition 0)
                           (ly:context-property context 'middleCClefPosition 0)
                           (ly:context-property context 'keyAlterations '()))))
         (if (not (string=? now last))
             (begin (set! last now)
                    (qimu-say "K" (mom m) (if (gracey m) "g" "-") (addr context) now))))))))
#(define (qimu-repeat kind)
   (lambda (engraver event)
     (let ((m (ly:context-current-moment (ly:translator-context engraver))))
       (qimu-say "V" (mom m) kind
                 (ly:event-property event 'volta-numbers '())
                 (ly:event-property event 'repeat-count 0)
                 (ly:event-property event 'alternative-number 0)
                 (ly:event-property event 'span-direction 0)
                 (mom (ly:event-property event 'return-moment (ly:make-moment 0)))))))
#(define (qimu-score context)
   (let ((last ""))
     (make-engraver
      (listeners
       ((volta-repeat-start-event engraver event) ((qimu-repeat "start") engraver event))
       ((volta-repeat-end-event engraver event) ((qimu-repeat "end") engraver event))
       ((volta-span-event engraver event) ((qimu-repeat "volta") engraver event))
       ((alternative-event engraver event) ((qimu-repeat "alt") engraver event))
       ((fine-event engraver event) ((qimu-repeat "fine") engraver event))
       ((dal-segno-event engraver event) ((qimu-repeat "dalsegno") engraver event)))
      ((process-music engraver)
       (let* ((m (ly:context-current-moment context))
              (now (format #f "~a|~a|~a|~a|~s"
                           (ly:context-property context 'currentBarNumber 0)
                           (mom (ly:context-property context 'measurePosition (ly:make-moment 0)))
                           (ly:context-property context 'timeSignatureFraction '(4 . 4))
                           (ly:context-property context 'whichBar "")
                           (map (lambda (c) (cond ((symbol? c) (symbol->string c))
                                                  ((and (pair? c) (eq? (car c) 'volta))
                                                   (if (cadr c) "volta-on" "volta-off"))
                                                  (else "other")))
                                (ly:context-property context 'repeatCommands '())))))
         (if (not (string=? now last))
             (begin (set! last now)
                    (qimu-say "M" (mom m) (if (gracey m) "g" "-") now))))))))
\layout {
  \context { \Voice \consists #qimu-voice }
  \context { \DrumVoice \consists #qimu-voice }
  \context { \Staff \consists #qimu-staff }
  \context { \TabStaff \consists #qimu-staff }
  \context { \Score \consists #qimu-score }
}
