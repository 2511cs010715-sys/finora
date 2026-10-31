import React, { useState, useEffect, useRef } from 'react';
import { FiTarget, FiPlus, FiTrash2, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { getGoals, createGoal, deleteGoal, addGoalContribution } from '../services/api';

const MOCK_GOALS = [
  { id: 1, goalName: '🛡️ Emergency Reserve Fund', targetAmount: 100000.00, currentAmount: 60000.00, targetDate: '2026-12-31', priority: 'High', description: '6 months liquid cash buffer' },
  { id: 2, goalName: '💻 M3 MacBook Air Laptop', targetAmount: 95000.00, currentAmount: 45000.00, targetDate: '2026-10-15', priority: 'High', description: 'Engineering workstation upgrade' },
  { id: 3, goalName: '🎓 Higher Education Cert', targetAmount: 50000.00, currentAmount: 25000.00, targetDate: '2026-11-30', priority: 'High', description: 'Advanced Master Certification' },
  { id: 4, goalName: '✈️ Goa Vacation Trip', targetAmount: 35000.00, currentAmount: 15000.00, targetDate: '2026-11-20', priority: 'Medium', description: 'Year-end leisure trip' },
  { id: 5, goalName: '🏍️ Electric Scooter Vehicle', targetAmount: 120000.00, currentAmount: 40000.00, targetDate: '2027-02-28', priority: 'Medium', description: 'Personal EV transit vehicle' }
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContribModal, setShowContribModal] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState(null);
  const formRef = useRef(null);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  // Create Form State
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0, 10));
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  // Contribution State
  const [contribAmount, setContribAmount] = useState('');

  const fetchGoalsData = async () => {
    try {
      const res = await getGoals();
      if (res.data && res.data.length > 0) setGoals(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount) return;

    try {
      await createGoal({
        goalName,
        targetAmount: Number(targetAmount),
        currentAmount: currentAmount ? Number(currentAmount) : 0,
        targetDate,
        priority,
        description
      });
      setShowCreateModal(false);
      fetchGoalsData();
    } catch (err) {
      setGoals([...goals, {
        id: Date.now(),
        goalName,
        targetAmount: Number(targetAmount),
        currentAmount: currentAmount ? Number(currentAmount) : 0,
        targetDate,
        priority,
        description
      }]);
      setShowCreateModal(false);
    }
  };

  const handleContribSubmit = async (e) => {
    e.preventDefault();
    if (!contribAmount || !activeGoalId) return;

    try {
      await addGoalContribution(activeGoalId, Number(contribAmount));
      setShowContribModal(false);
      setContribAmount('');
      fetchGoalsData();
    } catch (err) {
      setGoals(goals.map(g => {
        if (g.id === activeGoalId) {
          return { ...g, currentAmount: Number(g.currentAmount || 0) + Number(contribAmount) };
        }
        return g;
      }));
      setShowContribModal(false);
      setContribAmount('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      fetchGoalsData();
    } catch (err) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const getStatusBadge = (pct) => {
    if (pct >= 60) return <span className="badge bg-success-subtle text-success border border-success px-2.5 py-1 fw-bold fs-7">🟢 On Track</span>;
    if (pct >= 35) return <span className="badge bg-warning-subtle text-warning border border-warning px-2.5 py-1 fw-bold fs-7">🟡 Needs Attention</span>;
    return <span className="badge bg-danger-subtle text-danger border border-danger px-2.5 py-1 fw-bold fs-7">🔴 Behind Target</span>;
  };

  // Calculate Required Monthly Savings
  const getRequiredMonthly = (target, current, dateStr) => {
    const remaining = Math.max(0, target - current);
    const now = new Date();
    const tDate = new Date(dateStr);
    const months = Math.max(1, Math.ceil((tDate - now) / (1000 * 60 * 60 * 24 * 30)));
    return Math.ceil(remaining / months);
  };

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Savings Goal Planner & Progress</h2>
          <p className="small mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            Track target amounts, target dates, progress bars, and required monthly savings
          </p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow" onClick={handleOpenCreateModal}>
          <FiPlus /> Create New Goal
        </button>
      </div>

      <div className="row g-4">
        {goals.map(g => {
          const target = Number(g.targetAmount || 1);
          const current = Number(g.currentAmount || 0);
          const remaining = Math.max(0, target - current);
          const pct = Math.min(100, Math.round((current / target) * 100));
          const reqMonthly = getRequiredMonthly(target, current, g.targetDate);

          return (
            <div key={g.id} className="col-md-6 col-lg-4">
              <div className="finplanner-card p-4 h-100 d-flex flex-column justify-content-between shadow" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary fw-bold px-3 py-1">
                      {g.priority} Priority
                    </span>
                    <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(g.id)} title="Delete Goal">
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <h4 className="fw-extrabold text-light mb-1">{g.goalName}</h4>
                  <small className="d-block mb-3" style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{g.description || 'Target savings milestone'}</small>

                  <div className="p-3 rounded border mb-3" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Target Amount:</span>
                      <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>₹{target.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Amount Saved:</span>
                      <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.95rem' }}>₹{current.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Remaining Needed:</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.95rem' }}>₹{remaining.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-2" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Required Monthly Savings:</span>
                      <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.95rem' }}>₹{reqMonthly.toLocaleString()} / mo</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-bold" style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>Progress Bar ({pct}%)</span>
                    {getStatusBadge(pct)}
                  </div>

                  <div className="progress border mb-3" style={{ height: '10px', backgroundColor: '#1e293b', borderColor: '#475569' }}>
                    <div
                      className={`progress-bar rounded ${pct >= 60 ? 'bg-success' : pct >= 35 ? 'bg-warning' : 'bg-danger'}`}
                      role="progressbar"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: '#38bdf8', fontWeight: 600 }}><FiClock className="me-1" />Target Date: {g.targetDate}</small>
                  </div>
                </div>

                <button
                  className="btn btn-outline-success w-100 rounded-pill fw-bold mt-4 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                  onClick={() => { setActiveGoalId(g.id); setShowContribModal(true); }}
                >
                  <FiPlus /> Add Contribution
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="modal-backdrop-custom">
          <div ref={formRef} className="finplanner-card p-4 shadow-lg" style={{ maxWidth: '440px', width: '90%', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h5 className="fw-bold text-light mb-3">Create Savings Goal</h5>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Goal Category Example</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  onChange={(e) => setGoalName(e.target.value)}
                >
                  <option value="">Select or Type Custom Name...</option>
                  <option value="💻 M3 MacBook Air Laptop">💻 Laptop Upgrade</option>
                  <option value="🎓 Higher Education Cert">🎓 Education Fund</option>
                  <option value="🛡️ Emergency Reserve Fund">🛡️ Emergency Reserve Fund</option>
                  <option value="✈️ Goa Vacation Trip">✈️ Travel & Vacation</option>
                  <option value="🏍️ Electric Scooter Vehicle">🏍️ Vehicle Purchase</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Goal Name</label>
                <input
                  type="text"
                  className="form-control text-light"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  placeholder="e.g. Laptop, Education, Emergency Fund"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Target Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control text-light"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  placeholder="100000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Initial Saved Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control text-light"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Target Date</label>
                <input
                  type="date"
                  className="form-control text-light"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Priority Level</label>
                <select className="form-select text-light" style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showContribModal && (
        <div className="modal-backdrop-custom">
          <div className="finplanner-card p-4 shadow-lg" style={{ maxWidth: '400px', width: '90%', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h5 className="fw-bold text-light mb-3">Add Contribution to Goal</h5>
            <form onSubmit={handleContribSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-bold" style={{ color: '#f8fafc' }}>Contribution Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0b0f19', color: '#ffffff', borderColor: '#475569' }}
                  placeholder="e.g. 5000"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowContribModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success w-50 fw-bold">Add Funds</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
