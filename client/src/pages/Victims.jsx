import { useEffect, useState, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import VictimTable from '../components/VictimTable';
import { getPostings, getTopGroups } from '../api/client';

export default function Victims() {
  const { search } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    group: searchParams.get('group') || undefined,
  });
  const [page, setPage] = useState(1);
  const [postings, setPostings] = useState({ results: [], total: 0, limit: 25 });
  const [groupOptions, setGroupOptions] = useState([]);

 const buildExportUrl = (format) => {
  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  const params = new URLSearchParams({ ...cleaned, format });
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/postings/export?${params}`;
};
  useEffect(() => {
    getTopGroups(50).then((groups) => setGroupOptions(groups.map((g) => g.group)));
  }, []);

  const loadPostings = useCallback(() => {
    getPostings({ ...filters, page, limit: 25 }).then(setPostings);
  }, [filters, page]);

  useEffect(() => { loadPostings(); }, [loadPostings]);

  useEffect(() => {
    setSearchParams(filters.group ? { group: filters.group } : {}, { replace: true });
  }, [filters.group]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = postings.results.filter((p) =>
    search
      ? (p.post_title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.group_name || '').toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <>
        <div className="export-bar mono">
    <a href={buildExportUrl('csv')} className="export-btn">Export CSV</a>
    <a href={buildExportUrl('json')} className="export-btn">Export JSON</a>
    </div>
      <FilterBar
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        groupOptions={groupOptions}
      />
      <VictimTable
        postings={visible}
        total={postings.total}
        page={postings.page || page}
        limit={postings.limit || 25}
        onPageChange={setPage}
      />
    </>
  );
}