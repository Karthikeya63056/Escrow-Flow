import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { Loader } from "../components/common/Loader";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { CreateProjectForm } from "../components/projects/CreateProjectForm";
import { ProjectCard } from "../components/projects/ProjectCard";
import { Modal } from "../components/common/Modal";
import { motion } from "framer-motion";
import { formatCurrency } from "../lib/utils";

export function Dashboard() {
  const { profile } = useAuth();
  const { fetchProjects, loading } = useProjects();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!profile) return;
    const filter = profile.role === "client" ? { clientId: profile.id } : {};
    const data = await fetchProjects(filter);
    setProjects(data);
  }, [profile, fetchProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleProjectCreated = () => {
    setIsModalOpen(false);
    loadProjects();
  };

  const totalEscrow = projects.reduce((acc, p) => acc + (p.escrow_balance || 0), 0);

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8"
      >
        <h1 className="text-3xl font-bold mb-8">
          Welcome back,{" "}
          <span className="text-neonBlue">
            {profile?.full_name?.split(" ")[0] || "User"}
          </span>
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-xl border border-white/5 shadow-[0_0_15px_rgba(0,243,255,0.1)]"
          >
            <h3 className="text-gray-400 text-sm font-medium">Active Projects</h3>
            <p className="text-3xl font-bold mt-2">{projects.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl border border-white/5"
          >
            <h3 className="text-gray-400 text-sm font-medium">Total Escrow Vault</h3>
            <p className="text-3xl font-bold mt-2 text-neonPurple">
              {formatCurrency(totalEscrow)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-xl border border-white/5"
          >
            <h3 className="text-gray-400 text-sm font-medium">Ghosting Score</h3>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {profile?.ghosting_score || 0}%
            </p>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            {profile?.role === "client" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-neonBlue text-darkBg px-6 py-2 rounded-md font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,243,255,0.4)]"
              >
                + Create Project
              </button>
            )}
          </div>

          {loading ? (
            <Loader />
          ) : projects.length === 0 ? (
            <div className="glass-panel p-8 rounded-xl border border-white/5 text-center text-gray-400 min-h-[200px] flex flex-col justify-center items-center">
              <span className="text-4xl mb-4 opacity-50">📂</span>
              <p>No active projects found.</p>
              {profile?.role === "client" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-neonBlue hover:text-cyan-400 font-medium"
                >
                  Create your first project →
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Project"
        >
          <CreateProjectForm onSuccess={handleProjectCreated} />
        </Modal>
      </motion.div>
    </ErrorBoundary>
  );
}
