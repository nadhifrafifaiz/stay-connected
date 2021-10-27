import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
    <div className="textContainer">
        {
            users
                ? (
                    <div>
                        <h4>People currently chatting:</h4>
                        <div className="activeContainer">
                            <p>
                                {users.map(({ name }) => (
                                    <div key={name} className="activeItem">
                                        <img className="pr-10" alt="Online Icon" src={onlineIcon} />
                                        {name}
                                    </div>
                                ))}
                            </p>
                        </div>
                    </div>
                )
                : null
        }
    </div>
);

export default TextContainer;