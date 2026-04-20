import { useState } from "react";
import { supabase, isMockMode } from "../lib/supabase";
import confetti from "canvas-confetti";

export function useEscrow() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fundProject = async (projectId, amount) => {
    setProcessing(true);
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
      }
      
      // Simulate funding by updating escrow balance
      const { error: updateErr } = await supabase.rpc('fund_project', { 
        p_id: projectId,
        p_amount: amount 
      });
      // Fallback if rpc is not present... using direct update
      if (updateErr) {
        const { error: manualErr } = await supabase
          .from('projects')
          .update({ escrow_balance: amount })
          .eq('id', projectId);
        if (manualErr) throw manualErr;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const approveMilestone = async (milestoneId, amount, freelancerId, clientId) => {
    setProcessing(true);
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1000));
        triggerConfetti();
        return true;
      }

      // 1. Update milestone status
      const { error: mErr } = await supabase
        .from('milestones')
        .update({ status: 'approved' })
        .eq('id', milestoneId);
      if (mErr) throw mErr;

      // 2. Create transaction record to release funds
      const { error: tErr } = await supabase
        .from('transactions')
        .insert([{
          milestone_id: milestoneId,
          from_user_id: clientId,
          to_user_id: freelancerId,
          amount: amount,
          type: 'release'
        }]);
      if (tErr) throw tErr;

      triggerConfetti();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f3ff', '#bd00ff', '#ffffff']
    });
  };

  return { processing, error, fundProject, approveMilestone };
}
