import React from 'react';
import ExportOption from "./ExportOption";
import ImportOption from "./ImportOption";

const Setting = () => {

    return (
        <div className={'setting-container'}>
            <span className="icon-settings icon"/>
            <div className="options">
                <ExportOption/>
                <ImportOption/>
            </div>
        </div>
    );
};

export default Setting;
