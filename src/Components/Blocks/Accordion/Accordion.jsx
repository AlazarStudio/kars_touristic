import classes from './Accordion.module.css';

import React, { useState } from 'react';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <div className={`title ${isOpen ? 'active' : ''}`} onClick={handleClick}>
        <i className="dropdown icon"></i>
        {title}
      </div>
      {isOpen && <div className="content">{content}</div>}
    </div>
  );
};

const Accordion = ({ items }) => {
  return (
    <div className="ui styled accordion">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default Accordion;
