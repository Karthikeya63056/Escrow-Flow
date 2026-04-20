import { useEffect, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { Loader } from "../components/common/Loader";
import { ProjectCard } from "../components/projects/ProjectCard";
import { PROJECT_CATEGORIES } from "../lib/constants";

export function Projects() {
  const { fetchProjects, loading } = useProjects();
  const [projects, setProjects] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadProjects();
  }, [categoryFilter]);

  const loadProjects = async () => {
    const filters = { status: 'open' };
    if (categoryFilter) filters.category = categoryFilter;
    const data = await fetchProjects(filters);
    setProjects(data);
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Find Work</h1>
        <select 
          className="bg-darkBg border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {PROJECT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="glass-panel p-6 text-center rounded-xl border border-white/5 min-h-[300px] flex flex-col justify-center items-center">
          <span className="text-4xl mb-4 opacity-50">🔍</span>
          <h3 className="text-xl font-medium text-gray-300 mb-2">No projects found</h3>
          <p className="text-gray-500">Check back later or try removing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
