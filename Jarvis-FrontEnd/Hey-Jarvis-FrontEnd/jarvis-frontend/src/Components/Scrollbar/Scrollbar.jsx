import React from 'react';
import { useSelector } from 'react-redux';

const Scrollbar = ({ hidden, title, className }) => {
  const photos = useSelector((state) => state.photo.Photos);
  const messages = useSelector((state) => state.message.messages);
  const payouts = useSelector((state) => state.payout.Payouts);


  const renderContent = () => {
    switch (title) {
      case 'LIVE PHOTO':
        return (
          <div>
            <ul className="list-disc ml-5 Todo-Draggable-Elements">
              {photos.map((photo) => (
                <div
                  className="ScrollBar_Elements"
                  key={photo.id}
                  data-id={photo.id}
                  data-collectiontype="PhotoCollection"
                >
                  {photo.photoName}
                </div>
              ))}
            </ul>
          </div>
        );
      case 'MESSAGE':
        return (
          <div>
            <ul className="list-disc ml-5 Accountability-Draggable-Elements">
              {messages.map((message) => (
                <div
                  className="ScrollBar_Elements"
                  key={message.AccountabilityId}
                  data-id={message.AccountabilityId}
                  data-collectiontype="MessageCollection"
                >
                  {message.message}
                </div>
              ))}
            </ul>
          </div>
        );
      case 'PAYMENT':
        return (
          <div>
            <ul className="list-disc ml-5 Payment-Draggable-Elements">
              {payouts.map((payout) => (
                <div
                  className="ScrollBar_Elements"
                  key={payout.AccountabilityId}
                  data-id={payout.AccountabilityId}
                  data-collectiontype="PayoutCollection"
                >
                  {payout.name} - ₹{payout.amount}
                </div>
              ))}
            </ul>
          </div>
        );

      case 'RANDOMISED':
        return (
          <div>
            <ul className="list-disc ml-5 Todo-Draggable-Elements">
              {photos
                .map((photo) => (
                  <div
                    className="ScrollBar_Elements"
                    key={photo.id}
                    data-id={photo.id}
                    data-collectiontype="RandomisedCollection"
                  >
                    {photo.photoName}
                  </div>
                ))}
            </ul>
          </div>
        );

      default:
        return <p>No content selected.</p>;
    }
  };

  return (
    <div
      className={`absolute bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl border border-slate-200 
                       right-2 top-full mt-2 w-[320px] max-w-[90vw] h-[280px] max-h-[60vh] 
                       overflow-y-auto z-50 transition-all duration-300 transform origin-top-right
                       ${hidden ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} 
                       ${className}`}
    >
      {renderContent()}
    </div>
  );
};

export default Scrollbar;