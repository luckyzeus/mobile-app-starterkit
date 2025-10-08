import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { data } from '../switchboard';

export const useMe = (uid?: string | null) =>
  useQuery({ queryKey: ['me', uid], queryFn: () => (uid ? data.me(uid) : null), enabled: !!uid });

export const useUpsertUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (doc: any) => data.upsertUser(doc),
    onSuccess: (_res, doc: any) => {
      qc.invalidateQueries({ queryKey: ['me', doc.uid] });
    }
  });
};
