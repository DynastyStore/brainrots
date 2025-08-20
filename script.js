// Datos iniciales
const brainrots = [
    { Cuenta: 'Cuenta01', Brainrot: 'Chicleteira Bicicleteira', Rareza: 'Brainrot God', Mutacion: 'Oro', dineroSeg: 12, Precio: 5, Estado: 'Disponible' },
    { Cuenta: 'Cuenta01', Brainrot: 'Gato Bailando', Rareza: 'Secret', Mutacion: 'Normal', dineroSeg: 3, Precio: 1, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Sigma Edit', Rareza: 'Brainrot God', Mutacion: 'Diamante', dineroSeg: 25, Precio: 15, Estado: 'Vendido' },
    { Cuenta: 'Cuenta02', Brainrot: 'Skull Rizz', Rareza: 'Secret', Mutacion: 'Lava', dineroSeg: 40, Precio: 20, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Baby Gronk', Rareza: 'Brainrot God', Mutacion: 'Candy', dineroSeg: 10, Precio: 7, Estado: 'Disponible' },
    { Cuenta: 'Cuenta02', Brainrot: 'Ohio NPC', Rareza: 'Secret', Mutacion: 'Rainbow', dineroSeg: 5, Precio: 2, Estado: 'Reservado' },
    { Cuenta: 'Cuenta03', Brainrot: 'Bloodrot Beast', Rareza: 'Brainrot God', Mutacion: 'Bloodrot', dineroSeg: 5, Precio: 2, Estado: 'Reservado' }
];

// Llenar filtro de cuentas
const accountSelect = document.getElementById('filterAccount');
const cuentas = [...new Set(brainrots.map(b => b.Cuenta))];
cuentas.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    accountSelect.appendChild(option);
});

// Función para mapear clases de rareza
function getRarezaClass(rareza) {
  switch(rareza.toLowerCase()) {
    case 'brainrot god': return 'label-brainrot-god';
    case 'secret': return 'label-secret';
    default: return '';
  }
}

// Función para mapear clases de estado
function getEstadoClass(estado) {
    switch (estado.toLowerCase()) {
        case 'disponible': return 'label-disponible';
        case 'vendido': return 'label-vendido';
        case 'reservado': return 'label-reservado';
        default: return '';
    }
}

// Renderizar tabla
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    const search = document.getElementById('searchName').value.toLowerCase();
    const filterAccount = document.getElementById('filterAccount').value;
    const filterRareza = document.getElementById('filterRareza').value;

    const filtered = brainrots.filter(b => {
        // Busca en Brainrot y en Cuenta al mismo tiempo
        const matchesSearch = b.Brainrot.toLowerCase().includes(search) ||
            b.Cuenta.toLowerCase().includes(search);

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

// Render inicial
renderTable();

// Eventos automáticos
document.getElementById('searchName').addEventListener('input', renderTable);
document.getElementById('filterAccount').addEventListener('change', renderTable);
document.getElementById('filterRareza').addEventListener('change', renderTable);
