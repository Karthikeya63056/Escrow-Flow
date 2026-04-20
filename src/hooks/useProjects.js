import { useState, useCallback } from "react";
import { supabase, isMockMode } from "../lib/supabase";

const MOCK_PROJECTS = [
  {
    id: "mock-1",
    title: "E-Commerce React Dashboard",
    description: "Build a modern e-commerce dashboard with analytics, product management, and order tracking. Must include charts, responsive tables, and dark mode.",
    budget: 3500,
    status: "open",
    escrow_balance: 3500,
    tags: ["Web Development"],
    client_id: "mock-user-123",
    created_at: new Date().toISOString(),
    profiles: { full_name: "Mock Client", avatar_url: null },
  },
  {
    id: "mock-2",
    title: "Mobile App UI/UX Redesign",
    description: "Redesign the existing fitness tracking mobile app. Need new color palette, improved navigation, and accessibility compliance.",
    budget: 2000,
    status: "open",
    escrow_balance: 0,
    tags: ["UI/UX Design"],
    client_id: "mock-user-123",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { full_name: "Mock Client", avatar_url: null },
  },
  {
    id: "mock-3",
    title: "Technical Blog Content Writing",
    description: "Write 10 in-depth technical articles about React, Node.js, and cloud architecture. Each article should be 1500-2000 words with code examples.",
    budget: 1200,
    status: "open",
    escrow_balance: 1200,
    tags: ["Content Writing"],
    client_id: "mock-user-456",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    profiles: { full_name: "Jane Smith", avatar_url: null },
  },
];

const MOCK_PROJECT_DETAIL = (projectId) => {
  const base = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  return {
    ...base,
    milestones: [
      { id: "m1", title: "Wireframes & Design System", amount: Math.round(base.budget * 0.3), status: "approved", order: 1 },
      { id: "m2", title: "Core Feature Development", amount: Math.round(base.budget * 0.5), status: "submitted", order: 2 },
      { id: "m3", title: "Testing & Launch", amount: base.budget - Math.round(base.budget * 0.3) - Math.round(base.budget * 0.5), status: "pending", order: 3 },
    ],
    proposals: [
      {
        id: "prop-1",
        freelancer_id: "fl-1",
        cover_letter: "I have 5 years of experience building production React apps. I'd love to take this on!",
        proposed_budget: base.budget,
        status: "pending",
        profiles: { full_name: "Alex Dev", avatar_url: null },
      },
    ],
  };
};

export function useProjects() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (isMockMode) {
        await new Promise((r) => setTimeout(r, 400));
        let results = [...MOCK_PROJECTS];
        if (filters.status) results = results.filter((p) => p.status === filters.status);
        if (filters.clientId) results = results.filter((p) => p.client_id === filters.clientId);
        if (filters.category) results = results.filter((p) => p.tags?.includes(filters.category));
        return results;
      }

      let query = supabase.from("projects").select("*, profiles(full_name, avatar_url)");

      if (filters.status) query = query.eq("status", filters.status);
      if (filters.clientId) query = query.eq("client_id", filters.clientId);
      if (filters.category) query = query.contains("tags", [filters.category]);

      const { data, error: err } = await query;
      if (err) throw err;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData, milestones) => {
    setLoading(true);
    setError(null);
    try {
      if (isMockMode) {
        await new Promise((r) => setTimeout(r, 1000));
        const newProject = {
          ...projectData,
          id: "mock-" + Date.now(),
          status: "open",
          escrow_balance: 0,
          created_at: new Date().toISOString(),
        };
        MOCK_PROJECTS.unshift(newProject);
        return { success: true, project: newProject };
      }

      const { data: project, error: pErr } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (pErr) throw pErr;

      const milestonesWithProjectId = milestones.map((m, i) => ({
        ...m,
        project_id: project.id,
        order: i + 1,
      }));

      const { error: mErr } = await supabase.from("milestones").insert(milestonesWithProjectId);

      if (mErr) throw mErr;
      return { success: true, project };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getProjectDetails = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      if (isMockMode) {
        await new Promise((r) => setTimeout(r, 400));
        return MOCK_PROJECT_DETAIL(projectId);
      }

      const { data: project, error: pErr } = await supabase
        .from("projects")
        .select("*, profiles(full_name, avatar_url, role)")
        .eq("id", projectId)
        .single();

      if (pErr) throw pErr;

      const { data: milestones, error: mErr } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("order", { ascending: true });

      if (mErr) throw mErr;

      const { data: proposals, error: propErr } = await supabase
        .from("proposals")
        .select("*, profiles(full_name, avatar_url)")
        .eq("project_id", projectId);

      if (propErr) throw propErr;

      return { ...project, milestones: milestones || [], proposals: proposals || [] };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchProjects, createProject, getProjectDetails };
}
