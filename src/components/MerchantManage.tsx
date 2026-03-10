import { useState } from 'react';
import { Plus, Building2, Search } from 'lucide-react';

const MOCK_MERCHANTS = [
  { id: 'm1', name: 'Zomato Media Pvt Ltd.', industry: 'Food Delivery', mids: 8, health: 89.1 },
  { id: 'm2', name: 'BookMyShow', industry: 'Entertainment', mids: 6, health: 75 },
  { id: 'm3', name: 'Swiggy Ltd.', industry: 'Food Delivery', mids: 12, health: 91.8 },
  { id: 'm4', name: 'Flipkart Commerce', industry: 'E-commerce', mids: 14, health: 94.2 },
  { id: 'm5', name: 'BigBasket (Tata)', industry: 'Grocery', mids: 5, health: 96.8 },
];

export function MerchantManage() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    industry: 'E-commerce',
    contact: '',
    notes: '',
  });

  const filtered = MOCK_MERCHANTS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    // In real app: API call to create merchant
    setForm({ name: '', industry: 'E-commerce', contact: '', notes: '' });
    setShowAdd(false);
  };

  return (
    <div className="merchant-manage">
      <div className="merchant-toolbar">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            placeholder="Search merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} />
          Add merchant
        </button>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Create merchant</h3>
            <p className="modal-desc">KAMs can onboard new merchants and assign to portfolio.</p>
            <form onSubmit={handleCreate}>
              <label>Merchant name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Acme Corp Pvt Ltd"
                required
              />
              <label>Industry</label>
              <select
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              >
                <option value="E-commerce">E-commerce</option>
                <option value="Food Delivery">Food Delivery</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Grocery">Grocery</option>
                <option value="Fintech">Fintech</option>
              </select>
              <label>Contact email</label>
              <input
                type="email"
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                placeholder="merchant@example.com"
              />
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Onboarding notes..."
                rows={3}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="merchant-list">
        {filtered.map((m) => (
          <div key={m.id} className="merchant-row">
            <Building2 size={20} className="row-icon" />
            <div className="row-info">
              <strong>{m.name}</strong>
              <span>{m.industry} · {m.mids} MIDs</span>
            </div>
            <div className="row-health">{m.health}% health</div>
            <button type="button" className="row-btn">Manage</button>
          </div>
        ))}
      </div>

      <style>{`
        .merchant-manage { padding: 24px; max-width: 800px; margin: 0 auto; }
        .merchant-toolbar { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
        .search-wrap { position: relative; flex: 1; max-width: 320px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input {
          width: 100%; padding: 10px 10px 10px 40px; border-radius: var(--radius);
          border: 1px solid var(--border); background: var(--bg-card); color: var(--text);
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
          border-radius: var(--radius); border: none; background: var(--accent); color: white;
          font-weight: 500;
        }
        .btn-primary:hover { background: var(--accent-dim); }
        .merchant-list { display: flex; flex-direction: column; gap: 8px; }
        .merchant-row {
          display: flex; align-items: center; gap: 16px; padding: 14px 18px;
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
        }
        .row-icon { color: var(--text-muted); flex-shrink: 0; }
        .row-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .row-info strong { font-size: 14px; }
        .row-info span { font-size: 12px; color: var(--text-muted); }
        .row-health { font-size: 13px; color: var(--success); }
        .row-btn {
          padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border);
          background: var(--bg-panel); color: var(--text); font-size: 13px;
        }
        .row-btn:hover { background: var(--bg-hover); }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex;
          align-items: center; justify-content: center; z-index: 100;
        }
        .modal-card {
          background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 24px; width: 100%; max-width: 440px; box-shadow: var(--shadow);
        }
        .modal-card h3 { margin: 0 0 8px; font-size: 18px; }
        .modal-desc { color: var(--text-muted); font-size: 13px; margin-bottom: 20px; }
        .modal-card label { display: block; font-size: 12px; margin-bottom: 4px; color: var(--text-muted); }
        .modal-card input, .modal-card select, .modal-card textarea {
          width: 100%; padding: 10px 12px; margin-bottom: 14px; border-radius: 8px;
          border: 1px solid var(--border); background: var(--bg-card); color: var(--text);
        }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .modal-actions button { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text); }
        .modal-actions .btn-primary { border: none; }
      `}</style>
    </div>
  );
}
