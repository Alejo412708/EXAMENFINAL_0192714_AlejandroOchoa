// Base de datos simulada con fechas de ejemplo
let inventory = [
    { id: 1, name: "Arroz Integral", stock: 3, price: 4500, expiry: "2026-12-31" },
    { id: 2, name: "Leche Entera", stock: 12, price: 3800, expiry: "2026-05-10" } // Esta saldrá vencida
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
        let statusBadge = "";
        const expiryDate = new Date(product.expiry + "T00:00:00");

        // LÓGICA DE ALERTAS (Problemática de Desperdicio y Stock)
        if (expiryDate < today) {
            statusBadge = '<span class="badge badge-expired">Expired / Vencido</span>';
            alerts.push(`Critical: ¡El producto "${product.name}" está VENCIDO desde el ${product.expiry}! Retirar para evitar pérdidas o multas.`);
        } else if (product.stock === 0) {
            statusBadge = '<span class="badge badge-critical">Out of Stock</span>';
            alerts.push(`Critical: ¡El producto "${product.name}" se ha agotado! Quiebre de stock.`);
        } else if (product.stock <= 5) {
            statusBadge = '<span class="badge badge-warning">Low Stock</span>';
            alerts.push(`Warning: "${product.name}" tiene bajo stock (${product.stock} u.).`);
        } else {
            statusBadge = '<span class="badge badge-ok">In Stock</span>';
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${String(product.id).padStart(3, '0')}</td>
            <td>${product.name}</td>
            <td>${product.stock} u.</td>
            <td>$${Number(product.price).toLocaleString()}</td>
            <td>${product.expiry}</td>
            <td>${statusBadge}</td>
            <td><button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.85em;" onclick="deleteProduct(${product.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    if (alerts.length === 0) {
        alertContainer.innerHTML = '<p class="no-alerts">✅ El inventario se encuentra en niveles óptimos y sin mermas.</p>';
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
        alert("Por favor, complete todos los campos correctamente.");
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
    const searchName = document.getElementById("prodName").value.trim().toLowerCase();
    if (!searchName) {
        alert("Ingrese el nombre en el campo de registro para buscar.");
        return;
    }
    
    const found = inventory.filter(p => p.name.toLowerCase().includes(searchName));
    if (found.length > 0) {
        alert(`Producto encontrado:\n${found.map(p => `- ${p.name}: ${p.stock} u. (Vence: ${p.expiry})`).join("\n")}`);
    } else {
        alert("No se encontraron productos con ese nombre.");
    }
}

updateDashboard();
