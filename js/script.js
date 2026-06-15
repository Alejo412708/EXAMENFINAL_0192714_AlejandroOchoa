// Base de datos simulada
let inventory = [
    { id: 1, name: "Arroz Integral", stock: 3, price: 4500, expiry: "2026-12-31" },
    { id: 2, name: "Leche Entera", stock: 12, price: 3800, expiry: "2026-06-01" }
];
let nextId = 3;

function updateDashboard() {
    const tbody = document.getElementById("inventoryTableBody");
    const alertContainer = document.getElementById("alertContainer");
    tbody.innerHTML = "";
    alertContainer.innerHTML = "";
    
    let alerts = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    inventory.forEach(product => {
        let stockBadge = "";
        let expiryBadge = "";
        
        if (product.stock === 0) {
            stockBadge = '<span class="badge badge-critical">Out of Stock</span>';
            alerts.push(`Critical: ¡El producto "${product.name}" está totalmente agotado!`);
        } else if (product.stock <= 5) {
            stockBadge = '<span class="badge badge-warning">Low Stock</span>';
            alerts.push(`Warning: "${product.name}" requiere reordenar (quedan ${product.stock} u.).`);
        } else {
            stockBadge = '<span class="badge badge-ok">In Stock</span>';
        }

        const expiryDate = new Date(product.expiry + "T00:00:00");
        if (expiryDate <= today) {
            expiryBadge = '<span class="badge badge-expired">ELIMINADO / EXPIRED</span>';
            alerts.push(`Critical: ¡"${product.name}" caducó y se eliminó de la venta comercial por seguridad!`);
        } else {
            expiryBadge = '<span class="badge badge-ok">Válido / Active</span>';
        }

        const row = document.createElement("tr");
        row.id = `row-${product.id}`; 
        row.innerHTML = `
            <td>${String(product.id).padStart(3, '0')}</td>
            <td><strong>${product.name}</strong></td>
            <td>${product.stock} u.</td>
            <td>${stockBadge}</td>
            <td>$${Number(product.price).toLocaleString()}</td>
            <td>${product.expiry}</td>
            <td>${expiryBadge}</td>
            <td>
                <button class="btn btn-buy" onclick="redirectToPayment('${product.name}', ${product.price})">Buy</button>
                <button class="btn btn-danger btn-table" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (alerts.length === 0) {
        alertContainer.innerHTML = '<p class="no-alerts">✅ El inventario se encuentra en niveles óptimos y seguro.</p>';
    } else {
        alerts.forEach(alertText => {
            const p = document.createElement("p");
            p.className = "alert-item";
            p.innerText = alertText;
            alertContainer.appendChild(p);
        });
    }
}

function addProduct() {
    const name = document.getElementById("prodName").value.trim();
    const stock = parseInt(document.getElementById("prodStock").value);
    const price = parseFloat(document.getElementById("prodPrice").value);
    const expiry = document.getElementById("prodExpiry").value;

    if (!name || isNaN(stock) || isNaN(price) || !expiry) {
        alert("Por favor, complete todos los campos para agregar un producto.");
        return;
    }

    const newProduct = { id: nextId++, name, stock, price, expiry };
    inventory.push(newProduct);
    updateDashboard();
    document.getElementById("inventoryForm").reset();
}

function deleteProduct(id) {
    inventory = inventory.filter(p => p.id !== id);
    updateDashboard();
}

function searchProduct() {
    const searchName = document.getElementById("searchFieldName").value.trim().toLowerCase();
    
    inventory.forEach(p => {
        const r = document.getElementById(`row-${p.id}`);
        if(r) r.classList.remove("highlight-row");
    });

    if (!searchName) {
        alert("Escribe el nombre del producto en el nuevo cuadro de búsqueda.");
        return;
    }
    
    const found = inventory.find(p => p.name.toLowerCase().includes(searchName));
    
    if (found) {
        const targetRow = document.getElementById(`row-${found.id}`);
        if (targetRow) {
            targetRow.classList.add("highlight-row");
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        alert("No se encontró ningún producto con ese nombre.");
    }
}

function clearHighlights() {
    document.getElementById("searchFieldName").value = "";
    inventory.forEach(p => {
        const r = document.getElementById(`row-${p.id}`);
        if(r) r.classList.remove("highlight-row");
    });
}

// CORRECCIÓN DE LA URL REMOTA CON TU LINK VERIFICADO
function redirectToPayment(name, price) {
    alert(`Procesando orden de compra para: ${name}. Redireccionando a la pasarela de pagos...`);
    window.open(`https://alejo412708.github.io/css3p/?item=${encodeURIComponent(name)}&price=${price}`, '_blank');
}

updateDashboard();
