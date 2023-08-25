
import Card from '../components/Card/Card';

function Home({ items, searchValue, setSearchValue, 
  onChangeSearchInput, onAddToCart, onAddToFavorite, isLoading}) {
  

  const renderItems = () => {
    const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()))
    return (isLoading ? [...Array(8)] 
      : filteredItems)
        .map((item, index) => (
          <Card key={index}
          onPlus={obj => onAddToCart(obj)} 
          onFavorite={(obj) => onAddToFavorite(obj)}
          loading={isLoading}
        {...item}/>)
    )
  }

  return (
    <>
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` 
            : 'Все кроссовки'}</h1>
          <div className="search-block d-flex">
            <img src="/img/search.svg" alt="Search" />
            {searchValue && <img className="clear cu-p" src="/img/btn-remove.svg" alt="clear" 
              onClick={() => setSearchValue('')}/>}
            <input placeholder="Введите для поиска..."
              value={searchValue} onChange={onChangeSearchInput}/>
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {renderItems()}
        </div>
      </div>
    </>
  )
}

export default Home;