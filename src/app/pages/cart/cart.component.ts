import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        id: 1,
        product: "https://via.placeholder.com/150",
        name: "Sneakers",
        price: 65,
        quantity: 12,
      },
      {
        id: 2,
        product: "https://via.placeholder.com/150",
        name: "T-Shirt",
        price: 40,
        quantity: 21,
      },
      {
        id: 3,
        product: "https://via.placeholder.com/150",
        name: "Pants",
        price: 80,
        quantity: 17,
      },
      {
        id: 4,
        product: "https://via.placeholder.com/150",
        name: "Jacket",
        price: 120,
        quantity: 6,
      },
      {
        id: 5,
        product: "https://via.placeholder.com/150",
        name: "Hat",
        price: 35,
        quantity: 18,
      },
    ],
  };

  dataSource: Array<CartItem> = [];

  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];
  constructor(
    private cartService: CartService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }
  onCheckout(): void {
    this.httpClient
      .post("http://localhost:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51JpGR9IZK4v7qkytzmvxTLa0C4AtaOLAaxGxWKBxc5CL1US3qFCf9pWfUPnc6OhkxL2Xv5s97uSjQAgv73KyDTWI006SYC716Q"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
