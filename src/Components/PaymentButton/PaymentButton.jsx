import React, { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PaymentButton = ({ order_name, order_cost, onPaymentSuccess, setPaymentID, ...props }) => {
    const [paymentProcessed, setPaymentProcessed] = useState(false);
    const isProcessing = useRef(false);

    const handleSuccess = useCallback((uniqeId) => {
        if (isProcessing.current) return; // предотвращаем повторное выполнение

        isProcessing.current = true;
        if (!paymentProcessed) {
            setPaymentProcessed(true);
            setPaymentID(uniqeId);  // Устанавливаем уникальный ID платежа
            if (onPaymentSuccess) {
                onPaymentSuccess(uniqeId);  // Вызываем onPaymentSuccess и передаем paymentID
            }
        }
    }, [paymentProcessed, onPaymentSuccess, setPaymentID]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://partner.life-pay.ru/gui/lifepay_widget/js/lp-widget.js?1234567';
        script.type = 'text/javascript';
        script.onload = () => {
            document.getElementById('payment-button').onclick = function () {
                if (!isProcessing.current) {
                    const uniqeId = uuidv4();  // Генерация нового order_id перед каждым вызовом виджета
                    const widget = new window.LpWidget({
                        name: order_name,
                        cost: order_cost,
                        key: "cj16pD7iiLSU54uC2GEkFWlU5tgoMT2FYv9tUT2mCXw=",
                        order_id: uniqeId,
                        prepayment_page: "0",
                        on_success: () => {
                            setPaymentID(uniqeId)
                            handleSuccess(uniqeId)
                        },
                        on_fail: function () {
                            console.log("Payment Failed", uniqeId);
                        },
                        on_close: function () {
                            console.log("Widget Closed", uniqeId);
                            isProcessing.current = false;  // Разблокировка нажатия после закрытия виджета
                        },
                    });
                    widget.render();
                }
                return false;
            };
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [order_name, order_cost, handleSuccess]);

    return (
        <div>
            <style>
                {/* {`
                    #a1lite_button {
                        background: url(https://partner.life-pay.ru/gui/images/a1lite_buttons/green-buttons_36.png) no-repeat -9999px -9999px;
                    }

                    #a1lite_button:hover {
                        background: url(https://partner.life-pay.ru/gui/images/a1lite_buttons/green-buttons_36.png) no-repeat;
                        padding-top: 56px;
                        width: 164px;
                        background-position: 3px 0px;
                        height: 0px !important;
                        display: inline-block;
                    }
                `} */}
                {
                    `
                        .payButtonHere{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 160px;
                            border: 1px solid transparent;
                            background-color: #69A64B;
                            padding: 12px 15px;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: all 0.3s ease-in-out;
                            color: #fff;
                            font-size: 14px;
                            font-weight: bold;
                        }

                        .payButtonHere:hover{
                            background-color:rgb(94, 148, 68);
                            box-shadow:0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)
                        }
                    `
                }
            </style>
            <a href="#" id="payment-button" className='payButtonHere'>
                {/* <img
                    id="a1lite_button"
                    style={{ border: 0 }}
                    className='payButtonHere'
                    // src="https://partner.life-pay.ru/gui/images/a1lite_buttons/green-buttons_35.png"
                    title="Оплатить"
                    alt="Оплатить"
                /> */}

                Забронировать
            </a>
        </div>
    );
};

export default PaymentButton;
