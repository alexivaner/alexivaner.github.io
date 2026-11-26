import React, { useEffect, useId, useState } from 'react';
import { Localized } from '../i18n/I18n.jsx';
import '../../styles/ourtrip-conversation.css';

const textExpense = [
  { speaker: 'Alex', text: 'I paid ¥5,000 for dinner in Osaka.' },
  { speaker: 'OurTrip', text: 'Recorded ¥5,000 for dinner in Osaka, paid by Alex.' },
  { speaker: 'Alex', text: 'Sam paid half.' },
  { speaker: 'OurTrip', text: 'Did Sam send you ¥2,500, or did you each pay ¥2,500 at the restaurant?' },
  { speaker: 'Alex', text: 'Sam transferred it to me later.' },
  { speaker: 'OurTrip', text: 'Confirm the ¥2,500 reimbursement from Sam to Alex. The original dinner payment stays at ¥5,000.' },
];

const invoiceExpense = [
  { speaker: 'Alex', text: 'I paid for our dinner.', invoice: true },
  { speaker: 'OurTrip', text: 'I read ¥5,000 from the invoice. Review the draft before I add it to the ledger.' },
  { speaker: 'Alex', text: 'Yes, confirm.' },
  { speaker: 'OurTrip', text: 'Saved the shared dinner expense. Alex paid ¥5,000.' },
];

const scenarios = {
  text: { label: 'Text expense', messages: textExpense },
  invoice: { label: 'Invoice photo', messages: invoiceExpense },
};

function ReceiptAttachment() {
  return (
    <Localized><figure className="conversation-attachment">
      <figcaption>Sample invoice</figcaption>
      <dl>
        <div><dt>Merchant</dt><dd>Maple Table</dd></div>
        <div><dt>Date</dt><dd><time dateTime="2027-04-09">2027-04-09</time></dd></div>
        <div><dt>Total</dt><dd>¥5,000 JPY</dd></div>
      </dl>
    </figure></Localized>
  );
}

function Transcript({ messages, shown = messages.length, playing = false }) {
  const next = messages[shown];
  return (
    <Localized><ol className="conversation-thread" role="list">
      {messages.slice(0, shown).map(({ speaker, text, invoice }, index) => (
        <li key={text} data-entering={playing && index === shown - 1 ? '' : undefined}
          className={speaker === 'OurTrip' ? 'conversation-reply' : 'conversation-request'}>
          <strong>{speaker}</strong>
          {invoice && <ReceiptAttachment />}
          <p>{text}</p>
        </li>
      ))}
      {playing && next?.speaker === 'OurTrip' && (
        <li className="conversation-reply conversation-typing">
          <p role="status">OurTrip is typing…</p>
          <span className="conversation-typing-dots" aria-hidden="true"><i /><i /><i /></span>
        </li>
      )}
    </ol></Localized>
  );
}

export default function OurTripConversation({ headingLevel = 3 }) {
  const titleId = useId();
  const threadId = useId();
  const Heading = `h${headingLevel}`;
  const [interactive, setInteractive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scenario, setScenario] = useState('text');
  const [progress, setProgress] = useState(null);
  const [playing, setPlaying] = useState(false);
  const { messages } = scenarios[scenario];
  const shown = progress ?? messages.length;

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    function update() {
      setReducedMotion(preference.matches);
      if (preference.matches) {
        setPlaying(false);
        setProgress(null);
      }
    }
    update();
    preference.addEventListener('change', update);
    setInteractive(true);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!playing || !messages[shown]) return;
    const timer = setTimeout(() => {
      setProgress(shown + 1);
      if (shown + 1 === messages.length) setPlaying(false);
    }, messages[shown].speaker === 'OurTrip' ? 1500 : 900);
    return () => clearTimeout(timer);
  }, [messages, playing, shown]);

  function selectScenario(id) {
    if (id === scenario) return;
    setScenario(id);
    setPlaying(false);
    setProgress(null);
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (shown === messages.length) setProgress(1);
    setPlaying(true);
  }

  return (
    <Localized><section className="ourtrip-conversation" aria-labelledby={titleId}>
      <div className="conversation-intro">
        <Heading id={titleId}>From chat to ledger</Heading>
        <p>Talk to OurTrip in Telegram. Ask what’s already paid, who covered it, or what’s still due. Gemini helps with open-ended questions and follow-ups in the same chat.</p>
        <div className="conversation-photo">
          <p className="conversation-photo-title">Photo to expense</p>
          <p>Send a photo of an invoice or receipt in Telegram, or use the camera in the web assistant. Gemini reads the merchant, date, total, and currency. Check the draft and confirm before it enters the ledger.</p>
        </div>
      </div>
      <figure className="conversation-figure">
        {interactive && (
          <div className="conversation-toolbar">
            <div className="conversation-scenarios" role="group" aria-label="Conversation examples">
              {Object.entries(scenarios).map(([id, item]) => (
                <button type="button" key={id} onClick={() => selectScenario(id)}
                  aria-pressed={id === scenario} aria-controls={threadId}>{item.label}</button>
              ))}
            </div>
            {!reducedMotion && (
              <button type="button" className="conversation-play" onClick={togglePlayback} aria-controls={threadId}>
                {playing ? 'Pause playback' : progress === null ? 'Play chat' : shown < messages.length ? 'Resume playback' : 'Replay chat'}
              </button>
            )}
          </div>
        )}
        <div id={threadId}>
          <Transcript messages={messages} shown={shown} playing={playing} />
          {!interactive && <details className="conversation-static-invoice">
            <summary>Invoice photo</summary>
            <Transcript messages={invoiceExpense} />
          </details>}
        </div>
        <figcaption>Illustrative Telegram exchange with fictional travelers and amounts.</figcaption>
      </figure>
    </section></Localized>
  );
}
