import React, { useState, useRef } from 'react';
import classes from './Accordion.module.css';

import accordion_arrow from '/accordion_arrow.png';
import accordion_close from '/accordion_close.png';
import delete_icon from '/delete.png';

import server from '../../../serverConfig';

const AccordionItem = ({ title, content, isOpen, needDelete, handleClick, handleDelete }) => {
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
          {needDelete ? (
            <img
              src={delete_icon}
              className={classes.delete_icon}
              alt="Удалить"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
          ) : null}
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

const Accordion = ({ items, setItems, onSuccess, needDelete }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const handleDelete = async (id, index) => {
    try {
      await fetch(`${server}/api/deleteFaq/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Ошибка при удалении элемента:', error);
    }

    onSuccess && onSuccess();
  };

  return (
    <div className={classes.accordion}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.question}
          content={item.answer}
          needDelete={needDelete}
          isOpen={index === openIndex}
          handleClick={() => handleClick(index)}
          handleDelete={() => handleDelete(item._id)}
        />
      ))}
    </div>
  );
};

export default Accordion;
