// 1️⃣ Inicializar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDEi6y6q-wY5tOGzRA7q6QSH6jfFzhcU6U",
    authDomain: "brainrots-61780.firebaseapp.com",
    databaseURL: "https://brainrots-61780-default-rtdb.firebaseio.com",
    projectId: "brainrots-61780",
    storageBucket: "brainrots-61780.firebasestorage.app",
    messagingSenderId: "1011006908289",
    appId: "1:1011006908289:web:6a5d114d5f366a965faa80",
    measurementId: "G-Q29LK9WBV8"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2️⃣ Variables modal
const addModal = document.getElementById('addModal');
const openFormBtn = document.getElementById('openFormBtn');
const closeBtn = document.querySelector('.close-btn');
const saveBtn = document.getElementById('saveBrainrotBtn');
let currentEditId = null;

openFormBtn.onclick = () => {
    addModal.style.display = 'block';
    currentEditId = null;
    saveBtn.textContent = "Guardar";
    clearModalInputs();
};
closeBtn.onclick = () => addModal.style.display = 'none';
window.onclick = e => { if (e.target === addModal) addModal.style.display = 'none'; };

// 3️⃣ Array dinámico desde Firebase
const brainrotsLive = [];

function loadBrainrots() {
    db.ref('brainrots').get().then(snapshot => {
        brainrotsLive.length = 0; // limpiar array
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    // guardamos también la key para editar/borrar
                    brainrotsLive.push({ ...data[key], id: key });
                }
            }
        }
        renderTable(); // <-- aquí ya tenemos datos y actualizamos todo
    }).catch(err => console.error('Error al cargar brainrots:', err));
}


loadBrainrots();
db.ref('brainrots').on('child_added', loadBrainrots);
db.ref('brainrots').on('child_changed', loadBrainrots);
db.ref('brainrots').on('child_removed', loadBrainrots);

// 4️⃣ Funciones auxiliares
function getRarezaClass(rareza) { switch (rareza.toLowerCase()) { case 'brainrot god': return 'label-brainrot-god'; case 'secret': return 'label-secret'; default: return ''; } }
function getMutacionClass(mutacion) { switch (mutacion.toLowerCase()) { case 'normal': return 'label-normal'; case 'oro': return 'label-oro'; case 'diamante': return 'label-diamante'; case 'lava': return 'label-lava'; case 'rainbow': return 'label-rainbow'; case 'candy': return 'label-candy'; case 'bloodrot': return 'label-bloodrot'; default: return ''; } }
function getEstadoClass(estado) { switch (estado.toLowerCase()) { case 'disponible': return 'label-disponible'; case 'vendido': return 'label-vendido'; case 'reservado': return 'label-reservado'; default: return ''; } }
function formatMoney(value) { if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'; else if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; else if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; else return value; }
function formatPrice(value) { return '$' + value.toLocaleString('de-DE'); }
function clearModalInputs() {
    document.getElementById('newCuenta').value = '';
    document.getElementById('newBrainrot').value = '';
    document.getElementById('newRareza').value = 'Brainrot God';
    document.getElementById('newMutacion').value = 'Normal';
    document.getElementById('newDineroSeg').value = '';
    document.getElementById('newPrecio').value = '';
    document.getElementById('newEstado').value = 'Disponible';
}

// 5️⃣ Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const search = document.getElementById('searchName').value.toLowerCase();
    const filterAccount = document.getElementById('filterAccount').value;
    const filterRareza = document.getElementById('filterRareza').value;

    const filtered = brainrotsLive.filter(b => {
        const brainrotName = b.Brainrot ? b.Brainrot.toLowerCase() : '';
        const cuentaName = b.Cuenta ? b.Cuenta.toLowerCase() : '';
        const matchesSearch = brainrotName.includes(search) || cuentaName.includes(search);
        return matchesSearch &&
            (filterAccount === '' || b.Cuenta === filterAccount) &&
            (filterRareza === '' || b.Rareza === filterRareza);
    });

    filtered.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${b.Cuenta}</td>
    <td>${b.Brainrot}</td>
    <td>${b.Rareza === 'Brainrot God' ? `<span class="label label-brainrot-god" data-text="${b.Rareza}">${b.Rareza}</span>` : `<span class="label label-secret">${b.Rareza}</span>`}</td>
    <td><span class="label ${getMutacionClass(b.Mutacion)}">${b.Mutacion}</span></td>
    <td>${formatMoney(b.dineroSeg)}</td>
    <td>${formatPrice(b.Precio)}</td>
    <td><span class="label ${getEstadoClass(b.Estado)}">${b.Estado}</span></td>
    <td>
        <button class="action-btn edit-btn"><i class='bx bx-pencil'></i></button>
        <button class="action-btn delete-btn"><i class='bx bx-trash'></i></button>
    </td>
`;
        tbody.appendChild(row);

        // Editar
        row.querySelector('.edit-btn').onclick = () => {
            addModal.style.display = 'block';
            document.querySelector('.modal-content h2').textContent = 'Editar Brainrot';
            document.getElementById('newCuenta').value = b.Cuenta;
            document.getElementById('newBrainrot').value = b.Brainrot;
            document.getElementById('newRareza').value = b.Rareza;
            document.getElementById('newMutacion').value = b.Mutacion;
            document.getElementById('newDineroSeg').value = b.dineroSeg;
            document.getElementById('newPrecio').value = b.Precio;
            document.getElementById('newEstado').value = b.Estado;

            // Guardar cambios
            saveBtn.onclick = () => {
                db.ref('brainrots').child(b.id).update({
                    Cuenta: document.getElementById('newCuenta').value,
                    Brainrot: document.getElementById('newBrainrot').value,
                    Rareza: document.getElementById('newRareza').value,
                    Mutacion: document.getElementById('newMutacion').value,
                    dineroSeg: Number(document.getElementById('newDineroSeg').value),
                    Precio: Number(document.getElementById('newPrecio').value),
                    Estado: document.getElementById('newEstado').value
                }, error => {
                    if (!error) {
                        addModal.style.display = 'none';
                        renderTable();
                    } else {
                        alert('Error al guardar: ' + error);
                    }
                });
            };
        };

        // Borrar
        row.querySelector('.delete-btn').onclick = () => {
            if (confirm(`¿Seguro que querés borrar el brainrot ${b.Brainrot}?`)) {
                db.ref('brainrots').child(b.id).remove();
            }
        };
    });

    // Actualizar filtro de cuentas
    const accountSelect = document.getElementById('filterAccount');
    accountSelect.innerHTML = '<option value="">Todas las cuentas</option>';
    const cuentas = [...new Set(brainrotsLive.map(b => b.Cuenta))];
    cuentas.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        accountSelect.appendChild(option);
    });

    // Mostrar conteo
    const countDiv = document.getElementById('brainrotCount');
    if (countDiv) {
        countDiv.textContent = `Mostrando ${filtered.length}/${brainrotsLive.length} brainrots`;
    }
}



// Cuando cerramos el modal, reiniciamos título y botón
closeBtn.onclick = () => {
    addModal.style.display = 'none';
    document.querySelector('.modal-content h2').textContent = "Añadir Brainrot";
    saveBtn.textContent = "Guardar";
    clearModalInputs();
};


// 6️⃣ Eventos filtros
document.getElementById('searchName').addEventListener('input', renderTable);
document.getElementById('filterAccount').addEventListener('change', renderTable);
document.getElementById('filterRareza').addEventListener('change', renderTable);

// 7️⃣ Guardar nuevo brainrot o editar existente
saveBtn.onclick = () => {
    const brainrotData = {
        Cuenta: document.getElementById('newCuenta').value,
        Brainrot: document.getElementById('newBrainrot').value,
        Rareza: document.getElementById('newRareza').value,
        Mutacion: document.getElementById('newMutacion').value,
        dineroSeg: Number(document.getElementById('newDineroSeg').value),
        Precio: Number(document.getElementById('newPrecio').value),
        Estado: document.getElementById('newEstado').value
    };

    if (currentEditId) {
        db.ref('brainrots').child(currentEditId).update(brainrotData, error => {
            if (!error) { addModal.style.display = 'none'; currentEditId = null; renderTable(); }
            else { alert('Error al guardar: ' + error); }
        });
    } else {
        db.ref('brainrots').push(brainrotData, error => {
            if (!error) { addModal.style.display = 'none'; clearModalInputs(); }
            else { alert('Error al guardar: ' + error); }
        });
    }
};
