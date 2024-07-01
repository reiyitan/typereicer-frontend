import React from "react"; 
import "./WarningMessage.css";

export const WarningMessage = ({value, setValue}) => {
    return (
        <div className="warning-div">
            {value}
        </div>
    ); 
}