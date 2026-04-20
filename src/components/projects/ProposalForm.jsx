import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../common/Button";

const proposalSchema = z.object({
  cover_letter: z.string().min(50, "Cover letter should be at least 50 characters."),
  proposed_budget: z.number().min(1, "Proposed budget must be greater than 0")
});

export function ProposalForm({ projectBudget, onSubmitForm }) {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: { proposed_budget: projectBudget || 0 }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await onSubmitForm(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Proposed Budget ($)</label>
        <input 
          type="number" 
          {...register("proposed_budget", { valueAsNumber: true })} 
          className="w-full bg-darkBg border border-white/10 rounded p-2 focus:border-neonBlue" 
        />
        {errors.proposed_budget && <p className="text-red-400 text-xs mt-1">{errors.proposed_budget.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Cover Letter</label>
        <textarea 
          {...register("cover_letter")} 
          rows={6} 
          placeholder="Why are you the best fit for this project?"
          className="w-full bg-darkBg border border-white/10 rounded p-2 focus:border-neonBlue" 
        ></textarea>
        {errors.cover_letter && <p className="text-red-400 text-xs mt-1">{errors.cover_letter.message}</p>}
      </div>

      <Button type="submit" className="w-full" isLoading={loading}>
        Submit Proposal
      </Button>
    </form>
  );
}
