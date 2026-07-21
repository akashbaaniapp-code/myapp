const VALID_USER = 'admin';
const VALID_PASS = 'admin123';
let currentPage = 'dashboard';
let entities = [
    { id: 1, name: 'ABC Corporation', code: 'ABC001', type: 'Manufacturer', status: 'Active' },
    { id: 2, name: 'XYZ Trading', code: 'XYZ002', type: 'Trader', status: 'Active' }
];
let editingId = null;

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === VALID_USER && password === VALID_PASS) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        loadPage('dashboard');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    if (confirm('লগআউট?')) {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
}

function loadPage(page) {
    currentPage = page;
    const titles = {
        dashboard: '🏠 Dashboard',
        entity: '🏢 Entity Management',
        company: '🏢 Company',
        warehouse: '🏭 Warehouse',
        purchase: '🛒 Purchase',
        inventory: '📦 Inventory',
        sales: '📈 Sales',
        accounts: '💰 Accounts',
        reports: '📊 Reports',
        approval: '✅ Approval Center'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;
    
    if (page === 'dashboard') loadDashboard();
    else if (page === 'entity') loadEntityPage();
    else loadModule(page);
}

function loadDashboard() {
    document.getElementById('contentArea').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><h3>Total Sales</h3><div class="number">$45,230</div></div>
            <div class="stat-card"><h3>Total Purchase</h3><div class="number">$28,450</div></div>
            <div class="stat-card"><h3>Inventory Items</h3><div class="number">1,284</div></div>
            <div class="stat-card"><h3>Pending Approvals</h3><div class="number">12</div></div>
        </div>
        <h2>📋 Quick Access</h2>
        <div class="module-grid">
            <div class="module-card" onclick="loadPage('purchase')"><div class="icon">🛒</div><h3>Purchase</h3></div>
            <div class="module-card" onclick="loadPage('inventory')"><div class="icon">📦</div><h3>Inventory</h3></div>
            <div class="module-card" onclick="loadPage('sales')"><div class="icon">📈</div><h3>Sales</h3></div>
            <div class="module-card" onclick="loadPage('entity')"><div class="icon">🏢</div><h3>Entity</h3></div>
        </div>
    `;
}

function loadEntityPage() {
    document.getElementById('contentArea').innerHTML = `
        <div class="form-container">
            <h2>${editingId ? '✏️ Edit' : '➕ Create'} Entity</h2>
            <form id="entityForm" onsubmit="saveEntity(event)">
                <div class="form-row">
                    <div class="form-group"><label>Name *</label><input type="text" id="entityName" required></div>
                    <div class="form-group"><label>Code *</label><input type="text" id="entityCode" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Type</label>
                        <select id="entityType"><option>Manufacturer</option><option>Trader</option><option>Service</option></select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="entityStatus"><option>Active</option><option>Inactive</option></select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-secondary" onclick="resetEntityForm()">Cancel</button>
                </div>
            </form>
        </div>
        <div class="entity-list">
            <h3>📋 Entity List</h3>
            <table class="entity-table">
                <thead><tr><th>Name</th><th>Code</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    ${entities.map(e => `
                        <tr>
                            <td>${e.name}</td>
                            <td>${e.code}</td>
                            <td>${e.type}</td>
                            <td><span class="status-badge ${e.status === 'Active' ? 'status-active' : 'status-inactive'}">${e.status}</span></td>
                            <td>
                                <button class="btn btn-secondary" onclick="editEntity(${e.id})">✏️</button>
                                <button class="btn btn-danger" onclick="deleteEntity(${e.id})">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    if (editingId) {
        const e = entities.find(x => x.id === editingId);
        if (e) {
            document.getElementById('entityName').value = e.name;
            document.getElementById('entityCode').value = e.code;
            document.getElementById('entityType').value = e.type;
            document.getElementById('entityStatus').value = e.status;
        }
    }
}

function saveEntity(e) {
    e.preventDefault();
    const name = document.getElementById('entityName').value;
    const code = document.getElementById('entityCode').value;
    const type = document.getElementById('entityType').value;
    const status = document.getElementById('entityStatus').value;
    
    if (editingId) {
        const index = entities.findIndex(x => x.id === editingId);
        if (index !== -1) entities[index] = { ...entities[index], name, code, type, status };
        editingId = null;
    } else {
        entities.push({ id: Date.now(), name, code, type, status });
    }
    loadEntityPage();
}

function editEntity(id) { editingId = id; loadEntityPage(); }
function deleteEntity(id) { if (confirm('Delete?')) { entities = entities.filter(x => x.id !== id); loadEntityPage(); } }
function resetEntityForm() { editingId = null; loadEntityPage(); }

function loadModule(module) {
    document.getElementById('contentArea').innerHTML = `<h2>📦 ${module.toUpperCase()}</h2><p>Coming soon...</p>`;
}

function toggleMenu(el) {
    const sub = el.nextElementSibling;
    if (sub && sub.classList.contains('menu-sub')) {
        sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
    }
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') login();
});
