import React, { useState } from "react";
import classes from './ToursTab.module.css';

function ToursTab({ children, tabs, ...props }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    function parseHTML(htmlString) {
        const domParser = new DOMParser();
        const parsedDocument = domParser.parseFromString(htmlString, 'text/html');

        function parseNode(node, index) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const props = {};
                for (let i = 0; i < node.attributes.length; i++) {
                    const { name, value } = node.attributes[i];
                    props[name] = value;
                }
                const children = Array.from(node.childNodes).map(parseNode);
                return React.createElement(node.tagName.toLowerCase(), { key: index, ...props }, ...children);
            }
        }

        return Array.from(parsedDocument.body.childNodes).map(parseNode);
    }
    return (
        <>
            <div className={classes.tabs}>
                <div className={classes.tabButtons}>
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleTabClick(index)}
                            className={index === activeTab ? `${classes.active}` : ''}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>
                <div className={classes.tabContent}>
                    {parseHTML(tabs[activeTab].content)}
                </div>
            </div>
        </>
    );
}

export default ToursTab;