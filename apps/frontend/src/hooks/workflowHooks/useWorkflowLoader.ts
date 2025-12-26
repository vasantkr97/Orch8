import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowById } from '../../services/workflow.service';
import { getNodeConfig } from '../../components/nodes/nodeTypes';

interface UseWorkflowLoaderProps {
  setWorkflowId: (id: string | null) => void;
  setWorkflowTitle: (title: string) => void;
  setIsWorkflowActive: (active: boolean) => void;
  setNodes: any;
  setEdges: any;
  setIsLoadingWorkflow: (loading: boolean) => void;
}

const STORAGE_PREFIX = 'orch8_workflow_';

export const useWorkflowLoader = ({
  setWorkflowId,
  setWorkflowTitle,
  setIsWorkflowActive,
  setNodes,
  setEdges,
  setIsLoadingWorkflow
}: UseWorkflowLoaderProps) => {
  const { id: urlWorkflowId } = useParams<{ id: string }>();

  useEffect(() => {
    const loadWorkflow = async () => {
      if (!urlWorkflowId) {
        setIsLoadingWorkflow(false);
        return;
      }

      // Try Local Storage FIRST for instant load
      const storageKey = `${STORAGE_PREFIX}${urlWorkflowId}`;
      let loadedFromStorage = false;

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            // Only use if it matches the requested ID and has valid nodes array
            if (data.workflowId === urlWorkflowId && Array.isArray(data.nodes)) {
              
              // Validate nodes before setting
              const validNodes = data.nodes.filter((n: any) => n && n.id && n.type);
              
              setWorkflowId(data.workflowId);
              setWorkflowTitle(data.workflowTitle);
              setIsWorkflowActive(data.isWorkflowActive);
              setNodes(validNodes);
              setEdges(data.edges || []);
              
              loadedFromStorage = true;
            }
          } catch (parseErr) {
            console.error('error parsing local storage data, clearing cache:', parseErr);
            localStorage.removeItem(storageKey);
          }
        }
      } catch (e) {
        console.error('error checking localStorage:', e);
      }


      if (!loadedFromStorage) {
        setIsLoadingWorkflow(true);
      } else {
        return; 
      }

      // Fallback: Fetch from API
      try {
        console.log('Fetching workflow from API:', urlWorkflowId);

        const response = await getWorkflowById(urlWorkflowId);
        const wf = response.data;

        if (!wf) {
          console.error('no workflow data received');
          return;
        }

        setWorkflowId(wf.id);
        setWorkflowTitle(wf.title || 'Untitled Workflow');
        setIsWorkflowActive(wf.isActive || false);

        // Robust Node Mapping
        const mappedNodes = (wf.nodes || []).map((n: any, idx: number) => {
          try {
            if (!n) return null;

            const type = (n.type || '').toLowerCase();
            const cfg = getNodeConfig(type) || { label: 'Unknown Node' }; 
            const id = n.id || n.name || `node-${idx}`;
            const position = Array.isArray(n.position)
              ? { x: n.position[0], y: n.position[1] }
              : { x: 0, y: idx * 120 };

            return {
              id,
              type,
              position,
              data: {
                ...cfg,
                type,
                label: n.name || cfg.label || 'Node',
                parameters: n.parameters || {},
                credentialsId: n.credentials?.id,
                workflowId: wf.id,
                ...(type === 'webhook' && { webhookToken: wf.webhookToken }),
              },
            };
          } catch (err) {
            console.warn('Skipping invalid node:', n, err);
            return null;
          }
        }).filter(Boolean); // Remove nulls

        const mappedEdges = (wf.connections || []).map((c: any, idx: number) => ({
          id: `${c.source}-${c.target}-${idx}`,
          source: c.source,
          target: c.target,
          type: 'orch8-edge',
          data: { itemCount: 1 },
        }));

        setNodes(mappedNodes);
        setEdges(mappedEdges);

      } catch (error: any) {
        console.error('Error loading workflow:', error);
        if (!loadedFromStorage) {
          setWorkflowId(null);
          setWorkflowTitle('Error Loading Workflow');
          setNodes([]);
          setEdges([]);
        }
      } finally {
        setIsLoadingWorkflow(false);
      }
    };

    loadWorkflow();
  }, [urlWorkflowId]);
};
