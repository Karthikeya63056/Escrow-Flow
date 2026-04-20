import { formatCurrency } from "../../lib/utils";

export function EscrowProgress({ project, milestones }) {
  if (!project || !milestones) return null;

  const totalBudget = project.budget || 0;
  const escrowBalance = project.escrow_balance || 0;
  
  const approvedTotal = milestones
    .filter(m => m.status === 'approved')
    .reduce((sum, m) => sum + (m.amount || 0), 0);

  const isFunded = escrowBalance > 0 && escrowBalance >= totalBudget;

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Escrow Status</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${isFunded ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          {isFunded ? 'Fully Funded' : 'Awaiting Funds'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center divide-x divide-white/10">
        <div>
          <p className="text-sm text-gray-400">Total Budget</p>
          <p className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalBudget)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Released Funds</p>
          <p className="text-2xl font-bold mt-1 text-neonPurple">{formatCurrency(approvedTotal)}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Completion Progress</span>
          <span>{totalBudget > 0 ? Math.round((approvedTotal / totalBudget) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-darkBg rounded-full h-2.5 border border-white/10 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-neonBlue to-neonPurple h-2.5 rounded-full transition-all duration-1000 ease-in-out" 
            style={{ width: `${totalBudget > 0 ? Math.round((approvedTotal / totalBudget) * 100) : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
