// ------------------------
// 1️⃣ Inicializar Firebase
// ------------------------
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

// ------------------------
// 2️⃣ Array local (opcional para primeros datos)
// ------------------------
const brainrots = [
    { Cuenta: 'Cuenta01', Brainrot: 'Chicleteira Bicicleteira', Rareza: 'Brainrot God', Mutacion: 'Oro', dineroSeg: 12, Precio: 5, Estado: 'Disponible' },
    { Cuenta: 'Cuenta01', Brainrot: 'Gato Bailando', Rareza: 'Secret', Mutacion: 'Normal', dineroSeg: 3, Precio: 1, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Sigma Edit', Rareza: 'Brainrot God', Mutacion: 'Diamante', dineroSeg: 25, Precio: 15, Estado: 'Vendido' },
    { Cuenta: 'Cuenta02', Brainrot: 'Skull Rizz', Rareza: 'Secret', Mutacion: 'Lava', dineroSeg: 40, Precio: 20, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Baby Gronk', Rareza: 'Brainrot God', Mutacion: 'Candy', dineroSeg: 10, Precio: 7, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Ohio NPC', Rareza: 'Secret', Mutacion: 'Rainbow', dineroSeg: 5, Precio: 2, Estado: 'Reservado' },
    { Cuenta: 'Cuenta03', Brainrot: 'Bloodrot Beast', Rareza: 'Brainrot God', Mutacion: 'Bloodrot', dineroSeg: 5, Precio: 2, Estado: 'Reservado' }
];

// Guardar los datos iniciales en Firebase (solo la primera vez)
// brainrots.forEach(br => db.ref('brainrots').push(br));

// ------------------------
// 3️⃣ Leer Brainrots desde Firebase en tiempo real
// ------------------------
const brainrotsLive = []; // array dinámico desde Firebase

db.ref('brainrots').on('value', (snapshot) => {
    brainrotsLive.length = 0; // limpiar array
    snapshot.forEach(childSnapshot => {
        brainrotsLive.push(childSnapshot.val());
    });
    renderTable(); // actualizar tabla
});

// ------------------------
// 4️⃣ Funciones de clase para Rareza, Mutacion, Estado
// ------------------------
function getRarezaClass(rareza) {
  switch(rareza.toLowerCase()) {
    case 'brainrot god': return 'label-brainrot-god';
    case 'secret': return 'label-secret';
    default: return '';
  }
}

function getMutacionClass(mutacion) {
    switch (mutacion.toLowerCase()) {
        case 'normal': return 'label-normal';
        case 'oro': return 'label-oro';
        case 'diamante': return 'label-diamante';
        case 'lava': return 'label-lava';
        case 'rainbow': return 'label-rainbow';
        case 'candy': return 'label-candy';
        case 'bloodrot': return 'label-bloodrot';
        default: return '';
    }
}

function getEstadoClass(estado) {
    switch (estado.toLowerCase()) {
        case 'disponible': return 'label-disponible';
        case 'vendido': return 'label-vendido';
        case 'reservado': return 'label-reservado';
        default: return '';
    }
}

// ------------------------
// 5️⃣ Renderizar tabla
// ------------------------
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const search = document.getElementById('searchName').value.toLowerCase();
    const filterAccount = document.getElementById('filterAccount').value;
    const filterRareza = document.getElementById('filterRareza').value;

    // Filtrar datos desde Firebase
    const filtered = brainrotsLive.filter(b => {
        const matchesSearch = b.Brainrot.toLowerCase().includes(search) || b.Cuenta.toLowerCase().includes(search);
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
        <td>${b.dineroSeg}</td>
        <td>${b.Precio}</td>
        <td><span class="label ${getEstadoClass(b.Estado)}">${b.Estado}</span></td>
        `;
        tbody.appendChild(row);
    });

    // Llenar filtro de cuentas dinámicamente según Firebase
    const accountSelect = document.getElementById('filterAccount');
    accountSelect.innerHTML = '<option value="">Todas las cuentas</option>'; // limpiar
    const cuentas = [...new Set(brainrotsLive.map(b => b.Cuenta))];
    cuentas.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        accountSelect.appendChild(option);
    });
}

// ------------------------
// 6️⃣ Eventos de filtros y búsqueda
// ------------------------
document.getElementById('searchName').addEventListener('input', renderTable);
document.getElementById('filterAccount').addEventListener('change', renderTable);
document.getElementById('filterRareza').addEventListener('change', renderTable);

// ------------------------
// 7️⃣ Función para añadir nuevos Brainrots
// ------------------------
function addBrainrot(newBrainrot) {
    db.ref('brainrots').push(newBrainrot);
}

// Ejemplo de uso (podés conectarlo a un formulario):
// addBrainrot({ Cuenta: 'Cuenta04', Brainrot: 'Nuevo', Rareza: 'Secret', Mutacion: 'Oro', dineroSeg: 5, Precio: 3, Estado: 'Disponible' });

// Referencias del modal
const modal = document.getElementById('addModal');
const openFormBtn = document.getElementById('openFormBtn');
const closeBtn = document.querySelector('.close-btn');
const addForm = document.getElementById('addBrainrotForm');

// Abrir modal
openFormBtn.onclick = () => { modal.style.display = 'block'; };

// Cerrar modal
closeBtn.onclick = () => { modal.style.display = 'none'; };
window.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

// Enviar formulario
addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newBrainrot = {
        Cuenta: document.getElementById('newCuenta').value,
        Brainrot: document.getElementById('newBrainrot').value,
        Rareza: document.getElementById('newRareza').value,
        Mutacion: document.getElementById('newMutacion').value,
        dineroSeg: Number(document.getElementById('newDineroSeg').value),
        Precio: Number(document.getElementById('newPrecio').value),
        Estado: document.getElementById('newEstado').value
    };

    // Guardar en Firebase
    db.ref('brainrots').push(newBrainrot);

    // Limpiar formulario
    addForm.reset();

    // Cerrar modal
    modal.style.display = 'none';
});
