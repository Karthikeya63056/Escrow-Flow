import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { Loader } from "../components/common/Loader";
import { EscrowProgress } from "../components/projects/EscrowProgress";
import { MilestoneList } from "../components/projects/MilestoneList";
import { ProposalForm } from "../components/projects/ProposalForm";
import { formatCurrency } from "../lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function ProjectDetail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { getProjectDetails, loading } = useProjects();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      getProjectDetails(id).then((data) => setProject(data));
    }
  }, [id, getProjectDetails]);

  const handleProposalSubmit = async (data) => {
    toast.success("Proposal submitted successfully!");
  };

  if (loading && !project) return <Loader />;

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-300">Project not found</h2>
        <Link to="/dashboard" className="text-neonBlue mt-4 inline-block hover:text-cyan-400">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const isClient = profile?.id === project.client_id;
  const isFreelancer = profile?.role === "freelancer";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-neonBlue mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-gray-400">By {project.profiles?.full_name || "Client"}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
            {formatCurrency(project.budget || 0)}
          </p>
          <span
            className={`text-xs uppercase tracking-wide px-2 py-1 rounded-full ${
              project.status === "open"
                ? "bg-green-500/20 text-green-400"
                : project.status === "in_progress"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="glass-panel p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-300 whitespace-pre-wrap">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Escrow Progress */}
      <EscrowProgress project={project} milestones={project.milestones || []} />

      {/* Milestones + Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <MilestoneList
            milestones={project.milestones || []}
            isClient={isClient}
            clientId={project.client_id}
            freelancerId={
              project.proposals?.find((p) => p.status === "accepted")?.freelancer_id ||
              "mock-freelancer"
            }
          />
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/5">
          {isClient ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Proposals</h3>
              {!project.proposals || project.proposals.length === 0 ? (
                <p className="text-gray-500 text-sm">No proposals yet.</p>
              ) : (
                <div className="space-y-4">
                  {project.proposals.map((p) => (
                    <div
                      key={p.id}
                      className="border border-white/10 bg-darkBg p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-white">
                          {p.profiles?.full_name || "Freelancer"}
                        </p>
                        <span className="text-neonBlue font-medium">
                          {formatCurrency(p.proposed_budget)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{p.cover_letter}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isFreelancer && project.status === "open" ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Submit Proposal</h3>
              <ProposalForm
                projectBudget={project.budget}
                onSubmitForm={handleProposalSubmit}
              />
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>Project details are view-only for your current role.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
