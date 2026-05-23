import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from '../Scrollbar/Scrollbar';

// ✅ Import SVG assets properly
import dollarIcon from '../../assets/Dollar.svg';
import messageIcon from '../../assets/message.svg';
import pictureIcon from '../../assets/picture.svg';
import videoIcon from '../../assets/video.svg';
import partnerIcon from '../../assets/partner.svg';
import scrollIcon from '../../assets/scroll.svg';

// Reusable AccountabilityItem component
const AccountabilityItem = ({ title, imageSrc }) => {
    const [scroll, setscroll] = useState(true);
    const [key, setkey] = useState("");

    const scrolldown = () => {
        console.log("Toggled", title);

        if (scroll) {
            setscroll(false);
            setkey(title);
        } else {
            setscroll(true);
            setkey("");
        }
    };

    return (
        <div className="Todos flex items-center justify-between w-[90%] md:w-[90%] px-4 md:px-5 md:py-6 rounded border border-gray-300 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 relative">
            <Scrollbar className="Scrollbar" hidden={scroll} title={key} />

            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">
                {imageSrc && (
                    <img
                        src={imageSrc}
                        width="45"
                        alt={title}
                        className="rounded-md bg-gray-100 p-1"
                    />
                )}
                <nav>
                    <Link
                        to={`/${title.toLowerCase().replace(/\s+/g, '')}`}
                        className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                        {title}
                    </Link>
                </nav>
            </div>

            {/* Right: Toggle Button */}
            <span className="cursor-pointer">
                <img
                    onClick={scrolldown}
                    key={title}
                    src={scrollIcon}
                    width="60"
                    alt="Toggle"
                    className="hover:scale-105 transition-transform"
                />
            </span>
        </div>
    );
};

const Accountability = () => {
    return (
        <div className="Accountability-Draggable-Elements borde bg-slate-200 rounded min-h-[100%] flex flex-row overflow-x-auto md:flex-col md:h-auto justify-start md:justify-center items-center md:px-0">
            <AccountabilityItem title="PAYMENT" imageSrc={dollarIcon} />
            <AccountabilityItem title="MESSAGE" imageSrc={messageIcon} />
            <AccountabilityItem title="PICTURE" imageSrc={pictureIcon} />
            <AccountabilityItem title="VIDEO" imageSrc={videoIcon} />
            <AccountabilityItem title="ACCOUNTABILITY PARTNER" imageSrc={partnerIcon} />
        </div>
    );
};

export default Accountability;
