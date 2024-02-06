// <%if(locals.cartData){%>
//     <div class="cart__sidebar">
//       <div class="container">
//           <div class="cart__content">
//               <div class="cart-text">
//                   <h3 class="mb-40">Shopping cart</h3>
                  
//                    <% locals.cartData.forEach(el=>{%>
//                       <div class="add_cart_product">
//                           <div class="add_cart_product__thumb">
//                               <img src="/public/images/<%=el.productId.imageurl[0]%>" alt="">
//                           </div>
//                           <div class="add_cart_product__content"></div>
                          
                              
//                               <h5><a href="shop.html"><%= el.productId.producttitle%></a></h5>
//                               <p><%= el.productId.price %></p>
//                               <button class="cart_close"><i class="fal fa-times"></i></button>
//                           </div>
//                       </div>
//                       <%})%>
                    
//                   <% } %>
                  