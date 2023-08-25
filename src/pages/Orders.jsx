import { useEffect, useState } from 'react';
import Card from '../components/Card/Card';
import axios from 'axios';


function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://64e79250b0fd9648b7901fde.mockapi.io/orders");
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items],[]))
        setIsLoading(false)
      } catch (err) {
        alert('Ошибка....')
      }
    })()
  }, [])

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>
      <div className="d-flex flex-wrap">
        {(isLoading ? [Array(8)] : orders).map((item, index) => (
          <Card key={index}
          {...item}/>
        ))}
      </div>
    </div>
  )
}

export default Orders;