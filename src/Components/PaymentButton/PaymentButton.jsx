import React, { useEffect, useState, useCallback, useRef } from 'react';

const PaymentButton = ({ order_name, order_cost, order_id, onPaymentSuccess, ...props }) => {
    const [paymentProcessed, setPaymentProcessed] = useState(false);
    const isProcessing = useRef(false);

    const handleSuccess = useCallback(() => {
        if (isProcessing.current) return; // предотвращаем повторное выполнение

        isProcessing.current = true;
        if (!paymentProcessed) {
            setPaymentProcessed(true);
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
            // console.log("Payment Successful");
        }
    }, [paymentProcessed, onPaymentSuccess]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://partner.life-pay.ru/gui/lifepay_widget/js/lp-widget.js?1234567';
        script.type = 'text/javascript';
        script.onload = () => {
            const widget = new window.LpWidget({
                name: order_name,
                cost: order_cost,
                key: "tX7+E/OF6hgb4CJzEjWGXMIDvvIviUweyePg8uOH2xw=",
                order_id: order_id,
                prepayment_page: "0",
                on_success: handleSuccess,
                on_fail: function () {
                    // console.log("Payment Failed");
                },
                on_close: function () {
                    // console.log("Widget Closed");
                },
            });

            document.getElementById('payment-button').onclick = function () {
                if (!isProcessing.current) {
                    widget.render();
                }
                return false;
            };
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [order_name, order_cost, order_id, handleSuccess]);

    return (
        <div>
            <style>{`
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
            `}</style>
            <a href="#" id="payment-button" >
                <img id="a1lite_button" style={{ border: 0 }}
                    src="https://partner.life-pay.ru/gui/images/a1lite_buttons/green-buttons_35.png" title="Оплатить" alt="Оплатить" />
            </a>
        </div>
    );
};

export default PaymentButton;
