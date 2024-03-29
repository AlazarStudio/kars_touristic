import React, { useState, useRef } from 'react';
import classes from './Accordion.module.css';

import accordion_arrow from '/accordion_arrow.png';
import accordion_close from '/accordion_close.png';

const AccordionItem = ({ title, content, isOpen, handleClick }) => {
  const contentRef = useRef(null);

  return (
    <div className={classes.accordion_item}>
      <div className={`${classes.title} ${isOpen ? 'active' : ''}`} onClick={handleClick}>
        <div className={classes.title_name}>
          {title}
          <img
            className={isOpen ? classes.close_icon : classes.arrow_icon}
            src={isOpen ? accordion_close : accordion_arrow}
            alt=""
          />
        </div>
        <div
          ref={contentRef}
          className={`${classes.title_content} ${isOpen ? classes.open : ''}`}
          style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}
        >
          <div className={classes.title_content__line}></div>
          {content}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className={classes.accordion}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={index === openIndex}
          handleClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
