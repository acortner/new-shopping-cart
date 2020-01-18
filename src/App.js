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
            <Card class="cart_card">
              <img src="./data/products/18532669286405344_2.jpg" alt=""/>
              <div class="info">
                <h2 id="cart_title">Shirt</h2>
                <h2 id="cart_price">$10.00</h2>
              </div>
            </Card>
          </div>
        </div>
      </Navbar>
      <div class="card_container">
        {products.map(product => <Card class="product_card" key={product.sku}><img src={"./data/products/" + product.sku + "_1.jpg"} alt="product image"/>
          <h3 id="title">{product.title}</h3>
          <p id="description">{product.description}</p>
          <h2 id="price">{"$" + product.price.toFixed(2)}</h2>
          <div class="sizes">
            <Button>S</Button>
            <Button>M</Button>
            <Button>L</Button>
            <Button>XL</Button>
          </div>
          <Button class="addtocart" onClick={addToCart}>Add to Cart</Button>
        </Card>)}
      </div>
    </div>
  );
};

export default App;
