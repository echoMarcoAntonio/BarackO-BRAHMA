const menu = document.getElementById("menu")
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function () {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar o modal no botão
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

// Adicionar produto ao carrinho
menu.addEventListener("click", function () {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // Adicionar no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name == name)

    if (existingItem) {
        // Se o item já existe, incrementa 1 a quantidade
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

// Atualiza o Modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
            </div>
        </div>
        
        `
        // Calcula o preço individual do item x sua quantidade e soma ao total
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Contador do carrinho
    cartCounter.innerHTML = cart.length;
}

// Função para remover do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

// Função para remover um item
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name == name);

    // Encontrou na lista
    if (index !== -1) {
        const item = cart[index];

        // Quantidade superior a 1
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        // Quantidade não é maior que 1
        cart.splice(index, 1); // Splice: remove item (parâmetro passa sua posição) da lista
        updateCartModal();

    }

}

//  Input de endereço
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    // Verificar se está vazio
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-600")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        // Alerta Toast
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444"
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-600")
        return;
    }

    // Enviar o pedido para API WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$ ${item.price} | `
        )
    }).join("") // array -> string

    const message = encodeURIComponent(cartItems)
    const phone = "49991630270"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = [];
    updateCartModal();

})

// Função para verificar horário de funcionamento e manipular o card
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // true: restaurante está aberto
}

// Altera a cor do card de funcionamento
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-500");
} else {
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-600");
}
