import React, { useEffect, useState } from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title, Card } from "rbx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from 'react-bootstrap'

function openCart() {
  document.getElementById("cart-tab").style.width = "30%";
}

function closeCart() {
  document.getElementById("cart-tab").style.width = "0%";
}

function addToCart() {

}

const App = () => {
  const [data, setData] = useState({});
  const [itemSize, setItemSize] = useState("");
  const [cartData, setCartData] = useState([]);
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar>
        <h1 class="header">Amazon... but better</h1>
        <Button class="cart_button" onClick={openCart}><FontAwesomeIcon icon={faShoppingCart} id="shopping_cart_icon"/></Button>
        <div id="cart-tab" class="overlay">
          <Button class="closebtn" onClick={closeCart}>&times;</Button>
          <FontAwesomeIcon icon={faShoppingCart} class="cart_logo" id="shopping_cart_icon"/>
          <div class="overlay-content">
            <Cart setCartData={setCartData} items={cartData}/>
          </div>
        </div>
      </Navbar>
      <div class="card_container">
        {products.map(product => <ItemCard product={product} cartData={cartData} setCartData={setCartData}/>)}
      </div>
    </div>
  );
};

const ItemCard = ({product, cartData, setCartData}) => {
  const [itemSize, setItemSize] = useState("");
  return (
    <Card class="product_card" key={product.sku}><img src={"./data/products/" + product.sku + "_1.jpg"} alt="product image"/>
      <h3 id="title">{product.title}</h3>
      <p id="description">{product.description}</p>
      <h2 id="price">{"$" + product.price.toFixed(2)}</h2>
      <div class="sizes">
        <SelectSize setItemSize={setItemSize} selectedSize={itemSize} size="S"/>
        <SelectSize setItemSize={setItemSize} selectedSize={itemSize} size="M"/>
        <SelectSize setItemSize={setItemSize} selectedSize={itemSize} size="L"/>
        <SelectSize setItemSize={setItemSize} selectedSize={itemSize} size="XL"/>
      </div>
      <AddToCart setCartData={setCartData} item={product} size={itemSize} cartData={cartData}/>
    </Card>
  );
}

const SelectSize = ({setItemSize, selectedSize, size}) => {
  return (
    selectedSize === size ? <Button class="button selected-size" onClick={() => setItemSize(size)}>{size}</Button> : <Button class="button" onClick={() => setItemSize(size)}>{size}</Button>
  );
}

const AddToCart = ({setCartData, item, size, cartData}) => {
  return (
    <Button class="addtocart" onClick={size ? () => {setCartData([...cartData, {it: item, sz: size}])} : () => {alert("Please select a size.")}}>Add to Cart</Button>
  );
}

const Cart = ({setCartData, items}) => {
  return (
    <div>
      {items.map(item => <Card class="cart_card">
        <img src={"./data/products/" + item.it.sku + "_1.jpg"} alt=""/>
        <Button class="deletebtn" onClick={() => {setCartData(items.filter(i => item.it.sku !== i.it.sku))}}>&times;</Button>
        <div class="info">
          <h2 id="cart_title">{item.it.title}</h2>
          <h2 id="cart_price">{"$" + item.it.price.toFixed(2)}</h2>
          <h2 id="cart_size">{"Size: " + item.sz}</h2>
          <Quantity />
        </div>
      </Card>)}
    </div>
  );
}

const Quantity = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <h2>{"Quantity: " + quantity}</h2>
      {quantity > 1 ? <Button class="qtybtn" onClick={() => setQuantity(quantity => quantity - 1)}>-</Button> : <Button class="qtybtn inactive">-</Button>}
      <Button class="qtybtn" onClick={() => setQuantity(quantity => quantity + 1)}>+</Button>
    </div>
  );
}

export default App;