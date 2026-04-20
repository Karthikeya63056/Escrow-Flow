import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProjects } from "../../hooks/useProjects";
import { Button } from "../common/Button";
import { PROJECT_CATEGORIES } from "../../lib/constants";

const milestoneSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.number().min(1, "Amount must be at least $1"),
});

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be detailed"),
  category: z.string().min(1, "Category is required"),
  budget: z.number().min(1, "Budget is required"),
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required")
    .max(10, "Max 10 milestones allowed"),
});

export function CreateProjectForm({ onSuccess }) {
  const { createProject, loading } = useProjects();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      budget: 0,
      milestones: [{ title: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  const milestonesWatch = watch("milestones");
  const budgetWatch = watch("budget");
  const totalMilestoneAmount = milestonesWatch.reduce(
    (sum, m) => sum + (Number(m.amount) || 0),
    0
  );

  const onSubmit = async (data) => {
    if (totalMilestoneAmount !== data.budget) {
      setErrorMsg("Milestone amounts must equal total budget.");
      return;
    }
    setErrorMsg("");

    const projectData = {
      title: data.title,
      description: data.description,
      budget: data.budget,
      tags: [data.category],
    };

    const res = await createProject(projectData, data.milestones);
    if (res.success) {
      if (onSuccess) onSuccess(res.project);
    } else {
      setErrorMsg(res.error || "Failed to create project.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Project Title</label>
          <input
            {...register("title")}
            className="w-full bg-darkBg border border-white/10 rounded p-2 text-white focus:border-neonBlue focus:outline-none transition-colors"
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            {...register("category")}
            className="w-full bg-darkBg border border-white/10 rounded p-2 text-white focus:border-neonBlue focus:outline-none transition-colors"
          >
            <option value="">Select a Category</option>
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full bg-darkBg border border-white/10 rounded p-2 text-white focus:border-neonBlue focus:outline-none transition-colors"
          ></textarea>
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Total Budget ($)</label>
          <input
            type="number"
            {...register("budget", { valueAsNumber: true })}
            className="w-full bg-darkBg border border-white/10 rounded p-2 text-white focus:border-neonBlue focus:outline-none transition-colors"
          />
          {errors.budget && (
            <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Milestones</h3>
          <span
            className={`text-sm font-medium ${
              totalMilestoneAmount === budgetWatch
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            ${totalMilestoneAmount} / ${budgetWatch || 0}
          </span>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 mb-4 items-start bg-white/5 p-4 rounded-lg"
          >
            <div className="flex-1 space-y-2">
              <input
                {...register(`milestones.${index}.title`)}
                placeholder="Milestone Title"
                className="w-full bg-darkBg border border-white/10 rounded p-2 text-sm text-white focus:border-neonBlue focus:outline-none transition-colors"
              />
              {errors.milestones?.[index]?.title && (
                <p className="text-red-400 text-xs">
                  {errors.milestones[index].title.message}
                </p>
              )}
            </div>
            <div className="w-32 space-y-2">
              <input
                type="number"
                {...register(`milestones.${index}.amount`, { valueAsNumber: true })}
                placeholder="$ Amount"
                className="w-full bg-darkBg border border-white/10 rounded p-2 text-sm text-white focus:border-neonBlue focus:outline-none transition-colors"
              />
              {errors.milestones?.[index]?.amount && (
                <p className="text-red-400 text-xs">
                  {errors.milestones[index].amount.message}
                </p>
              )}
            </div>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {fields.length < 10 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ title: "", amount: 0 })}
          >
            + Add Milestone
          </Button>
        )}
      </div>

      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <Button type="submit" className="w-full" isLoading={loading}>
        Create Project
      </Button>
    </form>
  );
}
