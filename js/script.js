const sidebarToggle = document.querySelector("#sidebar-toggle");
sidebarToggle.addEventListener("click",function(){
    document.querySelector("#sidebar").classList.toggle("collapsed");
});

document.querySelector(".theme-toggle").addEventListener("click",() => {
    toggleLocalStorage();
    toggleRootClass();
});

function toggleRootClass(){
    const current = document.documentElement.getAttribute('data-bs-theme');
    const inverted = current == 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme',inverted);
}

function toggleLocalStorage(){
    if(isLight()){
        localStorage.removeItem("light");
    }else{
        localStorage.setItem("light","set");
    }
}

function isLight(){
    return localStorage.getItem("light");
}

if(isLight()){
    toggleRootClass();
}

let users = JSON.parse(localStorage.getItem('users')) || [];
        
// Function to display users
function displayUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear the table
    users.forEach((user, index) => {
        const row = `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.nama}</td>
                <td>${user.stock}</td>
                <td>${user.terjual}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${index}">Delete</button>
                </td>
            </tr>
        `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Add User
document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nama = document.getElementById('namaProduk').value;
    const stock = parseInt(document.getElementById('stockProduk').value);
    const terjual = parseInt(document.getElementById('produkTerjual').value);

    // Add user to array and update localStorage
    users.push({ nama, stock, terjual });
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    document.getElementById('addUserForm').reset(); // Reset form
    const addModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    addModal.hide(); // Hide modal
});

// Edit User
document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('editUserId').value;
    users[id].nama = document.getElementById('editNamaProduk').value;
    users[id].stock = parseInt(document.getElementById('editStockProduk').value);
    users[id].terjual = parseInt(document.getElementById('editProdukTerjual').value);

    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide(); // Hide modal
});

// Delete User
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        users.splice(id, 1); // Remove user from array
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
});

// Open Edit Modal with user data
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
        const id = event.target.getAttribute('data-id');
        document.getElementById('editUserId').value = id;
        document.getElementById('editNamaProduk').value = users[id].nama;
        document.getElementById('editStockProduk').value = users[id].stock;
        document.getElementById('editProdukTerjual').value = users[id].terjual;
    }
});

// Inisialisasi Chart.js
let salesChart;

function updateChart() {
    const labels = users.map(user => user.nama);
    const data = users.map(user => user.terjual);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Produk Terjual',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (salesChart) {
        salesChart.destroy(); // Hapus grafik sebelumnya jika ada
    }
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, config); // Buat grafik baru
}

// Panggil updateChart setiap kali ada perubahan pada tabel
function displayUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
        const row = `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${user.nama}</td>
                <td>${user.stock}</td>
                <td>${user.terjual}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${index}">Delete</button>
                </td>
            </tr>
        `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });

    updateChart(); // Perbarui grafik setiap kali tabel diperbarui
}

displayUsers();

