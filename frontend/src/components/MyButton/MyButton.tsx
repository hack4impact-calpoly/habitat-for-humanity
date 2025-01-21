import React, { useState } from 'react';
import "./MyButton.css"

interface MyButtonProps {
    label: string;
    onClick: () => void;
}

const MyButton = () => {
    const [name, setName] = useState<string>("");

    const buttonClick = (): void => {
        setName("Kailuan Liu");
    };

    return (
        <div className="button-container">
            <button type="button" className="practice" onClick={buttonClick}>
                Click Me 
            </button>
            {name && <p className="name-display">{name}</p>}
        </div>
    )
}
export default MyButton;