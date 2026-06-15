// Base de datos simulada con fechas de ejemplo para las pruebas en tiempo real
let inventory = [
    { id: 1, name: "Arroz Integral", stock: 3, price: 4500, expiry: "2026-12-31" },
    { id: 2, name: "Leche Entera", stock: 12, price: 3800, expiry: "2026-06-01" } // Fecha pasada para activar alerta
];
let nextId = 3;

function updateDashboard() {
    const tbody = document.getElementById("inventoryTableBody");
    const alertContainer = document.getElementById("alertContainer");
    tbody.innerHTML = "";
    alertContainer.innerHTML = "";
    
    let alerts = [];
    
    // Captura fecha de hoy a medianoche para comparación exacta
    const today = new Date();
    today.setHours(0,0,0,0);

    inventory.forEach(product => {
        let stockBadge = "";
        let expiryBadge = "";
        
        // 1. Evaluar Estado del Stock (Columna Separada)
        if (product.stock === 0) {
            stockBadge = '<span class="badge badge-critical">Out of Stock</span>';
            alerts.push(`Critical: ¡El producto "${product.name}" está totalmente agotado!`);
        } else if (product.stock <= 5) {
            stockBadge = '<span class="badge badge-warning">Low Stock</span>';
            alerts.push(`Warning: "${product.name}" requiere reordenar (quedan ${product.stock} u.).`);
        } else {
            stockBadge = '<span class="badge badge-ok">In Stock</span>';
        }

        // 2. Evaluar Estado de Vencimiento (Columna Separada)
        const expiryDate = new Date(product.expiry + "T00:00:00");
        if (expiryDate <= today) {
            expiryBadge = '<span class="badge badge-expired">ELIMINADO / EXPIRED</span>';
            alerts.push(`Critical: ¡"${product.name}" caducó y se eliminó de la venta comercial por seguridad!`);
        } else {
            expiryBadge = '<span class="badge badge-ok">Válido / Active</span>';
        }

        // 3. Crear fila con todas las celdas ordenadas y el botón Delete en su lugar
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${String(product.id).padStart(3, '0')}</td>
            <td><strong>${product.name}</strong></td>
            <td>${product.stock} u.</td>
            <td>${stockBadge}</td>
            <td>$${Number(product.price).toLocaleString()}</td>
            <td>${product.expiry}</td>
            <td>${expiryBadge}</td>
            <td><button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.85em;" onclick="deleteProduct(${product.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });

    // Renderizar caja superior de alertas en el DOM
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
