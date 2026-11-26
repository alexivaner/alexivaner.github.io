import React, { useId } from 'react';
import { Localized } from '../i18n/I18n.jsx';
import '../../styles/ourtrip-conversation.css';

const conversation = [
  { speaker: 'Alex', text: 'I paid ¥5,000 for dinner in Osaka.' },
  { speaker: 'OurTrip', text: 'Recorded ¥5,000 for dinner in Osaka, paid by Alex.' },
  { speaker: 'Alex', text: 'Sam paid half.' },
  { speaker: 'OurTrip', text: 'Did Sam send you ¥2,500, or did you each pay ¥2,500 at the restaurant?' },
  { speaker: 'Alex', text: 'Sam transferred it to me later.' },
  { speaker: 'OurTrip', text: 'Confirm the ¥2,500 reimbursement from Sam to Alex. The original dinner payment stays at ¥5,000.' },
];

export default function OurTripConversation({ headingLevel = 3 }) {
  const titleId = useId();
  const Heading = `h${headingLevel}`;
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
        <ol className="conversation-thread" role="list">
          {conversation.map(({ speaker, text }) => (
            <li key={text} className={speaker === 'OurTrip' ? 'conversation-reply' : 'conversation-request'}>
              <strong>{speaker}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <figcaption>Illustrative Telegram exchange with fictional travelers and amounts.</figcaption>
      </figure>
    </section></Localized>
  );
}
