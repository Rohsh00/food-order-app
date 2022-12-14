import { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [orderClicked, setOrderClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [didSubmit, setDidSumit] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const submitOrderHandler = async (formData) => {
    setIsLoading(true);
    const response = await fetch(
      "https://react-http-fc24f-default-rtdb.firebaseio.com/orders.json ",
      {
        method: "POST",
        body: JSON.stringify({
          userData: formData,
          orderItems: cartCtx.items,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setIsLoading(false);
    setDidSumit(true);
    cartCtx.clearCart();
    const data = await response.json();
    console.log(data);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderClickHandler = () => {
    setOrderClicked(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      {
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
      }
      {hasItems && (
        <button className={classes.button} onClick={orderClickHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {orderClicked && (
        <Checkout onCancel={props.onClose} onSendingData={submitOrderHandler} />
      )}
      {!orderClicked && modalActions}{" "}
    </>
  );

  const loadingModalContent = <p>Sending order data</p>;

  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order</p>
      <div className={classes.actions}>
        {
          <button className={classes.button} onClick={props.onClose}>
            Close
          </button>
        }
      </div>
    </>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isLoading && !didSubmit && cartModalContent}
      {isLoading && loadingModalContent}
      {!isLoading && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
