import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

function App() {
  const [cartOpened, setCartOpened] = useState(false);
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get("https://64e3e71ebac46e480e79490f.mockapi.io/cart"),
          axios.get("https://64e3e71ebac46e480e79490f.mockapi.io/favorites"),
          axios.get("https://64b8521b21b9aa6eb079c726.mockapi.io/items")
        ])

        setIsLoading(false)
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (err) {
        alert('Ошибка при запросе данных')
      }
    }
    fetchData();
  }, []);

  const onAddToCart = async(obj) => {
    try {
      const findItem = cartItems.find(item => +item.parentId === +obj.id)
      if (findItem) {
        setCartItems(prev => prev.filter(item => +item.parentId !== +obj.id))
        await axios.delete(`https://64e3e71ebac46e480e79490f.mockapi.io/cart/${findItem.id}`)
      } else {
        setCartItems(prev => [...prev, obj])
        const {data} = await axios.post("https://64e3e71ebac46e480e79490f.mockapi.io/cart", obj)
        setCartItems(prev => [...prev.map(item => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          } 
          return item
        })])
      }
    } catch(err) {
      alert('ошибка при добавлении товара в корзину')
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://64e3e71ebac46e480e79490f.mockapi.io/cart/${id}`)
      setCartItems(prev => prev.filter(item => +item.id !== +id))
    } catch(err) {
      alert('Ошибка при удалении')
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if(favorites.find(favObj => +favObj.id === +obj.id)) {
        axios.delete(`https://64e3e71ebac46e480e79490f.mockapi.io/favorites/${obj.id}`)
      } else {
        const { data } = await axios.post("https://64e3e71ebac46e480e79490f.mockapi.io/favorites", obj)
        setFavorites(prev => [...prev, data])
      }
    } catch {
      alert("Не удалось...")
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some(obj => +obj.parentId === +id)
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, 
    isItemAdded, onAddToFavorite, setCartOpened, setCartItems, onAddToCart }}>
      <div className="wrapper clear">
        {<Drawer onClose={() => setCartOpened(false)}
          items={cartItems} onRemoveItem={onRemoveItem} opened={cartOpened}/>}
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route index element={<Home 
          items={items} searchValue={searchValue} 
          setSearchValue={setSearchValue} 
          onChangeSearchInput={onChangeSearchInput}
          onAddToCart={onAddToCart} onAddToFavorite={onAddToFavorite}
          cartItems={cartItems} isLoading={isLoading}/>} />
        </Routes>
        <Routes>
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Routes>
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
