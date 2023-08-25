import { useState, useContext } from 'react'
import axios from 'axios';

import Info from '../Info'
import AppContext from '../../context';

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Drawer = ({ onClose, onRemoveItem, items = [], opened }) => {

  const useCart = () => {
    
    const { cartItems, setCartItems } = useContext(AppContext)
    const totalPrice = cartItems.reduce((sum, obj) => sum + +obj.price, 0)
    return { cartItems, setCartItems, totalPrice }
  }

  const { cartItems, setCartItems, totalPrice } = useCart();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);


  
  const onClickOrder = async () => {
    try {
      setIsLoading(true)
      const {data} = await axios.post('https://64e79250b0fd9648b7901fde.mockapi.io/orders', {
        items: cartItems
      })
      
      setOrderId(data.id)
      setIsOrderComplete(true)
      setCartItems([])

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete('https://64e79250b0fd9648b7901fde.mockapi.io/cart' + item.id);
        await delay(1000);
      }
    } catch (error) {
      console.log('Не удалось оформить заказ')
    }
    setIsLoading(false)
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">Корзина 
          <img className="cu-p" src="/img/btn-remove.svg" alt="close" 
            onClick={onClose}/>
        </h2>
        {
          items.length ? (
            <div className='d-flex flex-column flex'>
              <div className="items flex">
                {
                  items.map(obj => (
                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                      <div style={{ backgroundImage: `url(${obj.imageUrl})` }} 
                        className="cartItemImg"></div>
                      <div className="mr-20 flex">
                        <p className="mb-5">{obj.title}</p>
                        <b>{obj.price} руб.</b>
                      </div>
                      <img className="removeBtn" src="/img/btn-remove.svg" 
                      alt="remove" onClick={() => onRemoveItem(obj.id)}/>
                    </div>
                  ))
                }
              </div>
                <div className="cartTotalBlock">
                  <ul>
                    <li>
                      <span>Итого:</span>
                      <div></div>
                      <b>{totalPrice} руб.</b>
                    </li>
                    <li>
                      <span>Налог 5%:</span>
                      <div></div>
                      <b>{Math.floor(totalPrice * 0.05)} руб.</b>
                    </li>
                  </ul>
                  <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ 
                  <img src="/img/arrow.svg" alt="arrow"/></button>
                </div>
            </div>
          ) : (
          <Info title={isOrderComplete ? 'Заказ оформлен' : 'Корзина пока пуста'} 
          description={isOrderComplete ? `Спасибо! Ваш заказ под номером ${orderId}`  
          : 'Добавьте товар'}
          image={isOrderComplete ? '/img/complete-order.jpg' : '/img/emptycart.jpg'}/>
          )
        }
      </div>
    </div>
  )
}


export default Drawer