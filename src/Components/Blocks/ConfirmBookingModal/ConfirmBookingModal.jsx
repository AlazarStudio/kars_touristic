import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import PaymentButton from '../../PaymentButton/PaymentButton';
import classes from '../CalendarTour/CalendarTour';
import { Padding } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  padding: '30px 20px',
  textAlign: 'center',
  borderRadius: '20px',
};

const ConfirmBookingModal = ({
  open,
  handleClose,
  user,
  tour,
  paymentMethod,
  setPaymentMethod,
  isAgreed,
  paymentID,
  setPaymentID,
  setIsAgreed,
  handleBooking,
  sendRequestFromUser,
  totalCost,
  handleConfirm,
}) => {
  return (
    <Modal open={open} onClose={handleClose} sx={{ zIndex: 1302 }}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: '600', mb: 4 }}>
          Подтвердите бронирование
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Вы уверены, что хотите забронировать тур?
        </Typography>

        {user && (user.role == 'agent' || user.role == 'admin') && (
          <>
            <h3>Выберите способ оплаты</h3>
            <div className={classes.paymentMethods}>
              <label className={classes.radioLabel}>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={classes.radioInput}
                />
                Карта
              </label>
              <label className={classes.radioLabel}>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={classes.radioInput}
                />
                Наличные
              </label>
            </div>
          </>
        )}
        {/* <div className={classes.agreement}>
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className={classes.checkbox}
                    />
                    <p>Согласен с правилами бронирования</p>
                </div> */}

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{
              borderRadius: '10px',
              boxShadow: 'none',
              width: '160px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          >
            Отмена
          </Button>

          <PaymentButton
            style={{}}
            order_name={tour.tourTitle}
            order_cost={totalCost}
            setPaymentID={setPaymentID}
            onPaymentSuccess={(paymentID) => handleBooking(paymentID)}
          />

          {/* <Button variant="contained" onClick={handleConfirm}>
                        Забронировать
                    </Button> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmBookingModal;
