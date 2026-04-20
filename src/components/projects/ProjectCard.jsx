import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Card } from "../common/Card";

export function ProjectCard({ project }) {
  return (
    <Card hoverEffect className="flex flex-col h-full border border-white/5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1">{project.title}</h3>
          <p className="text-sm text-gray-500 mt-1">By {project.profiles?.full_name || 'Client'}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
            {formatCurrency(project.budget || 0)}
          </p>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 flex-1 line-clamp-3 mb-4">
        {project.description}
      </p>

      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {formatDate(project.created_at)}
        </span>
        <Link 
          to={`/projects/${project.id}`}
          className="text-sm font-medium text-neonBlue hover:text-cyan-400 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </Card>
  );
}
