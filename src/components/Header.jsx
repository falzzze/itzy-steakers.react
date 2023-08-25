import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../context'

const Header = ({ onClickCart }) => {

  const { cartItems } = useContext(AppContext);

  const totalPrice = cartItems.reduce((sum, obj) => sum + +obj.price, 0)


  return (
    <div>
      <header className="d-flex justify-between align-center p-40">
        <Link to="/">
          <div className="d-flex align-center">
            <img width={40} height={40} src="/img/logo.png" alt="logo"/>
            <div>
              <h3 className="text-uppercase">Itzy Sneakers</h3>
              <p className="opacity-5">Магазин брендовых кроссовок</p>
            </div>
          </div>
        </Link>
        <ul className="d-flex">
          <li className="mr-30 cu-p" onClick={onClickCart}>
            <img width={18} height={18} src="/img/cart.svg" alt="cart"
            />
            <span>{totalPrice} руб.</span>
          </li>
          <li className='mr-20 cu-p'>
            <Link to="/favorites">
              <img width={18} height={18} src="/img/fav.svg" alt="fav"/>
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <img width={18} height={18} src="/img/user.svg" alt="user"/>
            </Link>
          </li>
        </ul>
      </header>
    </div>
  )
}

export default Header