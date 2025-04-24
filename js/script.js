/* index */
function validarPIN() {
    const usuarioSeleccionado = document.getElementById("cuenta").value;
    const pinIngresado = document.getElementById("PIN").value;

    const cuentas = {
        "1001-2233-4455-6677": "1234",
        "2002-3344-5566-7788": "5678",
        "3003-4455-6677-8899": "9101",
        "4004-5566-7788-9900": "1122"
    };

    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = "";

    if (cuentas[usuarioSeleccionado] === pinIngresado) {
        localStorage.setItem("cuenta", usuarioSeleccionado);

        if (!localStorage.getItem(`transacciones_${usuarioSeleccionado}`)) {
            localStorage.setItem(`transacciones_${usuarioSeleccionado}`, JSON.stringify([]));
        }

        window.location.href = "acciones.html";
        return false;
    } else {
        const alerta = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> Número de cuenta o PIN incorrecto.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        alertContainer.innerHTML = alerta;
        return false;
    }
}

/* Acciones */

const cuentasNombres = {
    "1001-2233-4455-6677": "Christian Alfaro",
    "2002-3344-5566-7788": "Luis Hernandez",
    "3003-4455-6677-8899": "Raquel Saenz",
    "4004-5566-7788-9900": "Gerardo Zelaya"
};

// Obtener la cuenta actual del usuario desde localStorage
const cuentaActual = localStorage.getItem("cuenta");

// Verificar si existe una sesión activa
if (cuentaActual && cuentasNombres[cuentaActual]) {
    const nombreUsuarioElem = document.getElementById("nombre-usuario");
    const numeroCuentaElem = document.getElementById("numero-cuenta");

    if (nombreUsuarioElem && numeroCuentaElem) {
        nombreUsuarioElem.innerText = "Bienvenido, " + cuentasNombres[cuentaActual];
        numeroCuentaElem.innerText = "Número de cuenta: " + cuentaActual;
    }
} else {
    window.location.href = "index.html";
}

/* Deposito */

function depositar() {
    let monto = parseFloat(document.getElementById("monto-deposito").value);
    let fecha = new Date();
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = "";

    if (!isNaN(monto) && monto > 0) {
        const usuario = localStorage.getItem("cuenta");

        if (usuario) {
            let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];
            transacciones.push({ tipo: "Depósito", monto: monto, fecha: fecha.toISOString() });
            localStorage.setItem(`transacciones_${usuario}`, JSON.stringify(transacciones));

            alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Éxito:</strong> Depósito realizado con éxito.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                    </div>
                `;

            setTimeout(() => {
                window.location.href = "saldo.html";
            }, 1500);
        } else {
            alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> No se encontró un usuario logueado.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                    </div>
                `;
        }
    } else {
        alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> Ingrese un monto válido.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;
    }
}

/* Retiro */
function retirar() {
    let monto = parseFloat(document.getElementById("monto-retiro").value);
    let saldo = calcularSaldo();
    let fecha = new Date();
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = "";

    if (!isNaN(monto) && monto > 0 && monto <= saldo) {
        const usuario = localStorage.getItem("cuenta");

        if (usuario) {
            let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];
            transacciones.push({ tipo: "Retiro", monto: monto, fecha: fecha.toISOString() });
            localStorage.setItem(`transacciones_${usuario}`, JSON.stringify(transacciones));

            alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Éxito:</strong> Retiro realizado con éxito.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                    </div>
                `;

            setTimeout(() => {
                window.location.href = "saldo.html";
            }, 1500);

        } else {
            alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> No se encontró un usuario logueado.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                    </div>
                `;
        }
    } else {
        alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> Fondos insuficientes o monto inválido.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;
    }
}

function calcularSaldo() {
    const usuario = localStorage.getItem("cuenta");
    let saldo = 0;
    let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

    transacciones.forEach(transaccion => {
        if (transaccion.tipo === "Depósito") saldo += transaccion.monto;
        else if (transaccion.tipo === "Retiro" || transaccion.tipo.includes("Pago de")) saldo -= transaccion.monto;
    });

    return saldo;
}

/* Saldo */

function mostrarSaldo() {
    const usuario = localStorage.getItem("cuenta");

    if (!usuario) {
        const alertContainer = document.getElementById("alert-container");
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> No se ha iniciado sesión.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;
        }
        return;
    }

    let saldo = 0;
    let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

    transacciones.forEach(transaccion => {
        if (transaccion.tipo === "Depósito") saldo += transaccion.monto;
        else if (transaccion.tipo === "Retiro" || transaccion.tipo.includes("Pago de")) saldo -= transaccion.monto;
    });

    const saldoElemento = document.getElementById("saldo-actual");
    if (saldoElemento) {
        saldoElemento.innerText = `$${saldo.toFixed(2)}`;
    } else {
        console.warn("Elemento #saldo-actual no encontrado en esta página.");
    }
}

window.addEventListener("load", mostrarSaldo);

/*
function calcularSaldo() {
    const usuario = localStorage.getItem("cuenta");

    if (!usuario) {
        document.getElementById("alert-container").innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> No se ha iniciado sesión.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;
        return;
    }

    let saldo = 0;
    let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

    transacciones.forEach(transaccion => {
        if (transaccion.tipo === "Depósito") saldo += transaccion.monto;
        else if (transaccion.tipo === "Retiro" || transaccion.tipo.includes("Pago de")) saldo -= transaccion.monto;
    });

    document.getElementById("saldo-actual").innerText = `$${saldo.toFixed(2)}`;
}
     window.onload = calcularSaldo;
*/
   
/* Pago */
function pagarServicio() {
    let tipo = document.getElementById("tipo-servicio").value;
    let monto = parseFloat(document.getElementById("monto-pago").value);
    let saldo = calcularSaldo();
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = "";

    if (monto > 0 && monto <= saldo) {
        const usuario = localStorage.getItem("cuenta");
        let transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

        let fecha = new Date();
        let fechaFormateada = fecha.toISOString().split('T')[0];

        transacciones.push({ tipo: tipo, monto: monto, fecha: fechaFormateada });
        localStorage.setItem(`transacciones_${usuario}`, JSON.stringify(transacciones));

        alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Éxito:</strong> ${tipo} pagado con éxito.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;

        setTimeout(() => {
            window.location.href = "saldo.html";
        }, 1500);

    } else {
        alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> Fondos insuficientes o monto inválido.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;
    }
}

/* Historial */
function mostrarHistorial() {
    const usuario = localStorage.getItem("cuenta");
    const lista = document.getElementById("historial-lista");

    if (!usuario || !lista) {
        return;
    }

    const transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

    if (transacciones.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-center">No hay transacciones registradas.</li>';
    } else {
        transacciones.forEach(transaccion => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-start flex-column text-start";

            const fecha = new Date(transaccion.fecha);
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getFullYear()}`;

            li.innerHTML = `
                <div><strong>${transaccion.tipo}</strong></div>
                <div>Monto: $${transaccion.monto.toFixed(2)}</div>
                <small class="text-muted">Fecha: ${fechaFormateada}</small>
            `;

            lista.appendChild(li);
        });
    }
}

// Ejecutar solo en historial.html
if (window.location.pathname.endsWith("historial.html")) {
    window.addEventListener("load", mostrarHistorial);
}

/* Grafico*/

function mostrarGraficoTransacciones() {
    const usuario = localStorage.getItem("cuenta");
    if (!usuario) return;

    const transacciones = JSON.parse(localStorage.getItem(`transacciones_${usuario}`)) || [];

    const tipos = {
        "Depósito": 0,
        "Retiro": 0,
        "Pago de Energía Eléctrica": 0,
        "Pago de Internet": 0,
        "Pago de Telefonía": 0,
        "Pago de Agua Potable": 0
    };

    transacciones.forEach(t => {
        if (tipos[t.tipo] !== undefined) tipos[t.tipo] += t.monto;
    });

    const totalPagos =
        tipos["Pago de Energía Eléctrica"] +
        tipos["Pago de Internet"] +
        tipos["Pago de Telefonía"] +
        tipos["Pago de Agua Potable"];

    const saldoTotal = tipos["Depósito"] - tipos["Retiro"] - totalPagos;

    // Actualizar texto en el DOM
    const setText = (id, valor) => {
        const elem = document.getElementById(id);
        if (elem) elem.innerText = `$${valor.toFixed(2)}`;
    };

    setText("total-depositos", tipos["Depósito"]);
    setText("total-retiros", tipos["Retiro"]);
    setText("total-pagos", totalPagos);
    setText("saldo-total", saldoTotal);

    // Mostrar gráfico si el canvas existe
    const chartCanvas = document.getElementById("transaction-chart");
    if (chartCanvas && typeof Chart !== "undefined") {
        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: Object.keys(tipos),
                datasets: [{
                    label: 'Monto en USD',
                    data: Object.values(tipos),
                    backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#3f51b5', '#00bcd4', '#8bc34a'],
                    borderColor: ['#4caf50', '#f44336', '#ff9800', '#3f51b5', '#00bcd4', '#8bc34a'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => `$${value}`
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: tooltipItem => `$${tooltipItem.raw.toFixed(2)}`
                        }
                    }
                }
            }
        });
    }
}

// Ejecutar solo en grafico.html
if (window.location.pathname.endsWith("grafico.html")) {
    window.addEventListener("load", mostrarGraficoTransacciones);
}
