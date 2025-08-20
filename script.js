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

openFormBtn.onclick = () => addModal.style.display = 'block';
closeBtn.onclick = () => addModal.style.display = 'none';
window.onclick = e => { if(e.target === addModal) addModal.style.display = 'none'; };

// 3️⃣ Array dinámico desde Firebase
const brainrotsLive = [];
db.ref('brainrots').on('value', snapshot => {
    brainrotsLive.length = 0;
    snapshot.forEach(child => brainrotsLive.push(child.val()));
    renderTable();
});

// 4️⃣ Funciones de clase
function getRarezaClass(rareza) {
    switch(rareza.toLowerCase()) {
        case 'brainrot god': return 'label-brainrot-god';
        case 'secret': return 'label-secret';
        default: return '';
    }
}
function getMutacionClass(mutacion) {
    switch(mutacion.toLowerCase()) {
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
    switch(estado.toLowerCase()) {
        case 'disponible': return 'label-disponible';
        case 'vendido': return 'label-vendido';
        case 'reservado': return 'label-reservado';
        default: return '';
    }
}

// 5️⃣ Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    const search = document.getElementById('searchName').value.toLowerCase();
    const filterAccount = document.getElementById('filterAccount').value;
    const filterRareza = document.getElementById('filterRareza').value;

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
}

// 6️⃣ Eventos filtros
document.getElementById('searchName').addEventListener('input', renderTable);
document.getElementById('filterAccount').addEventListener('change', renderTable);
document.getElementById('filterRareza').addEventListener('change', renderTable);

// 7️⃣ Guardar nuevo Brainrot
saveBtn.onclick = () => {
    const newBrainrot = {
        Cuenta: document.getElementById('newCuenta').value,
        Brainrot: document.getElementById('newBrainrot').value,
        Rareza: document.getElementById('newRareza').value,
        Mutacion: document.getElementById('newMutacion').value,
        dineroSeg: Number(document.getElementById('newDineroSeg').value),
        Precio: Number(document.getElementById('newPrecio').value),
        Estado: document.getElementById('newEstado').value
    };

    db.ref('brainrots').push(newBrainrot, error => {
        if(!error){
            addModal.style.display = 'none';
            document.getElementById('newCuenta').value = '';
            document.getElementById('newBrainrot').value = '';
            document.getElementById('newDineroSeg').value = '';
            document.getElementById('newPrecio').value = '';
        } else {
            alert('Error al guardar: ' + error);
        }
    });
};
